(function() {
  var _Renderer, _ref;

  if ((_ref = this.stodo) == null) {
    this.stodo = {};
  }

  this.stodo.Renderer = (function() {
    /**
    	 * Renderer instance(Singleton)
    	 * @type {[type]}
    */

    var _instance;

    function Renderer() {}

    _instance = void 0;

    /**
    	 * Singleton get method
    	 * @return {Renderer} Renderer Object
    */


    Renderer.getInstance = function() {
      return _instance != null ? _instance : _instance = new _Renderer;
    };

    return Renderer;

  })();

  /**
   * @class _Renderer
  */


  _Renderer = (function() {

    function _Renderer() {}

    _Renderer.prototype.renderLists = function(lists, settings, execRender) {
      var id, list, str, temp, _i, _len;
      if (settings == null) {
        settings = window.stodo.Settings.getInstance();
      }
      if (execRender == null) {
        execRender = true;
      }
      if (!(lists && lists.data)) {
        return;
      }
      console.info("renderLists");
      temp = lists.data.concat();
      str = "";
      for (_i = 0, _len = temp.length; _i < _len; _i++) {
        list = temp[_i];
        id = list.id;
        str += "<li id='list-" + id + "' data-id='" + id + "' data-icon='false'>";
        str += "<a class='btn-list' data-id='" + id + "'>" + list.title + "</a>";
        str += "<a class='btn-remove' data-id='" + id + "'>削除</a>";
        str += "<span class='ui-li-count'>" + list.data.length + "</span>";
        str += "</li>\n";
      }
      if (execRender) {
        $('#lists').empty().append(str).listview('refresh');
      }
      return str;
    };

    /**
    	 * render todo list
    	 * @param  {List} list     list to render
    	 * @param  {Settings} settings settings for render
    	 * @return {String} rendered text
    */


    _Renderer.prototype.render = function(list, settings, execRender) {
      var id, item, showDone, sortMethod, str, temp, _i, _len;
      if (settings == null) {
        settings = window.stodo.Settings.getInstance();
      }
      if (execRender == null) {
        execRender = true;
      }
      if (!(list && list.data)) {
        return;
      }
      showDone = settings.showDone.match("on");
      switch (parseInt(settings.sortBy)) {
        case 0:
          sortMethod = stodo.Renderer.getInstance().sortByUndone;
          break;
        case 1:
          sortMethod = stodo.Renderer.getInstance().sortByCreationDate;
          break;
        case 2:
          sortMethod = function(a, b) {
            return a;
          };
      }
      str = "";
      temp = list.data.concat();
      temp = temp.sort(function(a, b) {
        return sortMethod(a, b);
      });
      for (_i = 0, _len = temp.length; _i < _len; _i++) {
        item = temp[_i];
        if (item.checked && !showDone) {
          continue;
        }
        id = item.id;
        str += "<li id='item-" + id + "' data-id='" + id + "' data-icon='false' class='" + (item.checked ? "checked" : "") + "'>";
        str += "<a class='btn-check' data-id='" + id + "'><span class='ui-icon ui-icon-play'></span>" + item.title + "</a>";
        str += "<a class='btn-remove' data-id='" + id + "'>削除</a>";
        str += "</li>\n";
      }
      if (execRender) {
        $('#list').empty().append(str).listview('refresh');
      }
      return str;
    };

    _Renderer.prototype.sortByUndone = function(a, b) {
      if (a.checked && b.checked) {
        return 0;
      } else if (a.checked && !b.checked) {
        return 1;
      } else if (!a.checked && b.checked) {
        return -1;
      }
    };

    _Renderer.prototype.sortByCreationDate = function(a, b) {
      if (a.creation < b.creation) {
        return -1;
      } else if (a.creation > b.creation) {
        return 1;
      } else {
        return 0;
      }
    };

    return _Renderer;

  })();

}).call(this);
