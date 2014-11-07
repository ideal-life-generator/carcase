requirejs.config
	baseUrl: ""
	map:
		"modules":
			dependencies: "Module"

requirejs [ "modules/one", "modules/two" ], ->