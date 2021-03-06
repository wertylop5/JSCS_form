"use strict";

//TODO server side input validation
//TODO allow users to check emails, names, address for uniqueness
//TODO list all families, all students, and all classes

const	express = require("express"),
	bodyParser = require("body-parser");

const db = require("./util/db");
const splitFormData = require("./util/splitFormData.js");

const PORT = 3000;
const HOST = "localhost";

let app = express();
let dbRef;

//handles requests for static resource files
app.use(express.static("static/html"));
app.use(express.static("static/css"));
app.use(express.static("static/js"));

//handles form data submission
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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
	db.insertFamily(dbRef,
		familyData, parentData, studentData);
	
	res.redirect("/");
});

app.get("/check", (req, res) => {
	console.log(`uniqueness query: ${
		JSON.stringify(req.query)
	}`);
	
	db.checkUnique(dbRef,
		req.query.type, req.query.value,
		res.end).then(status => {
			console.log(status);
			res.end(status);
		});
});

app.get("/lang-classes", (req, res) => {
	db.getLangClasses(dbRef).then(classes => {
		res.end(JSON.stringify(classes));
	});
});

//client should probably pass along args
//the query will be assembled server side
app.get("/query", (req, res) => {
	console.log(`student query: ${
		JSON.stringify(req.query)
	}`);

	if (req.query["all"] === "true") {
		db.getClassEnrollment(dbRef).then(classes => {
			res.end(JSON.stringify(classes));
		});
	}
	
	//res.end(`{um: "hi"}`);
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
		ChineseName: '漢字',
		Dob: '5/12/10',
		AssignedClass: '6A',
		CultureClass: 'None',
		ChineseLevel: 'intermediate',
		Gender: 'f',
		NewStudent: 'true'
	};
	studentData[2] = { EnglishName: 'Brian Young',
		ChineseName: '漢鳥',
		Dob: '10/12/04',
		AssignedClass: '6A',
		CultureClass: 'None',
		ChineseLevel: 'intermediate',
		Gender: 'f',
		NewStudent: 'true'
	};
	studentData[3] = { EnglishName: 'Nick Li',
		ChineseName: '魚頭',
		Dob: '2/09/02',
		AssignedClass: 'PKA',
		CultureClass: 'None',
		ChineseLevel: 'intermediate',
		Gender: 'm',
		NewStudent: 'true'
	};
	db.insertFamily(dbRef,
		familyData, parentData, studentData);
});

