// Reference to the connection.
var conn = null;
// A generated user name.
var username = "User-"+ xRTML.Common.Util.idGenerator();
// Click handler to create and establish a connection.
function connect(){

	if (conn == null) {
		// Since we do not have a connection, we need to create it.
		conn = xRTML.ConnectionManager.create({
	        url: "http://ortc-developers.realtime.co/server/2.1",
	        id: "myConnection",
	        appKey: "myAppKey",
	        authToken: "authtoken",
	        metadata: xRTML.JSON.stringify({ username : username })
	    });

		// Handlers to the connection event to update the controls. Enable/Disable elements.
	    conn.bind({
	    	// Disable the connect button, enable the disconnect button and enable the subscribe/unsubscribe checkboxes. 
	    	connect: function(){
				var elems = xRTML.Sizzle("*[disabled = disabled]");

				for (var i = 0; i < elems.length; i++) {
    				elems[i].removeAttribute("disabled");
    			}

    			xRTML.Sizzle("#connect")[0].setAttribute("disabled", "disabled");

	    	},
	    	// Enable the connect button, disable the disconnect button and disable the subscribe/unsubscribe checkboxes. 
	    	disconnect: function(){
	    		var elems = xRTML.Sizzle("input");

				for (var i = 0; i < elems.length; i++) {
    				elems[i].setAttribute("disabled", "disabled");
    			}

    			xRTML.Sizzle("#connect")[0].removeAttribute("disabled");
	    	}

	    });

    }else{
    	// Since we already have a connection, we just need to reconnect with the credentials.
    	conn.connect({	        
	        appKey: "myAppKey",
	        authToken: "authtoken"
	    });

    }

};

// Handler for the disconnect button.
function disconnect(){
	conn.disconnect();
};
// Handler subscribe/unsubscribe checkboxes.
function oncheck(e){
	var channelName = e.value;	
	if(e.checked){
		conn.subscribe({name: channelName});
	}else{
		conn.unsubscribe(channelName);
	}
};