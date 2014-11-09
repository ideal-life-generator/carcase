(function() {
  var Model, Module, View;

  View = (function() {
    function View(element, model) {
      this.props = {};
      this.createView(element);
      this._init(model);
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
      for (name in model) {
        value = model[name];
        if (!this.props[name]) {
          continue;
        }
        this.props[name].element.innerHTML = this.props[name].element.innerHTML.replace(this.props[name].lastContent, value);
        this.props[name].lastContent = value;
      }
    };

    View.prototype._init = function(model) {
      var name, value;
      for (name in model) {
        value = model[name];
        if (!this.props[name]) {
          continue;
        }
        this.props[name].element.innerHTML = this.props[name].element.innerHTML.replace("~" + name + "~", value);
        this.props[name].lastContent = value;
      }
    };

    return View;

  })();

  Model = (function() {
    function Model(model) {
      var prop, value;
      for (prop in model) {
        value = model[prop];
        this[prop] = value;
      }
    }

    return Model;

  })();

  Module = (function() {
    function Module(name, model) {
      this.element = document.querySelector("[module=" + name + "]");
      this.model = new Model(model);
      this.view = new View(this.element, this.model);
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
      return module.view.update({
        point: ++module.model.point
      });
    }, 1000);
  });

}).call(this);
