(function($){
  var $ = jQuery = $;
  window.slate = window.slate || {};
  window.theme = window.theme || {};


/*================ Slate ================*/
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {
  
  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function(array, key, value) {
    var i = array.length;
    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap iframes and tables in div tags to force responsive/scrollable layout.
 *
 * @namespace rte
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    var tableWrapperClass = typeof options.tableWrapperClass === "undefined" ? '' : options.tableWrapperClass;

    options.$tables.wrap('<div class="' + tableWrapperClass + '"></div>');
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    var iframeWrapperClass = typeof options.iframeWrapperClass === "undefined" ? '' : options.iframeWrapperClass;

    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + iframeWrapperClass + '"></div>');
      
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function() {
  var moneyFormat = '${{amount}}';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_space_separator':
        value = formatWithDelimiters(cents, 2, ' ', '.');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, ',', '.');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {

  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
  }

  Variants.prototype = $.extend({}, Variants.prototype, {

    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = $.map($(this.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var type = $element.attr('type');
        var currentOption = {};

        if (type === 'radio' || type === 'checkbox') {
          if ($element[0].checked) {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        }
      });

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = slate.utils.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var found = false;

      variants.forEach(function(variant) {
        var satisfied = true;

        selectedValues.forEach(function(option) {
          if (satisfied) {
            satisfied = (option.value === variant[option.index]);
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found || null;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant, this.product);
      this._updatePrice(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant, product) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {}; 

      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant,
        product : product.images
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param {object} variant - Currently selected variant
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      window.history.replaceState({path: newurl}, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param {object} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container)[0].value = variant.id;
    }
  });

  return Variants;
})();

/*!
handlebars v1.3.0

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
var Handlebars=function(){var e=function(){"use strict";function t(e){this.string=e}var e;t.prototype.toString=function(){return""+this.string};e=t;return e}();var t=function(e){"use strict";function o(e){return r[e]||"&"}function u(e,t){for(var n in t){if(Object.prototype.hasOwnProperty.call(t,n)){e[n]=t[n]}}}function c(e){if(e instanceof n){return e.toString()}else if(!e&&e!==0){return""}e=""+e;if(!s.test(e)){return e}return e.replace(i,o)}function h(e){if(!e&&e!==0){return true}else if(l(e)&&e.length===0){return true}else{return false}}var t={};var n=e;var r={"&":"&","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"};var i=/[&<>"'`]/g;var s=/[&<>"'`]/;t.extend=u;var a=Object.prototype.toString;t.toString=a;var f=function(e){return typeof e==="function"};if(f(/x/)){f=function(e){return typeof e==="function"&&a.call(e)==="[object Function]"}}var f;t.isFunction=f;var l=Array.isArray||function(e){return e&&typeof e==="object"?a.call(e)==="[object Array]":false};t.isArray=l;t.escapeExpression=c;t.isEmpty=h;return t}(e);var n=function(){"use strict";function n(e,n){var r;if(n&&n.firstLine){r=n.firstLine;e+=" - "+r+":"+n.firstColumn}var i=Error.prototype.constructor.call(this,e);for(var s=0;s<t.length;s++){this[t[s]]=i[t[s]]}if(r){this.lineNumber=r;this.column=n.firstColumn}}var e;var t=["description","fileName","lineNumber","message","name","number","stack"];n.prototype=new Error;e=n;return e}();var r=function(e,t){"use strict";function h(e,t){this.helpers=e||{};this.partials=t||{};p(this)}function p(e){e.registerHelper("helperMissing",function(e){if(arguments.length===2){return undefined}else{throw new i("Missing helper: '"+e+"'")}});e.registerHelper("blockHelperMissing",function(t,n){var r=n.inverse||function(){},i=n.fn;if(f(t)){t=t.call(this)}if(t===true){return i(this)}else if(t===false||t==null){return r(this)}else if(a(t)){if(t.length>0){return e.helpers.each(t,n)}else{return r(this)}}else{return i(t)}});e.registerHelper("each",function(e,t){var n=t.fn,r=t.inverse;var i=0,s="",o;if(f(e)){e=e.call(this)}if(t.data){o=m(t.data)}if(e&&typeof e==="object"){if(a(e)){for(var u=e.length;i<u;i++){if(o){o.index=i;o.first=i===0;o.last=i===e.length-1}s=s+n(e[i],{data:o})}}else{for(var l in e){if(e.hasOwnProperty(l)){if(o){o.key=l;o.index=i;o.first=i===0}s=s+n(e[l],{data:o});i++}}}}if(i===0){s=r(this)}return s});e.registerHelper("if",function(e,t){if(f(e)){e=e.call(this)}if(!t.hash.includeZero&&!e||r.isEmpty(e)){return t.inverse(this)}else{return t.fn(this)}});e.registerHelper("unless",function(t,n){return e.helpers["if"].call(this,t,{fn:n.inverse,inverse:n.fn,hash:n.hash})});e.registerHelper("with",function(e,t){if(f(e)){e=e.call(this)}if(!r.isEmpty(e))return t.fn(e)});e.registerHelper("log",function(t,n){var r=n.data&&n.data.level!=null?parseInt(n.data.level,10):1;e.log(r,t)})}function v(e,t){d.log(e,t)}var n={};var r=e;var i=t;var s="1.3.0";n.VERSION=s;var o=4;n.COMPILER_REVISION=o;var u={1:"<= 1.0.rc.2",2:"== 1.0.0-rc.3",3:"== 1.0.0-rc.4",4:">= 1.0.0"};n.REVISION_CHANGES=u;var a=r.isArray,f=r.isFunction,l=r.toString,c="[object Object]";n.HandlebarsEnvironment=h;h.prototype={constructor:h,logger:d,log:v,registerHelper:function(e,t,n){if(l.call(e)===c){if(n||t){throw new i("Arg not supported with multiple helpers")}r.extend(this.helpers,e)}else{if(n){t.not=n}this.helpers[e]=t}},registerPartial:function(e,t){if(l.call(e)===c){r.extend(this.partials,e)}else{this.partials[e]=t}}};var d={methodMap:{0:"debug",1:"info",2:"warn",3:"error"},DEBUG:0,INFO:1,WARN:2,ERROR:3,level:3,log:function(e,t){if(d.level<=e){var n=d.methodMap[e];if(typeof console!=="undefined"&&console[n]){console[n].call(console,t)}}}};n.logger=d;n.log=v;var m=function(e){var t={};r.extend(t,e);return t};n.createFrame=m;return n}(t,n);var i=function(e,t,n){"use strict";function a(e){var t=e&&e[0]||1,n=o;if(t!==n){if(t<n){var r=u[n],i=u[t];throw new s("Template was precompiled with an older version of Handlebars than the current runtime. "+"Please update your precompiler to a newer version ("+r+") or downgrade your runtime to an older version ("+i+").")}else{throw new s("Template was precompiled with a newer version of Handlebars than the current runtime. "+"Please update your runtime to a newer version ("+e[1]+").")}}}function f(e,t){if(!t){throw new s("No environment passed to template")}var n=function(e,n,r,i,o,u){var a=t.VM.invokePartial.apply(this,arguments);if(a!=null){return a}if(t.compile){var f={helpers:i,partials:o,data:u};o[n]=t.compile(e,{data:u!==undefined},t);return o[n](r,f)}else{throw new s("The partial "+n+" could not be compiled when running in runtime-only mode")}};var r={escapeExpression:i.escapeExpression,invokePartial:n,programs:[],program:function(e,t,n){var r=this.programs[e];if(n){r=c(e,t,n)}else if(!r){r=this.programs[e]=c(e,t)}return r},merge:function(e,t){var n=e||t;if(e&&t&&e!==t){n={};i.extend(n,t);i.extend(n,e)}return n},programWithDepth:t.VM.programWithDepth,noop:t.VM.noop,compilerInfo:null};return function(n,i){i=i||{};var s=i.partial?i:t,o,u;if(!i.partial){o=i.helpers;u=i.partials}var a=e.call(r,s,n,o,u,i.data);if(!i.partial){t.VM.checkRevision(r.compilerInfo)}return a}}function l(e,t,n){var r=Array.prototype.slice.call(arguments,3);var i=function(e,i){i=i||{};return t.apply(this,[e,i.data||n].concat(r))};i.program=e;i.depth=r.length;return i}function c(e,t,n){var r=function(e,r){r=r||{};return t(e,r.data||n)};r.program=e;r.depth=0;return r}function h(e,t,n,r,i,o){var u={partial:true,helpers:r,partials:i,data:o};if(e===undefined){throw new s("The partial "+t+" could not be found")}else if(e instanceof Function){return e(n,u)}}function p(){return""}var r={};var i=e;var s=t;var o=n.COMPILER_REVISION;var u=n.REVISION_CHANGES;r.checkRevision=a;r.template=f;r.programWithDepth=l;r.program=c;r.invokePartial=h;r.noop=p;return r}(t,n,r);var s=function(e,t,n,r,i){"use strict";var s;var o=e;var u=t;var a=n;var f=r;var l=i;var c=function(){var e=new o.HandlebarsEnvironment;f.extend(e,o);e.SafeString=u;e.Exception=a;e.Utils=f;e.VM=l;e.template=function(t){return l.template(t,e)};return e};var h=c();h.create=c;s=h;return s}(r,e,n,t,i);var o=function(e){"use strict";function r(e){e=e||{};this.firstLine=e.first_line;this.firstColumn=e.first_column;this.lastColumn=e.last_column;this.lastLine=e.last_line}var t;var n=e;var i={ProgramNode:function(e,t,n,s){var o,u;if(arguments.length===3){s=n;n=null}else if(arguments.length===2){s=t;t=null}r.call(this,s);this.type="program";this.statements=e;this.strip={};if(n){u=n[0];if(u){o={first_line:u.firstLine,last_line:u.lastLine,last_column:u.lastColumn,first_column:u.firstColumn};this.inverse=new i.ProgramNode(n,t,o)}else{this.inverse=new i.ProgramNode(n,t)}this.strip.right=t.left}else if(t){this.strip.left=t.right}},MustacheNode:function(e,t,n,s,o){r.call(this,o);this.type="mustache";this.strip=s;if(n!=null&&n.charAt){var u=n.charAt(3)||n.charAt(2);this.escaped=u!=="{"&&u!=="&"}else{this.escaped=!!n}if(e instanceof i.SexprNode){this.sexpr=e}else{this.sexpr=new i.SexprNode(e,t)}this.sexpr.isRoot=true;this.id=this.sexpr.id;this.params=this.sexpr.params;this.hash=this.sexpr.hash;this.eligibleHelper=this.sexpr.eligibleHelper;this.isHelper=this.sexpr.isHelper},SexprNode:function(e,t,n){r.call(this,n);this.type="sexpr";this.hash=t;var i=this.id=e[0];var s=this.params=e.slice(1);var o=this.eligibleHelper=i.isSimple;this.isHelper=o&&(s.length||t)},PartialNode:function(e,t,n,i){r.call(this,i);this.type="partial";this.partialName=e;this.context=t;this.strip=n},BlockNode:function(e,t,i,s,o){r.call(this,o);if(e.sexpr.id.original!==s.path.original){throw new n(e.sexpr.id.original+" doesn't match "+s.path.original,this)}this.type="block";this.mustache=e;this.program=t;this.inverse=i;this.strip={left:e.strip.left,right:s.strip.right};(t||i).strip.left=e.strip.right;(i||t).strip.right=s.strip.left;if(i&&!t){this.isInverse=true}},ContentNode:function(e,t){r.call(this,t);this.type="content";this.string=e},HashNode:function(e,t){r.call(this,t);this.type="hash";this.pairs=e},IdNode:function(e,t){r.call(this,t);this.type="ID";var i="",s=[],o=0;for(var u=0,a=e.length;u<a;u++){var f=e[u].part;i+=(e[u].separator||"")+f;if(f===".."||f==="."||f==="this"){if(s.length>0){throw new n("Invalid path: "+i,this)}else if(f===".."){o++}else{this.isScoped=true}}else{s.push(f)}}this.original=i;this.parts=s;this.string=s.join(".");this.depth=o;this.isSimple=e.length===1&&!this.isScoped&&o===0;this.stringModeValue=this.string},PartialNameNode:function(e,t){r.call(this,t);this.type="PARTIAL_NAME";this.name=e.original},DataNode:function(e,t){r.call(this,t);this.type="DATA";this.id=e},StringNode:function(e,t){r.call(this,t);this.type="STRING";this.original=this.string=this.stringModeValue=e},IntegerNode:function(e,t){r.call(this,t);this.type="INTEGER";this.original=this.integer=e;this.stringModeValue=Number(e)},BooleanNode:function(e,t){r.call(this,t);this.type="BOOLEAN";this.bool=e;this.stringModeValue=e==="true"},CommentNode:function(e,t){r.call(this,t);this.type="comment";this.comment=e}};t=i;return t}(n);var u=function(){"use strict";var e;var t=function(){function t(e,t){return{left:e.charAt(2)==="~",right:t.charAt(0)==="~"||t.charAt(1)==="~"}}function r(){this.yy={}}var e={trace:function(){},yy:{},symbols_:{error:2,root:3,statements:4,EOF:5,program:6,simpleInverse:7,statement:8,openInverse:9,closeBlock:10,openBlock:11,mustache:12,partial:13,CONTENT:14,COMMENT:15,OPEN_BLOCK:16,sexpr:17,CLOSE:18,OPEN_INVERSE:19,OPEN_ENDBLOCK:20,path:21,OPEN:22,OPEN_UNESCAPED:23,CLOSE_UNESCAPED:24,OPEN_PARTIAL:25,partialName:26,partial_option0:27,sexpr_repetition0:28,sexpr_option0:29,dataName:30,param:31,STRING:32,INTEGER:33,BOOLEAN:34,OPEN_SEXPR:35,CLOSE_SEXPR:36,hash:37,hash_repetition_plus0:38,hashSegment:39,ID:40,EQUALS:41,DATA:42,pathSegments:43,SEP:44,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"CLOSE_UNESCAPED",25:"OPEN_PARTIAL",32:"STRING",33:"INTEGER",34:"BOOLEAN",35:"OPEN_SEXPR",36:"CLOSE_SEXPR",40:"ID",41:"EQUALS",42:"DATA",44:"SEP"},productions_:[0,[3,2],[3,1],[6,2],[6,3],[6,2],[6,1],[6,1],[6,0],[4,1],[4,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,4],[7,2],[17,3],[17,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,3],[37,1],[39,3],[26,1],[26,1],[26,1],[30,2],[21,1],[43,3],[43,1],[27,0],[27,1],[28,0],[28,2],[29,0],[29,1],[38,1],[38,2]],performAction:function(n,r,i,s,o,u,a){var f=u.length-1;switch(o){case 1:return new s.ProgramNode(u[f-1],this._$);break;case 2:return new s.ProgramNode([],this._$);break;case 3:this.$=new s.ProgramNode([],u[f-1],u[f],this._$);break;case 4:this.$=new s.ProgramNode(u[f-2],u[f-1],u[f],this._$);break;case 5:this.$=new s.ProgramNode(u[f-1],u[f],[],this._$);break;case 6:this.$=new s.ProgramNode(u[f],this._$);break;case 7:this.$=new s.ProgramNode([],this._$);break;case 8:this.$=new s.ProgramNode([],this._$);break;case 9:this.$=[u[f]];break;case 10:u[f-1].push(u[f]);this.$=u[f-1];break;case 11:this.$=new s.BlockNode(u[f-2],u[f-1].inverse,u[f-1],u[f],this._$);break;case 12:this.$=new s.BlockNode(u[f-2],u[f-1],u[f-1].inverse,u[f],this._$);break;case 13:this.$=u[f];break;case 14:this.$=u[f];break;case 15:this.$=new s.ContentNode(u[f],this._$);break;case 16:this.$=new s.CommentNode(u[f],this._$);break;case 17:this.$=new s.MustacheNode(u[f-1],null,u[f-2],t(u[f-2],u[f]),this._$);break;case 18:this.$=new s.MustacheNode(u[f-1],null,u[f-2],t(u[f-2],u[f]),this._$);break;case 19:this.$={path:u[f-1],strip:t(u[f-2],u[f])};break;case 20:this.$=new s.MustacheNode(u[f-1],null,u[f-2],t(u[f-2],u[f]),this._$);break;case 21:this.$=new s.MustacheNode(u[f-1],null,u[f-2],t(u[f-2],u[f]),this._$);break;case 22:this.$=new s.PartialNode(u[f-2],u[f-1],t(u[f-3],u[f]),this._$);break;case 23:this.$=t(u[f-1],u[f]);break;case 24:this.$=new s.SexprNode([u[f-2]].concat(u[f-1]),u[f],this._$);break;case 25:this.$=new s.SexprNode([u[f]],null,this._$);break;case 26:this.$=u[f];break;case 27:this.$=new s.StringNode(u[f],this._$);break;case 28:this.$=new s.IntegerNode(u[f],this._$);break;case 29:this.$=new s.BooleanNode(u[f],this._$);break;case 30:this.$=u[f];break;case 31:u[f-1].isHelper=true;this.$=u[f-1];break;case 32:this.$=new s.HashNode(u[f],this._$);break;case 33:this.$=[u[f-2],u[f]];break;case 34:this.$=new s.PartialNameNode(u[f],this._$);break;case 35:this.$=new s.PartialNameNode(new s.StringNode(u[f],this._$),this._$);break;case 36:this.$=new s.PartialNameNode(new s.IntegerNode(u[f],this._$));break;case 37:this.$=new s.DataNode(u[f],this._$);break;case 38:this.$=new s.IdNode(u[f],this._$);break;case 39:u[f-2].push({part:u[f],separator:u[f-1]});this.$=u[f-2];break;case 40:this.$=[{part:u[f]}];break;case 43:this.$=[];break;case 44:u[f-1].push(u[f]);break;case 47:this.$=[u[f]];break;case 48:u[f-1].push(u[f]);break}},table:[{3:1,4:2,5:[1,3],8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],25:[1,15]},{1:[3]},{5:[1,16],8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],25:[1,15]},{1:[2,2]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],25:[2,9]},{4:20,6:18,7:19,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,21],20:[2,8],22:[1,13],23:[1,14],25:[1,15]},{4:20,6:22,7:19,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,21],20:[2,8],22:[1,13],23:[1,14],25:[1,15]},{5:[2,13],14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],25:[2,13]},{5:[2,14],14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],25:[2,14]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],25:[2,15]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],25:[2,16]},{17:23,21:24,30:25,40:[1,28],42:[1,27],43:26},{17:29,21:24,30:25,40:[1,28],42:[1,27],43:26},{17:30,21:24,30:25,40:[1,28],42:[1,27],43:26},{17:31,21:24,30:25,40:[1,28],42:[1,27],43:26},{21:33,26:32,32:[1,34],33:[1,35],40:[1,28],43:26},{1:[2,1]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],25:[2,10]},{10:36,20:[1,37]},{4:38,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,7],22:[1,13],23:[1,14],25:[1,15]},{7:39,8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,21],20:[2,6],22:[1,13],23:[1,14],25:[1,15]},{17:23,18:[1,40],21:24,30:25,40:[1,28],42:[1,27],43:26},{10:41,20:[1,37]},{18:[1,42]},{18:[2,43],24:[2,43],28:43,32:[2,43],33:[2,43],34:[2,43],35:[2,43],36:[2,43],40:[2,43],42:[2,43]},{18:[2,25],24:[2,25],36:[2,25]},{18:[2,38],24:[2,38],32:[2,38],33:[2,38],34:[2,38],35:[2,38],36:[2,38],40:[2,38],42:[2,38],44:[1,44]},{21:45,40:[1,28],43:26},{18:[2,40],24:[2,40],32:[2,40],33:[2,40],34:[2,40],35:[2,40],36:[2,40],40:[2,40],42:[2,40],44:[2,40]},{18:[1,46]},{18:[1,47]},{24:[1,48]},{18:[2,41],21:50,27:49,40:[1,28],43:26},{18:[2,34],40:[2,34]},{18:[2,35],40:[2,35]},{18:[2,36],40:[2,36]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],25:[2,11]},{21:51,40:[1,28],43:26},{8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,3],22:[1,13],23:[1,14],25:[1,15]},{4:52,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,5],22:[1,13],23:[1,14],25:[1,15]},{14:[2,23],15:[2,23],16:[2,23],19:[2,23],20:[2,23],22:[2,23],23:[2,23],25:[2,23]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],25:[2,12]},{14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],25:[2,18]},{18:[2,45],21:56,24:[2,45],29:53,30:60,31:54,32:[1,57],33:[1,58],34:[1,59],35:[1,61],36:[2,45],37:55,38:62,39:63,40:[1,64],42:[1,27],43:26},{40:[1,65]},{18:[2,37],24:[2,37],32:[2,37],33:[2,37],34:[2,37],35:[2,37],36:[2,37],40:[2,37],42:[2,37]},{14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],25:[2,17]},{5:[2,20],14:[2,20],15:[2,20],16:[2,20],19:[2,20],20:[2,20],22:[2,20],23:[2,20],25:[2,20]},{5:[2,21],14:[2,21],15:[2,21],16:[2,21],19:[2,21],20:[2,21],22:[2,21],23:[2,21],25:[2,21]},{18:[1,66]},{18:[2,42]},{18:[1,67]},{8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],25:[1,15]},{18:[2,24],24:[2,24],36:[2,24]},{18:[2,44],24:[2,44],32:[2,44],33:[2,44],34:[2,44],35:[2,44],36:[2,44],40:[2,44],42:[2,44]},{18:[2,46],24:[2,46],36:[2,46]},{18:[2,26],24:[2,26],32:[2,26],33:[2,26],34:[2,26],35:[2,26],36:[2,26],40:[2,26],42:[2,26]},{18:[2,27],24:[2,27],32:[2,27],33:[2,27],34:[2,27],35:[2,27],36:[2,27],40:[2,27],42:[2,27]},{18:[2,28],24:[2,28],32:[2,28],33:[2,28],34:[2,28],35:[2,28],36:[2,28],40:[2,28],42:[2,28]},{18:[2,29],24:[2,29],32:[2,29],33:[2,29],34:[2,29],35:[2,29],36:[2,29],40:[2,29],42:[2,29]},{18:[2,30],24:[2,30],32:[2,30],33:[2,30],34:[2,30],35:[2,30],36:[2,30],40:[2,30],42:[2,30]},{17:68,21:24,30:25,40:[1,28],42:[1,27],43:26},{18:[2,32],24:[2,32],36:[2,32],39:69,40:[1,70]},{18:[2,47],24:[2,47],36:[2,47],40:[2,47]},{18:[2,40],24:[2,40],32:[2,40],33:[2,40],34:[2,40],35:[2,40],36:[2,40],40:[2,40],41:[1,71],42:[2,40],44:[2,40]},{18:[2,39],24:[2,39],32:[2,39],33:[2,39],34:[2,39],35:[2,39],36:[2,39],40:[2,39],42:[2,39],44:[2,39]},{5:[2,22],14:[2,22],15:[2,22],16:[2,22],19:[2,22],20:[2,22],22:[2,22],23:[2,22],25:[2,22]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],25:[2,19]},{36:[1,72]},{18:[2,48],24:[2,48],36:[2,48],40:[2,48]},{41:[1,71]},{21:56,30:60,31:73,32:[1,57],33:[1,58],34:[1,59],35:[1,61],40:[1,28],42:[1,27],43:26},{18:[2,31],24:[2,31],32:[2,31],33:[2,31],34:[2,31],35:[2,31],36:[2,31],40:[2,31],42:[2,31]},{18:[2,33],24:[2,33],36:[2,33],40:[2,33]}],defaultActions:{3:[2,2],16:[2,1],50:[2,42]},parseError:function(t,n){throw new Error(t)},parse:function(t){function v(e){r.length=r.length-2*e;i.length=i.length-e;s.length=s.length-e}function m(){var e;e=n.lexer.lex()||1;if(typeof e!=="number"){e=n.symbols_[e]||e}return e}var n=this,r=[0],i=[null],s=[],o=this.table,u="",a=0,f=0,l=0,c=2,h=1;this.lexer.setInput(t);this.lexer.yy=this.yy;this.yy.lexer=this.lexer;this.yy.parser=this;if(typeof this.lexer.yylloc=="undefined")this.lexer.yylloc={};var p=this.lexer.yylloc;s.push(p);var d=this.lexer.options&&this.lexer.options.ranges;if(typeof this.yy.parseError==="function")this.parseError=this.yy.parseError;var g,y,b,w,E,S,x={},T,N,C,k;while(true){b=r[r.length-1];if(this.defaultActions[b]){w=this.defaultActions[b]}else{if(g===null||typeof g=="undefined"){g=m()}w=o[b]&&o[b][g]}if(typeof w==="undefined"||!w.length||!w[0]){var L="";if(!l){k=[];for(T in o[b])if(this.terminals_[T]&&T>2){k.push("'"+this.terminals_[T]+"'")}if(this.lexer.showPosition){L="Parse error on line "+(a+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+k.join(", ")+", got '"+(this.terminals_[g]||g)+"'"}else{L="Parse error on line "+(a+1)+": Unexpected "+(g==1?"end of input":"'"+(this.terminals_[g]||g)+"'")}this.parseError(L,{text:this.lexer.match,token:this.terminals_[g]||g,line:this.lexer.yylineno,loc:p,expected:k})}}if(w[0]instanceof Array&&w.length>1){throw new Error("Parse Error: multiple actions possible at state: "+b+", token: "+g)}switch(w[0]){case 1:r.push(g);i.push(this.lexer.yytext);s.push(this.lexer.yylloc);r.push(w[1]);g=null;if(!y){f=this.lexer.yyleng;u=this.lexer.yytext;a=this.lexer.yylineno;p=this.lexer.yylloc;if(l>0)l--}else{g=y;y=null}break;case 2:N=this.productions_[w[1]][1];x.$=i[i.length-N];x._$={first_line:s[s.length-(N||1)].first_line,last_line:s[s.length-1].last_line,first_column:s[s.length-(N||1)].first_column,last_column:s[s.length-1].last_column};if(d){x._$.range=[s[s.length-(N||1)].range[0],s[s.length-1].range[1]]}S=this.performAction.call(x,u,f,a,this.yy,w[1],i,s);if(typeof S!=="undefined"){return S}if(N){r=r.slice(0,-1*N*2);i=i.slice(0,-1*N);s=s.slice(0,-1*N)}r.push(this.productions_[w[1]][0]);i.push(x.$);s.push(x._$);C=o[r[r.length-2]][r[r.length-1]];r.push(C);break;case 3:return true}}return true}};var n=function(){var e={EOF:1,parseError:function(t,n){if(this.yy.parser){this.yy.parser.parseError(t,n)}else{throw new Error(t)}},setInput:function(e){this._input=e;this._more=this._less=this.done=false;this.yylineno=this.yyleng=0;this.yytext=this.matched=this.match="";this.conditionStack=["INITIAL"];this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};if(this.options.ranges)this.yylloc.range=[0,0];this.offset=0;return this},input:function(){var e=this._input[0];this.yytext+=e;this.yyleng++;this.offset++;this.match+=e;this.matched+=e;var t=e.match(/(?:\r\n?|\n).*/g);if(t){this.yylineno++;this.yylloc.last_line++}else{this.yylloc.last_column++}if(this.options.ranges)this.yylloc.range[1]++;this._input=this._input.slice(1);return e},unput:function(e){var t=e.length;var n=e.split(/(?:\r\n?|\n)/g);this._input=e+this._input;this.yytext=this.yytext.substr(0,this.yytext.length-t-1);this.offset-=t;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1);this.matched=this.matched.substr(0,this.matched.length-1);if(n.length-1)this.yylineno-=n.length-1;var i=this.yylloc.range;this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===r.length?this.yylloc.first_column:0)+r[r.length-n.length].length-n[0].length:this.yylloc.first_column-t};if(this.options.ranges){this.yylloc.range=[i[0],i[0]+this.yyleng-t]}return this},more:function(){this._more=true;return this},less:function(e){this.unput(this.match.slice(e))},pastInput:function(){var e=this.matched.substr(0,this.matched.length-this.match.length);return(e.length>20?"...":"")+e.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var e=this.match;if(e.length<20){e+=this._input.substr(0,20-e.length)}return(e.substr(0,20)+(e.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var e=this.pastInput();var t=(new Array(e.length+1)).join("-");return e+this.upcomingInput()+"\n"+t+"^"},next:function(){if(this.done){return this.EOF}if(!this._input)this.done=true;var e,t,n,r,i,s;if(!this._more){this.yytext="";this.match=""}var o=this._currentRules();for(var u=0;u<o.length;u++){n=this._input.match(this.rules[o[u]]);if(n&&(!t||n[0].length>t[0].length)){t=n;r=u;if(!this.options.flex)break}}if(t){s=t[0].match(/(?:\r\n?|\n).*/g);if(s)this.yylineno+=s.length;this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:s?s[s.length-1].length-s[s.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length};this.yytext+=t[0];this.match+=t[0];this.matches=t;this.yyleng=this.yytext.length;if(this.options.ranges){this.yylloc.range=[this.offset,this.offset+=this.yyleng]}this._more=false;this._input=this._input.slice(t[0].length);this.matched+=t[0];e=this.performAction.call(this,this.yy,this,o[r],this.conditionStack[this.conditionStack.length-1]);if(this.done&&this._input)this.done=false;if(e)return e;else return}if(this._input===""){return this.EOF}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}},lex:function(){var t=this.next();if(typeof t!=="undefined"){return t}else{return this.lex()}},begin:function(t){this.conditionStack.push(t)},popState:function(){return this.conditionStack.pop()},_currentRules:function(){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules},topState:function(){return this.conditionStack[this.conditionStack.length-2]},pushState:function(t){this.begin(t)}};e.options={};e.performAction=function(t,n,r,i){function s(e,t){return n.yytext=n.yytext.substr(e,n.yyleng-t)}var o=i;switch(r){case 0:if(n.yytext.slice(-2)==="\\\\"){s(0,1);this.begin("mu")}else if(n.yytext.slice(-1)==="\\"){s(0,1);this.begin("emu")}else{this.begin("mu")}if(n.yytext)return 14;break;case 1:return 14;break;case 2:this.popState();return 14;break;case 3:s(0,4);this.popState();return 15;break;case 4:return 35;break;case 5:return 36;break;case 6:return 25;break;case 7:return 16;break;case 8:return 20;break;case 9:return 19;break;case 10:return 19;break;case 11:return 23;break;case 12:return 22;break;case 13:this.popState();this.begin("com");break;case 14:s(3,5);this.popState();return 15;break;case 15:return 22;break;case 16:return 41;break;case 17:return 40;break;case 18:return 40;break;case 19:return 44;break;case 20:break;case 21:this.popState();return 24;break;case 22:this.popState();return 18;break;case 23:n.yytext=s(1,2).replace(/\\"/g,'"');return 32;break;case 24:n.yytext=s(1,2).replace(/\\'/g,"'");return 32;break;case 25:return 42;break;case 26:return 34;break;case 27:return 34;break;case 28:return 33;break;case 29:return 40;break;case 30:n.yytext=s(1,2);return 40;break;case 31:return"INVALID";break;case 32:return 5;break}};e.rules=[/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:[\s\S]*?--\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{!--)/,/^(?:\{\{![\s\S]*?\}\})/,/^(?:\{\{(~)?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:-?[0-9]+(?=([~}\s)])))/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)]))))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/];e.conditions={mu:{rules:[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32],inclusive:false},emu:{rules:[2],inclusive:false},com:{rules:[3],inclusive:false},INITIAL:{rules:[0,1,32],inclusive:true}};return e}();e.lexer=n;r.prototype=e;e.Parser=r;return new r}();e=t;return e}();var a=function(e,t){"use strict";function s(e){if(e.constructor===i.ProgramNode){return e}r.yy=i;return r.parse(e)}var n={};var r=e;var i=t;n.parser=r;n.parse=s;return n}(u,o);var f=function(e){"use strict";function r(){}function i(e,t,r){if(e==null||typeof e!=="string"&&e.constructor!==r.AST.ProgramNode){throw new n("You must pass a string or Handlebars AST to Handlebars.precompile. You passed "+e)}t=t||{};if(!("data"in t)){t.data=true}var i=r.parse(e);var s=(new r.Compiler).compile(i,t);return(new r.JavaScriptCompiler).compile(s,t)}function s(e,t,r){function s(){var n=r.parse(e);var i=(new r.Compiler).compile(n,t);var s=(new r.JavaScriptCompiler).compile(i,t,undefined,true);return r.template(s)}if(e==null||typeof e!=="string"&&e.constructor!==r.AST.ProgramNode){throw new n("You must pass a string or Handlebars AST to Handlebars.compile. You passed "+e)}t=t||{};if(!("data"in t)){t.data=true}var i;return function(e,t){if(!i){i=s()}return i.call(this,e,t)}}var t={};var n=e;t.Compiler=r;r.prototype={compiler:r,disassemble:function(){var e=this.opcodes,t,n=[],r,i;for(var s=0,o=e.length;s<o;s++){t=e[s];if(t.opcode==="DECLARE"){n.push("DECLARE "+t.name+"="+t.value)}else{r=[];for(var u=0;u<t.args.length;u++){i=t.args[u];if(typeof i==="string"){i='"'+i.replace("\n","\\n")+'"'}r.push(i)}n.push(t.opcode+" "+r.join(" "))}}return n.join("\n")},equals:function(e){var t=this.opcodes.length;if(e.opcodes.length!==t){return false}for(var n=0;n<t;n++){var r=this.opcodes[n],i=e.opcodes[n];if(r.opcode!==i.opcode||r.args.length!==i.args.length){return false}for(var s=0;s<r.args.length;s++){if(r.args[s]!==i.args[s]){return false}}}t=this.children.length;if(e.children.length!==t){return false}for(n=0;n<t;n++){if(!this.children[n].equals(e.children[n])){return false}}return true},guid:0,compile:function(e,t){this.opcodes=[];this.children=[];this.depths={list:[]};this.options=t;var n=this.options.knownHelpers;this.options.knownHelpers={helperMissing:true,blockHelperMissing:true,each:true,"if":true,unless:true,"with":true,log:true};if(n){for(var r in n){this.options.knownHelpers[r]=n[r]}}return this.accept(e)},accept:function(e){var t=e.strip||{},n;if(t.left){this.opcode("strip")}n=this[e.type](e);if(t.right){this.opcode("strip")}return n},program:function(e){var t=e.statements;for(var n=0,r=t.length;n<r;n++){this.accept(t[n])}this.isSimple=r===1;this.depths.list=this.depths.list.sort(function(e,t){return e-t});return this},compileProgram:function(e){var t=(new this.compiler).compile(e,this.options);var n=this.guid++,r;this.usePartial=this.usePartial||t.usePartial;this.children[n]=t;for(var i=0,s=t.depths.list.length;i<s;i++){r=t.depths.list[i];if(r<2){continue}else{this.addDepth(r-1)}}return n},block:function(e){var t=e.mustache,n=e.program,r=e.inverse;if(n){n=this.compileProgram(n)}if(r){r=this.compileProgram(r)}var i=t.sexpr;var s=this.classifySexpr(i);if(s==="helper"){this.helperSexpr(i,n,r)}else if(s==="simple"){this.simpleSexpr(i);this.opcode("pushProgram",n);this.opcode("pushProgram",r);this.opcode("emptyHash");this.opcode("blockValue")}else{this.ambiguousSexpr(i,n,r);this.opcode("pushProgram",n);this.opcode("pushProgram",r);this.opcode("emptyHash");this.opcode("ambiguousBlockValue")}this.opcode("append")},hash:function(e){var t=e.pairs,n,r;this.opcode("pushHash");for(var i=0,s=t.length;i<s;i++){n=t[i];r=n[1];if(this.options.stringParams){if(r.depth){this.addDepth(r.depth)}this.opcode("getContext",r.depth||0);this.opcode("pushStringParam",r.stringModeValue,r.type);if(r.type==="sexpr"){this.sexpr(r)}}else{this.accept(r)}this.opcode("assignToHash",n[0])}this.opcode("popHash")},partial:function(e){var t=e.partialName;this.usePartial=true;if(e.context){this.ID(e.context)}else{this.opcode("push","depth0")}this.opcode("invokePartial",t.name);this.opcode("append")},content:function(e){this.opcode("appendContent",e.string)},mustache:function(e){this.sexpr(e.sexpr);if(e.escaped&&!this.options.noEscape){this.opcode("appendEscaped")}else{this.opcode("append")}},ambiguousSexpr:function(e,t,n){var r=e.id,i=r.parts[0],s=t!=null||n!=null;this.opcode("getContext",r.depth);this.opcode("pushProgram",t);this.opcode("pushProgram",n);this.opcode("invokeAmbiguous",i,s)},simpleSexpr:function(e){var t=e.id;if(t.type==="DATA"){this.DATA(t)}else if(t.parts.length){this.ID(t)}else{this.addDepth(t.depth);this.opcode("getContext",t.depth);this.opcode("pushContext")}this.opcode("resolvePossibleLambda")},helperSexpr:function(e,t,r){var i=this.setupFullMustacheParams(e,t,r),s=e.id.parts[0];if(this.options.knownHelpers[s]){this.opcode("invokeKnownHelper",i.length,s)}else if(this.options.knownHelpersOnly){throw new n("You specified knownHelpersOnly, but used the unknown helper "+s,e)}else{this.opcode("invokeHelper",i.length,s,e.isRoot)}},sexpr:function(e){var t=this.classifySexpr(e);if(t==="simple"){this.simpleSexpr(e)}else if(t==="helper"){this.helperSexpr(e)}else{this.ambiguousSexpr(e)}},ID:function(e){this.addDepth(e.depth);this.opcode("getContext",e.depth);var t=e.parts[0];if(!t){this.opcode("pushContext")}else{this.opcode("lookupOnContext",e.parts[0])}for(var n=1,r=e.parts.length;n<r;n++){this.opcode("lookup",e.parts[n])}},DATA:function(e){this.options.data=true;if(e.id.isScoped||e.id.depth){throw new n("Scoped data references are not supported: "+e.original,e)}this.opcode("lookupData");var t=e.id.parts;for(var r=0,i=t.length;r<i;r++){this.opcode("lookup",t[r])}},STRING:function(e){this.opcode("pushString",e.string)},INTEGER:function(e){this.opcode("pushLiteral",e.integer)},BOOLEAN:function(e){this.opcode("pushLiteral",e.bool)},comment:function(){},opcode:function(e){this.opcodes.push({opcode:e,args:[].slice.call(arguments,1)})},declare:function(e,t){this.opcodes.push({opcode:"DECLARE",name:e,value:t})},addDepth:function(e){if(e===0){return}if(!this.depths[e]){this.depths[e]=true;this.depths.list.push(e)}},classifySexpr:function(e){var t=e.isHelper;var n=e.eligibleHelper;var r=this.options;if(n&&!t){var i=e.id.parts[0];if(r.knownHelpers[i]){t=true}else if(r.knownHelpersOnly){n=false}}if(t){return"helper"}else if(n){return"ambiguous"}else{return"simple"}},pushParams:function(e){var t=e.length,n;while(t--){n=e[t];if(this.options.stringParams){if(n.depth){this.addDepth(n.depth)}this.opcode("getContext",n.depth||0);this.opcode("pushStringParam",n.stringModeValue,n.type);if(n.type==="sexpr"){this.sexpr(n)}}else{this[n.type](n)}}},setupFullMustacheParams:function(e,t,n){var r=e.params;this.pushParams(r);this.opcode("pushProgram",t);this.opcode("pushProgram",n);if(e.hash){this.hash(e.hash)}else{this.opcode("emptyHash")}return r}};t.precompile=i;t.compile=s;return t}(n);var l=function(e,t){"use strict";function u(e){this.value=e}function a(){}var n;var r=e.COMPILER_REVISION;var i=e.REVISION_CHANGES;var s=e.log;var o=t;a.prototype={nameLookup:function(e,t){var n,r;if(e.indexOf("depth")===0){n=true}if(/^[0-9]+$/.test(t)){r=e+"["+t+"]"}else if(a.isValidJavaScriptVariableName(t)){r=e+"."+t}else{r=e+"['"+t+"']"}if(n){return"("+e+" && "+r+")"}else{return r}},compilerInfo:function(){var e=r,t=i[e];return"this.compilerInfo = ["+e+",'"+t+"'];\n"},appendToBuffer:function(e){if(this.environment.isSimple){return"return "+e+";"}else{return{appendToBuffer:true,content:e,toString:function(){return"buffer += "+e+";"}}}},initializeBuffer:function(){return this.quotedString("")},namespace:"Handlebars",compile:function(e,t,n,r){this.environment=e;this.options=t||{};s("debug",this.environment.disassemble()+"\n\n");this.name=this.environment.name;this.isChild=!!n;this.context=n||{programs:[],environments:[],aliases:{}};this.preamble();this.stackSlot=0;this.stackVars=[];this.registers={list:[]};this.hashes=[];this.compileStack=[];this.inlineStack=[];this.compileChildren(e,t);var i=e.opcodes,u;this.i=0;for(var a=i.length;this.i<a;this.i++){u=i[this.i];if(u.opcode==="DECLARE"){this[u.name]=u.value}else{this[u.opcode].apply(this,u.args)}if(u.opcode!==this.stripNext){this.stripNext=false}}this.pushSource("");if(this.stackSlot||this.inlineStack.length||this.compileStack.length){throw new o("Compile completed with content left on stack")}return this.createFunctionContext(r)},preamble:function(){var e=[];if(!this.isChild){var t=this.namespace;var n="helpers = this.merge(helpers, "+t+".helpers);";if(this.environment.usePartial){n=n+" partials = this.merge(partials, "+t+".partials);"}if(this.options.data){n=n+" data = data || {};"}e.push(n)}else{e.push("")}if(!this.environment.isSimple){e.push(", buffer = "+this.initializeBuffer())}else{e.push("")}this.lastContext=0;this.source=e},createFunctionContext:function(e){var t=this.stackVars.concat(this.registers.list);if(t.length>0){this.source[1]=this.source[1]+", "+t.join(", ")}if(!this.isChild){for(var n in this.context.aliases){if(this.context.aliases.hasOwnProperty(n)){this.source[1]=this.source[1]+", "+n+"="+this.context.aliases[n]}}}if(this.source[1]){this.source[1]="var "+this.source[1].substring(2)+";"}if(!this.isChild){this.source[1]+="\n"+this.context.programs.join("\n")+"\n"}if(!this.environment.isSimple){this.pushSource("return buffer;")}var r=this.isChild?["depth0","data"]:["Handlebars","depth0","helpers","partials","data"];for(var i=0,o=this.environment.depths.list.length;i<o;i++){r.push("depth"+this.environment.depths.list[i])}var u=this.mergeSource();if(!this.isChild){u=this.compilerInfo()+u}if(e){r.push(u);return Function.apply(this,r)}else{var a="function "+(this.name||"")+"("+r.join(",")+") {\n  "+u+"}";s("debug",a+"\n\n");return a}},mergeSource:function(){var e="",t;for(var n=0,r=this.source.length;n<r;n++){var i=this.source[n];if(i.appendToBuffer){if(t){t=t+"\n    + "+i.content}else{t=i.content}}else{if(t){e+="buffer += "+t+";\n  ";t=undefined}e+=i+"\n  "}}return e},blockValue:function(){this.context.aliases.blockHelperMissing="helpers.blockHelperMissing";var e=["depth0"];this.setupParams(0,e);this.replaceStack(function(t){e.splice(1,0,t);return"blockHelperMissing.call("+e.join(", ")+")"})},ambiguousBlockValue:function(){this.context.aliases.blockHelperMissing="helpers.blockHelperMissing";var e=["depth0"];this.setupParams(0,e);var t=this.topStack();e.splice(1,0,t);this.pushSource("if (!"+this.lastHelper+") { "+t+" = blockHelperMissing.call("+e.join(", ")+"); }")},appendContent:function(e){if(this.pendingContent){e=this.pendingContent+e}if(this.stripNext){e=e.replace(/^\s+/,"")}this.pendingContent=e},strip:function(){if(this.pendingContent){this.pendingContent=this.pendingContent.replace(/\s+$/,"")}this.stripNext="strip"},append:function(){this.flushInline();var e=this.popStack();this.pushSource("if("+e+" || "+e+" === 0) { "+this.appendToBuffer(e)+" }");if(this.environment.isSimple){this.pushSource("else { "+this.appendToBuffer("''")+" }")}},appendEscaped:function(){this.context.aliases.escapeExpression="this.escapeExpression";this.pushSource(this.appendToBuffer("escapeExpression("+this.popStack()+")"))},getContext:function(e){if(this.lastContext!==e){this.lastContext=e}},lookupOnContext:function(e){this.push(this.nameLookup("depth"+this.lastContext,e,"context"))},pushContext:function(){this.pushStackLiteral("depth"+this.lastContext)},resolvePossibleLambda:function(){this.context.aliases.functionType='"function"';this.replaceStack(function(e){return"typeof "+e+" === functionType ? "+e+".apply(depth0) : "+e})},lookup:function(e){this.replaceStack(function(t){return t+" == null || "+t+" === false ? "+t+" : "+this.nameLookup(t,e,"context")})},lookupData:function(){this.pushStackLiteral("data")},pushStringParam:function(e,t){this.pushStackLiteral("depth"+this.lastContext);this.pushString(t);if(t!=="sexpr"){if(typeof e==="string"){this.pushString(e)}else{this.pushStackLiteral(e)}}},emptyHash:function(){this.pushStackLiteral("{}");if(this.options.stringParams){this.push("{}");this.push("{}")}},pushHash:function(){if(this.hash){this.hashes.push(this.hash)}this.hash={values:[],types:[],contexts:[]}},popHash:function(){var e=this.hash;this.hash=this.hashes.pop();if(this.options.stringParams){this.push("{"+e.contexts.join(",")+"}");this.push("{"+e.types.join(",")+"}")}this.push("{\n    "+e.values.join(",\n    ")+"\n  }")},pushString:function(e){this.pushStackLiteral(this.quotedString(e))},push:function(e){this.inlineStack.push(e);return e},pushLiteral:function(e){this.pushStackLiteral(e)},pushProgram:function(e){if(e!=null){this.pushStackLiteral(this.programExpression(e))}else{this.pushStackLiteral(null)}},invokeHelper:function(e,t,n){this.context.aliases.helperMissing="helpers.helperMissing";this.useRegister("helper");var r=this.lastHelper=this.setupHelper(e,t,true);var i=this.nameLookup("depth"+this.lastContext,t,"context");var s="helper = "+r.name+" || "+i;if(r.paramsInit){s+=","+r.paramsInit}this.push("("+s+",helper "+"? helper.call("+r.callParams+") "+": helperMissing.call("+r.helperMissingParams+"))");if(!n){this.flushInline()}},invokeKnownHelper:function(e,t){var n=this.setupHelper(e,t);this.push(n.name+".call("+n.callParams+")")},invokeAmbiguous:function(e,t){this.context.aliases.functionType='"function"';this.useRegister("helper");this.emptyHash();var n=this.setupHelper(0,e,t);var r=this.lastHelper=this.nameLookup("helpers",e,"helper");var i=this.nameLookup("depth"+this.lastContext,e,"context");var s=this.nextStack();if(n.paramsInit){this.pushSource(n.paramsInit)}this.pushSource("if (helper = "+r+") { "+s+" = helper.call("+n.callParams+"); }");this.pushSource("else { helper = "+i+"; "+s+" = typeof helper === functionType ? helper.call("+n.callParams+") : helper; }")},invokePartial:function(e){var t=[this.nameLookup("partials",e,"partial"),"'"+e+"'",this.popStack(),"helpers","partials"];if(this.options.data){t.push("data")}this.context.aliases.self="this";this.push("self.invokePartial("+t.join(", ")+")")},assignToHash:function(e){var t=this.popStack(),n,r;if(this.options.stringParams){r=this.popStack();n=this.popStack()}var i=this.hash;if(n){i.contexts.push("'"+e+"': "+n)}if(r){i.types.push("'"+e+"': "+r)}i.values.push("'"+e+"': ("+t+")")},compiler:a,compileChildren:function(e,t){var n=e.children,r,i;for(var s=0,o=n.length;s<o;s++){r=n[s];i=new this.compiler;var u=this.matchExistingProgram(r);if(u==null){this.context.programs.push("");u=this.context.programs.length;r.index=u;r.name="program"+u;this.context.programs[u]=i.compile(r,t,this.context);this.context.environments[u]=r}else{r.index=u;r.name="program"+u}}},matchExistingProgram:function(e){for(var t=0,n=this.context.environments.length;t<n;t++){var r=this.context.environments[t];if(r&&r.equals(e)){return t}}},programExpression:function(e){this.context.aliases.self="this";if(e==null){return"self.noop"}var t=this.environment.children[e],n=t.depths.list,r;var i=[t.index,t.name,"data"];for(var s=0,o=n.length;s<o;s++){r=n[s];if(r===1){i.push("depth0")}else{i.push("depth"+(r-1))}}return(n.length===0?"self.program(":"self.programWithDepth(")+i.join(", ")+")"},register:function(e,t){this.useRegister(e);this.pushSource(e+" = "+t+";")},useRegister:function(e){if(!this.registers[e]){this.registers[e]=true;this.registers.list.push(e)}},pushStackLiteral:function(e){return this.push(new u(e))},pushSource:function(e){if(this.pendingContent){this.source.push(this.appendToBuffer(this.quotedString(this.pendingContent)));this.pendingContent=undefined}if(e){this.source.push(e)}},pushStack:function(e){this.flushInline();var t=this.incrStack();if(e){this.pushSource(t+" = "+e+";")}this.compileStack.push(t);return t},replaceStack:function(e){var t="",n=this.isInline(),r,i,s;if(n){var o=this.popStack(true);if(o instanceof u){r=o.value;s=true}else{i=!this.stackSlot;var a=!i?this.topStackName():this.incrStack();t="("+this.push(a)+" = "+o+"),";r=this.topStack()}}else{r=this.topStack()}var f=e.call(this,r);if(n){if(!s){this.popStack()}if(i){this.stackSlot--}this.push("("+t+f+")")}else{if(!/^stack/.test(r)){r=this.nextStack()}this.pushSource(r+" = ("+t+f+");")}return r},nextStack:function(){return this.pushStack()},incrStack:function(){this.stackSlot++;if(this.stackSlot>this.stackVars.length){this.stackVars.push("stack"+this.stackSlot)}return this.topStackName()},topStackName:function(){return"stack"+this.stackSlot},flushInline:function(){var e=this.inlineStack;if(e.length){this.inlineStack=[];for(var t=0,n=e.length;t<n;t++){var r=e[t];if(r instanceof u){this.compileStack.push(r)}else{this.pushStack(r)}}}},isInline:function(){return this.inlineStack.length},popStack:function(e){var t=this.isInline(),n=(t?this.inlineStack:this.compileStack).pop();if(!e&&n instanceof u){return n.value}else{if(!t){if(!this.stackSlot){throw new o("Invalid stack pop")}this.stackSlot--}return n}},topStack:function(e){var t=this.isInline()?this.inlineStack:this.compileStack,n=t[t.length-1];if(!e&&n instanceof u){return n.value}else{return n}},quotedString:function(e){return'"'+e.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")+'"'},setupHelper:function(e,t,n){var r=[],i=this.setupParams(e,r,n);var s=this.nameLookup("helpers",t,"helper");return{params:r,paramsInit:i,name:s,callParams:["depth0"].concat(r).join(", "),helperMissingParams:n&&["depth0",this.quotedString(t)].concat(r).join(", ")}},setupOptions:function(e,t){var n=[],r=[],i=[],s,o,u;n.push("hash:"+this.popStack());if(this.options.stringParams){n.push("hashTypes:"+this.popStack());n.push("hashContexts:"+this.popStack())}o=this.popStack();u=this.popStack();if(u||o){if(!u){this.context.aliases.self="this";u="self.noop"}if(!o){this.context.aliases.self="this";o="self.noop"}n.push("inverse:"+o);n.push("fn:"+u)}for(var a=0;a<e;a++){s=this.popStack();t.push(s);if(this.options.stringParams){i.push(this.popStack());r.push(this.popStack())}}if(this.options.stringParams){n.push("contexts:["+r.join(",")+"]");n.push("types:["+i.join(",")+"]")}if(this.options.data){n.push("data:data")}return n},setupParams:function(e,t,n){var r="{"+this.setupOptions(e,t).join(",")+"}";if(n){this.useRegister("options");t.push("options");return"options="+r}else{t.push(r);return""}}};var f=("break else new var"+" case finally return void"+" catch for switch while"+" continue function this with"+" default if throw"+" delete in try"+" do instanceof typeof"+" abstract enum int short"+" boolean export interface static"+" byte extends long super"+" char final native synchronized"+" class float package throws"+" const goto private transient"+" debugger implements protected volatile"+" double import public let yield").split(" ");var l=a.RESERVED_WORDS={};for(var c=0,h=f.length;c<h;c++){l[f[c]]=true}a.isValidJavaScriptVariableName=function(e){if(!a.RESERVED_WORDS[e]&&/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(e)){return true}return false};n=a;return n}(r,n);var c=function(e,t,n,r,i){"use strict";var s;var o=e;var u=t;var a=n.parser;var f=n.parse;var l=r.Compiler;var c=r.compile;var h=r.precompile;var p=i;var d=o.create;var v=function(){var e=d();e.compile=function(t,n){return c(t,n,e)};e.precompile=function(t,n){return h(t,n,e)};e.AST=u;e.Compiler=l;e.JavaScriptCompiler=p;e.Parser=a;e.parse=f;return e};o=v();o.create=v;s=o;return s}(s,o,a,f,l);return c}();

/*================ pv_sections ================*/
theme.variants = {
  selectors: {
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productPrice: '[data-product-price]',
    productStickyPrice : '[data-product-price-sticky]',
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]'
  },

  /**
   * Updates the DOM state of the add to cart button
   */
  updateAddToCartState: function(evt){
    var variant = evt.variant;

    if (variant) {
      $(theme.variants.selectors.priceWrapper, this.$container).removeClass('hide');
    } else {
      $(theme.variants.selectors.addToCart, this.$container).prop('disabled', true);
      $(theme.variants.selectors.addToCartText, this.$container).html(theme.strings.unavailable);
      $(theme.variants.selectors.priceWrapper, this.$container).addClass('hide');
      return;
    }

    if (variant.available) {
      $(theme.variants.selectors.addToCart, this.$container).prop('disabled', false);
      $(theme.variants.selectors.addToCartText, this.$container).html(theme.strings.addToCart);
      $('form', this.$container).removeClass('variant--unavailable');
      $('.product-detail__quantity-row').css('width','100%');
      $('.addtocartform .quantity-wrapper').css('display','block');
     	$('.btn.klaviyo-bis-trigger').css("display", 'none');
    } else {
      $(theme.variants.selectors.addToCart, this.$container).prop('disabled', true);
      $(theme.variants.selectors.addToCartText, this.$container).html(theme.strings.soldOut);
      $('form', this.$container).addClass('variant--unavailable');
       $('.product-detail__quantity-row').css('width','100%');
       $('.addtocartform .quantity-wrapper').css('display','none');
       $('.btn.klaviyo-bis-trigger').css("display", 'inline-block');
       $('.btn.klaviyo-bis-trigger').css("min-width", '95%');
    }

    // backorder
    var $backorderContainer = $('.backorder', this.$container);
    if($backorderContainer.length) {
      if(variant && variant.available) {
        var $option = $(theme.variants.selectors.originalSelectorId + ' option[value="' + variant.id + '"]', this.$container);
        if(variant.inventory_management && $option.data('stock') == 'out') {
          $backorderContainer.find('.backorder__variant').html(this.productSingleObject.title + (variant.title.indexOf('Default') >= 0 ? '' : ' - '+variant.title) );
          $backorderContainer.show();
        } else {
          $backorderContainer.hide();
        }
      } else {
        $backorderContainer.hide();
      }
    }
  },

  /**
   * Updates the DOM with specified prices
   */
  updateProductPrices: function(evt){
    var variant = evt.variant;
    var $comparePrice = $(theme.variants.selectors.comparePrice, this.$container);
    var $compareEls = $comparePrice.add(theme.variants.selectors.comparePriceText, this.$container);

    $(theme.variants.selectors.productPrice, this.$container)
      .html('<span class="theme-money">' + slate.Currency.formatMoney(variant.price, theme.moneyFormat) + '</span>');

    if (variant.compare_at_price > variant.price) {
      $(theme.variants.selectors.productPrice, this.$container).addClass('product-price__reduced');
      $comparePrice.html('<span class="theme-money">' + slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat) + '</span>');
      var save_price = slate.Currency.formatMoney(((variant.compare_at_price)-(variant.price)), theme.moneyFormat);
      document.getElementById("product-price__sale--single").innerHTML = "save "+save_price;
      $compareEls.removeClass('hide');
    } else {
      $(theme.variants.selectors.productPrice, this.$container).removeClass('product-price__reduced');
      $comparePrice.html('');
      $compareEls.addClass('hide');
    }
    theme.checkCurrency();
  }
};


/* ================ GLOBAL ================ */
/*============================================================================
  Drawer modules
==============================================================================*/
theme.Drawers = (function () {
  var Drawer = function (id, position, options) {
    var defaults = {
      close: '.js-drawer-close',
      open: '.js-drawer-open-' + position,
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + position
    };

    this.$nodes = {
      parent: $('body, html'),
      page: $('#mp-pusher'),
      moved: $('.is-moved-by-drawer')
    };

    this.config = $.extend(defaults, options);
    this.position = position;

    this.$drawer = $('#' + id);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.init();
  };

  Drawer.prototype.init = function () {
    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$drawer.find(this.config.close).on('click', $.proxy(this.close, this));
  };

  Drawer.prototype.open = function (evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to $nodes.page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    // Notify the drawer is going to open
    theme.cache.$body.trigger('beforeDrawerOpen.theme', this);

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    this.$nodes.moved.addClass('is-transitioning');
    this.$drawer.prepareTransition();

    this.$nodes.parent.addClass(this.config.openClass + ' ' + this.config.dirOpenClass);
    this.drawerIsOpen = true;

    // Set focus on drawer
    this.trapFocus(this.$drawer, 'drawer_focus');

    // Run function when draw opens if set
    if (this.config.onDrawerOpen && typeof(this.config.onDrawerOpen) == 'function') {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    // Lock scrolling on mobile
    this.$nodes.page.on('touchmove.drawer', function () {
      return false;
    });

    this.$nodes.page.on('click.drawer', $.proxy(function () {
      this.close();
      return false;
    }, this));

    // Notify the drawer has opened
    theme.cache.$body.trigger('afterDrawerOpen.theme', this);
  };

  Drawer.prototype.close = function () {
    if (!this.drawerIsOpen) { // don't close a closed drawer
      return;
    }

    // Notify the drawer is going to close
    theme.cache.$body.trigger('beforeDrawerClose.theme', this);

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    this.$nodes.moved.prepareTransition({ disableExisting: true });
    this.$drawer.prepareTransition({ disableExisting: true });

    this.$nodes.parent.removeClass(this.config.dirOpenClass + ' ' + this.config.openClass);

    this.drawerIsOpen = false;

    // Remove focus on drawer
    this.removeTrapFocus(this.$drawer, 'drawer_focus');

    this.$nodes.page.off('.drawer');

    // Notify the drawer is closed now
    theme.cache.$body.trigger('afterDrawerClose.theme', this);
  };

  Drawer.prototype.trapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

    $container.attr('tabindex', '-1');

    $container.focus();

    $(document).on(eventName, function (evt) {
      if ($container[0] !== evt.target && !$container.has(evt.target).length) {
        $container.focus();
      }
    });
  };

  Drawer.prototype.removeTrapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

    $container.removeAttr('tabindex');
    $(document).off(eventName);
  };

  return Drawer;
})();

