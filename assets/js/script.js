/**
 * Iteket Timelist admin and myaccount page script file
 * All in one script file
 */
var iwoAddon = iwoAddon || {};
iwoAddon.fn = iwoAddon.fn || {};
iwoAddon.config = iwoAddon.config || {};
iwoAddon.param = iwoAddon.param || {};


// Define all functions
(function($) {
    iwoAddon.param.window = $(window);
    iwoAddon.param.document = $(document);
    iwoAddon.param.kmsGenPopUp;
    iwoAddon.param.fileTable = false;
    

    /**
     * Load and return customer billing table content in dataTables
     * 
     * @see file 
     */
    iwoAddon.fn.billingTable = function() {
        if (!$('#iwo_billing_table').length) {
            return;
        }

        var id = $('#iwo_billing_table').data('id');
        $('#iwo_billing_table').DataTable({
            order: [
                [0, 'desc'],
                [3, 'desc']
            ],
            ajax: {
                url: icti10n.adminAjaxUrl, // your URL to retrieve the data
                type: 'POST',
                dataType: 'json',
                data: {
                    security: icti10n.ajaxNonce,
                    action: 'iwo_addon_ajax',
                    submit: 'get_billing_datatables',
                    customerID: id
                },
                dataSrc: function(data) {
                    return data;
                }
            },
            columns: [{
                    data: {
                        _: 'billing.display',
                        sort: 'billing.pid',
                    }
                },
                {
                    data: {
                        _: 'date.display',
                        sort: 'date.timestamp',
                    }
                },
                { data: 'name' },
                {
                    data: {
                        _: 'timespent.display',
                        sort: 'timespent.timestamp',
                    }
                },
                { data: 'incharge' },
                { data: 'status' },
                { data: 'order' },
                {
                    data: {
                        _: 'ttDate.display',
                        sort: 'ttDate.timestamp',
                    }
                },
                { data: 'link' },
            ],
            deferRender: true
        });
    }

    /**
     * Load and return recurring task table content in dataTables
     * 
     * @see file 
     */
    iwoAddon.fn.recurringTable = function() {
        if (!$('#iwo_recurring_table').length) {
            return;
        }

        var id = $('#iwo_recurring_table').data('id');
        $('#iwo_recurring_table').DataTable({
            order: [
                [0, 'desc']
            ],
            ajax: {
                url: icti10n.adminAjaxUrl, // your URL to retrieve the data
                type: 'POST',
                dataType: 'json',
                data: {
                    security: icti10n.ajaxNonce,
                    action: 'iwo_addon_ajax',
                    submit: 'get_recurring_datatables',
                    customerID: id
                },
                dataSrc: function(data) {
                    return data;
                }
            },
            columns: [{
                    data: {
                        _: 'date.display',
                        sort: 'date.timestamp',
                    }
                },
                { data: 'name' },
                { data: 'incharge' },
                { data: 'estimate' },
                { data: 'status' },
                { data: 'order' },
                { data: 'deadline' },
                { data: 'comment' },
            ],
            deferRender: true,
            responsive: true
        });
    }

    /**
     * Load an return password from password list in dataTables
     * 
     * @todo complete this call
     * @see file 
     */
    iwoAddon.fn.passwordTable = function() {
        if (!$('#iwo_password_table').length) {
            return;
        }

        // initialize DataTable
        iwoAddon.fn.passwordTableCallBack();
        // var table = iwoAddon.fn.passwordTableCallBack();

        // listen for submit event on verification code input
        // $('#_verification_code').submit(function (event) {
        //     event.preventDefault(); // prevent form submit

        //     // call refreshTableData function to reload DataTable data
        //     table.ajax.reload();
        // });
    }

    /**
     * Callback of loading an return password from password list in dataTables
     * 
     * @todo complete this call
     * @see iwoAddon.fn.passwordTable
     * @see file 
     */
    iwoAddon.fn.passwordTableCallBack = function() {
        var id = $('#iwo_password_table').data('id');
        return $('#iwo_password_table').DataTable({
            order: [
                [0, 'desc']
            ],
            ajax: {
                url: icti10n.adminAjaxUrl, // your URL to retrieve the data
                type: 'POST',
                dataType: 'json',
                data: {
                    security: icti10n.ajaxNonce,
                    action: 'iwo_addon_ajax',
                    submit: 'get_password_datatables',
                    customerID: id
                },
                dataSrc: function(data) {
                    return data;
                }
            },
            columns: [
                { data: 'name' },
                { data: 'url' },
                { data: 'username' },
                { data: 'password' },
                { data: 'link' },
            ],
            deferRender: true,
            responsive: true
        });
    }

    /**
     * Load an return product list from customer in dataTables
     * 
     * @see file 
     */
    iwoAddon.fn.productTable = function() {
        if (!$('#iwo_product_table').length) {
            return;
        }

        var id = $('#iwo_product_table').data('id');
        $('#iwo_product_table').DataTable({
            order: [
                [0, 'desc']
            ],
            ajax: {
                url: icti10n.adminAjaxUrl, // your URL to retrieve the data
                type: 'POST',
                dataType: 'json',
                data: {
                    security: icti10n.ajaxNonce,
                    action: 'iwo_addon_ajax',
                    submit: 'get_product_datatables',
                    customerID: id
                },
                dataSrc: function(data) {
                    return data;
                }
            },
            columns: [
                { data: 'name' },
                { data: 'link' },
                { data: 'asset' }
            ],
            deferRender: true,
            responsive: true
        });
    }

    


    // Customer Dropdown
    iwoAddon.fn._ajax_customer_profile_select_dropdown = function() {
        jQuery('._ajax_customer_profile_select_dropdown').each(function() {
            var selected = jQuery(this).data('selected');
            var _this = $(this);
            var data = {
                security: kamy_wc_addon.ajax_nonce,
                action: 'kamy_wc_addon_ajaxform_submit',
                submit: 'ajax_get_customer_select_options_data',
                selected: selected,
                classes: $(this).attr('class'),
            };

            jQuery.post(kamy_wc_addon.admin_ajax_url, data, function(response) {
                _this.html(response);
                _this.parent().removeClass('wait-select-opt');
            });
        });
    }

    iwoAddon.fn.globalMetaSet = function() {
        // Escape if element not found
        if (!$('#global-product-field-example').length) {
            return;
        }

        // Obtain row example data
        iwoAddon.param.globalMetaRow = $('#global-product-field-example').html();


        iwoAddon.fn.globalMetaAdd();

        $('#add-global-product-field').on('click', iwoAddon.fn.globalMetaAdd);
    }

    iwoAddon.fn.globalMetaAdd = function() {
        // Get the current Unix timestamp
        var currentTimestamp = Math.floor(Date.now());

        // Replace specific strings inside the content area
        var text = iwoAddon.param.globalMetaRow;
        var pattern = /%replaceMe%/g;
        var addRow = text.replace(pattern, currentTimestamp);

        var finalRow = addRow.replace('have_select2_ready', 'have_select2');

        // Update the content with the replaced strings
        $('.wrapper-global-product-field').append(finalRow);
        iwoAddon.fn.loadSelect2();
    }

    // Select2
    iwoAddon.fn.loadSelect2 = function() {
        $.fn.select2.defaults.set('theme', 'bootstrap');
        $('.have_select2').each(function(e) {
            var current = $(this);

            // check if event handler already exists
            // if exists, skip this item and go to next item
            if (current.data('select2Init')) {
                return true;
            }

            // flag item to prevent attaching handler again
            current.data('select2Init', true);
            current.select2();
        });
    }

    iwoAddon.fn.loadPrettySelectbox = function() {
        iwoAddon.fn.loadSelect2();

        $('.add-to-multiinput').on('click', function(e) {
            e.preventDefault();

            var obtainSelector = $(this).val();
            var resultTarget = $(this).data('table-target');
            var inputName = $(this).data('table-name');
            var inputVal = $(obtainSelector).val();
            var displayText = $('option:selected', obtainSelector).text();

            var html = '\<tr\>\<td\>' +
                displayText +
                '\<input type\=\"hidden\" name\=\"' + inputName + '\" value\=\"' + inputVal + '\" \/\>' +
                '\<\/td\>' +
                '\<td\>' +
                '\<button type\=\"button\" class\=\"remove-multiinput-line button btn btn-danger\"\>Fjern\<\/button\>' +
                '\<\/td\>\<\/tr\>';

            $(resultTarget + ' tbody').append(html);
        });

        $('.multiinput-table').on('click', '.remove-multiinput-line', function(e) {
            e.preventDefault();
            $(this).parent().parent().remove();
        });
    }


    iwoAddon.fn.fileList = function(custoemrID,link_to_relation) {
        if (!$('#archived_files-' + custoemrID).length) {
            return false;
        }

        $.ajax({
            url: kamy_wc_addon.admin_ajax_url,
            type: 'post',
            data: {
                security: kamy_wc_addon.ajax_nonce,
                action: 'kamy_wc_addon_ajaxform_submit',
                submit: 'reload_file_lists',
                customerID: custoemrID
            },
            success: function(data) {
                if (data.success === true) {
                    $('tbody', '#archived_files-' + custoemrID).html(data.data);
                }
            }
        });
    }

    /**
     * @see templates\admin\order\report-coupon.php
     */
    iwoAddon.fn.orderReport = {
        init: function() {
            // If #reportrange found
            // @see http://momentjs.com/guides/#/warnings/define-locale/
            moment.locale('nb');

            iwoAddon.fn.orderReport.coupon();
        },
        cb: function (start, end) {
            $('#reportrange span').html(start.format('D. MMMM YYYY') + ' - ' + end.format('D. MMMM YYYY'));
            $('#start_date_input').val(start.format('YYYY-MM-DD'));
            $('#to_date_input').val(end.format('YYYY-MM-DD'));
        }, 
        coupon: function() {
            if (! $('#reportrange').length) {
                return; // escape
            }

            // Get the value of the hidden input field
            var startDateInput = $("#start_date_input").val();
            var toDateInput = $("#to_date_input").val();

            // Check if the hidden input field is not empty
            if ($.trim(startDateInput) !== "") {
                // The hidden input field is not empty
                var start = moment(startDateInput, 'YYYY-MM-DD');
            } else {
                // The hidden input field is empty
                var start = moment().subtract(31, 'days');
            }
            
            // Check if the hidden input field is not empty
            if ($.trim(toDateInput) !== "") {
                // The hidden input field is not empty
                var end = moment(toDateInput, 'YYYY-MM-DD');
            } else {
                // The hidden input field is empty
                var end = moment();
            }
        
            $('#reportrange').daterangepicker({
                startDate: start,
                endDate: end,
                ranges: {
                    'I dag': [moment(), moment()],
                    'I går': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Siste 7 dager': [moment().subtract(6, 'days'), moment()],
                    'Siste 30 dager': [moment().subtract(29, 'days'), moment()],
                    'Denne måneden': [moment().startOf('month'), moment().endOf('month')],
                    'Siste måned': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                locale: {
                    separator: ' - ',
                    applyLabel: 'Oppdater',
                    cancelLabel: 'Lukk',
                    customRangeLabel: 'Tilpasset',
                }
            }, iwoAddon.fn.orderReport.cb);
        
            iwoAddon.fn.orderReport.cb(start, end);
        }
    }

    iwoAddon.fn.fileTable = {
        init: function() {
            if (!$('.archived_files_table').length) {
                return;
            }

            var id = $('.archived_files_table').data('id');
            
            iwoAddon.param.fileTable = $('.archived_files_table').DataTable({
                order: [
                    [0, 'desc']
                ],
                ajax: {
                    url: kamy_wc_addon.adminAjaxUrl, // your URL to retrieve the data
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        security: kamy_wc_addon.ajaxNonce,
                        action: 'kamy_wc_addon_ajaxform_submit',
                        submit: 'get_file_list',
                        customerID: id
                    },
                    dataSrc: function(data) {
                        return data;
                    }
                },
                columns: [
                    { data: 'ID' },
                    { data: 'title' },
                    { data: 'fileName' },
                    { data: 'catName' },
                    {
                        data: {
                            _: 'date.display',
                            sort: 'date.timestamp',
                        }
                    },
                    { data: 'size' },
                    { data: 'author' },
                    {
                        data: {
                            _: 'mDate.display',
                            sort: 'mDate.timestamp',
                        }
                    },
                    { data: 'links' }
                ],
                deferRender: true,
                responsive: true
            });
            
            iwoAddon.fn.fileTable.fileDelete();
        },
        fileDelete: function() {
            // Delete a single file
            $('#archived_files_table-wrapper').on('click', '.delete-file', function(e) {
                e.preventDefault();
                var fileID = $(this).data('id');
                $.confirm({
                    title: 'Bekrefte!',
                    content: 'Er du sikker?',
                    buttons: {
                        confirm: {
                            text: 'Slett',
                            btnClass: 'btn-danger',
                            action: function() {

                                $.ajax({
                                    url: kamy_wc_addon.admin_ajax_url,
                                    type: 'post',
                                    data: {
                                        security: kamy_wc_addon.ajax_nonce,
                                        action: 'kamy_wc_addon_ajaxform_submit',
                                        submit: 'iwo_delete_file',
                                        fileID: fileID,
                                    },
                                    success: function(data) {
                                        $.alert(data.data);
                                        iwoAddon.fn.fileTable.tableReload();
                                    },
                                });
                            }
                        },
                        cancel: {
                            text: 'Avbryt'
                        },
                    }
                });
            });
        },
        tableReload: function() {
            if ( iwoAddon.param.fileTable !== false ) {
                iwoAddon.param.fileTable.ajax.reload();
                $('#kmsGenPopUp').html('').hide();
            } else {
                window.location.reload(true);
            }
        }
    }

})(jQuery);


