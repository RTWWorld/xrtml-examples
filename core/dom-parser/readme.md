# xRTML DOM Parser

xRTML tags can be instantiated two different ways: via JavaScript and via markup.
		
Since the reading of the markup tag attributes is case insensitive, we needed to create a mechanism to parse the xrtml markup to JavaScript object notation in order to create the respective tag. To do that we use the xRTML DOMParser module.

In this example we will show how to create a connection and an execute tag.