# xRTML Video Tag
The Video Tag provides functionality for controlling the playback of video files remotely using Realtime.
Uses HTML5's video tag when possible or a Flash based fallback. The playback of YouTube videos is also supported.
The types of file chosen by the tag are according to the support provided by the browser, but the developer will have to provide video files in each of the formats necessary to ensure support on all major browsers: mp4, ogg, webm, swf.

## How it works
The intent of this demo is to show how create an xRTML Video tag and have a glimpse of messages that the Video tag can process. Basically this demo shows how to play and stop videos. Whenever a user chooses a video and click the send button a message with the source files and configurations will be sent and then processed by the xRTML Video tag.
There is also a stop button that sends a message to stop the current video.

## For more information visit the [xRTML documentation site](http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.video.htm "")