var video_playlist_file;
var videoViewer = {
	UI: {
		playerTemplate: '<header>' + '<script type="text/javascript" src="' + OC.filePath('gum_hls', 'players', '') + 'libs/swfobject.js"></script>' + '<script type="text/javascript" src="' + OC.filePath('gum_hls', 'players', '') + 'libs/ParsedQueryString.js"></script>' + '</header>' + '<video id="StrobeMediaPlayback" width="400" height="240" style="max-width: 100%;" controls></video>' + '<script>videoViewer.UI.player(\'%src%\', \'%type%\');</script>',
		show: function() {
			var size = videoViewer.UI.getSize();
			var playerView = videoViewer.UI.playerTemplate;
			var counter_value = 0;
			call = '0';
			// IF IOS We fix this bug by this
			if (navigator.platform === 'iPhone' || navigator.platform === 'iPad' || navigator.platform === 'iPod') {
				$("#content-wrapper").hide();
				$("#header").hide();
				$('<a href="#" id="box-close-ios"><div id="box-close-ios"><br /><br />Stop stream and CLOSE player</div></a><br /><h3>' + videoViewer.file + '</h3><div id="player" style="height:60px;">Server transcoding the video, please stand by!</b><br/><img src="' + OC.filePath('gum_hls', 'img', '') + 'ajax-loader.gif" alt="loading"/><div id="time"></div></div>').appendTo('body');
				$('#box-close-ios').click(videoViewer.hidePlayer);

				function startCounterIos(counter_value) {
					if (counter_value < 40) {
						setTimeout(function() {
							if (typeof video_playlist_file !== 'undefined' && video_playlist_file != '') {
								$.ajax({
									//url: url_streamdata + current_user + '_stream001.ts',
									url: url_streamdata + video_playlist_file,
									type: 'HEAD',
									success: function() {
										$('#player').html('');
										call = '1';
										$(playerView).appendTo('#player');
									},
									error: function() {
										counter_value++;
										$('#time').html('<div>Waiting untill few chunks has transcoded: <b>' + counter_value + '</b></div>');
										if (call === '0') {
											startCounterIos(counter_value);
										}
									}
								});
							} else {
								counter_value++;
								$('#time').html('<div>Waiting untill few chunks has transcoded: <b>' + counter_value + '</b></div>');
								if (call === '0') {
									startCounterIos(counter_value);
								}
							}
						}, 1000);
					}
				}
				startCounterIos(0);
				// ELSE If other browser than IOS, aka OLD CODE
			} else {
				$('<div id="videoviewer_overlay" style="display:none;"></div><div id="videoviewer_popup"><div id="videoviewer_container"><a class="box-close" id="box-close" href="#">X</a><h3>' + videoViewer.file + '</h3><div id="player"><b>Server transcoding the video, please stand by!</b><br/><img src="' + OC.filePath('gum_hls', 'img', '') + 'ajax-loader.gif" alt="loading"/><div id="time"></div></div></div></div>').appendTo('body');
				// OC.linkTo('gum_hls', 'img', '')
				$('#videoviewer_overlay').fadeIn('fast', function() {
					$('#videoviewer_popup').fadeIn('fast');
				});
				$('#box-close').click(videoViewer.hidePlayer);

				function startCounterOld(counter_value) {
					if (counter_value < 40) {
						setTimeout(function() {
							if (typeof video_playlist_file !== 'undefined' && video_playlist_file != '') {
								$.ajax({
									//url: url_streamdata + current_user + '_stream001.ts',
									url: url_streamdata + video_playlist_file,
									type: 'HEAD',
									success: function() {
										$('#player').html('');
										call = '1';
										$(playerView).appendTo('#player');
									},
									error: function() {
										counter_value++;
										$('#time').html('<div>Waiting untill few chunks has transcoded: <b>' + counter_value + '</b></div>');
										if (call === '0') {
											startCounterOld(counter_value);
										}
									}
								});
							} else {
								counter_value++;
								$('#time').html('<div>Waiting untill few chunks has transcoded: <b>' + counter_value + '</b></div>');
								if (call === '0') {
									startCounterOld(counter_value);
								}
							}
						}, 1000);
					}
				}
				startCounterOld(0);
			}
		},
		hide: function() {
			$('#videoviewer_popup').fadeOut('fast', function() {
				$('#videoviewer_overlay').fadeOut('fast', function() {
					$('#videoviewer_popup').remove();
					$('#videoviewer_overlay').remove();
				});
			});
		},
		player: function(src, mime) {
			//$('#StrobeMediaPlayback').html('<source src="' + url_list + current_user + '_list.m3u8" type="application/x-mpegURL">');
			$('#StrobeMediaPlayback').html('<source src="' + url_list + video_playlist_file + '?rnd='+Math.random()+'" type="application/x-mpegURL">');
			// Collect query parameters in an object that we can
			// forward to SWFObject:
			var pqs = new ParsedQueryString();
			var parameterNames = pqs.params(false);
			var parameters = {
				//src: url_list + current_user + '_list.m3u8',
				src: url_list + video_playlist_file + '?rnd='+Math.random(),
				autoPlay: "true",
				verbose: true,
				controlBarAutoHide: "true",
				controlBarPosition: "bottom",
				//poster: "images/poster.png",
				javascriptCallbackFunction: "jsbridge",
				plugin_hls: OC.filePath('gum_hls', 'players', '') + "bin/debug/flashlsOSMF.swf",
				hls_minbufferlength: -1,
				hls_maxbufferlength: 30,
				hls_lowbufferlength: 3,
				hls_seekmode: "KEYFRAME",
				hls_startfromlevel: -1,
				hls_seekfromlevel: -1,
				hls_live_flushurlcache: false,
				hls_info: true,
				hls_debug: false,
				hls_debug2: false,
				hls_warn: true,
				hls_error: true,
				hls_fragmentloadmaxretry: -1,
				hls_manifestloadmaxretry: -1,
				hls_capleveltostage: false,
				hls_maxlevelcappingmode: "downscale"
			};
			for (var i = 0; i < parameterNames.length; i++) {
				var parameterName = parameterNames[i];
				parameters[parameterName] = pqs.param(parameterName) || parameters[parameterName];
			}
			var wmodeValue = "direct";
			var wmodeOptions = ["direct", "opaque", "transparent", "window"];
			if (parameters.hasOwnProperty("wmode")) {
				if (wmodeOptions.indexOf(parameters.wmode) >= 0) {
					wmodeValue = parameters.wmode;
				}
				delete parameters.wmode;
			}
			// Embed the player SWF:
			swfobject.embedSWF(
			OC.filePath('gum_hls', 'players', '') + "osmf/StrobeMediaPlayback.swf", "StrobeMediaPlayback", 1024, 576, "10.1.0", "expressInstall.swf", parameters, {
				allowFullScreen: "true",
				wmode: wmodeValue
			}, {
				name: "StrobeMediaPlayback"
			});
		},
		getSize: function() {
			var size;
			if ($(document).width() > '1024' && $(document).height() > '576') {
				size = {
					width: 1024,
					height: 576
				};
			} else {
				size = {
					width: 640,
					height: 480
				};
			}
			return size;
		}
	},
	mime: null,
	file: null,
	location: null,
	player: null,
	mimeTypes: ['video/mp4', 'video/webm', 'video/x-flv', 'video/mkv', 'video/x-matroska', 'video/ogg', 'application/x-mpegURL', 'video/MP2T', 'video/x-msvideo', 'video/quicktime', 'application/vlc-plugin'],
	onView: function(file) {
		videoViewer.cleanStream(); // kill transcoder incase user was not exited correcly previos video.
		videoViewer.file = file;
		videoViewer.location = videoViewer.getMediaUrl(file);
		videoViewer.mime = FileActions.getCurrentMimeType();
		if (navigator.platform === 'iPhone' || navigator.platform === 'iPad' || navigator.platform === 'iPod' || navigator.platform === 'Android' || navigator.userAgent.match(/android/i)) {
			servertmp = window.location.origin.replace('https', 'http');
		} else {
			servertmp = window.location.origin;
		};
		url_streamdata = window.location.protocol + '//' + window.location.host + OC.filePath('gum_hls', 'streamdata', '');
		url_list = servertmp + OC.filePath('gum_hls', 'streamdata', '');
		current_user = OC.currentUser; // NULL = GUEST
		setTimeout(function() { //Allowing time to ffmpeg kill command go, this is just a delay to be sure no deletion upom new stream.
			videoViewer.backgroundProcess();
			videoViewer.streamVID(file, hak);
		}, 500);
		videoViewer.showPlayer();
	},
	streamVID: function(file, directory) {
		$.ajax({
			url: OC.linkTo('gum_hls', 'php', '') + '/stream_generator.php?dir=' + encodeURIComponent(directory).replace(/%2F/g, '/') + '&file=' + encodeURIComponent(file.replace('&', '%26')) + '&url=' + encodeURIComponent(url_streamdata)+'&screen='+$(window).height()+'x'+$(window).width(),
		}).done(function(data) {
			video_playlist_file = data;
		});
	},
	cleanStream: function() {
		// THIS FUNCTION DO A KILL/DELETE COMMAND TO SYSTEM
		$.ajax({
			url: OC.linkTo('gum_hls', 'php', '') + '/stream_cleaner.php',
		}).done(function(data) {});
	},
	backgroundProcess: function() {
		// THIS FUNCTION DO A KILL/DELETE with a delay incase a crash
		$.ajax({
			url: OC.linkTo('gum_hls', 'php', '') + '/process_killer.php',
		}).done(function(data) {});
	},
	sleep: function(milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds) {
				break;
			}
		}
	},
	showPlayer: function() {
		videoViewer.UI.show();
	},
	hidePlayer: function() {
		video_playlist_file = '';
		call = '1';
		videoViewer.cleanStream();
		videoViewer.player = false;
		delete videoViewer.player;
		videoViewer.UI.hide();
		$('#box-close-ios').remove();
		$('#player').remove();
		$("#header").show();
		$("#content-wrapper").show();
		return false;
	},
	getMediaUrl: function(file) {
		var dir = $('#dir').val();
		hak = dir;
		return fileDownloadPath(dir, file);
	},
	log: function(message) {
		console.log(message);
	}
};
$(document).ready(function() {
	if (typeof OCA !== 'undefined' && typeof OCA.Files !== 'undefined' && typeof OCA.Files.fileActions !== 'undefined') {
		for (var i = 0; i < videoViewer.mimeTypes.length; ++i) {
			var mime = videoViewer.mimeTypes[i];
			console.log(mime);
			OCA.Files.fileActions.register(mime, 'View', OC.PERMISSION_READ, '', videoViewer.onView);
			OCA.Files.fileActions.setDefault(mime, 'View');
		}
	}
});