// AI工具评测站 - 主脚本
document.addEventListener('DOMContentLoaded', function() {
  // 搜索功能
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function() {
      const query = searchInput.value.trim();
      if (query) {
        alert('搜索功能开发中，即将上线！关键词：' + query);
      }
    });
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') searchBtn.click();
    });
  }

  // 分类筛选
  const catTags = document.querySelectorAll('.cat-tag');
  catTags.forEach(function(tag) {
    tag.addEventListener('click', function() {
      catTags.forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
      const category = this.dataset.category;
      const cards = document.querySelectorAll('.tool-card');
      cards.forEach(function(card) {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 返回顶部
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      backToTop.style.display = window.scrollY > 400 ? 'block' : 'none';
    });
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});