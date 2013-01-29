
/*
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
*/


(function() {
  var _checkList, _init, _initializePage, _initialized, _list, _lists, _mode, _renderer, _settings, _showCurrentList, _updateCurrentLists, _updateCurrentSettings;

  _initialized = false;

  _lists = null;

  _list = null;

  _settings = null;

  _renderer = null;

  _mode = "page-index";

  /**
   * make an initialization
   * @return {null}
  */


  _init = function() {
    var List, ListItem;
    console.info;
    _settings = window.stodo.Settings.getInstance();
    _settings.save();
    _lists = new window.stodo.Lists();
    _lists.load(window.localStorage.getItem("lists"));
    List = window.stodo.List;
    ListItem = window.stodo.ListItem;
    _renderer = window.stodo.Renderer.getInstance();
    $('.btn-add-new-item').on("vclick", function() {
      $.mobile.changePage($('#add-new-item'), {
        role: "dialog"
      });
      return false;
    });
    $('#btn-save-new-item').on("vclick", function() {
      switch (_mode) {
        case "page-index":
          _lists.addList($("#new-item-title").val());
          return _lists.save();
        case "page-list":
          _list.addItem($("#new-item-title").val());
          return _lists.save();
      }
    });
    $('#lists').on('vclick', 'a.btn-list', function() {
      _list = _lists.findItem(this);
      return $.mobile.changePage($("#page-list"), {
        transition: "slidefade",
        changeHash: true
      });
    });
    $('#list').on("click", '.btn-check', _checkList);
    $('#lists, #list').on("taphold", 'li', function(e) {
      var item, list, title;
      switch (_mode) {
        case "page-index":
          list = _lists.findItem(this);
          _lists.editItem = list;
          title = list.title;
          break;
        case "page-list":
          item = _list.findItem(this);
          _list.editItem = item;
          title = item.title;
      }
      $.mobile.changePage($('#edit-item'), {
        role: "dialog"
      });
      return $('#edit-item').find('#edit-item-title').val(title).focus();
    });
    $('#btn-save-modified-item').on("vclick", function() {
      switch (_mode) {
        case "page-index":
          _lists.modifyItem(_lists.editItem, $("#edit-item-title").val());
          _lists.save();
          return _renderer.renderLists(_lists);
        case "page-list":
          _list.modifyItem(_list.editItem, $("#edit-item-title").val());
          _lists.save();
          return _renderer.render(_list);
      }
    });
    $('#lists, #list').on("swiperight", 'li', function(e) {
      $(this).effect("highlight", {
        color: List.REMOVE_HL_COLOR
      }).find('.btn-remove').toggle("fade");
      return false;
    });
    $('#lists').on("click", '.btn-remove', function(e) {
      var item;
      item = _lists.remove(this);
      _lists.save();
      return $("#list-" + item.id).effect("highlight", {
        color: stodo.List.REMOVE_HL_COLOR
      }, 250, function() {
        return _renderer.renderLists(_lists);
      });
    });
    $('#list').on("click", '.btn-remove', function(e) {
      var item;
      item = _list.remove(this);
      _lists.save();
      return $("#item-" + item.id).effect("highlight", {
        color: stodo.List.REMOVE_HL_COLOR
      }, 250, function() {
        return _renderer.render(_list);
      });
    });
    $('#edit-item').on('submit', 'form', function(e) {
      $('#btn-save-modified-item').click();
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
    $('#add-new-item').on('submit', 'form', function(e) {
      $('#btn-save-new-item').click();
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
    $('#btn-export').click(function() {});
    $('#setting-sort-by').on("change", function(e) {
      _settings.sortBy = $('#setting-sort-by').val();
      return _settings.save();
    });
    $('#list-show-done').on('change', function(e) {
      _list.showDone = this.value;
      _lists.save();
      return _renderer.render(_list);
    });
    return $('#setting-show-done').on("change", function(e) {
      _settings.showDone = $('#setting-show-done').val();
      return _settings.save();
    });
    /*
    	#$('#add-new-item-screen, #edit-item-screen').off()
    */

  };

  _initializePage = function(e) {
    if (!_initialized) {
      _initialized = true;
      _init();
    }
    if (e.type === "pageshow") {
      return _mode = $(e.target).attr('id');
    } else {
      switch ($(e.target).attr('id')) {
        case "page-index":
          return _renderer.renderLists(_lists);
        case 'page-settings':
          return _updateCurrentSettings();
      }
    }
  };

  _updateCurrentSettings = function() {
    $('#setting-show-done').val(_settings.showDone).slider("refresh");
    return $('#setting-sort-by').val(_settings.sortBy).selectmenu("refresh");
  };

  _updateCurrentLists = function(e) {
    return _renderer.renderLists(_lists, _settings);
  };

  _showCurrentList = function(e) {
    if (!_list) {
      return location.href = './';
    } else {
      $("#page-list-title").text(_list.title);
      $("#list-show-done").val(_list.showDone || _settings.showDone).slider("refresh");
      return _renderer.render(_list, _settings);
    }
  };

  _checkList = function(e) {
    var item;
    item = _list.toggle(this);
    _lists.save();
    return $("#item-" + item.id).effect("highlight", {}, 500, function() {
      return _renderer.render(_list);
    });
  };

  $(function() {
    $('#page-settings, #page-index, #page-list').on("pageinit pageshow", _initializePage);
    $('#page-settings').on("pagebeforeshow", _updateCurrentSettings);
    $('#page-index').on("pagebeforeshow", _updateCurrentLists);
    return $('#page-list').on("pagebeforeshow", _showCurrentList);
  });

}).call(this);
