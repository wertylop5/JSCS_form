"use strict";

/*
 * Tables:
 * Families
 * Parents
 * Students
 *
 * Families contains references to parents and students
 * Parents contains info for each parent
 * Students contains info for each student
 *
 * families:
 * fam_id | address | is_new_addr | years_teach_admin | join_teach_admin | email | phone
 *
 * parents:
 * parent_id | fam_id | name_en | name_ch | specialty | activities
 *
 * students:
 * student_id | fam_id | name_en | name_ch | dob | class_assigned | class_culture |
 * chinese_level | gender | is_new
 * */

const sqlite3 = require("sqlite3").verbose();
const props = require("./props");

const DB_FILE = "stuff.db";

function openDb() {
	let db = new sqlite3.Database(DB_FILE, err => {
		if (err !== null) {
			console.log("error opening db");
		}
	});
	
	//makes all calls run synchronously
	db.serialize();
	
	return db;
}

/*
 * Creates a db objects and sets all operations
 * as serialized
 * */
function initDb(db) {
	db.run(`CREATE TABLE IF NOT EXISTS families (
		fam_id INTEGER PRIMARY KEY,
		address STRING,
		is_new_addr INTEGER,
		years_teach_admin INTEGER,
		join_teach_admin STRING,
		email STRING,
		phone STRING
	);`);

	db.run(`CREATE TABLE IF NOT EXISTS parents (
		parent_id INTEGER PRIMARY KEY,
		fam_id INTEGER,
		name_en STRING,
		name_ch STRING,
		specialty STRING,
		activities STRING
	);`);

	db.run(`CREATE TABLE IF NOT EXISTS students (
		student_id INTEGER PRIMARY KEY,
		fam_id INTEGER,
		name_en STRING,
		name_ch STRING,
		dob STRING,
		class_assigned STRING,
		class_culture STRING,
		chinese_level STRING,
		gender STRING,
		is_new integer
	);`);
	return db;
}

function insertStudents(db, famId, studentData) {
	let data;
	for (let student of studentData) {
		//index 0 should be empty
		if (student === undefined) continue;
		
		data = [null, famId];
		for (let prop of props.STUDENT_DB_PROPS) {
			if (prop in student) {
				data.push(student[prop]);
			}
			else {
				data.push(null);
			}
		}
		db.run(`INSERT INTO students VALUES (
			?, ?, ?, ?, ?, ?, ?, ?, ?, ?
		);`, data);
	}
	
}

function insertParentsHelper(db, baseData, parent, props) {
	let data = baseData.slice();
	for (let prop of props) {
		if (prop in parent) {
			data.push(parent[prop]);
		}
		else {
			data.push(null);
		}
	}
	db.run(`INSERT INTO parents VALUES (
		?, ?, ?, ?, ?, ?
	);`, data);
}

function insertParents(db, famId, parentData) {
	let data = [null, famId];

	//dad
	insertParentsHelper(db, data, parentData[0],
		props.FATHER_PROPS);

	//mom
	insertParentsHelper(db, data, parentData[1],
		props.MOTHER_PROPS);
}

/*
 * familyData is an object
 * parentData and studentData are both arrays of objects
 * */
function insertFamily(db,
		familyData, parentData, studentData) {
	
	//first, check if the family already exists
	db.get(`SELECT * FROM families WHERE email = ?;`,
		familyData["email"], (err, row) => {
		if (err) {
			console.log(err);
		}
		else {
			if (row !== undefined) {
				console.err(
				"family already exists");
			}
			return;
		}
	});
	
	let data = [null];
	for (let prop of props.FAMILY_DB_PROPS) {
		if (prop in familyData) {
			data.push(familyData[prop]);
		}
		else {
			data.push(null);
		}
	}
	console.log(`data: ${data}`);
	
	db.run(`INSERT INTO families VALUES (
		?, ?, ?, ?, ?, ?, ?
	);`, data);
	
	db.get(`SELECT * FROM families WHERE email = ?;`,
		familyData["email"], (err, row) => {
		if (err) {
			console.log(err);
		}
		else {
			console.log(row);
			let famId = row["fam_id"];
			insertStudents(db,
				famId, studentData);
			insertParents(db,
				famId, parentData);
		}
	});
}

function closeDb(db) {
	db.close(err => {
		if (err === null) {
			console.log("db closed");
		}
		else console.log("db close err");
	});
}

module.exports = {
	initDb,
	openDb,
	insertFamily,
	closeDb
};

