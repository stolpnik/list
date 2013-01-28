window.applicationCache.addEventListener 'updateready', (e)->
		if confirm( 'コンテンツが更新されています。アップデートしますか?' )
			window.applicationCache.swapCache()
			window.location.reload()
	window.applicationCache.addEventListener 'noupdate', (e)->
		#console.info "noupdate"
