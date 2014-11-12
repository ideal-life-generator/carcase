tool =
  speed: (title, parent, fn) ->
    now = (new Date).getTime()
    fn.call parent
    console.debug "The speed of function \"#{title}\": #{(new Date).getTime() - now} ms."

  findProps: (obj, string) ->
    results = [ ]
    for own name, value of obj
      if typeof value is "object"
        results.push v for n, v of tool.findProps value, if string then "#{string}.#{name}" else name
      else
        results.push
          name: if string then "#{string}.#{name}" else name
          value: value
    return results

class Model
  constructor: (model) ->
    @[prop.name] = prop.value for prop in tool.findProps model

  update: (model) ->
    @[name] = value for name, value of model

class View
  constructor: (element, model) ->
    @createView element

    for own name, value of model
      @[name].element.innerHTML = @[name].element.innerHTML.replace "~#{name}~", value
      @[name].lastContent = value
    return

  createView: (element) ->
    for child in element.children
      unless child.children.length
        elementContent = child.innerHTML.split "~"
        if elementContent.length < 1 then continue
        @[content] = element: child for content, n in elementContent when n % 2
      else @createView child
    return

  update: (model) ->
    for own name, value of model when @[name] and @[name].lastContent isnt value
      @[name].element.innerHTML = @[name].element.innerHTML.replace @[name].lastContent, value
      @[name].lastContent = value
    return

class Controller
  constructor: (@events, view, module) ->
    for name, event of events
      devision = name.indexOf " "
      selector = name.slice 0, devision
      elements = document.querySelectorAll "[#{selector}]"
      for element in elements
        element.addEventListener (name.slice devision + 1), (e) ->
          args = (view[prop].lastContent for prop in element.attributes[selector].value.split ",")
          args.push e, element
          event.apply module, args
    return

class Module
  constructor: (@name, model, binds) ->
    @element = document.querySelector "[module=#{name}]"

    @model = new Model model
    @view = new View @element, @model
    @controller = new Controller binds, @view, @

  update: (model) ->
    @model.update model
    @view.update model

document.addEventListener "DOMContentLoaded", ->
  module = new Module "points",
    tt: 10
    firm:
      person: firstName: "Vladislav", lastName: "Tkachenko"
      point: 1000
  ,
    "rename click": (firstName, event) ->
        event.stopPropagation()
        tool.speed "rename", @, ->
          if firstName is "Vladislav"
            @update "firm.person.firstName": "Vasuliy"
            @update "firm.point": --@model["firm.point"]
            @update "tt": @model.tt * 10
          else
            @update "firm.person.firstName": "Vladislav"
            @update "firm.point": --@model["firm.point"]

  console.log module
  setInterval ->
    tool.speed "point update", module.update, -> module.update "firm.point": ++module.model["firm.point"]
  , 1000