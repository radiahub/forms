// ============================================================================
// Module      : single_image.js
// Version     : 2.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : General
// Description : single_image form plugin
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 25-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

function single_image (myform, input_id, options)
{
	var that = this;
	this.input_id = input_id;
	this.dataURL  = "";

	this.show = function()
	{
		//console.info("IN single_image.show() input_id='" + input_id + "'");

		var element = jQuery("#" + input_id).closest(".question").find(".thumbnail").get(0);
		var view_resize = options["view_resize"];
		if (strcasecmp(view_resize, "YES") === 0) {
			if (strlen(that.dataURL) > 0) {
				var width  = element.getBoundingClientRect().width;
				var height = width;
				image.geometry(that.dataURL) 
				.then ((geometry)=>{
					if (geometry["ratio_w_over_h"] > 0) {
						height = Math.floor(width / geometry["ratio_w_over_h"]);
					}
					element.style.height = height + "px";
					jQuery(element).image(that.dataURL);
				})
				.catch(()=>{
					//console.error("Rejected by image.geometry()");
					element.style.height = height + "px";
					jQuery(element).image(that.dataURL);
				});
			}
			else {
				element.style.height = "80px";
				jQuery(element).image("");
			}
		}
		else {
			if (strlen(that.dataURL) > 0) {
				jQuery(element).image(that.dataURL);
			}
			else {
				jQuery(element).image("");
			}
		}
	};

	this.get = function()
	{
		//console.info("IN single_image.get() input_id='" + input_id + "'");
		return trim(String(jQuery("#" + input_id).val()));
	};

	this.set = function(value)
	{
		//console.info("IN single_image.set() input_id='" + input_id + "'");
		if (isDataURL(value)) {
			//console.log(logFromDataURL(value));
			that.dataURL = value;
			that.show();
		}
		else {
			dbupload.asDataURL(value)
			.then ((uploadedDataURL)=>{
				//console.log(logFromDataURL(uploadedDataURL));
				jQuery("#" + input_id).val(value);
				that.dataURL = uploadedDataURL;
				that.show();
			})
			.catch(()=>{
				//console.warn("Rejected by dbupload.asDataURL()");
				that.show();
			});
		}
	};

	this.upload = function()
	{
		return new Promise(
			(resolve, reject)=>{
				//console.info("IN single_image.upload() input_id='" + input_id + "'");
				//console.info(logFromDataURL(that.dataURL));
				if (strlen(that.dataURL) > 0) {
					
					var do_the_upload = function(someDataURL) {
						dbupload.upload(someDataURL, "", jQuery("#" + input_id).val())
						.then ((binary_id)=>{
							//console.log("Resolved by dbupload.upload() binary_id='" + binary_id + "'");
							jQuery("#" + input_id).val(binary_id);
							resolve(binary_id);
						})
						.catch(()=>{
							//console.error("Rejected by dbupload.upload()");
							reject();
						});
					};
					
					var targetWidth = (strlen(options["imgwidth"]) > 0) ? parseInt(options["imgwidth"]) : 0;
					//console.log(targetWidth);
					if (targetWidth > 0) {
						image.toDataURL(that.dataURL, targetWidth)
						.then ((resolvedDataURL)=>{
							//console.log(logFromDataURL(resolvedDataURL));
							that.dataURL = resolvedDataURL;
							that.show();
							do_the_upload(resolvedDataURL);
						})
						.catch(()=>{
							//console.warn("Rejected by image.toDataURL()");
							do_the_upload(that.dataURL);
						});
					}	
					else {
						do_the_upload(that.dataURL);
					}

				}
				else {
					//console.warn("dataURL resolved as null or empty");
					reject();
				}
			}
		);
	};

	this.error = function(str)
	{
		//console.info("IN single_image.error() input_id='" + input_id + "' str='" + str + "'");
		jQuery("#" + input_id).closest(".question").find(".error").html(str);
	};

	this.showMenu = function()
	{
		var div_menu_id = options["div_menu"];
		jQuery("#" + div_menu_id).show();
	};

	this.hideMenu = function()
	{
		var div_menu_id = options["div_menu"];
		jQuery("#" + div_menu_id).hide();
	};

	this.init = function()
	{
		//console.info("IN single_image.init() input_id='" + input_id + "'");

		if (strlen(options["div_menu"]) > 0) {

			var div_menu_id = options["div_menu"];
			//console.log(div_menu_id);
			jQuery("#" + div_menu_id).off("click").on("click", function(){
				jQuery(this).hide();
			});

			jQuery("#" + input_id).closest(".question").find(".thumbnail").off("click").on("click", function(e){
				e.preventDefault();
				e.stopPropagation();
				ripple(this, function(){
					if (strlen(that.dataURL) > 0) {
						openDataURL(that.dataURL);
					}
					else {
						that.showMenu();
					}
				});
			});

			jQuery("#" + input_id).closest(".question").find(".btn_image_menu").off("click").on("click", function(e){
				e.preventDefault();
				e.stopPropagation();
				ripple(this, function(){
					that.showMenu();
				});
			});

			jQuery("#" + div_menu_id + " .btn_delete").off("click").on("click", function(e){
				e.preventDefault();
				e.stopPropagation();
				ripple(this, function(){
					that.hideMenu();
					var binary_id = that.get();
					if (strlen(binary_id) > 0) {
						dbupload.delete(binary_id)
						.then (()=>{
							that.dataURL = "";
							that.show();
						})
						.catch(()=>{
							//console.warn("Rejected by dbupload.delete()");
							that.dataURL = "";
							that.show();
						});
					}
					else {
						//console.log("Image not uploaded yet");
						that.dataURL = "";
						that.show();
					}
				});
			});

			jQuery("#" + div_menu_id + " .btn_reset").off("click").on("click", function(e){
				e.preventDefault();
				e.stopPropagation();
				ripple(this, function(){
					that.hideMenu();
					var binary_id = that.get();
					if (strlen(binary_id) > 0) {
						that.set(binary_id);
					}
				});
			});

			jQuery("#" + div_menu_id + " .btn_edit").off("click").on("click", function(e){
				e.preventDefault();
				e.stopPropagation();
				ripple(this, function(){
					that.hideMenu();
					if (strlen(that.dataURL) > 0) {
						image.edit(that.dataURL, false)
						.then ((editedDataURL)=>{
							//console.log(logFromDataURL(editedDataURL));
							that.dataURL = editedDataURL;
							that.show();
						})
						.catch(()=>{
							//console.warn("Rejected by image.edit()");
						});
					}
				});
			});

			jQuery("#" + div_menu_id + " .btn_gallery").off("click").on("click", function(e){
				e.preventDefault();
				e.stopPropagation();
				ripple(this, function(){
					that.hideMenu();
					var targetWidth = (strlen(options["imgwidth"]) > 0) ? parseInt(options["imgwidth"]) : 0;
					image.capture.gallery(targetWidth, 0, 90)
					.then ((resolvedDataURL)=>{
						//console.log(logFromDataURL(resolvedDataURL));
						that.dataURL = resolvedDataURL;
						that.show();
					})
					.catch(()=>{
						//console.warn("Rejected by image.capture.gallery()");
					});
				});
			});

			jQuery("#" + div_menu_id + " .btn_camera").off("click").on("click", function(e){
				e.preventDefault();
				e.stopPropagation();
				ripple(this, function(){
					that.hideMenu();
					var targetWidth = (strlen(options["imgwidth"]) > 0) ? parseInt(options["imgwidth"]) : 0;
					image.capture.camera(targetWidth, 0, 90)
					.then ((resolvedDataURL)=>{
						//console.log(logFromDataURL(resolvedDataURL));
						that.dataURL = resolvedDataURL;
						that.show();
					})
					.catch(()=>{
						//console.warn("Rejected by image.capture.gallery()");
					});
				});
			});

		}

	};

	this.init();
}


// End of file: single_image.js
// ============================================================================