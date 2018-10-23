/**
 * KUtils
 * @version	2.0.0
 * @author	Kevin Lucich
*/

(function(window){

	var KUtils = null,
		KUtilsHelps = null,
		check_patterns = {
			'text': {
				'all': 				"^(.)__OF_B__$",	//	__RANGE__
				'alphanumeric':		"^[a-zA-Z0-9 ]+$",
				'no_space': 		"^[\\S]+$",
				'codicefiscale':	"^[a-z]{6}[0-9]{2}[a-z][0-9]{2}[a-z][0-9]{3}[a-z]$",
				'piva':				"^[0-9]{11}$"
			},
			'number': {
				'all':		"^(([-+]?[0-9]+)|([-+]?([0-9]__OF_B__\\.[0-9]__OF_A__)))$",
				'int':		"^[-+]?[0-9]+$",
				'float':	"^[-+]?([0-9]__OF_B__\\.[0-9]__OF_A__)$"
			},
			'ip':{
				'all':		"^([1][0-9][0-9]|2[0-4][0-9]|25[0-5])\.([1][0-9][0-9]|2[0-4][0-9]|25[0-5])\.([1][0-9][0-9]|2[0-4][0-9]|25[0-5])\.([1][0-9][0-9]|2[0-4][0-9]|25[0-5])$"
			},
			'email':{
				'all':		"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,6}$"
			},
			'username':{
				'all':		"^([a-zA-Z0-9_-]__OF_B__)$"
			},
			'password':{
				'all':		"^([a-zA-Z0-9_-]__OF_B__)$"
			},
			'phone':{
				'all':		"^([0-9-()+ ]__OF_B__)$"
			},
			'date':{
				'all':		"^(((0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.]([0-9]{4}))|((0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.]([0-9]{4}))|(([0-9]{4})[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01]))|(([0-9]{4})[- /.](0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])))$",
				'Y-m-d':	"^(([0-9]{4})[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01]))$",
				'Y-d-m':	"^(([0-9]{4})[- /.](0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012]))$",
				'm-d-Y':	"^((0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.]([0-9]{4}))$",
				'd-m-Y':	"^((0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.]([0-9]{4}))$"
			},
			'space':{
				'all':				"[ \t\r\n]",
				'onlyspaces':		" ",
				'onlytabs':			"\t",
				'onlybreakline':	"[\n\r]"
			},
			'url':{
				'all':		"^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$",
				'onlywww':	"^w{3}([0-9]+)?\.([a-zA-Z0-9]([a-zA-Z0-9\-]{0,65}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}"
			},
			'creditcard':{
				'all':				"^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$",
				'visa':				"^4[0-9]{12}(?:[0-9]{3})?$",
				'mastercard':		"^5[1-5][0-9]{14}$",
				'americaexpress':	"^3[47][0-9]{13}$",
				'dinersclub':		"^3(?:0[0-5]|[68][0-9])[0-9]{11}$",
				'discover':			"^6(?:011|5[0-9]{2})[0-9]{12}$",
				'jcb':				"^(?:2131|1800|35\d{3})\d{11}$",
				'expdate':			"^(0[1-9]|1[012])\/([12][0-9])$"
			},
			'image':{
				'all':		"([^\s]+(?=\.(jpeg|jpg|gif|png|tiff))\.\2)$",
				'jpeg':		"([^\s]+(?=\.(jpeg))\.\2)$",
				'jpg':		"([^\s]+(?=\.(jpg))\.\2)$",
				'gif':		"([^\s]+(?=\.(gif))\.\2)$",
				'png':		"([^\s]+(?=\.(png))\.\2)$",
				'tiff':		"([^\s]+(?=\.(tiff))\.\2)$"
			},
			'color':{
				'all':		"^(rgb\((\d+),\s*(\d+),\s*(\d+)\))|(#?([a-f0-9]{6}|[a-f0-9]{3}))$",
				'rgb':		"^rgb\((\d+),\s*(\d+),\s*(\d+)\)$",
				'hex':		"^#?([a-fA-Z0-9]{6}|[a-fA-Z0-9]{3})$"
			},
			'html':{
				'all':		"(\<(/?[^\>]+)\>)"
			}
		};

	/*******************************************************************/
	/*******************************************************************/
	/*******************************************************************/
	/*******************************************************************/

	//	Functions used into KUtils :)

	KUtilsHelps = {
		'isWindow': function a( obj ){
			return obj != null && obj === obj.window;
		},

		'isPlainObject': function( obj ){
			// Not plain objects:
			// - Any object or value whose internal [[Class]] property is not "[object Object]"
			// - DOM nodes
			// - window
			if ( typeof obj !== 'object' || obj.nodeType || KUtilsHelps.isWindow(obj) ) {
				return false;
			}

			// Support: Firefox <20
			// The try/catch suppresses exceptions thrown when attempting to access
			// the "constructor" property of certain host objects, ie. |window.location|
			// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
			try {
				if( obj.constructor && !core_hasOwn.call(obj.constructor.prototype,'isPrototypeOf') ){
					return false;
				}
			}catch( e ){
				return false;
			}

			// If the function hasn't returned already, we're confident that
			// |obj| is a plain object, created by {} or constructed with new Object
			return true;
		}
	};

	/*******************************************************************/
	/*******************************************************************/
	/*******************************************************************/
	/*******************************************************************/

	KUtils = {

		'plugins_version': {
			'KUtils': '2.0.0'
		},

		/**
		 * KUtils.version
		 * Ritorna una mappa con le versioni delle plugin
		 */
		'version': function( plugins ){

			if( typeof plugins !== 'undefined' ){
				for( p in plugins ){
					KUtils.plugins_version[ p ] = plugins[p];
				}
				return;
			}

			console.dir( KUtils.plugins_version );
		},

		/**
		 $.check( params|typeCheck, value, [, subtype] );
		 $( __ELEMENT__ ).check( params|typeCheck, [, subtype] );	Check the value of __ELEMENT__ with the "typeCheck"

		 @version	1.2
		 @author	Kevin Lucich

		 @param		params		{Object|string}	The type of will be the value or List of params
		 @param		_subtype	{string}		A specified type (default: 'all') // it meas "all" of typeCheck
		 @param		_value		{string|Number}	The value to check

		 @return	{Boolean}	Return True if the value is valid
		 */
		'check': function( params, _value, _subtype ){

			var methods = {
				'check': {
					'init': function( params, _value, _subtype ){

						// Posso passare i parametri come oggetto o tre valori separati (type,value,subtype)
						if( (typeof params !== 'undefined') && (typeof params != 'object') ){
							params = {
								'type': params,
								'subtype': (typeof _subtype === 'undefined') ? 'all' : _subtype,
								'value': _value
							};
						}

						var paramsDefault = {
							'type': 'text',
							'subtype': 'all',
							'value': false,
							'rules': {
								'range': '',		// {'from': 0, 'to': 1},
								'of': '+',
								'replace': false
							}
						};

						return KUtils.extend( true, {}, paramsDefault, params );
					},

					'_do': function(params){

						var check_param_of_range = function(p,nameParam){
							if( !(/^([*]{1})$|^([0-9]+)$|^([0-9]+,[0-9]+)$/).test(p) ){
								console_action('PRM_IGN','$.check',nameParam);
								return false;
							}
							return true;
						};

						var _regex = check_patterns[ params.type ][ params.subtype ];
						var __OF_A__ = '+';
						var __OF_B__ = params.rules.of;

						if( params.rules.range != '' ){

							__OF_B__ = params.rules.range;

							if( params.subtype == 'float' ){	// Formato: 1,2;8,9	=> range
								if( /^[0-9]+,[0-9]+;[0-9]+,[0-9]+$/.test( params.rules.range ) ){
									var r_split = (params.rules.range).split(';');
									__OF_A__ = (check_param_of_range(r_split[0],'params.rules.range')) ? r_split[0] : '';
									__OF_B__ = (check_param_of_range(r_split[1],'params.rules.range')) ? r_split[1] : '+';
								}
							}else{
								// Formato: [num] => viene trasformato in 0,[num] così da diventare un range
								if( /^[0-9]+$/.test( __OF_B__ ) ){
									__OF_B__ = '0,'+ __OF_B__;
								}else{
									// Formato: 1,9	=> range
									__OF_B__ = (check_param_of_range( __OF_B__,'params.rules.range' )) ?  __OF_B__ : '+';
								}
							}
						}	// End PRR


						if( __OF_B__ != '+' && !check_param_of_range( __OF_B__, 'params.rules.of' ) ){
							__OF_B__ = '+';
						}

						if( (__OF_A__ != '+')&&(__OF_A__ != '*') )
							__OF_A__ = '{'+ __OF_A__ +'}';
						if( (__OF_B__ != '+')&&(__OF_B__ != '*') )
							__OF_B__ = '{'+ __OF_B__ +'}';

						_regex = _regex.replace(/__OF_A__/, __OF_A__ ).replace(/__OF_B__/, __OF_B__ );

						var regex = new RegExp( _regex );

						return regex.test( params.value );
					}
				}
			};

			params = (methods.check['init']).apply( undefined, arguments );
			return (methods.check['_do']).apply( undefined, [params] );
		},

		'stripslashes': function( str ){
			// +	original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// +	improved by: Ates Goral (http://magnetiq.com)
			// +	fixed by: Mick@el
			// +	improved by: marrtins
			// +	bugfixed by: Onno Marsman
			// +	improved by: rezna
			// +	input by: Rick Waldron
			// +	reimplemented by: Brett Zamir (http://brett-zamir.me)
			// +	input by: Brant Messenger (http://www.brantmessenger.com/)
			// +	bugfixed by: Brett Zamir (http://brett-zamir.me)
			// *		example 1: stripslashes('Kevin\'s code');
			// *		returns 1: "Kevin's code"
			// *		example 2: stripslashes('Kevin\\\'s code');
			// *		returns 2: "Kevin\'s code"
			return (str + '').replace(/\\(.?)/g, function (s, n1) {
				switch (n1) {
					case '\\':
						return '\\';
					case '0':
						return '\u0000';
					case '':
						return '';
					default:
						return n1;
				}
			});
		},

		/**
		 * Return length of Object
		 * @author 	Kevin Lucich <lucichkevin@gmail.com>
		 * @param	obj	{Object}	The Object to count
		 * @return	{int}	The lenght of Object
		 */
		'objSize': function( obj ){
			if( obj == null || (obj.constructor != Object && obj.constructor != Array) ){
				return 0;
			}
			return Object.keys(obj).length;
		},

		/**
		 * Return a copy of Object
		 * @author 	Kevin Lucich <lucichkevin@gmail.com>
		 * @param	obj	{Object}	The Object to count
		 * @return	{Object}	A copy of Object
		 */
		'objClone': function( obj ) {
			if( null == obj || obj.constructor != Object ){
				return obj;
			}
			var copy = obj.constructor();
			for( var attr in obj ){
				if( attr in obj ){
					copy[attr] = obj[attr];
				}
			}
			return copy;
		},

		'objJoin': function( obj, glue, separator ){

			obj = (typeof obj !== 'undefined') ? obj : {};
			glue = (typeof glue !== 'undefined') ? glue : '=';
			separator = (typeof separator !== 'undefined') ? separator : ',';

			var pieces = [];
			for( var i in obj ){
				if ( obj.hasOwnProperty( i ) ){
					pieces.push( i + glue + obj[i] );
				}
			}

			return pieces.join( separator );
		},

		'obj2Array': function( obj ){
			var array = [];
			for( var k in obj ){
				array.push( obj[k] );
			}
			return array;
		},

		'objKeys': function( obj ){

			var keys = [];

			if( (typeof obj === 'undefined') || (obj == null) ){
				return keys;
			}

			switch( obj.constructor ){
				case Object:
					//	If exists "Object.keys" (native method) use it, otherwise use case "Array" !
					if( typeof Object.keys !== 'undefined' ){
						return Object.keys(obj);
					}
				case Array:
					for( var i in obj ){
						if( obj.hasOwnProperty(i) )
							keys.push(i);
					}
					return keys;
				default:
					return keys;
			}
		},

		'objFlip': function( obj ){
			var key=null, tmp = {};
			for( key in obj ){
				if ( obj.hasOwnProperty( key ) ){
					tmp[ obj[key] ] = key;
				}
			}
			return tmp;
		},

		'objIntersectKey': function(){
			var argv = [].slice.call(arguments);

			var result = argv[0];

			var len = argv.length;
			for( var i=1; i<len; i++ ){
				var array = argv[i];
				for( var key in result ){
					if( typeof array[key] === 'undefined' ){
						delete( result[key] );
					}
				}
			}

			return result;
		},

		'objKeyAllowed': function( obj, allowed ){
			obj = obj || {};
			allowed = allowed || [];
			return KUtils.objIntersectKey( obj, KUtils.objFlip(allowed) );
		},

		'trim': function( str ){
			if( str == null || typeof str === 'undefined' || str.constructor !== String ){
				return str;
			}
			if( typeof String.prototype.trim !== 'undefined' ){
				return str.trim();
			}
			if( typeof String.trim !== 'undefined' ){
				return String.trim(str);
			}
			return str.replace(/^\s+|\s+$/g,'');	//	Colpa di IE :'(
		},

		/**
		 * Return boolean if the el is in array
		 * @param	needle		mixed	The searched value.
		 * @param	haystack	array	The array
		 * @return	{Boolean}
		 */
		'inArray': function( needle, haystack ){

			if( typeof needle === 'undefined' || haystack.constructor !== Array ){
				return false;
			}

			var i = 0;
			var len = null;

			if( needle.constructor === Array ){
				len = needle.length;
				for( i=0; i<len; i++ ){
					if( !KUtils.inArray( needle[i], haystack ) ){
						return false;
					}
				}
				return true;
			}

			if( typeof [].indexOf !== 'undefined' ){
				return (haystack.indexOf(needle)!=-1);
			}else{
				len = haystack.length;
				for( i=0; i<len; i++ ){
					if( haystack[i] == needle ){
						return true;
					}
				}
				return false;
			}
		},

		/**
		 * $.MD5( str );	 Return string cripted with MD5 method
		 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
		 * @author		Paul Johnston, Greg Holt
		 * @updated	Kevin Lucich <lucichkevin@gmail.com>
		 * @param		str	{String|Object}	The string (or object/array) to cript with MD5 method
		 * @return	{string}	String cripted with MD5 method
		 */
		'MD5': function( str ){

			//	In this case "str" is an Object or Array
			if( (str != null) && (str.constructor == Array || str.constructor == Object) ){
				var __describe_object = function( obj, str ){
					if( !obj ){
						return str;
					}
					for( i in obj ){
						if( obj.hasOwnProperty(i) == false ){
							continue;
						}
						var md5 = (obj[i] != null) && ((obj[i]).constructor == Array || (obj[i]).constructor == Object) ? __describe_object(obj[i],str) : i +':'+ obj[i];
						str = KUtils.MD5( str +'_'+ md5 );
					}
					return str;
				};
				str = __describe_object(str,'');
			}

			// Convert a 32-bit number to a hex string with ls-byte first
			var hex_chr = "0123456789abcdef";
			function rhex(num){
				str = "";
				for(var j=0; j <= 3; j++)
					str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) + hex_chr.charAt((num >> (j * 8)) & 0x0F);
				return str;
			}

			// Convert a string to a sequence of 16-word blocks, stored as an array. Append padding bits and the length, as described in the MD5 standard.
			function str2blks_MD5(str){
				var nblk = ((str.length + 8) >> 6) + 1;
				var blks = new Array(nblk * 16);
				for(i=0; i < nblk * 16; i++) blks[i] = 0;
				for(i=0; i < str.length; i++)
					blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
				blks[i >> 2] |= 0x80 << ((i % 4) * 8);
				blks[nblk * 16 - 2] = str.length * 8;
				return blks;
			}

			// Add integers, wrapping at 2^32. This uses 16-bit operations internally to work around bugs in some JS interpreters.
			function add(x, y){
				var lsw = (x & 0xFFFF) + (y & 0xFFFF);
				var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
				return (msw << 16) | (lsw & 0xFFFF);
			}

			// Bitwise rotate a 32-bit number to the left
			function rol(num, cnt){ return (num << cnt) | (num >>> (32 - cnt)); }
			// These functions implement the basic operation for each round of the algorithm.
			function cmn(q, a, b, x, s, t){ return add(rol(add(add(a, q), add(x, t)), s), b); }
			function ff(a, b, c, d, x, s, t){ return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
			function gg(a, b, c, d, x, s, t){ return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
			function hh(a, b, c, d, x, s, t){ return cmn(b ^ c ^ d, a, b, x, s, t); }
			function ii(a, b, c, d, x, s, t){ return cmn(c ^ (b | (~d)), a, b, x, s, t); }

			// Take a string and return the hex representation of its MD5.
			var x = str2blks_MD5(str);
			var a =	1732584193;
			var b = -271733879;
			var c = -1732584194;
			var d =	271733878;
			var xlen = x.length;
			for(var i=0; i < xlen; i += 16){
				olda = a;
				oldb = b;
				oldc = c;
				oldd = d;

				a = ff(a, b, c, d, x[i], 7 , -680876936);
				d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
				c = ff(c, d, a, b, x[i+ 2], 17,	606105819);
				b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
				a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
				d = ff(d, a, b, c, x[i+ 5], 12,	1200080426);
				c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
				b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
				a = ff(a, b, c, d, x[i+ 8], 7 ,	1770035416);
				d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
				c = ff(c, d, a, b, x[i+10], 17, -42063);
				b = ff(b, c, d, a, x[i+11], 22, -1990404162);
				a = ff(a, b, c, d, x[i+12], 7 ,	1804603682);
				d = ff(d, a, b, c, x[i+13], 12, -40341101);
				c = ff(c, d, a, b, x[i+14], 17, -1502002290);
				b = ff(b, c, d, a, x[i+15], 22,	1236535329);

				a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
				d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
				c = gg(c, d, a, b, x[i+11], 14,	643717713);
				b = gg(b, c, d, a, x[i], 20, -373897302);
				a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
				d = gg(d, a, b, c, x[i+10], 9 ,	38016083);
				c = gg(c, d, a, b, x[i+15], 14, -660478335);
				b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
				a = gg(a, b, c, d, x[i+ 9], 5 ,	568446438);
				d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
				c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
				b = gg(b, c, d, a, x[i+ 8], 20,	1163531501);
				a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
				d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
				c = gg(c, d, a, b, x[i+ 7], 14,	1735328473);
				b = gg(b, c, d, a, x[i+12], 20, -1926607734);

				a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
				d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
				c = hh(c, d, a, b, x[i+11], 16,	1839030562);
				b = hh(b, c, d, a, x[i+14], 23, -35309556);
				a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
				d = hh(d, a, b, c, x[i+ 4], 11,	1272893353);
				c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
				b = hh(b, c, d, a, x[i+10], 23, -1094730640);
				a = hh(a, b, c, d, x[i+13], 4 ,	681279174);
				d = hh(d, a, b, c, x[i], 11, -358537222);
				c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
				b = hh(b, c, d, a, x[i+ 6], 23,	76029189);
				a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
				d = hh(d, a, b, c, x[i+12], 11, -421815835);
				c = hh(c, d, a, b, x[i+15], 16,	530742520);
				b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

				a = ii(a, b, c, d, x[i], 6 , -198630844);
				d = ii(d, a, b, c, x[i+ 7], 10,	1126891415);
				c = ii(c, d, a, b, x[i+14], 15, -1416354905);
				b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
				a = ii(a, b, c, d, x[i+12], 6 ,	1700485571);
				d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
				c = ii(c, d, a, b, x[i+10], 15, -1051523);
				b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
				a = ii(a, b, c, d, x[i+ 8], 6 ,	1873313359);
				d = ii(d, a, b, c, x[i+15], 10, -30611744);
				c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
				b = ii(b, c, d, a, x[i+13], 21,	1309151649);
				a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
				d = ii(d, a, b, c, x[i+11], 10, -1120210379);
				c = ii(c, d, a, b, x[i+ 2], 15,	718787259);
				b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

				a = add(a, olda);
				b = add(b, oldb);
				c = add(c, oldc);
				d = add(d, oldd);
			}

			return (rhex(a) + rhex(b) + rhex(c) + rhex(d));
		},

		/**
		 * Return hash of string
		 * KUtils.hash( str );
		 * @version	1.0
		 * @author	Kevin Lucich
		 * @param	str		string	The string to conver in hash
		 * @return	Number	The hash
		*/
		'hash': function( str ){

			if( !str || str.constructor != String ){
				return 0;
			}

			var hash = 0, i, c,
				len = str.length;
			if( len == 0 ){
				return hash;
			}
			for( i=0; i < len; i++ ){
				c = str.charCodeAt(i);
				hash = ((hash<<5)-hash)+c;
				hash = hash & hash; // Convert to 32bit integer
			}

			return hash;
		},

		/**
		 * Return if a variable is empty (null, 0, empty string, false)
		 * @version	1.0
		 * @param		variable	{mixed}		The variable to check
		 * @return	{Boolean}
		 */
		'empty': function( variable ){

			if( variable == null ){
				return true;
			}

			switch( variable.constructor ){
				case Number:
					return (isNaN(variable)) || (variable === 0);
				case String:
					return (variable.length === 0 || variable==='0');
				case Array:
				case Object:
					return (KUtils.objSize(variable) === 0);
				case Boolean:
					return (variable === false);
				default:
					return false;
			}
		},

		/**
		 * .rgbToHex()
		 * @version	1.0
		 * @author		Kevin Lucich
		 *
		 * @desc
		 * 	$.rgbToHex( r, g, b );
		 * 	Converter a RGB color to HEX
		 *
		 * @param	{string}	r	Code for red color
		 * @param	{string}	g	Code for green color
		 * @param	{string}	b	Code for blue color
		 * @return	{string}	HEX color	(es. #00FF00 )
		 */
		'rgbToHex': function( r, g, b ){
			var componentToHex = function (c){
				var hex = c.toString(16);
				return hex.length == 1 ? "0" + hex : hex;
			};
			return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
		},

		/**
		 * .hexToRgb()
		 * @version	1.1
		 * @author		Kevin Lucich
		 *
		 * @desc
		 * 	$.hexToRgb( hex [, return_string] );
		 * 	Converter a HEX color to RBG
		 *
		 * @param		{string}			hex				The color in hex code
		 * @param		{(Boolean|null)}	return_string	False will return an obj {r,g,b}, if true return a string
		 * @return	{object|string} if return_string param is True: return "r,g,b", otherwise an object
		 */
		'hexToRgb': function( hex, return_string ){

			if( typeof hex === 'undefined' ){
				hex = '#000000';
			}
			if( typeof return_string === 'undefined' ){
				return_string = false;
			}

			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );

			var rgb = result ? {
				'r': parseInt(result[1], 16),
				'g': parseInt(result[2], 16),
				'b': parseInt(result[3], 16)
			} : null;

			if( return_string ){
				return rgb.r +','+ rgb.g +','+ rgb.b;
			}

			return rgb;
		},

		/**
		 * .extend()
		 * @version	1.0
		 * @author		jQuery Foundation
		 */
		'extend': (typeof jQuery !== 'undefined' && jQuery.extend) || function(){

			var isPlainObject = function( obj ){
				// Not plain objects:
				// - Any object or value whose internal [[Class]] property is not "[object Object]"
				// - DOM nodes
				// - window
				if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
					return false;
				}

				if ( obj.constructor && !hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
					return false;
				}

				// If the function hasn't returned already, we're confident that
				// |obj| is a plain object, created by {} or constructed with new Object
				return true;
			};

			var options, name, src, copy, copyIsArray, clone,
				target = arguments[0] || {},
				i = 1,
				length = arguments.length,
				deep = false;

			// Handle a deep copy situation
			if ( typeof target === "boolean" ) {
				deep = target;

				// Skip the boolean and the target
				target = arguments[ i ] || {};
				i++;
			}

			// Handle case when target is a string or something (possible in deep copy)
			if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
				target = {};
			}

			// Extend jQuery itself if only one argument is passed
			if ( i === length ) {
				target = this;
				i--;
			}

			for ( ; i < length; i++ ) {
				// Only deal with non-null/undefined values
				if ( (options = arguments[ i ]) != null ) {
					// Extend the base object
					for ( name in options ) {
						src = target[ name ];
						copy = options[ name ];

						// Prevent never-ending loop
						if ( target === copy ) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = Array.isArray(copy)) ) ) {
							if( copyIsArray ){
								copyIsArray = false;
								clone = src && Array.isArray(src) ? src : [];
							}else{
								clone = src && isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[ name ] = KUtils.extend( deep, clone, copy );

							// Don't bring in undefined values
						} else if ( copy !== undefined ) {
							target[ name ] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		},

		/**
		 * .range()
		 * @param	start	{mixed}
		 * @param	end		{mixed}
		 * @param	step	{number}
		 * @return array
		 */
		'range': function( start, end, step ){
			var range = [];
			var typeofStart = typeof start;
			var typeofEnd = typeof end;
			if (step === 0) {
				throw new TypeError("Step cannot be zero.");
			}
			if (typeofStart == "undefined" || typeofEnd == "undefined") {
				throw new TypeError("Must pass start and end arguments.");
			} else if (typeofStart != typeofEnd) {
				throw new TypeError("Start and end arguments must be of same type.");
			}
			typeof step == "undefined" && (step = 1);
			if (end < start) {
				step = -step;
			}
			if (typeofStart == "number") {
				while (step > 0 ? end >= start : end <= start) {
					range.push(start);
					start += step;
				}
			}else if (typeofStart == "string") {
				if (start.length != 1 || end.length != 1) {
					throw new TypeError("Only strings with one character are supported.");
				}
				start = start.charCodeAt(0);
				end = end.charCodeAt(0);
				while (step > 0 ? end >= start : end <= start) {
					range.push(String.fromCharCode(start));
					start += step;
				}
			}else{
				throw new TypeError("Only string and number types are supported");
			}
			return range;
		},

		/**
		 var test_fns = {
			'ucFirst1': function(){
				var string = 'aaaaaaaaaaa';
				return string.charAt(0).toUpperCase() + string.slice(1);
			},
			'ucFirst2': function(){
				var string = 'aaaaaaaaaaa';
				return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
			},
			'LOL': function(){
				var string = 'aaaaaaaaaaa';
				return string;
			},
		};

		 console.dir( KUtils.benchmark( test_fns) );
		 */
		'benchmark': function( millisecond, howmany, fns ){

			//	function( )	=> error
			if( (typeof millisecond === 'undefined') ){
				console.error('Error: missing fns param');
				return;
			}
			//	function( fns )
			if( millisecond.constructor == Object ){
				fns = millisecond;
				millisecond = 1000; //  one second
				howmany = 1;
			}
			//	function( millisecond, fns )
			if( howmany.constructor == Object ){
				fns = howmany;
				howmany = 1;
			}

			var results = {
				'fns': {},
				'statistics': {
					'faster': {
						'fn': null,
						'loop': Infinity
					},
					'slower': {
						'fn': null,
						'loop': -Infinity
					}
				}
			};

			for( fn_name in fns ){

				var fn = fns[ fn_name ];
				var array_loops = [];

				for(var i=0; i<howmany; i++ ){
					var second = (new Date().getTime()) + millisecond;
					var current_loop = 0;

					while( (new Date().getTime()) < second ){
						current_loop++;
						fn();
					}
					array_loops.push( current_loop );
				}

				//  Average
				number_of_execution = (function(array){
					var avg = 0;
					for( a in array ){
						avg += array[a];
					}
					return (avg/(array.length));
				})(array_loops);

				if( results.statistics.faster.fn == null || results.statistics.faster.number_of_execution < number_of_execution ){
					results.statistics.faster = {
						'fn': fn_name,
						'number_of_execution': number_of_execution
					};
				}
				if( results.statistics.slower.fn == null || results.statistics.slower.number_of_execution > number_of_execution ){
					results.statistics.slower = {
						'fn': fn_name,
						'number_of_execution': number_of_execution
					};
				}

				results['fns'][ fn_name ] = number_of_execution;
			}

			var tmp = (results.statistics.faster.number_of_execution / results.statistics.slower.number_of_execution);
			results.statistics.result = 'The function '+ results.statistics.faster.fn +' is faster than '+ results.statistics.slower.fn +' of '+ ((tmp*100)-100).toFixed(2) +'% ('+ tmp.toFixed(2) +' times)';

			return results;
		},

		'ucFirst': function( string ){
			return (!string) ? "" : string[0].toUpperCase() + string.slice(1);
		},

		'dotdotdot': function( string, how_many_words ){

			if( typeof string === 'undefined' ){
				return '';
			}
			if( typeof how_many_words === 'undefined' ){
				how_many_words = pieces.length/2;
			}

			var pieces = string.split(' ');

			return (pieces.slice(0, how_many_words ).join(' ')) +'...';
		},

		'consoleCheck': function(){

			if( typeof window.console !== 'undefined' ){
				return true;
			}

			var c = {};

			var fns = [
				'log','debug','info','warn','exception','assert','dir','dirxml','trace','group','groupEnd',
				'groupCollapsed','profile','profileEnd','count','clear','time','timeEnd','timeStamp','table','error'
			];
			for( f in fns ){
				c[ fns[f] ] = function(){};
			}
			window.console = c;
		},

		'stack': function( show_anonymous ){
			show_anonymous = (typeof show_anonymous !== 'undefined') ? show_anonymous : false;
			var stack = [];
			var _caller = arguments.callee.caller;
			while( _caller != null ){
				var fn_name = /function ([^(]*)/.exec( _caller+"" );
				fn_name = (fn_name != null && typeof fn_name[1] !== 'undefined') ? fn_name[1] : fn_name;
				if( show_anonymous && fn_name == '' )
					fn_name = 'anonymous';
				if( fn_name != '' )
					stack.push( fn_name );
				_caller = _caller.caller;
			}
			stack.reverse();

			if( stack.length ){
				return stack.join('() -> ') +'()';
			}

			return null;
		},

		'arrayDiff': function( a, b ){

			var tmp=[], diff=[], i= 0, len=0;

			len = a.length;
			for( i=0; i<len; i++ ){
				tmp[a[i]] = true;
			}

			len = b.length;
			for( i=0; i<len; i++ ){
				if( tmp[b[i]] ){
					delete tmp[b[i]];
				}else{
					tmp[b[i]] = true;
				}
			}

			for( var k in tmp ){
				diff.push(k);
			}

			return diff;
		},

		'str_replace': function( string, search, to_replace ){
			var len = search.length,
				i=0;

			if( (search.constructor === Array) && (to_replace.constructor === Array) ){
				for(i=0; i<len; i++ ){
					string = string.replace( search[i], to_replace[i] );
				}
			}else if( search.constructor === Array ){
				for(i=0; i<len; i++ ){
					string = string.replace( search[i], to_replace );
				}
			}else{
				string = string.replace( search, to_replace );
			}

			return string;
		}

	};

////////////////////
	var PrototypeDateUtils = {

		'format': function( format ){

			if( typeof format === 'undefined' ){
				format = 'Y-m-d';
			}

			var date = this;
			var formated = '';

			var length = format.length;
			for(var i=0; i<length; i++ ){
				switch( format[i] ){

					case '\\':
						i++;	//	Jump the next char! :)
						break;
////////////////			Days

					//	Day of the month without leading zeros
					case 'j':
						formated += getDate();
						break;

					//	Day of the month, 2 digits with leading zeros
					case 'd':
						var day = parseInt( date.getDate() );
						formated += ((day < 10) ? '0'+day : day);
						break;

//				case 'D':
//					formated += '';
//					break;

					//	 ISO-8601 numeric representation of the day of the week = 1 (for Monday) through 7 (for Sunday)
					case 'N':
						formated += date.getDay();
						break;


////////////////			Months

					//	Numeric representation of a month, without leading zeros
					case 'n':
						formated += parseInt( date.getMonth() )+1;
						break;

					//	Numeric representation of a month, with leading zeros
					case 'm':
						var month = parseInt( date.getMonth() )+1;
						formated += ((month < 10) ? '0'+month : month);
						break;

					//	Number of days in the given month
					case 't':
						var num_days = {
							'1': 31,
							'2': 28,
							'3': 31,
							'4': 30,
							'5': 31,
							'6': 30,
							'7': 31,
							'8': 31,
							'9': 30,
							'10': 31,
							'11': 30,
							'12': 31
						};
						var month = parseInt( date.getMonth() )+1;
						formated += num_days[ month ];
						break;


////////////////			Years

					case 'Y':
						formated += date.getFullYear();
						break;

					case 'y':
						var year = ''+ ((new Date()).getFullYear());
						var y_length = year.length;
						formated += year.substring( y_length-2, y_length);
						break;


////////////////			Time

					//	12-hour format of an hour without leading zeros 	1 through 12
					case 'g':
						var hours = date.getHours();
						formated += (hours>12) ? hours-12 : hours;
						break;

					//	24-hour format of an hour without leading zeros 	0 through 23
					case 'G':
						formated += date.getHours();
						break;

					//	12-hour format of an hour with leading zeros 	01 through 12
					case 'h':
						var hours = date.getHours();
						hours = (hours>12) ? (hours-12) : hours;
						formated += ((hours < 10) ? '0'+hours : hours);
						break;

					//	24-hour format of an hour with leading zeros 	00 through 23
					case 'H':
						var hours = date.getHours();
						formated += ((hours < 10) ? '0'+hours : hours);
						break;

					//	Minutes with leading zeros 	00 to 59
					case 'i':
						var minutes = date.getMinutes();
						formated += ((minutes < 10) ? '0'+minutes : minutes);
						break;

					//	Seconds, with leading zeros 	00 through 59
					case 's':
						var seconds = date.getSeconds();
						formated += ((seconds < 10) ? '0'+seconds : seconds);
						break;

					case 'c':
						var cents = parseInt(date.getMilliseconds()/10);
						formated += ((cents < 10) ? '0'+cents : cents);
						break;

					case 'u':
						var milli = date.getMilliseconds();
						formated += ((milli < 10) ? '0'+milli : milli);
						break;
////////////////			Another char

					default:
						formated += format[i];
						break;
				}
			}

			return formated;
		},

		'getMillisecondsByIdentifier': function( identifier ){

			switch( identifier ){

				case 'd':
					return 86400000;
					break;

				case 'm':	//	Month (30 days)
					return 2592000000;
					break;

				case 'y':	//	Year
					return 31536000000;
					break;

				case 'h':	//	Hour
					return 3600000;
					break;

				case 'i':	//	Minutes
					return 60000;
					break;

				case 's':	//	Seconds
					return 1000;
					break;

				case 'w':	//	Week
					return 604800000;
					break;

////////////////		Another char

				default:
					console.warn('Identifier "'+ identifier +'" undefined! :( ');
					return 0;
					break;
			}
		},

		'getDateAfterModify': function( operator, modifier ){

			var self = this;
			var milliseconds = 0;
			var modifiers = modifier.split(' ');

			for( m in modifiers ){
				var mod = modifiers[m];

				//	pieces[1] => number of
				//	pieces[2] => identifier
				var pieces = mod.match(/(\d+)([a-zA-Z])/);		//	mod.match(/([+-])(\d+)([a-zA-Z])/);		//	'1d'	'2w'
				var number = pieces[1];
				var identifier = pieces[2];

				milliseconds += PrototypeDateUtils.getMillisecondsByIdentifier(identifier) * number;
			}

			//	Operator determ if i add or sub the value :)
			var new_date = self.getTime() + (milliseconds*operator);
			return (new Date(new_date));
		},

		'add': function( modifier ){
			return (PrototypeDateUtils.getDateAfterModify).apply(this, [1, modifier] );
		},

		'sub': function( modifier ){
			return (PrototypeDateUtils.getDateAfterModify).apply(this, [-1, modifier] );
		}

	};

	Date.prototype.format = PrototypeDateUtils.format;
	Date.prototype.getFormat = function(){
		console_action('DEPRECATED','Date.prototype.getFormat');
		return (Date.prototype.format).apply( this, arguments );
	};
	Date.prototype.add = PrototypeDateUtils.add;
	Date.prototype.sub = PrototypeDateUtils.sub;

	Object.keys = Object.keys || function( obj ){
		var keys = [];
		for( k in obj ){
			if( obj.hasOwnProperty(k) ){
				keys.push( k );
			}
		}
		return keys;
	};

	var console_action = function( type, nameFunction, nameParam ){

		if( typeof console === 'undefined' || typeof console.info === 'undefined' || typeof console.warn === 'undefined' ){
			return;
		}

		var infos = {},
			text = '';

		switch(type){
///////////////////////////////////////////////////////////////
			//	Param Ignored
			case 'PRM_IGN':
				infos['state'] = 'Ignored';
				infos['why'] = 'Invalid value';
				infos['description'] = [
					"Will be use the default value"
				];
				break;
///////////////////////////////////////////////////////////////
			//	Param Ignored
			case 'IDENT_NOT_DEF':
				infos['state'] = 'Ignored';
				infos['why'] = 'Invalid value';
				infos['description'] = [
					"Identifier undefined :( "
				];
				break;
			//	Deprecated
			case 'DEPRECATED':
				infos['state'] = 'Deprecated Function';
				infos['why'] = '';
				infos['description'] = [
					"This function is deprected, it will be removed in the future. View the documention for more info."
				];
				break;
///////////////////////////////////////////////////////////////
		}	// End switch

		text = [
			"Function: "+ nameFunction,
			( (typeof nameParam !== 'undefined') ? "Param: "+ nameParam : null ),
			"State: "+ infos['state'],
			"Why: "+ infos['why'],
			(infos['description']).join("\n\t"),
			"Stack:\t"+ KUtils.stack(),
			"\n"
		].filter(function(el){
			//	Filter the null value
			if( typeof el !== 'undefined' && !KUtils.empty(el) ){
				return el;
			}
		}).join("\n\t");	// Join :)

		switch( type ){
			case 'PRM_IGN':
			case 'IDENT_NOT_DEF':
				console.warn( 'KUtils - WARNING'+ text );
				break;
		}	// End switch

	};


	///////////////
	// Check if exist another functions
	if( typeof jQuery !== 'undefined' ){
		KUtils.version({'jQuery': jQuery.fn.jquery });
		if( typeof jQuery.ui !== 'undefined' ){
			KUtils.version({'jQuery.ui': jQuery.ui.version });
		}
	}
	/////////////////

	//	Assign KUtils to window object for global visibility
	window.KUtils = KUtils;

})( window );
