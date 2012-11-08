// Lets say we have a class with some properties like the following
var MyCustomClass = function(){
    // With this we can bind, unbind and fire custom events.
    xRTML.Event.extend(this);
    // Property 1
    var value1 = "myValue1";
    // Property 2
    var value2 = "myValue2";
    // Public function to change the value of the variable "value1"
    this.changeValue1 = function(newValue){
        // Change the value of the property
        value1 = newValue;
        // Fires a custom event
        this.fire({
            //the type of the event
            value1Changed : {
                data: value1
            }
        });
    };
    // Public function to get the value of the variable "value1"
    this.getValue1 = function(){
        return value1;
    };
    // Public function to change the value of the variable "value2"
    this.changeValue2 = function(newValue){
        // Change the value of the property
        value2 = newValue;
        // Fires a custom event
        this.fire({
            //the type of the event
            value2Changed : {
                data: value2
            }
        });
    };
    // Public function to get the value of the variable "value2"
    this.getValue2 = function(){
        return value2;
    };
};
// Reference to 
var myObject;

xRTML.load(function () {
    // At this point we have xRTML and the DOM fully loaded.
    myObject = new MyCustomClass();
    // Now we bind event handlers
    myObject.bind({
        // handler for the event value1Changed
        value1Changed: function(e){
            alert("Variable value1 has changed to " + e.data);
        },
        // Handler to the event value2Changed
        value2Changed: function(e){
            alert("Variable value2 has changed to " + e.data);
        }
    });
    // Now we can bind event handlers to the DOM elements.
    // We use Sizzle to get the DOM elements
    xRTML.Event.bind(xRTML.Sizzle("#myTextField1")[0], {
        change: function(e){
            // Whenever the value of the #myTextField1 changes, also change the value of the variable value1
            myObject.changeValue1(e.target.value || e.srcElement.value);
        }
    });
    // Now we can bind event handlers to the DOM elements.
    xRTML.Event.bind(xRTML.Sizzle("#myTextField2")[0], {
        change: function(e){
            // Whenever the value of the #myTextField1 changes, also change the value of the variable value2
            myObject.changeValue2(e.target.value || e.srcElement.value);
        }
    });
    // For more information about the event module visit http://docs.xrtml.org/3-0-0/javascript/xrtml.event.htm
});