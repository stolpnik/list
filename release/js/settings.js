(function() {
  var _Settings;

  this.stodo || (this.stodo = {});

  this.stodo.Settings = (function() {
    var _instance;

    function Settings() {}

    _instance = void 0;

    Settings.getInstance = function() {
      if (_instance) {
        return _instance;
      } else {
        return _instance = _Settings.generate();
      }
    };

    return Settings;

  })();

  _Settings = (function() {

    function _Settings(showDone, sortBy) {
      this.showDone = showDone != null ? showDone : "on";
      this.sortBy = sortBy != null ? sortBy : _Settings.SORT_BY_UNDONE;
    }

    _Settings.prototype.save = function() {
      var settings;
      settings = {
        showDone: this.showDone,
        sortBy: this.sortBy
      };
      return window.localStorage.setItem("settings", JSON.stringify(settings));
    };

    /**
    	 * constant for sort by undone
    	 * @type {Number}
    */


    _Settings.SORT_BY_UNDONE = 0;

    /**
    	 * constant for sort by creation date
    	 * @type {Number}
    */


    _Settings.SORT_BY_CREATION = 1;

    /**
    	 * constant for sort by due date
    	 * @type {Number}
    */


    _Settings.SORT_BY_DUE_DATE = 2;

    _Settings.generate = function() {
      var loadData, settings;
      loadData = window.localStorage.getItem("settings");
      settings = JSON.parse(loadData) || {};
      return new _Settings(settings.showDone, settings.sortBy);
    };

    return _Settings;

  })();

}).call(this);
