"use strict";

(() => {

let queryLabel = document.getElementById("queryLabel");
let queryTextbox = document.getElementById("queryTextbox");
let selectBox = document.getElementById("typeSelect");
let choiceElems = document.getElementsByTagName("option");
let submitButton = document.getElementById("submitButton");
let uniqueStatus = document.getElementById("uniqueStatus");

const CHOICE_FUNCTS = {
"email"	  : e => {
	queryLabel.innerHTML = "Enter Email";
	
	queryTextbox.value = "";
	queryTextbox.setAttribute("type", "email");
},
"address": e => {
	queryLabel.innerHTML = "Enter Address";
	
	queryTextbox.value = "";
	queryTextbox.setAttribute("type", "text");
},
"familyId": e => {
	queryLabel.innerHTML = "Enter Family ID";
	
	queryTextbox.value = "";
	queryTextbox.setAttribute("type", "number");
}
};

function getSelectedOption() {
	return selectBox.selectedOptions[0].value;
}


//init select listener
function init() {
	for (let elem of choiceElems) {
		elem.addEventListener("click",
			CHOICE_FUNCTS[elem.value]);
	}

	//handle submit button
	submitButton.addEventListener("click", e => {
		//we are "mimicing" an actual form
		if (queryTextbox.validity.typeMismatch ||
			queryTextbox.validity.valueMissing) {
			return;
		}
		
		let dbReq = new XMLHttpRequest();
		dbReq.open("GET", `/check?
			type=${
				encodeURIComponent(getSelectedOption())
			}&
			value=${
				encodeURIComponent(queryTextbox.value)
			}`,
			true);
		dbReq.overrideMimeType("text/plain");
		
		dbReq.send();
		dbReq.addEventListener("load", e => {
			if (dbReq.response === "true") {
				uniqueStatus.innerHTML = "unique";
			}
			else if (dbReq.response === "false") {
				uniqueStatus.innerHTML = "not unique";
			}
			else {
				console.log("error");
			}
		});
		queryTextbox.value = "";
	});
}

window.onload = () => {
	init();

	//set up the default option
	CHOICE_FUNCTS[getSelectedOption()]();
};

})();

