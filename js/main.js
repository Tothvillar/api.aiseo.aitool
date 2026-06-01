// ===== AI工具评测站 - 暗黑科技风 JS =====
(function() {
  'use strict';

  // === 打字机效果 ===
  function initTypewriter() {
    const el = document.querySelector('.typewriter');
    if (!el) return;
    const texts = JSON.parse(el.dataset.texts || '["发掘2026年最值得使用的AI工具"]');
    const cursor = el.querySelector('.cursor');
    let textIdx = 0, charIdx = 0, isDeleting = false;
    
    function type() {
      const current = texts[textIdx];
      if (isDeleting) {
        el.childNodes[0] && (el.childNodes[0].textContent = current.substring(0, charIdx - 1));
        charIdx--;
      } else {
        if (!el.childNodes[0]) el.insertBefore(document.createTextNode(''), cursor);
        el.childNodes[0].textContent = current.substring(0, charIdx + 1);
        charIdx++;
      }
      
      let speed = isDeleting ? 40 : 80;
      if (!isDeleting && charIdx === current.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        textIdx = (textIdx + 1) % texts.length;
        speed = 500;
      }
      setTimeout(type, speed);
    }
    type();
  }

  // === 粒子系统 ===
  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      const hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * 0.6 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '0,240,255' : '180,78,255';
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y > canvas.height + 10) this.reset();
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
      }
    }

    resize();
    for (let i = 0; i < 90; i++) {
      particles.push(new Particle());
    }
    window.addEventListener('resize', resize);

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    }
    animate();
  }

  // === 卡片入场动画 ===
  function initScrollReveal() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      document.querySelectorAll('.tool-card, .article-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease ${i * 0.05}s`;
        observer.observe(card);
      });

      // Reveal cards that are already visible on load
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.querySelectorAll('.tool-card:not([style*="opacity: 1"]), .article-card:not([style*="opacity: 1"])').forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }
          });
        });
      });
    }
  }

  // === 分类筛选（事件委托） ===
  function initCategoryFilter() {
    const tagsContainer = document.querySelector('.categories');
    if (!tagsContainer) return;
    
    tagsContainer.addEventListener('click', function(e) {
      const tag = e.target.closest('.cat-tag');
      if (!tag) return;
      
      const cat = tag.dataset.category;
      if (!cat) return;
      
      // Toggle active class on all tags
      tagsContainer.querySelectorAll('.cat-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      
      // Filter cards
      document.querySelectorAll('.tool-card').forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // === 搜索 ===
  function initSearch() {
    const input = document.getElementById('toolSearch');
    if (!input) return;
    input.addEventListener('input', function() {
      const q = this.value.toLowerCase();
      document.querySelectorAll('.tool-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = q && !text.includes(q) ? 'none' : '';
      });
    });
  }

  // === 鼠标光晕跟随 ===
  function initMouseGlow() {
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    document.addEventListener('mousemove', (e) => {
      styleEl.textContent = `body::after { opacity: 0.6; background: radial-gradient(ellipse 600px 400px at ${e.clientX}px ${e.clientY}px, rgba(0,240,255,0.04), transparent 80%); }`;
    });
  }

  // === 启动 ===
  document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initParticles();
    initScrollReveal();
    initCategoryFilter();
    initSearch();
    initMouseGlow();
  });
})();