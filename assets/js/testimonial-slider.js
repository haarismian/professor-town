/* Professor Town - Testimonial Slider Component */

/**
 * Renders a testimonial slider into a container element.
 * Requires TESTIMONIALS array to be loaded from testimonials-data.js
 * 
 * @param {string} containerId - The ID of the container element
 * @param {Object} options - Optional configuration
 * @param {number} options.maxTestimonials - Limit number of testimonials shown
 */
function renderTestimonialSlider(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Testimonial slider: Container #${containerId} not found`);
    return;
  }
  
  if (typeof TESTIMONIALS === 'undefined' || !Array.isArray(TESTIMONIALS)) {
    console.warn('Testimonial slider: TESTIMONIALS data not found. Include testimonials-data.js first.');
    return;
  }

  let testimonials = TESTIMONIALS;
  
  // Apply max limit if specified
  if (options.maxTestimonials && options.maxTestimonials > 0) {
    testimonials = testimonials.slice(0, options.maxTestimonials);
  }

  // Split into two columns (odd indices / even indices)
  const col1 = testimonials.filter((_, i) => i % 2 === 0);
  const col2 = testimonials.filter((_, i) => i % 2 === 1);

  // LinkedIn SVG icon
  const linkedinIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>`;

  /**
   * Renders the avatar element - person image, logo, or initials fallback
   */
  const renderAvatar = (t) => {
    if (t.image) {
      // Person's photo takes priority
      return `<img src="${t.image}" alt="${t.name}" class="testimonial-avatar testimonial-avatar-img">`;
    } else if (t.logo) {
      // University/company logo as fallback
      return `<img src="${t.logo}" alt="" class="testimonial-avatar testimonial-avatar-logo">`;
    } else {
      // Initials as final fallback
      return `<div class="testimonial-avatar">${t.initials}</div>`;
    }
  };

  /**
   * Renders a single testimonial card
   */
  const renderCard = (t) => `
    <div class="testimonial-card">
      <div class="testimonial-header">
        ${renderAvatar(t)}
        <div class="testimonial-header-text">
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-title">${t.title}</div>
        </div>
      </div>
      <div class="testimonial-rating-row">
        <div class="testimonial-stars">★★★★★</div>
        <a href="${t.linkedin}" target="_blank" rel="noopener noreferrer" class="testimonial-linkedin">
          ${linkedinIcon}
        </a>
      </div>
      <p class="testimonial-text">"${t.text}"</p>
    </div>
  `;

  /**
   * Renders a scrolling column of testimonials
   * Duplicates cards for seamless infinite scroll
   */
  const renderColumn = (columnTestimonials) => {
    if (columnTestimonials.length === 0) return '';
    
    // Duplicate testimonials for seamless loop animation
    const cards = [...columnTestimonials, ...columnTestimonials]
      .map(renderCard)
      .join('');
    
    return `
      <div class="testimonials-column-wrapper">
        <div class="testimonials-column">${cards}</div>
      </div>
    `;
  };

  // Render the grid with both columns
  container.innerHTML = `
    <div class="testimonials-grid">
      ${renderColumn(col1)}
      ${renderColumn(col2)}
    </div>
  `;
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Auto-init any element with id="testimonial-slider"
  if (document.getElementById('testimonial-slider')) {
    renderTestimonialSlider('testimonial-slider');
  }
});

