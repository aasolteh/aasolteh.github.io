(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- reveal on scroll ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if(revealEls.length){
    if(!reduced && 'IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.14 });
      revealEls.forEach(function(el){ io.observe(el); });
    } else {
      revealEls.forEach(function(el){ el.classList.add('in'); });
    }
  }

  /* ---- count-up stats ---- */
  var stats = document.querySelectorAll('.metro-stat .num[data-count]');
  if(stats.length){
    var counted = false;
    function countUp(){
      if(counted) return; counted = true;
      stats.forEach(function(el){
        var target = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        if(reduced || isNaN(target)){ el.textContent = target + suffix; return; }
        var start = null, dur = 1100;
        function step(ts){
          if(!start) start = ts;
          var p = Math.min(1, (ts - start) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if(p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
    var statsWrap = document.querySelector('.metro-stats');
    if(statsWrap && 'IntersectionObserver' in window){
      var io2 = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ countUp(); io2.disconnect(); } });
      }, { threshold: 0.4 });
      io2.observe(statsWrap);
    } else if(statsWrap){ countUp(); }
  }

  /* ---- hero field: a random-dot kinematogram ----
     A nod to the motion-coherence displays used in vision-science
     experiments — most dots drift randomly (noise), a minority share
     one heading (signal). */
  var canvas = document.querySelector('.metro-hero__field');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W, H, dots = [];
  var COUNT = 130;
  var COHERENCE = 0.16;
  var DRIFT_ANGLE = -0.32;

  function resize(){
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = [];
    for(var i = 0; i < COUNT; i++){
      var signal = Math.random() < COHERENCE;
      dots.push({
        x: Math.random() * W,
        y: Math.random() * H,
        signal: signal,
        angle: signal ? DRIFT_ANGLE : Math.random() * Math.PI * 2,
        speed: signal ? 0.55 : (0.25 + Math.random() * 0.35),
        r: signal ? 1.6 : 1.2,
        color: signal ? 'cyan' : 'steel'
      });
    }
  }

  function draw(){
    ctx.clearRect(0, 0, W, H);
    dots.forEach(function(d){
      var col = d.color === 'cyan' ? '47,230,208' : '91,100,112';
      ctx.fillStyle = 'rgba(' + col + ',' + (d.color === 'cyan' ? 0.85 : 0.55) + ')';
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();

      if(!reduced){
        if(!d.signal && Math.random() < 0.01){ d.angle = Math.random() * Math.PI * 2; }
        d.x += Math.cos(d.angle) * d.speed;
        d.y += Math.sin(d.angle) * d.speed;
        if(d.x < -4) d.x = W + 4;
        if(d.x > W + 4) d.x = -4;
        if(d.y < -4) d.y = H + 4;
        if(d.y > H + 4) d.y = -4;
      }
    });
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  if(reduced){ draw(); }
  else { (function loop(){ draw(); requestAnimationFrame(loop); })(); }
})();
