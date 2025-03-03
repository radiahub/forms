// ============================================================================
// Module      : chipgroup.js
// Version     : 2.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : General
// Description : chipgroup form plugin
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 25-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

function chipgroup (myform, input_id, options)
{
	var that = this;
	this.input_id = input_id;
	this.chipgroup_id = input_id;
	this.radiobox = (strcasecmp("YES", options["radiobox"]) === 0);

	this.get = function()
	{
		console.info("IN chipgroup.get() input_id='" + input_id + "'");
		var result = null;
		if (that.radiobox) {
			jQuery(".chip ." + that.chipgroup_id).each(function(idx, elt){
				if (result === null) {
					var id = jQuery(elt).attr("id"); 
					if (jQuery(elt).prop("checked")) {
						result = id;
					}
				}
			});
		}
		else {
			result = {};
			jQuery(".chip ." + that.chipgroup_id).each(function(idx, elt){
				if (!jQuery(elt).closest(".chip").hasClass("all")) {
					var id = jQuery(elt).attr("id"); 
					var value = jQuery(elt).prop("checked");
					result[id] = value;
				}
			});
		}
		return result;
	};

	this.set = function(value)
	{
		console.info("IN chipgroup.set() input_id='" + input_id + "'");
		console.log(JSON.stringify(value));
		if (that.radiobox) {
			jQuery(".chip ." + that.chipgroup_id).prop("checked", false);
			jQuery("#" + value).prop("checked", true);
		}
		else {
			for (var i in value) {
				jQuery("#" + i).prop("checked", value[i]);
			}
			delay(100, function(){
				var value = true;
				jQuery(".chip ." + that.chipgroup_id).each(function(idx, elt){
					if (!jQuery(elt).closest(".chip").hasClass("all")) {
						value = value && jQuery(elt).prop("checked");
					}
				});
				jQuery(".chip.all ." + that.chipgroup_id).prop("checked", value);
			});
		}
	};

	this.error = function(str)
	{
		console.info("IN chipgroup.error() input_id='" + input_id + "' str='" + str + "'");
		jQuery("#" + input_id).closest(".question").find(".error").html(str);
	};

	this.init = function()
	{
		//console.log("IN chipgroup.init() input_id='" + input_id + "'");
		jQuery(".chip ." + that.chipgroup_id).off("change").on("change", function(){
			var id = jQuery(this).attr("id");
			if (that.radiobox) {
				var value = val.checkbox(id);
				if (value) {
					jQuery(".chip ." + that.chipgroup_id).prop("checked", false);
					jQuery(this).prop("checked", true);
				}
			}
			else {
				var value = val.checkbox(id);
				//console.log(id + " changed value=" + val.checkbox(id));
				if (jQuery(this).closest(".chip").hasClass("all")) {
					jQuery(".chip ." + that.chipgroup_id).prop("checked", value);
				}
				else {
					var value = true;
					jQuery(".chip ." + that.chipgroup_id).each(function(idx, elt){
						if (!jQuery(elt).closest(".chip").hasClass("all")) {
							value = value && jQuery(elt).prop("checked");
						}
					});
					jQuery(".chip.all ." + that.chipgroup_id).prop("checked", value);
				}
			}
		});
	};

	this.init();
};


// End of file: chipgroup.js
// ============================================================================