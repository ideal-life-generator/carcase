(function() {
  var Controller, Module, View, tool;

  tool = {
    speed: function(name, model, fn) {
      var now;
      now = (new Date).getTime();
      fn.call(model);
      return console.debug("The speed of function \"" + name + "\": " + ((new Date).getTime() - now) + " ms.");
    }
  };

  View = (function() {
    function View(element, model) {
      var name, value;
      for (name in model) {
        value = model[name];
        this[name] = value;
      }
      this.createView(element);
      for (name in model) {
        value = model[name];
        if (!this[name]) {
          continue;
        }
        this[name].element.innerHTML = this[name].element.innerHTML.replace("~" + name + "~", value);
        this[name].lastContent = value;
      }
      return;
    }

    View.prototype.createView = function(element) {
      var child, content, elementContent, n, _i, _j, _len, _len1, _ref;
      _ref = element.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (!child.children.length) {
          elementContent = child.innerHTML.split("~");
          if (elementContent.length < 1) {
            continue;
          }
          for (n = _j = 0, _len1 = elementContent.length; _j < _len1; n = ++_j) {
            content = elementContent[n];
            if (n % 2) {
              this[content] = {
                element: child
              };
            }
          }
        } else {
          this.createView(child);
        }
      }
    };

    View.prototype.update = function(model) {
      var name, value;
      if (model) {
        for (name in model) {
          value = model[name];
          if (this[name] && this[name].lastContent !== value) {
            this[name].element.innerHTML = this[name].element.innerHTML.replace(this[name].lastContent, value);
            this[name].lastContent = value;
          } else {
            if (this[name]) {
              console.warn("Do you want to refresh the view but not change the value \"" + value + "\" of the \"" + name + "\".");
            } else {
              console.warn("Prop \"" + name + "\" is not defined.");
            }
          }
        }
      } else {
        console.warn("You did not specify which model \"" + this.name + "\" should be updated.");
      }
    };

    return View;

  })();

  Controller = (function() {
    function Controller(events, view) {
      this.events = events;
      this.addEvent(this.events, view);
    }

    Controller.prototype.addEvent = function(events, view) {
      var devision, element, event, name, selector;
      for (name in events) {
        event = events[name];
        devision = name.indexOf(":");
        selector = name.slice(0, devision);
        element = document.querySelector("[" + selector + "]");
        element.addEventListener(name.slice(devision + 2), function() {
          var prop;
          return event.handler.apply(view, (function() {
            var _i, _len, _ref, _results;
            _ref = element.attributes[selector].value.split(",");
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              prop = _ref[_i];
              _results.push(view[prop].lastContent);
            }
            return _results;
          })());
        });
      }
    };

    return Controller;

  })();

  Module = (function() {
    function Module(name, model, binds) {
      this.name = name;
      this.model = model;
      this.element = document.querySelector("[module=" + name + "]");
      this.view = new View(this.element, this.model);
      this.controller = new Controller(binds, this.view);
    }

    return Module;

  })();

  document.addEventListener("DOMContentLoaded", function() {
    var module;
    module = new Module("points", {
      firstName: "Vladislav",
      lastName: "Tkachenko",
      point: 1000
    }, {
      "some: click": {
        handler: function(firstName, point) {
          return tool.speed("some: click", this, function() {
            console.log("" + firstName + ": " + point);
            if (firstName === "Vladislav") {
              return this.update({
                firstName: "Vasuliy"
              });
            } else {
              return this.update({
                firstName: "Vladislav"
              });
            }
          });
        }
      }
    });
    console.log(module);
    return setInterval(function() {
      return tool.speed("module.view.update", module.view, function() {
        return module.view.update({
          point: ++module.model.point
        });
      });
    }, 1000);
  });

}).call(this);
