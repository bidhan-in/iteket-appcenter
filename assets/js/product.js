/**
 * This is an experimental script file
 * 
 * @see file iwo-addon/templates/admin/product/set.php
 * @since 2.0.29
 */
var iwoAddon = iwoAddon || {};
iwoAddon.fn = iwoAddon.fn || {};
iwoAddon.param = iwoAddon.param || {};
iwoAddon.config = iwoAddon.config || {};

// Define all functions
(function ($) {
	iwoAddon.param.window = $(window);
	iwoAddon.param.document = $(document);

	var $iwoSubmitForm = $('.kamy_wc_addon_experimental_submit_form');
	var $iwoSetProduct = $('#set-product-form');

	// Initialize the multiForm object
	iwoAddon.fn.multiForm = {
		formData: {
			no_nb: {},
			en_gb: {}
		},
		normalFormData: {},
		activeGroup: "no_nb",
		switchGroup: function (group) {
			$(".tab").removeClass("active");
			$("#" + group + "Tab").addClass("active");
			this.serizalizeFormData(group);
			// this.updateFormData();
		},
		serizalizeFormData: function (group, submit = false) {
			// jQuery ajaxForm handler
			$('#set-product-form').ajaxSubmit({
				type: 'post',
				url: kamy_wc_addon.adminAjaxUrl,
				beforeSerialize: function ($form, options) {
					// save tinymce before serialize form
					if ($(".wp-editor-container").length) {
						tinyMCE.triggerSave();
					}
					// return false to cancel submit
				},
				beforeSubmit: function (formData, jqForm, options_no_reset) {
					$('.kamy_wc_addon_experimental_submit_form button').addClass('disabled').attr('disabled', 'disabled');
					$('#set-product-form').css('opacity', '0.25');
					$('.tab').addClass('disabled').attr('disabled', 'disabled');
					return true;
				},
				data: {
					// ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
					// access form parameter as $_POST in server side ajax handler
					action: 'kamy_wc_addon_serialize_formdata'
				},
				success: function (data) {
					$('.kamy_wc_addon_experimental_submit_form button').removeClass('disabled').removeAttr('disabled', 'disabled');
					$('.kamy_wc_addon_experimental_submit_form.reset').resetForm();
					iwoAddon.fn.multiForm.formData[iwoAddon.fn.multiForm.activeGroup] = data;
					iwoAddon.fn.multiForm.activeGroup = group;
					iwoAddon.fn.multiForm.displayFormData(); // Call the displayFormData function after updating form data

					$('#set-product-form').css('opacity', '1');
					$('.tab').removeClass('disabled').removeAttr('disabled', 'disabled');
				},
				error: function (jqXHR, textStatus, errorThrown) {
					$('.kamy_wc_addon_experimental_submit_form button').removeClass('disabled').removeAttr('disabled', 'disabled');
					$('.kamy_wc_addon_experimental_submit_form.reset').resetForm();
					console.log(jqXHR.responseText + ' :: ' + textStatus + ' :: ' + errorThrown);
					// $.alert(jqXHR);
				},
			});
		},
		updateFormData: function () {
			var that = this;
			this.formData[this.activeGroup] = {};
			this.normalFormData = {};
			$.each(langEnabledFields, function (index, inputName) {
				var inputValue = "";
				var $inputField = $('[name="' + inputName + '"]');
				if ($inputField.length > 0) {
					var inputType = $inputField.attr("type");
					if (inputType === "checkbox" || inputType === "radio") {
						inputValue = $inputField.is(":checked");
						that.formData[that.activeGroup][inputName] = inputValue;
					} else if (inputType === "text" || inputType === "textarea") {
						inputValue = $inputField.val();
						that.formData[that.activeGroup][inputName] = inputValue;
					} else if ($inputField.hasClass('wp-editor-area')) {
						// Get content from TinyMCE editor
						inputValue = wp.editor.getContent($inputField.attr('id'));
						that.formData[that.activeGroup][inputName] = inputValue;
					} else {
						inputValue = $inputField.val();
						that.normalFormData[inputName] = inputValue;
					}
				}
			});

			$.each(langArrayEnabledFields, function (index, inputName) {
				var inputValue = "";
				var $inputFields = $('[name^="' + inputName + '"]');
				if ($inputFields.length > 0) {
					var arrayKeys = [];
					$inputFields.each(function () {
						var inputType = $(this).attr("type");
						var inputVal = $(this).val();

						// get the name attribute of the input
						var inputName = $(this).attr('name');

						// extract the array keys using regex
						var arrayKeyMatches = inputName.match(/\[(\d+)\]/g);
						if (arrayKeyMatches) {
							for (var i = 0; i < arrayKeyMatches.length; i++) {
								var arrayKey = parseInt(arrayKeyMatches[i].replace(/[\[\]]/g, ""));
								arrayKeys.push(arrayKey);
							}
						}

						// set the input value
						inputValue = inputVal;
					});

					// determine the inputName root and inputNameIndex
					var inputNameRoot = inputName;
					var inputNameIndex = null;
					var isArray = false;
					if (arrayKeys.length > 0) {
						isArray = true;
						inputNameRoot = inputNameRoot.replace(/\[\d+\]/g, "");
						inputNameIndex = arrayKeys.shift();
					}

				}
			});
		},
		displayFormData: function () {
			// Update input, textarea, and checkbox fields with form data for current active group
			var activeGroup = this.activeGroup;
			var formData = this.formData[activeGroup];

			// Update input fields
			$.each(formData, function (inputName, inputValue) {
				var $inputField = $('[name="' + inputName + '"]');
				if ($inputField.length > 0) {
					var inputType = $inputField.attr("type");
					if (inputType === "checkbox" || inputType === "radio") {
						$inputField.prop("checked", inputValue);
					} else if ($inputField.hasClass('wp-editor-area')) {
						var editorId = $inputField.attr('id');
						// Get the TinyMCE editor instance
						var editor = tinymce.get(editorId);
						// Add extra backslash before line breaks
						inputValue = inputValue.replace(/\n/g, '<br>');
						// Set the content of the editor
						editor.setContent(inputValue);
					} else {
						if (inputValue === '' || inputValue === undefined) {
							$inputField.val('');
						} else {
							$inputField.val(inputValue);
						}
					}
				}
			});

			// Update textarea fields
			$.each(formData, function (inputName, inputValue) {
				var $textareaField = $('[name="' + inputName + '"]');
				if ($textareaField.length > 0 && $textareaField.is("textarea")) {
					if (inputValue === '' || inputValue === undefined) {
						$textareaField.val('');
					} else {
						$textareaField.val(inputValue);
					}
				}
			});

			// assuming the server response is stored in a variable called `response`
			$.each(formData.addon_name, function (key, value) {
				$('input[name="addon_name[' + key + ']"]').val(value);
			});

			$.each(formData.addon_description, function (key, value) {
				$('textarea[name="addon_description[' + key + ']"]').val(value);
			});

			$.each(formData.addon_option_label, function (key, value) {
				var labels = value;
				$('#addon_rows_' + key + ' input[name="addon_option_label[' + key + '][]"]').each(function (i, elem) {
					$(elem).val(labels[i]);
				});
			});

			$.each(formData.woo_attr, function (key, value) {
				var labels = value;
				$('input[name="woo_attr[]"]').each(function (i, elem) {
					$(elem).val(labels[i]);
				});
			});
		},
		init: function () {
			if (!$('#set-product-form').length) {
				return false;
			}

			// Update formData with preFormData
			$.extend(true, iwoAddon.fn.multiForm.formData, preFormData);

			$(".tab").on("click", function () {
				var group = $(this).data("lang");
				iwoAddon.fn.multiForm.switchGroup(group);
			});

			$("#debug-product").on("click", function () {
				iwoAddon.fn.multiForm.debugFormData();
			});

			// Trigger initial switch to the default active group
			iwoAddon.fn.multiForm.activeGroup = startActiveGroup;
		},
		debugFormData: function () {
			console.log(this.formData);
		}
	};

	/**
	 * Ajax Form with jQuery validate
	 * 
	 * @type external callback
	 * @see https://teamtreehouse.com/community/submitting-a-form-in-wordpress-using-ajax
	 * @see https://$validation.org/validate/
	 * @see http://malsup.com/$/form/#ajaxSubmit
	 */
	iwoAddon.fn.validate = {
		init: function () {
			// Start jQuery validate with jQuery ajaxForm
			if ($iwoSubmitForm.length) {
				// nothing
			} else {
				return false;
			}

			$iwoSubmitForm.each(function () {
				var current = $(this);

				// check if event handler already exists
				// if exists, skip this item and go to next item
				if (current.data('validateInit')) {
					return true;
				}

				// flag item to prevent attaching handler again
				current.data('validateInit', true);

				// Set classSet parameter
				var classSet = 'reload';

				if (current.hasClass('reset') === true) {
					classSet = 'reset';
				}

				if (current.hasClass('no_reset') === true) {
					classSet = 'no_reset';
				}

				if (current.hasClass('reload') === true) {
					classSet = 'reload';
				}

				if (current.hasClass('redirect') === true) {
					classSet = 'redirect';
				}

				if (current.hasClass('alert-reload') === true) {
					classSet = 'alert-reload';
				}

				if (current.hasClass('product') === true) {
					classSet = 'product';
				}

				current.validate({
					// debug: true,
					submitHandler: function (form) {
						// ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
						// access form parameter as $_POST in server side ajax handler
						var dataSet = {
							security: kamy_wc_addon.ajaxNonce,
							action: 'kamy_wc_addon_ajaxform_submit'
						}

						if (classSet == 'product') {
							// Get the formData from iwoAddon.fn.multiForm object
							var formData = iwoAddon.fn.multiForm.formData;
							var activeGroup = iwoAddon.fn.multiForm.activeGroup;

							dataSet = {
								activeGroup: activeGroup,
								langData: formData,
								security: kamy_wc_addon.ajaxNonce,
								action: 'kamy_wc_addon_ajaxform_submit'
							}
						}

						// jQuery ajaxForm handler
						$(form).ajaxSubmit({
							type: 'post',
							url: kamy_wc_addon.adminAjaxUrl,
							beforeSerialize: function ($form, options) {
								// save tinymce before serialize form
								if ($(".wp-editor-container").length) {
									tinyMCE.triggerSave();
								}
								// return false to cancel submit
							},
							beforeSubmit: function (formData, jqForm, options_no_reset) {
								$('.kamy_wc_addon_experimental_submit_form button').addClass('disabled').attr('disabled', 'disabled');
								return true;
							},
							data: dataSet,
							success: function (data) {
								if (classSet == 'reset') {
									$('.kamy_wc_addon_experimental_submit_form button').removeClass('disabled').removeAttr('disabled', 'disabled');
									$('.kamy_wc_addon_experimental_submit_form.reset').resetForm();
	
									// Sweetalert2 confirm box
									// See https://limonte.github.io/sweetalert2/
									swal({
										title: 'Ops!',
										text: data.data,
										type: 'info',
										confirmButtonColor: '#dcdcdc',
										confirmButtonText: kamy_wc_addon.closebuttontext,
										confirmButtonClass: 'btn btn-effect-ripple btn-default button',
									}).then(function () {
										// window.location.reload(true);
									});
								}

								if (classSet == 'no_reset') {
									$('.kamy_wc_addon_experimental_submit_form button').removeClass('disabled').removeAttr('disabled', 'disabled');

									// Sweetalert2 confirm box
									// See https://limonte.github.io/sweetalert2/
									swal({
										title: 'Ops!',
										text: data.data,
										type: 'info',
										confirmButtonColor: '#dcdcdc',
										confirmButtonText: kamy_wc_addon.closebuttontext,
										confirmButtonClass: 'btn btn-effect-ripple btn-default button',
									}).then(function () {
										// window.location.reload(true);
									});
								}
								
								if (classSet == 'reload') {
									$('.kamy_wc_addon_experimental_submit_form button').removeClass('disabled').removeAttr('disabled', 'disabled');
									window.location.reload(true);
								}
								
								if (classSet == 'redirect' || classSet == 'product') {
									$('.kamy_wc_addon_experimental_submit_form button').removeClass('disabled').removeAttr('disabled', 'disabled');
									if (data.success === true) {
										// window.location.reload(true);
										document.location.href = data.data;
									} else {
										// Sweetalert2 confirm box
										// See https://limonte.github.io/sweetalert2/
										swal({
											title: 'Ops!',
											text: data.data,
											type: 'info',
											confirmButtonColor: '#dcdcdc',
											confirmButtonText: kamy_wc_addon.closebuttontext,
											confirmButtonClass: 'btn btn-effect-ripple btn-default button',
										}).then(function () {
											// window.location.reload(true);
										});
									}
								}
								
								if (classSet == 'alert-reload') {
									if (data.success === true) {
										// Sweetalert2 confirm box
										// See https://limonte.github.io/sweetalert2/
										swal({
											title: 'Ops!',
											text: data.data,
											type: 'success',
											confirmButtonColor: '#dcdcdc',
											confirmButtonText: kamy_wc_addon.closebuttontext,
											confirmButtonClass: 'btn btn-effect-ripple btn-default button',
										}).then(function () {
											window.location.reload(true);
										});
									} else {
										// Sweetalert2 confirm box
										// See https://limonte.github.io/sweetalert2/
										swal({
											title: 'Ops!',
											text: data.data,
											type: 'info',
											confirmButtonColor: '#dcdcdc',
											confirmButtonText: kamy_wc_addon.closebuttontext,
											confirmButtonClass: 'btn btn-effect-ripple btn-default button',
										}).then(function () {
											// window.location.reload(true);
										});
									}
								}
							},
							error: function (jqXHR, textStatus, errorThrown) {
								console.log(jqXHR.responseText + ' :: ' + textStatus + ' :: ' + errorThrown);
								// $.alert(jqXHR);
							},
						});
					},
					errorPlacement: function (error, element) {
						var placement = $(element).data('error');
						if (placement) {
							$(placement).append(error)
						} else {
							error.insertAfter(element);
						}
					},
					invalidHandler: function (event, validator) {
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
	}

	/**
	 * Script for #set-product-form
	 * The set product form
	 */
	iwoAddon.fn.formScript = {
		setImage: function() {
			// Start media library
			$iwoSetProduct.on('click', '#add-featured-image', function (e) {
				var $el = $(this).parent();
				e.preventDefault();
				var uploader = wp.media({
					title: kamy_wc_addon.add_media,
					button: {
						text: kamy_wc_addon.apply_media
					},
					multiple: false
				})
					.on('select', function () {
						var selection = uploader.state().get('selection');
						var attachment = selection.first().toJSON();
						$('#feather-image-url', $el).val(attachment.url);
						$('#feather-image-id', $el).val(attachment.id);
						$('#feather-image-preview', $el).attr('src', attachment.url);
					})
					.open();
			});
		
			$iwoSetProduct.on('click', '#remove-featured-image', function (e) {
				var $el = $(this).parent();
				$('#feather-image-url', $el).val('');
				$('#feather-image-id', $el).val('');
				$('#feather-image-preview', $el).attr('src', '');
			});
			// End media library
		},
		productType: function() {
			$iwoSetProduct.on('toggle click change ifClicked ifChanged ifToggled', '#product_type_simple, #product_type_variable', function (e) {
				if ($('#product_type_variable').is(':checked')) {
					$('.wc_attr_n_variation_block').slideDown('slow');
					$('.wc_attr_n_simple_block').slideUp('slow');
				} else {
					$('.wc_attr_n_variation_block').slideUp('slow');
					$('.wc_attr_n_simple_block').slideDown('slow');
				}
			});
		},
		priceTag: function() {
			// Start product editor form
			$iwoSetProduct.on('toggle click change ifClicked ifChanged ifToggled', '#price_tag_single, #price_tag_multi', function (e) {
				if ($('#price_tag_single').is(':checked')) {
					$('.price_tag_option').hide();
					$('.price_tag_option_single').show();
				} else if ($('#price_tag_multi').is(':checked')) {
					$('.price_tag_option').hide();
					$('.price_tag_option_multi').show();
				}
			});
		
			$iwoSetProduct.on('toggle click change ifClicked ifChanged ifToggled', '#enabled_early_bird', function (e) {
				if ($(this).prop("checked") == true) {
					$('#early_bird_enabled').show();
				} else if ($(this).prop("checked") == false) {
					$('#early_bird_enabled').hide();
				}
		
			});
		},
		stock: function() {
			// Simple product
			$iwoSetProduct.on('toggle click change ifClicked ifChanged ifToggled', '.simple_product_manage_stock_oce', function (e) {
		
				if ($(this).prop("checked") == true) {
					$('.simple_product_manage_stock_fields').show();
		
				} else if ($(this).prop("checked") == false) {
					$('.simple_product_manage_stock_fields').hide();
				}
		
			});
		
			// For variable produtcts 
			$iwoSetProduct.on('toggle click change ifClicked ifChanged ifToggled', '.variation_enabled_early_bird', function (e) {
				var num = $(this).data('num');
		
				if ($(this).prop("checked") == true) {
					$('.variation_early_bird_group_' + num).show();
		
				} else if ($(this).prop("checked") == false) {
					$('.variation_early_bird_group_' + num).hide();
		
				}
		
			});

			$iwoSetProduct.on('toggle click change ifClicked ifChanged ifToggled', '.variable_manage_stock_oce', function (e) {
				var num = $(this).data('num');
		
				if ($(this).prop("checked") == true) {
					$('.variable_stock_status_warp_' + num).hide();
				} else if ($(this).prop("checked") == false) {
					$('.variable_stock_status_warp_' + num).show();
				}
			});
			
			$iwoSetProduct.on('click', '.show-stock-history', function (e) {
				e.preventDefault();
				var $a = $(this);
				var postID = $(this).data('id');

				// escape if it is running
				if ($a.hasClass('disabled')) {
					return false;
				}

				// switch icon
				$a.addClass('disabled');

				$.ajax({
					type: 'post',
					url: kamy_wc_addon.adminAjaxUrl,
					beforeSerialize: function ($form, options) {
						// return false to cancel submit
					},
					beforeSubmit: function (formData, jqForm, options_no_reset) {
						return true;
					},
					data: {
						// ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
						// access form parameter as $_POST in server side ajax handler
						security: kamy_wc_addon.ajaxNonce,
						action: 'oslomet_show_stock_history',
						productID: postID
					},
					success: function (data) {
						$a.removeClass('disabled');
						$('#kmsGenPopUp').html(data.data).show();
					},
					error: function (jqXHR, textStatus, errorThrown) {
						// switch icon
						$a.removeClass('disabled');
						console.log(jqXHR.responseText + ' :: ' + textStatus + ' :: ' + errorThrown);
						// $.alert(jqXHR);
					},
				});
			});
		},
		addOn: function() {
			$iwoSetProduct.on('toggle click change ifClicked ifChanged ifToggled', '#enabled_addons', function (e) {
				if ($(this).prop("checked") == true) {
					$('#addon_contianer').show();
		
				} else if ($(this).prop("checked") == false) {
					$('#addon_contianer').hide();
				}
			});
		
			$iwoSetProduct.on('click', '#add_addon', function (e) {
				var timestamp = Math.floor(Math.random() * 999558681581); //$.now();
				var text = kamy_wc_addon.addon_item;
				text = text.replace(/%replaceMe%/g, timestamp);
				$('#addon_contianer').append(text);
				oslomet_woocommerce_iCheck();
			});
		
			$iwoSetProduct.on('click', '.add_addon_option', function (e) {
				var dID = $(this).val();
				var text = kamy_wc_addon.addon_row;
				text = text.replace(/%replaceMe%/g, dID);
				$('#addon_rows_' + dID).append(text);
			});
		
			$iwoSetProduct.on('click', '.add_legacy_addon_option', function (e) {
				var timestamp = $.now();
				var text = kamy_wc_addon.legacy_addon_row;
				text = text.replace(/%replaceMe%/g, timestamp);
				$('.product_legacy_addon_option_group').append(text);
			});
		
			$iwoSetProduct.on('click', '.remove_addon_item', function (e) {
				var dID = $(this).val();
				$('#addon_item_' + dID).remove();
			});
		
			$iwoSetProduct.on('click', '.remove_addon_option', function (e) {
				$(this).parent().parent().remove();
			});
		},
		checkOut: function() {
			$iwoSetProduct.on('toggle click change ifClicked ifChanged ifToggled', '#checkout_form_settings', function (e) {
				if ($(this).prop("checked") == true) {
					$('#checkout_form_contianer').show();
		
				} else if ($(this).prop("checked") == false) {
					$('#checkout_form_contianer').hide();
				}
			});
		},
		report: function() {
			$iwoSetProduct.on('toggle click change ifClicked ifChanged ifToggled', '#report_settings', function (e) {
				if ($('#report_settings_contianer').is(':visible')) {
					$('#report_settings_contianer').hide();
				} else {
					$('#report_settings_contianer').show();
				}
			});
		},
		datapicker: function() {
			// datepicker
			if ($('.have_datepicker_alter').length) {
				$('.have_datepicker_alter').each(function () {
					var current = $(this);

					// check if event handler already exists
					// if exists, skip this item and go to next item
					if (current.data('datepickerInit')) {
						return true;
					}

					// flag item to prevent attaching handler again
					current.data('datepickerInit', true);

					current.datepicker({
						language: 'no',
						dateFormat: 'yyyy-mm-dd'
					});
				});
			}
		},
		coupon: function() {
			// Start jQuery validate with jQuery ajaxForm
			$(".oslomet_woocommerce_coupon_form").each(function () {
				var current = $(this);

				// check if event handler already exists
				// if exists, skip this item and go to next item
				if (current.data('validateInit')) {
					return true;
				}

				// flag item to prevent attaching handler again
				current.data('validateInit', true);

				current.validate({
					// debug: true,
					submitHandler: function (form) {
						// jQuery ajaxForm handler
						$(form).ajaxSubmit({
							type: 'post',
							url: kamy_wc_addon.adminAjaxUrl,
							beforeSerialize: function ($form, options) {
								// save tinymce before serialize form
								if ($(".wp-editor-container").length) {
									tinyMCE.triggerSave();
								}
								// return false to cancel submit
							},
							beforeSubmit: function (formData, jqForm, options_no_reset) {
								$('.oslomet_woocommerce_coupon_form button').addClass('disabled').attr('disabled', 'disabled');
								return true;
							},
							data: {
								// ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
								// access form parameter as $_POST in server side ajax handler
								security: kamy_wc_addon.ajaxNonce,
								action: 'oslomet_woocommerce_ajaxform_submit'
							},
							success: function (data) {
								if (data.success === true) {
									// window.location.reload(true);
									$.featherlight.close();
									$.confirm({
										title: '',
										content: data.data,
										buttons: {
											confirm: {
												text: kamy_wc_addon.closebuttontext,
												btnClass: 'btn-default',
												keys: ['enter'],
												action: function () {
													window.location.reload(true);
												}
											}
										}
									});
								} else {
									$.alert(data.data);
								}
								$('.oslomet_woocommerce_coupon_form button').removeClass('disabled').removeAttr('disabled', 'disabled');
							},
							error: function (jqXHR, textStatus, errorThrown) {
								console.log(jqXHR.responseText + ' :: ' + textStatus + ' :: ' + errorThrown);
								// $.alert(jqXHR);
							},
						});
					},
					errorPlacement: function (error, element) {
						var placement = $(element).data('error');
						if (placement) {
							$(placement).append(error)
						} else {
							error.insertAfter(element);
						}
					},
					invalidHandler: function (event, validator) {
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

			$('#kmsGenPopUp').on('click', '.new-coupon', function (e) {
				e.preventDefault();

				var couponWrapper = $('#new-coupon-table-wrapper');

				if (!couponWrapper.is(':visible')) {
					couponWrapper.show();
				} else {
					$('#new-coupon-table>tbody', '#kmsGenPopUp').append(kamy_wc_addon.coupon_line);
					osloMetDatepicker();
				}
			});

			$('#kmsGenPopUp').on('click', '.remove-coupon', function (e) {
				e.preventDefault();
				var current = $(this);
				var postID = current.data('pid');
				var title_text = current.data('title');
				var content_text = current.data('content');

				if (postID == '0' || postID == 0) {
					current.parents('.new-coupon-row').remove();
					return;
				}

				swal({
					// Confirm box settings
					title: title_text,
					text: content_text,
					type: 'question',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: kamy_wc_addon.yes,
					cancelButtonText: kamy_wc_addon.no,
					confirmButtonClass: 'btn btn-effect-ripple btn-success button',
					cancelButtonClass: 'btn btn-effect-ripple btn-danger button',
					buttonsStyling: false
				}).then(function () {
					$.ajax({
						url: kamy_wc_addon.adminAjaxUrl,
						type: 'post',
						data: {
							coupon_id: postID,
							security: kamy_wc_addon.ajaxNonce,
							action: 'oslomet_woocommerce_ajaxform_submit',
							submit: 'delete_coupon'
						},
						success: function (data) {
							if (data.success == true) {
								current.parents('.new-coupon-row').remove();
								swal({
									title: '',
									text: data.data,
									type: 'info',
									confirmButtonColor: '#dcdcdc',
									confirmButtonText: kamy_wc_addon.okay,
									confirmButtonClass: 'btn btn-effect-ripple btn-default button',
								}).then(function () {
									// window.location.reload(true);
								});
							}
							$('button').removeClass('disabled').removeAttr('disabled');
						},
						error: function (jqXHR, textStatus, errorThrown) {
							console.log(jqXHR.responseText + ' :: ' + textStatus + ' :: ' + errorThrown);
							$('button').removeClass('disabled').removeAttr('disabled');
						}
					});
				}, function (dismiss) {
					// dismiss can be 'cancel', 'overlay',
					// 'close', and 'timer'
					if (dismiss === 'cancel') {
						// nothing happens
					}
				});
			});

			$iwoSetProduct.on('click', '.open_wc_coupons', function (e) {
				e.preventDefault();

				$('button').addClass('disabled').attr('disabled', 'disabled');

				var postID = $(this).data('id');

				$.ajax({
					url: kamy_wc_addon.adminAjaxUrl,
					type: 'post',
					data: {
						post_id: postID,
						security: kamy_wc_addon.ajaxNonce,
						action: 'open_oslomet_wc_coupon'
					},
					success: function (data) {
						if (data.success == true) {
							$('#kmsGenPopUp').html(data.data).show();

							// datepicker
							osloMetDatepicker();
							OsloMetCouponEditor();
							loadDummySubmit();
						} else {
							alert(data.data);
						}
						$('button').removeClass('disabled').removeAttr('disabled');
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log(jqXHR.responseText + ' :: ' + textStatus + ' :: ' + errorThrown);
						$('button').removeClass('disabled').removeAttr('disabled');
					}
				});
			});
		},
		onlyNumber: function() {
			//if the letter is not digit then don't type anything
			$('.input_only_number').on('keypress', function (e) {
				if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
					return false;
				}
			});
		},
		DummySubmit: function () {
			$('.dummy_submit').on('click', function (e) {
				e.preventDefault();

				var get_submit = $(this).val();
				var title_text = $(this).data('title');
				var content_text = $(this).data('content');

				/**
				 * Sweetalert2 confirm box
				 * 
				 * See https://limonte.github.io/sweetalert2/
				 */
				swal({
					// Confirm box settings
					title: title_text,
					text: content_text,
					type: 'question',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: kamy_wc_addon.yes,
					cancelButtonText: kamy_wc_addon.no,
					confirmButtonClass: 'btn btn-effect-ripple btn-success button',
					cancelButtonClass: 'btn btn-effect-ripple btn-danger button',
					buttonsStyling: false
				}).then(function () {
					$(get_submit).click();
				}, function (dismiss) {
					// dismiss can be 'cancel', 'overlay',
					// 'close', and 'timer'
					if (dismiss === 'cancel') {
						// nothing happens
					}
				});
			});
		},
		init: function() {
			iwoAddon.fn.formScript.setImage();
			iwoAddon.fn.formScript.productType();
			iwoAddon.fn.formScript.priceTag();
			iwoAddon.fn.formScript.stock();
			iwoAddon.fn.formScript.addOn();
			iwoAddon.fn.formScript.checkOut();
			iwoAddon.fn.formScript.report();
			iwoAddon.fn.formScript.datapicker();
			iwoAddon.fn.formScript.coupon();
			iwoAddon.fn.formScript.onlyNumber();
			iwoAddon.fn.formScript.DummySubmit();
		}
	}

	iwoAddon.fn.productScript = {
		no_nb: function() {
			// Duplicate post
			// jQuery ajaxForm handler
			$('body').on('click', '.post-duplicate', function (e) {
				e.preventDefault();
				var postID = $(this).data('id');
		
				$.ajax({
					type: 'post',
					url: kamy_wc_addon.adminAjaxUrl,
					beforeSerialize: function ($form, options) {
						// return false to cancel submit
					},
					beforeSubmit: function (formData, jqForm, options_no_reset) {
						$.alert('Duplication start.');
						$('.kamy_wc_addon_experimental_submit_form button').addClass('disabled').attr('disabled', 'disabled');
						return true;
					},
					data: {
						// ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
						// access form parameter as $_POST in server side ajax handler
						security: kamy_wc_addon.ajaxNonce,
						action: 'oslomet_duplicate_post',
						post_id: postID
					},
					success: function (data) {
						if (data.success === true) {
							// window.location.reload(true);
							window.location.reload(true);
						} else {
							$.alert(data.data);
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log(jqXHR.responseText + ' :: ' + textStatus + ' :: ' + errorThrown);
						// $.alert(jqXHR);
					},
				});
			});
		},
		en_gb: function() {
			// Duplicate post
			// jQuery ajaxForm handler
			$('body').on('click', '.post-english-duplicate', function (e) {
				e.preventDefault();
				var postID = $(this).data('id');
		
				$.ajax({
					type: 'post',
					url: kamy_wc_addon.adminAjaxUrl,
					beforeSerialize: function ($form, options) {
						// return false to cancel submit
					},
					beforeSubmit: function (formData, jqForm, options_no_reset) {
						$.alert('Duplication start.');
						$('.kamy_wc_addon_experimental_submit_form button').addClass('disabled').attr('disabled', 'disabled');
						return true;
					},
					data: {
						// ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
						// access form parameter as $_POST in server side ajax handler
						security: kamy_wc_addon.ajaxNonce,
						action: 'oslomet_english_duplicate',
						post_id: postID
					},
					success: function (data) {
						if (data.success === true) {
							// window.location.reload(true);
							window.location.reload(true);
						} else {
							$.alert(data.data);
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log(jqXHR.responseText + ' :: ' + textStatus + ' :: ' + errorThrown);
						// $.alert(jqXHR);
					},
				});
			});
		},
		bundle: function() {
			// Duplicate post
			// jQuery ajaxForm handler
			$('body').on('click', '.post-bundle-product-duplicate', function (e) {
				e.preventDefault();
				var postID = $(this).data('id');
		
				$.ajax({
					type: 'post',
					url: kamy_wc_addon.adminAjaxUrl,
					beforeSerialize: function ($form, options) {
						// return false to cancel submit
					},
					beforeSubmit: function (formData, jqForm, options_no_reset) {
						$.alert('Duplication start.');
						$('.kamy_wc_addon_experimental_submit_form button').addClass('disabled').attr('disabled', 'disabled');
						return true;
					},
					data: {
						// ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
						// access form parameter as $_POST in server side ajax handler
						security: kamy_wc_addon.ajaxNonce,
						action: 'oslomet_bundle_product_duplicate',
						post_id: postID
					},
					success: function (data) {
						if (data.success === true) {
							// window.location.reload(true);
							window.location.reload(true);
						} else {
							$.alert(data.data);
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log(jqXHR.responseText + ' :: ' + textStatus + ' :: ' + errorThrown);
						// $.alert(jqXHR);
					},
				});
			});
		}, 
		init: function() {
			iwoAddon.fn.productScript.no_nb();
			iwoAddon.fn.productScript.en_gb();
			iwoAddon.fn.productScript.bundle();
		}
	}

	/**
	 * @deprecated
	 */
	iwoAddon.fn.bundleProduct = {
		init: function() {

			/* Add/edit bundle-product page. Add/remove product row */

			$('body').on('click', '#add_bundle_product_product_row', function (e) {
				e.preventDefault();
				$('._bundle_product_product_row_rows').append(kamy_wc_addon.bundle_product_product_row);
			});

			$('body').on('click', '.remove_bundle_product_product_row', function (e) {
				e.preventDefault();
				$(this).parent().parent().remove();
			});


			// Bundle poroduct post manage addon
			$('body').on('click', '._bundled_products_manage_addon', function (e) {
				e.preventDefault();
				var post_id = $(this).data('id');


				$.ajax({
					url: kamy_wc_addon.adminAjaxUrl,
					type: 'post',
					data: {
						post_id: post_id,
						security: kamy_wc_addon.ajaxNonce,
						action: 'oslomet_woocommerce_ajaxform_submit',
						submit: 'bundled_products_manage_addon_frm',

					},
					success: function (data) {

						$('.ajax-loader-ct').hide();
						$('#kmsGenPopUp').html(data).show();
						$('.kms-pu-close,.btn_cancel_update_ticket').click(function (e) {
							$('#kmsGenPopUp').html('').hide();
						});

						OsloMet_WooCommerceValidateInit();
					}
				});
			});
		}
	}

	iwoAddon.fn.bilag = {
		init: function() {
			// Bilag function
			$('body').on('click', '.bilag_include_all', function (e) {
				if ($(this).prop("checked") == true) {
					$('.bilag_includes').prop("checked", true);
				} else if ($(this).prop("checked") == false) {
					$('.bilag_includes').prop("checked", false);
				}
			});
		}
	}

	iwoAddon.fn.orderScript = {
		complete: function() {
			// jQuery ajaxForm handler
			$('body').on('click', '.oslomet-complete-order', function (e) {
				e.preventDefault();
				var $a = $(this);
				var postID = $(this).data('id');

				// escape if it is running
				if ($a.hasClass('disabled')) {
					return false;
				}

				// switch icon
				$a.addClass('disabled');
				$a.find('span').attr('class', 'linearicons-hourglass');

				$.ajax({
					type: 'post',
					url: kamy_wc_addon.adminAjaxUrl,
					beforeSerialize: function ($form, options) {
						// return false to cancel submit
					},
					beforeSubmit: function (formData, jqForm, options_no_reset) {
						$('.kamy_wc_addon_experimental_submit_form button').addClass('disabled').attr('disabled', 'disabled');
						return true;
					},
					data: {
						// ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
						// access form parameter as $_POST in server side ajax handler
						security: kamy_wc_addon.ajaxNonce,
						action: 'oslomet_quick_complete_order',
						order_id: postID
					},
					success: function (data) {
						if (data.success === true) {
							// switch icon
							$a.find('span').attr('class', 'linearicons-loading3');
							// window.location.reload(true);
							window.location.reload(true);
						} else {
							// switch icon
							$a.removeClass('disabled');
							$a.find('span').attr('class', 'linearicons-check');
							$.alert(data.data);
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						// switch icon
						$a.removeClass('disabled');
						$a.find('span').attr('class', 'linearicons-check');
						console.log(jqXHR.responseText + ' :: ' + textStatus + ' :: ' + errorThrown);
						// $.alert(jqXHR);
					},
				});
			});
		},
		free: function() {

			$('body').on('click', '.oslomet-free-order', function (e) {
				e.preventDefault();
				var $a = $(this);
				var postID = $(this).data('id');

				// escape if it is running
				if ($a.hasClass('disabled')) {
					return false;
				}

				// switch icon
				$a.addClass('disabled');
				$a.find('span').attr('class', 'linearicons-hourglass');

				$.ajax({
					type: 'post',
					url: kamy_wc_addon.adminAjaxUrl,
					beforeSerialize: function ($form, options) {
						// return false to cancel submit
					},
					beforeSubmit: function (formData, jqForm, options_no_reset) {
						$('.kamy_wc_addon_experimental_submit_form button').addClass('disabled').attr('disabled', 'disabled');
						return true;
					},
					data: {
						// ajaxSubmit contains already <form> element parameter in serialized version, no need to include form again
						// access form parameter as $_POST in server side ajax handler
						security: kamy_wc_addon.ajaxNonce,
						action: 'oslomet_quick_free_order',
						order_id: postID
					},
					success: function (data) {
						if (data.success === true) {
							// switch icon
							$a.find('span').attr('class', 'linearicons-loading3');
							// window.location.reload(true);
							window.location.reload(true);
						} else {
							// switch icon
							$a.removeClass('disabled');
							$a.find('span').attr('class', 'linearicons-teacup');
							$.alert(data.data);
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						// switch icon
						$a.removeClass('disabled');
						$a.find('span').attr('class', 'linearicons-teacup');
						console.log(jqXHR.responseText + ' :: ' + textStatus + ' :: ' + errorThrown);
						// $.alert(jqXHR);
					},
				});
			});
		},
		init: function() {
			iwoAddon.fn.orderScript.complete();
			iwoAddon.fn.orderScript.free();
		}
	}
})(jQuery);

// Execute on page loaded
jQuery(document).ready(function ($) {
	iwoAddon.fn.multiForm.init();
	iwoAddon.fn.validate.init();
	iwoAddon.fn.formScript.init();
	iwoAddon.fn.productScript.init();
	iwoAddon.fn.bundleProduct.init();
	iwoAddon.fn.bilag.init();
	iwoAddon.fn.orderScript.init();
});
