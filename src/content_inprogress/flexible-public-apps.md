---
title: "Docker, ZeroTier, and Cloudflared on an LXC Host"
description: "A repeatable NAT configuration to allow Docker containers to reach a ZeroTier overlay network for backchannel database connections."
pubDate: 2026-01-17
tags: ["docker", "zerotier", "networking", "proxmox", "lxc", "cloudflared", "operations"]
draft: false
---

# Running ZeroTier alongside a Docker Compose stack in a Proxmox LXC (and keeping Cloudflared working)

This document summarizes the final working setup we landed on:

- **Cloudflared** stays in Docker and reaches the app over a shared Docker network.
- **ZeroTier** runs on the LXC host (inside the container OS), not inside Docker.
- We add a small, repeatable **NAT/forwarding shim** so Docker containers can reach services over ZeroTier (e.g., Azure SQL over a ZeroTier backchannel).
- We keep it **repeatable** and **boot-safe** using a script + systemd unit, instead of ad-hoc manual iptables commands.

---

## Goals and constraints

### What we needed
1. **Ingress:** Cloudflare Tunnel (cloudflared container) must be able to reach `app1` on `:8080` inside Docker.
2. **Backchannel:** `app1` must be able to reach an Azure SQL database over **ZeroTier**.
3. **Simple to reason about / repeatable:** Avoid “random iptables tinkering” that’s hard to reproduce across nodes or after reboots.

### The key design decision
We did **not** switch the app container to `network_mode: host` because that would complicate the Cloudflared → app container path (you’d need to change tunnel origin, deal with host ports, etc.).

Instead:
- Keep Docker networking the same for ingress and internal connectivity.
- Add a minimal, controlled routing/NAT path from Docker → ZeroTier only for outbound backchannel traffic.

---

## Architecture overview

**Inside the LXC:**
- Docker Compose runs:
  - `app1` (listens on `8080` inside Docker)
  - `cloudflared` (in the same Docker network as `app1`)
  - `portainer-agent` (optional / unrelated to ZeroTier)

**Also inside the LXC:**
- ZeroTier runs as a system service (`zerotier-one`), creating a `zt*` network interface.

**Bridge between them:**
- Docker containers typically live on private subnets like `172.17.0.0/16`.
- ZeroTier traffic egresses via the `zt*` interface.
- We add a NAT + forwarding rule so containers can route out via ZeroTier.

---

## Why the LXC needed special settings (privileged + TUN)

### The core requirement: `/dev/net/tun`
ZeroTier needs access to a **TUN/TAP** device to create its virtual network interface. Without it, `zerotier-one` may “run” but it cannot create the `zt*` interface.

The failure looks like:
- `could not open TUN/TAP device: No such file or directory`
- and you never get a `zt*` interface.

### What we did
- The LXC was **privileged** (accidentally, but it reduced friction).
- We ensured the container had access to `/dev/net/tun` (either by privileged defaults or by explicit config).

> Note: You *can* make this work in an unprivileged container, but it’s more finicky (cgroup/device permissions, AppArmor profile tweaks, etc.). For an internal setup, privileged was an acceptable tradeoff for simplicity.

---

## Step-by-step setup

### 1) Provision the LXC for Docker and ZeroTier
**Inside the LXC:**
- Install Docker (and docker compose plugin if needed).
- Your app stack stays in Docker Compose.

### 2) Install ZeroTier on the LXC OS (not in Docker)
We installed ZeroTier directly in the LXC so:
- The node has a clear ZeroTier identity.
- The `zt*` interface exists at the OS level.
- Docker containers can reach it through normal routing/NAT.

Commands (inside LXC):
```bash
curl -s https://install.zerotier.com | sudo bash
sudo systemctl enable --now zerotier-one
sudo zerotier-cli join <NETWORK_ID>
sudo zerotier-cli status
sudo zerotier-cli listnetworks
````

Verify the interface exists:

```bash
ip -o link show | grep '^.*: zt' || true
```

### 3) Keep Cloudflared and the app on the same Docker network

Your compose file already had the right idea:

* `cloudflared` and `app1` share the external Docker network `edge`.
* Cloudflared should reach the origin as `http://app1:8080` (or `http://pw_app1:8080`).

Important note:

* `expose: ["8080"]` is *not* what makes it reachable; being on the same Docker network is.
* `expose` is still fine as documentation.

### 4) Bridge Docker → ZeroTier with a repeatable NAT/forward shim

This is where the “gap” was.

#### Why is this needed?

Docker’s bridge networks (172.17/16, 172.18/16, etc.) are private. Containers can reach “normal” network destinations because Docker adds its own NAT rules for default egress, but it does **not** automatically ensure traffic destined for ZeroTier routes correctly.

By adding a rule that specifically says:

* “When traffic originates from Docker subnet(s) and goes out the ZeroTier interface, MASQUERADE it”

…containers can reach ZeroTier peers reliably.

#### Why did we create `docker-zerotier-nat.sh`?

Because manual iptables edits are:

* easy to forget
* easy to break
* not reproducible across nodes
* not reliable after restarts

Instead, the script:

* detects the active Docker subnet
* detects the ZeroTier interface (`zt*`)
* enables IP forwarding
* applies iptables rules **idempotently** (“add if missing”)
* can be executed manually and also at boot (via systemd)

