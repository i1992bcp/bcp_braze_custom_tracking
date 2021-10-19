(function($){
  var $ = jQuery = $;
  
  window.slate = window.slate || {};
  window.theme = window.theme || {};
  
  // /*============== Translations ===============*/
  // theme.strings = $.extend(theme.strings, {
  //   addressError: {{ 'map.errors.address_error' | t | json }},
  //   addressNoResults: {{ 'map.errors.address_no_results' | t | json }},
  //   addressQueryLimit: {{ 'map.errors.address_query_limit_html' | t | json }},
  //   authError: {{ 'map.errors.auth_error_html' | t | json }},
  //   addingToCart: {{ 'products.product.adding' | t | json }},
  //   addedToCart: {{ 'products.product.added' | t | json }},
  //   cart: {{ 'layout.cart.title' | t | json }},
  //   cartTermsNotChecked: {{ 'cart.terms.confirmation' | t | json }},
  //   searchLoading: {{ 'layout.header.search_loading' | t | json }},
  //   searchNoResults: {{ 'layout.header.search_no_results' | t | json }},
  //   priceFrom: {{ 'products.product.from_text' | t | json }},
  //   quantityTooHigh: {{ 'cart.general.quantity_too_high' | t | json }},
  //   onSale: {{ 'products.product.on_sale' | t | json }},
  //   soldOut: {{ 'products.product.sold_out' | t | json }}
  // });
  
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
  
  /*=============== Components ===============*/
  
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
  
  function attributeToString(t){return"string"!=typeof t&&"undefined"===(t+="")&&(t=""),jQuery.trim(t)}"undefined"==typeof Shopify&&(Shopify={}),Shopify.formatMoney||(Shopify.formatMoney=function(t,a){var e="",r=/\{\{\s*(\w+)\s*\}\}/,o=a||this.money_format;function n(t,a){return void 0===t?a:t}function i(t,a,e,r){if(a=n(a,2),e=n(e,","),r=n(r,"."),isNaN(t)||null==t)return 0;var o=(t=(t/100).toFixed(a)).split(".");return o[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+e)+(o[1]?r+o[1]:"")}switch("string"==typeof t&&(t=t.replace(".","")),o.match(r)[1]){case"amount":e=i(t,2);break;case"amount_no_decimals":e=i(t,0);break;case"amount_with_comma_separator":e=i(t,2,".",",");break;case"amount_no_decimals_with_comma_separator":e=i(t,0,".",",")}return o.replace(r,e)}),"undefined"==typeof ShopifyAPI&&(ShopifyAPI={}),ShopifyAPI.onCartUpdate=function(t){},ShopifyAPI.updateCartNote=function(t,a){var e=$(document.body),r={type:"POST",url:"/cart/update.js",data:"note="+attributeToString(t),dataType:"json",beforeSend:function(){e.trigger("beforeUpdateCartNote.ajaxCart",t)},success:function(r){"function"==typeof a?a(r):ShopifyAPI.onCartUpdate(r),e.trigger("afterUpdateCartNote.ajaxCart",[t,r])},error:function(t,a){e.trigger("errorUpdateCartNote.ajaxCart",[t,a]),ShopifyAPI.onError(t,a)},complete:function(t,a){e.trigger("completeUpdateCartNote.ajaxCart",[this,t,a])}};jQuery.ajax(r)},ShopifyAPI.onError=function(XMLHttpRequest,textStatus){var data=eval("("+XMLHttpRequest.responseText+")");data.message&&alert(data.message+"("+data.status+"): "+data.description)},ShopifyAPI.addItemFromForm=function(t,a,e){var r=$(document.body),o={type:"POST",url:"/cart/add.js",data:jQuery(t).serialize(),dataType:"json",beforeSend:function(a,e){r.trigger("beforeAddItem.ajaxCart",t)},success:function(e){"function"==typeof a?a(e,t):ShopifyAPI.onItemAdded(e,t),r.trigger("afterAddItem.ajaxCart",[e,t])},error:function(t,a){"function"==typeof e?e(t,a):ShopifyAPI.onError(t,a),r.trigger("errorAddItem.ajaxCart",[t,a])},complete:function(t,a){r.trigger("completeAddItem.ajaxCart",[this,t,a])}};jQuery.ajax(o)},ShopifyAPI.getCart=function(t){$(document.body).trigger("beforeGetCart.ajaxCart"),jQuery.getJSON("/cart.js",function(a,e){"function"==typeof t?t(a):ShopifyAPI.onCartUpdate(a),$(document.body).trigger("afterGetCart.ajaxCart",a)})},ShopifyAPI.changeItem=function(t,a,e){var r=$(document.body),o={type:"POST",url:"/cart/change.js",data:"quantity="+a+"&line="+t,dataType:"json",beforeSend:function(){r.trigger("beforeChangeItem.ajaxCart",[t,a])},success:function(o){"function"==typeof e?e(o):ShopifyAPI.onCartUpdate(o),r.trigger("afterChangeItem.ajaxCart",[t,a,o])},error:function(t,a){r.trigger("errorChangeItem.ajaxCart",[t,a]),ShopifyAPI.onError(t,a)},complete:function(t,a){r.trigger("completeChangeItem.ajaxCart",[this,t,a])}};jQuery.ajax(o)};var ajaxCart=function(module,$){"use strict";var init,loadCart,settings,isUpdating,$body,$formContainer,$addToCart,$cartCountSelector,$cartCostSelector,$cartContainer,$drawerContainer,updateCountPrice,formOverride,itemAddedCallback,itemErrorCallback,cartUpdateCallback,buildCart,cartCallback,adjustCart,adjustCartCallback,createQtySelectors,qtySelectors,validateQty;return init=function(t){settings={formSelector:'form[action^="/cart/add"]',cartContainer:"#CartContainer",addToCartSelector:'input[type="submit"]',cartCountSelector:".cart-count",cartCostSelector:".cart-total",moneyFormat:"${{amount}}",disableAjaxCart:!1,enableQtySelectors:!0},$.extend(settings,t),$formContainer=$(settings.formSelector),$cartContainer=$(settings.cartContainer),$addToCart=$formContainer.find(settings.addToCartSelector),$cartCountSelector=$(settings.cartCountSelector),$cartCostSelector=$(settings.cartCostSelector),$body=$(document.body),isUpdating=!1,settings.enableQtySelectors&&qtySelectors(),!settings.disableAjaxCart&&$addToCart.length&&formOverride(),adjustCart()},loadCart=function(){$body.addClass("drawer--is-loading"),ShopifyAPI.getCart(cartUpdateCallback)},updateCountPrice=function(t){$cartCountSelector&&($cartCountSelector.html(t.item_count).removeClass("hidden-count"),0===t.item_count&&$cartCountSelector.addClass("hidden-count")),$cartCostSelector&&$cartCostSelector.html(Shopify.formatMoney(t.total_price,settings.moneyFormat))},formOverride=function(){$formContainer.on("submit",function(t){t.preventDefault(),$addToCart.removeClass("is-added").addClass("is-adding"),$(".qty-error").remove(),ShopifyAPI.addItemFromForm(t.target,itemAddedCallback,itemErrorCallback),$(".close-reveal-modal").trigger("click")})},itemAddedCallback=function(t){$addToCart.removeClass("is-adding").addClass("is-added"),ShopifyAPI.getCart(cartUpdateCallback)},itemErrorCallback=function(XMLHttpRequest,textStatus){var data=eval("("+XMLHttpRequest.responseText+")");$addToCart.removeClass("is-adding is-added"),data.message&&422==data.status&&$formContainer.after('<div class="errors qty-error">'+data.description+"</div>")},cartUpdateCallback=function(t){updateCountPrice(t),buildCart(t)},buildCart=function(t){if($cartContainer.empty(),0===t.item_count)return $cartContainer.append("<p>Your cart is currently empty.</p>"),void cartCallback(t);var a,e=[],r={},o=$("#CartTemplate").html(),n=Handlebars.compile(o);$.each(t.items,function(t,a){if(null!=a.image)var o=a.image.replace(/(\.[^.]*)$/,"_small$1").replace("http:","");else o="//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";r={id:a.variant_id,line:t+1,url:a.url,img:o,name:a.product_title,variation:a.variant_title,properties:a.properties,itemAdd:a.quantity+1,itemMinus:a.quantity-1,itemQty:a.quantity,price:Shopify.formatMoney(a.price,settings.moneyFormat),vendor:a.vendor,linePrice:Shopify.formatMoney(a.line_price,settings.moneyFormat),originalPrice:Shopify.formatMoney(a.line_price+a.total_discount,settings.moneyFormat),discounts:a.discounts,discountsApplied:a.line_price!==a.line_price-a.total_discount},e.push(r)}),a={items:e,note:t.note,totalPrice:Shopify.formatMoney(t.total_price,settings.moneyFormat),totalCartDiscount:0===t.total_discount?0:"translation missing: en.cart.general.savings_html".replace("[savings]",Shopify.formatMoney(t.total_discount,settings.moneyFormat)),totalCartDiscountApplied:0!==t.total_discount},$cartContainer.append(n(a)),cartCallback(t)},cartCallback=function(t){$body.removeClass("drawer--is-loading"),$body.trigger("afterCartLoad.ajaxCart",t),window.Shopify&&Shopify.StorefrontExpressButtons&&Shopify.StorefrontExpressButtons.initialize()},adjustCart=function(){function t(t,a){isUpdating=!0;var e=$('.ajaxcart__row[data-line="'+t+'"]').addClass("is-loading");0===a&&e.parent().addClass("is-removed"),setTimeout(function(){ShopifyAPI.changeItem(t,a,adjustCartCallback)},250)}$body.on("click",".ajaxcart__qty-adjust",function(){if(!isUpdating){var a=$(this),e=a.data("line"),r=a.siblings(".ajaxcart__qty-num"),o=parseInt(r.val().replace(/\D/g,""));o=validateQty(o);a.hasClass("ajaxcart__qty--plus")?o+=1:(o-=1)<=0&&(o=0),e?t(e,o):r.val(o)}}),$body.on("change",".ajaxcart__qty-num",function(){if(!isUpdating){var a=$(this),e=a.data("line"),r=parseInt(a.val().replace(/\D/g,""));r=validateQty(r);e&&t(e,r)}}),$body.on("submit","form.ajaxcart",function(t){isUpdating&&t.preventDefault()}),$body.on("focus",".ajaxcart__qty-adjust",function(){var t=$(this);setTimeout(function(){t.select()},50)}),$body.on("change",'textarea[name="note"]',function(){var t=$(this).val();ShopifyAPI.updateCartNote(t,function(t){})})},adjustCartCallback=function(t){updateCountPrice(t),setTimeout(function(){isUpdating=!1,ShopifyAPI.getCart(buildCart)},150)},createQtySelectors=function(){$('input[type="number"]',$cartContainer).length&&$('input[type="number"]',$cartContainer).each(function(){var t=$(this),a=t.val(),e=a+1,r=a-1,o=a,n=$("#AjaxQty").html(),i=Handlebars.compile(n),d={id:t.data("id"),itemQty:o,itemAdd:e,itemMinus:r};t.after(i(d)).remove()})},qtySelectors=function(){var t=$('input[type="number"]');t.length&&(t.each(function(){var t=$(this),a=t.val(),e=t.attr("name"),r=t.attr("id"),o=a+1,n=a-1,i=a,d=$("#JsQty").html(),c=Handlebars.compile(d),s={id:t.data("id"),itemQty:i,itemAdd:o,itemMinus:n,inputName:e,inputId:r};t.after(c(s)).remove()}),$(".js-qty__adjust").on("click",function(){var t=$(this),a=(t.data("id"),t.siblings(".js-qty__num")),e=parseInt(a.val().replace(/\D/g,""));e=validateQty(e);t.hasClass("js-qty__adjust--plus")?e+=1:(e-=1)<=1&&(e=1),a.val(e)}))},validateQty=function(t){return(parseFloat(t)!=parseInt(t)||isNaN(t))&&(t=1),t},module={init:init,load:loadCart},module}(ajaxCart||{},jQuery);
  $(document).ready(function() {
    $('.qty-slider-vari').slick({
      slidesToShow: 3,
      responsive: [
        {
          breakpoint: 540,
          settings: {
            arrows: false,
            dots: false
          }
        }
      ]
    });
    $( ".qty-block" ).on( "click", function() {
      $('.qty-block').removeClass('active');
      $(this).addClass('active'); 
      var nowprice = $(this).find('.qty.active').data('now');
      console.log("price", nowprice);
      $('.now-price').html(nowprice);
    });
  
      $('.not-first.qty').css("display", "none");
  
  
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
      console.log("sdfjs", jk)
      if(jk == 'about-5'){
        window.location.href = "https://bestchoiceproducts.com/pages/careers";
      }
      if(jk == 'account_profile'){
        window.location.href = "https://bestchoiceproducts.com/account/addresses";
      }
      if(jk == 'account_fev'){
        window.location.href = "https://bestchoiceproducts.com/pages/my-wishlist";
      }
      if(jk == 'account_brand'){
        var id = $(this).data('customer-id');
        window.location.href = "https://brandambassadorapp.net/bcp/portal/admin_ambas_admin/?id="+id;
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
              dots:true
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
  });
    
    
  
  // Loading third party scripts, with callbacks
  theme.scriptsLoaded = {};
  theme.loadScriptOnce = function(src, callback, beforeRun) {
    if(typeof theme.scriptsLoaded[src] === 'undefined') {
      theme.scriptsLoaded[src] = [];
      var tag = document.createElement('script');
      tag.src = src;
  
      if(beforeRun) {
        tag.async = false;
        beforeRun();
      }
  
      if(typeof callback === 'function') {
        theme.scriptsLoaded[src].push(callback);
        if (tag.readyState) { // IE, incl. IE9
          tag.onreadystatechange = (function() {
            if (tag.readyState == "loaded" || tag.readyState == "complete") {
              tag.onreadystatechange = null;
              for(var i = 0; i < theme.scriptsLoaded[this].length; i++) {
                theme.scriptsLoaded[this][i]();
              }
              theme.scriptsLoaded[this] = true;
            }
          }).bind(src);
        } else {
          tag.onload = (function() { // Other browsers
            for(var i = 0; i < theme.scriptsLoaded[this].length; i++) {
              theme.scriptsLoaded[this][i]();
            }
            theme.scriptsLoaded[this] = true;
          }).bind(src);
        }
      }
  
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      return true;
    } else if(typeof theme.scriptsLoaded[src] === 'object' && typeof callback === 'function') {
      theme.scriptsLoaded[src].push(callback);
    } else {
      if(typeof callback === 'function') {
        callback();
      }
      return false;
    }
  }
  
  theme.storageAvailable = function(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
  };
  
  theme.variants = {
    selectors: {
      originalSelectorId: '[data-product-select]',
      priceWrapper: '[data-price-wrapper]',
      productPrice: '[data-product-price]',
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
      } else {
        $(theme.variants.selectors.addToCart, this.$container).prop('disabled', true);
        $(theme.variants.selectors.addToCartText, this.$container).html(theme.strings.soldOut);
        $('form', this.$container).addClass('variant--unavailable');
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
        $compareEls.removeClass('hide');
      } else {
        $(theme.variants.selectors.productPrice, this.$container).removeClass('product-price__reduced');
        $comparePrice.html('');
        $compareEls.addClass('hide');
      }
      theme.checkCurrency();
    }
  };
  
  $(document).ready(function() {
    $(document).on('submit', 'form[action^="/cart/add"]:not(.no-ajax)', function(e) {
      var $form = $(this);
      //Disable add button
      $form.find(':submit').attr('disabled', 'disabled').each(function(){
        var contentFunc = $(this).is('button') ? 'html' : 'val';
        $(this).data('previous-value', $(this)[contentFunc]())[contentFunc](theme.strings.addingToCart);
      });
  
      //Add to cart
      $.post('/cart/add.js', $form.serialize(), function(itemData) {
  
        //Enable add button
        var $btn = $form.find(':submit').each(function(){
          var $btn = $(this);
          var contentFunc = $(this).is('button') ? 'html' : 'val';
          //Set to 'DONE', alter button style, wait a few secs, revert to normal
          $btn[contentFunc](theme.strings.addedToCart);
          setTimeout(function(){
            $btn.removeAttr('disabled')[contentFunc]($btn.data('previous-value'));
          }, 2000);
        }).first();
  
  
        // reload header
        $.get('/search', function(data){
          var selectors = [
            '.page-header .header-cart',
            '.docked-navigation-container .header-cart'
          ];
          var $parsed = $($.parseHTML('<div>' + data + '</div>'));
          for(var i=0; i<selectors.length; i++) {
            var cartSummarySelector = selectors[i];
            var $newCartObj = $parsed.find(cartSummarySelector).clone();
            var $currCart = $(cartSummarySelector);
            $currCart.replaceWith($newCartObj);
          }
          theme.checkCurrency();
        });
  
        // close quick-buy, if present
        $.colorbox.close();
  
        // display added notice
        // get full product data
        theme.productData = theme.productData || {};
        if(!theme.productData[itemData.product_id]) {
          theme.productData[itemData.product_id] = JSON.parse(document.querySelector('.ProductJson-' + itemData.product_id).innerHTML);
        }
        var productVariant = null;
        var productPrice = '';
        for(var i=0; i<theme.productData[itemData.product_id].variants.length; i++) {
          var variant = theme.productData[itemData.product_id].variants[i];
          if(variant.id == itemData.variant_id) {
            productVariant = variant;
            if(variant.compare_at_price && variant.compare_at_price > variant.price) {
              productPrice += [
                '<span class="cart-summary__price-reduced product-price__reduced theme-money">',
                slate.Currency.formatMoney(itemData.price, theme.moneyFormat),
                '</span>',
                '<span class="cart-summary__price-compare product-price__compare theme-money">',
                slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat),
                '</span> '
              ].join('');
            } else {
              productPrice += '<span class="theme-money">' + slate.Currency.formatMoney(itemData.price, theme.moneyFormat) + '</span>';
            }
          }
        }
  
        // append quantity
        var $qty = $form.find('[name="quantity"]');
        if($qty.length && $qty.val().length & $qty.val() > 1) {
          productPrice += ' <span class="cart-summary__quantity">' + $qty.val() + '</span>';
        }
  
        var productVariantsHTML = '';
        if(productVariant) {
          // get option names from full product data
          var optionNames = theme.productData[itemData.product_id].options;
          productVariantsHTML = '<div class="cart-summary__product__variants">';
          for(var i=0; i<productVariant.options.length; i++) {
            if(productVariant.options[i].indexOf('Default Title') < 0) {
              var newlable = productVariant.options[i].split(";");
              productVariantsHTML += '<div class="cart-summary__variant">';
              productVariantsHTML += '<span class="cart-summary__variant-label">' + optionNames[i] + ':</span> ';
              productVariantsHTML += '<span class="cart-summary__variant-value">' + newlable[0] + '</span>';
              productVariantsHTML += '</div>';
            }
          }
          productVariantsHTML += '</div>';
        }
  
        var productImage;
        if(productVariant.featured_image) {
          productImage = slate.Image.getSizedImageUrl(productVariant.featured_image.src, '200x');
        } else {
          productImage = slate.Image.getSizedImageUrl(theme.productData[itemData.product_id].featured_image, '200x');
        }
        var $template = $([
          '<div class="added-notice global-border-radius added-notice--pre-reveal">',
          '<div class="added-notice__header">',
          '<a href="/cart">', theme.strings.cart , '</a>',
          '<a class="added-notice__close feather-icon" href="#">', theme.icons.close , '</a>',
          '</div>',
          '<div class="cart-summary global-border-radius">',
          '<div class="cart-summary__product">',
          '<div class="cart-summary__product-image"><img class="global-border-radius" src="', productImage, '"></div>',
          '<div class="cart-summary__product__description">',
          '<div class="cart-summary__product-title">', theme.productData[itemData.product_id].title, '</div>',
          '<div class="cart-summary__price">', productPrice, '</div>',
          productVariantsHTML,
          '</div>',
          '</div>',
          '</div>',
          '</div>'
        ].join(''));
        $template.appendTo('body');
        theme.checkCurrency();
  
        // transition in
        setTimeout(function(){
          $template.removeClass('added-notice--pre-reveal');
        }, 10);
  
        // transition out
        theme.addedToCartNoticeHideTimeoutId = setTimeout(function(){
          $template.find('.added-notice__close').trigger('click');
        }, 5000);
  
      }, 'json').error(function(data) {
        //Enable add button
        var $firstBtn = $form.find(':submit').removeAttr('disabled').each(function(){
          var $btn = $(this);
          var contentFunc = $btn.is('button') ? 'html' : 'val';
          $btn[contentFunc]($btn.data('previous-value'))
        }).first();
  
        //Not added, show message
        if(typeof(data) != 'undefined' && data.responseJSON && data.responseJSON.description) {
          theme.showQuickPopup(data.responseJSON.description, $firstBtn);
        } else {
          //Some unknown error? Disable ajax and submit the old-fashioned way.
          $form.addClass('no-ajax');
          $form.submit();
        }
      });
      return false;
    });
  
    $(document).on('click', '.added-notice__close', function(){
      var $template = $(this).closest('.added-notice').addClass('added-notice--pre-destroy');
      setTimeout(function(){
        $template.remove();
      }, 500);
      return false;
    });
  
    $(document).on('mouseenter', '.header-cart', function(){
      clearTimeout(theme.addedToCartNoticeHideTimeoutId);
      $('.added-notice__close').trigger('click');
    });
  });
  
  // overlap avoidance
  $(document).ready(function() {
    var overlapGutter = 10;
    var overlapGutterFuzzed = overlapGutter + 1;
    var GRAVITY_LEFT = 0,
        GRAVITY_CENTRE = 1,
        GRAVITY_RIGHT = 2;
  
    function oaElementToOriginalRectangle($el) {
      var t = {
        left: $el.offset().left - parseFloat($el.css('margin-left')),
        top: $el.offset().top - parseFloat($el.css('margin-top')),
        width: $el.outerWidth(),
        height: $el.outerHeight()
      };
      t.right = t.left + t.width;
      t.bottom = t.top + t.height;
      if($el.hasClass('avoid-overlaps__item--gravity-left')) {
        t.gravity = GRAVITY_LEFT;
      } else if($el.hasClass('avoid-overlaps__item--gravity-right')) {
        t.gravity = GRAVITY_RIGHT;
      } else {
        t.gravity = GRAVITY_CENTRE;
      }
      return t;
    }
  
    function oaSetOffsetFromCentre(item) {
      if(item.newRect.gravity == GRAVITY_LEFT) {
        // top left position already set by default
      } else if(item.newRect.gravity == GRAVITY_RIGHT) {
        item.newRect.right = item.newRect.left;
        item.newRect.left = item.newRect.right - item.newRect.width;
      } else {
        item.newRect.left = item.newRect.left - item.newRect.width / 2;
        item.newRect.right = item.newRect.left + item.newRect.width;
      }
      item.newRect.top = item.newRect.top - item.newRect.height / 2;
      item.newRect.bottom = item.newRect.top + item.newRect.height;
    }
  
    function oaRectIsInsideBoundary(rect, container) {
      return rect.left >= container.left + overlapGutter
        && rect.top >= container.top + overlapGutter
        && rect.right <= container.right - overlapGutter
        && rect.bottom <= container.bottom - overlapGutter;
    }
  
    function oaEnforceBoundaryConstraint(item, containerRect) {
      // left
      if(item.newRect.left < containerRect.left + overlapGutter) {
        item.newRect.left = containerRect.left + overlapGutterFuzzed;
        item.newRect.right = item.newRect.left + item.newRect.width;
      }
      // top
      if(item.newRect.top < containerRect.top + overlapGutter) {
        item.newRect.top = containerRect.top + overlapGutterFuzzed;
        item.newRect.bottom = item.newRect.top + item.newRect.height;
      }
      // right
      if(item.newRect.right > containerRect.right - overlapGutter) {
        item.newRect.right = containerRect.right - overlapGutterFuzzed;
        item.newRect.left = item.newRect.right - item.newRect.width;
      }
      // bottom
      if(item.newRect.bottom > containerRect.bottom - overlapGutter) {
        item.newRect.bottom = containerRect.bottom - overlapGutterFuzzed;
        item.newRect.top = item.newRect.bottom - item.newRect.height;
      }
    }
  
    function oaRectanglesOverlap(rect1, rect2) {
      return !(rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom);
    }
  
    function oaRectanglesOverlapWithGutter(rect1, rect2) {
      // increase rect1 size to fake gutter check
      return !((rect1.right + overlapGutter) < rect2.left ||
        (rect1.left - overlapGutter) > rect2.right ||
        (rect1.bottom + overlapGutter) < rect2.top ||
        (rect1.top - overlapGutter) > rect2.bottom);
    }
  
    function oaGetSortedVectorsToAttempt(rect1, rect2) {
      // 0 - top, 1 - right, 2 - bottom, 3 - left
      // compare mid-points
      var deltaX = (rect2.left + (rect2.right-rect2.left)/2) - (rect1.left + (rect1.right-rect1.left)/2);
      var deltaY = (rect2.top + (rect2.bottom-rect2.top)/2) - (rect1.top + (rect1.bottom-rect1.top)/2);
      if(Math.abs(deltaX) > Math.abs(deltaY)) {
        if(deltaX > 0) {
          return [1,0,2,3];
        } else {
          return [3,0,2,1];
        }
      } else {
        if(deltaY > 0) {
          return [2,1,3,0];
        } else {
          return [0,1,3,2];
        }
      }
    }
  
    function oaAttemptReposition(toMove, vector, movingAwayFrom, containerRect, allItems) {
      var newRect = $.extend({}, toMove.newRect);
      switch(vector) {
        case 0: // up
          newRect.bottom = movingAwayFrom.newRect.top - overlapGutterFuzzed;
          newRect.top = newRect.bottom - newRect.height;
          break;
        case 1: // right
          newRect.left = movingAwayFrom.newRect.right + overlapGutterFuzzed;
          newRect.right = newRect.left + newRect.width;
          break;
        case 2: // down
          newRect.top = movingAwayFrom.newRect.bottom + overlapGutterFuzzed;
          newRect.bottom = newRect.top + newRect.height;
          break;
        case 3: // left
          newRect.right = movingAwayFrom.newRect.left - overlapGutterFuzzed;
          newRect.left = newRect.right - newRect.width;
          break;
      }
  
      // check if new position is inside container
      var isInsideBoundary = oaRectIsInsideBoundary(newRect, containerRect);
  
      // check if new position overlaps any other elements
      var doesOverlap = false;
      for(var i=0; i<allItems.length; i++) {
        var item = allItems[i];
        if(item.el[0] != toMove.el[0]) { // skip self
          if(oaRectanglesOverlap(newRect, item.newRect)) {
            doesOverlap = true;
          }
        }
      }
  
      // assign new position if deemed valid
      if(isInsideBoundary && !doesOverlap) {
        toMove.newRect = newRect;
        return true;
      }
      return false;
    }
  
    var checkOverlaps = function(){
      // every overlap-avoidance zone
      $('.avoid-overlaps').each(function(){
        var $container = $(this),
            $mobileContainer = $('.avoid-overlaps__mobile-container', this),
            containerRect = null;
        if($mobileContainer.length && $mobileContainer.css('position') == 'relative') {
          containerRect = oaElementToOriginalRectangle($mobileContainer);
        } else {
          containerRect = oaElementToOriginalRectangle($container);
        }
  
        // all items that could overlap, in this zone
        var $candidates = $(this).find('.avoid-overlaps__item');
  
        // create cached dimensions to work on
        var itemsToProcess = []; // all elements that can collide
        var itemsThatCanBeMoved = []; // e.g. labels, positioned overlay title
        var itemsThatCanBeMoveALot = []; // e.g. labels
        $candidates.each(function(){
          var item = {
            el: $(this),
            newRect: oaElementToOriginalRectangle($(this)),
            oldRect: oaElementToOriginalRectangle($(this)),
            overlaps: false
          };
          // all items
          itemsToProcess.push(item);
          // items that can be moved freely
          if(!$(this).hasClass('overlay')) {
            itemsThatCanBeMoveALot.push(item);
          }
          // any items that can be moved
          if(
            $(this).css('position') == 'absolute'
            && !$(this).hasClass('overlay--bottom-wide')
            && !$(this).hasClass('overlay--low-wide')
          ) {
            itemsThatCanBeMoved.push(item);
          }
        });
  
        // for each moveable element
        for(var i=0; i<itemsThatCanBeMoved.length; i++) {
          var candidate = itemsThatCanBeMoved[i];
          // ensure it is positioned relative to centre
          oaSetOffsetFromCentre(candidate);
  
          // move inside container boundary
          oaEnforceBoundaryConstraint(candidate, containerRect);
        }
  
        // for every element, check if any freely moveable elements overlap it - and move if so
        for(var i=0; i<itemsToProcess.length; i++) {
          var candidate = itemsToProcess[i];
          for(var j=0; j<itemsThatCanBeMoveALot.length; j++) {
            var checking = itemsThatCanBeMoveALot[j];
            if(checking.el[0] != candidate.el[0]) { // skip self
              var vectorPreference = oaGetSortedVectorsToAttempt(candidate.newRect, checking.newRect);
              while(vectorPreference.length > 0 && oaRectanglesOverlapWithGutter(candidate.newRect, checking.newRect)) {
                var moved = oaAttemptReposition(checking, vectorPreference.shift(), candidate, containerRect, itemsToProcess);
                checking.overlaps = !moved;
              }
            }
          }
        }
  
        // set the new positions
        for(var j=0; j<itemsToProcess.length; j++) {
          var item = itemsToProcess[j];
          var deltaX = item.newRect.left - item.oldRect.left;
          var deltaY = item.newRect.top - item.oldRect.top;
          item.el.css({
            marginLeft: deltaX != 0 ? deltaX : '',
            marginTop: deltaY != 0 ? deltaY : ''
          });
          item.el.toggleClass('is-overlapping', item.overlaps);
        }
      }).addClass('avoid-overlaps--processed');
    }
  
    $(window).on('load debouncedresize', checkOverlaps);
    $(document).on('shopify:section:load', function(){
      setTimeout(checkOverlaps, 10);
    });
  });
  
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
  
  theme.recentProductCacheExpiry = 1000*60 * 10; // 10 mins
  theme.recentProductHistoryCap = 12;
  
  // recentArr must be the full array of all recent products, as it is used to update the cache
  theme.addRecentProduct = function(recentArr, index, $container, showHover) {
    var item = recentArr[index],
        _recentArr = recentArr,
        _showHover = showHover,
        $itemContainer = $('<div class="product-block grid__item one-sixth medium--one-quarter small-down--one-whole">');
  
    // check timestamp age
    var currentTimestamp = new Date().getTime();
    if(item.timestamp && item.timestamp > currentTimestamp - theme.recentProductCacheExpiry) {
      // display now
      $itemContainer.append(theme.buildRecentProduct(item, _showHover));
    } else {
      // get fresh data
      $.get('/products/' + item.handle + '.json', function(data){
        // update array with new data
        item.title = data.product.title;
        item.imageUrl = data.product.images[0].src;
        item.timestamp = currentTimestamp;
        // save updated recent products list
        window.localStorage.setItem('theme.recent_products', JSON.stringify(_recentArr));
        // display
        $itemContainer.append(theme.buildRecentProduct(item, _showHover));
      });
    }
    $container.append($itemContainer);
    theme.assessRecentProductGrid($container);
  };
  
  theme.assessRecentProductGrid = function($container){
    // add classes to hide all but 4 on tablet
    var $items = $container.children();
    var toHideOnTablet = Math.max($items.length - 4, 0);
    if(toHideOnTablet > 0) {
      $items.slice(0, 3).removeClass('medium--hide');
      for(var i = 0; i < toHideOnTablet; i++) {
        $($items[i]).addClass('medium--hide');
      }
    }
  };
  
  theme.buildRecentProduct = function(item, showHover) {
    var $item = $('<a class="recently-viewed-product plain-link">').attr({
      href: '/products/' + item.handle,
      title: item.title
    });
    var $title = $('<div class="product-title small-text">').html(item.title);
    var $priceCont = $('<div class="product-price small-text">');
    if(item.priceVaries) {
      $('<span class="product-price__from tiny-text">').html(theme.strings.priceFrom).appendTo($priceCont);
      $priceCont.append(' ');
    }
    if(item.priceCompare > item.price) {
      $('<span class="product-price__reduced theme-money">').html(slate.Currency.formatMoney(item.price, theme.moneyFormat)).appendTo($priceCont);
      $priceCont.append(' ');
      $('<span class="product-price__compare theme-money">').html(slate.Currency.formatMoney(item.priceCompare, theme.moneyFormat)).appendTo($priceCont);
    } else {
      $('<span class="theme-money">').html(slate.Currency.formatMoney(item.price, theme.moneyFormat)).appendTo($priceCont);
    }
  
    var $imageCont = $('<div class="hover-images global-border-radius relative">').appendTo($item);
    $('<div class="image-one">').append($('<img>').attr('src', item.imageUrl)).appendTo($imageCont);
    if(showHover && item.hoverImageUrl) {
      $imageCont.addClass('hover-images--two');
      $('<div class="image-two">').css('background-image', 'url('+item.hoverImageUrl+')').appendTo($imageCont);
    }
    if(item.available === false) {
      $('<span class="product-label product-label--sold-out global-border-radius"></span>').html(theme.strings.soldOut).appendTo($imageCont);
    } else {
      if(item.priceCompare > item.price) {
        $('<span class="product-label product-label--on-sale global-border-radius"></span>').html(theme.strings.onSale).appendTo($imageCont);
      }
    }
    $item.append($title);
    $item.append($priceCont);
    return $item;
  };
  
  
  theme.getRecentProducts = function(){
    var existingValue = window.localStorage.getItem('theme.recent_products');
    if(existingValue) {
      try {
        return JSON.parse(existingValue);
      } catch (error) {}
    }
    return [];
  };
  
  theme.addToAndReturnRecentProducts = function(handle, title, available, imageUrl, hoverImageUrl, price, priceVaries, priceCompare){
    var existingArr = theme.getRecentProducts();
  
    // remove existing occurences
    var run = true;
    while(run) {
      run = false;
      for(var i=0; i<existingArr.length; i++) {
        if(existingArr[i].handle == handle) {
          existingArr.splice(i, 1);
          run = true;
          break;
        }
      }
    }
  
    // add this onto the end
    existingArr.push({
      handle: handle,
      title: title,
      available: available,
      imageUrl: imageUrl,
      hoverImageUrl: hoverImageUrl,
      price: price,
      priceVaries: priceVaries,
      priceCompare: priceCompare,
      timestamp: new Date().getTime()
    });
  
    // cap history
    while(existingArr.length > theme.recentProductHistoryCap) {
      existingArr.shift();
    }
  
    // save updated recent products list
    window.localStorage.setItem('theme.recent_products', JSON.stringify(existingArr));
  
    return existingArr;
  };
  
  // init slideshow
  theme.loadRecentlyViewed = function($container){
    theme.peekCarousel.init($container, $('.grid', $container), '.recentlyViewed', function(){
      return $(window).width() < 768
    });
  };
  
  // unload slideshow
  theme.unloadRecentlyViewed = function($container){
    theme.peekCarousel.destroy($container, $('.slick-initialized', $container), '.recentlyViewed');
  };
  
  
  /*================ Sections ================*/
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
        nextArrow: false,
        speed: 1000
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
        var input__ = document.getElementById("Mymobilesearch").value;
        
        if(input__.length === 0){
          $("#mobile_search_toggle").addClass("search_show_hide_mobile");
        }
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
  
      var options = {
        $container: this.$container,
        enableHistoryState: this.$container.data('enable-history-state') || false,
        singleOptionSelector: selectors.singleOptionSelector,
        originalSelectorId: selectors.originalSelectorId,
        product: this.productSingleObject
      };
  
      this.settings = {};
      this.settings.imageSize = 'master';
      this.variants = new slate.Variants(options);
      this.$productThumbs = $(selectors.productThumbs, this.$container);
      this.$productThumbb = $(selectors.productThumbb, this.$container);
      
      this.$stickyColumns = $(selectors.stickyColumnSelector, this.$container);
      
      this.$container.on('variantChange' + this.namespace, theme.variants.updateAddToCartState.bind(this));
      this.$container.on('variantPriceChange' + this.namespace, theme.variants.updateProductPrices.bind(this));
  
      if(this.$container.find(selectors.skuWrapper)) {
        this.$container.on('variantChange' + this.namespace, this.updateSKU.bind(this));
      }
      this.$container.on('variantChange' + this.namespace, this.onBulkBuyChange.bind(this));
      this.$container.on('variantChange' + this.namespace, this.onDetailHeightChange.bind(this));
      this.$container.on('variantImageChange' + this.namespace, this.updatevariantProductImage.bind(this));
      
      // // mobile image slideshow
      this.imageSlideshowActive = false;
      $(window).on('debouncedresize' + this.namespace, this.assessImageSlideshow.bind(this));
      this.assessImageSlideshow.bind(this)();
  
  
      // - continue with sticky column setup
      this.stickyColumnsAreSticky = false;
      this.assessStickyColumns.bind(this)();
      $(window).on('debouncedresize' + this.namespace, this.assessStickyColumns.bind(this));
  
      // style dropdowns
      theme.styleVariantSelectors($(selectors.styledSelect, container), options.product);
  
      // compensate for tabs conflicting with sticky columns and scrolling
      this.$container.on('click', selectors.stickyColumnSelector + ' .tabs a', this.onDetailHeightChange.bind(this));
  
      // size chart
      this.$container.on('click', '.js-size-chart-open', function(e){
        e.preventDefault();
        $('body').addClass('size-chart-is-open');
      });
  
      this.$container.on('click', '.js-size-chart-close', function(){
        $('body').removeClass('size-chart-is-open');
      });
  
      // related products
      if($(selectors.relatedProductsCarousel, this.$container).length) {
        this.$relatedProductsCarousel = $(selectors.relatedProductsCarousel, container);
        this.relatedProductsLayout.bind(this)();
        $(window).on('debouncedresize' + this.namespace, this.relatedProductsLayout.bind(this));
      }
  
      // recently viewed
      this.$recentlyViewed = $(selectors.recentlyViewed, this.$container);
      if(this.$recentlyViewed.length) {
        this.loadRecentlyViewed.bind(this)();
        theme.loadRecentlyViewed(this.$recentlyViewed);
      }
  
      // section may contain RTE images
      theme.assessRTEImagesOnLoad(this.$container);
    }
  
    Product.prototype = $.extend({}, Product.prototype, {
  
      onBulkBuyChange : function(evt){
        console.log("")
        $('.qty').css("display", "none");
        $('.qty-block .qty').removeClass("active");
        var colorname=  (evt.variant.title).toLowerCase();
        console.log(colorname);
        $('.qty-' + colorname).css("display", "block"); 
        $('.qty-' + colorname).addClass("active"); 
        $('.qty-block.active').click();
      },
  
      /**
       * On tab selection, check if sticky column is showing correctly
       */
      onDetailHeightChange: function(evt) {
        if(this.stickyColumnsAreSticky) {
          // stickykit must recalculate contents after reflow
          setTimeout((function(){
            $(document.body).trigger('sticky_kit:recalc');
            this.setupVariantImagesScrollHeight.bind(this)();
          }).bind(this), 15);
        }
      },
  
      /**
       * Display recently viewed products, and add this page to it
       */
      loadRecentlyViewed: function(evt) {
        // feature usability detect
        if(theme.storageAvailable('localStorage')) {
          var recentDisplayCount = 6;
  
          var existingArr = theme.addToAndReturnRecentProducts(
            this.$recentlyViewed.data('handle'),
            this.$recentlyViewed.data('title'),
            this.$recentlyViewed.data('available'),
            this.$recentlyViewed.data('image'),
            this.$recentlyViewed.data('image2'),
            this.$recentlyViewed.data('price'),
            this.$recentlyViewed.data('price-varies'),
            this.$recentlyViewed.data('price-compare'));
  
          // check each recent product, excluding one just added
          if(existingArr.length > 1) {
            var $recentlyViewedBucket = this.$recentlyViewed.removeClass('hidden').find('.grid');
            var showHoverImage = this.$recentlyViewed.data('show-hover-image'),
              rangeStart = Math.max(0, existingArr.length - recentDisplayCount - 1),
              rangeEnd = existingArr.length - 1;
            for(var i = rangeStart; i < rangeEnd; i++) {
              theme.addRecentProduct(existingArr, i, $recentlyViewedBucket, showHoverImage);
            }
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
        variant(variant.sku);
        if (variant && variant.sku) {
          $(selectors.skuWapper, this.$container).removeClass('sku-wrapper--empty');
          $(selectors.sku, this.$container).html(variant.sku);
          
        } else {
          $(selectors.skuWrapper, this.$container).addClass('sku-wrapper--empty');
          $(selectors.sku, this.$container).empty();
        }
      },
  
  
      /**
       * Scrolls the page to the specified image
       *
       * @param {string} src - Image src URL
       * 
       */
      updatevariantProductImage : function(evt){
        var flag = false;
        function mySandwich(evt) {
          $('.product-variant-update-desktop').css('opacity','0');
          $('.product-variant-update-desktop-thumb').css('opacity', '0');
            var $div = $("<div>", {id: "variant-new-image", "class": "product-main-image"});
            var $divthumb = $("<div>", {id: "variant-new-image-thumb", "class": "product-main-image-thumb"});
            const filterItems = (arr, query) => {
              return arr.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) > -1);
            };
          var newImagelist = filterItems(evt.product, evt.variant.sku);
          if($('.product-variant-update-desktop').hasClass("active")){
            $('.product-main-image').remove();$('.product-main-image-thumb').remove();$(".product-variant-update-desktop").append($div);$(".product-variant-update-desktop-thumb").append($divthumb);
            loadImage(newImagelist);
            slick();
            
            $('.product-variant-update-desktop').css('opacity','1');$('.product-variant-update-desktop-thumb').css('opacity', '1');
          }else {
            $('.product-detail__images_p').remove();$('.product-single__thumbnails__p').remove();$(".product-variant-update-desktop").append($div);$(".product-variant-update-desktop-thumb").append($divthumb);
            loadImage(newImagelist); 
            slick();
          
            $('.product-variant-update-desktop').css('opacity','1');$('.product-variant-update-desktop-thumb').css('opacity', '1');
          }
          $('.product-variant-update-desktop').addClass("active");
          function loadImage(img){
              for (let i = 0 ; i< img.length ; i++){
                var filename =  img[i].split(".").slice(0, -1).join(".");
                var ext = img[i].split(".")[3];
                var newscr =  filename+"_{width}x."+ext;
                const imgHtml = `
                  <div> 
                    <a 
                      href="${img[i]}"
                      data-product-single-thumbnails
                      data-image-w="2600"
                      data-image-h="2600"
                      class="global-border-radius"
                    >
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
            var count = false;
            if($('.product-main-image').children().length > 1){
              count = true;
            }
              $('.product-main-image').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                fade: true,
                asNavFor: '.product-main-image-thumb',
                responsive : [
                  {
                    breakpoint: 967,
                    settings: {
                      dots:true
                    }
                  } 
                ]
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
              flag = true;
            }
        }
        mySandwich(evt);
      },
      /**
       * Set/unset sticky columns depending on screen size
       */
      assessStickyColumns: function(evt) {
       
        var windowWidth = $(window).width();
        if(windowWidth < 968) {
          if(this.stickyColumnsAreSticky) {
            this.$stickyColumns.trigger('sticky_kit:detach');
            this.stickyColumnsAreSticky = false;
          }
        } else {
          if(!this.stickyColumnsAreSticky) {
            this.$stickyColumns.stick_in_parent({
              parent: '.product-sticky-grid',
              spacer: '.sticky-spacer',
              offset_top: 50
            })
            this.stickyColumnsAreSticky = true;
          }
        }
      },
  
      /**
       * Create/destroy slideshow depending on screen width
       */
      assessImageSlideshow: function(evt) {
        var windowWidth = $(window).width();
        var count = false;
        var counts = false;
        if($(selectors.productImagesContainers).children().length > 1){
          count = true;
        }
        if($('.three-image-building-product').children().length > 1){
          counts = true;
        }
        if(windowWidth < 768) {
          if(!this.imageSlideshowActive) {
            
            $('.three-image-building-product').slick({
              adaptiveHeight: true,
              arrows: false,
              dots: counts,
              autoplay : true,
              autoplaySpeed : 4000
            });
            $(selectors.productImagesContainers, this.$container).slick({
              adaptiveHeight: true,
              arrows: false,
              dots: count
            });
            this.imageSlideshowActive = true;
          }
        } else {
          if(this.imageSlideshowActive) {
            $(selectors.productImagesContainers, this.$container).slick('unslick');
            $('.three-image-building-product').slick('unslick');
           
            this.imageSlideshowActive = false;
          }
        }
      },
  
      /**
       * Switch to carousel view for related products on mobile
       */
      relatedProductsLayout: function(evt) {
        var windowWidth = $(window).width();
        if(windowWidth < 768) {
          if(!this.$relatedProductsCarousel.hasClass('slick-initialized')){
            $(this.$relatedProductsCarousel).slick({
              infinite: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              swipeToSlide: true,
              dots: false,
              arrows: false
            });
          }
        } else {
          if(this.$relatedProductsCarousel.hasClass('slick-initialized')){
            this.$relatedProductsCarousel.slick('unslick');
          };
        }
      },
  
      /**
       * Event callback for Theme Editor `section:unload` event
       */
      onUnload: function() {
        this.$container.off(this.namespace);
        $(document).off(this.namespace);
        $(window).off(this.namespace);
        this.$stickyColumns.trigger('sticky_kit:detach');
        if(this.imageGallery) {
          this.imageGallery.close();
        }
        if(this.$recentlyViewed.length) {
          theme.unloadRecentlyViewed(this.$recentlyViewed);
        }
        this.$container.find('.slick-initialized').slick('unslick');
        if(this.$productThumbs.length) {
          this.$stickyForceHeightStyleTag.remove();
        }
      }
    });
  
    return Product;
  })();
  
  /**
   * Blog Template Script
   * ------------------------------------------------------------------------------
   * For both the blog page and homepage section
   *
     * @namespace blog
   */
  
  theme.Blog = (function() {
  
    var selectors = {
      stickyColumn: '.sticky-element',
      header: '.featured-blog__header, .blog-featured-image',
      headerImage: '.featured-blog__header-image, .blog-image',
      slideshow: '.js-content-products-slider .grid'
    };
  
    var breakpoint = 968;
    var resizeTimer;
  
    /**
     * Blog section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    function Blog(container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
  
      // sticky columns
      this.$stickyColumns = $(selectors.stickyColumn, this.$container);
      this.stickyColumnsAreSticky = false;
  
      // header spacing/image
      this.$header = $(selectors.header, this.$container);
      this.$headerImage = $(selectors.headerImage, this.$container);
  
      // peek carousel (must be before sticky checks)
      $('.js-content-products-slider .grid', this.$container).each((function(index, value){
        theme.peekCarousel.init(
          this.$container,
          $(value),
          this.namespace,
          function(){ return true },
          false,
          {
            infinite: false,
            slidesToShow: 3,
            slidesToScroll: 1,
            swipeToSlide: true,
            dots: false,
            prevArrow: $(value).closest('.content-products').find('.content-products-controls .prev'),
            nextArrow: $(value).closest('.content-products').find('.content-products-controls .next'),
            responsive: [
              {
                breakpoint: $('.single-column-layout', this.$container).length ? 768 : 960,
                settings: {
                  slidesToShow: 1,
                }
              }
            ]
          }
        );
      }).bind(this));
  
      //Section
      this.assessSection.bind(this)();
      $(window).on('debouncedresize' + this.namespace, this.assessSection.bind(this));
    }
  
    Blog.prototype = $.extend({}, Blog.prototype, {
      /**
       * Set/unset sticky columns depending on screen size
       */
      assessSection: function(evt) {
        var windowWidth = $(window).width();
        if(windowWidth < breakpoint) {
          this.$headerImage.css('height', '');
          if(this.stickyColumnsAreSticky) {
            this.$stickyColumns.trigger('sticky_kit:detach');
            this.stickyColumnsAreSticky = false;
          }
        } else {
          var headerPadding = parseInt(this.$header.css('padding-top'));
          this.$headerImage.css('height', $(window).height() - headerPadding*2 - theme.dockedNavHeight());
          if(!this.stickyColumnsAreSticky) {
            this.$stickyColumns.stick_in_parent({
              parent: this.$stickyColumns.closest('.grid, .grid-no-gutter'),
              offset_top: theme.dockedNavHeight()
            });
            this.stickyColumnsAreSticky = true;
          }
        }
      },
  
      /**
       * Event callback for Theme Editor `section:unload` event
       */
      onUnload: function() {
        this.$container.off(this.namespace);
        $(window).off(this.namespace);
        this.$stickyColumns.trigger('sticky_kit:detach');
        theme.peekCarousel.destroy(this.$container, $('.js-content-products-slider .grid', this.$container), this.namespace);
      }
    });
  
    return Blog;
  })();
  
  /**
   * Article Template Script
   * ------------------------------------------------------------------------------
   * For both the article page
   *
     * @namespace article
   */
  
  theme.Article = (function() {
    var selectors = {
      stickyColumn: '.sticky-element',
      slideshow: '.js-content-products-slider .grid'
    };
  
    /**
     * Article section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    function Article(container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
      var rteWidth = $('.template-article .rte').width();
  
      // sticky columns
      this.$stickyColumns = $(selectors.stickyColumn, this.$container);
      this.stickyColumnsAreSticky = false;
  
      //Slideshow
      this.$slideshow = $(selectors.slideshow, this.$container);
  
      $(this.$slideshow).slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        swipeToSlide: true,
        dots: false,
        prevArrow: $('.content-products-controls .prev', this.$container),
        nextArrow: $('.content-products-controls .next', this.$container),
        responsive: [
            {
              breakpoint: $('.single-column-layout', container).length ? 768 : 960,
              settings: {
                slidesToShow: 1
              }
            }
          ]
      });
  
      //Section
      this.assessSection.bind(this)();
      $(window).on('debouncedresize' + this.namespace, this.assessSection.bind(this));
  
      // section may contain RTE images
      theme.assessRTEImagesOnLoad(this.$container);
    }
  
  
    Article.prototype = $.extend({}, Article.prototype, {
      /**
       * Set/unset sticky columns depending on screen size
       */
      assessSection: function(evt) {
        var windowWidth = $(window).width();
        if(windowWidth < 768) {
          if(this.stickyColumnsAreSticky) {
            this.$stickyColumns.trigger('sticky_kit:detach');
            this.stickyColumnsAreSticky = false;
          }
        } else {
          if(!this.stickyColumnsAreSticky) {
            this.$stickyColumns.stick_in_parent({
              parent: this.$stickyColumns.closest('.grid, .grid-no-gutter'),
              offset_top: 30
            });
            this.stickyColumnsAreSticky = true;
          }
        }
      },
  
      /**
       * Event callback for Theme Editor `section:unload` event
       */
      onUnload: function() {
        this.$container.off(this.namespace);
        $(window).off(this.namespace);
        this.$stickyColumns.trigger('sticky_kit:detach');
        $('.js-content-products-slider .grid', this.$container).slick('unslick');
      }
    });
  
    return Article;
  })();
  
  /**
   * Slideshow Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace Slideshow
   */
  
  theme.Slideshow = (function() {
    /**
     * Slideshow section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    function Slideshow(container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
      this.$slideshow = $('.js-slideshow-section', this.$container);
  
      /**
       * Slick slideshow
       */
      var count = false;
      if(this.$slideshow.children().length > 1){
        var count = true;
      }
      this.$slideshow.slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: count,
        adaptiveHeight: false,
        autoplay: this.$slideshow.data('autoplay'),
        autoplaySpeed: this.$slideshow.data('autoplayspeed'),
        prevArrow: false,
        nextArrow: false
      });
  
      $(window).on('debouncedresize' + this.namespace, this.onResize.bind(this));
    };
  
    Slideshow.prototype = $.extend({}, Slideshow.prototype, {
      /**
       * Event callback for window resize
       */
      onResize: function(evt) {
        // fix slick bug where height does not adapt to content height on resize
        this.$slideshow.slick('setPosition');
      },
  
      /**
       * Event callback for Theme Editor `shopify:block:select` event
       */
      onBlockSelect: function(evt) {
        this.$slideshow
          .slick('slickGoTo', $(evt.target).data('slick-index'), true)
          .slick('slickPause');
      },
  
      /**
       * Event callback for Theme Editor `shopify:block:deselect` event
       */
      onBlockDeselect: function(evt) {
        this.$slideshow.slick('slickPlay');
      },
  
      /**
       * Event callback for Theme Editor `section:unload` event
       */
      onUnload: function() {
        this.$container.off(this.namespace);
        $(window).off(this.namespace);
        this.$slideshow.slick('unslick');
      }
    });
  
    return Slideshow;
  })();
  
  /**
   * Slideshow Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace richStatement
   */
  
  theme.Richstatement = (function() {
      var selectors = {
          slideshow: '.mobile-slide-richstatement'
        };
      
      /**
       * richStatement section constructor. Runs on page load as well as Theme Editor
       * `section:load` events.
       * @param {string} container - selector for the section container DOM element
       */
      function Richstatement(container) {
          this.$container = $(container);
          this.namespace = theme.namespaceFromSection(container);
          console.log(this.namespace);
  
          this.$richslideshow = $(selectors.slideshow, this.$container);
          theme.peekCarousel.init(this.$container, this.$richslideshow, this.namespace, function(){ 
              return $(window).width() < 770 
            }, true,
            {
              infinite: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: false,
              prevArrow: $('.full-width-slideshow-controls .prev', this.$container),
              nextArrow: $('.full-width-slideshow-controls .next', this.$container),
              responsive: [
                {
                  breakpoint: 770,
                  settings: {
                    slidesToShow: 1,
                  }
                },
              ]
            }
          );
      };
    
      Richstatement.prototype = $.extend({}, Richstatement.prototype, {
          onUnload: function() {
              theme.peekCarousel.destroy(this.$container, this.$richslideshow, this.namespace);
            }
          }); 
      return Richstatement;
    })();
    
  /**
   * Slideshow Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace richStatement
   */
  
  theme.Testimonials = (function() {
      var selectors = {
          slideshow: '.quotes-slider'
        };
      
      /**
       * testimonials section constructor. Runs on page load as well as Theme Editor
       * `section:load` events.
       * @param {string} container - selector for the section container DOM element
       */
      function Testimonials(container) {
          this.$container = $(container);
          this.namespace = theme.namespaceFromSection(container);
  
          this.$richslideshow = $(selectors.slideshow, this.$container);
          theme.peekCarousel.init(this.$container, this.$richslideshow, this.namespace, function(){ 
              return $(window).width() < 770
            }, true,
            {
              infinite: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: true,
              arrows: false,
              responsive: [
                {
                  breakpoint: 770,
                  settings: {
                    slidesToShow: 1,
                  }
                },
              ]
            }
          );
      };
    
      Testimonials.prototype = $.extend({}, Testimonials.prototype, {
          onUnload: function() {
              theme.peekCarousel.destroy(this.$container, this.$richslideshow, this.namespace);
            }
          }); 
      return Testimonials;
    })();
    
  /**
   * Standout collection Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace StandoutCollection
   */
  
  theme.StandoutCollection = (function() {
    /**
     * StandoutCollection section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    function StandoutCollection(container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
  
      /**
       * Slick StandoutCollection
       */
      theme.peekCarousel.init(
        this.$container,
        $('.js-standout-collection-slider', this.$container),
        this.namespace,
        function(){ return true },
        false,
        {
          infinite: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          prevArrow: $('.standout-collection-slider__controls .prev', this.$container),
          nextArrow: $('.standout-collection-slider__controls .next', this.$container)
        }
      );
    };
  
    StandoutCollection.prototype = $.extend({}, StandoutCollection.prototype, {
      /**
       * Event callback for Theme Editor `section:unload` event
       */
      onUnload: function() {
        this.$container.off(this.namespace);
        theme.peekCarousel.destroy(this.$container, $('.js-standout-collection-slider', this.$container), this.namespace);
      }
    });
  
    return StandoutCollection;
  })();
  
  /**
   * Get The Look Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace get-the-look
   */
  
  theme.GetTheLook = (function() {
    var selectors = {
      stickyColumn: '.sticky-element',
      header: '.get-the-look__image-container',
      headerImage: '.get-the-look__image-container .placeholder-svg, .get-the-look__image-container .rimage-outer-wrapper',
      slideshow: '.js-get-the-look-slider',
      product: '.get-the-look__product:first'
    };
  
    var breakpoint = 768;
    var resizeTimer;
  
    function GetTheLook(container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
  
      // sticky columns
      this.$stickyColumns = $(selectors.stickyColumn, this.$container);
      this.stickyColumnsAreSticky = false;
  
      // header spacing/image
      this.$header = $(selectors.header, this.$container);
      this.$headerImage = $(selectors.headerImage, this.$container);
  
      // slideshow
      this.$slideshow = $(selectors.slideshow, this.$container);
  
      // first product
      this.$firstProduct = $(selectors.product, this.$container);
  
      // peek carousel (must be before sticky checks)
      theme.peekCarousel.init(this.$container, this.$slideshow, this.namespace, (function(){
        return this.$firstProduct.length && parseInt(this.$firstProduct.css('margin-right')) == 0;
      }).bind(this));
  
      // section
      this.assessSection.bind(this)();
      $(window).on('debouncedresize' + this.namespace, this.assessSection.bind(this));
    };
  
    GetTheLook.prototype = $.extend({}, GetTheLook.prototype, {
  
      /**
       * Set/unset sticky columns depending on screen size
       */
      assessSection: function(evt) {
        if(this.$firstProduct.length && parseInt(this.$firstProduct.css('margin-right')) == 0) {
          this.$headerImage.css('height', '');
          if(this.stickyColumnsAreSticky) {
            this.$stickyColumns.trigger('sticky_kit:detach');
            this.stickyColumnsAreSticky = false;
          }
        } else {
          var headerPadding = 30;
          this.$headerImage.css('height', $(window).height() - headerPadding*2 - theme.dockedNavHeight());
  
          if(!this.stickyColumnsAreSticky) {
            this.$stickyColumns.stick_in_parent({
              parent: this.$stickyColumns.closest('.grid'),
              offset_top: headerPadding + theme.dockedNavHeight()
            });
            this.stickyColumnsAreSticky = true;
          }
        }
      },
  
      /**
       * Event callback for Theme Editor `section:unload` event
       */
      onUnload: function() {
        this.$container.off(this.namespace);
        $(window).off(this.namespace);
        this.$stickyColumns.trigger('sticky_kit:detach');
        theme.peekCarousel.destroy(this.$container, this.$slideshow, this.namespace);
      }
    });
  
    return GetTheLook;
  })();
  
  /**
   * Promotional Images Script
   * ------------------------------------------------------------------------------
   *
   * @namespace promotional-images
   */
  
  theme.PromotionalImages = (function() {
  
    function PromotionalImages(container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
  
      // section
      (this.assessSection.bind(this))();
      $(window).on('load' + this.namespace, this.assessSection.bind(this));
      $(window).on('debouncedresize' + this.namespace, this.assessSection.bind(this));
    };
  
    PromotionalImages.prototype = $.extend({}, PromotionalImages.prototype, {
  
      assessSection: function(evt) {
        if($(window).width() >= 768) {
          // check all the rows
          $('.promotional-row').each(function(){
            var tallest = 0;
            $(this).find('.text_over_image .promotional-row__content').each(function(){
              var thisHeight = $(this).outerHeight() + 60;
              if(thisHeight > tallest) {
                tallest = thisHeight;
              }
            });
            $(this).find('.text_over_image').css('min-height', tallest);
          });
        } else {
          $('.promotional-row .text_over_image').css('min-height', '');
        }
      },
  
      onUnload: function() {
        this.$container.off(this.namespace);
        $(window).off(this.namespace);
      }
    });
  
    return PromotionalImages;
  })();
  
  /**
   * Featured Collection Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace featured-collection */
  
  theme.FeaturedCollection = (function() {
  
    var selectors = {
      slideshow: '.js-featured-collection-slider'
    };
  
    var breakpoint = 768;
    var resizeTimer;
  
    /**
     * FeaturedCollection section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    function FeaturedCollection(container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
  
      //Slideshow
      this.$slideshow = $(selectors.slideshow, this.$container);
  
      // peek carousel
      theme.peekCarousel.init(this.$container, this.$slideshow, this.namespace, function(){
        return $(window).width() < 768
      }, true,
      {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
            }
          },
        ]
      }
      )
    }
  
    FeaturedCollection.prototype = $.extend({}, FeaturedCollection.prototype, {
      /**
       * Event callback for Theme Editor `section:unload` event
       */
      onUnload: function() {
        theme.peekCarousel.destroy(this.$container, this.$slideshow, this.namespace);
      }
    });
  
    return FeaturedCollection;
  })();
  
  /**
   * List Collections Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the List Collections template.
   *
     * @namespace ListCollections
   */
  
  theme.ListCollections = (function() {
    /**
     * ListCollections section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    function ListCollections(container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
  
      // section may contain RTE images
      theme.assessRTEImagesOnLoad(this.$container);
  
      /**
       * Slick ListCollections
       */
      $('.js-list-collection-slider', this.$container).each((function(index, value){
        theme.peekCarousel.init(
          this.$container,
          $(value),
          this.namespace,
          function(){ return true },
          false,
          {
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            prevArrow: $(value).siblings('.standout-collection-slider__controls').children('.prev'),
            nextArrow: $(value).siblings('.standout-collection-slider__controls').children('.next'),
            responsive: [
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 1,
                }
              },
            ]
          }
        );
      }).bind(this));
    };
  
    ListCollections.prototype = $.extend({}, ListCollections.prototype, {
      /**
       * Event callback for Theme Editor `section:unload` event
       */
      onUnload: function() {
        this.$container.off(this.namespace);
        theme.peekCarousel.destroy(this.$container, $('.js-list-collection-slider', this.$container), this.namespace);
      }
    });
  
    return ListCollections;
  })();
  
  /**
   * Video Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace Video
   */
  
  theme.Video = (function() {
    /**
     * Video section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    function Video(container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
  
      var $iframeVideo = $(
        'iframe[src*="youtube.com/embed"], iframe[src*="player.vimeo"]',
        this.$container
      );
      var $iframeReset = $iframeVideo.add('iframe#admin_bar_iframe');
  
      $iframeVideo.each(function() {
        // Add wrapper to make video responsive
        if (!$(this).parents('.video-container').length) {
          $(this).wrap('<div class="video-container"></div>');
        }
      });
  
      $iframeReset.each(function() {
        // Re-set the src attribute on each iframe after page load
        // for Chrome's 'incorrect iFrame content on 'back'' bug.
        // https://code.google.com/p/chromium/issues/detail?id=395791
        // Need to specifically target video and admin bar
        this.src = this.src;
      });
    }
  
    Video.prototype = $.extend({}, Video.prototype, {
      /**
       * Event callback for Theme Editor `section:unload` event
       */
      onUnload: function() {
        this.$container.off(this.namespace);
      }
    });
  
    return Video;
  })();
  
  
  
  
  /**
   * Collection Template Script
   * ------------------------------------------------------------------------------
   * For collection pages
   *
   * @namespace collection-template
   */
  
  theme.CollectionTemplate = (function() {
  
    var selectors = {
      sortBy: 'select[name="sort_by"]',
      styledSelect: '.styled-dropdown select',
      filterSelects: '.filter select',
      revealFilterButtons: '.collection-filter-control button',
      closeFilterButton: '.collection-filters-container__close',
      ajaxProductsContainer: '[data-ajax-products]'
    };
  
    /**
     * CollectionTemplate section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    function CollectionTemplate(container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
  
      // change sort order
      this.$container.on('change' + this.namespace, selectors.sortBy, this.onSortByChange.bind(this));
  
      // filtering
      this.$filters = this.$container.find(selectors.filterSelects);
      this.$filters.on('change' + this.namespace, this.onFilterChange.bind(this));
  
      // revealing filters on tablet/mobile
      this.$container.on('click' + this.namespace, selectors.revealFilterButtons, this.filterReveal);
      this.$container.on('click' + this.namespace, selectors.closeFilterButton, this.filterClose);
  
      // style dropdowns
      theme.select2.init($(selectors.styledSelect, container));
  
      // ajax
      this.$ajaxProductsContainer = $(selectors.ajaxProductsContainer, container);
      if(this.$ajaxProductsContainer.data('ajax-products')) {
        $(window).on('popstate' + this.namespace, this.onWindowPopState.bind(this));
      }
    }
  
    CollectionTemplate.prototype = $.extend({}, CollectionTemplate.prototype, {
      /**
       * Handle back button after ajax change
       */
      onWindowPopState: function(evt) {
        if(evt.originalEvent.state == 'themeChangeUrl') {
          location.reload();
        }
      },
  
      /**
       * Handle ajax/not changes of url
       */
      changeUrl: function(url) {
        if(this.$ajaxProductsContainer.data('ajax-products')) {
          /// ajax
          // scroll to top of products, on mobile
          if($(window).width() <= 930) {
            $('html, body').animate({
              scrollTop: this.$ajaxProductsContainer.offset().top - 120
            }, 1000);
          }
  
          // transition out
          this.$ajaxProductsContainer.css({
            height: this.$ajaxProductsContainer.height(),
            opacity: 0
          });
          var _url = url;
          // wait until after transition
          var delay = this.$ajaxProductsContainer.css('transition-duration');
          if(delay.indexOf('ms') > -1) {
            delay = parseInt(delay);
          } else {
            delay = parseFloat(delay) * 1000;
          }
          setTimeout((function(){
            // fetch new
            $.get(url, (function(data){
              // get product area
              var $data = $('<div>').append($.parseHTML(data));
              var $products = $data.find(selectors.ajaxProductsContainer).children();
              // transition in
              this.$ajaxProductsContainer.empty().append($products).css({
                height: '',
                opacity: ''
              });
              // push history
              var title = $data.find('title:first').text();
              document.title = title;
              window.history.pushState('themeChangeUrl', title, _url);
            }).bind(this)).error(function(){
              window.location = _url;
            });
          }).bind(this), delay);
        } else {
          // no ajax
          window.location = url;
        }
      },
  
      /**
       * Event callback for when a tag filter changes
       */
      onFilterChange: function() {
        var path = this.$filters.first().data('filter-root');
        // build list of tags
        var tags = [];
        this.$filters.each(function(){
          if($(this).val().length > 0) {
            tags.push($(this).val());
          }
        });
        // add tags to collection path
        path += tags.join('+');
        // preserve sort order
        if(location.search.indexOf('sort_by') > -1) {
          var orderMatch = location.search.match(/sort_by=([^$&]*)/);
          if(orderMatch) {
            path += '?sort_by=' + orderMatch[1];
          }
        }
        this.changeUrl(path);
      },
  
      /**
       * Event callback for when the sort-by dropdown changes
       */
      onSortByChange: function(evt) {
        var queryParams = {};
        if (location.search.length) {
          for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
            aKeyValue = aCouples[i].split('=');
            if (aKeyValue.length > 1) {
              queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
            }
          }
        }
        queryParams.sort_by = $(evt.target).val();
        this.changeUrl(location.toString().split('?')[0] + '?' + $.param(queryParams).replace(/\+/g, '%20'));
      },
  
      /**
       * Function for revealing filter options
       */
      filterReveal: function() {
        var $filterContainer = $('.collection-filters-container')
          .removeClass('show-filters show-sort')
          .addClass('show-' + $(this).data('collection-filter-reveal'));
  
        var $controls = $('.collection-filter-control');
        var offset = $filterContainer.outerHeight() + $controls.outerHeight();
        offset += $filterContainer.offset().top - $controls.offset().top;
  
        $filterContainer.css('transform', 'translate3d(0,0,0)');
      },
  
      /**
       * Function for revealing filter options
       */
      filterClose: function() {
        $('.collection-filters-container').css('transform', '');
      },
  
      /**
       * Event callback for Theme Editor `section:unload` event
       */
      onUnload: function() {
        this.$container.off(this.namespace);
        this.$filters.off(this.namespace);
        $(selectors.styledSelect, this.$container).select2('destroy');
        $(window).off(this.namespace);
      }
    });
  
    return CollectionTemplate;
  })();
  
  /**
   * Map Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace Map
   */
  
  theme.Map = (function() {
    /**
     * Map section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
  
    var config = {
      zoom: 14,
      styles: {
        default: [],
        silver: [{"elementType":"geometry","stylers":[{"color":"#f5f5f5"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#f5f5f5"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#e5e5e5"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#dadada"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#e5e5e5"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#c9c9c9"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]}],
        retro: [{"elementType":"geometry","stylers":[{"color":"#ebe3cd"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#523735"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#f5f1e6"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#c9b2a6"}]},{"featureType":"administrative.land_parcel","elementType":"geometry.stroke","stylers":[{"color":"#dcd2be"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#ae9e90"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#93817c"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#a5b076"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#447530"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#f5f1e6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#fdfcf8"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#f8c967"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#e9bc62"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#e98d58"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.stroke","stylers":[{"color":"#db8555"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#806b63"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"transit.line","elementType":"labels.text.fill","stylers":[{"color":"#8f7d77"}]},{"featureType":"transit.line","elementType":"labels.text.stroke","stylers":[{"color":"#ebe3cd"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#b9d3c2"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#92998d"}]}],
        dark: [{"elementType":"geometry","stylers":[{"color":"#212121"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#212121"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#757575"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"administrative.land_parcel","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#181818"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"poi.park","elementType":"labels.text.stroke","stylers":[{"color":"#1b1b1b"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#2c2c2c"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#8a8a8a"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#373737"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#3c3c3c"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#3d3d3d"}]}],
        night: [{"elementType":"geometry","stylers":[{"color":"#242f3e"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#746855"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#242f3e"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#263c3f"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#6b9a76"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#38414e"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#212a37"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#9ca5b3"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#746855"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#1f2835"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#f3d19c"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2f3948"}]},{"featureType":"transit.station","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#17263c"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#515c6d"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#17263c"}]}],
        aubergine: [{"elementType":"geometry","stylers":[{"color":"#1d2c4d"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#8ec3b9"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#1a3646"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"color":"#4b6878"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#64779e"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"color":"#4b6878"}]},{"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"color":"#334e87"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#023e58"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#283d6a"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#6f9ba5"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#1d2c4d"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#023e58"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#3C7680"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#304a7d"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#98a5be"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#1d2c4d"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#2c6675"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#255763"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#b0d5ce"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"color":"#023e58"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#98a5be"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"color":"#1d2c4d"}]},{"featureType":"transit.line","elementType":"geometry.fill","stylers":[{"color":"#283d6a"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#3a4762"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#0e1626"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#4e6d70"}]}]
      }
    };
  
    var errors = {
      addressNoResults: theme.strings.addressNoResults,
      addressQueryLimit: theme.strings.addressQueryLimit,
      addressError: theme.strings.addressError,
      authError: theme.strings.authError
    };
  
    var selectors = {
      section: '[data-section-type="map"]',
      map: '[data-map]',
      mapOverlay: '[data-map-overlay]'
    };
  
    var classes = {
      mapError: 'map-section--load-error',
      errorMsg: 'map-section__error errors text-center'
    };
  
  
    // Global function called by Google on auth errors.
    // Show an auto error message on all map instances.
    // eslint-disable-next-line camelcase, no-unused-vars
    window.gm_authFailure = function() {
      if (!Shopify.designMode) return;
  
      if (Shopify.designMode) {
        $(selectors.section).addClass(classes.mapError);
        $(selectors.map).remove();
        $(selectors.mapOverlay).after(
          '<div class="' +
            classes.errorMsg +
            '">' +
            theme.strings.authError +
            '</div>'
        );
      }
    };
  
  
    function Map(container) {
  
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
      this.$map = this.$container.find(selectors.map);
      this.key = this.$map.data('api-key');
      this.style = this.$map.data('map-style');
      this.loaded = false;
  
      if (this.$map.length === 0 || typeof this.key !== 'string' || this.key === '') {
        return;
      }
  
      $(window).on('scroll' + this.namespace + ' load' + this.namespace, this.assessVisibility.bind(this));
      this.assessVisibility.bind(this)();
    }
  
    function geolocate($map) {
      var deferred = $.Deferred();
      var geocoder = new google.maps.Geocoder();
      var address = $map.data('address-setting');
  
      geocoder.geocode({ address: address }, function(results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
          deferred.reject(status);
        }
  
        deferred.resolve(results);
      });
  
      return deferred;
    }
  
  
    Map.prototype = $.extend({}, Map.prototype, {
  
      assessVisibility: function(){
        if( this.$container !== false
            && this.$container.offset().top < $(window).scrollTop() + $(window).height()
            && this.$container.offset().top + this.$container.outerHeight() > $(window).scrollTop() ) {
          $(window).off(this.namespace);
          theme.loadScriptOnce('https://maps.googleapis.com/maps/api/js?key=' + this.key, this.createMap.bind(this));
        }
      },
  
      createMap: function() {
        var $map = this.$map;
        return geolocate($map)
          .then(
            function(results) {
              var mapOptions = {
                zoom: config.zoom,
                styles: config.styles[this.style],
                center: results[0].geometry.location,
                draggable: false,
                clickableIcons: false,
                scrollwheel: false,
                disableDoubleClickZoom: true,
                disableDefaultUI: true,
                zoomControl: true
              };
  
              var map = (this.map = new google.maps.Map($map[0], mapOptions));
              var center = (this.center = map.getCenter());
  
              //eslint-disable-next-line no-unused-vars
              var marker = new google.maps.Marker({
                map: map,
                position: map.getCenter()
              });
  
              // offset due to design
              map.panBy(0, 50);
  
              google.maps.event.addDomListener(window, 'resize', function() {
                google.maps.event.trigger(map, 'resize');
                map.setCenter(center);
                map.panBy(0, 50);
                $map.removeAttr('style');
              });
            }.bind(this)
          )
          .fail(function() {
            var errorMessage;
  
            switch (status) {
              case 'ZERO_RESULTS':
                errorMessage = errors.addressNoResults;
                break;
              case 'OVER_QUERY_LIMIT':
                errorMessage = errors.addressQueryLimit;
                break;
              case 'REQUEST_DENIED':
                errorMessage = errors.authError;
                break;
              default:
                errorMessage = errors.addressError;
                break;
            }
  
            // Show errors only to merchant in the editor.
            if (Shopify.designMode) {
              $map
                .parent()
                .addClass(classes.mapError)
                .html(
                  '<div class="' +
                    classes.errorMsg +
                    '">' +
                    errorMessage +
                    '</div>'
                );
            }
          });
      },
  
      onUnload: function() {
        if (this.$map.length === 0) {
          return;
        }
        if(window.google) {
          google.maps.event.clearListeners(this.map, 'resize');
        }
        $(window).off(this.namespace);
      }
    });
    return Map;
  })();
  
  /**
   * Instagram Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace Instagram
   */
  
  theme.Instagram = (function() {
    /**
     * Instagram section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
  
    function Instagram(container) {
      this.$container = $(container);
      this.$title = $('.title', container);
  
      this.loadInstagramWidgets.bind(this)();
    }
  
    Instagram.prototype = $.extend({}, Instagram.prototype, {
      loadInstagramWidgets: function() {
        var $title = this.$title;
        $('.willstagram:not(.willstagram-placeholder)', this.$container).each(function(){
          var user_id = $(this).data('user_id');
          var tag = $(this).data('tag');
          var access_token = $(this).data('access_token');
          var count = $(this).data('count') || 10;
          var showHover = $(this).data('show-hover');
          var $willstagram = $(this);
          var url = '';
          if(typeof user_id != 'undefined') {
            url = 'https://api.instagram.com/v1/users/' + user_id + '/media/recent?count='+count;
          } else if(typeof tag != 'undefined') {
            url = 'https://api.instagram.com/v1/tags/' + tag + '/media/recent?count='+count;
          }
          $.ajax({
            type: "GET",
            dataType: "jsonp",
            cache: false,
            url: url
            + (typeof access_token == 'undefined'? '' : ('&access_token='+access_token)),
            success: function(res) {
              if(typeof res.data != 'undefined') {
                var $itemContainer = $('<div class="willstagram__items">').appendTo($willstagram);
                var limit = Math.min(20, res.data.length);
                for(var i = 0; i < limit; i++) {
                  var photo = res.data[i].images.standard_resolution;
                  var photo_small = res.data[i].images.low_resolution;
                  var $item = $([
                    '<div class="willstagram__item global-border-radius item--', i+1,
                    '"><a class="willstagram__link rimage-background lazyload fade-in" target="_blank" href="',
                    res.data[i].link,
                    '" data-bgset="', photo_small.url.replace('http:', ''),' ', photo_small.width, 'w ', photo_small.height, 'h, ',
                    photo.url.replace('http:', ''), ' ', photo.width, 'w ', photo.height, 'h" data-sizes="auto" data-parent-fit="cover">',
                    '<img class="willstagram__img lazyload fade-in" data-src="',
                    photo.url.replace('http:', ''),
                    '" /></a></div>'
                  ].join(''));
  
                  if(showHover) {
                    var date = new Date(res.data[i].created_time * 1000);
                    window.willstagramMaskCount = (window.willstagramMaskCount || 0) + 1;
                    var maskId = 'willstagram-svg-mask-' + window.willstagramMaskCount,
                        gradientId = 'willstagram-svg-grad-' + window.willstagramMaskCount;
                    $item.append([
                      '<div class="willstagram__overlay">',
                      '<div class="willstagram__desc">',
                      '<svg>',
                        '<defs>',
                          '<mask id="', maskId, '" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">',
                            '<linearGradient id="', gradientId, '" gradientUnits="objectBoundingBox" x2="0" y2="1">',
                              '<stop stop-color="white" stop-opacity="1" offset="0" />',
                              '<stop stop-color="white" stop-opacity="1" offset="0.6" />',
                              '<stop stop-color="white" stop-opacity="0" offset="1" />',
                            '</linearGradient>',
                            '<rect width="100%" height="100%" fill="url(#', gradientId, ')" />',
                          '</mask>',
                        '</defs>',
                        '<foreignObject width="100%" height="500" style="mask: url(#', maskId,')">',
                          '<div xmlns="http://www.w3.org/1999/xhtml">',
                            res.data[i].caption ? res.data[i].caption.text : '',
                          '</div>',
                        '</foreignObject>',
                      '</svg>',
                      '</div>',
                      '<div class="willstagram__likes">', res.data[i].likes ? ('❤ ' + res.data[i].likes.count) : '', '</div>',
                      '<div class="willstagram__date">', date.toLocaleDateString(), '</div>',
                      '</div>'
                    ].join(''));
                  }
                  $itemContainer.append($item);
                }
  
                $willstagram.trigger('loaded.willstagram');
                if(res.data.length > 0 && $title.length) {
                  var username = res.data[0].user.username;
                  var title_html = $title.html();
                  $title.html($('<a target="_blank">').attr('href', 'https://instagram.com/'+username).html(title_html));
                }
              } else if(typeof res.meta !== 'undefined' && typeof res.meta.error_message !== 'undefined') {
                $willstagram.append('<div class="willstagram__error">'+res.meta.error_message+'</div>');
              }
            }
          });
        });
  
        $('.willstagram-placeholder', this.$container).trigger('loaded.willstagram');
      }
    });
    return Instagram;
  })();
  
  /**
   * Cart Template Script
   * ------------------------------------------------------------------------------
   *
     * @namespace cart
   */
  
   theme.Cart = (function() {
    /**
     * Cart section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    function Cart(container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
  
      // toggle shipping estimates
      this.$container.on('click' + this.namespace, '.js-shipping-calculator-trigger', function(){
        var $this = $(this);
        var $parent = $this.parents('.shipping-calculator-container');
        $parent.toggleClass('calculator-open');
        if($parent.hasClass('calculator-open')){
          $this.text("{{ 'cart.shipping_calculator.hide_calculator' | t }}");
          $parent.children('.shipping-calculator').slideDown(250);
        } else {
          $this.text("{{ 'cart.shipping_calculator.title' | t }}");
          $parent.children('.shipping-calculator').slideUp(250);
        }
      });
  
      // toggle notes
      this.$container.on('click' + this.namespace, '.js-cart-notes-trigger', function(){
        var $this = $(this);
        var $parent = $this.parent('.cart-notes-container');
        $parent.toggleClass('notes-open');
        if($parent.hasClass('notes-open')){
          $this.text("{{ 'cart.general.hide_note' | t }}");
          $parent.children('.cart-notes').slideDown(250);
        } else {
          $this.text("{{ 'cart.general.show_note' | t }}");
          $parent.children('.cart-notes').slideUp(250);
        }
      });
  
      // quantity adjustment
      if(this.$container.data('ajax-update')) {
        var updateCartFunction = this.updateCart;
        this.$container.on('keyup' + this.namespace + ' change' + this.namespace, '.quantity__change input', function(){
          if($(this).data('previousValue') && $(this).data('previousValue') == $(this).val()){
            return;
          }
          if($(this).val().length == 0 || $(this).val() == '0') {
            return;
          }
          updateCartFunction({
            line: $(this).data('line'),
            quantity: $(this).val()
          });
          $(this).data('previousValue', $(this).val());
        });
  
        this.$container.on('click' + this.namespace, '.quantity__minus, .quantity__plus', function(e){
          var $input = $(this).closest('.quantity__change').find('input');
          if($(this).hasClass('quantity__minus')) {
            $input.val(parseInt($input.val()) - 1).trigger('change');
          } else {
            $input.val(parseInt($input.val()) + 1).trigger('change');
          }
          return false;
        });
      }
  
      // select contents on focus
      this.$container.on('focusin' + this.namespace + ' click' + this.namespace, 'input.quantity__number', function(){
        $(this).select();
      }).on('mouseup' + this.namespace, 'input.quantity__number', function(e){
        e.preventDefault(); //Prevent mouseup killing select()
      });
  
      // terms and conditions checkbox
      if($('#terms', container).length > 0) {
        $(document).on('click' + this.namespace, '[name="checkout"], a[href="/checkout"]', function() {
          if($('#terms:checked').length == 0) {
            alert(theme.strings.cartTermsNotChecked);
            return false;
          }
        });
      }
  
      // recently viewed
      this.$recentlyViewed = $('.recently-viewed', this.$container);
      if(this.$recentlyViewed.length) {
        this.loadRecentlyViewed.bind(this)();
        theme.loadRecentlyViewed(this.$recentlyViewed);
      }
    }
  
  
    Cart.prototype = $.extend({}, Cart.prototype, {
      /**
       * Display recently viewed products, minus products in the cart
       */
      loadRecentlyViewed: function(evt) {
        if(theme.storageAvailable('localStorage')) {
          // grab current value and parse
          var recentDisplayCount = 6;
          var existingArr = theme.getRecentProducts();
  
          if(existingArr.length) {
            // remove in-cart items from row
            var handlesToExcludeValue = this.$recentlyViewed.data('exclude');
            var handlesToExclude = [];
            if(handlesToExcludeValue.length) {
              handlesToExclude = handlesToExcludeValue.split(',');
            }
  
            // show the products
            var $recentlyViewedBucket = this.$recentlyViewed.find('.grid'),
                count = 0,
                iterator = 0,
                showHoverImage = this.$recentlyViewed.data('show-hover-image');
  
            while(count < recentDisplayCount && iterator < existingArr.length) {
              var showThis = true;
              // skip those in the excluded-list
              for(var i=0; i<handlesToExclude.length; i++) {
                if(existingArr[iterator].handle == handlesToExclude[i]) {
                  showThis = false;
                  break;
                }
              }
              if(showThis) {
                count++;
                theme.addRecentProduct(existingArr, iterator, $recentlyViewedBucket, showHoverImage);
              }
              iterator++;
            }
  
            // reveal container, if anything to show
            if(count > 0) {
              this.$recentlyViewed.removeClass('hidden');
            }
          }
        }
      },
  
      /**
       * Function for changing the cart and updating the page
       */
      updateCart: function(params){
        if(window.cartXhr) {
          window.cartXhr.abort();
        }
        window.cartXhr = $.ajax({
          type: 'POST',
          url: '/cart/change.js',
          data: params,
          dataType: 'json',
          success: function(data){
            // subtotal
            console.log(data);
            $('.total__amount').html(
              $('<span class="theme-money">').html(slate.Currency.formatMoney(data.total_price, theme.moneyFormat))
            );
  
            // each line item
            $('.cart-item .total[data-line]').each(function(){
              // line price
              var linePrice = data.items[$(this).data('line') - 1].line_price;
              $(this).html(
                $('<span class="theme-money">').html(slate.Currency.formatMoney(linePrice, theme.moneyFormat))
              );
  
              // minus visibility
              var quantity = data.items[$(this).data('line') - 1].quantity;
              var $item = $(this).closest('.cart-item');
              $item.find('.quantity__minus').toggleClass('quantity__unusable', quantity < 2);
              var $input = $item.find('input');
              if($input.val() != quantity.toString()) {
                $input.val(quantity).data('previousValue', quantity.toString());
                alert(theme.strings.quantityTooHigh.replace(['{', '{ quantity }', '}'].join(''), quantity));
              }
  
              // plus visibility
              if($input.data('max') !== 'undefined' && $input.val() == $input.data('max')) {
                $item.find('.quantity__plus').addClass('quantity__unusable');
              } else {
                $item.find('.quantity__plus').removeClass('quantity__unusable');
              }
            });
  
            theme.checkCurrency();
          },
          error: function(data){
            console.log('Error processing update');
            console.log(data);
          }
        });
      },
  
      /**
       * Event callback for Theme Editor `section:unload` event
       */
      onUnload: function() {
        this.$container.off(this.namespace);
        $(document).off(this.namespace);
        if(this.$recentlyViewed.length) {
          theme.unloadRecentlyViewed(this.$recentlyViewed);
        }
      }
    });
  
    return Cart;
  })();
  
  /**
   * Page Story Template Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace featured-collection */
  
  theme.PageStoryTemplate = (function() {
  
    var selectors = {
      collectionSlideshow: '.js-collection-slider'
    };
  
    /**
     * PageStoryTemplate section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
    function PageStoryTemplate(container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);
  
      // section may contain RTE images
      theme.assessRTEImagesOnLoad(this.$container);
  
      // Slideshows
      this.$slideshows = $(selectors.collectionSlideshow, this.$container);
  
      // peek carousel
      theme.peekCarousel.init(this.$container, this.$slideshows, this.namespace, function(){
        return $(window).width() < 768
      }, true);
  
      // Image with text rows
      this.$imageWithTextRows = $('.image-with-text', container);
  
      // Section
      this.assessSection.bind(this)();
      $(window).on('debouncedresize' + this.namespace, this.assessSection.bind(this));
    }
  
    PageStoryTemplate.prototype = $.extend({}, PageStoryTemplate.prototype, {
  
      /**
       * Set/unset slideshows
       */
      assessSection: function(evt) {
        // mimic logic from image-with-text.js
        this.$imageWithTextRows.each(function(){
          // assign
          var $imageWithTextImageContainer = $('.image-with-text__image', this);
          var $imageWithTextImage = $('.image-with-text__image .rimage__image', this);
          var $imageWithTextText = $('.image-with-text__content', this);
          // calculate
          var imageRatio = $imageWithTextImage.height() / $imageWithTextImage.width();
          var imageHeightWithoutInset = $imageWithTextImageContainer.outerWidth() * imageRatio;
          $imageWithTextImageContainer.toggleClass(
            'image-with-text__image--inset',
            imageHeightWithoutInset < $imageWithTextText.outerHeight()
          );
        });
      },
  
      /**
       * Event callback for Theme Editor `section:unload` event
       */
      onUnload: function() {
        $(window).off(this.namespace);
        theme.peekCarousel.destroy(this.$container, this.$slideshows, this.namespace);
      }
    });
  
    return PageStoryTemplate;
  })();
  
  /**
   * ImageWithText Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace ImageWithText
   */
  
  theme.ImageWithText = (function() {
    /**
     * ImageWithText section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
  
    function ImageWithText(container) {
      this.namespace = theme.namespaceFromSection(container);
      this.$container = $(container);
      this.$imageContainer = $('.image-with-text__image', container);
      this.$image = $('.image-with-text__image .rimage__image', container);
      this.$text = $('.image-with-text__content', container);
  
      $(window).on('load' + this.namespace + ' debouncedresize' + this.namespace, this.assessImage.bind(this));
      this.assessImage.bind(this)();
    }
  
    ImageWithText.prototype = $.extend({}, ImageWithText.prototype, {
  
      /**
       * Ensure image either fills height or is inset
       */
      assessImage: function(evt) {
        var imageRatio = this.$image.height() / this.$image.width();
        var imageHeightWithoutInset = this.$imageContainer.outerWidth() * imageRatio;
        this.$imageContainer.toggleClass(
          'image-with-text__image--inset',
          imageHeightWithoutInset < this.$text.outerHeight()
        );
      },
  
      /**
       * Event callback for Theme Editor `section:unload` event
       */
      onUnload: function() {
        $(window).off(this.namespace);
      }
    });
    return ImageWithText;
  })();
  
  /**
   * FeaturedProduct Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace FeaturedProduct
   */
  
  theme.FeaturedProduct = (function() {
    /**
     * FeaturedProduct section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */
  
    function FeaturedProduct(container) {
      this.namespace = theme.namespaceFromSection(container);
      this.$container = $(container);
      this.$row = $('.featured-product-section', container);
      this.$imageContainer = $('.featured-product-image', container);
      this.$image = $('.featured-product-image .featured-product-image-link', container);
  
      $(window).on('load' + this.namespace + ' debouncedresize' + this.namespace, this.assessImage.bind(this));
      this.assessImage.bind(this)();
    }
  
    FeaturedProduct.prototype = $.extend({}, FeaturedProduct.prototype, {
  
      /**
       * Ensure image either fills height or is inset
       */
      assessImage: function(evt) {
        var imageRatio = this.$image.height() / this.$image.width();
        var imageHeightWithoutInset = this.$imageContainer.outerWidth() * imageRatio;
        this.$imageContainer.toggleClass(
          'featured-product-image--inset',
          imageHeightWithoutInset < this.$row.height()
        );
      },
  
      /**
       * Event callback for Theme Editor `section:unload` event
       */
      onUnload: function() {
        $(window).off(this.namespace);
      }
    });
    return FeaturedProduct;
  })();
  
    
  
  /*================ Templates ================*/
  /**
   * Customer Addresses Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Customer Addresses
   * template.
   *
   * @namespace customerAddresses
   */
  
  theme._initCustomerAddressCountryDropdown = function(){
    // Initialize each edit form's country/province selector
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });
  
    if($('#AddressCountryNew-modal').length) {
      new Shopify.CountryProvinceSelector('AddressCountryNew-modal', 'AddressProvinceNew-modal', {
        hideElement: 'AddressProvinceContainerNew-modal'
      });
    }
  
    $('.address-country-option').each(function() {
      var formId = $(this).data('form-id');
      var countrySelector = 'AddressCountry_' + formId;
      var provinceSelector = 'AddressProvince_' + formId;
      var containerSelector = 'AddressProvinceContainer_' + formId;
  
      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector
      });
    });
  };
  
  theme._setupCustomAddressModal = function(){
    var suffix = '-modal';
    $('.lightbox-content form, .lightbox-content input[id], .lightbox-content select[id], .lightbox-content div[id]').each(function(){
      $(this).attr('id', $(this).attr('id') + suffix);
    });
    $('.lightbox-content label[for]').each(function(){
      $(this).attr('for', $(this).attr('for') + suffix);
    });
    $('.lightbox-content .address-country-option').each(function(){
      var formId = $(this).data('form-id') + suffix;
      $(this).attr('data-form-id', formId).data('form-id', formId);
    });
    theme._initCustomerAddressCountryDropdown();
  };
  
  theme.customerAddresses = (function() {
    var $newAddressForm = $('#AddressNewForm');
  
    if (!$newAddressForm.length) {
      return;
    }
  
    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      theme._initCustomerAddressCountryDropdown();
    }
  
    // Toggle new/edit address forms
    $('.address-new-toggle').on('click', function() {
      $('#AddressNewForm').css('display','block');
    });
  
    $('.address-edit-toggle').on('click', function() {
      var formId = $(this).data('form-id');
      var html_edit = $('#EditAddress_' + formId).html();
      $(html_edit).appendTo( '#editaddress_index' );
      $('#editaddress_index').css('display', 'block');
    });
    $('.js-close-form-address').on('click', function() {
      $('#AddressNewForm').css('display','none');
    });
    
    $('.js-close-edit-address').on('click', function() {
      console.log("sbfkjsbfk");
      $('#editaddress_index').empty();
    });
    $('.address-delete').on('click', function() {
      var $el = $(this);
      var formId = $el.data('form-id');
      var confirmMessage = $el.data('confirm-message');
      if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
        Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
      }
    });
  
    // show lightbox if error inside
    if($('#AddressNewForm .errors').length) {
      $('.address-new-toggle').click();
    }
    if($('.grid .address-card .errors').length) {
      $('.grid .address-card .errors').first().closest('.address-card').find('.address-edit-toggle').click();
    }
  })();
  
  /**
   * Password Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Password template.
   *
   * @namespace password
   */
  
  theme.customerLogin = (function() {
    var selectors = {
      recoverPasswordForm: '#RecoverPassword',
      hideRecoverPasswordLink: '#HideRecoverPasswordLink'
    };
  
    $(document).on('click', selectors.recoverPasswordForm, onShowHidePasswordForm);
    $(document).on('click', selectors.hideRecoverPasswordLink, onShowHidePasswordForm);
  
  
    function onShowHidePasswordForm(evt) {
      evt.preventDefault();
      toggleRecoverPasswordForm($(this).closest('.container'));
    }
  
    /**
     *  Show/Hide recover password form
     */
    function toggleRecoverPasswordForm(container) {
      $('[id=RecoverPasswordForm]', container).toggleClass('hide');
      $('[id=CustomerLoginForm]', container).toggleClass('hide');
    }
  
    // if on login page, check for past form submission
    if ($(selectors.recoverPasswordForm).length) {
      checkUrlHash();
      resetPasswordSuccess();
  
      function checkUrlHash() {
        var hash = window.location.hash;
  
        // Allow deep linking to recover password form
        if (hash === '#recover') {
          toggleRecoverPasswordForm(null);
        }
      }
  
      /**
       *  Show reset password success message
       */
      function resetPasswordSuccess() {
        var $formState = $('.reset-password-success');
  
        // check if reset password form was successfully submited.
        if (!$formState.length) {
          return;
        }
  
        // show success message
        $('#ResetSuccess').removeClass('hide');
      }
    }
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
      $colDesc: $('.template-index .collection-grid-item__title-wrapper h3'),
      $colDesc2: $('.benefits .grid__item.one-third'),
      $colGrid: $('.col-grid-sidebar .collection-grid-item__title'),
      $prodGrid: $('.products .grid__item .col-product'),
      $landImages: $('.landing-images .collection-grid-item__title'),
      $blogTips: $('.blog-tips'),
  
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
  
  theme.openPageContentInLightbox = function(url) {
    $.get(url, function(data){
      var $content = $('#MainContent', $.parseHTML('<div>'+data+'</div>'));
      $.colorbox({
        transition: 'fade',
        html: '<div class="lightbox-content">' + $content.html() + '</div>',
        onComplete: function(){
          // check any new inputs
          $('#cboxContent .input-wrapper input').trigger('inputstateEmpty');
          $('#cboxContent input[data-desktop-autofocus]').focus();
        }
      });
    });
  };
  
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
  }
  
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
  
  /// Show a short-lived text popup above an element
  theme.showQuickPopup = function(message, $origin){
    var $popup = $('<div class="simple-popup"/>');
    var offs = $origin.offset();
    $popup.html(message).css({ left: offs.left, top: offs.top }).hide();
    $('body').append($popup);
    $popup.css({ marginTop: - $popup.outerHeight() - 10, marginLeft: -($popup.outerWidth()-$origin.outerWidth())/2});
    $popup.fadeIn(200).delay(3500).fadeOut(400, function(){
      $(this).remove();
    });
  }
  
  // Calculate accent colour height
  theme.resizeAccent = function(){
    var accentHeight = 0;
    var $firstSection = $('.accent-background').next();
  
    if($firstSection.length) {
      var $marginTop = parseInt($firstSection.css('margin-top'));
  
      if($firstSection.find('.sticky-element').length){
        accentHeight = Math.round(($firstSection.find('.sticky-element').outerHeight() / 2) + $marginTop);
      } else {
        accentHeight = Math.round(($firstSection.outerHeight() / 2) + $marginTop);
      }
      $('.accent-background').css('height', accentHeight);
    } else{
      accentHeight = '';
    }
    $('.accent-background').css('height', accentHeight);
  }
  
  // peeking carousels UI
  theme.peekCarousel = {
    init: function($container, $slideshows, globalNamespace, useCarouselCheckFn, removeClasses, slickConfig) {
      theme.peekCarousel._checkAdvice($container);
  
      var data = {
        $slideshows: $slideshows,
        useCarouselCheckFn: useCarouselCheckFn,
        removeClasses: removeClasses,
        slickConfig: typeof(slickConfig) == 'object' ? slickConfig : {
          infinite: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          swipeToSlide: true,
          dots: false,
          arrows: false
        }
      };
  
      theme.peekCarousel._assess.bind(data)();
      $(window).on('debouncedresize' + globalNamespace, theme.peekCarousel._assess.bind(data));
  
      $('.product-carousel-peek__advice', $container).on('click', function(){
        $(this).closest('.product-carousel-peek').find('.slick-initialized').slick('slickNext').trigger('dismissAdvice');
      });
    },
  
    destroy: function($container, $slideshows, globalNamespace) {
      if($slideshows.hasClass('slick-initialized')){
        $slideshows.slick('unslick').off('swipe dismissAdvice');
      }
      $(window).off('debouncedresize' + globalNamespace, theme.peekCarousel._assess);
      $('.product-carousel-peek__advice', $container).off('click');
    },
  
    _assess: function(){
      for(var i=0; i<this.$slideshows.length; i++) {
        var $slideshow = $(this.$slideshows[i]);
  
        if(this.useCarouselCheckFn()) {
          if(!$slideshow.hasClass('slick-initialized')){
            // stow away the original classes
            if(this.removeClasses) {
              $slideshow.children().each(function(){
                $(this).data('peekOriginalClassName', this.className);
                this.className = '';
              });
            }
  
            // note when singular or empty
            if($slideshow.children().length == 0) {
              $slideshow.closest('.product-carousel-peek').addClass('product-carousel-peek--empty');
            }
            if($slideshow.children().length == 1) {
              $slideshow.closest('.product-carousel-peek').addClass('product-carousel-peek--single');
            }
  
            // turn into slideshow
            $slideshow.slick(this.slickConfig).on('swipe dismissAdvice', theme.peekCarousel._dismissAdviceOnSlickSwipe);
          }
        } else {
          if($slideshow.hasClass('slick-initialized')){
            // destroy slideshow
            $slideshow.slick('unslick').off('swipe dismissAdvice');
  
            // restore original class names
            if(this.removeClasses) {
              $slideshow.children().each(function(){
                this.className = $(this).data('peekOriginalClassName');
              });
            }
          };
        }
      }
    },
  
    _checkAdvice: function(container) {
      if($.cookie('theme.boost.dismissPeekAdvice') != '1') {
        $('.product-carousel-peek', container).addClass('product-carousel-peek--show-advice');
      }
    },
  
    _dismissAdvice: function() {
      $.cookie('theme.boost.dismissPeekAdvice', '1', { expires: 7, path: '/', domain: window.location.hostname });
      $('.product-carousel-peek').addClass('product-carousel-peek--dismiss-advice');
    },
  
    _dismissAdviceOnSlickSwipe: function(evt, slick) {
      theme.peekCarousel._dismissAdvice();
      $(this).off('swipe');
    }
  };
  
  $(document).ready(function() {
    var sections = new slate.Sections();
    sections.register('header', theme.Header);
    sections.register('footer', theme.Footer);
    sections.register('product', theme.Product);
    sections.register('blog', theme.Blog);
    sections.register('article', theme.Article);
    sections.register('slideshow', theme.Slideshow);
    sections.register('richStatement', theme.Richstatement);
    sections.register('testimonials', theme.Testimonials);
    sections.register('standout-collection', theme.StandoutCollection);
    sections.register('get-the-look', theme.GetTheLook);
    sections.register('promotional-images', theme.PromotionalImages);
    sections.register('featured-collection', theme.FeaturedCollection);
    sections.register('list-collections', theme.ListCollections);
    sections.register('video', theme.Video);
    sections.register('collection-template', theme.CollectionTemplate);
    sections.register('map', theme.Map);
    sections.register('instagram', theme.Instagram);
    sections.register('cart', theme.Cart);
    sections.register('page-story-template', theme.PageStoryTemplate);
    sections.register('image-with-text', theme.ImageWithText);
    sections.register('featured-product', theme.FeaturedProduct);
  
    //drawer 
     
        theme.RightDrawer = new theme.Drawers('CartDrawer', 'right', {
          'onDrawerOpen': ajaxCart.load
        });
  
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
  
    // Target iframes to make them responsive
    var iframeSelectors =
      '.rte iframe[src*="youtube.com/embed"],' +
      '.rte iframe[src*="player.vimeo"]';
  
    slate.rte.wrapIframe({
      $iframes: $(iframeSelectors),
      iframeWrapperClass: 'rte__video-wrapper'
    });
  
    // Apply a specific class to the html element for browser support of cookies.
    if (slate.cart.cookiesEnabled()) {
      document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
    }
  
    // Input state: empty
    $(document).on('change focusout inputstateEmpty', '.input-wrapper input, .input-wrapper textarea', function() {
      $(this).closest('.input-wrapper').toggleClass('is-empty', $(this).val().length == 0);
    });
  
    // Input state: focus
    $(document).on('focusin focusout', '.input-wrapper input, .input-wrapper textarea', function(evt) {
      $(this).closest('.input-wrapper').toggleClass('in-focus', evt.type == 'focusin');
    });
  
    // Input state: check on section load
    $(document).on('shopify:section:load', function(){
      $('.input-wrapper input, .input-wrapper textarea').trigger('inputstateEmpty');
    });
  
    // Input state: html5 autofocus - focussed before dom ready
    $('.input-wrapper input:focus, .input-wrapper textarea:focus').closest('.input-wrapper').addClass('in-focus');
  
    // Input state: check empty now
    $('.input-wrapper input, .input-wrapper textarea').trigger('inputstateEmpty');
  
    $('.input-wrapper input, .input-wrapper textarea').on('animationstart', function(e){
      if(e.originalEvent.animationName == 'onAutoFillStart') {
        $(this).closest('.input-wrapper').removeClass('is-empty');
      } else if(e.originalEvent.animationName == 'onAutoFillCancel') {
        $(this).trigger('inputstateEmpty');
      }
    });
  
    // focus on some inputs on page load, on desktop
    if($(window).width() > 1024) {
      $('input[data-desktop-autofocus]').focus();
    }
  
    // Transition scroll to in-page links (listener must be set before any other link-clicking events)
    $(document).on('click', 'a[href^="#"]:not([href="#"])', function(){
      var $target = $($(this).attr('href')).first();
      if($target.length == 1) {
        $('html:not(:animated),body:not(:animated)').animate({
          scrollTop: $target.offset().top
        }, 600);
      }
      return false;
    });
  
    // Tabs
    $(document).on('click assess', '.tabs a', function(evt){
      // active class
      $(this).addClass('tab--active').closest('ul').find('.tab--active').not(this).removeClass('tab--active');
      // hide inactive content
      $(this).closest('li').siblings().find('a').each(function(){
        $($(this).attr('href')).removeClass('tab-content--active');
      });
      // show active content
      $($(this).attr('href')).addClass('tab-content--active');
      evt.preventDefault();
    });
  
    $(document).on('ready shopify:section:load', function(){
      $('.tabs:not(:has(.tab--active)) a:first').trigger('assess');
    });
  
    /// Quickbuy with colorbox and slick
    var activeQuickBuyRequest = null;
    var breakpoint = 768;
  
    $(document).on('click', '.js-contains-quickbuy .js-quickbuy-button', function(e){
      if($(window).width() > breakpoint) {
  
        if (activeQuickBuyRequest) {
          return false;
        }
  
        var $prod = $(this).closest('.js-contains-quickbuy');
        var placeholder = $prod.find('.quickbuy-placeholder-template').html();
        var $template = $('<div class="quickbuy">'+placeholder+'</div>');
  
        // observer for dynamic payment buttons
        var buttonObserved = false;
        var buttonObserver = new MutationObserver(function(mutations){
          $.colorbox.resize();
        });
  
        $.colorbox({
          closeButton: false,
          preloading: false,
          open: true,
          speed: 200,
          slideshow: true,
          //transition: "none",
          html: [$template.wrap('<div>').parent().html()].join(''),
          onComplete: function(){
            $('.quickbuy__product-images').slick({
              infinite: false,
              slidesToScroll: 1,
              speed: 300,
              slidesToShow: 1,
              swipeToSlide: true,
              variableWidth: true,
              prevArrow: $('.quickbuy__slider-controls .prev'),
              nextArrow: $('.quickbuy__slider-controls .next')
            })
            $.colorbox.resize();
  
            // initialise variants
            var $container = $('.quickbuy-form');
            var productData = JSON.parse($('[data-product-json]', $prod).html());
            var options = {
              $container: $container,
              enableHistoryState: false,
              singleOptionSelector: '[data-single-option-selector]',
              originalSelectorId: '[data-product-select]',
              product: productData, // for slate
              productSingleObject: productData // for our callbacks
            };
            var variants = new slate.Variants(options);
            $container.on('variantChange', theme.variants.updateAddToCartState.bind(options));
            $container.on('variantPriceChange', theme.variants.updateProductPrices.bind(options));
            if($('.quickbuy__product-images .image', $container).length > 1) {
              $container.on('variantImageChange', function(evt){
                var variant = evt.variant;
                var matchSrc = variant.featured_image.src.split('?')[0].replace('https:', '');
                var $found = $('.quickbuy__product-images .slick-slide:not(.slick-cloned) .image[data-original-src^="' + matchSrc + '"]', $container);
                if($found.length) {
                  var slickIndex = $found.closest('.slick-slide').data('slick-index');
                  $found.closest('.slick-slider').slick('slickGoTo', slickIndex);
                }
              });
            }
            // resize lightbox after callbacks may have altered the page
            $container.on('variantChange', $.colorbox.resize);
  
            // style dropdowns
            theme.styleVariantSelectors($('.quickbuy .selector-wrapper select'), options.product, true);
  
            // load extra payment buttons
            if (Shopify.PaymentButton) {
              $(document).on('shopify:payment_button:loaded.themeQuickBuy', function(){
                $(document).off('shopify:payment_button:loaded.themeQuickBuy');
                $.colorbox.resize();
  
                // attach a MutationObserver
                buttonObserved = $('.quickbuy-form .shopify-payment-button')[0];
                if(buttonObserved) {
                  buttonObserver.observe(buttonObserved, { attributes: true, childList: true, subtree: true });
                }
              });
              Shopify.PaymentButton.init();
            }
  
            // currency converter
            theme.checkCurrency();
  
            // add to recent products
            theme.addToAndReturnRecentProducts(
              productData.handle,
              productData.title,
              productData.available,
              productData.images[0],
              productData.images.length > 1 ? productData.images[1] : null,
              productData.price,
              productData.price_varies,
              productData.compare_at_price
            );
          },
          onCleanup: function(){
            $('.quickbuy-form').off('variantChange variantPriceChange variantImageChange');
            buttonObserver.disconnect();
          }
        });
  
        // e.stopImmediatePropagation();
        return false;
      }
    });
  
    $(document).on('click', '#colorbox .quickbuy__close .js-close-quickbuy', function(){
      $.colorbox.close();
      return false;
    });
  
    // general purpose 'close a lightbox' link
    $(document).on('click', '.js-close-lightbox', function(){
      $.colorbox.close();
      return false;
    });
  
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
  
    // newsletter success message shows in lightbox
    var $newsletterSuccess = $('.subscribe-form__response--success');
    if($newsletterSuccess.length) {
      $.colorbox({
        transition: 'fade',
        html: '<div class="subscribe-form-lightbox-response">' + $newsletterSuccess.html() + '</div>',
        onOpen: function(){
          $('#colorbox').css('opacity', 0);
        },
        onComplete: function(){
          $('#colorbox').animate({ 'opacity': 1 }, 350);
        }
      });
    }
  
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
  
    $('.punch-card5').click(function() {  
      $('.punch-card5-popup').show();
        $('.popup-overlay').show();
  }); 
  $('.punch-card5-popup .close').click(function() {  
      $('.punch-card5-popup').hide();
        $('.popup-overlay').hide();
  });   
  
  
  //about-us script
    function animatebars() {
      jQuery('.pricebar').each(function(){
        jQuery(this).find('.pricebar-bar').animate({
          width:0
        },1);       
        jQuery(this).find('.pricebar-bar').animate({
          width:jQuery(this).attr('data-percent')
        },1000);
      });
    };
  
    function counter() {
      $('.counter').text(0);
      $('.counter').each(function() {
      var $this = $(this),
      countTo = $this.attr('data-count');
      $({ countNum: $this.text()}).animate({
        countNum: countTo
      },{
          duration: 1000,
          easing:'linear', 
          step: function() {
            $this.text(Math.floor(this.countNum));
          },
          complete: function() {
            $this.text(this.countNum);
            //alert('finished');
          }
  
        });
      });    
    }; 
  
    animatebars();
    counter();
  $('ul.products-tabs-down-about a').click(function(e){
    e.preventDefault();
    var tab_id = $(this).attr('data-tab');
  
    $('ul.products-tabs-down-about a').removeClass('active-about');
    $('.about-e').removeClass('current-about');
  
    $(this).addClass('active-about');
    $("#"+tab_id).addClass('current-about');
    animatebars();
    counter();
  });
  if($(window).width() < 968) {
    $(window).trigger('resize');
    $('.about-building-products').slick({
      adaptiveHeight: true,
      arrows: false,
      dots: true,
      autoplay : true,
      autoplaySpeed : 4000
    })
  }else {
    $('.about-building-products').slick('unslick');
  }
  //navigation about 
  $(window).on('debouncedresize', function(){
    $(window).trigger('resize');
    if($(window).width() < 968) {
      $('.about-building-products').slick({
        adaptiveHeight: true,
        arrows: false,
        dots: true,
        autoplay : true,
        autoplaySpeed : 4000
      })
    }else {
      $('.about-building-products').slick('unslick');
    }
  });
  
  
  $('.js-anchor-link').click(function(e){
    e.preventDefault();
    var target = $($(this).attr('href'));
    if(target.length){
      var scrollTo = target.offset().top - 30;
      $('body, html').animate({scrollTop: scrollTo+'px'}, 500);
    }
  });
  
    $('.video-overlat-start').click(function(e) {
        var v_src = $(this).attr("data-src");
        document.getElementById('youtube').src = 'https://www.youtube.com/embed/'+v_src+'?showinfo=0&autoplay=1'; // adding autoplay to the URL
        document.getElementById('video').style.display = 'block';
        
    })
    // Hiding the lightbox and removing YouTube autoplay
    $('.close_video').click(function(e) {
      document.getElementById('youtube').src = '';
      document.getElementById('video').style.display = 'none';
    })
  
  
  //career
  $('.employee-slider').slick({
    dots:true,
    arrows:false,
    });
    $('.gallery-slider').slick();
  
  //account 
  $(".drop-down-ul").on("click", ".init", function() {
    $(this).closest(".drop-down-ul").children('.drop-down-li:not(.init)').toggle();
    $(this).find("i").toggleClass("fa-angle-down fa-angle-up");
  });
  
  var allOptions = $(".drop-down-ul").children('li:not(.init)');
  $(".drop-down-ul").on("click", ".drop-down-li:not(.init)", function() {
    allOptions.removeClass('selected');
    $(this).addClass('selected');
    $(".drop-down-ul").children('.init').html($(this).html());
    allOptions.toggle();
  });  
  
  
  //collection-landing
  
  $('.js-featured-collection-landing-slider').slick({
    dots: false,
    infinite: true,
    speed: 300,
    adaptiveHeight: true,
    arrows:true,  
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false
        }
      }
    ]
  });
  
  jQuery(function($) {
    ajaxCart.init({
      formSelector: '#AddToCartForm',
      cartContainer: '#CartContainer',
      addToCartSelector: '.AddToCart',
      cartCountSelector: '#CartCount',
      cartCostSelector: '#CartCost'
    });
  });
  jQuery(document.body).on('afterCartLoad.ajaxCart', function(evt, cart) {
    // Bind to 'afterCartLoad.ajaxCart' to run any javascript after the cart has loaded in the DOM
    theme.RightDrawer.open();
  });
  

  $('.col-slider').slick({
    dots: false,
    infinite: true,
    speed: 300,
    adaptiveHeight: true,
    arrows:true,  
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  });

  $('.slick-shop_best_seller').slick({
		infinite: true,
		slidesToShow: 5,
    slidesToScroll: 3,
    arrows: false,
    dots: true,
    responsive: [
      {
        breakpoint: 968,
        settings: {
          arrows: false,
          dots: true,
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  });
    
  if($(window).width() < 968) {
    $('.three_image').slick({
      infinite: true,
      slidesToShow: 2,
      slidesToScroll: 1,
      arrows: false,
      dots: true
    });
    $('.three_image_trending').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true
    });
    $('.three_image_review').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true
    });
    $('.review_card').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true
    });
    $('.thanks_giving').slick({
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true
    });
    $('.slick_slider_about').slick({
      slidesToScroll: 1,
      slidesToScroll: 1,
      infinite: false,
      arrows: false,
      dots: true
    });
    
  }else {
  }

 $('.slick_the_review').slick({
    slidesToScroll: 1,
    slidesToScroll: 1,
    infinite: true,
    arrows: false,
    dots: true
  });
  }); // end of main $(document).ready()
  
  })(theme.jQuery);