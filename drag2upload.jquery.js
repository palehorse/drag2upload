(function( factory ) {
	if (typeof(require) === 'function') {
		module.exports = factory(jQuery);
	} else {
		factory(jQuery);
	}
})(function( $ ) {
	$.fn.drag2upload = function(params) {
		var _this = $(this),
			_defaults = {name: 'file'},
			uploadLocker = (function() {
				var uploading = false;
				return {
					check: function() {
						return uploading ? true : false;
					},
					start: function() {
						uploading = true;
					},
					end: function() {
						uploading = false;
					}
				}
			})(),
			refreshCsrf = function(refreshCsrfUrl) {
				if (typeof refreshCsrfUrl !== 'string') {
					return false;
				}
				return $.ajax({
					url: refreshCsrfUrl,
					type: 'get',
					dataType: 'json',
					async: false
				});
			},
			uploadFileToRemoteServer = function(url, file, csrf) {
				var form = new FormData(),
					opt = {};
				form.append(_defaults.name, file);
				if (typeof csrf === 'string') {
					opt.headers = {
						'X-CSRF-TOKEN': csrf
					};
				}

				if (typeof url === 'string') {
					opt.url = url;
					opt.contentType = false;
					opt.processData = false;
					opt.type = 'post';
					opt.dataType = 'json';
					opt.data = form;
					opt.async = true;
					return $.ajax(opt);
				} else {
					console.error('Missing the URI location');
				}
				return false;
			};

		if (typeof params.uploadFileUrl !== 'string') {
			console.error('Missing uploadFileUrl');
			return false;
		}

		$.extend(_defaults, params);
		_this.on('dragenter dragstart dragend dragleave dragover drag drop', function(e) {
			e.preventDefault();
			e.stopPropagation();
		});

		//Call the callback when the file is darged over the target
		if (typeof _defaults.onDragOver === 'function') {
			_this.on('dragenter dragover', function(e) {
				_defaults.onDragOver.call(null, e);
			});
		}

		//Call the callback when the file is darged out the target
		if (typeof _defaults.onDragOut === 'function') {
			_this.on('dragleave', function(e) {
				_defaults.onDragOut.call(null, e);
			});
		}

		_this.on('drop', function(e) {
			if (typeof e.originalEvent.dataTransfer === 'undefined' && !e.originalEvent.dataTransfer.files.length) {
				return false;
			}

			if (typeof _defaults.onDrop === 'function') {
				_defaults.onDrop.call(null, e);
			}

			var file = e.originalEvent.dataTransfer.files[0];
			if (uploadLocker.check()) {
				return false;
			}
			uploadLocker.start();
			if (typeof _defaults.csrf === 'string' && typeof _defaults.refreshCsrfUrl === 'string') {
				var refreshCsrfResult = refreshCsrf.apply(null, [_defaults.refreshCsrfUrl]);
				if (typeof refreshCsrfResult.done === 'function') {	
					refreshCsrfResult.done(function(resCSRF) {
						var uploadResult = uploadFileToRemoteServer.apply(null, [_defaults.uploadFileUrl, file, resCSRF.csrf]);
						if (typeof uploadResult.done === 'function') {
							uploadResult.done(function(res) {
								if (typeof _defaults.onUploaded === 'function') {
									_defaults.onUploaded.call(null, res);
								}
								uploadLocker.end();
							})
							.fail(function(res) {
								if (typeof _defaults.onError === 'function') {
									_defaults.onError.call(null, res.responseJSON);
								}
								uploadLocker.end();
							});
						} else {
							uploadLocker.end();
						}
					}).fail(function(resCSRF) {
						if (typeof _defaults.onRefreshCSRFFail === 'function') {
							_defaults.onRefreshCSRFFail.call(null, resCSRF.responseJSON);
						} else {
							console.error('CSRF refresh failed');
						}
						uploadLocker.end();
					});
				}
			} else {
				var upload = uploadFileToRemoteServer.apply(null, [_defaults.uploadFileUrl, file]);
				if (typeof upload.done === 'function') {	
					upload.done(function(res) {
						if (typeof _defaults.onUploaded === 'function') {
							_defaults.onUploaded.call(null, res);
						}
						uploadLocker.end();
					}).fail(function(res) {
						if (typeof _defaults.onError === 'function') {
							_defaults.onError.call(null, res.responseJSON);
						}
						uploadLocker.end();
					});
				} else {
					uploadLocker.end();
				}
			}
		});
		return _this;
	}
});