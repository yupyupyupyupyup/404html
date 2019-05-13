let hidden = false;
document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
		if(hidden) {
			document.getElementById("main").className = '';
			document.getElementById("hidden").className = 'hide';
			hidden = false;
		}else{
			document.getElementById("main").className = 'hide';
			document.getElementById("hidden").className = '';
			hidden = true;
		}
    }
};