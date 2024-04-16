jQuery(function($) {
    
    
    $('.field_customer_type input[name="customer_type"]').click(function (e) { 
        $('.field_customer_name, .field_org_number ').hide();
        if($(this).val() == 'company'){
            $('.field_customer_name, .field_org_number ').show();
        }
        else if($(this).val() == 'private_person'){
            $('.field_customer_name').show();
        }
    });
    $('.woocommerce-checkout.kco-checkout .create-account #createaccount').click(function (e) { 
        
        if($(this).is(":checked")){
            $('p#customer_type_field').show();
        }else{
            $('p#customer_type_field').hide();
            $('.field_customer_name, .field_org_number ').hide();
            return;
        }

        
        var type = $('.field_customer_type input[name="customer_type"]:checked').val();
        if(type == 'company'){
            $('.field_customer_name, .field_org_number ').show();
        }
        else if(type == 'private_person'){
            $('.field_customer_name').show();
        }else{
            $('.field_customer_name, .field_org_number ').hide();
        }

    });
    /*  Close the expandalbe card box in single product page except the first one */
    var card_loop = 1;
    $('body.single-product .entry-summary .card-header').each( function(index, value) {
        if(card_loop > 1){
            $(this).find('.product-desc-btn-container').addClass('show');
            $(this).parent().find('.card-body').removeClass('show'); 
        }
        card_loop++;                
    });

    /**
     * Ajax Form with jQuery validate
     * 
     * See https://teamtreehouse.com/community/submitting-a-form-in-wordpress-using-ajax
     * See https://$validation.org/validate/
     * See http://malsup.com/$/form/#ajaxSubmit
     */

    function emailPortalValidateInit() {
        // Start jQuery validate with jQuery ajaxForm
        $(".email_portal_submit_form.reset").each(function() {
            $(this).validate({
                // debug: true,
                submitHandler: function(form) {
                    // jQuery ajaxForm handler
                    $(form).ajaxSubmit({
                        type: 'post',
                        url: admin - portal.admin_ajax_url,
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
                            $('.email_portal_submit_form button').addClass('disabled').attr('disabled', 'disabled');
                            return true;
                        },
                        data: {
                            // ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
                            // access form parameter as $_POST in server side ajax handler
                            security: admin - portal.ajax_nonce,
                            action: 'email_portal_ajaxform_submit'
                        },
                        success: function(data) {
                            $('.email_portal_submit_form button').removeClass('disabled').removeAttr('disabled', 'disabled');
                            $('.email_portal_submit_form.reset').resetForm();
                            $.alert(data.data);
                            // $('.email_portal_submit_form .clear-on-submit').clearFields();
                            // $('#feather-image-preview').attr('src', '');
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
                            console.log($.parseJSON(jqXHR.responseText) + ' :: ' + textStatus + ' :: ' + errorThrown);
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
        $(".email_portal_submit_form.no_reset").each(function() {
            $(this).validate({
                // debug: true,
                submitHandler: function(form) {
                    // jQuery ajaxForm handler
                    $(form).ajaxSubmit({
                        type: 'post',
                        url: admin - portal.admin_ajax_url,
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
                            $('.email_portal_submit_form button').addClass('disabled').attr('disabled', 'disabled');
                            return true;
                        },
                        data: {
                            // ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
                            // access form parameter as $_POST in server side ajax handler
                            security: admin - portal.ajax_nonce,
                            action: 'email_portal_ajaxform_submit'
                        },
                        success: function(data) {
                            $('.email_portal_submit_form button').removeClass('disabled').removeAttr('disabled', 'disabled');
                            $.alert(data.data);
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log($.parseJSON(jqXHR.responseText) + ' :: ' + textStatus + ' :: ' + errorThrown);
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
        $(".email_portal_submit_form.reload").each(function() {
            $(this).validate({
                // debug: true,
                submitHandler: function(form) {
                    // jQuery ajaxForm handler
                    $(form).ajaxSubmit({
                        type: 'post',
                        url: admin - portal.admin_ajax_url,
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
                            $('.email_portal_submit_form button').addClass('disabled').attr('disabled', 'disabled');
                            return true;
                        },
                        data: {
                            // ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
                            // access form parameter as $_POST in server side ajax handler
                            security: admin - portal.ajax_nonce,
                            action: 'email_portal_ajaxform_submit'
                        },
                        success: function(data) {
                            $('.email_portal_submit_form button').removeClass('disabled').removeAttr('disabled', 'disabled');
                            window.location.reload(true);
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log($.parseJSON(jqXHR.responseText) + ' :: ' + textStatus + ' :: ' + errorThrown);
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
        $(".email_portal_submit_form.redirect").each(function() {
            $(this).validate({
                // debug: true,
                submitHandler: function(form) {
                    // jQuery ajaxForm handler
                    $(form).ajaxSubmit({
                        type: 'post',
                        url: admin - portal.admin_ajax_url,
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
                            $('.email_portal_submit_form button').addClass('disabled').attr('disabled', 'disabled');
                            return true;
                        },
                        data: {
                            // ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
                            // access form parameter as $_POST in server side ajax handler
                            security: admin - portal.ajax_nonce,
                            action: 'email_portal_ajaxform_submit'
                        },
                        success: function(data) {
                            $('.email_portal_submit_form button').removeClass('disabled').removeAttr('disabled', 'disabled');
                            if (data.success === true) {
                                // window.location.reload(true);
                                document.location.href = data.data;
                            } else {
                                $.alert(data.data);
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log($.parseJSON(jqXHR.responseText) + ' :: ' + textStatus + ' :: ' + errorThrown);
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
        $(".email_portal_submit_form.alert-reload").each(function() {
            $(this).validate({
                // debug: true,
                submitHandler: function(form) {
                    // jQuery ajaxForm handler
                    $(form).ajaxSubmit({
                        type: 'post',
                        url: admin - portal.admin_ajax_url,
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
                            $('.email_portal_submit_form button').addClass('disabled').attr('disabled', 'disabled');
                            return true;
                        },
                        data: {
                            // ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
                            // access form parameter as $_POST in server side ajax handler
                            security: admin - portal.ajax_nonce,
                            action: 'email_portal_ajaxform_submit'
                        },
                        success: function(data) {
                            if (data.success === true) {
                                // window.location.reload(true);
                                //$.featherlight.close();
                                $.confirm({
                                    title: '',
                                    content: data.data,
                                    buttons: {
                                        confirm: {
                                            text: admin - portal.closebuttontext,
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
                            console.log($.parseJSON(jqXHR.responseText) + ' :: ' + textStatus + ' :: ' + errorThrown);
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
    // emailPortalValidateInit();
});