/*============================================================================
  Money Format
  - Shopify.format money is defined in option_selection.js.
    If that file is not included, it is redefined here.
==============================================================================*/
if ((typeof Shopify) === 'undefined') { Shopify = {}; }
if (!Shopify.formatMoney) {
  Shopify.formatMoney = function(cents, format) {
    var value = '',
        placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
        formatString = (format || this.money_format);

    if (typeof cents == 'string') {
      cents = cents.replace('.','');
    }

    function defaultOption(opt, def) {
      return (typeof opt == 'undefined' ? def : opt);
    }

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ',');
      decimal   = defaultOption(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number/100.0).toFixed(precision);

      var parts   = number.split('.'),
          dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
          cents   = parts[1] ? (decimal + parts[1]) : '';

      return dollars + cents;
    }

    switch(formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  };
}
/*============================================================================
  Ajax the add to cart experience by revealing it in a side drawer
  Plugin Documentation - http://shopify.github.io/Timber/#ajax-cart
  (c) Copyright 2015 Shopify Inc. Author: Carson Shold (@cshold). All Rights Reserved.

  This file includes:
    - Basic Shopify Ajax API calls
    - Ajax cart plugin

  This requires:
    - jQuery 1.8+
    - handlebars.min.js (for cart template)
    - modernizr.min.js
    - snippet/ajax-cart-template.liquid

  Customized version of Shopify's jQuery API
  (c) Copyright 2009-2015 Shopify Inc. Author: Caroline Schnapp. All Rights Reserved.
==============================================================================*/
if ((typeof ShopifyAPI) === 'undefined') { ShopifyAPI = {}; }

