//TODO Temporary fix to get images to show 
window.SwymCallbacks = window.SwymCallbacks || [];
window.SwymCallbacks.push(function(swat) {
  swat.evtLayer.addEventListener(swat.JSEvents.productImageError, function(e) {
    var product = e.detail.d, productLi = e.detail.e;
    swat.getProductDetails(product, function(productJson) {
      var iu = productJson.images[0];
      productLi.querySelector('.swym-image img').src = iu;
    });
  });
});