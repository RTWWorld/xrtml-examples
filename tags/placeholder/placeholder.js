// Activate debug to see some useful logs.
xRTML.Config.debug = true;

xRTML.ready(function (e) {
	// At this point, since xRTML is ready, we need to create a connection in order to send messages.
	// To do that we use method "create" of the ConnectionManager module.
    xRTML.ConnectionManager.create({
        url: "http://developers2.realtime.livehtml.net/server/2.1",
        id: "myConnection",
        appKey: 'myAppKey',
        authToken: 'myAuthToken',
        channels:[{name:'myChannel'}]
    });
});

xRTML.load( function() {
    // At this point we have xRTML and the DOM fully loaded. Now we create a Placeholde tag.
    // For more information about the Placeholde tag visit http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.placeholder.htm
    xRTML.TagManager.create({
        name: 'Placeholder',
        // The target to be affected by the repeater
        target: "#placeholder-target",
        // The id of the template script to use.
        template: "placeholder-template",
        // Initial data to populate 
        initialData: { url : "xrtml.gif" },
        // The trigger of the tag
        triggers:["myTrigger"]
    });
});

// Definition of the click handler of the insert button.
// This function sends a xRTML Message to insert new content.
function insert(){
    var message = xRTML.MessageManager.create({
        trigger: "myTrigger",
        action: "insert",
        data: {
            url: xRTML.Sizzle(".image-selector:checked")[0].value + ".gif"
        }
    });
    xRTML.ConnectionManager.sendMessage({ connections: ["myConnection"], channel: "myChannel", content: message });
};