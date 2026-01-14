# AstroFlow - Logistics & Manufacturing Website Template

A modern, professional Astro.js template for logistics, manufacturing, and supply chain companies. Built with React, Tailwind CSS, and TypeScript.

![Astro](https://img.shields.io/badge/Astro-5.16.0-FF5D01?logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-38B2AC?logo=tailwind-css&logoColor=white)

## 🖼️ Preview

### Website Screenshot
<img alt="AstroFlow Website Preview" src="./public/AstroFlow - Astrojs Logistics & Manufacturing Website Template.png" />

### Performance & Speed
<img alt="Performance Metrics" src="./public/speed-metrics.png" />

## ✨ Features

- 🚀 **Built with Astro** - Fast, modern static site generation
- ⚛️ **React Components** - Interactive components with React
- 🎨 **Tailwind CSS 4** - Modern utility-first styling
- 📱 **Fully Responsive** - Mobile-first design
- ♿ **Accessible** - Built with accessibility in mind
- 🎯 **SEO Optimized** - Meta tags and semantic HTML
- 🎭 **Smooth Animations** - Powered by Motion library
- 🎨 **Modern UI** - Beautiful gradient designs and components

## 📦 Pages Included

- **Home** - Hero, split sections, feature grid, CTA
- **Services** - Service overview and CTA
- **About** - Company story and testimonials
- **Contact** - Contact details and inquiry form

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/astroflow.git
cd astroflow
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:4321](http://localhost:4321) in your browser

## 🧾 Populating Content

### Single source of truth

Update `src/data/site.ts` with all business data, page copy, nav links, CTAs, footer text, social links, and contact form labels. Keep the canonical routes (`/`, `/services`, `/about`, `/contact`) unless you add new pages.

### Images

Replace the placeholder images in `public/images/` and `public/images/sections/`. Keep the filenames or update the `image.src` paths in `src/data/site.ts` to match your assets. Provide clear `alt` text for each image.

### Client intake checklist

- Business basics: name, tagline, short description, phone, email, address, service area.
- Branding: primary and accent colors (hex values).
- Fonts: brand fonts (files or Google Fonts names + weights).
- Services: list of services with 1-2 sentence descriptions and preferred order.
- Home page: hero headline/subheadline/CTAs, split section copy, feature grid items, CTA banner copy.
- Services page: hero copy, intro copy, services grid items, CTA banner copy.
- About page: hero copy, split section copy, story copy, testimonials (name + quote), CTA banner copy.
- Contact page: hero copy, contact card labels, form headline/body/notice/success message/consent text, industry options, service options, timeline options.
- Footer: short description, quick links, service links, legal links, copyright name.
- Social profiles: LinkedIn, Facebook, Instagram, YouTube, X (as applicable).
- Images: hero + section images with usage rights and alt text.

### Client questions to ask

- What is the primary action you want visitors to take (call, request info, schedule a visit, etc.)?
- What are your top 3-6 services and how would you describe each in one sentence?
- What geographic areas do you serve, and do you have any service limitations?
- Do you have brand colors or a style guide (provide hex values)?
- Which photos should we use for hero/sections, and do you have usage rights + preferred captions/alt text?
- Do you have testimonials we can publish (name, company, quote), or should we anonymize?
- Do you have a privacy policy/terms link or specific consent language for the contact form?
- Are there specific industries/options we should list in the contact form?

### Codex prompt (after info is collected)

Use this prompt once the client provides content and assets:

```text
Update the site content using the data below.
Requirements:
- Edit only `src/data/site.ts` and keep all content centralized there.
- Do not hard-code business data in pages/components.
- Keep routes `/`, `/services`, `/about`, `/contact` unchanged.
- Update image paths to match assets under `public/images` and ensure alt text is accurate.
- Keep the design and layout stable; no new frameworks or heavy JS.
- If any required info is missing, list the gaps as questions.

Client data:
[PASTE BUSINESS NAME, TAGLINE, CONTACT INFO, ADDRESS, SERVICE AREA]
[PASTE BRAND COLORS (HEX)]
[PASTE SERVICES + DESCRIPTIONS]
[PASTE HOME/SERVICES/ABOUT/CONTACT COPY + CTA LABELS]
[PASTE FOOTER + SOCIAL LINKS]
[PASTE FORM LABELS/OPTIONS + CONSENT TEXT]
[PASTE IMAGE FILENAMES + ALT TEXT]
```

### Form Integration

The RFQ form (`src/components/react/RFQForm.tsx`) currently logs form data to the console. To integrate with a backend:

1. **Option 1: Form Service** (Recommended for static sites)
   - Use [Formspree](https://formspree.io/), [Netlify Forms](https://www.netlify.com/products/forms/), or similar
   - Update the `handleSubmit` function in `RFQForm.tsx`

2. **Option 2: Custom API**
   - Create an API endpoint
   - Update the form submission handler

Example with Formspree:
```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  
  const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  });
  
  if (response.ok) {
    // Show success message
  }
};
```

## 🛠️ Available Scripts

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:4321`     |
| `npm run build`        | Build your production site to `./dist/`         |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |

## 📁 Project Structure

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/          # Images and static assets
│   ├── components/      # Reusable components
│   │   ├── home/        # Home page components
│   │   ├── react/       # React interactive components
│   │   └── ui/          # UI components
│   ├── data/            # Site content and business info
│   ├── config/          # Configuration files
│   ├── layouts/         # Page layouts
│   ├── pages/           # Astro pages (routes)
│   ├── styles/          # Global styles
│   └── utils/           # Utility functions
├── astro.config.mjs     # Astro configuration
├── package.json
└── tsconfig.json
```

## 🎨 Customization

### Colors

The template uses theme tokens. Customize colors, radius, typography, shadows, and background in `site.theme` (for example, `src/data/site.ts` or template-specific data files).

### Fonts (Self-Hosted)

Fonts are self-hosted by default. Add font files under `public/fonts/` and define them in `site.theme.fonts`, then point `site.theme.typography` at the families.

You can download Google Fonts with the helper script (manual, not part of the build):

```powershell
pwsh ./scripts/fetch-fonts.ps1 -Family "Manrope" -Weights 400,500,600
pwsh ./scripts/fetch-fonts.ps1 -Family "Fraunces" -Weights 600,700
```

The script downloads WOFF2 files to `public/fonts/<family>/` and prints a `site.theme.fonts` + `site.theme.preloadFonts` snippet to paste into `src/data/site.ts`.

### Theme Presets

Sample theme presets live in `src/data/themes.ts` for VendorHub, Rixian, Pearl Bakery, Incursa, Trades, Medical, Law Firm, and Studio. Import a preset and set `theme: presetName` to start.

Preview the presets at `/theme-preview` to compare palettes, radius, typography, and footer tones.

### Images

Replace placeholder images in `public/images/` and `public/images/sections/` with your own. The template includes stock photos as placeholders.

### Content

- Update business info, page copy, nav, CTAs, and footer data in `src/data/site.ts`
- Update contact form labels and options in `src/data/site.ts`

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with your static site.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/astroflow)

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/astroflow)

### Other Platforms

The `dist/` folder can be deployed to any static hosting service:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Any static hosting provider

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/astroflow/issues).

## ⭐ Show Your Support

If you find this template useful, please give it a star on GitHub!

## 📧 Support

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using [Astro](https://astro.build)
