// Activate debug to see some useful logs.
xRTML.Config.debug = true;

// Connection Reference
var connection;

xRTML.ready(function (e) {
	// At this point, since xRTML is ready, we need to create a connection in order to send messages.
	// To do that we use method "create" of the ConnectionManager module.
    connection = xRTML.ConnectionManager.create({
        // The url of the server.
        url: "http://ortc-developers.realtime.co/server/2.1",
        // The id of the connection.
        id: "myConnection",
        // The application key.
        appKey: 'myAppKey',
        // The authentication token.
        authToken: 'myAuthToken',
        // The name of the channels to subscribe.
        channels:[{name:'myChannel'}]
    });
});

xRTML.load(function () {
    // At this point we have xRTML and the DOM fully loaded. Now we create a Booking tag.
    // For more information about the Video tag visit http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.booking.htm
    xRTML.TagManager.create({
        name: 'Booking',
        // The target where the slots will be rendered.
        target: '#target',
        // The connection used by the tag.
        connections: ["myConnection"],
        // The channel to send the messages.
        channelId: "myChannel",
        // The username.
        owner: "myUserName",
        // The number of books allowed.
        bookingLimit: 10,
        // The initial data used to build the slots.
        initialData:{
            // The number of rows.
            rows: 10,
            // The number of columns.
            columns:10,
            data:[
                // Specifies that the slot is booked by the user "myUserName".
                { row: 0, column: 0, state: "booked", owner: "myUserName"},
                // Specifies that the slot is booked by the user "myUserName".
                { row: 0, column: 1, state: "booked", owner: "myUserName"},
                // Specifies that the slot is disabled and cannot be booked.
                { row: 5, column: 5, state: "disabled"},
                // Specifies that the slot is disabled and cannot be booked.
                { row: 5, column: 6, state: "disabled"}
            ]
        },
        // The triggers of the tag.
        triggers:['myTrigger']
    });
});