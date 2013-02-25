# xRTML Connection/Channels Dashboard
The purpose of this demo is to show how to use the announcement sub channel of the connection.

As you possibly know, ORTC servers send monitoring messages to 4 specific public channels (ortcClientConnected, ortcClientDisconnected, ortcClientSubscribed and ortcClientUnsubscribed).

Let’s say you want to distinguish specific connections that became connected. You can do that by assign an announcement sub channel to the connection. Then, if you subscribe that specific subchannel, you can monitor that connection.

The format of the message received is similar to the announcement channels. You can find a demo that covers the announcement channels [here](https://github.com/RTWWorld/xrtml-examples/tree/master/connection/connection-dashboard).

## How it works
This demo is a mini-dashboard with the count of clients connected and the browser that they are using. We use the event “message” in each of the announcement sub channels to process the message and increment/decrement counters.

