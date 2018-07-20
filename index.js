"use strict";

//TODO server side input validation
//TODO allow users to check emails, names, address for uniqueness

const	express = require("express"),
	bodyParser = require("body-parser");

const db = require("./util/db");
const splitFormData = require("./util/splitFormData.js");

const PORT = 3000;
const HOST = "localhost";

let app = express();
let dbRef;

app.use(express.static("static/html"));
app.use(express.static("static/css"));
app.use(express.static("static/js"));
app.use(bodyParser.urlencoded({extended: false}));

app.post("/submit", (req, res) => {
	console.log(req.body);
	
	let familyData = {};
	let parentData = [{}, {}];	//0 dad, 1 mom
	let studentData = [];

	splitFormData.splitData(req.body, familyData,
		parentData, studentData);
	console.log(familyData);
	console.log(parentData[0]);
	console.log(parentData[1]);
	console.log(studentData[1]);
	db.insertFamily(familyData, parentData, studentData);
	
	res.redirect("/");
});

app.listen(PORT, HOST, () => {
	console.log(`listening on ${HOST}:${PORT}`);
	dbRef = db.openDb();
	db.initDb(dbRef);

	let familyData = { address: '123 Apple Lane',
		newAddr: 'false',
		yearsTeachAdmin: '1',
		email: 'few@agew.cswe',
		phone: '123-456-7890',
		numStudents: '1'
	};
	let parentData = [{ fatherChinese: 'Lao Shu',
		fatherSpecialty: 'Dancing',
		fatherEnglish: 'Denny Young',
		fatherActivities: 'None'
	},
	{
		motherChinese: 'Ping Guo',
		motherSpecialty: 'Swimming',
		motherEnglish: 'Alexis Young',
		motherActivities: 'Reading'
	}];
	let studentData = [];
	studentData[1] = { EnglishName: 'Very Young',
		ChineseName: 'Bai Mi',
		Dob: '5/12/10',
		AssignedClass: 'Conversation 1',
		CultureClass: 'None',
		ChineseLevel: 'intermediate',
		Gender: 'f',
		NewStudent: 'true'
	};
	db.insertFamily(dbRef,
		familyData, parentData, studentData);
});

