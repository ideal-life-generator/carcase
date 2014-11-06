(function() {
  var Carcase, Controller, Model, Module, Tool, View, carcase,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tool = (function() {
    function Tool() {}

    Tool.prototype._attrs = function(selector) {
      var child, childs, results, _i, _j, _len, _len1, _ref;
      childs = selector.children;
      results = [];
      for (_i = 0, _len = childs.length; _i < _len; _i++) {
        child = childs[_i];
        if (child.attributes.module) {
          results.push(child);
        } else {
          _ref = this._attrs(child);
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            child = _ref[_j];
            results.push(child);
          }
        }
      }
      return results;
    };

    return Tool;

  })();

  Carcase = (function(_super) {
    var controllers, models;

    __extends(Carcase, _super);

    models = {};

    controllers = {};

    function Carcase() {
      this.modules = [];
    }

    Carcase.prototype.addModel = function(name, model) {
      return models[name] = model;
    };

    Carcase.prototype.returnModel = function(name) {
      return models[name];
    };

    Carcase.prototype.addController = function(name, model) {
      return controllers[name] = model;
    };

    Carcase.prototype.returnController = function(name) {
      return controllers[name];
    };

    Carcase.prototype._init = function() {
      var module, modules, _i, _len, _results;
      this.element = document.querySelector(".carcase");
      modules = this._attrs(this.element);
      _results = [];
      for (_i = 0, _len = modules.length; _i < _len; _i++) {
        module = modules[_i];
        _results.push(this.modules.push(new Module(module, module.attributes.module.value)));
      }
      return _results;
    };

    return Carcase;

  })(Tool);

  carcase = new Carcase;

  Module = (function(_super) {
    __extends(Module, _super);

    function Module(selector, modelName, parentModule) {
      var childModule, childModules, _i, _len;
      this.element = selector;
      this.modelName = modelName;
      this.parentModule = parentModule;
      this.model = new Model(carcase.returnModel(this.modelName));
      this.childModules = [];
      childModules = this._attrs(this.element);
      for (_i = 0, _len = childModules.length; _i < _len; _i++) {
        childModule = childModules[_i];
        this.childModules.push(new Module(childModule, childModule.attributes.module.value, this));
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

  carcase.addModel("mainFirst", {
    name: "Vladislav",
    lastname: "Tkachenko",
    collect: ["FirstName", "LastName"]
  });

  carcase.addController("mainFirst", document.addEventListener("DOMContentLoaded", function() {
    carcase._init();
    return console.log(carcase);
  }));

}).call(this);
