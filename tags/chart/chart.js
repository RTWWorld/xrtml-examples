// Activate debug to see some useful logs.
xRTML.Config.debug = true;

xRTML.ready(function(){
    // At this point, since xRTML is ready, we need to create a connection in order to send messages.
    // To do that we use method "create" of the ConnectionManager module.
    xRTML.ConnectionManager.create({
        id:'myConnection',
        appKey:'myAppKey',
        authToken:'myAuthToken',
        url:'http://ortc-developers.realtime.co/server/2.1',
        channels:[{name:'myChannel'}]
    });
});                                 

xRTML.ready(function(){
    // At this point we have xRTML and the DOM fully loaded. Now we create an Chart tag.    
    // For more information about the Chart tag visit http://docs.xrtml.org/3-0-0/javascript/xrtml.tags.chart.htm
    xRTML.TagManager.create({
        name:'Chart',
        id:'chart01',
        triggers:['chart1Trigger'],
        // The type of the chart.
        chartingPlatform:'htmlchart',
        settings:{
            chart: { renderTo: 'chart01' },
            title: { text: 'Tutorial Chart' },
            subTitle:{ text:'Test Chart Subtitle' },
            series: [ 
                { name: 'Item 1', data: [300] }, 
                { name: 'Item 2', data: [200] }, 
                { name: 'Item 3', data: [100] }
            ]
        }
    });
});

// Definition of the function to update the middle data item.
function updateValue() {
    var message = xRTML.MessageManager.create({action:'update', trigger:'chart1Trigger', data:{index:1, value:50}});
    xRTML.ConnectionManager.getById('myConnection').send({channel:'myChannel', content:message});  
}
// Definition of the function to increment the middle data item by one.
function incrementValue() {
    var message = xRTML.MessageManager.create({action:'increment', trigger:'chart1Trigger', data:{index:1, incrementBy:1}});
    xRTML.ConnectionManager.getById('myConnection').send({channel:'myChannel', content:message});  
}

// Definition of the function to update the complete series of the chart.
function updateSeries() {
    var series = [{
        name: 'Item 4',
        data: [314]
    }, {
        name: 'Item 5',
        data: [987]
    }, {
        name: 'Item 6',
        data: [22]
    }];
    var message = xRTML.MessageManager.create({action:'updateSeries', trigger:'chart1Trigger', data:{series:series}});
    xRTML.ConnectionManager.getById('myConnection').send({channel:'myChannel', content:message});  
}