// function hello() {
// 	console.log("hello");
// }

function register(){
	$.ajax({
		method: 'POST',
		url: '/registrationAPI',
		data: 'username='+$('username').val()+'&password='+$('password').val(),
		success: registerSuccess
	});
}

function registerSuccess(data) {
	window.location.href = './login.html';
	
}