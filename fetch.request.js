var npm_url = require('url');
/**
* core function for ajax
* @param {String} method - select method in ['GET','POST']
* @param {Object} url - request url
* @param {Object} data - data that want to get or post(Option)
* @returns {Object} Promise
*/
module.exports.ajaxcore = function(method,url,data){
	var t_url = url,
		t_data,
		t_init = {method:"GET"};
	if(data){
		if(method=='GET'){
			t_url = npm_url.format({pathname:t_url,query:data});
		}else if(method=='POST'){
			// let String and FormData just pass
			t_data = data.constructor.name != 'Object' ? data : Object.keys(data).map(
				function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
			).join('&');
			t_init = {method:"POST",body:t_data};
		}
	}
	return fetch(t_url,t_init).then(function(resp){return resp.text();});
}
/**
* matrix multiple to another matrix
* @param {Object} url - url for ajax with GET
* @param {Object} data - data that want to get(Option)
* @returns {Object} Promise
*/
module.exports.get = function(url, data){
	return this.ajaxcore('GET',url,data);
}
/**
* matrix multiple to another matrix
* @param {Object} url - url for ajax with POST
* @param {Object} data - data that want to post
* @returns {Object} Promise
*/
module.exports.post = function(url, data){
	return this.ajaxcore('POST',url,data);
}
/**
* create a tool to process ajax without jquery
* @constructor
* @version 0.0.1
*/
module.id='fetch.request';
