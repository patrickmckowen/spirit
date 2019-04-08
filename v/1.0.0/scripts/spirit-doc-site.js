// DO NOT EDIT: This file is automatically generated by the project's build task
/* eslint-disable */
// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}
/* eslint-enable */

class SpiritDocIconSwatch {
  static init() {
    // Get all the icon swatches
    const iconSwatches = Array.from(document.querySelectorAll('.spirit-doc-icon-swatch'));
    iconSwatches.forEach((s) => {
      SpiritDocIconSwatch.initializeEachSwatch(s);
    });
  }

  static initializeEachSwatch(swatch) {
    swatch.addEventListener('click', () => {
      swatch.classList.remove('spirit-doc-icon-swatch--name-copied');
      SpiritDocIconSwatch.copyIconName(swatch);
    });
  }

  static copyIconName(swatch) {
    const source = swatch.querySelector('.esds-doc-icon-swatch__label');

    if (swatch.querySelector('.spirit-doc-icon-swatch__name-copied-message') === null) {
      const feedbackMessage = document.createElement('span');
      feedbackMessage.textContent = "Icon Name Copied";
      feedbackMessage.classList.add('spirit-doc-icon-swatch__name-copied-message');
      swatch.appendChild(feedbackMessage);
    }

    let textarea = document.createElement('textarea');
    textarea.style.height = '0';
    textarea.style.width = '0';
    textarea.style.position = 'absolute';
    textarea.style.left = '-99999px';
    swatch.appendChild(textarea);

    textarea.textContent = source.textContent.trim();
    textarea.select();

    try {
      var successful = document.execCommand('copy');
      if (successful) {
        swatch.classList.add('spirit-doc-icon-swatch--name-copied');
      } else {
        // Don't show anything
      }
      // var msg = successful ? 'successful' : 'unsuccessful';
    } catch (err) {
      // Don't show anything
    } finally {
      // remove the temp textarea
      swatch.removeChild(textarea);
    }
  }
}

SpiritDocIconSwatch.init();

class SpiritDocSiteNav {
  static init() {
    // Highlight active page based on current window.location
    const siteNav = document.querySelector('.spirit-doc-site-nav');
    const currentUrl = window.location.pathname;
    if (currentUrl !== '/') {
      const activeLink = siteNav.querySelector('a[href*="' + currentUrl + '"]');
      activeLink.classList.add('spirit-doc-site-nav--active-link');
    }
  }
}

// Toggle flyout navigation for doc site
class SpiritDocSiteNavToggle {
  static init() {
    const toggle = document.getElementById('doc-site-nav-toggle');
    const navContain = document.getElementById('doc-site-nav');
    let timeout;

    if (!toggle || !navContain) {
      return;
    }

    const activateNav = function () {
      if (window.matchMedia("(min-width: 1040px)").matches) {
        destroyNav(toggle, navContain);
      } else {
        createNav(toggle, navContain);
      }
    };

    // Close navigation with esc or click outside navigation
    const listenerCloseOpenMenus = function(e) {
      // Open and close nav with 'return'
      if (e.type === 'keyup' && e.keyCode === 13) {
        toggleNav();
      }

      if (document.documentElement.classList.contains('-spirit-no-scroll')) {

        // if the event is keyup and it was the ESC key
        if (e.type === 'keyup' && e.keyCode === 27) {
          toggleNav();

        // If the event was a mouseup or touchend
        } else if (e.type === 'mouseup' || e.type === 'touchend') {
          if (!navContain.contains(e.target) && toggle !== e.target) {
            toggleNav();
          }
        }
      }
		};

    const createNav = function () {
      const toggleExpanded = toggle.getAttribute('aria-expanded');

      if (toggleExpanded) {
        return;
      }

      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', 'doc-site-nav');
      navContain.setAttribute('aria-hidden', 'true');

      toggle.addEventListener('click', toggleNav);

      // Close the menu by clicking off of them or hitting ESC
      document.addEventListener('mouseup', listenerCloseOpenMenus);
      document.addEventListener('touchend', listenerCloseOpenMenus);
      document.addEventListener('keyup', listenerCloseOpenMenus);
    };

    const destroyNav = function () {
      const toggleExpanded = toggle.getAttribute('aria-expanded');

      if (!toggleExpanded) {
        return;
      }

      toggle.removeAttribute('aria-expanded');
      toggle.removeAttribute('aria-controls');
      navContain.removeAttribute('aria-hidden');

      toggle.removeEventListener('click', toggleNav);
    };

    const toggleNav = function () {
      console.log('toggled');
      const expanded = toggle.getAttribute('aria-expanded');
      const firstLink = navContain.querySelectorAll('.spirit-vertical-nav__link')[0];

      if (expanded === 'false') {
        toggle.setAttribute('aria-expanded', 'true');
        navContain.setAttribute('aria-hidden', 'false');
        document.addEventListener('keydown', listenerNavTabFocus);
        document.documentElement.classList.add('-spirit-no-scroll');
      } else {
        toggle.setAttribute('aria-expanded', 'false');
        navContain.setAttribute('aria-hidden', 'true');
        document.removeEventListener('keydown', listenerNavTabFocus);
        document.documentElement.classList.remove('-spirit-no-scroll');
      }
    };

    const listenerNavTabFocus = function (e) {
      if (navContain) {
        const navLinks = navContain.querySelectorAll('.spirit-vertical-nav__link');
        const lastLink = navLinks[navLinks.length - 1];

        if (lastLink === document.activeElement && e.which === 9) {
          e.preventDefault();
          toggle.focus();
        }
      }
    };

    var debounce = function (fn) {
      return function () {
        const self = this;
        const args = arguments;

        if (timeout) {
          window.cancelAnimationFrame(timeout);
        }

        timeout = window.requestAnimationFrame(function () {
          fn.apply(self, args);
        });
      };
    };

    var navDebounce = debounce(function () {
      activateNav(toggle, navContain);
    });

    window.addEventListener('resize', function () {
      navDebounce(toggle, navContain);
    }, false);

    activateNav(toggle, navContain);
  }
}

SpiritDocSiteNav.init();
SpiritDocSiteNavToggle.init();