/*============================================================================
  API Helper Functions
==============================================================================*/
function attributeToString(attribute) {
  if ((typeof attribute) !== 'string') {
    attribute += '';
    if (attribute === 'undefined') {
      attribute = '';
    }
  }
  return jQuery.trim(attribute);
};

/*============================================================================
  API Functions
==============================================================================*/
ShopifyAPI.onCartUpdate = function(cart) {
  // alert('There are now ' + cart.item_count + ' items in the cart.');
};

ShopifyAPI.updateCartNote = function(note, callback) {
  var $body = $(document.body),
  params = {
    type: 'POST',
    url: '/cart/update.js',
    data: 'note=' + attributeToString(note),
    dataType: 'json',
    beforeSend: function() {
      $body.trigger('beforeUpdateCartNote.ajaxCart', note);
    },
    success: function(cart) {
      if ((typeof callback) === 'function') {
        callback(cart);
      }
      else {
        ShopifyAPI.onCartUpdate(cart);
      }
      $body.trigger('afterUpdateCartNote.ajaxCart', [note, cart]);
    },
    error: function(XMLHttpRequest, textStatus) {
      $body.trigger('errorUpdateCartNote.ajaxCart', [XMLHttpRequest, textStatus]);
      ShopifyAPI.onError(XMLHttpRequest, textStatus);
    },
    complete: function(jqxhr, text) {
      $body.trigger('completeUpdateCartNote.ajaxCart', [this, jqxhr, text]);
    }
  };
  jQuery.ajax(params);
};

