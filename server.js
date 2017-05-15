//We use a map to store times in a given instance of server. This guarantees near-constant time for updating and accessing time instances.
//We can write further helper methods to store times permanently.

var restify = require('restify');
var times = new Map();

function respondSet(req, res, next) {
  	times.set(req.params.id, req.params.UTCtime);
    res.send(JSON.stringify({response: 'Time Set Complete!'}));
    next();
}

function respondBlankSet(req, res, next) {
	res.send(JSON.stringify({response: 'No Time Specified...'}));
	next();
}

function respondDelete(req, res, next) {
	times.delete(req.params.id);
	res.send(JSON.stringify({response: 'Time ' + req.params.id + ' Deleted.'}));
	next();
}

function respondGet(req, res, next) {
	var date = new Date(times.get(req.params.id));
	date.setHours(date.getHours() + 3); //Adding an arbitrary number of hours. 
	res.send(date);
	next();
}

function serverResponse() {
	server.get('/time/set/:id/', respondBlankSet);
	server.get('/time/set/:id/:UTCtime', respondSet);
	server.get('/time/get/:id/:zone', respondGet);
	server.get('/time/delete/:id', respondDelete);
	server.head('/time/set/:id', respondBlankSet);
	server.head('/time/set/:id/:UTCtime', respondSet);
	server.head('/time/get/:id/:zone', respondGet);
	server.head('/time/delete/:id', respondDelete);
}

var server = restify.createServer();
serverResponse();

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});