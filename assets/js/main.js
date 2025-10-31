/* Professor Town - Main JavaScript */

(function() {
  'use strict';
  
  // ============================================
  // Reveal on Scroll (IntersectionObserver)
  // ============================================
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealEls = [...document.querySelectorAll('.reveal')];
    if (revealEls.length > 0) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14 });
      revealEls.forEach(el => io.observe(el));
    }
  }
  
  // ============================================
  // Mobile Navigation Toggle
  // ============================================
  const navToggle = document.querySelector('.nav-mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('is-open');
      const isOpen = navMenu.classList.contains('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen ? '✕' : '☰';
    });
    
    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '☰';
      });
    });
  }
  
  // ============================================
  // FAQ Accordion
  // ============================================
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isOpen = question.getAttribute('aria-expanded') === 'true';
      
      // Close all other FAQs
      faqQuestions.forEach(q => {
        if (q !== question) {
          q.setAttribute('aria-expanded', 'false');
          const a = q.nextElementSibling;
          if (a && a.classList.contains('faq-answer')) {
            a.classList.remove('is-open');
            a.style.maxHeight = '0';
          }
        }
      });
      
      // Toggle current FAQ
      question.setAttribute('aria-expanded', !isOpen);
      if (!isOpen) {
        answer.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.classList.remove('is-open');
        answer.style.maxHeight = '0';
      }
    });
    
    // Initialize closed state
    question.setAttribute('aria-expanded', 'false');
    const answer = question.nextElementSibling;
    if (answer && answer.classList.contains('faq-answer')) {
      answer.style.maxHeight = '0';
    }
  });
  
  // ============================================
  // Blog Search
  // ============================================
  const blogSearchInput = document.querySelector('.blog-search input');
  let blogIndex = null;
  
  if (blogSearchInput) {
    // Load blog index
    fetch('/blog/index.json')
      .then(response => response.json())
      .then(data => {
        blogIndex = data;
      })
      .catch(err => console.error('Failed to load blog index:', err));
    
    // Search handler
    blogSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      const blogGrid = document.querySelector('.blog-grid');
      
      if (!blogIndex || !blogGrid) return;
      
      if (query === '') {
        // Show all posts
        const posts = blogGrid.querySelectorAll('.blog-card');
        posts.forEach(post => {
          post.style.display = '';
        });
        return;
      }
      
      // Filter posts
      const matches = blogIndex.filter(post => {
        const title = post.title.toLowerCase();
        const excerpt = post.excerpt.toLowerCase();
        const tags = post.tags.join(' ').toLowerCase();
        return title.includes(query) || excerpt.includes(query) || tags.includes(query);
      });
      
      // Hide all posts
      const allPosts = blogGrid.querySelectorAll('.blog-card');
      allPosts.forEach(post => {
        post.style.display = 'none';
      });
      
      // Show matching posts
      matches.forEach(match => {
        const postElement = blogGrid.querySelector(`[data-slug="${match.slug}"]`);
        if (postElement) {
          postElement.style.display = '';
        }
      });
      
      // Show no results message
      let noResults = document.querySelector('.blog-no-results');
      if (matches.length === 0) {
        if (!noResults) {
          noResults = document.createElement('p');
          noResults.className = 'blog-no-results';
          noResults.textContent = 'No posts found matching your search.';
          blogGrid.appendChild(noResults);
        }
      } else if (noResults) {
        noResults.remove();
      }
    });
  }
  
  // ============================================
  // Blog Category Filter
  // ============================================
  const blogFilterBtns = document.querySelectorAll('.blog-filter-btn');
  
  blogFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      
      // Update active state
      blogFilterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      
      const blogGrid = document.querySelector('.blog-grid');
      if (!blogGrid) return;
      
      // Filter posts
      const posts = blogGrid.querySelectorAll('.blog-card');
      posts.forEach(post => {
        if (category === 'all') {
          post.style.display = '';
        } else {
          const postCategory = post.getAttribute('data-category');
          post.style.display = postCategory === category ? '' : 'none';
        }
      });
      
      // Clear search if active
      if (blogSearchInput) {
        blogSearchInput.value = '';
      }
    });
  });
  
  // ============================================
  // Nav fade-in on load
  // ============================================
  window.addEventListener('load', () => {
    const nav = document.querySelector('.nav');
    if (nav) {
      nav.style.opacity = '0';
      requestAnimationFrame(() => {
        nav.style.transition = 'opacity 0.5s ease';
        nav.style.opacity = '1';
      });
    }
  });
  
})();

