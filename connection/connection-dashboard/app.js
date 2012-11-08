xRTML.Config.debug = true;

var DashBoard = function(args){

    var Channel = function(args){
        this.name = args.name;
        this.users = xRTML.Templating.observable(new Array());

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

    var User = function(args){
        this.name = args.name;        
    };

    this.clients = xRTML.Templating.observable(0);
    this.channels = xRTML.Templating.observable(new Array());
    this.logs = xRTML.Templating.observable("");

    var connection = xRTML.ConnectionManager.create({
        url: "http://ortc-developers.realtime.co/server/2.1",
        id: "DashBoard-Connection",
        appKey: args.appKey,
        authToken: args.authToken,
        channels:[{ 
            name: "ortcClientConnected",
            onMessage: xRTML.Common.Function.proxy(function(e) {
                var dashboardMetaData = xRTML.JSON.parse( xRTML.JSON.parse(e.message).cm);
                this.logs(this.logs() + dashboardMetaData.username + " connected\n");
                this.clients(this.clients() + 1);
            }, this)
        }, { 
            name: "ortcClientDisconnected",
            onMessage: xRTML.Common.Function.proxy(function(e) {                
                var dashboardMetaData = xRTML.JSON.parse( xRTML.JSON.parse(e.message).cm);                
                this.clients(this.clients() == 0 ? 0 : this.clients() - 1 );

                var user = new User({ name: dashboardMetaData.username});

                var channelsToRemove = [];
                for(var i = 0, dashboardchannels = this.channels(); i < dashboardchannels.length; i++){
                    if(dashboardchannels[i].userIsSubscribed(user)){
                        dashboardchannels[i].users.remove(user);
                        if(!dashboardchannels[i].users().lenth){
                            channelsToRemove.push(dashboardchannels[i]);
                        }
                    }
                }

                for (var i = 0; i < channelsToRemove.length; i++) {
                    this.channels.remove(channelsToRemove[i]);
                };

                this.logs(this.logs() + user.name + " disconnected\n");
                
            }, this)
        }, {
            name: "ortcClientSubscribed",
            onMessage: xRTML.Common.Function.proxy(function(e) {
                var channel = xRTML.JSON.parse(e.message).ch;
                var user;

                try{
                    user = new User({ name: xRTML.JSON.parse(xRTML.JSON.parse(e.message).cm).username });
                }catch(err){
                    return;
                }

                var channelExists = false;
                for(var i = 0, channels = this.channels(); i < channels.length; i++){
                    if(channels[i].name == channel){
                        channelExists = true;
                        if(!channels[i].userIsSubscribed(user)){
                            channels[i].users.push(user);
                        }
                    }
                }

                if(!channelExists){
                    var ch = new Channel({ name: channel});
                    ch.users.push(user);
                    this.channels.push(ch);
                }

                this.logs(this.logs() + user.name + " subscribed the channel: " + channel + "\n");
                
            }, this)
        }, { 
            name: "ortcClientUnsubscribed",
            onMessage: xRTML.Common.Function.proxy(function(e) {
                var user;               

                try{
                    user = new User({ name: xRTML.JSON.parse(xRTML.JSON.parse(e.message).cm).username });
                }catch(err){
                    return;
                }                
                var channelName = xRTML.JSON.parse(e.message).ch;
                var channelsToRemove = [];
                for(var i = 0, dashboardchannels = this.channels(); i < dashboardchannels.length; i++){
                    if(dashboardchannels[i].name == channelName){
                        if(dashboardchannels[i].userIsSubscribed(user)){
                            dashboardchannels[i].users.remove(function(item) {                                
                                return item.name == user.name 
                            });
                            if(dashboardchannels[i].users().length == 0){
                                channelsToRemove.push(dashboardchannels[i]);
                            }
                        }
                    }
                }

                for (var i = 0; i < channelsToRemove.length; i++) {                    
                    this.channels.remove(channelsToRemove[i]);
                };

                this.logs(this.logs() + user.name + " unsubscribed the channel: " + channelName + "\n");

            }, this)
        }],
        onConnect: xRTML.Common.Function.proxy(function(e){            
            this.clients(this.clients() + 1 );            
            var me = new User({name: xRTML.JSON.parse(e.target.metadata).username});
            this.logs(this.logs() + me.name + " connected\n");            

            this.channels.push(new Channel({name: "ortcClientConnected"}));
            if(!this.channels()[0].userIsSubscribed(me)){
                this.channels()[0].users.push(me);
                this.logs(this.logs() + me.name + " subscribed the channel: ortcClientConnected \n");
            }
            this.channels.push(new Channel({name: "ortcClientDisconnected"}));
            if(!this.channels()[1].userIsSubscribed(me)){
                this.channels()[1].users.push(me);
                this.logs(this.logs() + me.name + " subscribed the channel: ortcClientDisconnected \n");
            }
            this.channels.push(new Channel({name: "ortcClientSubscribed"}));
            if(!this.channels()[2].userIsSubscribed(me)){
                this.channels()[2].users.push(me);                
            }
            this.channels.push(new Channel({name: "ortcClientUnsubscribed"}));
            if(!this.channels()[3].userIsSubscribed(me)){
                this.channels()[3].users.push(me);                
            }
        }, this),
        metadata: xRTML.JSON.stringify({ 
            username: args.username
        })
    });
};

xRTML.load(function () {

    var myDashBoard = new DashBoard({
        appKey: "myAppKey",
        authToken: "myAuthToken",
        username: "Dashboard-User-001"
    });

    xRTML.Templating.applyBindings({
        node: xRTML.Sizzle("#dashboard")[0],
        binding: {
            template: {
                name: "dashboard-template",
                data: myDashBoard
            }
        }
    });
    
});