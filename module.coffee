define ->
	class Model
		constructor: (model) ->
			@[prop] = val for prop, val of model
		
	class Controller
		constructor: (@functions) ->
	
	class View
		constructor: (moduleName) ->
			@data = { }

		update: ->
			childs = @element.children
			for child in childs
				props = child.textContent.match /\~\w+\~/g
			
			return

	class Module extends View
		constructor: (@name, data, events) ->
			@element = document.querySelector "[#{@name}]"

			# @model = new Model model
			# @controller = new Controller events
			@update()