function save_options() {

	// prihlaseni
	localStorage['nick'] = $('#nick')[0].value;
	localStorage['password'] = $('#password')[0].value;
	localStorage['autologin_password'] = $('#autologin_password')[0].value;

	// timeout
	if ($('#timeout')[0].value < 60 || !$('#timeout')[0].value) {
		localStorage['timeout'] = 60;
		$('#timeout')[0].value = 60;
	}
	else
		localStorage['timeout'] = $('#timeout')[0].value;

	// zobrazovani kategorii
	localStorage['show-categories'] = Number($('#show-categories')[0].checked);
	localStorage['open-in-new-tab'] = Number($('#open-in-new-tab')[0].checked);
	localStorage['api_ssl'] = Number($('#api_ssl')[0].checked);
	localStorage['autologin_ssl'] = Number($('#autologin_ssl')[0].checked);
	localStorage['enable_autologin'] = Number($('#enable_autologin')[0].checked);

	// text "ulozeno"
	$('#status').hide().text('Uloženo').fadeIn();
	setTimeout(function () {
		$('#status').fadeOut();
	}, 800);

	// refresh
	chrome.extension.getBackgroundPage().refresh();
	chrome.extension.getBackgroundPage().autologin();
}

function clear_options() {
	if (confirm('Chcete skutečně smazat nastavení Nyxium?')) {
		localStorage.clear();
		restore_options();

		// status
		$('#status').hide().text('Smazáno').fadeIn();
		setTimeout(function () {
			$('#status').fadeOut();
		}, 800);

		// refresh
		chrome.extension.getBackgroundPage().refresh();
	}
}

function restore_options() {
	// default
	if (localStorage.length === 0) {
		$('#autologin_ssl')[0].checked = true;
		$('#api_ssl')[0].checked = true;
		$('#timeout')[0].value = 60;
		$('#show-categories')[0].checked = true;
		$('#open-in-new-tab')[0].checked = true;
		return;
	}

	$('#nick')[0].value = localStorage["nick"] ? localStorage["nick"] : '';
	$('#password')[0].value = localStorage["password"] ? localStorage["password"] : '';
	$('#autologin_password')[0].value = localStorage["autologin_password"] ? localStorage["autologin_password"] : '';
	$('#timeout')[0].value = localStorage['timeout'];

	$('#show-categories')[0].checked = Boolean(Number(localStorage['show-categories']));
	$('#open-in-new-tab')[0].checked = Boolean(Number(localStorage['open-in-new-tab']));
	$('#api_ssl')[0].checked = Boolean(Number(localStorage['api_ssl']));
	$('#autologin_ssl')[0].checked = Boolean(Number(localStorage['autologin_ssl']));
	$('#enable_autologin')[0].checked = Boolean(Number(localStorage['enable_autologin']));
}


$('document').ready(function() {

	restore_options();

	$('#enable_autologin').click(function(e) {
		//e.preventDefault();
		//this.checked = !this.checked;
		//console.log('PRIJMUT EVENT: ' + ev.target.checked);
		setTimeout(function() {
			if ($('#enable_autologin')[0].checked) {
				$('.autologin_form').fadeTo('slow', 1);
				$('.autologin_input').removeAttr('disabled');
			} else {
				$('.autologin_form').fadeTo('slow', 0.3);
				$('.autologin_form input').attr('disabled', true);
			}
		}, 0);
	});

	$('#save-button').click(function() {
		save_options();
	});

	// zatrhavani kliknutim na text
	$('#enable_autologin')
		.add('#autologin_ssl')
		.add('#show-categories')
		.add('#open-in-new-tab')
		.add('#api_ssl')
		.parent().next().click(function() {
			$(this).prev().children().trigger('click');
		});

	$('#clear-button').click(function() {
		clear_options();
		restore_options();
	});

	// pocatecni stav autologin formu
	if (!$('#enable_autologin')[0].checked) {
		$('.autologin_form').fadeTo(0, 0.3);
		$('.autologin_form input').attr('disabled', true);
	}

	$('#test').click(function() {
		chrome.windows.create({ type: 'panel', url: 'http://nyx.cz' });
	});


});
