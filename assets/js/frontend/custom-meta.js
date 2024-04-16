/**
 * Iteket Timelist admin and myaccount page script file
 * All in one script file
 */
var iwoAddon = iwoAddon || {};
iwoAddon.fn = iwoAddon.fn || {};
iwoAddon.config = iwoAddon.config || {};
iwoAddon.param = iwoAddon.param || {};

/**
 * Load instance items
 * This file is still using at the myaccount page
 */
(function($) {

    // #region WooCommerce Template

    iwoAddon.fn.wcDescBtn = function() {
        $('.global-product-meta-container, .product-dimension-container').on({
            click: function(e) {
                var btnParent = $(this).parent();
                var descBody = btnParent.find('.card-body');
                var descIcon = $(this).find('.product-desc-btn-container');
                if (descBody.is(':visible')) {
                    descIcon.addClass('show');
                    descBody.removeClass('show');
                } else {
                    descIcon.removeClass('show');
                    descBody.addClass('show');
                }
            }
        }, '.card-header');
    }

    // #endregion WooCommerce Template

})(jQuery);

// Fire items after page loaded
jQuery(document).ready(function($) {
    iwoAddon.fn.wcDescBtn();
});