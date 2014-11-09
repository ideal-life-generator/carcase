tool =
	speed: (model, fn) ->
		now = (new Date).getTime()
		fn.call model
		console.debug "The speed of function \"#{model.name}\": #{(new Date).getTime() - now} ms."

class View
	constructor: (@name, element, model) ->
		@props = { }
		@createView element

		for name, value of model when @props[name]
			@props[name].element.innerHTML = @props[name].element.innerHTML.replace "~#{name}~", value
			@props[name].lastContent = value
		return

	createView: (element) ->
		for child in element.children
			unless child.children.length
				elementContent = child.innerHTML.split "~"
				if elementContent.length < 1 then continue
				for content, n in elementContent when n % 2
					@props[content] = element: child
			else @createView child
		return

	update: (model) ->
		if model
			for name, value of model
				if @props[name] and @props[name].lastContent isnt value
					@props[name].element.innerHTML = @props[name].element.innerHTML.replace @props[name].lastContent, value
					@props[name].lastContent = value
				else
					if @props[name] then console.warn "Do you want to refresh the view but not change the value \"#{value}\" of the \"#{name}\"."
					else console.warn "Prop \"#{name}\" is not defined."
		else
			console.warn "You did not specify which model \"#{@name}\" should be updated."
		return

class Model
	constructor: (model) ->
		@[name] = value for name, value of model

class Module
	constructor: (@name, model) ->
		@element = document.querySelector "[module=#{name}]"

		@model = new Model model
		@view = new View @name, @element, @model

document.addEventListener "DOMContentLoaded", ->
	module = new Module "points",
		firstName: "Vladislav"
		lastName: "Tkachenko"
		point: 1000

	setInterval ->
		tool.speed module.view, -> module.view.update point: ++module.model.point
	, 1000