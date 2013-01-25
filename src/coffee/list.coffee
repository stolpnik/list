@stodo ||= {}
_renderer = null

###*
 *  @class stodo.Lists
###
class @stodo.Lists
	constructor : ->
		###*
		 * todo lists
		 * @type {Array}
		###
		this.data = []

		###*
		 * item for editing
		 * @type {List}
		###
		this.editItem = null

	addList : ( title, type = 0, items = null )->
		this.data = [] unless this.data
		list = new stodo.List( title, type, items )
		this.data.push list
		return list

	load : ( dataStr = null )->
		if dataStr
			lists = JSON.parse dataStr
		this.data = []
		if lists && lists.length > 0
			for item in lists
				list = this.addList item.title, item.type, item.data
		return this.data

	save : ->
		window.localStorage.setItem( "lists", JSON.stringify( this.data ) )

	findItem : ( elem )->
		id = parseInt elem.getAttribute("data-id")
		console.info id
		list = null
		for list in this.data
			if list.id is id
				break
		return list

	modifyItem : ( item, title )->
		item.title = title
		return item

	remove : (elem)->
		return null unless elem
		item = this.findItem elem
		this.data.splice( $.inArray( item, this.data ), 1 )
		return item

###*
 * @class
 *
###

class @stodo.List
	###*
	 * List class
	 * @class List
	 * @constructor
	###
	constructor: ( title, type = 0, items = null )->
		###*
		 * title
		 * @type {String}
		###
		this.title = title

		###*
		 * type
		 * @type {Number}
		###
		this.type = type

		###*
		 * data
		 * @type {Array}
		###
		this.data = []

		###*
		 * id
		 * @type {Number}
		###
		this.id = List.ID++

		###*
		 * current edit item
		 * @type {ListItem}
		###
		this.editItem = null

		if items && items.length > 0
			for o in items
				this.addItem(
					o.title,
					new Date( o.due ),
					o.checked,
					new Date( o.creation ),
					if o.done then new Date( o.done ) else null
				)
		console.info this.data

	###*
	 * add item to data
	 * @param {Item} item
	###
	addItem : ( title, due, checked, creation, done )->
		this.data = [] unless this.data
		this.data.push new stodo.ListItem( title, due, checked, creation, done )

	###*
	 * toggle check or not
	 * @param  {HTMLElement} elem <a>tag
	 * @return {null}      null
	###
	toggle : (elem)->
		id = parseInt elem.getAttribute("data-id")
		item = this.findItem elem
		item.check($("#item-#{id}"))
		return item

	###*
	 * find list item from element
	 * @param  {HTMLElement} elem <a>tag
	 * @return {Item}      specified list item
	###
	findItem : (elem) ->
		id = parseInt elem.getAttribute("data-id")
		item = null
		for item in this.data
			if item.id is id
				break
		return item

	showRemoveBtn : (elem)->
		$(elem).effect("highlight", { color : List.REMOVE_HL_COLOR }).find('.btn-remove').toggle( "fade" )

	remove : (elem)->
		console.info elem
		return null unless elem
		item = this.findItem elem
		this.data.splice( $.inArray( item, this.data ), 1 )
		return item

	modifyItem : ( item, title )->
		console.info item
		item.title = title
		return item
	###*
	 * save to localStorage
	 * @return {String} json strings
	###
	save : ( data = this.data )->
		json = JSON.stringify( data )
		window.localStorage.setItem( "list", json )
		return json

	###*
	 * load from localStorage
	 * @param {String} str json strings
	 * @return {Array}
	###
	load : ( str )->
		return unless str
		data = JSON.parse str
		for o in data
			this.addItem new window.stodo.ListItem( o.title, new Date( o.due ), o.checked,  new Date( o.creation ) )
		return this.data

	###*
	 * serials
	 * @type {Number}
	###
	@ID : 0

	@REMOVE_HL_COLOR : "#FFCCCC"

class @stodo.ListItem
	###*
	 * item constructor
	 * @class ListItem
	 * @constructor
	 * @param {String} text
	 *        @required
	 * @param {Date} to
	 *        @optional
	###
	constructor : ( title, due = new Date, checked = false, creation = new Date, done = null )->
		###*
		 * id
		 * @type {Number}
		###
		this.id = ListItem.ID++

		###*
		 * title
		 * @type {String}
		###
		this.title = title

		###*
		 * due date
		 * @type {Date}
		###
		this.due = due

		###*
		 * cureation date
		 * @type {Date}
		###
		this.creation = creation

		###*
		 * checked or not
		 * @type {Boolean}
		###
		this.checked = checked

		###*
		 * done date
		 * @type {Date}
		###
		this.done = done

	###*
	 * toggle list item
	 * @param  {HTMLElement} elem target html element
	 * @return {Boolean}      checked or not
	###
	check : (elem)->
		this.checked = !this.checked
		if this.checked
			$(elem).addClass "checked"
			this.done = new Date()
		else
			$(elem).removeClass "checked"
			this.done = null
		return this.checked

	###*
	 * serials for item
	 * @type {Number}
	###
	@ID : 0