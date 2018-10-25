"use strict"
// load module and settings
var navi_bar = require('./navi_bar.js'),
	router = require('./Router.js'),
	model = {
		readme:require('./readme.js'),
	},
	tools = {
		ajax:require('./fetch.request.js'),
		gchart: require('../gchart/gchart.js'),
		dot2article: require('./dot2article.js'),
		events_reg: require('./events_reg.js'),
		control_panel: require('./control_panel.js'),
		simple_tab: require('./simple_tab.js'),
		mytooltip: require('./mytooltip.js'),
		extend: require('util')._extend,
	};
// css require
require('./base.scss');
require('./navi_bar.scss');
require('./simple_tab.scss');
require('./loading_onediv.css');
require('./mytooltip.scss');

module.id='spa';
/**
* create(new) object for handle SPA.
* @constructs spa
* @param {object} dom - dom of spa(usually is document.body)
* @returns {Object} this
*/
var spa = function(dom){
	this.doms = {body:dom};
	this.view = {};
	this.url_conf = './config.json';
	this.router = new router({default_hash:'readme'});
	// base args
	this.args = {
		router:this.router,
		view:this.view,
		tools:tools,
		g_var:{},
		ver:'20180913',
		version:'0.0.1'
	}
}
/*
route function for all page
*/
spa.prototype.route_fun = function(state){
	var self = this;
	// hide all page
	Array.prototype.slice.apply(self.doms.body.querySelectorAll('main>div')).map(function(v){
		v.classList.add('hide');
	});
	if(!(state.hash in self.view)){
		state.hash=self.view.nav.args.menu[0];
	}
	self.view.nav.active(state.hash);
	// show assign page
	self.view[state.hash].doms.body.classList.remove('hide');
	self.view[state.hash].render(state);
}
/**
* initiation - need to load config first, and set it into env, then call the router to trigger page loader
*/
spa.prototype.__init__ = function(){
	// init dom structure
	var self=this;
	// css setup
	var dom_css = document.createElement('style');
	dom_css.setAttribute('title','app');
	document.head.appendChild(dom_css);
	this.args.css = dom_css.sheet;
	// setup title
	this.args.db_name = window.location.pathname.split("/").slice(-2)[0];
	document.getElementById("head_title").innerHTML = this.args.db_name;
	tools.ajax_loader = this.doms.body.querySelector('span[name=ajax_loader]');
	tools.ajax_loader.detach();

	// get setting and setup nav
	tools.ajax.get(this.url_conf).then(function(data){
		self.args.conf = JSON.parse(data);
		var r_args = self.args.conf;
		// setup nav
		self.view.nav = new navi_bar(self.doms.body.querySelector('nav'),r_args.nav);
		self.view.nav.click_handler = function(page_name){
			self.router.goto({hash:page_name});
		}
		var div_main = self.doms.body.querySelector('main');
		// set all model instance
		for(var i in r_args.page2args){
			div_main.append_by_array([{name:'div',attr:{name:i}}]);
			self.view[i]=new model[r_args.page2args[i][0]](div_main.querySelector('[name='+i+']'),tools.extend(self.args,r_args.page2args[i][1]));
			self.router.routes[i] = function(state){self.route_fun(state)};
		}
		// finally run router once
		if(self.args.conf.nav.home){
			self.router.args.default_hash = self.args.conf.nav.home;
		}
		self.router.goto();
	});
}
// execute and initiation at onload
module.exports = new spa(document.body);
window.onload = function(){
	google.charts.load('current', {packages: ['corechart','treemap']});
	google.charts.setOnLoadCallback(function(){module.exports.__init__()});
};
