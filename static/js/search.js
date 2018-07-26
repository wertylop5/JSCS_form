"use strict";

//(() => {

let viewAllButton = document.getElementById("viewAll");

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
function getStudents(args = null) {
	let query = new XMLHttpRequest();
	//TODO add support for args
	query.open("GET", `/query`);
	query.overrideMimeType("application/json");
	query.send();

	query.addEventListener("load", e => {
		console.log(query.response);
	});
}

viewAllButton.addEventListener("click", e => {
	getStudents();
});

//})();