ShopifyAPI.onError = function(XMLHttpRequest, textStatus) {
  var data = eval('(' + XMLHttpRequest.responseText + ')');
  if (!!data.message) {
    alert(data.message + '(' + data.status  + '): ' + data.description);
  }
};

/*============================================================================
  POST to cart/add.js returns the JSON of the cart
    - Allow use of form element instead of just id
    - Allow custom error callback
==============================================================================*/
ShopifyAPI.addItemFromForm = function(form, callback, errorCallback) {
  var $body = $(document.body),
  params = {
    type: 'POST',
    url: '/cart/add.js',
    data: jQuery(form).serialize(),
    dataType: 'json',
    beforeSend: function(jqxhr, settings) {
      $body.trigger('beforeAddItem.ajaxCart', form);
    },
    success: function(line_item) {
      if ((typeof callback) === 'function') {
        callback(line_item, form);
      }
      else {
        ShopifyAPI.onItemAdded(line_item, form);
      }
      $body.trigger('afterAddItem.ajaxCart', [line_item, form]);
    },
    error: function(XMLHttpRequest, textStatus) {
      if ((typeof errorCallback) === 'function') {
        errorCallback(XMLHttpRequest, textStatus);
      }
      else {
        ShopifyAPI.onError(XMLHttpRequest, textStatus);
      }
      $body.trigger('errorAddItem.ajaxCart', [XMLHttpRequest, textStatus]);
    },
    complete: function(jqxhr, text) {
      $body.trigger('completeAddItem.ajaxCart', [this, jqxhr, text]);
    }
  };
  jQuery.ajax(params);
};

// Get from cart.js returns the cart in JSON
ShopifyAPI.getCart = function(callback) {
  $(document.body).trigger('beforeGetCart.ajaxCart');
  jQuery.getJSON('/cart.js', function (cart, textStatus) {
    if ((typeof callback) === 'function') {
      callback(cart);
    }
    else {
      ShopifyAPI.onCartUpdate(cart);
    }
    $(document.body).trigger('afterGetCart.ajaxCart', cart);
  });
};

// POST to cart/change.js returns the cart in JSON
ShopifyAPI.changeItem = function(line, quantity, callback) {
  var $body = $(document.body),
  params = {
    type: 'POST',
    url: '/cart/change.js',
    data: 'quantity=' + quantity + '&line=' + line,
    dataType: 'json',
    beforeSend: function() {
      $body.trigger('beforeChangeItem.ajaxCart', [line, quantity]);
    },
    success: function(cart) {
      if ((typeof callback) === 'function') {
        callback(cart);
      }
      else {
        ShopifyAPI.onCartUpdate(cart);
      }
      $body.trigger('afterChangeItem.ajaxCart', [line, quantity, cart]);
    },
    error: function(XMLHttpRequest, textStatus) {
      $body.trigger('errorChangeItem.ajaxCart', [XMLHttpRequest, textStatus]);
      ShopifyAPI.onError(XMLHttpRequest, textStatus);
    },
    complete: function(jqxhr, text) {
      $body.trigger('completeChangeItem.ajaxCart', [this, jqxhr, text]);
    }
  };
  jQuery.ajax(params);
};

