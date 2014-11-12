tool =
  speed: (title, parent, fn) ->
    now = (new Date).getTime()
    fn.call parent
    console.debug "The speed of function \"#{title}\": #{(new Date).getTime() - now} ms."

class View
  constructor: (element, model) ->
    @createView element

    for name, value of model when @[name]
      @[name].element.innerHTML = @[name].element.innerHTML.replace "~#{name}~", value
      @[name].lastContent = value
    return

  createView: (element) ->
    for child in element.children
      unless child.children.length
        elementContent = child.innerHTML.split "~"
        if elementContent.length < 1 then continue
        for content, n in elementContent when n % 2
          @[content] = element: child
      else @createView child
    return

  update: (newModel) ->
    for name, value of newModel
      if @[name] and @[name].lastContent isnt value
        @[name].element.innerHTML = @[name].element.innerHTML.replace @[name].lastContent, value
        @[name].lastContent = value
    return

class Controller
  constructor: (@events, view) ->
    @addEvent @events, view

  addEvent: (events, view) ->
    for name, event of events
      devision = name.indexOf ":"
      selector = name.slice 0, devision
      element = document.querySelector "[#{selector}]"
      element.addEventListener (name.slice devision + 2), (e) ->
        args = (view[prop].lastContent for prop in element.attributes[selector].value.split ",")
        args.push e, element
        event.apply view, args
    return

class Model
  constructor: (model) ->
    @[name] = value for name, value of model

  getModel: ->
    @

class Module
  constructor: (@name, model, binds) ->
    @element = document.querySelector "[module=#{name}]"

    @model = new Model model
    @view = new View @element, @model
    @controller = new Controller binds, @view

document.addEventListener "DOMContentLoaded", ->
  module = new Module "points",
    firstName: "Vladislav"
    lastName: "Tkachenko"
    point: 1000
  ,
    "rename: click": (firstName, event) -> # the event object and element has been joined in end of arguments: event, element - this arguments added automatically
        event.stopPropagation()
        tool.speed "rename", @, ->
          if firstName is "Vladislav" then @update firstName: "Vasuliy"
          else @update firstName: "Vladislav"

  console.log module
  setInterval ->
    tool.speed "module.view.update", module.view, -> module.view.update point: ++module.model.point
  , 1000