try {
	delete window.xRTML
} catch (e) {
	window.xRTML = undefined
}
(function (xRTML, undefined) {
	(function (Event, undefined) {
		var Manager = {
			bind : function (element, events) {
				if (element.bind) {
					element.bind(events)
				} else {
					for (var type in events) {
						if (element.addEventListener) {
							element.addEventListener(type, events[type], false)
						} else {
							element.attachEvent ? element.attachEvent("on" + type, events[type]) : element[type] = events[type]
						}
					}
				}
			},
			unbind : function (element, events) {
				if (element.unbind) {
					element.unbind(events)
				} else {
					for (var type in events) {
						if (element.removeEventListener) {
							element.removeEventListener(type, events[type], false)
						} else {
							if (element.detachEvent) {
								element.detachEvent("on" + type, events[type])
							} else {
								if (element[type]) {
									delete element[type]
								}
							}
						}
					}
				}
			}
		},
		Provider = {
			bind : function (events) {
				for (var type in events) {
					if (typeof events[type] === "function") {
						if (!this.listeners[type]) {
							this.listeners[type] = []
						}
						this.listeners[type].push(events[type])
					}
				}
			},
			unbind : function (events) {
				for (var type in events) {
					if (this.listeners[type]instanceof Array) {
						var listeners = this.listeners[type];
						for (var i = 0, len = listeners.length; i < len; i++) {
							if (listeners[i] === events[type]) {
								listeners.splice(i, 1);
								break
							}
						}
					}
				}
			},
			fire : function (events) {
				var event;
				for (var type in events) {
					event = {
						type : type,
						target : this
					};
					for (var key in events[type]) {
						var obj = events[type][key];
						event[key] = obj
					}
					if (this.listeners[event.type]instanceof Array) {
						var listeners = new Array();
						for (var i = 0; i < this.listeners[event.type].length; i++) {
							listeners.push(this.listeners[event.type][i])
						}
						for (var i = 0; i < listeners.length; i++) {
							listeners[i].call(this, event)
						}
					}
				}
			}
		};
		Event.bind = Manager.bind;
		Event.unbind = Manager.unbind;
		Event.extend = function (target) {
			if (!target.listeners) {
				target.listeners = {}
				
			}
			for (var func in Provider) {
				target[func] = Provider[func]
			}
		}
	})(xRTML.Event = xRTML.Event || {})
})(window.xRTML = window.xRTML || {});
(function (window) {
	(function (xRTML, undefined) {
		xRTML.Event.extend(xRTML);
		xRTML.version = "3.0.1";
		xRTML.lastestBuild = "11-12-2012 16:42:30";
		xRTML.domLoaded = function () {
			return (document.readyState == "loaded" || document.readyState == "complete")
		};
		xRTML.isReady = false;
		xRTML.isLoaded = false;
		xRTML.ready = function (fn) {
			!xRTML.isReady ? xRTML.bind({
				ready : fn
			}) : fn()
		};
		xRTML.load = function (fn) {
			!xRTML.isLoaded ? xRTML.bind({
				load : fn
			}) : fn()
		}
	})(window.xRTML = window.xRTML || {})
})(window);
(function (window, undefined) {
	(function (xRTML, undefined) {
		var tokenize,
		cachedruns,
		dirruns,
		sortOrder,
		siblingCheck,
		document = window.document,
		docElem = document.documentElement,
		expando = ("sizcache" + Math.random()).replace(".", ""),
		done = 0,
		slice = [].slice,
		push = [].push,
		strundefined = "undefined",
		hasDuplicate = false,
		baseHasDuplicate = true,
		characterEncoding = "(?:[-\\w]|[^\\x00-\\xa0]|\\\\.)",
		whitespace = "[\\x20\\t\\n\\r\\f]",
		operators = "([*^$|!~]?={1})",
		identifier = "(?:-?[#_a-zA-Z]{1}[-\\w]*|[^\\x00-\\xa0]+|\\\\.+)",
		attributes = "\\[" + whitespace + "*(" + characterEncoding + "+)" + whitespace + "*(?:" + operators + whitespace + "*(?:(['\"])(.*?)\\3|(" + identifier + "+)|)|)" + whitespace + "*\\]",
		pseudos = ":(" + characterEncoding + "+)(?:\\(([\"']?)([^()]*|.*)\\2\\))?",
		pos = ":(nth|eq|gt|lt|first|last|even|odd)(?:\\((\\d*)\\))?(?=[^\\-]|$)",
		combinators = whitespace + "*([\\x20\\t\\n\\r\\f>+~])" + whitespace + "*",
		rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
		rcombinators = new RegExp("^" + combinators),
		rtokens = new RegExp("(" + attributes.replace("3", "4") + "|" + pseudos.replace("2", "8") + "|\\\\[>+~]|[^\\x20\\t\\n\\r\\f>+~]|\\\\.)+|" + combinators, "g"),
		rstartWithWhitespace = new RegExp("^" + whitespace),
		rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,
		rsibling = /^[\x20\t\n\r\f]*[+~][\x20\t\n\r\f]*$/,
		rendsWithNot = /:not\($/,
		rnth = /(-?)(\d*)(?:n([+\-]?\d*))?/,
		rnonDigit = /\D/,
		rheader = /h\d/i,
		rinputs = /input|select|textarea|button/i,
		radjacent = /^\+|[\x20\t\n\r\f]*/g,
		rbackslash = /\\(?!\\)/g,
		rgroups = /([^,\\\[\]]+|\[[^\[]*\]|\([^\(]*\)|\\.)+/g,
		matchExpr = {
			ID : new RegExp("^#(" + characterEncoding + "+)"),
			CLASS : new RegExp("^\\.(" + characterEncoding + "+)"),
			NAME : new RegExp("^\\[name=['\"]?(" + characterEncoding + "+)['\"]?\\]"),
			TAG : new RegExp("^(" + characterEncoding.replace("[-", "[-\\*") + "+)"),
			ATTR : new RegExp("^" + attributes),
			PSEUDO : new RegExp("^" + pseudos),
			CHILD : new RegExp("^:(only|nth|last|first)-child(?:\\(" + whitespace + "*(even|odd|(?:[+\\-]?\\d+|(?:[+\\-]?\\d*)?n" + whitespace + "*(?:[+\\-]" + whitespace + "*\\d+)?))" + whitespace + "*\\))?", "i"),
			POS : new RegExp(pos, "ig"),
			globalPOS : new RegExp(pos, "i")
		},
		classCache = {},
		cachedClasses = [],
		compilerCache = {},
		cachedSelectors = [],
		markFunction = function (fn) {
			fn.sizzleFilter = true;
			return fn
		},
		createInputFunction = function (type) {
			return function (elem) {
				return elem.nodeName.toLowerCase() === "input" && elem.type === type
			}
		},
		createButtonFunction = function (type) {
			return function (elem) {
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && elem.type === type
			}
		},
		assert = function (fn) {
			var pass = false,
			div = document.createElement("div");
			try {
				pass = fn(div)
			} catch (e) {}
			
			div = null;
			return pass
		},
		assertAttributes = assert(function (div) {
				div.innerHTML = "<select></select>";
				var type = typeof div.lastChild.getAttribute("multiple");
				return type !== "boolean" && type !== "string"
			}),
		assertGetIdNotName,
		assertUsableName = assert(function (div) {
				div.id = expando + 0;
				div.innerHTML = "<a name='" + expando + "'/><div name='" + expando + "'/>";
				docElem.insertBefore(div, docElem.firstChild);
				var pass = document.getElementsByName && document.getElementsByName(expando).length === 2 + document.getElementsByName(expando + 0).length;
				assertGetIdNotName = !document.getElementById(expando);
				docElem.removeChild(div);
				return pass
			}),
		assertTagNameNoComments = assert(function (div) {
				div.appendChild(document.createComment(""));
				return div.getElementsByTagName("*").length === 0
			}),
		assertHrefNotNormalized = assert(function (div) {
				div.innerHTML = "<a href='#'></a>";
				return div.firstChild && typeof div.firstChild.getAttribute !== strundefined && div.firstChild.getAttribute("href") === "#"
			}),
		assertUsableClassName = assert(function (div) {
				div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
				if (!div.getElementsByClassName || div.getElementsByClassName("e").length === 0) {
					return false
				}
				div.lastChild.className = "e";
				return div.getElementsByClassName("e").length !== 1
			});
		var Sizzle = function (selector, context, results, seed) {
			results = results || [];
			context = context || document;
			var match,
			elem,
			xml,
			m,
			nodeType = context.nodeType;
			if (nodeType !== 1 && nodeType !== 9) {
				return []
			}
			if (!selector || typeof selector !== "string") {
				return results
			}
			xml = isXML(context);
			if (!xml && !seed) {
				if ((match = rquickExpr.exec(selector))) {
					if ((m = match[1])) {
						if (nodeType === 9) {
							elem = context.getElementById(m);
							if (elem && elem.parentNode) {
								if (elem.id === m) {
									results.push(elem);
									return results
								}
							} else {
								return results
							}
						} else {
							if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) {
								results.push(elem);
								return results
							}
						}
					} else {
						if (match[2]) {
							push.apply(results, slice.call(context.getElementsByTagName(selector), 0));
							return results
						} else {
							if ((m = match[3]) && assertUsableClassName && context.getElementsByClassName) {
								push.apply(results, slice.call(context.getElementsByClassName(m), 0));
								return results
							}
						}
					}
				}
			}
			return select(selector, context, results, seed, xml)
		};
		var Expr = Sizzle.selectors = {
			cacheLength : 50,
			match : matchExpr,
			order : ["ID", "TAG"],
			attrHandle : {},
			createPseudo : markFunction,
			find : {
				ID : assertGetIdNotName ? function (id, context, xml) {
					if (typeof context.getElementById !== strundefined && !xml) {
						var m = context.getElementById(id);
						return m && m.parentNode ? [m] : []
					}
				}
				 : function (id, context, xml) {
					if (typeof context.getElementById !== strundefined && !xml) {
						var m = context.getElementById(id);
						return m ? m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ? [m] : undefined : []
					}
				},
				TAG : assertTagNameNoComments ? function (tag, context) {
					if (typeof context.getElementsByTagName !== strundefined) {
						return context.getElementsByTagName(tag)
					}
				}
				 : function (tag, context) {
					var results = context.getElementsByTagName(tag);
					if (tag === "*") {
						var elem,
						tmp = [],
						i = 0;
						for (; (elem = results[i]); i++) {
							if (elem.nodeType === 1) {
								tmp.push(elem)
							}
						}
						results = tmp
					}
					return results
				}
			},
			relative : {
				">" : {
					dir : "parentNode",
					firstMatch : true
				},
				" " : {
					dir : "parentNode"
				},
				"+" : {
					dir : "previousSibling",
					firstMatch : true
				},
				"~" : {
					dir : "previousSibling"
				}
			},
			preFilter : {
				ATTR : function (match) {
					match[1] = match[1].replace(rbackslash, "");
					match[3] = (match[4] || match[5] || "").replace(rbackslash, "");
					if (match[2] === "~=") {
						match[3] = " " + match[3] + " "
					}
					return match.slice(0, 4)
				},
				CHILD : function (match) {
					match[1] = match[1].toLowerCase();
					if (match[1] === "nth") {
						if (!match[2]) {
							Sizzle.error(match[0])
						}
						match[2] = match[2].replace(radjacent, "");
						var test = rnth.exec(match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" || !rnonDigit.test(match[2]) && "0n+" + match[2] || match[2]);
						match[2] =  + (test[1] + (test[2] || 1));
						match[3] = +test[3]
					} else {
						if (match[2]) {
							Sizzle.error(match[0])
						}
					}
					return match
				},
				PSEUDO : function (match) {
					return matchExpr.CHILD.test(match[0]) ? null : match
				}
			},
			filter : {
				ID : assertGetIdNotName ? function (id) {
					id = id.replace(rbackslash, "");
					return function (elem) {
						return elem.getAttribute("id") === id
					}
				}
				 : function (id) {
					id = id.replace(rbackslash, "");
					return function (elem) {
						var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
						return node && node.value === id
					}
				},
				TAG : function (nodeName) {
					if (nodeName === "*") {
						return function () {
							return true
						}
					}
					nodeName = nodeName.replace(rbackslash, "").toLowerCase();
					return function (elem) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName
					}
				},
				CLASS : function (className) {
					var pattern = classCache[className];
					if (!pattern) {
						pattern = classCache[className] = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)");
						cachedClasses.push(className);
						if (cachedClasses.length > Expr.cacheLength) {
							delete classCache[cachedClasses.shift()]
						}
					}
					return function (elem) {
						return pattern.test(elem.className || elem.getAttribute("class") || "")
					}
				},
				ATTR : function (name, operator, check) {
					if (!operator) {
						return function (elem) {
							return Sizzle.attr(elem, name) != null
						}
					}
					return function (elem) {
						var result = Sizzle.attr(elem, name),
						value = result + "";
						if (result == null) {
							return operator === "!="
						}
						switch (operator) {
						case "=":
							return value === check;
						case "!=":
							return value !== check;
						case "^=":
							return check && value.indexOf(check) === 0;
						case "*=":
							return check && value.indexOf(check) > -1;
						case "$=":
							return check && value.substr(value.length - check.length) === check;
						case "~=":
							return (" " + value + " ").indexOf(check) > -1;
						case "|=":
							return value === check || value.substr(0, check.length + 1) === check + "-"
						}
					}
				},
				CHILD : function (type, first, last) {
					if (type === "nth") {
						var doneName = done++;
						return function (elem) {
							var parent,
							diff,
							count = 0,
							node = elem;
							if (first === 1 && last === 0) {
								return true
							}
							parent = elem.parentNode;
							if (parent && (parent[expando] !== doneName || !elem.sizset)) {
								for (node = parent.firstChild; node; node = node.nextSibling) {
									if (node.nodeType === 1) {
										node.sizset = ++count;
										if (node === elem) {
											break
										}
									}
								}
								parent[expando] = doneName
							}
							diff = elem.sizset - last;
							if (first === 0) {
								return diff === 0
							} else {
								return (diff % first === 0 && diff / first >= 0)
							}
						}
					}
					return function (elem) {
						var node = elem;
						switch (type) {
						case "only":
						case "first":
							while ((node = node.previousSibling)) {
								if (node.nodeType === 1) {
									return false
								}
							}
							if (type === "first") {
								return true
							}
							node = elem;
						case "last":
							while ((node = node.nextSibling)) {
								if (node.nodeType === 1) {
									return false
								}
							}
							return true
						}
					}
				},
				PSEUDO : function (pseudo, possibleQuote, argument, context, xml) {
					var fn = Expr.pseudos[pseudo] || Expr.pseudos[pseudo.toLowerCase()];
					if (!fn) {
						Sizzle.error("unsupported pseudo: " + pseudo)
					}
					if (!fn.sizzleFilter) {
						return fn
					}
					return fn(argument, context, xml)
				}
			},
			pseudos : {
				not : markFunction(function (selector, context, xml) {
					var matcher = compile(selector, context, xml);
					return function (elem) {
						return !matcher(elem)
					}
				}),
				enabled : function (elem) {
					return elem.disabled === false
				},
				disabled : function (elem) {
					return elem.disabled === true
				},
				checked : function (elem) {
					var nodeName = elem.nodeName.toLowerCase();
					return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected)
				},
				selected : function (elem) {
					if (elem.parentNode) {
						elem.parentNode.selectedIndex
					}
					return elem.selected === true
				},
				parent : function (elem) {
					return !!elem.firstChild
				},
				empty : function (elem) {
					return !elem.firstChild
				},
				contains : markFunction(function (text) {
					return function (elem) {
						return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1
					}
				}),
				has : markFunction(function (selector) {
					return function (elem) {
						return !!Sizzle(selector, elem).length
					}
				}),
				header : function (elem) {
					return rheader.test(elem.nodeName)
				},
				text : function (elem) {
					var attr = elem.getAttribute("type"),
					type = elem.type;
					return elem.nodeName.toLowerCase() === "input" && "text" === type && (attr === null || attr.toLowerCase() === type)
				},
				radio : createInputFunction("radio"),
				checkbox : createInputFunction("checkbox"),
				file : createInputFunction("file"),
				password : createInputFunction("password"),
				image : createInputFunction("image"),
				submit : createButtonFunction("submit"),
				reset : createButtonFunction("reset"),
				button : function (elem) {
					var name = elem.nodeName.toLowerCase();
					return name === "input" && "button" === elem.type || name === "button"
				},
				input : function (elem) {
					return rinputs.test(elem.nodeName)
				},
				focus : function (elem) {
					var doc = elem.ownerDocument;
					return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href)
				},
				active : function (elem) {
					return elem === elem.ownerDocument.activeElement
				}
			},
			setFilters : {
				first : function (elements, argument, not) {
					return not ? elements.slice(1) : [elements[0]]
				},
				last : function (elements, argument, not) {
					var elem = elements.pop();
					return not ? elements : [elem]
				},
				even : function (elements, argument, not) {
					var results = [],
					i = not ? 1 : 0,
					len = elements.length;
					for (; i < len; i = i + 2) {
						results.push(elements[i])
					}
					return results
				},
				odd : function (elements, argument, not) {
					var results = [],
					i = not ? 0 : 1,
					len = elements.length;
					for (; i < len; i = i + 2) {
						results.push(elements[i])
					}
					return results
				},
				lt : function (elements, argument, not) {
					return not ? elements.slice(+argument) : elements.slice(0, +argument)
				},
				gt : function (elements, argument, not) {
					return not ? elements.slice(0, +argument + 1) : elements.slice(+argument + 1)
				},
				eq : function (elements, argument, not) {
					var elem = elements.splice(+argument, 1);
					return not ? elements : elem
				}
			}
		};
		Expr.setFilters.nth = Expr.setFilters.eq;
		Expr.filters = Expr.pseudos;
		if (!assertHrefNotNormalized) {
			Expr.attrHandle = {
				href : function (elem) {
					return elem.getAttribute("href", 2)
				},
				type : function (elem) {
					return elem.getAttribute("type")
				}
			}
		}
		if (assertUsableName) {
			Expr.order.push("NAME");
			Expr.find.NAME = function (name, context) {
				if (typeof context.getElementsByName !== strundefined) {
					return context.getElementsByName(name)
				}
			}
		}
		if (assertUsableClassName) {
			Expr.order.splice(1, 0, "CLASS");
			Expr.find.CLASS = function (className, context, xml) {
				if (typeof context.getElementsByClassName !== strundefined && !xml) {
					return context.getElementsByClassName(className)
				}
			}
		}
		try {
			slice.call(docElem.childNodes, 0)[0].nodeType
		} catch (e) {
			slice = function (i) {
				var elem,
				results = [];
				for (; (elem = this[i]); i++) {
					results.push(elem)
				}
				return results
			}
		}
		var isXML = Sizzle.isXML = function (elem) {
			var documentElement = elem && (elem.ownerDocument || elem).documentElement;
			return documentElement ? documentElement.nodeName !== "HTML" : false
		};
		var contains = Sizzle.contains = docElem.compareDocumentPosition ? function (a, b) {
			return !!(a.compareDocumentPosition(b) & 16)
		}
		 : docElem.contains ? function (a, b) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
			bup = b.parentNode;
			return a === bup || !!(bup && bup.nodeType === 1 && adown.contains && adown.contains(bup))
		}
		 : function (a, b) {
			while ((b = b.parentNode)) {
				if (b === a) {
					return true
				}
			}
			return false
		};
		var getText = Sizzle.getText = function (elem) {
			var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;
			if (nodeType) {
				if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
					if (typeof elem.textContent === "string") {
						return elem.textContent
					} else {
						for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
							ret += getText(elem)
						}
					}
				} else {
					if (nodeType === 3 || nodeType === 4) {
						return elem.nodeValue
					}
				}
			} else {
				for (; (node = elem[i]); i++) {
					ret += getText(node)
				}
			}
			return ret
		};
		Sizzle.attr = function (elem, name) {
			var xml = isXML(elem);
			if (!xml) {
				name = name.toLowerCase()
			}
			if (Expr.attrHandle[name]) {
				return Expr.attrHandle[name](elem)
			}
			if (assertAttributes || xml) {
				return elem.getAttribute(name)
			}
			var attr = (elem.attributes || {})[name];
			return attr ? typeof elem[name] === "boolean" ? elem[name] ? name : null : attr.specified ? attr.value : null : null
		};
		Sizzle.error = function (msg) {
			throw new Error("Syntax error, unrecognized expression: " + msg)
		};
		[0, 0].sort(function () {
			return (baseHasDuplicate = 0)
		});
		if (docElem.compareDocumentPosition) {
			sortOrder = function (a, b) {
				if (a === b) {
					hasDuplicate = true;
					return 0
				}
				return (!a.compareDocumentPosition || !b.compareDocumentPosition ? a.compareDocumentPosition : a.compareDocumentPosition(b) & 4) ? -1 : 1
			}
		} else {
			sortOrder = function (a, b) {
				if (a === b) {
					hasDuplicate = true;
					return 0
				} else {
					if (a.sourceIndex && b.sourceIndex) {
						return a.sourceIndex - b.sourceIndex
					}
				}
				var al,
				bl,
				ap = [],
				bp = [],
				aup = a.parentNode,
				bup = b.parentNode,
				cur = aup;
				if (aup === bup) {
					return siblingCheck(a, b)
				} else {
					if (!aup) {
						return -1
					} else {
						if (!bup) {
							return 1
						}
					}
				}
				while (cur) {
					ap.unshift(cur);
					cur = cur.parentNode
				}
				cur = bup;
				while (cur) {
					bp.unshift(cur);
					cur = cur.parentNode
				}
				al = ap.length;
				bl = bp.length;
				for (var i = 0; i < al && i < bl; i++) {
					if (ap[i] !== bp[i]) {
						return siblingCheck(ap[i], bp[i])
					}
				}
				return i === al ? siblingCheck(a, bp[i], -1) : siblingCheck(ap[i], b, 1)
			};
			siblingCheck = function (a, b, ret) {
				if (a === b) {
					return ret
				}
				var cur = a.nextSibling;
				while (cur) {
					if (cur === b) {
						return -1
					}
					cur = cur.nextSibling
				}
				return 1
			}
		}
		Sizzle.uniqueSort = function (results) {
			var elem,
			i = 1;
			if (sortOrder) {
				hasDuplicate = baseHasDuplicate;
				results.sort(sortOrder);
				if (hasDuplicate) {
					for (; (elem = results[i]); i++) {
						if (elem === results[i - 1]) {
							results.splice(i--, 1)
						}
					}
				}
			}
			return results
		};
		function multipleContexts(selector, contexts, results, seed) {
			for (var i = 0, len = contexts.length; i < len; i++) {
				Sizzle(selector, contexts[i], results, seed)
			}
		}
		function handlePOSGroup(selector, posfilter, argument, contexts, seed, not) {
			var results = [],
			fn = Expr.setFilters[posfilter.toLowerCase()];
			if (!fn) {
				Sizzle.error(posfilter)
			}
			if (selector) {
				multipleContexts(selector, contexts, results, seed)
			} else {
				results = seed
			}
			return results.length ? fn(results, argument, not) : []
		}
		function handlePOS(selector, context, results, seed) {
			var match,
			not,
			anchor,
			ret,
			elements,
			currentContexts,
			part,
			lastIndex,
			groups = selector.match(rgroups),
			i = 0,
			len = groups.length,
			rpos = matchExpr.POS,
			rposgroups = new RegExp("^" + matchExpr.POS.source + "(?!" + whitespace + ")", "i"),
			setUndefined = function () {
				for (var i = 1, len = arguments.length - 2; i < len; i++) {
					if (arguments[i] === undefined) {
						match[i] = undefined
					}
				}
			};
			for (; i < len; i++) {
				rpos.exec("");
				selector = groups[i].replace(rstartWithWhitespace, "");
				ret = [];
				anchor = 0;
				elements = seed || null;
				while ((match = rpos.exec(selector))) {
					lastIndex = match.index + match[0].length;
					if (lastIndex > anchor) {
						part = selector.slice(anchor, match.index);
						if (match.length > 1) {
							match[0].replace(rposgroups, setUndefined)
						}
						anchor = lastIndex;
						currentContexts = [context];
						if ((not = rendsWithNot.test(part))) {
							part = part.replace(rendsWithNot, "").replace(rcombinators, "$&*")
						}
						if (rcombinators.test(part)) {
							currentContexts = elements || [context];
							elements = seed
						}
						elements = handlePOSGroup(part, match[1], match[2], currentContexts, elements, not)
					}
					if (rpos.lastIndex === match.index) {
						rpos.lastIndex++
					}
				}
				if (elements) {
					ret = ret.concat(elements);
					if ((part = selector.slice(anchor)) && part !== ")") {
						multipleContexts(part, ret, results, seed)
					} else {
						push.apply(results, ret)
					}
				} else {
					Sizzle(selector, context, results, seed)
				}
			}
			return len === 1 ? results : Sizzle.uniqueSort(results)
		}
		(function () {
			var soFar,
			match,
			tokens,
			advance = function (pattern, type, xml) {
				if ((match = pattern.exec(soFar)) && (!type || !Expr.preFilter[type] || (match = Expr.preFilter[type](match, xml)))) {
					soFar = soFar.slice(match[0].length)
				}
				return match
			};
			tokenize = function (selector, context, xml) {
				soFar = selector;
				tokens = [];
				var type,
				matched,
				checkContext = !xml && context !== document,
				groups = [tokens];
				if (checkContext) {
					soFar = " " + soFar
				}
				while (soFar) {
					matched = false;
					if (advance(rcomma)) {
						groups.push(tokens = []);
						if (checkContext) {
							soFar = " " + soFar
						}
					}
					if (advance(rcombinators)) {
						tokens.push({
							part : match.pop(),
							captures : match
						});
						matched = true
					}
					for (type in Expr.filter) {
						if (advance(matchExpr[type], type, xml)) {
							match.shift();
							tokens.push({
								part : type,
								captures : match
							});
							matched = true
						}
					}
					if (!matched) {
						Sizzle.error(selector)
					}
				}
				return groups
			}
		})();
		function addCombinator(matcher, combinator, context) {
			var dir = combinator.dir,
			firstMatch = combinator.firstMatch,
			doneName = done++;
			if (!matcher) {
				matcher = function (elem) {
					return elem === context
				}
			}
			return firstMatch ? function (elem, context) {
				while ((elem = elem[dir])) {
					if (elem.nodeType === 1) {
						return matcher(elem, context) ? elem : false
					}
				}
			}
			 : function (elem, context) {
				var cache,
				dirkey = doneName + "." + dirruns,
				cachedkey = dirkey + "." + cachedruns;
				while ((elem = elem[dir])) {
					if (elem.nodeType === 1) {
						if ((cache = elem[expando]) === cachedkey) {
							return false
						} else {
							if (typeof cache === "string" && cache.indexOf(dirkey) === 0) {
								if (elem.sizset) {
									return elem
								}
							} else {
								elem[expando] = cachedkey;
								if (matcher(elem, context)) {
									elem.sizset = true;
									return elem
								}
								elem.sizset = false
							}
						}
					}
				}
			}
		}
		function addMatcher(higher, deeper) {
			return higher ? function (elem, context) {
				var result = deeper(elem, context);
				return result && higher(result === true ? elem : result, context)
			}
			 : deeper
		}
		function matcherFromTokens(tokens, context, xml) {
			var token,
			matcher,
			i = 0;
			for (; (token = tokens[i]); i++) {
				if (Expr.relative[token.part]) {
					matcher = addCombinator(matcher, Expr.relative[token.part], context)
				} else {
					token.captures.push(context, xml);
					matcher = addMatcher(matcher, Expr.filter[token.part].apply(null, token.captures))
				}
			}
			return matcher
		}
		function matcherFromGroupMatchers(matchers) {
			return function (elem, context) {
				var matcher,
				j = 0;
				for (; (matcher = matchers[j]); j++) {
					if (matcher(elem, context)) {
						return true
					}
				}
				return false
			}
		}
		var compile = Sizzle.compile = function (selector, context, xml) {
			var tokens,
			group,
			i,
			cached = compilerCache[selector];
			if (cached && cached.context === context) {
				cached.dirruns++;
				return cached
			}
			group = tokenize(selector, context, xml);
			for (i = 0; (tokens = group[i]); i++) {
				group[i] = matcherFromTokens(tokens, context, xml)
			}
			cached = compilerCache[selector] = matcherFromGroupMatchers(group);
			cached.context = context;
			cached.runs = cached.dirruns = 0;
			cachedSelectors.push(selector);
			if (cachedSelectors.length > Expr.cacheLength) {
				delete compilerCache[cachedSelectors.shift()]
			}
			return cached
		};
		Sizzle.matches = function (expr, elements) {
			return Sizzle(expr, null, null, elements)
		};
		Sizzle.matchesSelector = function (elem, expr) {
			return Sizzle(expr, null, null, [elem]).length > 0
		};
		var select = function (selector, context, results, seed, xml) {
			var elements,
			matcher,
			i,
			len,
			elem,
			token,
			position,
			type,
			match,
			findContext,
			notTokens,
			isSingle = (match = selector.match(rgroups)) && match.length === 1,
			tokens = selector.match(rtokens),
			contextNodeType = context.nodeType;
			if (matchExpr.POS.test(selector)) {
				return handlePOS(selector, context, results, seed)
			}
			if (!seed && isSingle && tokens.length > 1 && contextNodeType === 9 && !xml && (match = matchExpr.ID.exec(tokens[0]))) {
				context = Expr.find.ID(match[1], context, xml)[0];
				selector = selector.slice(tokens.shift().length)
			}
			if (context) {
				if (seed) {
					elements = slice.call(seed, 0)
				} else {
					if (isSingle) {
						findContext = (tokens.length >= 1 && rsibling.test(tokens[0]) && context.parentNode) || context;
						notTokens = tokens.pop().split(":not");
						token = notTokens[0];
						for (i = 0, len = Expr.order.length; i < len; i++) {
							type = Expr.order[i];
							if ((match = matchExpr[type].exec(token))) {
								elements = Expr.find[type]((match[1] || "").replace(rbackslash, ""), findContext, xml);
								if (elements != null) {
									break
								}
							}
						}
						if (elements && !notTokens[1]) {
							position = selector.length - token.length;
							selector = selector.slice(0, position) + selector.slice(position).replace(matchExpr[type], "");
							if (!selector) {
								push.apply(results, slice.call(elements, 0));
								return results
							}
						}
					}
					if (!elements) {
						elements = Expr.find.TAG("*", context)
					}
				}
				if (selector && (matcher = compile(selector, context, xml))) {
					dirruns = matcher.dirruns;
					for (i = 0; (elem = elements[i]); i++) {
						cachedruns = matcher.runs++;
						if (matcher(elem, context)) {
							results.push(elem)
						}
					}
				}
			}
			return results
		};
		if (document.querySelectorAll) {
			(function () {
				var disconnectedMatch,
				oldSelect = select,
				rdivision = /[^\\],/g,
				rrelativeHierarchy = /^[\x20\t\n\r\f]*[+~]/,
				rapostrophe = /'/g,
				rattributeQuotes = /\=[\x20\t\n\r\f]*([^'"\]]*)[\x20\t\n\r\f]*\]/g,
				rbuggyQSA = [],
				rbuggyMatches = [":active"],
				matches = docElem.matchesSelector || docElem.mozMatchesSelector || docElem.webkitMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector;
				assert(function (div) {
					div.innerHTML = "<select><option selected></option></select>";
					if (!div.querySelectorAll("[selected]").length) {
						rbuggyQSA.push("\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)")
					}
					if (!div.querySelectorAll(":checked").length) {
						rbuggyQSA.push(":checked")
					}
				});
				assert(function (div) {
					div.innerHTML = "<p test=''></p>";
					if (div.querySelectorAll("[test^='']").length) {
						rbuggyQSA.push("[*^$]=" + whitespace + "*(?:\"\"|'')")
					}
					div.innerHTML = "<input type='hidden'>";
					if (!div.querySelectorAll(":enabled").length) {
						rbuggyQSA.push(":enabled", ":disabled")
					}
				});
				rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
				select = function (selector, context, results, seed, xml) {
					if (!seed && !xml && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
						if (context.nodeType === 9) {
							try {
								push.apply(results, slice.call(context.querySelectorAll(selector), 0));
								return results
							} catch (qsaError) {}
							
						} else {
							if (context.nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
								var newSelector,
								oldContext = context,
								old = context.getAttribute("id"),
								nid = old || expando,
								parent = context.parentNode,
								relativeHierarchySelector = rrelativeHierarchy.test(selector);
								if (old) {
									nid = nid.replace(rapostrophe, "\\$&")
								} else {
									context.setAttribute("id", nid)
								}
								if (relativeHierarchySelector && parent) {
									context = parent
								}
								try {
									if (context) {
										nid = "[id='" + nid + "'] ";
										newSelector = nid + selector.replace(rdivision, "$&" + nid);
										push.apply(results, slice.call(context.querySelectorAll(newSelector), 0));
										return results
									}
								} catch (qsaError) {}
								
								finally {
									if (!old) {
										oldContext.removeAttribute("id")
									}
								}
							}
						}
					}
					return oldSelect(selector, context, results, seed, xml)
				};
				if (matches) {
					assert(function (div) {
						disconnectedMatch = matches.call(div, "div");
						try {
							matches.call(div, "[test!='']:sizzle");
							rbuggyMatches.push(Expr.match.PSEUDO)
						} catch (e) {}
						
					});
					rbuggyMatches = new RegExp(rbuggyMatches.join("|"));
					Sizzle.matchesSelector = function (elem, expr) {
						expr = expr.replace(rattributeQuotes, "='$1']");
						if (!isXML(elem) && !rbuggyMatches.test(expr) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
							try {
								var ret = matches.call(elem, expr);
								if (ret || disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
									return ret
								}
							} catch (e) {}
							
						}
						return Sizzle(expr, null, null, [elem]).length > 0
					}
				}
			})()
		}
		xRTML.Sizzle = Sizzle
	})(window.xRTML = window.xRTML || {})
})(window);
(function (xRTML, undefined) {
	(function (JSON, undefined) {
		(function () {
			function f(n) {
				return n < 10 ? "0" + n : n
			}
			if (typeof Date.prototype.toJSON !== "function") {
				Date.prototype.toJSON = function (key) {
					return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
				};
				String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
					return this.valueOf()
				}
			}
			var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			gap,
			indent,
			meta = {
				"\b" : "\\b",
				"\t" : "\\t",
				"\n" : "\\n",
				"\f" : "\\f",
				"\r" : "\\r",
				'"' : '\\"',
				"\\" : "\\\\"
			},
			rep;
			function quote(string) {
				escapable.lastIndex = 0;
				return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
					var c = meta[a];
					return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
				}) + '"' : '"' + string + '"'
			}
			function str(key, holder) {
				var i,
				k,
				v,
				length,
				mind = gap,
				partial,
				value = holder[key];
				if (value && typeof value === "object" && typeof value.toJSON === "function") {
					value = value.toJSON(key)
				}
				if (typeof rep === "function") {
					value = rep.call(holder, key, value)
				}
				switch (typeof value) {
				case "string":
					return quote(value);
				case "number":
					return isFinite(value) ? String(value) : "null";
				case "boolean":
				case "null":
					return String(value);
				case "object":
					if (!value) {
						return "null"
					}
					gap += indent;
					partial = [];
					if (Object.prototype.toString.apply(value) === "[object Array]") {
						length = value.length;
						for (i = 0; i < length; i += 1) {
							partial[i] = str(i, value) || "null"
						}
						v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
						gap = mind;
						return v
					}
					if (rep && typeof rep === "object") {
						length = rep.length;
						for (i = 0; i < length; i += 1) {
							k = rep[i];
							if (typeof k === "string") {
								v = str(k, value);
								if (v) {
									partial.push(quote(k) + (gap ? ": " : ":") + v)
								}
							}
						}
					} else {
						for (k in value) {
							if (Object.hasOwnProperty.call(value, k)) {
								v = str(k, value);
								if (v) {
									partial.push(quote(k) + (gap ? ": " : ":") + v)
								}
							}
						}
					}
					v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
					gap = mind;
					return v
				}
			}
			if (typeof JSON.stringify !== "function") {
				JSON.stringify = function (value, replacer, space) {
					var i;
					gap = "";
					indent = "";
					if (typeof space === "number") {
						for (i = 0; i < space; i += 1) {
							indent += " "
						}
					} else {
						if (typeof space === "string") {
							indent = space
						}
					}
					rep = replacer;
					if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
						throw new Error("JSON.stringify")
					}
					return str("", {
						"" : value
					})
				}
			}
			if (typeof JSON.parse !== "function") {
				JSON.parse = function (text, reviver) {
					var j;
					function walk(holder, key) {
						var k,
						v,
						value = holder[key];
						if (value && typeof value === "object") {
							for (k in value) {
								if (Object.hasOwnProperty.call(value, k)) {
									v = walk(value, k);
									if (v !== undefined) {
										value[k] = v
									} else {
										delete value[k]
									}
								}
							}
						}
						return reviver.call(holder, key, value)
					}
					text = String(text);
					cx.lastIndex = 0;
					if (cx.test(text)) {
						text = text.replace(cx, function (a) {
								return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
							})
					}
					if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
						j = eval("(" + text + ")");
						return typeof reviver === "function" ? walk({
							"" : j
						}, "") : j
					}
					throw new SyntaxError("JSON.parse")
				}
			}
		}
			())
	})(xRTML.JSON = xRTML.JSON || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (DomParser, undefined) {
		var ns = "xrtml:",
		checkVersion = function (element) {
			return !element.getAttribute("version") || element.getAttribute("version") === xRTML.version
		},
		loadConnections = function (configElement) {
			var connectionTags = configElement.getElementsByTagName(ns + "connection"),
			connections = [];
			for (var j = 0; j < connectionTags.length; ++j) {
				if (checkVersion(connectionTags[j])) {
					var connectionElem = connectionTags[j];
					connections.push(new xrtmlElement(connectionElem));
					connectionTags[j].parentNode.removeChild(connectionTags[j--])
				}
			}
			return connections
		},
		loadStorage = function (configElement) {
			var storageTags = configElement.getElementsByTagName(ns + "storage"),
			storages = [];
			for (var i = 0, len = storageTags.length; i < len; i++) {
				if (checkVersion(storageTags[i])) {
					var storageElem = storageTags[i];
					storages.push({
						id : storageElem.getAttribute("id"),
						baseurl : storageElem.getAttribute("baseurl"),
						type : storageElem.getAttribute("type"),
						connectionid : storageElem.getAttribute("connectionid"),
						sessionid : storageElem.getAttribute("sessionid"),
						onready : storageElem.getAttribute("onready") ? new Function("event", "return " + storageElem.getAttribute("onready") + "(event);") : null,
						onsession : storageElem.getAttribute("onsession") ? new Function("event", "return " + storageElem.getAttribute("onsession") + "(event);") : null,
						onexception : storageElem.getAttribute("onexception") ? new Function("event", "event", "return " + storageElem.getAttribute("onexception") + "(event);") : null
					});
					document.getElementsByTagName(ns + "storages")[0].removeChild(storageTags[i--])
				}
			}
			return storages
		},
		loadConfig = function () {
			var scope = document,
			configElement = document.getElementsByTagName(ns + "config");
			if (configElement.length == 0) {
				return null
			}
			if (configElement.length == 1) {
				configElement = configElement[0];
				scope = window.attachEvent ? document : configElement
			} else {
				throw "xRTML requires a configuration tag per page."
			}
			return {
				debug : xRTML.Common.Converter.toBoolean(configElement.getAttribute("debug")),
				logLevel : configElement.getAttribute("loglevel"),
				xrtmlActive : xRTML.Common.Converter.toBoolean(configElement.getAttribute("xrtmlactive")),
				throwErrors : xRTML.Common.Converter.toBoolean(configElement.getAttribute("throwerrors")),
				connectionAttempts : xRTML.Common.Converter.toNumber(configElement.getAttribute("connectionattempts")),
				connectionTimeout : xRTML.Common.Converter.toNumber(configElement.getAttribute("connectiontimeout")),
				remoteTrace : xRTML.Common.Converter.toBoolean(configElement.getAttribute("remotetrace")),
				ortcUrl : configElement.getAttribute("ortcurl"),
				ortcLibrary : configElement.getAttribute("ortclibrary"),
				connections : loadConnections(scope),
				storages : loadStorage(scope)
			}
		},
		xrtmlElement = function (node, parent) {
			var attribute,
			child;
			if (node.attributes) {
				for (var i = 0; i < node.attributes.length; ++i) {
					attribute = node.attributes[i];
					if (attribute.specified) {
						this[attribute.nodeName.toLowerCase()] = attribute.nodeValue
					}
				}
			}
			if (node.children.length != 0) {
				for (var j = 0; j < node.children.length; ++j) {
					child = node.children[j],
					childName = window.addEventListener ? child.nodeName.split(":")[1].toLowerCase() : child.nodeName.toLowerCase();
					if (!parent) {
						this[childName] = [];
						new xrtmlElement(child, this[childName])
					} else {
						if (child.attributes && child.attributes.length == 1) {
							parent.push(child.attributes[0].nodeValue)
						} else {
							parent.push(new xrtmlElement(child))
						}
						if (child.children) {
							new xrtmlElement(child, parent)
						}
					}
				}
			}
		},
		loadTags = function () {
			var tagElements,
			tags = [],
			tagClasses = xRTML.TagManager.getClasses();
			for (var j = 0; j < tagClasses.length; ++j) {
				tagElements = document.getElementsByTagName(ns + tagClasses[j]);
				for (var i = 0; i < tagElements.length; ++i) {
					var tagElement = tagElements[i];
					if (!window.addEventListener && tagElement.scopeName.toLowerCase() != "xrtml") {
						continue
					}
					if (checkVersion(tagElement)) {
						var xrtmlTag = new xrtmlElement(tagElement);
						xrtmlTag.name = tagClasses[j];
						tags.push(xrtmlTag);
						document.body.removeChild(tagElements[i--])
					}
				}
			}
			return tags
		};
		xRTML.Event.extend(DomParser);
		DomParser.read = function () {
			var config = loadConfig();
			if (config) {
				config.attribute = function (name) {
					return xRTML.Common.Object.insensitiveGetter(this, name)
				};
				this.fire({
					configLoad : {
						config : config
					}
				})
			}
			var tags = loadTags();
			if (tags.length != 0) {
				this.fire({
					tagsLoad : {
						tags : tags
					}
				})
			}
		}
	})(xRTML.DomParser = xRTML.DomParser || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (Class, undefined) {
		var initializing = false,
		fnTest = /xyz/.test(function () {
				xyz
			}) ? /\b_super\b/ : /.*/;
		Class.extend = function (prop) {
			var _super = this.prototype;
			initializing = true;
			var prototype = new this();
			initializing = false;
			for (var name in prop) {
				prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function (name, fn) {
						return function () {
							var tmp = this._super;
							this._super = _super[name];
							var ret = fn.apply(this, arguments);
							this._super = tmp;
							return ret
						}
					})(name, prop[name]) : prop[name]
			}
			function Class() {
				if (!initializing && this.init) {
					this.init.apply(this, arguments)
				}
			}
			Class.prototype = prototype;
			Class.prototype.constructor = Class;
			Class.extend = arguments.callee;
			return Class
		}
	})(xRTML.Class = xRTML.Class || function () {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (Config, undefined) {
		var ortcLibrary = "";
		xRTML.Event.extend(Config);
		Config.logLevels = {
			error : 0,
			warn : 1,
			info : 2
		};
		Config.debug = false;
		Config.logLevel = 2;
		Config.connectionAttempts = 5;
		Config.connectionTimeout = 10000;
		Config.remoteTrace = false;
		Config.ortcLibrary = function (url, callback) {
			if (arguments.length != 0) {
				ortcLibrary = url;
				xRTML.Common.DOM.loadScript({
					url : url,
					callback : callback
				})
			}
			return ortcLibrary
		};
		xRTML.DomParser.bind({
			configLoad : function (e) {
				var config = e.config;
				Config.debug = config.attribute("debug") ? config.attribute("debug") : Config.debug;
				Config.logLevel = config.attribute("logLevel") ? config.attribute("logLevel") : Config.logLevel;
				Config.connectionAttempts = config.attribute("connectionAttempts") ? config.attribute("connectionAttempts") : Config.connectionAttempts;
				Config.connectionTimeout = config.attribute("connectionTimeout") ? config.attribute("connectionTimeout") : Config.connectionTimeout;
				Config.remoteTrace = config.attribute("remoteTrace") ? config.attribute("remoteTrace") : Config.remoteTrace;
				for (var i = 0; i < config.connections.length; ++i) {
					xRTML.ConnectionManager.create(config.connections[i])
				}
				for (var i = 0; i < config.storages.length; ++i) {
					xRTML.StorageManager.create(config.storages[i])
				}
			}
		})
	})(xRTML.Config = xRTML.Config || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (Console, undefined) {
		var debugConsole = (function () {
			if (typeof console !== "undefined") {
				return console
			}
			var fallback = {
				id : null,
				buffer : [],
				style : "width: 100%; height: 40%; position: absolute; bottom:5px; left:5px; background: silver; padding: 5px; overflow: scroll;font-family:consolas,monospace;font-size:12px; ",
				printObject : function (obj) {
					var output = "";
					for (property in obj) {
						output += property + ": " + obj[property] + "; \n"
					}
					return output
				},
				newLine : function (statement, color) {
					var pStatement = document.createElement("p");
					pStatement.style.color = color;
					pStatement.innerHTML = statement;
					fallback.id ? document.getElementById(fallback.id).appendChild(pStatement) : fallback.buffer.push(pStatement)
				},
				log : function (statement) {
					fallback.newLine(statement, "black")
				},
				warn : function (statement) {
					fallback.newLine(statement, "orange")
				},
				error : function (statement) {
					fallback.newLine(statement, "red")
				},
				debug : function (statement) {
					fallback.newLine(statement, "green")
				},
				display : function () {
					fallback.id = "xRTML_Console_" + xRTML.Common.Util.idGenerator();
					var consoleDiv = document.createElement("div");
					consoleDiv.id = fallback.id;
					consoleDiv.style.cssText = fallback.style;
					for (var i = 0, len = fallback.buffer.length; i < len; i++) {
						consoleDiv.appendChild(fallback.buffer[i])
					}
					buffer = [];
					if (xRTML.Config.debug) {
						document.body.appendChild(consoleDiv);
						consoleDiv.style.display = "block"
					}
				}
			};
			if (!window.addEventListener && typeof console == "undefined") {
				xRTML.load(function () {
					if (xRTML.Config.debug) {
						fallback.display()
					}
				})
			}
			return fallback
		})();
		Console.log = function (info) {
			debugConsole.log(info)
		},
		Console.warn = function (info) {
			debugConsole.warn(info)
		},
		Console.error = function (info) {
			debugConsole.error(info);
			if (xRTML.Config.remoteTrace === true) {
				this.fire({
					error : {
						error : info
					}
				})
			}
		},
		Console.debug = function (info) {
			if (xRTML.Config.debug === true) {
				debugConsole.log(info)
			}
		};
		xRTML.Event.extend(Console)
	})(xRTML.Console = xRTML.Console || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (Effect, undefined) {
		var Manager = {
			uiEffects : {
				blind : true,
				bounce : true,
				clip : true,
				drop : true,
				explode : true,
				fade : true,
				fold : true,
				highlight : true,
				puff : true,
				pulsate : true,
				scale : true,
				shake : true,
				size : true,
				slide : true,
				transfer : true
			},
			cssPropsMapping : {
				"padding-top" : "paddingTop"
			},
			checkIfEffectFunctionAvailable : function (effectName) {
				var effectAvailable = (jQuery && jQuery.fn && ((typeof jQuery.fn[effectName]).toLowerCase() == "function")) || (jQuery && jQuery.effects && ((typeof jQuery.effects[effectName]).toLowerCase() == "function"));
				if (!effectAvailable) {
					xRTML.Error.raise({
						code : xRTML.Error.Codes.MISSING_LIBRARY,
						info : {
							library : "jQuery",
							module : effectName,
							className : "xRTML.Effect.Manager (internal class, no docs available)",
							methodName : "checkIfEffectFunctionAvailable (internal method, no docs available)"
						}
					})
				}
			},
			callJQueryEffect : function (argumentsObject) {
				xRTML.Console.debug("jQuery effect: Running " + argumentsObject.effectName + " on element " + argumentsObject.element.id + " with options " + xRTML.JSON.stringify(argumentsObject.effectOptions) + " and properties: " + xRTML.JSON.stringify(argumentsObject.effectProperties));
				this.checkIfEffectFunctionAvailable(argumentsObject.effectName);
				try {
					if (this.uiEffects[argumentsObject.effectName]) {
						jQuery.fn.effect.call(jQuery(argumentsObject.element), argumentsObject.effectName, argumentsObject.effectOptions, argumentsObject.effectSpeed, argumentsObject.effectCallback)
					} else {
						jQuery.fn[argumentsObject.effectName].call(jQuery(argumentsObject.element), argumentsObject.effectProperties, argumentsObject.effectOptions)
					}
				} catch (err) {
					xRTML.Error.raise({
						code : xRTML.Error.Codes.UNEXPECTED,
						info : {
							message : err.message,
							className : "xRTML.Effect.Manager (internal class, no docs available)",
							methodName : "callJQueryEffect (internal method, no docs available)"
						}
					})
				}
			},
			buildReverseEffectProperties : function (args) {
				var elementCSSProperties = {};
				for (var prop in args.properties) {
					var p = xRTML.Common.Object.insensitiveGetter(args.element.style, prop.replace("-", ""));
					if (!p || p == "") {
						p = xRTML.Common.DOM.getStyle({
								element : args.element,
								rule : prop
							})
					}
					elementCSSProperties[prop] = p
				}
				return elementCSSProperties
			},
			cloneJQueryOptions : function (options) {
				var newOptions = {};
				for (prop in options) {
					newOptions[prop] = options[prop]
				}
				return newOptions
			}
		},
		Provider = {
			runEffects : function (args) {
				if (this.effects) {
					if (typeof args.stopCurrent == "undefined" || args.stopCurrent) {
						Manager.checkIfEffectFunctionAvailable("animate");
						jQuery(args.element).stop(false, true)
					}
					for (var i = 0; i < this.effects.length; i++) {
						try {
							var options = Manager.cloneJQueryOptions(typeof this.effects[i].options == "object" ? this.effects[i].options : xRTML.JSON.parse(this.effects[i].options)),
							properties = typeof this.effects[i].properties == "object" ? this.effects[i].properties : xRTML.JSON.parse(this.effects[i].properties),
							reverseProperties = Manager.buildReverseEffectProperties({
									properties : properties,
									element : args.element
								})
						} catch (err) {
							xRTML.Error.raise({
								code : xRTML.Error.Codes.JSON_PARSE,
								info : {
									message : err.message,
									className : "xRTML.Effect.Provider (internal class, no docs available)",
									methodName : "runEffects"
								}
							})
						}
						Manager.callJQueryEffect({
							element : args.element,
							effectName : this.effects[i].name,
							effectOptions : options,
							effectProperties : properties,
							effectSpeed : this.effects[i].speed,
							effectCallback : this.effects[i].callback ? (typeof this.effects[i].callback == "function" ? this.effects[i].callback : new Function("", "return " + this.effects[i].callback + "();")) : null,
							revert : this.effects[i].revert
						});
						if (this.effects[i].revert) {
							Manager.callJQueryEffect({
								element : args.element,
								effectName : this.effects[i].name,
								effectOptions : options,
								effectProperties : reverseProperties,
								effectSpeed : this.effects[i].speed,
								effectCallback : null,
								revert : false
							})
						}
					}
				}
			}
		};
		Effect.extend = function (target) {
			for (var func in Provider) {
				target[func] = Provider[func]
			}
		}
	})(xRTML.Effect = xRTML.Effect || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (Error, undefined) {
		xRTML.Event.extend(Error);
		Error.raise = function (args) {
			var error = new Error.XRTMLError(args);
			new window.Error().stack ? xRTML.Console.error(error) : printOlderBrowserError(error);
			return error
		};
		Error.XRTMLError = function (args) {
			var code = !!args.code ? args.code : xRTML.Error.Codes.UNEXPECTED;
			this.name = code.type;
			var info = !!args.info ? args.info : {};
			info.className = !!info.className ? info.className : (!!args.target ? (!!args.target.name ? args.target.name : Object.prototype.toString.call(args.target)) : "Unknown");
			info.id = !!info.id ? info.id : (!!args.target ? args.target.id : "Unknown");
			info.message = !!info.message ? info.message : args.message;
			info.arguments = args.arguments;
			this.message = xRTML.Common.String.template(code.message, info);
			this.type = code.type;
			this.target = args.target;
			this.info = info;
			Error.fire({
				exception : {
					error : this
				}
			})
		};
		Error.XRTMLError.prototype = window.Error.prototype;
		Error.XRTMLError.prototype.constructor = Error.XRTMLError;
		Error.Codes = {
			MANDATORY_PROPERTY : {
				type : "ValidationError",
				message : "The property {property} is required for a {className} with the id {id}."
			},
			INVALID_PROPERTY : {
				type : "ValidationError",
				message : "The property {property} of a {className} with the id {id} has the wrong type. The appropriate type would be {validType}."
			},
			CONNECTION_INACTIVE : {
				type : "ConnectionError",
				message : "Tried to perform an operation on Connection {id} which is not active."
			},
			CONNECTION_EXCEPTION : {
				type : "ConnectionError",
				message : "An unexpected problem occured on the Connection {id}. {message}"
			},
			CONNECTION_NOT_FOUND : {
				type : "ConnectionError",
				message : "Unable to find a Connection with the specified id: {id}."
			},
			CONNECTION_PROCESS : {
				type : "ConnectionError",
				message : "An error ocurred while processing the message {xRTMLMessage} arrived at Connection {id}. {message}"
			},
			CONNECTION_ADAPT : {
				type : "ConnectionError",
				message : "An error ocurred while adapting the message {originalMessage} arrived at Connection {id}. {message}"
			},
			CONNECTION_DUPLICATE : {
				type : "ConnectionError",
				message : "Connection with id {id} already exists."
			},
			ORTC_NOT_FOUND : {
				type : "ORTCError",
				message : "Unable to obtain the ORTC library from the address specified."
			},
			ORTC_UNAVAILABLE : {
				type : "ORTCError",
				message : "Connection {id}: ORTC client is not created yet."
			},
			ORTC_DISCONNECTED : {
				type : "ORTCError",
				message : "Connection {id}: Disconnect not possible. ORTC client is not connected."
			},
			ORTC_EXCEPTION : {
				type : "ORTCError",
				message : "An unexpected problem occured on the Connection {id}. {message}"
			},
			TAG_NOT_CREATED : {
				type : "TagError",
				message : "A problem occured while trying to create a {className} Tag with id {id}. {message}"
			},
			TAG_INACTIVE : {
				type : "TagError",
				message : "Tried to perform an action on a {className} with {id} which is not active."
			},
			TAG_UNREGISTERED : {
				type : "TagError",
				message : "The specified Tag does not exist in the registered tags namespace."
			},
			TAG_INVALID_CONFIG : {
				type : "TagError",
				message : "Unable to register a Tag with the specified configuration. {message}"
			},
			TAG_ABSTRACT : {
				type : "TagError",
				message : "The specified tag {tag} should not be instantiated."
			},
			TAG_ACTION_UNDEFINED : {
				type : "TagError",
				message : "Tried to perform an action {action} which is not defined on a {className} with id {id}."
			},
			TAG_NOT_FOUND : {
				type : "TagError",
				message : "Unable to find a Tag with the specified id: {id}."
			},
			TAG_PROCESS : {
				type : "TagError",
				message : "An error ocurred while processing the arrived message on a {className} with id {id}. {message}"
			},
			INVALID_MESSAGE : {
				type : "MessageError",
				message : "Tried to create a message with invalid properties. {message}"
			},
			TRIGGER_UNREGISTERED : {
				type : "MessageError",
				message : "A message arrived containing a trigger which is not registered by any Tag."
			},
			STORAGE_CONNECTION_UNAVAILABLE : {
				type : "StorageError",
				message : "The Remote Storage component for a {className} provider with id {id} could not find a connection with connectionId: {connectionId}"
			},
			STORAGE_UNAVAILABLE : {
				type : "StorageError",
				message : "The Remote Storage component for a {className} provider with id {id} is not available."
			},
			STORAGE_SESSION : {
				type : "StorageError",
				message : "The Remote Storage component for a {className} provider with id {id} was not able to get a session. {message}"
			},
			STORAGE_ACTION_UNDEFINED : {
				type : "StorageError",
				message : "Tried to perform an action which is not defined on a {className} with id {id}."
			},
			STORAGE_PERMISSIONS : {
				type : "StorageError",
				message : "Tried to perform an action for which the {className} with id {id} does not have the necessary permissions. Were the right channel permissions set on the server-side?"
			},
			STORAGE_OPERATION_TIMEOUT : {
				type : "StorageError",
				message : "The Storage operation with the id: {opId} was not completed whithin the expected timeout: {timeout}"
			},
			STORAGE_CALLBACK_FAILURE : {
				type : "StorageError",
				message : "The Storage operation with the id: {opId} callback has failed. {message}"
			},
			REQUEST_FAILURE : {
				type : "RequestError",
				message : "An error occured while calling the specified address. {message}"
			},
			REQUEST_UNAVAILABLE : {
				type : "RequestError",
				message : "Unable to obtain a response from the specified address."
			},
			REQUEST_UNSUPPORTED : {
				type : "RequestError",
				message : "This browser does not support XMLHttpRequest neither XDomainRequest."
			},
			JSON_PARSE : {
				type : "ParseError",
				message : "Unable to parse the specified String according to JSON specification rules. {message}"
			},
			DOM_PARSE : {
				type : "ParseError",
				message : "Unable to parse an XRTML DOM Node. "
			},
			MISSING_ARGUMENT : {
				type : "MethodError",
				message : "A method {methodName} was called but the required argument {argument} was undefined."
			},
			INVALID_ARGUMENT : {
				type : "MethodError",
				message : "The method {methodName} was called but the argument {argument} was of an invalid type. The expected type was {expectedType}"
			},
			UNEXPECTED : {
				type : "UnexpectedError",
				message : "An unexpected error occured. Cause error message is: {message}"
			},
			FATAL : {
				type : "FatalError",
				message : "A critical error occured. The error message is: {message}"
			},
			INVALID_DOM_ATTRIBUTE : {
				type : "InvalidDomAttribute",
				message : "An error occured when trying to retrive an unexisting attribute: {attribute}"
			},
			TEMPLATING : {
				type : "TemplateError",
				message : "An error occured when trying to apply bindings to a template. The cause is: {message}"
			},
			TEMPLATING_EFFECTS : {
				type : "TemplateError",
				message : "An error occured when trying to run effects binded in a template. Are the effects configured in the tag? The error cause is: {message}"
			},
			UNEXPECTEDMEDIA : {
				type : "UnexpectedMediaError",
				message : "An error occurred when trying to operate on media. The cause is: {message}"
			},
			UNEXPECTEDEVENT : {
				type : "UnexpectedEventError",
				message : 'An error occurred when trying to process the "{eventType}" event handler. The cause is: {message}'
			},
			MISSING_LIBRARY : {
				type : "MissingLibrary",
				message : "A required library {library} {module} is not available. Please import this library."
			}
		};
		var printOlderBrowserError = function (err) {
			var errorStringArray = [];
			errorStringArray.push(err.name + ": " + err.message + "\n");
			function buildErrorString(error, errorA, identBy, level) {
				var identArr = [];
				for (var i = 0; i < identBy; i++) {
					identArr.push(" ")
				}
				var identString = identArr.join("");
				if (level < 9) {
					for (var key in error) {
						if (error.hasOwnProperty(key) && key != "name" && key != "message") {
							if (typeof error[key] === "string" || typeof error[key] === "number" || typeof error[key] === "boolean") {
								errorA.push((identString + key + ": " + error[key]) + "\n")
							} else {
								if (xRTML.Common.Object.isObject(error[key])) {
									errorA.push(identString + key + ": \n");
									buildErrorString(error[key], errorA, identBy + 4, level + 1)
								} else {
									if (xRTML.Common.Array.isArray(error[key])) {
										errorA.push(identString + key + ": \n");
										for (var i = 0; i < error[key].length; i++) {
											buildErrorString(error[key], errorA, identBy + 4, level + 1)
										}
									}
								}
							}
						}
					}
				} else {
					errorA.push(identString + error.toString() + "\n")
				}
			}
			buildErrorString(err, errorStringArray, 0, 1);
			xRTML.Console.error(errorStringArray.join(""))
		}
	})(xRTML.Error = xRTML.Error || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (Common, undefined) {
		(function (Array, undefined) {
			Array.contains = function (args) {
				var items = args.items;
				for (var i = 0, len = items.length; i < len; i++) {
					if (xRTML.Common.Object.equals({
							o1 : items[i],
							o2 : args.obj
						})) {
						return true
					}
				}
				return false
			};
			Array.isArray = function (obj) {
				return Object.prototype.toString.call(obj) === "[object Array]"
			}
		})(xRTML.Common.Array = xRTML.Common.Array || {})
	})(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (Common, undefined) {
		(function (Object, undefined) {
			Object.equals = function (items) {
				return xRTML.JSON.stringify(items.o1) === xRTML.JSON.stringify(items.o2)
			};
			Object.isObject = function (obj) {
				return "" + obj == "[object Object]"
			};
			Object.insensitiveGetter = function (obj, prop) {
				for (var p in obj) {
					if (obj.hasOwnProperty && obj.hasOwnProperty(p) && (prop + "").toLowerCase() == (p + "").toLowerCase()) {
						return obj[p];
						break
					}
				}
			};
			Object.keys = window.Object.keys || function (obj) {
				var keys = [],
				key;
				for (key in obj) {
					if (window.Object.prototype.hasOwnProperty.call(obj, key)) {
						keys.push(key)
					}
				}
				return keys
			}
		})(xRTML.Common.Object = xRTML.Common.Object || {})
	})(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (Common, undefined) {
		(function (String, undefined) {
			String.trim = function (text) {
				return typeof window.String.prototype.trim == "function" ? text.trim() : text.replace(/^\s*/, "").replace(/\s*$/, "")
			};
			String.template = function (text, values) {
				for (var prop in values) {
					var reg = new RegExp("\\{" + prop + "\\}", "gm");
					text = text.replace(reg, values[prop])
				}
				return text
			}
		})(xRTML.Common.String = xRTML.Common.String || {})
	})(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (Common, undefined) {
		(function (DOM, undefined) {
			DOM.loadScript = function (resource) {
				var script = document.createElement("script");
				script.type = "text/javascript";
				if (script.readyState) {
					script.onreadystatechange = function () {
						if (script.readyState == "loaded" || script.readyState == "complete") {
							script.onreadystatechange = null;
							resource.callback.apply(this, arguments)
						}
					}
				} else {
					script.onload = function () {
						resource.callback.apply(this, arguments)
					}
				}
				script.src = resource.url;
				document.getElementsByTagName("head")[0].appendChild(script)
			};
			DOM.getStyle = function (args) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					return document.defaultView.getComputedStyle(args.element, "").getPropertyValue(args.rule)
				}
				if (args.element.currentStyle) {
					var rule = args.rule.replace(/\-(\w)/g, function (strMatch, p1) {
							return p1.toUpperCase()
						});
					return args.element.currentStyle[rule]
				}
				return ""
			}
		})(xRTML.Common.DOM = xRTML.Common.DOM || {})
	})(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (Common, undefined) {
		(function (Request, undefined) {
			Request.post = function (args) {
				args.method = "POST";
				sendRequest(args)
			};
			Request.get = function (args) {
				args.method = "GET";
				if (args.data != "undefined") {
					var url = args.url,
					data = args.data;
					url += url.indexOf("?") == -1 ? "?" : "&";
					for (var prop in args.data) {
						var propValue = data[prop];
						if (typeof propValue != "object" && typeof propValue != "boolean") {
							url += prop + "=" + propValue + "&"
						}
					}
					if (url.lastIndexOf("&") == url.length - 1) {
						url = url.slice(0, -1)
					}
					args.url = url
				}
				sendRequest(args)
			};
			var sendRequest = function (args) {
				var requestType = getRequestType(args).create(args.method.toLowerCase(), args.url, xRTML.Common.Function.proxy(function (result, error, status) {
							if (typeof error != "undefined" && error != null) {
								if (args.error) {
									args.error(error)
								}
							} else {
								if (args.success) {
									args.success(result)
								}
							}
							if (args.complete) {
								args.complete(result, error, status)
							}
						}, this), args.async, args.headers);
				requestType.send(args.data ? args.data : null)
			},
			getRequestType = function (args) {
				if (window.XMLHttpRequest && (!args.crossDomain || "withCredentials" in XHR().getNativeObject())) {
					return XHR()
				} else {
					if (window.XDomainRequest) {
						return XDR()
					} else {
						xRTML.Error.raise({
							code : xRTML.Error.Codes.REQUEST_UNSUPPORTED,
							info : {
								className : "xRTML.Common.Request",
								methodName : "getRequestType (internal method, no docs available)"
							}
						})
					}
				}
			},
			XHR = function () {
				return {
					getNativeObject : function () {
						if (window.XMLHttpRequest) {
							return new XMLHttpRequest()
						} else {
							if (window.ActiveXObject) {
								try {
									return new ActiveXObject("Msxml2.XMLHTTP.6.0")
								} catch (e) {}
								
								try {
									return new ActiveXObject("Msxml2.XMLHTTP.3.0")
								} catch (e) {}
								
								try {
									return ActiveXObject("Microsoft.XMLHTTP")
								} catch (e) {}
								
							}
						}
						xRTML.Error.raise({
							code : xRTML.Error.Codes.REQUEST_UNSUPPORTED,
							info : {
								className : "xRTML.Common.Request.XHR (internal class, no docs available)",
								methodName : "getNativeObject (internal method, no docs available)"
							}
						})
					},
					create : function (method, url, callback, async, headers) {
						var self = this;
						self.xhr = this.getNativeObject();
						self.callback = callback;
						method = method.toUpperCase();
						self.xhr.onreadystatechange = function () {
							try {
								if (this.readyState == 4) {
									if (this.status == 200) {
										self.callback(this.responseText, null, this.status)
									} else {
										if (this.status == 0) {
											self.callback(null, "The status code is 0 which likely means that the server is unavailable.", this.status)
										} else {
											self.callback(null, this.responseText, this.status)
										}
									}
								}
							} catch (e) {
								xRTML.Console.error(e)
							}
						};
						self.xhr.open(method, url, !!async ? async : true);
						self.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
						self.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
						for (var prop in headers) {
							self.xhr.setRequestHeader(prop, headers[prop])
						}
						if (method == "POST") {
							self.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
						}
						return self
					},
					send : function (data) {
						if (data && typeof(data) != "string") {
							data = xRTML.JSON.stringify(data)
						}
						xRTML.Console.debug("Performing request with payload: " + data);
						this.xhr.send(data)
					}
				}
			},
			XDR = function () {
				return {
					create : function (method, url, callback, async) {
						var self = this;
						self.xdr = new XDomainRequest();
						self.callback = callback;
						method = method.toUpperCase();
						self.xdr.onload = function () {
							try {
								self.callback(self.xdr.responseText)
							} catch (err) {
								xRTML.Error.raise({
									code : xRTML.Error.Codes.UNEXPECTED,
									info : {
										message : err.message,
										className : "xRTML.Common.Request.XDR (internal class, no docs available)",
										methodName : "onload (internal method, no docs available)"
									}
								})
							}
						};
						self.xdr.onerror = function () {
							try {
								self.callback(null, self.xdr.responseText)
							} catch (err) {
								xRTML.Error.raise({
									code : xRTML.Error.Codes.UNEXPECTED,
									info : {
										message : err.message,
										className : "xRTML.Common.Request.XDR (internal class, no docs available)",
										methodName : "onerror (internal method, no docs available)"
									}
								})
							}
						};
						self.xdr.open(method, url, !!async ? async : true);
						try {
							self.xdr.contentType = "text/plain"
						} catch (err) {}
						
						return self
					},
					send : function (data) {
						var self = this;
						function sendData(d) {
							if (d && typeof(d) != "string") {
								d = xRTML.JSON.stringify(d)
							}
							xRTML.Console.log("Performing request with payload:" + d);
							self.xdr.send(d);
							if (self.xdrTimeout) {
								clearTimeout(self.xdrTimeout);
								self.xdrTimeout = undefined
							}
						}
						if (self.xdrReady) {
							sendData(data)
						} else {
							self.xdrTimeout = setTimeout(function () {
									sendData(data)
								}, 500)
						}
					}
				}
			}
		})(xRTML.Common.Request = xRTML.Common.Request || {})
	})(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (Common, undefined) {
		(function (Cookie, undefined) {
			Cookie.setCookie = function (cookie) {
				var cookieString = cookie.name + "=" + escape(cookie.value);
				if (cookie.expires) {
					cookieString += "; expires=" + cookie.expires.toGMTString()
				}
				if (cookie.path) {
					cookieString += "; path=" + escape(cookie.path)
				} else {
					cookieString += "; path=/"
				}
				if (cookie.domain) {
					cookieString += "; domain=" + escape(cookie.domain)
				}
				if (cookie.secure) {
					cookieString += "; secure"
				}
				document.cookie = cookieString
			};
			Cookie.getCookie = function (cookie) {
				var results = document.cookie.match("(^|;) ?" + cookie.name + "=([^;]*)(;|$)");
				if (results) {
					return (unescape(results[2]))
				}
				return undefined
			};
			Cookie.deleteCookie = function (cookie) {
				cookie.value = "";
				cookie.expires = new Date("Thu, 01 Jan 1970 00:00:01 GMT");
				Cookie.setCookie(cookie)
			}
		})(xRTML.Common.Cookie = xRTML.Common.Cookie || {})
	})(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (Common, undefined) {
		(function (Validator, undefined) {
			Validator.validateRequired = function (args) {
				if (!args.target[args.prop] && args.target[args.prop] != 0 && (xRTML.Common.Array.isArray(args.target[args.prop]) && args.target[args.prop].length <= 0)) {
					xRTML.Error.raise({
						code : xRTML.Error.Codes.MANDATORY_PROPERTY,
						target : args.target,
						info : {
							property : args.prop
						}
					})
				}
			}
		})(xRTML.Common.Validator = xRTML.Common.Validator || {})
	})(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (Common, undefined) {
		(function (Converter, undefined) {
			Converter.toBoolean = function (value) {
				return typeof value === "undefined" ? value : (/^true|1|yes$/i).test(value)
			};
			Converter.toNumber = function (value) {
				if (typeof value === "undefined") {
					return value
				}
				if (typeof value == "number") {
					return value
				}
				if (typeof value == "string") {
					return xRTML.Common.String.trim(value) == "" ? 0 : window.Number(value)
				}
			};
			Converter.toDate = function (value) {
				var tmp = value.split(" "),
				dt = tmp[0].split("-"),
				tm = tmp[1].split(":");
				return new Date(parseInt(dt[2]), parseInt(dt[1]) - 1, parseInt(dt[0]), parseInt(tm[0]), parseInt(tm[1]), parseInt(tm[2]), 0)
			}
		})(xRTML.Common.Converter = xRTML.Common.Converter || {})
	})(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (Common, undefined) {
		(function (Util, undefined) {
			var S4 = function () {
				return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1)
			};
			Util.guidGenerator = function () {
				return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4())
			};
			Util.idGenerator = function () {
				return (S4() + S4())
			}
		})(xRTML.Common.Util = xRTML.Common.Util || {})
	})(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (Common, undefined) {
		(function (Function, undefined) {
			Function.proxy = function (fn, context) {
				if (typeof fn === "function" && typeof context === "object") {
					return function () {
						return fn.apply(context, arguments)
					}
				}
			};
			Function.parse = function (fnName) {
				if (typeof fnName == "function") {
					return fnName
				}
				if (typeof fnName != "string") {
					return null
				}
				var args = "",
				body = "return " + fnName + "(";
				if (arguments.length != 1) {
					for (var i = 1; i < arguments.length; ++i) {
						args += arguments[i] + ","
					}
					args = args.substring(0, args.length - 1)
				}
				body += args + ");";
				return new window.Function(args, body)
			}
		})(xRTML.Common.Function = xRTML.Common.Function || {})
	})(xRTML.Common = xRTML.Common || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (ConnectionManager, undefined) {
		var connections = {},
		getById = function (id) {
			for (var key in connections) {
				if (connections[key].id === id) {
					return connections[key]
				}
			}
			return undefined
		},
		messageBuffer = {
			add : function (args) {
				var id = args.connection.id;
				if (!this.bConnections[id]) {
					this.bConnections[id] = [];
					args.connection.bind({
						connect : this.send
					})
				}
				this.bConnections[id].push(args.message)
			},
			bConnections : {},
			send : function (e) {
				var messages = messageBuffer.bConnections[e.target.id],
				c = e.target;
				for (var i = 0; i < messages.length; ++i) {
					c.send(messages[i])
				}
				c.unbind({
					connect : messageBuffer.send
				});
				messageBuffer.bConnections[e.target.id] = undefined
			}
		};
		ConnectionManager.create = function (connection) {
			connection.attribute = function (name) {
				return xRTML.Common.Object.insensitiveGetter(this, name)
			};
			return this.add(new this.Connection(connection))
		};
		ConnectionManager.add = function (connection) {
			if (this.getById(connection.id)) {
				throw new xRTML.Error({
					code : xRTML.Error.Codes.CONNECTION_DUPLICATE,
					target : connection
				})
			}
			this.Connections.push(connection.id);
			this.fire({
				connectionCreate : {
					connection : connection
				}
			});
			connections[connection.internalId] = connection;
			connection.bind({
				xrtmlMessage : function (e) {
					ConnectionManager.fire({
						xrtmlMessage : {
							connection : e.target,
							channel : e.channel,
							message : e.message
						}
					})
				}
			});
			connection.bind({
				dispose : function (e) {
					var connectionInternalId = e.target.internalId,
					disposedConnection = connections[connectionInternalId];
					connections[connectionInternalId] = null;
					delete connections[connectionInternalId];
					for (var i = 0, cons = ConnectionManager.Connections, len = cons.length; i < len; i++) {
						if (cons[i] === e.target.id) {
							cons.splice(i, 1);
							break
						}
					}
					ConnectionManager.fire({
						connectionDispose : {
							connection : e.target
						}
					})
				}
			});
			return connection
		};
		ConnectionManager.getById = function (id) {
			return connections[id] || getById(id)
		};
		ConnectionManager.dispose = function (id) {
			var connection = this.getById(id);
			if (connection) {
				connection.dispose()
			} else {
				xRTML.Console.warn("ConnectionManager: Connection " + id + " was not found.")
			}
		};
		ConnectionManager.addChannel = function (channel) {
			var connection = this.getById(channel.connectionId);
			if (typeof connection === "undefined") {
				connection = this.getConnectionById(channel.connectionId);
				if (connection === null) {
					xRTML.Error.raise({
						code : xRTML.Error.Codes.CONNECTION_NOT_FOUND,
						target : this,
						info : {
							className : "xRTML.ConnectionManager",
							methodName : "addChannel"
						}
					})
				}
			}
			connection.createChannel(channel)
		};
		ConnectionManager.sendMessage = function (message) {
			var connection = null;
			for (var i = 0; i < message.connections.length; ++i) {
				connection = this.getById(message.connections[i]);
				if (connection) {
					if (connection.isConnected()) {
						connection.send(message)
					} else {
						messageBuffer.add({
							connection : connection,
							message : {
								channel : message.channel,
								content : message.content,
								sendOnly : message.sendOnly
							}
						});
						xRTML.Console.debug("ConnectionManager: Connection with id " + message.connections[i] + " is not connected. Buffering message:");
						xRTML.Console.debug(message)
					}
				} else {
					xRTML.Error.raise({
						code : xRTML.Error.Codes.CONNECTION_NOT_FOUND,
						target : this,
						info : {
							className : "xRTML.ConnectionManager",
							methodName : "sendMessage"
						}
					})
				}
			}
		};
		ConnectionManager.Connections = [];
		xRTML.Event.extend(ConnectionManager)
	})(xRTML.ConnectionManager = xRTML.ConnectionManager || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (ConnectionManager, undefined) {
		ConnectionManager.Connection = function (args) {
			var ortcClient = null,
			active = true;
			xRTML.Event.extend(this);
			this.internalId = xRTML.Common.Util.guidGenerator();
			this.id = args.attribute("id") || this.internalId;
			this.appKey = args.attribute("appKey");
			this.authToken = args.attribute("authToken");
			this.sendRetries = parseInt(args.attribute("sendRetries")) || 5;
			this.sendInterval = parseInt(args.attribute("sendInterval")) || 1000;
			this.timeout = args.attribute("timeout") || xRTML.Config.connectionTimeout;
			this.connectAttempts = args.attribute("connectAttempts") || xRTML.Config.connectionAttempts;
			this.connectionAttemptsCounter = 0;
			this.autoConnect = typeof args.attribute("autoConnect") == "undefined" ? true : xRTML.Common.Converter.toBoolean(args.attribute("autoConnect"));
			this.metadata = args.attribute("metadata");
			this.serverType = args.attribute("serverType") || "IbtRealTimeSJ";
			this.url = args.attribute("url") || xRTML.Console.error("Connection " + this.id + ": ORTC Server URL must be set.");
			this.isCluster = typeof args.attribute("isCluster") == "undefined" ? true : xRTML.Common.Converter.toBoolean(args.attribute("isCluster"));
			this.announcementSubChannel = args.attribute("announcementSubChannel");
			this.channels = {};
			var toFunction = xRTML.Common.Function.parse,
			proxy = xRTML.Common.Function.proxy;
			this.messageAdapter = toFunction(args.attribute("messageAdapter"), "message");
			this.bind({
				create : toFunction(args.attribute("onCreate"), "e"),
				connect : toFunction(args.attribute("onConnect"), "e"),
				channelCreate : toFunction(args.attribute("onChannelCreate"), "e"),
				disconnect : toFunction(args.attribute("onDisconnect"), "e"),
				subscribe : toFunction(args.attribute("onSubscribe"), "e"),
				unsubscribe : toFunction(args.attribute("onUnsubscribe"), "e"),
				exception : toFunction(args.attribute("onException"), "e"),
				reconnect : toFunction(args.attribute("onReconnect"), "e"),
				reconnecting : toFunction(args.attribute("onReconnecting"), "e"),
				message : toFunction(args.attribute("onMessage"), "e"),
				dispose : toFunction(args.attribute("onDispose"), "e")
			});
			var onMessage = proxy(function (client, channel, message) {
					this.process({
						channel : channel,
						message : message
					})
				}, this),
			onFactoryLoaded = function (e) {
				ortcClient = e.createClient();
				ortcClient.setId(this.internalId);
				ortcClient.setConnectionTimeout(this.timeout);
				ortcClient.setConnectionMetadata(this.metadata);
				ortcClient.setAnnouncementSubChannel(this.announcementSubChannel);
				!this.isCluster ? ortcClient.setUrl(this.url) : ortcClient.setClusterUrl(this.url);
				ortcClient.onConnected = proxy(function (ortcClient) {
						for (var name in this.channels) {
							var channel = this.channels[name];
							if (channel.subscribe) {
								ortcClient.subscribe(channel.name, channel.subscribeOnReconnect, onMessage)
							}
						}
						this.fire({
							connect : {}
							
						})
					}, this);
				ortcClient.onDisconnected = proxy(function (ortcClient) {
						this.fire({
							disconnect : {}
							
						})
					}, this);
				ortcClient.onSubscribed = proxy(function (ortcClient, channel) {
						this.channels[channel].fire({
							subscribe : {}
							
						});
						this.fire({
							subscribe : {
								channel : channel
							}
						})
					}, this);
				ortcClient.onUnsubscribed = proxy(function (ortcClient, channel) {
						var removedChannel = this.channels[channel];
						delete this.channels[channel];
						removedChannel.fire({
							unsubscribe : {}
							
						});
						this.fire({
							unsubscribe : {
								channel : channel
							}
						})
					}, this);
				ortcClient.onException = proxy(function (ortcClient, evt) {
						this.fire({
							exception : {
								message : evt
							}
						});
						xRTML.Error.raise({
							code : xRTML.Error.Codes.ORTC_EXCEPTION,
							target : this,
							info : {
								className : "ORTCClient",
								methodName : "onException",
								message : evt
							}
						})
					}, this);
				ortcClient.onReconnected = proxy(function (ortcClient) {
						this.connectionAttemptsCounter = 0;
						this.fire({
							reconnect : {}
							
						})
					}, this);
				ortcClient.onReconnecting = proxy(function (ortcClient) {
						if (this.connectionAttemptsCounter >= this.connectAttempts) {
							ortcClient.disconnect()
						} else {
							this.connectionAttemptsCounter++;
							this.fire({
								reconnecting : {}
								
							})
						}
					}, this);
				this.fire({
					create : {}
					
				});
				if (this.autoConnect) {
					ortcClient.connect(this.appKey, this.authToken)
				}
			};
			var retrySend = function (args, retries) {
				if (this.isCreated() && this.isConnected()) {
					this.send(args)
				} else {
					if (++retries <= this.sendRetries) {
						setTimeout(proxy(function () {
								proxy(retrySend, this)(args, retries)
							}, this), this.sendInterval);
						xRTML.Console.debug("Message " + args.content + " not sent to channel " + args.channel + ". Retry " + retries + "/" + this.sendRetries + " in " + this.sendInterval / 1000 + " seconds.")
					} else {
						xRTML.Console.debug("Message " + args.content + " not sent to channel " + args.channel + ". Discarding message.")
					}
				}
			};
			this.active = function (value) {
				if (!value) {
					return active
				}
				active = xRTML.Common.Converter.toBoolean(value);
				return active
			};
			this.dispose = function () {
				if (this.isConnected()) {
					this.disconnect()
				}
				this.fire({
					dispose : {}
					
				})
			};
			this.createChannel = function (c) {
				c.attribute = function (name) {
					return xRTML.Common.Object.insensitiveGetter(this, name)
				};
				var channel = {
					connectionId : c.attribute("connectionId") || this.id,
					name : c.attribute("name"),
					subscribeOnReconnect : typeof c.attribute("subscribeOnReconnect") == "undefined" ? true : xRTML.Common.Converter.toBoolean(c.attribute("subscribeOnReconnect")),
					subscribe : typeof c.attribute("subscribe") == "undefined" ? true : xRTML.Common.Converter.toBoolean(c.attribute("subscribe")),
					messageAdapter : toFunction(c.attribute("messageAdapter", "message"))
				};
				xRTML.Event.extend(channel);
				channel.bind({
					message : toFunction(c.attribute("onMessage"), "e"),
					subscribe : toFunction(c.attribute("onSubscribe"), "e"),
					unsubscribe : toFunction(c.attribute("onUnsubscribe"), "e")
				});
				this.channels[c.name] = channel;
				this.fire({
					channelCreate : {
						channel : channel
					}
				});
				return channel
			};
			this.process = function (data) {
				var channel = data.channel,
				message = data.message;
				if (message.substring(0, 15) == "_X_SEND_ONLY_X_") {
					if (this.internalId == message.substring(15, 51)) {
						return
					}
					message = message.substring(54)
				}
				if (this.active()) {
					try {
						if (this.messageAdapter) {
							message = this.messageAdapter(message)
						}
						if (this.channels[channel] && this.channels[channel].messageAdapter) {
							message = this.channels[channel].messageAdapter(message)
						}
					} catch (err) {
						xRTML.Error.raise({
							code : xRTML.Error.Codes.CONNECTION_ADAPT,
							target : this,
							info : {
								className : "xRTML.ConnectionManager.Connection",
								methodName : "process",
								originalMessage : message,
								message : err.message
							}
						})
					}
					this.channels[channel].fire({
						message : {
							message : message
						}
					});
					this.fire({
						message : {
							channel : channel,
							message : message
						}
					});
					if (xRTML.MessageManager.isValid(message)) {
						this.fire({
							xrtmlMessage : {
								message : xRTML.MessageManager.toJson(message).xrtml,
								channel : channel
							}
						})
					}
				} else {
					xRTML.Console.debug("Connection " + this.id + " : Not active. Message received wasn't processed.")
				}
			};
			this.send = function (args) {
				var channel = args.channel,
				content = args.content;
				if (this.isCreated() && this.isConnected()) {
					if (this.active()) {
						var msg = typeof content === "object" ? content.stringify() : content;
						if (args.sendOnly) {
							msg = "_X_SEND_ONLY_X_" + this.internalId + "_X_" + msg
						}
						ortcClient.send(channel, msg);
						xRTML.Console.debug("Connection " + this.id + ": Message sent to channel " + channel);
						xRTML.Console.debug(content)
					} else {
						xRTML.Console.debug("Connection " + this.id + ": Not active. Message not sent to channel " + channel);
						xRTML.Console.debug(content)
					}
				} else {
					setTimeout(proxy(function () {
							proxy(retrySend, this)(args, 0)
						}, this), this.sendInterval);
					xRTML.Console.debug("Connection " + this.id + ": Not ready. Message not sent to channel " + channel + ". Retrying in " + this.sendInterval / 1000 + " seconds.");
					xRTML.Console.debug(content)
				}
				return
			};
			this.connect = function (credentials) {
				if (this.isCreated()) {
					if (credentials) {
						this.appKey = credentials.appKey;
						this.authToken = credentials.authToken
					}
					ortcClient.connect(this.appKey, this.authToken)
				} else {
					xRTML.Error.raise({
						code : xRTML.Error.Codes.ORTC_UNAVAILABLE,
						target : this,
						info : {
							className : "xRTML.ConnectionManager.Connection",
							methodName : "connect"
						}
					})
				}
			};
			this.disconnect = function () {
				this.isConnected() ? ortcClient.disconnect() : xRTML.Error.raise({
					code : xRTML.Error.Codes.ORTC_DISCONNECTED,
					target : this,
					info : {
						className : "xRTML.ConnectionManager.Connection",
						methodName : "disconnect"
					}
				})
			};
			this.subscribe = function (channel) {
				if (!this.channels[channel.name]) {
					channel = this.createChannel(channel)
				}
				ortcClient.subscribe(this.channels[channel.name].name, this.channels[channel.name].subscribeOnReconnect, onMessage)
			};
			this.unsubscribe = function (name) {
				ortcClient.unsubscribe(name)
			};
			this.isCreated = function () {
				return ortcClient != null
			};
			this.isConnected = function () {
				return this.isCreated() ? ortcClient.getIsConnected() : false
			};
			this.isSubscribed = function (channel) {
				return this.isConnected() ? ortcClient.isSubscribed(channel) : false
			};
			this.getMetadata = function () {
				return this.isCreated() ? ortcClient.getConnectionMetadata() : xRTML.Error.raise({
					code : xRTML.Error.Codes.ORTC_UNAVAILABLE,
					target : this,
					info : {
						className : "xRTML.ConnectionManager.Connection",
						methodName : "getMetadata"
					}
				})
			};
			this.setMetadata = function (metadata) {
				return this.isCreated() ? ortcClient.setConnectionMetadata(metadata) : xRTML.Error.raise({
					code : xRTML.Error.Codes.ORTC_UNAVAILABLE,
					target : this,
					info : {
						className : "xRTML.ConnectionManager.Connection",
						methodName : "setMetadata"
					}
				})
			};
			this.getAnnouncementSubChannel = function () {
				return this.isCreated() ? ortcClient.getAnnouncementSubChannel() : xRTML.Error.raise({
					code : xRTML.Error.Codes.ORTC_UNAVAILABLE,
					target : this,
					info : {
						className : "xRTML.ConnectionManager.Connection",
						methodName : "getAnnouncementSubChannel"
					}
				})
			};
			this.getProtocol = function () {
				return this.isConnected() ? ortcClient.getProtocol() : xRTML.Error.raise({
					code : xRTML.Error.Codes.ORTC_UNAVAILABLE,
					target : this,
					info : {
						className : "xRTML.ConnectionManager.Connection",
						methodName : "getProtocol"
					}
				})
			};
			this.setProtocol = function (name) {
				if (this.isCreated()) {
					ortcClient.setProtocol(name)
				}
			};
			if (typeof loadOrtcFactory != "undefined") {
				loadOrtcFactory(this.serverType, proxy(onFactoryLoaded, this))
			} else {
				xRTML.bind({
					ready : proxy(function () {
						proxy(loadOrtcFactory, this)(this.serverType, proxy(onFactoryLoaded, this))
					}, this)
				})
			}
			if (args.attribute("channels")) {
				var chs = args.attribute("channels");
				for (var i = 0; i < chs.length; ++i) {
					this.createChannel(chs[i])
				}
			}
		}
	})(xRTML.ConnectionManager = xRTML.ConnectionManager || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (StorageManager, undefined) {
		var storages = {},
		getById = function (id) {
			for (var key in storages) {
				if (storages[key].id === id) {
					return storages[key]
				}
			}
			xRTML.Console.warn("Storage with id: " + id + " was not found.");
			return undefined
		};
		StorageManager.create = function (configObject) {
			try {
				var storage = new StorageManager[configObject.type || "KeyValuePairStorage"](),
				s = StorageManager.BaseStorage.extend(storage);
				configObject.attribute = function (att) {
					return xRTML.Common.Object.insensitiveGetter(configObject, att)
				};
				s = new s(configObject);
				s.bind({
					dispose : function (e) {
						var sInternalId = e.target.internalId,
						disposedStorage = storages[sInternalId];
						storages[sInternalId] = null;
						delete storages[sInternalId];
						StorageManager.fire({
							storagedispose : {
								storage : e.target
							}
						})
					}
				});
				storages[s.internalId] = s;
				StorageManager.fire({
					storagecreate : {
						storage : s
					}
				});
				return s
			} catch (err) {
				xRTML.Error.raise({
					code : xRTML.Error.Codes.UNEXPECTED,
					info : {
						message : err.message,
						className : "xRTML.StorageManager",
						methodName : "create"
					}
				})
			}
		};
		StorageManager.getById = function (id) {
			return storages[id] || getById(id)
		};
		xRTML.Event.extend(StorageManager)
	})(xRTML.StorageManager = xRTML.StorageManager || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (StorageManager, undefined) {
		var BaseStorage = function () {
			this.init = function (configObject) {
				xRTML.Event.extend(this);
				this.internalId = xRTML.Common.Util.guidGenerator();
				this.id = configObject.attribute("id") || this.internalId;
				this.type = configObject.attribute("type") || "KeyValuePairStorage";
				this.isReady = false;
				var autoConnect = configObject.attribute("autoConnect");
				this.autoConnect = typeof autoConnect != "undefined" ? xRTML.Common.Converter.toBoolean(autoConnect) : true;
				this.dispose = function () {
					this.fire({
						dispose : {}
						
					})
				};
				this.bind({
					ready : xRTML.Common.Function.parse(configObject.attribute("onready")),
					exception : xRTML.Common.Function.parse(configObject.attribute("onexception"))
				})
			}
		};
		StorageManager.BaseStorage = xRTML.Class.extend(new BaseStorage())
	})(xRTML.StorageManager = xRTML.StorageManager || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (StorageManager, undefined) {
		var KeyValuePairStorage = function () {
			this.init = function (configObject) {
				this._super(configObject);
				var baseUrl = configObject.attribute("baseUrl");
				this.baseUrl = !!baseUrl ? (baseUrl[baseUrl.length - 1] == "/" ? baseUrl.substring(0, (baseUrl.length - 1)) : baseUrl) : null;
				xRTML.Common.Validator.validateRequired({
					target : this,
					prop : "baseUrl"
				});
				this.connectionId = configObject.attribute("connectionId");
				this.sessionId = configObject.attribute("sessionId");
				var operationsTimeout = configObject.attribute("operationsTimeout");
				this.operationsTimeout = !!operationsTimeout ? operationsTimeout : 2000;
				this.bind({
					session : xRTML.Common.Function.parse(configObject.attribute("onsession"))
				});
				if (this.autoConnect) {
					this.openConnection()
				}
			};
			var pendingOperations = {};
			var requestsBuffer = [];
			var channelMappings = {
				get : "readRequestChannel",
				set : "writeRequestChannel",
				del : "writeRequestChannel",
				incr : "writeRequestChannel"
			};
			var channels = {
				readRequestChannel : undefined,
				readResponseChannel : undefined,
				writeRequestChannel : undefined,
				writeResponseChannel : undefined
			};
			var connection;
			this.set = function (data, callback) {
				performRemoteDataOperation.call(this, {
					data : data,
					action : "set",
					callback : callback
				})
			};
			this.del = function (query, callback) {
				performRemoteDataOperation.call(this, {
					data : query,
					action : "del",
					callback : callback
				})
			};
			this.incr = function (data, callback) {
				performRemoteDataOperation.call(this, {
					data : data,
					action : "incr",
					callback : callback
				})
			};
			this.get = function (query, callback) {
				performRemoteDataOperation.call(this, {
					data : query,
					action : "get",
					callback : callback
				})
			};
			var performRemoteDataOperation = function (request) {
				if (this.isReady) {
					var opId = xRTML.Common.Util.guidGenerator();
					pendingOperations[opId] = {
						callback : request.callback,
						timeout : setTimeout(xRTML.Common.Function.proxy(function () {
								xRTML.Error.raise({
									code : xRTML.Error.Codes.STORAGE_OPERATION_TIMEOUT,
									target : this,
									info : {
										opId : opId,
										timeout : this.operationsTimeout,
										className : "xRTML.StorageManager.KeyValuePairStorage",
										methodName : "performRemoteDataOperation (internal method, no docs available)"
									}
								})
							}, this), this.operationsTimeout)
					};
					var data = request.data;
					data.namespaceExpire = data.namespaceExpire || 31556926;
					data.opId = opId;
					var message = xRTML.MessageManager.create({
							action : request.action,
							data : data,
							senderId : this.internalId
						});
					connection.send({
						channel : channels[channelMappings[request.action]],
						content : message
					})
				} else {
					requestsBuffer.push(request);
					xRTML.Console.warn("Storage operation placed in buffer. Will only be called when the Storage is ready.")
				}
			};
			var processRemoteDataOperation = function (response) {
				var data = response.data;
				var opId = data.opId;
				data.opId = null;
				delete data.opId;
				var callbackArgs = {
					success : response.success,
					data : response.success ? data : null,
					error : !response.success ? response.data.error : null
				};
				if (pendingOperations[opId] && pendingOperations[opId].callback) {
					pendingOperations[opId].callback(callbackArgs)
				}
				clearTimeout(pendingOperations[opId].timeout);
				pendingOperations[opId] = null;
				delete pendingOperations[opId]
			};
			this.getSession = function (args) {
				xRTML.Common.Request.post({
					url : this.baseUrl + "/getStorageSession",
					data : args,
					crossDomain : true,
					success : xRTML.Common.Function.proxy(function (result) {
						var parsedResult;
						try {
							parsedResult = xRTML.JSON.parse(result)
						} catch (err) {
							xRTML.Error.raise({
								code : xRTML.Error.Codes.JSON_PARSE,
								target : this,
								info : {
									className : "xRTML.StorageManager.KeyValuePairStorage",
									methodName : "getSession",
									message : err.message
								}
							})
						}
						this.sessionId = parsedResult.sessionId;
						this.fire({
							session : {
								sessionId : this.sessionId
							}
						});
						if (args.autoConnect) {
							this.openConnection()
						}
					}, this),
					error : xRTML.Common.Function.proxy(function (error) {
						xRTML.Error.raise({
							code : xRTML.Error.Codes.STORAGE_SESSION,
							target : this,
							info : {
								className : "xRTML.StorageManager.KeyValuePairStorage",
								methodName : "getSession",
								message : error
							}
						})
					}, this)
				})
			};
			this.openConnection = function () {
				if (this.sessionId) {
					xRTML.Common.Request.post({
						url : this.baseUrl + "/openStorageConnection",
						data : {
							sessionId : this.sessionId
						},
						crossDomain : true,
						success : xRTML.Common.Function.proxy(function (result) {
							var parsedResult;
							try {
								parsedResult = xRTML.JSON.parse(result)
							} catch (err) {
								xRTML.Error.raise({
									code : xRTML.Error.Codes.JSON_PARSE,
									target : this,
									info : {
										className : "xRTML.StorageManager.KeyValuePairStorage",
										methodName : "openConnection",
										message : err.message
									}
								})
							}
							channels.readRequestChannel = parsedResult.channels.readRequestChannel;
							channels.readResponseChannel = parsedResult.channels.readResponseChannel;
							channels.writeRequestChannel = parsedResult.channels.writeRequestChannel;
							channels.writeResponseChannel = parsedResult.channels.writeResponseChannel;
							if (!!this.connectionId) {
								connection = xRTML.ConnectionManager.getById(this.connectionId)
							} else {
								var connectionConfig = {
									appKey : parsedResult.appKey,
									authToken : parsedResult.authToken,
									url : parsedResult.url,
									isCluster : parsedResult.isCluster,
									serverType : parsedResult.serverType
								};
								connection = xRTML.ConnectionManager.create(connectionConfig)
							}
							function doWhenConnected(con) {
								con.bind({
									xrtmlMessage : xRTML.Common.Function.proxy(function (e) {
										if (e.channel == channels.readResponseChannel || e.channel == channels.writeResponseChannel) {
											var message = e.message;
											processRemoteDataOperation.call(this, {
												success : message.action == "exception" ? false : true,
												data : message.data
											})
										}
									}, this)
								});
								var readResponseSubscribed = false;
								var writeResponseSubscribed = false;
								con.bind({
									subscribe : xRTML.Common.Function.proxy(function (e) {
										if (e.channel == channels.readResponseChannel) {
											readResponseSubscribed = true
										}
										if (e.channel == channels.writeResponseChannel) {
											writeResponseSubscribed = true
										}
										if (readResponseSubscribed && writeResponseSubscribed) {
											this.isReady = true;
											for (var i = 0, len = requestsBuffer.length; i < len; i++) {
												performRemoteDataOperation.call(this, requestsBuffer[i])
											}
											requestsBuffer = [];
											this.fire({
												ready : {}
												
											})
										}
									}, this)
								});
								con.subscribe({
									name : channels.readResponseChannel
								});
								con.subscribe({
									name : channels.writeResponseChannel
								})
							}
							if (connection.isConnected()) {
								doWhenConnected.call(this, connection)
							} else {
								if (connection.autoConnect) {
									connection.bind({
										connect : xRTML.Common.Function.proxy(function (e) {
											doWhenConnected.call(this, e.target)
										}, this)
									})
								} else {
									connection.bind({
										connect : xRTML.Common.Function.proxy(function (e) {
											doWhenConnected.call(this, e.target)
										}, this)
									});
									function doWhenCreated(con) {
										if (!con.appKey && !con.authToken) {
											con.appKey = parsedResult.appKey;
											con.authToken = parsedResult.authToken
										}
										con.connect()
									}
									if (connection.isCreated()) {
										doWhenCreated.call(this, connection)
									} else {
										connection.bind({
											create : xRTML.Common.Function.proxy(function (e) {
												doWhenCreated.call(this, e.target)
											}, this)
										})
									}
								}
							}
						}, this),
						error : xRTML.Common.Function.proxy(function (error) {
							xRTML.Error.raise({
								code : xRTML.Error.Codes.REQUEST_FAILURE,
								target : this,
								info : {
									className : "xRTML.StorageManager.KeyValuePairStorage",
									methodName : "openConnection",
									message : error
								}
							})
						}, this)
					})
				} else {
					connection = xRTML.ConnectionManager.getById(this.connectionId);
					if (!!connection) {
						var sessionData = {
							appKey : connection.appKey,
							serverUrl : connection.url,
							isCluster : connection.isCluster,
							serverType : connection.serverType,
							timeToLive : 900,
							authenticate : false,
							autoConnect : true
						};
						this.getSession(sessionData)
					} else {
						xRTML.Error.raise({
							code : xRTML.Error.Codes.STORAGE_CONNECTION_UNAVAILABLE,
							target : this,
							info : {
								connectionId : this.connectionId,
								className : "xRTML.StorageManager.KeyValuePairStorage",
								methodName : "openConnection"
							}
						})
					}
				}
			}
		};
		StorageManager.KeyValuePairStorage = KeyValuePairStorage
	})(xRTML.StorageManager = xRTML.StorageManager || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (TagManager, undefined) {
		var tagInstances = {},
		tags = {},
		baseTag = null,
		getById = function (id) {
			for (var key in tagInstances) {
				if (tagInstances[key].id === id) {
					return tagInstances[key]
				}
			}
			xRTML.Console.log("Tag with id: " + id + " was not found.");
			return undefined
		},
		extendMultiple = function (tag) {
			if (tag.base != "Tag") {
				var base = extendMultiple(new tags[tag.base]());
				tag = base.extend(tag)
			} else {
				tag = baseTag.extend(tag)
			}
			return tag
		},
		attribute = function (name) {
			return xRTML.Common.Object.insensitiveGetter(this, name)
		},
		tagBuffer = [];
		if (!xRTML.domLoaded()) {
			function loadTagHandler() {
				var bufferedTag;
				for (var i = 0; i < tagBuffer.length; ++i) {
					bufferedTag = tagBuffer[i];
					xRTML.Console.debug("TagManager: Creating a " + bufferedTag.tagObject.name + " tag after the HTML page has been fully loaded.");
					xRTML.TagManager.create(bufferedTag.tagObject, bufferedTag.fn)
				}
				tagBuffer = [];
				xRTML.Event.unbind(window, {
					load : loadTagHandler
				})
			}
			xRTML.Event.bind(window, {
				load : loadTagHandler
			})
		}
		TagManager.register = function (tagClass) {
			var className = tagClass.name;
			if (className) {
				if (className != "Tag") {
					if (!tags[className]) {
						if (!tagClass.base) {
							tagClass.base = "Tag"
						}
						tags[className] = tagClass.struct;
						tags[className].prototype.base = tagClass.base;
						tags[className].prototype.name = tagClass.name;
						tags[className].prototype["abstract"] = tagClass["abstract"] || false
					}
				} else {
					baseTag = tagClass.struct
				}
			} else {
				xRTML.Error.raise({
					code : xRTML.Error.Codes.TAG_INVALID_CONFIG,
					target : this,
					info : {
						message : "Please provide the tag name.",
						className : "xRTML.TagManager",
						methodName : "register"
					}
				})
			}
		};
		TagManager.create = function (tagObject, fn) {
			try {
				if ((tagObject.target || tagObject.template) && !xRTML.domLoaded()) {
					tagBuffer.push({
						tagObject : tagObject,
						fn : fn
					});
					xRTML.Console.debug("TagManager: Creating a " + tagObject.name + " tag was postponed until HTML page has been fully loaded.");
					return
				}
				tagObject.attribute = attribute;
				if (!tags[tagObject.name]) {
					throw xRTML.Error.raise({
						code : xRTML.Error.Codes.TAG_UNREGISTERED,
						info : {
							tagName : tagObject.name,
							className : "xRTML.TagManager",
							methodName : "create"
						}
					})
				}
				var tag = new tags[tagObject.name]();
				if (!!tag["abstract"]) {
					throw xRTML.Error.raise({
						code : xRTML.Error.Codes.TAG_ABSTRACT,
						target : this,
						info : {
							tag : tag,
							className : "xRTML.TagManager",
							methodName : "create"
						}
					})
				}
				var xrtmlTag = tag.base == "Tag" ? baseTag.extend(tag) : extendMultiple(tag);
				xrtmlTag = new xrtmlTag(tagObject);
				xrtmlTag.fire({
					postInit : {}
					
				});
				xrtmlTag.bind({
					dispose : function (e) {
						var tagInternalId = e.target.internalId,
						disposedTag = tagInstances[tagInternalId];
						tagInstances[tagInternalId] = null;
						delete tagInstances[tagInternalId];
						TagManager.fire({
							tagDispose : {
								tag : e.target
							}
						})
					}
				});
				tagInstances[xrtmlTag.internalId] = xrtmlTag;
				TagManager.fire({
					tagCreate : {
						tag : xrtmlTag
					}
				});
				if (fn) {
					fn(xrtmlTag)
				}
			} catch (err) {
				xRTML.Error.raise({
					code : xRTML.Error.Codes.TAG_NOT_CREATED,
					target : this,
					info : {
						id : tagObject.id,
						className : "xRTML.TagManager." + tagObject.name,
						methodName : "init",
						message : err.message,
						tagConfig : tagObject
					}
				})
			}
		};
		TagManager.getById = function (id) {
			return tagInstances[id] || getById(id)
		};
		TagManager.getClasses = function () {
			var tagClasses = [];
			for (var tagClass in tags) {
				tagClasses.push(tagClass)
			}
			return tagClasses
		};
		xRTML.Event.extend(TagManager);
		xRTML.DomParser.bind({
			tagsLoad : function (e) {
				var tags = e.tags;
				for (var i = 0; i < tags.length; ++i) {
					TagManager.create(tags[i])
				}
			}
		})
	})(xRTML.TagManager = xRTML.TagManager || {})
})(window.xRTML = window.xRTML || {});
xRTML.TagManager.register({
	name : "Tag",
	"abstract" : true,
	struct : xRTML.Class.extend(new function () {
		this.init = function (tagObject) {
			xRTML.Event.extend(this);
			var toFunction = xRTML.Common.Function.parse;
			this.bind({
				preInit : toFunction(tagObject.attribute("onPreInit")),
				postInit : toFunction(tagObject.attribute("onPostInit")),
				active : toFunction(tagObject.attribute("onActive")),
				preProcess : toFunction(tagObject.attribute("onPreProcess")),
				postProcess : toFunction(tagObject.attribute("onPostProcess")),
				dispose : toFunction(tagObject.attribute("onDispose"))
			});
			this.fire({
				preInit : {}
				
			});
			this.internalId = xRTML.Common.Util.guidGenerator();
			this.id = tagObject.attribute("id") || this.internalId;
			this.connections = tagObject.attribute("connections") || [];
			this.channelId = tagObject.attribute("channelId");
			this.triggers = tagObject.attribute("triggers") || [];
			this.receiveOwnMessages = !!tagObject.attribute("receiveOwnMessages");
			this.target = (function () {
				var target = xRTML.Sizzle(tagObject.attribute("target"));
				if (target.length == 0) {
					target.push(document.body)
				}
				return target
			})();
			this.active = tagObject.attribute("active") ? xRTML.Common.Converter.toBoolean(tagObject.attribute("active")) : true
		};
		this.activate = function (data) {
			this.active = xRTML.Common.Converter.toBoolean(data.active);
			this.fire({
				active : {
					value : this.active
				}
			})
		};
		this.process = function (data) {};
		this.sendMessage = function (message) {
			xRTML.ConnectionManager.sendMessage({
				connections : message.connectionId ? [message.connectionId] : this.connections,
				channel : message.channel || this.channelId,
				content : xRTML.MessageManager.create({
					trigger : message.trigger ? [message.trigger] : this.triggers,
					action : message.action,
					data : message.data,
					senderId : this.internalId
				})
			})
		};
		this.dispose = function () {
			this.target = null;
			this.fire({
				dispose : {}
				
			})
		};
		this.registerTrigger = function (trigger) {
			xRTML.MessageBroker.registerTrigger({
				name : trigger,
				tagId : this.internalId
			})
		};
		this.unregisterTrigger = function (trigger) {
			xRTML.MessageBroker.unregisterTrigger({
				name : trigger,
				tagId : this.internalId
			})
		}
	})
});
(function (xRTML, undefined) {
	(function (MessageBroker, undefined) {
		var triggers = {},
		triggerCall = function (trigger) {
			if (triggers[trigger.name]) {
				for (var tagId in triggers[trigger.name]) {
					var tag = xRTML.TagManager.getById(tagId),
					message = trigger.message;
					if (tag.active || message.data.action == "activate") {
						if (tag.receiveOwnMessages || !message.senderId || tag.internalId !== message.senderId) {
							var data = message.data,
							action = message.action;
							tag.fire({
								preProcess : data
							});
							if (action) {
								tag[action] ? tag[action].call(tag, data) : xRTML.Error.raise({
									code : xRTML.Error.Codes.TAG_ACTION_UNDEFINED,
									target : tag,
									info : {
										action : action,
										className : "xRTML.MessageBroker",
										methodName : "triggerCall (internal method, no docs available)"
									}
								})
							} else {
								tag.process(data)
							}
							tag.fire({
								postProcess : data
							})
						}
					} else {
						xRTML.Error.raise({
							code : xRTML.Error.Codes.TAG_INACTIVE,
							target : tag,
							className : "xRTML.MessageBroker",
							methodName : "triggerCall (internal method, no docs available)"
						})
					}
				}
			} else {
				xRTML.Console.debug("Trigger " + trigger.name + " is not registered with any xRTML Tag.")
			}
		},
		registerTriggers = function (e) {
			var tag = e.tag,
			trigger;
			for (var i = 0; i < tag.triggers.length; ++i) {
				trigger = tag.triggers[i];
				MessageBroker.registerTrigger({
					tagId : tag.internalId,
					name : trigger
				})
			}
		},
		unregisterTriggers = function (e) {
			var tag = e.tag,
			trigger;
			for (var i = 0; i < tag.triggers.length; ++i) {
				trigger = tag.triggers[i];
				MessageBroker.unregisterTrigger({
					tagId : tag.internalId,
					name : trigger
				})
			}
		},
		triggerTags = function (e) {
			var tNames = e.message.trigger;
			if (typeof tNames == "string") {
				triggerCall({
					name : tNames,
					message : e.message
				})
			} else {
				if (tNames instanceof Array) {
					for (var i = 0; i < tNames.length; ++i) {
						e.message.trigger = tNames[i];
						triggerCall({
							name : tNames[i],
							message : e.message
						})
					}
				}
			}
		};
		MessageBroker.registerTrigger = function (trigger) {
			if (!triggers[trigger.name]) {
				triggers[trigger.name] = {}
				
			}
			triggers[trigger.name][trigger.tagId] = undefined;
			MessageBroker.fire({
				triggerRegister : {
					trigger : trigger
				}
			})
		};
		MessageBroker.unregisterTrigger = function (trigger) {
			var mbTrigger = triggers[trigger.name];
			if (!mbTrigger) {
				xRTML.Console.warn("The trigger " + trigger.name + " is not registered.");
				return
			}
			if (mbTrigger.hasOwnProperty(trigger.tagId)) {
				delete triggers[trigger.name][trigger.tagId];
				if (!xRTML.Common.Object.keys(mbTrigger).length) {
					delete triggers[trigger.name]
				}
				MessageBroker.fire({
					triggerUnregister : {
						trigger : trigger
					}
				})
			} else {
				xRTML.Console.warn("The tag " + trigger.tagId + " is not listening to messages with the trigger " + trigger.name + ".")
			}
		};
		xRTML.Event.extend(MessageBroker);
		xRTML.TagManager.bind({
			tagCreate : registerTriggers,
			tagDispose : unregisterTriggers
		});
		xRTML.ConnectionManager.bind({
			xrtmlMessage : triggerTags
		})
	})(xRTML.MessageBroker = xRTML.MessageBroker || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (MessageManager, undefined) {
		MessageManager.isValid = function (message) {
			try {
				if (typeof message === "string") {
					var firstProp = message.substring(message.indexOf('"'), message.indexOf('"', message.indexOf('"') + 1) + 1);
					if ('"xrtml"' != xRTML.Common.String.trim(firstProp)) {
						return false
					}
					xRTML.JSON.parse(message);
					return true
				}
				if ((typeof message === "object") && message.xrtml) {
					return true
				}
				return false
			} catch (err) {
				xRTML.Error.raise({
					code : xRTML.Error.Codes.INVALID_MESSAGE,
					target : this,
					message : err.message,
					info : {
						className : "xRTML.MessageManager",
						methodName : "isValid"
					}
				})
			}
		};
		MessageManager.toJson = function (message) {
			if (typeof message === "string" && MessageManager.isValid(message)) {
				var m = xRTML.JSON.parse(message).xrtml;
				var xrtmlMessage = {
					xrtml : {
						senderId : m.s,
						trigger : m.t,
						action : m.a,
						data : m.d
					}
				};
				return xrtmlMessage
			}
			return message
		};
		MessageManager.stringify = function (message) {
			var xrtmlMessage = {
				xrtml : {
					s : message.senderId,
					t : message.trigger,
					a : message.action,
					d : message.data && typeof message.data != "object" ? xRTML.JSON.parse(message.data) : message.data
				}
			};
			return xRTML.JSON.stringify(xrtmlMessage)
		};
		MessageManager.create = function (message) {
			message.data = message.data && typeof message.data != "object" ? xRTML.JSON.parse(message.data) : message.data;
			message.stringify = function () {
				return MessageManager.stringify(this)
			};
			return message
		}
	})(xRTML.MessageManager = xRTML.MessageManager || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (TraceMonitor, undefined) {
		var sendTrace = function (message, obj) {
			if (xRTML.Config.remoteTrace) {
				var data = null;
				try {
					data = xRTML.JSON.stringify(obj)
				} catch (e) {}
				
				var xrtmlMessage = xRTML.MessageManager.create({
						data : {
							message : message,
							content : data
						}
					});
				xRTML.ConnectionManager.sendMessage(xRTML.TraceMonitor.channelId, xrtmlMessage)
			}
		};
		TraceMonitor.channelId = "trace";
		xRTML.Console.bind({
			error : function (e) {
				sendTrace("Error", e.error)
			}
		});
		xRTML.ConnectionManager.bind({
			connectionCreate : function (evt) {
				var connection = evt.connection;
				sendTrace("Connection found: \n AppKey: " + connection.appKey + " \n AuthToken: " + connection.authToken + " \n Url: " + connection.url, connection);
				connection.bind({
					create : function (e) {
						var statement = "Connection " + e.target.id + " created. " + (e.target.autoConnect ? "Connecting..." : "Waiting for explicit connect...");
						xRTML.Console.debug(statement);
						sendTrace(statement, e.target)
					},
					connect : function (e) {
						var statement = "Connection " + e.target.id + " established. Using " + e.target.getProtocol() + " protocol.";
						xRTML.Console.debug(statement);
						sendTrace(statement, e.target)
					},
					disconnect : function (e) {
						var statement = "Connection " + e.target.id + " closed.";
						xRTML.Console.debug(statement);
						sendTrace(statement, e.target)
					},
					subscribe : function (e) {
						var statement = "Connection " + e.target.id + ": Channel " + e.channel + " subscribed.";
						xRTML.Console.debug(statement);
						sendTrace(statement, e.target)
					},
					unsubscribe : function (e) {
						var statement = "Connection " + e.target.id + ": Channel " + e.channel + " unsubscribed.";
						xRTML.Console.debug(statement);
						sendTrace(statement, e.target)
					},
					exception : function (e) {
						var statement = "Connection " + e.target.id + " threw an exception: " + e.event;
						xRTML.Console.debug(statement);
						sendTrace(statement, e.target)
					},
					reconnect : function (e) {
						var statement = "Connection " + e.target.id + " is restored. Using " + e.target.getProtocol() + " protocol.";
						xRTML.Console.debug(statement);
						sendTrace(statement, e.target)
					},
					reconnecting : function (e) {
						var statement = "Connection " + e.target.id + " was lost. ";
						if (e.target.connectionAttemptsCounter >= e.target.connectAttempts) {
							statement += "Maximum number of attempts reached: " + e.target.connectAttempts + " Stop trying to reconnect."
						} else {
							statement += "Trying to reconnect. Attempt " + e.target.connectionAttemptsCounter + " out of " + e.target.connectAttempts
						}
						xRTML.Console.debug(statement);
						sendTrace(statement, e.target)
					},
					message : function (e) {
						var info = "Connection " + e.target.id + ": Message received from channel " + e.channel,
						message;
						try {
							message = xRTML.JSON.parse(e.message)
						} catch (err) {
							message = e.message
						}
						xRTML.Console.debug(info);
						xRTML.Console.debug(message);
						sendTrace(message, e.target)
					},
					xrtmlMessage : function (e) {
						var info = "Connection " + e.target.id + ": xRTML Message received from channel " + e.channel;
						xRTML.Console.debug(info);
						xRTML.Console.debug(e.message);
						sendTrace(e.message, e.target)
					}
				})
			}
		});
		var debugMessage = function (e) {
			var info = "Tag " + e.target.id + ": " + e.type + " message";
			xRTML.Console.debug(info);
			xRTML.Console.debug(e.data);
			sendTrace(info, e.data)
		};
		xRTML.TagManager.bind({
			tagCreate : function (e) {
				var tag = e.tag;
				xRTML.Console.debug("Tag of type " + tag.name + " created with id " + (tag.id || tag.internalId));
				xRTML.Console.debug(tag);
				tag.bind({
					init : function (e) {
						xRTML.Console.debug("")
					},
					load : function (e) {
						xRTML.Console.debug("")
					},
					active : function (e) {
						xRTML.Console.debug("")
					},
					process : debugMessage,
					preProcess : debugMessage,
					postProcess : debugMessage
				})
			},
			tagDispose : function (e) {
				var tag = e.tag,
				statement = "Tag of type " + e.name + " with id " + (tag.id || tag.internalId) + " disposed.";
				xRTML.Console.debug(statement);
				sendTrace(statement, e.tag)
			}
		});
		xRTML.MessageBroker.bind({
			triggerRegister : function (e) {
				var statement = "Tag " + e.trigger.tagId + " registered trigger: " + e.trigger.name;
				xRTML.Console.debug(statement);
				sendTrace(statement, e.target)
			},
			triggerUnregister : function (e) {
				var statement = "Tag " + e.trigger.tagId + " unregistered trigger: " + e.trigger.name;
				xRTML.Console.debug(statement);
				sendTrace(statement, e.target)
			}
		});
		xRTML.DomParser.bind({
			configLoad : function (e) {
				xRTML.Console.debug("DOM Parser: the following connections were read from DOM: ");
				xRTML.Console.debug(e.config.connections);
				xRTML.Console.debug("DOM Parser: the following storages were read from DOM: ");
				xRTML.Console.debug(e.config.storages)
			},
			tagsLoad : function (e) {
				xRTML.Console.debug("DOM Parser: the following tags were read from DOM: ");
				xRTML.Console.debug(e.tags)
			}
		})
	})(xRTML.TraceMonitor = xRTML.TraceMonitor || {})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	var init = function () {
		xRTML.isReady = true;
		xRTML.fire({
			ready : {}
			
		})
	};
	(typeof loadOrtcFactory == "undefined") ? xRTML.Config.ortcLibrary(((document.location.protocol == "file:") ? "http:" : document.location.protocol) + "//dfdbz2tdq3k01.cloudfront.net/js/2.1.0/ortc.js", init) : init();
	var complete = function () {
		xRTML.DomParser.read();
		if (xRTML.isReady) {
			xRTML.isLoaded = true;
			xRTML.fire({
				load : {}
				
			})
		} else {
			xRTML.ready(function () {
				xRTML.isLoaded = true;
				xRTML.fire({
					load : {}
					
				})
			})
		}
	};
	xRTML.domLoaded() ? complete() : xRTML.Event.bind(window, {
		load : complete
	})
})(window.xRTML = window.xRTML || {});
(function (xRTML, undefined) {
	(function (Templating, undefined) {
		var _privateKo = undefined;
		(function (window, document, navigator, undefined) {
			var DEBUG = true;
			!function (factory) {
				factory(_privateKo = {})
			}
			(function (koExports) {
				var ko = typeof koExports !== "undefined" ? koExports : {};
				ko.exportSymbol = function (koPath, object) {
					var tokens = koPath.split(".");
					var target = ko;
					for (var i = 0; i < tokens.length - 1; i++) {
						target = target[tokens[i]]
					}
					target[tokens[tokens.length - 1]] = object
				};
				ko.exportProperty = function (owner, publicName, object) {
					owner[publicName] = object
				};
				ko.version = "2.1.0";
				ko.exportSymbol("version", ko.version);
				ko.utils = new(function () {
						var stringTrimRegex = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
						var knownEvents = {},
						knownEventTypesByEventName = {};
						var keyEventTypeName = /Firefox\/2/i.test(navigator.userAgent) ? "KeyboardEvent" : "UIEvents";
						knownEvents[keyEventTypeName] = ["keyup", "keydown", "keypress"];
						knownEvents.MouseEvents = ["click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave"];
						for (var eventType in knownEvents) {
							var knownEventsForType = knownEvents[eventType];
							if (knownEventsForType.length) {
								for (var i = 0, j = knownEventsForType.length; i < j; i++) {
									knownEventTypesByEventName[knownEventsForType[i]] = eventType
								}
							}
						}
						var eventsThatMustBeRegisteredUsingAttachEvent = {
							propertychange : true
						};
						var ieVersion = (function () {
							var version = 3,
							div = document.createElement("div"),
							iElems = div.getElementsByTagName("i");
							while (div.innerHTML = "<!--[if gt IE " + (++version) + "]><i></i><![endif]-->", iElems[0]) {}
							
							return version > 4 ? version : undefined
						}
							());
						var isIe6 = ieVersion === 6,
						isIe7 = ieVersion === 7;
						function isClickOnCheckableElement(element, eventType) {
							if ((ko.utils.tagNameLower(element) !== "input") || !element.type) {
								return false
							}
							if (eventType.toLowerCase() != "click") {
								return false
							}
							var inputType = element.type;
							return (inputType == "checkbox") || (inputType == "radio")
						}
						return {
							fieldsIncludedWithJsonPost : ["authenticity_token", /^__RequestVerificationToken(_.*)?$/],
							arrayForEach : function (array, action) {
								for (var i = 0, j = array.length; i < j; i++) {
									action(array[i])
								}
							},
							arrayIndexOf : function (array, item) {
								if (typeof Array.prototype.indexOf == "function") {
									return Array.prototype.indexOf.call(array, item)
								}
								for (var i = 0, j = array.length; i < j; i++) {
									if (array[i] === item) {
										return i
									}
								}
								return -1
							},
							arrayFirst : function (array, predicate, predicateOwner) {
								for (var i = 0, j = array.length; i < j; i++) {
									if (predicate.call(predicateOwner, array[i])) {
										return array[i]
									}
								}
								return null
							},
							arrayRemoveItem : function (array, itemToRemove) {
								var index = ko.utils.arrayIndexOf(array, itemToRemove);
								if (index >= 0) {
									array.splice(index, 1)
								}
							},
							arrayGetDistinctValues : function (array) {
								array = array || [];
								var result = [];
								for (var i = 0, j = array.length; i < j; i++) {
									if (ko.utils.arrayIndexOf(result, array[i]) < 0) {
										result.push(array[i])
									}
								}
								return result
							},
							arrayMap : function (array, mapping) {
								array = array || [];
								var result = [];
								for (var i = 0, j = array.length; i < j; i++) {
									result.push(mapping(array[i]))
								}
								return result
							},
							arrayFilter : function (array, predicate) {
								array = array || [];
								var result = [];
								for (var i = 0, j = array.length; i < j; i++) {
									if (predicate(array[i])) {
										result.push(array[i])
									}
								}
								return result
							},
							arrayPushAll : function (array, valuesToPush) {
								if (valuesToPush instanceof Array) {
									array.push.apply(array, valuesToPush)
								} else {
									for (var i = 0, j = valuesToPush.length; i < j; i++) {
										array.push(valuesToPush[i])
									}
								}
								return array
							},
							extend : function (target, source) {
								if (source) {
									for (var prop in source) {
										if (source.hasOwnProperty(prop)) {
											target[prop] = source[prop]
										}
									}
								}
								return target
							},
							emptyDomNode : function (domNode) {
								while (domNode.firstChild) {
									ko.removeNode(domNode.firstChild)
								}
							},
							moveCleanedNodesToContainerElement : function (nodes) {
								var nodesArray = ko.utils.makeArray(nodes);
								var container = document.createElement("div");
								for (var i = 0, j = nodesArray.length; i < j; i++) {
									ko.cleanNode(nodesArray[i]);
									container.appendChild(nodesArray[i])
								}
								return container
							},
							setDomNodeChildren : function (domNode, childNodes) {
								ko.utils.emptyDomNode(domNode);
								if (childNodes) {
									for (var i = 0, j = childNodes.length; i < j; i++) {
										domNode.appendChild(childNodes[i])
									}
								}
							},
							replaceDomNodes : function (nodeToReplaceOrNodeArray, newNodesArray) {
								var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
								if (nodesToReplaceArray.length > 0) {
									var insertionPoint = nodesToReplaceArray[0];
									var parent = insertionPoint.parentNode;
									for (var i = 0, j = newNodesArray.length; i < j; i++) {
										parent.insertBefore(newNodesArray[i], insertionPoint)
									}
									for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
										ko.removeNode(nodesToReplaceArray[i])
									}
								}
							},
							setOptionNodeSelectionState : function (optionNode, isSelected) {
								if (navigator.userAgent.indexOf("MSIE 6") >= 0) {
									optionNode.setAttribute("selected", isSelected)
								} else {
									optionNode.selected = isSelected
								}
							},
							stringTrim : function (string) {
								return (string || "").replace(stringTrimRegex, "")
							},
							stringTokenize : function (string, delimiter) {
								var result = [];
								var tokens = (string || "").split(delimiter);
								for (var i = 0, j = tokens.length; i < j; i++) {
									var trimmed = ko.utils.stringTrim(tokens[i]);
									if (trimmed !== "") {
										result.push(trimmed)
									}
								}
								return result
							},
							stringStartsWith : function (string, startsWith) {
								string = string || "";
								if (startsWith.length > string.length) {
									return false
								}
								return string.substring(0, startsWith.length) === startsWith
							},
							buildEvalWithinScopeFunction : function (expression, scopeLevels) {
								var functionBody = "return (" + expression + ")";
								for (var i = 0; i < scopeLevels; i++) {
									functionBody = "with(sc[" + i + "]) { " + functionBody + " } "
								}
								return new Function("sc", functionBody)
							},
							domNodeIsContainedBy : function (node, containedByNode) {
								if (containedByNode.compareDocumentPosition) {
									return (containedByNode.compareDocumentPosition(node) & 16) == 16
								}
								while (node != null) {
									if (node == containedByNode) {
										return true
									}
									node = node.parentNode
								}
								return false
							},
							domNodeIsAttachedToDocument : function (node) {
								return ko.utils.domNodeIsContainedBy(node, node.ownerDocument)
							},
							tagNameLower : function (element) {
								return element && element.tagName && element.tagName.toLowerCase()
							},
							registerEventHandler : function (element, eventType, handler) {
								var mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
								if (!mustUseAttachEvent && typeof jQuery != "undefined") {
									if (isClickOnCheckableElement(element, eventType)) {
										var originalHandler = handler;
										handler = function (event, eventData) {
											var jQuerySuppliedCheckedState = this.checked;
											if (eventData) {
												this.checked = eventData.checkedStateBeforeEvent !== true
											}
											originalHandler.call(this, event);
											this.checked = jQuerySuppliedCheckedState
										}
									}
									jQuery(element)["bind"](eventType, handler)
								} else {
									if (!mustUseAttachEvent && typeof element.addEventListener == "function") {
										element.addEventListener(eventType, handler, false)
									} else {
										if (typeof element.attachEvent != "undefined") {
											element.attachEvent("on" + eventType, function (event) {
												handler.call(element, event)
											})
										} else {
											throw new Error("Browser doesn't support addEventListener or attachEvent")
										}
									}
								}
							},
							triggerEvent : function (element, eventType) {
								if (!(element && element.nodeType)) {
									throw new Error("element must be a DOM node when calling triggerEvent")
								}
								if (typeof jQuery != "undefined") {
									var eventData = [];
									if (isClickOnCheckableElement(element, eventType)) {
										eventData.push({
											checkedStateBeforeEvent : element.checked
										})
									}
									jQuery(element)["trigger"](eventType, eventData)
								} else {
									if (typeof document.createEvent == "function") {
										if (typeof element.dispatchEvent == "function") {
											var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
											var event = document.createEvent(eventCategory);
											event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
											element.dispatchEvent(event)
										} else {
											throw new Error("The supplied element doesn't support dispatchEvent")
										}
									} else {
										if (typeof element.fireEvent != "undefined") {
											if (isClickOnCheckableElement(element, eventType)) {
												element.checked = element.checked !== true
											}
											element.fireEvent("on" + eventType)
										} else {
											throw new Error("Browser doesn't support triggering events")
										}
									}
								}
							},
							unwrapObservable : function (value) {
								return ko.isObservable(value) ? value() : value
							},
							toggleDomNodeCssClass : function (node, className, shouldHaveClass) {
								var currentClassNames = (node.className || "").split(/\s+/);
								var hasClass = ko.utils.arrayIndexOf(currentClassNames, className) >= 0;
								if (shouldHaveClass && !hasClass) {
									node.className += (currentClassNames[0] ? " " : "") + className
								} else {
									if (hasClass && !shouldHaveClass) {
										var newClassName = "";
										for (var i = 0; i < currentClassNames.length; i++) {
											if (currentClassNames[i] != className) {
												newClassName += currentClassNames[i] + " "
											}
										}
										node.className = ko.utils.stringTrim(newClassName)
									}
								}
							},
							setTextContent : function (element, textContent) {
								var value = ko.utils.unwrapObservable(textContent);
								if ((value === null) || (value === undefined)) {
									value = ""
								}
								"innerText" in element ? element.innerText = value : element.textContent = value;
								if (ieVersion >= 9) {
									element.style.display = element.style.display
								}
							},
							ensureSelectElementIsRenderedCorrectly : function (selectElement) {
								if (ieVersion >= 9) {
									var originalWidth = selectElement.style.width;
									selectElement.style.width = 0;
									selectElement.style.width = originalWidth
								}
							},
							range : function (min, max) {
								min = ko.utils.unwrapObservable(min);
								max = ko.utils.unwrapObservable(max);
								var result = [];
								for (var i = min; i <= max; i++) {
									result.push(i)
								}
								return result
							},
							makeArray : function (arrayLikeObject) {
								var result = [];
								for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
									result.push(arrayLikeObject[i])
								}
								return result
							},
							isIe6 : isIe6,
							isIe7 : isIe7,
							ieVersion : ieVersion,
							getFormFields : function (form, fieldName) {
								var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
								var isMatchingField = (typeof fieldName == "string") ? function (field) {
									return field.name === fieldName
								}
								 : function (field) {
									return fieldName.test(field.name)
								};
								var matches = [];
								for (var i = fields.length - 1; i >= 0; i--) {
									if (isMatchingField(fields[i])) {
										matches.push(fields[i])
									}
								}
								return matches
							},
							parseJson : function (jsonString) {
								if (typeof jsonString == "string") {
									jsonString = ko.utils.stringTrim(jsonString);
									if (jsonString) {
										if (window.JSON && window.JSON.parse) {
											return window.JSON.parse(jsonString)
										}
										return (new Function("return " + jsonString))()
									}
								}
								return null
							},
							stringifyJson : function (data, replacer, space) {
								if ((typeof JSON == "undefined") || (typeof JSON.stringify == "undefined")) {
									throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js")
								}
								return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space)
							},
							postJson : function (urlOrForm, data, options) {
								options = options || {};
								var params = options.params || {};
								var includeFields = options.includeFields || this.fieldsIncludedWithJsonPost;
								var url = urlOrForm;
								if ((typeof urlOrForm == "object") && (ko.utils.tagNameLower(urlOrForm) === "form")) {
									var originalForm = urlOrForm;
									url = originalForm.action;
									for (var i = includeFields.length - 1; i >= 0; i--) {
										var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
										for (var j = fields.length - 1; j >= 0; j--) {
											params[fields[j].name] = fields[j].value
										}
									}
								}
								data = ko.utils.unwrapObservable(data);
								var form = document.createElement("form");
								form.style.display = "none";
								form.action = url;
								form.method = "post";
								for (var key in data) {
									var input = document.createElement("input");
									input.name = key;
									input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
									form.appendChild(input)
								}
								for (var key in params) {
									var input = document.createElement("input");
									input.name = key;
									input.value = params[key];
									form.appendChild(input)
								}
								document.body.appendChild(form);
								options.submitter ? options.submitter(form) : form.submit();
								setTimeout(function () {
									form.parentNode.removeChild(form)
								}, 0)
							}
						}
					})();
				ko.exportSymbol("utils", ko.utils);
				ko.exportSymbol("utils.arrayForEach", ko.utils.arrayForEach);
				ko.exportSymbol("utils.arrayFirst", ko.utils.arrayFirst);
				ko.exportSymbol("utils.arrayFilter", ko.utils.arrayFilter);
				ko.exportSymbol("utils.arrayGetDistinctValues", ko.utils.arrayGetDistinctValues);
				ko.exportSymbol("utils.arrayIndexOf", ko.utils.arrayIndexOf);
				ko.exportSymbol("utils.arrayMap", ko.utils.arrayMap);
				ko.exportSymbol("utils.arrayPushAll", ko.utils.arrayPushAll);
				ko.exportSymbol("utils.arrayRemoveItem", ko.utils.arrayRemoveItem);
				ko.exportSymbol("utils.extend", ko.utils.extend);
				ko.exportSymbol("utils.fieldsIncludedWithJsonPost", ko.utils.fieldsIncludedWithJsonPost);
				ko.exportSymbol("utils.getFormFields", ko.utils.getFormFields);
				ko.exportSymbol("utils.postJson", ko.utils.postJson);
				ko.exportSymbol("utils.parseJson", ko.utils.parseJson);
				ko.exportSymbol("utils.registerEventHandler", ko.utils.registerEventHandler);
				ko.exportSymbol("utils.stringifyJson", ko.utils.stringifyJson);
				ko.exportSymbol("utils.range", ko.utils.range);
				ko.exportSymbol("utils.toggleDomNodeCssClass", ko.utils.toggleDomNodeCssClass);
				ko.exportSymbol("utils.triggerEvent", ko.utils.triggerEvent);
				ko.exportSymbol("utils.unwrapObservable", ko.utils.unwrapObservable);
				if (!Function.prototype.bind) {
					Function.prototype.bind = function (object) {
						var originalFunction = this,
						args = Array.prototype.slice.call(arguments),
						object = args.shift();
						return function () {
							return originalFunction.apply(object, args.concat(Array.prototype.slice.call(arguments)))
						}
					}
				}
				ko.utils.domData = new(function () {
						var uniqueId = 0;
						var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
						var dataStore = {};
						return {
							get : function (node, key) {
								var allDataForNode = ko.utils.domData.getAll(node, false);
								return allDataForNode === undefined ? undefined : allDataForNode[key]
							},
							set : function (node, key, value) {
								if (value === undefined) {
									if (ko.utils.domData.getAll(node, false) === undefined) {
										return
									}
								}
								var allDataForNode = ko.utils.domData.getAll(node, true);
								allDataForNode[key] = value
							},
							getAll : function (node, createIfNotFound) {
								var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
								var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null");
								if (!hasExistingDataStore) {
									if (!createIfNotFound) {
										return undefined
									}
									dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
									dataStore[dataStoreKey] = {}
									
								}
								return dataStore[dataStoreKey]
							},
							clear : function (node) {
								var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
								if (dataStoreKey) {
									delete dataStore[dataStoreKey];
									node[dataStoreKeyExpandoPropertyName] = null
								}
							}
						}
					})();
				ko.exportSymbol("utils.domData", ko.utils.domData);
				ko.exportSymbol("utils.domData.clear", ko.utils.domData.clear);
				ko.utils.domNodeDisposal = new(function () {
						var domDataKey = "__ko_domNodeDisposal__" + (new Date).getTime();
						var cleanableNodeTypes = {
							1 : true,
							8 : true,
							9 : true
						};
						var cleanableNodeTypesWithDescendants = {
							1 : true,
							9 : true
						};
						function getDisposeCallbacksCollection(node, createIfNotFound) {
							var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
							if ((allDisposeCallbacks === undefined) && createIfNotFound) {
								allDisposeCallbacks = [];
								ko.utils.domData.set(node, domDataKey, allDisposeCallbacks)
							}
							return allDisposeCallbacks
						}
						function destroyCallbacksCollection(node) {
							ko.utils.domData.set(node, domDataKey, undefined)
						}
						function cleanSingleNode(node) {
							var callbacks = getDisposeCallbacksCollection(node, false);
							if (callbacks) {
								callbacks = callbacks.slice(0);
								for (var i = 0; i < callbacks.length; i++) {
									callbacks[i](node)
								}
							}
							ko.utils.domData.clear(node);
							if ((typeof jQuery == "function") && (typeof jQuery.cleanData == "function")) {
								jQuery.cleanData([node])
							}
							if (cleanableNodeTypesWithDescendants[node.nodeType]) {
								cleanImmediateCommentTypeChildren(node)
							}
						}
						function cleanImmediateCommentTypeChildren(nodeWithChildren) {
							var child,
							nextChild = nodeWithChildren.firstChild;
							while (child = nextChild) {
								nextChild = child.nextSibling;
								if (child.nodeType === 8) {
									cleanSingleNode(child)
								}
							}
						}
						return {
							addDisposeCallback : function (node, callback) {
								if (typeof callback != "function") {
									throw new Error("Callback must be a function")
								}
								getDisposeCallbacksCollection(node, true).push(callback)
							},
							removeDisposeCallback : function (node, callback) {
								var callbacksCollection = getDisposeCallbacksCollection(node, false);
								if (callbacksCollection) {
									ko.utils.arrayRemoveItem(callbacksCollection, callback);
									if (callbacksCollection.length == 0) {
										destroyCallbacksCollection(node)
									}
								}
							},
							cleanNode : function (node) {
								if (cleanableNodeTypes[node.nodeType]) {
									cleanSingleNode(node);
									if (cleanableNodeTypesWithDescendants[node.nodeType]) {
										var descendants = [];
										ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
										for (var i = 0, j = descendants.length; i < j; i++) {
											cleanSingleNode(descendants[i])
										}
									}
								}
							},
							removeNode : function (node) {
								ko.cleanNode(node);
								if (node.parentNode) {
									node.parentNode.removeChild(node)
								}
							}
						}
					})();
				ko.cleanNode = ko.utils.domNodeDisposal.cleanNode;
				ko.removeNode = ko.utils.domNodeDisposal.removeNode;
				ko.exportSymbol("cleanNode", ko.cleanNode);
				ko.exportSymbol("removeNode", ko.removeNode);
				ko.exportSymbol("utils.domNodeDisposal", ko.utils.domNodeDisposal);
				ko.exportSymbol("utils.domNodeDisposal.addDisposeCallback", ko.utils.domNodeDisposal.addDisposeCallback);
				ko.exportSymbol("utils.domNodeDisposal.removeDisposeCallback", ko.utils.domNodeDisposal.removeDisposeCallback);
				(function () {
					var leadingCommentRegex = /^(\s*)<!--(.*?)-->/;
					function simpleHtmlParse(html) {
						var tags = ko.utils.stringTrim(html).toLowerCase(),
						div = document.createElement("div");
						var wrap = tags.match(/^<(thead|tbody|tfoot)/) && [1, "<table>", "</table>"] || !tags.indexOf("<tr") && [2, "<table><tbody>", "</tbody></table>"] || (!tags.indexOf("<td") || !tags.indexOf("<th")) && [3, "<table><tbody><tr>", "</tr></tbody></table>"] || [0, "", ""];
						var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
						if (typeof window.innerShiv == "function") {
							div.appendChild(window.innerShiv(markup))
						} else {
							div.innerHTML = markup
						}
						while (wrap[0]--) {
							div = div.lastChild
						}
						return ko.utils.makeArray(div.lastChild.childNodes)
					}
					function jQueryHtmlParse(html) {
						var elems = jQuery.clean([html]);
						if (elems && elems[0]) {
							var elem = elems[0];
							while (elem.parentNode && elem.parentNode.nodeType !== 11) {
								elem = elem.parentNode
							}
							if (elem.parentNode) {
								elem.parentNode.removeChild(elem)
							}
						}
						return elems
					}
					ko.utils.parseHtmlFragment = function (html) {
						return typeof jQuery != "undefined" ? jQueryHtmlParse(html) : simpleHtmlParse(html)
					};
					ko.utils.setHtml = function (node, html) {
						ko.utils.emptyDomNode(node);
						if ((html !== null) && (html !== undefined)) {
							if (typeof html != "string") {
								html = html.toString()
							}
							if (typeof jQuery != "undefined") {
								jQuery(node)["html"](html)
							} else {
								var parsedNodes = ko.utils.parseHtmlFragment(html);
								for (var i = 0; i < parsedNodes.length; i++) {
									node.appendChild(parsedNodes[i])
								}
							}
						}
					}
				})();
				ko.exportSymbol("utils.parseHtmlFragment", ko.utils.parseHtmlFragment);
				ko.exportSymbol("utils.setHtml", ko.utils.setHtml);
				ko.memoization = (function () {
					var memos = {};
					function randomMax8HexChars() {
						return (((1 + Math.random()) * 4294967296) | 0).toString(16).substring(1)
					}
					function generateRandomId() {
						return randomMax8HexChars() + randomMax8HexChars()
					}
					function findMemoNodes(rootNode, appendToArray) {
						if (!rootNode) {
							return
						}
						if (rootNode.nodeType == 8) {
							var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
							if (memoId != null) {
								appendToArray.push({
									domNode : rootNode,
									memoId : memoId
								})
							}
						} else {
							if (rootNode.nodeType == 1) {
								for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++) {
									findMemoNodes(childNodes[i], appendToArray)
								}
							}
						}
					}
					return {
						memoize : function (callback) {
							if (typeof callback != "function") {
								throw new Error("You can only pass a function to ko.memoization.memoize()")
							}
							var memoId = generateRandomId();
							memos[memoId] = callback;
							return "<!--[ko_memo:" + memoId + "]-->"
						},
						unmemoize : function (memoId, callbackParams) {
							var callback = memos[memoId];
							if (callback === undefined) {
								throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.")
							}
							try {
								callback.apply(null, callbackParams || []);
								return true
							}
							finally {
								delete memos[memoId]
							}
						},
						unmemoizeDomNodeAndDescendants : function (domNode, extraCallbackParamsArray) {
							var memos = [];
							findMemoNodes(domNode, memos);
							for (var i = 0, j = memos.length; i < j; i++) {
								var node = memos[i].domNode;
								var combinedParams = [node];
								if (extraCallbackParamsArray) {
									ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray)
								}
								ko.memoization.unmemoize(memos[i].memoId, combinedParams);
								node.nodeValue = "";
								if (node.parentNode) {
									node.parentNode.removeChild(node)
								}
							}
						},
						parseMemoText : function (memoText) {
							var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
							return match ? match[1] : null
						}
					}
				})();
				ko.exportSymbol("memoization", ko.memoization);
				ko.exportSymbol("memoization.memoize", ko.memoization.memoize);
				ko.exportSymbol("memoization.unmemoize", ko.memoization.unmemoize);
				ko.exportSymbol("memoization.parseMemoText", ko.memoization.parseMemoText);
				ko.exportSymbol("memoization.unmemoizeDomNodeAndDescendants", ko.memoization.unmemoizeDomNodeAndDescendants);
				ko.extenders = {
					throttle : function (target, timeout) {
						target.throttleEvaluation = timeout;
						var writeTimeoutInstance = null;
						return ko.dependentObservable({
							read : target,
							write : function (value) {
								clearTimeout(writeTimeoutInstance);
								writeTimeoutInstance = setTimeout(function () {
										target(value)
									}, timeout)
							}
						})
					},
					notify : function (target, notifyWhen) {
						target.equalityComparer = notifyWhen == "always" ? function () {
							return false
						}
						 : ko.observable.fn["equalityComparer"];
						return target
					}
				};
				function applyExtenders(requestedExtenders) {
					var target = this;
					if (requestedExtenders) {
						for (var key in requestedExtenders) {
							var extenderHandler = ko.extenders[key];
							if (typeof extenderHandler == "function") {
								target = extenderHandler(target, requestedExtenders[key])
							}
						}
					}
					return target
				}
				ko.exportSymbol("extenders", ko.extenders);
				ko.subscription = function (target, callback, disposeCallback) {
					this.target = target;
					this.callback = callback;
					this.disposeCallback = disposeCallback;
					ko.exportProperty(this, "dispose", this.dispose)
				};
				ko.subscription.prototype.dispose = function () {
					this.isDisposed = true;
					this.disposeCallback()
				};
				ko.subscribable = function () {
					this._subscriptions = {};
					ko.utils.extend(this, ko.subscribable.fn);
					ko.exportProperty(this, "subscribe", this.subscribe);
					ko.exportProperty(this, "extend", this.extend);
					ko.exportProperty(this, "getSubscriptionsCount", this.getSubscriptionsCount)
				};
				var defaultEvent = "change";
				ko.subscribable.fn = {
					subscribe : function (callback, callbackTarget, event) {
						event = event || defaultEvent;
						var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;
						var subscription = new ko.subscription(this, boundCallback, function () {
								ko.utils.arrayRemoveItem(this._subscriptions[event], subscription)
							}
								.bind(this));
						if (!this._subscriptions[event]) {
							this._subscriptions[event] = []
						}
						this._subscriptions[event].push(subscription);
						return subscription
					},
					notifySubscribers : function (valueToNotify, event) {
						event = event || defaultEvent;
						if (this._subscriptions[event]) {
							ko.utils.arrayForEach(this._subscriptions[event].slice(0), function (subscription) {
								if (subscription && (subscription.isDisposed !== true)) {
									subscription.callback(valueToNotify)
								}
							})
						}
					},
					getSubscriptionsCount : function () {
						var total = 0;
						for (var eventName in this._subscriptions) {
							if (this._subscriptions.hasOwnProperty(eventName)) {
								total += this._subscriptions[eventName].length
							}
						}
						return total
					},
					extend : applyExtenders
				};
				ko.isSubscribable = function (instance) {
					return typeof instance.subscribe == "function" && typeof instance.notifySubscribers == "function"
				};
				ko.exportSymbol("subscribable", ko.subscribable);
				ko.exportSymbol("isSubscribable", ko.isSubscribable);
				ko.dependencyDetection = (function () {
					var _frames = [];
					return {
						begin : function (callback) {
							_frames.push({
								callback : callback,
								distinctDependencies : []
							})
						},
						end : function () {
							_frames.pop()
						},
						registerDependency : function (subscribable) {
							if (!ko.isSubscribable(subscribable)) {
								throw new Error("Only subscribable things can act as dependencies")
							}
							if (_frames.length > 0) {
								var topFrame = _frames[_frames.length - 1];
								if (ko.utils.arrayIndexOf(topFrame.distinctDependencies, subscribable) >= 0) {
									return
								}
								topFrame.distinctDependencies.push(subscribable);
								topFrame.callback(subscribable)
							}
						}
					}
				})();
				var primitiveTypes = {
					"undefined" : true,
					"boolean" : true,
					number : true,
					string : true
				};
				ko.observable = function (initialValue) {
					var _latestValue = initialValue;
					function observable() {
						if (arguments.length > 0) {
							if ((!observable.equalityComparer) || !observable.equalityComparer(_latestValue, arguments[0])) {
								observable.valueWillMutate();
								_latestValue = arguments[0];
								if (DEBUG) {
									observable._latestValue = _latestValue
								}
								observable.valueHasMutated()
							}
							return this
						} else {
							ko.dependencyDetection.registerDependency(observable);
							return _latestValue
						}
					}
					if (DEBUG) {
						observable._latestValue = _latestValue
					}
					ko.subscribable.call(observable);
					observable.valueHasMutated = function () {
						observable.notifySubscribers(_latestValue)
					};
					observable.valueWillMutate = function () {
						observable.notifySubscribers(_latestValue, "beforeChange")
					};
					ko.utils.extend(observable, ko.observable.fn);
					ko.exportProperty(observable, "valueHasMutated", observable.valueHasMutated);
					ko.exportProperty(observable, "valueWillMutate", observable.valueWillMutate);
					return observable
				};
				ko.observable.fn = {
					equalityComparer : function valuesArePrimitiveAndEqual(a, b) {
						var oldValueIsPrimitive = (a === null) || (typeof(a)in primitiveTypes);
						return oldValueIsPrimitive ? (a === b) : false
					}
				};
				var protoProperty = ko.observable.protoProperty = "__ko_proto__";
				ko.observable.fn[protoProperty] = ko.observable;
				ko.hasPrototype = function (instance, prototype) {
					if ((instance === null) || (instance === undefined) || (instance[protoProperty] === undefined)) {
						return false
					}
					if (instance[protoProperty] === prototype) {
						return true
					}
					return ko.hasPrototype(instance[protoProperty], prototype)
				};
				ko.isObservable = function (instance) {
					return ko.hasPrototype(instance, ko.observable)
				};
				ko.isWriteableObservable = function (instance) {
					if ((typeof instance == "function") && instance[protoProperty] === ko.observable) {
						return true
					}
					if ((typeof instance == "function") && (instance[protoProperty] === ko.dependentObservable) && (instance.hasWriteFunction)) {
						return true
					}
					return false
				};
				ko.exportSymbol("observable", ko.observable);
				ko.exportSymbol("isObservable", ko.isObservable);
				ko.exportSymbol("isWriteableObservable", ko.isWriteableObservable);
				ko.observableArray = function (initialValues) {
					if (arguments.length == 0) {
						initialValues = []
					}
					if ((initialValues !== null) && (initialValues !== undefined) && !("length" in initialValues)) {
						throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.")
					}
					var result = ko.observable(initialValues);
					ko.utils.extend(result, ko.observableArray.fn);
					return result
				};
				ko.observableArray.fn = {
					remove : function (valueOrPredicate) {
						var underlyingArray = this();
						var removedValues = [];
						var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) {
							return value === valueOrPredicate
						};
						for (var i = 0; i < underlyingArray.length; i++) {
							var value = underlyingArray[i];
							if (predicate(value)) {
								if (removedValues.length === 0) {
									this.valueWillMutate()
								}
								removedValues.push(value);
								underlyingArray.splice(i, 1);
								i--
							}
						}
						if (removedValues.length) {
							this.valueHasMutated()
						}
						return removedValues
					},
					removeAll : function (arrayOfValues) {
						if (arrayOfValues === undefined) {
							var underlyingArray = this();
							var allValues = underlyingArray.slice(0);
							this.valueWillMutate();
							underlyingArray.splice(0, underlyingArray.length);
							this.valueHasMutated();
							return allValues
						}
						if (!arrayOfValues) {
							return []
						}
						return this["remove"](function (value) {
							return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0
						})
					},
					destroy : function (valueOrPredicate) {
						var underlyingArray = this();
						var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) {
							return value === valueOrPredicate
						};
						this.valueWillMutate();
						for (var i = underlyingArray.length - 1; i >= 0; i--) {
							var value = underlyingArray[i];
							if (predicate(value)) {
								underlyingArray[i]["_destroy"] = true
							}
						}
						this.valueHasMutated()
					},
					destroyAll : function (arrayOfValues) {
						if (arrayOfValues === undefined) {
							return this["destroy"](function () {
								return true
							})
						}
						if (!arrayOfValues) {
							return []
						}
						return this["destroy"](function (value) {
							return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0
						})
					},
					indexOf : function (item) {
						var underlyingArray = this();
						return ko.utils.arrayIndexOf(underlyingArray, item)
					},
					replace : function (oldItem, newItem) {
						var index = this["indexOf"](oldItem);
						if (index >= 0) {
							this.valueWillMutate();
							this()[index] = newItem;
							this.valueHasMutated()
						}
					}
				};
				ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
					ko.observableArray.fn[methodName] = function () {
						var underlyingArray = this();
						this.valueWillMutate();
						var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
						this.valueHasMutated();
						return methodCallResult
					}
				});
				ko.utils.arrayForEach(["slice"], function (methodName) {
					ko.observableArray.fn[methodName] = function () {
						var underlyingArray = this();
						return underlyingArray[methodName].apply(underlyingArray, arguments)
					}
				});
				ko.exportSymbol("observableArray", ko.observableArray);
				ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
					var _latestValue,
					_hasBeenEvaluated = false,
					_isBeingEvaluated = false,
					readFunction = evaluatorFunctionOrOptions;
					if (readFunction && typeof readFunction == "object") {
						options = readFunction;
						readFunction = options.read
					} else {
						options = options || {};
						if (!readFunction) {
							readFunction = options.read
						}
					}
					if (typeof readFunction != "function") {
						throw new Error("Pass a function that returns the value of the ko.computed")
					}
					var writeFunction = options.write;
					if (!evaluatorFunctionTarget) {
						evaluatorFunctionTarget = options.owner
					}
					var _subscriptionsToDependencies = [];
					function disposeAllSubscriptionsToDependencies() {
						ko.utils.arrayForEach(_subscriptionsToDependencies, function (subscription) {
							subscription.dispose()
						});
						_subscriptionsToDependencies = []
					}
					var dispose = disposeAllSubscriptionsToDependencies;
					var disposeWhenNodeIsRemoved = (typeof options.disposeWhenNodeIsRemoved == "object") ? options.disposeWhenNodeIsRemoved : null;
					var disposeWhen = options.disposeWhen || function () {
						return false
					};
					if (disposeWhenNodeIsRemoved) {
						dispose = function () {
							ko.utils.domNodeDisposal.removeDisposeCallback(disposeWhenNodeIsRemoved, arguments.callee);
							disposeAllSubscriptionsToDependencies()
						};
						ko.utils.domNodeDisposal.addDisposeCallback(disposeWhenNodeIsRemoved, dispose);
						var existingDisposeWhenFunction = disposeWhen;
						disposeWhen = function () {
							return !ko.utils.domNodeIsAttachedToDocument(disposeWhenNodeIsRemoved) || existingDisposeWhenFunction()
						}
					}
					var evaluationTimeoutInstance = null;
					function evaluatePossiblyAsync() {
						var throttleEvaluationTimeout = dependentObservable.throttleEvaluation;
						if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
							clearTimeout(evaluationTimeoutInstance);
							evaluationTimeoutInstance = setTimeout(evaluateImmediate, throttleEvaluationTimeout)
						} else {
							evaluateImmediate()
						}
					}
					function evaluateImmediate() {
						if (_isBeingEvaluated) {
							return
						}
						if (_hasBeenEvaluated && disposeWhen()) {
							dispose();
							return
						}
						_isBeingEvaluated = true;
						try {
							var disposalCandidates = ko.utils.arrayMap(_subscriptionsToDependencies, function (item) {
									return item.target
								});
							ko.dependencyDetection.begin(function (subscribable) {
								var inOld;
								if ((inOld = ko.utils.arrayIndexOf(disposalCandidates, subscribable)) >= 0) {
									disposalCandidates[inOld] = undefined
								} else {
									_subscriptionsToDependencies.push(subscribable.subscribe(evaluatePossiblyAsync))
								}
							});
							var newValue = readFunction.call(evaluatorFunctionTarget);
							for (var i = disposalCandidates.length - 1; i >= 0; i--) {
								if (disposalCandidates[i]) {
									_subscriptionsToDependencies.splice(i, 1)[0].dispose()
								}
							}
							_hasBeenEvaluated = true;
							dependentObservable.notifySubscribers(_latestValue, "beforeChange");
							_latestValue = newValue;
							if (DEBUG) {
								dependentObservable._latestValue = _latestValue
							}
						}
						finally {
							ko.dependencyDetection.end()
						}
						dependentObservable.notifySubscribers(_latestValue);
						_isBeingEvaluated = false
					}
					function dependentObservable() {
						if (arguments.length > 0) {
							set.apply(dependentObservable, arguments)
						} else {
							return get()
						}
					}
					function set() {
						if (typeof writeFunction === "function") {
							writeFunction.apply(evaluatorFunctionTarget, arguments)
						} else {
							throw new Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
						}
					}
					function get() {
						if (!_hasBeenEvaluated) {
							evaluateImmediate()
						}
						ko.dependencyDetection.registerDependency(dependentObservable);
						return _latestValue
					}
					dependentObservable.getDependenciesCount = function () {
						return _subscriptionsToDependencies.length
					};
					dependentObservable.hasWriteFunction = typeof options.write === "function";
					dependentObservable.dispose = function () {
						dispose()
					};
					ko.subscribable.call(dependentObservable);
					ko.utils.extend(dependentObservable, ko.dependentObservable.fn);
					if (options.deferEvaluation !== true) {
						evaluateImmediate()
					}
					ko.exportProperty(dependentObservable, "dispose", dependentObservable.dispose);
					ko.exportProperty(dependentObservable, "getDependenciesCount", dependentObservable.getDependenciesCount);
					return dependentObservable
				};
				ko.isComputed = function (instance) {
					return ko.hasPrototype(instance, ko.dependentObservable)
				};
				var protoProp = ko.observable.protoProperty;
				ko.dependentObservable[protoProp] = ko.observable;
				ko.dependentObservable.fn = {};
				ko.dependentObservable.fn[protoProp] = ko.dependentObservable;
				ko.exportSymbol("dependentObservable", ko.dependentObservable);
				ko.exportSymbol("computed", ko.dependentObservable);
				ko.exportSymbol("isComputed", ko.isComputed);
				(function () {
					var maxNestedObservableDepth = 10;
					ko.toJS = function (rootObject) {
						if (arguments.length == 0) {
							throw new Error("When calling ko.toJS, pass the object you want to convert.")
						}
						return mapJsObjectGraph(rootObject, function (valueToMap) {
							for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth); i++) {
								valueToMap = valueToMap()
							}
							return valueToMap
						})
					};
					ko.toJSON = function (rootObject, replacer, space) {
						var plainJavaScriptObject = ko.toJS(rootObject);
						return ko.utils.stringifyJson(plainJavaScriptObject, replacer, space)
					};
					function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
						visitedObjects = visitedObjects || new objectLookup();
						rootObject = mapInputCallback(rootObject);
						var canHaveProperties = (typeof rootObject == "object") && (rootObject !== null) && (rootObject !== undefined) && (!(rootObject instanceof Date));
						if (!canHaveProperties) {
							return rootObject
						}
						var outputProperties = rootObject instanceof Array ? [] : {};
						visitedObjects.save(rootObject, outputProperties);
						visitPropertiesOrArrayEntries(rootObject, function (indexer) {
							var propertyValue = mapInputCallback(rootObject[indexer]);
							switch (typeof propertyValue) {
							case "boolean":
							case "number":
							case "string":
							case "function":
								outputProperties[indexer] = propertyValue;
								break;
							case "object":
							case "undefined":
								var previouslyMappedValue = visitedObjects.get(propertyValue);
								outputProperties[indexer] = (previouslyMappedValue !== undefined) ? previouslyMappedValue : mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
								break
							}
						});
						return outputProperties
					}
					function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
						if (rootObject instanceof Array) {
							for (var i = 0; i < rootObject.length; i++) {
								visitorCallback(i)
							}
							if (typeof rootObject.toJSON == "function") {
								visitorCallback("toJSON")
							}
						} else {
							for (var propertyName in rootObject) {
								visitorCallback(propertyName)
							}
						}
					}
					function objectLookup() {
						var keys = [];
						var values = [];
						this.save = function (key, value) {
							var existingIndex = ko.utils.arrayIndexOf(keys, key);
							if (existingIndex >= 0) {
								values[existingIndex] = value
							} else {
								keys.push(key);
								values.push(value)
							}
						};
						this.get = function (key) {
							var existingIndex = ko.utils.arrayIndexOf(keys, key);
							return (existingIndex >= 0) ? values[existingIndex] : undefined
						}
					}
				})();
				ko.exportSymbol("toJS", ko.toJS);
				ko.exportSymbol("toJSON", ko.toJSON);
				(function () {
					var hasDomDataExpandoProperty = "__ko__hasDomDataOptionValue__";
					ko.selectExtensions = {
						readValue : function (element) {
							switch (ko.utils.tagNameLower(element)) {
							case "option":
								if (element[hasDomDataExpandoProperty] === true) {
									return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey)
								}
								return element.getAttribute("value");
							case "select":
								return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
							default:
								return element.value
							}
						},
						writeValue : function (element, value) {
							switch (ko.utils.tagNameLower(element)) {
							case "option":
								switch (typeof value) {
								case "string":
									ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
									if (hasDomDataExpandoProperty in element) {
										delete element[hasDomDataExpandoProperty]
									}
									element.value = value;
									break;
								default:
									ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
									element[hasDomDataExpandoProperty] = true;
									element.value = typeof value === "number" ? value : "";
									break
								}
								break;
							case "select":
								for (var i = element.options.length - 1; i >= 0; i--) {
									if (ko.selectExtensions.readValue(element.options[i]) == value) {
										element.selectedIndex = i;
										break
									}
								}
								break;
							default:
								if ((value === null) || (value === undefined)) {
									value = ""
								}
								element.value = value;
								break
							}
						}
					}
				})();
				ko.exportSymbol("selectExtensions", ko.selectExtensions);
				ko.exportSymbol("selectExtensions.readValue", ko.selectExtensions.readValue);
				ko.exportSymbol("selectExtensions.writeValue", ko.selectExtensions.writeValue);
				ko.jsonExpressionRewriting = (function () {
					var restoreCapturedTokensRegex = /\@ko_token_(\d+)\@/g;
					var javaScriptAssignmentTarget = /^[\_$a-z][\_$a-z0-9]*(\[.*?\])*(\.[\_$a-z][\_$a-z0-9]*(\[.*?\])*)*$/i;
					var javaScriptReservedWords = ["true", "false"];
					function restoreTokens(string, tokens) {
						var prevValue = null;
						while (string != prevValue) {
							prevValue = string;
							string = string.replace(restoreCapturedTokensRegex, function (match, tokenIndex) {
									return tokens[tokenIndex]
								})
						}
						return string
					}
					function isWriteableValue(expression) {
						if (ko.utils.arrayIndexOf(javaScriptReservedWords, ko.utils.stringTrim(expression).toLowerCase()) >= 0) {
							return false
						}
						return expression.match(javaScriptAssignmentTarget) !== null
					}
					function ensureQuoted(key) {
						var trimmedKey = ko.utils.stringTrim(key);
						switch (trimmedKey.length && trimmedKey.charAt(0)) {
						case "'":
						case '"':
							return key;
						default:
							return "'" + trimmedKey + "'"
						}
					}
					return {
						bindingRewriteValidators : [],
						parseObjectLiteral : function (objectLiteralString) {
							var str = ko.utils.stringTrim(objectLiteralString);
							if (str.length < 3) {
								return []
							}
							if (str.charAt(0) === "{") {
								str = str.substring(1, str.length - 1)
							}
							var tokens = [];
							var tokenStart = null,
							tokenEndChar;
							for (var position = 0; position < str.length; position++) {
								var c = str.charAt(position);
								if (tokenStart === null) {
									switch (c) {
									case '"':
									case "'":
									case "/":
										tokenStart = position;
										tokenEndChar = c;
										break
									}
								} else {
									if ((c == tokenEndChar) && (str.charAt(position - 1) !== "\\")) {
										var token = str.substring(tokenStart, position + 1);
										tokens.push(token);
										var replacement = "@ko_token_" + (tokens.length - 1) + "@";
										str = str.substring(0, tokenStart) + replacement + str.substring(position + 1);
										position -= (token.length - replacement.length);
										tokenStart = null
									}
								}
							}
							tokenStart = null;
							tokenEndChar = null;
							var tokenDepth = 0,
							tokenStartChar = null;
							for (var position = 0; position < str.length; position++) {
								var c = str.charAt(position);
								if (tokenStart === null) {
									switch (c) {
									case "{":
										tokenStart = position;
										tokenStartChar = c;
										tokenEndChar = "}";
										break;
									case "(":
										tokenStart = position;
										tokenStartChar = c;
										tokenEndChar = ")";
										break;
									case "[":
										tokenStart = position;
										tokenStartChar = c;
										tokenEndChar = "]";
										break
									}
								}
								if (c === tokenStartChar) {
									tokenDepth++
								} else {
									if (c === tokenEndChar) {
										tokenDepth--;
										if (tokenDepth === 0) {
											var token = str.substring(tokenStart, position + 1);
											tokens.push(token);
											var replacement = "@ko_token_" + (tokens.length - 1) + "@";
											str = str.substring(0, tokenStart) + replacement + str.substring(position + 1);
											position -= (token.length - replacement.length);
											tokenStart = null
										}
									}
								}
							}
							var result = [];
							var keyValuePairs = str.split(",");
							for (var i = 0, j = keyValuePairs.length; i < j; i++) {
								var pair = keyValuePairs[i];
								var colonPos = pair.indexOf(":");
								if ((colonPos > 0) && (colonPos < pair.length - 1)) {
									var key = pair.substring(0, colonPos);
									var value = pair.substring(colonPos + 1);
									result.push({
										key : restoreTokens(key, tokens),
										value : restoreTokens(value, tokens)
									})
								} else {
									result.push({
										unknown : restoreTokens(pair, tokens)
									})
								}
							}
							return result
						},
						insertPropertyAccessorsIntoJson : function (objectLiteralStringOrKeyValueArray) {
							var keyValueArray = typeof objectLiteralStringOrKeyValueArray === "string" ? ko.jsonExpressionRewriting.parseObjectLiteral(objectLiteralStringOrKeyValueArray) : objectLiteralStringOrKeyValueArray;
							var resultStrings = [],
							propertyAccessorResultStrings = [];
							var keyValueEntry;
							for (var i = 0; keyValueEntry = keyValueArray[i]; i++) {
								if (resultStrings.length > 0) {
									resultStrings.push(",")
								}
								if (keyValueEntry.key) {
									var quotedKey = ensureQuoted(keyValueEntry.key),
									val = keyValueEntry.value;
									resultStrings.push(quotedKey);
									resultStrings.push(":");
									resultStrings.push(val);
									if (isWriteableValue(ko.utils.stringTrim(val))) {
										if (propertyAccessorResultStrings.length > 0) {
											propertyAccessorResultStrings.push(", ")
										}
										propertyAccessorResultStrings.push(quotedKey + " : function(__ko_value) { " + val + " = __ko_value; }")
									}
								} else {
									if (keyValueEntry.unknown) {
										resultStrings.push(keyValueEntry.unknown)
									}
								}
							}
							var combinedResult = resultStrings.join("");
							if (propertyAccessorResultStrings.length > 0) {
								var allPropertyAccessors = propertyAccessorResultStrings.join("");
								combinedResult = combinedResult + ", '_ko_property_writers' : { " + allPropertyAccessors + " } "
							}
							return combinedResult
						},
						keyValueArrayContainsKey : function (keyValueArray, key) {
							for (var i = 0; i < keyValueArray.length; i++) {
								if (ko.utils.stringTrim(keyValueArray[i]["key"]) == key) {
									return true
								}
							}
							return false
						},
						writeValueToProperty : function (property, allBindingsAccessor, key, value, checkIfDifferent) {
							if (!property || !ko.isWriteableObservable(property)) {
								var propWriters = allBindingsAccessor()["_ko_property_writers"];
								if (propWriters && propWriters[key]) {
									propWriters[key](value)
								}
							} else {
								if (!checkIfDifferent || property() !== value) {
									property(value)
								}
							}
						}
					}
				})();
				ko.exportSymbol("jsonExpressionRewriting", ko.jsonExpressionRewriting);
				ko.exportSymbol("jsonExpressionRewriting.bindingRewriteValidators", ko.jsonExpressionRewriting.bindingRewriteValidators);
				ko.exportSymbol("jsonExpressionRewriting.parseObjectLiteral", ko.jsonExpressionRewriting.parseObjectLiteral);
				ko.exportSymbol("jsonExpressionRewriting.insertPropertyAccessorsIntoJson", ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson);
				(function () {
					var commentNodesHaveTextProperty = document.createComment("test").text === "<!--test-->";
					var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko\s+(.*\:.*)\s*-->$/ : /^\s*ko\s+(.*\:.*)\s*$/;
					var endCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
					var htmlTagsWithOptionallyClosingChildren = {
						ul : true,
						ol : true
					};
					function isStartComment(node) {
						return (node.nodeType == 8) && (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex)
					}
					function isEndComment(node) {
						return (node.nodeType == 8) && (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(endCommentRegex)
					}
					function getVirtualChildren(startComment, allowUnbalanced) {
						var currentNode = startComment;
						var depth = 1;
						var children = [];
						while (currentNode = currentNode.nextSibling) {
							if (isEndComment(currentNode)) {
								depth--;
								if (depth === 0) {
									return children
								}
							}
							children.push(currentNode);
							if (isStartComment(currentNode)) {
								depth++
							}
						}
						if (!allowUnbalanced) {
							throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue)
						}
						return null
					}
					function getMatchingEndComment(startComment, allowUnbalanced) {
						var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
						if (allVirtualChildren) {
							if (allVirtualChildren.length > 0) {
								return allVirtualChildren[allVirtualChildren.length - 1].nextSibling
							}
							return startComment.nextSibling
						} else {
							return null
						}
					}
					function getUnbalancedChildTags(node) {
						var childNode = node.firstChild,
						captureRemaining = null;
						if (childNode) {
							do {
								if (captureRemaining) {
									captureRemaining.push(childNode)
								} else {
									if (isStartComment(childNode)) {
										var matchingEndComment = getMatchingEndComment(childNode, true);
										if (matchingEndComment) {
											childNode = matchingEndComment
										} else {
											captureRemaining = [childNode]
										}
									} else {
										if (isEndComment(childNode)) {
											captureRemaining = [childNode]
										}
									}
								}
							} while (childNode = childNode.nextSibling)
						}
						return captureRemaining
					}
					ko.virtualElements = {
						allowedBindings : {},
						childNodes : function (node) {
							return isStartComment(node) ? getVirtualChildren(node) : node.childNodes
						},
						emptyNode : function (node) {
							if (!isStartComment(node)) {
								ko.utils.emptyDomNode(node)
							} else {
								var virtualChildren = ko.virtualElements.childNodes(node);
								for (var i = 0, j = virtualChildren.length; i < j; i++) {
									ko.removeNode(virtualChildren[i])
								}
							}
						},
						setDomNodeChildren : function (node, childNodes) {
							if (!isStartComment(node)) {
								ko.utils.setDomNodeChildren(node, childNodes)
							} else {
								ko.virtualElements.emptyNode(node);
								var endCommentNode = node.nextSibling;
								for (var i = 0, j = childNodes.length; i < j; i++) {
									endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode)
								}
							}
						},
						prepend : function (containerNode, nodeToPrepend) {
							if (!isStartComment(containerNode)) {
								if (containerNode.firstChild) {
									containerNode.insertBefore(nodeToPrepend, containerNode.firstChild)
								} else {
									containerNode.appendChild(nodeToPrepend)
								}
							} else {
								containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling)
							}
						},
						insertAfter : function (containerNode, nodeToInsert, insertAfterNode) {
							if (!isStartComment(containerNode)) {
								if (insertAfterNode.nextSibling) {
									containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling)
								} else {
									containerNode.appendChild(nodeToInsert)
								}
							} else {
								containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling)
							}
						},
						firstChild : function (node) {
							if (!isStartComment(node)) {
								return node.firstChild
							}
							if (!node.nextSibling || isEndComment(node.nextSibling)) {
								return null
							}
							return node.nextSibling
						},
						nextSibling : function (node) {
							if (isStartComment(node)) {
								node = getMatchingEndComment(node)
							}
							if (node.nextSibling && isEndComment(node.nextSibling)) {
								return null
							}
							return node.nextSibling
						},
						virtualNodeBindingValue : function (node) {
							var regexMatch = isStartComment(node);
							return regexMatch ? regexMatch[1] : null
						},
						normaliseVirtualElementDomStructure : function (elementVerified) {
							if (!htmlTagsWithOptionallyClosingChildren[ko.utils.tagNameLower(elementVerified)]) {
								return
							}
							var childNode = elementVerified.firstChild;
							if (childNode) {
								do {
									if (childNode.nodeType === 1) {
										var unbalancedTags = getUnbalancedChildTags(childNode);
										if (unbalancedTags) {
											var nodeToInsertBefore = childNode.nextSibling;
											for (var i = 0; i < unbalancedTags.length; i++) {
												if (nodeToInsertBefore) {
													elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore)
												} else {
													elementVerified.appendChild(unbalancedTags[i])
												}
											}
										}
									}
								} while (childNode = childNode.nextSibling)
							}
						}
					}
				})();
				ko.exportSymbol("virtualElements", ko.virtualElements);
				ko.exportSymbol("virtualElements.allowedBindings", ko.virtualElements.allowedBindings);
				ko.exportSymbol("virtualElements.emptyNode", ko.virtualElements.emptyNode);
				ko.exportSymbol("virtualElements.insertAfter", ko.virtualElements.insertAfter);
				ko.exportSymbol("virtualElements.prepend", ko.virtualElements.prepend);
				ko.exportSymbol("virtualElements.setDomNodeChildren", ko.virtualElements.setDomNodeChildren);
				(function () {
					var defaultBindingAttributeName = "data-bind";
					ko.bindingProvider = function () {
						this.bindingCache = {}
						
					};
					ko.utils.extend(ko.bindingProvider.prototype, {
						nodeHasBindings : function (node) {
							switch (node.nodeType) {
							case 1:
								return node.getAttribute(defaultBindingAttributeName) != null;
							case 8:
								return ko.virtualElements.virtualNodeBindingValue(node) != null;
							default:
								return false
							}
						},
						getBindings : function (node, bindingContext) {
							var bindingsString = this["getBindingsString"](node, bindingContext);
							return bindingsString ? this["parseBindingsString"](bindingsString, bindingContext) : null
						},
						getBindingsString : function (node, bindingContext) {
							switch (node.nodeType) {
							case 1:
								return node.getAttribute(defaultBindingAttributeName);
							case 8:
								return ko.virtualElements.virtualNodeBindingValue(node);
							default:
								return null
							}
						},
						parseBindingsString : function (bindingsString, bindingContext) {
							try {
								var viewModel = bindingContext["$data"],
								scopes = (typeof viewModel == "object" && viewModel != null) ? [viewModel, bindingContext] : [bindingContext],
								bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, scopes.length, this.bindingCache);
								return bindingFunction(scopes)
							} catch (ex) {
								throw new Error("Unable to parse bindings.\nMessage: " + ex + ";\nBindings value: " + bindingsString)
							}
						}
					});
					ko.bindingProvider.instance = new ko.bindingProvider();
					function createBindingsStringEvaluatorViaCache(bindingsString, scopesCount, cache) {
						var cacheKey = scopesCount + "_" + bindingsString;
						return cache[cacheKey] || (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, scopesCount))
					}
					function createBindingsStringEvaluator(bindingsString, scopesCount) {
						var rewrittenBindings = " { " + ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson(bindingsString) + " } ";
						return ko.utils.buildEvalWithinScopeFunction(rewrittenBindings, scopesCount)
					}
				})();
				ko.exportSymbol("bindingProvider", ko.bindingProvider);
				(function () {
					ko.bindingHandlers = {};
					ko.bindingContext = function (dataItem, parentBindingContext) {
						if (parentBindingContext) {
							ko.utils.extend(this, parentBindingContext);
							this["$parentContext"] = parentBindingContext;
							this["$parent"] = parentBindingContext["$data"];
							this["$parents"] = (parentBindingContext["$parents"] || []).slice(0);
							this["$parents"].unshift(this["$parent"])
						} else {
							this["$parents"] = [];
							this["$root"] = dataItem
						}
						this["$data"] = dataItem
					};
					ko.bindingContext.prototype.createChildContext = function (dataItem) {
						return new ko.bindingContext(dataItem, this)
					};
					ko.bindingContext.prototype.extend = function (properties) {
						var clone = ko.utils.extend(new ko.bindingContext(), this);
						return ko.utils.extend(clone, properties)
					};
					function validateThatBindingIsAllowedForVirtualElements(bindingName) {
						var validator = ko.virtualElements.allowedBindings[bindingName];
						if (!validator) {
							throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements")
						}
					}
					function applyBindingsToDescendantsInternal(viewModel, elementOrVirtualElement, bindingContextsMayDifferFromDomParentElement) {
						var currentChild,
						nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);
						while (currentChild = nextInQueue) {
							nextInQueue = ko.virtualElements.nextSibling(currentChild);
							applyBindingsToNodeAndDescendantsInternal(viewModel, currentChild, bindingContextsMayDifferFromDomParentElement)
						}
					}
					function applyBindingsToNodeAndDescendantsInternal(viewModel, nodeVerified, bindingContextMayDifferFromDomParentElement) {
						var shouldBindDescendants = true;
						var isElement = (nodeVerified.nodeType === 1);
						if (isElement) {
							ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified)
						}
						var shouldApplyBindings = (isElement && bindingContextMayDifferFromDomParentElement) || ko.bindingProvider.instance["nodeHasBindings"](nodeVerified);
						if (shouldApplyBindings) {
							shouldBindDescendants = applyBindingsToNodeInternal(nodeVerified, null, viewModel, bindingContextMayDifferFromDomParentElement).shouldBindDescendants
						}
						if (shouldBindDescendants) {
							applyBindingsToDescendantsInternal(viewModel, nodeVerified, !isElement)
						}
					}
					function applyBindingsToNodeInternal(node, bindings, viewModelOrBindingContext, bindingContextMayDifferFromDomParentElement) {
						var initPhase = 0;
						var parsedBindings;
						function makeValueAccessor(bindingKey) {
							return function () {
								return parsedBindings[bindingKey]
							}
						}
						function parsedBindingsAccessor() {
							return parsedBindings
						}
						var bindingHandlerThatControlsDescendantBindings;
						ko.dependentObservable(function () {
							var bindingContextInstance = viewModelOrBindingContext && (viewModelOrBindingContext instanceof ko.bindingContext) ? viewModelOrBindingContext : new ko.bindingContext(ko.utils.unwrapObservable(viewModelOrBindingContext));
							var viewModel = bindingContextInstance["$data"];
							if (bindingContextMayDifferFromDomParentElement) {
								ko.storedBindingContextForNode(node, bindingContextInstance)
							}
							var evaluatedBindings = (typeof bindings == "function") ? bindings() : bindings;
							parsedBindings = evaluatedBindings || ko.bindingProvider.instance["getBindings"](node, bindingContextInstance);
							if (parsedBindings) {
								if (initPhase === 0) {
									initPhase = 1;
									for (var bindingKey in parsedBindings) {
										var binding = ko.bindingHandlers[bindingKey];
										if (binding && node.nodeType === 8) {
											validateThatBindingIsAllowedForVirtualElements(bindingKey)
										}
										if (binding && typeof binding.init == "function") {
											var handlerInitFn = binding.init;
											var initResult = handlerInitFn(node, makeValueAccessor(bindingKey), parsedBindingsAccessor, viewModel, bindingContextInstance);
											if (initResult && initResult.controlsDescendantBindings) {
												if (bindingHandlerThatControlsDescendantBindings !== undefined) {
													throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.")
												}
												bindingHandlerThatControlsDescendantBindings = bindingKey
											}
										}
									}
									initPhase = 2
								}
								if (initPhase === 2) {
									for (var bindingKey in parsedBindings) {
										var binding = ko.bindingHandlers[bindingKey];
										if (binding && typeof binding.update == "function") {
											var handlerUpdateFn = binding.update;
											handlerUpdateFn(node, makeValueAccessor(bindingKey), parsedBindingsAccessor, viewModel, bindingContextInstance)
										}
									}
								}
							}
						}, null, {
							disposeWhenNodeIsRemoved : node
						});
						return {
							shouldBindDescendants : bindingHandlerThatControlsDescendantBindings === undefined
						}
					}
					var storedBindingContextDomDataKey = "__ko_bindingContext__";
					ko.storedBindingContextForNode = function (node, bindingContext) {
						if (arguments.length == 2) {
							ko.utils.domData.set(node, storedBindingContextDomDataKey, bindingContext)
						} else {
							return ko.utils.domData.get(node, storedBindingContextDomDataKey)
						}
					};
					ko.applyBindingsToNode = function (node, bindings, viewModel) {
						if (node.nodeType === 1) {
							ko.virtualElements.normaliseVirtualElementDomStructure(node)
						}
						return applyBindingsToNodeInternal(node, bindings, viewModel, true)
					};
					ko.applyBindingsToDescendants = function (viewModel, rootNode) {
						if (rootNode.nodeType === 1 || rootNode.nodeType === 8) {
							applyBindingsToDescendantsInternal(viewModel, rootNode, true)
						}
					};
					ko.applyBindings = function (viewModel, rootNode) {
						if (rootNode && (rootNode.nodeType !== 1) && (rootNode.nodeType !== 8)) {
							throw new Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node")
						}
						rootNode = rootNode || window.document.body;
						applyBindingsToNodeAndDescendantsInternal(viewModel, rootNode, true)
					};
					ko.contextFor = function (node) {
						switch (node.nodeType) {
						case 1:
						case 8:
							var context = ko.storedBindingContextForNode(node);
							if (context) {
								return context
							}
							if (node.parentNode) {
								return ko.contextFor(node.parentNode)
							}
							break
						}
						return undefined
					};
					ko.dataFor = function (node) {
						var context = ko.contextFor(node);
						return context ? context["$data"] : undefined
					};
					ko.exportSymbol("bindingHandlers", ko.bindingHandlers);
					ko.exportSymbol("applyBindings", ko.applyBindings);
					ko.exportSymbol("applyBindingsToDescendants", ko.applyBindingsToDescendants);
					ko.exportSymbol("applyBindingsToNode", ko.applyBindingsToNode);
					ko.exportSymbol("contextFor", ko.contextFor);
					ko.exportSymbol("dataFor", ko.dataFor)
				})();
				var eventHandlersWithShortcuts = ["click"];
				ko.utils.arrayForEach(eventHandlersWithShortcuts, function (eventName) {
					ko.bindingHandlers[eventName] = {
						init : function (element, valueAccessor, allBindingsAccessor, viewModel) {
							var newValueAccessor = function () {
								var result = {};
								result[eventName] = valueAccessor();
								return result
							};
							return ko.bindingHandlers.event["init"].call(this, element, newValueAccessor, allBindingsAccessor, viewModel)
						}
					}
				});
				ko.bindingHandlers.event = {
					init : function (element, valueAccessor, allBindingsAccessor, viewModel) {
						var eventsToHandle = valueAccessor() || {};
						for (var eventNameOutsideClosure in eventsToHandle) {
							(function () {
								var eventName = eventNameOutsideClosure;
								if (typeof eventName == "string") {
									ko.utils.registerEventHandler(element, eventName, function (event) {
										var handlerReturnValue;
										var handlerFunction = valueAccessor()[eventName];
										if (!handlerFunction) {
											return
										}
										var allBindings = allBindingsAccessor();
										try {
											var argsForHandler = ko.utils.makeArray(arguments);
											argsForHandler.unshift(viewModel);
											handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler)
										}
										finally {
											if (handlerReturnValue !== true) {
												if (event.preventDefault) {
													event.preventDefault()
												} else {
													event.returnValue = false
												}
											}
										}
										var bubble = allBindings[eventName + "Bubble"] !== false;
										if (!bubble) {
											event.cancelBubble = true;
											if (event.stopPropagation) {
												event.stopPropagation()
											}
										}
									})
								}
							})()
						}
					}
				};
				ko.bindingHandlers.submit = {
					init : function (element, valueAccessor, allBindingsAccessor, viewModel) {
						if (typeof valueAccessor() != "function") {
							throw new Error("The value for a submit binding must be a function")
						}
						ko.utils.registerEventHandler(element, "submit", function (event) {
							var handlerReturnValue;
							var value = valueAccessor();
							try {
								handlerReturnValue = value.call(viewModel, element)
							}
							finally {
								if (handlerReturnValue !== true) {
									if (event.preventDefault) {
										event.preventDefault()
									} else {
										event.returnValue = false
									}
								}
							}
						})
					}
				};
				ko.bindingHandlers.visible = {
					update : function (element, valueAccessor) {
						var value = ko.utils.unwrapObservable(valueAccessor());
						var isCurrentlyVisible = !(element.style.display == "none");
						if (value && !isCurrentlyVisible) {
							element.style.display = ""
						} else {
							if ((!value) && isCurrentlyVisible) {
								element.style.display = "none"
							}
						}
					}
				};
				ko.bindingHandlers.enable = {
					update : function (element, valueAccessor) {
						var value = ko.utils.unwrapObservable(valueAccessor());
						if (value && element.disabled) {
							element.removeAttribute("disabled")
						} else {
							if ((!value) && (!element.disabled)) {
								element.disabled = true
							}
						}
					}
				};
				ko.bindingHandlers.disable = {
					update : function (element, valueAccessor) {
						ko.bindingHandlers.enable["update"](element, function () {
							return !ko.utils.unwrapObservable(valueAccessor())
						})
					}
				};
				function ensureDropdownSelectionIsConsistentWithModelValue(element, modelValue, preferModelValue) {
					if (preferModelValue) {
						if (modelValue !== ko.selectExtensions.readValue(element)) {
							ko.selectExtensions.writeValue(element, modelValue)
						}
					}
					if (modelValue !== ko.selectExtensions.readValue(element)) {
						ko.utils.triggerEvent(element, "change")
					}
				}
				ko.bindingHandlers.value = {
					init : function (element, valueAccessor, allBindingsAccessor) {
						var eventsToCatch = ["change"];
						var requestedEventsToCatch = allBindingsAccessor()["valueUpdate"];
						if (requestedEventsToCatch) {
							if (typeof requestedEventsToCatch == "string") {
								requestedEventsToCatch = [requestedEventsToCatch]
							}
							ko.utils.arrayPushAll(eventsToCatch, requestedEventsToCatch);
							eventsToCatch = ko.utils.arrayGetDistinctValues(eventsToCatch)
						}
						var valueUpdateHandler = function () {
							var modelValue = valueAccessor();
							var elementValue = ko.selectExtensions.readValue(element);
							ko.jsonExpressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, "value", elementValue, true)
						};
						var ieAutoCompleteHackNeeded = ko.utils.ieVersion && element.tagName.toLowerCase() == "input" && element.type == "text" && element.autocomplete != "off" && (!element.form || element.form.autocomplete != "off");
						if (ieAutoCompleteHackNeeded && ko.utils.arrayIndexOf(eventsToCatch, "propertychange") == -1) {
							var propertyChangedFired = false;
							ko.utils.registerEventHandler(element, "propertychange", function () {
								propertyChangedFired = true
							});
							ko.utils.registerEventHandler(element, "blur", function () {
								if (propertyChangedFired) {
									propertyChangedFired = false;
									valueUpdateHandler()
								}
							})
						}
						ko.utils.arrayForEach(eventsToCatch, function (eventName) {
							var handler = valueUpdateHandler;
							if (ko.utils.stringStartsWith(eventName, "after")) {
								handler = function () {
									setTimeout(valueUpdateHandler, 0)
								};
								eventName = eventName.substring("after".length)
							}
							ko.utils.registerEventHandler(element, eventName, handler)
						})
					},
					update : function (element, valueAccessor) {
						var valueIsSelectOption = ko.utils.tagNameLower(element) === "select";
						var newValue = ko.utils.unwrapObservable(valueAccessor());
						var elementValue = ko.selectExtensions.readValue(element);
						var valueHasChanged = (newValue != elementValue);
						if ((newValue === 0) && (elementValue !== 0) && (elementValue !== "0")) {
							valueHasChanged = true
						}
						if (valueHasChanged) {
							var applyValueAction = function () {
								ko.selectExtensions.writeValue(element, newValue)
							};
							applyValueAction();
							var alsoApplyAsynchronously = valueIsSelectOption;
							if (alsoApplyAsynchronously) {
								setTimeout(applyValueAction, 0)
							}
						}
						if (valueIsSelectOption && (element.length > 0)) {
							ensureDropdownSelectionIsConsistentWithModelValue(element, newValue, false)
						}
					}
				};
				ko.bindingHandlers.options = {
					update : function (element, valueAccessor, allBindingsAccessor) {
						if (ko.utils.tagNameLower(element) !== "select") {
							throw new Error("options binding applies only to SELECT elements")
						}
						var selectWasPreviouslyEmpty = element.length == 0;
						var previousSelectedValues = ko.utils.arrayMap(ko.utils.arrayFilter(element.childNodes, function (node) {
									return node.tagName && (ko.utils.tagNameLower(node) === "option") && node.selected
								}), function (node) {
								return ko.selectExtensions.readValue(node) || node.innerText || node.textContent
							});
						var previousScrollTop = element.scrollTop;
						var value = ko.utils.unwrapObservable(valueAccessor());
						var selectedValue = element.value;
						while (element.length > 0) {
							ko.cleanNode(element.options[0]);
							element.remove(0)
						}
						if (value) {
							var allBindings = allBindingsAccessor();
							if (typeof value.length != "number") {
								value = [value]
							}
							if (allBindings.optionsCaption) {
								var option = document.createElement("option");
								ko.utils.setHtml(option, allBindings.optionsCaption);
								ko.selectExtensions.writeValue(option, undefined);
								element.appendChild(option)
							}
							for (var i = 0, j = value.length; i < j; i++) {
								var option = document.createElement("option");
								var optionValue = typeof allBindings.optionsValue == "string" ? value[i][allBindings.optionsValue] : value[i];
								optionValue = ko.utils.unwrapObservable(optionValue);
								ko.selectExtensions.writeValue(option, optionValue);
								var optionsTextValue = allBindings.optionsText;
								var optionText;
								if (typeof optionsTextValue == "function") {
									optionText = optionsTextValue(value[i])
								} else {
									if (typeof optionsTextValue == "string") {
										optionText = value[i][optionsTextValue]
									} else {
										optionText = optionValue
									}
								}
								if ((optionText === null) || (optionText === undefined)) {
									optionText = ""
								}
								ko.utils.setTextContent(option, optionText);
								element.appendChild(option)
							}
							var newOptions = element.getElementsByTagName("option");
							var countSelectionsRetained = 0;
							for (var i = 0, j = newOptions.length; i < j; i++) {
								if (ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[i])) >= 0) {
									ko.utils.setOptionNodeSelectionState(newOptions[i], true);
									countSelectionsRetained++
								}
							}
							element.scrollTop = previousScrollTop;
							if (selectWasPreviouslyEmpty && ("value" in allBindings)) {
								ensureDropdownSelectionIsConsistentWithModelValue(element, ko.utils.unwrapObservable(allBindings.value), true)
							}
							ko.utils.ensureSelectElementIsRenderedCorrectly(element)
						}
					}
				};
				ko.bindingHandlers.options.optionValueDomDataKey = "__ko.optionValueDomData__";
				ko.bindingHandlers.selectedOptions = {
					getSelectedValuesFromSelectNode : function (selectNode) {
						var result = [];
						var nodes = selectNode.childNodes;
						for (var i = 0, j = nodes.length; i < j; i++) {
							var node = nodes[i],
							tagName = ko.utils.tagNameLower(node);
							if (tagName == "option" && node.selected) {
								result.push(ko.selectExtensions.readValue(node))
							} else {
								if (tagName == "optgroup") {
									var selectedValuesFromOptGroup = ko.bindingHandlers.selectedOptions.getSelectedValuesFromSelectNode(node);
									Array.prototype.splice.apply(result, [result.length, 0].concat(selectedValuesFromOptGroup))
								}
							}
						}
						return result
					},
					init : function (element, valueAccessor, allBindingsAccessor) {
						ko.utils.registerEventHandler(element, "change", function () {
							var value = valueAccessor();
							var valueToWrite = ko.bindingHandlers.selectedOptions.getSelectedValuesFromSelectNode(this);
							ko.jsonExpressionRewriting.writeValueToProperty(value, allBindingsAccessor, "value", valueToWrite)
						})
					},
					update : function (element, valueAccessor) {
						if (ko.utils.tagNameLower(element) != "select") {
							throw new Error("values binding applies only to SELECT elements")
						}
						var newValue = ko.utils.unwrapObservable(valueAccessor());
						if (newValue && typeof newValue.length == "number") {
							var nodes = element.childNodes;
							for (var i = 0, j = nodes.length; i < j; i++) {
								var node = nodes[i];
								if (ko.utils.tagNameLower(node) === "option") {
									ko.utils.setOptionNodeSelectionState(node, ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0)
								}
							}
						}
					}
				};
				ko.bindingHandlers.text = {
					update : function (element, valueAccessor) {
						ko.utils.setTextContent(element, valueAccessor())
					}
				};
				ko.bindingHandlers.html = {
					init : function () {
						return {
							controlsDescendantBindings : true
						}
					},
					update : function (element, valueAccessor) {
						var value = ko.utils.unwrapObservable(valueAccessor());
						ko.utils.setHtml(element, value)
					}
				};
				ko.bindingHandlers.css = {
					update : function (element, valueAccessor) {
						var value = ko.utils.unwrapObservable(valueAccessor() || {});
						for (var className in value) {
							if (typeof className == "string") {
								var shouldHaveClass = ko.utils.unwrapObservable(value[className]);
								ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass)
							}
						}
					}
				};
				ko.bindingHandlers.style = {
					update : function (element, valueAccessor) {
						var value = ko.utils.unwrapObservable(valueAccessor() || {});
						for (var styleName in value) {
							if (typeof styleName == "string") {
								var styleValue = ko.utils.unwrapObservable(value[styleName]);
								element.style[styleName] = styleValue || ""
							}
						}
					}
				};
				ko.bindingHandlers.uniqueName = {
					init : function (element, valueAccessor) {
						if (valueAccessor()) {
							element.name = "ko_unique_" + (++ko.bindingHandlers.uniqueName.currentIndex);
							if (ko.utils.isIe6 || ko.utils.isIe7) {
								element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false)
							}
						}
					}
				};
				ko.bindingHandlers.uniqueName.currentIndex = 0;
				ko.bindingHandlers.checked = {
					init : function (element, valueAccessor, allBindingsAccessor) {
						var updateHandler = function () {
							var valueToWrite;
							if (element.type == "checkbox") {
								valueToWrite = element.checked
							} else {
								if ((element.type == "radio") && (element.checked)) {
									valueToWrite = element.value
								} else {
									return
								}
							}
							var modelValue = valueAccessor();
							if ((element.type == "checkbox") && (ko.utils.unwrapObservable(modelValue)instanceof Array)) {
								var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.unwrapObservable(modelValue), element.value);
								if (element.checked && (existingEntryIndex < 0)) {
									modelValue.push(element.value)
								} else {
									if ((!element.checked) && (existingEntryIndex >= 0)) {
										modelValue.splice(existingEntryIndex, 1)
									}
								}
							} else {
								ko.jsonExpressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, "checked", valueToWrite, true)
							}
						};
						ko.utils.registerEventHandler(element, "click", updateHandler);
						if ((element.type == "radio") && !element.name) {
							ko.bindingHandlers.uniqueName["init"](element, function () {
								return true
							})
						}
					},
					update : function (element, valueAccessor) {
						var value = ko.utils.unwrapObservable(valueAccessor());
						if (element.type == "checkbox") {
							if (value instanceof Array) {
								element.checked = ko.utils.arrayIndexOf(value, element.value) >= 0
							} else {
								element.checked = value
							}
						} else {
							if (element.type == "radio") {
								element.checked = (element.value == value)
							}
						}
					}
				};
				var attrHtmlToJavascriptMap = {
					"class" : "className",
					"for" : "htmlFor"
				};
				ko.bindingHandlers.attr = {
					update : function (element, valueAccessor, allBindingsAccessor) {
						var value = ko.utils.unwrapObservable(valueAccessor()) || {};
						for (var attrName in value) {
							if (typeof attrName == "string") {
								var attrValue = ko.utils.unwrapObservable(value[attrName]);
								var toRemove = (attrValue === false) || (attrValue === null) || (attrValue === undefined);
								if (toRemove) {
									element.removeAttribute(attrName)
								}
								if (ko.utils.ieVersion <= 8 && attrName in attrHtmlToJavascriptMap) {
									attrName = attrHtmlToJavascriptMap[attrName];
									if (toRemove) {
										element.removeAttribute(attrName)
									} else {
										element[attrName] = attrValue
									}
								} else {
									if (!toRemove) {
										element.setAttribute(attrName, attrValue.toString())
									}
								}
							}
						}
					}
				};
				ko.bindingHandlers.hasfocus = {
					init : function (element, valueAccessor, allBindingsAccessor) {
						var writeValue = function (valueToWrite) {
							var modelValue = valueAccessor();
							ko.jsonExpressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, "hasfocus", valueToWrite, true)
						};
						ko.utils.registerEventHandler(element, "focus", function () {
							writeValue(true)
						});
						ko.utils.registerEventHandler(element, "focusin", function () {
							writeValue(true)
						});
						ko.utils.registerEventHandler(element, "blur", function () {
							writeValue(false)
						});
						ko.utils.registerEventHandler(element, "focusout", function () {
							writeValue(false)
						})
					},
					update : function (element, valueAccessor) {
						var value = ko.utils.unwrapObservable(valueAccessor());
						value ? element.focus() : element.blur();
						ko.utils.triggerEvent(element, value ? "focusin" : "focusout")
					}
				};
				ko.bindingHandlers["with"] = {
					makeTemplateValueAccessor : function (valueAccessor) {
						return function () {
							var value = valueAccessor();
							return {
								"if" : value,
								data : value,
								templateEngine : ko.nativeTemplateEngine.instance
							}
						}
					},
					init : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
						return ko.bindingHandlers.template["init"](element, ko.bindingHandlers["with"].makeTemplateValueAccessor(valueAccessor))
					},
					update : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
						return ko.bindingHandlers.template["update"](element, ko.bindingHandlers["with"].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext)
					}
				};
				ko.jsonExpressionRewriting.bindingRewriteValidators["with"] = false;
				ko.virtualElements.allowedBindings["with"] = true;
				ko.bindingHandlers["if"] = {
					makeTemplateValueAccessor : function (valueAccessor) {
						return function () {
							return {
								"if" : valueAccessor(),
								templateEngine : ko.nativeTemplateEngine.instance
							}
						}
					},
					init : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
						return ko.bindingHandlers.template["init"](element, ko.bindingHandlers["if"].makeTemplateValueAccessor(valueAccessor))
					},
					update : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
						return ko.bindingHandlers.template["update"](element, ko.bindingHandlers["if"].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext)
					}
				};
				ko.jsonExpressionRewriting.bindingRewriteValidators["if"] = false;
				ko.virtualElements.allowedBindings["if"] = true;
				ko.bindingHandlers.ifnot = {
					makeTemplateValueAccessor : function (valueAccessor) {
						return function () {
							return {
								ifnot : valueAccessor(),
								templateEngine : ko.nativeTemplateEngine.instance
							}
						}
					},
					init : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
						return ko.bindingHandlers.template["init"](element, ko.bindingHandlers.ifnot.makeTemplateValueAccessor(valueAccessor))
					},
					update : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
						return ko.bindingHandlers.template["update"](element, ko.bindingHandlers.ifnot.makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext)
					}
				};
				ko.jsonExpressionRewriting.bindingRewriteValidators.ifnot = false;
				ko.virtualElements.allowedBindings.ifnot = true;
				ko.bindingHandlers.foreach = {
					makeTemplateValueAccessor : function (valueAccessor) {
						return function () {
							var bindingValue = ko.utils.unwrapObservable(valueAccessor());
							if ((!bindingValue) || typeof bindingValue.length == "number") {
								return {
									foreach : bindingValue,
									templateEngine : ko.nativeTemplateEngine.instance
								}
							}
							return {
								foreach : bindingValue.data,
								includeDestroyed : bindingValue.includeDestroyed,
								afterAdd : bindingValue.afterAdd,
								beforeRemove : bindingValue.beforeRemove,
								afterRender : bindingValue.afterRender,
								templateEngine : ko.nativeTemplateEngine.instance
							}
						}
					},
					init : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
						return ko.bindingHandlers.template["init"](element, ko.bindingHandlers.foreach.makeTemplateValueAccessor(valueAccessor))
					},
					update : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
						return ko.bindingHandlers.template["update"](element, ko.bindingHandlers.foreach.makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext)
					}
				};
				ko.jsonExpressionRewriting.bindingRewriteValidators.foreach = false;
				ko.virtualElements.allowedBindings.foreach = true;
				ko.templateEngine = function () {};
				ko.templateEngine.prototype.renderTemplateSource = function (templateSource, bindingContext, options) {
					throw new Error("Override renderTemplateSource")
				};
				ko.templateEngine.prototype.createJavaScriptEvaluatorBlock = function (script) {
					throw new Error("Override createJavaScriptEvaluatorBlock")
				};
				ko.templateEngine.prototype.makeTemplateSource = function (template, templateDocument) {
					if (typeof template == "string") {
						templateDocument = templateDocument || document;
						var elem = templateDocument.getElementById(template);
						if (!elem) {
							throw new Error("Cannot find template with ID " + template)
						}
						return new ko.templateSources.domElement(elem)
					} else {
						if ((template.nodeType == 1) || (template.nodeType == 8)) {
							return new ko.templateSources.anonymousTemplate(template)
						} else {
							throw new Error("Unknown template type: " + template)
						}
					}
				};
				ko.templateEngine.prototype.renderTemplate = function (template, bindingContext, options, templateDocument) {
					var templateSource = this["makeTemplateSource"](template, templateDocument);
					return this["renderTemplateSource"](templateSource, bindingContext, options)
				};
				ko.templateEngine.prototype.isTemplateRewritten = function (template, templateDocument) {
					if (this["allowTemplateRewriting"] === false) {
						return true
					}
					var templateIsInExternalDocument = templateDocument && templateDocument != document;
					if (!templateIsInExternalDocument && this.knownRewrittenTemplates && this.knownRewrittenTemplates[template]) {
						return true
					}
					return this["makeTemplateSource"](template, templateDocument)["data"]("isRewritten")
				};
				ko.templateEngine.prototype.rewriteTemplate = function (template, rewriterCallback, templateDocument) {
					var templateSource = this["makeTemplateSource"](template, templateDocument);
					var rewritten = rewriterCallback(templateSource.text());
					templateSource.text(rewritten);
					templateSource.data("isRewritten", true);
					var templateIsInExternalDocument = templateDocument && templateDocument != document;
					if (!templateIsInExternalDocument && typeof template == "string") {
						this.knownRewrittenTemplates = this.knownRewrittenTemplates || {};
						this.knownRewrittenTemplates[template] = true
					}
				};
				ko.exportSymbol("templateEngine", ko.templateEngine);
				ko.templateRewriting = (function () {
					var memoizeDataBindingAttributeSyntaxRegex = /(<[a-z]+\d*(\s+(?!data-bind=)[a-z0-9\-]+(=(\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind=(["'])([\s\S]*?)\5/gi;
					var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;
					function validateDataBindValuesForRewriting(keyValueArray) {
						var allValidators = ko.jsonExpressionRewriting.bindingRewriteValidators;
						for (var i = 0; i < keyValueArray.length; i++) {
							var key = keyValueArray[i]["key"];
							if (allValidators.hasOwnProperty(key)) {
								var validator = allValidators[key];
								if (typeof validator === "function") {
									var possibleErrorMessage = validator(keyValueArray[i]["value"]);
									if (possibleErrorMessage) {
										throw new Error(possibleErrorMessage)
									}
								} else {
									if (!validator) {
										throw new Error("This template engine does not support the '" + key + "' binding within its templates")
									}
								}
							}
						}
					}
					function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, templateEngine) {
						var dataBindKeyValueArray = ko.jsonExpressionRewriting.parseObjectLiteral(dataBindAttributeValue);
						validateDataBindValuesForRewriting(dataBindKeyValueArray);
						var rewrittenDataBindAttributeValue = ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson(dataBindKeyValueArray);
						var applyBindingsToNextSiblingScript = "ko.templateRewriting.applyMemoizedBindingsToNextSibling(function() {             return (function() { return { " + rewrittenDataBindAttributeValue + " } })()         })";
						return templateEngine.createJavaScriptEvaluatorBlock(applyBindingsToNextSiblingScript) + tagToRetain
					}
					return {
						ensureTemplateIsRewritten : function (template, templateEngine, templateDocument) {
							if (!templateEngine.isTemplateRewritten(template, templateDocument)) {
								templateEngine.rewriteTemplate(template, function (htmlString) {
									return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine)
								}, templateDocument)
							}
						},
						memoizeBindingAttributeSyntax : function (htmlString, templateEngine) {
							return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function () {
								return constructMemoizedTagReplacement(arguments[6], arguments[1], templateEngine)
							}).replace(memoizeVirtualContainerBindingSyntaxRegex, function () {
								return constructMemoizedTagReplacement(arguments[1], "<!-- ko -->", templateEngine)
							})
						},
						applyMemoizedBindingsToNextSibling : function (bindings) {
							return ko.memoization.memoize(function (domNode, bindingContext) {
								if (domNode.nextSibling) {
									ko.applyBindingsToNode(domNode.nextSibling, bindings, bindingContext)
								}
							})
						}
					}
				})();
				ko.exportSymbol("templateRewriting", ko.templateRewriting);
				ko.exportSymbol("templateRewriting.applyMemoizedBindingsToNextSibling", ko.templateRewriting.applyMemoizedBindingsToNextSibling);
				(function () {
					ko.templateSources = {};
					ko.templateSources.domElement = function (element) {
						this.domElement = element
					};
					ko.templateSources.domElement.prototype.text = function () {
						var tagNameLower = ko.utils.tagNameLower(this.domElement),
						elemContentsProperty = tagNameLower === "script" ? "text" : tagNameLower === "textarea" ? "value" : "innerHTML";
						if (arguments.length == 0) {
							return this.domElement[elemContentsProperty]
						} else {
							var valueToWrite = arguments[0];
							if (elemContentsProperty === "innerHTML") {
								ko.utils.setHtml(this.domElement, valueToWrite)
							} else {
								this.domElement[elemContentsProperty] = valueToWrite
							}
						}
					};
					ko.templateSources.domElement.prototype.data = function (key) {
						if (arguments.length === 1) {
							return ko.utils.domData.get(this.domElement, "templateSourceData_" + key)
						} else {
							ko.utils.domData.set(this.domElement, "templateSourceData_" + key, arguments[1])
						}
					};
					var anonymousTemplatesDomDataKey = "__ko_anon_template__";
					ko.templateSources.anonymousTemplate = function (element) {
						this.domElement = element
					};
					ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
					ko.templateSources.anonymousTemplate.prototype.text = function () {
						if (arguments.length == 0) {
							var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
							if (templateData.textData === undefined && templateData.containerData) {
								templateData.textData = templateData.containerData.innerHTML
							}
							return templateData.textData
						} else {
							var valueToWrite = arguments[0];
							ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {
								textData : valueToWrite
							})
						}
					};
					ko.templateSources.domElement.prototype.nodes = function () {
						if (arguments.length == 0) {
							var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
							return templateData.containerData
						} else {
							var valueToWrite = arguments[0];
							ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {
								containerData : valueToWrite
							})
						}
					};
					ko.exportSymbol("templateSources", ko.templateSources);
					ko.exportSymbol("templateSources.domElement", ko.templateSources.domElement);
					ko.exportSymbol("templateSources.anonymousTemplate", ko.templateSources.anonymousTemplate)
				})();
				(function () {
					var _templateEngine;
					ko.setTemplateEngine = function (templateEngine) {
						if ((templateEngine != undefined) && !(templateEngine instanceof ko.templateEngine)) {
							throw new Error("templateEngine must inherit from ko.templateEngine")
						}
						_templateEngine = templateEngine
					};
					function invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, action) {
						var node,
						nextInQueue = firstNode,
						firstOutOfRangeNode = ko.virtualElements.nextSibling(lastNode);
						while (nextInQueue && ((node = nextInQueue) !== firstOutOfRangeNode)) {
							nextInQueue = ko.virtualElements.nextSibling(node);
							if (node.nodeType === 1 || node.nodeType === 8) {
								action(node)
							}
						}
					}
					function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext) {
						if (continuousNodeArray.length) {
							var firstNode = continuousNodeArray[0],
							lastNode = continuousNodeArray[continuousNodeArray.length - 1];
							invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, function (node) {
								ko.applyBindings(bindingContext, node)
							});
							invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, function (node) {
								ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext])
							})
						}
					}
					function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
						return nodeOrNodeArray.nodeType ? nodeOrNodeArray : nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0] : null
					}
					function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
						options = options || {};
						var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
						var templateDocument = firstTargetNode && firstTargetNode.ownerDocument;
						var templateEngineToUse = (options.templateEngine || _templateEngine);
						ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse, templateDocument);
						var renderedNodesArray = templateEngineToUse.renderTemplate(template, bindingContext, options, templateDocument);
						if ((typeof renderedNodesArray.length != "number") || (renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number")) {
							throw new Error("Template engine must return an array of DOM nodes")
						}
						var haveAddedNodesToParent = false;
						switch (renderMode) {
						case "replaceChildren":
							ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
							haveAddedNodesToParent = true;
							break;
						case "replaceNode":
							ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
							haveAddedNodesToParent = true;
							break;
						case "ignoreTargetNode":
							break;
						default:
							throw new Error("Unknown renderMode: " + renderMode)
						}
						if (haveAddedNodesToParent) {
							activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext);
							if (options.afterRender) {
								options.afterRender(renderedNodesArray, bindingContext["$data"])
							}
						}
						return renderedNodesArray
					}
					ko.renderTemplate = function (template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
						options = options || {};
						if ((options.templateEngine || _templateEngine) == undefined) {
							throw new Error("Set a template engine before calling renderTemplate")
						}
						renderMode = renderMode || "replaceChildren";
						if (targetNodeOrNodeArray) {
							var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
							var whenToDispose = function () {
								return (!firstTargetNode) || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode)
							};
							var activelyDisposeWhenNodeIsRemoved = (firstTargetNode && renderMode == "replaceNode") ? firstTargetNode.parentNode : firstTargetNode;
							return ko.dependentObservable(function () {
								var bindingContext = (dataOrBindingContext && (dataOrBindingContext instanceof ko.bindingContext)) ? dataOrBindingContext : new ko.bindingContext(ko.utils.unwrapObservable(dataOrBindingContext));
								var templateName = typeof(template) == "function" ? template(bindingContext["$data"]) : template;
								var renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);
								if (renderMode == "replaceNode") {
									targetNodeOrNodeArray = renderedNodesArray;
									firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray)
								}
							}, null, {
								disposeWhen : whenToDispose,
								disposeWhenNodeIsRemoved : activelyDisposeWhenNodeIsRemoved
							})
						} else {
							return ko.memoization.memoize(function (domNode) {
								ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode")
							})
						}
					};
					ko.renderTemplateForEach = function (template, arrayOrObservableArray, options, targetNode, parentBindingContext) {
						var arrayItemContext;
						var executeTemplateForArrayItem = function (arrayValue, index) {
							var templateName = typeof(template) == "function" ? template(arrayValue) : template;
							arrayItemContext = parentBindingContext.createChildContext(ko.utils.unwrapObservable(arrayValue));
							arrayItemContext["$index"] = index;
							return executeTemplate(null, "ignoreTargetNode", templateName, arrayItemContext, options)
						};
						var activateBindingsCallback = function (arrayValue, addedNodesArray, index) {
							activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext);
							if (options.afterRender) {
								options.afterRender(addedNodesArray, arrayValue)
							}
						};
						return ko.dependentObservable(function () {
							var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
							if (typeof unwrappedArray.length == "undefined") {
								unwrappedArray = [unwrappedArray]
							}
							var filteredArray = ko.utils.arrayFilter(unwrappedArray, function (item) {
									return options.includeDestroyed || item === undefined || item === null || !ko.utils.unwrapObservable(item._destroy)
								});
							ko.utils.setDomNodeChildrenFromArrayMapping(targetNode, filteredArray, executeTemplateForArrayItem, options, activateBindingsCallback)
						}, null, {
							disposeWhenNodeIsRemoved : targetNode
						})
					};
					var templateSubscriptionDomDataKey = "__ko__templateSubscriptionDomDataKey__";
					function disposeOldSubscriptionAndStoreNewOne(element, newSubscription) {
						var oldSubscription = ko.utils.domData.get(element, templateSubscriptionDomDataKey);
						if (oldSubscription && (typeof(oldSubscription.dispose) == "function")) {
							oldSubscription.dispose()
						}
						ko.utils.domData.set(element, templateSubscriptionDomDataKey, newSubscription)
					}
					ko.bindingHandlers.template = {
						init : function (element, valueAccessor) {
							var bindingValue = ko.utils.unwrapObservable(valueAccessor());
							if ((typeof bindingValue != "string") && (!bindingValue.name) && (element.nodeType == 1 || element.nodeType == 8)) {
								var templateNodes = element.nodeType == 1 ? element.childNodes : ko.virtualElements.childNodes(element),
								container = ko.utils.moveCleanedNodesToContainerElement(templateNodes);
								new ko.templateSources.anonymousTemplate(element)["nodes"](container)
							}
							return {
								controlsDescendantBindings : true
							}
						},
						update : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
							var bindingValue = ko.utils.unwrapObservable(valueAccessor());
							var templateName;
							var shouldDisplay = true;
							if (typeof bindingValue == "string") {
								templateName = bindingValue
							} else {
								templateName = bindingValue.name;
								if ("if" in bindingValue) {
									shouldDisplay = shouldDisplay && ko.utils.unwrapObservable(bindingValue["if"])
								}
								if ("ifnot" in bindingValue) {
									shouldDisplay = shouldDisplay && !ko.utils.unwrapObservable(bindingValue.ifnot)
								}
							}
							var templateSubscription = null;
							if ((typeof bindingValue === "object") && ("foreach" in bindingValue)) {
								var dataArray = (shouldDisplay && bindingValue.foreach) || [];
								templateSubscription = ko.renderTemplateForEach(templateName || element, dataArray, bindingValue, element, bindingContext)
							} else {
								if (shouldDisplay) {
									var innerBindingContext = (typeof bindingValue == "object") && ("data" in bindingValue) ? bindingContext.createChildContext(ko.utils.unwrapObservable(bindingValue.data)) : bindingContext;
									templateSubscription = ko.renderTemplate(templateName || element, innerBindingContext, bindingValue, element)
								} else {
									ko.virtualElements.emptyNode(element)
								}
							}
							disposeOldSubscriptionAndStoreNewOne(element, templateSubscription)
						}
					};
					ko.jsonExpressionRewriting.bindingRewriteValidators.template = function (bindingValue) {
						var parsedBindingValue = ko.jsonExpressionRewriting.parseObjectLiteral(bindingValue);
						if ((parsedBindingValue.length == 1) && parsedBindingValue[0]["unknown"]) {
							return null
						}
						if (ko.jsonExpressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name")) {
							return null
						}
						return "This template engine does not support anonymous templates nested within its templates"
					};
					ko.virtualElements.allowedBindings.template = true
				})();
				ko.exportSymbol("setTemplateEngine", ko.setTemplateEngine);
				ko.exportSymbol("renderTemplate", ko.renderTemplate);
				(function () {
					function calculateEditDistanceMatrix(oldArray, newArray, maxAllowedDistance) {
						var distances = [];
						for (var i = 0; i <= newArray.length; i++) {
							distances[i] = []
						}
						for (var i = 0, j = Math.min(oldArray.length, maxAllowedDistance); i <= j; i++) {
							distances[0][i] = i
						}
						for (var i = 1, j = Math.min(newArray.length, maxAllowedDistance); i <= j; i++) {
							distances[i][0] = i
						}
						var oldIndex,
						oldIndexMax = oldArray.length,
						newIndex,
						newIndexMax = newArray.length;
						var distanceViaAddition,
						distanceViaDeletion;
						for (oldIndex = 1; oldIndex <= oldIndexMax; oldIndex++) {
							var newIndexMinForRow = Math.max(1, oldIndex - maxAllowedDistance);
							var newIndexMaxForRow = Math.min(newIndexMax, oldIndex + maxAllowedDistance);
							for (newIndex = newIndexMinForRow; newIndex <= newIndexMaxForRow; newIndex++) {
								if (oldArray[oldIndex - 1] === newArray[newIndex - 1]) {
									distances[newIndex][oldIndex] = distances[newIndex - 1][oldIndex - 1]
								} else {
									var northDistance = distances[newIndex - 1][oldIndex] === undefined ? Number.MAX_VALUE : distances[newIndex - 1][oldIndex] + 1;
									var westDistance = distances[newIndex][oldIndex - 1] === undefined ? Number.MAX_VALUE : distances[newIndex][oldIndex - 1] + 1;
									distances[newIndex][oldIndex] = Math.min(northDistance, westDistance)
								}
							}
						}
						return distances
					}
					function findEditScriptFromEditDistanceMatrix(editDistanceMatrix, oldArray, newArray) {
						var oldIndex = oldArray.length;
						var newIndex = newArray.length;
						var editScript = [];
						var maxDistance = editDistanceMatrix[newIndex][oldIndex];
						if (maxDistance === undefined) {
							return null
						}
						while ((oldIndex > 0) || (newIndex > 0)) {
							var me = editDistanceMatrix[newIndex][oldIndex];
							var distanceViaAdd = (newIndex > 0) ? editDistanceMatrix[newIndex - 1][oldIndex] : maxDistance + 1;
							var distanceViaDelete = (oldIndex > 0) ? editDistanceMatrix[newIndex][oldIndex - 1] : maxDistance + 1;
							var distanceViaRetain = (newIndex > 0) && (oldIndex > 0) ? editDistanceMatrix[newIndex - 1][oldIndex - 1] : maxDistance + 1;
							if ((distanceViaAdd === undefined) || (distanceViaAdd < me - 1)) {
								distanceViaAdd = maxDistance + 1
							}
							if ((distanceViaDelete === undefined) || (distanceViaDelete < me - 1)) {
								distanceViaDelete = maxDistance + 1
							}
							if (distanceViaRetain < me - 1) {
								distanceViaRetain = maxDistance + 1
							}
							if ((distanceViaAdd <= distanceViaDelete) && (distanceViaAdd < distanceViaRetain)) {
								editScript.push({
									status : "added",
									value : newArray[newIndex - 1]
								});
								newIndex--
							} else {
								if ((distanceViaDelete < distanceViaAdd) && (distanceViaDelete < distanceViaRetain)) {
									editScript.push({
										status : "deleted",
										value : oldArray[oldIndex - 1]
									});
									oldIndex--
								} else {
									editScript.push({
										status : "retained",
										value : oldArray[oldIndex - 1]
									});
									newIndex--;
									oldIndex--
								}
							}
						}
						return editScript.reverse()
					}
					ko.utils.compareArrays = function (oldArray, newArray, maxEditsToConsider) {
						if (maxEditsToConsider === undefined) {
							return ko.utils.compareArrays(oldArray, newArray, 1) || ko.utils.compareArrays(oldArray, newArray, 10) || ko.utils.compareArrays(oldArray, newArray, Number.MAX_VALUE)
						} else {
							oldArray = oldArray || [];
							newArray = newArray || [];
							var editDistanceMatrix = calculateEditDistanceMatrix(oldArray, newArray, maxEditsToConsider);
							return findEditScriptFromEditDistanceMatrix(editDistanceMatrix, oldArray, newArray)
						}
					}
				})();
				ko.exportSymbol("utils.compareArrays", ko.utils.compareArrays);
				(function () {
					function fixUpVirtualElements(contiguousNodeArray) {
						if (contiguousNodeArray.length > 2) {
							var current = contiguousNodeArray[0],
							last = contiguousNodeArray[contiguousNodeArray.length - 1],
							newContiguousSet = [current];
							while (current !== last) {
								current = current.nextSibling;
								if (!current) {
									return
								}
								newContiguousSet.push(current)
							}
							Array.prototype.splice.apply(contiguousNodeArray, [0, contiguousNodeArray.length].concat(newContiguousSet))
						}
					}
					function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {
						var mappedNodes = [];
						var dependentObservable = ko.dependentObservable(function () {
								var newMappedNodes = mapping(valueToMap, index) || [];
								if (mappedNodes.length > 0) {
									fixUpVirtualElements(mappedNodes);
									ko.utils.replaceDomNodes(mappedNodes, newMappedNodes);
									if (callbackAfterAddingNodes) {
										callbackAfterAddingNodes(valueToMap, newMappedNodes)
									}
								}
								mappedNodes.splice(0, mappedNodes.length);
								ko.utils.arrayPushAll(mappedNodes, newMappedNodes)
							}, null, {
								disposeWhenNodeIsRemoved : containerNode,
								disposeWhen : function () {
									return (mappedNodes.length == 0) || !ko.utils.domNodeIsAttachedToDocument(mappedNodes[0])
								}
							});
						return {
							mappedNodes : mappedNodes,
							dependentObservable : dependentObservable
						}
					}
					var lastMappingResultDomDataKey = "setDomNodeChildrenFromArrayMapping_lastMappingResult";
					ko.utils.setDomNodeChildrenFromArrayMapping = function (domNode, array, mapping, options, callbackAfterAddingNodes) {
						array = array || [];
						options = options || {};
						var isFirstExecution = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) === undefined;
						var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) || [];
						var lastArray = ko.utils.arrayMap(lastMappingResult, function (x) {
								return x.arrayEntry
							});
						var editScript = ko.utils.compareArrays(lastArray, array);
						var newMappingResult = [];
						var lastMappingResultIndex = 0;
						var nodesToDelete = [];
						var newMappingResultIndex = 0;
						var nodesAdded = [];
						var insertAfterNode = null;
						for (var i = 0, j = editScript.length; i < j; i++) {
							switch (editScript[i].status) {
							case "retained":
								var dataToRetain = lastMappingResult[lastMappingResultIndex];
								dataToRetain.indexObservable(newMappingResultIndex);
								newMappingResultIndex = newMappingResult.push(dataToRetain);
								if (dataToRetain.domNodes.length > 0) {
									insertAfterNode = dataToRetain.domNodes[dataToRetain.domNodes.length - 1]
								}
								lastMappingResultIndex++;
								break;
							case "deleted":
								lastMappingResult[lastMappingResultIndex].dependentObservable.dispose();
								fixUpVirtualElements(lastMappingResult[lastMappingResultIndex].domNodes);
								ko.utils.arrayForEach(lastMappingResult[lastMappingResultIndex].domNodes, function (node) {
									nodesToDelete.push({
										element : node,
										index : i,
										value : editScript[i].value
									});
									insertAfterNode = node
								});
								lastMappingResultIndex++;
								break;
							case "added":
								var valueToMap = editScript[i].value;
								var indexObservable = ko.observable(newMappingResultIndex);
								var mapData = mapNodeAndRefreshWhenChanged(domNode, mapping, valueToMap, callbackAfterAddingNodes, indexObservable);
								var mappedNodes = mapData.mappedNodes;
								newMappingResultIndex = newMappingResult.push({
										arrayEntry : editScript[i].value,
										domNodes : mappedNodes,
										dependentObservable : mapData.dependentObservable,
										indexObservable : indexObservable
									});
								for (var nodeIndex = 0, nodeIndexMax = mappedNodes.length; nodeIndex < nodeIndexMax; nodeIndex++) {
									var node = mappedNodes[nodeIndex];
									nodesAdded.push({
										element : node,
										index : i,
										value : editScript[i].value
									});
									if (insertAfterNode == null) {
										ko.virtualElements.prepend(domNode, node)
									} else {
										ko.virtualElements.insertAfter(domNode, node, insertAfterNode)
									}
									insertAfterNode = node
								}
								if (callbackAfterAddingNodes) {
									callbackAfterAddingNodes(valueToMap, mappedNodes, indexObservable)
								}
								break
							}
						}
						ko.utils.arrayForEach(nodesToDelete, function (node) {
							ko.cleanNode(node.element)
						});
						var invokedBeforeRemoveCallback = false;
						if (!isFirstExecution) {
							if (options.afterAdd) {
								for (var i = 0; i < nodesAdded.length; i++) {
									options.afterAdd(nodesAdded[i].element, nodesAdded[i].index, nodesAdded[i].value)
								}
							}
							if (options.beforeRemove) {
								for (var i = 0; i < nodesToDelete.length; i++) {
									options.beforeRemove(nodesToDelete[i].element, nodesToDelete[i].index, nodesToDelete[i].value)
								}
								invokedBeforeRemoveCallback = true
							}
						}
						if (!invokedBeforeRemoveCallback && nodesToDelete.length) {
							for (var i = 0; i < nodesToDelete.length; i++) {
								var element = nodesToDelete[i].element;
								if (element.parentNode) {
									element.parentNode.removeChild(element)
								}
							}
						}
						ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult)
					}
				})();
				ko.exportSymbol("utils.setDomNodeChildrenFromArrayMapping", ko.utils.setDomNodeChildrenFromArrayMapping);
				ko.nativeTemplateEngine = function () {
					this["allowTemplateRewriting"] = false
				};
				ko.nativeTemplateEngine.prototype = new ko.templateEngine();
				ko.nativeTemplateEngine.prototype.renderTemplateSource = function (templateSource, bindingContext, options) {
					var useNodesIfAvailable = !(ko.utils.ieVersion < 9),
					templateNodesFunc = useNodesIfAvailable ? templateSource.nodes : null,
					templateNodes = templateNodesFunc ? templateSource.nodes() : null;
					if (templateNodes) {
						return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes)
					} else {
						var templateText = templateSource.text();
						return ko.utils.parseHtmlFragment(templateText)
					}
				};
				ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
				ko.setTemplateEngine(ko.nativeTemplateEngine.instance);
				ko.exportSymbol("nativeTemplateEngine", ko.nativeTemplateEngine);
				(function () {
					ko.jqueryTmplTemplateEngine = function () {
						var jQueryTmplVersion = this.jQueryTmplVersion = (function () {
								if ((typeof(jQuery) == "undefined") || !(jQuery.tmpl)) {
									return 0
								}
								try {
									if (jQuery.tmpl["tag"]["tmpl"]["open"].toString().indexOf("__") >= 0) {
										return 2
									}
								} catch (ex) {}
								
								return 1
							})();
						function ensureHasReferencedJQueryTemplates() {
							if (jQueryTmplVersion < 2) {
								throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.")
							}
						}
						function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
							return jQuery.tmpl(compiledTemplate, data, jQueryTemplateOptions)
						}
						this["renderTemplateSource"] = function (templateSource, bindingContext, options) {
							options = options || {};
							ensureHasReferencedJQueryTemplates();
							var precompiled = templateSource.data("precompiled");
							if (!precompiled) {
								var templateText = templateSource.text() || "";
								templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";
								precompiled = jQuery.template(null, templateText);
								templateSource.data("precompiled", precompiled)
							}
							var data = [bindingContext["$data"]];
							var jQueryTemplateOptions = jQuery.extend({
									koBindingContext : bindingContext
								}, options.templateOptions);
							var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
							resultNodes.appendTo(document.createElement("div"));
							jQuery.fragments = {};
							return resultNodes
						};
						this["createJavaScriptEvaluatorBlock"] = function (script) {
							return "{{ko_code ((function() { return " + script + " })()) }}"
						};
						this["addTemplate"] = function (templateName, templateMarkup) {
							document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "</script>")
						};
						if (jQueryTmplVersion > 0) {
							jQuery.tmpl["tag"]["ko_code"] = {
								open : "__.push($1 || '');"
							};
							jQuery.tmpl["tag"]["ko_with"] = {
								open : "with($1) {",
								close : "} "
							}
						}
					};
					ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();
					var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
					if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0) {
						ko.setTemplateEngine(jqueryTmplTemplateEngineInstance)
					}
					ko.exportSymbol("jqueryTmplTemplateEngine", ko.jqueryTmplTemplateEngine)
				})()
			})
		})(window, document, navigator);
		Templating.observable = function (obj) {
			if (typeof(obj) === "object" && obj.constructor == Array) {
				return _privateKo.observableArray(obj)
			}
			if (typeof(obj) === "function") {
				return _privateKo.computed(obj)
			}
			return _privateKo.observable(obj)
		};
		Templating.applyBindings = function (arg) {
			if (!arg.node) {
				arg.node = window.document.body
			}
			if (arg.binding) {
				_privateKo.applyBindingsToNode(arg.node, arg.binding, arg.viewModel)
			} else {
				_privateKo.applyBindings(arg.viewModel, arg.node)
			}
		};
		Templating.inject = function (args) {
			var template = '<script id="' + args.id + '" type="text/html">';
			template += args.content;
			template += "</script>";
			if (typeof args.target == "undefined" || args.target.toLowerCase() == "body") {
				var dummyDiv = document.createElement("div");
				dummyDiv.setAttribute("style", "display:none;");
				document.body.appendChild(dummyDiv);
				_privateKo.utils.setHtml(dummyDiv, template)
			} else {
				var elm = xRTML.Sizzle(args.target)[0];
				_privateKo.utils.setHtml(elm, template)
			}
		};
		Templating.clearNode = function (node) {
			_privateKo.cleanNode(node)
		};
		_privateKo.bindingHandlers.cssClass = {
			update : function (element, valueAccessor) {
				var newClass = _privateKo.utils.unwrapObservable(valueAccessor());
				element.className = newClass
			}
		};
		Templating.bindingHandlers = _privateKo.bindingHandlers
	})(xRTML.Templating = xRTML.Templating || {})
})(window.xRTML = window.xRTML || {});
function guidGenerator() {
	var S4 = function () {
		return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1)
	};
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4())
}
(function (xRTML, undefined) {
	(function (Metadata, undefined) {
		var Module = function (config) {
			var _self = this;
			var _name = config.name || "";
			var _namespace = config.namespace || "";
			var _description = config.description || "";
			var _properties = config.properties || undefined;
			var _methods = config.methods || undefined;
			var _events = config.events || undefined;
			var _classes = config.classes || undefined;
			var _modules = config.modules || undefined;
			this.Name = (function () {
				return _name
			})();
			this.Namespace = (function () {
				return _namespace
			})();
			this.Description = (function () {
				return _description
			})();
			this.Properties = (function () {
				return _properties
			})();
			this.Methods = (function () {
				return _methods
			})();
			this.Events = (function () {
				return _events
			})();
			this.Classes = (function () {
				return _classes
			})();
			this.Modules = (function () {
				return _modules
			})()
		};
		var Class = function (config) {
			var _self = this;
			var _name = config.name || "";
			var _namespace = config.namespace || "";
			var _base = config.base || undefined;
			var _subclasses = config.subclasses || undefined;
			var _constructors = config.constructors || undefined;
			var _description = config.description || "";
			var _properties = config.properties || undefined;
			var _methods = config.methods || undefined;
			var _events = config.events || undefined;
			this.Name = (function () {
				return _name
			})();
			this.Namespace = (function () {
				return _namespace
			})();
			this.Base = (function () {
				return _base
			})();
			this.Subclasses = (function () {
				return _subclasses
			})();
			this.Constructors = (function () {
				return _constructors
			})();
			this.Description = (function () {
				return _description
			})();
			this.Properties = (function () {
				return _properties
			})();
			this.Methods = (function () {
				return _methods
			})();
			this.Events = (function () {
				return _events
			})();
			this.toString = function () {
				return (this.Namespace.length > 0) ? this.Namespace + "." + this.Name : this.Name
			};
			this.typeOf = config.typeOf || function () {
				return _self.toString()
			}
		};
		var Property = function (config) {
			var _name = config.name || "";
			var _description = config.description || "";
			var _mandatory = config.mandatory || false;
			var _type = config.type || undefined;
			this.Name = (function () {
				return _name
			})();
			this.Description = (function () {
				return _description
			})();
			this.Mandatory = (function () {
				return _mandatory
			})();
			this.Type = (function () {
				return _type
			})()
		};
		var Method = function (config) {
			var _name = config.name || "";
			var _description = config.description || "";
			var _arguments = config.arguments || "";
			var _return = config["return"] || undefined;
			var _exceptions = config.exceptions || "";
			this.Name = (function () {
				return _name
			})();
			this.Description = (function () {
				return _description
			})();
			this.Arguments = (function () {
				return _arguments
			})();
			this.Return = (function () {
				return _return
			})();
			this.Exceptions = (function () {
				return _exceptions
			})()
		};
		var Argument = function (config) {
			var _name = config.name || "";
			var _description = config.description || "";
			var _mandatory = config.mandatory || false;
			var _type = config.type || undefined;
			this.Name = (function () {
				return _name
			})();
			this.Description = (function () {
				return _description
			})();
			this.Mandatory = (function () {
				return _mandatory
			})();
			this.Type = (function () {
				return _type
			})()
		};
		var Event = function (config) {
			var _name = config.name || "";
			var _handler = config.handler || undefined;
			this.Name = (function () {
				return _name
			})();
			this.Handler = (function () {
				return _handler
			})()
		};
		var Handler = function (config) {
			var _name = config.name || "";
			var _namespace = config.namespace || "";
			var _description = config.description || "";
			var _arguments = config.arguments || undefined;
			this.Name = (function () {
				return _name
			})();
			this.Namespace = (function () {
				return _namespace
			})();
			this.Description = (function () {
				return _description
			})();
			this.Arguments = (function () {
				return _arguments
			})()
		};
		var _metadata = {
			root : new Module({
				name : "root",
				classes : {
					String : new Class({
						name : "String",
						typeOf : function () {
							return "String"
						}
					}),
					Number : new Class({
						name : "String",
						typeOf : function () {
							return "Number"
						}
					}),
					Boolean : new Class({
						name : "String",
						typeOf : function () {
							return "Boolean"
						}
					}),
					Function : new Class({
						name : "String",
						typeOf : function () {
							return "Function"
						}
					}),
					Array : new Class({
						name : "String",
						typeOf : function () {
							return "Array"
						}
					}),
					Function : new Class({
						name : "String",
						typeOf : function () {
							return "Function"
						}
					}),
					Date : new Class({
						name : "String",
						typeOf : function () {
							return "Date"
						}
					}),
					Object : new Class({
						name : "String",
						typeOf : function () {
							return "Object"
						}
					}),
					RegExp : new Class({
						name : "String",
						typeOf : function () {
							return "RegExp"
						}
					}),
					Error : new Class({
						name : "String",
						typeOf : function () {
							return "Error"
						}
					})
				},
				modules : {
					xRTML : new Module({
						name : "xRTML",
						modules : {
							Tags : new Module({
								name : "Tags",
								classes : new Object()
							})
						}
					}),
					Anonymous : new Module({
						name : "Anonymous"
					})
				}
			})
		};
		var _unresolvedTypes = {};
		var addUnresolvedTypes = function (type, reference, propertyName) {
			if (!_unresolvedTypes[type]) {
				_unresolvedTypes[type] = new Array()
			}
			_unresolvedTypes[type].push({
				reference : reference,
				propertyName : propertyName
			})
		};
		Metadata.fixUnresolvedTypes = function () {
			for (var type in _unresolvedTypes) {
				var _type = getClassObject(type);
				if (_type) {
					for (var i = 0; i < _unresolvedTypes[type].length; i++) {
						_unresolvedTypes[type][i].reference[_unresolvedTypes[type][i].propertyName] = _type
					}
					delete _unresolvedTypes[type]
				}
			}
			for (var type in _unresolvedTypes) {
				console.warn(type + " -> " + _unresolvedTypes[type].length)
			}
		};
		var getModuleObject = function (namespace) {
			if (namespace == undefined || namespace.length == 0) {
				return _metadata.root
			}
			var _namespace,
			_module,
			_separator = namespace.lastIndexOf(".");
			if (_separator === -1) {
				_module = namespace
			} else {
				_namespace = namespace.substring(0, _separator);
				_module = namespace.substring(_separator + 1)
			}
			var _moduleObj = _metadata.root;
			if (_namespace != undefined) {
				_moduleObj = getModuleObject(_namespace)
			}
			return _moduleObj.Modules[_module]
		};
		var getClassObject = function (namespace) {
			var _namespace,
			_class,
			_separator = namespace.lastIndexOf(".");
			if (_separator === -1) {
				_class = namespace
			} else {
				_namespace = namespace.substring(0, _separator);
				_class = namespace.substring(_separator + 1)
			}
			var _classObj = _metadata.root;
			if (_namespace != undefined) {
				_classObj = getModuleObject(_namespace)
			}
			return (_classObj) ? _classObj.Classes[_class] : undefined
		};
		Metadata.registerModule = function (config) {
			var _namespace,
			_module,
			_separator = config.name.lastIndexOf(".");
			if (_separator != -1) {
				config.namespace = config.name.substring(0, _separator);
				config.name = config.name.substring(_separator + 1)
			}
			var _type = new Module({
					name : config.name,
					namespace : config.namespace,
					description : config.description
				});
			var _module = getModuleObject(config.namespace);
			if (!_module.Modules) {
				_module.Modules = {}
				
			}
			_module.Modules[config.name] = _type;
			for (var i = 0; i < config.classes.length; i++) {
				this.registerClass(config.classes[i])
			}
			var _properties = {};
			for (var _propName in config.properties) {
				var _propType = undefined;
				if (config.properties[_propName].type instanceof String || typeof(config.properties[_propName].type) == "string") {
					_propType = getClassObject(config.properties[_propName].type)
				} else {
					_propType = this.registerClass(config.properties[_propName].type)
				}
				_properties[_propName] = new Property({
						name : _propName,
						description : config.properties[_propName].description,
						mandatory : config.properties[_propName].mandatory,
						type : _propType
					});
				if (!_properties[_propName].Type) {
					addUnresolvedTypes(config.properties[_propName], _properties[_propName], "Type")
				}
			}
			var _methods = {};
			for (var _methodName in config.methods) {
				var _arguments = {};
				for (var _argName in config.methods[_methodName].arguments) {
					var _argType = undefined;
					if (config.methods[_methodName].arguments[_argName].type instanceof String || typeof(config.methods[_methodName].arguments[_argName].type) == "string") {
						_argType = getClassObject(config.methods[_methodName].arguments[_argName].type)
					} else {
						_argType = this.registerClass(config.methods[_methodName].arguments[_argName].type)
					}
					_arguments[_argName] = new Argument({
							name : _argName,
							description : config.methods[_methodName].arguments[_argName].description,
							mandatory : config.methods[_methodName].arguments[_argName].mandatory,
							type : _argType
						});
					if (!_arguments[_argName].Type) {
						addUnresolvedTypes(config.methods[_methodName].arguments[_argName], _arguments[_argName], "Type")
					}
				}
				var _exceptions = {};
				for (var i = 0; i < config.methods[_methodName].exceptions.length; i++) {
					if (config.methods[_methodName].exceptions[i]instanceof String || typeof(config.methods[_methodName].exceptions[i]) == "string") {
						var _exception = getClassObject(config.methods[_methodName].exceptions[i]);
						if (_exception != undefined) {
							_exceptions[_exception.toString()] = _exception
						} else {
							throw "Type " + config.methods[_methodName].exceptions[i] + " is not defined"
						}
					} else {
						var _exception = this.registerClass(config.methods[_methodName].exceptions[i]);
						_exceptions[_exception.toString()] = _exception
					}
				}
				var _method = {
					name : _methodName,
					description : config.methods[_methodName].description,
					arguments : _arguments,
					exceptions : _exceptions
				};
				if (config.methods[_methodName]["return"]) {
					if (config.methods[_methodName]["return"]instanceof String || typeof(config.methods[_methodName]["return"]) == "string") {
						_method["return"] = getClassObject(config.methods[_methodName]["return"])
					} else {
						_method["return"] = this.registerClass(config.methods[_methodName]["return"])
					}
				}
				_methods[_methodName] = new Method(_method);
				if (config.methods[_methodName]["return"] && !_methods[_methodName].Return) {
					addUnresolvedTypes(config.methods[_methodName]["return"], _methods[_methodName], "Return")
				}
			}
			var _events = {};
			for (var _eventName in config.events) {
				var _eventHandler = undefined;
				if (config.events[_eventName].type instanceof String || typeof(config.events[_eventName].type) == "string") {
					_eventHandler = getClassObject(config.events[_eventName].handler)
				} else {
					_eventHandler = this.registerHandler(config.events[_eventName].handler)
				}
				_events[_eventName] = new Event({
						name : _eventName,
						description : config.events[_eventName].description,
						handler : _eventHandler
					})
			}
			_type.Properties = _properties;
			_type.Methods = _methods;
			_type.Events = _events;
			return _type
		};
		Metadata.registerClass = function (config) {
			if (config.name == undefined) {
				config.name = guidGenerator()
			}
			if (config.namespace == undefined) {
				config.namespace = "Anonymous"
			}
			var _base = undefined;
			if (config["extends"]) {
				_base = getClassObject(config["extends"])
			}
			var populateObject = function (obj) {
				var _ret = {};
				for (var _prop in obj) {
					_ret[_prop] = obj[_prop]
				}
				return _ret
			};
			var _properties = (_base) ? populateObject(_base.Properties) : {};
			for (var _propName in config.properties) {
				var _propType = undefined;
				if (config.properties[_propName].type instanceof String || typeof(config.properties[_propName].type) == "string") {
					_propType = getClassObject(config.properties[_propName].type)
				} else {
					_propType = this.registerClass(config.properties[_propName].type)
				}
				_properties[_propName] = new Property({
						name : _propName,
						description : config.properties[_propName].description,
						mandatory : config.properties[_propName].mandatory,
						type : _propType
					});
				if (!_properties[_propName].Type) {
					addUnresolvedTypes(config.properties[_propName].type, _properties[_propName], "Type")
				}
			}
			var _constructors = (_base) ? populateObject(_base.constructors) : {};
			for (var _methodName in config.constructors) {
				var _arguments = {};
				for (var _argName in config.constructors[_methodName].arguments) {
					var _argType = undefined;
					if (config.constructors[_methodName].arguments[_argName].type instanceof String || typeof(config.constructors[_methodName].arguments[_argName].type) == "string") {
						_argType = getClassObject(config.constructors[_methodName].arguments[_argName].type)
					} else {
						_argType = this.registerClass(config.constructors[_methodName].arguments[_argName].type)
					}
					_arguments[_argName] = new Argument({
							name : _argName,
							description : config.constructors[_methodName].arguments[_argName].description,
							mandatory : config.constructors[_methodName].arguments[_argName].mandatory,
							type : _argType
						});
					if (!_arguments[_argName].Type) {
						addUnresolvedTypes(config.constructors[_methodName].arguments[_argName].type, _arguments[_argName], "Type")
					}
				}
				var _exceptions = {};
				for (var i = 0; i < config.constructors[_methodName].exceptions.length; i++) {
					if (config.constructors[_methodName].exceptions[i]instanceof String || typeof(config.constructors[_methodName].exceptions[i]) == "string") {
						var _exception = getClassObject(config.constructors[_methodName].exceptions[i]);
						_exceptions[_exception.toString()] = _exception;
						if (!_exceptions[_exception.toString()]) {
							addUnresolvedTypes(config.constructors[_methodName].exceptions[i], _exceptions, _exception.toString())
						}
					} else {
						var _exception = this.registerClass(config.constructors[_methodName].exceptions[i]);
						_exceptions[_exception.toString()] = _exception
					}
				}
				var _method = {
					name : _methodName,
					description : config.constructors[_methodName].description,
					arguments : _arguments,
					exceptions : _exceptions
				};
				if (config.constructors[_methodName]["return"]) {
					if (config.constructors[_methodName]["return"]instanceof String || typeof(config.constructors[_methodName]["return"]) == "string") {
						_method["return"] = getClassObject(config.constructors[_methodName]["return"])
					} else {
						_method["return"] = this.registerClass(config.constructors[_methodName]["return"])
					}
				}
				_constructors[_methodName] = new Method(_method);
				if (config.constructors[_methodName]["return"] && !_constructors[_methodName].Return) {
					addUnresolvedTypes(config.constructors[_methodName]["return"], _constructors[_methodName], "Return")
				}
			}
			var _methods = (_base) ? populateObject(_base.Methods) : {};
			for (var _methodName in config.methods) {
				var _arguments = {};
				for (var _argName in config.methods[_methodName].arguments) {
					var _argType = undefined;
					if (config.methods[_methodName].arguments[_argName].type instanceof String || typeof(config.methods[_methodName].arguments[_argName].type) == "string") {
						_argType = getClassObject(config.methods[_methodName].arguments[_argName].type)
					} else {
						_argType = this.registerClass(config.methods[_methodName].arguments[_argName].type)
					}
					_arguments[_argName] = new Argument({
							name : _argName,
							description : config.methods[_methodName].arguments[_argName].description,
							mandatory : config.methods[_methodName].arguments[_argName].mandatory,
							type : _argType
						});
					if (!_arguments[_argName].Type) {
						addUnresolvedTypes(config.methods[_methodName].arguments[_argName].type, _arguments[_argName], "Type")
					}
				}
				var _exceptions = {};
				for (var i = 0; i < config.methods[_methodName].exceptions.length; i++) {
					if (config.methods[_methodName].exceptions[i]instanceof String || typeof(config.methods[_methodName].exceptions[i]) == "string") {
						var _exception = getClassObject(config.methods[_methodName].exceptions[i]);
						_exceptions[_exception.toString()] = _exception;
						if (!_exceptions[_exception.toString()]) {
							addUnresolvedTypes(config.methods[_methodName].exceptions[i], _exceptions, _exception.toString())
						}
					} else {
						var _exception = this.registerClass(config.methods[_methodName].exceptions[i]);
						_exceptions[_exception.toString()] = _exception
					}
				}
				var _method = {
					name : _methodName,
					description : config.methods[_methodName].description,
					arguments : _arguments,
					exceptions : _exceptions
				};
				if (config.methods[_methodName]["return"]) {
					if (config.methods[_methodName]["return"]instanceof String || typeof(config.methods[_methodName]["return"]) == "string") {
						_method["return"] = getClassObject(config.methods[_methodName]["return"])
					} else {
						_method["return"] = this.registerClass(config.methods[_methodName]["return"])
					}
				}
				_methods[_methodName] = new Method(_method);
				if (config.methods[_methodName]["return"] && !_methods[_methodName].Return) {
					addUnresolvedTypes(config.methods[_methodName]["return"], _methods[_methodName], "Return")
				}
			}
			var _events = (_base) ? populateObject(_base.Events) : {};
			for (var _eventName in config.events) {
				var _eventHandler = undefined;
				if (config.events[_eventName].type instanceof String || typeof(config.events[_eventName].type) == "string") {
					_eventHandler = getClassObject(config.events[_eventName].handler)
				} else {
					_eventHandler = this.registerHandler(config.events[_eventName].handler)
				}
				_events[_eventName] = new Event({
						name : _eventName,
						description : config.events[_eventName].description,
						handler : _eventHandler
					})
			}
			var _type = new Class({
					name : config.name,
					namespace : config.namespace,
					base : _base,
					description : config.description,
					properties : _properties,
					constructors : _constructors,
					methods : _methods,
					events : _events
				});
			if (config["extends"] && !_type.Base) {
				addUnresolvedTypes(config["extends"], _type, "Base")
			}
			var _module = getModuleObject(config.namespace);
			if (!_module.Classes) {
				_module.Classes = {}
				
			}
			_module.Classes[config.name] = _type;
			if (_base) {
				if (typeof _base.Subclasses == "undefined") {
					_base.Subclasses = new Object()
				}
				_base.Subclasses[_type.toString()] = _type
			}
			return _type
		};
		Metadata.registerHandler = function (handler) {
			if (handler.name == undefined) {
				handler.name = guidGenerator()
			}
			if (handler.namespace == undefined) {
				handler.namespace = "Anonymous"
			}
			var _arguments = {};
			for (var _argName in handler.arguments) {
				var _argType = undefined;
				if (handler.arguments[_argName].type instanceof String || typeof(handler.arguments[_argName].type) == "string") {
					_argType = getClassObject(handler.arguments[_argName].type)
				} else {
					_argType = this.registerClass(handler.arguments[_argName].type)
				}
				_arguments[_argName] = new Argument({
						name : _argName,
						description : handler.arguments[_argName].description,
						mandatory : handler.arguments[_argName].mandatory,
						type : _argType
					});
				if (!_arguments[_argName].Type) {
					addUnresolvedTypes(handler.arguments[_argName].type, _arguments[_argName], "Type")
				}
			}
			var _handler = new Handler({
					name : handler.name,
					namespace : handler.namespace,
					description : handler.description,
					arguments : _arguments
				});
			var _module = getModuleObject(handler.namespace);
			if (!_module.Classes) {
				_module.Classes = {}
				
			}
			_module.Classes[handler.name] = _handler;
			return _handler
		};
		Metadata.getClass = function (type) {
			return getClassObject(type)
		};
		Metadata.getModule = function (type) {
			return (type) ? getModuleObject(type) : _metadata.root
		};
		Metadata.validateProperties = function (type, obj) {
			var _type = (type instanceof String || typeof(type) == "string") ? getClassObject(type) : type;
			for (var prop in _type.Properties) {
				if (_type.Properties[prop].Mandatory == true && obj[prop] === undefined) {
					return false
				}
				if (_type.Properties[prop].Mandatory == false && obj[prop] === undefined) {
					continue
				}
				if (_type.Properties[prop].Type == Metadata.get("Object") && typeof(obj[prop]) == "object") {
					continue
				}
				if (_type.Properties[prop].Type == Metadata.get("String")) {
					if (obj[prop]instanceof String || typeof(obj[prop]) == "string") {
						continue
					} else {
						return false
					}
				}
				if (_type.Properties[prop].Type == Metadata.get("Number")) {
					if (!isNaN(parseFloat(obj[prop])) && isFinite(obj[prop])) {
						continue
					} else {
						return false
					}
				}
				if (_type.Properties[prop].Type == Metadata.get("Boolean")) {
					if (obj[prop]instanceof Boolean || typeof(obj[prop]) == "boolean") {
						continue
					} else {
						return false
					}
				}
				if (_type.Properties[prop].Type == Metadata.get("Array")) {
					if (typeof(obj[prop]) === "object" && obj[prop].constructor == Array) {
						continue
					} else {
						return false
					}
				}
				if (_type.Properties[prop].Type == Metadata.get("Function")) {
					if (obj[prop]instanceof Function) {
						continue
					} else {
						return false
					}
				}
				if (Metadata.validateProperties(_type.Properties[prop].Type, obj[prop])) {
					continue
				}
				return false
			}
			return true
		}
	})(xRTML.Metadata = xRTML.Metadata || {})
})(window.xRTML = window.xRTML || {});

xRTML.TagManager.register({
	name : "Media",
	"abstract" : true,
	struct : function () {
		var playNext = xRTML.Common.Function.proxy(function () {
				if (this.autoPlay && this.sources.next()) {
					this.play(this.sources.current())
				}
			}, this);
		var resumeQueue = xRTML.Common.Function.proxy(function () {
				if (this.autoPlay && this.sources.current()) {
					this.player.play(this.sources.current())
				}
				this.bind({
					ended : resumeQueue
				});
				this.bind({
					ended : playNext
				})
			}, this);
		this.init = function (tagObject) {
			this._super(tagObject);
			this.target = this.target[0];
			this.width = xRTML.Common.Converter.toNumber(tagObject.attribute("width")) || null;
			this.height = xRTML.Common.Converter.toNumber(tagObject.attribute("height")) || null;
			this.autoPlay = typeof tagObject.attribute("autoPlay") == "undefined" ? true : xRTML.Common.Converter.toBoolean(tagObject.attribute("autoPlay"));
			this.loop = typeof tagObject.attribute("loop") == "undefined" ? true : xRTML.Common.Converter.toBoolean(tagObject.attribute("loop"));
			this.controlsBar = xRTML.Common.Converter.toBoolean(tagObject.attribute("controlsBar")) || false;
			this.muted = xRTML.Common.Converter.toBoolean(tagObject.attribute("muted")) || false;
			this.loadStatus = 0;
			this.sources = (function () {
				var container = [],
				curr = -1;
				return {
					current : function () {
						return (container.length && curr != -1) != 0 ? container[curr] : null
					},
					currentIndex : function () {
						return curr
					},
					next : function () {
						curr = (++curr) < container.length ? curr : 0;
						return container.length != 0 ? container[curr] : null
					},
					previous : function () {
						curr = --curr < 0 ? (container.length - 1) : curr;
						return container.length != 0 ? container[curr] : null
					},
					insert : function (sources, idx) {
						if (sources && idx > 0 && idx < (container.length + 1)) {
							if (!(sources instanceof Array)) {
								sources = [sources]
							}
							for (var i = sources.length - 1; i >= 0; --i) {
								container.splice(idx, 0, sources[i])
							}
							if (curr != -1 && idx < curr) {
								curr += sources.length
							}
						}
					},
					push : function (sources) {
						if (sources) {
							if (!(sources instanceof Array)) {
								sources = [sources]
							}
							container.push.apply(container, sources)
						}
					},
					removeAt : function (idx) {
						var element = null;
						if (idx >= 0 && idx < container.length) {
							element = container.splice(idx, 1);
							if (curr > container.length || idx < curr) {
								--curr
							}
						}
						return element
					},
					remove : function (source) {
						for (var i = 0; i < container.length; ++i) {
							var _source = container[i],
							isEqual = true;
							for (var attr in source) {
								if (!xRTML.Common.Object.equals(source[attr], _source[attr])) {
									isEqual = false;
									break
								}
							}
							if (isEqual) {
								return this.removeAt(i)
							}
						}
						return null
					},
					pop : function () {
						return this.removeAt(container.length - 1)
					},
					purge : function () {
						container = [];
						curr = -1
					},
					length : function () {
						return container.length
					}
				}
			})();
			var self = this;
			this.players = {};
			this.players.swf = function (config) {
				xRTML.Event.extend(this);
				this.id = "FLVplayer_" + xRTML.Common.Util.idGenerator();
				this.isReady = false;
				xRTML.Common.DOM.loadScript({
					url : "http://code.xrtml.org/plugins/swfobject.js",
					callback : xRTML.Common.Function.proxy(function () {
						if (swfobject.getFlashPlayerVersion().major == 0) {
							if (xRTML.Sizzle("#" + this.id, self.target).length == 0) {
								var anchor = document.createElement("a");
								anchor.setAttribute("id", "flashnotavailable");
								anchor.setAttribute("href", "http://www.adobe.com/go/getflashplayer");
								anchor.setAttribute("target", "_blank");
								var img = document.createElement("img");
								img.setAttribute("src", "http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif");
								img.setAttribute("alt", "Get Adobe Flash player");
								anchor.appendChild(img);
								self.target.appendChild(anchor);
								return
							}
						}
						this.isReady = true;
						this.fire({
							ready : {}
							
						})
					}, this)
				});
				this.target = config.target;
				this.width = config.width;
				this.height = config.height;
				this.supportedMedia = {
					swf : this.canPlayType("swf")
				};
				function loadedMetadataHandler(e) {
					self.fire({
						loadedmetadata : {
							event : e,
							target : self
						}
					})
				}
				this.bind({
					loadedmetadata : loadedMetadataHandler
				})
			};
			this.players.swf.prototype = {
				play : function (source) {
					if (!this.isReady) {
						this.bind({
							ready : xRTML.Common.Function.proxy(function () {
								this.play(source)
							}, this)
						});
						return
					}
					var filename = source.files.swf;
					if (filename) {
						if (xRTML.Sizzle(this.id + " object").length > 0) {
							this.stop()
						}
						var mediaContainer = document.createElement("span");
						mediaContainer.id = this.id;
						this.target.appendChild(mediaContainer);
						var flashvars = {},
						params = {
							allowScriptAccess : "always",
							play : "true",
							loop : "true"
						},
						attributes = {
							align : "middle"
						},
						outputStatus = xRTML.Common.Function.proxy(function (e) {
								this.fire({
									loadedmetadata : e
								})
							}, this);
						swfobject.embedSWF(filename, this.id, !!this.width ? this.width : "425", !!this.height ? this.height : "356", "8", null, {
							allowScriptAccess : "always",
							play : "true"
						}, null, outputStatus);
						this.restart = function () {
							this.stop();
							this.play(source)
						}
					}
				},
				isPlaying : function () {
					return xRTML.Sizzle("#" + this.id).length > 0
				},
				stop : function () {
					if (typeof swfobject != "undefined") {
						swfobject.removeSWF(this.id)
					}
				},
				pause : function () {},
				restart : function () {},
				skip : function () {},
				mute : function () {},
				volume : function () {},
				canPlayExtension : function (ext) {
					var type = this.supportedMedia[ext];
					if (typeof type === "undefined") {
						return false
					}
					return this.canPlayType(type)
				},
				canPlayType : function (type) {
					return type === "swf"
				},
				time : function () {
					return {
						current : 0,
						duration : 0
					}
				}
			};
			var MediaPlayer = function (config) {
				this.id = xRTML.Common.Util.idGenerator();
				var player = document.createElement(config.type);
				player.id = this.id;
				player.width = config.width;
				player.height = config.height;
				player.poster = config.poster;
				player.autoplay = config.autoPlay;
				player.loop = config.loop;
				player.muted = config.muted;
				player.controls = config.controls;
				this.addPlayerDOM = function () {
					self.target.appendChild(player);
					xRTML.Event.bind(player, {
						progress : progressHandler
					});
					xRTML.Event.bind(player, {
						loadedmetadata : loadedMetadataHandler
					});
					xRTML.Event.bind(player, {
						timeupdate : timeUpdateHandler
					});
					xRTML.Event.bind(player, {
						play : playHandler
					});
					xRTML.Event.bind(player, {
						playing : playingHandler
					});
					xRTML.Event.bind(player, {
						pause : pauseHandler
					});
					xRTML.Event.bind(player, {
						ended : endedHandler
					})
				};
				this.fallback = typeof self.players.swf === "function" ? new self.players.swf(config) : self.players.swf;
				this.supportedMedia = {};
				for (var attr in config.formats) {
					this.supportedMedia[attr] = player.canPlayType(config.formats[attr]) == "maybe" || player.canPlayType(config.formats[attr]) == "probably"
				}
				var parent = this;
				function progressHandler(e) {
					var endBuf = e.target.buffered.length != 0 ? e.target.buffered.end(0) : 0;
					parent.loadStatus = parseInt(((endBuf / e.target.duration) * 100))
				}
				xRTML.Event.bind(player, {
					progress : progressHandler
				});
				function loadedMetadataHandler(e) {
					self.duration = e.target.duration;
					self.currentTime = e.target.currentTime;
					if (config.keepRatio) {
						e.target.height = e.target.videoHeight;
						e.target.width = e.target.videoWidth
					}
					if (player.paused) {
						player.play()
					}
					self.fire({
						loadedmetadata : {
							event : e,
							target : self
						}
					})
				}
				xRTML.Event.bind(player, {
					loadedmetadata : loadedMetadataHandler
				});
				function timeUpdateHandler(e) {
					self.currentTime = e.target.currentTime
				}
				xRTML.Event.bind(player, {
					timeupdate : timeUpdateHandler
				});
				function playHandler(e) {}
				
				xRTML.Event.bind(player, {
					play : playHandler
				});
				function playingHandler(e) {}
				
				xRTML.Event.bind(player, {
					playing : playingHandler
				});
				function pauseHandler(e) {}
				
				xRTML.Event.bind(player, {
					pause : pauseHandler
				});
				function endedHandler(e) {
					self.fire("ended", {
						file : e
					})
				}
				xRTML.Event.bind(player, {
					ended : endedHandler
				});
				function errorHandler(e) {
					if (e.target.error !== null) {
						var error = "";
						switch (e.target.error.code) {
						case e.target.error.MEDIA_ERR_ABORTED:
							error = "You aborted the media playback.";
							break;
						case e.target.error.MEDIA_ERR_NETWORK:
							error = "A network error caused the media download to fail part-way.";
							break;
						case e.target.error.MEDIA_ERR_DECODE:
							error = "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.";
							break;
						case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
							error = "The media could not be loaded, either because the server or network failed or because the format is not supported.";
							break;
						default:
							error = "An unknown error occurred.";
							break
						}
						xRTML.Error.raise({
							code : xRTML.Error.Codes.UNEXPECTEDMEDIA,
							target : self,
							message : error,
							info : {
								className : "xRTML.TagManager.Media",
								methodName : "errorHandler (internal method, no docs available)"
							}
						})
					}
				}
				xRTML.Event.bind(player, {
					error : errorHandler
				});
				this.isReady = true
			};
			MediaPlayer.prototype = {
				loadStatus : 0,
				play : function (source) {
					for (var ext in source.files) {
						if (this.supportedMedia[ext] === true) {
							var player = document.getElementById(this.id);
							if (!player) {
								this.addPlayerDOM();
								player = document.getElementById(this.id)
							}
							player.autoplay = source.autoPlay === player.autoplay ? player.autoplay : source.autoPlay;
							player.loop = source.loop === player.loop ? player.loop : source.loop;
							player.src = source.files[ext];
							player.load();
							player.play();
							xRTML.Console.debug("Playing file: " + source.files[ext]);
							if (source.offset) {
								this.offset(source.offset.start, source.offset.end)
							}
							return
						}
					}
					if (this.fallback && source.files.swf) {
						this.fallback.play(source)
					} else {
						document.getElementById(this.id).innerHTML = "Your browser cannot play these movie types."
					}
				},
				stop : function () {
					var mediaPlayer = document.getElementById(this.id);
					mediaPlayer.currentTime = mediaPlayer.duration
				},
				pause : function () {
					var mediaPlayer = document.getElementById(this.id);
					mediaPlayer.paused ? mediaPlayer.play() : mediaPlayer.pause()
				},
				restart : function () {
					var mediaPlayer = document.getElementById(this.id);
					mediaPlayer.currentTime = 0
				},
				skip : function (time) {
					var mediaPlayer = document.getElementById(this.id);
					if (mediaPlayer.readyState >= mediaPlayer.HAVE_METADATA) {
						mediaPlayer.currentTime = time
					} else {
						xRTML.Event.bind(mediaPlayer, {
							loadedmetadata : function (e) {
								e.target.currentTime = time
							}
						})
					}
				},
				mute : function () {
					var mediaPlayer = document.getElementById(this.id);
					mediaPlayer.muted = !mediaPlayer.muted
				},
				volume : function (measure) {
					var mediaPlayer = document.getElementById(this.id);
					mediaPlayer.volume = measure / 100
				},
				isPlaying : function () {
					return document.getElementById(this.id).currentTime != 0
				},
				canPlayExtension : function (ext) {
					var type = this.supportedMedia[ext];
					if (typeof type === "undefined") {
						return false
					}
					return this.canPlayType(type)
				},
				canPlayType : function (type) {
					var mediaPlayer = document.getElementById(this.id),
					canPlay = mediaPlayer.canPlayType(type);
					return ((canPlay == "maybe") || (canPlay == "probably"))
				},
				time : function () {
					var mediaPlayer = document.getElementById(this.id);
					return {
						current : mediaPlayer.currentTime,
						duration : mediaPlayer.duration
					}
				},
				offset : function (start, end) {
					var mediaPlayer = document.getElementById(this.id),
					setOffset = function (e) {
						mediaPlayer.currentTime = start;
						var checkOffset = function () {
							if (mediaPlayer.currentTime >= end) {
								mediaPlayer.pause();
								xRTML.Event.unbind(mediaPlayer, {
									timeupdate : checkOffset
								})
							}
						};
						xRTML.Event.unbind(mediaPlayer, {
							timeupdate : checkOffset
						})
					};
					if (mediaPlayer.readyState >= mediaPlayer.HAVE_METADATA) {
						setOffset()
					} else {
						xRTML.Event.bind(mediaPlayer, {
							loadedmetadata : setOffset
						})
					}
				}
			};
			this.bind({
				ended : playNext
			});
			var config = {
				type : tagObject.attribute("type") || {},
				formats : tagObject.attribute("formats") || {},
				target : this.target,
				width : this.width,
				height : this.height,
				poster : this.poster,
				autoPlay : this.autoPlay,
				loop : this.loop,
				controls : this.controlsBar,
				muted : this.muted,
				keepRatio : this.keepRatio
			};
			xRTML.Common.Function.proxy(function () {
				if (document.createElement(config.type).canPlayType) {
					var mediaElement = document.createElement(config.type),
					canPlay;
					for (var format in config.formats) {
						canPlay = mediaElement.canPlayType(config.formats[format]);
						if ((canPlay == "maybe") || (canPlay == "probably")) {
							this.players[format] = MediaPlayer
						}
					}
				}
			}, this)();
			this.players.get = function (files) {
				for (var extension in files) {
					if (this[extension]) {
						if (typeof this[extension] === "function") {
							this[extension] = new this[extension](config)
						}
						return this[extension]
					}
				}
			}
		};
		this.play = function (data) {
			if (this.target.hasChildNodes()) {
				if (this.player) {
					if (this.player.supportedMedia.swf) {
						swfobject.removeSWF(this.player.id)
					} else {
						if (this.player.supportedMedia.yt) {
							swfobject.removeSWF(this.player.id)
						} else {
							this.target.removeChild(this.target.lastChild)
						}
					}
				}
			}
			var source = null;
			if (data) {
				source = data;
				this.player = this.players.get(data.files);
				this.player.play(data);
				this.unbind({
					ended : playNext
				});
				this.bind({
					ended : resumeQueue
				})
			} else {
				source = (this.sources.current() == null && this.sources.length() != 0) ? this.sources.next() : this.sources.current();
				this.player = this.players.get(source.files);
				this.player.play(source)
			}
			this.fire({
				play : {
					source : source
				}
			})
		};
		this.stop = function () {
			this.player.stop();
			this.fire({
				stop : {}
				
			})
		};
		this.pause = function () {
			this.player.pause();
			this.fire({
				pause : {}
				
			})
		};
		this.restart = function () {
			this.player.restart();
			this.fire({
				restart : {}
				
			})
		};
		this.mute = function () {
			this.player.mute();
			this.fire({
				mute : {}
				
			})
		};
		this.volume = function (data) {
			if (data && data.volume) {
				var newVolume = typeof data.volume === "string" ? parseInt(data.volume) : data.volume;
				if (newVolume > 100) {
					newVolume = 100
				} else {
					if (newVolume < 0) {
						newVolume = 0
					}
				}
				this.player.volume(newVolume);
				this.fire({
					volume : {
						volume : newVolume
					}
				})
			}
		};
		this.skip = function (data) {
			if (data && data.skip) {
				var skipValue = typeof data.skip === "string" ? parseInt(data.skip) : data.skip;
				this.player.skip(skipValue);
				this.fire({
					skip : {
						skip : skipValue
					}
				})
			}
		};
		this.queue = function (data) {
			if (data) {
				this.sources.push(data);
				this.fire({
					queue : {
						sources : data
					}
				});
				if (this.autoPlay && !this.isPlaying()) {
					this.play()
				}
			}
		};
		this.unqueue = function (data) {
			if (data) {
				this.sources.remove(data);
				this.fire({
					unqueue : {
						source : data
					}
				})
			}
		};
		this.next = function () {
			var file = this.sources.next();
			this.play(file);
			this.fire({
				next : {
					source : file
				}
			})
		};
		this.previous = function () {
			var file = this.sources.previous();
			this.play(file);
			this.fire({
				previous : {
					source : file
				}
			})
		};
		this.time = function () {
			return {
				duration : this.duration,
				currentTime : this.currentTime
			}
		};
		this.isPlaying = function () {
			return !!this.player && this.player.isPlaying()
		}
	}
});
xRTML.TagManager.register({
	name : "Audio",
	base : "Media",
	struct : function () {
		this.init = function (tagObject) {
			tagObject.type = "audio";
			tagObject.muted = false;
			tagObject.formats = {
				mp3 : "audio/mpeg",
				ogg : "audio/ogg",
				aac : "audio/mp4",
				wav : "audio/wav",
				pcm : "audio/webm"
			};
			this._super(tagObject)
		}
	}
});
xRTML.TagManager.register({
	name : "Video",
	base : "Media",
	struct : function () {
		this.init = function (tagObject) {
			this.poster = tagObject.attribute("poster") || null;
			this.keepRatio = typeof tagObject.attribute("keepRatio") == "undefined" ? true : xRTML.Common.Converter.toBoolean(tagObject.attribute("keepRatio"));
			tagObject.type = "video";
			tagObject.formats = {
				mp4 : "video/mp4",
				ogg : "video/ogg",
				webm : "video/webm",
				avi : "video/divx"
			};
			tagObject.keepRatio = this.keepRatio;
			tagObject.poster = this.poster;
			this._super(tagObject);
			var videoObj = this;
			this.players.yt = function (config) {
				xRTML.Event.extend(this);
				this.id = "ytplayer" + xRTML.Common.Util.idGenerator();
				this.config = config;
				this.supportedMedia = {
					yt : true
				};
				this.player = null;
				var self = this;
				window.onYouTubePlayerReady = function (playerId) {
					self.player = document.getElementById(playerId);
					self.player.addEventListener("onStateChange", "onYouTubePlayerStateChange");
					videoObj.dispatchEvent("onYouTubePlayerReady", {
						playerId : playerId
					})
				};
				function loadedMetadataHandler(e) {
					videoObj.fire({
						loadedmetadata : {
							event : e,
							target : self
						}
					})
				}
				this.bind({
					loadedmetadata : loadedMetadataHandler,
					flashNotAvailable : function () {
						if (xRTML.Sizzle("#flashnotavailable", videoObj.target).length == 0) {
							var anchor = document.createElement("a");
							anchor.setAttribute("id", "flashnotavailable");
							anchor.setAttribute("href", "http://www.adobe.com/go/getflashplayer");
							anchor.setAttribute("target", "_blank");
							var img = document.createElement("img");
							img.setAttribute("src", "http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif");
							img.setAttribute("alt", "Get Adobe Flash player");
							anchor.appendChild(img);
							videoObj.target.appendChild(anchor)
						}
					}
				});
				window.onYouTubePlayerStateChange = function (state) {
					switch (state) {
					case  - 1:
						videoObj.dispatchEvent("unstarted");
						break;
					case 0:
						videoObj.dispatchEvent("ended");
						break;
					case 1:
						videoObj.dispatchEvent("playing");
						break;
					case 2:
						videoObj.dispatchEvent("paused");
						break;
					case 3:
						videoObj.dispatchEvent("buffering");
						break;
					case 5:
						videoObj.dispatchEvent("videocued");
						break
					}
				}
			};
			this.players.yt.prototype = {
				play : function (source) {
					source.files.yt = source.files.yt.replace(/^[^v]+v.(.{11}).*/, "$1");
					var params = "?autoplay=1";
					params += "&loop=" + (!!this.config.loop || !!source.loop ? "1" : "0");
					params += "&controls=" + (!!this.config.controls || !!source.controls ? "1" : "0");
					params += "&showinfo=0";
					params += "&enablejsapi=1&playerapiid=" + this.id + "&version=3";
					if (typeof swfobject === "undefined") {
						xRTML.Common.DOM.loadScript({
							url : "http://code.xrtml.org/plugins/swfobject.js",
							callback : xRTML.Common.Function.proxy(function () {
								if (swfobject.getFlashPlayerVersion().major == 0) {
									this.fire({
										flashNotAvailable : {}
										
									});
									return
								}
								var mediaContainer = document.createElement("span");
								mediaContainer.id = this.id;
								videoObj.target.appendChild(mediaContainer);
								var outputStatus = xRTML.Common.Function.proxy(function (e) {
										this.fire({
											loadedmetadata : e
										})
									}, this);
								swfobject.embedSWF("http://www.youtube.com/v/" + source.files.yt + params, this.id, !!this.config.width ? this.config.width : "425", !!this.config.height ? this.config.height : "356", "8", null, null, {
									allowScriptAccess : "always"
								}, {
									allowfullscreen : "true"
								}, outputStatus)
							}, this)
						})
					} else {
						if (swfobject.getFlashPlayerVersion().major == 0) {
							this.fire({
								flashNotAvailable : {}
								
							});
							return
						}
						var mediaContainer = document.createElement("span");
						mediaContainer.id = this.id;
						videoObj.target.appendChild(mediaContainer);
						var outputStatus = xRTML.Common.Function.proxy(function (e) {
								this.fire({
									loadedmetadata : e
								})
							}, this);
						swfobject.embedSWF("http://www.youtube.com/v/" + source.files.yt + params, this.id, !!this.config.width ? this.config.width : "425", !!this.config.height ? this.config.height : "356", "8", null, null, {
							allowScriptAccess : "always"
						}, {
							allowfullscreen : "true"
						}, outputStatus)
					}
				},
				stop : function () {
					if (!this.isPlaying()) {
						return
					}
					this.player.stopVideo()
				},
				pause : function () {
					this.isPlaying() ? this.player.pauseVideo() : this.player.playVideo()
				},
				restart : function () {
					this.player.playVideo()
				},
				skip : function (time) {
					this.player.seekTo(time, true)
				},
				mute : function () {
					this.player.isMuted() ? this.player.unMute() : this.player.mute()
				},
				volume : function (vol) {
					this.player.setVolume(vol)
				},
				isPlaying : function () {
					if (this.player.getPlayerState) {
						return this.player != null && this.player.getPlayerState() == 1
					}
					return true
				},
				canPlayExtension : function () {},
				canPlayType : function (type) {
					return type === "yt"
				},
				time : function () {
					return {
						current : this.player.getCurrentTime(),
						duration : this.player.getDuration()
					}
				},
				offset : function () {}
				
			}
		}
	}
});
xRTML.TagManager.register({
	name : "Broadcast",
	struct : function () {
		var Dispatcher = function (args) {
			xRTML.Event.extend(this);
			var sendingIntervalReference,
			messagesSent = 0;
			this.senderId = args.attribute("senderId");
			this.target = xRTML.Sizzle(args.attribute("target"));
			this.event = args.attribute("event");
			this.xrtmlmessage = args.attribute("xrtmlmessage");
			this.callback = xRTML.Common.Function.parse(args.attribute("callback"));
			this.interval = args.attribute("interval");
			this.limit = args.attribute("limit") || 0;
			this.messageSource = xRTML.Sizzle(args.attribute("messageSource"));
			this.messageAttribute = args.attribute("messageAttribute");
			var onMessage = args.attribute("onMessage");
			if (onMessage) {
				this.bind({
					message : onMessage
				})
			}
			this.dispatchMessage = function () {
				var messages = [];
				if (this.messageSource.length > 0) {
					for (var i = 0; i < this.messageSource.length; i++) {
						var data = {};
						if (typeof this.messageAttribute != "undefined") {
							data[this.messageAttribute] = xRTML.Common.String.trim(this.messageSource[i][this.messageAttribute])
						} else {
							data.content = xRTML.Common.String.trim(this.messageSource[0].value)
						}
						var msg = {
							trigger : "",
							action : "",
							data : data,
							senderId : this.senderId
						};
						messages.push(xRTML.MessageManager.create(msg))
					}
				} else {
					if (this.callback != null) {
						var msg = this.callback();
						msg.senderId = typeof msg.senderId == "undefined" ? this.senderId : msg.senderId;
						messages.push(msg)
					}
					if (this.xrtmlmessage) {
						try {
							var msg = xRTML.JSON.parse(this.xrtmlmessage).xrtml;
							messages.push(xRTML.MessageManager.create({
									trigger : msg.trigger,
									action : msg.action,
									data : msg.data,
									senderId : this.id
								}))
						} catch (err) {
							xRTML.Error.raise({
								code : xRTML.Error.Codes.JSON_PARSE,
								target : this,
								info : {
									className : "xRTML.Tags." + this.name,
									methodName : "dispatchMessage"
								}
							})
						}
					}
				}
				for (var i = 0; i < messages.length; ++i) {
					if (messagesSent == this.limit && this.limit > 0) {
						clearInterval(sendingIntervalReference);
						return
					}
					this.fire({
						message : messages[i]
					});
					messagesSent++
				}
			};
			if (this.target && this.event) {
				try {
					var evt = {};
					evt[this.event] = xRTML.Common.Function.proxy(this.dispatchMessage, this);
					for (var i = 0; i < this.target.length; i++) {
						xRTML.Event.bind(this.target[i], evt)
					}
				} catch (err) {
					xRTML.Error.raise({
						code : xRTML.Error.Codes.NON_EXISTING_ELEMENT,
						target : this,
						info : {
							className : "xRTML.Tags." + this.name,
							methodName : "dispatchMessage"
						}
					})
				}
			} else {
				if (this.interval > 0) {
					sendingIntervalReference = setInterval(xRTML.Common.Function.proxy(this.dispatchMessage, this), this.interval)
				} else {
					this.dispatchMessage()
				}
			}
		};
		this.init = function (tagObject) {
			this._super(tagObject);
			xRTML.Common.Validator.validateRequired({
				target : this,
				prop : "channelId"
			});
			xRTML.Common.Validator.validateRequired({
				target : this,
				prop : "connections"
			});
			xRTML.Common.Validator.validateRequired({
				target : this,
				prop : "triggers"
			});
			this.receiveOwnMessages = false;
			var dispatcherElements = tagObject.attribute("dispatchers");
			for (var i = 0; i < dispatcherElements.length; ++i) {
				dispatcherElements[i].attribute = tagObject.attribute;
				dispatcherElements[i].senderId = this.id;
				dispatcherElements[i].onMessage = xRTML.Common.Function.proxy(this.sendMessage, this);
				new Dispatcher(dispatcherElements[i])
			}
		}
	}
});
xRTML.TagManager.register({
	name : "Chart",
	struct : function () {
		var Model = function (config) {
			try {
				xRTML.Event.extend(this);
				this.title = config.title ? config.title.text : null;
				this.subTitle = config.subTitle ? config.subTitle.text : null;
				this.series = xRTML.Templating.observable(new Array());
				this.dataValuesTotal = xRTML.Templating.observable(xRTML.Common.Function.proxy(function () {
							var result = 0;
							for (var i = 0; i < this.series().length; i++) {
								result += (this.series()[i].value() || this.series()[i].value()[0])
							}
							return result
						}, this));
				this.updateSerie = function (position, value) {
					this.series()[position].value(value);
					this.fire({
						serieUpdate : {
							serie : this.series()[position],
							index : position
						}
					})
				};
				this.updateSeries = function (series) {
					this.series(new Array());
					for (var i = 0; i < series.length; i++) {
						this.series.push(new SeriesModel({
								name : series[i].name,
								value : series[i].data[0] || series[i].data,
								type : series[i].type
							}, this.dataValuesTotal))
					}
					this.fire({
						seriesUpdate : {
							series : this.series()
						}
					})
				};
				this.incrementSerie = function (position, incrementBy) {
					var v = this.series()[position].value();
					xRTML.Common.Array.isArray(v) ? v[0] = (v[0] + incrementBy) : v = v + incrementBy;
					this.series()[position].value(v);
					this.fire({
						serieUpdate : {
							serie : this.series()[position],
							index : position
						}
					})
				};
				if (config.series) {
					this.updateSeries(config.series)
				}
			} catch (err) {
				xRTML.Error.raise({
					code : xRTML.Error.Codes.UNEXPECTED,
					info : {
						className : "xRTML.Tags.Chart",
						methodName : "init",
						message : err.message
					}
				})
			}
		},
		SeriesModel = function (config, dataValuesTotal) {
			this.name = config.name;
			this.value = xRTML.Templating.observable(config.value);
			this.type = config.type;
			this.percentage = xRTML.Templating.observable(xRTML.Common.Function.proxy(function () {
						return this.value() / dataValuesTotal() * 100
					}, this))
		},
		model,
		HighChartsFacade = {
			column : {
				update : function (args) {
					highChartsChart.series[args.index].data[0].update(parseInt(args.value()))
				},
				add : function (args) {
					highChartsChart.series.push(args.serie)
				}
			},
			pie : {
				update : function (args) {
					highChartsChart.series[0].data[args.index].update([args.name, args.value()])
				},
				add : function (args) {
					highChartsChart.series.push(args.serie)
				}
			}
		},
		highChartsChart,
		render = function () {
			model = this.model = new Model(this.settings);
			if (this.chartingPlatform == "highcharts") {
				if (Highcharts) {
					if (!this.settings.chart.events) {
						this.settings.chart.events = {}
						
					}
					this.settings.chart.events.load = xRTML.Common.Function.proxy(function () {
							this.fire({
								rendered : {}
								
							})
						}, this);
					highChartsChart = new Highcharts.Chart(this.settings);
					var highstockEls = xRTML.Sizzle('svg text tspan:contains("Highcharts") , svg text tspan:contains("Highstock")');
					if (highstockEls) {
						for (var i = 0, len = highstockEls.length; i < len; i++) {
							highstockEls[i].style.display = "none"
						}
					}
					this.bind({
						serieUpdate : xRTML.Common.Function.proxy(function (e) {
							HighChartsFacade[this.type].update({
								index : e.index,
								name : e.serie.name,
								value : e.serie.value
							})
						}, this),
						seriesUpdate : xRTML.Common.Function.proxy(function (e) {
							var series = [];
							for (var i = 0; i < e.series.length; i++) {
								series.push({
									type : e.series[i].type,
									name : e.series[i].name,
									data : [e.series[i].value()]
								})
							}
							this.settings.series = series;
							highChartsChart = new Highcharts.Chart(this.settings)
						}, this)
					})
				} else {
					xRTML.Error.raise({
						code : xRTML.Error.Codes.TAG_INVALID_CONFIG,
						target : this,
						info : {
							message : "The chartingPlatform highcharts requires that the relevant libraries are imported.",
							className : "xRTML.Tags." + this.name,
							methodName : "init"
						}
					})
				}
			} else {
				if (typeof this.template == "undefined") {
					var defaultTemplate = ' <div class="xrtml-chart">';
					defaultTemplate += '        <h1 class="xrtml-chart-title" data-bind="text:title"></h1>';
					defaultTemplate += '        <h2 class="xrtml-chart-subtitle" data-bind="text:subTitle"></h2>';
					defaultTemplate += '        <div class="xrtml-chart-values">';
					defaultTemplate += '            <ul class="xrtml-chart-graph" data-bind="foreach: series">';
					defaultTemplate += "                <li><span data-bind=\"text:value, style:{ paddingTop: (percentage()*2)+'px' }\"></span></li>";
					defaultTemplate += "            </ul>";
					defaultTemplate += "        </div>";
					defaultTemplate += '        <div class="xrtml-chart-items">';
					defaultTemplate += '            <strong class="xrtml-chart-items-title">Items</strong>';
					defaultTemplate += '            <ul class="xrtml-chart-items-names" data-bind="foreach: series">';
					defaultTemplate += '                <li><span data-bind="text:name"></span></li>';
					defaultTemplate += "            </ul>";
					defaultTemplate += '            <ul class="xrtml-chart-items-percentages" data-bind="foreach: series">';
					defaultTemplate += "                <li><span data-bind=\"text:Math.round( percentage() * Math.pow(10,0))/Math.pow(10,0)+'%'\"></span></li>";
					defaultTemplate += "            </ul>";
					defaultTemplate += "        </div>";
					defaultTemplate += "    </div>";
					this.template = "xRTML-Chart-Template";
					xRTML.Templating.inject({
						id : this.template,
						content : defaultTemplate
					})
				}
				xRTML.Templating.applyBindings({
					node : this.targetElement,
					binding : {
						template : {
							name : this.template,
							data : model,
							afterRender : xRTML.Common.Function.proxy(function (elements, data) {
								this.fire({
									rendered : {}
									
								})
							}, this)
						}
					}
				});
				this.bind({
					serieUpdate : xRTML.Common.Function.proxy(function (e) {
						this.runEffects({
							element : xRTML.Sizzle(this.valuesTarget)[e.index]
						})
					}, this)
				})
			}
		},
		bindHandlers = function (args) {
			model.bind({
				serieUpdate : xRTML.Common.Function.proxy(function (e) {
					this.fire({
						serieUpdate : e
					})
				}, this),
				seriesUpdate : xRTML.Common.Function.proxy(function (e) {
					this.fire({
						seriesUpdate : e
					})
				}, this)
			});
			model.bind({
				serieUpdate : xRTML.Common.Function.parse(args.onSerieUpdate),
				seriesUpdate : xRTML.Common.Function.parse(args.onSeriesUpdate),
				rendered : xRTML.Common.Function.parse(args.onRendered)
			})
		},
		storage;
		this.init = function (tagObject) {
			this._super(tagObject);
			this.effects = tagObject.attribute("effects");
			xRTML.Effect.extend(this);
			this.settings = tagObject.attribute("settings");
			this.targetElement = (this.settings && this.settings.chart && this.settings.chart.renderTo) ? xRTML.Sizzle("#" + this.settings.chart.renderTo)[0] : (!!tagObject.attribute("target") ? this.target[0] : xRTML.Sizzle("#" + args.template)[0].parentNode.insertBefore(document.createElement("div"), xRTML.Sizzle("#" + args.template)[0]));
			this.valuesTarget = tagObject.attribute("valuesTarget") || ".values li span";
			this.type = tagObject.attribute("type") ? tagObject.attribute("type") : ((this.settings && this.settings.chart && this.settings.chart.type) ? this.settings.chart.type : ((this.settings && this.settings.series && this.settings.series[0].type) ? this.settings.series[0].type : null));
			this.chartingPlatform = typeof tagObject.attribute("chartingPlatform") != "undefined" ? tagObject.attribute("chartingPlatform") : "htmlchart";
			this.template = tagObject.attribute("template");
			this.storageId = tagObject.attribute("storageId");
			this.storageKey = tagObject.attribute("storageKey");
			if (this.storageId) {
				storage = xRTML.StorageManager.getById(this.storageId)
			}
			var handlerConfig = {
				onSerieUpdate : tagObject.attribute("onSerieUpdate"),
				onSeriesUpdate : tagObject.attribute("onSeriesUpdate"),
				onRendered : tagObject.attribute("onRendered")
			};
			if (storage) {
				storage.get({
					namespace : "Charts",
					k : this.storageKey + "#settings"
				}, xRTML.Common.Function.proxy(function (result) {
						if (result.success) {
							this.settings = xRTML.JSON.parse(result.data.resultData);
							render.call(this);
							bindHandlers.call(this, handlerConfig)
						}
					}, this))
			} else {
				render.call(this);
				bindHandlers.call(this, handlerConfig)
			}
		};
		this.increment = function (data) {
			model.incrementSerie(data.index, data.incrementBy)
		};
		this.update = function (data) {
			model.updateSerie(data.index, data.value)
		};
		this.updateSeries = function (data) {
			model.updateSeries(data.series)
		}
	}
});
xRTML.TagManager.register({
	name : "Execute",
	struct : function () {
		this.init = function (tagObject) {
			this._super(tagObject);
			this.callback = xRTML.Common.Function.parse(tagObject.attribute("callback"), "message")
		};
		this.process = function (data) {
			var callback = typeof data != "undefined" && data.callback ? xRTML.Common.Function.parse(data.callback, "data") : this.callback;
			(typeof callback == "function") ? callback(data) : xRTML.Error.raise({
				code : xRTML.Error.Codes.TAG_PROCESS,
				target : this,
				info : {
					message : 'The property "callback" is not defined in the Tag nor in the message.',
					className : "xRTML.Tags." + this.name,
					methodName : "process"
				}
			})
		}
	}
});
xRTML.TagManager.register({
	name : "Placeholder",
	struct : function () {
		this.init = function (tagObject) {
			this._super(tagObject);
			this.template = tagObject.attribute("template");
			if (!this.template) {
				xRTML.Console.error("Placeholder tag requires one and only one xrtml:template tag.")
			}
			this.initialData = tagObject.attribute("initialData");
			if (typeof this.initialData != "undefined") {
				try {
					xRTML.Templating.applyBindings({
						node : this.target[0],
						binding : {
							template : {
								name : this.template,
								data : this.initialData
							}
						}
					})
				} catch (err) {
					xRTML.Error.raise({
						code : xRTML.Error.Codes.TEMPLATING,
						target : this,
						info : {
							message : err.message,
							className : "xRTML.Tags." + this.name,
							methodName : "init"
						}
					})
				}
			}
		};
		this.insert = function (data) {
			try {
				xRTML.Templating.applyBindings({
					node : this.target[0],
					binding : {
						template : {
							name : this.template,
							data : data
						}
					}
				})
			} catch (err) {
				xRTML.Error.raise({
					code : xRTML.Error.Codes.TEMPLATING,
					target : this,
					info : {
						message : err.message,
						className : "xRTML.Tags." + this.name,
						methodName : "insert"
					}
				})
			}
		}
	}
});
xRTML.TagManager.register({
	name : "Poll",
	struct : function () {
		var Storage = function (settings) {
			var userId = settings.userId,
			storageKey = settings.storageKey,
			storageDAO = settings.id ? xRTML.StorageManager.getById(settings.id) : null,
			namespace = "Polls";
			this.saveVote = function (index, fn) {
				storageDAO.incr({
					namespace : namespace,
					pair : {
						k : storageKey + "#items#" + index + "#data",
						v : 1
					}
				}, function (result) {
					if (!result.success) {
						xRTML.Console.error("There was an error while trying to increment the vote in the Storage.")
					}
				});
				storageDAO.incr({
					namespace : namespace,
					pair : {
						k : storageKey + "#user#" + userId,
						v : 1
					}
				}, function (result) {
					if (!result.success) {
						xRTML.Console.error("There was an error while trying to increment the vote in the Storage.")
					}
				});
				setLocalUserVotes(userId, getLocalUserVotes(userId) + 1)
			};
			this.getUserVotes = function (fn) {
				storageDAO.get({
					namespace : namespace,
					k : storageKey + "#user#" + userId
				}, function (result) {
					if (result.success) {
						fn(result.data.resultData ? parseInt(result.data.resultData) : 0)
					}
				})
			};
			this.saveVoteItems = function (voteItems) {
				storageDAO.set({
					namespace : namespace,
					pair : {
						k : storageKey + "#itemCount",
						v : voteItems.length
					}
				}, function (result) {
					if (result.success) {
						var keys = [];
						for (var i = 0; i < voteItems.length; ++i) {
							keys.push({
								k : storageKey + "#items#" + i + "#id",
								v : voteItems[i].id || i
							});
							keys.push({
								k : storageKey + "#items#" + i + "#name",
								v : voteItems[i].name
							});
							keys.push({
								k : storageKey + "#items#" + i + "#data",
								v : voteItems[i].data
							});
							var metadata;
							if (typeof voteItems[i].metadata == "object") {
								metadata = xRTML.JSON.stringify(voteItems[i].metadata)
							}
							keys.push({
								k : storageKey + "#items#" + i + "#metadata",
								v : metadata
							})
						}
						storageDAO.set({
							namespace : namespace,
							pairs : keys
						}, function (result) {
							if (!result.success) {
								xRTML.Console.error("There was an error while trying to save the votes in the Storage.")
							}
						})
					}
				})
			};
			this.getVoteItems = function (fn) {
				storageDAO.get({
					namespace : namespace,
					k : storageKey + "#itemCount"
				}, function (result) {
					var voteItems = [];
					if (result.success) {
						if (result.data.resultData != null) {
							var count = parseInt(result.data.resultData),
							keys = [];
							for (var i = 0; i < count; i++) {
								keys.push(storageKey + "#items#" + i + "#id");
								keys.push(storageKey + "#items#" + i + "#name");
								keys.push(storageKey + "#items#" + i + "#data");
								keys.push(storageKey + "#items#" + i + "#metadata")
							}
							storageDAO.get({
								namespace : namespace,
								ks : keys
							}, function (result) {
								if (result.success && result.data.resultData != null) {
									if (result.data.resultData[0] != null) {
										for (var i = 0; i < result.data.resultData.length; i = i + 4) {
											voteItems.push({
												id : result.data.resultData[i],
												name : result.data.resultData[i + 1],
												data : parseInt(result.data.resultData[i + 2]),
												metadata : xRTML.JSON.parse(result.data.resultData[i + 3])
											})
										}
									}
									fn(voteItems)
								}
							})
						} else {
							fn(voteItems)
						}
					}
				})
			};
			this.setMetaData = function (args) {
				var metadata;
				if (typeof args.metadata == "object") {
					metadata = xRTML.JSON.stringify(args.metadata)
				}
				storageDAO.set({
					namespace : namespace,
					pair : {
						k : storageKey + "#items#" + args.index + "#metadata",
						v : metadata
					}
				}, function (result) {
					if (!result.success) {
						xRTML.Console.error("There was an error while trying to set the metadata in the Storage.")
					}
				})
			}
		},
		storage,
		sendMessage,
		VoteItemModel = function (config) {
			this.id = config.id || 0;
			this.name = config.name || "";
			this.data = xRTML.Templating.observable(config.data || 0);
			this.metadata = config.metadata || {}
			
		},
		Model = function (config) {
			xRTML.Event.extend(this);
			var userId = config.userId;
			var votesAllowed = config.votesAllowed ? xRTML.Common.Converter.toNumber(config.votesAllowed) : 1;
			var userVotes = xRTML.Templating.observable(!!config.userVotes ? Number(config.userVotes) : 0);
			this.canVote = xRTML.Templating.observable(function () {
					return votesAllowed > userVotes()
				});
			var performVote = xRTML.Common.Function.proxy(function (item) {
					if (this.canVote()) {
						userVotes(userVotes() + 1);
						item.data(item.data() + 1);
						sendMessage({
							action : "vote",
							data : {
								i : item.id
							}
						});
						if (storage) {
							storage.saveVote(item.id)
						} else {
							setLocalUserVotes(userId, userVotes())
						}
						if (chart) {
							chart.increment({
								index : item.id,
								incrementBy : 1
							})
						}
						this.fire({
							ownervote : {
								item : item,
								allowed : this.canVote(),
								index : item.id
							}
						})
					}
				}, this);
			this.voteValidation = xRTML.Common.Function.parse(config.voteValidation);
			this.voteClick = xRTML.Common.Function.proxy(function (item) {
					if (this.voteValidation) {
						var callback = function (result) {
							if (result) {
								performVote(item)
							}
						};
						this.voteValidation({
							userId : userId,
							item : {
								id : item.id,
								name : item.name
							}
						}, callback)
					} else {
						performVote(item)
					}
				}, this);
			this.voteItems = new Array();
			for (var i = 0; i < config.voteItems.length; ++i) {
				var voteItem = config.voteItems[i];
				voteItem.id = parseInt(i);
				if (typeof voteItem.data === "undefined" || isNaN(voteItem.data)) {
					voteItem.data = 0
				}
				this.voteItems.push(new VoteItemModel(config.voteItems[i]))
			}
			this.vote = function (index) {
				this.voteItems[index].data(this.voteItems[index].data() + 1);
				if (chart) {
					chart.increment({
						index : index,
						incrementBy : 1
					})
				}
				this.fire({
					vote : {
						item : this.voteItems[index],
						allowed : true,
						index : index
					}
				})
			}
		},
		model,
		applyBindings = function (args) {
			if (args.chartSettings) {
				args.chartSettings.series = [];
				for (var i = 0; i < model.voteItems.length; i++) {
					args.chartSettings.series.push({
						name : model.voteItems[i].name,
						data : [model.voteItems[i].data()],
						metadata : model.voteItems[i].metadata
					})
				}
				xRTML.TagManager.create({
					name : "Chart",
					type : "column",
					settings : args.chartSettings,
					chartingplatform : args.chartSettings.chartingPlatform ? args.chartSettings.chartingPlatform : "highcharts"
				}, xRTML.Common.Function.proxy(function (t) {
						chart = t
					}, this));
				if (typeof args.buttonsTemplate == "undefined") {
					var defaultTemplate = ' <div class="xrtml-poll-buttons-container" data-bind="foreach: voteItems, visible: canVote()">';
					defaultTemplate += '        <a class="xrtml-poll-button" href="javascript:return false;" data-bind="click: $parent.voteClick">Vote</a>';
					defaultTemplate += "    </div>";
					defaultTemplate += '    <div class="xrtml-poll-buttons-container" data-bind="visible: !canVote()">';
					defaultTemplate += '        <span class="xrtml-poll-message">Cannot vote again.</span>';
					defaultTemplate += "    </div>";
					args.buttonsTemplate = "xRTML-Poll-Buttons-Template";
					xRTML.Templating.inject({
						id : args.buttonsTemplate,
						content : defaultTemplate
					})
				}
				var containerDiv = document.createElement("div");
				containerDiv.setAttribute("class", "xRTML-Poll-Buttons-Container-Target");
				args.targetNode.appendChild(containerDiv);
				xRTML.Templating.applyBindings({
					node : containerDiv,
					binding : {
						template : {
							name : args.buttonsTemplate,
							data : args.model
						}
					}
				})
			} else {
				if (typeof args.template == "undefined") {
					var defaultTemplate = '<div class="xrtml-poll" id="xRTML-Poll_' + this.id + '">';
					defaultTemplate += '    <div class="xrtml-poll-values-container">';
					defaultTemplate += '        <div class="graph" data-bind="foreach: voteItems">';
					defaultTemplate += '            <span class="xRTML-Poll-Value" data-bind="text: data"></span>';
					defaultTemplate += "        </div>";
					defaultTemplate += "    </div>";
					defaultTemplate += '    <div class="xrtml-poll-labels-container" data-bind="foreach: voteItems">';
					defaultTemplate += '        <label class="xrtml-poll-label"data-bind="text: name"></label>';
					defaultTemplate += "    </div>";
					defaultTemplate += '    <div class="xrtml-poll-buttons-container" data-bind="foreach: voteItems, visible: canVote()">';
					defaultTemplate += '        <a class="xrtml-poll-button" href="javascript:return false;" data-bind="click: $parent.voteClick">Vote</a>';
					defaultTemplate += "    </div>";
					defaultTemplate += '    <div class="xrtml-poll-buttons-container" data-bind="visible: !canVote()">';
					defaultTemplate += '        <span class="xrtml-poll-message">Cannot vote again.</span>';
					defaultTemplate += "    </div>";
					defaultTemplate += "</div>";
					args.template = "xRTML-Poll-Template";
					xRTML.Templating.inject({
						id : args.template,
						content : defaultTemplate
					})
				}
				xRTML.Templating.applyBindings({
					node : args.targetNode,
					binding : {
						template : {
							name : args.template,
							data : args.model,
							afterRender : xRTML.Common.Function.proxy(function () {
								this.fire({
									render : {}
									
								})
							}, this)
						}
					}
				})
			}
			model.bind({
				vote : xRTML.Common.Function.parse(args.onVote),
				ownervote : xRTML.Common.Function.parse(args.onOwnerVote),
				render : xRTML.Common.Function.parse(args.onRender)
			});
			model.bind({
				vote : xRTML.Common.Function.proxy(function (e) {
					this.fire({
						vote : e
					})
				}, this),
				ownervote : xRTML.Common.Function.proxy(function (e) {
					this.fire({
						ownervote : e
					})
				}, this),
				render : xRTML.Common.Function.proxy(function (e) {
					this.fire({
						render : e
					})
				}, this)
			})
		},
		getOrSetUserId = function (pollId) {
			var userId;
			if (localStorage && (window.navigator && window.navigator.userAgent && window.navigator.userAgent.toLowerCase().indexOf("ipad") < 0)) {
				userId = localStorage.getItem("d734h89nU_" + pollId) || (localStorage.setItem("d734h89nU_" + pollId, xRTML.Common.Util.idGenerator(), localStorage.getItem("d734h89nU_" + pollId)))
			} else {
				userId = xRTML.Common.Cookie.getCookie({
						name : "d734h89nU_" + pollId
					}) || (xRTML.Common.Cookie.setCookie({
							name : "d734h89nU_" + pollId,
							expiry : new Date(new Date().getTime() + 315576000000)
						}), xRTML.Common.Cookie.getCookie({
							name : "d734h89nU_" + pollId
						}))
			}
			return userId
		},
		getLocalUserVotes = function (userId) {
			var votes;
			if (localStorage && (window.navigator && window.navigator.userAgent && window.navigator.userAgent.toLowerCase().indexOf("ipad") < 0)) {
				votes = localStorage.getItem("d734h89nV_" + userId) || 0
			} else {
				votes = xRTML.Common.Cookie.getCookie({
						name : "d734h89nV_" + userId
					}) || 0
			}
			return votes
		},
		setLocalUserVotes = function (userId, numberOfVotes) {
			if (localStorage && (window.navigator && window.navigator.userAgent && window.navigator.userAgent.toLowerCase().indexOf("ipad") < 0)) {
				localStorage.setItem("d734h89nV_" + userId, numberOfVotes)
			} else {
				xRTML.Common.Cookie.setCookie({
					name : "d734h89nV_" + userId,
					value : numberOfVotes
				})
			}
		},
		chart;
		this.init = function (tagObject) {
			this._super(tagObject);
			this.storageId = tagObject.attribute("storageId");
			this.storageKey = tagObject.attribute("storageKey");
			if (this.storageId) {
				storage = new Storage({
						id : this.storageId,
						storageKey : this.storageKey || this.id,
						userId : (tagObject.attribute("userId") || getOrSetUserId(this.id))
					})
			}
			var template = this.template = tagObject.attribute("template"),
			targetNode = this.target[0];
			if (!targetNode) {
				if (typeof template != "undefined") {
					var targetParent = xRTML.Sizzle("#" + template)[0];
					targetNode = targetParent.parentNode.insertBefore(document.createElement("div"), targetParent)
				} else {
					xRTML.Error.raise({
						code : xRTML.Error.Codes.TAG_INVALID_CONFIG,
						target : this,
						info : {
							message : "Either a target or a template must be defined."
						}
					})
				}
			}
			this.votesAllowed = tagObject.attribute("votesAllowed") || 1;
			var userVoteItems = tagObject.attribute("voteItems");
			var chartSettings = tagObject.attribute("chartSettings");
			if (storage) {
				storage.getUserVotes(xRTML.Common.Function.proxy(function (userVotes) {
						storage.getVoteItems(xRTML.Common.Function.proxy(function (voteItems) {
								model = this.model = new Model({
										voteItems : (voteItems && voteItems.length > 0) ? voteItems : (storage.saveVoteItems(userVoteItems), userVoteItems),
										votesAllowed : this.votesAllowed,
										userVotes : userVotes,
										userId : getOrSetUserId(this.id),
										voteValidation : tagObject.attribute("voteValidation")
									});
								applyBindings.call(this, {
									targetNode : targetNode,
									model : model,
									template : template,
									buttonsTemplate : tagObject.attribute("buttonsTemplate"),
									onVote : tagObject.attribute("onVote"),
									onOwnerVote : tagObject.attribute("onOwnerVote"),
									onRendered : tagObject.attribute("onRendered"),
									chartSettings : chartSettings
								})
							}, this))
					}, this))
			} else {
				model = this.model = new Model({
						voteItems : userVoteItems,
						votesAllowed : this.votesAllowed,
						userVotes : getLocalUserVotes(tagObject.attribute("userId") || getOrSetUserId(this.id)),
						userId : getOrSetUserId(this.id),
						voteValidation : tagObject.attribute("voteValidation")
					});
				applyBindings.call(this, {
					targetNode : targetNode,
					model : model,
					template : template,
					buttonsTemplate : tagObject.attribute("buttonsTemplate"),
					onVote : tagObject.attribute("onVote"),
					onOwnerVote : tagObject.attribute("onOwnerVote"),
					onRendered : tagObject.attribute("onRendered"),
					chartSettings : chartSettings
				})
			}
			sendMessage = xRTML.Common.Function.proxy(function (m) {
					this.sendMessage(m)
				}, this)
		};
		this.vote = function (data) {
			model.vote(data.i)
		}
	}
});
xRTML.TagManager.register({
	name : "Repeater",
	struct : function () {
		var Model = function (maxItems, initialData) {
			this.maxItems = maxItems;
			if (initialData) {
				this.Items = xRTML.Templating.observable((new Array()).concat(initialData))
			} else {
				this.Items = xRTML.Templating.observable(new Array())
			}
			this.add = function (data, index, removeIndex) {
				if (this.Items().length == this.maxItems) {
					this.remove((!removeIndex) ? this.Items().length - 1 : removeIndex)
				}
				if (index === -1) {
					this.Items.push(data)
				} else {
					this.Items.splice(index, 0, data)
				}
			};
			this.update = function (data, index) {
				if (index < this.Items().length) {
					this.remove(index);
					this.add(data, index, -1)
				}
			};
			this.remove = function (index) {
				if (index == -1 || index > this.Items().length) {
					index = this.Items().length - 1
				}
				this.Items.splice(index, 1)
			}
		};
		this.model = undefined;
		var validateIndex = function (value) {
			if ((!isNaN(parseInt(value))) && isFinite(value) && value >= 0) {
				return value
			}
			return undefined
		};
		var integerConverter = function (value, defaultValue) {
			if ((!isNaN(parseFloat(value))) && isFinite(value) && value >= 0) {
				return parseInt(value)
			}
			return defaultValue
		};
		var indexConverter = function (idx, defaultValue) {
			var ret = integerConverter(idx, undefined);
			if (ret) {
				return ret
			}
			var indexMapper = {
				begin : 0,
				end : -1
			};
			return indexMapper.hasOwnProperty(idx) ? indexMapper[idx] : defaultValue
		};
		this.init = function (tagObject) {
			this._super(tagObject);
			this.template = tagObject.attribute("template");
			xRTML.Common.Validator.validateRequired({
				target : this,
				prop : "template"
			});
			this.effects = tagObject.attribute("effects");
			xRTML.Effect.extend(this);
			this.index = indexConverter(tagObject.attribute("index"), 0);
			this.removeIndex = indexConverter(tagObject.attribute("removeIndex"), -1);
			this.maxItems = integerConverter(tagObject.attribute("maxItems"), Number.POSITIVE_INFINITY);
			this.initialData = tagObject.attribute("initialData");
			if (xRTML.Common.Array.isArray(this.initialData)) {
				this.model = new Model(this.maxItems, this.initialData)
			} else {
				this.model = new Model(this.maxItems)
			}
			try {
				xRTML.Templating.applyBindings({
					node : this.target[0],
					binding : {
						template : {
							name : this.template,
							foreach : this.model.Items,
							afterRender : xRTML.Common.Function.proxy(function (elements, data) {
								for (var i = 0; i < elements.length; i++) {
									if (elements[i].nodeName != "#text") {
										this.runEffects({
											element : elements[i]
										})
									}
								}
							}, this)
						}
					}
				})
			} catch (err) {
				xRTML.Error.raise({
					code : xRTML.Error.Codes.TEMPLATING,
					target : this,
					info : {
						message : err.message,
						className : "xRTML.Tags." + this.name,
						methodName : "init"
					}
				})
			}
		};
		this.insert = function (data) {
			try {
				this.model.add(data.content, indexConverter(data.index, this.index), indexConverter(data.removeIndex, this.removeIndex))
			} catch (err) {
				xRTML.Error.raise({
					code : xRTML.Error.Codes.TEMPLATING,
					target : this,
					info : {
						message : err.message,
						className : "xRTML.Tags." + this.name,
						methodName : "init"
					}
				})
			}
		};
		this.update = function (data) {
			try {
				this.model.update(data.content, indexConverter(data.index, this.index))
			} catch (err) {
				xRTML.Error.raise({
					code : xRTML.Error.Codes.TEMPLATING,
					target : this,
					info : {
						message : err.message,
						className : "xRTML.Tags." + this.name,
						methodName : "init"
					}
				})
			}
		};
		this.remove = function (data) {
			try {
				this.model.remove(indexConverter(data.removeIndex, this.removeIndex))
			} catch (err) {
				xRTML.Error.raise({
					code : xRTML.Error.Codes.TEMPLATING,
					target : this,
					info : {
						message : err.message,
						className : "xRTML.Tags." + this.name,
						methodName : "init"
					}
				})
			}
		}
	}
});
xRTML.TagManager.register({
	name : "Shoutbox",
	struct : function () {
		var User = function (u) {
			if (typeof u != "undefined") {
				this.id = u.id ? u.id : xRTML.Common.Util.guidGenerator();
				this.name = typeof u.name != "undefined" && u.name != "" ? xRTML.Templating.observable(u.name) : xRTML.Templating.observable("Write a username...");
				this.logged = typeof u.logged != "undefined" ? xRTML.Templating.observable(u.logged) : xRTML.Templating.observable(false)
			} else {
				this.id = xRTML.Common.Util.guidGenerator();
				this.name = xRTML.Templating.observable("Write a username...");
				this.logged = xRTML.Templating.observable(false)
			}
			this.isTyping = xRTML.Templating.observable(false)
		};
		var Message = function (config) {
			this.content = config.content;
			this.name = config.name;
			this.date = config.date ? new Date(config.date) : new Date().toString()
		};
		var Model = function (args) {
			xRTML.Event.extend(this);
			this.shoutboxContainer = args.shoutboxContainer;
			var defaultElementStyle = xRTML.Common.DOM.getStyle({
					element : this.shoutboxContainer,
					rule : "display"
				});
			this.owner = new User();
			this.messages = xRTML.Templating.observable([]);
			this.users = xRTML.Templating.observable([]);
			if (args.userData) {
				this.owner.id = args.userData.id;
				this.owner.name(args.userData.name);
				this.owner.logged(true);
				this.users.push(this.owner);
				this.fire({
					sendMessage : {
						action : "userLogin",
						data : {
							id : this.owner.id,
							name : this.owner.name(),
							logged : true,
							isTyping : false
						}
					}
				});
				this.fire({
					userLogin : {
						user : {
							id : this.owner.id,
							name : this.owner.name(),
							logged : true,
							isTyping : false
						}
					}
				})
			}
			this.messageContent = xRTML.Templating.observable("");
			this.logIn = function () {
				if (this.owner.name() != "" && this.owner.name() != "Write a username...") {
					var id = xRTML.Common.Util.guidGenerator();
					this.owner.id = id;
					this.owner.logged(true);
					this.users.push(this.owner);
					xRTML.Common.Cookie.setCookie({
						name : cookieName,
						value : xRTML.JSON.stringify({
							id : this.owner.id,
							name : this.owner.name()
						})
					});
					if (dataAccess) {
						dataAccess.fire({
							userLogin : {
								user : {
									id : this.owner.id,
									name : this.owner.name(),
									logged : true,
									isTyping : false
								}
							}
						})
					}
					this.fire({
						userLogin : {
							user : {
								id : this.owner.id,
								name : this.owner.name(),
								logged : true,
								isTyping : false
							}
						}
					});
					this.fire({
						sendMessage : {
							action : "userLogin",
							data : {
								id : this.owner.id,
								name : this.owner.name(),
								logged : true
							}
						}
					})
				}
				return true
			};
			this.logOut = function () {
				this.owner.logged(false);
				xRTML.Common.Cookie.deleteCookie({
					name : cookieName
				});
				if (dataAccess) {
					dataAccess.fire({
						userLogout : {
							user : {
								id : this.owner.id,
								name : this.owner.name(),
								logged : true,
								isTyping : false
							}
						}
					})
				}
				this.fire({
					userLogout : {
						user : {
							id : this.owner.id,
							name : this.owner.name(),
							logged : false,
							isTyping : false
						}
					}
				});
				this.fire({
					sendMessage : {
						action : "userLogout",
						data : {
							id : this.owner.id,
							name : this.owner.name(),
							logged : false,
							isTyping : false
						}
					}
				});
				this.owner.name("Write a username...");
				return true
			};
			this.getUserById = function (id) {
				var users = this.users();
				for (var i = 0; i < users.length; ++i) {
					if (users[i].id == id) {
						return users[i]
					}
				}
				return null
			};
			this.newUser = function (u) {
				var user = this.getUserById(u.id);
				if (user != null) {
					user = new User(u)
				} else {
					this.users.push(new User(u))
				}
			};
			this.removeUser = function (id) {
				this.users.remove(function (user) {
					return user.id == id
				})
			};
			this.usersTyping = xRTML.Templating.observable(xRTML.Common.Function.proxy(function () {
						var usersTyping = "";
						var users = this.users();
						if (users.length == 0) {
							return ""
						}
						for (var i = 0; i < users.length; i++) {
							var user = users[i];
							if (user.id != this.owner.id && user.isTyping()) {
								usersTyping += user.name() + ", "
							}
						}
						return usersTyping != "" ? usersTyping.slice(0, usersTyping.length - 2) : ""
					}, this));
			this.newMessage = function (m) {
				this.messages.push(m);
				if (xRTML.Common.DOM.getStyle({
						element : this.shoutboxContainer,
						rule : "display"
					}) == "none") {
					this.show()
				}
			};
			this.sendMessage = function (args) {
				if (this.messageContent().length > 0) {
					var message = new Message({
							name : args.name || this.owner.name(),
							content : args.content || this.messageContent()
						});
					this.newMessage(message);
					this.fire({
						sendMessage : {
							action : "post",
							data : message
						}
					});
					if (dataAccess) {
						dataAccess.fire({
							messagePost : {
								message : {
									user : this.owner,
									content : message
								}
							}
						})
					}
					this.fire({
						messagePost : {
							message : message
						}
					});
					this.messageContent("")
				}
			};
			var lastTypingValue = false;
			this.sendTypingMessage = function () {
				if (lastTypingValue != this.owner.isTyping()) {
					lastTypingValue = !lastTypingValue;
					this.fire({
						sendMessage : {
							action : "typing",
							data : {
								id : this.owner.id,
								name : this.owner.name(),
								logged : true,
								typing : this.owner.isTyping()
							}
						}
					});
					this.fire({
						userTyping : {
							user : {
								id : this.owner.id,
								name : this.owner.name(),
								logged : true,
								typing : this.owner.isTyping()
							}
						}
					})
				}
			};
			this.getUserIndexById = function (id) {
				var users = this.users();
				for (var i = 0; i < users.length; ++i) {
					if (users[i].id == id) {
						return i
					}
				}
			};
			this.setUserTyping = function (u) {
				var user = this.getUserById(u.id);
				if (user) {
					user.isTyping(u.typing);
					this.fire({
						userTyping : {
							user : {
								id : user.id,
								name : user.name(),
								logged : true,
								typing : user.isTyping()
							}
						}
					})
				}
			};
			this.close = function () {
				this.shoutboxContainer.style.display = "none";
				this.fire({
					close : {}
					
				});
				return true
			};
			this.show = function () {
				this.shoutboxContainer.style.display = defaultElementStyle;
				this.fire({
					show : {}
					
				})
			};
			if (xRTML.Common.Array.isArray(args.initialData)) {
				for (var prop in args.initialData) {
					var message = new Message({
							name : args.initialData[prop].name,
							content : args.initialData[prop].content,
							data : args.initialData[prop].data
						});
					this.newMessage(message)
				}
			}
		};
		var UserTypingBinding = function () {
			var owner;
			var time;
			var timerReference = null;
			var model;
			return {
				init : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
					time = parseInt(valueAccessor());
					owner = viewModel.owner;
					model = viewModel;
					xRTML.Event.bind(element, {
						keypress : function (e) {
							var evt = e ? e : event;
							var elem = evt.srcElement ? evt.srcElement : evt.target;
							var key = evt.keyCode ? evt.keyCode : evt.which ? evt.which : evt.charCode;
							if (key == 13) {
								model.sendMessage({
									name : owner.name(),
									content : model.messageContent()
								});
								owner.isTyping(false);
								clearTimeout(timerReference);
								model.sendTypingMessage();
								return true
							}
							owner.isTyping(true);
							if (timerReference != null) {
								clearTimeout(timerReference)
							}
							timerReference = setTimeout(function () {
									owner.isTyping(false);
									timerReference = null;
									model.sendTypingMessage()
								}, time);
							return true
						},
						keydown : function (e) {
							var evt = e ? e : event;
							var key = evt.keyCode ? evt.keyCode : evt.which ? evt.which : evt.charCode;
							var elem = evt.srcElement ? evt.srcElement : evt.target;
							if (key == 8 || key == 46) {
								owner.isTyping(model.messageContent().length > 0);
								if (timerReference != null) {
									clearTimeout(timerReference)
								}
								timerReference = setTimeout(function () {
										owner.isTyping(false);
										timerReference = null
									}, time)
							}
							return true
						},
						keyup : function (e) {
							var evt = e ? e : event;
							var key = evt.keyCode ? evt.keyCode : evt.which ? evt.which : evt.charCode;
							var elem = evt.srcElement ? evt.srcElement : evt.target;
							model.messageContent(elem.value.replace(/[\n\r\t]/g, ""));
							if (key == 8 || key == 46) {
								owner.isTyping(model.messageContent().length > 0);
								if (timerReference != null) {
									clearTimeout(timerReference);
									timerReference = null
								}
								timerReference = setTimeout(function () {
										owner.isTyping(false);
										timerReference = null
									}, time)
							}
							model.sendTypingMessage();
							return true
						}
					})
				}
			}
		};
		var DAO = function (args) {
			xRTML.Event.extend(this);
			var storage = xRTML.StorageManager.getById(args.id),
			storageKey = args.key;
			this.getAndUpdateUsers = function () {
				storage.get({
					namespace : "Shoutbox",
					k : storageKey + "#usersCount"
				}, function (result) {
					if (Number(result.data.resultData)) {
						var ks = [];
						for (var i = 1; i <= Number(result.data.resultData); i++) {
							ks.push(storageKey + "#users#" + i)
						}
						storage.get({
							namespace : "Shoutbox",
							ks : ks
						}, function (result) {
							if (result.data.resultData) {
								for (var i = 0, len = result.data.resultData.length; i < len; i++) {
									if (result.data.resultData[i] != null) {
										model.newUser(xRTML.JSON.parse(result.data.resultData[i]))
									}
								}
							}
						})
					}
				})
			};
			this.getAndUpdateMessages = function () {
				storage.get({
					namespace : "Shoutbox",
					k : storageKey + "#messagesCount"
				}, function (result) {
					if (result.data.resultData) {
						var ks = [];
						for (var i = 1; i <= Number(result.data.resultData); i++) {
							ks.push(storageKey + "#messages#" + i)
						}
						storage.get({
							namespace : "Shoutbox",
							ks : ks
						}, function (result) {
							if (result.data.resultData) {
								for (var i = 0, len = result.data.resultData.length; i < len; i++) {
									model.newMessage(new Message(xRTML.JSON.parse(result.data.resultData[i]).content))
								}
							}
						})
					}
				})
			};
			this.addUser = function (user) {
				storage.incr({
					namespace : "Shoutbox",
					pair : {
						k : storageKey + "#usersCount",
						v : 1
					}
				}, function (result) {
					storage.set({
						namespace : "Shoutbox",
						pair : {
							k : storageKey + "#users#" + result.data.resultData,
							v : xRTML.JSON.stringify(user)
						}
					}, function (result) {})
				})
			};
			this.removeUser = function (userId) {
				storage.get({
					namespace : "Shoutbox",
					k : storageKey + "#usersCount"
				}, function (result) {
					storage.del({
						namespace : "Shoutbox",
						k : storageKey + "#users#" + (model.getUserIndexById(userId) + 1)
					}, function (result) {})
				})
			};
			this.addMessage = function (message) {
				storage.incr({
					namespace : "Shoutbox",
					pair : {
						k : storageKey + "#messagesCount",
						v : 1
					}
				}, function (result) {
					storage.set({
						namespace : "Shoutbox",
						pair : {
							k : storageKey + "#messages#" + result.data.resultData,
							v : xRTML.JSON.stringify(message)
						}
					}, function (result) {})
				})
			}
		};
		var model;
		var cookieName;
		var dataAccess;
		this.init = function (tagObject) {
			this._super(tagObject);
			xRTML.Templating.bindingHandlers.userTypingBinding = new UserTypingBinding();
			this.template = tagObject.attribute("template");
			if (!this.template) {
				var defaultTemplate = ' <div class="xrtml-shoutbox">';
				defaultTemplate += '        <div class="xrtml-shoutbox-close" data-bind="click: close">X</div>';
				defaultTemplate += '        <div class="xrtml-shoutbox-notificationcontainer" data-bind="visible: usersTyping().length > 0">';
				defaultTemplate += '            <span class="xrtml-shoutbox-notificationcontainer-userstypinglabel">Users typing: </span>';
				defaultTemplate += '            <span class="xRTML-Shoutbox-NotificationContainer-UsersTyping" data-bind="text: usersTyping()"></span>';
				defaultTemplate += "        </div>";
				defaultTemplate += '        <div class="xrtml-shoutbox-shoutscontainer" data-bind="template: { name: \'xrtml-shouts-template\', foreach: messages }"></div>';
				defaultTemplate += '        <div class="xrtml-shoutbox-loginform" data-bind="visible: !owner.logged()">';
				defaultTemplate += '            <input class="xrtml-shoutbox-loginform-username" type="text" data-bind="value: owner.name"></input>';
				defaultTemplate += '            <input class="xrtml-shoutbox-loginform-login" type="button" value="Log In" data-bind="click: logIn"></input>';
				defaultTemplate += "        </div>";
				defaultTemplate += '        <div class="xrtml-shoutbox-shoutform" data-bind="visible: owner.logged()">';
				defaultTemplate += '            <label class="xrtml-shoutbox-shoutform-usernamelabel" data-bind="text: owner.name()"></label>';
				defaultTemplate += '            <textarea class="xrtml-shoutbox-shoutform-shoutcontent" data-bind="value: messageContent, userTypingBinding: 3000 " rows="1" cols="50"></textarea>';
				defaultTemplate += '            <input class="xrtml-shoutbox-shoutform-send" type="button" value="Send" data-bind="click: sendMessage"></input>';
				defaultTemplate += '            <input class="xrtml-shoutbox-shoutform-logout" type="button" value="Log Out" data-bind="click: logOut"></input>';
				defaultTemplate += "        </div>";
				defaultTemplate += "    </div>";
				var defaultShoutsTemplate = '   <p class="xrtml-shoutbox-shout">';
				defaultShoutsTemplate += '          <strong class="xrtml-shoutbox-shout-username" data-bind="text: name"></strong>';
				defaultShoutsTemplate += '          <span class="xrtml-shoutbox-shout-message" data-bind="text: content"></span>';
				defaultShoutsTemplate += "      <p>";
				xRTML.Templating.inject({
					id : "xrtml-shoutbox-template",
					content : defaultTemplate
				});
				xRTML.Templating.inject({
					id : "xrtml-shouts-template",
					content : defaultShoutsTemplate
				});
				this.template = "xrtml-shoutbox-template"
			}
			this.storageId = tagObject.attribute("storageid");
			this.storageKey = tagObject.attribute("storagekey");
			this.initialData = tagObject.attribute("initialData");
			if (this.storageId && this.storageKey) {
				dataAccess = new DAO({
						id : this.storageId,
						key : this.storageKey
					});
				dataAccess.bind({
					requestData : function () {
						dataAccess.getAndUpdateUsers();
						dataAccess.getAndUpdateMessages()
					},
					messagePost : xRTML.Common.Function.proxy(function (e) {
						dataAccess.addMessage(e.message)
					}, this),
					userLogin : function (e) {
						dataAccess.addUser(e.user)
					},
					userLogout : function (e) {
						dataAccess.removeUser(e.user.id)
					}
				});
				this.bind({
					postInit : function () {
						dataAccess.fire({
							requestData : {}
							
						})
					}
				})
			} else {
				xRTML.Console.warn("Tag " + this.name + " " + this.id + ": Storage was not configured. The data will not be persistent.")
			}
			var toFunction = xRTML.Common.Function.parse;
			this.bind({
				message : toFunction(tagObject.attribute("onMessage")),
				messagePost : toFunction(tagObject.attribute("onMessagePost")),
				userLogin : toFunction(tagObject.attribute("onUserLogin")),
				userLogout : toFunction(tagObject.attribute("onUserLogout")),
				userTyping : toFunction(tagObject.attribute("onUserTyping")),
				close : toFunction(tagObject.attribute("onClose")),
				show : toFunction(tagObject.attribute("onShow"))
			});
			cookieName = "xRTMLShoutbox-" + this.id;
			var cookie = xRTML.Common.Cookie.getCookie({
					name : cookieName
				});
			var args = {
				shoutboxContainer : this.target[0],
				initialData : this.initialData
			};
			if (cookie) {
				args.userData = xRTML.JSON.parse(cookie)
			}
			model = this.model = new Model(args);
			model.bind({
				sendMessage : xRTML.Common.Function.proxy(function (e) {
					this.sendMessage(e)
				}, this),
				messagePost : xRTML.Common.Function.proxy(function (e) {
					this.fire({
						messagePost : {
							message : e.message
						}
					})
				}, this),
				userLogin : xRTML.Common.Function.proxy(function (e) {
					this.fire({
						userLogin : {
							user : e.user
						}
					})
				}, this),
				userLogout : xRTML.Common.Function.proxy(function (e) {
					this.fire({
						userLogout : {
							user : e.user
						}
					})
				}, this),
				userTyping : xRTML.Common.Function.proxy(function (e) {
					this.fire({
						userTyping : {
							user : e.user
						}
					})
				}, this),
				close : xRTML.Common.Function.proxy(function (e) {
					this.fire({
						close : {}
						
					})
				}, this),
				show : xRTML.Common.Function.proxy(function (e) {
					this.fire({
						show : {}
						
					})
				}, this)
			});
			try {
				xRTML.Templating.applyBindings({
					node : this.target[0],
					binding : {
						template : {
							name : this.template,
							data : model
						}
					}
				})
			} catch (err) {
				xRTML.Error.raise({
					code : xRTML.Error.Codes.TEMPLATING,
					target : this,
					info : {
						message : err.message,
						className : "xRTML.Tags." + this.name,
						methodName : "init"
					}
				})
			}
		};
		this.post = function (data) {
			try {
				model.newMessage(new Message(data))
			} catch (err) {
				xRTML.Error.raise({
					code : xRTML.Error.Codes.TEMPLATING,
					target : this,
					info : {
						message : err.message,
						className : "xRTML.Tags." + this.name,
						methodName : "post"
					}
				})
			}
			this.fire({
				message : {
					message : data
				}
			})
		};
		this.userLogin = function (data) {
			var user = new User(data);
			try {
				model.newUser(user)
			} catch (err) {
				xRTML.Error.raise({
					code : xRTML.Error.Codes.TEMPLATING,
					target : this,
					info : {
						message : err.message,
						className : "xRTML.Tags." + this.name,
						methodName : "login"
					}
				})
			}
			this.fire({
				userLogin : {
					user : {
						id : user.id,
						isTyping : user.isTyping(),
						logged : user.logged(),
						name : user.name(),
						isTyping : false
					}
				}
			})
		};
		this.userLogout = function (message) {
			var user = model.getUserById(message.id);
			try {
				model.removeUser(message.id)
			} catch (err) {
				xRTML.Error.raise({
					code : xRTML.Error.Codes.TEMPLATING,
					target : this,
					info : {
						message : err.message,
						className : "xRTML.Tags." + this.name,
						methodName : "logout"
					}
				})
			}
			if (user != null) {
				this.fire({
					userLogout : {
						user : {
							id : user.id,
							isTyping : user.isTyping(),
							logged : user.logged(),
							name : user.name(),
							isTyping : false
						}
					}
				})
			}
		};
		this.typing = function (message) {
			var user = model.getUserById(message.id);
			if (user == null) {
				model.newUser({
					id : message.id,
					name : message.name,
					logged : true
				})
			}
			try {
				model.setUserTyping(message)
			} catch (err) {
				xRTML.Error.raise({
					code : xRTML.Error.Codes.TEMPLATING,
					target : this,
					info : {
						message : err.message,
						className : "xRTML.Tags." + this.name,
						methodName : "typing"
					}
				})
			}
			var user = model.getUserById(message.id)
		};
		this.login = function (args) {
			if (!model.owner || (model.owner && model.owner.logged())) {
				return
			}
			model.owner.id = args.id;
			model.owner.name(args.name);
			model.owner.logged(true);
			model.users.push(model.owner);
			xRTML.Common.Cookie.setCookie({
				name : cookieName,
				value : xRTML.JSON.stringify({
					id : model.owner.id,
					name : model.owner.name()
				})
			});
			model.fire({
				sendMessage : {
					action : "userLogin",
					data : {
						id : model.owner.id,
						name : model.owner.name(),
						logged : true,
						isTyping : false
					}
				}
			});
			this.fire({
				userLogin : {
					user : {
						id : model.owner.id,
						name : model.owner.name(),
						logged : true,
						isTyping : false
					}
				}
			});
			return
		};
		this.logout = function () {
			if (!model.owner || (model.owner && !model.owner.logged())) {
				return
			}
			model.owner.logged(false);
			xRTML.Common.Cookie.deleteCookie({
				name : cookieName
			});
			if (dataAccess) {
				dataAccess.fire({
					userLogout : {
						user : model.owner
					}
				})
			}
			model.fire({
				sendMessage : {
					action : "userLogout",
					data : {
						id : model.owner.id
					}
				}
			});
			model.owner.name("Write a username...");
			return
		};
		this.show = function () {
			model.show()
		};
		this.close = function () {
			model.close()
		};
		this.dispose = function () {
			xRTML.Common.Cookie.deleteCookie({
				name : cookieName
			});
			while (this.target[0].firstChild) {
				this.target[0].removeChild(this.target[0].firstChild)
			}
			this._super()
		}
	}
});
xRTML.TagManager.register({
	name : "Toast",
	struct : function () {
		var ToastModel = function (config) {
			var Banner = (function () {
				var TINY = {};
				TINY.box = function () {
					var j,
					m,
					b,
					g,
					v,
					p = 0;
					return {
						show : function (o) {
							v = {
								opacity : 70,
								close : 1,
								animate : 1,
								fixed : 1,
								mask : 1,
								maskid : "",
								boxid : "",
								topsplit : 2,
								url : 0,
								post : 0,
								height : 0,
								width : 0,
								html : 0,
								iframe : 0
							};
							for (s in o) {
								v[s] = o[s]
							}
							if (!p) {
								j = document.createElement("div");
								j.className = "xrtml-toast-banner";
								p = document.createElement("div");
								p.className = "xrtml-toast-banner-loading";
								b = document.createElement("div");
								b.className = o.bannerContentClass;
								m = document.createElement("div");
								m.className = "xrtml-toast-banner-mask";
								g = document.createElement("div");
								g.className = "xrtml-toast-banner-close";
								g.v = 0;
								document.body.appendChild(m);
								document.body.appendChild(j);
								j.appendChild(p);
								p.appendChild(b);
								m.onclick = g.onclick = function () {
									TINY.box.hide("CloseBanner")
								};
								window.onresize = TINY.box.resize
							} else {
								j.style.display = "none";
								clearTimeout(p.ah);
								if (g.v) {
									p.removeChild(g);
									g.v = 0
								}
							}
							p.id = v.boxid;
							m.id = v.maskid;
							j.style.position = v.fixed ? "fixed" : "absolute";
							if (v.html && !v.animate) {
								p.style.backgroundImage = "none";
								b.innerHTML = v.html;
								b.style.display = "";
								p.style.width = v.width ? v.width + "px" : "auto";
								p.style.height = v.height ? v.height + "px" : "auto"
							} else {
								b.style.display = "none";
								if (!v.animate && v.width && v.height) {
									p.style.width = v.width + "px";
									p.style.height = v.height + "px"
								} else {
									p.style.width = p.style.height = "100px"
								}
							}
							if (v.mask) {
								this.mask();
								this.alpha(m, 1, v.opacity)
							} else {
								this.alpha(j, 1, 100)
							}
							if (v.autohide) {
								p.ah = setTimeout(function () {
										TINY.box.hide("TimeOut")
									}, 1000 * v.autohide)
							} else {
								document.onkeyup = TINY.box.esc
							}
						},
						fill : function (c, u, k, a, w, h) {
							if (u) {
								if (v.image) {
									var i = new Image();
									i.onload = function () {
										w = w || i.width;
										h = h || i.height;
										TINY.box.psh(i, a, w, h)
									};
									i.src = v.image
								} else {
									if (v.iframe) {
										this.psh('<iframe src="' + v.iframe + '" width="' + v.width + '" frameborder="0" height="' + v.height + '"></iframe>', a, w, h)
									} else {
										var x = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
										x.onreadystatechange = function () {
											if (x.readyState == 4 && x.status == 200) {
												p.style.backgroundImage = "";
												TINY.box.psh(x.responseText, a, w, h)
											}
										};
										if (k) {
											x.open("POST", c, true);
											x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
											x.send(k)
										} else {
											x.open("GET", c, true);
											x.send(null)
										}
									}
								}
							} else {
								this.psh(c, a, w, h)
							}
						},
						psh : function (c, a, w, h) {
							if (typeof c == "object") {
								b.appendChild(c)
							} else {
								b.innerHTML = c
							}
							var x = p.style.width,
							y = p.style.height;
							if (!w || !h) {
								p.style.width = w ? w + "px" : "";
								p.style.height = h ? h + "px" : "";
								b.style.display = "";
								if (!h) {
									h = parseInt(b.offsetHeight)
								}
								if (!w) {
									w = parseInt(b.offsetWidth)
								}
								b.style.display = "none"
							}
							p.style.width = x;
							p.style.height = y;
							this.size(w, h, a)
						},
						esc : function (e) {
							e = e || window.event;
							if (e.keyCode == 27) {
								TINY.box.hide("CloseBanner")
							}
						},
						hide : function (bannerCloseInfo) {
							if (xRTML.Sizzle("#xrtml-video-ytplayer").length > 0) {
								swfobject.removeSWF("xrtml-video-ytplayer")
							}
							clearTimeout(p.ah);
							TINY.box.alpha(j, -1, 0, 3);
							document.onkeypress = null;
							if (v.closejs) {
								v.closejs(bannerCloseInfo)
							}
							xRTML.Sizzle(".xrtml-toast-banner")[0].parentNode.removeChild(xRTML.Sizzle(".xrtml-toast-banner")[0]);
							xRTML.Sizzle(".xrtml-toast-banner-mask")[0].parentNode.removeChild(xRTML.Sizzle(".xrtml-toast-banner-mask")[0])
						},
						resize : function () {
							TINY.box.pos();
							TINY.box.mask()
						},
						mask : function () {
							m.style.height = this.total(1) + "px";
							m.style.width = this.total(0) + "px"
						},
						pos : function () {
							var t;
							if (typeof v.top != "undefined") {
								t = v.top
							} else {
								t = (this.height() / v.topsplit) - (j.offsetHeight / 2);
								t = t < 20 ? 20 : t
							}
							if (!v.fixed && !v.top) {
								t += this.top()
							}
							j.style.top = t + "px";
							j.style.left = typeof v.left != "undefined" ? v.left + "px" : (this.width() / 2) - (j.offsetWidth / 2) + "px"
						},
						alpha : function (e, d, a) {
							clearInterval(e.ai);
							if (d) {
								e.style.opacity = 0;
								e.style.filter = "alpha(opacity=0)";
								e.style.display = "block";
								TINY.box.pos()
							}
							e.ai = setInterval(function () {
									TINY.box.ta(e, a, d)
								}, 20)
						},
						ta : function (e, a, d) {
							var o = Math.round(e.style.opacity * 100);
							if (o == a) {
								clearInterval(e.ai);
								if (d == -1) {
									e.style.display = "none";
									e == j ? TINY.box.alpha(m, -1, 0, 2) : b.innerHTML = p.style.backgroundImage = ""
								} else {
									if (e == m) {
										this.alpha(j, 1, 100)
									} else {
										j.style.filter = "";
										TINY.box.fill(v.html || v.url, v.url || v.iframe || v.image, v.post, v.animate, v.width, v.height)
									}
								}
							} else {
								var n = a - Math.floor(Math.abs(a - o) * 0.5) * d;
								e.style.opacity = n / 100;
								e.style.filter = "alpha(opacity=" + n + ")"
							}
						},
						size : function (w, h, a) {
							if (a) {
								clearInterval(p.si);
								var wd = parseInt(p.style.width) > w ? -1 : 1,
								hd = parseInt(p.style.height) > h ? -1 : 1;
								p.si = setInterval(function () {
										TINY.box.ts(w, wd, h, hd)
									}, 20)
							} else {
								p.style.backgroundImage = "none";
								if (v.close) {
									p.appendChild(g);
									g.v = 1
								}
								p.style.width = w + "px";
								p.style.height = h + "px";
								b.style.display = "";
								this.pos();
								if (v.openjs) {
									v.openjs()
								}
							}
						},
						ts : function (w, wd, h, hd) {
							var cw = parseInt(p.style.width),
							ch = parseInt(p.style.height);
							if (cw == w && ch == h) {
								clearInterval(p.si);
								p.style.backgroundImage = "none";
								b.style.display = "block";
								if (v.close) {
									p.appendChild(g);
									g.v = 1
								}
								if (v.openjs) {
									v.openjs()
								}
							} else {
								if (cw != w) {
									p.style.width = (w - Math.floor(Math.abs(w - cw) * 0.6) * wd) + "px"
								}
								if (ch != h) {
									p.style.height = (h - Math.floor(Math.abs(h - ch) * 0.6) * hd) + "px"
								}
								this.pos()
							}
						},
						top : function () {
							return document.documentElement.scrollTop || document.body.scrollTop
						},
						width : function () {
							return self.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
						},
						height : function () {
							return self.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
						},
						total : function (d) {
							var b = document.body,
							e = document.documentElement;
							return d ? Math.max(Math.max(b.scrollHeight, e.scrollHeight), Math.max(b.clientHeight, e.clientHeight)) : Math.max(Math.max(b.scrollWidth, e.scrollWidth), Math.max(b.clientWidth, e.clientWidth))
						}
					}
				}
				();
				xRTML.Event.extend(this);
				var privateShow = function (toast) {
					tyniboxObj = {
						autohide : toast.bannerAutoHide,
						animate : true,
						openjs : function (e) {
							_model.fire({
								bannerDisplay : {
									target : toast
								}
							})
						},
						closejs : function (bannerCloseInfo) {
							_model.bannerActive = false;
							_model.fire({
								bannerClose : {
									target : toast,
									info : bannerCloseInfo
								}
							})
						},
						bannerContentClass : (function (t) {
							return !t.destinationUrl ? "xrtml-toast-banner-content" : "xrtml-toast-banner-content-clickable"
						})(toast)
					};
					if (toast.bannerWidth) {
						tyniboxObj.width = toast.bannerWidth
					}
					if (toast.bannerHeight) {
						tyniboxObj.height = toast.bannerHeight
					}
					switch (toast.bannerType) {
					default:
					case "image":
						tyniboxObj.image = toast.bannerUrl;
						break;
					case "html":
						tyniboxObj.html = toast.bannerContent;
						break;
					case "iframe":
						tyniboxObj.iframe = toast.bannerUrl;
					case "flash":
						var content = '<object type="application/x-shockwave-flash" data="' + toast.bannerUrl + '"';
						if (toast.bannerWidth) {
							content += 'width="' + toast.bannerWidth + '"'
						}
						if (toast.bannerHeight) {
							content += 'height="' + toast.bannerHeight + '"'
						}
						content += '><param name="movie" value="' + toast.bannerUrl + '" />';
						content += "</object>";
						tyniboxObj.html = content;
						break;
					case "video":
						if (typeof toast.bannerSource != "undefined") {
							if (xRTML.Common.Array.contains({
									items : xRTML.TagManager.getClasses(),
									obj : "Video"
								})) {
								var content = '<div id="xrtml-toast-banner-videocontainer"';
								var style = "";
								if (toast.bannerWidth) {
									style += "width:" + toast.bannerWidth + "px;"
								} else {
									style += "width: 400px;"
								}
								if (toast.bannerHeight) {
									style += "height:" + toast.bannerHeight + "px;"
								} else {
									style += "height: 400px;"
								}
								if (style != "") {
									content += 'style="' + style + '"'
								}
								content += "></div>";
								tyniboxObj.html = content;
								tyniboxObj.openjs = xRTML.Common.Function.proxy(function () {
										var video = {
											name : "Video",
											id : "toast-video-tag",
											controlsBar : false,
											target : "#xrtml-toast-banner-videocontainer",
											width : this.bannerWidth || 400,
											height : this.bannerHeight || 400,
											keepRatio : false
										};
										xRTML.TagManager.create(video);
										var tag = xRTML.TagManager.getById("toast-video-tag");
										tag.play(toast.bannerSource);
										_model.fire({
											bannerDisplay : {
												target : toast
											}
										})
									}, toast);
								tyniboxObj.closejs = xRTML.Common.Function.proxy(function () {
										_model.bannerActive = false;
										xRTML.TagManager.getById("toast-video-tag").dispose();
										_model.fire({
											bannerClose : {
												target : toast
											}
										})
									}, toast)
							} else {
								xRTML.Console.error("The xRTML video tag must be added in order to create video banners.")
							}
						}
						break
					}
					TINY.box.show(tyniboxObj)
				};
				var privateHide = function (closeInfo) {
					TINY.box.hide(closeInfo)
				};
				return {
					show : privateShow,
					hide : privateHide
				}
			})();
			this.id = xRTML.Common.Util.idGenerator();
			this.title = config.title;
			this.text = config.text;
			this.displayToast = config.displayToast;
			this.displayBanner = config.displayBanner;
			this.timeToLive = config.timeToLive;
			this.bannerType = config.bannerType;
			this.bannerUrl = config.bannerUrl;
			this.bannerContent = config.bannerContent;
			this.bannerWidth = config.bannerWidth;
			this.bannerHeight = config.bannerHeight;
			this.bannerAutoHide = config.bannerAutoHide;
			this.destinationUrl = config.destinationUrl;
			this.bannerSource = config.bannerSource;
			this.metaData = config.metaData;
			this.close = function (closeInfo) {
				if (typeof closeInfo != "string") {
					_model.destroy(this, "CloseButton")
				} else {
					_model.destroy(this, closeInfo)
				}
				clearTimeout(this.timeoutReference)
			};
			this.showBanner = function () {
				if (this.displayToast) {
					this.close("ShowBanner")
				}
				if (this.displayBanner) {
					_model.bannerActive = true;
					Banner.show(this);
					var tboxChilds = xRTML.Sizzle(".xrtml-toast-banner * :not(.xrtml-toast-banner-close)");
					var clickFunction = xRTML.Common.Function.proxy(function () {
							Banner.hide("OpenUrl");
							this.openUrl();
							for (var i = 0; i < tboxChilds.length; i++) {
								xRTML.Event.unbind(tboxChilds[i], {
									click : clickFunction
								})
							}
						}, this);
					for (var i = 0; i < tboxChilds.length; i++) {
						xRTML.Event.bind(tboxChilds[i], {
							click : clickFunction
						})
					}
				} else {
					this.openUrl()
				}
			};
			if (this.displayToast) {
				this.timeoutReference = setTimeout(xRTML.Common.Function.proxy(function () {
							this.close("TimeOut")
						}, this), this.timeToLive)
			}
			this.openUrl = function () {
				if (this.destinationUrl) {
					window.open(this.destinationUrl, "_blank");
					_model.fire({
						urlOpen : {
							target : this
						}
					})
				}
			}
		};
		var Model = function () {
			xRTML.Event.extend(this);
			this.toasts = xRTML.Templating.observable(new Array());
			this.create = function (args) {
				var newToast = new ToastModel(args);
				if (args.displayToast) {
					if (args.index == "end") {
						this.toasts.push(newToast)
					} else {
						this.toasts.splice(0, 0, newToast)
					}
					this.fire({
						toastDisplay : {
							target : newToast
						}
					})
				} else {
					newToast.showBanner()
				}
			};
			this.destroy = function (toast, closeInfo) {
				this.toasts.remove(toast);
				this.fire({
					toastClose : {
						target : toast,
						info : closeInfo
					}
				})
			};
			this.bannerActive = false
		};
		var _model = null;
		this.init = function (tagObject) {
			this._super(tagObject);
			this.positionAt = tagObject.attribute("positionAt");
			this.mediaUrls = tagObject.attribute("mediaUrls");
			if (typeof this.mediaUrls != "undefined") {
				if (xRTML.Common.Array.contains({
						items : xRTML.TagManager.getClasses(),
						obj : "Audio"
					})) {
					this.audioNotificationTag = xRTML.TagManager.create({
							name : "Audio",
							controlsbar : false
						})
				} else {
					xRTML.Console.error("The xRTML Audio tag must be added in order to play audio notifications.")
				}
			}
			this.effects = tagObject.attribute("effects");
			xRTML.Effect.extend(this);
			_model = this.model = new Model();
			this.toastContainer;
			if (this.target[0].tagName == "BODY") {
				this.toastContainer = document.createElement("div");
				this.toastContainer.setAttribute("id", "xRTML-Toast-target");
				document.body.appendChild(this.toastContainer)
			} else {
				this.toastContainer = this.target[0]
			}
			this.template = tagObject.attribute("template");
			if (!this.template) {
				var defaultTemplate = ' <div class="xrtml-toast" data-bind="attr: { id: id }">';
				defaultTemplate += '        <div class="xrtml-toast-close" data-bind="click: close">X</div>';
				defaultTemplate += "        <div data-bind=\"click: showBanner, css: { 'xrtml-toast-content': !destinationUrl && !displayBanner , 'xrtml-toast-content-clickable': !!destinationUrl || displayBanner }\">";
				defaultTemplate += '            <h3 class="xrtml-toast-content-title" data-bind="text: title"></h3>';
				defaultTemplate += '            <span class="xrtml-toast-content-message" data-bind="text: text"></span>';
				defaultTemplate += "        </div>";
				defaultTemplate += "    </div>";
				xRTML.Templating.inject({
					id : "xRTML-Toast-Template",
					content : defaultTemplate
				});
				this.template = "xRTML-Toast-Template"
			}
			try {
				xRTML.Templating.applyBindings({
					node : this.toastContainer,
					binding : {
						template : {
							name : this.template,
							foreach : _model.toasts,
							afterRender : xRTML.Common.Function.proxy(function (elements, data) {
								for (var i = 0; i < elements.length; i++) {
									if (elements[i].nodeName != "#text") {
										this.runEffects({
											element : elements[i]
										})
									}
								}
							}, this)
						}
					}
				})
			} catch (err) {
				xRTML.Error.raise({
					code : xRTML.Error.Codes.TEMPLATING,
					target : this,
					info : {
						message : err.message,
						className : "xRTML.Tags." + this.name,
						methodName : "init"
					}
				})
			}
			var positionToast = (function (toastTag) {
				var toastDiv = toastTag.toastContainer;
				toastDiv.style.position = "fixed";
				switch (toastTag.positionAt) {
				case "topleft":
					toastDiv.style.top = 15 + "px";
					toastDiv.style.left = 15 + "px";
					break;
				case "topright":
					toastDiv.style.top = 15 + "px";
					toastDiv.style.right = 15 + "px";
					break;
				case "bottomleft":
					toastDiv.style.bottom = 30 + "px";
					toastDiv.style.left = 15 + "px";
					break;
				case "bottomright":
				default:
					toastDiv.style.bottom = 30 + "px";
					toastDiv.style.right = 15 + "px";
					break
				}
			})(this);
			var toFunction = xRTML.Common.Function.parse;
			this.bind({
				toastDisplay : toFunction(tagObject.attribute("onToastDisplay")),
				toastClose : toFunction(tagObject.attribute("onToastClose")),
				bannerDisplay : toFunction(tagObject.attribute("onBannerDisplay")),
				bannerClose : toFunction(tagObject.attribute("onBannerClose")),
				urlOpen : toFunction(tagObject.attribute("onUrlOpen"))
			});
			_model.bind({
				toastDisplay : xRTML.Common.Function.proxy(function (e) {
					this.fire({
						toastDisplay : e
					})
				}, this),
				toastClose : xRTML.Common.Function.proxy(function (e) {
					this.fire({
						toastClose : e
					})
				}, this),
				bannerDisplay : xRTML.Common.Function.proxy(function (e) {
					this.fire({
						bannerDisplay : e
					})
				}, this),
				bannerClose : xRTML.Common.Function.proxy(function (e) {
					this.fire({
						bannerClose : e
					})
				}, this),
				urlOpen : xRTML.Common.Function.proxy(function (e) {
					this.fire({
						urlOpen : e
					})
				}, this)
			})
		};
		this.process = function (data) {
			var args = {
				title : typeof data.title != "undefined" ? data.title : "",
				text : typeof data.text != "undefined" ? data.text : "",
				destinationUrl : typeof data.destinationUrl != "undefined" ? data.destinationUrl : false,
				timeToLive : data.timeToLive || 10000,
				displayToast : typeof data.displayToast != "undefined" ? data.displayToast : true,
				displayBanner : typeof data.displayBanner != "undefined" ? data.displayBanner : true,
				metaData : data.metaData,
				bannerUrl : data.bannerUrl,
				bannerContent : data.bannerContent,
				bannerType : data.bannerType,
				bannerSource : data.bannerSource,
				bannerHeight : xRTML.Common.Converter.toNumber(data.bannerHeight),
				bannerWidth : xRTML.Common.Converter.toNumber(data.bannerWidth),
				bannerAutoHide : typeof data.bannerAutoHide != "undefined" ? (xRTML.Common.Converter.toNumber(data.bannerAutoHide) / 1000) : false
			};
			if (this.positionAt == "topleft" || this.positionAt == "topright") {
				args.index = "begin"
			} else {
				args.index = "end"
			}
			if (_model.bannerActive) {
				var bufferProcess = xRTML.Common.Function.proxy(function () {
						this.unbind({
							bannerClose : bufferProcess
						});
						this.process(data)
					}, this);
				this.bind({
					bannerClose : bufferProcess
				})
			} else {
				try {
					_model.create(args)
				} catch (err) {
					xRTML.Error.raise({
						code : xRTML.Error.Codes.TEMPLATING,
						target : this,
						info : {
							message : err.message,
							className : "xRTML.Tags." + this.name,
							methodName : "process"
						}
					})
				}
				if (typeof this.audioNotificationTag != "undefined") {
					this.audioNotificationTag.play({
						source : this.mediaUrls
					})
				}
			}
		}
	}
});
var _Audio = {
	"extends" : "xRTML.Tags.Media",
	name : "Audio",
	namespace : "xRTML.Tags",
	description : "The Audio Tag provides functionality for controlling the playback of audio files remotely using Realtime. Uses HTML5's audio tag when possible or a Flash based fallback. The types of file chosen by the tag are according to the support provided by the browser, but the developer will have to provide audio files in each of the formats necessary to ensure support on all major browsers: mp3, ogg, wav, swf. {@code: xRTMLTagsAudiocreate_tag.js} {@example: https://github.com/RTWWorld/xrtml-examples/tree/master/tags/audio} {@tutorial: http://www.xrtml.org/tutorials/audio.html} {@demo: http://www.xrtml.org/demos/audio} {@tags: media|audio|tags}",
	properties : {},
	constructors : {
		init : {
			modifier : "public",
			arguments : {
				tagObject : {
					type : {
						properties : {
							id : {
								modifier : "public",
								type : "String",
								description : "Identification of the tag, assigned by the user."
							},
							connections : {
								modifier : "public",
								type : "String",
								description : "[ARRAY]Identification of the tag, assigned by the user. For tags that will send messages."
							},
							channelId : {
								modifier : "public",
								type : "String",
								description : "Channel through which xRTML messages will be sent by this tag."
							},
							triggers : {
								modifier : "public",
								type : "String",
								description : "[ARRAY]Array of triggers that will prompt the tag to take action."
							},
							receiveOwnMessages : {
								modifier : "public",
								type : "Boolean",
								description : "Indicates the reception of the xRTML messages sent by the tag itself. {@default false}"
							},
							target : {
								modifier : "public",
								type : "String",
								description : "The selector to find the target HTMLElement for this tag. The first position found will be used. {@default BODY}"
							},
							active : {
								modifier : "public",
								type : "Boolean",
								description : "Identifies if the tag is enabled to send and receive xRTML messages. {@default true}"
							},
							onPreInit : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the preInit event."
							},
							onPostInit : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the postInit event."
							},
							onActive : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the active event."
							},
							onPreProcess : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the preProcess event."
							},
							onPostProcess : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the postProcess event."
							},
							onDispose : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the dispose event."
							},
							width : {
								modifier : "public",
								type : "Number",
								description : "The width to apply to the media content."
							},
							height : {
								modifier : "public",
								type : "Number",
								description : "The height to apply to the media content."
							},
							autoPlay : {
								modifier : "public",
								type : "Boolean",
								description : "Tells whether the media file should start playing as soon as it is loaded. {@default true}"
							},
							loop : {
								modifier : "public",
								type : "Boolean",
								description : "Tells whether the media file should repeat after its finishes playing. {@default true}"
							},
							controlsBar : {
								modifier : "public",
								type : "Boolean",
								description : "Toggles the display of the media player native control menu. {@default false}"
							},
							muted : {
								modifier : "public",
								type : "Boolean",
								description : "Toggles the media file sound. {@default false}"
							}
						}
					},
					description : "Configuration of the tag.",
					mandatory : false
				}
			},
			"return" : "",
			exceptions : [],
			description : "Initializes a tag by setting it attributes."
		}
	},
	methods : {
		play : {
			modifier : "public",
			arguments : {
				data : {
					type : {
						properties : {
							files : {
								modifier : "public",
								type : "Object",
								description : "The different kinds of formats for the same media file."
							},
							autoPlay : {
								modifier : "public",
								type : "Boolean",
								description : "Tells if the media file starts playing when queued."
							},
							loop : {
								modifier : "public",
								type : "Boolean",
								description : "Tells if media repeats after finishing."
							}
						}
					},
					description : "The xRTML data representing the media file to be played. In case it's not specified it will play the next file in queue.",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Plays a media file. The file to be played might be contained in the xRTML Message or in the players' queue. {@code: xRTMLTagsAudio\data_files.js}"
		},
		queue : {
			modifier : "public",
			arguments : {
				data : {
					type : "Object",
					description : "The xRTML message data containing the media file attributes.",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Places a media file in queue. {@code: xRTMLTagsAudio\data_files.js}"
		},
		skip : {
			modifier : "public",
			arguments : {
				data : {
					type : {
						properties : {
							skip : {
								modifier : "public",
								type : "Number",
								description : "The value, in miliseconds, where the playback will be set in the timeline."
							}
						}
					},
					description : "The xRTML message data.",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Controls the media file timeline currently playing. {@code: xRTMLTagsAudioskip_function.js}"
		},
		unqueue : {
			modifier : "public",
			arguments : {
				data : {
					type : "Object",
					description : "The xRTML message data containing the media file attributes.",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Removes a media file from queue. {@code: xRTMLTagsAudio\data_files.js}"
		},
		volume : {
			modifier : "public",
			arguments : {
				data : {
					type : {
						properties : {
							volume : {
								modifier : "public",
								type : "Number",
								description : "The value of the volume to be set."
							}
						}
					},
					description : "The xRTML message data",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Controls the volume of the media file currently being played. {@code: xRTMLTagsAudio\volume_function.js}"
		}
	},
	events : {}
	
};
xRTML.Metadata.registerClass(_Audio);
var _Video = {
	"extends" : "xRTML.Tags.Media",
	name : "Video",
	namespace : "xRTML.Tags",
	description : "The Video Tag provides functionality for controlling the playback of video files remotely using Realtime. Uses HTML5's video tag when possible or a Flash based fallback. The playback of YouTube videos is also supported. The types of file chosen by the tag are according to the support provided by the browser, but the developer will have to provide video files in each of the formats necessary to ensure support on all major browsers: mp4, ogg, webm, swf. {@code: xRTMLTagsVideocreate_tag.js} {@example: https://github.com/RTWWorld/xrtml-examples/tree/master/tags/video} {@tutorial: http://www.xrtml.org/tutorials/video.html} {@demo: http://www.xrtml.org/demos/video} {@tags: video|media|tags}",
	properties : {
		keepRatio : {
			modifier : "",
			type : "Boolean",
			description : "Defines if the tag keeps the video aspect ratio. {@default true}"
		},
		poster : {
			modifier : "",
			type : "String",
			description : "Path to the poster image of the player. {@default null}"
		}
	},
	constructors : {
		init : {
			modifier : "public",
			arguments : {
				tagObject : {
					type : {
						properties : {
							id : {
								modifier : "public",
								type : "String",
								description : "Identification of the tag, assigned by the user."
							},
							connections : {
								modifier : "public",
								type : "String",
								description : "[ARRAY]Identification of the tag, assigned by the user. For tags that will send messages."
							},
							channelId : {
								modifier : "public",
								type : "String",
								description : "Channel through which xRTML messages will be sent by this tag."
							},
							triggers : {
								modifier : "public",
								type : "String",
								description : "[ARRAY]Array of triggers that will prompt the tag to take action."
							},
							receiveOwnMessages : {
								modifier : "public",
								type : "Boolean",
								description : "Indicates the reception of the xRTML messages sent by the tag itself. {@default false}"
							},
							target : {
								modifier : "public",
								type : "String",
								description : "The selector to find the target HTMLElement for this tag. The first position found will be used. {@default BODY}"
							},
							active : {
								modifier : "public",
								type : "Boolean",
								description : "Identifies if the tag is enabled to send and receive xRTML messages. {@default true}"
							},
							onPreInit : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the preInit event."
							},
							onPostInit : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the postInit event."
							},
							onActive : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the active event."
							},
							onPreProcess : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the preProcess event."
							},
							onPostProcess : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the postProcess event."
							},
							onDispose : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the dispose event."
							},
							width : {
								modifier : "public",
								type : "Number",
								description : "The width to apply to the media content."
							},
							height : {
								modifier : "public",
								type : "Number",
								description : "The height to apply to the media content."
							},
							autoPlay : {
								modifier : "public",
								type : "Boolean",
								description : "Tells whether the media file should start playing as soon as it is loaded. {@default true}"
							},
							loop : {
								modifier : "public",
								type : "Boolean",
								description : "Tells whether the media file should repeat after its finishes playing. {@default true}"
							},
							controlsBar : {
								modifier : "public",
								type : "Boolean",
								description : "Toggles the display of the media player native control menu. {@default false}"
							},
							muted : {
								modifier : "public",
								type : "Boolean",
								description : "Toggles the media file sound. {@default false}"
							},
							poster : {
								modifier : "public",
								type : "String",
								description : "Path to the poster image of the player. {@default null}"
							},
							keepRatio : {
								modifier : "public",
								type : "Boolean",
								description : "Tells if the tag keeps the video aspect ratio. {@default true}"
							}
						}
					},
					description : "Configuration of the tag.",
					mandatory : false
				}
			},
			"return" : "",
			exceptions : [],
			description : "Initializes a tag by setting it attributes."
		}
	},
	methods : {
		play : {
			modifier : "public",
			arguments : {
				data : {
					type : {
						properties : {
							files : {
								modifier : "public",
								type : "Object",
								description : "The different kinds of formats for the same media file."
							},
							autoPlay : {
								modifier : "public",
								type : "Boolean",
								description : "Tells if the media file starts playing when queued."
							},
							loop : {
								modifier : "public",
								type : "Boolean",
								description : "Tells if media repeats after finishing."
							}
						}
					},
					description : "The xRTML data representing the media file to be played. In case it's not specified it will play the next file in queue.",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "Plays a media file. [ACTION]The file to be played might be contained in the xRTML Message or in the players' queue. {@code: xRTMLTagsVideo\data_files.js}"
		},
		queue : {
			modifier : "public",
			arguments : {
				data : {
					type : "Object",
					description : "The xRTML message data containing the media file attributes.",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Places a media file in queue. {@code: xRTMLTagsVideo\data_files.js}"
		},
		skip : {
			modifier : "public",
			arguments : {
				data : {
					type : {
						properties : {
							skip : {
								modifier : "public",
								type : "Number",
								description : "The value, in miliseconds, where the playback will be set in the timeline."
							}
						}
					},
					description : "The xRTML message data.",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Controls the media file timeline currently playing. {@code: xRTMLTagsVideoskip_function.js}"
		},
		unqueue : {
			modifier : "public",
			arguments : {
				data : {
					type : "Object",
					description : "The xRTML message data containing the media file attributes.",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Removes a media file from queue. {@code: xRTMLTagsVideo\data_files.js}"
		},
		volume : {
			modifier : "public",
			arguments : {
				data : {
					type : {
						properties : {
							volume : {
								modifier : "public",
								type : "Number",
								description : "The value of the volume to be set."
							}
						}
					},
					description : "The xRTML message data",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Controls the volume of the media file currently being played. {@code: xRTMLTagsVideo\volume_function.js}"
		}
	},
	events : {}
	
};
xRTML.Metadata.registerClass(_Video);
var _Broadcast = {
	"extends" : "xRTML.Tags.Tag",
	name : "Broadcast",
	namespace : "xRTML.Tags",
	description : "The Broadcast Tag allows for sending xRTML messages triggered at specific events, configurable by the Dispatcher elements. The Dispatcher provides several ways of defining when to send a message: an interval of time; when a specific event occurs on a DOM Element; or just as soon as it is instantiated. It also allows to specify various means of obtaining the message content, such as: providing a selector to a DOM Element that holds the content; a callback function that returns the message; or just by providing the message in a JSON format. {@code: xRTMLTagsBroadcastcreate_tag.js} {@example: https://github.com/RTWWorld/xrtml-examples/tree/master/tags/broadcast} {@demo: http://www.xrtml.org/demos/broadcast} {@tags: broadcast|tags}",
	properties : {},
	constructors : {
		init : {
			modifier : "public",
			arguments : {
				tagObject : {
					type : {
						properties : {
							id : {
								modifier : "public",
								type : "String",
								description : "Identification of the tag, assigned by the user."
							},
							connections : {
								modifier : "public",
								type : "String",
								description : "[ARRAY]Identification of the tag, assigned by the user. For tags that will send messages."
							},
							channelId : {
								modifier : "public",
								type : "String",
								description : "Channel through which xRTML messages will be sent by this tag."
							},
							triggers : {
								modifier : "public",
								type : "String",
								description : "[ARRAY]Array of triggers that will prompt the tag to take action."
							},
							receiveOwnMessages : {
								modifier : "public",
								type : "Boolean",
								description : "Indicates the reception of the xRTML messages sent by the tag itself. {@default false}"
							},
							target : {
								modifier : "public",
								type : "String",
								description : "The selector to find the target HTMLElement for this tag. The first position found will be used."
							},
							active : {
								modifier : "public",
								type : "Boolean",
								description : "Identifies if the tag is enabled to send and receive xRTML messages. {@default true}"
							},
							onPreInit : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the preInit event."
							},
							onPostInit : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the postInit event."
							},
							onActive : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the active event."
							},
							onPreProcess : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the preProcess event."
							},
							onPostProcess : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the postProcess event."
							},
							onDispose : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the dispose event"
							}
						}
					},
					description : "Configuration of the tag.",
					mandatory : false
				}
			},
			"return" : "",
			exceptions : [],
			description : "Initializes a tag by setting it attributes."
		}
	},
	methods : {},
	events : {}
	
};
xRTML.Metadata.registerClass(_Broadcast);

var _Execute = {
	"extends" : "xRTML.Tags.Tag",
	name : "Execute",
	namespace : "xRTML.Tags",
	description : "The Execute Tag allows for configuring custom functions to be triggered by the arrival of xRTML messages. This is a very simple Tag that only has this specific responsibility and exists only for allowing developers to take advantage of the core Tag handling mechanisms. {@code: xRTMLTagsExecutecreate_tag.js} {@example: https://github.com/RTWWorld/xrtml-examples/tree/master/tags/execute} {@tutorial: http://www.xrtml.org/tutorials/execute.html} {@demo: http://www.xrtml.org/demos/broadcast} {@tags: execute|tags}",
	properties : {
		callback : {
			modifier : "",
			type : "Function",
			description : "The function called each time the tag receives a message."
		}
	},
	constructors : {
		init : {
			modifier : "public",
			arguments : {
				tagObject : {
					type : {
						properties : {
							id : {
								modifier : "public",
								type : "String",
								description : "Identification of the tag, assigned by the user."
							},
							connections : {
								modifier : "public",
								type : "String",
								description : "[ARRAY]Identification of the tag, assigned by the user. For tags that will send messages."
							},
							channelId : {
								modifier : "public",
								type : "String",
								description : "Channel through which xRTML messages will be sent by this tag."
							},
							triggers : {
								modifier : "public",
								type : "String",
								description : "[ARRAY]Array of triggers that will prompt the tag to take action."
							},
							receiveOwnMessages : {
								modifier : "public",
								type : "Boolean",
								description : "Indicates the reception of the xRTML messages sent by the tag itself. {@default false}"
							},
							target : {
								modifier : "public",
								type : "String",
								description : "The selector to find the target HTMLElement for this tag. The first position found will be used."
							},
							active : {
								modifier : "public",
								type : "Boolean",
								description : "Identifies if the tag is enabled to send and receive xRTML messages. {@default true}"
							},
							onPreInit : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the preInit event."
							},
							onPostInit : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the postInit event."
							},
							onActive : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the active event."
							},
							onPreProcess : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the preProcess event."
							},
							onPostProcess : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the postProcess event."
							},
							onDispose : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the dispose event."
							},
							callback : {
								modifier : "public",
								type : "Function",
								description : "The function called each time the tag receives a message."
							}
						}
					},
					description : "Configuration of the tag.",
					mandatory : false
				}
			},
			"return" : "",
			exceptions : [],
			description : "Initializes a tag by setting it attributes."
		}
	},
	methods : {
		process : {
			modifier : "public",
			arguments : {
				data : {
					type : {
						properties : {
							callback : {
								modifier : "public",
								type : "String",
								description : "Name of the function to be called by this action."
							}
						}
					},
					description : "The xRTML message data.",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "Ensures the proper function delegation. Works as an entry-point method whenever an assigned trigger is raised."
		}
	},
	events : {}
	
};
xRTML.Metadata.registerClass(_Execute);
var _Placeholder = {
	"extends" : "xRTML.Tags.Tag",
	name : "Placeholder",
	namespace : "xRTML.Tags",
	description : "The Placeholder Tag allows to place content from a Realtime message into a DOM element specified in the tag configuration. Content will be placed according to a KnockoutJS (http://knockoutjs.com/) template using the data from the messages. {@code: xRTMLTagsPlaceholdercreate_tag.js} {@example: https://github.com/RTWWorld/xrtml-examples/tree/master/tags/placeholder} {@tutorial: http://www.xrtml.org/tutorials/placeholder.html} {@demo: http://www.xrtml.org/demos/placeholder} {@tags: palceholder|tags}",
	properties : {
		initialData : {
			modifier : "public",
			type : "Object",
			description : "Initial data to be inserted in the creation of the tag."
		},
		template : {
			modifier : "public",
			type : "String",
			description : "Structure that represents the way the xRTML message should be displayed in the DOM."
		}
	},
	constructors : {
		init : {
			modifier : "public",
			arguments : {
				tagObject : {
					type : {
						properties : {
							id : {
								modifier : "public",
								type : "String",
								description : "Identification of the tag, assigned by the user."
							},
							connections : {
								modifier : "public",
								type : "String",
								description : "[ARRAY]Identification of the tag, assigned by the user. For tags that will send messages."
							},
							channelId : {
								modifier : "public",
								type : "String",
								description : "Channel through which xRTML messages will be sent by this tag."
							},
							triggers : {
								modifier : "public",
								type : "String",
								description : "[ARRAY]Array of triggers that will prompt the tag to take action."
							},
							receiveOwnMessages : {
								modifier : "public",
								type : "Boolean",
								description : "Indicates the reception of the xRTML messages sent by the tag itself. {@default false}"
							},
							target : {
								modifier : "public",
								type : "String",
								description : "The selector to find the target HTMLElement for this tag. The first position found will be used."
							},
							active : {
								modifier : "public",
								type : "Boolean",
								description : "Identifies if the tag is enabled to send and receive xRTML messages. {@default true}"
							},
							onPreInit : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the preInit event."
							},
							onPostInit : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the postInit event."
							},
							onActive : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the active event."
							},
							onPreProcess : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the preProcess event."
							},
							onPostProcess : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the postProcess event."
							},
							onDispose : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the dispose event."
							},
							template : {
								modifier : "public",
								type : "String",
								description : "Structure that represents the way the xRTML message should be displayed in the DOM. {@default BODY}"
							},
							initialData : {
								modifier : "public",
								type : "Object",
								description : "Initial data to be inserted in the creation of the tag."
							}
						}
					},
					description : "Configuration of the tag.",
					mandatory : false
				}
			},
			"return" : "",
			exceptions : [],
			description : "Initializes a tag by setting it attributes."
		}
	},
	methods : {
		insert : {
			modifier : "public",
			arguments : {
				data : {
					type : "Object",
					description : "The xRTML message data with the values that will compose/fill the template. Refer to current tag's template to find out about this object's structure.",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Attaches the content from xRTML Message in the targeted DOM object."
		}
	},
	events : {}
	
};
xRTML.Metadata.registerClass(_Placeholder);




var _Media = {
	"extends" : "xRTML.Tags.Tag",
	name : "Media",
	namespace : "xRTML.Tags",
	description : "[ABSTRACT]The Media Tag is an Abstract Tag that should not be used directly. It serves the purpose of providing functionality for handling media files such as audio and video, that other tags extending Media can use. {@tags: media|tags}",
	properties : {
		autoPlay : {
			modifier : "",
			type : "Boolean",
			description : "Tells whether the media file should start playing as soon as it is loaded. {@default true}"
		},
		controlsBar : {
			modifier : "",
			type : "Boolean",
			description : "Toggles the display of the media player native control menu. {@default false}"
		},
		height : {
			modifier : "",
			type : "Number",
			description : "The height to apply in the media content. {@default null}"
		},
		loadStatus : {
			modifier : "",
			type : "Boolean",
			description : "The loading status of the media content."
		},
		loop : {
			modifier : "",
			type : "Boolean",
			description : "Tells whether the media file should repeat after its finishes playing. {@default true}"
		},
		muted : {
			modifier : "",
			type : "Boolean",
			description : "Toggles the media file sound. {@default false}"
		},
		players : {
			modifier : "",
			type : "Object",
			description : "The object containing the players available."
		},
		sources : {
			modifier : "",
			type : "Object",
			description : "The object that controls the media content."
		},
		target : {
			modifier : "",
			type : "Object",
			description : "[ARRAY]The HTML element where the media content will be displayed. {@default BODY}"
		},
		width : {
			modifier : "",
			type : "Number",
			description : "The width to apply in the media content. {@default null}"
		}
	},
	constructors : {
		init : {
			modifier : "public",
			arguments : {
				tagObject : {
					type : {
						properties : {
							id : {
								modifier : "public",
								type : "String",
								description : "Identification of the tag, assigned by the user."
							},
							connections : {
								modifier : "public",
								type : "String",
								description : "[ARRAY]Identification of the tag, assigned by the user. For tags that will send messages."
							},
							channelId : {
								modifier : "public",
								type : "String",
								description : "Channel through which xRTML messages will be sent by this tag."
							},
							triggers : {
								modifier : "public",
								type : "String",
								description : "[ARRAY]Array of triggers that will prompt the tag to take action."
							},
							receiveOwnMessages : {
								modifier : "public",
								type : "Boolean",
								description : "Indicates the reception of the xRTML messages sent by the tag itself. {@default false}"
							},
							target : {
								modifier : "public",
								type : "String",
								description : "The selector to find the target HTMLElement for this tag. The first position found will be used. {@default BODY}"
							},
							active : {
								modifier : "public",
								type : "Boolean",
								description : "Identifies if the tag is enabled to send and receive xRTML messages. {@default true}"
							},
							onPreInit : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the preInit event."
							},
							onPostInit : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the postInit event."
							},
							onActive : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the active event."
							},
							onPreProcess : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the preProcess event."
							},
							onPostProcess : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the postProcess event."
							},
							onDispose : {
								modifier : "public",
								type : "Function",
								description : "Event handler for the dispose event."
							},
							width : {
								modifier : "public",
								type : "Number",
								description : "The width to apply to the media content."
							},
							height : {
								modifier : "public",
								type : "Number",
								description : "The height to apply to the media content."
							},
							autoPlay : {
								modifier : "public",
								type : "Boolean",
								description : "Tells whether the media file should start playing as soon as it is loaded. {@default true}"
							},
							loop : {
								modifier : "public",
								type : "Boolean",
								description : "Tells whether the media file should repeat after its finishes playing. {@default true}"
							},
							controlsBar : {
								modifier : "public",
								type : "Boolean",
								description : "Toggles the display of the media player native control menu. {@default false}"
							},
							muted : {
								modifier : "public",
								type : "Boolean",
								description : "Toggles the media file sound. {@default false}"
							}
						}
					},
					description : "Configuration of the tag.",
					mandatory : false
				}
			},
			"return" : "",
			exceptions : [],
			description : "Initializes a tag by setting it attributes."
		}
	},
	methods : {
		isPlaying : {
			modifier : "public",
			arguments : {},
			"return" : undefined,
			exceptions : [],
			description : "Checks if some sort of media contents is being played back."
		},
		mute : {
			modifier : "public",
			arguments : {},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Mutes media file volume currently playing."
		},
		next : {
			modifier : "public",
			arguments : {},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Plays the next a media file in queue."
		},
		pause : {
			modifier : "public",
			arguments : {},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Pauses the media file currently playing."
		},
		play : {
			modifier : "public",
			arguments : {
				data : {
					type : {
						properties : {
							files : {
								modifier : "public",
								type : "Object",
								description : "The different kinds of formats for the same media file."
							},
							autoPlay : {
								modifier : "public",
								type : "Boolean",
								description : "Tells if the media file starts playing when queued."
							},
							loop : {
								modifier : "public",
								type : "Boolean",
								description : "Tells if media repeats after finishing."
							}
						}
					},
					description : "The xRTML data representing the media file to be played. In case it's not specified it will play the next file in queue.",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Plays a media file. The file to be played might be contained in the xRTML Message or in the players' queue."
		},
		previous : {
			modifier : "public",
			arguments : {},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Plays the previous a media file in queue."
		},
		queue : {
			modifier : "public",
			arguments : {
				data : {
					type : "Object",
					description : "The xRTML message data containing the media file attributes.",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Places a media file in queue."
		},
		restart : {
			modifier : "public",
			arguments : {},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Restarts the media file currently playing."
		},
		skip : {
			modifier : "public",
			arguments : {
				data : {
					type : {
						properties : {
							skip : {
								modifier : "public",
								type : "Number",
								description : "The value, in miliseconds, where the playback will be set in the timeline."
							}
						}
					},
					description : "The xRTML message data.",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Controls the media file timeline currently playing."
		},
		stop : {
			modifier : "public",
			arguments : {},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Stops the media file currently playing."
		},
		time : {
			modifier : "public",
			arguments : {},
			"return" : undefined,
			exceptions : [],
			description : "Returns the file duration and current playback time"
		},
		unqueue : {
			modifier : "public",
			arguments : {
				data : {
					type : "Object",
					description : "The xRTML message data containing the media file attributes.",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Removes a media file from queue."
		},
		volume : {
			modifier : "public",
			arguments : {
				data : {
					type : {
						properties : {
							volume : {
								modifier : "public",
								type : "Number",
								description : "The value of the volume to be set."
							}
						}
					},
					description : "The xRTML message data",
					mandatory : false
				}
			},
			"return" : undefined,
			exceptions : [],
			description : "[ACTION]Controls the volume of the media file currently being played."
		}
	},
	events : {}
	
};
xRTML.Metadata.registerClass(_Media);
(function (window) {
	(function (xRTMLVersions, undefined) {
		xRTMLVersions[xRTML.version] ? xRTML = xRTMLVersions[xRTML.version] : xRTMLVersions[xRTML.version] = xRTML;
		xRTMLVersions.current = xRTMLVersions.current || xRTML.version;
		xRTML = xRTMLVersions[xRTMLVersions.current]
	})(window.xRTMLVersions = window.xRTMLVersions || {})
})(window);