/*============================================================================
  Ajax Shopify Add To Cart
==============================================================================*/
var ajaxCart = (function(module, $) {

  'use strict';

  // Public functions
  var init, loadCart;

  // Private general variables
  var settings, isUpdating, $body;

  // Private plugin variables
  var $formContainer, $addToCart, $cartCountSelector, $cartCostSelector, $cartContainer, $drawerContainer;

  // Private functions
  var updateCountPrice, formOverride, itemAddedCallback, itemErrorCallback, cartUpdateCallback, buildCart, cartCallback, adjustCart, adjustCartCallback, createQtySelectors, qtySelectors, validateQty;

  /*============================================================================
    Initialise the plugin and define global options
  ==============================================================================*/
  init = function (options) {
    
    // Default settings
    settings = {
      formSelector       : '#AddToCartForm',
      cartContainer      : '#CartContainer',
      addToCartSelector  : '#AddToCart',
      cartCountSelector  : null,
      cartCostSelector   : null,
      moneyFormat        : '${{amount}}',
      disableAjaxCart    : false,
      enableQtySelectors : true
    };

    // Override defaults with arguments
    $.extend(settings, options);

    // Select DOM elements
    $formContainer     = $(settings.formSelector);
    $cartContainer     = $(settings.cartContainer);
    $addToCart         = $formContainer.find(settings.addToCartSelector);
    $cartCountSelector = $(settings.cartCountSelector);
    $cartCostSelector  = $(settings.cartCostSelector);

    // General Selectors
    $body = $(document.body);

    // Track cart activity status
    isUpdating = false;

    // Setup ajax quantity selectors on the any template if enableQtySelectors is true
    if (settings.enableQtySelectors) {
      qtySelectors();
    }
    // Take over the add to cart form submit action if ajax enabled
    if (!settings.disableAjaxCart && $addToCart.length) {
      formOverride();
    }

    // Run this function in case we're using the quantity selector outside of the cart
    adjustCart();
  };

  loadCart = function () {
    $body.addClass('drawer--is-loading');
    ShopifyAPI.getCart(cartUpdateCallback);
  };

  updateCountPrice = function (cart) {
    if ($cartCountSelector) {
      $cartCountSelector.html(cart.item_count).removeClass('hidden-count');

      if (cart.item_count === 0) {
        $cartCountSelector.addClass('hidden-count');
      }
    }
    if ($cartCostSelector) {
        
      $cartCostSelector.html(Shopify.formatMoney(cart.total_price, settings.moneyFormat));
    }
  };

  formOverride = function () {
    $formContainer.on('submit', function(evt) {
      evt.preventDefault();
      // Add class to be styled if desired
      $addToCart.removeClass('is-added').addClass('is-adding');

      // Remove any previous quantity errors
      $('.qty-error').remove();

      ShopifyAPI.addItemFromForm(evt.target, itemAddedCallback, itemErrorCallback);
    });
  };

  itemAddedCallback = function (product) {
    $addToCart.removeClass('is-adding').addClass('is-added');

    ShopifyAPI.getCart(cartUpdateCallback);
  };

  itemErrorCallback = function (XMLHttpRequest, textStatus) {
    var data = eval('(' + XMLHttpRequest.responseText + ')');
    $addToCart.removeClass('is-adding is-added');

    if (!!data.message) {
      if (data.status == 422) {
        $formContainer.after('<div class="errors qty-error">'+ data.description +'</div>')
      }
    }
  };

  cartUpdateCallback = function (cart) {
    // Update quantity and price
    updateCountPrice(cart);
    buildCart(cart);
  };

  buildCart = function (cart) {
    // Start with a fresh cart div
    $cartContainer.empty();

    // Show empty cart
    if (cart.item_count === 0) {
      $cartContainer
        .append('<p>Your cart is currently empty.</p>');
      cartCallback(cart);
      return;
    }

    // Handlebars.js cart layout
    var items = [],
        item = {},
        data = {},
        source = $("#CartTemplate").html(),
        template = Handlebars.compile(source);

    // Add each item to our handlebars.js data
    $.each(cart.items, function(index, cartItem) {

      /* Hack to get product image thumbnail
       *   - If image is not null
       *     - Remove file extension, add _small, and re-add extension
       *     - Create server relative link
       *   - A hard-coded url of no-image
      */
      if (cartItem.image != null){
        var prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_small$1").replace('http:', '');
      } else {
        var prodImg = "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";
      }

      // Create item's data object and add to 'items' array
      item = {
        key: cartItem.key,
        line: index + 1, // Shopify uses a 1+ index in the API
        url: cartItem.url,
        img: prodImg,
        name: cartItem.product_title,
        variation: cartItem.variant_title,
        properties: cartItem.properties,
        itemAdd: cartItem.quantity + 1,
        itemMinus: cartItem.quantity - 1,
        itemQty: cartItem.quantity,
        price: Shopify.formatMoney(cartItem.price, settings.moneyFormat),
        vendor: cartItem.vendor,
        linePrice: Shopify.formatMoney(cartItem.line_price, settings.moneyFormat),
        originalLinePrice: Shopify.formatMoney(cartItem.original_line_price, settings.moneyFormat),
        discounts: cartItem.discounts,
        discountsApplied: cartItem.line_price === cartItem.original_line_price ? false : true
      };

      items.push(item);
    });

    // Gather all cart data and add to DOM
    data = {
      items: items,
      note: cart.note,
      totalPrice: Shopify.formatMoney(cart.total_price, settings.moneyFormat),
      totalCartDiscount: cart.total_discount === 0 ? 0 : "translation missing: en.cart.general.savings_html".replace('[savings]', Shopify.formatMoney(cart.total_discount, settings.moneyFormat)),
      totalCartDiscountApplied: cart.total_discount === 0 ? false : true
    }

    $cartContainer.append(template(data));

    cartCallback(cart);
  };

  cartCallback = function(cart) {
    $body.removeClass('drawer--is-loading');
    $body.trigger('afterCartLoad.ajaxCart', cart);

    if (window.Shopify && Shopify.StorefrontExpressButtons) {
      Shopify.StorefrontExpressButtons.initialize();
    }
  };

  adjustCart = function () {
    // Delegate all events because elements reload with the cart

    // Add or remove from the quantity
    $body.on('click', '.ajaxcart__qty-adjust', function() {
      if (isUpdating) {
        return;
      }

      var $el = $(this),
          line = $el.data('line'),
          $qtySelector = $el.siblings('.ajaxcart__qty-num'),
          qty = parseInt($qtySelector.val().replace(/\D/g, ''));

      var qty = validateQty(qty);

      // Add or subtract from the current quantity
      if ($el.hasClass('ajaxcart__qty--plus')) {
        qty += 1;
      } else {
        qty -= 1;
        if (qty <= 0) qty = 0;
      }

      // If it has a data-line, update the cart.
      // Otherwise, just update the input's number
      if (line) {
        updateQuantity(line, qty);
      } else {
        $qtySelector.val(qty);
      }
    });

    // Update quantity based on input on change
    $body.on('change', '.ajaxcart__qty-num', function() {
      if (isUpdating) {
        return;
      }

      var $el = $(this),
          line = $el.data('line'),
          qty = parseInt($el.val().replace(/\D/g, ''));

      var qty = validateQty(qty);

      // If it has a data-line, update the cart
      if (line) {
        updateQuantity(line, qty);
      }
    });

    // Prevent cart from being submitted while quantities are changing
    $body.on('submit', 'form.ajaxcart', function(evt) {
      if (isUpdating) {
        evt.preventDefault();
      }
    });

    // Highlight the text when focused
    $body.on('focus', '.ajaxcart__qty-adjust', function() {
      var $el = $(this);
      setTimeout(function() {
        $el.select();
      }, 50);
    });

    function updateQuantity(line, qty) {
      isUpdating = true;

      // Add activity classes when changing cart quantities
      var $row = $('.ajaxcart__row[data-line="' + line + '"]').addClass('is-loading');

      if (qty === 0) {
        $row.parent().addClass('is-removed');
      }

      // Slight delay to make sure removed animation is done
      setTimeout(function() {
        ShopifyAPI.changeItem(line, qty, adjustCartCallback);
      }, 250);
    }

    // Save note anytime it's changed
    $body.on('change', 'textarea[name="note"]', function() {
      var newNote = $(this).val();

      // Update the cart note in case they don't click update/checkout
      ShopifyAPI.updateCartNote(newNote, function(cart) {});
    });
  };

  adjustCartCallback = function (cart) {
    // Update quantity and price
    updateCountPrice(cart);

    // Reprint cart on short timeout so you don't see the content being removed
    setTimeout(function() {
      isUpdating = false;
      ShopifyAPI.getCart(buildCart);
    }, 150)
  };

  createQtySelectors = function() {
    // If there is a normal quantity number field in the ajax cart, replace it with our version
    if ($('input[type="number"]', $cartContainer).length) {
      $('input[type="number"]', $cartContainer).each(function() {
        var $el = $(this),
            currentQty = $el.val();

        var itemAdd = currentQty + 1,
            itemMinus = currentQty - 1,
            itemQty = currentQty;

        var source   = $("#AjaxQty").html(),
            template = Handlebars.compile(source),
            data = {
              key: $el.data('id'),
              itemQty: itemQty,
              itemAdd: itemAdd,
              itemMinus: itemMinus
            };

        // Append new quantity selector then remove original
        $el.after(template(data)).remove();
      });
    }
  };

  qtySelectors = function() {
    // Change number inputs to JS ones, similar to ajax cart but without API integration.
    // Make sure to add the existing name and id to the new input element
    var numInputs = $('input[type="number"]');

    if (numInputs.length) {
      numInputs.each(function() {
        var $el = $(this),
            currentQty = $el.val(),
            inputName = $el.attr('name'),
            inputId = $el.attr('id');

        var itemAdd = currentQty + 1,
            itemMinus = currentQty - 1,
            itemQty = currentQty;

        var source   = $("#JsQty").html(),
            template = Handlebars.compile(source),
            data = {
              key: $el.data('id'),
              itemQty: itemQty,
              itemAdd: itemAdd,
              itemMinus: itemMinus,
              inputName: inputName,
              inputId: inputId
            };

        // Append new quantity selector then remove original
        $el.after(template(data)).remove();
      });

      // Setup listeners to add/subtract from the input
      $('.js-qty__adjust').on('click', function() {
        var $el = $(this),
            id = $el.data('id'),
            $qtySelector = $el.siblings('.js-qty__num'),
            qty = parseInt($qtySelector.val().replace(/\D/g, ''));

        var qty = validateQty(qty);

        // Add or subtract from the current quantity
        if ($el.hasClass('js-qty__adjust--plus')) {
          qty += 1;
        } else {
          qty -= 1;
          if (qty <= 1) qty = 1;
        }

        // Update the input's number
        $qtySelector.val(qty);
      });
    }
  };

  validateQty = function (qty) {
    if((parseFloat(qty) == parseInt(qty)) && !isNaN(qty)) {
      // We have a valid number!
    } else {
      // Not a number. Default to 1.
      qty = 1;
    }
    return qty;
  };

  module = {
    init: init,
    load: loadCart
  };

  return module;

}(ajaxCart || {}, jQuery));

theme.assessLoadedRTEImage = function(el) {
  // container width
  var rteWidth = $(el).closest('.rte').width();
  // check original width
  if($(el)[0].naturalWidth > rteWidth) {
    // wider
    var para = $(el).parentsUntil('.rte').filter('p');
    if(para.length > 0) {
      para.addClass('expanded-width'); // inside a para already
    } else {
      $(el).wrap('<p class="expanded-width"></p>'); // put it inside a para
    }
  } else {
    // not wider
    $(el).closest('.expanded-width').removeClass('expanded-width');
  }
};


theme.drawersInit = function () {
  theme.RightDrawer = new theme.Drawers('CartDrawer', 'right', {
    'onDrawerOpen': ajaxCart.load
  });
}

theme.drawersInit();

// on image load
theme.assessRTEImagesOnLoad = function(container){
  $('.rte--expanded-images img:not(.exp-loaded)', container).each(function(){
    var originalImage = this;
    var img = new Image();
    $(img).on('load.rteExpandedImage', function(){
      $(originalImage).addClass('exp-loaded');
      theme.assessLoadedRTEImage(originalImage);
    });
    img.src = this.src;
    if(img.complete || img.readyState === 4) {
      // image is cached
      $(img).off('load.rteExpandedImage');
      $(originalImage).addClass('exp-loaded');
      theme.assessLoadedRTEImage(originalImage);
    }
  });
};

// initialise all images
theme.assessRTEImagesOnLoad();

// check any loaded images again on viewport resize
$(window).on('debouncedresize', function(){
  $('.rte--expanded-images img.exp-loaded').each(function(){
    theme.assessLoadedRTEImage(this);
  });
});

/**
 * Header Section Script
 * ------------------------------------------------------------------------------
 *
 * @namespace header
 */

