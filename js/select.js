// ============================================================================
// Module      : select.js
// Version     : 2.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : General
// Description : select form plugin
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 25-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

function select (myform, input_id, html_options)
{
	var that = this;
	this.input_id = input_id;

	this.options = {

		clear : function() {
			val.selectclear(input_id);
		},

		add : function(value, caption) {
			val.selectaddoption(input_id, value, caption);
		},

		// options: array of { value:value, caption:caption }
		//
		load : function(options) {
			val.selectoptions(input_id, options);
		},

		delete : function(value) {
			val.selectremoveoption(input_id, value);
		},

		get : function() {
			return val.select(input_id);
		},

		set : function(value) {
			val.select(input_id, value);
		}
	};

	this.get = function()
	{
		return that.options.get();
	};

	this.set = function(value)
	{
		that.options.set(value);
	};

	this.error = function(str)
	{
		console.info("IN select.error() input_id='" + input_id + "' str='" + str + "'");
		jQuery("#" + input_id).closest(".question").find(".error").html(str);
	};

	this.init = function()
	{
		jQuery("#" + input_id).off("focus").on("focus", function(){
			myform.scrollIntoView(input_id);
		});
	};

	this.init();
}


// End of file: select.js
// ============================================================================