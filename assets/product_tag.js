var p_selectors = $.extend({},{
	productJson: '[data-product-json]',    
});
//Parse to JSON
this.productSingleObject = JSON.parse($(p_selectors.productJson).html());

let fin_data;
var p_options = {
  product: this.productSingleObject
};

function setCookie(e,t){var n=new Date;n.setTime(n.getTime()+144e5);var o="expires="+n.toUTCString();document.cookie=e+"="+t+";"+o+";path=/"};async function getCookie(e){for(var t=e+"=",n=decodeURIComponent(document.cookie).split(";"),o=0;o<n.length;o++){for(var i=n[o];" "==i.charAt(0);)i=i.substring(1);if(0==i.indexOf(t))return i.substring(t.length,i.length)}return""};
async function abbrState(a){const i=[["Alabama","AL"],["Alaska","AK"],["American Samoa","AS"],["Arkansas","AR"],["Armed Forces Americas","AA"],["Armed Forces Europe","AE"],["Armed Forces Pacific","AP"],["California","CA"],["Colorado","CO"],["Connecticut","CT"],["Delaware","DE"],["District Of Columbia","DC"],["Florida","FL"],["Georgia","GA"],["Guam","GU"],["Hawaii","HI"],["Idaho","ID"],["Illinois","IL"],["Indiana","IN"],["Iowa","IA"],["Kansas","KS"],["Kentucky","KY"],["Louisiana","LA"],["Maine","ME"],["Marshall Islands","MH"],["Maryland","MD"],["Massachusetts","MA"],["Michigan","MI"],["Minnesota","MN"],["Mississippi","MS"],["Missouri","MO"],["Montana","MT"],["Nebraska","NE"],["Nevada","NV"],["New Hampshire","NH"],["New Jersey","NJ"],["New Mexico","NM"],["New York","NY"],["North Carolina","NC"],["North Dakota","ND"],["Northern Mariana Islands","NP"],["Ohio","OH"],["Oklahoma","OK"],["Oregon","OR"],["Pennsylvania","PA"],["Puerto Rico","PR"],["Rhode Island","RI"],["South Carolina","SC"],["South Dakota","SD"],["Tennessee","TN"],["Texas","TX"],["US Virgin Islands","VI"],["Utah","UT"],["Vermont","VT"],["Virginia","VA"],["Washington","WA"],["West Virginia","WV"],["Wisconsin","WI"],["Wyoming","WY"]].find(i=>i.find(i=>i.toLowerCase()===a.toLowerCase()));return i?i.filter(i=>i.toLowerCase()!==a.toLowerCase()).join(""):null}

