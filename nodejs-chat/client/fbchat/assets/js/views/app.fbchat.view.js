/**
 * app.fbchat.view.js
 * A demo for how to control view layer of chat tool.
 * Author by @ndaidong at Twitter
 * Copyright by *.bjlab.us, *.youlook.net
*/

var app = window.app || {};

;(function(){
	
	'use strict';
	
	var friendListHTML = '', meHTML = '';
	
	var focusing = true;
	
	var Pipe = {
		me : null,
		list : [],
		axis : {x:0, y:0},
		map : [
			{x:150, y:0},
			{x:150, y:100},
			{x:0, y:100},
			{x:-150, y:100},
			{x:-150, y:0},
			{x:-150, y:-100},
			{x:0, y:-100},
			{x:150, y:-100},
			{x:300, y:-100},
			{x:300, y:0},
			{x:300, y:100},
			{x:300, y:200},
			{x:150, y:200},
			{x:0, y:200},
			{x:-150, y:200},
			{x:-300, y:200},
			{x:-300, y:100},
			{x:-300, y:0},
			{x:-300, y:-100},
			{x:-300, y:-200},
			{x:-150, y:-200},
			{x:0, y:-200},
			{x:150, y:-200},
			{x:300, y:-200}
		],
		getMap : function(){
			var o = this.map, a = [];
			var x = this.axis.x;
			var y = this.axis.y;
			o.forEach(function(item){
				a.push({
					x: x+item.x,
					y: y+item.y,
					node: item.node || 0,
				});
			});
			return a;
		},
		add : function(user){		
			var nodeIndex = this.list.length;
			var map = this.map[nodeIndex];
			var ox = map.x;
			var oy = map.y;
			var me = this.me;
			var cx = me.getX();
			var cy = me.getY();
			
			var nx = cx+ox;
			var ny = cy+oy;
			
			var tx = (nx-cx)*2, ty = (ny-cy)*2;
				
			var node = drawNode(user, {x: tx, y: ty});
			node.click(function(){
				R.onclick(user);
			});
			
			Pipe.list.push(node);
			Pipe.map[nodeIndex].node = node;			
			
			node.animate({x: nx, y: ny}, 1000, 'bounce');			
		},
		remove : function(node){
			var ls = this.map, ln = ls.length;
			for(var i=ln-1;i>=0;i--){
				if(!!ls[i].node && ls[i].node.id == node.id){
					var on = ls[i].node;
					var ox = on.getX();
					var oy = on.getY();
					var me = this.me;
					var cx = me.getX();
					var cy = me.getY();
					
					var tx = (ox-cx)*10, ty = (oy-cy)*10;
					if(tx==0){
						tx=-1000;
					}
					if(ty==0){
						ty=-1000;
					}
					on.animate({x: tx, y: ty}, 1000, 'backIn', function(){
						on.remove();
					});
					for(var j=0;j<Pipe.list.length;j++){
						if(Pipe.list[j].id===node.id){
							Pipe.list.splice(j, 1);
							break;
						}
					}					
					Pipe.map[i].node = null;
					Pipe.ondecrease(i);
					break;
				}
			}
		},
		onincrease : function(){
			
		},
		ondecrease : function(k){
			if(k>=0 && k<Pipe.map.length-1){
				var me = this.me;
				var cx = me.getX();
				var cy = me.getY();
				var prev = Pipe.map[k];
				for(var i=k;i<Pipe.map.length;i++){
					var n = Pipe.map[i].node;
					if(!!n){
						var ox = prev.x;
						var oy = prev.y;				
						Pipe.map[i-1].node = n;
						Pipe.map[i].node = null;
						if(Pipe.list.length==1){
							Pipe.map[0].node = n;
						}						
						n.animate({x:cx+ox, y:cy+oy}, 500, 'easeIn');
					}
					prev = Pipe.map[i];
				}
			}
		}
	}
	
	function drawNode(user, attr){
		var pp = R.paper;
		var c = pp.circle(attr.x, attr.y-10, 24);
		c.attr({stroke: '#9da', fill:'url('+user.avatar+')'});
		var t = pp.text(attr.x, attr.y+25, user.displayName);
		t.attr({
			stroke:'#ff8',
			'font-size' : '16px'
		});		
		var t2 = pp.text(attr.x-1, attr.y+24, user.displayName);
		t2.attr({
			stroke:'#000',
			'font-size' : '16px'
		});	
		return {
			id : user.userid,
			icon : c,
			text : t,
			animate : function(p, timer, transition, callback){
				var x1 = p.x || c.attr('cx');
				var y1 = p.y || c.attr('cy');
				var x2 = p.x || t.attr('x');
				var y2 = p.y+35 || t.attr('y');
				c.animate({
					cx : x1,
					cy : y1
				}, timer || 500, transition || 'linear', callback);
				t.animate({
					x : x2,
					y : y2
				}, timer || 500, transition || 'linear');			
				t2.animate({
					x : x2+1,
					y : y2+1
				}, timer || 500, transition || 'linear');	
			},
			getX : function(){
				return c.attr('cx');
			},
			getY : function(){
				return c.attr('cy');
			},
			remove : function(){
				c.remove();
				t.remove();
				t2.remove();
			},
			click : function(callback){
				c.click(callback);
				t.click(callback);
				t2.click(callback);
			}
		}				
	}
	
	var R = bj.createView(app.fbchat, {
		init : function(){
			var el = bj.element('room');
			var w = el.offsetWidth, h = el.offsetHeight;
			var r = Raphael('room', w, h);
			this.el = el;
			this.paper = r;
			window.onfocus = function(){
				focusing = true;
				bj.notification.hide();
			}
			window.onblur = function(){
				focusing = false;
			}
		},
		render : function(){
			bj.element('btnLogin').hide();
			var me = R.Model.getMe();
			
			var el = this.el;
			var w = el.offsetWidth, h = el.offsetHeight;
			this.me = drawNode(me, {x: w/2, y: h/2});
			this.friends = [];
			Pipe.me = this.me;
			var fs = R.Model.getOnlineConnectors();
		},
		updateFriendList : function(){
			var fs = R.Model.getOnlineConnectors();
			if(fs.length>Pipe.map.length){
				fs = fs.slice(0, Pipe.map.length);
			}
			if(fs.length>0){
				this.closeMsg();
			}
			else{
				this.showMsg('Please invite your friends to join here.');	
			}
			
			var x0 = this.el.offsetWidth/2;;
			var y0 = this.el.offsetHeight/2;
			
			var a = Pipe.getMap();
			a.forEach(function(item){
				if(!!item.node){
					var off = true;
					for(var i=0;i<fs.length;i++){
						if(fs[i].userid===item.node.id){
							off = false;
							break;
						}
					}
					if(!!off){
						Pipe.remove(item.node);
					}
				}
			});
			fs.forEach(function(u){
				var a = Pipe.getMap();
				var pass = false;
				for(var i=0;i<a.length;i++){
					if(a[i].node && a[i].node.id==u.userid){
						pass = true;
						break;
					}
				}
				if(!pass){
					Pipe.add(u);
				}
			});
		},
		showMsg : function(msg){
			this.closeMsg();
			var me = R.Model.getMe();
			var t = this.me;
			var cx = t.getX(), cy = t.getY();
			var w = 400, h = 120;
			var el = bj.element('room');
			var div = bj.addElement('DIV', el);
			div.addClass('inviteBox');
			div.setSize(w, h);
			div.setPosition(cy+50, cx-w/2);
			
			var url = 'http://demo.bjlab.us/fbchat/?v=1&id='+bj.createId(16);
			var link = 'http://www.facebook.com/sharer.php?u={URL}';
			link =  link.replace('{URL}', url.encode());
			
			var tpl = Template.inviteBox;
			tpl = tpl.replaceAll('{NAME}', me.displayName);
			tpl = tpl.replaceAll('{LINK}',  link);
			div.innerHTML = tpl;
			
			bj.element('btnInvite').click(function(){
				R.closeMsg();
			});
			bj.element('btnCancelInvite').click(function(){
				R.closeMsg();
			});
			
			this.inviteBox = div;
		},
		closeMsg : function(){
			if(!!this.inviteBox){
				this.inviteBox.remove();
			}
		},
		onclick : function(u){
			ChatBox.open(u);
		},
		onreceive : function(msg){
			R.closeMsg();
			var me = R.Model.getMe();
			var sender = msg.sender;
			if(me.userid!=sender.userid){
				bj.notification.show(sender.avatar, sender.displayName+' says:', msg.text.truncate(30), 10);
			}
			ChatBox.receive(msg);
		},
		updateFriendState : ChatBox.updateState,
		resetChatBox : function(){
			paper.clear();
			ChatBox.reset();
		}
	});
})();

