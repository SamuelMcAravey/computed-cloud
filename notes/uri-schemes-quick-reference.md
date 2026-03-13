# URI Schemes Quick Reference

Short version: `mailto:` opens an email client, and `tel:` starts a phone call or opens the device's calling flow.

## Most useful URI schemes

- `http:` / `https:` - Normal web links.
- `mailto:` - Opens an email draft in the user's mail app.
- `tel:` - Starts a phone call or hands the number to the dialer.
- `sms:` - Opens the text messaging app with a recipient, and sometimes a prefilled body.
- `file:` - Points to a local or network file.
- `data:` - Embeds data directly in the URI itself.
- `ws:` / `wss:` - WebSocket endpoints.
- `geo:` - Opens a map or location-aware app on supported devices.
- `urn:` - Names a resource without saying where to fetch it from.

## Quick distinction

`mailto:` is for composing email:

```text
mailto:support@example.com?subject=Help
```

`tel:` is for phone numbers:

```text
tel:+14065551212
```

If you only remember one thing: `mailto:` is "start an email", and `tel:` is "hand this number to the phone app".

## Common examples

```text
https://example.com/docs
mailto:support@example.com?subject=Help
tel:+14065551212
sms:+14065551212?body=Hello
geo:45.7833,-108.5007
file:///C:/Users/Samuel/Documents/note.pdf
data:text/plain,Hello%20world
wss://example.com/socket
urn:isbn:9780141036144
```

## Practical notes

- For user-facing links in web apps and documents, `https:`, `mailto:`, and `tel:` are the ones you will use most.
- `sms:` and `geo:` are useful on phones, but support can vary more by platform and app.
- `data:` is handy for small embedded payloads, but it is usually more of a programming tool than a content-authoring tool.
- `javascript:` exists, but it is generally discouraged for links because of security, accessibility, and maintainability concerns.
- `blob:` is useful in browser code, but not usually worth listing in a general-purpose note unless you are writing frontend code.
- `ftp:` still exists in the registry, but browser support has been reduced. Treat it as legacy for normal web use.

## Where to look things up

- MDN is the useful browser-focused list: <https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes>
- IANA is the official registry: <https://www.iana.org/assignments/uri-schemes/uri-schemes.xhtml>
