// ============================================================================
// Module      : checkbox.js
// Version     : 2.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : General
// Description : checkbox form plugin
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 25-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

function checkbox (myform, input_id, options)
{
	this.input_id = input_id;

	this.get = function()
	{
		//console.info("IN checkbox.get() input_id='" + input_id + "'");
		return val.checkbox(input_id);
	};

	this.set = function(value)
	{
		//console.info("IN checkbox.set() input_id='" + input_id + "' value='" + value + "'");
		val.checkbox(input_id, value);
	};

	this.error = function(str)
	{
		//console.info("IN single_image.error() input_id='" + input_id + "' str='" + str + "'");
		jQuery("#" + input_id).closest(".question").find(".error").html(str);
	};

	this.init = function()
	{
		//console.info("IN checkbox.init() input_id='" + input_id + "'");
		jQuery("#" + input_id).off("click").on("click", function(){
			myform.scrollIntoView(input_id);
		});
	};

	this.init();
}


// End of file: checkbox.js
// ============================================================================