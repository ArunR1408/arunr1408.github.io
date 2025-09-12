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
  let navbarlinks = select('#navbar .scrollto', true);
  const sections = navbarlinks.map(l => l.hash).filter(Boolean).map(h => select(h)).filter(Boolean);
  // Ensure each nav link has a progress element
  navbarlinks.forEach(l => { if (!l.querySelector('.nav-progress')) { const p=document.createElement('span'); p.className='nav-progress'; l.appendChild(p);} });
  const activateLink = (id) => {
    navbarlinks.forEach(l => {
      const isActive = l.hash === id;
      l.classList.toggle('active', isActive);
      if (isActive) {
        l.setAttribute('aria-current','true');
      } else {
        l.removeAttribute('aria-current');
      }
    });
  };
  const updateActiveProgress = () => {
    const activeLink = navbarlinks.find(l => l.classList.contains('active'));
    if (!activeLink) return;
    const hash = activeLink.hash;
    const sec = hash ? select(hash) : null;
    if (!sec) return;
    const rect = sec.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const total = rect.height || 1;
    // progress = how much of section consumed in viewport scroll band
    const visibleTop = Math.min(Math.max(-rect.top, 0), total);
    let progress = visibleTop / total;
    progress = Math.max(0, Math.min(1, progress));
    const bar = activeLink.querySelector('.nav-progress');
    if (bar) bar.style.width = (progress*100).toFixed(1)+'%';
  };
  const fallbackScroll = () => {
    const pos = window.scrollY + 180; // slightly larger to allow current section dominance
    let current = null;
    sections.forEach(sec => { if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) current = '#' + sec.id; });
    if (current) activateLink(current);
    updateActiveProgress();
  };
  if ('IntersectionObserver' in window) {
    try {
      const observer = new IntersectionObserver((entries) => {
        let topCandidate = null;
        entries.forEach(ent => {
          if (ent.isIntersecting) {
            if (!topCandidate || ent.intersectionRatio > topCandidate.intersectionRatio) topCandidate = ent;
          }
        });
        if (topCandidate) {
          activateLink('#' + topCandidate.target.id);
          updateActiveProgress();
        }
      }, { rootMargin: '-25% 0px -55% 0px', threshold: [0.1, 0.25, 0.5, 0.75] });
      sections.forEach(sec => observer.observe(sec));
    } catch(e) { window.addEventListener('scroll', fallbackScroll, { passive:true }); }
  } else {
    window.addEventListener('scroll', fallbackScroll, { passive:true });
  }
  window.addEventListener('load', () => { fallbackScroll(); updateActiveProgress(); });
  window.addEventListener('scroll', () => { updateActiveProgress(); }, { passive:true });

  /**
   * Scrolls to an element with header offset
   */
  // Cancellable smooth scroll
  let activeScrollAnim = null;
  const cancelIfScrolling = () => { if (activeScrollAnim) { cancelAnimationFrame(activeScrollAnim.raf); activeScrollAnim=null; } };
  ['wheel','touchstart','keydown','mousedown'].forEach(evt => window.addEventListener(evt, cancelIfScrolling, { passive:true }));
  const easeInOut = (t) => t<0.5 ? 2*t*t : -1+(4-2*t)*t;
  const scrollto = (el) => {
    cancelIfScrolling();
    const headerOffset = 40;
    const target = select(el); if (!target) return;
    const startY = window.scrollY;
    const endY = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    const dist = endY - startY;
    const dur = Math.min(1200, Math.max(300, Math.abs(dist) * 0.6));
    const startTime = performance.now();
    const state = { raf:0 };
    const step = (now) => {
      const t = Math.min(1, (now - startTime)/dur);
      const eased = easeInOut(t);
      window.scrollTo(0, startY + dist * eased);
      updateActiveProgress();
      if (t < 1 && state === activeScrollAnim) { state.raf = requestAnimationFrame(step); } else { activeScrollAnim=null; }
    };
    activeScrollAnim = state;
    state.raf = requestAnimationFrame(step);
  };

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
    // update aria-expanded for accessibility
    try { this.setAttribute('aria-expanded', isActive ? 'true' : 'false'); } catch(_){}
  // ensure we are only toggling body class; hamburger is pure CSS (3 bars) so remove stray icon font classes that distort layout
  this.classList.remove('bi-list','bi-x');
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
  if (tgl) { tgl.classList.remove('bi-list','bi-x'); }
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
            if (tgl) { tgl.classList.remove('bi-list','bi-x'); }
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
  if (tgl) { tgl.classList.remove('bi-list','bi-x'); tgl.setAttribute('aria-expanded','false'); }
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
  // ensure toggle shows clean hamburger (remove injected icon classes)
  navbarToggle.classList.remove('bi-list','bi-x');
        navbarToggle.setAttribute('aria-expanded','false');
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
  '.btn', '.skill-chip', '.portfolio .portfolio-wrap', '.nav-menu a', '.portfolio .portfolio-wrap .portfolio-links a', '.contact .info-item', '.social-links a', '#portfolio-flters li'
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
    // Parallax & subtle tilt (respect reduced motion)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      const parallaxLayer = document.querySelector('#hero .parallax-layer');
      let lastY = 0, ticking = false;
      if (parallaxLayer) {
        const onScroll = () => {
          lastY = window.scrollY;
          if (!ticking) {
            window.requestAnimationFrame(() => {
              parallaxLayer.style.transform = `translate3d(0, ${lastY * 0.15}px, 0)`;
              ticking = false;
            });
            ticking = true;
          }
        };
        document.addEventListener('scroll', onScroll, { passive: true });
      }
      if (heroName) {
        const tilt = (e) => {
          const rect = heroName.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          heroName.style.transform = `perspective(900px) rotateY(${x*6}deg) rotateX(${ -y*6}deg) translateZ(4px)`;
          heroName.style.textShadow = `${-x*12}px ${y*12}px 22px rgba(0,0,0,0.55)`;
        };
        const resetTilt = () => { heroName.style.transform=''; heroName.style.textShadow=''; };
        heroName.addEventListener('mousemove', tilt);
        heroName.addEventListener('mouseleave', resetTilt);
      }
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
    const list = document.getElementById('skills-filter');
    const grid = document.getElementById('skills-grid');
    if (!list || !grid) return;

  const wrapper = list.closest('.skills-filter-wrap');
  const pebble = list.querySelector('.skills-pebble');
  const live = document.getElementById('skills-live');
    const items = Array.from(list.querySelectorAll('li[data-filter]'));
    const chips = Array.from(grid.querySelectorAll('.skill-chip'));

    const setFilter = (cat) => {
      let count = 0;
      chips.forEach(chip => {
        const show = chip.dataset.cat === cat;
        chip.style.display = show ? '' : 'none';
        if (show) count++;
      });
      if (live) live.textContent = `Showing ${count} ${cat} skill${count===1?'':'s'}`;
    };

    const movePebble = (li) => {
      if (!pebble || !wrapper || !li) return;
      const x = li.offsetLeft;
      const y = li.offsetTop;
      const r = li.getBoundingClientRect();
      pebble.style.setProperty('--sx', `${x}px`);
      pebble.style.setProperty('--sy', `${y}px`);
      pebble.style.width = `${r.width}px`;
      pebble.style.height = `${r.height}px`;
    };

    const activate = (li, focus = false) => {
      if (!li) return;
      items.forEach(el => el.classList.remove('active'));
      li.classList.add('active');
      movePebble(li);
      setFilter(li.getAttribute('data-filter'));
      try { localStorage.setItem('skillsFilter', li.getAttribute('data-filter')); } catch(_){ }
      // Auto-center active item on mobile small screens when horizontally scrollable
      if (window.innerWidth < 576) {
        try {
          const listRect = list.getBoundingClientRect();
          const liRect = li.getBoundingClientRect();
          const delta = (liRect.left + liRect.width/2) - (listRect.left + listRect.width/2);
          list.scrollBy({ left: delta, behavior: 'smooth' });
        } catch(_){}
      }
      if (focus) li.focus();
    };

    items.forEach(li => {
      li.addEventListener('click', () => activate(li));
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(li, true); }
      });
    });

    // Edge shadow helper
    const updateEdgeShadows = () => {
      if (!wrapper) return;
      const scrollLeft = list.scrollLeft;
      const max = list.scrollWidth - list.clientWidth - 1;
      wrapper.classList.toggle('has-left', scrollLeft > 4);
      wrapper.classList.toggle('has-right', scrollLeft < max);
    };
    list.addEventListener('scroll', updateEdgeShadows, { passive:true });

  let stored = null; try { stored = localStorage.getItem('skillsFilter'); } catch(_){ }
  let initial = null;
  if (stored) { initial = items.find(li => li.getAttribute('data-filter') === stored) || null; }
  if (!initial) initial = list.querySelector('li.active') || items[0];
  if (initial) activate(initial);
  updateEdgeShadows();
    window.addEventListener('resize', () => {
      const act = list.querySelector('li.active');
      if (act) movePebble(act);
    }, { passive: true });
    window.addEventListener('load', () => {
      const act = list.querySelector('li.active');
      if (act) movePebble(act);
    });

    // --- Free-drag pebble feature (restored) ---
    if (pebble && items.length) {
      let pebbleDragging = false;
      let startX = 0;
      let pebbleStartLeft = 0;
      const positions = () => items.map(li => ({ li, x: li.offsetLeft + li.offsetWidth/2 }));
      let centers = positions();
      const refreshCenters = () => { centers = positions(); };
      window.addEventListener('resize', refreshCenters, { passive:true });

      const setPebbleRaw = (xPx) => {
        const maxX = list.scrollWidth - pebble.offsetWidth - 4;
        const clamped = Math.max(0, Math.min(xPx, maxX));
        pebble.style.transform = `translate(${clamped}px, var(--sy,0))`;
      };
      const nearest = (xPx) => {
        const mid = xPx + pebble.offsetWidth/2;
        return centers.reduce((a,c) => Math.abs(c.x - mid) < Math.abs(a.x - mid) ? c : a, centers[0]).li;
      };
      const startPebble = (clientX) => {
        pebbleDragging = true;
        startX = clientX;
        refreshCenters();
        // current translateX
        const m = getComputedStyle(pebble).transform.match(/matrix\(([^)]+)\)/);
        pebbleStartLeft = 0;
        if (m) { const parts = m[1].split(','); pebbleStartLeft = parseFloat(parts[4]) || 0; }
        pebble.style.transition = 'none';
        list.classList.add('dragging');
      };
      const movePebbleDrag = (clientX) => {
        if (!pebbleDragging) return;
        const delta = clientX - startX;
        setPebbleRaw(pebbleStartLeft + delta);
      };
      const endPebble = () => {
        if (!pebbleDragging) return;
        pebbleDragging = false;
        list.classList.remove('dragging');
        pebble.style.transition = '';
        let tx = 0; const m = getComputedStyle(pebble).transform.match(/matrix\(([^)]+)\)/); if (m) { const parts = m[1].split(','); tx = parseFloat(parts[4]) || 0; }
        const targetLi = nearest(tx);
        pebble.classList.add('snap'); setTimeout(()=>pebble.classList.remove('snap'), 400);
        activate(targetLi);
      };

      // Inertia scroll for bar (separate from pebble drag)
      let barDragging = false; let lastX=0; let vel=0; let frame=0;
      const momentum = () => {
        if (Math.abs(vel) < .12) { cancelAnimationFrame(frame); return; }
        list.scrollLeft -= vel; vel *= 0.92; updateEdgeShadows(); frame = requestAnimationFrame(momentum);
      };
      const startBar = (x) => { barDragging = true; lastX = x; vel=0; cancelAnimationFrame(frame); };
      const moveBar = (x) => { if (!barDragging) return; const dx = x - lastX; lastX = x; list.scrollLeft -= dx; vel = dx; updateEdgeShadows(); };
      const endBar = () => { if (!barDragging) return; barDragging=false; momentum(); };

      // Distinguish pebble drag vs bar drag: if pointer starts over pebble bounding rect, treat as pebble drag
      const isOverPebble = (clientX, clientY) => {
        const r = pebble.getBoundingClientRect();
        return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
      };

      list.addEventListener('pointerdown', (e) => {
        if (e.button!==0) return;
        if (isOverPebble(e.clientX, e.clientY)) startPebble(e.clientX); else startBar(e.clientX);
      });
      window.addEventListener('pointermove', (e) => { movePebbleDrag(e.clientX); moveBar(e.clientX); });
      window.addEventListener('pointerup', () => { endPebble(); endBar(); }, { passive:true });
      window.addEventListener('pointercancel', () => { endPebble(); endBar(); }, { passive:true });
      list.addEventListener('touchstart', (e) => { if (e.touches.length!==1) return; const t=e.touches[0]; if (isOverPebble(t.clientX, t.clientY)) startPebble(t.clientX); else startBar(t.clientX); }, { passive:true });
      window.addEventListener('touchmove', (e) => { if (e.touches.length!==1) return; const t=e.touches[0]; movePebbleDrag(t.clientX); moveBar(t.clientX); }, { passive:true });
      window.addEventListener('touchend', () => { endPebble(); endBar(); }, { passive:true });
      window.addEventListener('touchcancel', () => { endPebble(); endBar(); }, { passive:true });
    }
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

      // Improve first-load layout: relayout after images load and a short delay
      const relayout = () => { try { portfolioIsotope.layout(); AOS.refresh(); } catch(e){} };
      const imgs = portfolioContainer.querySelectorAll('img');
      imgs.forEach(img => {
        if (img.complete) return;
        img.addEventListener('load', relayout, { once: true });
      });
      setTimeout(relayout, 120);
      setTimeout(relayout, 400);
      setTimeout(relayout, 900);
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

      // Center arrows vertically relative to the visible slider area (works with or without images)
      const wrapper = document.querySelector('.cert-slider-wrapper');
      const positionArrows = () => {
        if (!wrapper) return;
        const host = certSwiperEl;
        const h = (host && host.clientHeight) ? host.clientHeight : wrapper.clientHeight;
        const centerY = Math.round((h || 0) / 2);
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
  // Recalc even without images
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
   * Hero micro-interactions: 3D tilt on name + gentle parallax layer
   */
  (function initHeroTilt() {
    const hero = document.querySelector('#hero');
    if (!hero) return;
    const nameEl = hero.querySelector('.hero-name');
    const parallax = hero.querySelector('.parallax-layer');
    if (!nameEl && !parallax) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let rafId = 0;
    let bounds = null;
    const maxTilt = 8; // deg
    const maxParallax = 12; // px

    const compute = (x, y) => {
      if (!bounds) bounds = hero.getBoundingClientRect();
      const cx = bounds.left + bounds.width / 2;
      const cy = bounds.top + bounds.height / 2;
      const dx = (x - cx) / (bounds.width / 2);
      const dy = (y - cy) / (bounds.height / 2);
      const tiltX = (+dy * maxTilt);
      const tiltY = (-dx * maxTilt);
      const px = (-dx * maxParallax);
      const py = (-dy * maxParallax);
      return { tiltX, tiltY, px, py };
    };

    const apply = (vals) => {
      if (nameEl) {
        nameEl.classList.add('tilted');
        nameEl.style.transform = `perspective(600px) rotateX(${vals.tiltX.toFixed(2)}deg) rotateY(${vals.tiltY.toFixed(2)}deg)`;
      }
      if (parallax) {
        parallax.style.transform = `translate3d(${vals.px.toFixed(1)}px, ${vals.py.toFixed(1)}px, 0)`;
      }
    };

    const onMove = (clientX, clientY) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => apply(compute(clientX, clientY)));
    };

    const onPointerMove = (e) => {
      const pt = e.touches ? e.touches[0] : e;
      onMove(pt.clientX, pt.clientY);
    };

    const reset = () => {
      cancelAnimationFrame(rafId);
      if (nameEl) {
        nameEl.classList.remove('tilted');
        nameEl.style.transform = '';
      }
      if (parallax) parallax.style.transform = '';
    };

    hero.addEventListener('mousemove', onPointerMove, { passive: true });
    hero.addEventListener('touchmove', onPointerMove, { passive: true });
    hero.addEventListener('mouseleave', reset, { passive: true });
    hero.addEventListener('touchend', reset, { passive: true });
    window.addEventListener('resize', () => { bounds = null; }, { passive: true });
  })();

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

  /**
   * Project Detail Modal (custom implementation)
   * Enhances .project-card elements (inside portfolio) with rich detail view.
   * - Extracts title, category, snippet meta (problem/approach/outcome) from DOM & data-* attributes
   * - Attempts to find two representative images (primary = current img, secondary = lightbox target or fallback)
   * - Accessible focus trap, ESC & backdrop close, inert background scroll lock
   */
  (function initProjectModal(){
    const modal = document.getElementById('project-modal');
    if(!modal) return; // Graceful if markup removed
  const dialog = modal.querySelector('.project-modal-dialog');
  const btnClose = modal.querySelector('.project-modal-close');
    const pmTitle = modal.querySelector('.pm-title');
    const pmCategory = modal.querySelector('.pm-category');
    const pmDesc = modal.querySelector('.pm-description');
    const pmLinks = modal.querySelector('.pm-links');
    const pmImgPrimary = modal.querySelector('.pm-primary-media img');

  let activeTrigger = null;
  let lastFocus = null;
  let isOpen = false;
  // Guard to ignore stray clicks that may bubble during the opening click
  let ignoreModalClicks = false;
  // Cleanup timer and listener references to ensure unlockScroll runs
  let closeCleanupTimer = null;
  let closeTransitionListener = null;

    const scrollBarComp = () => window.innerWidth - document.documentElement.clientWidth;
    const lockScroll = () => {
      const sb = scrollBarComp();
      document.documentElement.style.setProperty('--sbw', sb + 'px');
      document.body.style.overflow = 'hidden';
      if(sb>0) document.body.style.paddingRight = sb + 'px';
    };
    const unlockScroll = () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.removeProperty('--sbw');
    };

    const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const getFocusable = () => Array.from(modal.querySelectorAll(focusableSelectors)).filter(el => el.offsetParent !== null);

    const trapFocus = (e) => {
      if(!isOpen) return;
      if(e.key !== 'Tab') return;
      const focusables = getFocusable();
      if(!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length-1];
      if(e.shiftKey && document.activeElement === first){
        e.preventDefault();
        last.focus();
      } else if(!e.shiftKey && document.activeElement === last){
        e.preventDefault();
        first.focus();
      }
    };

    const closeModal = () => {
      if(!isOpen) return;
      isOpen = false;
      // Add closing class to run reverse animation
      dialog.classList.remove('pm-opening');
      dialog.classList.add('pm-closing');
      modal.setAttribute('aria-hidden','true');

      // Cleanup handler (shared between transitionend and timeout fallback)
      const onFinish = (e) => {
        // If called from transitionend ensure target matches dialog
        if(e && e.target && e.target !== dialog) return;
        // Clear any pending fallback timer or listener
        if(closeCleanupTimer){ clearTimeout(closeCleanupTimer); closeCleanupTimer = null; }
        if(closeTransitionListener){ dialog.removeEventListener('transitionend', closeTransitionListener); closeTransitionListener = null; }
        // Final cleanup
        try { dialog.classList.remove('pm-closing', 'pm-open'); } catch(_){}
        try { modal.classList.remove('active'); } catch(_){}
        try { unlockScroll(); } catch(_){}
        try { document.removeEventListener('keydown', onKey); } catch(_){}
        try { document.removeEventListener('keydown', trapFocus, true); } catch(_){}
        if(lastFocus) { setTimeout(()=> { try { lastFocus.focus(); } catch(_){} }, 30); }
      };

      // Attach listener and also set a fallback timeout in case transitionend never fires
      closeTransitionListener = onFinish;
      dialog.addEventListener('transitionend', closeTransitionListener);
      // Fallback: ensure cleanup after reasonable timeout
      closeCleanupTimer = setTimeout(()=> { try { onFinish({ target: dialog }); } catch(_){} }, 500);
    };

    const sanitize = (str) => {
      const div = document.createElement('div');
      div.textContent = str || '';
      return div.innerHTML;
    };

    const openModal = (card) => {
      activeTrigger = card;
      lastFocus = document.activeElement;
      // Title & category
      const titleEl = card.querySelector('.project-title'); 
      const catEl = card.querySelector('.project-meta');
      pmTitle.textContent = titleEl ? titleEl.textContent.trim() : 'Project';
      pmCategory.textContent = catEl ? catEl.textContent.trim() : '';
      const longDesc = card.getAttribute('data-description') || '';
      if(longDesc.includes('||')){
        const parts = longDesc.split('||').map(p=>sanitize(p.trim())).filter(Boolean);
        const list = `<ul class="pm-bullets">${parts.map(p=>`<li>${p}</li>`).join('')}</ul>`;
        pmDesc.innerHTML = list;
      } else {
        pmDesc.innerHTML = `<p class="mb-2">${sanitize(longDesc)}</p>`;
      }

      // Images
      const imgEl = card.querySelector('img');
      const primarySrc = imgEl ? imgEl.getAttribute('src') : '';
      const primaryAlt = imgEl ? imgEl.getAttribute('alt') : 'Project primary image';
      if(pmImgPrimary){
        // Try to ensure image is loaded/decoded before showing modal to avoid paint-on-hover issues
        try {
          const pre = new Image();
          pre.src = primarySrc;
          pre.decode && pre.decode().catch(()=>{});
          pre.onload = () => {
            pmImgPrimary.src = primarySrc;
            pmImgPrimary.alt = primaryAlt;
          };
          // In case onload doesn't fire (cached), set immediately
          if(pre.complete){ pmImgPrimary.src = primarySrc; pmImgPrimary.alt = primaryAlt; }
        } catch(e){ pmImgPrimary.src = primarySrc; pmImgPrimary.alt = primaryAlt; }
      }

      // Links
      pmLinks.innerHTML = '';
      const ext = card.querySelector('.project-ext');
      if(ext && ext.getAttribute('href') && ext.getAttribute('href') !== '#'){
        const a = document.createElement('a');
        a.className = 'btn btn-sm btn-outline-primary';
        a.href = ext.getAttribute('href');
        a.target = '_blank';
        a.rel = 'noopener';
        a.innerHTML = '<i class="bi bi-github me-1"></i>GitHub';
        pmLinks.appendChild(a);
      }
      
      // Add close button to links area
      const closeBtn = document.createElement('button');
      closeBtn.className = 'btn btn-sm btn-secondary';
      closeBtn.type = 'button';
      closeBtn.setAttribute('data-close', 'pm');
      closeBtn.innerHTML = '<i class="bi bi-x-lg me-1"></i>Close';
      pmLinks.appendChild(closeBtn);

  // If a previous close cleanup is pending, clear it to avoid double cleanup
  if(closeCleanupTimer){ clearTimeout(closeCleanupTimer); closeCleanupTimer = null; }
  if(closeTransitionListener){ dialog.removeEventListener('transitionend', closeTransitionListener); closeTransitionListener = null; }
  // Show with animation classes
  dialog.classList.remove('pm-closing');
  dialog.classList.add('pm-opening');
  // Prevent the click that triggered open from immediately closing the modal
  ignoreModalClicks = true;
  setTimeout(()=> { ignoreModalClicks = false; }, 350);
  // Ensure any stale scroll lock is cleared before locking again
  try { unlockScroll(); } catch(_){}
  modal.classList.add('active');
      // Allow next frame then switch to open state so transition runs
      requestAnimationFrame(()=>{
        dialog.classList.remove('pm-opening');
        dialog.classList.add('pm-open');
      });
      modal.setAttribute('aria-hidden','false');
      lockScroll();
      isOpen = true;
      setTimeout(()=> {
        // Focus first meaningful element
        if(pmTitle) pmTitle.setAttribute('tabindex','-1');
        pmTitle && pmTitle.focus();
      }, 30);
      document.addEventListener('keydown', onKey);
      document.addEventListener('keydown', trapFocus, true);
    };

    const onKey = (e) => {
      if(e.key === 'Escape') { e.preventDefault(); closeModal(); }
    };

    // Click binding on project cards
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      // Make card accessible by keyboard
      card.setAttribute('tabindex','0');
      card.addEventListener('click', (e) => {
        // Avoid conflict if user clicked explicit lightbox link
        const a = e.target.closest('a');
        if(a && (a.classList.contains('portfolio-lightbox') || a.classList.contains('project-ext'))) return; // let default
        e.preventDefault();
        openModal(card);
      });
      card.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); }
      });
    });

    // Close triggers
    modal.addEventListener('click', (e) => {
      // If we just opened the modal, ignore residual click events for a short window
      if(ignoreModalClicks) return;
      const closer = e.target && (e.target.getAttribute && e.target.getAttribute('data-close') === 'pm');
      if(closer) {
        e.preventDefault();
        closeModal();
      }
    });
    if(btnClose){
      btnClose.addEventListener('click', (e)=> { e.preventDefault(); closeModal(); });
    }
  })();

  /** Timeline card external links (experience) */
  (function bindTimelineLinks(){
    const items = document.querySelectorAll('.timeline-item[data-link]');
    items.forEach(item => {
      const url = item.getAttribute('data-link');
      if(!url) return;
      const card = item.querySelector('.timeline-card');
      if(!card) return;
      card.classList.add('has-link');
      card.setAttribute('role','button');
      card.setAttribute('tabindex','0');
      card.setAttribute('aria-label', 'Open external document in new tab');
      const open = () => window.open(url,'_blank','noopener');
      card.addEventListener('click', (e)=>{ e.preventDefault(); open(); });
      card.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); open(); }});
    });
  })();

  /** Debounce utility function */
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  /** Timeline vertical line precise origin */
  (function timelineOriginManager(){
    const styleId = 'timeline-origin-style';
    if(!document.getElementById(styleId)){
      const s = document.createElement('style');
      s.id = styleId;
      s.textContent = `.timeline:before, .timeline-column:before{ top: var(--timeline-top, 10px); }`;
      document.head.appendChild(s);
    }

    const calcForTimeline = (timeline) => {
      const firstMarker = timeline.querySelector('.timeline-item .timeline-marker');
      if(!firstMarker) return;
      const tlRect = timeline.getBoundingClientRect();
      const markerRect = firstMarker.getBoundingClientRect();
  // Align the line to the vertical center of the first marker circle
  const visualNudge = 0; // small positive values can nudge the line down if needed
  // Extend the line upwards so it reaches the outer edge of the marker circle
  // Try to read the marker's border width from computed styles; fall back to 3px (CSS default)
  let markerBorder = 3;
  try {
    const cs = window.getComputedStyle(firstMarker);
    const bw = cs.getPropertyValue('border-top-width');
    if(bw) markerBorder = parseInt(bw, 10) || markerBorder;
  } catch(e){}

  // Set the top of the line to marker's top minus its border so the vertical line begins where the circular dot starts
  const offset = Math.max(0, Math.round(markerRect.top - tlRect.top - markerBorder + visualNudge));
      timeline.style.setProperty('--timeline-top', offset + 'px');
      // Optional visual debug helper (enable by running in console:
      // localStorage.setItem('timelineDebug','1'); location.reload(); )
      try{
        const debugOn = String(localStorage.getItem('timelineDebug')) === '1';
        if(debugOn){
          console.log('timeline-debug', { markerTop: markerRect.top, timelineTop: tlRect.top, markerBorder, offset });
          let dbg = timeline.querySelector('.__timeline_debug_bar');
          if(!dbg){ dbg = document.createElement('div'); dbg.className = '__timeline_debug_bar'; dbg.setAttribute('aria-hidden','true'); timeline.appendChild(dbg); }
          dbg.style.position = 'absolute'; dbg.style.left = '0'; dbg.style.right = '0'; dbg.style.height = '2px'; dbg.style.background = 'rgba(255,0,0,0.7)'; dbg.style.top = offset + 'px'; dbg.style.zIndex = '9999'; dbg.style.pointerEvents = 'none';
        }
      } catch(e){}
      // also set on columns as fallback
      const cols = timeline.querySelectorAll('.timeline-column');
      cols.forEach(col => col.style.setProperty('--timeline-top', offset + 'px'));
    };

    const calcAll = () => {
      const timelines = document.querySelectorAll('.timeline');
      timelines.forEach(tl => calcForTimeline(tl));
    };

    const recalc = debounce(calcAll, 120);
    window.addEventListener('resize', recalc, { passive:true });
    
    // Immediate calculation on load
    window.addEventListener('load', calcAll);
    document.addEventListener('DOMContentLoaded', calcAll);

    // Wait for logos/images to load in each timeline before calculating
    const timelines = Array.from(document.querySelectorAll('.timeline'));
    let pendingTimelines = timelines.length;
    if(!pendingTimelines){ calcAll(); return; }
    timelines.forEach(tl => {
      const imgs = Array.from(tl.querySelectorAll('.tl-logo img'));
      if(imgs.length === 0){ if(--pendingTimelines===0) calcAll(); return; }
      let pending = imgs.length;
      imgs.forEach(img => {
        if(img.complete){ if(--pending===0 && --pendingTimelines===0) calcAll(); }
        else {
          img.addEventListener('load', ()=>{ if(--pending===0 && --pendingTimelines===0) calcAll(); }, { once:true });
          img.addEventListener('error', ()=>{ if(--pending===0 && --pendingTimelines===0) calcAll(); }, { once:true });
        }
      });
    });
    // Extra safety: run calculation again after short delays to catch layout shifts
    setTimeout(calcAll, 250);
    setTimeout(calcAll, 800);

    // Watch for DOM/layout changes in timelines and recalc when they occur
    try{
      const mo = new MutationObserver(debounce(calcAll, 120));
      timelines.forEach(tl => mo.observe(tl, { attributes: true, childList: true, subtree: true }));
      // Small guard: if body changes significantly (class toggles) recalc as well
      mo.observe(document.body, { attributes: true, childList: false, subtree: false });
    } catch(e){}
  })();

  /**
   * Intersection-based image prefetch for project cards
   * Upgrades fetchPriority and triggers a low priority fetch when cards approach viewport
   */
  (function prefetchProjectImages(){
    if(!('IntersectionObserver' in window)) return;
    const cards = document.querySelectorAll('.project-card img');
    const opts = { root:null, rootMargin:'200px 0px', threshold:0.01 };
    const seen = new WeakSet();
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const img = entry.target;
          if(!seen.has(img)){
            try { img.loading = 'eager'; img.fetchPriority = 'high'; } catch(_){}
            // Create a prefetch link for potential larger version if data-secondary exists
            const card = img.closest('.project-card');
            const second = card && card.getAttribute('data-secondary');
            if(second){
              const link = document.createElement('link');
              link.rel = 'prefetch';
              link.as = 'image';
              link.href = second;
              document.head.appendChild(link);
            }
            seen.add(img);
          }
          io.unobserve(img);
        }
      })
    }, opts);
    cards.forEach(img => io.observe(img));
  })();
  // Eagerly decode project card images on DOMContentLoaded to avoid hover-triggered paints
  window.addEventListener('DOMContentLoaded', () => {
    try{
      const imgs = Array.from(document.querySelectorAll('.project-card img'));
      imgs.forEach(img => {
        // If image has data-src (lazy) swap it first
        if(img.dataset && img.dataset.src){ img.src = img.dataset.src; }
        try{
          // Hint browser to prioritize visible images
          img.loading = img.loading === 'lazy' ? 'eager' : img.loading;
        } catch(_){}
        // Attempt to decode so it's painted when needed
        if(img.decode) img.decode().catch(()=>{});
      });
    }catch(e){}
  });

  /** Performance optimizations and error handling */
  (function optimizeAndHandleErrors(){
    // Add passive event listeners for better scroll performance
    const addPassiveListener = (element, event, callback) => {
      element.addEventListener(event, callback, { passive: true });
    };

    // Optimize scroll-based animations
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      }, { threshold: 0.1 });

      // Observe elements that benefit from scroll optimization
      document.querySelectorAll('.portfolio-item, .timeline-item, .cert-card').forEach(el => {
        observer.observe(el);
      });
    }

    // Error boundary for critical functions
    window.addEventListener('error', function(e) {
      console.warn('Non-critical error caught:', e.error);
      // Continue execution - don't break the site
    });

    // Preload critical resources on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Preload next section images when browser is idle
        document.querySelectorAll('img[data-src]').forEach(img => {
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
        });
      });
    }
  })();

})()
