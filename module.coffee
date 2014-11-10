tool =
  speed: (name, model, fn) ->
    now = (new Date).getTime()
    fn.call model
    console.debug "The speed of function \"#{name}\": #{(new Date).getTime() - now} ms."

class View
  constructor: (element, model) ->
    @[name] = value for name, value of model
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

  update: (model) ->
    if model
      for name, value of model
        if @[name] and @[name].lastContent isnt value
          @[name].element.innerHTML = @[name].element.innerHTML.replace @[name].lastContent, value
          @[name].lastContent = value
        else
          if @[name] then console.warn "Do you want to refresh the view but not change the value \"#{value}\" of the \"#{name}\"."
          else console.warn "Prop \"#{name}\" is not defined."
    else
      console.warn "You did not specify which model \"#{@name}\" should be updated."
    return

# class Model
#   constructor: (model) ->
#     @[name] = value for name, value of model

class Controller
  constructor: (@events, view) ->
    @addEvent @events, view

  addEvent: (events, view) ->
    for name, event of events
      devision = name.indexOf ":"
      selector = name.slice 0, devision
      element = document.querySelector "[#{selector}]"
      element.addEventListener (name.slice devision + 2), ->
        event.handler.apply view, (view[prop].lastContent for prop in element.attributes[selector].value.split ",")
    return

class Module
  constructor: (@name, @model, binds) ->
    @element = document.querySelector "[module=#{name}]"

    # @model = new Model model
    @view = new View @element, @model
    @controller = new Controller binds, @view

document.addEventListener "DOMContentLoaded", ->
  module = new Module "points",
    firstName: "Vladislav"
    lastName: "Tkachenko"
    point: 1000
  ,
    "some: click":
      handler: (firstName, point) ->
        tool.speed "some: click", @, ->
          console.log "#{firstName}: #{point}"
          if firstName is "Vladislav" then @update firstName: "Vasuliy"
          else @update firstName: "Vladislav"

  console.log module
  setInterval ->
    tool.speed "module.view.update", module.view, -> module.view.update point: ++module.model.point
  , 1000