"use strict";

(() => {

let studentTable = document.getElementById("studentTableBody");
let numStudentsPicker = document.getElementById("numStudents");
let yearsTeachAdmin = document.getElementById("yearsTeachAdmin");

const STUDENT_ID_BASE = "student";
let curStudents = 0;

let langClasses;

/*
 * attributes defined as:
 * {
 * name: value,
 * ...
 * }
 *
 * This is a shorthand for the built-in
 * element creation function
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

//places the tag within <td> tags
function wrapTd(element) {
	let res = document.createElement("td");
	res.appendChild(element);
	return res;
}

//gets all the language class names in
//the database
function getLangClasses() {
	let request = new XMLHttpRequest();
	request.open("GET", "/lang-classes", true);
	request.responseType = "json";
	request.send();

	return new Promise((resolve, reject) => {
		request.addEventListener("load",
			e => {
				resolve(request.response);
			});
	});
}

//see static/html/model for the mock-up of
//what the row should look like
function addStudentRow(idNum) {
	const BASE_ID = `${STUDENT_ID_BASE}${idNum}`;
	let trBase = document.createElement("tr");
	trBase.id = BASE_ID;

	let rowName = document.createElement("td");
	rowName.classList.add("rowName");
	rowName.innerHTML = `Student ${idNum}`;
	trBase.appendChild(rowName);

	trBase.appendChild(
		wrapTd(constructElement("input", {
			type: "text",
			name: `${BASE_ID}EnglishName`,
			required: ""
		}))
	);
	
	trBase.appendChild(
		wrapTd(constructElement("input", {
			type: "text",
			name: `${BASE_ID}ChineseName`,
			required: ""
		}))
	);

	trBase.appendChild(
		wrapTd(constructElement("input", {
			type: "date",
			name: `${BASE_ID}Dob`,
			required: ""
		}))
	);
	
	//assigned class selection
	let selectTemp = constructElement("select", {
		name: `${BASE_ID}AssignedClass`,
		required: ""
	});
	for (let langClass of langClasses) {
		selectTemp.appendChild(constructElement(
		"option", {
			value: langClass.lang_class_id
		}, 
			`${langClass.lang_class_id}/
			${langClass.class_name_ch}`));
	}
	trBase.appendChild(wrapTd(selectTemp));
	
	trBase.appendChild(
		wrapTd(constructElement("input", {
			type: "date",
			name: `${BASE_ID}CultureClass`,
			required: ""
		}))
	);
	
	//Chinese skill level
	let chineseLevelTd = document.createElement("td");
	let tempElems = createRadioButtons(`${BASE_ID}ChineseLevel`, 
		["beginner", "intermediate", "advanced"],
		[`${BASE_ID}ChineseLevelB`, `${BASE_ID}ChineseLevelI`, `${BASE_ID}ChineseLevelA`],
		["Beginner", "Intermediate", "Advanced"]
	);
	for (let elem of tempElems) {
		chineseLevelTd.appendChild(elem);
	}
	trBase.appendChild(chineseLevelTd);

	//Gender options
	let genderTd = document.createElement("td");
	tempElems = createRadioButtons(`${BASE_ID}Gender`, 
		["m", "f"],
		[`${BASE_ID}GenderM`, `${BASE_ID}GenderF`],
		["M", "F"]
	);
	for (let elem of tempElems) {
		genderTd.appendChild(elem);
	}
	trBase.appendChild(genderTd);
	
	//new student
	let newStudentTd = document.createElement("td");
	tempElems = createRadioButtons(`${BASE_ID}NewStudent`, 
		["true", "false"],
		[`${BASE_ID}NewStudentTrue`, `${BASE_ID}NewStudentFalse`],
		["Yes", "No"]
	);
	for (let elem of tempElems) {
		newStudentTd.appendChild(elem);
	}
	trBase.appendChild(newStudentTd);

	studentTable.appendChild(trBase);
}

function removeStudentRow(idNum) {
	let targ = document.getElementById(`${STUDENT_ID_BASE}${idNum}`);
	targ.remove();
}

//add or delete student rows
//there's a slight bug where the count can get
//out of sync
numStudentsPicker.addEventListener("change", event => {
	let newNum = parseInt(event.target.value);
	console.log(newNum);
	if (curStudents > newNum) {
		let counter = curStudents;
		while (counter > newNum) {
			removeStudentRow(counter--);
		}
		
		curStudents = newNum;
	}
	else if (curStudents < newNum) {
		let counter = curStudents+1;
		while (counter <= newNum) {
			addStudentRow(counter++);
		}
		
		curStudents = newNum;
	}
});

//whether or not to give the user the option
//to sign up to be on the administration or
//to be a teacher
yearsTeachAdmin.addEventListener("change", event => {
	let labelId = "teachAdminLabel";
	if (parseInt(event.target.value) === 0) {
		if (document.getElementById("teachAdminRegister") == null) {
			let teachAdminDiv = document.getElementById("teachAdminDiv");
			let registerLabel = document.createElement("label");
			registerLabel.id = labelId;
			registerLabel.innerHTML = "If you wish, you may join the administration or be a teacher";
			let tempContent = createRadioButtons("teachAdminChoice", ["admin", "teacher"],
				["teachAdminChoiceAdmin", "teachAdminChoiceTeach"],
				["Administration", "Teacher"]);
			for (let elem of tempContent) {
				registerLabel.appendChild(elem);
			}
			teachAdminDiv.appendChild(registerLabel);
		}
	}
	else {
		let teachAdminLabel = document.getElementById(labelId);
		if (teachAdminLabel != null) teachAdminLabel.remove();
	}
});

getLangClasses().then(classes => {
	langClasses = classes;
});

})()

