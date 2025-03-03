// ============================================================================
// Module      : phone.js
// Version     : 2.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : General
// Description : Phone number form plugin
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 25-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

function phone (myform, input_id, options)
{
	var that = this;
	this.input_id = input_id;
	this.question = jQuery("#" + input_id).closest(".question");

	this.get = function()
	{
		console.info("IN phone.get() input_id='" + input_id + "'");

		var dum_code = val.select(options["select_country_code"]);
		//console.log(dum_code);
		
		if ((strlen(dum_code) > 0) && (parseInt(String(dum_code)) > 0)) {
			
			dum_code = "+" + dum_code;
			console.log(dum_code);

			var dum_phone_no = jQuery("#" + input_id).val();
			dum_phone_no = trim(String(dum_phone_no));
			console.log(dum_phone_no);

			if (strlen(dum_phone_no) > 0) {
				var result = msisdn.format(dum_phone_no, dum_code);
				console.log(result);
				that.set(result);
				/*
				var result = "";

				var c = dum_phone_no.slice(0, 1);
				switch (c) {
					case "+" : {
						that.set(dum_phone_no);
						result = dum_phone_no;
						break;
					}
					case "0" : {
						dum_phone_no = dum_code + dum_phone_no.slice(1);
						that.set(dum_phone_no);
						result = dum_phone_no;
						break;
					}
					default : {
						dum_phone_no = dum_code + dum_phone_no;
						that.set(dum_phone_no);
						result = dum_phone_no;
						break;
					}
				}
				*/
				return result;
			}
		}
		else {
			console.warn("country code not set or invalid");
		}
		
		console.warn("Returning null");
		return null;
	};

	this.set = function(phone_no)
	{
		phone_no = msisdn.format(phone_no);
		console.info("IN phone.set() input_id='" + input_id + "' phone_no='" + phone_no + "'");
		var arr = countries.split_phone_number(phone_no);
		console.log(arr);
		if (arr !== null) {
			val.select(options["select_country_code"], arr["code"]);
			jQuery("#" + options["display_country_code"]).html("+" + arr["code"]);
			jQuery("#INP_PHONE_NO").val(arr["number"]);
		}
	};

	this.error = function(str)
	{
		console.info("IN phone.error() input_id='" + input_id + "' str='" + str + "'");
		that.question.find(".error").html(str);
	};

	this.init = function()
	{
		console.info("IN phone.init() input_id='" + input_id + "'");

		countries.init();
		val.selectcountry( options["select_country_code"], "CODE");
		//myform.scrollIntoView(input_id);
		/*
		jQuery("#" + options["select_country_code"]).off("focus").on("focus", function(){
			myform.scrollIntoView(input_id);
		});
		*/

		jQuery("#" + input_id).off("focus").on("focus", function(){
			myform.scrollIntoView(input_id);
		});

		jQuery("#" + options["select_country_code"]).on("change", function(){
			var code = val.select(options["select_country_code"]);
			code = "+" + code;
			//console.log(code);
			jQuery("#" + options["display_country_code"]).html(code);
			//jQuery("#" + input_id).focus();
		});

		that.question.find(".btn_address_book").each(function(idx, elt){
			jQuery(elt).off("click").on("click", function(){
				ripple(this, function(){
					if (typeof contacts !== "undefined") {
						contacts.pick()
						.then ((res)=>{
							//console.log(JSON.stringify(res));
							var tmp_phone_no = res["phone_no"];
							//console.log(tmp_phone_no);
							tmp_phone_no = msisdn.format(tmp_phone_no);
							that.set(tmp_phone_no);
						})
						.catch(()=>{
							console.warn("Rejected by contacts.pick()");
						});
					}
				});
			});
		});

	};

	this.init();
}


// End of file: phone.js
// ============================================================================