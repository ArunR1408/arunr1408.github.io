/**
* Template Name: MyResume - v4.10.0
* Template URL: https://bootstrapmade.com/free-html-bootstrap-template-my-resume/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";
  // Preloader & scroll progress (dark mode is enforced via HTML/body class)
  (function initPreloaderAndProgress(){
    // remove any existing preloader immediately if page already loaded
    const removePreloader = () => {
      try {
        document.querySelectorAll('#preloader').forEach(el => el.remove());
      } catch (e) {
        // ignore
      }
    };

    // ensure preloader removed on load, and as a fallback after 3s
    window.addEventListener('load', removePreloader);
    setTimeout(removePreloader, 3000);

    // safety: if preloader is added late or fails to remove, observe and clear
    const obs = new MutationObserver(() => {
      const p = document.getElementById('preloader');
      if (p) removePreloader();
    });
    try { obs.observe(document.documentElement, { childList: true, subtree: true }); } catch(e) {}
    // stop observing after a while
    setTimeout(() => { try { obs.disconnect(); } catch(e){} }, 6000);

    // ensure dark class exists (site is dark-only now)
    document.addEventListener('DOMContentLoaded', () => {
      try { document.body.classList.add('dark'); } catch(e){}
      const progressBar = document.querySelector('.scroll-progress-bar');
      if (progressBar) {
        const update = () => {
          const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100 || 0;
          progressBar.style.width = pct + '%';
        };
        window.addEventListener('scroll', update);
        // initial update in case page loaded scrolled
        update();
      }
    });
  })();

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    const body = select('body');
    const isActive = body.classList.toggle('mobile-nav-active');
  // keep the hamburger icon class present
  this.classList.add('bi-list')
    // Manage overlay for outside-tap-to-close on mobile
    if (isActive) {
      // create overlay
      let ol = document.createElement('div');
      ol.className = 'mobile-nav-overlay';
      ol.style.position = 'fixed';
      ol.style.inset = '0';
      ol.style.zIndex = '9996';
      ol.style.background = 'transparent';
      ol.addEventListener('click', () => {
  // close nav when clicking outside
  body.classList.remove('mobile-nav-active');
  const tgl = select('.mobile-nav-toggle');
  if (tgl) { tgl.classList.add('bi-list'); }
        // cleanup drag handlers if present
        const headerElCleanup = document.getElementById('header');
        if (headerElCleanup && headerElCleanup._mobileDragCleanup) headerElCleanup._mobileDragCleanup();
        ol.remove();
      }, { passive: true });
      document.body.appendChild(ol);
      // enable drag-to-close on the header/sidebar
      const headerEl = document.getElementById('header');
      if (headerEl) {
        headerEl.style.transition = 'transform .28s cubic-bezier(.2,.8,.2,1)';
        let startX = 0;
        let currentX = 0;
        let dragging = false;

        const beginDrag = (clientX) => {
          dragging = true;
          startX = clientX;
          headerEl.style.willChange = 'transform';
        };

        const moveDrag = (clientX) => {
          if (!dragging) return;
          currentX = clientX;
          const dx = Math.min(0, currentX - startX); // negative or zero
          headerEl.style.transform = `translateX(${dx}px)`;
        };

        const endDrag = () => {
          if (!dragging) return;
          dragging = false;
          const dx = currentX - startX;
          headerEl.style.willChange = '';
          const threshold = Math.max(-120, -headerEl.offsetWidth * 0.4);
          if (dx < threshold) {
            body.classList.remove('mobile-nav-active');
            const tgl = select('.mobile-nav-toggle');
            if (tgl) { tgl.classList.add('bi-list'); }
            headerEl.style.transform = '';
            const existing = document.querySelector('.mobile-nav-overlay'); if (existing) existing.remove();
          } else {
            headerEl.style.transform = '';
          }
        };

        // document-level handlers to improve reliability
        const docDown = (e) => {
          const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : (e.clientX || (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientX));
          // start drag only if initial contact is within header bounds
          const rect = headerEl.getBoundingClientRect();
          if (clientX >= rect.left && clientX <= rect.right) {
            beginDrag(clientX);
          }
        };

        const docMove = (e) => {
          if (!dragging) return;
          const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
          // prevent vertical scroll while dragging
          if (e.cancelable) e.preventDefault();
          moveDrag(clientX);
        };

        const docUp = (e) => {
          if (!dragging) return endDrag();
          endDrag();
        };

        document.addEventListener('touchstart', docDown, { passive: true });
        document.addEventListener('touchmove', docMove, { passive: false });
        document.addEventListener('touchend', docUp, { passive: true });
        document.addEventListener('pointerdown', docDown);
        document.addEventListener('pointermove', docMove);
        document.addEventListener('pointerup', docUp);

        // store handlers for cleanup
        headerEl._mobileDragCleanup = () => {
          document.removeEventListener('touchstart', docDown);
          document.removeEventListener('touchmove', docMove);
          document.removeEventListener('touchend', docUp);
          document.removeEventListener('pointerdown', docDown);
          document.removeEventListener('pointermove', docMove);
          document.removeEventListener('pointerup', docUp);
          headerEl.style.transition = '';
          headerEl.style.transform = '';
          delete headerEl._mobileDragCleanup;
        };
      }
    } else {
      // remove any existing overlay and cleanup drag handlers
      const existing = document.querySelector('.mobile-nav-overlay');
      if (existing) existing.remove();
      const headerElCleanup = document.getElementById('header');
      if (headerElCleanup && headerElCleanup._mobileDragCleanup) headerElCleanup._mobileDragCleanup();
    }
  })

  // Close mobile nav with Escape key and cleanup handlers/overlay
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      const body = document.body;
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active');
        const tgl = select('.mobile-nav-toggle');
        if (tgl) { tgl.classList.add('bi-list'); }
        const existing = document.querySelector('.mobile-nav-overlay');
        if (existing) existing.remove();
        const headerElCleanup = document.getElementById('header');
        if (headerElCleanup && headerElCleanup._mobileDragCleanup) headerElCleanup._mobileDragCleanup();
      }
    }
  });

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        // ensure toggle shows hamburger
        navbarToggle.classList.add('bi-list')
        navbarToggle.classList.remove('bi-x')
        const existing = document.querySelector('.mobile-nav-overlay');
        if (existing) existing.remove();
        const headerElCleanup = document.getElementById('header');
        if (headerElCleanup && headerElCleanup._mobileDragCleanup) headerElCleanup._mobileDragCleanup();
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',').map(s => s.trim())
    // Wrap with a/an article where it improves grammar; leave titles like 'Developer' without article if desired
    const withArticle = (phrase) => {
      // If phrase already starts with a known article, return as-is
      if (/^(a|an|the)\s/i.test(phrase)) return phrase;
      const first = phrase.charAt(0).toLowerCase();
      const vowels = ['a','e','i','o','u'];
      // heuristics for words like 'ML Engineer' -> 'an ML Engineer'
      const startsWithVowelSound = vowels.includes(first) || /^(ml|ai|iot|r?&d)/i.test(phrase);
      // use 'the' for specific roles when it reads better under "I'm ..."
      const useDefinite = /^(founder|lead|lead developer|maintainer)$/i.test(phrase);
      if (useDefinite) return `the ${phrase}`;
      const article = startsWithVowelSound ? 'an' : 'a';
      return `${article} ${phrase}`;
    };
    const enhanced = typed_strings.map(withArticle);
    new Typed('.typed', {
      strings: enhanced,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Global touch/hover/press micro-interactions (ripple + press states)
   * Applies to buttons, links, chips, nav items, and cards.
   */
  window.addEventListener('DOMContentLoaded', () => {
    const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const interactiveSelectors = [
      '.btn', '.skill-chip', '.portfolio .portfolio-wrap', '.nav-menu a', '.cert-btn', '.portfolio .portfolio-wrap .portfolio-links a', '.contact .info-item', '.social-links a', '#portfolio-flters li'
    ];
    const hosts = document.querySelectorAll(interactiveSelectors.join(','));
    hosts.forEach(h => h.classList.add('ripple-host'));

    const makeRipple = (host, x, y) => {
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = host.getBoundingClientRect();
      const maxDim = Math.max(rect.width, rect.height);
      const size = maxDim * 2; // cover diagonals
      r.style.width = r.style.height = size + 'px';
      r.style.left = (x - rect.left - size / 2) + 'px';
      r.style.top = (y - rect.top - size / 2) + 'px';
      host.appendChild(r);
      // trigger animation
      requestAnimationFrame(() => {
        r.classList.add('ripple-anim');
      });
      r.addEventListener('animationend', () => r.remove());
    };

    const pressStart = (e) => {
      const host = e.currentTarget;
      host.classList.add('pressing');
      const point = (e.touches && e.touches[0]) || e;
      makeRipple(host, point.clientX, point.clientY);
    };
    const pressEnd = (e) => { e.currentTarget.classList.remove('pressing'); };

    hosts.forEach(h => {
      h.addEventListener(supportsTouch ? 'touchstart' : 'pointerdown', pressStart, { passive: true });
      h.addEventListener(supportsTouch ? 'touchend' : 'pointerup', pressEnd, { passive: true });
      h.addEventListener(supportsTouch ? 'touchcancel' : 'pointercancel', pressEnd, { passive: true });
      // mouse leave cleanup
      h.addEventListener('mouseleave', () => h.classList.remove('pressing'));
      h.addEventListener('blur', () => h.classList.remove('pressing'));
    });

    // Hero name: wavy flair on hover/touch/keyboard (no bounce)
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
      // For touch/click, toggle a class briefly to show the flair when there's no hover
      const pulseFlair = () => {
        heroName.classList.add('touch-flair');
        clearTimeout(heroName._flairTimer);
        heroName._flairTimer = setTimeout(() => heroName.classList.remove('touch-flair'), 1200);
      };
      heroName.addEventListener('click', pulseFlair);
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        heroName.addEventListener('touchstart', () => {
          pulseFlair();
        }, { passive: true });
      }
      // Keyboard accessibility: show flair when focusing via keyboard
      heroName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pulseFlair();
        }
      });
    }

    // Navbar subtle drag feedback on touch: translate a bit while swiping over nav
    const nav = document.querySelector('#navbar');
    if (nav && supportsTouch) {
      let active = false; let startX = 0;
      nav.addEventListener('touchstart', (e) => { active = true; startX = e.touches[0].clientX; }, { passive: true });
      nav.addEventListener('touchmove', (e) => {
        if (!active) return;
        const dx = Math.max(-6, Math.min(6, e.touches[0].clientX - startX));
        nav.style.transform = `translateX(${dx}px)`;
      }, { passive: true });
      const reset = () => { active = false; nav.style.transform = ''; };
      nav.addEventListener('touchend', reset, { passive: true });
      nav.addEventListener('touchcancel', reset, { passive: true });
    }
  });

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent && window.Waypoint) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Skills filter (chips)
   */
  window.addEventListener('DOMContentLoaded', () => {
    const filterEl = document.getElementById('skills-filter');
    const gridEl = document.getElementById('skills-grid');
    if (!filterEl || !gridEl) return;
    const chips = Array.from(gridEl.querySelectorAll('.skill-chip'));
    // Pebble indicator setup
    const pebble = filterEl.querySelector('.skills-pebble');
    const movePebble = (target) => {
      if (!pebble || !target) return;
      const wrapRect = filterEl.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      const x = tRect.left - wrapRect.left + filterEl.scrollLeft;
      const y = Math.max(0, tRect.top - wrapRect.top + filterEl.scrollTop);
      pebble.style.setProperty('--sx', `${x}px`);
      pebble.style.setProperty('--sy', `${y}px`);
      pebble.style.width = `${tRect.width}px`;
      pebble.style.height = `${tRect.height}px`;
      // Place pebble behind items (z-index handled in CSS)
    };
    // Follow pebble under pointer for fluid dragging, anchored to nearest tab row
    const followPebble = (clientX, clientY) => {
      if (!pebble) return;
      const wrapRect = filterEl.getBoundingClientRect();
      const nearest = nearestCatAt(clientX, clientY) || filterEl.querySelector('li.active');
      if (!nearest) return;
      const r = nearest.getBoundingClientRect();
      const width = r.width; const height = r.height;
      // center pebble around pointer X, clamp within wrapper
      const desiredLeft = clientX - wrapRect.left - width / 2;
      const minLeft = 0; const maxLeft = wrapRect.width - width;
      const x = Math.max(minLeft, Math.min(maxLeft, desiredLeft)) + filterEl.scrollLeft;
      const y = Math.max(0, r.top - wrapRect.top + filterEl.scrollTop);
      pebble.style.setProperty('--sx', `${x}px`);
      pebble.style.setProperty('--sy', `${y}px`);
      pebble.style.width = `${width}px`;
      pebble.style.height = `${height}px`;
    };
    // Initialize pebble to active
    const initActive = () => {
      const act = filterEl.querySelector('li.active') || filterEl.querySelector('li[data-filter]');
      if (act) movePebble(act);
    };
  const setFilter = (cat) => {
      chips.forEach(chip => {
        const match = cat === 'all' || chip.getAttribute('data-cat') === cat;
        if (match) {
          chip.removeAttribute('hidden');
        } else {
          chip.setAttribute('hidden', '');
        }
      });
      // AOS refresh if present
      if (window.AOS && typeof AOS.refresh === 'function') {
        try { AOS.refresh(); } catch(e){}
      }
      // keep pebble aligned with active tab
      const act = filterEl.querySelector('li.active');
      if (act) movePebble(act);
    };
    let animTimer = null;
    const animateGridSwap = (cb) => {
      // make animation robust against rapid re-triggers
      if (animTimer) { clearTimeout(animTimer); animTimer = null; }
      gridEl.classList.add('animating-out');
      animTimer = setTimeout(() => {
        cb();
        requestAnimationFrame(() => {
          gridEl.classList.remove('animating-out');
        });
        animTimer = null;
      }, 200);
    };

    filterEl.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-filter]');
      if (!li) return;
      filterEl.querySelectorAll('li').forEach(el => el.classList.remove('active'));
      li.classList.add('active');
      movePebble(li);
      animateGridSwap(() => setFilter(li.getAttribute('data-filter')));
    });
    // keyboard support
    filterEl.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const li = document.activeElement.closest('li[data-filter]');
      if (!li) return;
      e.preventDefault();
      filterEl.querySelectorAll('li').forEach(el => el.classList.remove('active'));
      li.classList.add('active');
      movePebble(li);
      animateGridSwap(() => setFilter(li.getAttribute('data-filter')));
    });
  // initial -> default to Languages
  setFilter('languages');
  initActive();
  // realign on resize
  window.addEventListener('resize', initActive);

  // Drag-to-select for pebble
  const cats = Array.from(filterEl.querySelectorAll('li[data-filter]'));
  let dragging = false;
  let rafPending = false;
  let lastTarget = filterEl.querySelector('li.active');
  let dragArmed = false;
  let armStart = { x:0, y:0 };
  const nearestCatAt = (clientX, clientY) => {
    let nearest = null; let best = Infinity;
    for (const li of cats) {
      const r = li.getBoundingClientRect();
      const cx = r.left + r.width/2; const cy = r.top + r.height/2;
      const dx = clientX - cx; const dy = clientY - cy;
      const d = dx*dx + dy*dy;
      if (d < best) { best = d; nearest = li; }
    }
    return nearest;
  };
  const applyActive = (li) => {
    if (!li || li === lastTarget) return;
    filterEl.querySelectorAll('li').forEach(el => el.classList.remove('active'));
    li.classList.add('active');
    lastTarget = li;
    movePebble(li);
    setFilter(li.getAttribute('data-filter'));
  };
  let lastPoint = { x: 0, y: 0 };
  const onPointerMove = (e) => {
    if (!dragging) return;
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
  // subtle visual feedback without blocking updates
  gridEl.classList.add('drag-fade');
      lastPoint = { x: e.clientX, y: e.clientY };
      // fluidly follow pointer without changing category yet
      followPebble(e.clientX, e.clientY);
    });
  };
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    filterEl.classList.remove('dragging');
  gridEl.classList.remove('drag-fade');
  // restore slower transitions after drag ends
  if (pebble) pebble.style.transitionDuration = '';
    // snap to nearest and animate content update
    const target = nearestCatAt(lastPoint.x, lastPoint.y) || filterEl.querySelector('li.active');
    if (target) {
      filterEl.querySelectorAll('li').forEach(el => el.classList.remove('active'));
      target.classList.add('active');
      movePebble(target);
      animateGridSwap(() => setFilter(target.getAttribute('data-filter')));
    }
    // ripple flair
    if (pebble) {
      pebble.classList.remove('snap');
      // retrigger animation
      void pebble.offsetWidth;
      pebble.classList.add('snap');
      setTimeout(() => pebble.classList.remove('snap'), 420);
    }
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', endDrag);
    window.removeEventListener('pointercancel', endDrag);
  };
  const startDrag = (e) => {
    dragging = true;
    filterEl.classList.add('dragging');
    // speed up pebble tracking during drag for responsiveness
    if (pebble) pebble.style.transitionDuration = '180ms, 180ms, 180ms';
    // position pebble under pointer immediately without changing active/content yet
    followPebble(e.clientX, e.clientY);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
  };
  // Start drag on pebble or filter background
  const armMove = (e) => {
    const dx = e.clientX - armStart.x; const dy = e.clientY - armStart.y;
    if (!dragArmed && Math.hypot(dx, dy) > 6) {
      dragArmed = true;
      startDrag(e);
      // after drag starts, stop arm listeners
      window.removeEventListener('pointermove', armMove, true);
      window.removeEventListener('pointerup', armUp, true);
      window.removeEventListener('pointercancel', armUp, true);
    }
  };
  const armUp = () => {
    window.removeEventListener('pointermove', armMove, true);
    window.removeEventListener('pointerup', armUp, true);
    window.removeEventListener('pointercancel', armUp, true);
  };
  filterEl.addEventListener('pointerdown', (e) => {
    // arm drag; do not prevent click, and do not start drag immediately
    dragArmed = false;
    armStart = { x: e.clientX, y: e.clientY };
    window.addEventListener('pointermove', armMove, true);
    window.addEventListener('pointerup', armUp, true);
    window.addEventListener('pointercancel', armUp, true);
  });
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');


        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Initiate portfolio details lightbox 
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Certifications slider (responsive multi-slide)
   */
  const certSwiperEl = document.querySelector('.cert-swiper');
  if (certSwiperEl) {
    const certSwiper = new Swiper(certSwiperEl, {
      speed: 600,
      loop: false,
      spaceBetween: 24,
      slidesPerView: 3,
      watchOverflow: true,
  autoHeight: false,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
  pagination: false,
      breakpoints: {
        0: { slidesPerView: 1 },
        576: { slidesPerView: 1.4 },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
        1400: { slidesPerView: 3 } 
      }
    });
    const prevBtn = document.querySelector('.cert-btn.prev');
    const nextBtn = document.querySelector('.cert-btn.next');
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => certSwiper.slidePrev());
      nextBtn.addEventListener('click', () => certSwiper.slideNext());

      // Precisely center arrows on the middle of the certificate image preview
      const wrapper = document.querySelector('.cert-slider-wrapper');
      const positionArrows = () => {
        if (!wrapper) return;
        // Prefer the first visible slide's preview; fallback to any preview
        const previews = Array.from(wrapper.querySelectorAll('.swiper-slide .preview'));
        const preview = previews.find(p => {
          const r = p.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        }) || previews[0];
        if (!preview) return;
        const wRect = wrapper.getBoundingClientRect();
        const pRect = preview.getBoundingClientRect();
        const centerY = (pRect.top + pRect.height / 2) - wRect.top; // relative to wrapper
        prevBtn.style.top = centerY + 'px';
        nextBtn.style.top = centerY + 'px';
      };

      // Ensure the swiper container height matches current visible slide row (remove leftover gap)
      const adjustHeight = () => {
        try {
          const slides = Array.from(wrapper.querySelectorAll('.swiper-slide'));
          const visibleHeights = slides
            .filter(s => {
              const r = s.getBoundingClientRect();
              return r.width > 0 && r.height > 0;
            })
            .map(s => {
              const card = s.querySelector('.cert-card');
              return card ? card.getBoundingClientRect().height : s.getBoundingClientRect().height;
            });
          const maxH = visibleHeights.length ? Math.max(...visibleHeights) : 0;
          certSwiperEl.style.height = Math.ceil(maxH) + 'px';
        } catch (e) { /* noop */ }
      };

      // Recalculate on load, resize, and swiper events
      window.addEventListener('load', positionArrows);
      window.addEventListener('resize', positionArrows);
  const recalc = () => { positionArrows(); adjustHeight(); };
  certSwiper.on('resize', recalc);
  certSwiper.on('slideChangeTransitionEnd', recalc);
  certSwiper.on('transitionEnd', recalc);
      // When images load (object-fit: contain), heights can change
      wrapper.querySelectorAll('.preview img').forEach(img => {
        if (img.complete) return; // already loaded
        img.addEventListener('load', recalc, { once: true });
      });
      // Initial positions shortly after init to allow layout to settle
      setTimeout(recalc, 60);
      // Second tick after fonts/images/AOS might tweak layout
      setTimeout(recalc, 220);
      // Also recalc on window events
      window.addEventListener('load', recalc);
      window.addEventListener('resize', recalc);
    }
  }

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

  /**
   * Contact form: Formspree submission with toast feedback
   */
  window.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#contact form[action^="https://formspree.io/"]');
    const container = document.getElementById('toast-container');
    if (!form || !container) return;

    const showToast = (msg, type = 'success') => {
      const el = document.createElement('div');
      el.className = `toast toast-${type}`;
      el.setAttribute('role', 'status');
      el.innerHTML = `${type === 'success' ? '<i class="bi bi-check-circle"></i>' : '<i class="bi bi-x-circle"></i>'}<span>${msg}</span>`;
      container.appendChild(el);
      setTimeout(() => {
        el.style.transition = 'opacity .4s ease, transform .4s ease';
        el.style.opacity = '0';
        el.style.transform = 'translateY(6px)';
        setTimeout(() => el.remove(), 400);
      }, 3600);
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Block bots via honeypot
      const hp = form.querySelector('input[name="_gotcha"]');
      if (hp && hp.value) return; 
      const data = new FormData(form);
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        });
        if (res.ok) {
          showToast('Message sent successfully. I\'ll get back to you soon.', 'success');
          form.reset();
        } else {
          showToast('Could not send message. Please try again later.', 'error');
        }
      } catch (err) {
        showToast('Network error. Please check your connection and retry.', 'error');
      }
    });
  });

})()
