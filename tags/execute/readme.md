# xRTML Execute Tag
The Execute Tag allows for configuring custom functions to be triggered by the arrival of xRTML messages. 
This is a very simple Tag that only has this specific responsibility and exists only for allowing developers to take advantage of the core Tag handling mechanisms.

## How it works
Basically this demo consists of buttons that send messages with the same trigger as the one registered in the tag Execute.
Based on the message received, the execute will have diferent behaviours. If the property data of the message contains the property callback, the function that will execute is the one with the same name as the callback property. Otherwise the function that will execute is the one defined at the instatiation of the tag.

Keep in mind that we are sending and receiving messages in the same page. We could open multiple windows to see the broadcast of messages.

## For more information visit the [xRTML documentation site](http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.execute.htm "")