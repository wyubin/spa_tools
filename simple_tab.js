module.id='simple_tab';
// general object extend
require('./stdlib.HTMLElement.js');
require('./stdlib.CSSStyleSheet.js');
var extend = require('util')._extend;
/**
* create(new) a tab view for appending.
* @constructs simple_tab
* @returns {Object} this simple_tab object
*/
var simple_tab = function (dom,args){
	this.args = extend({
		custom_class:'simple_tab'
	},args);
	this.doms={body:dom};
	this.doms.body.classList.add('simple_tab');
	// init tabs
	this.vars= {tabs:[],clicks:{}};
	// create self css if null
	if(!this.args.css){
		var t_dom = document.createElement('style');
		document.head.appendChild(t_dom);
		this.args.css = t_dom.sheet;
	}
	this.__init__();
};
module.exports = simple_tab;
/**
* initial process
*/
simple_tab.prototype.__init__ = function(){
	var self=this;
	// clean
	this.doms.body.innerHTML = '';
	// init DOMs
	['title','content'].map(function(v){
		var t_div = document.createElement('div');
		t_div.classList.add(v);
		self.doms.body.appendChild(t_div);
		self.doms[v] = t_div;
	});
	// click event
	this.doms.title.addEventListener('click',function(e){
		var tag_name,tab_ind;
		if(e.target.matches('div.title>span')){
			tag_name = e.target.textContent;
			tab_ind = self.check_index(tag_name);
			self.click_render(tab_ind,self.active(tag_name),e);
		}
	});
	// add click_render function
	this.click_render = function(tab_ind,tab_dom){
		console.log('this is '+tab_ind+'\'th tab!');
	};
}
/**
* remove all tabs
*/
simple_tab.prototype.empty = function(){
	var self = this;
	['title','content'].map(function(v){
		self.doms[v].innerHTML = '';
	});
}
/**
* setup tabs name by an array of string
* @param {Array} tab_names - names of these tabs
* @param {function} click_render - callback for click tabs
* @return {Array} doms for these tabs
*/
simple_tab.prototype.add_tabs = function(tab_names, click_render){
	var self = this;
	var tab_doms = tab_names.map(function(v){
		return self.__add_tab(v);
	});
	// setup click_render
	if(click_render){
		this.click_render = click_render;
	}
	// add
	this.css_update()
	// active first tab and run its render function
	this.click_render(0,self.active());
	return tab_doms
}
/**
* add new tab by title and(or) a dom that have existed
* @param {String} tab_name - name of this tab
* @return {DOM} dom for this context
*/
simple_tab.prototype.__add_tab = function(tab_name, content){
	var t_span = document.createElement('span'),
		c_div = document.createElement('div');
	t_span.textContent = tab_name;
	this.doms.title.appendChild(t_span);
	this.doms.content.appendChild(c_div);
	this.vars.tabs.push(tab_name);
	if(content){
		c_div.append_by_array([content]);
	}
	return c_div;
}
/**
* active first tab or selected tab
* @param {String or Int} tab_name - name or index of this tab
* @return {DOM} the active content DOM
*/
simple_tab.prototype.active = function(tab_name){
	var self=this,
		tab_ind = this.check_index(tab_name || 0);
	if(tab_ind != -1){
		var active_ind = this.active_index();
		if(tab_ind != active_ind){
			// remove actived one and active input name
			['title','content'].map(function(v){
				if(active_ind!=-1){
					self.doms[v].children[active_ind].classList.remove('active');
				}
				self.doms[v].children[tab_ind].classList.add('active');
			});
		}
		return this.doms.content.children[tab_ind];
	}
}
/**
* hide input tabs and dehide other
* @param {Array} tab_names - name or index of this tab
* @return {Object} this
*/
simple_tab.prototype.hide = function(tab_names){
	var self = this;
	var tab_inds = tab_names.map(function(v){return self.check_index(v)});
	this.vars.tabs.range().map(function(v){
		if(tab_inds.indexOf(v)==-1){
			self.doms.title.children[v].classList.remove('hide');
		}else{
			self.doms.title.children[v].classList.add('hide');
		}
	});
}
/**
* based on label length and form width to calculate better dimension
* @returns {Object} this
*/
simple_tab.prototype.css_update = function(){
	var self = this;
	// expand height to 100% after add tab
	var t_ht = this.doms.body.clientHeight - this.doms.title.offsetHeight;
	['>div.content>div'].map(function(v){
		self.args.css.css_update('.'+self.args.custom_class+v,{
			height:t_ht+'px'
		});
	});
	return this;
}
/**
* return selected content dom index
* @param {String or Int} tab_name - name or index of this tab
* @return {Interger} index of tab
*/
simple_tab.prototype.check_index = function(tab_name){
	var tab_ind = (tab_name === parseInt(tab_name, 10))? tab_name:this.vars.tabs.indexOf(tab_name);
	if(tab_ind > -1 && tab_ind < this.vars.tabs.length){
		return tab_ind;
	}else{
		return -1;
	}
}
/**
* return active tab index
* @return {Interger} index of tab
*/
simple_tab.prototype.active_index = function(){
	var t_tab = this.doms.title.querySelector('div.title>*.active');
	return this.vars.tabs.indexOf(t_tab ? t_tab.textContent:null);
}
/**
* render again in this active tab
*/
simple_tab.prototype.re_render = function(){
	var tind = this.active_index();
	this.click_render(tind,this.doms.content.children[tind]);
}