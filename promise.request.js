var npm_url = require('url');
/**
* core function for ajax
* @param {String} method - select method in ['GET','POST']
* @param {Object} url - request url
* @param {Object} data - data that want to get or post(Option)
* @returns {Object} Promise
*/
module.exports.ajaxcore = function(method,url,data){
	return new Promise(function(resolve, reject){
		var xhr = new XMLHttpRequest();
		var t_url = url,
			t_data = data;
		// check get or post
		if(data){
			if(method=='GET'){
				t_url = npm_url.format({pathname:t_url,query:data});
			}else if(method=='POST'){
				// let String and FormData just pass
				t_data = data.constructor.name != 'Object' ? data : Object.keys(data).map(
					function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
				).join('&');
			}
		}
		// open start
		xhr.open(method, t_url);
		xhr.onload = function(){
			if(xhr.status==200){
				resolve(xhr.response);
			}else{
				reject(Error(xhr.statusText));
			}
		};
		xhr.onerror = function(){
			reject(Error("Network Error"));
		};
		// final send
		if(method=='POST' && data.constructor.name == 'Object'){
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		xhr.send(t_data);
	});
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
module.id='promise.request';
