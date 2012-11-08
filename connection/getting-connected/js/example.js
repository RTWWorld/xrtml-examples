xRTML.ready(function () {
	xRTML.Config.debug = true;;

		var conn = xRTML.ConnectionManager.create(
		{
			id: "my_connection",
			url: "http://developers2.realtime.livehtml.net/server/2.1",
			channels: [{ name: "my_channel"}],
			appKey: "my_appkey",
			authToken: 'my_authtoken'
		}
	);
	
	conn.bind(
		{
			create: function (e) { },
			connect: function (e) { },
			disconnect: function (e) { },
			subscribe: function (e) { },
			unsubscribe: function (e) { },
			exception: function (e) { },
			reconnect: function (e) { },
			reconnecting: function (e) { },
			message: function (e) { }
		}
	);	

	xRTML.ConnectionManager.sendMessage(
		{
			connections: [conn.id],
			channel: "my_channel",
			content: "Hello World!!!"
		}
	);
});