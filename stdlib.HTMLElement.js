/**
* setup useful function for HTMLElement
* @constructs HTMLElement
* @returns {Object} this HTMLElement
*/
module.id='HTMLElement.js';
/**
* create doms by json object(array that including {name:<tagname>,attr:{},child:[]}, or string as createTextNode)
* @param {Array} array_doms array including {name:<tagname>,attr:{},child:[]}
* @returns {Object} return this
*/
HTMLElement.prototype.append_by_array = function(array_doms){
	var self = this;
	array_doms.map(function(v){
		var t_dom;
		if(v.nodeType==1){
			// is a DOM
			t_dom=v;
		}else if(v.name){
			// is a object with name key(not a DOM)
			t_dom = document.createElement(v.name);
			if(v.attr){
				Object.keys(v.attr).map(function(v_1){
					t_dom.setAttribute(v_1,v.attr[v_1]);
				});
			}
			// recursive if child exist
			if(v.child && v.child.hasOwnProperty('length')){
				t_dom.append_by_array(v.child);
			}else if(v.html){
				// set html by innerHTML
				t_dom.innerHTML = v.html;
			}
		}else{
			// others...string
			t_dom=document.createTextNode(v);
		}
		self.appendChild(t_dom);
	});
	return this;
}
/**
* detach itself from attached parentNode
* @returns {Object} return this
*/
HTMLElement.prototype.detach = function(){
	if(this.parentNode){
		this.parentNode.removeChild(this);
	}
	return this;
}
/**
* scroll to itself position
* @returns {Object} return this
*/
HTMLElement.prototype.scroll_to = function(){
	window.scrollTo(this.offsetLeft+this.clientLeft,this.offsetTop+this.clientTop);
}
