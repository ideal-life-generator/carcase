(function() {
  define(["Module"], function(Module) {
    var module;
    module = new Module("one", function() {
      return {
        name: "Hello"
      };
    }, {
      "alert": function() {
        return alert();
      }
    });
    return console.log(module);
  });

}).call(this);
