var socket = new WebSocket(" "); // heroku server url
//var socket = new WebSocket("ws://localhost:3000");

//alert(window.localStorage.getItem("scca.settings"));
let name;
let lastMessage = {author:'TEMP'}
let lastMessageEl;
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
	if(lastMessage.author === msg.author) {
    	lastMessageEl.innerHTML += '<br>' + msg.msg;
	}else{
		el.innerHTML = '<b class="authorlabel">' + msg.author + '</b><br>' + msg.msg;
		document.getElementById('msglist').appendChild(el);
		lastMessageEl = el;
	}
	
	lastMessage = msg;
    updateScroll();
}

function send() {
    socket.send(JSON.stringify({
        author: name,
        msg: escapeHtml(document.getElementById('input').value)
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
	if(url !== null) {
		if(validURL(url)) {
			if(url.match(/\.(jpeg|jpg|gif|png)$/) != null) {
				socket.send(JSON.stringify({
					author: name,
					msg: '<img src="' + url + '" />'
				}));
			}else{
				alert("That is not a valid image!");
				uploadImage();
			}
		}else{
			alert("That isn't a valid URL!");
			uploadImage();
		}
	}
}

window.addEventListener("beforeunload", function () {
    socket.send(JSON.stringify({event: 'userleft', user: name}))
});

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }
