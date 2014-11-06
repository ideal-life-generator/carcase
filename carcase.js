(function() {
  var Carcase, Controller, Model, Module, Tool, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tool = (function() {
    function Tool() {}

    Tool.prototype._finder = function(selector) {
      var child, childs, _i, _len, _results;
      childs = selector.children;
      _results = [];
      for (_i = 0, _len = childs.length; _i < _len; _i++) {
        child = childs[_i];
        if (child.classList.contains("module")) {
          _results.push(child);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Tool;

  })();

  Carcase = (function(_super) {
    __extends(Carcase, _super);

    function Carcase() {
      var childModuleSelector, childModuleSelectors, _i, _len;
      this.element = document.querySelector(".carcase");
      this.childModules = [];
      childModuleSelectors = this._finder(this.element);
      for (_i = 0, _len = childModuleSelectors.length; _i < _len; _i++) {
        childModuleSelector = childModuleSelectors[_i];
        this.childModules.push(new Module(childModuleSelector));
      }
    }

    return Carcase;

  })(Tool);

  Module = (function(_super) {
    __extends(Module, _super);

    function Module(module, parentModule) {
      var childModuleSelector, childModuleSelectors, _i, _len;
      this.element = module;
      this.parentModule = parentModule;
      this.childModules = [];
      childModuleSelectors = this._finder(this.element);
      for (_i = 0, _len = childModuleSelectors.length; _i < _len; _i++) {
        childModuleSelector = childModuleSelectors[_i];
        this.childModules.push(new Module(childModuleSelector, this));
      }
    }

    return Module;

  })(Tool);

  Model = (function() {
    function Model(data) {
      this.data = data;
    }

    return Model;

  })();

  View = (function() {
    function View() {}

    return View;

  })();

  Controller = (function() {
    function Controller(attributes) {}

    return Controller;

  })();

  document.addEventListener("DOMContentLoaded", function() {
    var carcase;
    return console.log(carcase = new Carcase);
  });

}).call(this);
