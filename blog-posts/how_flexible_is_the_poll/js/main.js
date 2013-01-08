xRTML.load(function(){

	xRTML.Config.debug=true;
	var connectionConfig = {
		id:'myConnection',
		appKey:'nVQQHa',
		authToken:'myAuthToken',
		url:'http://ortc-developers.realtime.co/server/2.1',
		channels:[{name:'myChannel'}]
	}	
	xRTML.ConnectionManager.create(connectionConfig);
	
	xRTML.StorageManager.create({id:'s01', connectionId:'myConnection',baseUrl:'http://storage01.realtime.co'});
	var pollConfig = {
	    name:'Poll',
	    id:'poll01',
	    channelId: 'myChannel',
	    connections:['myConnection'],
	    votesAllowed:500,
	    effects:[{target:'.votesNumber'}],
	    template:'pollTemplate',
	    triggers:[{name:'poll1Trigger'}],
	    //We need to provide a key that will uniquely identify the poll in the storage.
	    storageKey:'flexiblePoll',
	    //And a storage id to use for persistence.
	    storageId:'s01',
	    //The metadata property is used to provide aribitrary data for using in the template.
	    voteItems:[{name:'xRTML',metadata:{logoImage:'img/xrtml.png',link:'http://www.realtime.co/business/xrtml/'}},
	               {name:'ORTC',metadata:{logoImage:'img/ortc.png', link:'http://www.realtime.co/business/ortc/'}},
	               {name:'Power Marketing',metadata:{logoImage:'img/pm.png', link:'http://www.realtime.co/business/powermarketing/'}},
	               {name:'Web Spectator',metadata:{logoImage:'img/ad.png', link:'http://webspectator.com/'}}]
	}	
	//Here we create the tag and provide a callback for after the tag has been created.
	xRTML.TagManager.create(pollConfig, function(t){
	    t.bind({
	        //We wait for the tag to render so that we can add the isotope stuff.
	        render:function(){
	            $('#pollContainer').isotope({ 
	                getSortData : {
	                    votes : function ( $elem ) {
	                        return parseInt($elem.find('.votesNumber').text());
	                    }
	                },
	                animationEngine:'jquery'       
	            });             
	            //Whenever a vote occurs or is received sort the vote items.
	            t.bind({
	                vote: sort,
	                ownervote: sort
	            });             
	            sort();
	        }
	    });
	}); 
});
//Just a helper function to sort the vote items.
function sort(){
    $("#pollContainer").isotope('updateSortData', $(".voteItem"));
    $('#pollContainer').isotope({           
        sortBy : 'votes',
        sortAscending : false          
    }); 
}