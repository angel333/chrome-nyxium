var xml;
var error;
var timeoutHolder;
var timeout;

if (localStorage['timeout'] < 60 || !localStorage['timeout'])
	timeout = 60;
else
	timeout = localStorage['timeout'];

function refresh (afterFetch) {
	$.ajax({
		type: 'POST',
		url: 'http' + (Boolean(Number(localStorage['api_ssl'])) ? 's' : '') + '://www.nyx.cz/code/client.php',
		dataType: 'xml',
		data: 'loguser=' + localStorage['nick'] + '&logpass=' + localStorage['password'],
		beforeSend: function (xhr) {
			xhr.overrideMimeType('text/xml');
		},
		complete: function () {
			//console.log('Refresh complete');
			if (timeoutHolder)
				clearTimeout(timeoutHolder);
			timeoutHolder = setTimeout(refresh, timeout * 1000);
		},
		success: function (data) {
			console.log('Refresh loaded');
			error = '';
			xml = data;
			if (typeof afterFetch === 'function') {
				afterFetch();
			}

			var totalPosts = Number();
			$(xml).find('boards category board').each(function() {
				totalPosts += Number($(this).attr('new'));
			});
			totalPosts = String(totalPosts);
			if (totalPosts > 0)
				chrome.browserAction.setBadgeText({ text: totalPosts });
			else
				chrome.browserAction.setBadgeText({ text: '' });
		},
		error: function (xhr, textStatus) {
			console.log('Refresh error: ' + status);
			error = 'Chyba: ' + status;
			xml = null;
		}
	});
};

function autologin () {
	$.ajax({
		type: 'POST',
		url: 'http' + (Boolean(Number(localStorage['autologin_ssl'])) ? 's' : '') + '://www.nyx.cz/index.php?login=1',
		data: 'loguser=' + localStorage['nick'] + '&logpass=' + localStorage['autologin_password'],
		complete: function () {
			//console.log('Autologin complete');
		},
		success: function (data) {
			console.log('Autologin ok');
		},
		error: function (xhr, textStatus) {
			console.log('Autologin error: ' + status);
		}
	});
};

refresh();
autologin();