theme.Header = (function() {
  /**
   * Header section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Header(container) {
    this.$container = $(container);
    this.namespace = theme.namespaceFromSection(container);
    this.$nav = $('.site-nav', container);
    this.$navLinks = this.$nav.children('.site-nav__item:not(.site-nav__more-links)');
    this.$navMoreLinksLink = $('.site-nav__more-links', this.$nav);
    this.$navMoreLinksContainer = $('.small-dropdown__container', this.$navMoreLinksLink);
    this.$navMoreLinksSubmenuContainer = $('.site-nav__more-links .more-links__dropdown-container', this.$nav);
    this.search = {
      ongoingRequest: null,
      ongoingTimeoutId: -1,
      throttleMs: 500,
      searchUrlKey: 'searchUrl',
      resultsSelector: '.search-bar__results',
      resultsLoadingClass: 'search-bar--loading-results',
      resultsLoadedClass: 'search-bar--has-results',
      loadingMessage: theme.strings.searchLoading,
      moreResultsMessage: 'See all [COUNT] results',
      emptyMessage: theme.strings.searchNoResults
    };

    var breakpoint = 767;

    $(this.$container).on('click' + this.namespace, '.js-search-form-open', this.searchFormOpen.bind(this));
      $(this.$container).on('click' + this.namespace, '.js-search-form-close', this.searchFormClose.bind(this));
      $(this.$container).on('click' + this.namespace, '.js-search-form-focus', this.searchFormFocus.bind(this));
      $(this.$container).on('click' + this.namespace, '.js-mobile-account-icon', this.mobileAccountOpen.bind(this));
      $(this.$container).on('click' + this.namespace, '.open-moverlay', this.mobileMenuOpen.bind(this));
      $(this.$container).on('click' + this.namespace, '.close-overlay', this.mobileMenuClose.bind(this));
      $(this.$container).on('click' + this.namespace, '.search-icon_mobile', this.mobileSearchToggle.bind(this));
      $(this.$container).on('focusin' + this.namespace, '.search-bar.desktop-only', this.searchFocusIn.bind(this));
      $(this.$container).on('focusout' + this.namespace, '.search-bar.desktop-only', this.searchFocusOut.bind(this));
      $(this.$container).on('click' + this.namespace, '.js-cart-open', this.cartOpen.bind(this));
      $(this.$container).on('click' + this.namespace, '.js-cart-close', this.cartClose.bind(this));
      $(window).on('scroll' + this.namespace, this.mobileSearchScroll.bind(this));

    // make hidden search fields un-tabbable
    this.setSearchTabbing.bind(this)();
    $('body').toggleClass('header-has-messages', this.$container.find('.store-messages-bar').length > 0);

    /**
     * Header messages bar carousel
     */
    $('.js-messages-slider', this.$container).slick({
      infinite: true,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: false,
      nextArrow: false
    });

    $('.slick-announcement', this.$container).slick({
      infinite: true,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: false,
      nextArrow: false
    });


    /**
    * Breakpoint to unslick above 767px
    */
    $('.js-mobile-messages-slider', this.$container).slick({
      infinite: true,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      mobileFirst: true,
      prevArrow: false,
      nextArrow: false,
      responsive: [
        {
          breakpoint: breakpoint,
          settings: 'unslick'
        }
      ]
    });

    /**
    * Reset the messages slider to use slick when screen size decreased to =< 767px
    */

    $(window).on('debouncedresize' + this.namespace, function(e) {
      $('.js-mobile-messages-slider', this.$container).slick('resize');
    });


    $(this.$container).on('click' + this.namespace, '.mobile-site-nav__icon', function(e){
      e.preventDefault();
      $(this).siblings('.mobile-site-nav__menu').slideToggle(250);
    });

    $(this.$container).on('click' + this.namespace, '.mobile-icon-rotate', function(e){
      e.preventDefault();
      $(this).toggleClass('submenu-open');
    });
    $(this.$container).on('click' + this.namespace, '.heading-site-nav__icon', function(e){
      e.preventDefault();
      $('.main-m_nav-menu').css('display','none');
    });

    /**
    * Open login in lightbox
    */
   
    // Docked nav
    if(this.$container.hasClass('docking-header')) {
      this.desktopHeaderWasDocked = false;
      this.$dockedDesktopContentsContainer = $('.docked-navigation-container__inner', container);
      this.$dockedDesktopBaseContainer = $('.docked-navigation-container', container);
      this.mobileHeaderWasDocked = false;
      this.$dockedMobileContentsContainer = $('.docked-mobile-navigation-container__inner', container);
      this.$dockedMobileBaseContainer = $('.docked-mobile-navigation-container', container);
      // check now
      (this.dockedNavCheck.bind(this))();
      $(window).on('load' + this.namespace, this.dockedNavCheck.bind(this));
      $(window).on('scroll' + this.namespace, this.dockedNavCheck.bind(this));
      $(window).on('debouncedresize' + this.namespace, this.dockedNavCheck.bind(this));
    }

    // Keep menu in one row
    (this.menuLinkVisibilityCheck.bind(this))();
    $(window).on('load' + this.namespace, this.menuLinkVisibilityCheck.bind(this));
    $(window).on('debouncedresize' + this.namespace, this.menuLinkVisibilityCheck.bind(this));

    // Display of overflow menu
    $(this.$container).on('mouseenter' + this.namespace, '.more-links--with-dropdown .site-nav__item', this.onMoreLinksSubMenuActive.bind(this));

    // nav enhancements
    this.navHoverDelay = 250;
    this.$navLastOpenDropdown = $();
    $(this.$container).on('mouseenter' + this.namespace + ' mouseleave' + this.namespace, '.site-nav__item--has-dropdown', (function(evt){
      var $dropdownContainer = $(evt.currentTarget);
      // delay on hover-out
      if(evt.type == 'mouseenter') {
        clearTimeout(this.navOpenTimeoutId);
        clearTimeout($dropdownContainer.data('navCloseTimeoutId'));
        var $openSiblings = $dropdownContainer.siblings('.open');

        // close all menus but last opened
        $openSiblings.not(this.$navLastOpenDropdown).removeClass('open');
        this.$navLastOpenDropdown = $dropdownContainer;

        // show after a delay, based on first-open or not
        var timeoutDelay = $openSiblings.length == 0 ? 0 : this.navHoverDelay;

        // open it
        var navOpenTimeoutId = setTimeout((function(){
          $dropdownContainer.addClass('open')
            .siblings('.open')
            .removeClass('open');
          var $dropdown = $dropdownContainer.children('.small-dropdown:not(.more-links-dropdown)');
          if($dropdown.length && $dropdownContainer.parent().hasClass('site-nav')) {
            var right = $dropdownContainer.offset().left + $dropdown.outerWidth();
            var transform = '',
                cw = this.$container.outerWidth() - 10;
            if(right > cw) {
              transform = 'translateX(' + (cw - right) + 'px)';
            }
            $dropdown.css('transform', transform);
          }

        }).bind(this), 300);

        this.navOpenTimeoutId = navOpenTimeoutId;
        $dropdownContainer.data('navOpenTimeoutId', navOpenTimeoutId);
      } else {
        // cancel opening, and close after delay
        clearTimeout($dropdownContainer.data('navOpenTimeoutId'));
        $dropdownContainer.data('navCloseTimeoutId', setTimeout(function(){
          $dropdownContainer.removeClass('open')
            .children('.small-dropdown:not(.more-links-dropdown)')
            .css('transform', '');
        }, this.navHoverDelay));
      }
      // a11y
      $dropdownContainer.children('[aria-expanded]').attr('aria-expanded', evt.type == 'mouseenter');
    }).bind(this));

    // keyboard nav
    $(this.$container).on('keydown' + this.namespace, '.site-nav__item--has-dropdown > .site-nav__link', this.dropdownLinkKeyPress.bind(this));

    // touch events
    $(this.$container).on('touchstart' + this.namespace + ' touchend' + this.namespace + ' click' + this.namespace, '.site-nav__item--has-dropdown > .site-nav__link', function(evt){
      if(evt.type == 'touchstart') {
        $(this).data('touchstartedAt', evt.timeStamp);
      } else if(evt.type == 'touchend') {
        // down & up in under a second - presume tap
        if(evt.timeStamp - $(this).data('touchstartedAt') < 1000) {
          $(this).data('touchOpenTriggeredAt', evt.timeStamp);
          if($(this).parent().hasClass('open')) {
            // trigger close
            $(this).parent().trigger('mouseleave');
          } else {
            // trigger close on any open items
            $('.site-nav__item.open').trigger('mouseleave');
            // trigger open
            $(this).parent().trigger('mouseenter');
          }
          // prevent fake click
          return false;
        }
      } else if(evt.type == 'click') {
        // if touch open was triggered very recently, prevent click event
        if($(this).data('touchOpenTriggeredAt') && evt.timeStamp - $(this).data('touchOpenTriggeredAt') < 1000) {
          return false;
        }
      }
    });
  };

  Header.prototype = $.extend({}, Header.prototype, {
    /**
      * Press return on dropdown parent to reveal children
      */
    dropdownLinkKeyPress: function(evt) {
      if(evt.which == 13) {
        if($(evt.target).closest('.site-nav__dropdown').length && $(evt.target).closest('.more-links').length) {
          // in more-links
          $(evt.target).trigger('mouseenter');
        } else {
          // normal dropdown
          var isOpen = $(evt.target).closest('.site-nav__item--has-dropdown').toggleClass('open').hasClass('open');
          // a11y
          $(evt.target).attr('aria-expanded', isOpen);
        }
        return false;
      }
    },

    /**
      * Ensure hidden search forms cannot be tabbed to
      */
    setSearchTabbing: function(evt) {
      $('.search-bar', this.$container).each(function(){
        if($(this).css('pointer-events') == 'none') {
          $(this).find('a, input, button').attr('tabindex', '-1');
        } else {
          $(this).find('a, input, button').removeAttr('tabindex');
        }
      });
    },

    /**
     * Event on focus of a more-links top-level link
     */
    onMoreLinksSubMenuActive: function(evt) {
      this.$navMoreLinksSubmenuContainer.empty();
      var $childMenu = $(evt.currentTarget).children('.site-nav__dropdown');
      if($childMenu.length) {
        var $clone = $childMenu.clone();
        // alter layout of mega nav columns
        $clone.find('.mega-dropdown__container .one-third').removeClass('one-third').addClass('one-half');
        $clone.find('.mega-dropdown__container .one-quarter').removeClass('one-quarter').addClass('one-third');
        $clone.find('.site-nav__promo-container > .three-quarters').removeClass('three-quarters').addClass('two-thirds');
        $clone.find('.site-nav__promo-container > .one-quarter').removeClass('one-quarter').addClass('one-third');
        // add to visible container
        $clone.appendTo(this.$navMoreLinksSubmenuContainer);
      }
      var submenuHeight = this.$navMoreLinksSubmenuContainer.outerHeight() + 30; // extra for nav padding
      this.$navMoreLinksSubmenuContainer.parent().css('min-height', submenuHeight);
      $(evt.currentTarget)
        .removeClass('more-links__parent--inactive')
        .addClass('more-links__parent--active')
        .siblings()
        .removeClass('more-links__parent--active')
        .addClass('more-links__parent--inactive');
      // a11y
      $(evt.target).attr('aria-expanded', true);
      $(evt.target).parent().siblings().find('a').attr('aria-expanded', false);
    },

    /**
     * Event for checking visible links in menu
     */
    menuLinkVisibilityCheck: function(evt) {
      var navWidth = this.$nav.width();
      var moreLinksWidth = this.$navMoreLinksLink.width();

      // check if we have too many links to show
      var spacingOffset = 4; // inline elements
      var total = 0;
      this.$navLinks.each(function(){
        total += $(this).width() + spacingOffset;
      });

      if(total > navWidth) {
        // calculate which links to move
        total = moreLinksWidth;
        var $_ref = this.$navMoreLinksContainer.empty();
        this.$navLinks.each(function(){
          total += $(this).width() + spacingOffset;
          if(total > navWidth) {
            $_ref.append(
              $(this).clone().removeClass('site-nav__invisible')
            );
            $(this).addClass('site-nav__invisible').find('a').attr('tabindex', '-1');
          } else {
            $(this).removeClass('site-nav__invisible').find('a').removeAttr('tabindex');
          }
        });
        this.$navMoreLinksContainer.find('a').removeAttr('tabindex');
        this.$navMoreLinksLink.removeClass('site-nav__invisible');
        this.$navMoreLinksLink.toggleClass('more-links--with-dropdown', this.$navMoreLinksLink.find('.small-dropdown:first, .mega-dropdown:first').length > 0);
        this.$navMoreLinksLink.toggleClass('more-links--with-mega-dropdown', this.$navMoreLinksLink.find('.mega-dropdown:first').length > 0);
        this.$navMoreLinksContainer.find('.small-dropdown').css('transform', '');
      } else {
        // hide more-links
        this.$navLinks.removeClass('site-nav__invisible');
        this.$navMoreLinksLink.addClass('site-nav__invisible');
        this.$navMoreLinksContainer.empty();
      }
    },

    /**
     * Event for showing the login in a modal
     */
    loginOpen: function(evt) {
      evt.preventDefault();
      theme.openPageContentInLightbox('/account/login');
    },

    /**
     * Event for showing the registration form in a modal
     */
    registerOpen: function(evt) {
      evt.preventDefault();
      theme.openPageContentInLightbox('/account/register');
    },

    /**
     * Event for showing the search bar
     */
    searchFormOpen: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      $('body').addClass('search-bar--open');
      
      $('.navigation__container').css('display', 'none');
      $('.search-header').css('display', 'none');
      $('.search-form__input').css('position', 'relative');
      $('.dock-mobile-menu-search').css('display', 'block');
    },

    /**
     * Event for transferring focus to the search bar input
     */
    searchFormFocus: function(evt) {
      $('.search-bar:visible input[name="q"]', this.$container).focus();
    },

    /**
     * Event for closing the search bar
     */
    searchFormClose: function(evt) {
      $('body').removeClass('search-bar--open');
      $('.navigation__container').css('display', 'flex');
      $('.search-header').css('display', 'block');
      $('.search-form__input').css('position', 'absolute');
      $('.dock-mobile-menu-search').css('display', 'none');
    },

    /**
     * Event for when focus enters the search bar
     */
    searchFocusIn: function(evt) {
      // ensure focus class is added by clearing any associated class removal
      clearTimeout(this.searchFocusOutTimeout);
      $('body').addClass('search-bar-in-focus');
    },

    /**
     * Event for when focus leaves the search bar
     */
    searchFocusOut: function(evt) {
      // defer in case focus on another element requires cancelling this
      this.searchFocusOutTimeout = setTimeout(function(){
        $('body').removeClass('search-bar-in-focus');
      }, 10);
    },

    /**
     * Event for clicks on the page focus tint
     */
   
    mobileAccountOpen : function(evt){
      $(document.body, this.$container).addClass('mobile-account-open');
      document.getElementById("myNav").style.display = "block";
      $('.header_account_container', this.$container).css('display', 'block');
    },

     mobileSearchToggle: function(evt) {
        var element = document.getElementById("mobile_search_toggle");
          element.classList.toggle("search_show_hide_mobile");
      },
      mobileSearchScroll: function(e){
        $("#mobile_search_toggle").addClass("search_show_hide_mobile");
      },

    /**
     * Event for showing the mobile navigation
     */
    mobileMenuOpen: function(evt) {
      // search & account close
      $(document.body, this.$container).addClass('mobile-menu-open header-fixed');
      document.getElementById("myNav").style.display = "block";
      $('.overlay-nav-m-wrapper', this.$container).css('display', 'block');
    },

    
    /**
     * Event for showing the cart navigation
     */
    cartOpen: function(evt) {
      $('.cart-summary', this.$container).css('display', 'block');
      $('.cart-summary', this.$container).addClass('cart-open');
      $(document.body, this.$container).addClass('cart-menu-open');
    },
    /**
     * Event for closing the cart navigation
     */
    cartClose: function(evt) {
      
      $('.cart-summary', this.$container).css('display', '');
      $('.cart-summary', this.$container).removeClass('cart-open');
      $(document.body, this.$container).removeClass('cart-menu-open');
    },
    
    /**
     * Event for closing the mobile navigation
     */
    mobileMenuClose: function(evt) {
      $(document.body, this.$container).removeClass('header-fixed mobile-menu-open search-search-open mobile-account-open');
      setTimeout(function(){ 
        $('.mobile-search-bar', this.$container).css('display', 'block');
        document.getElementById("myNav").style.display = "none"; 
        $('.overlay-nav-m-wrapper', this.$container).css('display', 'none');
        $('.header_search_container', this.$container).css('display', 'none');
        $('.header_account_container', this.$container).css('display', 'none');
      }, 200);      
    },
    
    /**
     * Check if we should dock both desktop/mobile header
     */
    dockedNavCheck: function(evt) {
      var scrollTop = $(window).scrollTop();
      var desktopShouldDock = $(window).width() >= theme.dockedNavDesktopMinWidth && this.$dockedDesktopBaseContainer.offset().top < scrollTop;
      var mobileShouldDock = $(window).width() < theme.dockedNavDesktopMinWidth && this.$dockedMobileBaseContainer.offset().top < scrollTop;

      if(desktopShouldDock) {
        // set dock placeholder height
        this.$dockedDesktopBaseContainer.css('height', '45px');
      } else {
        // remove placeholder height if undocking
        if(this.desktopHeaderWasDocked) {
          this.$dockedDesktopBaseContainer.css('height', '');
        }
      }

      if(mobileShouldDock) {
        // set dock placeholder height
        this.$dockedMobileBaseContainer.css('height', '50px');
        $('.navigation__container', this.$container).css('margin-top', this.$dockedMobileContentsContainer.outerHeight());

      } else {
        // remove placeholder height if undocking
        if(this.mobileHeaderWasDocked) {
          this.$dockedMobileBaseContainer.css('height', '');
          $('.navigation__container', this.$container).css('margin-top', '');
        }
      }
      $('.header-mobile-navigation').toggleClass('docked-header--dock', desktopShouldDock || mobileShouldDock);
      this.$container.toggleClass('docked-header--dock', desktopShouldDock || mobileShouldDock);

      // check menu links if width of nav has changed
      if(desktopShouldDock != this.desktopHeaderWasDocked) {
        (this.menuLinkVisibilityCheck.bind(this))();
      }

      this.desktopHeaderWasDocked = desktopShouldDock;
      this.mobileHeaderWasDocked = mobileShouldDock;
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
      $('.focus-tint').off(this.namespace);
      $(window).off(this.namespace);
      $('.js-messages-slider', this.$container).slick('unslick');
      $('.js-mobile-messages-slider', this.$container).slick('unslick');
    }
  });

  return Header;
})();



/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */

