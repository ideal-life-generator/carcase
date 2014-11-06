# Часто используемые функции

class Tool
	_attrs: (selector) ->
		childs = selector.children
		results = [ ]
		for child in childs
			if child.attributes.module
				results.push child
			else
				for child in @_attrs child
					results.push child
		results

# Основной каркас из модулей
	
class Carcase extends Tool

	models = { }
	controllers = { }

	constructor: ->
		@modules = [ ]

	addModel: (name, model) ->
		models[name] = model

	returnModel: (name) ->
		models[name]

	addController: (name, model) ->
		controllers[name] = model

	returnController: (name) ->
		controllers[name]

	_init: ->
		@element = document.querySelector ".carcase"

		modules = @_attrs @element
		@modules.push new Module module, module.attributes.module.value for module in modules

carcase = new Carcase

# Модуль

class Module extends Tool
	constructor: (selector, modelName, parentModule) ->
		@element = selector
		@modelName = modelName
		@parentModule = parentModule

		@model = new Model carcase.returnModel @modelName

		@childModules = [ ]

		childModules = @_attrs @element
		@childModules.push new Module childModule, childModule.attributes.module.value, @ for childModule in childModules

# Модель

class Model
	constructor: (@data) ->

# Вид

class View
	constructor: ->

# Контроллер

class Controller
	constructor: (attributes) ->

# Приложение

carcase.addModel "mainFirst",
	name: "Vladislav"
	lastname: "Tkachenko"
	collect: [
		"FirstName", "LastName"
	]

carcase.addController "mainFirst",

# Инициализация

document.addEventListener "DOMContentLoaded", ->
	carcase._init()
	console.log carcase