document.getElementById('username').addEventListener('focus', function() {
    var username = document.getElementById('username');
    username.parentNode.childNodes[3].childNodes[1].style.width = '100%';
});

document.getElementById('username').addEventListener('focusout', function() {
    var username = document.getElementById('username');
    username.parentNode.childNodes[3].childNodes[1].style.width = '0%';
});

document.getElementById('password').addEventListener('focus', function() {
    var password = document.getElementById('password');
    password.parentNode.childNodes[3].childNodes[1].style.width = '100%';
});

document.getElementById('password').addEventListener('focusout', function() {
    var password = document.getElementById('password');
    password.parentNode.childNodes[3].childNodes[1].style.width = '0%';
});