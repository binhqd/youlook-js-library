/**
 * bj.storage.js
 * Author by @ndaidong at Twitter
 * Copyright by *.bjlab.us, *.youlook.net
*/
;(function(){
	
	"use strict";
	
	var __sk__ = '__bjStore__';
	
	var contextStorage = {
		store : {},
		setItem : function(key, val){
			this.store[key] = val;
		},
		getItem : function(key){
			return this.store[key] || null;
		},
		removeItem : function(key){
			if(!!this.store[key]){
				this.store[key] = null;
				delete this.store[key];
			}
		},      
		clear : function(){
			this.store = {};
		}
	}
		
	function select(type){
		var db = null;
		if(type=='session' || type===2){
			db = !!window['localStorage']?window.localStorage:null;
		}
		else if(type=='local' || type===1){
			db = !!window['sessionStorage']?window.sessionStorage:null;
		}
		if(!db){
			db = contextStorage;
		}
		return db;
	}
	
	var S = bj.storage = {
		select : function(type){
			return select(type);
		}
	}
})();
