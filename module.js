(function() {
  var Controller, Model, Module, View, tool;

  tool = {
    speed: function(title, parent, fn) {
      var now;
      now = (new Date).getTime();
      fn.call(parent);
      return console.debug("The speed of function \"" + title + "\": " + ((new Date).getTime() - now) + " ms.");
    }
  };

  View = (function() {
    function View(element, model) {
      var name, value;
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

    View.prototype.update = function(newModel) {
      var name, value;
      for (name in newModel) {
        value = newModel[name];
        if (this[name] && this[name].lastContent !== value) {
          this[name].element.innerHTML = this[name].element.innerHTML.replace(this[name].lastContent, value);
          this[name].lastContent = value;
        }
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
        element.addEventListener(name.slice(devision + 2), function(e) {
          var args, prop;
          args = (function() {
            var _i, _len, _ref, _results;
            _ref = element.attributes[selector].value.split(",");
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              prop = _ref[_i];
              _results.push(view[prop].lastContent);
            }
            return _results;
          })();
          args.push(e, element);
          return event.apply(view, args);
        });
      }
    };

    return Controller;

  })();

  Model = (function() {
    function Model(model) {
      var name, value;
      for (name in model) {
        value = model[name];
        this[name] = value;
      }
    }

    Model.prototype.getModel = function() {
      return this;
    };

    return Model;

  })();

  Module = (function() {
    function Module(name, model, binds) {
      this.name = name;
      this.element = document.querySelector("[module=" + name + "]");
      this.model = new Model(model);
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
      "rename: click": function(firstName, event) {
        event.stopPropagation();
        return tool.speed("rename", this, function() {
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
