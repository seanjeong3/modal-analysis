"use strict";

/* server information */
let serverIP = 'localhost';
let portno = 3000;

/* helpful modules */
let express = require('express');
let app = express();
let {PythonShell} = require('python-shell');
app.use(express.static(__dirname));

/*
 * run server
 */
var server = app.listen(portno, function () {
  var port = server.address().port;
  console.log('Listening at http://' + serverIP + ':' + port + ' exporting the directory ' + __dirname);
});

/*
 * landing page
 */
app.get('/', function (request, response) {
	response.send('Home page of the web server of files from ' + __dirname);
});

/*
 * parameters: dof int, m [double]*dof, k [double]*dof
 */
app.get('/modal_analysis', function (request, response) {
	try {
		var dof = request.query.dof;
		var m = JSON.parse(request.query.m);	
		var k = JSON.parse(request.query.k);
	}
	catch(err) {
		console.error(err);
		response.status(400).send(JSON.stringify(err));
		return;
	}

	// check m,k length
	if (m.length != dof || k.length != dof) {
		response.writeHead(400, {'Content-Type': 'text/plain'});
		response.end('error: inconsistent dof, m, k sizes');
		return;
	};

	// check m,k values
	for (var i in m) {
		console.log(m[i]);
		if (isNaN(m[i])) {
			response.writeHead(400, {'Content-Type': 'text/plain'});
			response.end('error: NaN value in m');
			return;
		};
	};
	for (var i in k) {
		console.log(k[i]);
		if (isNaN(k[i])) {
			response.writeHead(400, {'Content-Type': 'text/plain'});
			response.end('error: NaN value in k');
			return;
		};
	};

	// Pass queries to Python shell
	var options = {
		mode: 'json',
		pythonPath: 'python',
		pythonOptions: ['-u'],
		scriptPath: './compute',
		args: [dof,m,k]
	};
	PythonShell.run('modal_analysis.py', options, function (err, results) {
		if (err) {
			response.status(400).send(JSON.stringify(err));
		} else {
			// console.log(results);
			// console.log(results[0]['mode'])
			response.status(200).send(results);
		}
	});
});