// Activate debug to see Connection logs and arrival of xRTML messages logs.
xRTML.Config.debug = true;
// Reference to the connection we are about to create.
var con;

xRTML.load(function(){
	// At this point, since xRTML is ready, we need to create a connection in order to send messages.
	con = xRTML.ConnectionManager.create({
		id:'myConnection',
		appKey:'myAppKey',
		authToken:'myAuthToken',
		url:'https://ortc-developers.realtime.co/server/2.1/',
		channels:[{name:'Channel1'}],
		// Here we define an handler to the event OnMessage of the connection.
		onMessage: function(e){
			alert(e.message);
		}
	});
});
// Here we define the function to send a message with random content.
// We will set this function as the click handler of the HTML input button.
var send = function (){
	con.send({
		channel: "Channel1",
		content: xRTML.Common.Util.idGenerator()
	})
};