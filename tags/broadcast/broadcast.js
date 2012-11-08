// Activate debug to see some useful logs.
xRTML.Config.debug = true;

xRTML.ready(function(){
	// At this point, since xRTML is ready, we need to create a connection in order to send messages.
	// To do that we use method "create" of the ConnectionManager module.
	xRTML.ConnectionManager.create({
		// The id of the connection we are about to create.
		id: "myConnection",
		// URL of the ORTC server.
        url: 'http://ortc-developers.realtime.co/server/2.1',
        // The application key you receive when you registered in our site.
        appKey: 'myAppKey',
        // An authentication token.
        authToken: 'myAuthToken',
        // The array of channels you want to subscribe.
        // In this demo we will subscribe the execute-test-channel.
        // If we do not subscribe any channel, by opening the console we can see that the messages are only sent.
        channels: [{
        	name: 'myChannel',
        	// We create a "onmessage" handler to process the messages received. We could also use a Execute tag to process the messages received.
        	// For more information about Channels visit http://docs.xrtml.org/3-0-0/javascript/xrtml.connectionmanager.channel.htm
        	onMessage: function(e){
				var li = document.createElement('li');
				li.innerHTML = e.message.data.value;
				xRTML.Sizzle("#receiver-container")[0].appendChild(li);
			}
		}]
    });	
});

xRTML.load(function(){
	// At this point we have xRTML and the DOM fully loaded.
	// Now we create a Broadcast tag with some types of dispatchers.
	xRTML.TagManager.create({
		name: 'Broadcast',
		// The connection to send the 
		connections: ['myConnection'],
		channelid: 'myChannel',
		dispatchers: [{
			// This dispatcher will send a message as soon as the connection associated with the broadcast becomes active.
			// The message sent is created and returned by the following callback.
			callback: function(){
				return xRTML.MessageManager.create({
					trigger: "myTrigger",
					action: "", 
					data: {
						value: "MyValue"
					}
				});
			}
		}, {
			// This dispatcher will send a message whenever the user click in the "#send-button"
			// Again, the message is created and returned by the following callback.
			callback: function(){
				return xRTML.MessageManager.create({
					trigger: "myTrigger",
					action: "", 
					data: {
						value: "RandomMessage"
					}
				});
			},
			event: "click",
			target: "#send-button"
		}, {
			// This dispatcher will send a message every time the event "change" in the "#message-source" element is fired.
			// The message is created based on the "messageAttribute" of the "messageSource" element.
			messageSource: "#message-source",
			messageAttribute:"value",
			event: "change",
			target: "#message-source"
		}]
	});
});