theme.Product = (function() {

  var selectors = $.extend({}, theme.variants.selectors, {
    productJson: '[data-product-json]',
    productImagesContainers: '.shopify-flex-icon',
    productThumbs: '[data-product-single-thumbnail]',
    productThumbb : '[data-product-single-thumbnails]',
    singleOptionSelector: '[data-single-option-selector]',
    stickyColumnSelector: '.sticky-element',
    skuWrapper: '.sku-wrapper',
    sku: '.sku-wrapper__sku',
    styledSelect: '.selector-wrapper select',
    relatedProductsCarousel: '.js-related-product-carousel',
    recentlyViewed: '.recently-viewed',
    productmetaJson : '[data-product-global-metafields-json]',
    metafieldTab: '.shopify_aplus_tab_btn',
    imgIconSlide : '.shopify_img_main_wrapper'
  });

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);
    this.namespace = theme.namespaceFromSection(container);

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    var sectionId = this.$container.attr('data-section-id');
    this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());
	this.productSinglemetaObject = JSON.parse($(selectors.productmetaJson, this.$container).html());
    var options = {
      $container: this.$container,
      enableHistoryState: this.$container.data('enable-history-state') || false,
      singleOptionSelector: selectors.singleOptionSelector,
      originalSelectorId: selectors.originalSelectorId,
      product: this.productSingleObject,
      productglobalMeta: this.productSinglemetaObject
    };
    this.settings = {};
    this.settings.imageSize = 'master';
    this.variants = new slate.Variants(options);
    this.$productThumbs = $(selectors.productThumbs, this.$container);
    this.$productThumbb = $(selectors.productThumbb, this.$container);
    this.$metaGlobal = options.productglobalMeta;
    
    this.$container.on('variantChange' + this.namespace, theme.variants.updateAddToCartState.bind(this));
    this.$container.on('variantPriceChange' + this.namespace, theme.variants.updateProductPrices.bind(this));

    if(this.$container.find(selectors.skuWrapper)) {
      this.$container.on('variantChange' + this.namespace, this.updateSKU.bind(this));
    }
    this.$container.on('variantImageChange' + this.namespace, this.updatevariantProductImage.bind(this));
   	this.showSlideshowActiveMeta = false;
	$(window).on('debouncedresize' + this.namespace, this.showProductImage.bind(this));
    this.showProductImage.bind(this)();
    $('.shopify_aplus_tab_button').on('click', 'div.shopify_aplus_tab_btn', this.metaTabImage.bind(this));
     $(selectors.metafieldTab, this.$container).on('click', this.metaTabImage.bind(this));
    this.productTags.bind(this)(options.product.tags);
    // style dropdowns
    theme.styleVariantSelectors($(selectors.styledSelect, container), options.product);

    // size chart
    this.$container.on('click', '.js-size-chart-open', function(e){
      e.preventDefault();
      $('body').addClass('size-chart-is-open');
    });

    this.$container.on('click', '.js-size-chart-close', function(){
      $('body').removeClass('size-chart-is-open');
    });

    const getOffsetTop = element => {
      let offsetTop = 0;
      while(element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent;
      }
      return offsetTop;
    }
    
    // calling
    const someElement = document.getElementById('product_bundle_main_thing_sticky');
    const X = getOffsetTop(someElement);
  
    var main_button_top = (document.getElementById("product_bundle_main_thing_sticky").offsetTop) + 50;
    var sticky_add = document.getElementById("sticky-add_to_Cart");
    // Get the offset position of the navbar
    window.onscroll = function() {myFunction()};
    function myFunction() {
      (window.pageYOffset >= main_button_top) ? sticky_add.style.display = "flex" : sticky_add.style.display = "none";
    }
    this.metfeildsManu.bind(this)(options.productglobalMeta);
  }

  Product.prototype = $.extend({}, Product.prototype, {
    metfeildsManu:function(e){
      
      function mobile_create_image(a){
        const new_m = `<img src="${a}" class="shopify_aplus_image_src_m" id="aplus_img_change_src_m"/>`;
        $('.shopify_aplus_tab_img_mobile').append(new_m);
      }
      function appendTabImagedesktop(b, c){
        const new_d = `<img src="${b}" class="shopify_aplus_image_src_d" id="aplus_img_change_src_d"/>`;
        $('.shopify_aplus_tab_img_desktop').append(new_d);
        mobile_create_image(c);
      }
      function createTabbtn(a){
        var shopify_tab_a = [e.SHOPIFY_TAB_1, e.SHOPIFY_TAB_2, e.SHOPIFY_TAB_3],shopify_tab_b = [[e.SHOPIFY_TAB_1_IMG_D, e.SHOPIFY_TAB_1_IMG_M], [e.SHOPIFY_TAB_2_IMG_D, e.SHOPIFY_TAB_2_IMG_M], [e.SHOPIFY_TAB_3_IMG_D, e.SHOPIFY_TAB_3_IMG_M]];
        for (let i = 0; i < a; i++){
          if(i === 0){
            $('.shopify_aplus_tab_button').append(`<div class="shopify_aplus_tab_btn active_shopify_aplus" data-tab-value="${shopify_tab_b[i]}" data-animation="fadeInUp" data-animation-delay="900ms" style="text-transform: uppercase;">${shopify_tab_a[i]}</div>`)
          }else {
            $('.shopify_aplus_tab_button').append(`<div class="shopify_aplus_tab_btn" data-tab-value="${shopify_tab_b[i]}" data-animation="fadeInUp" data-animation-delay="900ms" style="text-transform: uppercase;">${shopify_tab_a[i]}</div>`)
          }
        }
      }
      var width_sc = $(window).width();
      if(e.SHOPIFY_TAB_1 != "default" && e.SHOPIFY_TAB_2 == "default" && e.SHOPIFY_TAB_3 == "default"){
         $('.shopify_aplus_tab_button').css('display','none');
        (width_sc < 700) ? mobile_create_image(e.SHOPIFY_TAB_1_IMG_M) : appendTabImagedesktop(e.SHOPIFY_TAB_1_IMG_D, e.SHOPIFY_TAB_1_IMG_M);
      }else if(e.SHOPIFY_TAB_1 != "default" && e.SHOPIFY_TAB_2 != "default" && e.SHOPIFY_TAB_3 == "default"){
        const two = 2;
        createTabbtn(two);
        (width_sc < 700) ? mobile_create_image(e.SHOPIFY_TAB_1_IMG_M) : appendTabImagedesktop(e.SHOPIFY_TAB_1_IMG_D, e.SHOPIFY_TAB_1_IMG_M);
      }
    },
    
    metaTabImage:function(evt){
      var split_im =  (evt.target.dataset.tabValue).split(','),width_sc = $(window).width();
      $('.shopify_aplus_avtar_image_h').css('display','block');
      function appendTabImagemobile(a){
        document.getElementById("aplus_img_change_src_m").src = a;
        $('.shopify_aplus_avtar_image_h').css('display','none');
      }
      function appendTabImagedesktop(b, c){
        document.getElementById("aplus_img_change_src_d").src = b;
        appendTabImagemobile(c);
      }
      (width_sc < 700) ? appendTabImagemobile(split_im[1]) : appendTabImagedesktop(split_im[0], split_im[1]);
    },
    
    showProductImage: function(all){
     
     var windowWidth = $(window).width();
     if(windowWidth < 541){
        if(!this.showSlideshowActiveMeta) {
          console.log("Enterrr");
          $('.shopify_mobile_slick_aplus').slick({
            centerMode: true,
            centerPadding: '20px',
            fade: false,
            dots:true,
            arrows: false,
            slidesToShow: 1
          });

          this.showSlideshowActiveMeta = true;
        }
      }else {
        if(this.showSlideshowActiveMeta) {
          $('.shopify_mobile_slick_aplus').slick('unslick');
          this.showSlideshowActiveMeta = false;
        }
      }
    },

    /**
     * Updates the SKU
     */
    updateSKU: function(evt) {
      var variant = evt.variant;
      $(".bread-sku").text(variant.sku);
      $(".small-sku").text(variant.sku);
      document.getElementById("get-offset-top").setAttribute("data-SKY_two", variant.sku);
      if (variant && variant.sku) {
        $(selectors.skuWapper, this.$container).removeClass('sku-wrapper--empty');
        $(selectors.sku, this.$container).html(variant.sku);
        
      } else {
        $(selectors.skuWrapper, this.$container).addClass('sku-wrapper--empty');
        $(selectors.sku, this.$container).empty();
      }
    },

    productTags : function(data){
      
    },


    updatevariantProductImage : function(evt){
      var flag = false;
      function mySandwich(evt) {
          var $div = $("<div>", {id: "variant-new-image", "class": "product-main-image"});
          var $divthumb = $("<div>", {id: "variant-new-image-thumb", "class": "product-main-image-thumb"});
          let filterItems = (arr, query) => {
            return arr.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) > -1);
          };
        var newImagelist = filterItems(evt.product, evt.variant.sku);
        if($('.product-variant-update-desktop').hasClass("active")){
          $('.product-main-image').remove();
          $('.product-main-image-thumb').remove();
          $(".product-variant-update-desktop").append($div);
          $(".product-variant-update-desktop-thumb").append($divthumb);
          loadImage(newImagelist);
          slick();
          $('.product-variant-update-desktop').css('opacity','1');
          $('.product-variant-update-desktop-thumb').css('opacity', '1');
        }else {
          $('.product-detail__images_p').remove();
          $('.product-single__thumbnails__p').remove();
          $(".product-variant-update-desktop").append($div);
          $(".product-variant-update-desktop-thumb").append($divthumb);
          loadImage(newImagelist); 
          slick();
          $('.product-variant-update-desktop').css('opacity','1');
          $('.product-variant-update-desktop-thumb').css('opacity', '1');
        }
        $('.product-variant-update-desktop').addClass("active");
        function loadImage(img){
          for (let i = 0 ; i< img.length ; i++){
            var filename =  img[i].split(".").slice(0, -1).join(".");
            var ext = img[i].split(".")[3];
            var newscr =  filename+"_{width}x."+ext;
            const imgHtml = `
              <div>
                <a href="${img[i]}" class="global-border-radius">  
                  <div class="rimage-outer-wrapper" style="max-width: 2600px; max-height: 2600px">
                    <div class="rimage-wrapper lazyload--placeholder" style="padding-top:100.0%">
                      <img
                        class="rimage__image lazyload fade-in"
                        src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'/%3E"
                        data-src="${newscr}"
                        data-widths="[ 360, 460, 540, 720, 800]"
                        data-aspectratio="1.0"
                        data-sizes="auto"
                        alt="${evt.variant.name}"
                      />
                    </div>
                  </div>
                </a>
              </div>`;
              const imgHtmlthumb = `
              <div>
                <a class="global-border-radius">
                  <div class="rimage-outer-wrapper" style="max-width: 2600px; max-height: 2600px">
                  <div class="rimage-wrapper lazyload--placeholder" style="padding-top:100.0%">
                    <img
                      class="rimage__image lazyload fade-in"
                      src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'/%3E"
                      data-src="${newscr}"
                      data-widths="[60,80]"
                      data-aspectratio="1.0"
                      data-sizes="auto"
                      alt="${evt.variant.name}"
                    />
                  </div>
                </div>
                </a>
              </div>`;
            $('.product-main-image').append(imgHtml);
            $('.product-main-image-thumb').append(imgHtmlthumb);
          }             
        }
        function slick (){
            $('.product-main-image').slick({
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: false,
              fade: true,
              asNavFor: '.product-main-image-thumb',
              responsive : [{
                breakpoint: 967,
                settings: {
                  fade: false,
                  dots:true
                }
              }]
            }); 
            $('.product-main-image-thumb').slick({
              slidesToShow: 4,
              slidesToScroll: 1,
              asNavFor: '.product-main-image',
              dots: false,
              focusOnSelect: true,
              verticalSwiping: true,
              vertical:true
            });
          }
      }
      mySandwich(evt);
    },
    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
      $(document).off(this.namespace);
      $(window).off(this.namespace);
    }
  });

  return Product;
})();

$(document).ready(function() {
  

  //accordion
    var acc = document.getElementsByClassName("product-accordion");
    var panel = document.getElementsByClassName('product-accordion-panel');
    for (var i = 0; i < acc.length; i++) {
      acc[i].onclick = function() {
        var setClasses = !this.classList.contains('active');
        setClass(acc, 'active', 'remove');
        
        if (setClasses) {
          this.classList.toggle("active");
          this.nextElementSibling.classList.toggle("show");
        }
      }
    }
    function setClass(els, className, fnName) {
      for (var i = 0; i < els.length; i++) {
        els[i].classList[fnName](className);
      }
    }
  $('.products-tabs-down a').click(function(){
    var tabz = $(this).data("tab");
    $('.tabsx').css('display', 'none');
    $('.products-tabs-down a').removeClass('active')
    $(this).addClass('active');
    var jk = tabz;
    if(jk == 'about-5'){
      window.location.href = "https://bestchoiceproducts.com/pages/careers";
    }
    if(jk == 'account_profile'){
      window.location.href = "https://bestchoiceproducts.com/account/addresses";
    }
    if(jk == 'account_fev'){
      window.location.href = "https://bestchoiceproducts.com/pages/my-wishlist";
    }
    if(jk == 'dashboard'){
      window.location.href = "https://bestchoiceproducts.com/account/";
    }
    $('#' + tabz).css('display', 'block');
    return false;
  });


//video overlay logic

$(".js-overlay-start").unbind("click").bind("click", function(e) {
	e.preventDefault();
	var src = $(this).attr("data-url");
	$(".overlay-video").show();
	setTimeout(function() {
		$(".overlay-video").addClass("o1");
		$("#player").attr("src", src);
	}, 100);
});

$(".overlay-video").click(function(event) {
	if (!$(event.target).closest(".videoWrapperExt").length) {
		var PlayingVideoSrc = $("#player").attr("src").replace("&autoplay=1", "");
		$("#player").attr("src", PlayingVideoSrc);
		$(".overlay-video").removeClass("o1");
		setTimeout(function() {
			$(".overlay-video").hide();
		}, 600);
	}
});
$(".close").click(function(event) {
  var PlayingVideoSrc = $("#player").attr("src").replace("&autoplay=1", "");
  $("#player").attr("src", PlayingVideoSrc);
  $(".overlay-video").removeClass("o1");
  setTimeout(function() {
    $(".overlay-video").hide();
  }, 600);

});
$('.three-image-building-product').slick({
  responsive : [
    {
      breakpoint: 9999,
      settings: "unslick"
    },
    {
      breakpoint: 700,
      settings: {
        adaptiveHeight: true,
        arrows: false,
        dots: true,
        autoplay : true,
        autoplaySpeed : 4000
      }
    } 
  ]
});
});
  
  

/**
 * Footer Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the List Collections template.
 *
   * @namespace Footer
 */

