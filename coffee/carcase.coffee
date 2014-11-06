# Часто используемые функции

class Tool
	_finder: (selector) ->
		childs = selector.children
		for child in childs
			if child.classList.contains "module"
				child


# Функция инициализации создающая композицию из каркасов

# Основной каркас из модулей
	
class Carcase extends Tool
	constructor: ->
		@element = document.querySelector ".carcase"
		@childModules = [ ]

		childModuleSelectors = @_finder @element
		@childModules.push new Module childModuleSelector for childModuleSelector in childModuleSelectors

# Модуль

class Module extends Tool
	constructor: (module, parentModule) ->
		@element = module
		@parentModule = parentModule
		@childModules = [ ]

		childModuleSelectors = @_finder @element
		@childModules.push new Module childModuleSelector, @ for childModuleSelector in childModuleSelectors

		# @model
		# @view
		# @controller

# Модель

class Model
	constructor: (@data) ->

# Вид

class View
	constructor: ->

# Контроллер

class Controller
	constructor: (attributes) ->


# Инициализация

document.addEventListener "DOMContentLoaded", ->
	console.log carcase = new Carcase