function register(){
	$.ajax({
		method: 'POST',
		url: '/registrationAPI',
		data: 'username=' + $('#username').val() +
		'&password=' + $('#password').val() +
		'&firstName=' + $('#firstName').val() +
		'&lastName=' + $('#lastName').val() +
		'&age=' + $('#age').val() +
		'&gender=' + $('.gender').val() +
		'&email=' + $('#email').val(),
		success: registerSuccess
	});
}

function registerSuccess(data) {
	window.location.href = '/';
}
function back(){
	window.location.href = '/';
}

function newGame(){
	window.location.href = '/html/game';
}