(function(){
  var body = null;
  var topThreshhold = 100; //px
  var animation = null;
  var duration = null; // ms
  var customDuration = false;
  var startTime = null;
  var startPosition = null;
  var backToTopping = false;

  function ready(fn) {
    if (document.readyState != 'loading') {
      fn()
    } else {
      document.addEventListener('DOMContentLoaded', fn)
    }
  };

  function extend(target, source) {
    for (var key in source) {
      if (!(key in target)) {
        target[key] = source[key];
      }
    }
    return target;
  };

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t -2) - 1) + b;
  };

  function extendParameters(options, defaults){
    for (var option in defaults) {
      var t = options[option] === undefined && typeof option !== 'function';
      if (t) {
        options[option] = defaults[option];
      }
    }
    return options;
  }

  function animateLoop(time) {
    if (!startTime) {
      startTime = time;
    }

    var timeSoFar = time - startTime;
    var easedPosition = easeInOutQuad(timeSoFar, startPosition, -startPosition, duration);

    window.scrollTo(0, easedPosition);

    if (timeSoFar < duration) {
      animation = requestAnimationFrame(animateLoop);
    } else {
      animationFinished();
    }
   };

  function backToTop() {
    if (backToTopping) {
      return;
    }

    backToTopping = true;
    startPosition = (document.documentElement.scrollTop || body.scrollTop);

    if (!customDuration) {
      duration = startPosition / 2;
    }

    requestAnimationFrame(animateLoop);
  }

  function resetPositions() {
    startTime = null;
    startPosition = null;
    backToTopping = false;
  }

  function animationFinished() {
    resetPositions();
  }

  function onWindowBlur() {
    if (backToTopping) {
      cancelAnimationFrame(animation);
      resetPositions();
      window.scrollTo(0, 0);
    }
  }

  function bindElevateToElement(element) {
    element.addEventListener('click', backToTop, false);
  }

  function main(options) {
    body = document.body;

    var defaults = {
      duration: undefined
    };

    options = extendParameters(options, defaults);

    if (options.element) {
      bindElevateToElement(options.element);
    }

    if (options.duration) {
      customDuration = true;
      duration = options.duration;
    }

    window.addEventListener('blur', onWindowBlur, false);

    window.addEventListener('scroll', function(){
      if (window.scrollY > topThreshhold) {
        options.element.setAttribute('show', 'true');
      } else {
        options.element.setAttribute('show', 'false');
      }
    });
  }

  var BackToTop = extend(main, {
    backToTop: backToTop
  });

  ready(function(){
    var button = document.createElement('button');
    var text = document.createElement('text');

    button.className = 'eager-back-to-top-button';
    button.appendChild(text);

    document.body.appendChild(button);

    new BackToTop({
      element: button
    });
  });
})();
