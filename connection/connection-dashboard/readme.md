# xRTML Connection/Channels Dashboard
The purpose of this demo is to show how to use the announcement channels. The announcement channels are the public channels that the ORTC server uses to send messages to inform the connect/disconnect of clients and subscription/unsubscription of channels.

Every time a client becomes connected, ORTC sends a message to the channel “ortcClientConnected”. Example of the content of the message sent:
{"cm": "MetaData"}

Basically the message is an object with the connection metadata.

When a client disconnects from the server, ORTC sends a message to the channel “ortcClientDisconnected”. Example of the content of the message sent:
{"cm": " MetaData "}

Again, the message is an object with the connection metadata.

There is a similar mechanism to the subscription and unsubscription of channels. Every time a client subscribes a channel ORTC will send a message to the channel “ortcClientSubscribed”. Example of the content of the message sent:
{"cm":" MetaData ","ch":"myChannel"}

Basically the message is an object with the connection metadata and the name of the channel subscribed.

When a client unsubscribes a channel, a message will be sent to the channel “ortcClientUnsubscribed”. Example of the content of the message sent:
{"cm":" MetaData ","ch":"myChannel"}

Basically the message is an object with the connection metadata and the name of the channel subscribed.

## How it works
This demo is a mini-dashboard with the count of clients connected and channels subscribed. We use the event “message” in each of the announcement channels to process the message and increment/decrement counters.

 ## For more information visit the [xRTML documentation site](http://docs.xrtml.org/3-0-0/javascript/xrtml.connectionmanager.htm "")
