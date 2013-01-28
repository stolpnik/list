window.applicationCache.addEventListener 'updateready', (e)->
		window.applicationCache.swapCache()
		if confirm( 'コンテンツが更新されています。アップデートしますか?' )
			window.location.reload()
	window.applicationCache.addEventListener 'noupdate', (e)->
		console.info "noupdate"
