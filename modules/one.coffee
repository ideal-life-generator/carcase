define [ "Module" ], (Module) ->
	module = new Module "one", ->
		name: "Hello"
	,
		"alert": ->
			alert()
	console.log module