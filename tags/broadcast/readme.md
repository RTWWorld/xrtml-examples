# xRTML Broadcast Tag

The Broadcast Tag allows for sending xRTML messages triggered at specific events, configurable by the Dispatcher elements.

## Dispatchers

The Dispatcher provides several ways of defining when to send a message: 
- **an interval of time;**
- **when a specific event occurs on a DOM Element;**
- **as soon as it is instantiated;**

It also allows to specify various means of obtaining the message content, such as: 
- **providing a selector to a DOM Element that holds the content;**
- **callback function that returns the message;**
- **by providing the message in a JSON format;**

## How it works
This demo basically shows how to create a Broadcast tag along with the dispatchers configurations.
Also we bind a "onMessage" handler to the channel in order to process the messages we received.

## For more information visit the [xRTML documentation site](http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.broadcast.htm "")