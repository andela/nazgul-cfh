// window.bootstrap = function() {
//     angular.bootstrap(document, ['mean']);
// };

// window.init = function() {
//     window.bootstrap();
// };
if (window.location.hash === '#_=_') window.location.hash = '#!';
// $(document).ready(function() {
//     //Fixing facebook bug with redirect


//     //Then init the app
//     window.init();
// });

(function ($) {
  $(() => {
    $('.sidenav').sidenav();
    $('.button-collapse').sideNav();
    $('.parallax').parallax();
  }); // end of document ready
}(jQuery)); // end of jQuery name space
