// Activate debug to see some useful logs.
xRTML.Config.debug=true;

xRTML.ready(function(){
    // At this point, since xRTML is ready, we need to create a connection in order to send messages.
    // To do that we use method "create" of the ConnectionManager module.
    xRTML.ConnectionManager.create({
        id:'myConnection',
        appKey:'myAppKey',
        authToken:'myAuthToken',
        url:'http://ortc-developers.realtime.co/server/2.1',
        channels:[{name:'myChannel'}]
    });
});                                 

xRTML.ready( function() {
    // At this point we have xRTML and the DOM fully loaded. Now we create an Poll tag.    
    // For more information about the Poll tag visit http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.poll.htm
    xRTML.TagManager.create({
        name:'Poll',
        id:'poll01',
        channelId: 'myChannel',
        connections:['myConnection'],
        target: '#poll01',
        votesAllowed: 500,
        triggers:[{name:'poll1Trigger'}],
        voteItems:[
            { name: 'Item 1' },
            { name: 'Item 2' }
        ]
    });
});