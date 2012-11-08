xRTML.ready(function () {
	// At this point, since xRTML is ready, we need to create a connection in order to send messages and bind event handlers.
	// To do that we use method "create" of the ConnectionManager module.
	var conn = xRTML.ConnectionManager.create({
		// The id of the connection.
		id: "myConnection",
		// The url of the ortc server.
	 	url: 'http://ortc-developers.realtime.co/server/2.1',
	 	// The channels to subscribe.
		channels: [{ name: "myChannel"}],
		// The application key
		appKey: "myAppKey",
		// The authentication token
		authToken: 'myAuthToken'
	});
	
	// Here we bind event handlers to the connection.
	conn.bind({
		// Fired when the connection obtains an ORTC client.
		create: function (e) {
			console.log("Connection Event: " + e.type);
		},
		// Fired when the connection is established.
		connect: function (e) { 
			console.log("Connection Event: " + e.type);
		},
		// Fired when there's a disconnection from the ORTC server.
		disconnect: function (e) { 
			console.log("Connection Event: " + e.type);
		},
		// Fired when the connection has subscribed to a channel.
		subscribe: function (e) { 				
			console.log("Connection Event: " + e.type + " - [" + e.channel + "]");
		},
		// Fired when the connection has unsubscribed a channel.
		unsubscribe: function (e) { 
			console.log("Connection Event: " + e.type + " - [" + e.channel + "]");
		},
		// Fired when an ORTC related exception has occurred.
		exception: function (e) {
			console.log("Connection Event: " + e.type);				
		},
		// Fired when a connection to an ORTC server is reestablished.
		reconnect: function (e) { 
			console.log("Connection Event: " + e.type);
		},
		// Fired when a connection to an ORTC server is in the process of being reestablished.
		reconnecting: function (e) { 
			console.log("Connection Event: " + e.type);
		},
		// Fired when a connection receives a message through a subscribed channel.
		message: function (e) { 
			console.log("Connection Event: " + e.type + " - [" + xRTML.JSON.stringify(e.message) + "]");
		},
		// Fired when a subscribed channel receives an xRTML message.
		xrtmlMessage: function(e){
			console.log("Connection Event: " + e.type + " - [" + xRTML.JSON.stringify(e.message) + "]");
		}
	});

	// Sends a message trought the connection.
	xRTML.ConnectionManager.sendMessage({
		connections: [conn.id],
		channel: "myChannel",
		content: "Hello World!!!"
	});
	// Sends a xRTML Message trought the connection.
	xRTML.ConnectionManager.sendMessage({
		connections: [conn.id],
		channel: "myChannel",
		content: xRTML.MessageManager.create({
			trigger: "myTrigger",
			action: "myAction",
			data: { d: "myData" }
		})
	});
	// For more information about Connection and its events check the documentation at http://docs.xrtml.org/3-0-0/javascript/xrtml.connectionmanager.connection.htm
});