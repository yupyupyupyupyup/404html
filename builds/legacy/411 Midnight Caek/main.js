var socket = new WebSocket(" "); // heroku server link
//var socket = new WebSocket("ws://localhost:3000");

let name;
function getName() {
    name = prompt("Enter your name: ");
    if(name.toUpperCase().trim() === 'SERVER') {
        alert('Your name cannot be "SERVER"!');
        getName();
    }
}

getName();

window.setTimeout(() => {
	socket.send(JSON.stringify({event: 'userjoined', user: name}));
}, 1000);

socket.onmessage = function(event) {
    let msg = JSON.parse(event.data);
    let el = document.createElement('div');
    el.className = 'message';
    el.innerHTML = '<b class="authorlabel">' + msg.author + ':</b> ' + msg.msg;
    document.getElementById('msglist').appendChild(el);
    updateScroll();
}

function send() {
    socket.send(JSON.stringify({
        author: name,
        msg: document.getElementById('input').value
    }))
    document.getElementById('input').value = '';
    return false;
}

function updateScroll() {
    var element = document.getElementById('msglist');
    element.scrollTop = element.scrollHeight;
}

function uploadImage() {
	let url = prompt('Paste the image url');
	socket.send(JSON.stringify({
		author: name,
		msg: '<img src="' + url + '" />'
	}));
}

window.addEventListener("beforeunload", function () {
    socket.send(JSON.stringify({event: 'userleft', user: name}))
});
