//var extend = require('util')._extend;
/**
* create a tool to generate a flash menu
* @constructor
* @version 0.0.1
*/
module.id='flmenu';
var extend = require('util')._extend;

require('./flmenu.scss');
/**
* set DOM of lightbox, as a initial process of this module
* @param {Object} dom - DOM in document
*/
var self_mod = function (dom){
	this.doms={body:dom};
	this.doms.body.classList.add('flmenu');
	this.__init__();
};
module.exports = self_mod;
/**
* initial process
*/
self_mod.prototype.__init__ = function(){
	var self=this;
	["label","menu","ham"].map(function(v){
		var tdom = self.doms[v] = document.createElement('div');
		self.doms.body.appendChild(tdom);
		tdom.classList.add(v);
	});
	this.doms.label.appendChild(this.doms.ham);
	this.doms.menu.classList.add('hide');
	// event
	this.doms.ham.onclick = function(e){document.body.scroll_to()};
	this.doms.ham.title = 'Jump to the start';
	this.doms.body.onmouseenter = function(e){
		self.doms.menu.classList.remove('hide');
	};
	this.doms.body.onmouseleave = function(e){
		self.doms.menu.classList.add('hide');
	};
}
/**
* set DOM of lightbox, as a initial process of this module
* @param {Object} dom - DOM in document
*/
self_mod.prototype.addJumper = function(title,des,dom){
	var tdom = document.createElement('div');
	this.doms.menu.appendChild(tdom);
	tdom.innerHTML = title;
	tdom.title = des;
	tdom.onclick = function(e){
		dom.scroll_to();
	};
}