// Execute on page loaded
jQuery(document).ready(function($) {
    iwoAddon.fn._ajax_customer_profile_select_dropdown();
    iwoAddon.fn.globalMetaSet();
    iwoAddon.fn.orderReport.init();
    iwoAddon.fn.fileTable.init();
    
    if (adminPortal && adminPortal.fn && typeof adminPortal.fn.fileUpload === 'function') {
        adminPortal.fn.fileUpload();
    }    
});

// Legacy script
// JavaScript Document
jQuery(function($) {


    $('body').on('click', '#add-featured-image', function(e) {
        var $el = $(this).parent();
        var is_multiple = $(this).data('multiple');
        e.preventDefault();
        var uploader = wp.media({
                title: kamy_wc_addon.insert_media,
                button: {
                    text: kamy_wc_addon.add_media_to_page
                },
                multiple: is_multiple,
            })
            .on('select', function() {
                var attachments = uploader.state().get('selection').map(

                    function(attachment) {

                        attachment.toJSON();
                        return attachment;

                    });

                if (is_multiple == false) {
                    $('.kamyuploader-preview-imgs').remove();
                    $('#kamyuploader-preview').after('<div class="kamyuploader-preview-imgs"><span class="lnr lnr-trash remove"></span><input type="hidden" name="attachment_id" value="' + attachments[0].id + '"><img src="' + attachments[0].attributes.url + '" ></div>');
                } else {
                    for (i = 0; i < attachments.length; ++i) {

                        //sample function 1: add image preview
                        $('#kamyuploader-preview').after('<div class="kamyuploader-preview-imgs"><span class="linearicons-trash2 remove"></span><input type="hidden" name="attachment_ids[]" value="' + attachments[i].id + '"><img src="' + attachments[i].attributes.url + '" ></div>');
                        //sample function 2: add hidden input for each image
                    }
                }
            })
            .open();
    });

    $('body').on('click', '.kamyuploader-preview-imgs .remove', function() {
        $(this).parent().remove();
    });

    /* New Product form */
    $('body').on('click', '.new_product_form', function(e) {
        e.preventDefault();

        $.ajax({
            url: kamy_wc_addon.admin_ajax_url,
            type: 'post',
            data: {
                security: kamy_wc_addon.ajax_nonce,
                action: 'kamy_wc_addon_ajaxform_submit',
                submit: 'new_product_form',
            },
            success: function(data) {

                $('#kmsGenPopUp').html(data).show();
                $('.kms-pu-close,.btn_close_kms_popup').click(function(e) {
                    $('#kmsGenPopUp').html('').hide();
                });

                /* draggable */
                $(".draggable").draggable();

                $('.have_datepicker').datepicker({
                    //language: 'no'
                });


                $('.have_datepicker_block_past').datepicker({
                    position: "top center",
                    minDate: new Date(),
                });



                $('.have_datepicker_top').datepicker({
                    position: "top center"
                });

                $.fn.select2.defaults.set("theme", "bootstrap");
                $('.have_select2').select2();

                $('.location_cat_oce').select2().on('select2:close', function(event) {
                    if ('allocate-to-customer' == $(this).val()) {
                        $('.customer_profile_warp').show();
                    } else {
                        $('.customer_profile_warp').hide();
                    }
                });

                //init tinymce
                tinyMCE.init({
                    menubar: false,
                    media: true
                })

                // Reinitialize the editor: Remove the editor then add it back
                tinyMCE.execCommand('mceRemoveEditor', false, 'post_content_copy');
                tinyMCE.execCommand('mceAddEditor', false, 'post_content_copy');
                tinyMCE.execCommand('mceRemoveEditor', false, 'post_excerpt_copy');
                tinyMCE.execCommand('mceAddEditor', false, 'post_excerpt_copy');

                kamy_wc_addonValidateInit();
            }
        });
        return false;
    });


    /* Resend order email */
    $('body').on('click', '.resend-order-email', function(e) {
        e.preventDefault();
        var post_id = $(this).data('id');
        $.confirm({
            title: 'Bekrefte!',
            content: 'Er du sikker?',
            buttons: {
                confirm: {
                    text: 'Send',
                    btnClass: 'btn-blue',
                    action: function() {

                        $.ajax({
                            url: kamy_wc_addon.admin_ajax_url,
                            type: 'post',
                            data: {
                                security: kamy_wc_addon.ajax_nonce,
                                action: 'kamy_wc_addon_ajaxform_submit',
                                submit: 'resend_order_email',
                                post_id: post_id,
                            },
                            success: function(data) { $.alert(data.data); },
                        });
                    }
                },
                cancel: {
                    text: 'Avbryt'
                },
            }
        });



    });


    // product Dropdown
    jQuery('._ajax_product_select_dropdown').each(function() {

        var selected = jQuery(this).data('selected');
        var data = {
            security: kamy_wc_addon.ajax_nonce,
            action: 'kamy_wc_addon_ajaxform_submit',
            submit: 'get_product_select_options_data',
            selected: selected,
        };

        jQuery.post(customer_addon.admin_ajax_url, data, function(response) {

            $('._ajax_product_select_dropdown').html(response);
            $('._ajax_product_select_dropdown').parent().removeClass('wait-select-opt');
        });
    });


    /* Edit order line product */
    $('body').on('click', '.edit_wc_order_item', function(e) {
        e.preventDefault();
        var item_id = $(this).data('item-id');
        var product_id = $(this).data('product-id');
        var order_id = $(this).data('order-id');

        $.ajax({
            url: kamy_wc_addon.admin_ajax_url,
            type: 'post',
            data: {
                security: kamy_wc_addon.ajax_nonce,
                action: 'kamy_wc_addon_ajaxform_submit',
                submit: 'get_edit_wc_order_item_form',
                product_id: product_id,
                item_id: item_id,
                order_id: order_id,
            },
            success: function(data) {
                $('#kmsGenPopUp').html(data).show();
                $('.kms-pu-close,.btn_cancel_update_ticket').click(function(e) {
                    $('#kmsGenPopUp').html('').hide();
                });
                kamy_wc_addonValidateInit();
            },
        });
    });

    /* Edit order line product */
    $('body').on('click', '.wc_order_remove_line_item', function(e) {
        e.preventDefault();
        var item_id = $(this).data('item-id');
        var product_id = $(this).data('product-id');
        var order_id = $(this).data('order-id');
        $.confirm({
            title: 'Bekrefte!',
            content: 'Er du sikker?',
            buttons: {
                confirm: {
                    text: 'Slett',
                    btnClass: 'btn-blue',
                    action: function() {
                        $.ajax({
                            url: kamy_wc_addon.admin_ajax_url,
                            type: 'post',
                            data: {
                                security: kamy_wc_addon.ajax_nonce,
                                action: 'kamy_wc_addon_ajaxform_submit',
                                submit: 'wc_order_remove_line_item',
                                product_id: product_id,
                                item_id: item_id,
                                order_id: order_id,
                            },
                            success: function(data) {
                                if (data.success === true) {
                                    $('.item[data-order_item_id^="' + item_id + '"]').remove();
                                }
                                $.alert(data.data);
                                window.location.reload();
                            },
                        });

                    }
                },
                cancel: {
                    text: 'Avbryt'
                },
            }
        });


    });



    $('body').on('click', '._wc_remove_item_meta', function(e) {
        var meta_id = $(this).data('id');
        if ($(this).hasClass('ignore_remove') === false) {
            $('.form-group.meta_warp_' + meta_id).after('<input type="hidden" name="meta_id_removed[]" value="' + meta_id + '" >');
        }

        $('.form-group.meta_warp_' + meta_id).remove();

    });

    $('body').on('click', '#frm_edit_wc_order_line_item .add_order_item_meta', function(e) {
        var r = Math.floor(Math.random() * 96545898989);
        var html = '<div class="form-group meta_warp_' + r + '">' +
            '<input type="text" name="new_display_value[]" class="form-control required valid" style="width: 88%;" value="" >' +
            '<span class="linearicons-trash2 _wc_remove_item_meta ignore_remove" data-id="' + r + '" style="margin:-25px 8px;float: right;color: #f00;"></span>' +
            '</div>';
        $('.add_order_item_meta').before(html);
    });



    $('body').on('click change keyup', '.oce_change_order_qty', function(e) {
        var product_price = parseFloat($(this).data('price'));
        var line_price = parseFloat($(this).data('line-price'));

        var qty = parseInt($(this).val());

        var line_subtotal = Number(parseFloat(qty * product_price)).toFixed(2);
        $('#frm_edit_wc_order_line_item .line_subtotal').val(line_subtotal);
        var line_total = Number(parseFloat(qty * line_price)).toFixed(2);
        $('#frm_edit_wc_order_line_item .line_total').val(line_total);
        var subtotal_tax = Number((line_subtotal / 100) * 25).toFixed(2);
        $('#frm_edit_wc_order_line_item .subtotal_tax').val(subtotal_tax);
        $('#frm_edit_wc_order_line_item .total_tax').val(Number((line_total / 100) * 25).toFixed(2));

    });


    /* Edit order status  */
    $('body').on('click', '.change_order_status', function(e) {
        e.preventDefault();
        var post_status = $(this).data('status');
        var post_id = $(this).data('id');
        var status_name = $(this).data('val');

        $.ajax({
            url: kamy_ticket.admin_ajax_url,
            type: 'post',
            data: {
                post_id: post_id,
                post_status: post_status,
                security: kamy_wc_addon.ajax_nonce,
                action: 'kamy_wc_addon_ajaxform_submit',
                submit: 'update_order_status',
            },
            success: function(data) {
                $('.change_order_status_warp .status-name').html(status_name);
            }
        });

    });

    $('body').on('click', '.add_line_item_to_order', function(e) {
        e.preventDefault();
        var order_id = $(this).data('order-id');

        $.ajax({
            url: kamy_wc_addon.admin_ajax_url,
            type: 'post',
            data: {
                security: kamy_wc_addon.ajax_nonce,
                action: 'kamy_wc_addon_ajaxform_submit',
                submit: 'get_form_add_line_item_to_order',
                order_id: order_id,
            },
            success: function(data) {
                $('#kmsGenPopUp').html(data).show();
                $('.kms-pu-close,.btn_cancel_update_ticket').click(function(e) {
                    $('#kmsGenPopUp').html('').hide();
                });
                $('.have_select2').select2();
                kamy_wc_addonValidateInit();
            },
        });
    });

    /* add-product-to-order
    Script for DOM element add.
    */
    $('body').on('click', '.add-product-to-order', function() {
        var p_id = $('#chose_product').val();
        var text = $('#chose_product :selected').text();
        var price = $('#chose_product :selected').data('price');
        var price_text = 'kr ' + formatMoney(price, 2, ",", ".");

        if (p_id === '') {
            $.alert('Please select a product');
            return false;
        }

        if ($('.table-order-new-products-01').find('tr.wc_new_line_item.p-' + p_id).length === 0) {
            var qty_html = '<span style="float: left;width: 40px;line-height: 30px;">Qty:</span> <input type="number" name="_qty[' + p_id + ']" class="form-control" style="float: left;width: 60px;" value="1" min="1">';
            var html = '<tr class="wc_new_line_item p-' + p_id + '"><td><input type="hidden" name="_products[]" value="' + p_id + '">' + text + '</td><td>' + price_text + '</td><td>' + qty_html + '</td><td><button class="btn  btn-danger button remove-product-from-order" data-id="' + p_id + '" type="button">Fjerne</button></td></tr>';
            $('.table-order-new-products-01 table tbody').append(html);
            $('#chose_product').prop('selectedIndex', 0);
            $('#chose_product').trigger('change');

        } else {
            $.alert('Already added');
        }
    });

    /* Remove product from ticket
       Script for DOM element remove.  NOt for databse remove 
    */
    $('body').on('click', '.remove-product-from-order', function() {
        var id = $(this).data('id');
        $.confirm({
            title: 'Bekrefte!',
            content: 'Er du sikker?',
            buttons: {
                confirm: {
                    text: 'Slett',
                    btnClass: 'btn-blue',
                    action: function() {
                        $('.table-order-new-products-01 tr.wc_new_line_item.p-' + id).remove();
                    }
                },
                cancel: {
                    text: 'Avbryt'
                },
            }
        });

    });


    /* New subscription form */
    $('body').on('click', '.iwo_fileuploadPopup', function(e) {
        
        e.preventDefault();
        var default_customer = $(this).data('customer');
        
        $('.bottom-bar-ajx-doing').show();
        $.ajax({
            url: kamy_wc_addon.admin_ajax_url,
            type: 'post',
            data: {
                security: kamy_wc_addon.ajax_nonce,
                action: 'kamy_wc_addon_ajaxform_submit',
                submit: 'iwo_get_fileuploadPopup',
                default_customer: default_customer,
            },
            success: function(data) {
                $('.bottom-bar-ajx-doing').hide();
                $('#kmsGenPopUp').html(data).show();
                
                iwoAddon.fn._ajax_customer_profile_select_dropdown();
                
                if (adminPortal && adminPortal.fn && typeof adminPortal.fn.fileUpload === 'function') {
                    adminPortal.fn.fileUpload();
                }
                
                $.fn.select2.defaults.set("theme", "bootstrap");
                $('.have_select2_ajax23').select2();

                
                
                
                //$('#db').datebox('open');
                var datebox = $('.have_datebox').datebox({
                    mode: 'flipbox',
                    useInline: true,
                    useInlineAlign: 'center',
                    useCollapsedBut: true,
                    overrideDateFieldOrder: '["y"]',
                    overrideDateFormat: '%Y',                    
                    useCancelButton: true,
                    overrideCancelButtonLabel: 'Avslutt',                     
                    cancelButton: "Avslutt",  
                    CancelButtonLabel: "Avslutt", 
                    overrideSetDateButtonLabel: 'Velg år',                             

                    closeCallback: function() {
                      //var selectedDate = $(this).datebox('getTheDate');
                    }
                });
                $('.have_datebox').closest('.md-form').find('.ui-datebox-container').hide();

                datebox.on('datebox', function(e, date) { 
                    // Check if the Set button was clicked
                    console.log(date.method)
                    if (date.method === 'set') {
                        var selectedDate = $(this).datebox('getTheDate');
                        $('.have_datebox').closest('.md-form').find('label').addClass('active');
                    }else if(date.method ===  'close'){
                        $('.have_datebox').closest('.md-form').find('.ui-datebox-container').hide();
                    }
                    else if(date.method ===  'open'){
                        $('.have_datebox').closest('.md-form').find('.ui-datebox-container').show();
                    }
                });

                // Open the date picker        

                $('.have_datebox').click(function (e) { 
                    e.preventDefault();
                    datebox.datebox('open');
                    $('.have_datebox').closest('.md-form').find('.ui-datebox-container').show();
                });


                kamy_wc_addonValidateInit();                    
            }
        });
        return false;
    });

    // Listen for the custom event
    document.addEventListener('itektBasisAfterAsyncUpload', function(event) {
        // Access event details
        var link_to_post_id = event.detail.link_to_post_id;
        var link_to_relation = event.detail.link_to_relation;    
        iwoAddon.fn.fileList(link_to_post_id,link_to_relation);
    });

    /**
     * Ajax Form with jQuery validate
     * 
     * See https://teamtreehouse.com/community/submitting-a-form-in-wordpress-using-ajax
     * See https://$validation.org/validate/
     * See http://malsup.com/$/form/#ajaxSubmit
     */

    function kamy_wc_addonValidateInit() {
        // Start jQuery validate with jQuery ajaxForm
        $(".kamy_wc_addon_submit_form.reset").each(function() {
            $(this).validate({
                // debug: true,
                submitHandler: function(form) {
                    // jQuery ajaxForm handler
                    $(form).ajaxSubmit({
                        type: 'post',
                        url: kamy_wc_addon.admin_ajax_url,
                        beforeSerialize: function($form, options) {
                            // save tinymce before serialize form
                            if ($("#email_header").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#email_footer").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#post_content").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#email_content").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($(".wp-editor-container").length) {
                                tinyMCE.triggerSave();
                            }
                            // return false to cancel submit
                        },
                        beforeSubmit: function(formData, jqForm, options_no_reset) {
                            $('.kamy_ticket_submit_form button').addClass('disabled').attr('disabled', 'disabled');
                            return true;
                        },
                        data: {
                            // ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
                            // access form parameter as $_POST in server side ajax handler
                            security: kamy_wc_addon.ajax_nonce,
                            action: 'kamy_wc_addon_ajaxform_submit'
                        },
                        success: function(data) {
                            $('.kamy_ticket_submit_form button').removeClass('disabled').removeAttr('disabled', 'disabled');
                            $('.kamy_wc_addon_submit_form.reset').resetForm();
                            $.alert(data.data);

                            if ($("#email_header").length) {
                                tinymce.get('email_header').setContent('');
                            }
                            if ($("#email_footer").length) {
                                tinymce.get('email_footer').setContent('');
                            }
                            if ($("#post_content").length) {
                                tinymce.get('post_content').setContent('');
                            }
                            if ($("#email_content").length) {
                                tinymce.get('email_content').setContent('');
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(JSON.parse(jqXHR.responseText) + ' :: ' + textStatus + ' :: ' + errorThrown);
                            // $.alert(jqXHR);
                        },
                    });
                },
                errorPlacement: function(error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error)
                    } else {
                        error.insertAfter(element);
                    }
                },
                invalidHandler: function(event, validator) {
                    // 'this' refers to the form
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        var message = errors == 1 ?
                            'You missed 1 field. It has been highlighted' :
                            'You missed ' + errors + ' fields. They have been highlighted';
                        // $("div.error span").html(message);
                        // $("div.error").show();
                    } else {
                        // $("div.error").hide();
                    }
                }
            });
        });
        // End jQuery validate with jQuery ajaxForm

        // Start jQuery validate with jQuery ajaxForm
        $(".kamy_wc_addon_submit_form.no_reset").each(function() {
            $(this).validate({
                // debug: true,
                submitHandler: function(form) {
                    // jQuery ajaxForm handler
                    $(form).ajaxSubmit({
                        type: 'post',
                        url: kamy_wc_addon.admin_ajax_url,
                        beforeSerialize: function($form, options) {
                            // save tinymce before serialize form
                            if ($("#email_header").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#email_footer").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#post_content").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#email_content").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($(".wp-editor-container").length) {
                                tinyMCE.triggerSave();
                            }
                            // return false to cancel submit
                        },
                        beforeSubmit: function(formData, jqForm, options_no_reset) {
                            $('.kamy_ticket_submit_form button').addClass('disabled').attr('disabled', 'disabled');
                            return true;
                        },
                        data: {
                            // ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
                            // access form parameter as $_POST in server side ajax handler
                            security: kamy_wc_addon.ajax_nonce,
                            action: 'kamy_wc_addon_ajaxform_submit'
                        },
                        success: function(data) {
                            $('.kamy_ticket_submit_form button').removeClass('disabled').removeAttr('disabled', 'disabled');
                            $.alert(data.data);
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(JSON.parse(jqXHR.responseText) + ' :: ' + textStatus + ' :: ' + errorThrown);
                            // $.alert(jqXHR);
                        },
                    });
                },
                errorPlacement: function(error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error);
                    } else {
                        error.insertAfter(element);
                    }
                },
                invalidHandler: function(event, validator) {
                    // 'this' refers to the form
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        var message = errors == 1 ?
                            'You missed 1 field. It has been highlighted' :
                            'You missed ' + errors + ' fields. They have been highlighted';
                        // $("div.error span").html(message);
                        // $("div.error").show();
                    } else {
                        // $("div.error").hide();
                    }
                }
            });
        });
        // End jQuery validate with jQuery ajaxForm

        // Start jQuery validate with jQuery ajaxForm
        $(".kamy_wc_addon_submit_form.reload").each(function() {
            $(this).validate({
                // debug: true,
                submitHandler: function(form) {
                    // jQuery ajaxForm handler
                    $(form).ajaxSubmit({
                        type: 'post',
                        url: kamy_wc_addon.admin_ajax_url,
                        beforeSerialize: function($form, options) {
                            // save tinymce before serialize form
                            if ($("#email_header").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#email_footer").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#post_content").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#email_content").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($(".wp-editor-container").length) {
                                tinyMCE.triggerSave();
                            }
                            // return false to cancel submit
                        },
                        beforeSubmit: function(formData, jqForm, options_no_reset) {
                            $('.kamy_ticket_submit_form button').addClass('disabled').attr('disabled', 'disabled');
                            return true;
                        },
                        data: {
                            // ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
                            // access form parameter as $_POST in server side ajax handler
                            security: kamy_wc_addon.ajax_nonce,
                            action: 'kamy_wc_addon_ajaxform_submit'
                        },
                        success: function(data) {
                            $('.kamy_ticket_submit_form button').removeClass('disabled').removeAttr('disabled', 'disabled');
                            window.location.reload(true);
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(JSON.parse(jqXHR.responseText) + ' :: ' + textStatus + ' :: ' + errorThrown);
                            // $.alert(jqXHR);
                        },
                    });
                },
                errorPlacement: function(error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error)
                    } else {
                        error.insertAfter(element);
                    }
                },
                invalidHandler: function(event, validator) {
                    // 'this' refers to the form
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        var message = errors == 1 ?
                            'You missed 1 field. It has been highlighted' :
                            'You missed ' + errors + ' fields. They have been highlighted';
                        // $("div.error span").html(message);
                        // $("div.error").show();
                    } else {
                        // $("div.error").hide();
                    }
                }
            });
        });
        // End jQuery validate with jQuery ajaxForm

        // Start jQuery validate with jQuery ajaxForm
        $(".kamy_wc_addon_submit_form.redirect").each(function() {
            $(this).validate({
                // debug: true,
                submitHandler: function(form) {
                    // jQuery ajaxForm handler
                    $(form).ajaxSubmit({
                        type: 'post',
                        url: kamy_wc_addon.admin_ajax_url,
                        beforeSerialize: function($form, options) {
                            // save tinymce before serialize form
                            if ($("#email_header").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#email_footer").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#post_content").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#email_content").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($(".wp-editor-container").length) {
                                tinyMCE.triggerSave();
                            }
                            // return false to cancel submit
                        },
                        beforeSubmit: function(formData, jqForm, options_no_reset) {
                            $('.kamy_ticket_submit_form button').addClass('disabled').attr('disabled', 'disabled');
                            return true;
                        },
                        data: {
                            // ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
                            // access form parameter as $_POST in server side ajax handler
                            security: kamy_wc_addon.ajax_nonce,
                            action: 'kamy_wc_addon_ajaxform_submit'
                        },
                        success: function(data) {
                            $('.kamy_ticket_submit_form button').removeClass('disabled').removeAttr('disabled', 'disabled');
                            if (data.success === true) {
                                document.location.href = data.data;
                            } else {
                                $.alert(data.data);
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(JSON.parse(jqXHR.responseText) + ' :: ' + textStatus + ' :: ' + errorThrown);
                            // $.alert(jqXHR);
                        },
                    });
                },
                errorPlacement: function(error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error)
                    } else {
                        error.insertAfter(element);
                    }
                },
                invalidHandler: function(event, validator) {
                    // 'this' refers to the form
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        var message = errors == 1 ?
                            'You missed 1 field. It has been highlighted' :
                            'You missed ' + errors + ' fields. They have been highlighted';
                        // $("div.error span").html(message);
                        // $("div.error").show();
                    } else {
                        // $("div.error").hide();
                    }
                }
            });
        });
        // End jQuery validate with jQuery ajaxForm

        // Start jQuery validate with jQuery ajaxForm
        $(".kamy_wc_addon_submit_form.alert-reload").each(function() {
            $(this).validate({
                // debug: true,
                submitHandler: function(form) {
                    // jQuery ajaxForm handler
                    $(form).ajaxSubmit({
                        type: 'post',
                        url: kamy_wc_addon.admin_ajax_url,
                        beforeSerialize: function($form, options) {
                            // save tinymce before serialize form
                            if ($("#email_header").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#email_footer").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#post_content").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#email_content").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($(".wp-editor-container").length) {
                                tinyMCE.triggerSave();
                            }
                            // return false to cancel submit
                        },
                        beforeSubmit: function(formData, jqForm, options_no_reset) {
                            $('.kamy_ticket_submit_form button').addClass('disabled').attr('disabled', 'disabled');
                            return true;
                        },
                        data: {
                            // ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
                            // access form parameter as $_POST in server side ajax handler
                            security: kamy_wc_addon.ajax_nonce,
                            action: 'kamy_wc_addon_ajaxform_submit'
                        },
                        success: function(data) {
                            if (data.success === true) {
                                $.confirm({
                                    title: '',
                                    content: data.data,
                                    buttons: {
                                        confirm: {
                                            text: kamy_wc_addon.closebuttontext,
                                            btnClass: 'btn-default',
                                            keys: ['enter'],
                                            action: function() {
                                                window.location.reload(true);
                                            }
                                        }
                                    }
                                });
                            } else {
                                $.alert(data.data);
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(JSON.parse(jqXHR.responseText) + ' :: ' + textStatus + ' :: ' + errorThrown);
                            // $.alert(jqXHR);
                        },
                    });
                },
                errorPlacement: function(error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error)
                    } else {
                        error.insertAfter(element);
                    }
                },
                invalidHandler: function(event, validator) {
                    // 'this' refers to the form
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        var message = errors == 1 ?
                            'You missed 1 field. It has been highlighted' :
                            'You missed ' + errors + ' fields. They have been highlighted';
                        // $("div.error span").html(message);
                        // $("div.error").show();
                    } else {
                        // $("div.error").hide();
                    }
                }
            });
        });
        // End jQuery validate with jQuery ajaxForm


        // Start jQuery validate with jQuery ajaxForm
        $(".kamy_wc_addon_submit_form.comment_form").each(function() {
            var _this_frm = $(this);
            $(this).validate({
                // debug: true,
                submitHandler: function(form) {
                    // jQuery ajaxForm handler
                    $(form).ajaxSubmit({
                        type: 'post',
                        url: kamy_wc_addon.admin_ajax_url,
                        beforeSerialize: function($form, options) {
                            if ($('.wp-editor-wrap.tmce-active').length) {
                                // tinyMCE.triggerSave(); // save tinymce before serialize form
                            }
                            // return false to cancel submit
                        },
                        beforeSubmit: function(formData, jqForm, options_no_reset) {
                            $('.kamy_ticket_submit_form button[type="submit"]').addClass('disabled').attr('disabled', 'disabled');
                            return true;
                        },
                        data: {
                            // ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
                            // access form parameter as $_POST in server side ajax handler
                            security: kamy_wc_addon.ajax_nonce,
                            action: 'kamy_wc_addon_ajaxform_submit'
                        },
                        success: function(data) {
                            $('.kamy_ticket_submit_form button[type="submit"]').removeClass('disabled').removeAttr('disabled', 'disabled');
                            if (_this_frm.hasClass('internal_comment')) {
                                $('#comment-list-internal').append(data.data);
                                $('.kamy_wc_addon_submit_form.comment_form.internal_comment').resetForm();
                            } else {
                                $('#comment-list').append(data.data);
                                $('.kamy_wc_addon_submit_form.comment_form').resetForm();
                            }

                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(JSON.parse(jqXHR.responseText) + ' :: ' + textStatus + ' :: ' + errorThrown);
                        },
                    });
                },
                invalidHandler: function(event, validator) {
                    // 'this' refers to the form
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        var message = errors == 1 ?
                            'You missed 1 field. It has been highlighted' :
                            'You missed ' + errors + ' fields. They have been highlighted';
                        $("div.error span").html(message);
                        $("div.error").show();
                    } else {
                        $("div.error").hide();
                    }
                }
            });
        });
        // End jQuery validate with jQuery ajaxForm

        // Start jQuery validate with jQuery ajaxForm
        $(".kamy_wc_addon_submit_form.upload-reload").each(function() {
            $(this).validate({
                // debug: true,
                submitHandler: function(form) {
                    // jQuery ajaxForm handler
                    $(form).ajaxSubmit({
                        type: 'post',
                        url: kamy_wc_addon.admin_ajax_url,
                        beforeSerialize: function($form, options) {
                            // save tinymce before serialize form
                            if ($("#email_header").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#email_footer").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#post_content").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($("#email_content").length) {
                                tinyMCE.triggerSave();
                            }
                            if ($(".wp-editor-container").length) {
                                tinyMCE.triggerSave();
                            }
                            // return false to cancel submit
                        },
                        beforeSubmit: function(formData, jqForm, options_no_reset) {
                            $('.kamy_ticket_submit_form button').addClass('disabled').attr('disabled', 'disabled');
                            return true;
                        },
                        data: {
                            // ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
                            // access form parameter as $_POST in server side ajax handler
                            security: kamy_wc_addon.ajax_nonce,
                            action: 'kamy_wc_addon_ajaxform_submit'
                        },
                        success: function(data) {
                            $('.kamy_ticket_submit_form button').removeClass('disabled').removeAttr('disabled', 'disabled');
                            iwoAddon.fn.fileTable.tableReload();
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(JSON.parse(jqXHR.responseText) + ' :: ' + textStatus + ' :: ' + errorThrown);
                            // $.alert(jqXHR);
                        },
                    });
                },
                errorPlacement: function(error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error)
                    } else {
                        error.insertAfter(element);
                    }
                },
                invalidHandler: function(event, validator) {
                    // 'this' refers to the form
                    var errors = validator.numberOfInvalids();
                    if (errors) {
                        var message = errors == 1 ?
                            'You missed 1 field. It has been highlighted' :
                            'You missed ' + errors + ' fields. They have been highlighted';
                        // $("div.error span").html(message);
                        // $("div.error").show();
                    } else {
                        // $("div.error").hide();
                    }
                }
            });
        });
        // End jQuery validate with jQuery ajaxForm
    }
    kamy_wc_addonValidateInit();

    // Customer
    $('#iwo_add_edit_customer').on('change', 'input[name=is_private_person]', function(e) {
        var isPrivate = $("input[name=is_private_person]:checked").val();

        if (isPrivate == 'n') {
            $('.warp_isPrivateIndividual').show();
        } else {
            $('.warp_isPrivateIndividual').hide();
        }
    });
    $('#iwo_add_edit_customer').on('click', 'input[name="_superuser_todo"]', function(e) {
        $('.create_new_user_warp,.add_superuser_from_exisiting_users_warp').hide();
        if ($(this).val() == 'create_new_user') {
            $('.create_new_user_warp').show();
        } else if ($(this).val() == 'add_superuser_from_exisiting_users') {
            $('.add_superuser_from_exisiting_users_warp').show();
        }
    });

    /* Show hide edit user edit status */
    $('body').on('click', '.wp_user_edit_customerIds', function(e) {
        e.preventDefault();

        var form = $('.' + $(this).data('form'));

        if (form.find('button.submit').is(":visible")) {
            form.find('.user_dispaly_custom_status').css('display', 'block');
            form.find('.user_dispaly_customers').css('display', 'block');
            form.find('.form-group').css('display', 'none');
            $(this).removeClass('linearicons-cross').addClass('linearicons-pencil');
        } else {
            form.find('.user_dispaly_custom_status').css('display', 'none');
            form.find('.user_dispaly_customers').css('display', 'none');
            form.find('.form-group').css('display', 'block');
            $(this).removeClass('linearicons-pencil').addClass('linearicons-cross');
        }
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