// ============================================================================
// Module      : fileupload.js
// Version     : 2.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : General
// Description : File uploader form plugin
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 25-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

function fileupload (myform, input_id, options)
{
	//console.info("IN fileupload() input_id='" + input_id + "'");
	var that = this;
	this.input_id = input_id;
	this.filename = "";
	this.dataURL  = "";
	this.question = jQuery("#" + input_id).closest(".question");
	this.maxfilesize = parseInt(String(options["maxfilesize"]));

	this.reset = function()
	{
		//console.info("IN fileupload.reset() input_id='" + input_id + "'");
		jQuery("#" + input_id).val("");
		that.filename = "";
		that.dataURL  = "";
		that.preview();
	};

	this.get = function()
	{
		//console.info("IN fileupload.get() input_id='" + input_id + "'");
		return trim(String(jQuery("#" + input_id).val()));
	};

	this.set = function(value)
	{
		//console.info("IN fileupload.set() input_id='" + input_id + "'");
		if (isDataURL(value)) {
			//console.log(logFromDataURL(value));
			that.dataURL = value;
			var mimetype = mimeTypeFromDataURL(value);
			that.filename = filenameFromMimeType(mimetype);
			that.preview();
		}
		else {
			dbupload.get(value)
			.then ((row)=>{
				that.dataURL  = row["dataURL" ];
				that.filename = row["filename"];
				//jQuery("#" + input_id).val(row["binary_id"]);
				that.preview();
			})
			.catch(()=>{
				//console.warn("Rejected by dbupload.get()");
				that.reset();
			});
		}
	};

	this.upload = function()
	{
		return new Promise(
			(resolve, reject)=>{
				//console.info("IN fileupload.upload() input_id='" + input_id + "'");
				//console.log(that.filename);
				//console.log(logFromDataURL(that.dataURL));
				//console.log(jQuery("#" + input_id).val());
				if ((strlen(that.filename) > 0) && (strlen(that.dataURL) > 0)) {
					//console.log("Calling dbupload.upload()");
					dbupload.upload(that.dataURL, that.filename, jQuery("#" + input_id).val())
					.then ((binary_id)=>{
						//console.log("Resolved by dbupload.upload() binary_id='" + binary_id + "'");
						jQuery("#" + input_id).val(binary_id);
						resolve(binary_id);
					})
					.catch(()=>{
						//console.error("Rejected by dbupload.upload()");
						that.error("The file could not be uploaded");
						reject();
					});
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

	this.preview_show = function()
	{
		//console.info("IN fileupload.preview_show() input_id='" + input_id + "'");
		that.question.find(".splash" ).hide();
		that.question.find(".details").show();
	};

	this.preview_hide = function()
	{
		//console.info("IN fileupload.preview_hide() input_id='" + input_id + "'");
		that.question.find(".splash" ).css("display", "flex");
		that.question.find(".details").hide();
	};

	this.preview = function()
	{
		//console.info("IN fileupload.preview() input_id='" + input_id + "'");
		if ((strlen(that.filename) > 0) && (strlen(that.dataURL) > 0)) {
			that.preview_show();
			var mimetype = mimeTypeFromDataURL(that.dataURL);
			if (strmatch(mimetype, "IMAGE")) {
				that.question.find(".thumbnail").css("background-image", "url('" + that.dataURL + "')");
				that.question.find(".nopreview").hide();
			}
			else {
				that.question.find(".thumbnail").css("background-image", "url('')");
				that.question.find(".nopreview").show();
				var url = getFileShortcutIcon(mimetype);
				that.question.find(".nopreviewimg").attr("src", url);
			}
			that.question.find(".filename").val(that.filename);
			var elt = that.question.find(".filename").get(0);
			//console.log(elt.value);
			var len = strlen(elt.value);
			elt.setSelectionRange(len,len);
			elt.scrollLeft = elt.scrollWidth;
			elt.onblur = function() {
				var el = this;
				delay(100, function(){
					var len = strlen(el.value);
					el.setSelectionRange(len,len);
					el.scrollLeft = el.scrollWidth;
				});
			};
			that.question.find(".filesize").html(comprehensive_filesize(strlen(that.dataURL)));
			that.question.find(".thumbnail").off("click").on("click", function(){
				ripple(this, function(){
					openDataURL(that.dataURL);
				});
			});
		}
		else {
			that.preview_hide();
		}
	};

	this.onshow = function()
	{
		//console.info("IN fileupload.onshow() input_id='" + input_id + "'");

		that.question.find(".splash").off("click").on("click", function(){
			ripple(this, function(){
				fileinput()
				.then ((result)=>{
					var size = strlen(result["dataURL"]);
					//console.log(size);
					//console.log(that.maxfilesize);
					//console.log(dbupload.maxfilesize);
					if ((size < that.maxfilesize) && (size < dbupload.maxfilesize)) {
						that.filename = result["filename"];
						that.dataURL  = result["dataURL" ];
						that.preview();
					}
					else {
						media("../lib/mp3/negative.mp3");
						that.error("File too large (max 1MB)");
					}
				})
				.catch(()=>{
					//console.warn("Rejected by fileinput()");
				});
			});
		});

		that.question.find(".remove").off("click").on("click", function(){
			ripple(this, function(){
				var binary_id = jQuery("#" + input_id).val();
				if (strlen(binary_id) > 0) {
					dbupload.delete(binary_id)
					.then (()=>{
						that.reset();
					})
					.catch(()=>{
						//console.warn("Rejected by dbupload.delete()");
						that.reset();
					});
				}
				else {
					that.reset();
				}
			});
		});
	};

	this.init = function()
	{
		//console.info("IN fileupload.init() input_id='" + input_id + "'");
		jQuery("#" + input_id).val("");
		that.filename = "";
		that.dataURL  = "";
		that.preview();
		that.onshow();
	};

	this.init();
}


// End of file: fileupload.js
// ============================================================================