(function() {
  var _renderer;

  this.stodo || (this.stodo = {});

  _renderer = null;

  /**
   *  @class stodo.Lists
  */


  this.stodo.Lists = (function() {

    function Lists() {
      /**
      		 * todo lists
      		 * @type {Array}
      */
      this.data = [];
      /**
      		 * item for editing
      		 * @type {List}
      */

      this.editItem = null;
    }

    Lists.prototype.addList = function(title, type, items, showDone) {
      var list;
      if (type == null) {
        type = 0;
      }
      if (items == null) {
        items = null;
      }
      if (showDone == null) {
        showDone = null;
      }
      if (!this.data) {
        this.data = [];
      }
      list = new stodo.List(title, type, items, showDone);
      this.data.push(list);
      return list;
    };

    Lists.prototype.load = function(dataStr) {
      var item, list, lists, _i, _len;
      if (dataStr == null) {
        dataStr = null;
      }
      if (dataStr) {
        lists = JSON.parse(dataStr);
      }
      this.data = [];
      if (lists && lists.length > 0) {
        for (_i = 0, _len = lists.length; _i < _len; _i++) {
          item = lists[_i];
          list = this.addList(item.title, item.type, item.data, item.showDone);
        }
      }
      return this.data;
    };

    Lists.prototype.save = function() {
      return window.localStorage.setItem("lists", JSON.stringify(this.data));
    };

    Lists.prototype.findItem = function(elem) {
      var id, list, _i, _len, _ref;
      id = parseInt(elem.getAttribute("data-id"));
      list = null;
      _ref = this.data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        list = _ref[_i];
        if (list.id === id) {
          break;
        }
      }
      return list;
    };

    Lists.prototype.modifyItem = function(item, title) {
      item.title = title;
      return item;
    };

    Lists.prototype.remove = function(elem) {
      var item;
      if (!elem) {
        return null;
      }
      item = this.findItem(elem);
      this.data.splice($.inArray(item, this.data), 1);
      return item;
    };

    return Lists;

  })();

  /**
   * @class
   *
  */


  this.stodo.List = (function() {
    /**
    	 * List class
    	 * @class List
    	 * @constructor
    */

    function List(title, type, items, showDone) {
      var o, _i, _len;
      if (type == null) {
        type = 0;
      }
      if (items == null) {
        items = null;
      }
      if (showDone == null) {
        showDone = null;
      }
      /**
      		 * title
      		 * @type {String}
      */

      this.title = title;
      /**
      		 * type
      		 * @type {Number}
      */

      this.type = type;
      /**
      		 * data
      		 * @type {Array}
      */

      this.data = [];
      /**
      		 * id
      		 * @type {Number}
      */

      this.id = List.ID++;
      /**
      		 * current edit item
      		 * @type {ListItem}
      */

      this.editItem = null;
      if (items && items.length > 0) {
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          o = items[_i];
          this.addItem(o.title, new Date(o.due), o.checked, new Date(o.creation), o.done ? new Date(o.done) : null);
        }
      }
      /**
      		 * number of undone items
      		 * @type {Number}
      */

      this.undone = this.calcUndone();
      /**
      		 * individual setting for show done item
      		 * @type {Boolean}
      */

      this.showDone = showDone;
    }

    /**
    	 * add item to data
    	 * @param {Item} item
    */


    List.prototype.addItem = function(title, due, checked, creation, done) {
      if (!this.data) {
        this.data = [];
      }
      return this.data.push(new stodo.ListItem(title, due, checked, creation, done));
    };

    /**
    	 * toggle check or not
    	 * @param  {HTMLElement} elem <a>tag
    	 * @return {null}      null
    */


    List.prototype.toggle = function(elem) {
      var id, item;
      id = parseInt(elem.getAttribute("data-id"));
      item = this.findItem(elem);
      item.check($("#item-" + id));
      return item;
    };

    /**
    	 * find list item from element
    	 * @param  {HTMLElement} elem <a>tag
    	 * @return {Item}      specified list item
    */


    List.prototype.findItem = function(elem) {
      var id, item, _i, _len, _ref;
      id = parseInt(elem.getAttribute("data-id"));
      item = null;
      _ref = this.data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.id === id) {
          break;
        }
      }
      return item;
    };

    List.prototype.showRemoveBtn = function(elem) {
      return $(elem).effect("highlight", {
        color: List.REMOVE_HL_COLOR
      }).find('.btn-remove').toggle("fade");
    };

    List.prototype.remove = function(elem) {
      var item;
      if (!elem) {
        return null;
      }
      item = this.findItem(elem);
      this.data.splice($.inArray(item, this.data), 1);
      return item;
    };

    List.prototype.modifyItem = function(item, title) {
      item.title = title;
      return item;
    };

    /**
    	 * save to localStorage
    	 * @return {String} json strings
    */


    List.prototype.save = function(data) {
      var json;
      if (data == null) {
        data = this.data;
      }
      json = JSON.stringify(data);
      window.localStorage.setItem("list", json);
      return json;
    };

    /**
    	 * load from localStorage
    	 * @param {String} str json strings
    	 * @return {Array}
    */


    List.prototype.load = function(str) {
      var data, o, _i, _len;
      if (!str) {
        return;
      }
      data = JSON.parse(str);
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        o = data[_i];
        this.addItem(new window.stodo.ListItem(o.title, new Date(o.due), o.checked, new Date(o.creation)));
      }
      return this.data;
    };

    List.prototype.calcUndone = function() {
      var item, undone, _i, _len, _ref;
      undone = 0;
      _ref = this.data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (!item.checked) {
          undone++;
        }
      }
      this.undone = undone;
      return this.undone;
    };

    /**
    	 * serials
    	 * @type {Number}
    */


    List.ID = 0;

    List.REMOVE_HL_COLOR = "#FFCCCC";

    return List;

  })();

  this.stodo.ListItem = (function() {
    /**
    	 * item constructor
    	 * @class ListItem
    	 * @constructor
    	 * @param {String} text
    	 *        @required
    	 * @param {Date} to
    	 *        @optional
    */

    function ListItem(title, due, checked, creation, done) {
      if (due == null) {
        due = new Date;
      }
      if (checked == null) {
        checked = false;
      }
      if (creation == null) {
        creation = new Date;
      }
      if (done == null) {
        done = null;
      }
      /**
      		 * id
      		 * @type {Number}
      */

      this.id = ListItem.ID++;
      /**
      		 * title
      		 * @type {String}
      */

      this.title = title;
      /**
      		 * due date
      		 * @type {Date}
      */

      this.due = due;
      /**
      		 * cureation date
      		 * @type {Date}
      */

      this.creation = creation;
      /**
      		 * checked or not
      		 * @type {Boolean}
      */

      this.checked = checked;
      /**
      		 * done date
      		 * @type {Date}
      */

      this.done = done;
    }

    /**
    	 * toggle list item
    	 * @param  {HTMLElement} elem target html element
    	 * @return {Boolean}      checked or not
    */


    ListItem.prototype.check = function(elem) {
      this.checked = !this.checked;
      if (this.checked) {
        $(elem).addClass("checked");
        this.done = new Date();
      } else {
        $(elem).removeClass("checked");
        this.done = null;
      }
      return this.checked;
    };

    /**
    	 * serials for item
    	 * @type {Number}
    */


    ListItem.ID = 0;

    return ListItem;

  })();

}).call(this);