async function fetchbigquery_table(s){
	const queryData = [{"destination_state":"CO","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"3.0","california_shipping_days":"2.0","indiana_4_3374_plainfield_shi":"3.0"},{"destination_state":"AZ","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"4.0","california_shipping_days":"2.0","indiana_4_3374_plainfield_shi":"3.0"},{"destination_state":"ID","texas_shipping_days":"4.0","georgia_pooler_shipping_days":"4.0","california_shipping_days":"2.0","indiana_4_3374_plainfield_shi":"4.0"},{"destination_state":"UT","texas_shipping_days":"2.0","georgia_pooler_shipping_days":"4.0","california_shipping_days":"2.0","indiana_4_3374_plainfield_shi":"4.0"},{"destination_state":"NV","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"5.0","california_shipping_days":"2.0","indiana_4_3374_plainfield_shi":"5.0"},{"destination_state":"WA","texas_shipping_days":"4.0","georgia_pooler_shipping_days":"5.0","california_shipping_days":"2.0","indiana_4_3374_plainfield_shi":"4.0"},{"destination_state":"OR","texas_shipping_days":"4.0","georgia_pooler_shipping_days":"5.0","california_shipping_days":"2.0","indiana_4_3374_plainfield_shi":"4.0"},{"destination_state":"TX","texas_shipping_days":"1.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"3.0","indiana_4_3374_plainfield_shi":"3.0"},{"destination_state":"NE","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"3.0","california_shipping_days":"3.0","indiana_4_3374_plainfield_shi":"3.0"},{"destination_state":"NM","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"3.0","california_shipping_days":"3.0","indiana_4_3374_plainfield_shi":"3.0"},{"destination_state":"OK","texas_shipping_days":"1.0","georgia_pooler_shipping_days":"3.0","california_shipping_days":"3.0","indiana_4_3374_plainfield_shi":"3.0"},{"destination_state":"KS","texas_shipping_days":"2.0","georgia_pooler_shipping_days":"3.0","california_shipping_days":"3.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"MO","texas_shipping_days":"2.0","georgia_pooler_shipping_days":"3.0","california_shipping_days":"3.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"WY","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"4.0","california_shipping_days":"3.0","indiana_4_3374_plainfield_shi":"4.0"},{"destination_state":"MT","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"4.0","california_shipping_days":"3.0","indiana_4_3374_plainfield_shi":"3.0"},{"destination_state":"PA","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"DE","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"VA","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"AL","texas_shipping_days":"2.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"LA","texas_shipping_days":"2.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"TN","texas_shipping_days":"2.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"IN","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"1.0"},{"destination_state":"KY","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"1.0"},{"destination_state":"OH","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"1.0"},{"destination_state":"IL","texas_shipping_days":"2.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"1.0"},{"destination_state":"MS","texas_shipping_days":"2.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"MD","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"AR","texas_shipping_days":"2.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"NJ","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"FL","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"WV","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"1.0"},{"destination_state":"SD","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"3.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"3.0"},{"destination_state":"WI","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"3.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"MN","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"3.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"IA","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"3.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"MI","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"3.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"1.0"},{"destination_state":"ND","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"4.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"3.0"},{"destination_state":"GA","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"1.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"NC","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"1.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"SC","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"1.0","california_shipping_days":"4.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"VT","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"5.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"RI","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"5.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"MA","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"5.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"CT","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"5.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"NH","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"2.0","california_shipping_days":"5.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"NY","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"3.0","california_shipping_days":"5.0","indiana_4_3374_plainfield_shi":"2.0"},{"destination_state":"ME","texas_shipping_days":"4.0","georgia_pooler_shipping_days":"3.0","california_shipping_days":"5.0","indiana_4_3374_plainfield_shi":"3.0"},{"destination_state":"CA","texas_shipping_days":"3.0","georgia_pooler_shipping_days":"4.0","california_shipping_days":"1.0","indiana_4_3374_plainfield_shi":"4.0"}];
	const result = queryData.filter(function (el){
		return el.destination_state === s;
	});
	return result
}

async function inventorySky(a, b){
	var result;
	for (let i = 0 ; i < a.length; i ++){
		var first_split = a[i].split(":");
		if(b === first_split[0]){
			result = first_split[1].split("-");
			break;
		}
	}
	return result;
}
async function caldayeth(d){
	if(d>3 && d<21) return 'th';
	switch (d % 10) {
		case 1:  return "st";
		case 2:  return "nd";
		case 3:  return "rd";
		default: return "th";
	}
}

async function checkSatSun(e){
	var count = 0;
	for(let i = 1; i <= e; i++){
		var r = dayjs().add(i, "day").format("ddd");
		if(i === e && "Sat" === r){
			count += 2 ;
		}else {
			if("Sat" === r || "Sun" === r){
				count++;
			}
		}
	}
	var x = count + e;
	return x
}

async function dateCalculat(a, b){

	var usaTime = new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"});
	usaTime = new Date(usaTime);
	var hour = usaTime.getHours(), ampm = hour >= 12 ? 'pm' : 'am', flag = (8 > hour && ampm == 'am') ? 0 : 1 ;

	
	var e = ( (Math.floor(a)) + b + flag + 1 );
	let final_number = await checkSatSun(e);

	var final_date = dayjs().add(final_number, 'day').format("ddd, MMM D"),
		  justDay_number = dayjs().add(final_number, 'day').format("D");
	let th = await caldayeth(justDay_number);

    if(justDay_number < 25){
      $(".merge-christmas-before").css("display", "block"), $(".merge-christmas-after").css("display", "none");
    }else {
       $(".merge-christmas-after").css("display", "block"), $(".merge-christmas-before").css("display", "none");
    }
	$(".merge-two").css("display", "block"), $(".merge-three").css("display", "none");
	 if(Math.floor(a) === 1){
		$(".two_days_shipping").text("Free 2-Day Shipping");
		$("#toDate").text(final_date + th)
	}else {
		$(".two_days_shipping").text("Free Shipping");
		$("#toDate").text(final_date + th)
	}
}

async function checkSwitchCase(h, j){
	switch(h){
		case 0:
			//california
			dateCalculat(j[0].california_shipping_days, 0);
			break;
		case 1:
			//indiana
			dateCalculat(j[0].indiana_4_3374_plainfield_shi, 0);
			break;
		case 2:
			//georgia
			dateCalculat(j[0].georgia_pooler_shipping_days, 0)
			break;
		case 3:
			//texas

			dateCalculat(j[0].texas_shipping_days, 0)
			break;
		case null:
			$(".merge-two").css("display", "none"), $(".merge-three").css("display", "block");
		default:
			$(".merge-two").css("display", "none"), $(".merge-three").css("display", "block");
			break;
	}
}

async function checkStatePriority(i) {
  var o = [ {"State":"AL","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":2,"Georgia_Priority":1},{"State":"AR","California_Priority":4,"Texas_Priority":1,"Indiana_Priority":2,"Georgia_Priority":3},{"State":"AZ","California_Priority":1,"Texas_Priority":2,"Indiana_Priority":3,"Georgia_Priority":4},{"State":"CA","California_Priority":1,"Texas_Priority":2,"Indiana_Priority":3,"Georgia_Priority":4},{"State":"CO","California_Priority":1,"Texas_Priority":2,"Indiana_Priority":3,"Georgia_Priority":4},{"State":"CT","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":2,"Georgia_Priority":1},{"State":"DC","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":2,"Georgia_Priority":1},{"State":"DE","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":2,"Georgia_Priority":1},{"State":"FL","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":2,"Georgia_Priority":1},{"State":"GA","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":2,"Georgia_Priority":1},{"State":"IA","California_Priority":4,"Texas_Priority":2,"Indiana_Priority":1,"Georgia_Priority":3},{"State":"ID","California_Priority":1,"Texas_Priority":2,"Indiana_Priority":3,"Georgia_Priority":4},{"State":"IL","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"IN","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"KS","California_Priority":4,"Texas_Priority":1,"Indiana_Priority":2,"Georgia_Priority":3},{"State":"KY","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"LA","California_Priority":4,"Texas_Priority":1,"Indiana_Priority":3,"Georgia_Priority":2},{"State":"MA","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"MD","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":2,"Georgia_Priority":1},{"State":"ME","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"MI","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"MN","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"MO","California_Priority":4,"Texas_Priority":1,"Indiana_Priority":2,"Georgia_Priority":3},{"State":"MS","California_Priority":4,"Texas_Priority":1,"Indiana_Priority":3,"Georgia_Priority":2},{"State":"MT","California_Priority":1,"Texas_Priority":2,"Indiana_Priority":3,"Georgia_Priority":4},{"State":"NC","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":2,"Georgia_Priority":1},{"State":"ND","California_Priority":4,"Texas_Priority":2,"Indiana_Priority":1,"Georgia_Priority":3},{"State":"NE","California_Priority":4,"Texas_Priority":2,"Indiana_Priority":1,"Georgia_Priority":3},{"State":"NH","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"NJ","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"NM","California_Priority":2,"Texas_Priority":1,"Indiana_Priority":3,"Georgia_Priority":4},{"State":"NV","California_Priority":1,"Texas_Priority":2,"Indiana_Priority":3,"Georgia_Priority":4},{"State":"NY","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"OH","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"OK","California_Priority":4,"Texas_Priority":1,"Indiana_Priority":3,"Georgia_Priority":2},{"State":"OR","California_Priority":1,"Texas_Priority":2,"Indiana_Priority":3,"Georgia_Priority":4},{"State":"PA","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"RI","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"SC","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":2,"Georgia_Priority":1},{"State":"SD","California_Priority":4,"Texas_Priority":2,"Indiana_Priority":1,"Georgia_Priority":3},{"State":"TN","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"TX","California_Priority":4,"Texas_Priority":1,"Indiana_Priority":3,"Georgia_Priority":2},{"State":"UT","California_Priority":1,"Texas_Priority":2,"Indiana_Priority":3,"Georgia_Priority":4},{"State":"VA","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":2,"Georgia_Priority":1},{"State":"VT","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"WA","California_Priority":1,"Texas_Priority":2,"Indiana_Priority":3,"Georgia_Priority":4},{"State":"WI","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"WV","California_Priority":4,"Texas_Priority":3,"Indiana_Priority":1,"Georgia_Priority":2},{"State":"WY","California_Priority":1,"Texas_Priority":2,"Indiana_Priority":3,"Georgia_Priority":4} ]
	const filter_prio = o.filter(function (el) {
		return el.State === i;
	});
	return filter_prio;
}

async function newFunctionPriority(a, b){
	var res, flag = false;
	for(let j=1 ; j<5 ; j++){
		if(!flag){
			for(let k = 0; k < a.length ;k++ ){
				if(a[k] === j && Number(b[k]) > 50){
					res = k; flag= true
					break;
				}
			}
		}else {
			break;
		}
	}
	return res;
}	

async function variant(x, y, z){
	let two_latter_state = await abbrState(z);
	let state_value_with_whole = await fetchbigquery_table(two_latter_state);
	let skyInventory = await inventorySky(x.allTheSky, y);
	let priorityResult = await checkStatePriority(two_latter_state );
	  
	var new_ra = [priorityResult[0].California_Priority, priorityResult[0].Indiana_Priority, priorityResult[0].Georgia_Priority, priorityResult[0].Texas_Priority];
	let f_priority = await newFunctionPriority(new_ra, skyInventory);

	checkSwitchCase(f_priority, state_value_with_whole);
}


async function get_data(new_tags){
	var bcpEligibal, allTheSky = [];

	for (let i = 0 ; i < new_tags.length; i++){
		if(new_tags[i].includes("bcp2day_eligible")){
			bcpEligibal = new_tags[i].split(":")[1];
		}
		if(new_tags[i].includes("SKY")){
			allTheSky.push(new_tags[i]);
		}
	}
	return { bcpEligibal, allTheSky }
}

async function fetchQuote() {
  function callback(json){
    return json.state;
  }
  const result = await $.ajax({
    url: "https://geoip-db.com/jsonp",
    jsonpCallback: "callback",
    dataType: "jsonp",
  })
  return result.state;
}

async function checkCookie(a, b){
	var state_name = await getCookie("two_day_state");
	if (state_name == 'null' || state_name == "" || state_name == 'undefined' || state_name == null || state_name == undefined ) {
		state_name = await fetchQuote();
		setCookie("two_day_state", state_name);
		variant(a, b, state_name);
	}else {
		variant(a, b, state_name);
	}
}

async function start_shipping_info(a, b){
	if(a.bcpEligibal === true || a.bcpEligibal === "true"){
		checkCookie(a, b)
	}else {
      $(".merge-christmas-before").css("display", "none"), $(".merge-christmas-after").css("display", "block");
		$('.merge-three').css('display', 'block');
	}
}

async function two_day_shipping(e) {
	const p_a = document.getElementById("get-offset-top"), SKY_number = p_a.getAttribute('data-SKY_two');
	fin_data = await get_data(e);
	start_shipping_info(fin_data, SKY_number);
}

two_day_shipping(p_options.product.tags);


$(document).on('click', "a.swatch_click_2", function(e) {
  e.preventDefault();
  const _p_a = document.getElementById("get-offset-top");
  let _SKY_number  = _p_a.getAttribute('data-SKY_two')
  start_shipping_info(fin_data, _SKY_number);
});