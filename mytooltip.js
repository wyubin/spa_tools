module.id='mytooltip';
// general object extend
require('./stdlib.HTMLElement.js');
var extend = require('util')._extend;

/**
* create simple tooltip interface(just show and hide) to put html into tooltip then hide
* @constructs mytooltip
* @returns {Object} this mytooltip object
*/
var mytooltip = function(dom,args){
	if(!dom){
		var t_dom = document.createElement('div');
		document.body.appendChild(t_dom);
	}
	this.doms={body:dom || t_dom};
	this.args = extend({
		sto_delay:300
	},args);
	this.var = {};
	this.init();
};
module.exports = mytooltip;
/**
* init process mytooltip, add class and simple structure
*/
mytooltip.prototype.init = function(){
	var self = this;
	'mytooltip hide'.split(/\s+/).map(function(v){self.doms.body.classList.add(v);});
	this.doms.body.append_by_array([{name:'div',attr:{class:'content'}}]);
	this.doms.content = this.doms.body.querySelector('div.content');
	// default event
	this.doms.content.addEventListener('mouseover',function(e){
		clearTimeout(self.var.sto_out);
	});
	this.doms.content.addEventListener('mouseout',function(e){
		self.hide();
	});
}
/**
* append doms by dom array
* @param {object} doms - dom_json or dom, if none, use previous html
* @returns {Object} this
*/
mytooltip.prototype.render = function(doms){
	this.doms.content.innerHTML = '';
	this.doms.content.append_by_array(doms);
	return this;
}
/**
* show tooltip based on specific position and content
* @param {object} css_pos - need top and left.
* @param {object} doms - dom_json or dom, if none, use previous html
* @returns {Object} this
* @example
* mytooltip.show_pos({top:50,left:50},'test for tooltip');
*/
mytooltip.prototype.show_pos = function(css_pos,doms){
	var self = this,
		tip_css = extend(this.args.style || {},css_pos);
	// show dom first
	self.doms.body.classList.remove('hide');
	Object.keys(tip_css).map(function(v){
		self.doms.body.style[v] = tip_css[v];
	});
	if(doms){
		this.render(doms);
	}
	return this;
}
/**
* hide tooltip with add 'hide' class in tooltip DOM
* @returns {Object} this
*/
mytooltip.prototype.hide = function(){
	var self=this;
	clearTimeout(self.var.sto_over);
	this.var.sto_out = setTimeout(function(){
		self.doms.body.classList.add('hide');
	},this.args.sto_delay);
	return this;
}
/**
* show tooltip based on single DOM (and content)
* @param {object} target - event object, dom or simple object
* @param {object} doms - dom_json or dom, if none, use previous html
* @returns {Object} this
* @example
* mytooltip.show_pos(jq_alert,'test for tooltip');
*/
mytooltip.prototype.show_dom = function(target,doms){
	var t_pos,res_pos,res_doms;
	// define a position
	if(target instanceof Event){
		// a event object
		res_pos = {top:target.pageY,left:target.pageX};
	}else if(target.nodeType==1){
		// a dom
		t_pos = target.getBoundingClientRect();
		var body_pos = document.body.getBoundingClientRect();
		res_pos = {
			top:(parseFloat(t_pos.top+t_pos.bottom)/2)-(body_pos.top>0 ? 0:body_pos.top),
			left:(parseFloat(t_pos.left+t_pos.right)/2)-(body_pos.left>0 ? 0:body_pos.left)
		};
	}else if(typeof target == "object"){
		// a simple object
		res_pos = target;
	}
	// translate into px
	Object.keys(res_pos).map(function(v){
		if(!isNaN(res_pos[v])){
			res_pos[v] = res_pos[v]+'px';
		}
	});
	// process doms if is a function
	if(typeof doms == "function"){
		res_doms = doms();
	}else{
		res_doms = doms;
	}
	this.show_pos(res_pos,res_doms);
	return this;
}
/**
* show tooltip by a target(event object, dom or simple object) and a dom(or function)
* @param {object} target - event object, dom or simple object
* @param {object} doms - or function return doms
* @returns {Object} this
*/
mytooltip.prototype.show = function(target,doms){
	var self = this;
	this.var.sto_over = setTimeout(function(){
		self.show_dom(target,doms);
	},this.args.sto_delay);
}
