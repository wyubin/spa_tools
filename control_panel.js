module.id='control_panel';
// general object extend
var dot = require('dot'),
	extend = require('util')._extend,
	events_reg = require('./events_reg.js');

/**
* create(new) a view with dot engine and combine args input and event trigger.
* @constructs control_panel
* @returns {Object} this control_panel object
*/
var control_panel = function (dom,args){
	this.doms={body:dom};
	this.args = extend({
		dot_tmpl:"<span title='{{=JSON.stringify(it)}}'>mouse on will show args</span><input name='default_test' type='button' value='test'>",
		event_types:['click'] // support event type on form
	},args);
	// initial event register
	this.e_reg = new events_reg(dom);
	this.input_data = {};
	this.init();
};
module.exports = control_panel;
/**
* init process
*/
control_panel.prototype.init = function(){
	var self= this;
	this.dot_tmpl = dot.template(this.args.dot_tmpl);
	// setup default event
	this.args.event_types.map(function(v){self.e_reg.events[v]={}});
	this.e_reg.register();
	//this.e_reg.events.click['input[name=default_test]'] = function(e){console.log('setup events by this.e_reg.events')};
	// generate init view
	this.input({});
}
/**
* input info into view, info will save as this.input_data
* @param {Obejct} info - object that will be used on control function
*/
control_panel.prototype.input = function(info){
	this.input_data = extend(this.input_data,info || {});
	this.doms.body.innerHTML = this.dot_tmpl(info);
	return this;
}
