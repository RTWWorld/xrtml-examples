# xRTML Chart Tag
The Chart Tag provides the functionality for displaying data provided by Realtime.
Currently there are three ways you can represent the data:

- *Using the default template which displays a bar chart and applying styles based on xRTML's CSS structure;*
- *Providing a custom KnockoutJS (http://knockoutjs.com/) template and traversing the data, displaying it accordingly;*
- *Using Highcharts (http://highcharts.com) which is a proprietary charting platform that allows displaying bar, pie, column and line charts;*

Chart will ensure that whenever a message is received that contains new data, this data is updated according to the chosen charting platform.
The Chart configuration and data can be provided by using Storage.

## For more information visit the [xRTML documentation site](http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.chart.htm "")