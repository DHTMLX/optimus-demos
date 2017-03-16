window.dhtmlXForm.prototype.centerForm = function() {
	this.cont.style.marginLeft = "0px";
	this.cont.style.marginBottom = "20px";
	let w1 = this.cont.offsetWidth;
	this.cont.style.width = "auto";
	this.cont.style.marginLeft = Math.max(0, Math.round(w1/2-this.cont.offsetWidth/2))+"px";
};