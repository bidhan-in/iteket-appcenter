(function ($) {
    
    var $customHeight = $('#custom_height');
    var $customWidth = $('#custom_width');
    var $productBasePriceField = $('#product_base_price');
    var $productPriceField = $('#total_price_after_customize');
    var $productPriceFieldView = $('#total_price_after_customize_view');

    function updateProductPrice() {
        var customHeight = parseFloat($customHeight.val());
        var customWidth = parseFloat($customWidth.val());
        var productBasePrice = parseFloat($productBasePriceField.val());
        if (!isNaN(customHeight) && customHeight > 0 && !isNaN(customWidth) && customWidth > 0) {
            var productPrice = customHeight * customWidth * productBasePrice;
            $productPriceField.val(productPrice.toFixed(2));
            $productPriceFieldView.html(productPrice.toFixed(2));
        } else {
            $productPriceField.html('0.0' );
        }
        
    }


    $('.qty').attr('readonly', true);
    $customHeight.on('input', updateProductPrice);
    $customWidth.on('input', updateProductPrice);

    // Price calculation
    var $productBasePriceField = $('#product_base_price');
    var productBasePrice = parseFloat($productBasePriceField.val());


    function updateCustomePrice($input){
        var row = jQuery($input).closest('.dynamic_custom_size_row');
        var customHeight =parseFloat($(row).find('.custom_height').val());
        var customWidth = parseFloat($(row).find('.custom_width').val());
        var $customPrice = $(row).find('.custom_price');
        
        
        if (!isNaN(customHeight) && customHeight > 0 && !isNaN(customWidth) && customWidth > 0) {
            var customPrice = ( customWidth / 100) * (customHeight / 100) * productBasePrice;
            $customPrice.html('kr ' + formatMoney(customPrice.toFixed(2), kamy_wc_addon.wcp_num_decimals, kamy_wc_addon.wcp_decimal_sep, kamy_wc_addon.wcp_thousand_sep)).show();
            $customPrice.data('price',customPrice.toFixed(2) );
            
            
        } else {
            $customPrice.html('0.0' ).hide();
            $customPrice.data('price','0.0');
        }
        sum_price();
    }



    jQuery('.dynamic_custom_size_row').find('input').on('input',function(){
        updateCustomePrice(this);
    });

    var $productPriceFieldView = $('#total_price_after_customize_view');
    var $productPriceField = $('#total_price_after_customize');
    function sum_price(){
        var totalPrice=0;
        jQuery('.custom_price').each(function() {
            totalPrice=totalPrice+parseFloat($(this).data('price'));
        });
        console.log(kamy_wc_addon);
        $productPriceFieldView.html('kr ' + formatMoney(totalPrice, kamy_wc_addon.wcp_num_decimals, kamy_wc_addon.wcp_decimal_sep, kamy_wc_addon.wcp_thousand_sep));
        $productPriceField.val(totalPrice.toFixed(2) );
    }

    // Daynamicaly add more height and width
    var counter = 1;
    jQuery("#add_more_size").click(function(e) {
        e.preventDefault();
        counter++;
        $('.remove-size-row').css('visibility', 'visible');
        var newRow = jQuery('.dynamic_custom_size_row:first').clone();
        // newRow.removeClass('custom_size_fields');
        newRow.find('input').attr('id', function(i, val) {
            return val.replace(/_\d+/, '_' + counter);
        }).val('').on('input',function(){
            updateCustomePrice(this);
        });
        newRow.find('.custom_price').html('0.0').hide();
        newRow.find('.custom_price').data('price','0.0');
        newRow.find('.size_no').html('#' + counter);
        newRow.insertAfter('.dynamic_custom_size_row:last');
        $('.qty').val(counter);
    });
    $('.remove-size-row').css('visibility', 'hidden');
    
    // Remove Daynamic custome height and width row
    jQuery(document).on('click', '.remove-size-row', function() {
        
        if(counter==1){
            counter = 1;
        }else{
            jQuery(this).closest('.dynamic_custom_size_row').remove();
            
            jQuery('.dynamic_custom_size_row').each(function(index) {
            jQuery(this).find('.size_no').html('#' + (index + 1));
            });
            sum_price();
            counter--;
            
        }
        if(counter==1){
            $('.remove-size-row').css('visibility', 'hidden');
        }else{
            $('.remove-size-row').css('visibility', 'visible');
        }

        $('.qty').val(counter);
    });

    $('body').on('change', '.partial_delivery_checkbox', function(e) {
        var delivery_checkbox = 'no';
        if($('.partial_delivery_checkbox' ).is(":checked")){
            delivery_checkbox = 'yes';
        }
        $.ajax({
            url: kamy_wc_addon.admin_ajax_url,
            type: 'post',
            data: {
                security: kamy_wc_addon.ajax_nonce,
                action: 'kamy_wc_addon_ajaxform_submit',
                submit: 'update_partial_delivery',
                delivery_checkbox: delivery_checkbox,
            },
            success: function(data) {
                
            },
        });
    });

    
    /*
    * Format price 
    * @source https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-currency-string-in-javascript
    */
    function formatMoney(number, decPlaces, decSep, thouSep) {
        decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
            decSep = typeof decSep === "undefined" ? "." : decSep;
        thouSep = typeof thouSep === "undefined" ? "," : thouSep;
        var sign = number < 0 ? "-" : "";
        var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
        var j = (j = i.length) > 3 ? j % 3 : 0;

        return sign +
            (j ? i.substr(0, j) + thouSep : "") +
            i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
            (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
    }

})(jQuery);