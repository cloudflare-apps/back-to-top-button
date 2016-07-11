"use strict";

(function () {
  if (!window.addEventListener) return; // Check for IE9+

  var topThreshhold = 100; // px
  var animation = null;
  var duration = null; // ms
  var startTime = null;
  var startPosition = null;
  var backToTopping = false;

  var options = INSTALL_OPTIONS;
  var element = void 0;

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  function resetPositions() {
    startTime = null;
    startPosition = null;
    backToTopping = false;
  }

  function animateLoop(time) {
    if (!startTime) startTime = time;

    var timeSoFar = time - startTime;
    var easedPosition = easeInOutQuad(timeSoFar, startPosition, -startPosition, duration);

    window.scrollTo(0, easedPosition);

    if (timeSoFar < duration) {
      animation = requestAnimationFrame(animateLoop);
    } else {
      resetPositions();
    }
  }

  function backToTop() {
    if (backToTopping) return;

    backToTopping = true;
    startPosition = document.documentElement.scrollTop || document.body.scrollTop;
    duration = startPosition / 2;

    requestAnimationFrame(animateLoop);
  }

  function updateElement() {
    element = Eager.createElement({ selector: "body", method: "append" }, element);
    var text = document.createElement("text");

    element.setAttribute("app-id", "back-to-top-button");
    element.appendChild(text);

    element.addEventListener("click", backToTop);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElement);
  } else {
    updateElement();
  }

  window.addEventListener("blur", function () {
    if (!element) return;

    if (backToTopping) {
      cancelAnimationFrame(animation);
      resetPositions();
      window.scrollTo(0, 0);
    }
  });

  window.addEventListener("scroll", function () {
    if (!element) return;

    var visibility = element.getAttribute("visibility");
    var nextVisibility = window.scrollY > topThreshhold ? "visible" : "hidden";

    if (visibility !== nextVisibility) {
      element.setAttribute("visibility", nextVisibility);
    }
  });

  window.INSTALL_SCOPE = {
    setOptions: function setOptions(nextOptions) {
      options = nextOptions;

      updateElement();
    }
  };
})();