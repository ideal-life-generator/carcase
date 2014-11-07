(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function() {
    var Controller, Model, Module, View;
    Model = (function() {
      function Model(model) {
        var prop, val;
        for (prop in model) {
          val = model[prop];
          this[prop] = val;
        }
      }

      return Model;

    })();
    Controller = (function() {
      function Controller(functions) {
        this.functions = functions;
      }

      return Controller;

    })();
    View = (function() {
      function View(moduleName) {
        this.data = {};
      }

      View.prototype.update = function() {
        var child, childs, props, _i, _len;
        childs = this.element.children;
        for (_i = 0, _len = childs.length; _i < _len; _i++) {
          child = childs[_i];
          props = child.textContent.match(/\~\w+\~/g);
        }
      };

      return View;

    })();
    return Module = (function(_super) {
      __extends(Module, _super);

      function Module(name, data, events) {
        this.name = name;
        this.element = document.querySelector("[" + this.name + "]");
        this.update();
      }

      return Module;

    })(View);
  });

}).call(this);
