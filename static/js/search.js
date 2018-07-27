"use strict";

(() => {

let viewAllButton = document.getElementById("viewAll");
let classTable = document.getElementById("classTable");

function constructElement(tagName, attributes,
		innerHtml=null) {
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
 * data should be returned in the form:
 * [
 * 		{
 * 			lang_class_id: <string>,
 * 			class_name_ch: <string>,
 * 			students: [
 * 				{
 * 					student_id: <number>,
 * 					name_en: <string>,
 * 					name_ch: <string>,
 * 					dob: <string>,
 * 					gender: <string>
 * 				},
 * 				...
 * 			]
 * 		},
 * 		...
 * ]
 *
 * args are the search parameters, formatted like so:
 * [
 * 		{
 * 			col_name: <string>,
 * 			value: <string>,
 * 		},
 * 		...
 * ]
 * no args results in returning all students
 * */
function getEnrollment(args = null) {
	return new Promise((resolve, reject) => {
		let query = new XMLHttpRequest();
		//TODO add support for args
		query.open("GET", `/query?
			all=${encodeURIComponent("true")}
		`);
		query.overrideMimeType("application/json");
		query.send();

		query.addEventListener("load", e => {
			resolve(JSON.parse(query.response));
		});
	});
}

function buildTable(data) {
	let studentRows = document.getElementsByClassName(
		"studentRow");
	if (studentRows !== null) {
		//HTMLCollection changes when deleting
		//items from list with remove().
		//convert it to Array instead
		let rows = Array.prototype
			.map.call(studentRows, row => row);
		
		for (let row of rows) {
			row.remove();
		}
	}
	
	for (let classEntry of data) {
		if (classEntry.students.length > 0) {
			let row = document.createElement("tr");
			row.classList.add("studentRow");
			
			row.appendChild(constructElement("td", {
				rowspan: classEntry.students.length
			},`${classEntry.lang_class_id}/
				${classEntry.class_name_ch}(${
				classEntry.students.length
			})`));

			//special handling of the first student,
			//since they are on the same row as the
			//classname
			let firstStudent = classEntry.students[0];
			row.appendChild(constructElement("td", {},
				`${firstStudent["name_en"]}/
				${firstStudent["name_ch"]}(
				${firstStudent["student_id"]}
			)`));
			row.appendChild(constructElement("td", {},
				`${firstStudent["gender"]}`
			));
			row.appendChild(constructElement("td", {},
				`${firstStudent["dob"]}`
			));
			classTable.appendChild(row);
			
			for (let student of classEntry.students
					.slice(1)) {
				let tempRow = document.createElement("tr");
				tempRow.classList.add("studentRow");
				tempRow.appendChild(
					constructElement("td", {},
					`${student["name_en"]}/
					${student["name_ch"]}(
					${student["student_id"]}
				)`));
				tempRow.appendChild(
					constructElement("td", {},
					`${student["gender"]}`
				));
				tempRow.appendChild(
					constructElement("td", {},
					`${student["dob"]}`
				));
				classTable.appendChild(tempRow);
			}
		}
		/*
		let newLine = document.createElement("tr");
		newLine.appendChild(constructElement("td", {
			colspan: 4
		}));
		classTable.appendChild(newLine);
		*/
	}
}

viewAllButton.addEventListener("click", e => {
	getEnrollment().then(data => {
		buildTable(data);
		return;
	});
});

})();

