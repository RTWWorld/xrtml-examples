// Activate debug to see some useful logs.
xRTML.Config.debug = true;

xRTML.load(function () {
	// At this point we have xRTML ready and the DOM fully loaded.	
	// First, as always, we start by defining a connection. Do not forget to change the application key and authentication token.
    xRTML.ConnectionManager.create({
        url: "http://ortc-developers.realtime.co/server/2.1",
        id: "myConnection",
        appKey: 'myAppkey',
        authToken: 'myAuthToken',
        channels: [{ name: 'myChannel'}]
    });

    // Then we define a videochat tag with moderator role. This tag will moderate the videochat room.
    xRTML.TagManager.create({
    	id: "myVideochatModerator",
        name: 'Videochat',
        // The id of the connection used by the videochat tag.
        connections: ['myConnection'],
        // The channel to send the messages.
        channelId: "myChannel",
        triggers: ['myTrigger'],	
        // The role of the tag.           
        role: 'moderator',
        // Here we define the name of the provider, the url of the service to generate tokens and sessions, and the apiKey of the provider.
        provider: {
            // The name of the provider.
            name: "tokBox",
            // The url of the service. You can find an example of the service in this example (server.js file).
            serviceUrl: 'http://url_of_the_service:8000/',
            // The key provided by opentok.
            apiKey: "XXXX"
        }
    });
    // By default, the tag will generate the UI in the body element of the page.
    // For more information about the Videochat tag visit http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.videochat.htm
});