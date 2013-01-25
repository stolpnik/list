@stodo ||= {}

class @stodo.Settings
	_instance = undefined
	@getInstance: ->
		if _instance
			return _instance
		else
			_instance = _Settings.generate()

class _Settings
	constructor : (
		@showDone = "on",
		@sortBy = _Settings.SORT_BY_UNDONE
	)->

	save : ->
		settings =
			showDone	: this.showDone
			sortBy		: this.sortBy
		window.localStorage.setItem( "settings", JSON.stringify settings )

	###*
	 * constant for sort by undone
	 * @type {Number}
	###
	@SORT_BY_UNDONE 	: 0
	###*
	 * constant for sort by creation date
	 * @type {Number}
	###
	@SORT_BY_CREATION	: 1
	###*
	 * constant for sort by due date
	 * @type {Number}
	###
	@SORT_BY_DUE_DATE	: 2

	@generate			: ->
		loadData = window.localStorage.getItem( "settings" )
		settings = JSON.parse( loadData ) || {}
		return new _Settings( settings.showDone, settings.sortBy )
