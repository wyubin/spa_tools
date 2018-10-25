module.id='dot2article';
// general object extend
var ajax = require('./fetch.request.js'),
dot = require('dot'),
extend = require('util')._extend;

/**
* create
* @constructs dot2article
* @param {DOM} [dom] - DOM of module body, default use a DIV
* @param {Object} [args] - init settings
* @returns {Object} this dot2article object
*/
var dot2article = function (dom,args){
	this.doms={body:dom || document.createElement('div')};
	this.args = extend({
		dot:'<h3>{{=it._title}}</h3>{{=it._tmpl}}'
	},args);
	this.vars={};
	this._init();
};
module.exports = dot2article;
/**
* initiate the view
*/
dot2article.prototype._init = function(){
	this.vars.tmpl = dot.template(this.args.dot);
}
/**
* load a tmpl(url) then render it to body
* @param {String} title - title of article
* @param {String} url - tmpl(dot)
* @param {Object} [args] - args for this tmpl
* @returns {Obejct} promise
*/
dot2article.prototype.add = function(title,url,args){
	var self = this,
		t_dom = document.createElement('div'),
		t_tmpl;
	this.doms.body.appendChild(t_dom);
	return ajax.get(url).then(function(data){
		t_tmpl = dot.template(data);
		t_dom.innerHTML = self.vars.tmpl({
			_title:title,
			_tmpl:t_tmpl(args),
			args:args
		});
		return t_dom;
	});
}

/**
* render by config (with args loading)
* @param {String} conf_path - path of config
* @param {String} coll - variable array that will be put
* @returns {Obejct} promise with config value
*/
dot2article.prototype.conf_promise = function(conf_path,coll){
	var conf,
		self=this;
	return ajax.get(conf_path).then(
		function(data){
			conf = JSON.parse(data);
			var ps = Object.keys(conf.json).map(function(v,ind){
				if(!coll[v]){
					return ajax.get(conf.json[v]).then(function(data){
						coll[v]=JSON.parse(data);
					});
				}else{
					return Promise.resolve(0);
				}
			});
			return Promise.all(ps);
		}
	).then(function(data){
		var ps = conf.htmls.title.map(function(v,ind){
			var t_args = extend({},conf.htmls.args[ind]);
			extend(t_args,conf.args);
			return self.add(v,conf.htmls.html[ind],
				extend(t_args,coll)
			);
		});
		return Promise.all(ps);
	}).then(function(data){return conf});
}
