// Activate debug to see some useful logs.
xRTML.Config.debug = true;

// Connection Reference
var connection;

xRTML.ready(function (e) {
	// At this point, since xRTML is ready, we need to create a connection in order to send messages.
	// To do that we use method "create" of the ConnectionManager module.
    connection = xRTML.ConnectionManager.create({
        url: "http://developers2.realtime.livehtml.net/server/2.1",
        id: "myConnection",
        appKey: 'myAppKey',
        authToken: 'myAuthToken',
        channels:[{name:'myChannel'}]
    });
});

xRTML.load(function () {
    // At this point we have xRTML and the DOM fully loaded. Now we create an Video tag.    
    // For more information about the Video tag visit http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.video.htm
    xRTML.TagManager.create({
        name: 'Video',
        // Defines if the control bars are visible.
        controlsBar: true,
        triggers:['myTrigger']
    });
});

// An object with Video files sources and configurations.
var myAppSources = {
    drawingboard: {
        // An object with the video files in diferent extensions and the youtube video id.
        files: {
            mp4: "http://xrtml.org/demos/video/drawingboard.mp4",
            webm: "http://xrtml.org/demos/video/drawingboard.webm",
            ogg: "http://xrtml.org/demos/video/drawingboard.ogg",
            yt: "6BYUKtVY41Q"
        },
        autoplay: true,
        loop: false,
        playNow: true
    },
    map: {
        // An object with the video files in diferent extensions and the youtube video id.
        files: {
            mp4: "http://xrtml.org/demos/video/map.mp4",
            webm: "http://xrtml.org/demos/video/map.webm",
            ogg: "http://xrtml.org/demos/video/map.ogg",
            yt: "cl5yuNEO9gc"
        },
        autoplay: true,
        loop: false,
        playNow: true
    },
    mousetracker: {
        // An object with the video files in diferent extensions and the youtube video id.
        files: {
            mp4: "http://xrtml.org/demos/video/mousetracker.mp4",
            webm: "http://xrtml.org/demos/video/mousetracker.webm",
            ogg: "http://xrtml.org/demos/video/mousetracker.ogg",
            yt: "uDFvFmZBMys"
        },
        autoplay: true,
        loop: false,
        playNow: true
    }
};
// Definition of the function that sends the messages.
function send(action) {
    var msg;

    if(action == "stop"){
        // The stop message just need the action property.
        msg = xRTML.MessageManager.create({
            trigger: 'myTrigger',
            action: 'stop',
            data:  null
        });
    
    }else{
        // In the play messages we send the files sources and configurations.
        msg = xRTML.MessageManager.create({
            trigger: 'myTrigger',
            action: 'play',
            data:  myAppSources[xRTML.Sizzle('input[type="radio"]:checked')[0].value]
        });
    }
        
    connection.send({
        channel:'myChannel',
        content: msg
    });    
}