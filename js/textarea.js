// ============================================================================
// Module      : textarea.js
// Version     : 2.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : General
// Description : textarea form plugin
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 25-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

function textarea (myform, input_id, options)
{
	var that = this;
	this.input_id = input_id;
	var maxlength = parseInt(String(jQuery("#" + input_id).attr("maxlength")));
	//console.log(maxlength);

	this.get = function()
	{
		//console.info("IN textarea.get() input_id='" + input_id + "'");
		return String(jQuery("#" + input_id).val());
	};

	this.set = function(value)
	{
		//console.info("IN textarea.set() input_id='" + input_id + "' value='" + value + "'");
		jQuery("#" + input_id).val(String(value));
		that.computeLength();
		that.computeHeight();
	};

	this.error = function(str)
	{
		//console.info("IN textarea.error() input_id='" + input_id + "' str='" + str + "'");
		jQuery("#" + input_id).closest(".question").find(".error").html(str);
	};

	this.computeHeight = function()
	{
		var element = document.getElementById(input_id);
		element.style.height = ""; 
		element.style.height = element.scrollHeight + "px";
	};

	this.computeLength = function()
	{
		var value = String(jQuery("#" + input_id).val());
		//console.log(value);
		var count = String(strlen(value)) + "/" + String(maxlength);
		//console.log(count);
		//console.log(jQuery("#" + input_id).closest(".question").find(".counter"));
		jQuery("#" + input_id).closest(".question").find(".counter").html(count);
	};

	this.init = function()
	{
		//console.info("IN textarea.init() input_id='" + input_id + "'");

		jQuery("#" + input_id).off("focus").on("focus", function(){
			myform.scrollIntoView(input_id);
		});

		that.computeLength();

		jQuery("#" + input_id).off("keyup").on("keyup", function(){
			if (maxlength > 0) {
				var value = String(jQuery("#" + input_id).val());
				if (strlen(value) > maxlength) {
					var pos = input_selection_start(input_id);
					value = value.slice(0, maxlength);
					if (pos < (maxlength - 1)) {
						input_cursor_to_pos(input_id, pos);
					}
					else {
						input_cursor_to_end(input_id);
					}
				}
			}

			that.computeLength();
			that.computeHeight();
		});

		jQuery("#" + input_id).closest(".input").find(".btn_delete").off("click").on("click", function(){
			ripple(this, function(){
				jQuery("#" + input_id).val("");
				that.computeLength();
				that.computeHeight();
				jQuery("#" + input_id).focus();
			});
		});
	};

	this.init();
}


// End of file: textarea.js
// ============================================================================