//= require_tree .
//= require particles.js/particles.js
//= require walkway.js/src/walkway.js

(function() {
  var svg = new Walkway({
    selector: '#jar',
    duration: 1000,
    easing: 'easeOutCubic'
  });

  particlesJS.load('particles-js', '/javascripts/particles.json', function() {
    var heroIcon = document.querySelector('.hero__icon');
    setTimeout(function() {
      heroIcon.classList.add('active');
      svg.draw(function() {
        document.querySelector('.hero').classList.add('active');
      });
    }, 100);
  });
})();