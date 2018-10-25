var extend = require('util')._extend;
var url = require('url');
module.id='Router';
/**
* a router that offer function that 1. goto function to push or replace state(if history.state == new state, do not pushstate in history) 2. add function for add callback handler 3. check funtion to run process of before router -> router check 4. onpopstate event for back and forword page(just call goto function)
* @constructor
* @version 0.0.1
* @param {object} args - arguments for router
*/
function Router(args){
	this.args = extend({
		default_hash:'',
		debug:false
	},args);
	this.routes = {};
	this.__init__();
	if(this.args.debug){
		this.before_route = function(state){
			console.log('write function as Router.before_route with state below');
			console.log(state);
		}
	}
}
module.exports = Router;
/**
* initiation，assign router and their callback in this.routes
*/
Router.prototype.__init__ = function(){
	var self=this;
	window.onpopstate = function(evt){
		if(evt.state){
			self.check(evt.state);
		}
	};
	return this;
}
/**
* input a uri_o(obj with query and hash) to check the handler
* @param {Object} [uri_input] - uri_o or url string or null, if null, use location.href as default
*/
Router.prototype.goto = function(uri_input){
	// t can be null, string or uri_object
	var uri_o = uri_input || location.href,
		t_uri;
	if(typeof uri_o == 'string'){
		t_uri = url.parse(uri_o,true);
		uri_o={query:t_uri.query,hash:t_uri.hash ? t_uri.hash.replace(/^#/,''):t_uri.hash};
	}
	// if no state(first open tab)
	if(!history.state){
		window.history.replaceState(uri_o,null,window.location.href);
	}
	// if goto state is same as previous state => no pushState
	if(uri_o.hash!=history.state.hash || uri_o.query!=history.state.query){
		window.history.pushState(uri_o, null, url.format(extend({pathname:location.pathname},uri_o)));
	}
	// find a fit handdler and callback
	this.check(uri_o);
	return this;
}
/**
* check the state have available router or call the default router
* @param {Object} state - state
*/
Router.prototype.check = function(state){
	if(state.hash in this.routes){
		this.routes[state.hash](state);
	}else{
		if(this.args.default_hash){
			var t_state = extend({},state);
			this.routes[this.args.default_hash](extend(t_state,{hash:this.args.default_hash}));
		}else{
			alert('We do not have "'+state.hash+'" page!!');
		}
	}
	return this;
}
