xRTML.Config.debug = true;

var conn = null;
var username = "User-"+ xRTML.Common.Util.idGenerator();

function connect(){
	if (conn == null) {
		conn = xRTML.ConnectionManager.create({
	        url: "http://ortc-developers.realtime.co/server/2.1",
	        id: "myConnection",
	        appKey: "myAppKey",
	        authToken: "authtoken",
	        metadata: xRTML.JSON.stringify({ username : username })
	    });

	    conn.bind({
	    	connect: function(){    			

	    	},
	    	disconnect: function(){

	    	}

	    });
    }else{
    	conn.connect({	        
	        appKey: "myAppKey",
	        authToken: "authtoken"
	    });
    }
};
function disconnect(){
	conn.disconnect();
};
function oncheck(e){
	if(!conn){
		return;
	}
	var channelName = e.value;

	if(e.checked){
		conn.subscribe({name: channelName});
	}else{
		conn.unsubscribe(channelName);
	}
}