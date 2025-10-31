# Images Directory

Place the following images in this directory:

## Required Images

1. **favicon.svg** - Site favicon (16x16 or 32x32)
2. **logo.svg** - Site logo (for nav and schema markup)
3. **og-image.jpg** - Open Graph image for social sharing (1200x630px)

## Optional Images

- Hero images (WebP/AVIF format)
- Blog post featured images
- Course/product images
- Testimonial photos (with permission)
- Department logos for social proof section

## Image Guidelines

- Use **WebP** or **AVIF** format for photos
- Use **SVG** for icons and logos
- Optimize images before adding (compress, resize appropriately)
- Include responsive `srcset` attributes when using images
- Always include `alt` text for accessibility

## Responsive Images

Example format for responsive images:

```html
<picture>
  <source srcset="/assets/img/hero.avif" type="image/avif">
  <source srcset="/assets/img/hero.webp" type="image/webp">
  <img src="/assets/img/hero.jpg" alt="Description" loading="lazy">
</picture>
```

