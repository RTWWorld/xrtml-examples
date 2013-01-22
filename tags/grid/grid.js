// Activate debug to see some useful logs.
xRTML.Config.debug = false;

xRTML.ready(function () {
	// At this point, since xRTML is ready, we need to create a connection in order to send messages.
	// To do that we use method "create" of the ConnectionManager module.
    xRTML.ConnectionManager.create({
        url: 'http://ortc-developers.realtime.co/server/2.1',
        id: "myConnection",
        appKey: 'myAppKey',
        authToken: 'myAuthToken',
        channels: [{ name: 'myChannel'}]
    });
});

xRTML.load(function(){
	// At this point we have xRTML and the DOM fully loaded.
	// Now we create the grid tag to generate the slots.
	// For more information about the Grid tag visit http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.grid.htm
	xRTML.TagManager.create({
        name: 'Grid',
        // The connections that the Grid tag will use.
        connections: ['myConnection'],
        // The channel to send messages.
        channelId: 'myChannel',
        // the id of the owner of the tag.
        owner: 'User1',
        // The id of the element where the grid tag will generate the slots.
        target: "#target",
        // The number of marks that a user is allowed to do.
        markingLimit: 5,
        // The trigger of the tag.
        triggers: ['myTrigger'],
        // The object with the initial data.
        initialData: {
    		// the number of columns.
            columns: 10,
            // the number of rows.
            rows: 10,
            // An array with initial info regarding the slots
            data: [
            	// Slot disabled
                { row: 0, column: 0, state: "disabled" },
                // Slot disabled
                { row: 9, column: 0, state: "disabled" },
                // Slot disabled
                { row: 0, column: 9, state: "disabled" },
                // Slot disabled
                { row: 9, column: 9, state: "disabled" },
                // Slot marked by the user "User1"
                { row: 5, column: 5, state: "marked", owner: "User1", metaData: "myMetaData-User1" }
            ]
        }
    });	
});