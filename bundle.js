(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var trailingNewlineRegex = /\n[\s]+$/
var leadingNewlineRegex = /^\n[\s]+/
var trailingSpaceRegex = /[\s]+$/
var leadingSpaceRegex = /^[\s]+/
var multiSpaceRegex = /[\n\s]+/g

var TEXT_TAGS = [
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'data', 'dfn', 'em', 'i',
  'kbd', 'mark', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'amp', 'small', 'span',
  'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'
]

var VERBATIM_TAGS = [
  'code', 'pre', 'textarea'
]

module.exports = function appendChild (el, childs) {
  if (!Array.isArray(childs)) return

  var nodeName = el.nodeName.toLowerCase()

  var hadText = false
  var value, leader

  for (var i = 0, len = childs.length; i < len; i++) {
    var node = childs[i]
    if (Array.isArray(node)) {
      appendChild(el, node)
      continue
    }

    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      typeof node === 'function' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }

    var lastChild = el.childNodes[el.childNodes.length - 1]

    // Iterate over text nodes
    if (typeof node === 'string') {
      hadText = true

      // If we already had text, append to the existing text
      if (lastChild && lastChild.nodeName === '#text') {
        lastChild.nodeValue += node

      // We didn't have a text node yet, create one
      } else {
        node = document.createTextNode(node)
        el.appendChild(node)
        lastChild = node
      }

      // If this is the last of the child nodes, make sure we close it out
      // right
      if (i === len - 1) {
        hadText = false
        // Trim the child text nodes if the current node isn't a
        // node where whitespace matters.
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          // The very first node in the list should not have leading
          // whitespace. Sibling text nodes should have whitespace if there
          // was any.
          leader = i === 0 ? '' : ' '
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, leader)
            .replace(leadingSpaceRegex, ' ')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

    // Iterate over DOM nodes
    } else if (node && node.nodeType) {
      // If the last node was a text node, make sure it is properly closed out
      if (hadText) {
        hadText = false

        // Trim the child text nodes if the current node isn't a
        // text node or a code node
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')

          // Remove empty text nodes, append otherwise
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        // Trim the child nodes if the current node is not a node
        // where all whitespace must be preserved
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingSpaceRegex, ' ')
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

      // Store the last nodename
      var _nodeName = node.nodeName
      if (_nodeName) nodeName = _nodeName.toLowerCase()

      // Append the node to the DOM
      el.appendChild(node)
    }
  }
}

},{}],2:[function(require,module,exports){
var hyperx = require('hyperx')
var appendChild = require('./appendChild')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = [
  'autofocus', 'checked', 'defaultchecked', 'disabled', 'formnovalidate',
  'indeterminate', 'readonly', 'required', 'selected', 'willvalidate'
]

var COMMENT_TAG = '!--'

var SVG_TAGS = [
  'svg', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
  'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood',
  'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage',
  'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
  'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter',
  'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
  'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image',
  'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph',
  'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS.indexOf(key) !== -1) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  appendChild(el, children)
  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"./appendChild":1,"hyperx":23}],3:[function(require,module,exports){
(function (global){(function (){
'use strict';

var csjs = require('csjs');
var insertCss = require('insert-css');

function csjsInserter() {
  var args = Array.prototype.slice.call(arguments);
  var result = csjs.apply(null, args);
  if (global.document) {
    insertCss(csjs.getCss(result));
  }
  return result;
}

module.exports = csjsInserter;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"csjs":8,"insert-css":24}],4:[function(require,module,exports){
'use strict';

module.exports = require('csjs/get-css');

},{"csjs/get-css":7}],5:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs;
module.exports.csjs = csjs;
module.exports.getCss = require('./get-css');

},{"./csjs":3,"./get-css":4}],6:[function(require,module,exports){
'use strict';

module.exports = require('./lib/csjs');

},{"./lib/csjs":12}],7:[function(require,module,exports){
'use strict';

module.exports = require('./lib/get-css');

},{"./lib/get-css":16}],8:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs();
module.exports.csjs = csjs;
module.exports.noScope = csjs({ noscope: true });
module.exports.getCss = require('./get-css');

},{"./csjs":6,"./get-css":7}],9:[function(require,module,exports){
'use strict';

/**
 * base62 encode implementation based on base62 module:
 * https://github.com/andrew/base62.js
 */

var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = function encode(integer) {
  if (integer === 0) {
    return '0';
  }
  var str = '';
  while (integer > 0) {
    str = CHARS[integer % 62] + str;
    integer = Math.floor(integer / 62);
  }
  return str;
};

},{}],10:[function(require,module,exports){
'use strict';

var makeComposition = require('./composition').makeComposition;

module.exports = function createExports(classes, keyframes, compositions) {
  var keyframesObj = Object.keys(keyframes).reduce(function(acc, key) {
    var val = keyframes[key];
    acc[val] = makeComposition([key], [val], true);
    return acc;
  }, {});

  var exports = Object.keys(classes).reduce(function(acc, key) {
    var val = classes[key];
    var composition = compositions[key];
    var extended = composition ? getClassChain(composition) : [];
    var allClasses = [key].concat(extended);
    var unscoped = allClasses.map(function(name) {
      return classes[name] ? classes[name] : name;
    });
    acc[val] = makeComposition(allClasses, unscoped);
    return acc;
  }, keyframesObj);

  return exports;
}

function getClassChain(obj) {
  var visited = {}, acc = [];

  function traverse(obj) {
    return Object.keys(obj).forEach(function(key) {
      if (!visited[key]) {
        visited[key] = true;
        acc.push(key);
        traverse(obj[key]);
      }
    });
  }

  traverse(obj);
  return acc;
}

},{"./composition":11}],11:[function(require,module,exports){
'use strict';

module.exports = {
  makeComposition: makeComposition,
  isComposition: isComposition,
  ignoreComposition: ignoreComposition
};

/**
 * Returns an immutable composition object containing the given class names
 * @param  {array} classNames - The input array of class names
 * @return {Composition}      - An immutable object that holds multiple
 *                              representations of the class composition
 */
function makeComposition(classNames, unscoped, isAnimation) {
  var classString = classNames.join(' ');
  return Object.create(Composition.prototype, {
    classNames: { // the original array of class names
      value: Object.freeze(classNames),
      configurable: false,
      writable: false,
      enumerable: true
    },
    unscoped: { // the original array of class names
      value: Object.freeze(unscoped),
      configurable: false,
      writable: false,
      enumerable: true
    },
    className: { // space-separated class string for use in HTML
      value: classString,
      configurable: false,
      writable: false,
      enumerable: true
    },
    selector: { // comma-separated, period-prefixed string for use in CSS
      value: classNames.map(function(name) {
        return isAnimation ? name : '.' + name;
      }).join(', '),
      configurable: false,
      writable: false,
      enumerable: true
    },
    toString: { // toString() method, returns class string for use in HTML
      value: function() {
        return classString;
      },
      configurable: false,
      writeable: false,
      enumerable: false
    }
  });
}

/**
 * Returns whether the input value is a Composition
 * @param value      - value to check
 * @return {boolean} - whether value is a Composition or not
 */
function isComposition(value) {
  return value instanceof Composition;
}

function ignoreComposition(values) {
  return values.reduce(function(acc, val) {
    if (isComposition(val)) {
      val.classNames.forEach(function(name, i) {
        acc[name] = val.unscoped[i];
      });
    }
    return acc;
  }, {});
}

/**
 * Private constructor for use in `instanceof` checks
 */
function Composition() {}

},{}],12:[function(require,module,exports){
'use strict';

var extractExtends = require('./css-extract-extends');
var composition = require('./composition');
var isComposition = composition.isComposition;
var ignoreComposition = composition.ignoreComposition;
var buildExports = require('./build-exports');
var scopify = require('./scopeify');
var cssKey = require('./css-key');
var extractExports = require('./extract-exports');

module.exports = function csjsTemplate(opts) {
  opts = (typeof opts === 'undefined') ? {} : opts;
  var noscope = (typeof opts.noscope === 'undefined') ? false : opts.noscope;

  return function csjsHandler(strings, values) {
    // Fast path to prevent arguments deopt
    var values = Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++) {
      values[i - 1] = arguments[i];
    }
    var css = joiner(strings, values.map(selectorize));
    var ignores = ignoreComposition(values);

    var scope = noscope ? extractExports(css) : scopify(css, ignores);
    var extracted = extractExtends(scope.css);
    var localClasses = without(scope.classes, ignores);
    var localKeyframes = without(scope.keyframes, ignores);
    var compositions = extracted.compositions;

    var exports = buildExports(localClasses, localKeyframes, compositions);

    return Object.defineProperty(exports, cssKey, {
      enumerable: false,
      configurable: false,
      writeable: false,
      value: extracted.css
    });
  }
}

/**
 * Replaces class compositions with comma seperated class selectors
 * @param  value - the potential class composition
 * @return       - the original value or the selectorized class composition
 */
function selectorize(value) {
  return isComposition(value) ? value.selector : value;
}

/**
 * Joins template string literals and values
 * @param  {array} strings - array of strings
 * @param  {array} values  - array of values
 * @return {string}        - strings and values joined
 */
function joiner(strings, values) {
  return strings.map(function(str, i) {
    return (i !== values.length) ? str + values[i] : str;
  }).join('');
}

/**
 * Returns first object without keys of second
 * @param  {object} obj      - source object
 * @param  {object} unwanted - object with unwanted keys
 * @return {object}          - first object without unwanted keys
 */
function without(obj, unwanted) {
  return Object.keys(obj).reduce(function(acc, key) {
    if (!unwanted[key]) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

},{"./build-exports":10,"./composition":11,"./css-extract-extends":13,"./css-key":14,"./extract-exports":15,"./scopeify":21}],13:[function(require,module,exports){
'use strict';

var makeComposition = require('./composition').makeComposition;

var regex = /\.([^\s]+)(\s+)(extends\s+)(\.[^{]+)/g;

module.exports = function extractExtends(css) {
  var found, matches = [];
  while (found = regex.exec(css)) {
    matches.unshift(found);
  }

  function extractCompositions(acc, match) {
    var extendee = getClassName(match[1]);
    var keyword = match[3];
    var extended = match[4];

    // remove from output css
    var index = match.index + match[1].length + match[2].length;
    var len = keyword.length + extended.length;
    acc.css = acc.css.slice(0, index) + " " + acc.css.slice(index + len + 1);

    var extendedClasses = splitter(extended);

    extendedClasses.forEach(function(className) {
      if (!acc.compositions[extendee]) {
        acc.compositions[extendee] = {};
      }
      if (!acc.compositions[className]) {
        acc.compositions[className] = {};
      }
      acc.compositions[extendee][className] = acc.compositions[className];
    });
    return acc;
  }

  return matches.reduce(extractCompositions, {
    css: css,
    compositions: {}
  });

};

function splitter(match) {
  return match.split(',').map(getClassName);
}

function getClassName(str) {
  var trimmed = str.trim();
  return trimmed[0] === '.' ? trimmed.substr(1) : trimmed;
}

},{"./composition":11}],14:[function(require,module,exports){
'use strict';

/**
 * CSS identifiers with whitespace are invalid
 * Hence this key will not cause a collision
 */

module.exports = ' css ';

},{}],15:[function(require,module,exports){
'use strict';

var regex = require('./regex');
var classRegex = regex.classRegex;
var keyframesRegex = regex.keyframesRegex;

module.exports = extractExports;

function extractExports(css) {
  return {
    css: css,
    keyframes: getExport(css, keyframesRegex),
    classes: getExport(css, classRegex)
  };
}

function getExport(css, regex) {
  var prop = {};
  var match;
  while((match = regex.exec(css)) !== null) {
    var name = match[2];
    prop[name] = name;
  }
  return prop;
}

},{"./regex":18}],16:[function(require,module,exports){
'use strict';

var cssKey = require('./css-key');

module.exports = function getCss(csjs) {
  return csjs[cssKey];
};

},{"./css-key":14}],17:[function(require,module,exports){
'use strict';

/**
 * djb2 string hash implementation based on string-hash module:
 * https://github.com/darkskyapp/string-hash
 */

module.exports = function hashStr(str) {
  var hash = 5381;
  var i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return hash >>> 0;
};

},{}],18:[function(require,module,exports){
'use strict';

var findClasses = /(\.)(?!\d)([^\s\.,{\[>+~#:)]*)(?![^{]*})/.source;
var findKeyframes = /(@\S*keyframes\s*)([^{\s]*)/.source;
var ignoreComments = /(?!(?:[^*/]|\*[^/]|\/[^*])*\*+\/)/.source;

var classRegex = new RegExp(findClasses + ignoreComments, 'g');
var keyframesRegex = new RegExp(findKeyframes + ignoreComments, 'g');

module.exports = {
  classRegex: classRegex,
  keyframesRegex: keyframesRegex,
  ignoreComments: ignoreComments,
};

},{}],19:[function(require,module,exports){
var ignoreComments = require('./regex').ignoreComments;

module.exports = replaceAnimations;

function replaceAnimations(result) {
  var animations = Object.keys(result.keyframes).reduce(function(acc, key) {
    acc[result.keyframes[key]] = key;
    return acc;
  }, {});
  var unscoped = Object.keys(animations);

  if (unscoped.length) {
    var regexStr = '((?:animation|animation-name)\\s*:[^};]*)('
      + unscoped.join('|') + ')([;\\s])' + ignoreComments;
    var regex = new RegExp(regexStr, 'g');

    var replaced = result.css.replace(regex, function(match, preamble, name, ending) {
      return preamble + animations[name] + ending;
    });

    return {
      css: replaced,
      keyframes: result.keyframes,
      classes: result.classes
    }
  }

  return result;
}

},{"./regex":18}],20:[function(require,module,exports){
'use strict';

var encode = require('./base62-encode');
var hash = require('./hash-string');

module.exports = function fileScoper(fileSrc) {
  var suffix = encode(hash(fileSrc));

  return function scopedName(name) {
    return name + '_' + suffix;
  }
};

},{"./base62-encode":9,"./hash-string":17}],21:[function(require,module,exports){
'use strict';

var fileScoper = require('./scoped-name');
var replaceAnimations = require('./replace-animations');
var regex = require('./regex');
var classRegex = regex.classRegex;
var keyframesRegex = regex.keyframesRegex;

module.exports = scopify;

function scopify(css, ignores) {
  var makeScopedName = fileScoper(css);
  var replacers = {
    classes: classRegex,
    keyframes: keyframesRegex
  };

  function scopeCss(result, key) {
    var replacer = replacers[key];
    function replaceFn(fullMatch, prefix, name) {
      var scopedName = ignores[name] ? name : makeScopedName(name);
      result[key][scopedName] = name;
      return prefix + scopedName;
    }
    return {
      css: result.css.replace(replacer, replaceFn),
      keyframes: result.keyframes,
      classes: result.classes
    };
  }

  var result = Object.keys(replacers).reduce(scopeCss, {
    css: css,
    keyframes: {},
    classes: {}
  });

  return replaceAnimations(result);
}

},{"./regex":18,"./replace-animations":19,"./scoped-name":20}],22:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],23:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ])
            reg = ''
          } else {
            p.push([ OPEN, arg ])
          }
        } else if (xstate === COMMENT && opts.comments) {
          reg += String(arg)
        } else if (xstate !== COMMENT) {
          p.push([ VAR, xstate, arg ])
        }
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      if (opts.createFragment) return opts.createFragment(tree[2])
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg])
          }
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else if (x === null || x === undefined) return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":22}],24:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],25:[function(require,module,exports){
const bel = require('bel')
const csjs = require('csjs-inject')
const footer = require('footer')()
const start_page = require('start_page')()
const about_page = require('about')()
const proposals_page = require('proposals')()
const projects_page = require('projects')()

module.exports = page

function page () {

  // -------------------HTML ELEMENTS -------------------
  const about_btn = bel`<div class=${css.nav__link} onclick=${(e) => handle_click(e)}>About</div>`
  const proposals_btn = bel`<div class=${css.nav__link} onclick=${(e) => handle_click(e)}>Proposals</div>`
  const projects_btn = bel`<div class=${css.nav__link} onclick=${(e) => handle_click(e)}>Projects</div>`
  
  const nav = bel`
    <nav role="navigation">
      <img 
        onclick=${(e) => handle_click(e)}  
        class=${css.logo} 
        src="assets/imgs/Logo.png" 
        alt="Shokunin home" 
      />
      <div class=${css.nav__links}>
        ${about_btn}
        ${proposals_btn}
        ${projects_btn}
      </div>
    </nav>
  `

  const page_body = bel`<div>${start_page}</div>`
  
  const el = bel` 
    <div class="${css.container}">
      ${nav}
      ${page_body}
      ${footer}
    </div>
  `

  // -------------------JS LOGIC -------------------
  function handle_click (event) {
    // console.log('New click', event.target)
    const btn = event.target.innerText
    let new_page
    if (btn === 'About') new_page = about_page
    else if (btn === 'Proposals') new_page = proposals_page
    else if (btn === 'Projects') new_page = projects_page
    else if (event.target.alt === 'Shokunin home') new_page = start_page
    page_body.innerHTML = ''
    page_body.appendChild(new_page)
  }

  // -------------------RETURN ELEMENT -------------------
  return el
  
}

const css = csjs`
  :root {
    --bgColor: #110042;
    --textColor: #fff;
    --secondary: #C931FF;
    --transition: all ease 0.5s;
    --linkLineHeight: 31px;
    --linkSize: 25px;
    --nav__linksGAP: 32px;
    --btn-p: 18px 67px;
  }
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-family: 'Space Grotesk';
  }
  body {
    background-color: var(--bgColor);
  }
  .container {
    max-width: 1512px;
    margin: 0 auto;
  }
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 72px;
  }
  .nav__links {
    display: flex;
    flex-direction: row;
    gap: var(--nav__linksGAP);
  }
  .nav__links a:hover, .nav__link:hover {
    cursor: pointer;
    color: var(--secondary);
    transition: var(--transition);
  }
  .nav__link {
    font-style: normal;
    font-weight: 500;
    font-size: var(--linkSize);
    line-height: var(--linkLineHeight);
    color: var(--textColor);
    text-decoration: none;
  }
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--secondary);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #6c3181;
  }
  @media screen and (max-width: 1440px) {
    :root {
        --linkSize: 18px;
        --btn-p: 15px 57px;
    }
    .logo {
        width: 165px;
    }
    nav {
        padding: 16px 72px;
    }
  }
  @media screen and (max-width: 768px) {
    :root {
        --linkSize: 18px;
        --linkLineHeight: 31px;
        --btn-p: 10px 57px;
    }
    nav {
        flex-direction: column;
    }
  }
`

document.body.append(page())
},{"about":26,"bel":2,"csjs-inject":5,"footer":27,"projects":29,"proposals":30,"start_page":31}],26:[function(require,module,exports){
const bel = require('bel')
const csjs = require('csjs-inject')

module.exports = about

function about () {

  const el = bel`  
  <div class="${css.container}">
    <div class="${css.about} ${css.imgBg}">
      <h1>About</h1>
    </div>
    <div class="${css.imgBg}">
      <div>
        <h2>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </h2>

        <p class="${css['text--md']} ${css.mt}">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
      <a chref="/" class="${css.btn} ${css['btn--primary']}">Join Discord</a>
    </div>
</div>
  `
  return el
}


const css = csjs`
:root {
  --bgColor: #110042;
  --textColor: #fff;
  --secondary: #C931FF;

  --transition: all ease 0.5s;

  --linkLineHeight: 31px;
  --h1LineHeight: 100px;
  --h2LineHeight: 61px;
  --btnSize: 24px;

  --linkSize: 25px;
  --h1Size: 96px;
  --h2Size: 48px;

  --font500: 500;
  --font700: 700;
  --fontStyletNormal: normal;

  --nav__linksGAP: 32px;

  --btn-maxW: 315px;
  --btn-p: 18px 67px;
}
.container {
  max-width: 1512px;
  margin: 0 auto;
}
.about {
  background-image: url(assets/imgs/About.png);
}
.imgBg {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: auto;
  min-height: 700px;
  padding: 80px 72px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
h1 {
  font-style: var(--fontStyletNormal);
  font-weight: var(--font700);
  font-size: var(--h1Size);
  line-height: var(--h1LineHeight);
  color: var(--textColor);
  text-transform: uppercase;
  max-width: 695px;
}
h2 {
  font-style: var(--fontStyletNormal);
  font-weight: var(--font500);
  font-size: var(--h2Size);
  line-height: var(--h2LineHeight);
  max-width: 1120px;
  color: var(--textColor);
}
.text--md {
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 31px;
  color: #FFFFFF;
}
.mt {
  margin-top: 32px;
}
.btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: var(--btn-p);
  gap: 10px;

  border-radius: 12px;

  width: fit-content;
  min-width: var(--btn-maxW);
  font-style: var(--fontStyletNormal);
  font-weight: var(--font500);
  font-size: var(--btnSize);
  line-height: 31px;
  /* identical to box height */

  text-align: center;
  border: 3px solid transparent;
}
.btn--primary {
  background: #C931FF;
  color: #FFFFFF;
}
.btn:hover,
.btn--outline:hover {
  cursor: pointer;
  background-color: var(--textColor);
  color: var(--secondary);
  transition: var(--transition);

}

@media screen and (max-width: 1440px) {
  :root {
      --btnSize: 18px;
      --linkSize: 18px;
      --h1Size: 72px;
      --h2Size: 32px;

      --linkLineHeight: 31px;
      --h1LineHeight: 72px;
      --h2LineHeight: 61px;

      --btn-maxW: 280px;
      --btn-p: 15px 57px;
  }
}


@media screen and (max-width: 768px) {
  :root {
      --btnSize: 14px;
      --linkSize: 18px;
      --h1Size: 40px;
      --h2Size: 24px;

      --linkLineHeight: 31px;
      --h1LineHeight: 60px;
      --h2LineHeight: 36px;

      --btn-maxW: 100%;
      --btn-p: 10px 57px;

  }
  .text--md {
      margin-bottom: 72px;
  }
}
`
},{"bel":2,"csjs-inject":5}],27:[function(require,module,exports){
const bel = require('bel')
const csjs = require('csjs-inject')

module.exports = footer

function footer () {

  const el = bel`  
    <footer>
      <p class="${css['text--small']}">Shokunin Network 2022 | All Rights Reserved</p>
      <div class=${css.footer__sm}>
        <a href="/">
          <img src="assets/imgs/discord.png" alt="Shokunin discord" />
        </a>
        <a href="/">
          <img src="assets/imgs/twitter.png" alt="Shokunin twitter" />
        </a>
      </div>
    </footer>
  `
  return el
}


const css = csjs`
  :root {
    --transition: all ease 0.5s;
  }
  footer {
    border-top: 1px solid #FFFFFF;
    display: flex;
    justify-content: space-between;
    padding: 32px 72px;
  }
  .text--small {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    color: #FFFFFF;
  }
  .footer__sm {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 32px;
  }
  .footer__sm img {
    width: 40px;
    height: 100%;
  }
  .footer__sm img:hover {
    cursor: pointer;
    opacity: 0.7;
    transition: var(--transition);
  }
  @media screen and (max-width: 768px) {
    footer {
        flex-direction: column;
        gap: 32px;
    }
  }
`
},{"bel":2,"csjs-inject":5}],28:[function(require,module,exports){
const bel = require('bel')
const csjs = require('csjs-inject')

module.exports = projectSingle 

function projectSingle(item) {

    const el = bel`
        <div class='${css.container}'>
            <div class="${css.projectidbg} ${css.imgBg}">
                <h1>
                    ${item.projectName}
                </h1>
            </div>

            <div class="${css.imgBg}">
            <div>
                <h2>
                    ${item.contentTitle}
                </h2>

                <div class="${css.projectimgs}">
                    ${item.projectImages.map(img => bel`<img
                            class='${css.projectid}'
                            src="${img}"
                            alt=""
                        />` 
                    )}
                </div>

                <p class="${css.textmd} ${css.mt} ${css.mb}">
                    ${item.content}
                </p>
            </div>
            <a target='_blank' href="${item.projectURL}" class="${css.btn} ${css.btnprimary}">Open Project</a>
            </div>
        </div>
    `

    return el 
}


const css = csjs`
:root {
  --bgColor: #110042;
  --textColor: #fff;
  --secondary: #C931FF;
  --transition: all ease 0.5s;
  --linkLineHeight: 31px;
  --h1LineHeight: 100px;
  --h2LineHeight: 61px;
  --btnSize: 24px;
  --linkSize: 25px;
  --h1Size: 96px;
  --h2Size: 48px;
  --font500: 500;
  --font700: 700;
  --fontStyletNormal: normal;
  --nav__linksGAP: 32px;
  --btn-maxW: 315px;
  --btn-p: 18px 67px;
}
.container {
  max-width: 1512px;
  margin: 0 auto;
}
.projectidbg {
  background-image: url(assets/imgs/individualProject.png);
}
.imgBg {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: auto;
  min-height: 700px;
  padding: 80px 72px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
h1 {
  font-style: var(--fontStyletNormal);
  font-weight: var(--font700);
  font-size: var(--h1Size);
  line-height: var(--h1LineHeight);
  color: var(--textColor);
  text-transform: uppercase;
  max-width: 695px;
}
h2 {
  font-style: var(--fontStyletNormal);
  font-weight: var(--font500);
  font-size: var(--h2Size);
  line-height: var(--h2LineHeight);
  max-width: 1120px;
  color: var(--textColor);
}
.project-imgs, .projectimgs  {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 30px;
  margin: 64px 0;
}
.project-id, .projectid  {
  width: 100%;
  height: auto;
}
.textmd {
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 31px;
  color: #FFFFFF;
}
.mt {
  margin-top: 32px;
}
.mb {
  margin-bottom: 32px;
}
.btnprimary {
  background: #C931FF;
  color: #FFFFFF;
}
.btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: var(--btn-p);
  gap: 10px;
  border-radius: 12px;
  width: fit-content;
  min-width: var(--btn-maxW);
  font-style: var(--fontStyletNormal);
  font-weight: var(--font500);
  font-size: var(--btnSize);
  line-height: 31px;
  /* identical to box height */
  text-align: center;
  border: 3px solid transparent;
}
.btn:hover,
.btn--outline:hover {
  cursor: pointer;
  background-color: var(--textColor);
  color: var(--secondary);
  transition: var(--transition);
}
@media screen and (max-width: 1440px) {
  :root {
      --btnSize: 18px;
      --linkSize: 18px;
      --h1Size: 72px;
      --h2Size: 32px;
      --linkLineHeight: 31px;
      --h1LineHeight: 72px;
      --h2LineHeight: 61px;
      --btn-maxW: 280px;
      --btn-p: 15px 57px;
  }
}
@media screen and (max-width: 768px) {
  :root {
      --btnSize: 14px;
      --linkSize: 18px;
      --h1Size: 40px;
      --h2Size: 24px;
      --linkLineHeight: 31px;
      --h1LineHeight: 60px;
      --h2LineHeight: 36px;
      --btn-maxW: 100%;
      --btn-p: 10px 57px;
  }
  .imgBg--grid,
  .project-imgs, 
  .projectimgs {
      grid-template-columns: 1fr;
  }
  .text--md {
      margin-bottom: 72px;
  }
  .ctas {
      flex-direction: column;
  }
  .text--small {
      text-align: center;
  }
}
`
},{"bel":2,"csjs-inject":5}],29:[function(require,module,exports){
const bel = require('bel')
const csjs = require('csjs-inject')
const singleProject_page = require('./projectSingle')

module.exports = projects

const projectsList = [
  {
    id: 000, 
    projectName: 'Super Awesome Project Name',
    contentTitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    projectMainImg: 'https://via.placeholder.com/445x303',
    projectImages: [
      'https://via.placeholder.com/445x303',
      'https://via.placeholder.com/445x303',
      'https://via.placeholder.com/445x303'
    ],
    projectURL: 'https://google.com'
  },
  {
    id: 001, 
    projectName: 'Super Awesome Project Name 2',
    contentTitle: 'Lorem 2 ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    content: 'Lorem 2 ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    projectMainImg: 'https://via.placeholder.com/445x303',
    
    projectImages: [
      'https://via.placeholder.com/445x303',
      'https://via.placeholder.com/445x303',
      'https://via.placeholder.com/445x303'
    ],
    projectURL: 'https://youtube.com'
  },
  {
    id: 003, 
    projectName: 'Super Awesome Project Name',
    contentTitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    projectMainImg: 'https://via.placeholder.com/445x303',
    
    projectImages: [
      'https://via.placeholder.com/445x303',
      'https://via.placeholder.com/445x303',
      'https://via.placeholder.com/445x303'
    ],
    projectURL: 'https://google.com'
  },
  {
    id: 004, 
    projectName: 'Super Awesome Project Name 2',
    contentTitle: 'Lorem 2 ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    content: 'Lorem 2 ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    projectMainImg: 'https://via.placeholder.com/445x303',
    projectImages: [
      'https://via.placeholder.com/445x303',
      'https://via.placeholder.com/445x303',
      'https://via.placeholder.com/445x303'
    ],
    projectURL: 'https://youtube.com'
  },
  {
    id: 005, 
    projectName: 'Super Awesome Project Name',
    contentTitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    projectMainImg: 'https://via.placeholder.com/445x303',
    projectImages: [
      'https://via.placeholder.com/445x303',
      'https://via.placeholder.com/445x303',
      'https://via.placeholder.com/445x303'
    ],
    projectURL: 'https://google.com'
  },
  {
    id: 006, 
    projectName: 'Super Awesome Project Name 2',
    contentTitle: 'Lorem 2 ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    content: 'Lorem 2 ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    projectMainImg: 'https://via.placeholder.com/445x303',
    projectImages: [
      'https://via.placeholder.com/445x303',
      'https://via.placeholder.com/445x303',
      'https://via.placeholder.com/445x303'
    ],
    projectURL: 'https://youtube.com'
  }
]

function projects () {

  var el = bel`  
    <div class="${css.container}">
      <div class="${css.projects} ${css.imgBg}">
        <h1>
          BROWSE <br />
          SHOKUNIN <br />
          PROJECTS <br />
        </h1>
      </div>
      <div class="${css['imgBg--grid']}">
        ${
          projectsList.map(item => bel`<img onclick=${() => openSingleProject(item)} class="${css['project-id']}" src="${item.projectMainImg}" alt="" />`)
        }
      </div>
    </div>
  `

  function openSingleProject(item){
    el.innerHTML = ''
    el.append(singleProject_page(item))
    return el

  }
  
  return el
}


const css = csjs`
  :root {
    --bgColor: #110042;
    --textColor: #fff;
    --secondary: #C931FF;
    --transition: all ease 0.5s;
    --linkLineHeight: 31px;
    --h1LineHeight: 100px;
    --h2LineHeight: 61px;
    --btnSize: 24px;
    --linkSize: 25px;
    --h1Size: 96px;
    --h2Size: 48px;
    --font500: 500;
    --font700: 700;
    --fontStyletNormal: normal;
    --nav__linksGAP: 32px;
    --btn-maxW: 315px;
    --btn-p: 18px 67px;
  }
  .container {
    max-width: 1512px;
    margin: 0 auto;
  }
  .projects {
    background-image: url(assets/imgs/Projects.png);
  }
  .imgBg {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: auto;
    min-height: 700px;
    padding: 80px 72px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  .imgBg--grid {
    width: 100%;
    height: auto;
    min-height: 700px;
    padding: 80px 72px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 30px;
  }
  h1 {
    font-style: var(--fontStyletNormal);
    font-weight: var(--font700);
    font-size: var(--h1Size);
    line-height: var(--h1LineHeight);
    color: var(--textColor);
    text-transform: uppercase;
    max-width: 695px;
  }
  .project-id {
    width: 100%;
    height: auto;
  }
  .project-id:hover {
    cursor: pointer;
    transform: translateY(-10px);
    transition: var(--transition);
  }
  @media screen and (max-width: 1440px) {
    :root {
        --btnSize: 18px;
        --linkSize: 18px;
        --h1Size: 72px;
        --h2Size: 32px;
        --linkLineHeight: 31px;
        --h1LineHeight: 72px;
        --h2LineHeight: 61px;
        --btn-maxW: 280px;
        --btn-p: 15px 57px;
    }
  }
  @media screen and (max-width: 957px) {
    .imgBg--grid {
        grid-template-columns: 1fr 1fr;

    }
  }
  @media screen and (max-width: 768px) {
    :root {
        --btnSize: 14px;
        --linkSize: 18px;
        --h1Size: 40px;
        --h2Size: 24px;
        --linkLineHeight: 31px;
        --h1LineHeight: 60px;
        --h2LineHeight: 36px;
        --btn-maxW: 100%;
        --btn-p: 10px 57px;
    }
    .imgBg--grid,
    .project-imgs {
        grid-template-columns: 1fr;
    }
  }
`
},{"./projectSingle":28,"bel":2,"csjs-inject":5}],30:[function(require,module,exports){
const bel = require('bel')
const csjs = require('csjs-inject')

module.exports = proposals

function proposals () {

  const el = bel`  
    <div class="${css.container}">
    <div class="${css.proposals} ${css.imgBg}">
      <h1>
        SOMETHING <br />
        ABOUT <br />
        PROPOSALS <br />
        + FORM
      </h1>
    </div>
    <div class="${css.imgBg}">
      <h2>
        Somehing about proposal rules <br />
        and filling out the form
      </h2>
      <div class="${css.ctas}">
        <a href="/" class="${css.btn} ${css['btn--primary']}">Fill Out Form</a>
        <a href="/" class="${css['btn--outline']}">Proposal Rules</a>
        <a href="/" class="${css.icon}">
          <img src="../../assets/imgs/discordPurple.png" alt="" />
        </a>
      </div>
    </div>
  </div>

  `
  return el
}


const css = csjs`
:root {
  --bgColor: #110042;
  --textColor: #fff;
  --secondary: #C931FF;
  --transition: all ease 0.5s;
  --linkLineHeight: 31px;
  --h1LineHeight: 100px;
  --h2LineHeight: 61px;
  --btnSize: 24px;
  --linkSize: 25px;
  --h1Size: 96px;
  --h2Size: 48px;
  --font500: 500;
  --font700: 700;
  --fontStyletNormal: normal;
  --nav__linksGAP: 32px;
  --btn-maxW: 315px;
  --btn-p: 18px 67px;
}
.container {
  max-width: 1512px;
  margin: 0 auto;
}
.proposals {
  background-image: url(assets/imgs/Proposals.png);
}
.imgBg {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: auto;
  min-height: 700px;
  padding: 80px 72px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

h1 {
  font-style: var(--fontStyletNormal);
  font-weight: var(--font700);
  font-size: var(--h1Size);
  line-height: var(--h1LineHeight);
  color: var(--textColor);
  text-transform: uppercase;
  max-width: 695px;
}

h2 {
  font-style: var(--fontStyletNormal);
  font-weight: var(--font500);
  font-size: var(--h2Size);
  line-height: var(--h2LineHeight);
  max-width: 1120px;
  color: var(--textColor);
}

.ctas {
  display: flex;
  flex-direction: row;
  gap: 32px;
  align-items: center;
}

.btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: var(--btn-p);
  gap: 10px;

  border-radius: 12px;

  width: fit-content;
  min-width: var(--btn-maxW);
  font-style: var(--fontStyletNormal);
  font-weight: var(--font500);
  font-size: var(--btnSize);
  line-height: 31px;
  /* identical to box height */

  text-align: center;
  border: 3px solid transparent;

}

.btn--outline {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: var(--btn-p);
  gap: 10px;

  border-radius: 12px;

  width: fit-content;
  min-width: var(--btn-maxW);
  font-style: var(--fontStyletNormal);
  font-weight: var(--font500);
  font-size: var(--btnSize);

  text-align: center;

  border: 3px solid #FFFFFF;

  color: var(--textColor);
}

.btn--primary {
  background: #C931FF;
  color: #FFFFFF;
}

.btn--secondary {
  background: var(--bgColor);
  color: #FFFFFF;
}

.btn:hover,
.btn--outline:hover {
  cursor: pointer;
  background-color: var(--textColor);
  color: var(--secondary);
  transition: var(--transition);
}

.icon:hover {
  cursor: pointer;
  opacity: 0.7;
  transition: var(--transition);
}


a {
  font-style: var(--fontStyletNormal);
  font-weight: var(--font500);
  font-size: var(--linkSize);
  line-height: var(--linkLineHeight);
  color: var(--textColor);
  text-decoration: none;
}

@media screen and (max-width: 1440px) {
  :root {
      --btnSize: 18px;
      --linkSize: 18px;
      --h1Size: 72px;
      --h2Size: 32px;

      --linkLineHeight: 31px;
      --h1LineHeight: 72px;
      --h2LineHeight: 61px;

      --btn-maxW: 280px;
      --btn-p: 15px 57px;

  }

}

@media screen and (max-width: 768px) {
  :root {
      --btnSize: 14px;
      --linkSize: 18px;
      --h1Size: 40px;
      --h2Size: 24px;

      --linkLineHeight: 31px;
      --h1LineHeight: 60px;
      --h2LineHeight: 36px;

      --btn-maxW: 100%;
      --btn-p: 10px 57px;

  }

  .imgBg--grid,
  .project-imgs {
      grid-template-columns: 1fr;
  }

  nav {
      flex-direction: column;
  }

  footer {
      flex-direction: column;
      gap: 32px;
  }

  .ctas {
      flex-direction: column;
  }

}
`
},{"bel":2,"csjs-inject":5}],31:[function(require,module,exports){
const bel = require('bel')
const csjs = require('csjs-inject')

module.exports = start_page

function start_page () {
  const el = bel`
  <div>
    <div class="${css.atf} ${css.imgBg}">
      <h1>
        Funding <br />
        public <br />
        goods of <br />
        the future
      </h1>
      <button class="${css.btn} ${css['btn--primary']}">Documentation</button>
    </div>

    <div class=${css.imgBg}>
      <h2>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </h2>
      <a chref="/" class="${css.btn} ${css['btn--primary']}">About</a>
    </div>

    <div class="${css.hiw} ${css.imgBg}">
      <h1>
        How it <br />
        works
      </h1>

      <a href="/" class="${css.btn} ${css['btn--secondary']}">Submitting Proposals</a>
    </div>

    <div class=${css.imgBg}>
      <h2>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </h2>
      <a chref="/" class="${css.btn} ${css['btn--primary']}">Projects</a>
    </div>
  </div>
  `
  return el
}

const css = csjs`
:root {
  --bgColor: #110042;
  --textColor: #fff;
  --secondary: #C931FF;

  --transition: all ease 0.5s;

  --linkLineHeight: 31px;
  --h1LineHeight: 100px;
  --h2LineHeight: 61px;
  --btnSize: 24px;

  --linkSize: 25px;
  --h1Size: 96px;
  --h2Size: 48px;

  --font500: 500;
  --font700: 700;
  --fontStyletNormal: normal;

  --nav__linksGAP: 32px;

  --btn-maxW: 315px;
  --btn-p: 18px 67px;
}

.container {
  max-width: 1512px;
  margin: 0 auto;
}

.imgBg {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: auto;
  min-height: 700px;
  padding: 80px 72px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}


.atf {
  background-image: url(assets/imgs/Home.png);
}

h1 {
  font-style: var(--fontStyletNormal);
  font-weight: var(--font700);
  font-size: var(--h1Size);
  line-height: var(--h1LineHeight);
  color: var(--textColor);
  text-transform: uppercase;
  max-width: 695px;
}


.btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: var(--btn-p);
  gap: 10px;

  border-radius: 12px;

  width: fit-content;
  min-width: var(--btn-maxW);
  font-style: var(--fontStyletNormal);
  font-weight: var(--font500);
  font-size: var(--btnSize);
  line-height: 31px;
  /* identical to box height */

  text-align: center;
  border: 3px solid transparent;

}

.btn--outline {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: var(--btn-p);
  gap: 10px;

  border-radius: 12px;

  width: fit-content;
  min-width: var(--btn-maxW);
  font-style: var(--fontStyletNormal);
  font-weight: var(--font500);
  font-size: var(--btnSize);

  text-align: center;

  border: 3px solid #FFFFFF;

  color: var(--textColor);

}

.btn--primary {
  background: #C931FF;
  color: #FFFFFF;
}

.btn--secondary {
  background: var(--bgColor);
  color: #FFFFFF;
}

.btn:hover,
.btn--outline:hover {
  cursor: pointer;
  background-color: var(--textColor);
  color: var(--secondary);
  transition: var(--transition);

}


.hiw {
  background-image: url(assets/imgs/HowItWorks.png);
}

h2 {
  font-style: var(--fontStyletNormal);
  font-weight: var(--font500);
  font-size: var(--h2Size);
  line-height: var(--h2LineHeight);
  max-width: 1120px;
  color: var(--textColor);
}

@media screen and (max-width: 1440px) {
  :root {
      --btnSize: 18px;
      --linkSize: 18px;
      --h1Size: 72px;
      --h2Size: 32px;

      --linkLineHeight: 31px;
      --h1LineHeight: 72px;
      --h2LineHeight: 61px;

      --btn-maxW: 280px;
      --btn-p: 15px 57px;

  }
}


@media screen and (max-width: 768px) {
  :root {
      --btnSize: 14px;
      --linkSize: 18px;
      --h1Size: 40px;
      --h2Size: 24px;

      --linkLineHeight: 31px;
      --h1LineHeight: 60px;
      --h2LineHeight: 36px;

      --btn-maxW: 100%;
      --btn-p: 10px 57px;
  }
}
  `
},{"bel":2,"csjs-inject":5}]},{},[25]);
