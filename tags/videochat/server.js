// This code is an example of a Node.js web service to generate sessions and tokens for the videochat tag.
// We use express library, but you can use any other you like.
// There are other OpenTok server side API's available, you can find them at http://www.tokbox.com/opentok/api/tools/documentation/api/rest_api.html

// Here we load the express module. The module must be installed locally or globally.
var express = require("express");
// Here we load the opentok module. The module must be installed locally or globally.
var Opentok = require("opentok");
// Here we define the credentials of opentok.
var OPENTOK_API_KEY = 'XXXX';
var OPENTOK_API_SECRET = 'XXXXXXXX';

// Here we create a OpenTokSDK object with the credentials defined above.
var OpentokClient = new Opentok.OpenTokSDK(OPENTOK_API_KEY,OPENTOK_API_SECRET);
// Here we define the express application object.
var app = express();
app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.query());
});
// Here we allow cross-domain access to our web service.
app.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");        
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,DELETE');
	res.header('Access-Control-Allow-Credentials', 'true');

 	if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});
// Here we define how to create sessions
app.get("/createsession", function(req, res){	
	var qs = req.query;
	OpentokClient.createSession("127.0.0.1", function(result){
		// The response must be in the following format:
		var response = {
			CreateSessionResult:{
				expireTime : (new Date()).setMilliseconds(parseInt(qs.timeToLive)),
				sessionId: result,
				token: OpentokClient.generateToken({'connection_data': "userid_" + new Date().getTime(),'role': "publisher"})
			}
		}
		// We generate automatically a token for the moderator.
	    res.send(response);
	});
});
// Here we define how to generate tokens
app.get("/generatetoken", function(req, res){	
	var qs = req.query;
	// The response must be in the following format:
	var response = {
        GenerateTokenResult : { 
            token: OpentokClient.generateToken({'connection_data': "userid_" + new Date().getTime(),'role': qs.role})
        }
    };	
    res.send(response);
	
});

app.listen(8000);