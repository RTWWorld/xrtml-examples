// Activate debug to see some useful logs.
xRTML.Config.debug = true;

xRTML.load(function () {
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
        // If we do not subscribe any channel, by opening the console we can see that the messages are only sent.        
        channels: [{name: 'myChannel'}]
    });
    
    // Then we create a Shoutbox tag.    
    // For more information about the Shoutbox tag visit http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.shoutbox.htm
    xRTML.TagManager.create({
        name: 'Shoutbox',
        id: "myShoutBox",
        // The connections and the channel to send the messages.
        connections: ['myConnection'],                                
        channelId: "myChannel",
        // The trigger of the Shoutbox.
        triggers: ['myTrigger'],
        // The target where the Shoutbox elements will be rendered.
        target: "#shoutbox"
    });
});