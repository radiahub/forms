// ============================================================================
// Module      : form.js
// Version     : 2.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : General
// Description : Form applet
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 25-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================
/*
	Important: 
	---------
	this implementation does NOT use javascript classes, in a pathetic attempt to
	eliminate several ambiguities, ex. using this or jQuery(this) in callbacks 
	and event handler

	Remark:
	------
	To get the DOM element from a jQuery object, use obj.get(0), where obj is the
	jQuery object (previously created) or try document.getElementById() :)
*/

// ****************************************************************************
// ****************************************************************************
//
// FORM IMPLEMENTATION 
//
// ****************************************************************************
// ****************************************************************************

function form (container_id) 
{
	console.info("IN form() container_id='" + container_id + "'");

	var that = this;
	this.container_id = container_id;


	// **************************************************************************
	// **************************************************************************
	//
	// CONTROLS API
	//
	// **************************************************************************
	// **************************************************************************

	//Array of instances of answer plugin of various types
	//
	this.collection = [],

	this.indexOf = function(input_id)
	{
		for (var i = 0; i < that.collection.length; i++) {
			if (that.collection[i].input_id === input_id) {
				return i;
			}
		}
		return -1;
	};

	this.add = function(answer_plugin)
	{
		var input_id = answer_plugin["input_id"];
		if (strlen(input_id) > 0) {
			if (that.indexOf(input_id) < 0) {
				that.collection.push(answer_plugin);
			}
		}
	};

	this.delete = function(input_id)
	{
		var idx = that.indexOf(input_id);
		if (idx >= 0) {
			that.collection.splice(idx, 1);
		}
	};

	this.get = function(input_id)
	{
		console.info("IN form.get() input_id='" + input_id + "'");
		var idx = that.indexOf(input_id);
		console.log(idx);
		if (idx >= 0) {
			if(typeof that.collection[idx].get === 'function') {
				return that.collection[idx].get();
			}
		}
		return null;
	};

	this.set = function(input_id, value)
	{
		//console.info("IN form.set() input_id='" + input_id + "' value='" + value + "'");
		var idx = that.indexOf(input_id);
		//console.log(idx);
		if (idx >= 0) {
			if(typeof that.collection[idx].set === 'function') {
				return that.collection[idx].set(value);
			}
		}
		return null;
	};

	this.error = function(input_id, value)
	{
		console.info("IN form.error() input_id='" + input_id + "' value='" + value + "'");
		var idx = that.indexOf(input_id);
		console.log(idx);
		if (idx >= 0) {
			if(typeof that.collection[idx].error === 'function') {
				that.collection[idx].error(value);
			}
		}
	};

	this.upload = function(input_id)
	{
		return new Promise(
			(resolve, reject) => {
				console.info("IN form.upload() input_id='" + input_id + "'");
				var idx = that.indexOf(input_id);
				console.log(idx);
				if (idx >= 0) {
					if(typeof that.collection[idx].upload === 'function') {
						that.collection[idx].upload()
						.then ((binary_id)=>{
							console.log("Resolved by [control].upload()");
							console.log(binary_id);
							resolve(binary_id);
						})
						.catch((e)=>{
							console.error("Rejected by [control].upload()");
							console.error(JSON.stringify(e));
							reject();
						});
					}
					else {
						console.warn("[control].upload() is not a function");
						reject();
					}
				}
			}
		);
	};


	// **************************************************************************
	// **************************************************************************
	//
	// GUI SUPPORT
	//
	// **************************************************************************
	// **************************************************************************

	this.scrollIntoView = function(input_id)
	{
		console.info("IN form.scrollIntoView() input_id='" + input_id + "'");
		jQuery("#" + input_id).closest(".question").scrollIntoView();
	};

	this.onwindowresize = function()
	{
		return new Promise(
			(resolve, reject) => {
				console.info("IN form.onwindowresize()");
				if (that.collection.length > 0) {
					var current = 0;
					var iterate = function() {
						var go_on = function() {
							current++;
							if (current >= that.collection.length) {
								resolve();
							}
							else {
								iterate();
							}
						};
						if(typeof that.collection[current].onwindowresize === 'function') {
							that.collection[current].onwindowresize()
							.then (()=>{
								go_on();
							})
							.catch((e)=>{
								console.warn("Rejected by onwindowresize() input_id='" + that.collection[current].input_id + "'");
								console.warn(e);
								go_on();
							});
						}
						else {
							go_on();
						}
					};
					iterate();
				}
				else {
					resolve();
				}
			}
		);
	};


	// **************************************************************************
	// **************************************************************************
	//
	// INITIALIZATION
	//
	// **************************************************************************
	// **************************************************************************

	this.load = function()
	{
		console.info("IN form.load()");
		that.collection = [];
		jQuery("#" + container_id).find(".answer").each(function(idx,elt){
			var input_id = jQuery(elt).attr("id");
			console.log(input_id);
			var options = jQuery(elt).data("options");
			var objtype = options["type"];
			console.log(objtype);
			console.log(typeof window[objtype]);
			if (typeof window[objtype] !== "undefined") {
				that.collection.push(new window[objtype](that, input_id, options));
				//console.log(JSON.stringify(that.collection));
			};
		});
	};

	this.init = function()
	{
		console.info("IN form.init()");
		that.load();
	};

	this.init();
};


// End of file: form.js
// ============================================================================