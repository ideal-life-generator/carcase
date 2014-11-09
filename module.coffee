class View
	constructor: (element, model) ->
		@props = { }
		@createView element

		@_init model

	createView: (element) ->
		for child in element.children
			unless child.children.length
				elementContent = child.innerHTML.split "~"
				if elementContent.length < 1 then continue
				for content, n in elementContent when n % 2
					@props[content] =
						element: child
			else @createView child
		return

	update: (model) ->
		for name, value of model when @props[name]
			@props[name].element.innerHTML = @props[name].element.innerHTML.replace @props[name].lastContent, value
			@props[name].lastContent = value
		return

	_init: (model) ->
		for name, value of model when @props[name]
			@props[name].element.innerHTML = @props[name].element.innerHTML.replace "~#{name}~", value
			@props[name].lastContent = value
		return

class Model
	constructor: (model) ->
		@[prop] = value for prop, value of model

class Module
	constructor: (name, model) ->
		@element = document.querySelector "[module=#{name}]"

		@model = new Model model
		@view = new View @element, @model

document.addEventListener "DOMContentLoaded", ->
	module = new Module "points",
		firstName: "Vladislav"
		lastName: "Tkachenko"
		point: 1000

	setInterval ->
		module.view.update point: ++module.model.point
	, 1000