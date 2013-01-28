@stodo ?= {}

class @stodo.Renderer
	###*
	 * Renderer instance(Singleton)
	 * @type {[type]}
	###
	_instance = undefined

	###*
	 * Singleton get method
	 * @return {Renderer} Renderer Object
	###
	@getInstance : ->
		_instance ?= new _Renderer

###*
 * @class _Renderer
###
class _Renderer
	constructor : ->

	renderLists : ( lists, settings = window.stodo.Settings.getInstance(), execRender = true )->
		return unless lists && lists.data
		console.info "renderLists"
		temp = lists.data.concat()
		str = ""
		for list in temp
			id = list.id
			str += "<li id='list-#{id}' data-id='#{id}' data-icon='false'>"
			str += "<a class='btn-list' data-id='#{id}'>#{list.title}</a>"
			str += "<a class='btn-remove' data-id='#{id}'>削除</a>"
			str += "<span class='ui-li-count'>#{list.calcUndone()}</span>"
			str += "</li>\n"
		if execRender
			$('#lists').empty().append(str).listview('refresh')
		return str

	###*
	 * render todo list
	 * @param  {List} list     list to render
	 * @param  {Settings} settings settings for render
	 * @return {String} rendered text
	###
	render : ( list, settings = window.stodo.Settings.getInstance(), execRender = true )->
		return unless list && list.data
		console.info "list.showDone", list.showDone
		showDone = unless list.showDone then settings.showDone.match( "on" ) else list.showDone.match("on")
		switch parseInt( settings.sortBy )
				when 0
					sortMethod = stodo.Renderer.getInstance().sortByUndone
				when 1
					sortMethod = stodo.Renderer.getInstance().sortByCreationDate
				when 2
					sortMethod = (a, b)-> return a
		str = ""
		temp = list.data.concat()
		temp = temp.sort(
			( a, b )->
				return sortMethod a, b
		)
		for item in temp
			continue if item.checked && !showDone
			id = item.id
			str += "<li id='item-#{id}' data-id='#{id}' data-icon='false' class='#{if item.checked then "checked" else ""}'>"
			str += "<a class='btn-check' data-id='#{id}'><span class='ui-icon ui-icon-play'></span>#{item.title}</a>"
			str += "<a class='btn-remove' data-id='#{id}'>削除</a>"
			str += "</li>\n"
		if execRender
			$('#list').empty().append(str).listview('refresh')
		return str

	sortByUndone : ( a, b ) ->
		if a.checked && b.checked
			return 0
		else if a.checked && !b.checked
			return 1
		else if !a.checked && b.checked
			return -1

	sortByCreationDate : ( a, b ) ->
		if a.creation < b.creation
			return -1
		else if a.creation > b.creation
			return 1
		else
			return 0