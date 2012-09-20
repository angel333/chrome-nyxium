onload = setTimeout(function() {
	chrome.extension.getBackgroundPage().refresh(init);
}, 0);

function init() {
	bg = chrome.extension.getBackgroundPage();

	$('#updates').text('');
	$('#buttons').text('');

	$(bg.xml).find('boards category').each(function() {

		if (this.childElementCount && Boolean(Number(localStorage['show-categories']))) {
			var o = '';
			o += '<li class="category">';
			o += '<strong>' + $(this).attr('name') + '</strong>';
			o += '</li>';
			document.getElementById('updates').innerHTML += o;
		}

		$(this).find('board').each(function () {
			var o = '';
			o += '<li class="board">';
			o += '<span class="url">http://www.nyx.cz/index.php?l=topic;id=' + $(this).attr('id') + '</span>';
			o += '<span class="meta"><span>' + $(this).attr('new') + '</span></span>';
			o += '<span class="title">' + $(this).text() + '</span>';
			o += '</li>';
			document.getElementById('updates').innerHTML += o;
		});
	});

	$('#updates li.board').click(function() {
		chrome.tabs.create({ url: this.firstChild.innerHTML });
	});

	$('#buttons').append($('<span></span>').text('refresh').click(function() {
		bg.refresh(init); // init se spusti az po xhr
	}));

	$('#buttons').append($('<span class="nick"></span>').text($(bg.xml).find('user username').text()).click(function() {
		chrome.tabs.create({ url: 'http://nyx.cz/index.php?l=user' });
	}));

	$('#buttons').append($('<div></div>').addClass('cleaner'));
}
