(function(){
  var _products = {};
  if(!window.SwymCallbacks){
    window.SwymCallbacks = window.SwymCallbacks || [];
  }
  window.SwymCallbacks.push(function(){
    _swat.fetchWrtEventType(function(products){
      // console.log(products);
      renderProducts(products);
    }, _swat.EventTypes.addToWishlist);});


  function renderProducts(products){ 
 
    var counter = products.length;
     if(counter == 0){
       $(".counter-zero").hide();  
       $(".counter-zero-block").show();  
     }else{
       $(".counter-zero").show(); 
       $(".counter-zero-block").hide();  
     }
    rerenderProduct(products);
    getAllCollection();
    $("#collection_list").on("click", "div.click_collection", function(){
      var name = $(this).text();
      $(".title_wish").text(name);
      
      collectionCode(products,name);
    });
    
    $("#collection_ul").on("click", "li.drop-down-li", function(){
      var name = $(this).text();
      $(".title_wish").text(name);
      collectionCode(products,name);
    });
    
   $(document).on('click', '.custom-wishlist-delete', function(e){
     var productEventId = $(this).data()["productEventid"];
      _swat.deleteEvent(function callback() {
        // Successfully deleted, re-render page
         $(e.currentTarget).closest(".grid__item").remove();
       }, productEventId);

    });
    
    
    
    $(document).on('click', '.custom-wishlist-add-to-cart', function(){
      var productId = $(this).data()["productId"];
      var productData = _products[productId];
      
      // Wishlist Product Added to Cart
      appboy.logCustomEvent("Wishlist Product Added to Cart", {
        wishlist_name: "My Wishlist",
        cart_id: localStorage.getItem("cart_id"),
        product_id: $(this).attr("data-product-id"),
        // sku: $(this).attr("data-product-sku"),
        // category: $(this).attr("data-product-type"),
        // name: $(this).attr("data-product-name"),
        // brand: $(this).attr("data-product-brand"),
        // variant: $(this).attr("data-product-variant"),
        // price: $(this).attr("data-product-price"),
        // quantity: "1",
        // url: $(this).attr("data-product-url"),
        // image_url: $(this).attr("data-product-image")
        
      });

      _swat.replayAddToCart(productData, productData.epi, function() {
        // Successfully added, open cart
        _swat.openCartPage();
      });

    });
    
    $("#delete_listcollection").click(function(e){
      e.preventDefault();    
      var dele = $(".title_wish").text();
      
     _swat.removeWishlistCollection( dele,  function(msg){
       // re-render the page
//        rerenderProduct(products);
//        $(".title_wish").text("Favorites");
//        $("#collection_list:contains(dele)").remove();
        location.reload(true);
     	console.log("remove sucess",msg);
     }, function(err){ 
     	console.log(err);
     })
    });
    $(".form_button").click(function(e){
     	var re = new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$');
      	var first_email = document.getElementById('first').value;
        var second_email = document.getElementById('second').value;
        var third_text = document.getElementById('third').value;
       
      if(re.test(first_email)){
        	$(".form_input").css("border-color", "#cccccc");
        if(re.test(second_email)){
          $(".form_inputt").css("border-color", "#cccccc");
        	_swat.sendEmailWishList(function(r) {
              $(".success").css("display", "block");
            }, second_email, first_email, third_text);
        }else{
        	$(".form_inputt").css("border-color", "#d42020");
        }
      }else{
      	$(".form_input").css("border-color", "#d42020");
      }
             	
      });  
  }

  function getAllCollection(){
  	 _swat.getAllCollections(function(collections){
       for(var value in collections){
        $('#collection_list').append('<div class="click_collection" id="clickcoll" style="padding-bottom: 5px;cursor: pointer;">'+
         value+'</div>');
         $('#collection_ul').append('<li class="drop-down-li" style="border-top: 1px solid #cccccc;">'+
         value+'</li>');

        }
     });
  }
  
  
  function collectionCode(products, name){
    var hitar = [] ;
    if(name == "Favorites"){
      $(".delete-collection").css("display", "none");
      rerenderProduct(products);
    }else{
      $(".delete-collection").css("display", "inline-block");
      for (let i=0; i <products.length ; i++){
        if(products[i].hasOwnProperty('hashtags')){
          var newar = products[i].hashtags;
          for (let j = 0 ; j<newar.length ; j++){
            if (newar[j] === name){
              hitar.push(products[i]);
            }
          }
        }
      }
      console.log(hitar);
     rerenderProduct(hitar);
    }
  }
  
  function rerenderProduct(data){
    var productsHtml = data.map(function(product){
      _products[product.epi] = product;
       return renderProduct( product);
     });
     console.log(productsHtml);
     let productsHtmlDiv = "";
     productsHtml.map(markup=>{
         productsHtmlDiv += markup;
     })
     productsHtmlDiv = "<div>" + productsHtmlDiv + "</div>"
     $("#wishlist-product-list").html(productsHtmlDiv);
  }
  

  function renderProduct(product){
    
    // Using Mustache with different tags
    Mustache.tags = ["<%","%>"];
    var tmpl = loadTemplate("product-item-tmpl");
    var r = Mustache.render(tmpl, transformProduct(product));
    Mustache.tags = ["{{","}}"];
    return r;
  }
  function transformProduct(product){
    // To use Shopify's default formatter - 
    // But warning - Some themes throw an unknown format exception, 
    // build custom formatter in that case
    // if(Shopify.formatMoney && Shopify.money_format){
    //   product["pr"] = Shopify.formatMoney(product["pr"].toFixed(2));
    //    if(product["op"]){
    //      product["op"] = Shopify.formatMoney(product["op"].toFixed(2));
    //    }
    // }
    product["pr"] = product["pr"];
    if(product["op"]){
      product["op"] = product["op"];
    }
    product.currency = _swat.currency; // use currency in case you want to render in the template
    return product;
  }

  function loadTemplate(templateId) {

    var template =  document.getElementById(templateId);
    if(!template) {
      SwymUtils.warn('Error cannot find the template #' + templateId);
      return false;
    }

    var templateHtml = template.innerHTML.trim();
    Mustache.parse(templateHtml);
    return templateHtml;    
  }
})();

