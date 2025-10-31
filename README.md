# Professor Town

A high-converting, SEO-ready static website for Professor Town—interview prep for adjuncts, current professors switching institutions, and grad students.

## Tech Stack

- **Pure HTML5, CSS3, and Vanilla JavaScript** (no frameworks)
- **Self-hosted fonts**: Source Serif 4 and Inter (WOFF2)
- **Static files only** (no build tools required)

## Performance Targets

- ≤ 120KB total JS on initial load
- ≤ 2 web fonts (WOFF2)
- Lighthouse ≥ 90 mobile
- TTI < 2.5s on 3G Fast

## Directory Structure

```
/
├── assets/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   ├── js/
│   │   └── main.js            # Main JavaScript
│   ├── fonts/                 # Self-hosted fonts (WOFF2)
│   │   ├── source-serif-4-bold.woff2
│   │   ├── inter-regular.woff2
│   │   ├── inter-medium.woff2
│   │   └── inter-semibold.woff2
│   └── img/                   # Images (WebP/AVIF + SVG icons)
├── blog/
│   ├── index.html             # Blog index
│   ├── index.json             # Blog search index
│   └── {category}/
│       └── {post}.html        # Blog posts
├── courses/
│   └── index.html
├── coaching/
│   └── index.html
├── resources/
│   └── index.html
├── about/
│   └── index.html
├── contact/
│   └── index.html
├── index.html                 # Homepage
├── sitemap.xml
└── robots.txt
```

## Setup Instructions

### 1. Fonts

You need to add the following WOFF2 font files to `/assets/fonts/`:

- **Source Serif 4** (700 weight)
  - `source-serif-4-bold.woff2`
  
- **Inter** (400, 500, 600 weights)
  - `inter-regular.woff2`
  - `inter-medium.woff2`
  - `inter-semibold.woff2`

**Where to get fonts:**
- Google Fonts (https://fonts.google.com)
- Adobe Fonts
- Inter is also available on GitHub: https://github.com/rsms/inter

### 2. Images

Add the following images to `/assets/img/`:

- `favicon.svg` - Site favicon
- `logo.svg` - Site logo
- `og-image.jpg` - Open Graph image (1200x630px)
- WebP/AVIF versions of hero images and other graphics

**Image optimization:**
- Use WebP or AVIF format
- Include responsive `srcset` attributes
- Provide SVG icons where possible
- Optimize for web (compress before adding)

### 3. Form Handling

Currently, forms are set up with `action="#"` and `method="post"`. You'll need to:

- Connect forms to your email service (e.g., Formspree, Netlify Forms, or your own backend)
- Update form `action` attributes with your endpoint
- Add any necessary form validation

### 4. External Integrations

Update these placeholder URLs with your actual services:

- **Calendly**: Update Calendly embed URLs in `/coaching/index.html`
- **Thinkific**: Update course enrollment links in `/courses/index.html`
- **Social media**: Update Twitter/LinkedIn URLs throughout the site

### 5. Deploy

This is a static site that can be deployed to:

- **Netlify** (recommended - handles forms, redirects, etc.)
- **Vercel**
- **GitHub Pages**
- **Any static hosting service**

Simply upload all files to your hosting service. No build step required.

## Features

✅ **Fully responsive** - Mobile-first design  
✅ **WCAG AA accessible** - Skip links, focus styles, ARIA attributes  
✅ **SEO optimized** - Schema.org JSON-LD, sitemap, meta tags  
✅ **Lightweight** - Pure vanilla JS, minimal dependencies  
✅ **Fast animations** - CSS-first with IntersectionObserver  
✅ **Blog system** - Static HTML with JSON search index  
✅ **FAQ accordion** - Keyboard accessible  
✅ **Mobile navigation** - Hamburger menu with smooth transitions  

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 not supported (uses modern CSS/JS features)

## Development

No build tools or dependencies required. Simply:

1. Open `index.html` in a browser for local development
2. Use a local server for proper routing (e.g., `python -m http.server` or `npx serve`)
3. Edit HTML/CSS/JS files directly

## License

All rights reserved. Professor Town © 2024

