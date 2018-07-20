"use strict";

/*
 * attributes defined as:
 * {
 * name: value,
 * ...
 * }
 * */
function constructElement(tagName, attributes, innerHtml=null) {
	let res = document.createElement(tagName);
	for (let att in attributes) {
		res.setAttribute(att, attributes[att]);
	}

	if (innerHtml !== null) {
		res.innerHTML = innerHtml;
	}
	return res;
}

/*
 * groupName is the name to apply to all the buttons
 * values is an array of values to assign to the buttons
 * ids is the array of ids, use "" do denote no id
 * labelText is an array of text to display next to each button, "" for no label
 * */
function createRadioButtons(groupName, values, ids, labelText) {
	let res = [];
	for (let x = 0; x < values.length; x++) {
		let tempDiv = document.createElement("div");
		
		tempDiv.appendChild(
			constructElement("input", {
				type: "radio",
				id: ids[x],
				name: groupName,
				value: values[x]
		}));

		if (labelText[x] !== "") {
			tempDiv.appendChild(
				constructElement("label", {
					for: ids[x]
				}, labelText[x]));
		}
		res.push(tempDiv);
	}
	return res;
}

function wrapTd(element) {
	let res = document.createElement("td");
	res.appendChild(element);
	return res;
}

