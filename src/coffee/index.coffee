#require ["zepto.min","ratchet"], ->
require ["//cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js"], ->
	require [
		"//code.jquery.com/ui/1.10.0/jquery-ui.js",
		"js/renderer.js",
		"js/list.js",
		"js/settings.js"
	], ->
		$('#page-settings, #page-index, #page-list').on("pageinit pageshow", _initializePage )
		$('#page-settings').on("pagebeforeshow", _updateCurrentSettings )
		$('#page-index').on("pagebeforeshow", _updateCurrentLists )
		$('#page-list').on("pagebeforeshow", _showCurrentList )
		require [ "js/jquery.mobile-1.2.0.min.js" ], ->
			null

_initialized = false
_lists = null
_list = null
_settings = null
_renderer = null
_mode = "page-index" #page-id
###*
 * make an initialization
 * @return {null}
###
_init = ->
	#Settings
	_settings = @stodo.Settings.getInstance()
	_settings.save()

	#Lists
	_lists = new @stodo.Lists()
	_lists.load window.localStorage.getItem( "lists" )

	#Classes
	List = @stodo.List
	ListItem = @stodo.ListItem
	_renderer = @stodo.Renderer.getInstance()

	#List
	#_list = new List()
	#_list.load window.localStorage.getItem( "list" )

	#Events
	$('.btn-add-new-item').on(  "click", ->
		$.mobile.changePage( $('#add-new-item'), { role : "dialog" } )
		return false
	)

	#Save
	$('#btn-save-new-item').on( "click", ->
		console.info _mode
		switch _mode
			when "page-index"
				_lists.addList $("#new-item-title").val()
				_lists.save()
			when "page-list"
				console.info _list
				_list.addItem $("#new-item-title").val()
				_lists.save()
	)

	#list click
	#ページ遷移
	$( '#lists' ).on( 'click', 'a.btn-list', ->
		_list = _lists.findItem this
		$.mobile.changePage( $("#page-list"), { transition : "slidefade", changeHash : true } )
	)

	#list item click
	$('#list').on( "click", '.btn-check', (e)->
		item = _list.toggle(this)
		_lists.save()
		_renderer.render _list
		$("#item-#{item.id}").effect("highlight")

	)

	#長押しで編集
	$('#lists, #list').on( "taphold", 'li', (e)->
		switch _mode
			when "page-index"
				list = _lists.findItem this
				_lists.editItem = list
				title = list.title
			when "page-list"
				item = _list.findItem this
				console.info item
				_list.editItem = item
				title = item.title
		$.mobile.changePage( $('#edit-item'), { role : "dialog" } )
		$('#edit-item').find('#edit-item-title').val( title ).focus()
	)

	#編集ボタンを押下
	$('#btn-save-modified-item').on( "click", ->
		switch _mode
			when "page-index"
				_lists.modifyItem( _lists.editItem, $("#edit-item-title").val() )
				_lists.save()
				_renderer.renderLists _lists
			when "page-list"
				_list.modifyItem( _list.editItem, $("#edit-item-title").val() )
				_lists.save()
				_renderer.render _list
	)

	#右スワイプで削除ボタン表示
	$('#lists, #list').on( "swiperight", 'li', (e)->
		$(this).effect("highlight", { color : List.REMOVE_HL_COLOR }).find('.btn-remove').toggle( "fade" )
		return false
	)

	#削除ボタン
	$('#lists').on( "click", '.btn-remove', (e)->
		item = _lists.remove(this)
		_lists.save()
		$( "#list-#{item.id}" ).effect( "highlight", { color : stodo.List.REMOVE_HL_COLOR } , 250, -> _renderer.renderLists _lists )
	)

	$('#list').on( "click", '.btn-remove', (e)->
		item = _list.remove(this)
		_lists.save()
		$( "#item-#{item.id}" ).effect( "highlight", { color : stodo.List.REMOVE_HL_COLOR } , 250, -> _renderer.render _list )
	)

	#override submit
	$('#edit-item').on( 'submit', 'form', (e)->
		$('#btn-save-modified-item').click()
		e.preventDefault()
		e.stopPropagation()
		return false
	)

	$('#add-new-item').on( 'submit', 'form', (e)->
		$('#btn-save-new-item').click()
		e.preventDefault()
		e.stopPropagation()
		return false
	)


	###




	$( '#setting-sort-by' ).on( "change", (e)->
		_settings.sortBy = $('#setting-sort-by').val()
		_settings.save()
	)

	$( '#setting-show-done' ).on( "change", (e)->
		_settings.showDone = $('#setting-show-done').val()
		_settings.save()
	)

	#$('#add-new-item-screen, #edit-item-screen').off()
	###

_initializePage = (e) ->
	unless _initialized
		_initialized = true
		_init()

	if e.type is "pageshow"
		_mode = $(e.target).attr( 'id' )
	else
		switch $(e.target).attr( 'id' )
			when "page-index"
				_renderer.renderLists _lists
			when 'page-_settings'
				_updateCurrentSettings()

_updateCurrentSettings = ->
	$('#setting-show-done').val( _settings.showDone ).slider( "refresh" )
	$('#setting-sort-by').val( _settings.sortBy ).selectmenu( "refresh" )

_updateCurrentLists = ( e )->
	#showDone = if _settings.showDone is "on" then true else false
	_renderer.renderLists _lists, _settings

_showCurrentList = ( e )->
	#showDone = if _settings.showDone is "on" then true else false
	unless _list
		#$.mobile.changePage( '#page-index' )
		location.href = './'
	else
		$("#page-list-title").text _list.title
		_renderer.render _list, _settings

