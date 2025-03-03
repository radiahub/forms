// ============================================================================
// Module      : qr.js
// Version     : 2.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : General
// Description : qrcode form plugin (readonly)
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 25-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

function qr (myform, input_id, options)
{
	var that = this;
	this.input_id = input_id;
	this.question = jQuery("#" + input_id).closest(".question");

	this.get = function()
	{
		console.info("IN qr.get() input_id='" + input_id + "'");
		return String(jQuery("#" + input_id).val());
	};

	this.set = function(value)
	{
		console.info("IN qr.set() input_id='" + input_id + "'");
		console.log(value);
		var targetID = options["target"];
		qrcode.showText(targetID, value);
		jQuery("#" + input_id).val(value);
	}

	this.onwindowresize = function()
	{
		return new Promise(
			(resolve, reject)=>{
				console.info("IN qr.onwindowresize() input_id='" + input_id + "'");
				var value = that.get();
				if (strlen(value) > 0) {
					var targetID = options["target"];
					qrcode.showText(targetID, value);
				}
				resolve();
			}
		);
	};

	this.init = function()
	{
		console.info("IN qr.init() input_id='" + input_id + "'");

		that.question.off("click").on("click", function(){
			jQuery(this).scrollIntoView();
		});

		that.question.find(".btn_download").off("click").on("click", function(){
			ripple(this, function(){
				var value = that.get();
				if (strlen(value) > 0) {
					qrcode.downloadImage(value)
					.then (()=>{})
					.catch(()=>{
						console.error("Rejected by qrcode.downloadImage();");
					});
				}
			});
		});

		that.question.find(".btn_copy").off("click").on("click", function(){
			ripple(this, function(){
				var value = that.get();
				if (strlen(value) > 0) {
					navigator.clipboard.writeText(value);
					alert("" + strlen(value) + " chars copied");
				}
			});
		});
	}

	this.init();
}


// End of file: qr.js
// ============================================================================