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

  // === 卡片入场动画（JS仅负责stagger延迟，可见性由CSS保证） ===
  function initScrollReveal() {
    document.querySelectorAll('.tool-card, .article-card').forEach((card, i) => {
      card.style.animation = `cardReveal 0.5s ease both ${i * 0.06}s`;
    });
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
    initScrollReveal();
    initCategoryFilter();
    initSearch();
    initMouseGlow();
  });
})();