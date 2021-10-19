/**
 * Gift Card Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Gift Card template.
 */

(function() {
  var config = {
    qrCode: '#qr-code',
    printButton: '#print-gift-card',
    giftCardCode: '#gift-card-code-digits'
  };

  var $qrCode = $(config.qrCode);

  new QRCode($qrCode[0], {
    text: $qrCode.attr('data-identifier'),
    width: 100,
    height: 100
  });

  $(config.printButton).on('click', function() {
    window.print();
  });

  function selectText(evt) {
    var text = evt.target;
    var range = '';

    if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(text);
      range.select();
    } else if (window.getSelection) {
      var selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  // Auto-select gift card code on click, based on ID passed to the function
  $(config.giftCardCode).on('click', selectText);
})();
