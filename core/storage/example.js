// Activate debug to see some useful logs.
xRTML.Config.debug = true;
// Connection Reference
var connection;
// Storage Reference
var storage;

xRTML.ready(function (e) {
	// At this point, since xRTML is ready, we need to create a connection in order to send messages.
	// To do that we use method "create" of the ConnectionManager module.
    connection = xRTML.ConnectionManager.create({
        url: "http://developers2.realtime.livehtml.net/server/2.1",
        id: "myConnection",
        appKey: 'myAppKey',
        authToken: 'myAuthToken',
        channels:[{name:'myChannel'}]
    });    
    connection.bind({
        // Handler to the connect event of the connection.
        connect: function(e){

            // Now we create a instance of storage.
            storage = xRTML.StorageManager.create({ id: 'S1', connectionId: 'myConnection', baseUrl: 'http://ec2-50-16-80-130.compute-1.amazonaws.com' });

            // To fill the initial value of the "#storage-data-viewer" we need to get the value of the key "MyStorageAppKey" in the storage.
            // To do that we call the get function. Every storage function have a callback. The callback argument is the result of the operation performed.
            // For more information about Storage visit http://docs.xrtml.org/3-0-0/javascript/xrtml.storagemanager.keyvaluepairstorage.htm
            storage.get({
                    // The key to search for.
                    k: "MyAppKeyStorage" 
                }, 
                // The callback called after the operation is performed
                function(res){
                    // The "res" argument is the result of the operation.
                    if(res.data.resultData){
                        xRTML.Sizzle("#storage-data-viewer")[0].innerHTML = res.data.resultData;
                    }else{
                        xRTML.Sizzle("#storage-data-viewer")[0].innerHTML = "Storage operation failed or the key does not exist.";
                    }
            });
        }
    });
});
// Definition of the set click handler.
function set(){
    // In this demo we will only set numbers in the storage so we need parse the value of the input.    
    var value = Number(xRTML.Sizzle("#set-value")[0].value);    
    // If the value parsed is not a number we will skip the operation.
    if(!isNaN(value)){
        // To set the value we just need to call the function "set" with the key and value to set, and the callback with the result of the operation.
        storage.set({ 
                pair:{
                    // The key.
                    k: "MyAppKeyStorage", 
                    // The value to set.
                    v: value
                }            
            }, 
            // The callback called after the operation is performed.
            function (result) {
                // If the operation is performed correctly we will update the storage data viewer element.
                if(result.success){
                    storage.get({ k: "MyAppKeyStorage" }, function(res){
                        if(res.data.resultData){
                            xRTML.Sizzle("#storage-data-viewer")[0].innerHTML = res.data.resultData;
                        }else{
                            xRTML.Sizzle("#storage-data-viewer")[0].innerHTML = "Storage operation failed.";
                        }
                    });
                } else {
                    xRTML.Sizzle("#storage-data-viewer")[0].innerHTML = "Storage operation failed.";
                }
            }
        );
    }    
};
// Definition of the incr click handler.
function incr() {
    // Convert the value to increment to Number.
    var value = Number(xRTML.Sizzle("#incr-value")[0].value);    
    if(!isNaN(value)){
        // The increment function is similar to the set function. We just need to call the function "incr" with the key and value to increment, and the callback with the result of the operation.
        storage.incr({ 
            pair:{
                k: "MyAppKeyStorage", 
                v: value
            }            
        }, function (result) { 
            // If the operation is performed correctly we will update the storage data viewer element.
            if(result.success){
                xRTML.Sizzle("#storage-data-viewer")[0].innerHTML = result.data.resultData;
            }else{
                xRTML.Sizzle("#storage-data-viewer")[0].innerHTML = "Storage operation failed.";
            }

        });
    }    
};
// Definition of the del click handler.
function del(){
    // To delete a key we just need to specify a key to delete and a callback function. 
    storage.del({ k: "MyAppKeyStorage" }, function(res){
        if(res.success){
            xRTML.Sizzle("#storage-data-viewer")[0].innerHTML = "Key deleted successfully";
        } else {
            xRTML.Sizzle("#storage-data-viewer")[0].innerHTML = "Key does not Exist";
        }
    });
};