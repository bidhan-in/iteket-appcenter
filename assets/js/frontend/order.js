// @see woocommerce/assets/js/admin/meta-boxes-order.js
jQuery(document).ready(function($) {
    $('#kamy-wc-addon-order').on('click', '.refund-items', function() {
        $('div.wc-order-refund-items').slideDown();
        $('div.wc-order-data-row-toggle').not('div.wc-order-refund-items').slideUp();
        $('div.wc-order-totals-items').slideUp();
        $('#kamy-wc-addon-order').find('div.refund').show();
        return false;
    });

    $('#kamy-wc-addon-order').on('click', '.cancel-action', function() {
        $('div.wc-order-data-row-toggle').not('div.wc-order-bulk-actions').slideUp();
        $('div.wc-order-bulk-actions').slideDown();
        $('div.wc-order-totals-items').slideDown();
        $('#kamy-wc-addon-order').find('div.refund').hide();
        return false;
    });

    $('#kamy-wc-addon-order').on('click', 'button.do-api-refund, button.do-manual-refund', function() {
        if (window.confirm(woocommerce_admin_meta_boxes.i18n_do_refund)) {
            var refund_amount = $('input#refund_amount').val();
            var refund_reason = $('input#refund_reason').val();
            var refunded_amount = $('input#refunded_amount').val();

            // Get line item refunds
            var line_item_qtys = {};
            var line_item_totals = {};
            var line_item_tax_totals = {};

            $('.refund input.refund_order_item_qty').each(function(index, item) {
                if ($(item).closest('tr').data('order_item_id')) {
                    if (item.value) {
                        line_item_qtys[$(item).closest('tr').data('order_item_id')] = item.value;
                    }
                }
            });

            $('.refund input.refund_line_total').each(function(index, item) {
                if ($(item).closest('tr').data('order_item_id')) {
                    line_item_totals[$(item).closest('tr').data('order_item_id')] = accounting.unformat(item.value, woocommerce_admin.mon_decimal_point);
                }
            });

            $('.refund input.refund_line_tax').each(function(index, item) {
                if ($(item).closest('tr').data('order_item_id')) {
                    var tax_id = $(item).data('tax_id');

                    if (!line_item_tax_totals[$(item).closest('tr').data('order_item_id')]) {
                        line_item_tax_totals[$(item).closest('tr').data('order_item_id')] = {};
                    }

                    line_item_tax_totals[$(item).closest('tr').data('order_item_id')][tax_id] = accounting.unformat(item.value, woocommerce_admin.mon_decimal_point);
                }
            });

            var data = {
                action: 'woocommerce_refund_line_items',
                order_id: woocommerce_admin_meta_boxes.post_id,
                refund_amount: refund_amount,
                refunded_amount: refunded_amount,
                refund_reason: refund_reason,
                line_item_qtys: JSON.stringify(line_item_qtys, null, ''),
                line_item_totals: JSON.stringify(line_item_totals, null, ''),
                line_item_tax_totals: JSON.stringify(line_item_tax_totals, null, ''),
                api_refund: $(this).is('.do-api-refund'),
                restock_refunded_items: $('#restock_refunded_items:checked').length ? 'true' : 'false',
                security: woocommerce_admin_meta_boxes.order_item_nonce
            };

            $.post(woocommerce_admin_meta_boxes.ajax_url, data, function(response) {
                if (true === response.success) {
                    // Redirect to same page for show the refunded status
                    window.location.reload();
                } else {
                    window.alert(response.data.error);
                }
            });
        }
    });

    $('#kamy-wc-addon-order').on('change', '.refund .refund_line_total, .refund .refund_line_tax', function() {
        var refund_amount = 0;
        var $items = $('.order-items').find('tr.item, tr.fee, tr.shipping');

        $items.each(function() {
            var $row = $(this);
            var refund_cost_fields = $row.find('.refund input:not(.refund_order_item_qty)');

            refund_cost_fields.each(function(index, el) {
                refund_amount += parseFloat(accounting.unformat($(el).val() || 0, woocommerce_admin.mon_decimal_point));
            });
        });

        $('#refund_amount')
            .val(accounting.formatNumber(
                refund_amount,
                woocommerce_admin_meta_boxes.currency_format_num_decimals,
                '',
                woocommerce_admin.mon_decimal_point
            ))
            .change();
    });

    $('#kamy-wc-addon-order').on('change keyup', '.wc-order-refund-items #refund_amount', function() {
        var total = accounting.unformat($(this).val(), woocommerce_admin.mon_decimal_point);

        $('button .wc-order-refund-amount .amount').text(accounting.formatMoney(total, {
            symbol: woocommerce_admin_meta_boxes.currency_format_symbol,
            decimal: woocommerce_admin_meta_boxes.currency_format_decimal_sep,
            thousand: woocommerce_admin_meta_boxes.currency_format_thousand_sep,
            precision: woocommerce_admin_meta_boxes.currency_format_num_decimals,
            format: woocommerce_admin_meta_boxes.currency_format
        }));
    });

    $('#kamy-wc-addon-order').on('change', '.refund_order_item_qty', function() {
        var $row = $(this).closest('tr.item');
        var qty = $row.find('input.quantity').val();
        var refund_qty = $(this).val();
        var line_total = $('input.line_total', $row);
        var refund_line_total = $('input.refund_line_total', $row);

        // Totals
        var unit_total = accounting.unformat(line_total.attr('data-total'), woocommerce_admin.mon_decimal_point) / qty;

        refund_line_total.val(
            parseFloat(accounting.formatNumber(unit_total * refund_qty, woocommerce_admin_meta_boxes.rounding_precision, ''))
            .toString()
            .replace('.', woocommerce_admin.mon_decimal_point)
        ).change();

        // Taxes
        $('.refund_line_tax', $row).each(function() {
            var $refund_line_total_tax = $(this);
            var tax_id = $refund_line_total_tax.data('tax_id');
            var line_total_tax = $('input.line_tax[data-tax_id="' + tax_id + '"]', $row);
            var unit_total_tax = accounting.unformat(line_total_tax.data('total_tax'), woocommerce_admin.mon_decimal_point) / qty;

            if (0 < unit_total_tax) {
                $refund_line_total_tax.val(
                    parseFloat(accounting.formatNumber(unit_total_tax * refund_qty, woocommerce_admin_meta_boxes.rounding_precision, ''))
                    .toString()
                    .replace('.', woocommerce_admin.mon_decimal_point)
                ).change();
            } else {
                $refund_line_total_tax.val(0).change();
            }
        });

        // Restock checkbox
        if (refund_qty > 0) {
            $('#restock_refunded_items').closest('tr').show();
        } else {
            $('#restock_refunded_items').closest('tr').hide();
            $('.order-items input.refund_order_item_qty').each(function() {
                if ($(this).val() > 0) {
                    $('#restock_refunded_items').closest('tr').show();
                }
            });
        }

        // $( this ).trigger( 'refund_quantity_changed' );
    });

    $('#order-notes').on('click', '.add_note', function() {
        if (!$('textarea#add_order_note').val()) {
            return;
        }

        $('#woocommerce-order-notes').block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });

        var data = {
            action: 'woocommerce_add_order_note',
            post_id: woocommerce_admin_meta_boxes.post_id,
            note: $('textarea#add_order_note').val(),
            note_type: $('select#order_note_type').val(),
            security: woocommerce_admin_meta_boxes.add_order_note_nonce
        };

        $.post(woocommerce_admin_meta_boxes.ajax_url, data, function(response) {
            $('ul.order_notes').prepend(response);
            $('#woocommerce-order-notes').unblock();
            $('#add_order_note').val('');
        });

        return false;
    });
});