theme.Footer = (function() {
  /**
   * Footer section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Footer(container) {
    this.$container = $(container);
    this.namespace = theme.namespaceFromSection(container);
  
    this.accordionSection.bind(this)();
    $(window).on('debouncedresize' + this.namespace, this.accordionSection.bind(this));
  };
  
  Footer.prototype = $.extend({}, Footer.prototype, {

    accordionSection: function(evt) {
      var windowWidth = $(window).width();
      if(windowWidth < 768) {
        
      }
    },

    onUnload: function() {
      $(window).off(this.namespace);
    }
  });

  return Footer;
})();


theme.icons = {
  close: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
};

theme.cacheSelectors = function () {
  theme.cache = {
    // General
    $html: $('html'),
    $body: $(document.body),
    $w: $(window),
    
    // Equal height elements
    $prodGrid: $('.products .grid__item .col-product'),
    // Navigation
    $navigation: $('#AccessibleNav'),
    $productImage: $('.product-featured-img'),
    $productImageGallery: $('.gallery__item'),
  }
};

theme.cacheSelectors();

theme.checkCurrency = function(){
  if(window.Currency && Currency.convertAll) {
    // set initial value for uninitialised prices
    $('.theme-money:not([data-currency-'+theme.Currency.shopCurrency+'])').each(function() {
      $(this).attr('data-currency-'+theme.Currency.shopCurrency, $(this).html());
    });
    // convert all
    Currency.convertAll(theme.Currency.shopCurrency, jQuery('[name=currencies]').val(), Currency.currencyContainer);
  }
}

theme.styleVariantSelectors = function($els, data, inLightbox){
 
  var $clickies = $els.filter(function(){
    return typeof $(this).data('listed') != 'undefined'
  });

  $clickies.each(function(){
    // list options out, bound to the original dropdown
    $(this).clickyBoxes();

    // change swatch label on hover
    var $label = $(this).closest('.selector-wrapper').find('.variant-option-title');
    if($label.length) {
      $label.data('default-content', $label.html());
      $(this).siblings('.clickyboxes').on('change', function() {
        $label.data('default-content', $(this).find('a.active').data('value'));
      }).on('mouseenter', 'a', function(){
        var swatchlable = $(this).data('value');
        if (swatchlable.indexOf(";") != -1 ){
          var optioncolor = swatchlable.split(";")[0];
          $label.html(optioncolor);
        }else{
          $label.html($(this).data('value'));
        }
      }).on('mouseleave', 'a', function(){
        var _swatchlable = $label.data('default-content');
        if (_swatchlable.indexOf(";") != -1 ){
          var optioncolors = _swatchlable.split(";")[0];
          $label.html(optioncolors);
        }else{
          $label.html($label.data('default-content'));
        }
      });
    }
  });

  // If we have clicky-boxes, add the disabled-state to options that have no valid variants
  if($clickies.length > 0) {
    // each option
    for(var optionIndex = 0; optionIndex < data.options.length; optionIndex++) {
      // list each value for this option
      var optionValues = {};
      for(var variantIndex = 0; variantIndex < data.variants.length; variantIndex++) {
        var variant = data.variants[variantIndex];
        if(typeof optionValues[variant.options[optionIndex]] === 'undefined') {
          optionValues[variant.options[optionIndex]] = false;
        }
        // mark true if an option is available
        if(variant.available) {
          optionValues[variant.options[optionIndex]] = true;
        }
      }
      // mark any completely unavailable options
      for(var key in optionValues) {
        if(!optionValues[key]) {
          $($els[optionIndex]).siblings('.clickyboxes').find('li a').filter(function(){
            return $(this).data('value') == key;
          }).addClass('unavailable');
        }
      }
    }
  }

  // dropdowns
  $els.not($clickies).each(function(){
    // apply select2 to dropdown
    var config = {};
    if(inLightbox) {
      config.dropdownParent = $('#cboxWrapper');
    }
    theme.select2.init($(this), config);
  });
  if(inLightbox) {
    $.colorbox.resize();
  }
};
theme.select2 = {
  init: function($els, config){
    var standardSelectOptions = {
      minimumResultsForSearch: Infinity
    };
    var swatchSelectOptions = {
      minimumResultsForSearch: Infinity,
      templateResult: theme.select2.swatchSelect2OptionTemplate,
      templateSelection: theme.select2.swatchSelect2OptionTemplate
    };
    if(typeof config !== 'undefined') {
      standardSelectOptions = $.extend(standardSelectOptions, config);
      swatchSelectOptions = $.extend(swatchSelectOptions, config);
    }
    $els.each(function(){
      $(this).select2($(this).data('colour-swatch') ? swatchSelectOptions : standardSelectOptions);
    });
  },
  swatchSelect2OptionTemplate: function(state) {
    if (state.id) {
      var colourKey = state.id.toLowerCase().replace(/[^a-z0-9]+/g, '');
      return $([
        '<div class="swatch-option">',
        '<span class="swatch-option__nugget bg-', colourKey, '"></span>',
        '<span class="swatch-option__label">', state.text, '</span>',
        '</div>'
      ].join(''));
    } else {
      return $([
        '<div class="swatch-option swatch-option--all">',
        '<span class="swatch-option__label">', state.text, '</span>',
        '</div>'
      ].join(''));
    }
  }
};

theme.namespaceFromSection = function(container) {
  return ['.', $(container).data('section-type'), $(container).data('section-id')].join('');
}


// global helpers for the docked nav
theme.dockedNavDesktopMinWidth = 768;
theme.dockedNavHeight = function() {
  if($(window).width() >= theme.dockedNavDesktopMinWidth) {
    if($('.docked-navigation-container').length) {
      return $('.docked-navigation-container__inner').height();
    }
  } else {
    if($('.docked-mobile-navigation-container').length) {
      return $('.docked-mobile-navigation-container__inner').height();
    }
  }
  return 0;
}

$(document).ready(function() {
var sections = new slate.Sections();
sections.register('header', theme.Header);
sections.register('footer', theme.Footer);
sections.register('product', theme.Product);



    // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

     // Target tables to make them scrollable
     var tableSelectors = '.rte table';

     slate.rte.wrapTable({
       $tables: $(tableSelectors),
       tableWrapperClass: 'rte__table-wrapper',
     });
     if (slate.cart.cookiesEnabled()) {
      document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
    }
      // quantity wrapper
  $(document).on('change', '.quantity-proxy', function(){
    var value = $(this).val();
    var $input = $(this).siblings('[name="quantity"]');
    if(value == '10+') {
      $input.val('10').closest('.quantity-wrapper').addClass('hide-proxy');
      setTimeout(function(){
        $input.select().focus();
      }, 10);
    } else {
      $input.val(value);
    }
  });

      // resize height of accent colour on homepage
      if($('.accent-background').length) {
        // run now, and after fonts are loaded, then on resize
        theme.resizeAccent();
        $(window).on('load debouncedresize', theme.resizeAccent);
    
        // run when the section at the top loads
        $(document).on('shopify:section:load', function(evt){
          if($(evt.target).prev().hasClass('accent-background')) {
            theme.resizeAccent();
          }
        });
    
        // a section may have moved to/away from the top
        $(document).on('shopify:section:reorder', theme.resizeAccent);
      }

  $('.video-overlat-start').click(function(e) {
      var v_src = $(this).attr("data-src");
      document.getElementById('youtube').src = 'https://www.youtube.com/embed/'+v_src+'?showinfo=0&autoplay=1'; // adding autoplay to the URL
      document.getElementById('video').style.display = 'block';
      
  })
  // Hiding the lightbox and removing YouTube autoplay
  $('.close_video').click(function(e) {
    document.getElementById('youtube').src = '';
    document.getElementById('video').style.display = 'none';
  });

  function init_slick_bundle() {
    $('#product_bundle_wrapper').slick({
      responsive: [
        {
          breakpoint: 9999,
          settings: "unslick"
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            arrows : false,
            infinite: false, 
            dots: true
          }
        }
      ]
    });
  }
var selectors = {productJson: '[data-product-json]'}
var productSingleObjects = JSON.parse($(selectors.productJson).html());
var options_my = {products: productSingleObjects}
var tagss = options_my.products.tags;
final_call_bundle(tagss);

async function product_bundles(a){
  var new_final_handle = [];var new_sku_bundle = [];
  for (let i = 0 ; i < a.length ; i ++) {
    if (a[i].match(/product_bundle/i)){
      document.getElementById("product_bundle_title").style.display = "block";
      var w = window.innerWidth;
      if(w > 541){
        document.getElementById("product_bundle_wrapper").style.display = "flex";
      }else {
        document.getElementById("product_bundle_wrapper").style.display = "block";
      }
      var product_bundle_k =  a[i].split(":");
      var new_thins_happen = product_bundle_k[1].split("|");
      new_final_handle.push(new_thins_happen[0]);
      new_sku_bundle.push(new_thins_happen[1])
    }
  }
  return [new_final_handle, new_sku_bundle];
};
async function final_call_bundle(e){
  var new_data = await product_bundles(tagss);
  var final_result = await loadProductRecommendationsIntoSection(new_data[0], new_data[1]);
  createHtmlBundle(final_result.final_data_title, final_result.final_data_image, final_result.final_data_price, final_result.final_data_variant_id, final_result.final_qty, final_result.final_link); 
  if((new_data[0].length) > 2){
    init_slick_bundle(); 
  }
};
var counter_product_recomedition = 0 ;
async function loadProductRecommendationsIntoSection (ar_pr, ar_pr_sku) {

  var final_data_title =[] ;
var final_data_image =[] ;
var final_data_price =[] ;
var final_qty = [];
var final_link = [];
var final_data_variant_id = [];
  for (let i=0; i<ar_pr.length; i++){
  if(counter_product_recomedition === 3 ){
    break;
  }else {
    var r_d = ar_pr[i].replace(/\"/g,"");
    const result = await $.ajax({
      url: '/products/' +r_d+ '.json',
      type: 'GET',
      success: function (data) {
        push_Price(data.product ,ar_pr_sku[i], ar_pr[i]);
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR, textStatus, errorThrown);
      }
    });
  }
}
function push_Price(ne, ne_id,link){
  var iamge_a = ne.images;
  var new_image = [];
  var variant_a = ne.variants;
  for(let h=0; h <iamge_a.length ; h++ ){
    var n=(iamge_a[h].src).slice(6);
    new_image.push(n);
  }
  let filterItemss = (arr, query) => {
    return arr.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) > -1);
  };
  var newImagelists = filterItemss(new_image, ne_id);
  if(newImagelists.length == 0){
    console.log("TEsting");
  }else {
    for(let k = 0 ; k < variant_a.length ; k++){
      if(variant_a[k].sku == ne_id){
        if(variant_a[k].inventory_quantity == 0){
          console.log("inventory 0");
        }else{
          final_data_title.push(ne.title);
          final_link.push(link);
          final_data_image.push(newImagelists[0]);
          final_data_price.push(variant_a[k].price);
          final_qty.push(variant_a[k].inventory_quantity);
          final_data_variant_id.push(variant_a[k].id);
          counter_product_recomedition++;
        }
      }
    }
  }
}
return {
  final_data_title: final_data_title,
  final_data_image: final_data_image,
  final_data_price: final_data_price,
  final_data_variant_id: final_data_variant_id,
  final_qty: final_qty,
  final_link:final_link
  };
};

function one_bundle_ajax(){

jQuery(function($) {
ajaxCart.init({
  formSelector: '#AddToCartForm_one',
  cartContainer: '#CartContainer',
  addToCartSelector: '.AddToCart_bundle_one',
  cartCountSelector: '.cart-count',
  cartCostSelector: '.cart-total',
  moneyFormat: theme.moneyFormat
});
});
};
function two_bundle_ajax(){
jQuery(function($) {
ajaxCart.init({
  formSelector: '#AddToCartForm_two',
  cartContainer: '#CartContainer',
  addToCartSelector: '.AddToCart_bundle_two',
  cartCountSelector: '.cart-count',
  cartCostSelector: '.cart-total',
  moneyFormat: theme.moneyFormat
});
});
};
function three_bundle_ajax(){
jQuery(function($) {
ajaxCart.init({
  formSelector: '#AddToCartForm_three',
  cartContainer: '#CartContainer',
  addToCartSelector: '.AddToCart_bundle_three',
  cartCountSelector: '.cart-count',
  cartCostSelector: '.cart-total',
  moneyFormat: theme.moneyFormat
});
});
};
function createHtmlBundle(a,b,c,d_id, qt, hand){
  var add_title = ["bundle_title_one", "bundle_title_two", "bundle_title_three"];
  var add_price = ["bundle_price_one", "bundle_price_two", "bundle_price_three"];
  var add_link = ["bundle_link_one", "bundle_link_two", "bundle_link_three"];
  var add_image = ["product_bundle_image_one", "product_bundle_image_two", "product_bundle_image_three"];
  var add_variant = ["input_sticky_id_one", "input_sticky_id_two", "input_sticky_id_three"];
  var display_wrapper = ["bundle_wrapper_one", "bundle_wrapper_two", "bundle_wrapper_three"]
  var add_button = ["AddToCart_bundle_one", "AddToCart_bundle_two", "AddToCart_bundle_three"];
  var ajax_function = [one_bundle_ajax, two_bundle_ajax, three_bundle_ajax];
  for(let z=0 ; z<a.length ; z++) {
    var filenames =  b[z].split(".").slice(0, -1).join(".");
    var exts = b[z].split(".")[3];
    var length = 40;
    var myTruncatedString = a[z].substring(0,length);
    var newscrs =  filenames+"_200x200."+exts;
    if((a.length) > 1){
      $(`#${[display_wrapper[z]]}`).css('display','block');
    }else{
      $(`#${[display_wrapper[z]]}`).css('display','inline-block');
    }
    $(`.${[add_button[z]]}`).show(); 
    $(`.${[add_title[z]]}`).text(myTruncatedString+'...');
    $(`.${[add_price[z]]}`).text('$'+c[z]);
    $(`#${[add_link[z]]}`).attr("href", "https://bestchoiceproducts.com/products/"+hand[z]);
    $(`.${[add_image[z]]}`).attr("src", newscrs);
    $(`#${[add_variant[z]]}`).val(d_id[z]);
    ajax_function[z]();
  }
  return true;
}
  jQuery(function($) {
    ajaxCart.init({
      formSelector: '#AddToCartForm_main',
      cartContainer: '#CartContainer',
      addToCartSelector: '.AddToCart_main',
      cartCountSelector: '.cart-count',
      cartCostSelector: '.cart-total',
      moneyFormat: theme.moneyFormat
    });
  });
  

  jQuery(document.body).on('afterCartLoad.ajaxCart', function(evt, cart) {
    // Bind to 'afterCartLoad.ajaxCart' to run any javascript after the cart has loaded in the DOM
    theme.RightDrawer.open();
  });
 
 slickproduct($('.product-detail__images_p'),$('.product-single__thumbnails__o'));
    function slickproduct(a,b){
      a.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: b,
        responsive : [
          {
            breakpoint: 967,
            settings: {
              dots:true,
              fade: false
            }
          } 
        ]
      });
      b.slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: a,
        dots: false,
        infinite: true,
        focusOnSelect: true,
        verticalSwiping: true,
        vertical:true
      });
    }
    $(".buy_now_sticky").click(function(e){
      e.preventDefault();
      document.getElementById('product-right-id').scrollIntoView({behavior: "smooth", inline: "nearest"});
    });
  
  
  //aplus
  	var doAnimations = function() {
   	// Calc current offset and get all animatables
		var offset = $(window).scrollTop() + $(window).height(),
			$animatables = $('.animatable');
		
		// Unbind scroll handler if we have no animatables
		if ($animatables.length == 0) {
		  $(window).off('scroll', doAnimations);
		}
		
		// Check all animatables and animate them if necessary
			$animatables.each(function(i) {
		   var $animatable = $(this);
				if (($animatable.offset().top + $animatable.height() - 20) < offset) {
			$animatable.removeClass('animatable').addClass('animated');
				}
		});
	
		};
	  // Hook doAnimations on scroll, and trigger a scroll
		$(window).on('scroll', doAnimations);
	  $(window).trigger('scroll');
	  var Animation = function({ offset } = { offset: 10 }) {
		var _elements;
	  
		// Define a dobra superior, inferior e laterais da tela
		var windowTop = offset * window.innerHeight / 100;
		var windowBottom = window.innerHeight - windowTop;
		var windowLeft = 0;
		var windowRight = window.innerWidth;
	  
		function start(element) {
		  // Seta os atributos customizados
		  element.style.animationDelay = element.dataset.animationDelay;
		  element.style.animationDuration = element.dataset.animationDuration;
		  // Inicia a animacao setando a classe da animacao
		  element.classList.add(element.dataset.animation);
		  // Seta o elemento como animado
		  element.dataset.animated = "true";
		}
	  
		function isElementOnScreen(element) {
		  // Obtem o boundingbox do elemento
		  var elementRect = element.getBoundingClientRect();
		  var elementTop =
			elementRect.top + parseInt(element.dataset.animationOffset) ||
			elementRect.top;
		  var elementBottom =
			elementRect.bottom - parseInt(element.dataset.animationOffset) ||
			elementRect.bottom;
		  var elementLeft = elementRect.left;
		  var elementRight = elementRect.right;
	  
		  // Verifica se o elemento esta na tela
		  return (
			elementTop <= windowBottom &&
			elementBottom >= windowTop &&
			elementLeft <= windowRight &&
			elementRight >= windowLeft
		  );
		}
	  
		// Percorre o array de elementos, verifica se o elemento está na tela e inicia animação
		function checkElementsOnScreen(els = _elements) {
		  for (var i = 0, len = els.length; i < len; i++) {
			// Passa para o proximo laço se o elemento ja estiver animado
			if (els[i].dataset.animated) continue;
	  
			isElementOnScreen(els[i]) && start(els[i]);
		  }
		}
	  
		// Atualiza a lista de elementos a serem animados
		function update() {
		  _elements = document.querySelectorAll(
			"[data-animation]:not([data-animated])"
		  );
		  checkElementsOnScreen(_elements);
		}
	  
		// Inicia os eventos
		window.addEventListener("load", update, false);
		window.addEventListener("scroll", () => checkElementsOnScreen(_elements), { passive: true });
		window.addEventListener("resize", () => checkElementsOnScreen(_elements), false);
	  
		// Retorna funcoes publicas
		return {
		  start,
		  isElementOnScreen,
		  update
		};
	  };
	  
	  // Initialize
	  var options = {
		offset: 2 //percentage of window
	  };
	  var animation = new Animation(options);
  		$('div.shopify_aplus_tab_btn').click(function(e) {
          $('.active_shopify_aplus').removeClass('active_shopify_aplus');
          $(this).addClass('active_shopify_aplus');
        });
  
  		if (!("ontouchstart" in document.documentElement)) {
         $(".question_mark_covid").hover(function() {
            $('.covid_19_tooltip').css({'display': 'block'});
          }, function(){
            $('.covid_19_tooltip').css({'display': 'none'});
          });
        }else {
          $(".question_mark_covid").click(function() {
          	 $('.covid_19_tooltip').css({'display': 'block'});
          });
          $('.close_toolkit').click(function () {
          	$('.covid_19_tooltip').css({'display': 'none'});
          });
        }
  
  	

      //smooth scroll to aplus
      $("a").on('click', function(event) {
        if (this.hash !== "") {
          event.preventDefault();
          var hash = this.hash;
          $('html, body').animate({
            scrollTop: ($(hash).offset().top)-76
          }, 600, function(){
            
          });
        } // End if
      });
   $('#delete_iframe').on('click', function(event) {
        console.log("lsdhgkjldsn");
        document.getElementById('youtube_container').style.display = 'none';document.getElementById('background-video').style.display = 'block';
      });

  
  });
})(theme.jQuery);