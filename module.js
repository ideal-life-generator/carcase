(function() {
  var Model, Module, View, tool;

  tool = {
    speed: function(model, fn) {
      var now;
      now = (new Date).getTime();
      fn.call(model);
      return console.debug("The speed of function \"" + model.name + "\": " + ((new Date).getTime() - now) + " ms.");
    }
  };

  View = (function() {
    function View(name, element, model) {
      var value;
      this.name = name;
      this.props = {};
      this.createView(element);
      for (name in model) {
        value = model[name];
        if (!this.props[name]) {
          continue;
        }
        this.props[name].element.innerHTML = this.props[name].element.innerHTML.replace("~" + name + "~", value);
        this.props[name].lastContent = value;
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
              this.props[content] = {
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
          if (this.props[name] && this.props[name].lastContent !== value) {
            this.props[name].element.innerHTML = this.props[name].element.innerHTML.replace(this.props[name].lastContent, value);
            this.props[name].lastContent = value;
          } else {
            if (this.props[name]) {
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

  Model = (function() {
    function Model(model) {
      var name, value;
      for (name in model) {
        value = model[name];
        this[name] = value;
      }
    }

    return Model;

  })();

  Module = (function() {
    function Module(name, model) {
      this.name = name;
      this.element = document.querySelector("[module=" + name + "]");
      this.model = new Model(model);
      this.view = new View(this.name, this.element, this.model);
    }

    return Module;

  })();

  document.addEventListener("DOMContentLoaded", function() {
    var module;
    module = new Module("points", {
      firstName: "Vladislav",
      lastName: "Tkachenko",
      point: 1000
    });
    return setInterval(function() {
      return tool.speed(module.view, function() {
        return module.view.update({
          point: ++module.model.point
        });
      });
    }, 1000);
  });

}).call(this);
