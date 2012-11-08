// Activate debug to see some useful logs.
xRTML.Config.debug = true;

xRTML.ready(function(){
	// At this point, since xRTML is ready, we need to create a connection in order to send messages.
	// To do that we use method "create" of the ConnectionManager module.
	// For more information about the criation of connections and channels visit http://docs.xrtml.org/3-0-0/javascript/xrtml.connectionmanager.htm
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
        channels: [{name: 'myChannel'}]
    });

	// Then we create a Execute with a callback.
	// For more information about the execute tag visit http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.execute.htm
    xRTML.TagManager.create({
    	name: 'Execute',
    	// The tag callback insert a new li into the first target with the received message.
    	callback: function(data){
    		var li = document.createElement('li');
    		li.innerHTML = data.text;
    		xRTML.Sizzle("#container1")[0].appendChild(li);
    	},
    	// The array of triggers to register. Every message received with the trigger 'execute-test' will be process by this execute tag.
    	triggers:[{ name:'execute-trigger'}]
    });
});

xRTML.load(function(){
	// At this point we have xRTML and the DOM fully loaded and we can apply event listeners to elements in order to send messages.
    // Now we bind a event click handler to the button "#send-button-1"
    xRTML.Event.bind(xRTML.Sizzle("#send-button-1")[0], {
    	click: function(e){	            		
			var xrtmlMessage = xRTML.MessageManager.create({
				trigger: 'execute-trigger',            				
				action: null,
				data:{            					
					text: xRTML.Sizzle("#messge-source")[0].value
				}
			});
			xRTML.ConnectionManager.sendMessage({ connections: ["myConnection"], channel: 'myChannel', content: xrtmlMessage });	            		
    	}
    });

	// And bind another event click handler to the button "#send-button-2"
	xRTML.Event.bind(xRTML.Sizzle("#send-button-2")[0], {
    	click: function(e){	            	
			var xrtmlMessage = xRTML.MessageManager.create({
				trigger: 'execute-trigger',
				action: null,
				data:{
					text: xRTML.Sizzle("#messge-source")[0].value,
					// Now we specify the callback we want to execute (must be defined).
					callback: 'insertInRightContainer'
				}
			});
			xRTML.ConnectionManager.sendMessage({ connections: ["myConnection"], channel: 'myChannel', content: xrtmlMessage });
    	}
    });
});

// Here we define the callback to process the message sent by the button "#send-button-2"
function insertInRightContainer(data){
	// This callback inserts the content of the message received into the container 2
	var li = document.createElement('li');
	li.innerHTML = data.text;
	xRTML.Sizzle("#container2")[0].appendChild(li);
}