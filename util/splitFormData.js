"use strict";

const props = require("./props");

/*
example output:

{ fatherChinese: 'q',
  fatherSpecialty: 'w',
  fatherEnglish: 'e',
  fatherActivities: 'r',
  motherChinese: 't',
  motherSpecialty: 'y',
  motherEnglish: 'u',
  motherActivities: 'i',
  address: 'o',
  newAddr: 'true',
  yearsTeachAdmin: '1',
  email: 'few@agew.cswe',
  phone: '1234567890',
  numStudents: '1',
  student1EnglishName: 'p',
  student1ChineseName: 'a',
  student1Dob: 's',
  student1AssignedClass: 'd',
  student1CultureClass: 'f',
  student1ChineseLevel: 'intermediate',
  student1Gender: 'm',
  student1NewStudent: 'false' }
 * */


//orig is not modified, other args will though (output)
function splitData(orig, familyData,
		parentData, studentData) {
	for (let prop in orig) {
		if (props.FATHER_PROPS.includes(prop)) {
			parentData[0][prop] =
				orig[prop];
		}
		else if (props.MOTHER_PROPS.includes(prop)) {
			parentData[1][prop] =
				orig[prop];
		}
		else if (props.FAMILY_PROPS.includes(prop)) {
			familyData[prop] =
				orig[prop];
		}
		else if (prop.includes(props.STUDENT_BASE)) {
			//string should be formatted: student{num}{prop}
			let temp = prop.indexOf(props.STUDENT_BASE);
			temp += props.STUDENT_BASE.length;
			let studentNum = parseInt(prop.charAt(temp));
			if (studentData[studentNum] === undefined) {
				studentData[studentNum] = {};
			}
			studentData[studentNum][prop.slice(temp+1)] = orig[prop];
		}
	}
}

module.exports = {
	splitData
};

