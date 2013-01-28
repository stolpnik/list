(function() {

  window.applicationCache.addEventListener('updateready', function(e) {
    if (confirm('コンテンツが更新されています。アップデートしますか?')) {
      window.applicationCache.swapCache();
      return window.location.reload();
    }
  });

  window.applicationCache.addEventListener('noupdate', function(e) {});

}).call(this);
