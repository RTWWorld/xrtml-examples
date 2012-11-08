# xRTML Poll Tag
The Poll Tag provides the functionality for displaying and handling a voting poll in Realtime. 
It's main responsibilities are to handle the synchronization of data between clients, storing the data(when Storage is being used) and ensuring the user doesn't vote more than he is allowed (despite being restricted by client side security limitations).
The Templating mechanism that uses KnockoutJS(http://knockoutjs.com/) is being used in this Tag to allow the developer a customization of the markup layout, by allowing the user to iterate through the available voting items, they're names, and data (the number of votes). 
A very simple default template is provided with some CSS classes as defined by xRTML's CSS structure.

## For more information visit the [xRTML documentation site](http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.poll.htm "")