// Definition of the class that we use to create and store channels, clients and users.
var DashBoard = function(args){
    // Definition of the class Channel.
    var Channel = function(args){
        // The name of the Channel.
        this.name = args.name;
        // An array with the users subscribed.
        this.users = xRTML.Templating.observable(new Array());
        // Function to verify if the user is subscribed to this channel.
        this.userIsSubscribed = function(user){
            var users = this.users();
            for(var i = 0 ; i < users.length; i++ ){
                if(user.name == users[i].name){
                    return true;
                }
            }
            return false;
        };
    };
    // Definition of the class User.
    var User = function(args){
        // The user name.
        this.name = args.name;        
    };

    // The total of clients.
    this.clients = xRTML.Templating.observable(0);
    // The array of existing channels.
    this.channels = xRTML.Templating.observable(new Array());
    // The log string.
    this.logs = xRTML.Templating.observable("");
    // The dashboard connection.
    var connection = xRTML.ConnectionManager.create({
        // ORTC server url.
        url: "http://ortc-developers.realtime.co/server/2.1",
        // The id of the connection.
        id: "DashBoard-Connection",
        // The application key.
        appKey: args.appKey,
        // The authentication token.
        authToken: args.authToken,
        // The array of channels to subscribe. Each of them have a onMessage handler to process the messages that arrive.
        channels:[{
            // The name of the channel to subscribe.
            name: "ortcClientConnected",
            // The handler to process the arrived messages.
            onMessage: xRTML.Common.Function.proxy(function(e) {
                // The handler argument is a event object. 
                // It have a property named message that contains the message received.
                // Another property is the target that correspond to the connection that received the message (our connection).

                // Since this is a handler to a announcement channel, we will only receive metadata in this channel. So we will parse it to extract the information we need.
                var dashboardMetaData = xRTML.JSON.parse( xRTML.JSON.parse(e.message).cm);
                // We add a string to the logs property to inform that a user connected. It will be reflected in the markup. The logs property is an observable.
                this.logs(this.logs() + dashboardMetaData.username + " connected\n");
                // Increment the number of users (A connection was created). The clients property is an observable.
                this.clients(this.clients() + 1);

            }, this)
        }, { 
            // The name of the channel to subscribe.
            name: "ortcClientDisconnected",
            // The handler to process the arrived messages.
            onMessage: xRTML.Common.Function.proxy(function(e) {
                // The handler argument is a event object. 
                // It have a property named message that contains the message received.
                // Another property is the target that correspond to the connection that received the message (our connection).

                // Since this is a handler to a announcement channel, we will only receive metadata in this channel. So we will parse it to extract the information we need.
                var dashboardMetaData = xRTML.JSON.parse( xRTML.JSON.parse(e.message).cm);
                // Decrement the number of clients (a disconnect occurred).
                this.clients(this.clients() == 0 ? 0 : this.clients() - 1 );
                
                // If a disconnect occurs we have to remove the subscription of channels in our application, because there will be no messages of unsubscribe channels.
                // The user that disconnected
                var user = new User({ name: dashboardMetaData.username});
                // The array of channels to remove if they have no sibscribers.
                var channelsToRemove = [];
                // We will iterate all the channels available.
                for(var i = 0, dashboardchannels = this.channels(); i < dashboardchannels.length; i++){
                    // Then we check if the user that disconnected is subscribed to channels.
                    if(dashboardchannels[i].userIsSubscribed(user)){
                        // If it is subscribed, we will remove it.
                        dashboardchannels[i].users.remove(user);
                        if(!dashboardchannels[i].users().lenth){
                            // If the channel do not have anymore subscribed users, we will add it to the channelsToRemove.
                            channelsToRemove.push(dashboardchannels[i]);
                        }
                    }
                }
                // After the removal of the user, we will remove all the empty channels.
                for (var i = 0; i < channelsToRemove.length; i++) {
                    this.channels.remove(channelsToRemove[i]);
                };

                // We add a string to the logs property to inform that a user disconnected. It will be reflected in the markup. The logs property is an observable.
                this.logs(this.logs() + user.name + " disconnected\n");
                
            }, this)
        }, {
            // The name of the channel to subscribe.
            name: "ortcClientSubscribed",
            // The handler to process the arrived messages.
            onMessage: xRTML.Common.Function.proxy(function(e) {
                // The handler argument is a event object. 
                // It have a property named message that contains the message received.
                // Another property is the target that correspond to the connection that received the message (our connection).

                // Since this is a handler to a announcement channel, we will only receive metadata and the name of the channel subscribed. So we will parse it to extract the information we need.
                var channel = xRTML.JSON.parse(e.message).ch;
                var user;                
                try{
                    // The user that subscribed the channel.
                    user = new User({ name: xRTML.JSON.parse(xRTML.JSON.parse(e.message).cm).username });
                }catch(err){
                    return;
                }

                // Then we will check if there is already a channel with that name.
                var channelExists = false;
                for(var i = 0, channels = this.channels(); i < channels.length; i++){
                    if(channels[i].name == channel){
                        channelExists = true;
                        if(!channels[i].userIsSubscribed(user)){
                            // If the channel exists and the user is not subscribed we will add it to the array of user subscribed.
                            channels[i].users.push(user);
                        }
                    }
                }
                // If the channel does not exists, we create it and add the user to the array of users subscribed.
                if(!channelExists){
                    var ch = new Channel({ name: channel});
                    ch.users.push(user);
                    this.channels.push(ch);
                }
                // We add a string to the logs property to inform that a user subscribed the channel. It will be reflected in the markup. The logs property is an observable.
                this.logs(this.logs() + user.name + " subscribed the channel: " + channel + "\n");
                
            }, this)
        }, { 
            // The name of the channel to subscribe.
            name: "ortcClientUnsubscribed",
            // The handler to process the arrived messages.
            onMessage: xRTML.Common.Function.proxy(function(e) {
                // The handler argument is a event object. 
                // It have a property named message that contains the message received.
                // Another property is the target that correspond to the connection that received the message (our connection).

                // Since this is a handler to a announcement channel, we will only receive metadata and the name of the channel unsubscribed. So we will parse it to extract the information we need.

                var user;
                try{
                    // The user that unsubscribed the channel.
                    user = new User({ name: xRTML.JSON.parse(xRTML.JSON.parse(e.message).cm).username });
                }catch(err){
                    return;
                }
                // The name of the channel unsubscribed.
                var channelName = xRTML.JSON.parse(e.message).ch;
                // The array of channels to remove if they have no subscribers.
                var channelsToRemove = [];
                // Find the channel to unsubscribe and remove the user from it.
                for(var i = 0, dashboardchannels = this.channels(); i < dashboardchannels.length; i++){
                    if(dashboardchannels[i].name == channelName){
                        if(dashboardchannels[i].userIsSubscribed(user)){
                            dashboardchannels[i].users.remove(function(item) {                                
                                return item.name == user.name 
                            });
                            // If the channel does not have anymore subscribers, add the channel to the array channelsToRemove
                            if(dashboardchannels[i].users().length == 0){
                                channelsToRemove.push(dashboardchannels[i]);
                            }
                        }
                    }
                }
                // Remove the empty channels fom the application.
                for (var i = 0; i < channelsToRemove.length; i++) {                    
                    this.channels.remove(channelsToRemove[i]);
                };
                // We add a string to the logs property to inform that a user unsubscribed the channel. It will be reflected in the markup. The logs property is an observable.
                this.logs(this.logs() + user.name + " unsubscribed the channel: " + channelName + "\n");

            }, this)
        }],
        // Since we cannot receive messages if we are not connected and subscribed to channels, we need to build the initial data.
        onConnect: xRTML.Common.Function.proxy(function(e){
            // Increment the number of clients (the dashboard user must be included).
            this.clients(this.clients() + 1 );
            // The dashboard user.
            var me = new User({name: xRTML.JSON.parse(e.target.metadata).username});
            // Add a string to the logs property to inform that the dashboard user connected.
            this.logs(this.logs() + me.name + " connected\n");            

            // Create the announcement channel "ortcClientConnected".
            this.channels.push(new Channel({name: "ortcClientConnected"}));
            if(!this.channels()[0].userIsSubscribed(me)){
                // Add the dashboard user the array of users subscribed.
                this.channels()[0].users.push(me);
                // Add a string to the logs property to inform that the dashboard user subscribed the channel.
                this.logs(this.logs() + me.name + " subscribed the channel: ortcClientConnected \n");
            }

            // Create the announcement channel "ortcClientDisconnected".
            this.channels.push(new Channel({name: "ortcClientDisconnected"}));
            if(!this.channels()[1].userIsSubscribed(me)){
                // Add the dashboard user the array of users subscribed.
                this.channels()[1].users.push(me);
                // Add a string to the logs property to inform that the dashboard user subscribed the channel.
                this.logs(this.logs() + me.name + " subscribed the channel: ortcClientDisconnected \n");
            }

            // Create the announcement channel "ortcClientSubscribed".
            this.channels.push(new Channel({name: "ortcClientSubscribed"}));            
            if(!this.channels()[2].userIsSubscribed(me)){
                // Add the dashboard user the array of users subscribed.
                this.channels()[2].users.push(me);                
            }

            // Create the announcement channel "ortcClientUnsubscribed".
            this.channels.push(new Channel({name: "ortcClientUnsubscribed"}));
            if(!this.channels()[3].userIsSubscribed(me)){
                // Add the dashboard user the array of users subscribed.              
                this.channels()[3].users.push(me);
            }

        }, this),
        // MetaData with the username.
        metadata: xRTML.JSON.stringify({ 
            username: args.username
        })
    });
};

xRTML.load(function () {
    // At this point the xRTML is fully loaded, so we can create our application object and apply the bindings.
    var myDashBoard = new DashBoard({
        // The application key.
        appKey: "myAppKey",
        // The authentication token.
        authToken: "myAuthToken",
        // The dashboard user name.
        username: "Dashboard-User-001"
    });

    // Apply the data to the template defined in html script.
    xRTML.Templating.applyBindings({
        // The target where the template will be rendered.
        node: xRTML.Sizzle("#dashboard")[0],
        binding: {
            template: {
                // The name of the template (id of the script defined in the html).
                name: "dashboard-template",
                // The aplication data.
                data: myDashBoard
            }
        }
    });
    
});