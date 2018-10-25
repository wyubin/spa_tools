var extend = require('util')._extend;
require('./stdlib.HTMLElement.js');
var events_reg = require('./events_reg.js');

//require('./navi_bar.scss');

module.id='navi_bar';
/**
* create navigation bar with active, tab_click function
* @constructor
* @version 0.0.1
* @param {DOM} view - nav dom already in html code
* @param {object} args - settings, 'menu' array use key as item name and value as content
*/
function navi_bar(dom,args){
	this.args = extend({
		menu:[]
	},args);
	this.doms = {body:dom,items:{}};
	this.e_reg = new events_reg(dom);
	this.init_event();
	this.init_dom();
}
module.exports = navi_bar;
/**
* Assign a click_handler for this nav, or you just active the tab you click
* @param {object} tab_name - item name
* @example
* mynav.click_handler = function(tab_name){console.log(tab_name+' page')}
*/
navi_bar.prototype.click_handler = function(tab_name){
	this.active(tab_name);
	console.log('this tab name is "'+tab_name+'",add click callback by click_handler with def(e)');
}

/**
* create init DOM of navigation
*/
navi_bar.prototype.init_dom = function(){
	var self=this;
	this.doms.body.classList.add('navi_bar');
	this.create_navi(this.args.menu);
}

/**
* create_navi
* @param {Array} items - item with name and title may have childs
*/
navi_bar.prototype.create_navi = function(menuTree){
	this.doms.body.innerHTML='';
	this.doms.body.appendChild(this.add_items(menuTree));
}

/**
* bind init events on nav (like onclick)
*/
navi_bar.prototype.init_event = function(){
	var self=this;
	this.e_reg.events.click = {
		'ul>li>a':function(e){
			var name=e.target.getAttribute('name');
			self.click_handler(name);
		}
	};
	this.e_reg.register();
}
/**
* add single item in navi_bar
* @param {Array} items - item with name and title may have childs
* @returns {DOM} ul dom
*/
navi_bar.prototype.add_items = function(items){
	var self=this,
		dom_ul = document.createElement('ul');
	items.map(function(v){
		if(v.name in self.doms.items){
			console.log('"'+v.name+'" can not be inserted, already exists');
		}else{
			var dom_li = document.createElement('li'),
				dom_a = document.createElement('a');
			dom_li.appendChild(dom_a);
			dom_a.setAttribute('name',v.name);
			dom_a.innerHTML = v.title;
			// add into items
			self.doms.items[v.name]=dom_a;
			dom_ul.appendChild(dom_li);
			if(v.childs){
				dom_li.appendChild(self.add_items(v.childs));
			}
		}
	});
	return dom_ul;
}
/**
* activate assigned tab_name and de-activate others
* @param {string} [tab_name] - tab name in navigation, if None, de-activate all.
* @returns {Object} this
* @example
* mynav.active('home');
*/
navi_bar.prototype.active = function(tab_name){
	for(var i in this.doms.items){
		if(i==tab_name){
			this.doms.items[i].classList.add('active');
		}else{
			this.doms.items[i].classList.remove('active');
		}
	}
	return this;
}
