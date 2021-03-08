//= require jquery-smooth-scroll/jquery.smooth-scroll
//= require fastclick/lib/fastclick.js
//= require particles.js/particles.js
//= require scrollspy/build/scrollspy.js
//= require_tree ./components

(function($) {
  var path = window.location.pathname;
  var bodyClass = document.body.classList[0];
  var activeLink = document.querySelector('.menu a[href="' + path + '"], .menu a[href*="' + bodyClass + '"]');

  FastClick.attach(document.body);

  $('.docs-toc a').smoothScroll({ offset: -90 });

  if (activeLink) {
    activeLink.classList.add('active');
  }

  if (document.querySelector('#jar')) {
    particlesJS.load('particles-js', '/javascripts/particles.json');
  }
})(jQuery);
