"use strict";
/*
 * this file just holds the different categories of form
 * properties
 *
 * Note: <name>_DB_PROPS is dependant on the column
 * order of the database
 * */

const FATHER_PROPS = [
	"fatherEnglish",
	"fatherChinese",
	"fatherSpecialty",
	"fatherActivities"
];

const MOTHER_PROPS = [
	"motherEnglish",
	"motherChinese",
	"motherSpecialty",
	"motherActivities"
];

const FAMILY_PROPS = [
	"address",
	"newAddr",
	"yearsTeachAdmin",
	"teachAdminChoice",
	"email",
	"phone",
	"numStudents"
];

const FAMILY_DB_PROPS = [
	"address",
	"newAddr",
	"yearsTeachAdmin",
	"teachAdminChoice",
	"email",
	"phone"
];

const STUDENT_BASE = "student";

const STUDENT_DB_PROPS = [
	"EnglishName",
	"ChineseName",
	"Dob",
	"AssignedClass",
	"CultureClass",
	"ChineseLevel",
	"Gender",
	"NewStudent"
];

module.exports = {
	FATHER_PROPS,
	MOTHER_PROPS,
	FAMILY_PROPS,
	FAMILY_DB_PROPS,
	STUDENT_BASE,
	STUDENT_DB_PROPS
};

