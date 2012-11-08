// Definition of the class for this demo
var myApp = function(args) {

    // Definition of the class person.
    var Person = function(args) {
        // Example of a observable
        this.firstName = xRTML.Templating.observable(args.firstName);
        // Example of a observable
        this.lastName = xRTML.Templating.observable(args.lastName);
        // Example of a computed observable
        this.fullName = xRTML.Templating.observable(xRTML.Common.Function.proxy(function(){
            return this.firstName() + " " + this.lastName();
        }, this));
    };

    // Me...
    this.me = new Person(args);
    // The list of my friends. An example of an observable array
    this.myFriends = xRTML.Templating.observable(new Array());
    // A public function to bind to the click button
    this.addFriend = function(args) {
        this.myFriends.push(new Person(args));
    };

};

xRTML.load(function () {

    // Here we create our object
    var myAppObj = new myApp({
        firstName: "Ricardo", 
        lastName: "Jesus"
    });

    // Then we apply the bindings to the target element, with the object data to the specified template
    xRTML.Templating.applyBindings({
        node: xRTML.Sizzle("#target")[0],
        binding: {
            template: {
                name: "my-template",
                data: myAppObj
            }
        }
    });
    
});