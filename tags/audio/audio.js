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
    // At this point we have xRTML and the DOM fully loaded. Now we create an Audio tag.    
    // For more information about the Audio tag visit http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.audio.htm
    xRTML.TagManager.create({
        name: 'Audio',
        // Defines if the control bars are visible.
        controlsBar: true,
        triggers:[{ name: 'myTrigger'}]
    });
});

// An object with Audio files sources and configurations.
var myAppSources = {
    paytherent: {
        // An object with the audio files in diferent extensions.
        files: {
            mp3: "http://xrtml.org/demos/audio/paytherent.mp3",
            wav: "http://xrtml.org/demos/audio/paytheRent.wav",
            ogg: "http://xrtml.org/demos/audio/paytheRent.ogg"
        },
        autoplay: true,
        loop: false,
        playNow: true
    },
    fakepreciousstone: {
        // An object with the audio files in diferent extensions.
        files: {
            mp3: "http://xrtml.org/demos/audio/fakepreciousstone.mp3",
            wav: "http://xrtml.org/demos/audio/fakepreciousstone.wav",
            ogg: "http://xrtml.org/demos/audio/fakepreciousstone.ogg"
        },
        autoplay: true,
        loop: false,
        playNow: true
    },
    borrowedtime: {
        // An object with the audio files in diferent extensions.
        files: {
            mp3: "http://xrtml.org/demos/audio/borrowedtime.mp3",
            wav: "http://xrtml.org/demos/audio/borrowedtime.wav",
            ogg: "http://xrtml.org/demos/audio/borrowedtime.ogg"
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