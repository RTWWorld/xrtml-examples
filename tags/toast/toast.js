// Activate debug to see some useful logs.
xRTML.Config.debug = true;

xRTML.ready(function (e) {
	// At this point, since xRTML is ready, we need to create a connection in order to send messages.
	// To do that we use method "create" of the ConnectionManager module.
    xRTML.ConnectionManager.create({
        url: "http://ortc-developers.realtime.co/server/2.1",
        id: "c1",
        appKey: 'myAppKey',
        authToken: '9a9056df-90c3-49a6-bec2-e528f1f34c66',
        channels:[{name:'myChannel'}]
    });
});

xRTML.load(function(){
	// At this point we have xRTML and the DOM fully loaded.
	// Now we create Toast tag to generate toasts based on the messages received.
	// For more information about the Toast tag visit http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.toast.htm
	xRTML.TagManager.create({
		name:'Toast',
		triggers:['toast-trigger']
	});
});

// Here we define the function that send the toast messages. 
// This function will be called every time a user click a button of the demo.
function sendToast(type) {
    var message = xRTML.MessageManager.create({
        trigger: "toast-trigger",
        action: "",
        data: toastMessages[type]
    });
    xRTML.ConnectionManager.sendMessage({ connections: ["c1"], channel: "myChannel", content: message });
};

// Structure with some toast message possibilities 
var toastMessages = {
    image: {
    	// Title of the notification.
        title: "Test Title - Image Toast",
        // Text content of the notification
        text: "Test Text - Image Toast",
        // Flag that defines if the banner have a associated banner.
        displayBanner: true,
        // The type of the banner to show.
        bannerType: "image",
        // The url of the banner.
        bannerUrl: "http://www.xrtml.org/img/figure_about.png",
        // The url to be redirected.
        destinationUrl: "http://www.xrtml.org"
    },
    html: {
    	// Title of the notification.
        title: "Test Title - HTML Toast",
        // Text content of the notification
        text: "Test Text - HTML Toast",
        // The type of the banner to show.
        displayBanner: true,
        // The type of the banner to show.
        bannerType: "html",
        // The url to be redirected.
        destinationUrl: "http://www.xrtml.org",
        // The HTML content of the banner.
        bannerContent: '<div><center>This is a test.</center></div>'
    },
    video: {
    	// Title of the notification.
		title: "Test Title - Video Toast",
		// Text content of the notification
        text: "Test Text - Video Toast",
        // Flag that defines if the banner have a associated banner.
        displayBanner: true,
        // The type of the banner to show.
        bannerType: "video",	
        // The url to be redirected.                
        destinationUrl: "http://www.xrtml.org",
        // The video source object.
        // Since the video banner uses the xRTML Video tag, you can get more information about it at http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.video.htm
        bannerSource:{
			files: {
				yt:"6BYUKtVY41Q"
			},
			autoplay: true,
			loop: false,
			playNow: true
        }					
	},
	iframe: {
		// Title of the notification.
		title: "Test Title - Iframe Toast",
		// Text content of the notification
        text: "Test Text - Iframe Toast",
        // Flag that defines if the banner have a associated banner.
        displayBanner: true,
        // The type of the banner to show.
        bannerType: "iframe",	    
        // The url to be redirected.            
        destinationUrl: "http://www.xrtml.org",
        // The url of the banner.
        bannerUrl: "http://www.realtime.co",
        // The width of the banner.
        bannerWidth: 800,
        // The height of the banner.
        bannerHeight: 600
	}
};