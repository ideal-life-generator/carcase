(function() {
  var Controller, Model, Module, View, tool,
    __hasProp = {}.hasOwnProperty;

  tool = {
    speed: function(title, parent, fn) {
      var now;
      now = (new Date).getTime();
      fn.call(parent);
      return console.debug("The speed of function \"" + title + "\": " + ((new Date).getTime() - now) + " ms.");
    },
    findProps: function(obj, string) {
      var n, name, results, v, value, _ref;
      results = [];
      for (name in obj) {
        if (!__hasProp.call(obj, name)) continue;
        value = obj[name];
        if (typeof value === "object") {
          _ref = tool.findProps(value, string ? "" + string + "." + name : name);
          for (n in _ref) {
            v = _ref[n];
            results.push(v);
          }
        } else {
          results.push({
            name: string ? "" + string + "." + name : name,
            value: value
          });
        }
      }
      return results;
    }
  };

  Model = (function() {
    function Model(model) {
      var prop, _i, _len, _ref;
      _ref = tool.findProps(model);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prop = _ref[_i];
        this[prop.name] = prop.value;
      }
    }

    Model.prototype.update = function(model) {
      var name, value, _results;
      _results = [];
      for (name in model) {
        value = model[name];
        _results.push(this[name] = value);
      }
      return _results;
    };

    return Model;

  })();

  View = (function() {
    function View(element, model) {
      var name, value;
      this.createView(element);
      for (name in model) {
        if (!__hasProp.call(model, name)) continue;
        value = model[name];
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
      for (name in model) {
        if (!__hasProp.call(model, name)) continue;
        value = model[name];
        if (!(this[name] && this[name].lastContent !== value)) {
          continue;
        }
        this[name].element.innerHTML = this[name].element.innerHTML.replace(this[name].lastContent, value);
        this[name].lastContent = value;
      }
    };

    return View;

  })();

  Controller = (function() {
    function Controller(events, view, module) {
      var devision, element, elements, event, name, selector, _i, _len;
      this.events = events;
      for (name in events) {
        event = events[name];
        devision = name.indexOf(" ");
        selector = name.slice(0, devision);
        elements = document.querySelectorAll("[" + selector + "]");
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          element = elements[_i];
          element.addEventListener(name.slice(devision + 1), function(e) {
            var args, prop;
            args = (function() {
              var _j, _len1, _ref, _results;
              _ref = element.attributes[selector].value.split(",");
              _results = [];
              for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                prop = _ref[_j];
                _results.push(view[prop].lastContent);
              }
              return _results;
            })();
            args.push(e, element);
            return event.apply(module, args);
          });
        }
      }
      return;
    }

    return Controller;

  })();

  Module = (function() {
    function Module(name, model, binds) {
      this.name = name;
      this.element = document.querySelector("[module=" + name + "]");
      this.model = new Model(model);
      this.view = new View(this.element, this.model);
      this.controller = new Controller(binds, this.view, this);
    }

    Module.prototype.update = function(model) {
      this.model.update(model);
      return this.view.update(model);
    };

    return Module;

  })();

  document.addEventListener("DOMContentLoaded", function() {
    var module;
    module = new Module("points", {
      tt: 10,
      firm: {
        person: {
          firstName: "Vladislav",
          lastName: "Tkachenko"
        },
        point: 1000
      }
    }, {
      "rename click": function(firstName, event) {
        event.stopPropagation();
        return tool.speed("rename", this, function() {
          if (firstName === "Vladislav") {
            this.update({
              "firm.person.firstName": "Vasuliy"
            });
            this.update({
              "firm.point": --this.model["firm.point"]
            });
            return this.update({
              "tt": this.model.tt * 10
            });
          } else {
            this.update({
              "firm.person.firstName": "Vladislav"
            });
            return this.update({
              "firm.point": --this.model["firm.point"]
            });
          }
        });
      }
    });
    console.log(module);
    return setInterval(function() {
      return tool.speed("point update", module.update, function() {
        return module.update({
          "firm.point": ++module.model["firm.point"]
        });
      });
    }, 1000);
  });

}).call(this);
