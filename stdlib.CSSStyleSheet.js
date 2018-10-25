/**
* setup useful function for CSSStyleSheet
* @constructs CSSStyleSheet
* @returns {Object} this CSSStyleSheet
*/
module.id='CSSStyleSheet.js';
/**
* update rule to CSSStyleSheet(find a match selector and replace it)
* @param {string} selector - selector of this rule
* @param {object} css_rule - rule object
* @returns {Object} return this
*/
CSSStyleSheet.prototype.css_update = function(selector,css_rule){
	var i,tmp;
	// delect all rules of match selector
	for(i=0;i<this.cssRules.length;i++){
		tmp=this.cssRules[i];
		if(tmp.selectorText == selector){
			this.deleteRule(i);
		}
	}
	// add this rule
	this.insertRule(selector+this.css_tostring(css_rule),0);
	return this;
};
CSSStyleSheet.prototype.clean = function(selectors){
	for(i=0;i<this.cssRules.length;i++){
		if(selectors){
			if(selectors.indexOf(this.cssRules[i].selectorText)!=-1){
				this.deleteRule(i);
			}
		}else{
			this.deleteRule(i);
		}
	}
}
/**
* return a valid string for insertRule
* @param {object} css_rule - rule object
* @returns {string} return css string
*/
CSSStyleSheet.prototype.css_tostring = function(css_rule){
	return '{'+Object.keys(css_rule).map(function(v){
		return v+':'+css_rule[v];
	}).join(';')+'}';
}
