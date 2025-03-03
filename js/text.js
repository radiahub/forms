// ============================================================================
// Module      : text.js
// Version     : 2.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : General
// Description : text form plugin
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 25-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

function text (myform, input_id, options)
{
	var that = this;
	this.input_id = input_id;
	this.type = jQuery("#" + input_id).attr("type");

	var htmlNumericTypes = "TEL,NUMERIC";

	this.get = function()
	{
		console.info("IN text.get() input_id='" + input_id + "'");
		if (htmlNumericTypes.indexOf(that.type.toUpperCase()) >= 0) {
			console.log("Resolving numeric input");
			var decimals = parseInt(String(options["decimals"]));
			var result = 0;
			if (decimals > 0) {
				result = val.masked(input_id, "float");
				if (isNaN(result)) { result = 0; }
				result = result / Math.pow(10,decimals);
			}
			else {
				result = val.masked(input_id, "int");
				if (isNaN(result)) { result = 0; }
			}
			return result;
		}
		else {
			return String(jQuery("#" + input_id).val());
		}
	};

	this.set = function(value)
	{
		console.info("IN text.set() input_id='" + input_id + "' value='" + value + "'");
		if (htmlNumericTypes.indexOf(that.type.toUpperCase()) >= 0) {
			console.log("Resolving numeric input");
			var decimals = parseInt(String(options["decimals"]));
			var cast = (decimals > 0) ? "float" : "int";
			var temp = number_format(value, decimals, ".", ",");
			jQuery("#" + input_id).val(temp);
			inputmask(input_id, "", cast, decimals);
		}
		else {
			jQuery("#" + input_id).val(value);
		}
	};

	this.error = function(str)
	{
		console.info("IN text.error() input_id='" + input_id + "' str='" + str + "'");
		jQuery("#" + input_id).closest(".question").find(".error").html(str);
	};

	this.init = function()
	{
		console.info("IN text.init() input_id='" + input_id + "'");
		jQuery("#" + input_id).off("focus").on("focus", function(){
			myform.scrollIntoView(input_id);
		});
		jQuery("#" + input_id).closest(".input").find(".btn_delete").off("click").on("click", function(){
			ripple(this, function(){
				jQuery("#" + input_id).val("");
				jQuery("#" + input_id).focus();
			});
		});
	};

	this.init();
}


// End of file: text.js
// ============================================================================