---

## The final NAT script

File: `/usr/local/sbin/docker-zerotier-nat.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

log() { echo "[docker-zerotier-nat] $*"; }

# Wait for docker
for i in {1..30}; do
  docker info >/dev/null 2>&1 && break
  sleep 1
done
docker info >/dev/null 2>&1 || { log "Docker not ready"; exit 1; }

DOCKER_SUBNET="$(docker network inspect bridge --format '{{(index .IPAM.Config 0).Subnet}}' 2>/dev/null || true)"
[[ -n "${DOCKER_SUBNET}" ]] || { log "Could not detect Docker bridge subnet"; exit 1; }

# Wait for zerotier interface
for i in {1..30}; do
  ZT_IF="$(ip -o link show | awk -F': ' '{print $2}' | grep '^zt' | head -n1 || true)"
  [[ -n "${ZT_IF}" ]] && break
  sleep 1
done
[[ -n "${ZT_IF}" ]] || { log "No ZeroTier interface found (zt*)"; exit 1; }

sysctl -w net.ipv4.ip_forward=1 >/dev/null

log "Using DOCKER_SUBNET=${DOCKER_SUBNET} ZT_IF=${ZT_IF}"

# NAT docker subnet out zerotier
iptables -t nat -C POSTROUTING -s "${DOCKER_SUBNET}" -o "${ZT_IF}" -j MASQUERADE 2>/dev/null \
  || iptables -t nat -A POSTROUTING -s "${DOCKER_SUBNET}" -o "${ZT_IF}" -j MASQUERADE

# Allow forwarding via DOCKER-USER (docker evaluates this chain early)
iptables -C DOCKER-USER -s "${DOCKER_SUBNET}" -o "${ZT_IF}" -j ACCEPT 2>/dev/null \
  || iptables -A DOCKER-USER -s "${DOCKER_SUBNET}" -o "${ZT_IF}" -j ACCEPT

iptables -C DOCKER-USER -d "${DOCKER_SUBNET}" -i "${ZT_IF}" -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT 2>/dev/null \
  || iptables -A DOCKER-USER -d "${DOCKER_SUBNET}" -i "${ZT_IF}" -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT

log "Rules applied"
```

Install:

```bash
sudo chmod +x /usr/local/sbin/docker-zerotier-nat.sh
```

---

## Boot-time automation via systemd

#### Why systemd?

We needed the NAT rules to survive reboots and recover from ordering/timing issues.

Early on we saw:

* ZeroTier service “running” but no `zt*` interface yet (because TUN wasn’t available / join not complete)
* The NAT script running before `zt*` existed

So the unit runs after docker/zerotier and the script includes small waits.

File: `/etc/systemd/system/docker-zerotier-nat.service`

```ini
[Unit]
Description=Enable Docker -> ZeroTier NAT
After=docker.service zerotier-one.service network-online.target
Wants=docker.service zerotier-one.service network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/docker-zerotier-nat.sh
RemainAfterExit=yes
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now docker-zerotier-nat.service
```

---

## Docker Compose (what changed / what didn’t)

### What did NOT need to change

Your compose structure is correct for ingress.

* `cloudflared` and `app1` share the `edge` network
* Cloudflared can hit the app by Docker DNS name: `http://app1:8080`

### The key rule for Cloudflared origin

Cloudflared should point to:

* `http://app1:8080` (service name) or
* `http://pw_app1:8080` (container name)

**Not**:

* `http://localhost:8080` (that would mean “inside cloudflared container”)

---

## Verification checklist

### ZeroTier health

```bash
sudo systemctl status zerotier-one --no-pager
sudo zerotier-cli status
sudo zerotier-cli listnetworks
ip -o link show | grep '^.*: zt'
```

### NAT rules present

```bash
sudo iptables -t nat -L POSTROUTING -n | grep zt || true
sudo iptables -S DOCKER-USER
```

### Cloudflared can reach the app over Docker network

```bash
docker exec -it cloudflared sh -lc 'wget -S -O- http://app1:8080/ 2>&1 | head -n 30'
```

### App can reach Azure SQL over ZeroTier

From inside the app container, test TCP reachability (tooling varies by image):

```bash
docker exec -it pw_app1 sh -lc 'nc -vz <your-azure-sql-hostname> 1433 || true'
```

---

## Summary: what was required

1. **LXC container capable of TUN/TAP**

   * Privileged container simplified this.
   * ZeroTier needs `/dev/net/tun` to create `zt*`.

2. **Docker running inside the LXC**

   * The app stack remains in Compose.
   * Cloudflared ingress stays clean and local to Docker networks.

3. **ZeroTier installed directly on the LXC OS**

   * Not run in Docker.
   * Provides a stable node-level overlay interface (`zt*`).

4. **A small scripted NAT/forward bridge from Docker → ZeroTier**

   * Implemented as `docker-zerotier-nat.sh` + a systemd unit.
   * Makes the configuration repeatable, boot-safe, and easy to reproduce.

5. **Minimal/no changes for Cloudflared**

   * As long as cloudflared targets `http://app1:8080` on the shared Docker network, it works.
   * The ZeroTier work is strictly for outbound backchannel traffic from the app.

---
