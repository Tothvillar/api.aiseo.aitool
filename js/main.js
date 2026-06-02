// ===== AI工具评测站 - 粉色清新科技风 JS =====
(function() {
  'use strict';

  // === 打字机效果 ===
  function initTypewriter() {
    var el = document.querySelector('.typewriter');
    if (!el) return;
    var texts = JSON.parse(el.dataset.texts || '["发掘2026年最值得使用的AI工具"]');
    var cursor = el.querySelector('.cursor');
    var textIdx = 0, charIdx = 0, isDeleting = false;
    
    function type() {
      var current = texts[textIdx];
      if (isDeleting) {
        el.childNodes[0] && (el.childNodes[0].textContent = current.substring(0, charIdx - 1));
        charIdx--;
      } else {
        if (!el.childNodes[0]) el.insertBefore(document.createTextNode(''), cursor);
        el.childNodes[0].textContent = current.substring(0, charIdx + 1);
        charIdx++;
      }
      
      var speed = isDeleting ? 40 : 80;
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

  // === 卡片入场动画（IntersectionObserver + stagger） ===
  function initScrollReveal() {
    var cards = document.querySelectorAll('.tool-card, .article-card');
    if (!cards.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var card = entry.target;
            var idx = Array.prototype.indexOf.call(cards, card);
            card.style.animation = 'cardReveal 0.5s ease both ' + (idx * 0.08) + 's';
            observer.unobserve(card);
          }
        });
      }, { threshold: 0.1 });

      cards.forEach(function(card) { observer.observe(card); });
    } else {
      // 降级：直接显示
      cards.forEach(function(card, i) {
        card.style.animation = 'cardReveal 0.5s ease both ' + (i * 0.08) + 's';
      });
    }
  }

  // === 分类筛选（事件委托） ===
  function initCategoryFilter() {
    var tagsContainer = document.querySelector('.categories');
    if (!tagsContainer) return;
    
    tagsContainer.addEventListener('click', function(e) {
      var tag = e.target.closest('.cat-tag');
      if (!tag) return;
      
      var cat = tag.dataset.category;
      if (!cat) return;
      
      // Toggle active class
      tagsContainer.querySelectorAll('.cat-tag').forEach(function(t) { t.classList.remove('active'); });
      tag.classList.add('active');
      
      // Filter cards
      document.querySelectorAll('.tool-card').forEach(function(card) {
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
    var input = document.getElementById('toolSearch');
    var btn = document.querySelector('.hero-search button');
    if (!input) return;

    function doSearch() {
      var q = input.value.toLowerCase().trim();
      document.querySelectorAll('.tool-card').forEach(function(card) {
        var text = card.textContent.toLowerCase();
        card.style.display = (!q || text.includes(q)) ? '' : 'none';
      });
    }

    function resetSearch() {
      document.querySelectorAll('.tool-card').forEach(function(card) {
        card.style.display = '';
      });
    }

    if (btn) btn.addEventListener('click', doSearch);
    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') doSearch(); });
    input.addEventListener('input', function() { if (!input.value.trim()) resetSearch(); });
  }

  // === 统计数字滚动 ===
  function initStatCounter() {
    var statNums = document.querySelectorAll('.stat-num');
    if (!statNums.length) return;
    
    function animateCount(el) {
      var text = el.textContent.trim();
      var match = text.match(/^(\d+)([+%]?.*)$/);
      if (!match) return;
      var target = parseInt(match[1]);
      var suffix = match[2];
      var start = performance.now();
      var duration = 800;
      
      function tick(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    
    statNums.forEach(function(n) { observer.observe(n); });
  }

  // === 分区标题下划线展开 ===
  function initSectionTitles() {
    var titles = document.querySelectorAll('.section-title');
    if (!titles.length) return;
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) e.target.classList.add('revealed');
      });
    }, { threshold: 0.6, rootMargin: '0px 0px -40px 0px' });
    titles.forEach(function(t) { observer.observe(t); });
  }

  // === 主题切换 ===
  function initThemeToggle() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var html = document.documentElement;

    function setTheme(light) {
      html.setAttribute('data-theme', light ? 'light' : 'dark');
      btn.textContent = light ? '☀️' : '🌙';
      localStorage.setItem('aitool-theme', light ? 'light' : 'dark');
    }

    btn.addEventListener('click', function() {
      setTheme(html.getAttribute('data-theme') !== 'light');
    });

    // 加载已保存主题
    var saved = localStorage.getItem('aitool-theme');
    if (saved === 'light') setTheme(true);
    else if (saved === 'dark') setTheme(false);
  }

  // === 卡片整体可点击 ===
  function initCardClick() {
    document.addEventListener('click', function(e) {
      var card = e.target.closest('.tool-card');
      if (!card) return;
      var link = card.querySelector('.tool-link');
      if (link) window.location.href = link.getAttribute('href');
    });
  }

  // === 回到顶部 ===
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', function() {
      btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === 文章进度条 ===
  function initReadingProgress() {
    var bar = document.getElementById('readingProgressBar');
    if (!bar) return;

    window.addEventListener('scroll', function() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    });
  }

  // === TOC 高亮 ===
  function initTOCHighlight() {
    var tocLinks = document.querySelectorAll('.toc-sidebar a');
    var headings = document.querySelectorAll('.article-content h2, .article-content h3');
    if (!tocLinks.length || !headings.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          tocLinks.forEach(function(link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-80px 0px -60% 0px' });

    headings.forEach(function(h) { observer.observe(h); });
  }

  // === 启动 ===
  document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initTypewriter();
    initScrollReveal();
    initStatCounter();
    initSectionTitles();
    initCategoryFilter();
    initSearch();
    initCardClick();
    initBackToTop();
    initReadingProgress();
    initTOCHighlight();
  });
})();
