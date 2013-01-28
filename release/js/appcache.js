(function() {

  window.applicationCache.addEventListener('updateready', function(e) {
    window.applicationCache.swapCache();
    if (confirm('コンテンツが更新されています。アップデートしますか?')) {
      return window.location.reload();
    }
  });

  window.applicationCache.addEventListener('noupdate', function(e) {
    return console.info("noupdate");
  });

}).call(this);
