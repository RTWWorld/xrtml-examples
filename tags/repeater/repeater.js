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

xRTML.load(function(){
    // At this point we have xRTML and the DOM fully loaded.
    // Now we create Repeater tag to add and remove content into the target. 
    // By default, the Repeater tag inserts new elements at the beginning of the list and removes from the end.
    // For more information about the Repeater tag visit http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.repeater.htm
    xRTML.TagManager.create({
        name: 'Repeater',
        // The target to be affected by the repeater
        target: "#repeater-target",
        // The id of the template script to use.
        template: "repeater-template",
        // The number of items the repeater target is allowed to have. When this limit is reached, a removal will occur.
        maxItems: 5,
        // Initial data to populate 
        initialData: [
            { value : "initial Value 1" },
            { value : "initial Value 2" },
            { value : "initial Value 3" }
        ],
        triggers:["myTrigger"]
    });
});

// Definition of the click handler of the insert button.
// This function sends a xRTML Message to insert new content.
function insert(){
    var val = xRTML.Sizzle("#message-source")[0].value;
    var message = xRTML.MessageManager.create({
        trigger: "myTrigger",
        action: "insert",
        data: {
            content:{
                value : val
            }
        }
    });
    xRTML.ConnectionManager.sendMessage({ connections: ["myConnection"], channel: "myChannel", content: message });
};

// Definition of the click handler of the remove button.
function remove(){
    var val = xRTML.Sizzle("#message-source")[0].value;
    var message = xRTML.MessageManager.create({
        trigger: "myTrigger",
        action: "remove",
        data: {}
    });
    xRTML.ConnectionManager.sendMessage({ connections: ["myConnection"], channel: "myChannel", content: message });
};