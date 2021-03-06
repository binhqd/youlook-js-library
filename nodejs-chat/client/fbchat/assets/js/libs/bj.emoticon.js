/**
 * bj.emoticon.js
 * BellaJS Emoticon parse the text and replace the emoticon's signs by real icons.
 * Author by @ndaidong at Twitter
 * Copyright by *.bjlab.us, *.youlook.net
*/
;(function(){
	
	"use strict";
		
	var _sers = 'http://us.i1.yimg.com/us.yimg.com/i/mesg/emoticons7/';

	var _emos = [		
		['yeah',			'\\m/',			'111'],		
		['confused',		':-/',			'7'],
		['waiting',			':-w',			'45'],
		['time out',		':-t',			'104'],
		['thinking',		':-?',			'39'],
		['day dreaming',	'8->',			'105'],
		['rolling eyes',	'8-|',			'29'],
		['hee hee',			';))',			'71'],
		['sleepy',			'I-)',			'28'],
		['loser',			'L-)',			'30'],
		['silly',			'8-}',			'35'],
		['no talking',		'[-(',			'33'],
		['broken heart',	'=((',			'12'],
		['surprise',		':-O',			'13'], 
		['shame on you',		'[-X',		'68'],
		['cool',				'B-)',		'16'],
		['crying',				':((',		'20'],
		['laughing',			':))',		'21'],
		['laughing',			'=))',		'21'],
		['kiss',				':-*',		'11'],
		['nail biting',			':-SS',		'42'],
		["don\\'t tell anyone",	':-$',		'32'],
		['yawn',				'(:|',		'37'],
		['nerd',				':-B',		'26'],
		['chatterbox',			':-@',		'76'],
		['applause',			'=D>',		'41'],
		['blushing',			':">',		'9'],		
		['money eyes',			'$-)',		'64'],
		['oh go on',			':-j',		'78'],
		["I don\\'t know",		':-??',		'106'],
		['thumbs down',			':-q',		'112'],
		['bring it on',			'>:/',		'70'],
		['hurry up!',			':!!',		'110'],
		['thumbs up',			':-bd',		'113'],
		['coffee',				'~O)',		'57'],
		['batting eyelashes',	';;)',		'5'],
		["d\\'oh",				'#-o',		'40'],
		['on the phone',		':)]',		'100'],
		['call me',				':-c',		'101'],
		['big hug',				'>:D<',		'6'],
		['good luck',			'%%-',		'54'],
		['rose',				'@};-',		'53'],
		['daydreaming',			'8->',		'105'],
		['praying',				'[-O<',		'63'],
		['skull',				'8-X',		'59'],
		['bee',					':bz',		'115'],
		['bug',					'=:)',		'60'],
		['pig',					':@)',		'49'],
		['idea',				'*-:)',		'58'],
		['angel',				'O:)',		'25'],
		['sick',				':-&',		'31'],
		['monkey',				':(|)',		'51'],
		['chicken',				'~:>',		'52'],
		['puppy dog eyes',		':o3',		'108'],
		['cow',					'3:-O',		'50'],
		['whistling',			':-"',		'65'],		
		['star',				'(*)',		'79'],
		['tongue',				':P',		'10'],
		['worried',				':-S',		'17'],
		['happy',				':)',		'1'],
		['sad',					':(',		'2'],
		['big grin',			':D',		'4'],
		['love struck',			':x',		'8'],	
		['straight face',		':|',		'22'],
		['angry',				'X(',		'14'],
		['winking',				';)',		'3'],
		['surprise',			':-o',		'13']
	];	
	
	var _emoticons = (function(){
		var a = [];
		_emos.forEach(function(item){
			if(!!item){
				a.push({
					title : item[0],					
					sign : item[1],
					path : _sers+item[2]+'.gif'	
				});
			}
		});
		return a;
	})();

	function parse(s){
		_emoticons.forEach(function(em){
			s=s.replaceAll(em.sign, '<img src="'+em.path+'">');
		});
		return s;
	}
	
	var E = bj.emoticon = {
		parse : parse
	}
})();
