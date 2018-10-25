module.id='model_ngs';
var extend = require('util')._extend;

/**
* create(new) form view without jquery with simple attr and reset, submit functions.
* @constructs model_readme
* @param {DOM} dom - DOM of this view
* @param {Object} args
* @returns {Object} this model_mscan object
*/
function self_mod(dom,args){
	this.doms={body:dom};
	this.mod = {};
	this.args = args.tools.extend({},args);
	this.env = {};
}
module.exports = self_mod;
/**
* initiate the view
*/
self_mod.prototype.init_render = function(){
	var self = this;
	this.mod.d2a = new this.args.tools.dot2article(this.doms.body,
	{dot:'<h3>{{=it._title}}</h3><hr>{{=it._tmpl}}'});
	this.mod.d2a.conf_promise(this.args.conf.json.readme,{}).then(function(data){
		self.env.conf = data;
		Array.prototype.slice.call(self.doms.body.querySelectorAll('[name]')).map(function(v){
			self.doms[v.getAttribute('name')]=v;
		});
		self.main_render();
	});
}
/**
* main UX render
*/
self_mod.prototype.main_render = function(){
	var self = this;
	// version
	Array.prototype.slice.call(self.doms.body.querySelectorAll('[name=ver]')).map(function(v){
		v.innerHTML = self.args.page_ver;
	});
	this.ren_simple_tab();
	this.ren_events();
}
/**
* test of simple_tab
*/
self_mod.prototype.ren_simple_tab = function(){
	var self=this;
	// create a cp
	this.doms.cp = document.createElement('div');
	this.doms.cp.style = 'right: 0;top: 0;position:absolute;text-align:right;';
	this.mod.cp = new this.args.tools.control_panel(this.doms.cp,{dot_tmpl:'click_counter:<button>{{=(it.click_time || 0)}}</button>',event_types:['click']});
	this.mod.cp.e_reg.events.click['button'] = function(e){
		self.mod.cp.input({
			click_time:(self.mod.cp.input_data.click_time || 0)+1
		});
	}
	// create tab
	this.mod.simple_tab = new this.args.tools.simple_tab(this.doms.div_simple_tab);
	var tab_names = ["tab1","tab2","tab_final"];
	this.mod.simple_tab.click_render = function(tab_ind,dom){
		var tdom = document.createElement('p');
		tdom.innerHTML = "It's ~"+tab_names[tab_ind]+"~ tab";
		dom.innerHTML = "";
		dom.appendChild(tdom);
		dom.appendChild(self.doms.cp);
	}
	this.mod.simple_tab.add_tabs(tab_names);
}
/**
* test of events
*/
self_mod.prototype.ren_events = function(){
	var self=this;
	this.mod.e_reg = new this.args.tools.events_reg(this.doms.p_events);
	this.mod.t_tip = new this.args.tools.mytooltip();
	this.mod.e_reg.events['mouseover'] = {
		"[name=span_keyword]":function(e){
			e.target.style.color="red";
			self.mod.t_tip.show(e.target,[{name:"div",html:e.target.innerHTML}])
		}
	};
	this.mod.e_reg.events['mouseout'] = {
		"[name=span_keyword]":function(e){
			e.target.style.color="black";
			self.mod.t_tip.hide();
		}
	};
	this.mod.e_reg.register();
	
}

/**
* render the view
* @param {object} query - url query object
*/
self_mod.prototype.render = function(state){
	if(!this.env.touch){
		this.init_render();
		this.env.touch = true;
	}
}
