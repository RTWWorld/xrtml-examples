// Function to append text to body
var appendToBody = function(text){
    var p = document.createElement("p");
    p.innerHTML = text;
    document.body.appendChild(p);
};
// Declaration fo the function to run in serie
xRTML.Async.series([
    function(cb) { 
        setTimeout(function() { 
            appendToBody("Series 1 (5000)"); 
            cb(1); 
        }, 5000); 
    },
    function(cb) { 
        setTimeout(function() { 
            appendToBody("Series 2 (2500)"); 
            cb(2); 
        }, 2500); },
    function(cb) { 
        setTimeout(function() { 
            appendToBody("Series 3 (1000)"); 
            cb(3); 
        }, 1000); 
    }
], function(data) {
    appendToBody("Series Complete - " + xRTML.JSON.stringify(arguments));
});
// Declaration fo the function to run in parallel
xRTML.Async.parallel([
    function(cb) { 
        setTimeout(function() { 
            appendToBody("Parallel 1 (5000)"); 
            cb(1); 
        }, 5000); },
    function(cb) { 
        setTimeout(function() { 
            appendToBody("Parallel 2 (2500)"); 
            cb(2); 
        }, 2500); },
    function(cb) { 
        setTimeout(function() { 
            appendToBody("Parallel 3 (1000)"); 
            cb(3); 
        }, 1000); }
], function() {    
    appendToBody("Parallel Complete - " + xRTML.JSON.stringify(arguments));
});