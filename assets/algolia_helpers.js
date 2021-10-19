/* See https://www.algolia.com/doc/integration/shopify/advanced-customization/customizing-instant-search/#hogan */

(async function(algolia) {
  'use strict';
  var Hogan = algolia.externals.Hogan;
  var counter = 1;
  var formatPrice = function formatPrice(value) {
    return algolia.formatMoney(Number(value) * 100);
  };

  function formattedPriceWithComparison(price, compare_at_price, price_ratio) {
    var comparing =
      Number(compare_at_price) && Number(compare_at_price) > Number(price);
    var discount_ratio = 1.0 - price_ratio;
    var res = '<b>' + formatPrice(price) + '</b>';

    return res;
  }

  var escapeHtml = function escapeHtml(unsafe) {
    return (unsafe || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  algolia.helpers = {
    formatNumber: function formatNumber(text, render) {
      return Number(render(text)).toLocaleString();
    },
    formattedPrice: function formattedPrice(text, render) {
      return formatPrice(render(text));
    },
    formattedPriceWithoutDecimals: function formattedPriceWithoutDecimals(
      text,
      render
    ) {
      return formatPrice(render(text)).replace(/\.\d+$/, '');
    },
    autocompletePrice: function autocompletePrice() {
      if (this._distinct) {
        var min = this.variants_min_price;
        var max = this.variants_max_price;
        if (min !== max) {
          return '<b>' + formatPrice(min) + ' - ' + formatPrice(max) + '</b>';
        }
      }
      return formattedPriceWithComparison(this.price, null);
    },
    instantsearchPrice: function instantsearchPrice() {
      if (this._distinct) {
        var min = this.variants_min_price;
        var max = this.variants_max_price;
        if (min !== max) {
          return '<b>' + formatPrice(min) + '</b>';
        }
      }
      return formattedPriceWithComparison(
        this.price,
        this.compare_at_price,
        this.price_ratio
      );
    },
    instantsearchLink: function instantsearchLink() {
      var addVariantId = !this._distinct && this.objectID !== this.id;
      return (
        '/products/' +
        this.handle +
        (addVariantId ? '?variant=' + this.objectID : '')
      );
    },
    fullTitle: function fullTitle() {

      var res = this.title;
      if (
        !this._distinct &&
        this.variant_title &&
        this.variant_title !== 'Default Title' &&
        this.variant_title !== 'Default'
      ) {
        res += ' (' + this.variant_title + ')';
      }

      return escapeHtml(res);
    },
    fullHTMLTitle: function fullHTMLTitle() {
      
      var res = '';
      if (this._highlightResult.title && this._highlightResult.title.value) {
        res = algolia.helpers.fullEscapedAttribute(
          this._highlightResult.title.value
        );
      }
      if (
        !this._distinct &&
        this.variant_title &&
        this.variant_title !== 'Default Title' &&
        this.variant_title !== 'Default'
      ) {
        res += ' <span class="algolia-variant">(' + res + ')</span>';
      }
      return res;
    },

    fullSwatchProduct: function fullSwatchProduct(){
      var res=''
      if(this.meta.global && this.meta.global.BCP_SWATCHES && this.option_names[0] === "color") {
        var splits = this.meta.global.BCP_SWATCHES.split(',');
        if(splits.length > 1){
          if(splits.length > 4){
            for (let i=0; i<4; i++){
              var color = splits[i].split(':');
              if(color[1] === 'N/A'){
                if(color[0] === this.sku){
                  res += `<span class="collection_swatch_algolia selectedswatches" style="background-color:${this.options.color}" data-color-sky="${color[0]}"></span>`
                }else {
                  res += `<span class="collection_swatch_algolia" style="background-color:${this.options.color}" data-color-sky="${color[0]}"></span>`
                }
              }else {
                if(color[0] === this.sku){
                  res += `<span class="collection_swatch_algolia selectedswatches" style="background-color:${color[1]}" data-color-sky="${color[0]}"></span>`
                }else {
                  res += `<span class="collection_swatch_algolia" style="background-color:${color[1]}" data-color-sky="${color[0]}"></span>`
                }
              }
            }
            if(window.innerWidth < 450){
              res += `<a href="https://bestchoiceproducts.com/products/${this.handle}" class="ai-swatch_text">+${splits.length - 4}</a>`
            }else {
              res += `<a href="https://bestchoiceproducts.com/products/${this.handle}" class="ai-swatch_text">+${splits.length - 4} More Colors</a>`
            }
          }else{
            for (let i=0; i<splits.length; i++){
              var color = splits[i].split(':');
              if(color[1] === 'N/A'){
                if(color[0] === this.sku){
                  res += `<span class="collection_swatch_algolia selectedswatches" style="background-color:${this.options.color}" data-color-sky="${color[0]}"></span>`
                }else {
                  res += `<span class="collection_swatch_algolia" style="background-color:${this.options.color}" data-color-sky="${color[0]}"></span>`
                }
              }else {
                if(color[0] === this.sku){
                  res += `<span class="collection_swatch_algolia selectedswatches" style="background-color:${color[1]}" data-color-sky="${color[0]}"></span>`
                }else {
                  res += `<span class="collection_swatch_algolia" style="background-color:${color[1]}" data-color-sky="${color[0]}"></span>`
                }
              }
            }
          }
        }
      }
      return res
    },

    fullCardBadge: function fullCardBadge(){
      var res= '';
      //console.log("this", this);
      if(this.meta.global.ALGOLIA_OOO === "true"){
        res = `<span class="ais-badge ais-soldout-badge" aria-hidden="true">SOLD OUT</span>`;
      }else {
        if(this.meta.global.ALGOLIA_NEW === "true"){
          res = `<span class="ais-badge ais-new-badge" aria-hidden="true">NEW</span>`;
        }
      }
      return res
    },

    fullStarReview: function fullStarReview(){
      var res = '';
      var star = 'yotpo-icon-star';
      var halfStar = 'yotpo-icon-half-star';
      var emptyStar = 'yotpo-icon-empty-star';
      if(this.meta.yotpo && this.meta.yotpo.reviews_average) {
        var rating = this.meta.yotpo.reviews_average;
        var fullStars = Math.floor(rating / 1);
        for (var i = 0; i < fullStars; i++) {
          res += ' <span class="yotpo-icon rating-star pull-left '+ star +'"></span>';
        }
        if (rating - fullStars >= .75) {
          res += ' <span class="yotpo-icon rating-star pull-left '+ star +'"></span>';
        } else if (rating - fullStars >= .3) {
          res += ' <span class="yotpo-icon rating-star pull-left '+ halfStar +'"></span>';
        }
  
        for (var i = res.length; i < 5; i++) {
          res += ' <span class="yotpo-icon rating-star pull-left '+ emptyStar +'"></span>';
        }
      }else {
        for (var i = res.length; i < 5; i++) {
          res += ' <span class="yotpo-icon rating-star pull-left '+ emptyStar +'"></span>';
        }
      }
      return res;
    },

    fulltwoOnedayShipping: async function fulltwoOnedayShipping(){
      var res = '', sky = this.sku;
      res = algolia.helpers.getTwoDayShipping(this, sky);
      return res
    },


    getTwoDayShipping(a, b){
      if(a.named_tags && a.named_tags.bcp2day_eligible){
        
        var eligible = algolia.helpers.getEligible(a);
        
        var filterdqty = algolia.helpers.getQty(a,b);
        if(eligible === true || eligible === "true"){
          return algolia.helpers.getActualresult(filterdqty);
        }else{
          return ''
        }
      }else {
        return ''
      }

    },
    setCookie(e,t){var n=new Date;n.setTime(n.getTime()+144e5);var o="expires="+n.toUTCString();document.cookie=e+"="+t+";"+o+";path=/"},
    getCookie(e){for(var t=e+"=",n=decodeURIComponent(document.cookie).split(";"),o=0;o<n.length;o++){for(var i=n[o];" "==i.charAt(0);)i=i.substring(1);if(0==i.indexOf(t))return i.substring(t.length,i.length)}return""},
    fetchQuote() {
      function callback(json){
        return json.state;
      }
      const result = $.ajax({
        url: "https://geoip-db.com/jsonp",
        jsonpCallback: "callback",
        dataType: "jsonp",
      })
      return result.state;
    },

    variant_c(){
      
    },

    getActualresult(a){   
      
      var state_name = algolia.helpers.getCookie("two_day_state");
      if(state_name == 'null' || state_name == "" || state_name == 'undefined' || state_name == null || state_name == undefined ){
        state_name = algolia.helpers.fetchQuote();
        console.log("sta", state_name);
        algolia.helpers.setCookie("two_day_state", state_name);
        algolia.helpers.variant_c();
      }else {
        algolia.helpers.variant_c();
      }
    },

    getQty(a,b){
      if(typeof a.named_tags[b] === "string"){
        return a.named_tags[b]
      }else {
        var n = a.named_tags[b];
        return n[0]
      }
    },

    getEligible(a){
      
      if(typeof a.named_tags.bcp2day_eligible === "string"){
         return a.named_tags.bcp2day_eligible
      }else{
        return a.named_tags.bcp2day_eligible[0]
      }
    },


    fullEscapedAttribute(attribute) {
      return new DOMParser().parseFromString(attribute, 'text/html')
        .documentElement.textContent;
    },
    fullEscapedHTMLTitle: function fullEscapedHTMLTitle() {
      var res = '';

      if (this.title) {
        res = algolia.helpers.fullEscapedAttribute(
          this.title
        );
      }

      if (
        !this._distinct &&
        this.variant_title &&
        this.variant_title !== 'Default Title' &&
        this.variant_title !== 'Default'
      ) {
        res += ' <span class="algolia-variant">(' + res + ')</span>';
      }
      return res;
    },
    fullEscapedHTMLProductType: function fullEscapedHTMLProductType() {
      if (
        this._highlightResult.product_type &&
        this._highlightResult.product_type.value
      ) {
        return algolia.helpers.fullEscapedAttribute(
          this._highlightResult.product_type.value
        );
      } else {
        return '';
      }
    },
    fullEscapedHTMLVendor: function fullEscapedHTMLVendor() {
      if (this._highlightResult.vendor && this._highlightResult.vendor.value) {
        return algolia.helpers.fullEscapedAttribute(
          this._highlightResult.vendor.value
        );
      } else {
        return '';
      }
    },
    floor: function floor(text, render) {
      return '' + Math.floor(Number(render(text)));
    },
    ceil: function ceil(text, render) {
      return '' + Math.ceil(Number(render(text)));
    },
    sizedImage: function sizedImage(text, render) {
      
      var image = this._distinct ? this.product_image : this.image;
      if (!image) {
        return 'http://cdn.shopify.com/s/images/admin/no-image-compact.gif';
      }
      var size = render(text).replace(/^\s+|\s+$/g, ''); // Render and trim
      if (size === 'original') {
        return image;
      }
      return image.replace(/\/(.*)\.(\w{2,4})/g, '/$1_' + size + '.$2');
    },
  };

  [
    'pico',
    'icon',
    'thumb',
    'small',
    'compact',
    'medium',
    'large',
    'grande',
    'original',
  ].forEach(async function(size) {
    algolia.helpers[size + 'Image'] = (function(_size) {
      return function() {
        var image = this._distinct ? this.product_image : this.image;
       

        if (_size === 'original') {
          return image;
        }
        if(!this.meta || !this.meta.global.VARIANT_IMAGE_URLS){
          return `http://cdn.shopify.com/s/images/admin/no-image-compact.gif`
        }else {
          var new_image = (this.meta.global.VARIANT_IMAGE_URLS).split(','), push_arr =[],sku = this.sku;
          (new_image).forEach(function(img, index){
            if( ((img).indexOf(`${sku}LRG-1`) !== -1) || ((img).indexOf(`${sku}LRG-2`) !== -1) || ((img).indexOf(`${sku}LRG-3`) !== -1) || ((img).indexOf(`${sku}lrg-1`) !== -1) || ((img).indexOf(`${sku}lrg-2`) !== -1) || ((img).indexOf(`${sku}lrg-3`) !== -1)){
              push_arr.push(img);
            }
          });
          if(push_arr.length > 0){
            return push_arr[0].replace(/\/(.*)\.(\w{2,4})/g, '/$1_' + _size + '.$2');
          }else {
             if (!image) {
         	 return 'http://cdn.shopify.com/s/images/admin/no-image-compact.gif';
             }else {
	             return image.replace(/\/(.*)\.(\w{2,4})/g, '/$1_' + _size + '.$2');
             }
          }
        }
      };
    })(size); // We need to create a new scope so that the internal size has the good value.
  });
  
  [
    'pico',
    'icon',
    'thumb',
    'small',
    'compact',
    'medium',
    'large',
    'grande',
    'original',
  ].forEach(async function(size) {
    algolia.helpers[size + 'hoverImage'] = (function(_size) {
      return function() {
        var image = this._distinct ? this.product_image : this.image;
        if (!image) {
          return 'http://cdn.shopify.com/s/images/admin/no-image-compact.gif';
        }

        if (_size === 'original') {
          return image;
        }
        if(!this.meta || !this.meta.global.VARIANT_IMAGE_URLS){
          return `http://cdn.shopify.com/s/images/admin/no-image-compact.gif`
        }else {
          var new_image = (this.meta.global.VARIANT_IMAGE_URLS).split(','), push_arr =[],sku = this.sku;
          (new_image).forEach(function(img, index){
            if( (img).indexOf(`${sku}LRG-2`) !== -1 || (img).indexOf(`${sku}LRG-3`) !== -1 || (img).indexOf(`${sku}lrg-2`) !== -1 || (img).indexOf(`${sku}lrg-3`) !== -1){
              push_arr.push(img);
            }
          });
          if(push_arr.length > 0){
            return push_arr[0].replace(/\/(.*)\.(\w{2,4})/g, '/$1_' + _size + '.$2');
          }else {
            return `http://cdn.shopify.com/s/images/admin/no-image-compact.gif`
          }
        }
      };
    })(size); // We need to create a new scope so that the internal size has the good value.
  });

  /* Create an Hogan lambda, which doesn't respect the mustache doc */
  var helpers = algolia.assign(
    {},
    algolia.helpers,
    algolia.translation_helpers
  );
  var helpersNames = Object.keys(helpers);
  var i = helpersNames.length;
  var helpersArray = new Array(i);
  while (i--) helpersArray[i] = [helpersNames[i], helpers[helpersNames[i]]];

  algolia.hoganHelpers = helpersArray.reduce(function(res, options) {
    var name = options[0];
    var helper = options[1];

    var newRes = algolia.assign({}, res);

    newRes[name] = function() {
      return function(text) {
        var render = function(value) {
          return Hogan.compile(value, algolia.hoganOptions).render(this);
        }.bind(this);

        return helper.call(this, text, render);
      }.bind(this);
    };

    return newRes;
  }, {});
})(window.algoliaShopify);