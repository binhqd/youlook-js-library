/**
 * JS Helpers
 * @author huytbt <huytbt@gmail.com>
 */
;(function($, scope){
	scope['helper'] = {
		ZoneString : {
			/**
			 * Word Limiter - Limits a string to X number of words.
			 * @author huytbt <huytbt@gmail.com>
			 */
			word_limiter : function(str, limit, end_char) {
				if (typeof limit == 'undefined') limit = 100;
				if (typeof end_char == 'undefined') end_char = '&#8230;';

				if (str.length <= limit) return str;
				var delim = ' ';
				var trimmedStr = str.substr(0, limit+delim.length);
				var lastDelimIndex = trimmedStr.lastIndexOf(delim);
				if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);
				if (trimmedStr) trimmedStr += end_char;
				return trimmedStr;

				/*var matches = str.replace(new RegExp("^(.{"+limit+"}[^\\\s]*).*"), "$1");
				if (matches != str)
					matches += end_char;
				return matches;*/
			}
		}
	};
})(jQuery, zone);