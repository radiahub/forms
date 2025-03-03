// ============================================================================
// Module      : radiobox.js
// Version     : 2.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : General
// Description : radiobox form plugin
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 25-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

function radiobox (myform, input_id, options)
{
	this.input_id = input_id;
	var radio_name = input_id;

	this.get = function()
	{
		//console.info("IN radiobox.get() input_id='" + input_id + "'");
		return val.radio(radio_name);
	};

	this.set = function(value)
	{
		//console.info("IN radiobox.set() input_id='" + input_id + "' value='" + value + "'");
		val.radio(radio_name, value);
	};

	this.error = function(str)
	{
		//console.info("IN radiobox.error() input_id='" + input_id + "' str='" + str + "'");
		jQuery("#" + input_id).closest(".question").find(".error").html(str);
	};

	this.init = function()
	{
		//console.info("IN radiobox.init() input_id='" + input_id + "' radio_name='" + radio_name + "'");
		jQuery('input[type=radio][name="' + radio_name + '"]').off("click").on("click", function(){
			myform.scrollIntoView(input_id);
		});
	};

	this.init();
}


// End of file: radiobox.js
// ============================================================================