require('./stdlib.Element.js');
/**
* create(new) object for handle multiple event handler, even for specific DOM children.
* @constructs events_reg
* @returns {Object} this events_reg object
*/
module.id='events_reg';
var events_reg = function(dom){
	this.body = dom;
	this.events = {};
	this.attached = [];
}
module.exports = events_reg;
/**
* event handler for all events listened from this.body, events list on this.events.
* @param {object} e - event object from EventListener
*/
events_reg.prototype.events_han = function(e){
	var t_css,t_evt_cb = this.events[e.type];
	if(t_evt_cb){
		if(typeof(t_evt_cb)==="function"){
			t_evt_cb(e);
		}else{
			for(t_css in t_evt_cb){
				if(e.target.matches(t_css)){
					t_evt_cb[t_css](e);
				}
			}
		}
	}
}
/**
* register body events when it needed.
*/
events_reg.prototype.register = function(){
	var self = this,i;
	for(i in this.events){
		if(this.attached.indexOf(i) == -1){
			this.body.addEventListener(i,function(e){self.events_han(e)});
			this.attached.push(i);
		}
	}
}
/**
* event trigger when needed.
* @param {DOM} el - DOM object that event be trigger
* @param {string} e_type - event type name
*/
events_reg.prototype.trigger_event = function(el,e_type){
	var e = document.createEvent('HTMLEvents');
	e.initEvent(e_type, false, true);
	el.dispatchEvent(e);
	return e;
}
