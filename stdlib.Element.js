/**
* setup useful function for Element
* @constructs Element
* @returns {Object} this Element
*/
module.id='Element.js';
/**
* compatible for ie edge
* @param {String} css selector
* @returns {Object} return this
*/
Element.prototype.matches = Element.prototype.matches || Element.prototype.msMatchesSelector;
