;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0](function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  var containerMaker;

  module.exports = containerMaker = function(node, material) {
    var plane, planeGeometry, planeMaterial;
    planeMaterial = material != null ? material : new THREE.MeshBasicMaterial({
      color: node.options.backgroundColor,
      side: THREE.DoubleSide
    });
    planeGeometry = new THREE.PlaneGeometry(node.options.width, node.options.height, 1, 1);
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = node.options.y;
    plane.position.x = node.options.x;
    plane.position.z = node.options.z;
    return plane;
  };

}).call(this);


},{}],2:[function(require,module,exports){
(function() {
  var fontSize, makeLookUp, makeText, textMaker;

  fontSize = 16;

  makeLookUp = function(text, color) {
    var canvas, character, context, face, hash, letter, quad, texture, _i, _len;
    hash = {};
    for (_i = 0, _len = text.length; _i < _len; _i++) {
      character = text[_i];
      if (hash[character] == null) {
        canvas = document.createElement('canvas');
        context = canvas.getContext('2d');
        context.font = fontSize * 2 + 'px monospace';
        canvas.width = context.measureText(character).width + 2;
        canvas.height = fontSize * 2 + 10;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = fontSize * 2 + 'px monospace';
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillColor = color;
        context.fillText(character, canvas.width / 2 - 2, canvas.height / 2);
        texture = new THREE.Texture(canvas);
        face = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true
        });
        quad = new THREE.PlaneGeometry(canvas.width / 2 - 5, canvas.height / 2);
        letter = new THREE.Mesh(quad, face);
        texture.needsUpdate = true;
        hash[character] = letter;
      }
    }
    return hash;
  };

  makeText = function(text, hash, maxWidth, maxHeight) {
    var character, eachLetter, group, letter, line, xPos, yPos, _i, _j, _len, _len1, _ref;
    group = new THREE.Object3D();
    line = new THREE.Object3D();
    yPos = 0;
    for (_i = 0, _len = text.length; _i < _len; _i++) {
      character = text[_i];
      if (!(Math.abs(yPos < maxHeight))) {
        continue;
      }
      xPos = 0;
      letter = new THREE.Mesh(hash[character].geometry, hash[character].material);
      _ref = line.children;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        eachLetter = _ref[_j];
        xPos += eachLetter.geometry.width + 1;
      }
      letter.position.x = xPos;
      line.position.x = -xPos / 2;
      if (xPos + letter.geometry.width > maxWidth) {
        line.add(letter);
        xPos = 0;
        yPos -= letter.geometry.height;
        line.position.y = yPos;
        group.add(line);
        line = new THREE.Object3D();
      } else {
        letter.position.x = xPos;
        line.position.x = -xPos / 2;
        line.add(letter);
      }
    }
    yPos -= letter.geometry.height;
    line.position.y = yPos;
    group.add(line);
    group.position.y = Math.abs(yPos / 2) + letter.geometry.height / 2;
    return group;
  };

  module.exports = textMaker = function(node) {
    var table, textElem;
    table = makeLookUp(node.tag, node.options.backgroundColor);
    textElem = makeText(node.tag, table, node.options.width, node.options.height);
    textElem.translateZ(node.options.z);
    textElem.translateX(node.options.x);
    textElem.translateY(node.options.y);
    return textElem;
  };

}).call(this);


},{}],3:[function(require,module,exports){
(function() {
  var wgify;

  wgify = {
    renderBlock: function(block, node) {
      node.innerHTML = block;
      node.getGLifyInstance = function() {
        return instance;
      };
      ({
        instance: {
          node: node,
          setSize: function(width, height) {
            if (this.width == null) {
              this.width = node.scrollWidth;
            }
            if (this.height == null) {
              this.height = node.scrollHeight;
            }
            if (this.width !== this.canvas.width || this.height !== this.canvas.height) {
              return this.render;
            }
          },
          render: function(block) {}
        }
      });
      return instance;
    },
    populateContent: function() {
      var instances, nodes, script, scripts, _i, _len;
      scripts = (Array.prototype.slice.call(document.querySelectorAll('[type="text/webglify"]'))).concat(Array.prototype.slice.call(document.querySelectorAll('[src*="webglify.js"]')));
      instances = [];
      for (_i = 0, _len = scripts.length; _i < _len; _i++) {
        script = scripts[_i];
        if (script.innerHTML == null) {
          continue;
        }
        nodes = document.querySelectorAll(script.getAttribute('target') || 'body');
        if (nodes.length != null) {
          instances.push(wgify.renderBlock(script.innerHTML, nodes[0]));
        }
      }
      return window.addEventListener('resize', function(evt) {
        var instance, _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = instances.length; _j < _len1; _j++) {
          instance = instances[_j];
          _results.push(instance.setSize);
        }
        return _results;
      });
    }
  };

}).call(this);


},{}],4:[function(require,module,exports){
(function() {
  var dresser;

  module.exports = dresser = function(node) {
    var child, index, key, value, _base, _base1, _base10, _base11, _base12, _base13, _base14, _base15, _base16, _base17, _base18, _base19, _base2, _base20, _base21, _base22, _base23, _base3, _base4, _base5, _base6, _base7, _base8, _base9, _i, _len, _ref, _ref1;
    if ((_base = node.options).x == null) {
      _base.x = 0;
    }
    if ((_base1 = node.options).y == null) {
      _base1.y = 0;
    }
    node.options.z = node.depth * 2;
    if ((_base2 = node.options).height == null) {
      _base2.height = window.innerHeight;
    }
    if ((_base3 = node.options).width == null) {
      _base3.width = window.innerWidth;
    }
    if ((_base4 = node.options).backgroundColor == null) {
      _base4.backgroundColor = '#FFFFFF';
    }
    if ((_base5 = node.options).childType == null) {
      _base5.childType = 'vertical';
    }
    _ref = node.children;
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      child = _ref[index];
      if (node.options.childType === 'horizontal' || node.options.childType === 'vertical') {
        child.options.type = 'block';
      }
      if ((_base6 = child.options).type == null) {
        _base6.type = node.options.childType;
      }
      if ((child.options.x != null) || (child.options.y != null) || (child.options.height != null) || (child.options.width != null)) {
        if (child.options.x != null) {
          child.options.x = (node.options.x + ((child.options.x / 100) * node.options.width)) / 2;
        }
        if (child.options.y != null) {
          child.options.y = (node.options.y + ((child.options.y / 100) * node.options.height)) / 2;
        }
        if (child.options.height != null) {
          child.options.height = (child.options.height / 100) * node.options.height;
        }
        if (child.options.width != null) {
          child.options.width = (child.options.width / 100) * node.options.width;
        }
        child.options.z += 1;
      }
      switch (node.options.childType) {
        case 'horizontal':
          if ((_base7 = child.options).x == null) {
            _base7.x = node.options.width * (index / node.children.length) - ((node.options.width / 2) - ((node.options.width / node.children.length) / 2)) + node.options.x;
          }
          if ((_base8 = child.options).y == null) {
            _base8.y = node.options.y;
          }
          if ((_base9 = child.options).width == null) {
            _base9.width = node.options.width / node.children.length;
          }
          if ((_base10 = child.options).height == null) {
            _base10.height = node.options.height;
          }
          break;
        case 'vertical':
          if ((_base11 = child.options).y == null) {
            _base11.y = ((node.options.height / 2) - ((node.options.height / node.children.length) / 2)) - (node.options.height * (index / node.children.length)) + node.options.y;
          }
          if ((_base12 = child.options).x == null) {
            _base12.x = node.options.x;
          }
          if ((_base13 = child.options).height == null) {
            _base13.height = node.options.height / node.children.length;
          }
          if ((_base14 = child.options).width == null) {
            _base14.width = node.options.width;
          }
          break;
        case 'text':
          if ((_base15 = child.options).x == null) {
            _base15.x = node.options.x;
          }
          if ((_base16 = child.options).y == null) {
            _base16.y = node.options.y;
          }
          if ((_base17 = child.options).width == null) {
            _base17.width = node.options.width;
          }
          if ((_base18 = child.options).height == null) {
            _base18.height = node.options.height;
          }
          if (node.options.backgroundColor === '#000000' || node.options.backgroundColor === 'black') {
            if ((_base19 = child.options).backgroundColor == null) {
              _base19.backgroundColor = 'white';
            }
          } else {
            child.options.backgroundColor === 'black';
          }
          break;
        case 'image':
          if ((_base20 = child.options).x == null) {
            _base20.x = node.options.x;
          }
          if ((_base21 = child.options).y == null) {
            _base21.y = node.options.y;
          }
          if ((_base22 = child.options).width == null) {
            _base22.width = node.options.width;
          }
          if ((_base23 = child.options).height == null) {
            _base23.height = node.options.height;
          }
          _ref1 = child.options;
          for (key in _ref1) {
            value = _ref1[key];
            if (key[0] === '/') {
              child.tag += ':' + key;
            }
          }
      }
      dresser(child);
    }
    return node;
  };

}).call(this);


},{}],5:[function(require,module,exports){
(function() {
  var inheriter, objectifier, parser, segmenter;

  module.exports = parser = function(text) {
    var content, firstNonWhiteSpaceIndex, i, item, line, lines, malformed, option, options, properlyFormed, tagSpace, whitespace, _i, _j, _k, _len, _len1, _ref;
    lines = text.split('\n');
    malformed = [];
    for (_i = 0, _len = lines.length; _i < _len; _i++) {
      line = lines[_i];
      firstNonWhiteSpaceIndex = line.indexOf(/\S/.exec(line));
      whitespace = line.slice(0, firstNonWhiteSpaceIndex);
      if (line.indexOf(':') !== -1) {
        tagSpace = line.slice(firstNonWhiteSpaceIndex, line.indexOf(':'));
        options = line.slice(line.indexOf(':') + 1).replace(/\s/g, '');
        options = options.split(',');
        options = (function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = options.length; _j < _len1; _j++) {
            option = options[_j];
            _results.push(option.split(':'));
          }
          return _results;
        })();
        malformed.push([whitespace.length, tagSpace, options]);
      } else {
        content = line.slice(firstNonWhiteSpaceIndex);
        malformed.push([whitespace.length, content, []]);
      }
    }
    for (i = _j = 1, _ref = malformed.length - 1; 1 <= _ref ? _j <= _ref : _j >= _ref; i = 1 <= _ref ? ++_j : --_j) {
      if (malformed[i][1].length === 0 && malformed[i - 1][2].length === 0 && malformed[i][0] === malformed[i - 1][0]) {
        malformed[i - 1][2] = malformed[i - 1][2].concat(malformed[i][2]);
      }
    }
    properlyFormed = [];
    for (_k = 0, _len1 = malformed.length; _k < _len1; _k++) {
      item = malformed[_k];
      if (item[1].length !== 0) {
        properlyFormed.push(objectifier(item));
      }
    }
    return inheriter(segmenter(properlyFormed));
  };

  objectifier = function(element) {
    var object, option, _i, _len, _ref;
    object = {
      depth: element[0],
      tag: element[1],
      options: {},
      children: []
    };
    _ref = element[2];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      option = _ref[_i];
      object.options[option[0]] = option[1];
    }
    return object;
  };

  segmenter = function(array) {
    var recurser, remover, results;
    results = [];
    recurser = function(array2, position) {
      var element, i, index, _i, _j, _len, _ref, _ref1;
      for (index = _i = 0, _len = array2.length; _i < _len; index = ++_i) {
        element = array2[index];
        for (i = _j = _ref = array2.length - 1, _ref1 = index + 1; _j >= _ref1; i = _j += -1) {
          if (element.depth === array2[i].depth) {
            recurser(array2.slice(i), position + i);
            recurser(array2.slice(0, i), position);
            return false;
          }
        }
      }
      return results[position] = array2;
    };
    remover = function(array2) {
      var element, results2, _i, _len;
      results2 = [];
      for (_i = 0, _len = array2.length; _i < _len; _i++) {
        element = array2[_i];
        if (element != null) {
          results2.push(element);
        }
      }
      return results2;
    };
    recurser(array, 0);
    results = remover(results);
    return results;
  };

  inheriter = function(array) {
    var child, i, index, j, lostChild, parent, potentialHome, potentialSibling, root, subArray, _i, _j, _k, _l, _len, _len1, _m, _ref, _ref1, _ref2;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      subArray = array[_i];
      for (j = _j = _ref = subArray.length - 1; _j >= 1; j = _j += -1) {
        child = subArray[j];
        parent = subArray[j - 1];
        parent.children.push(child);
      }
    }
    for (i = _k = _ref1 = array.length - 1; _k >= 0; i = _k += -1) {
      subArray = array[i];
      lostChild = subArray[0];
      for (j = _l = _ref2 = i - 1; _l >= 0; j = _l += -1) {
        if (!(i !== 0)) {
          continue;
        }
        potentialHome = array[j];
        root = potentialHome[0];
        if (root.depth < lostChild.depth) {
          for (index = _m = 0, _len1 = potentialHome.length; _m < _len1; index = ++_m) {
            potentialSibling = potentialHome[index];
            if (potentialSibling.depth === lostChild.depth) {
              potentialHome[index - 1].children.splice(1, 0, lostChild);
              break;
            }
          }
          break;
        }
      }
    }
    return array[0][0];
  };

}).call(this);


},{}],6:[function(require,module,exports){
(function() {
  module.exports = {
    render: function() {
      return this.renderer.render(this.scene, this.camera);
    },
    init: function(scene, camera) {
      var renderer;
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        precision: 'highp'
      });
      renderer.setSize(window.innerWidth + 10, window.innerHeight + 10);
      scene.add(camera);
      this.renderer = renderer;
      this.scene = scene;
      this.camera = camera;
      return this.domElement = renderer.domElement;
    }
  };

}).call(this);


},{}],7:[function(require,module,exports){
(function() {
  var containerMaker, createImageMaterial, imageMaker, renderer;

  containerMaker = require('./containerModule.coffee');

  renderer = require('../renderer/renderer.coffee');

  createImageMaterial = function(url) {
    var material, texture;
    texture = THREE.ImageUtils.loadTexture(url, new THREE.UVMapping(), function() {
      texture.needsUpdate = true;
      return renderer.render();
    });
    material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    });
    return material;
  };

  module.exports = imageMaker = function(node) {
    var material;
    material = createImageMaterial(node.tag);
    return containerMaker(node, material);
  };

}).call(this);


},{"./containerModule.coffee":1,"../renderer/renderer.coffee":6}],8:[function(require,module,exports){
(function() {
  var container, imager, layoutMaker, texter;

  texter = require('../ConstructorModules/textModule.coffee');

  imager = require('../ConstructorModules/imgModule.coffee');

  container = require('../ConstructorModules/containerModule.coffee');

  module.exports = layoutMaker = function(syntax) {
    var aspect, camera, far, height, near, object, recursiveStager, renderer, scene, viewAngle, width;
    width = syntax.options.width;
    height = syntax.options.height;
    viewAngle = 45;
    aspect = width / height;
    near = 0.1;
    far = 10000;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
    scene = new THREE.Scene();
    camera.position.set(0, 0, (window.innerWidth * 2) / 3);
    recursiveStager = function(node) {
      var child, _i, _len, _ref, _results;
      if (node.options.type === 'text') {
        scene.add(texter(node));
      } else if (node.options.type === 'block') {
        scene.add(container(node));
      } else if (node.options.type === 'image') {
        scene.add(imager(node));
      }
      _ref = node.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(recursiveStager(child));
      }
      return _results;
    };
    recursiveStager(syntax);
    object = {
      scene: scene,
      camera: camera
    };
    return object;
  };

}).call(this);


},{"../ConstructorModules/textModule.coffee":2,"../ConstructorModules/imgModule.coffee":7,"../ConstructorModules/containerModule.coffee":1}],9:[function(require,module,exports){
/*
 * WebGlify
 * https://github.com/DnMllr/webglify
 *
 * Copyright (c) 2013 Daniel Miller
 * Licensed under the MIT license.
*/


(function() {
  var WebGlify, dresser, layout, parser, renderer;

  dresser = require('../compiler/dresser.coffee');

  layout = require('../LayoutModules/layoutModule.coffee');

  parser = require('../parsers/webglifyPARSER.coffee');

  renderer = require('../renderer/renderer.coffee');

  module.exports = WebGlify = function(data) {
    var scene, value;
    value = data.data;
    scene = layout(dresser(parser(value)));
    renderer.init(scene.scene, scene.camera);
    document.body.appendChild(renderer.domElement);
    return renderer.render();
  };

}).call(this);


},{"../compiler/dresser.coffee":4,"../LayoutModules/layoutModule.coffee":8,"../parsers/webglifyPARSER.coffee":5,"../renderer/renderer.coffee":6}],10:[function(require,module,exports){
(function() {
  var HTMLparser, findElementsByType, htmlparse;

  htmlparse = require('htmlparser');

  findElementsByType = function(type, element) {
    var recurseSearch, results;
    results = [];
    recurseSearch = function(type, element) {
      var node, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = element.length; _i < _len; _i++) {
        node = element[_i];
        if (node.type === type) {
          results.push(node.data);
        }
        if (node.children) {
          _results.push(recurseSearch(type, node.children));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    recurseSearch(type, element);
    return results;
  };

  HTMLparser = (function() {
    function HTMLparser(type) {
      this.type = type;
    }

    HTMLparser.prototype.parse = function(html) {
      var handler, parser;
      handler = new htmlparse.DefaultHandler(function(error, dom) {
        if (error) {
          return console.log('error');
        } else {
          this.divs = findElementsByType('div', dom);
          return this.text = findElementsByType('text', dom);
        }
      });
      parser = new htmlparse.Parser(handler);
      parser.parseComplete(html);
      return {
        div: handler.divs,
        text: handler.text
      };
    };

    return HTMLparser;

  })();

  module.exports = HTMLparser;

}).call(this);


},{"htmlparser":11}],11:[function(require,module,exports){
(function(__filename,__dirname){/***********************************************
Copyright 2010, 2011, Chris Winberry <chris@winberry.net>. All rights reserved.
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
***********************************************/
/* v1.7.6 */

(function () {

function runningInNode () {
	return(
		(typeof require) == "function"
		&&
		(typeof exports) == "object"
		&&
		(typeof module) == "object"
		&&
		(typeof __filename) == "string"
		&&
		(typeof __dirname) == "string"
		);
}

if (!runningInNode()) {
	if (!this.Tautologistics)
		this.Tautologistics = {};
	else if (this.Tautologistics.NodeHtmlParser)
		return; //NodeHtmlParser already defined!
	this.Tautologistics.NodeHtmlParser = {};
	exports = this.Tautologistics.NodeHtmlParser;
}

//Types of elements found in the DOM
var ElementType = {
	  Text: "text" //Plain text
	, Directive: "directive" //Special tag <!...>
	, Comment: "comment" //Special tag <!--...-->
	, Script: "script" //Special tag <script>...</script>
	, Style: "style" //Special tag <style>...</style>
	, Tag: "tag" //Any tag that isn't special
}

function Parser (handler, options) {
	this._options = options ? options : { };
	if (this._options.includeLocation == undefined) {
		this._options.includeLocation = false; //Do not track element position in document by default
	}

	this.validateHandler(handler);
	this._handler = handler;
	this.reset();
}

	//**"Static"**//
	//Regular expressions used for cleaning up and parsing (stateless)
	Parser._reTrim = /(^\s+|\s+$)/g; //Trim leading/trailing whitespace
	Parser._reTrimComment = /(^\!--|--$)/g; //Remove comment tag markup from comment contents
	Parser._reWhitespace = /\s/g; //Used to find any whitespace to split on
	Parser._reTagName = /^\s*(\/?)\s*([^\s\/]+)/; //Used to find the tag name for an element

	//Regular expressions used for parsing (stateful)
	Parser._reAttrib = //Find attributes in a tag
		/([^=<>\"\'\s]+)\s*=\s*"([^"]*)"|([^=<>\"\'\s]+)\s*=\s*'([^']*)'|([^=<>\"\'\s]+)\s*=\s*([^'"\s]+)|([^=<>\"\'\s\/]+)/g;
	Parser._reTags = /[\<\>]/g; //Find tag markers

	//**Public**//
	//Methods//
	//Parses a complete HTML and pushes it to the handler
	Parser.prototype.parseComplete = function Parser$parseComplete (data) {
		this.reset();
		this.parseChunk(data);
		this.done();
	}

	//Parses a piece of an HTML document
	Parser.prototype.parseChunk = function Parser$parseChunk (data) {
		if (this._done)
			this.handleError(new Error("Attempted to parse chunk after parsing already done"));
		this._buffer += data; //FIXME: this can be a bottleneck
		this.parseTags();
	}

	//Tells the parser that the HTML being parsed is complete
	Parser.prototype.done = function Parser$done () {
		if (this._done)
			return;
		this._done = true;
	
		//Push any unparsed text into a final element in the element list
		if (this._buffer.length) {
			var rawData = this._buffer;
			this._buffer = "";
			var element = {
				  raw: rawData
				, data: (this._parseState == ElementType.Text) ? rawData : rawData.replace(Parser._reTrim, "")
				, type: this._parseState
				};
			if (this._parseState == ElementType.Tag || this._parseState == ElementType.Script || this._parseState == ElementType.Style)
				element.name = this.parseTagName(element.data);
			this.parseAttribs(element);
			this._elements.push(element);
		}
	
		this.writeHandler();
		this._handler.done();
	}

	//Resets the parser to a blank state, ready to parse a new HTML document
	Parser.prototype.reset = function Parser$reset () {
		this._buffer = "";
		this._done = false;
		this._elements = [];
		this._elementsCurrent = 0;
		this._current = 0;
		this._next = 0;
		this._location = {
			  row: 0
			, col: 0
			, charOffset: 0
			, inBuffer: 0
		};
		this._parseState = ElementType.Text;
		this._prevTagSep = '';
		this._tagStack = [];
		this._handler.reset();
	}
	
	//**Private**//
	//Properties//
	Parser.prototype._options = null; //Parser options for how to behave
	Parser.prototype._handler = null; //Handler for parsed elements
	Parser.prototype._buffer = null; //Buffer of unparsed data
	Parser.prototype._done = false; //Flag indicating whether parsing is done
	Parser.prototype._elements =  null; //Array of parsed elements
	Parser.prototype._elementsCurrent = 0; //Pointer to last element in _elements that has been processed
	Parser.prototype._current = 0; //Position in data that has already been parsed
	Parser.prototype._next = 0; //Position in data of the next tag marker (<>)
	Parser.prototype._location = null; //Position tracking for elements in a stream
	Parser.prototype._parseState = ElementType.Text; //Current type of element being parsed
	Parser.prototype._prevTagSep = ''; //Previous tag marker found
	//Stack of element types previously encountered; keeps track of when
	//parsing occurs inside a script/comment/style tag
	Parser.prototype._tagStack = null;

	//Methods//
	//Takes an array of elements and parses any found attributes
	Parser.prototype.parseTagAttribs = function Parser$parseTagAttribs (elements) {
		var idxEnd = elements.length;
		var idx = 0;
	
		while (idx < idxEnd) {
			var element = elements[idx++];
			if (element.type == ElementType.Tag || element.type == ElementType.Script || element.type == ElementType.style)
				this.parseAttribs(element);
		}
	
		return(elements);
	}

	//Takes an element and adds an "attribs" property for any element attributes found 
	Parser.prototype.parseAttribs = function Parser$parseAttribs (element) {
		//Only parse attributes for tags
		if (element.type != ElementType.Script && element.type != ElementType.Style && element.type != ElementType.Tag)
			return;
	
		var tagName = element.data.split(Parser._reWhitespace, 1)[0];
		var attribRaw = element.data.substring(tagName.length);
		if (attribRaw.length < 1)
			return;
	
		var match;
		Parser._reAttrib.lastIndex = 0;
		while (match = Parser._reAttrib.exec(attribRaw)) {
			if (element.attribs == undefined)
				element.attribs = {};
	
			if (typeof match[1] == "string" && match[1].length) {
				element.attribs[match[1]] = match[2];
			} else if (typeof match[3] == "string" && match[3].length) {
				element.attribs[match[3].toString()] = match[4].toString();
			} else if (typeof match[5] == "string" && match[5].length) {
				element.attribs[match[5]] = match[6];
			} else if (typeof match[7] == "string" && match[7].length) {
				element.attribs[match[7]] = match[7];
			}
		}
	}

	//Extracts the base tag name from the data value of an element
	Parser.prototype.parseTagName = function Parser$parseTagName (data) {
		if (data == null || data == "")
			return("");
		var match = Parser._reTagName.exec(data);
		if (!match)
			return("");
		return((match[1] ? "/" : "") + match[2]);
	}

	//Parses through HTML text and returns an array of found elements
	//I admit, this function is rather large but splitting up had an noticeable impact on speed
	Parser.prototype.parseTags = function Parser$parseTags () {
		var bufferEnd = this._buffer.length - 1;
		while (Parser._reTags.test(this._buffer)) {
			this._next = Parser._reTags.lastIndex - 1;
			var tagSep = this._buffer.charAt(this._next); //The currently found tag marker
			var rawData = this._buffer.substring(this._current, this._next); //The next chunk of data to parse
	
			//A new element to eventually be appended to the element list
			var element = {
				  raw: rawData
				, data: (this._parseState == ElementType.Text) ? rawData : rawData.replace(Parser._reTrim, "")
				, type: this._parseState
			};
	
			var elementName = this.parseTagName(element.data);
	
			//This section inspects the current tag stack and modifies the current
			//element if we're actually parsing a special area (script/comment/style tag)
			if (this._tagStack.length) { //We're parsing inside a script/comment/style tag
				if (this._tagStack[this._tagStack.length - 1] == ElementType.Script) { //We're currently in a script tag
					if (elementName.toLowerCase() == "/script") //Actually, we're no longer in a script tag, so pop it off the stack
						this._tagStack.pop();
					else { //Not a closing script tag
						if (element.raw.indexOf("!--") != 0) { //Make sure we're not in a comment
							//All data from here to script close is now a text element
							element.type = ElementType.Text;
							//If the previous element is text, append the current text to it
							if (this._elements.length && this._elements[this._elements.length - 1].type == ElementType.Text) {
								var prevElement = this._elements[this._elements.length - 1];
								prevElement.raw = prevElement.data = prevElement.raw + this._prevTagSep + element.raw;
								element.raw = element.data = ""; //This causes the current element to not be added to the element list
							}
						}
					}
				}
				else if (this._tagStack[this._tagStack.length - 1] == ElementType.Style) { //We're currently in a style tag
					if (elementName.toLowerCase() == "/style") //Actually, we're no longer in a style tag, so pop it off the stack
						this._tagStack.pop();
					else {
						if (element.raw.indexOf("!--") != 0) { //Make sure we're not in a comment
							//All data from here to style close is now a text element
							element.type = ElementType.Text;
							//If the previous element is text, append the current text to it
							if (this._elements.length && this._elements[this._elements.length - 1].type == ElementType.Text) {
								var prevElement = this._elements[this._elements.length - 1];
								if (element.raw != "") {
									prevElement.raw = prevElement.data = prevElement.raw + this._prevTagSep + element.raw;
									element.raw = element.data = ""; //This causes the current element to not be added to the element list
								} else { //Element is empty, so just append the last tag marker found
									prevElement.raw = prevElement.data = prevElement.raw + this._prevTagSep;
								}
							} else { //The previous element was not text
								if (element.raw != "") {
									element.raw = element.data = element.raw;
								}
							}
						}
					}
				}
				else if (this._tagStack[this._tagStack.length - 1] == ElementType.Comment) { //We're currently in a comment tag
					var rawLen = element.raw.length;
					if (element.raw.charAt(rawLen - 2) == "-" && element.raw.charAt(rawLen - 1) == "-" && tagSep == ">") {
						//Actually, we're no longer in a style tag, so pop it off the stack
						this._tagStack.pop();
						//If the previous element is a comment, append the current text to it
						if (this._elements.length && this._elements[this._elements.length - 1].type == ElementType.Comment) {
							var prevElement = this._elements[this._elements.length - 1];
							prevElement.raw = prevElement.data = (prevElement.raw + element.raw).replace(Parser._reTrimComment, "");
							element.raw = element.data = ""; //This causes the current element to not be added to the element list
							element.type = ElementType.Text;
						}
						else //Previous element not a comment
							element.type = ElementType.Comment; //Change the current element's type to a comment
					}
					else { //Still in a comment tag
						element.type = ElementType.Comment;
						//If the previous element is a comment, append the current text to it
						if (this._elements.length && this._elements[this._elements.length - 1].type == ElementType.Comment) {
							var prevElement = this._elements[this._elements.length - 1];
							prevElement.raw = prevElement.data = prevElement.raw + element.raw + tagSep;
							element.raw = element.data = ""; //This causes the current element to not be added to the element list
							element.type = ElementType.Text;
						}
						else
							element.raw = element.data = element.raw + tagSep;
					}
				}
			}
	
			//Processing of non-special tags
			if (element.type == ElementType.Tag) {
				element.name = elementName;
				var elementNameCI = elementName.toLowerCase();
				
				if (element.raw.indexOf("!--") == 0) { //This tag is really comment
					element.type = ElementType.Comment;
					delete element["name"];
					var rawLen = element.raw.length;
					//Check if the comment is terminated in the current element
					if (element.raw.charAt(rawLen - 1) == "-" && element.raw.charAt(rawLen - 2) == "-" && tagSep == ">")
						element.raw = element.data = element.raw.replace(Parser._reTrimComment, "");
					else { //It's not so push the comment onto the tag stack
						element.raw += tagSep;
						this._tagStack.push(ElementType.Comment);
					}
				}
				else if (element.raw.indexOf("!") == 0 || element.raw.indexOf("?") == 0) {
					element.type = ElementType.Directive;
					//TODO: what about CDATA?
				}
				else if (elementNameCI == "script") {
					element.type = ElementType.Script;
					//Special tag, push onto the tag stack if not terminated
					if (element.data.charAt(element.data.length - 1) != "/")
						this._tagStack.push(ElementType.Script);
				}
				else if (elementNameCI == "/script")
					element.type = ElementType.Script;
				else if (elementNameCI == "style") {
					element.type = ElementType.Style;
					//Special tag, push onto the tag stack if not terminated
					if (element.data.charAt(element.data.length - 1) != "/")
						this._tagStack.push(ElementType.Style);
				}
				else if (elementNameCI == "/style")
					element.type = ElementType.Style;
				if (element.name && element.name.charAt(0) == "/")
					element.data = element.name;
			}
	
			//Add all tags and non-empty text elements to the element list
			if (element.raw != "" || element.type != ElementType.Text) {
				if (this._options.includeLocation && !element.location) {
					element.location = this.getLocation(element.type == ElementType.Tag);
				}
				this.parseAttribs(element);
				this._elements.push(element);
				//If tag self-terminates, add an explicit, separate closing tag
				if (
					element.type != ElementType.Text
					&&
					element.type != ElementType.Comment
					&&
					element.type != ElementType.Directive
					&&
					element.data.charAt(element.data.length - 1) == "/"
					)
					this._elements.push({
						  raw: "/" + element.name
						, data: "/" + element.name
						, name: "/" + element.name
						, type: element.type
					});
			}
			this._parseState = (tagSep == "<") ? ElementType.Tag : ElementType.Text;
			this._current = this._next + 1;
			this._prevTagSep = tagSep;
		}

		if (this._options.includeLocation) {
			this.getLocation();
			this._location.row += this._location.inBuffer;
			this._location.inBuffer = 0;
			this._location.charOffset = 0;
		}
		this._buffer = (this._current <= bufferEnd) ? this._buffer.substring(this._current) : "";
		this._current = 0;
	
		this.writeHandler();
	}

	Parser.prototype.getLocation = function Parser$getLocation (startTag) {
		var c,
			l = this._location,
			end = this._current - (startTag ? 1 : 0),
			chunk = startTag && l.charOffset == 0 && this._current == 0;
		
		for (; l.charOffset < end; l.charOffset++) {
			c = this._buffer.charAt(l.charOffset);
			if (c == '\n') {
				l.inBuffer++;
				l.col = 0;
			} else if (c != '\r') {
				l.col++;
			}
		}
		return {
			  line: l.row + l.inBuffer + 1
			, col: l.col + (chunk ? 0: 1)
		};
	}

	//Checks the handler to make it is an object with the right "interface"
	Parser.prototype.validateHandler = function Parser$validateHandler (handler) {
		if ((typeof handler) != "object")
			throw new Error("Handler is not an object");
		if ((typeof handler.reset) != "function")
			throw new Error("Handler method 'reset' is invalid");
		if ((typeof handler.done) != "function")
			throw new Error("Handler method 'done' is invalid");
		if ((typeof handler.writeTag) != "function")
			throw new Error("Handler method 'writeTag' is invalid");
		if ((typeof handler.writeText) != "function")
			throw new Error("Handler method 'writeText' is invalid");
		if ((typeof handler.writeComment) != "function")
			throw new Error("Handler method 'writeComment' is invalid");
		if ((typeof handler.writeDirective) != "function")
			throw new Error("Handler method 'writeDirective' is invalid");
	}

	//Writes parsed elements out to the handler
	Parser.prototype.writeHandler = function Parser$writeHandler (forceFlush) {
		forceFlush = !!forceFlush;
		if (this._tagStack.length && !forceFlush)
			return;
		while (this._elements.length) {
			var element = this._elements.shift();
			switch (element.type) {
				case ElementType.Comment:
					this._handler.writeComment(element);
					break;
				case ElementType.Directive:
					this._handler.writeDirective(element);
					break;
				case ElementType.Text:
					this._handler.writeText(element);
					break;
				default:
					this._handler.writeTag(element);
					break;
			}
		}
	}

	Parser.prototype.handleError = function Parser$handleError (error) {
		if ((typeof this._handler.error) == "function")
			this._handler.error(error);
		else
			throw error;
	}

//TODO: make this a trully streamable handler
function RssHandler (callback) {
	RssHandler.super_.call(this, callback, { ignoreWhitespace: true, verbose: false, enforceEmptyTags: false });
}
inherits(RssHandler, DefaultHandler);

	RssHandler.prototype.done = function RssHandler$done () {
		var feed = { };
		var feedRoot;

		var found = DomUtils.getElementsByTagName(function (value) { return(value == "rss" || value == "feed"); }, this.dom, false);
		if (found.length) {
			feedRoot = found[0];
		}
		if (feedRoot) {
			if (feedRoot.name == "rss") {
				feed.type = "rss";
				feedRoot = feedRoot.children[0]; //<channel/>
				feed.id = "";
				try {
					feed.title = DomUtils.getElementsByTagName("title", feedRoot.children, false)[0].children[0].data;
				} catch (ex) { }
				try {
					feed.link = DomUtils.getElementsByTagName("link", feedRoot.children, false)[0].children[0].data;
				} catch (ex) { }
				try {
					feed.description = DomUtils.getElementsByTagName("description", feedRoot.children, false)[0].children[0].data;
				} catch (ex) { }
				try {
					feed.updated = new Date(DomUtils.getElementsByTagName("lastBuildDate", feedRoot.children, false)[0].children[0].data);
				} catch (ex) { }
				try {
					feed.author = DomUtils.getElementsByTagName("managingEditor", feedRoot.children, false)[0].children[0].data;
				} catch (ex) { }
				feed.items = [];
				DomUtils.getElementsByTagName("item", feedRoot.children).forEach(function (item, index, list) {
					var entry = {};
					try {
						entry.id = DomUtils.getElementsByTagName("guid", item.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						entry.title = DomUtils.getElementsByTagName("title", item.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						entry.link = DomUtils.getElementsByTagName("link", item.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						entry.description = DomUtils.getElementsByTagName("description", item.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						entry.pubDate = new Date(DomUtils.getElementsByTagName("pubDate", item.children, false)[0].children[0].data);
					} catch (ex) { }
					feed.items.push(entry);
				});
			} else {
				feed.type = "atom";
				try {
					feed.id = DomUtils.getElementsByTagName("id", feedRoot.children, false)[0].children[0].data;
				} catch (ex) { }
				try {
					feed.title = DomUtils.getElementsByTagName("title", feedRoot.children, false)[0].children[0].data;
				} catch (ex) { }
				try {
					feed.link = DomUtils.getElementsByTagName("link", feedRoot.children, false)[0].attribs.href;
				} catch (ex) { }
				try {
					feed.description = DomUtils.getElementsByTagName("subtitle", feedRoot.children, false)[0].children[0].data;
				} catch (ex) { }
				try {
					feed.updated = new Date(DomUtils.getElementsByTagName("updated", feedRoot.children, false)[0].children[0].data);
				} catch (ex) { }
				try {
					feed.author = DomUtils.getElementsByTagName("email", feedRoot.children, true)[0].children[0].data;
				} catch (ex) { }
				feed.items = [];
				DomUtils.getElementsByTagName("entry", feedRoot.children).forEach(function (item, index, list) {
					var entry = {};
					try {
						entry.id = DomUtils.getElementsByTagName("id", item.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						entry.title = DomUtils.getElementsByTagName("title", item.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						entry.link = DomUtils.getElementsByTagName("link", item.children, false)[0].attribs.href;
					} catch (ex) { }
					try {
						entry.description = DomUtils.getElementsByTagName("summary", item.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						entry.pubDate = new Date(DomUtils.getElementsByTagName("updated", item.children, false)[0].children[0].data);
					} catch (ex) { }
					feed.items.push(entry);
				});
			}

			this.dom = feed;
		}
		RssHandler.super_.prototype.done.call(this);
	}

///////////////////////////////////////////////////

function DefaultHandler (callback, options) {
	this.reset();
	this._options = options ? options : { };
	if (this._options.ignoreWhitespace == undefined)
		this._options.ignoreWhitespace = false; //Keep whitespace-only text nodes
	if (this._options.verbose == undefined)
		this._options.verbose = true; //Keep data property for tags and raw property for all
	if (this._options.enforceEmptyTags == undefined)
		this._options.enforceEmptyTags = true; //Don't allow children for HTML tags defined as empty in spec
	if ((typeof callback) == "function")
		this._callback = callback;
}

	//**"Static"**//
	//HTML Tags that shouldn't contain child nodes
	DefaultHandler._emptyTags = {
		  area: 1
		, base: 1
		, basefont: 1
		, br: 1
		, col: 1
		, frame: 1
		, hr: 1
		, img: 1
		, input: 1
		, isindex: 1
		, link: 1
		, meta: 1
		, param: 1
		, embed: 1
	}
	//Regex to detect whitespace only text nodes
	DefaultHandler.reWhitespace = /^\s*$/;

	//**Public**//
	//Properties//
	DefaultHandler.prototype.dom = null; //The hierarchical object containing the parsed HTML
	//Methods//
	//Resets the handler back to starting state
	DefaultHandler.prototype.reset = function DefaultHandler$reset() {
		this.dom = [];
		this._done = false;
		this._tagStack = [];
		this._tagStack.last = function DefaultHandler$_tagStack$last () {
			return(this.length ? this[this.length - 1] : null);
		}
	}
	//Signals the handler that parsing is done
	DefaultHandler.prototype.done = function DefaultHandler$done () {
		this._done = true;
		this.handleCallback(null);
	}
	DefaultHandler.prototype.writeTag = function DefaultHandler$writeTag (element) {
		this.handleElement(element);
	} 
	DefaultHandler.prototype.writeText = function DefaultHandler$writeText (element) {
		if (this._options.ignoreWhitespace)
			if (DefaultHandler.reWhitespace.test(element.data))
				return;
		this.handleElement(element);
	} 
	DefaultHandler.prototype.writeComment = function DefaultHandler$writeComment (element) {
		this.handleElement(element);
	} 
	DefaultHandler.prototype.writeDirective = function DefaultHandler$writeDirective (element) {
		this.handleElement(element);
	}
	DefaultHandler.prototype.error = function DefaultHandler$error (error) {
		this.handleCallback(error);
	}

	//**Private**//
	//Properties//
	DefaultHandler.prototype._options = null; //Handler options for how to behave
	DefaultHandler.prototype._callback = null; //Callback to respond to when parsing done
	DefaultHandler.prototype._done = false; //Flag indicating whether handler has been notified of parsing completed
	DefaultHandler.prototype._tagStack = null; //List of parents to the currently element being processed
	//Methods//
	DefaultHandler.prototype.handleCallback = function DefaultHandler$handleCallback (error) {
			if ((typeof this._callback) != "function")
				if (error)
					throw error;
				else
					return;
			this._callback(error, this.dom);
	}
	
	DefaultHandler.prototype.isEmptyTag = function(element) {
		var name = element.name.toLowerCase();
		if (name.charAt(0) == '/') {
			name = name.substring(1);
		}
		return this._options.enforceEmptyTags && !!DefaultHandler._emptyTags[name];
	};
	
	DefaultHandler.prototype.handleElement = function DefaultHandler$handleElement (element) {
		if (this._done)
			this.handleCallback(new Error("Writing to the handler after done() called is not allowed without a reset()"));
		if (!this._options.verbose) {
//			element.raw = null; //FIXME: Not clean
			//FIXME: Serious performance problem using delete
			delete element.raw;
			if (element.type == "tag" || element.type == "script" || element.type == "style")
				delete element.data;
		}
		if (!this._tagStack.last()) { //There are no parent elements
			//If the element can be a container, add it to the tag stack and the top level list
			if (element.type != ElementType.Text && element.type != ElementType.Comment && element.type != ElementType.Directive) {
				if (element.name.charAt(0) != "/") { //Ignore closing tags that obviously don't have an opening tag
					this.dom.push(element);
					if (!this.isEmptyTag(element)) { //Don't add tags to the tag stack that can't have children
						this._tagStack.push(element);
					}
				}
			}
			else //Otherwise just add to the top level list
				this.dom.push(element);
		}
		else { //There are parent elements
			//If the element can be a container, add it as a child of the element
			//on top of the tag stack and then add it to the tag stack
			if (element.type != ElementType.Text && element.type != ElementType.Comment && element.type != ElementType.Directive) {
				if (element.name.charAt(0) == "/") {
					//This is a closing tag, scan the tagStack to find the matching opening tag
					//and pop the stack up to the opening tag's parent
					var baseName = element.name.substring(1);
					if (!this.isEmptyTag(element)) {
						var pos = this._tagStack.length - 1;
						while (pos > -1 && this._tagStack[pos--].name != baseName) { }
						if (pos > -1 || this._tagStack[0].name == baseName)
							while (pos < this._tagStack.length - 1)
								this._tagStack.pop();
					}
				}
				else { //This is not a closing tag
					if (!this._tagStack.last().children)
						this._tagStack.last().children = [];
					this._tagStack.last().children.push(element);
					if (!this.isEmptyTag(element)) //Don't add tags to the tag stack that can't have children
						this._tagStack.push(element);
				}
			}
			else { //This is not a container element
				if (!this._tagStack.last().children)
					this._tagStack.last().children = [];
				this._tagStack.last().children.push(element);
			}
		}
	}

	var DomUtils = {
		  testElement: function DomUtils$testElement (options, element) {
			if (!element) {
				return false;
			}
	
			for (var key in options) {
				if (key == "tag_name") {
					if (element.type != "tag" && element.type != "script" && element.type != "style") {
						return false;
					}
					if (!options["tag_name"](element.name)) {
						return false;
					}
				} else if (key == "tag_type") {
					if (!options["tag_type"](element.type)) {
						return false;
					}
				} else if (key == "tag_contains") {
					if (element.type != "text" && element.type != "comment" && element.type != "directive") {
						return false;
					}
					if (!options["tag_contains"](element.data)) {
						return false;
					}
				} else {
					if (!element.attribs || !options[key](element.attribs[key])) {
						return false;
					}
				}
			}
		
			return true;
		}
	
		, getElements: function DomUtils$getElements (options, currentElement, recurse, limit) {
			recurse = (recurse === undefined || recurse === null) || !!recurse;
			limit = isNaN(parseInt(limit)) ? -1 : parseInt(limit);

			if (!currentElement) {
				return([]);
			}
	
			var found = [];
			var elementList;

			function getTest (checkVal) {
				return(function (value) { return(value == checkVal); });
			}
			for (var key in options) {
				if ((typeof options[key]) != "function") {
					options[key] = getTest(options[key]);
				}
			}
	
			if (DomUtils.testElement(options, currentElement)) {
				found.push(currentElement);
			}

			if (limit >= 0 && found.length >= limit) {
				return(found);
			}

			if (recurse && currentElement.children) {
				elementList = currentElement.children;
			} else if (currentElement instanceof Array) {
				elementList = currentElement;
			} else {
				return(found);
			}
	
			for (var i = 0; i < elementList.length; i++) {
				found = found.concat(DomUtils.getElements(options, elementList[i], recurse, limit));
				if (limit >= 0 && found.length >= limit) {
					break;
				}
			}
	
			return(found);
		}
		
		, getElementById: function DomUtils$getElementById (id, currentElement, recurse) {
			var result = DomUtils.getElements({ id: id }, currentElement, recurse, 1);
			return(result.length ? result[0] : null);
		}
		
		, getElementsByTagName: function DomUtils$getElementsByTagName (name, currentElement, recurse, limit) {
			return(DomUtils.getElements({ tag_name: name }, currentElement, recurse, limit));
		}
		
		, getElementsByTagType: function DomUtils$getElementsByTagType (type, currentElement, recurse, limit) {
			return(DomUtils.getElements({ tag_type: type }, currentElement, recurse, limit));
		}
	}

	function inherits (ctor, superCtor) {
		var tempCtor = function(){};
		tempCtor.prototype = superCtor.prototype;
		ctor.super_ = superCtor;
		ctor.prototype = new tempCtor();
		ctor.prototype.constructor = ctor;
	}

exports.Parser = Parser;

exports.DefaultHandler = DefaultHandler;

exports.RssHandler = RssHandler;

exports.ElementType = ElementType;

exports.DomUtils = DomUtils;

})();

})("/../node_modules/htmlparser/lib/htmlparser.js","/../node_modules/htmlparser/lib")
},{}]},{},[1,7,2,8,3,9,4,10,5,6])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvc3JjL0NvbnN0cnVjdG9yTW9kdWxlcy9jb250YWluZXJNb2R1bGUuY29mZmVlIiwiL1VzZXJzL2RhbmllbG1pbGxlci9Eb2N1bWVudHMvSGFjayBSZWFjdG9yIFByb2plY3RzL3dlYmdsaWZ5L3dlYmdsaWZ5L3NyYy9Db25zdHJ1Y3Rvck1vZHVsZXMvdGV4dE1vZHVsZS5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvc3JjL2FwcC9tYWluLmNvZmZlZSIsIi9Vc2Vycy9kYW5pZWxtaWxsZXIvRG9jdW1lbnRzL0hhY2sgUmVhY3RvciBQcm9qZWN0cy93ZWJnbGlmeS93ZWJnbGlmeS9zcmMvY29tcGlsZXIvZHJlc3Nlci5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvc3JjL3BhcnNlcnMvd2ViZ2xpZnlQQVJTRVIuY29mZmVlIiwiL1VzZXJzL2RhbmllbG1pbGxlci9Eb2N1bWVudHMvSGFjayBSZWFjdG9yIFByb2plY3RzL3dlYmdsaWZ5L3dlYmdsaWZ5L3NyYy9yZW5kZXJlci9yZW5kZXJlci5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvc3JjL0NvbnN0cnVjdG9yTW9kdWxlcy9pbWdNb2R1bGUuY29mZmVlIiwiL1VzZXJzL2RhbmllbG1pbGxlci9Eb2N1bWVudHMvSGFjayBSZWFjdG9yIFByb2plY3RzL3dlYmdsaWZ5L3dlYmdsaWZ5L3NyYy9MYXlvdXRNb2R1bGVzL2xheW91dE1vZHVsZS5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvc3JjL2FwcC93ZWJnbGlmeS5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvc3JjL3BhcnNlcnMvSFRNTHBhcnNlci5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvbm9kZV9tb2R1bGVzL2h0bWxwYXJzZXIvbGliL2h0bWxwYXJzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0NBQUEsS0FBQSxRQUFBOztDQUFBLENBQUEsQ0FBaUIsQ0FBaUIsRUFBNUIsQ0FBTixDQUFrQyxDQUFDLEtBQWxCO0NBQ2YsT0FBQSwyQkFBQTtDQUFBLEVBQWdCLENBQWhCLENBQW9DLFFBQXBDLElBQStCO0NBQXdCLENBQVEsRUFBSSxDQUFYLENBQUEsQ0FBbUIsUUFBcEI7Q0FBQSxDQUE0QyxFQUFOLENBQVcsQ0FBWCxJQUF0QztDQUF2RCxLQUErQjtDQUEvQixDQUM0RCxDQUF4QyxDQUFwQixDQUF5QixDQUFMLENBQWdDLE1BQXBEO0NBREEsQ0FFc0MsQ0FBMUIsQ0FBWixDQUFBLFFBQVk7Q0FGWixFQUdtQixDQUFuQixDQUFLLEVBQTBCLENBQWpCO0NBSGQsRUFJbUIsQ0FBbkIsQ0FBSyxFQUEwQixDQUFqQjtDQUpkLEVBS21CLENBQW5CLENBQUssRUFBMEIsQ0FBakI7Q0FOa0IsVUFPaEM7Q0FQRixFQUFrQztDQUFsQzs7Ozs7QUNBQTtDQUFBLEtBQUEsbUNBQUE7O0NBQUEsQ0FBQSxDQUFXLEtBQVg7O0NBQUEsQ0FFQSxDQUFhLENBQUEsQ0FBQSxJQUFDLENBQWQ7Q0FDRSxPQUFBLCtEQUFBO0NBQUEsQ0FBQSxDQUFPLENBQVA7QUFDQSxDQUFBLFFBQUEsa0NBQUE7NEJBQUE7Q0FDRSxH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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gY29udGFpbmVyTWFrZXIgPSAobm9kZSwgbWF0ZXJpYWwpIC0+XG4gIHBsYW5lTWF0ZXJpYWwgPSBtYXRlcmlhbCA/IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCB7Y29sb3I6IG5vZGUub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IsIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGV9XG4gIHBsYW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSBub2RlLm9wdGlvbnMud2lkdGgsIG5vZGUub3B0aW9ucy5oZWlnaHQsIDEsIDFcbiAgcGxhbmUgPSBuZXcgVEhSRUUuTWVzaCBwbGFuZUdlb21ldHJ5LCBwbGFuZU1hdGVyaWFsXG4gIHBsYW5lLnBvc2l0aW9uLnkgPSBub2RlLm9wdGlvbnMueVxuICBwbGFuZS5wb3NpdGlvbi54ID0gbm9kZS5vcHRpb25zLnhcbiAgcGxhbmUucG9zaXRpb24ueiA9IG5vZGUub3B0aW9ucy56XG4gIHBsYW5lIiwiZm9udFNpemUgPSAxNlxuXG5tYWtlTG9va1VwID0gKHRleHQsIGNvbG9yKSAtPlxuICBoYXNoID0ge31cbiAgZm9yIGNoYXJhY3RlciBpbiB0ZXh0XG4gICAgaWYgbm90IGhhc2hbY2hhcmFjdGVyXT9cbiAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2NhbnZhcydcbiAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCAnMmQnXG4gICAgICBjb250ZXh0LmZvbnQgPSBmb250U2l6ZSoyICsgJ3B4IG1vbm9zcGFjZSdcbiAgICAgIGNhbnZhcy53aWR0aCA9IGNvbnRleHQubWVhc3VyZVRleHQoY2hhcmFjdGVyKS53aWR0aCArIDJcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBmb250U2l6ZSAqIDIrMTBcbiAgICAgIGNvbnRleHQudGV4dEFsaWduID0gJ2NlbnRlcidcbiAgICAgIGNvbnRleHQudGV4dEJhc2VsaW5lID0gJ21pZGRsZSdcbiAgICAgIGNvbnRleHQuZm9udCA9IGZvbnRTaXplKjIgKyAncHggbW9ub3NwYWNlJ1xuICAgICAgY29udGV4dC5jbGVhclJlY3QgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0XG4gICAgICBjb250ZXh0LmZpbGxDb2xvciA9IGNvbG9yXG4gICAgICBjb250ZXh0LmZpbGxUZXh0IGNoYXJhY3RlciwgY2FudmFzLndpZHRoLzItMiwgY2FudmFzLmhlaWdodC8yXG4gICAgICB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUgY2FudmFzXG4gICAgICBmYWNlID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsIHsgbWFwOiB0ZXh0dXJlLCBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLCB0cmFuc3BhcmVudDogdHJ1ZX1cbiAgICAgIHF1YWQgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSBjYW52YXMud2lkdGgvMi01LCBjYW52YXMuaGVpZ2h0LzJcbiAgICAgIGxldHRlciA9IG5ldyBUSFJFRS5NZXNoIHF1YWQsIGZhY2VcbiAgICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlXG4gICAgICBoYXNoW2NoYXJhY3Rlcl0gPSBsZXR0ZXJcbiAgcmV0dXJuIGhhc2hcblxubWFrZVRleHQgPSAodGV4dCwgaGFzaCwgbWF4V2lkdGgsIG1heEhlaWdodCkgLT5cbiAgZ3JvdXAgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKVxuICBsaW5lID0gbmV3IFRIUkVFLk9iamVjdDNEKClcbiAgeVBvcyA9IDBcbiAgZm9yIGNoYXJhY3RlciBpbiB0ZXh0IHdoZW4gTWF0aC5hYnMgeVBvcyA8IG1heEhlaWdodFxuICAgIHhQb3MgPSAwXG4gICAgbGV0dGVyID0gbmV3IFRIUkVFLk1lc2goaGFzaFtjaGFyYWN0ZXJdLmdlb21ldHJ5LCBoYXNoW2NoYXJhY3Rlcl0ubWF0ZXJpYWwpXG4gICAgZm9yIGVhY2hMZXR0ZXIgaW4gbGluZS5jaGlsZHJlblxuICAgICAgeFBvcyArPSBlYWNoTGV0dGVyLmdlb21ldHJ5LndpZHRoKzFcbiAgICBsZXR0ZXIucG9zaXRpb24ueCA9IHhQb3NcbiAgICBsaW5lLnBvc2l0aW9uLnggPSAteFBvcy8yXG4gICAgaWYgeFBvcytsZXR0ZXIuZ2VvbWV0cnkud2lkdGggPiBtYXhXaWR0aFxuICAgICAgbGluZS5hZGQgbGV0dGVyXG4gICAgICB4UG9zID0gMFxuICAgICAgeVBvcyAtPSBsZXR0ZXIuZ2VvbWV0cnkuaGVpZ2h0XG4gICAgICBsaW5lLnBvc2l0aW9uLnkgPSB5UG9zXG4gICAgICBncm91cC5hZGQgbGluZVxuICAgICAgbGluZSA9IG5ldyBUSFJFRS5PYmplY3QzRCgpXG4gICAgZWxzZVxuICAgICAgbGV0dGVyLnBvc2l0aW9uLnggPSB4UG9zXG4gICAgICBsaW5lLnBvc2l0aW9uLnggPSAteFBvcy8yXG4gICAgICBsaW5lLmFkZChsZXR0ZXIpXG4gIHlQb3MgLT0gbGV0dGVyLmdlb21ldHJ5LmhlaWdodFxuICBsaW5lLnBvc2l0aW9uLnkgPSB5UG9zXG4gIGdyb3VwLmFkZCBsaW5lXG4gIGdyb3VwLnBvc2l0aW9uLnkgPSBNYXRoLmFicyh5UG9zLzIpK2xldHRlci5nZW9tZXRyeS5oZWlnaHQvMlxuICByZXR1cm4gZ3JvdXBcblxubW9kdWxlLmV4cG9ydHMgPSB0ZXh0TWFrZXIgPSAobm9kZSkgLT5cbiAgdGFibGUgPSBtYWtlTG9va1VwIG5vZGUudGFnLCBub2RlLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yXG4gIHRleHRFbGVtID0gbWFrZVRleHQgbm9kZS50YWcsIHRhYmxlLCBub2RlLm9wdGlvbnMud2lkdGgsIG5vZGUub3B0aW9ucy5oZWlnaHRcbiAgdGV4dEVsZW0udHJhbnNsYXRlWiBub2RlLm9wdGlvbnMuelxuICB0ZXh0RWxlbS50cmFuc2xhdGVYIG5vZGUub3B0aW9ucy54XG4gIHRleHRFbGVtLnRyYW5zbGF0ZVkgbm9kZS5vcHRpb25zLnlcbiAgdGV4dEVsZW0iLCJ3Z2lmeSA9XG4gIHJlbmRlckJsb2NrOiAoYmxvY2ssIG5vZGUpIC0+XG4gICAgbm9kZS5pbm5lckhUTUwgPSBibG9ja1xuICAgIG5vZGUuZ2V0R0xpZnlJbnN0YW5jZSA9IC0+XG4gICAgICByZXR1cm4gaW5zdGFuY2VcbiAgICBpbnN0YW5jZTpcbiAgICAgIG5vZGU6IG5vZGVcbiAgICAgIHNldFNpemU6ICh3aWR0aCwgaGVpZ2h0KSAtPlxuICAgICAgICBAd2lkdGggPz0gbm9kZS5zY3JvbGxXaWR0aFxuICAgICAgICBAaGVpZ2h0ID89IG5vZGUuc2Nyb2xsSGVpZ2h0XG4gICAgICAgIGlmIEB3aWR0aCBpc250IEBjYW52YXMud2lkdGggb3IgQGhlaWdodCBpc250IEBjYW52YXMuaGVpZ2h0XG4gICAgICAgICAgQHJlbmRlclxuICAgICAgcmVuZGVyOiAoYmxvY2spIC0+XG4gICAgICAgICMgcmVuZGVyXG4gICAgaW5zdGFuY2VcbiAgcG9wdWxhdGVDb250ZW50OiAtPlxuICAgIHNjcmlwdHMgPSAoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCAnW3R5cGU9XCJ0ZXh0L3dlYmdsaWZ5XCJdJykuY29uY2F0IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwgJ1tzcmMqPVwid2ViZ2xpZnkuanNcIl0nXG4gICAgaW5zdGFuY2VzID0gW11cbiAgICBmb3Igc2NyaXB0IGluIHNjcmlwdHNcbiAgICAgIGNvbnRpbnVlIGlmIG5vdCBzY3JpcHQuaW5uZXJIVE1MP1xuICAgICAgbm9kZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsIHNjcmlwdC5nZXRBdHRyaWJ1dGUoJ3RhcmdldCcpIG9yICdib2R5J1xuICAgICAgaWYgbm9kZXMubGVuZ3RoP1xuICAgICAgICBpbnN0YW5jZXMucHVzaCB3Z2lmeS5yZW5kZXJCbG9jayBzY3JpcHQuaW5uZXJIVE1MLCBub2Rlc1swXVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCAoZXZ0KSAtPlxuICAgICAgZm9yIGluc3RhbmNlIGluIGluc3RhbmNlc1xuICAgICAgICBpbnN0YW5jZS5zZXRTaXplIiwibW9kdWxlLmV4cG9ydHMgPSBkcmVzc2VyID0gKG5vZGUpIC0+XG4gIG5vZGUub3B0aW9ucy54ID89IDBcbiAgbm9kZS5vcHRpb25zLnkgPz0gMFxuICBub2RlLm9wdGlvbnMueiA9IG5vZGUuZGVwdGgqMlxuICBub2RlLm9wdGlvbnMuaGVpZ2h0ID89IHdpbmRvdy5pbm5lckhlaWdodFxuICBub2RlLm9wdGlvbnMud2lkdGggPz0gd2luZG93LmlubmVyV2lkdGhcbiAgbm9kZS5vcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSAnI0ZGRkZGRidcbiAgbm9kZS5vcHRpb25zLmNoaWxkVHlwZSA/PSAndmVydGljYWwnXG4gIGZvciBjaGlsZCwgaW5kZXggaW4gbm9kZS5jaGlsZHJlblxuICAgIGNoaWxkLm9wdGlvbnMudHlwZSA9ICdibG9jaycgaWYgbm9kZS5vcHRpb25zLmNoaWxkVHlwZSBpcyAnaG9yaXpvbnRhbCcgb3Igbm9kZS5vcHRpb25zLmNoaWxkVHlwZSBpcyAndmVydGljYWwnXG4gICAgY2hpbGQub3B0aW9ucy50eXBlID89IG5vZGUub3B0aW9ucy5jaGlsZFR5cGVcbiAgICBpZiBjaGlsZC5vcHRpb25zLng/IG9yIGNoaWxkLm9wdGlvbnMueT8gb3IgY2hpbGQub3B0aW9ucy5oZWlnaHQ/IG9yIGNoaWxkLm9wdGlvbnMud2lkdGg/XG4gICAgICBjaGlsZC5vcHRpb25zLnggPSAobm9kZS5vcHRpb25zLnggKyAoKGNoaWxkLm9wdGlvbnMueC8xMDApKihub2RlLm9wdGlvbnMud2lkdGgpKSkvMiBpZiBjaGlsZC5vcHRpb25zLng/XG4gICAgICBjaGlsZC5vcHRpb25zLnkgPSAobm9kZS5vcHRpb25zLnkgKyAoKGNoaWxkLm9wdGlvbnMueS8xMDApKihub2RlLm9wdGlvbnMuaGVpZ2h0KSkpLzIgaWYgY2hpbGQub3B0aW9ucy55P1xuICAgICAgY2hpbGQub3B0aW9ucy5oZWlnaHQgPSAoKGNoaWxkLm9wdGlvbnMuaGVpZ2h0LzEwMCkqbm9kZS5vcHRpb25zLmhlaWdodCkgaWYgY2hpbGQub3B0aW9ucy5oZWlnaHQ/XG4gICAgICBjaGlsZC5vcHRpb25zLndpZHRoID0gKChjaGlsZC5vcHRpb25zLndpZHRoLzEwMCkqbm9kZS5vcHRpb25zLndpZHRoKSBpZiBjaGlsZC5vcHRpb25zLndpZHRoP1xuICAgICAgY2hpbGQub3B0aW9ucy56ICs9IDFcbiAgICBzd2l0Y2ggbm9kZS5vcHRpb25zLmNoaWxkVHlwZVxuICAgICAgd2hlbiAnaG9yaXpvbnRhbCdcbiAgICAgICAgY2hpbGQub3B0aW9ucy54ID89IG5vZGUub3B0aW9ucy53aWR0aCooaW5kZXgvbm9kZS5jaGlsZHJlbi5sZW5ndGgpLSgobm9kZS5vcHRpb25zLndpZHRoLzIpLSgobm9kZS5vcHRpb25zLndpZHRoL25vZGUuY2hpbGRyZW4ubGVuZ3RoKS8yKSkrbm9kZS5vcHRpb25zLnhcbiAgICAgICAgY2hpbGQub3B0aW9ucy55ID89IG5vZGUub3B0aW9ucy55XG4gICAgICAgIGNoaWxkLm9wdGlvbnMud2lkdGggPz0gbm9kZS5vcHRpb25zLndpZHRoL25vZGUuY2hpbGRyZW4ubGVuZ3RoXG4gICAgICAgIGNoaWxkLm9wdGlvbnMuaGVpZ2h0ID89IG5vZGUub3B0aW9ucy5oZWlnaHRcbiAgICAgIHdoZW4gJ3ZlcnRpY2FsJ1xuICAgICAgICBjaGlsZC5vcHRpb25zLnkgPz0gKChub2RlLm9wdGlvbnMuaGVpZ2h0LzIpLSgobm9kZS5vcHRpb25zLmhlaWdodC9ub2RlLmNoaWxkcmVuLmxlbmd0aCkvMikpLShub2RlLm9wdGlvbnMuaGVpZ2h0KihpbmRleC9ub2RlLmNoaWxkcmVuLmxlbmd0aCkpK25vZGUub3B0aW9ucy55XG4gICAgICAgIGNoaWxkLm9wdGlvbnMueCA/PSBub2RlLm9wdGlvbnMueFxuICAgICAgICBjaGlsZC5vcHRpb25zLmhlaWdodCA/PSBub2RlLm9wdGlvbnMuaGVpZ2h0L25vZGUuY2hpbGRyZW4ubGVuZ3RoXG4gICAgICAgIGNoaWxkLm9wdGlvbnMud2lkdGggPz0gbm9kZS5vcHRpb25zLndpZHRoXG4gICAgICB3aGVuICd0ZXh0J1xuICAgICAgICBjaGlsZC5vcHRpb25zLnggPz0gbm9kZS5vcHRpb25zLnhcbiAgICAgICAgY2hpbGQub3B0aW9ucy55ID89IG5vZGUub3B0aW9ucy55XG4gICAgICAgIGNoaWxkLm9wdGlvbnMud2lkdGggPz0gbm9kZS5vcHRpb25zLndpZHRoXG4gICAgICAgIGNoaWxkLm9wdGlvbnMuaGVpZ2h0ID89IG5vZGUub3B0aW9ucy5oZWlnaHRcbiAgICAgICAgaWYgbm9kZS5vcHRpb25zLmJhY2tncm91bmRDb2xvciBpcyAnIzAwMDAwMCcgb3Igbm9kZS5vcHRpb25zLmJhY2tncm91bmRDb2xvciBpcyAnYmxhY2snXG4gICAgICAgICAgY2hpbGQub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gJ3doaXRlJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgY2hpbGQub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgaXMgJ2JsYWNrJ1xuICAgICAgd2hlbiAnaW1hZ2UnXG4gICAgICAgIGNoaWxkLm9wdGlvbnMueCA/PSBub2RlLm9wdGlvbnMueFxuICAgICAgICBjaGlsZC5vcHRpb25zLnkgPz0gbm9kZS5vcHRpb25zLnlcbiAgICAgICAgY2hpbGQub3B0aW9ucy53aWR0aCA/PSBub2RlLm9wdGlvbnMud2lkdGhcbiAgICAgICAgY2hpbGQub3B0aW9ucy5oZWlnaHQgPz0gbm9kZS5vcHRpb25zLmhlaWdodFxuICAgICAgICBmb3Iga2V5LCB2YWx1ZSBvZiBjaGlsZC5vcHRpb25zXG4gICAgICAgICAgaWYga2V5WzBdIGlzICcvJyB0aGVuIGNoaWxkLnRhZyArPSAnOicgKyBrZXlcbiAgICBkcmVzc2VyIGNoaWxkXG4gIG5vZGUiLCJtb2R1bGUuZXhwb3J0cyA9IHBhcnNlciA9ICh0ZXh0KSAtPlxuICBsaW5lcyA9IHRleHQuc3BsaXQgJ1xcbidcbiAgbWFsZm9ybWVkID0gW11cbiAgZm9yIGxpbmUgaW4gbGluZXNcbiAgICBmaXJzdE5vbldoaXRlU3BhY2VJbmRleCA9IGxpbmUuaW5kZXhPZiAvXFxTLy5leGVjIGxpbmVcbiAgICB3aGl0ZXNwYWNlID0gbGluZS5zbGljZSgwLCBmaXJzdE5vbldoaXRlU3BhY2VJbmRleClcbiAgICBpZiBsaW5lLmluZGV4T2YoJzonKSBpc250IC0xXG4gICAgICB0YWdTcGFjZSA9IGxpbmUuc2xpY2UgZmlyc3ROb25XaGl0ZVNwYWNlSW5kZXgsIGxpbmUuaW5kZXhPZiAnOidcbiAgICAgIG9wdGlvbnMgPSBsaW5lLnNsaWNlKGxpbmUuaW5kZXhPZignOicpKzEpLnJlcGxhY2UgL1xccy9nLCAnJ1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMuc3BsaXQgJywnXG4gICAgICBvcHRpb25zID0gKG9wdGlvbi5zcGxpdCAnOicgZm9yIG9wdGlvbiBpbiBvcHRpb25zKVxuICAgICAgbWFsZm9ybWVkLnB1c2ggW3doaXRlc3BhY2UubGVuZ3RoLCB0YWdTcGFjZSwgb3B0aW9uc11cbiAgICBlbHNlXG4gICAgICBjb250ZW50ID0gbGluZS5zbGljZShmaXJzdE5vbldoaXRlU3BhY2VJbmRleClcbiAgICAgIG1hbGZvcm1lZC5wdXNoIFt3aGl0ZXNwYWNlLmxlbmd0aCwgY29udGVudCwgW11dXG4gIGZvciBpIGluIFsxLi5tYWxmb3JtZWQubGVuZ3RoLTFdXG4gICAgaWYgbWFsZm9ybWVkW2ldWzFdLmxlbmd0aCBpcyAwIGFuZCBtYWxmb3JtZWRbaS0xXVsyXS5sZW5ndGggaXMgMCBhbmQgbWFsZm9ybWVkW2ldWzBdIGlzIG1hbGZvcm1lZFtpLTFdWzBdXG4gICAgICBtYWxmb3JtZWRbaS0xXVsyXSA9IG1hbGZvcm1lZFtpLTFdWzJdLmNvbmNhdCBtYWxmb3JtZWRbaV1bMl1cbiAgcHJvcGVybHlGb3JtZWQgPSBbXVxuICBwcm9wZXJseUZvcm1lZC5wdXNoIG9iamVjdGlmaWVyIGl0ZW0gZm9yIGl0ZW0gaW4gbWFsZm9ybWVkIHdoZW4gaXRlbVsxXS5sZW5ndGggaXNudCAwXG4gIGluaGVyaXRlciBzZWdtZW50ZXIgcHJvcGVybHlGb3JtZWRcblxuXG5vYmplY3RpZmllciA9IChlbGVtZW50KSAtPlxuICBvYmplY3QgPVxuICAgIGRlcHRoOiBlbGVtZW50WzBdXG4gICAgdGFnOiBlbGVtZW50WzFdXG4gICAgb3B0aW9uczoge31cbiAgICBjaGlsZHJlbjogW11cbiAgb2JqZWN0Lm9wdGlvbnNbb3B0aW9uWzBdXSA9IG9wdGlvblsxXSBmb3Igb3B0aW9uIGluIGVsZW1lbnRbMl1cbiAgb2JqZWN0XG5cbnNlZ21lbnRlciA9IChhcnJheSkgLT5cbiAgcmVzdWx0cyA9IFtdXG4gIHJlY3Vyc2VyID0gKGFycmF5MiwgcG9zaXRpb24pIC0+XG4gICAgZm9yIGVsZW1lbnQsIGluZGV4IGluIGFycmF5MlxuICAgICAgZm9yIGkgaW4gW2FycmF5Mi5sZW5ndGgtMS4uaW5kZXgrMV0gYnkgLTFcbiAgICAgICAgaWYgZWxlbWVudC5kZXB0aCBpcyBhcnJheTJbaV0uZGVwdGhcbiAgICAgICAgICByZWN1cnNlciBhcnJheTIuc2xpY2UoaSksIHBvc2l0aW9uK2lcbiAgICAgICAgICByZWN1cnNlciBhcnJheTIuc2xpY2UoMCwgaSksIHBvc2l0aW9uXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmVzdWx0c1twb3NpdGlvbl0gPSBhcnJheTJcbiAgcmVtb3ZlciA9IChhcnJheTIpIC0+XG4gICAgcmVzdWx0czIgPSBbXVxuICAgIGZvciBlbGVtZW50IGluIGFycmF5MlxuICAgICAgaWYgZWxlbWVudD9cbiAgICAgICAgcmVzdWx0czIucHVzaCBlbGVtZW50XG4gICAgcmV0dXJuIHJlc3VsdHMyXG4gIHJlY3Vyc2VyIGFycmF5LCAwXG4gIHJlc3VsdHMgPSByZW1vdmVyIHJlc3VsdHNcbiAgcmVzdWx0c1xuXG5pbmhlcml0ZXIgPSAoYXJyYXkpIC0+XG4gIGZvciBzdWJBcnJheSBpbiBhcnJheVxuICAgIGZvciBqIGluIFtzdWJBcnJheS5sZW5ndGgtMS4uMV0gYnkgLTFcbiAgICAgIGNoaWxkID0gc3ViQXJyYXlbal1cbiAgICAgIHBhcmVudCA9IHN1YkFycmF5W2otMV1cbiAgICAgIHBhcmVudC5jaGlsZHJlbi5wdXNoIGNoaWxkXG4gIGZvciBpIGluIFthcnJheS5sZW5ndGgtMS4uMF0gYnkgLTFcbiAgICBzdWJBcnJheSA9IGFycmF5W2ldXG4gICAgbG9zdENoaWxkID0gc3ViQXJyYXlbMF1cbiAgICBmb3IgaiBpbiBbaS0xLi4wXSBieSAtMSB3aGVuIGkgaXNudCAwXG4gICAgICBwb3RlbnRpYWxIb21lID0gYXJyYXlbal1cbiAgICAgIHJvb3QgPSBwb3RlbnRpYWxIb21lWzBdXG4gICAgICBpZiByb290LmRlcHRoIDwgbG9zdENoaWxkLmRlcHRoXG4gICAgICAgIGZvciBwb3RlbnRpYWxTaWJsaW5nLCBpbmRleCBpbiBwb3RlbnRpYWxIb21lXG4gICAgICAgICAgaWYgcG90ZW50aWFsU2libGluZy5kZXB0aCBpcyBsb3N0Q2hpbGQuZGVwdGhcbiAgICAgICAgICAgIHBvdGVudGlhbEhvbWVbaW5kZXgtMV0uY2hpbGRyZW4uc3BsaWNlIDEsIDAsIGxvc3RDaGlsZFxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgYnJlYWtcbiAgYXJyYXlbMF1bMF0iLCJtb2R1bGUuZXhwb3J0cyA9XG4gIHJlbmRlcjogKCktPlxuICAgIEByZW5kZXJlci5yZW5kZXIoQHNjZW5lLCBAY2FtZXJhKVxuICBpbml0OiAoc2NlbmUsIGNhbWVyYSkgLT5cbiAgICByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyIHthbnRpYWxpYXM6IHRydWUsIHByZWNpc2lvbjogJ2hpZ2hwJ31cbiAgICByZW5kZXJlci5zZXRTaXplIHdpbmRvdy5pbm5lcldpZHRoKzEwLCB3aW5kb3cuaW5uZXJIZWlnaHQrMTBcbiAgICBzY2VuZS5hZGQgY2FtZXJhXG4gICAgQHJlbmRlcmVyID0gcmVuZGVyZXJcbiAgICBAc2NlbmUgPSBzY2VuZVxuICAgIEBjYW1lcmEgPSBjYW1lcmFcbiAgICBAZG9tRWxlbWVudCA9IHJlbmRlcmVyLmRvbUVsZW1lbnQiLCJjb250YWluZXJNYWtlciA9IHJlcXVpcmUgJy4vY29udGFpbmVyTW9kdWxlLmNvZmZlZSdcbnJlbmRlcmVyID0gcmVxdWlyZSAnLi4vcmVuZGVyZXIvcmVuZGVyZXIuY29mZmVlJ1xuXG5jcmVhdGVJbWFnZU1hdGVyaWFsID0gKHVybCkgLT5cbiAgdGV4dHVyZSA9IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmUgdXJsLCBuZXcgVEhSRUUuVVZNYXBwaW5nKCksIC0+XG4gICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWVcbiAgICByZW5kZXJlci5yZW5kZXIoKVxuICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCB7bWFwOiB0ZXh0dXJlLCBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlfVxuICBtYXRlcmlhbFxuXG5tb2R1bGUuZXhwb3J0cyA9IGltYWdlTWFrZXIgPSAobm9kZSkgLT5cbiAgbWF0ZXJpYWwgPSBjcmVhdGVJbWFnZU1hdGVyaWFsIG5vZGUudGFnXG4gIGNvbnRhaW5lck1ha2VyIG5vZGUsIG1hdGVyaWFsIiwidGV4dGVyID0gcmVxdWlyZSAnLi4vQ29uc3RydWN0b3JNb2R1bGVzL3RleHRNb2R1bGUuY29mZmVlJ1xuaW1hZ2VyID0gcmVxdWlyZSAnLi4vQ29uc3RydWN0b3JNb2R1bGVzL2ltZ01vZHVsZS5jb2ZmZWUnXG5jb250YWluZXIgPSByZXF1aXJlICcuLi9Db25zdHJ1Y3Rvck1vZHVsZXMvY29udGFpbmVyTW9kdWxlLmNvZmZlZSdcblxubW9kdWxlLmV4cG9ydHMgPSBsYXlvdXRNYWtlciA9IChzeW50YXgpIC0+XG4gIHdpZHRoID0gc3ludGF4Lm9wdGlvbnMud2lkdGhcbiAgaGVpZ2h0ID0gc3ludGF4Lm9wdGlvbnMuaGVpZ2h0XG4gIHZpZXdBbmdsZSA9IDQ1XG4gIGFzcGVjdCA9IHdpZHRoL2hlaWdodFxuICBuZWFyID0gMC4xXG4gIGZhciA9IDEwMDAwXG4gIHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKVxuICByZW5kZXJlci5zZXRTaXplIHdpZHRoLCBoZWlnaHRcbiAgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIHZpZXdBbmdsZSwgYXNwZWN0LCBuZWFyLCBmYXJcbiAgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKVxuICBjYW1lcmEucG9zaXRpb24uc2V0IDAsIDAsICh3aW5kb3cuaW5uZXJXaWR0aCoyKS8zXG4gIHJlY3Vyc2l2ZVN0YWdlciA9IChub2RlKSAtPlxuICAgIGlmIG5vZGUub3B0aW9ucy50eXBlIGlzICd0ZXh0J1xuICAgICAgc2NlbmUuYWRkIHRleHRlciBub2RlXG4gICAgZWxzZSBpZiBub2RlLm9wdGlvbnMudHlwZSBpcyAnYmxvY2snXG4gICAgICBzY2VuZS5hZGQgY29udGFpbmVyIG5vZGVcbiAgICBlbHNlIGlmIG5vZGUub3B0aW9ucy50eXBlIGlzICdpbWFnZSdcbiAgICAgIHNjZW5lLmFkZCBpbWFnZXIgbm9kZVxuICAgIHJlY3Vyc2l2ZVN0YWdlciBjaGlsZCBmb3IgY2hpbGQgaW4gbm9kZS5jaGlsZHJlblxuICByZWN1cnNpdmVTdGFnZXIgc3ludGF4XG4gIG9iamVjdCA9XG4gICAgc2NlbmU6IHNjZW5lLFxuICAgIGNhbWVyYTogY2FtZXJhXG4gIG9iamVjdCIsIiMjI1xuICogV2ViR2xpZnlcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9Ebk1sbHIvd2ViZ2xpZnlcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgRGFuaWVsIE1pbGxlclxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuIyMjXG5cbmRyZXNzZXIgPSByZXF1aXJlICcuLi9jb21waWxlci9kcmVzc2VyLmNvZmZlZSdcbmxheW91dCA9IHJlcXVpcmUgJy4uL0xheW91dE1vZHVsZXMvbGF5b3V0TW9kdWxlLmNvZmZlZSdcbnBhcnNlciA9IHJlcXVpcmUgJy4uL3BhcnNlcnMvd2ViZ2xpZnlQQVJTRVIuY29mZmVlJ1xucmVuZGVyZXIgPSByZXF1aXJlICcuLi9yZW5kZXJlci9yZW5kZXJlci5jb2ZmZWUnXG5cblxubW9kdWxlLmV4cG9ydHMgPSBXZWJHbGlmeSA9IChkYXRhKSAtPlxuICB2YWx1ZSA9IGRhdGEuZGF0YVxuICBzY2VuZSA9IGxheW91dCBkcmVzc2VyIHBhcnNlciB2YWx1ZVxuICByZW5kZXJlci5pbml0IHNjZW5lLnNjZW5lLCBzY2VuZS5jYW1lcmFcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCByZW5kZXJlci5kb21FbGVtZW50XG4gIHJlbmRlcmVyLnJlbmRlcigpIiwiaHRtbHBhcnNlID0gcmVxdWlyZSAnaHRtbHBhcnNlcidcblxuZmluZEVsZW1lbnRzQnlUeXBlID0gKHR5cGUsIGVsZW1lbnQpIC0+XG4gIHJlc3VsdHMgPSBbXVxuICByZWN1cnNlU2VhcmNoID0gKHR5cGUsIGVsZW1lbnQpIC0+XG4gICAgZm9yIG5vZGUgaW4gZWxlbWVudFxuICAgICAgaWYgbm9kZS50eXBlIGlzIHR5cGVcbiAgICAgICAgcmVzdWx0cy5wdXNoIG5vZGUuZGF0YVxuICAgICAgcmVjdXJzZVNlYXJjaCB0eXBlLCBub2RlLmNoaWxkcmVuIGlmIG5vZGUuY2hpbGRyZW5cbiAgcmVjdXJzZVNlYXJjaCB0eXBlLCBlbGVtZW50XG4gIHJlc3VsdHNcblxuY2xhc3MgSFRNTHBhcnNlclxuICBjb25zdHJ1Y3RvcjogKEB0eXBlKSAtPlxuICBwYXJzZTogKGh0bWwpIC0+XG4gICAgaGFuZGxlciA9IG5ldyBodG1scGFyc2UuRGVmYXVsdEhhbmRsZXIgKGVycm9yLCBkb20pIC0+XG4gICAgICBpZiBlcnJvclxuICAgICAgICBjb25zb2xlLmxvZyAnZXJyb3InXG4gICAgICBlbHNlXG4gICAgICAgIEBkaXZzID0gZmluZEVsZW1lbnRzQnlUeXBlICdkaXYnLCBkb21cbiAgICAgICAgQHRleHQgPSBmaW5kRWxlbWVudHNCeVR5cGUgJ3RleHQnLCBkb21cbiAgICBwYXJzZXIgPSBuZXcgaHRtbHBhcnNlLlBhcnNlcihoYW5kbGVyKVxuICAgIHBhcnNlci5wYXJzZUNvbXBsZXRlIGh0bWxcbiAgICB7ZGl2OiBoYW5kbGVyLmRpdnMsIHRleHQ6IGhhbmRsZXIudGV4dH1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEhUTUxwYXJzZXIiLCIoZnVuY3Rpb24oX19maWxlbmFtZSxfX2Rpcm5hbWUpey8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuQ29weXJpZ2h0IDIwMTAsIDIwMTEsIENocmlzIFdpbmJlcnJ5IDxjaHJpc0B3aW5iZXJyeS5uZXQ+LiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG9cbmRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlXG5yaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3JcbnNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HU1xuSU4gVEhFIFNPRlRXQVJFLlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiB2MS43LjYgKi9cblxuKGZ1bmN0aW9uICgpIHtcblxuZnVuY3Rpb24gcnVubmluZ0luTm9kZSAoKSB7XG5cdHJldHVybihcblx0XHQodHlwZW9mIHJlcXVpcmUpID09IFwiZnVuY3Rpb25cIlxuXHRcdCYmXG5cdFx0KHR5cGVvZiBleHBvcnRzKSA9PSBcIm9iamVjdFwiXG5cdFx0JiZcblx0XHQodHlwZW9mIG1vZHVsZSkgPT0gXCJvYmplY3RcIlxuXHRcdCYmXG5cdFx0KHR5cGVvZiBfX2ZpbGVuYW1lKSA9PSBcInN0cmluZ1wiXG5cdFx0JiZcblx0XHQodHlwZW9mIF9fZGlybmFtZSkgPT0gXCJzdHJpbmdcIlxuXHRcdCk7XG59XG5cbmlmICghcnVubmluZ0luTm9kZSgpKSB7XG5cdGlmICghdGhpcy5UYXV0b2xvZ2lzdGljcylcblx0XHR0aGlzLlRhdXRvbG9naXN0aWNzID0ge307XG5cdGVsc2UgaWYgKHRoaXMuVGF1dG9sb2dpc3RpY3MuTm9kZUh0bWxQYXJzZXIpXG5cdFx0cmV0dXJuOyAvL05vZGVIdG1sUGFyc2VyIGFscmVhZHkgZGVmaW5lZCFcblx0dGhpcy5UYXV0b2xvZ2lzdGljcy5Ob2RlSHRtbFBhcnNlciA9IHt9O1xuXHRleHBvcnRzID0gdGhpcy5UYXV0b2xvZ2lzdGljcy5Ob2RlSHRtbFBhcnNlcjtcbn1cblxuLy9UeXBlcyBvZiBlbGVtZW50cyBmb3VuZCBpbiB0aGUgRE9NXG52YXIgRWxlbWVudFR5cGUgPSB7XG5cdCAgVGV4dDogXCJ0ZXh0XCIgLy9QbGFpbiB0ZXh0XG5cdCwgRGlyZWN0aXZlOiBcImRpcmVjdGl2ZVwiIC8vU3BlY2lhbCB0YWcgPCEuLi4+XG5cdCwgQ29tbWVudDogXCJjb21tZW50XCIgLy9TcGVjaWFsIHRhZyA8IS0tLi4uLS0+XG5cdCwgU2NyaXB0OiBcInNjcmlwdFwiIC8vU3BlY2lhbCB0YWcgPHNjcmlwdD4uLi48L3NjcmlwdD5cblx0LCBTdHlsZTogXCJzdHlsZVwiIC8vU3BlY2lhbCB0YWcgPHN0eWxlPi4uLjwvc3R5bGU+XG5cdCwgVGFnOiBcInRhZ1wiIC8vQW55IHRhZyB0aGF0IGlzbid0IHNwZWNpYWxcbn1cblxuZnVuY3Rpb24gUGFyc2VyIChoYW5kbGVyLCBvcHRpb25zKSB7XG5cdHRoaXMuX29wdGlvbnMgPSBvcHRpb25zID8gb3B0aW9ucyA6IHsgfTtcblx0aWYgKHRoaXMuX29wdGlvbnMuaW5jbHVkZUxvY2F0aW9uID09IHVuZGVmaW5lZCkge1xuXHRcdHRoaXMuX29wdGlvbnMuaW5jbHVkZUxvY2F0aW9uID0gZmFsc2U7IC8vRG8gbm90IHRyYWNrIGVsZW1lbnQgcG9zaXRpb24gaW4gZG9jdW1lbnQgYnkgZGVmYXVsdFxuXHR9XG5cblx0dGhpcy52YWxpZGF0ZUhhbmRsZXIoaGFuZGxlcik7XG5cdHRoaXMuX2hhbmRsZXIgPSBoYW5kbGVyO1xuXHR0aGlzLnJlc2V0KCk7XG59XG5cblx0Ly8qKlwiU3RhdGljXCIqKi8vXG5cdC8vUmVndWxhciBleHByZXNzaW9ucyB1c2VkIGZvciBjbGVhbmluZyB1cCBhbmQgcGFyc2luZyAoc3RhdGVsZXNzKVxuXHRQYXJzZXIuX3JlVHJpbSA9IC8oXlxccyt8XFxzKyQpL2c7IC8vVHJpbSBsZWFkaW5nL3RyYWlsaW5nIHdoaXRlc3BhY2Vcblx0UGFyc2VyLl9yZVRyaW1Db21tZW50ID0gLyheXFwhLS18LS0kKS9nOyAvL1JlbW92ZSBjb21tZW50IHRhZyBtYXJrdXAgZnJvbSBjb21tZW50IGNvbnRlbnRzXG5cdFBhcnNlci5fcmVXaGl0ZXNwYWNlID0gL1xccy9nOyAvL1VzZWQgdG8gZmluZCBhbnkgd2hpdGVzcGFjZSB0byBzcGxpdCBvblxuXHRQYXJzZXIuX3JlVGFnTmFtZSA9IC9eXFxzKihcXC8/KVxccyooW15cXHNcXC9dKykvOyAvL1VzZWQgdG8gZmluZCB0aGUgdGFnIG5hbWUgZm9yIGFuIGVsZW1lbnRcblxuXHQvL1JlZ3VsYXIgZXhwcmVzc2lvbnMgdXNlZCBmb3IgcGFyc2luZyAoc3RhdGVmdWwpXG5cdFBhcnNlci5fcmVBdHRyaWIgPSAvL0ZpbmQgYXR0cmlidXRlcyBpbiBhIHRhZ1xuXHRcdC8oW149PD5cXFwiXFwnXFxzXSspXFxzKj1cXHMqXCIoW15cIl0qKVwifChbXj08PlxcXCJcXCdcXHNdKylcXHMqPVxccyonKFteJ10qKSd8KFtePTw+XFxcIlxcJ1xcc10rKVxccyo9XFxzKihbXidcIlxcc10rKXwoW149PD5cXFwiXFwnXFxzXFwvXSspL2c7XG5cdFBhcnNlci5fcmVUYWdzID0gL1tcXDxcXD5dL2c7IC8vRmluZCB0YWcgbWFya2Vyc1xuXG5cdC8vKipQdWJsaWMqKi8vXG5cdC8vTWV0aG9kcy8vXG5cdC8vUGFyc2VzIGEgY29tcGxldGUgSFRNTCBhbmQgcHVzaGVzIGl0IHRvIHRoZSBoYW5kbGVyXG5cdFBhcnNlci5wcm90b3R5cGUucGFyc2VDb21wbGV0ZSA9IGZ1bmN0aW9uIFBhcnNlciRwYXJzZUNvbXBsZXRlIChkYXRhKSB7XG5cdFx0dGhpcy5yZXNldCgpO1xuXHRcdHRoaXMucGFyc2VDaHVuayhkYXRhKTtcblx0XHR0aGlzLmRvbmUoKTtcblx0fVxuXG5cdC8vUGFyc2VzIGEgcGllY2Ugb2YgYW4gSFRNTCBkb2N1bWVudFxuXHRQYXJzZXIucHJvdG90eXBlLnBhcnNlQ2h1bmsgPSBmdW5jdGlvbiBQYXJzZXIkcGFyc2VDaHVuayAoZGF0YSkge1xuXHRcdGlmICh0aGlzLl9kb25lKVxuXHRcdFx0dGhpcy5oYW5kbGVFcnJvcihuZXcgRXJyb3IoXCJBdHRlbXB0ZWQgdG8gcGFyc2UgY2h1bmsgYWZ0ZXIgcGFyc2luZyBhbHJlYWR5IGRvbmVcIikpO1xuXHRcdHRoaXMuX2J1ZmZlciArPSBkYXRhOyAvL0ZJWE1FOiB0aGlzIGNhbiBiZSBhIGJvdHRsZW5lY2tcblx0XHR0aGlzLnBhcnNlVGFncygpO1xuXHR9XG5cblx0Ly9UZWxscyB0aGUgcGFyc2VyIHRoYXQgdGhlIEhUTUwgYmVpbmcgcGFyc2VkIGlzIGNvbXBsZXRlXG5cdFBhcnNlci5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uIFBhcnNlciRkb25lICgpIHtcblx0XHRpZiAodGhpcy5fZG9uZSlcblx0XHRcdHJldHVybjtcblx0XHR0aGlzLl9kb25lID0gdHJ1ZTtcblx0XG5cdFx0Ly9QdXNoIGFueSB1bnBhcnNlZCB0ZXh0IGludG8gYSBmaW5hbCBlbGVtZW50IGluIHRoZSBlbGVtZW50IGxpc3Rcblx0XHRpZiAodGhpcy5fYnVmZmVyLmxlbmd0aCkge1xuXHRcdFx0dmFyIHJhd0RhdGEgPSB0aGlzLl9idWZmZXI7XG5cdFx0XHR0aGlzLl9idWZmZXIgPSBcIlwiO1xuXHRcdFx0dmFyIGVsZW1lbnQgPSB7XG5cdFx0XHRcdCAgcmF3OiByYXdEYXRhXG5cdFx0XHRcdCwgZGF0YTogKHRoaXMuX3BhcnNlU3RhdGUgPT0gRWxlbWVudFR5cGUuVGV4dCkgPyByYXdEYXRhIDogcmF3RGF0YS5yZXBsYWNlKFBhcnNlci5fcmVUcmltLCBcIlwiKVxuXHRcdFx0XHQsIHR5cGU6IHRoaXMuX3BhcnNlU3RhdGVcblx0XHRcdFx0fTtcblx0XHRcdGlmICh0aGlzLl9wYXJzZVN0YXRlID09IEVsZW1lbnRUeXBlLlRhZyB8fCB0aGlzLl9wYXJzZVN0YXRlID09IEVsZW1lbnRUeXBlLlNjcmlwdCB8fCB0aGlzLl9wYXJzZVN0YXRlID09IEVsZW1lbnRUeXBlLlN0eWxlKVxuXHRcdFx0XHRlbGVtZW50Lm5hbWUgPSB0aGlzLnBhcnNlVGFnTmFtZShlbGVtZW50LmRhdGEpO1xuXHRcdFx0dGhpcy5wYXJzZUF0dHJpYnMoZWxlbWVudCk7XG5cdFx0XHR0aGlzLl9lbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuXHRcdH1cblx0XG5cdFx0dGhpcy53cml0ZUhhbmRsZXIoKTtcblx0XHR0aGlzLl9oYW5kbGVyLmRvbmUoKTtcblx0fVxuXG5cdC8vUmVzZXRzIHRoZSBwYXJzZXIgdG8gYSBibGFuayBzdGF0ZSwgcmVhZHkgdG8gcGFyc2UgYSBuZXcgSFRNTCBkb2N1bWVudFxuXHRQYXJzZXIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gUGFyc2VyJHJlc2V0ICgpIHtcblx0XHR0aGlzLl9idWZmZXIgPSBcIlwiO1xuXHRcdHRoaXMuX2RvbmUgPSBmYWxzZTtcblx0XHR0aGlzLl9lbGVtZW50cyA9IFtdO1xuXHRcdHRoaXMuX2VsZW1lbnRzQ3VycmVudCA9IDA7XG5cdFx0dGhpcy5fY3VycmVudCA9IDA7XG5cdFx0dGhpcy5fbmV4dCA9IDA7XG5cdFx0dGhpcy5fbG9jYXRpb24gPSB7XG5cdFx0XHQgIHJvdzogMFxuXHRcdFx0LCBjb2w6IDBcblx0XHRcdCwgY2hhck9mZnNldDogMFxuXHRcdFx0LCBpbkJ1ZmZlcjogMFxuXHRcdH07XG5cdFx0dGhpcy5fcGFyc2VTdGF0ZSA9IEVsZW1lbnRUeXBlLlRleHQ7XG5cdFx0dGhpcy5fcHJldlRhZ1NlcCA9ICcnO1xuXHRcdHRoaXMuX3RhZ1N0YWNrID0gW107XG5cdFx0dGhpcy5faGFuZGxlci5yZXNldCgpO1xuXHR9XG5cdFxuXHQvLyoqUHJpdmF0ZSoqLy9cblx0Ly9Qcm9wZXJ0aWVzLy9cblx0UGFyc2VyLnByb3RvdHlwZS5fb3B0aW9ucyA9IG51bGw7IC8vUGFyc2VyIG9wdGlvbnMgZm9yIGhvdyB0byBiZWhhdmVcblx0UGFyc2VyLnByb3RvdHlwZS5faGFuZGxlciA9IG51bGw7IC8vSGFuZGxlciBmb3IgcGFyc2VkIGVsZW1lbnRzXG5cdFBhcnNlci5wcm90b3R5cGUuX2J1ZmZlciA9IG51bGw7IC8vQnVmZmVyIG9mIHVucGFyc2VkIGRhdGFcblx0UGFyc2VyLnByb3RvdHlwZS5fZG9uZSA9IGZhbHNlOyAvL0ZsYWcgaW5kaWNhdGluZyB3aGV0aGVyIHBhcnNpbmcgaXMgZG9uZVxuXHRQYXJzZXIucHJvdG90eXBlLl9lbGVtZW50cyA9ICBudWxsOyAvL0FycmF5IG9mIHBhcnNlZCBlbGVtZW50c1xuXHRQYXJzZXIucHJvdG90eXBlLl9lbGVtZW50c0N1cnJlbnQgPSAwOyAvL1BvaW50ZXIgdG8gbGFzdCBlbGVtZW50IGluIF9lbGVtZW50cyB0aGF0IGhhcyBiZWVuIHByb2Nlc3NlZFxuXHRQYXJzZXIucHJvdG90eXBlLl9jdXJyZW50ID0gMDsgLy9Qb3NpdGlvbiBpbiBkYXRhIHRoYXQgaGFzIGFscmVhZHkgYmVlbiBwYXJzZWRcblx0UGFyc2VyLnByb3RvdHlwZS5fbmV4dCA9IDA7IC8vUG9zaXRpb24gaW4gZGF0YSBvZiB0aGUgbmV4dCB0YWcgbWFya2VyICg8Pilcblx0UGFyc2VyLnByb3RvdHlwZS5fbG9jYXRpb24gPSBudWxsOyAvL1Bvc2l0aW9uIHRyYWNraW5nIGZvciBlbGVtZW50cyBpbiBhIHN0cmVhbVxuXHRQYXJzZXIucHJvdG90eXBlLl9wYXJzZVN0YXRlID0gRWxlbWVudFR5cGUuVGV4dDsgLy9DdXJyZW50IHR5cGUgb2YgZWxlbWVudCBiZWluZyBwYXJzZWRcblx0UGFyc2VyLnByb3RvdHlwZS5fcHJldlRhZ1NlcCA9ICcnOyAvL1ByZXZpb3VzIHRhZyBtYXJrZXIgZm91bmRcblx0Ly9TdGFjayBvZiBlbGVtZW50IHR5cGVzIHByZXZpb3VzbHkgZW5jb3VudGVyZWQ7IGtlZXBzIHRyYWNrIG9mIHdoZW5cblx0Ly9wYXJzaW5nIG9jY3VycyBpbnNpZGUgYSBzY3JpcHQvY29tbWVudC9zdHlsZSB0YWdcblx0UGFyc2VyLnByb3RvdHlwZS5fdGFnU3RhY2sgPSBudWxsO1xuXG5cdC8vTWV0aG9kcy8vXG5cdC8vVGFrZXMgYW4gYXJyYXkgb2YgZWxlbWVudHMgYW5kIHBhcnNlcyBhbnkgZm91bmQgYXR0cmlidXRlc1xuXHRQYXJzZXIucHJvdG90eXBlLnBhcnNlVGFnQXR0cmlicyA9IGZ1bmN0aW9uIFBhcnNlciRwYXJzZVRhZ0F0dHJpYnMgKGVsZW1lbnRzKSB7XG5cdFx0dmFyIGlkeEVuZCA9IGVsZW1lbnRzLmxlbmd0aDtcblx0XHR2YXIgaWR4ID0gMDtcblx0XG5cdFx0d2hpbGUgKGlkeCA8IGlkeEVuZCkge1xuXHRcdFx0dmFyIGVsZW1lbnQgPSBlbGVtZW50c1tpZHgrK107XG5cdFx0XHRpZiAoZWxlbWVudC50eXBlID09IEVsZW1lbnRUeXBlLlRhZyB8fCBlbGVtZW50LnR5cGUgPT0gRWxlbWVudFR5cGUuU2NyaXB0IHx8IGVsZW1lbnQudHlwZSA9PSBFbGVtZW50VHlwZS5zdHlsZSlcblx0XHRcdFx0dGhpcy5wYXJzZUF0dHJpYnMoZWxlbWVudCk7XG5cdFx0fVxuXHRcblx0XHRyZXR1cm4oZWxlbWVudHMpO1xuXHR9XG5cblx0Ly9UYWtlcyBhbiBlbGVtZW50IGFuZCBhZGRzIGFuIFwiYXR0cmlic1wiIHByb3BlcnR5IGZvciBhbnkgZWxlbWVudCBhdHRyaWJ1dGVzIGZvdW5kIFxuXHRQYXJzZXIucHJvdG90eXBlLnBhcnNlQXR0cmlicyA9IGZ1bmN0aW9uIFBhcnNlciRwYXJzZUF0dHJpYnMgKGVsZW1lbnQpIHtcblx0XHQvL09ubHkgcGFyc2UgYXR0cmlidXRlcyBmb3IgdGFnc1xuXHRcdGlmIChlbGVtZW50LnR5cGUgIT0gRWxlbWVudFR5cGUuU2NyaXB0ICYmIGVsZW1lbnQudHlwZSAhPSBFbGVtZW50VHlwZS5TdHlsZSAmJiBlbGVtZW50LnR5cGUgIT0gRWxlbWVudFR5cGUuVGFnKVxuXHRcdFx0cmV0dXJuO1xuXHRcblx0XHR2YXIgdGFnTmFtZSA9IGVsZW1lbnQuZGF0YS5zcGxpdChQYXJzZXIuX3JlV2hpdGVzcGFjZSwgMSlbMF07XG5cdFx0dmFyIGF0dHJpYlJhdyA9IGVsZW1lbnQuZGF0YS5zdWJzdHJpbmcodGFnTmFtZS5sZW5ndGgpO1xuXHRcdGlmIChhdHRyaWJSYXcubGVuZ3RoIDwgMSlcblx0XHRcdHJldHVybjtcblx0XG5cdFx0dmFyIG1hdGNoO1xuXHRcdFBhcnNlci5fcmVBdHRyaWIubGFzdEluZGV4ID0gMDtcblx0XHR3aGlsZSAobWF0Y2ggPSBQYXJzZXIuX3JlQXR0cmliLmV4ZWMoYXR0cmliUmF3KSkge1xuXHRcdFx0aWYgKGVsZW1lbnQuYXR0cmlicyA9PSB1bmRlZmluZWQpXG5cdFx0XHRcdGVsZW1lbnQuYXR0cmlicyA9IHt9O1xuXHRcblx0XHRcdGlmICh0eXBlb2YgbWF0Y2hbMV0gPT0gXCJzdHJpbmdcIiAmJiBtYXRjaFsxXS5sZW5ndGgpIHtcblx0XHRcdFx0ZWxlbWVudC5hdHRyaWJzW21hdGNoWzFdXSA9IG1hdGNoWzJdO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgbWF0Y2hbM10gPT0gXCJzdHJpbmdcIiAmJiBtYXRjaFszXS5sZW5ndGgpIHtcblx0XHRcdFx0ZWxlbWVudC5hdHRyaWJzW21hdGNoWzNdLnRvU3RyaW5nKCldID0gbWF0Y2hbNF0udG9TdHJpbmcoKTtcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIG1hdGNoWzVdID09IFwic3RyaW5nXCIgJiYgbWF0Y2hbNV0ubGVuZ3RoKSB7XG5cdFx0XHRcdGVsZW1lbnQuYXR0cmlic1ttYXRjaFs1XV0gPSBtYXRjaFs2XTtcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIG1hdGNoWzddID09IFwic3RyaW5nXCIgJiYgbWF0Y2hbN10ubGVuZ3RoKSB7XG5cdFx0XHRcdGVsZW1lbnQuYXR0cmlic1ttYXRjaFs3XV0gPSBtYXRjaFs3XTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvL0V4dHJhY3RzIHRoZSBiYXNlIHRhZyBuYW1lIGZyb20gdGhlIGRhdGEgdmFsdWUgb2YgYW4gZWxlbWVudFxuXHRQYXJzZXIucHJvdG90eXBlLnBhcnNlVGFnTmFtZSA9IGZ1bmN0aW9uIFBhcnNlciRwYXJzZVRhZ05hbWUgKGRhdGEpIHtcblx0XHRpZiAoZGF0YSA9PSBudWxsIHx8IGRhdGEgPT0gXCJcIilcblx0XHRcdHJldHVybihcIlwiKTtcblx0XHR2YXIgbWF0Y2ggPSBQYXJzZXIuX3JlVGFnTmFtZS5leGVjKGRhdGEpO1xuXHRcdGlmICghbWF0Y2gpXG5cdFx0XHRyZXR1cm4oXCJcIik7XG5cdFx0cmV0dXJuKChtYXRjaFsxXSA/IFwiL1wiIDogXCJcIikgKyBtYXRjaFsyXSk7XG5cdH1cblxuXHQvL1BhcnNlcyB0aHJvdWdoIEhUTUwgdGV4dCBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBmb3VuZCBlbGVtZW50c1xuXHQvL0kgYWRtaXQsIHRoaXMgZnVuY3Rpb24gaXMgcmF0aGVyIGxhcmdlIGJ1dCBzcGxpdHRpbmcgdXAgaGFkIGFuIG5vdGljZWFibGUgaW1wYWN0IG9uIHNwZWVkXG5cdFBhcnNlci5wcm90b3R5cGUucGFyc2VUYWdzID0gZnVuY3Rpb24gUGFyc2VyJHBhcnNlVGFncyAoKSB7XG5cdFx0dmFyIGJ1ZmZlckVuZCA9IHRoaXMuX2J1ZmZlci5sZW5ndGggLSAxO1xuXHRcdHdoaWxlIChQYXJzZXIuX3JlVGFncy50ZXN0KHRoaXMuX2J1ZmZlcikpIHtcblx0XHRcdHRoaXMuX25leHQgPSBQYXJzZXIuX3JlVGFncy5sYXN0SW5kZXggLSAxO1xuXHRcdFx0dmFyIHRhZ1NlcCA9IHRoaXMuX2J1ZmZlci5jaGFyQXQodGhpcy5fbmV4dCk7IC8vVGhlIGN1cnJlbnRseSBmb3VuZCB0YWcgbWFya2VyXG5cdFx0XHR2YXIgcmF3RGF0YSA9IHRoaXMuX2J1ZmZlci5zdWJzdHJpbmcodGhpcy5fY3VycmVudCwgdGhpcy5fbmV4dCk7IC8vVGhlIG5leHQgY2h1bmsgb2YgZGF0YSB0byBwYXJzZVxuXHRcblx0XHRcdC8vQSBuZXcgZWxlbWVudCB0byBldmVudHVhbGx5IGJlIGFwcGVuZGVkIHRvIHRoZSBlbGVtZW50IGxpc3Rcblx0XHRcdHZhciBlbGVtZW50ID0ge1xuXHRcdFx0XHQgIHJhdzogcmF3RGF0YVxuXHRcdFx0XHQsIGRhdGE6ICh0aGlzLl9wYXJzZVN0YXRlID09IEVsZW1lbnRUeXBlLlRleHQpID8gcmF3RGF0YSA6IHJhd0RhdGEucmVwbGFjZShQYXJzZXIuX3JlVHJpbSwgXCJcIilcblx0XHRcdFx0LCB0eXBlOiB0aGlzLl9wYXJzZVN0YXRlXG5cdFx0XHR9O1xuXHRcblx0XHRcdHZhciBlbGVtZW50TmFtZSA9IHRoaXMucGFyc2VUYWdOYW1lKGVsZW1lbnQuZGF0YSk7XG5cdFxuXHRcdFx0Ly9UaGlzIHNlY3Rpb24gaW5zcGVjdHMgdGhlIGN1cnJlbnQgdGFnIHN0YWNrIGFuZCBtb2RpZmllcyB0aGUgY3VycmVudFxuXHRcdFx0Ly9lbGVtZW50IGlmIHdlJ3JlIGFjdHVhbGx5IHBhcnNpbmcgYSBzcGVjaWFsIGFyZWEgKHNjcmlwdC9jb21tZW50L3N0eWxlIHRhZylcblx0XHRcdGlmICh0aGlzLl90YWdTdGFjay5sZW5ndGgpIHsgLy9XZSdyZSBwYXJzaW5nIGluc2lkZSBhIHNjcmlwdC9jb21tZW50L3N0eWxlIHRhZ1xuXHRcdFx0XHRpZiAodGhpcy5fdGFnU3RhY2tbdGhpcy5fdGFnU3RhY2subGVuZ3RoIC0gMV0gPT0gRWxlbWVudFR5cGUuU2NyaXB0KSB7IC8vV2UncmUgY3VycmVudGx5IGluIGEgc2NyaXB0IHRhZ1xuXHRcdFx0XHRcdGlmIChlbGVtZW50TmFtZS50b0xvd2VyQ2FzZSgpID09IFwiL3NjcmlwdFwiKSAvL0FjdHVhbGx5LCB3ZSdyZSBubyBsb25nZXIgaW4gYSBzY3JpcHQgdGFnLCBzbyBwb3AgaXQgb2ZmIHRoZSBzdGFja1xuXHRcdFx0XHRcdFx0dGhpcy5fdGFnU3RhY2sucG9wKCk7XG5cdFx0XHRcdFx0ZWxzZSB7IC8vTm90IGEgY2xvc2luZyBzY3JpcHQgdGFnXG5cdFx0XHRcdFx0XHRpZiAoZWxlbWVudC5yYXcuaW5kZXhPZihcIiEtLVwiKSAhPSAwKSB7IC8vTWFrZSBzdXJlIHdlJ3JlIG5vdCBpbiBhIGNvbW1lbnRcblx0XHRcdFx0XHRcdFx0Ly9BbGwgZGF0YSBmcm9tIGhlcmUgdG8gc2NyaXB0IGNsb3NlIGlzIG5vdyBhIHRleHQgZWxlbWVudFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50LnR5cGUgPSBFbGVtZW50VHlwZS5UZXh0O1xuXHRcdFx0XHRcdFx0XHQvL0lmIHRoZSBwcmV2aW91cyBlbGVtZW50IGlzIHRleHQsIGFwcGVuZCB0aGUgY3VycmVudCB0ZXh0IHRvIGl0XG5cdFx0XHRcdFx0XHRcdGlmICh0aGlzLl9lbGVtZW50cy5sZW5ndGggJiYgdGhpcy5fZWxlbWVudHNbdGhpcy5fZWxlbWVudHMubGVuZ3RoIC0gMV0udHlwZSA9PSBFbGVtZW50VHlwZS5UZXh0KSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHByZXZFbGVtZW50ID0gdGhpcy5fZWxlbWVudHNbdGhpcy5fZWxlbWVudHMubGVuZ3RoIC0gMV07XG5cdFx0XHRcdFx0XHRcdFx0cHJldkVsZW1lbnQucmF3ID0gcHJldkVsZW1lbnQuZGF0YSA9IHByZXZFbGVtZW50LnJhdyArIHRoaXMuX3ByZXZUYWdTZXAgKyBlbGVtZW50LnJhdztcblx0XHRcdFx0XHRcdFx0XHRlbGVtZW50LnJhdyA9IGVsZW1lbnQuZGF0YSA9IFwiXCI7IC8vVGhpcyBjYXVzZXMgdGhlIGN1cnJlbnQgZWxlbWVudCB0byBub3QgYmUgYWRkZWQgdG8gdGhlIGVsZW1lbnQgbGlzdFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKHRoaXMuX3RhZ1N0YWNrW3RoaXMuX3RhZ1N0YWNrLmxlbmd0aCAtIDFdID09IEVsZW1lbnRUeXBlLlN0eWxlKSB7IC8vV2UncmUgY3VycmVudGx5IGluIGEgc3R5bGUgdGFnXG5cdFx0XHRcdFx0aWYgKGVsZW1lbnROYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCIvc3R5bGVcIikgLy9BY3R1YWxseSwgd2UncmUgbm8gbG9uZ2VyIGluIGEgc3R5bGUgdGFnLCBzbyBwb3AgaXQgb2ZmIHRoZSBzdGFja1xuXHRcdFx0XHRcdFx0dGhpcy5fdGFnU3RhY2sucG9wKCk7XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoZWxlbWVudC5yYXcuaW5kZXhPZihcIiEtLVwiKSAhPSAwKSB7IC8vTWFrZSBzdXJlIHdlJ3JlIG5vdCBpbiBhIGNvbW1lbnRcblx0XHRcdFx0XHRcdFx0Ly9BbGwgZGF0YSBmcm9tIGhlcmUgdG8gc3R5bGUgY2xvc2UgaXMgbm93IGEgdGV4dCBlbGVtZW50XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQudHlwZSA9IEVsZW1lbnRUeXBlLlRleHQ7XG5cdFx0XHRcdFx0XHRcdC8vSWYgdGhlIHByZXZpb3VzIGVsZW1lbnQgaXMgdGV4dCwgYXBwZW5kIHRoZSBjdXJyZW50IHRleHQgdG8gaXRcblx0XHRcdFx0XHRcdFx0aWYgKHRoaXMuX2VsZW1lbnRzLmxlbmd0aCAmJiB0aGlzLl9lbGVtZW50c1t0aGlzLl9lbGVtZW50cy5sZW5ndGggLSAxXS50eXBlID09IEVsZW1lbnRUeXBlLlRleHQpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgcHJldkVsZW1lbnQgPSB0aGlzLl9lbGVtZW50c1t0aGlzLl9lbGVtZW50cy5sZW5ndGggLSAxXTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZWxlbWVudC5yYXcgIT0gXCJcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0cHJldkVsZW1lbnQucmF3ID0gcHJldkVsZW1lbnQuZGF0YSA9IHByZXZFbGVtZW50LnJhdyArIHRoaXMuX3ByZXZUYWdTZXAgKyBlbGVtZW50LnJhdztcblx0XHRcdFx0XHRcdFx0XHRcdGVsZW1lbnQucmF3ID0gZWxlbWVudC5kYXRhID0gXCJcIjsgLy9UaGlzIGNhdXNlcyB0aGUgY3VycmVudCBlbGVtZW50IHRvIG5vdCBiZSBhZGRlZCB0byB0aGUgZWxlbWVudCBsaXN0XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHsgLy9FbGVtZW50IGlzIGVtcHR5LCBzbyBqdXN0IGFwcGVuZCB0aGUgbGFzdCB0YWcgbWFya2VyIGZvdW5kXG5cdFx0XHRcdFx0XHRcdFx0XHRwcmV2RWxlbWVudC5yYXcgPSBwcmV2RWxlbWVudC5kYXRhID0gcHJldkVsZW1lbnQucmF3ICsgdGhpcy5fcHJldlRhZ1NlcDtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7IC8vVGhlIHByZXZpb3VzIGVsZW1lbnQgd2FzIG5vdCB0ZXh0XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGVsZW1lbnQucmF3ICE9IFwiXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGVsZW1lbnQucmF3ID0gZWxlbWVudC5kYXRhID0gZWxlbWVudC5yYXc7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKHRoaXMuX3RhZ1N0YWNrW3RoaXMuX3RhZ1N0YWNrLmxlbmd0aCAtIDFdID09IEVsZW1lbnRUeXBlLkNvbW1lbnQpIHsgLy9XZSdyZSBjdXJyZW50bHkgaW4gYSBjb21tZW50IHRhZ1xuXHRcdFx0XHRcdHZhciByYXdMZW4gPSBlbGVtZW50LnJhdy5sZW5ndGg7XG5cdFx0XHRcdFx0aWYgKGVsZW1lbnQucmF3LmNoYXJBdChyYXdMZW4gLSAyKSA9PSBcIi1cIiAmJiBlbGVtZW50LnJhdy5jaGFyQXQocmF3TGVuIC0gMSkgPT0gXCItXCIgJiYgdGFnU2VwID09IFwiPlwiKSB7XG5cdFx0XHRcdFx0XHQvL0FjdHVhbGx5LCB3ZSdyZSBubyBsb25nZXIgaW4gYSBzdHlsZSB0YWcsIHNvIHBvcCBpdCBvZmYgdGhlIHN0YWNrXG5cdFx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5wb3AoKTtcblx0XHRcdFx0XHRcdC8vSWYgdGhlIHByZXZpb3VzIGVsZW1lbnQgaXMgYSBjb21tZW50LCBhcHBlbmQgdGhlIGN1cnJlbnQgdGV4dCB0byBpdFxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX2VsZW1lbnRzLmxlbmd0aCAmJiB0aGlzLl9lbGVtZW50c1t0aGlzLl9lbGVtZW50cy5sZW5ndGggLSAxXS50eXBlID09IEVsZW1lbnRUeXBlLkNvbW1lbnQpIHtcblx0XHRcdFx0XHRcdFx0dmFyIHByZXZFbGVtZW50ID0gdGhpcy5fZWxlbWVudHNbdGhpcy5fZWxlbWVudHMubGVuZ3RoIC0gMV07XG5cdFx0XHRcdFx0XHRcdHByZXZFbGVtZW50LnJhdyA9IHByZXZFbGVtZW50LmRhdGEgPSAocHJldkVsZW1lbnQucmF3ICsgZWxlbWVudC5yYXcpLnJlcGxhY2UoUGFyc2VyLl9yZVRyaW1Db21tZW50LCBcIlwiKTtcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC5yYXcgPSBlbGVtZW50LmRhdGEgPSBcIlwiOyAvL1RoaXMgY2F1c2VzIHRoZSBjdXJyZW50IGVsZW1lbnQgdG8gbm90IGJlIGFkZGVkIHRvIHRoZSBlbGVtZW50IGxpc3Rcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC50eXBlID0gRWxlbWVudFR5cGUuVGV4dDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgLy9QcmV2aW91cyBlbGVtZW50IG5vdCBhIGNvbW1lbnRcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC50eXBlID0gRWxlbWVudFR5cGUuQ29tbWVudDsgLy9DaGFuZ2UgdGhlIGN1cnJlbnQgZWxlbWVudCdzIHR5cGUgdG8gYSBjb21tZW50XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgeyAvL1N0aWxsIGluIGEgY29tbWVudCB0YWdcblx0XHRcdFx0XHRcdGVsZW1lbnQudHlwZSA9IEVsZW1lbnRUeXBlLkNvbW1lbnQ7XG5cdFx0XHRcdFx0XHQvL0lmIHRoZSBwcmV2aW91cyBlbGVtZW50IGlzIGEgY29tbWVudCwgYXBwZW5kIHRoZSBjdXJyZW50IHRleHQgdG8gaXRcblx0XHRcdFx0XHRcdGlmICh0aGlzLl9lbGVtZW50cy5sZW5ndGggJiYgdGhpcy5fZWxlbWVudHNbdGhpcy5fZWxlbWVudHMubGVuZ3RoIC0gMV0udHlwZSA9PSBFbGVtZW50VHlwZS5Db21tZW50KSB7XG5cdFx0XHRcdFx0XHRcdHZhciBwcmV2RWxlbWVudCA9IHRoaXMuX2VsZW1lbnRzW3RoaXMuX2VsZW1lbnRzLmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRcdFx0XHRwcmV2RWxlbWVudC5yYXcgPSBwcmV2RWxlbWVudC5kYXRhID0gcHJldkVsZW1lbnQucmF3ICsgZWxlbWVudC5yYXcgKyB0YWdTZXA7XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQucmF3ID0gZWxlbWVudC5kYXRhID0gXCJcIjsgLy9UaGlzIGNhdXNlcyB0aGUgY3VycmVudCBlbGVtZW50IHRvIG5vdCBiZSBhZGRlZCB0byB0aGUgZWxlbWVudCBsaXN0XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQudHlwZSA9IEVsZW1lbnRUeXBlLlRleHQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQucmF3ID0gZWxlbWVudC5kYXRhID0gZWxlbWVudC5yYXcgKyB0YWdTZXA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFxuXHRcdFx0Ly9Qcm9jZXNzaW5nIG9mIG5vbi1zcGVjaWFsIHRhZ3Ncblx0XHRcdGlmIChlbGVtZW50LnR5cGUgPT0gRWxlbWVudFR5cGUuVGFnKSB7XG5cdFx0XHRcdGVsZW1lbnQubmFtZSA9IGVsZW1lbnROYW1lO1xuXHRcdFx0XHR2YXIgZWxlbWVudE5hbWVDSSA9IGVsZW1lbnROYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoZWxlbWVudC5yYXcuaW5kZXhPZihcIiEtLVwiKSA9PSAwKSB7IC8vVGhpcyB0YWcgaXMgcmVhbGx5IGNvbW1lbnRcblx0XHRcdFx0XHRlbGVtZW50LnR5cGUgPSBFbGVtZW50VHlwZS5Db21tZW50O1xuXHRcdFx0XHRcdGRlbGV0ZSBlbGVtZW50W1wibmFtZVwiXTtcblx0XHRcdFx0XHR2YXIgcmF3TGVuID0gZWxlbWVudC5yYXcubGVuZ3RoO1xuXHRcdFx0XHRcdC8vQ2hlY2sgaWYgdGhlIGNvbW1lbnQgaXMgdGVybWluYXRlZCBpbiB0aGUgY3VycmVudCBlbGVtZW50XG5cdFx0XHRcdFx0aWYgKGVsZW1lbnQucmF3LmNoYXJBdChyYXdMZW4gLSAxKSA9PSBcIi1cIiAmJiBlbGVtZW50LnJhdy5jaGFyQXQocmF3TGVuIC0gMikgPT0gXCItXCIgJiYgdGFnU2VwID09IFwiPlwiKVxuXHRcdFx0XHRcdFx0ZWxlbWVudC5yYXcgPSBlbGVtZW50LmRhdGEgPSBlbGVtZW50LnJhdy5yZXBsYWNlKFBhcnNlci5fcmVUcmltQ29tbWVudCwgXCJcIik7XG5cdFx0XHRcdFx0ZWxzZSB7IC8vSXQncyBub3Qgc28gcHVzaCB0aGUgY29tbWVudCBvbnRvIHRoZSB0YWcgc3RhY2tcblx0XHRcdFx0XHRcdGVsZW1lbnQucmF3ICs9IHRhZ1NlcDtcblx0XHRcdFx0XHRcdHRoaXMuX3RhZ1N0YWNrLnB1c2goRWxlbWVudFR5cGUuQ29tbWVudCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKGVsZW1lbnQucmF3LmluZGV4T2YoXCIhXCIpID09IDAgfHwgZWxlbWVudC5yYXcuaW5kZXhPZihcIj9cIikgPT0gMCkge1xuXHRcdFx0XHRcdGVsZW1lbnQudHlwZSA9IEVsZW1lbnRUeXBlLkRpcmVjdGl2ZTtcblx0XHRcdFx0XHQvL1RPRE86IHdoYXQgYWJvdXQgQ0RBVEE/XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZWxlbWVudE5hbWVDSSA9PSBcInNjcmlwdFwiKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC50eXBlID0gRWxlbWVudFR5cGUuU2NyaXB0O1xuXHRcdFx0XHRcdC8vU3BlY2lhbCB0YWcsIHB1c2ggb250byB0aGUgdGFnIHN0YWNrIGlmIG5vdCB0ZXJtaW5hdGVkXG5cdFx0XHRcdFx0aWYgKGVsZW1lbnQuZGF0YS5jaGFyQXQoZWxlbWVudC5kYXRhLmxlbmd0aCAtIDEpICE9IFwiL1wiKVxuXHRcdFx0XHRcdFx0dGhpcy5fdGFnU3RhY2sucHVzaChFbGVtZW50VHlwZS5TY3JpcHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKGVsZW1lbnROYW1lQ0kgPT0gXCIvc2NyaXB0XCIpXG5cdFx0XHRcdFx0ZWxlbWVudC50eXBlID0gRWxlbWVudFR5cGUuU2NyaXB0O1xuXHRcdFx0XHRlbHNlIGlmIChlbGVtZW50TmFtZUNJID09IFwic3R5bGVcIikge1xuXHRcdFx0XHRcdGVsZW1lbnQudHlwZSA9IEVsZW1lbnRUeXBlLlN0eWxlO1xuXHRcdFx0XHRcdC8vU3BlY2lhbCB0YWcsIHB1c2ggb250byB0aGUgdGFnIHN0YWNrIGlmIG5vdCB0ZXJtaW5hdGVkXG5cdFx0XHRcdFx0aWYgKGVsZW1lbnQuZGF0YS5jaGFyQXQoZWxlbWVudC5kYXRhLmxlbmd0aCAtIDEpICE9IFwiL1wiKVxuXHRcdFx0XHRcdFx0dGhpcy5fdGFnU3RhY2sucHVzaChFbGVtZW50VHlwZS5TdHlsZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZWxlbWVudE5hbWVDSSA9PSBcIi9zdHlsZVwiKVxuXHRcdFx0XHRcdGVsZW1lbnQudHlwZSA9IEVsZW1lbnRUeXBlLlN0eWxlO1xuXHRcdFx0XHRpZiAoZWxlbWVudC5uYW1lICYmIGVsZW1lbnQubmFtZS5jaGFyQXQoMCkgPT0gXCIvXCIpXG5cdFx0XHRcdFx0ZWxlbWVudC5kYXRhID0gZWxlbWVudC5uYW1lO1xuXHRcdFx0fVxuXHRcblx0XHRcdC8vQWRkIGFsbCB0YWdzIGFuZCBub24tZW1wdHkgdGV4dCBlbGVtZW50cyB0byB0aGUgZWxlbWVudCBsaXN0XG5cdFx0XHRpZiAoZWxlbWVudC5yYXcgIT0gXCJcIiB8fCBlbGVtZW50LnR5cGUgIT0gRWxlbWVudFR5cGUuVGV4dCkge1xuXHRcdFx0XHRpZiAodGhpcy5fb3B0aW9ucy5pbmNsdWRlTG9jYXRpb24gJiYgIWVsZW1lbnQubG9jYXRpb24pIHtcblx0XHRcdFx0XHRlbGVtZW50LmxvY2F0aW9uID0gdGhpcy5nZXRMb2NhdGlvbihlbGVtZW50LnR5cGUgPT0gRWxlbWVudFR5cGUuVGFnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLnBhcnNlQXR0cmlicyhlbGVtZW50KTtcblx0XHRcdFx0dGhpcy5fZWxlbWVudHMucHVzaChlbGVtZW50KTtcblx0XHRcdFx0Ly9JZiB0YWcgc2VsZi10ZXJtaW5hdGVzLCBhZGQgYW4gZXhwbGljaXQsIHNlcGFyYXRlIGNsb3NpbmcgdGFnXG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRlbGVtZW50LnR5cGUgIT0gRWxlbWVudFR5cGUuVGV4dFxuXHRcdFx0XHRcdCYmXG5cdFx0XHRcdFx0ZWxlbWVudC50eXBlICE9IEVsZW1lbnRUeXBlLkNvbW1lbnRcblx0XHRcdFx0XHQmJlxuXHRcdFx0XHRcdGVsZW1lbnQudHlwZSAhPSBFbGVtZW50VHlwZS5EaXJlY3RpdmVcblx0XHRcdFx0XHQmJlxuXHRcdFx0XHRcdGVsZW1lbnQuZGF0YS5jaGFyQXQoZWxlbWVudC5kYXRhLmxlbmd0aCAtIDEpID09IFwiL1wiXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHRcdHRoaXMuX2VsZW1lbnRzLnB1c2goe1xuXHRcdFx0XHRcdFx0ICByYXc6IFwiL1wiICsgZWxlbWVudC5uYW1lXG5cdFx0XHRcdFx0XHQsIGRhdGE6IFwiL1wiICsgZWxlbWVudC5uYW1lXG5cdFx0XHRcdFx0XHQsIG5hbWU6IFwiL1wiICsgZWxlbWVudC5uYW1lXG5cdFx0XHRcdFx0XHQsIHR5cGU6IGVsZW1lbnQudHlwZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fcGFyc2VTdGF0ZSA9ICh0YWdTZXAgPT0gXCI8XCIpID8gRWxlbWVudFR5cGUuVGFnIDogRWxlbWVudFR5cGUuVGV4dDtcblx0XHRcdHRoaXMuX2N1cnJlbnQgPSB0aGlzLl9uZXh0ICsgMTtcblx0XHRcdHRoaXMuX3ByZXZUYWdTZXAgPSB0YWdTZXA7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX29wdGlvbnMuaW5jbHVkZUxvY2F0aW9uKSB7XG5cdFx0XHR0aGlzLmdldExvY2F0aW9uKCk7XG5cdFx0XHR0aGlzLl9sb2NhdGlvbi5yb3cgKz0gdGhpcy5fbG9jYXRpb24uaW5CdWZmZXI7XG5cdFx0XHR0aGlzLl9sb2NhdGlvbi5pbkJ1ZmZlciA9IDA7XG5cdFx0XHR0aGlzLl9sb2NhdGlvbi5jaGFyT2Zmc2V0ID0gMDtcblx0XHR9XG5cdFx0dGhpcy5fYnVmZmVyID0gKHRoaXMuX2N1cnJlbnQgPD0gYnVmZmVyRW5kKSA/IHRoaXMuX2J1ZmZlci5zdWJzdHJpbmcodGhpcy5fY3VycmVudCkgOiBcIlwiO1xuXHRcdHRoaXMuX2N1cnJlbnQgPSAwO1xuXHRcblx0XHR0aGlzLndyaXRlSGFuZGxlcigpO1xuXHR9XG5cblx0UGFyc2VyLnByb3RvdHlwZS5nZXRMb2NhdGlvbiA9IGZ1bmN0aW9uIFBhcnNlciRnZXRMb2NhdGlvbiAoc3RhcnRUYWcpIHtcblx0XHR2YXIgYyxcblx0XHRcdGwgPSB0aGlzLl9sb2NhdGlvbixcblx0XHRcdGVuZCA9IHRoaXMuX2N1cnJlbnQgLSAoc3RhcnRUYWcgPyAxIDogMCksXG5cdFx0XHRjaHVuayA9IHN0YXJ0VGFnICYmIGwuY2hhck9mZnNldCA9PSAwICYmIHRoaXMuX2N1cnJlbnQgPT0gMDtcblx0XHRcblx0XHRmb3IgKDsgbC5jaGFyT2Zmc2V0IDwgZW5kOyBsLmNoYXJPZmZzZXQrKykge1xuXHRcdFx0YyA9IHRoaXMuX2J1ZmZlci5jaGFyQXQobC5jaGFyT2Zmc2V0KTtcblx0XHRcdGlmIChjID09ICdcXG4nKSB7XG5cdFx0XHRcdGwuaW5CdWZmZXIrKztcblx0XHRcdFx0bC5jb2wgPSAwO1xuXHRcdFx0fSBlbHNlIGlmIChjICE9ICdcXHInKSB7XG5cdFx0XHRcdGwuY29sKys7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHQgIGxpbmU6IGwucm93ICsgbC5pbkJ1ZmZlciArIDFcblx0XHRcdCwgY29sOiBsLmNvbCArIChjaHVuayA/IDA6IDEpXG5cdFx0fTtcblx0fVxuXG5cdC8vQ2hlY2tzIHRoZSBoYW5kbGVyIHRvIG1ha2UgaXQgaXMgYW4gb2JqZWN0IHdpdGggdGhlIHJpZ2h0IFwiaW50ZXJmYWNlXCJcblx0UGFyc2VyLnByb3RvdHlwZS52YWxpZGF0ZUhhbmRsZXIgPSBmdW5jdGlvbiBQYXJzZXIkdmFsaWRhdGVIYW5kbGVyIChoYW5kbGVyKSB7XG5cdFx0aWYgKCh0eXBlb2YgaGFuZGxlcikgIT0gXCJvYmplY3RcIilcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkhhbmRsZXIgaXMgbm90IGFuIG9iamVjdFwiKTtcblx0XHRpZiAoKHR5cGVvZiBoYW5kbGVyLnJlc2V0KSAhPSBcImZ1bmN0aW9uXCIpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJIYW5kbGVyIG1ldGhvZCAncmVzZXQnIGlzIGludmFsaWRcIik7XG5cdFx0aWYgKCh0eXBlb2YgaGFuZGxlci5kb25lKSAhPSBcImZ1bmN0aW9uXCIpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJIYW5kbGVyIG1ldGhvZCAnZG9uZScgaXMgaW52YWxpZFwiKTtcblx0XHRpZiAoKHR5cGVvZiBoYW5kbGVyLndyaXRlVGFnKSAhPSBcImZ1bmN0aW9uXCIpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJIYW5kbGVyIG1ldGhvZCAnd3JpdGVUYWcnIGlzIGludmFsaWRcIik7XG5cdFx0aWYgKCh0eXBlb2YgaGFuZGxlci53cml0ZVRleHQpICE9IFwiZnVuY3Rpb25cIilcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkhhbmRsZXIgbWV0aG9kICd3cml0ZVRleHQnIGlzIGludmFsaWRcIik7XG5cdFx0aWYgKCh0eXBlb2YgaGFuZGxlci53cml0ZUNvbW1lbnQpICE9IFwiZnVuY3Rpb25cIilcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkhhbmRsZXIgbWV0aG9kICd3cml0ZUNvbW1lbnQnIGlzIGludmFsaWRcIik7XG5cdFx0aWYgKCh0eXBlb2YgaGFuZGxlci53cml0ZURpcmVjdGl2ZSkgIT0gXCJmdW5jdGlvblwiKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSGFuZGxlciBtZXRob2QgJ3dyaXRlRGlyZWN0aXZlJyBpcyBpbnZhbGlkXCIpO1xuXHR9XG5cblx0Ly9Xcml0ZXMgcGFyc2VkIGVsZW1lbnRzIG91dCB0byB0aGUgaGFuZGxlclxuXHRQYXJzZXIucHJvdG90eXBlLndyaXRlSGFuZGxlciA9IGZ1bmN0aW9uIFBhcnNlciR3cml0ZUhhbmRsZXIgKGZvcmNlRmx1c2gpIHtcblx0XHRmb3JjZUZsdXNoID0gISFmb3JjZUZsdXNoO1xuXHRcdGlmICh0aGlzLl90YWdTdGFjay5sZW5ndGggJiYgIWZvcmNlRmx1c2gpXG5cdFx0XHRyZXR1cm47XG5cdFx0d2hpbGUgKHRoaXMuX2VsZW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50cy5zaGlmdCgpO1xuXHRcdFx0c3dpdGNoIChlbGVtZW50LnR5cGUpIHtcblx0XHRcdFx0Y2FzZSBFbGVtZW50VHlwZS5Db21tZW50OlxuXHRcdFx0XHRcdHRoaXMuX2hhbmRsZXIud3JpdGVDb21tZW50KGVsZW1lbnQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIEVsZW1lbnRUeXBlLkRpcmVjdGl2ZTpcblx0XHRcdFx0XHR0aGlzLl9oYW5kbGVyLndyaXRlRGlyZWN0aXZlKGVsZW1lbnQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIEVsZW1lbnRUeXBlLlRleHQ6XG5cdFx0XHRcdFx0dGhpcy5faGFuZGxlci53cml0ZVRleHQoZWxlbWVudCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhpcy5faGFuZGxlci53cml0ZVRhZyhlbGVtZW50KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRQYXJzZXIucHJvdG90eXBlLmhhbmRsZUVycm9yID0gZnVuY3Rpb24gUGFyc2VyJGhhbmRsZUVycm9yIChlcnJvcikge1xuXHRcdGlmICgodHlwZW9mIHRoaXMuX2hhbmRsZXIuZXJyb3IpID09IFwiZnVuY3Rpb25cIilcblx0XHRcdHRoaXMuX2hhbmRsZXIuZXJyb3IoZXJyb3IpO1xuXHRcdGVsc2Vcblx0XHRcdHRocm93IGVycm9yO1xuXHR9XG5cbi8vVE9ETzogbWFrZSB0aGlzIGEgdHJ1bGx5IHN0cmVhbWFibGUgaGFuZGxlclxuZnVuY3Rpb24gUnNzSGFuZGxlciAoY2FsbGJhY2spIHtcblx0UnNzSGFuZGxlci5zdXBlcl8uY2FsbCh0aGlzLCBjYWxsYmFjaywgeyBpZ25vcmVXaGl0ZXNwYWNlOiB0cnVlLCB2ZXJib3NlOiBmYWxzZSwgZW5mb3JjZUVtcHR5VGFnczogZmFsc2UgfSk7XG59XG5pbmhlcml0cyhSc3NIYW5kbGVyLCBEZWZhdWx0SGFuZGxlcik7XG5cblx0UnNzSGFuZGxlci5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uIFJzc0hhbmRsZXIkZG9uZSAoKSB7XG5cdFx0dmFyIGZlZWQgPSB7IH07XG5cdFx0dmFyIGZlZWRSb290O1xuXG5cdFx0dmFyIGZvdW5kID0gRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybih2YWx1ZSA9PSBcInJzc1wiIHx8IHZhbHVlID09IFwiZmVlZFwiKTsgfSwgdGhpcy5kb20sIGZhbHNlKTtcblx0XHRpZiAoZm91bmQubGVuZ3RoKSB7XG5cdFx0XHRmZWVkUm9vdCA9IGZvdW5kWzBdO1xuXHRcdH1cblx0XHRpZiAoZmVlZFJvb3QpIHtcblx0XHRcdGlmIChmZWVkUm9vdC5uYW1lID09IFwicnNzXCIpIHtcblx0XHRcdFx0ZmVlZC50eXBlID0gXCJyc3NcIjtcblx0XHRcdFx0ZmVlZFJvb3QgPSBmZWVkUm9vdC5jaGlsZHJlblswXTsgLy88Y2hhbm5lbC8+XG5cdFx0XHRcdGZlZWQuaWQgPSBcIlwiO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZlZWQudGl0bGUgPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRpdGxlXCIsIGZlZWRSb290LmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YTtcblx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZlZWQubGluayA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibGlua1wiLCBmZWVkUm9vdC5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGE7XG5cdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRmZWVkLmRlc2NyaXB0aW9uID0gRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJkZXNjcmlwdGlvblwiLCBmZWVkUm9vdC5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGE7XG5cdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRmZWVkLnVwZGF0ZWQgPSBuZXcgRGF0ZShEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImxhc3RCdWlsZERhdGVcIiwgZmVlZFJvb3QuY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhKTtcblx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZlZWQuYXV0aG9yID0gRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJtYW5hZ2luZ0VkaXRvclwiLCBmZWVkUm9vdC5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGE7XG5cdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0ZmVlZC5pdGVtcyA9IFtdO1xuXHRcdFx0XHREb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcIml0ZW1cIiwgZmVlZFJvb3QuY2hpbGRyZW4pLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4LCBsaXN0KSB7XG5cdFx0XHRcdFx0dmFyIGVudHJ5ID0ge307XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGVudHJ5LmlkID0gRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJndWlkXCIsIGl0ZW0uY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0ZW50cnkudGl0bGUgPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRpdGxlXCIsIGl0ZW0uY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0ZW50cnkubGluayA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibGlua1wiLCBpdGVtLmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YTtcblx0XHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGVudHJ5LmRlc2NyaXB0aW9uID0gRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJkZXNjcmlwdGlvblwiLCBpdGVtLmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YTtcblx0XHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGVudHJ5LnB1YkRhdGUgPSBuZXcgRGF0ZShEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcInB1YkRhdGVcIiwgaXRlbS5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGEpO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0XHRmZWVkLml0ZW1zLnB1c2goZW50cnkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZlZWQudHlwZSA9IFwiYXRvbVwiO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZlZWQuaWQgPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlkXCIsIGZlZWRSb290LmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YTtcblx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZlZWQudGl0bGUgPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRpdGxlXCIsIGZlZWRSb290LmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YTtcblx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZlZWQubGluayA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibGlua1wiLCBmZWVkUm9vdC5jaGlsZHJlbiwgZmFsc2UpWzBdLmF0dHJpYnMuaHJlZjtcblx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZlZWQuZGVzY3JpcHRpb24gPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcInN1YnRpdGxlXCIsIGZlZWRSb290LmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YTtcblx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZlZWQudXBkYXRlZCA9IG5ldyBEYXRlKERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidXBkYXRlZFwiLCBmZWVkUm9vdC5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGEpO1xuXHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC5hdXRob3IgPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImVtYWlsXCIsIGZlZWRSb290LmNoaWxkcmVuLCB0cnVlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdGZlZWQuaXRlbXMgPSBbXTtcblx0XHRcdFx0RG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJlbnRyeVwiLCBmZWVkUm9vdC5jaGlsZHJlbikuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgsIGxpc3QpIHtcblx0XHRcdFx0XHR2YXIgZW50cnkgPSB7fTtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0ZW50cnkuaWQgPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlkXCIsIGl0ZW0uY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0ZW50cnkudGl0bGUgPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRpdGxlXCIsIGl0ZW0uY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0ZW50cnkubGluayA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibGlua1wiLCBpdGVtLmNoaWxkcmVuLCBmYWxzZSlbMF0uYXR0cmlicy5ocmVmO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0ZW50cnkuZGVzY3JpcHRpb24gPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcInN1bW1hcnlcIiwgaXRlbS5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGE7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRlbnRyeS5wdWJEYXRlID0gbmV3IERhdGUoRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ1cGRhdGVkXCIsIGl0ZW0uY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhKTtcblx0XHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdFx0ZmVlZC5pdGVtcy5wdXNoKGVudHJ5KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZG9tID0gZmVlZDtcblx0XHR9XG5cdFx0UnNzSGFuZGxlci5zdXBlcl8ucHJvdG90eXBlLmRvbmUuY2FsbCh0aGlzKTtcblx0fVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZnVuY3Rpb24gRGVmYXVsdEhhbmRsZXIgKGNhbGxiYWNrLCBvcHRpb25zKSB7XG5cdHRoaXMucmVzZXQoKTtcblx0dGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgPyBvcHRpb25zIDogeyB9O1xuXHRpZiAodGhpcy5fb3B0aW9ucy5pZ25vcmVXaGl0ZXNwYWNlID09IHVuZGVmaW5lZClcblx0XHR0aGlzLl9vcHRpb25zLmlnbm9yZVdoaXRlc3BhY2UgPSBmYWxzZTsgLy9LZWVwIHdoaXRlc3BhY2Utb25seSB0ZXh0IG5vZGVzXG5cdGlmICh0aGlzLl9vcHRpb25zLnZlcmJvc2UgPT0gdW5kZWZpbmVkKVxuXHRcdHRoaXMuX29wdGlvbnMudmVyYm9zZSA9IHRydWU7IC8vS2VlcCBkYXRhIHByb3BlcnR5IGZvciB0YWdzIGFuZCByYXcgcHJvcGVydHkgZm9yIGFsbFxuXHRpZiAodGhpcy5fb3B0aW9ucy5lbmZvcmNlRW1wdHlUYWdzID09IHVuZGVmaW5lZClcblx0XHR0aGlzLl9vcHRpb25zLmVuZm9yY2VFbXB0eVRhZ3MgPSB0cnVlOyAvL0Rvbid0IGFsbG93IGNoaWxkcmVuIGZvciBIVE1MIHRhZ3MgZGVmaW5lZCBhcyBlbXB0eSBpbiBzcGVjXG5cdGlmICgodHlwZW9mIGNhbGxiYWNrKSA9PSBcImZ1bmN0aW9uXCIpXG5cdFx0dGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcbn1cblxuXHQvLyoqXCJTdGF0aWNcIioqLy9cblx0Ly9IVE1MIFRhZ3MgdGhhdCBzaG91bGRuJ3QgY29udGFpbiBjaGlsZCBub2Rlc1xuXHREZWZhdWx0SGFuZGxlci5fZW1wdHlUYWdzID0ge1xuXHRcdCAgYXJlYTogMVxuXHRcdCwgYmFzZTogMVxuXHRcdCwgYmFzZWZvbnQ6IDFcblx0XHQsIGJyOiAxXG5cdFx0LCBjb2w6IDFcblx0XHQsIGZyYW1lOiAxXG5cdFx0LCBocjogMVxuXHRcdCwgaW1nOiAxXG5cdFx0LCBpbnB1dDogMVxuXHRcdCwgaXNpbmRleDogMVxuXHRcdCwgbGluazogMVxuXHRcdCwgbWV0YTogMVxuXHRcdCwgcGFyYW06IDFcblx0XHQsIGVtYmVkOiAxXG5cdH1cblx0Ly9SZWdleCB0byBkZXRlY3Qgd2hpdGVzcGFjZSBvbmx5IHRleHQgbm9kZXNcblx0RGVmYXVsdEhhbmRsZXIucmVXaGl0ZXNwYWNlID0gL15cXHMqJC87XG5cblx0Ly8qKlB1YmxpYyoqLy9cblx0Ly9Qcm9wZXJ0aWVzLy9cblx0RGVmYXVsdEhhbmRsZXIucHJvdG90eXBlLmRvbSA9IG51bGw7IC8vVGhlIGhpZXJhcmNoaWNhbCBvYmplY3QgY29udGFpbmluZyB0aGUgcGFyc2VkIEhUTUxcblx0Ly9NZXRob2RzLy9cblx0Ly9SZXNldHMgdGhlIGhhbmRsZXIgYmFjayB0byBzdGFydGluZyBzdGF0ZVxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiBEZWZhdWx0SGFuZGxlciRyZXNldCgpIHtcblx0XHR0aGlzLmRvbSA9IFtdO1xuXHRcdHRoaXMuX2RvbmUgPSBmYWxzZTtcblx0XHR0aGlzLl90YWdTdGFjayA9IFtdO1xuXHRcdHRoaXMuX3RhZ1N0YWNrLmxhc3QgPSBmdW5jdGlvbiBEZWZhdWx0SGFuZGxlciRfdGFnU3RhY2skbGFzdCAoKSB7XG5cdFx0XHRyZXR1cm4odGhpcy5sZW5ndGggPyB0aGlzW3RoaXMubGVuZ3RoIC0gMV0gOiBudWxsKTtcblx0XHR9XG5cdH1cblx0Ly9TaWduYWxzIHRoZSBoYW5kbGVyIHRoYXQgcGFyc2luZyBpcyBkb25lXG5cdERlZmF1bHRIYW5kbGVyLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24gRGVmYXVsdEhhbmRsZXIkZG9uZSAoKSB7XG5cdFx0dGhpcy5fZG9uZSA9IHRydWU7XG5cdFx0dGhpcy5oYW5kbGVDYWxsYmFjayhudWxsKTtcblx0fVxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUud3JpdGVUYWcgPSBmdW5jdGlvbiBEZWZhdWx0SGFuZGxlciR3cml0ZVRhZyAoZWxlbWVudCkge1xuXHRcdHRoaXMuaGFuZGxlRWxlbWVudChlbGVtZW50KTtcblx0fSBcblx0RGVmYXVsdEhhbmRsZXIucHJvdG90eXBlLndyaXRlVGV4dCA9IGZ1bmN0aW9uIERlZmF1bHRIYW5kbGVyJHdyaXRlVGV4dCAoZWxlbWVudCkge1xuXHRcdGlmICh0aGlzLl9vcHRpb25zLmlnbm9yZVdoaXRlc3BhY2UpXG5cdFx0XHRpZiAoRGVmYXVsdEhhbmRsZXIucmVXaGl0ZXNwYWNlLnRlc3QoZWxlbWVudC5kYXRhKSlcblx0XHRcdFx0cmV0dXJuO1xuXHRcdHRoaXMuaGFuZGxlRWxlbWVudChlbGVtZW50KTtcblx0fSBcblx0RGVmYXVsdEhhbmRsZXIucHJvdG90eXBlLndyaXRlQ29tbWVudCA9IGZ1bmN0aW9uIERlZmF1bHRIYW5kbGVyJHdyaXRlQ29tbWVudCAoZWxlbWVudCkge1xuXHRcdHRoaXMuaGFuZGxlRWxlbWVudChlbGVtZW50KTtcblx0fSBcblx0RGVmYXVsdEhhbmRsZXIucHJvdG90eXBlLndyaXRlRGlyZWN0aXZlID0gZnVuY3Rpb24gRGVmYXVsdEhhbmRsZXIkd3JpdGVEaXJlY3RpdmUgKGVsZW1lbnQpIHtcblx0XHR0aGlzLmhhbmRsZUVsZW1lbnQoZWxlbWVudCk7XG5cdH1cblx0RGVmYXVsdEhhbmRsZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gRGVmYXVsdEhhbmRsZXIkZXJyb3IgKGVycm9yKSB7XG5cdFx0dGhpcy5oYW5kbGVDYWxsYmFjayhlcnJvcik7XG5cdH1cblxuXHQvLyoqUHJpdmF0ZSoqLy9cblx0Ly9Qcm9wZXJ0aWVzLy9cblx0RGVmYXVsdEhhbmRsZXIucHJvdG90eXBlLl9vcHRpb25zID0gbnVsbDsgLy9IYW5kbGVyIG9wdGlvbnMgZm9yIGhvdyB0byBiZWhhdmVcblx0RGVmYXVsdEhhbmRsZXIucHJvdG90eXBlLl9jYWxsYmFjayA9IG51bGw7IC8vQ2FsbGJhY2sgdG8gcmVzcG9uZCB0byB3aGVuIHBhcnNpbmcgZG9uZVxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUuX2RvbmUgPSBmYWxzZTsgLy9GbGFnIGluZGljYXRpbmcgd2hldGhlciBoYW5kbGVyIGhhcyBiZWVuIG5vdGlmaWVkIG9mIHBhcnNpbmcgY29tcGxldGVkXG5cdERlZmF1bHRIYW5kbGVyLnByb3RvdHlwZS5fdGFnU3RhY2sgPSBudWxsOyAvL0xpc3Qgb2YgcGFyZW50cyB0byB0aGUgY3VycmVudGx5IGVsZW1lbnQgYmVpbmcgcHJvY2Vzc2VkXG5cdC8vTWV0aG9kcy8vXG5cdERlZmF1bHRIYW5kbGVyLnByb3RvdHlwZS5oYW5kbGVDYWxsYmFjayA9IGZ1bmN0aW9uIERlZmF1bHRIYW5kbGVyJGhhbmRsZUNhbGxiYWNrIChlcnJvcikge1xuXHRcdFx0aWYgKCh0eXBlb2YgdGhpcy5fY2FsbGJhY2spICE9IFwiZnVuY3Rpb25cIilcblx0XHRcdFx0aWYgKGVycm9yKVxuXHRcdFx0XHRcdHRocm93IGVycm9yO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0dGhpcy5fY2FsbGJhY2soZXJyb3IsIHRoaXMuZG9tKTtcblx0fVxuXHRcblx0RGVmYXVsdEhhbmRsZXIucHJvdG90eXBlLmlzRW1wdHlUYWcgPSBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0dmFyIG5hbWUgPSBlbGVtZW50Lm5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRpZiAobmFtZS5jaGFyQXQoMCkgPT0gJy8nKSB7XG5cdFx0XHRuYW1lID0gbmFtZS5zdWJzdHJpbmcoMSk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9vcHRpb25zLmVuZm9yY2VFbXB0eVRhZ3MgJiYgISFEZWZhdWx0SGFuZGxlci5fZW1wdHlUYWdzW25hbWVdO1xuXHR9O1xuXHRcblx0RGVmYXVsdEhhbmRsZXIucHJvdG90eXBlLmhhbmRsZUVsZW1lbnQgPSBmdW5jdGlvbiBEZWZhdWx0SGFuZGxlciRoYW5kbGVFbGVtZW50IChlbGVtZW50KSB7XG5cdFx0aWYgKHRoaXMuX2RvbmUpXG5cdFx0XHR0aGlzLmhhbmRsZUNhbGxiYWNrKG5ldyBFcnJvcihcIldyaXRpbmcgdG8gdGhlIGhhbmRsZXIgYWZ0ZXIgZG9uZSgpIGNhbGxlZCBpcyBub3QgYWxsb3dlZCB3aXRob3V0IGEgcmVzZXQoKVwiKSk7XG5cdFx0aWYgKCF0aGlzLl9vcHRpb25zLnZlcmJvc2UpIHtcbi8vXHRcdFx0ZWxlbWVudC5yYXcgPSBudWxsOyAvL0ZJWE1FOiBOb3QgY2xlYW5cblx0XHRcdC8vRklYTUU6IFNlcmlvdXMgcGVyZm9ybWFuY2UgcHJvYmxlbSB1c2luZyBkZWxldGVcblx0XHRcdGRlbGV0ZSBlbGVtZW50LnJhdztcblx0XHRcdGlmIChlbGVtZW50LnR5cGUgPT0gXCJ0YWdcIiB8fCBlbGVtZW50LnR5cGUgPT0gXCJzY3JpcHRcIiB8fCBlbGVtZW50LnR5cGUgPT0gXCJzdHlsZVwiKVxuXHRcdFx0XHRkZWxldGUgZWxlbWVudC5kYXRhO1xuXHRcdH1cblx0XHRpZiAoIXRoaXMuX3RhZ1N0YWNrLmxhc3QoKSkgeyAvL1RoZXJlIGFyZSBubyBwYXJlbnQgZWxlbWVudHNcblx0XHRcdC8vSWYgdGhlIGVsZW1lbnQgY2FuIGJlIGEgY29udGFpbmVyLCBhZGQgaXQgdG8gdGhlIHRhZyBzdGFjayBhbmQgdGhlIHRvcCBsZXZlbCBsaXN0XG5cdFx0XHRpZiAoZWxlbWVudC50eXBlICE9IEVsZW1lbnRUeXBlLlRleHQgJiYgZWxlbWVudC50eXBlICE9IEVsZW1lbnRUeXBlLkNvbW1lbnQgJiYgZWxlbWVudC50eXBlICE9IEVsZW1lbnRUeXBlLkRpcmVjdGl2ZSkge1xuXHRcdFx0XHRpZiAoZWxlbWVudC5uYW1lLmNoYXJBdCgwKSAhPSBcIi9cIikgeyAvL0lnbm9yZSBjbG9zaW5nIHRhZ3MgdGhhdCBvYnZpb3VzbHkgZG9uJ3QgaGF2ZSBhbiBvcGVuaW5nIHRhZ1xuXHRcdFx0XHRcdHRoaXMuZG9tLnB1c2goZWxlbWVudCk7XG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRW1wdHlUYWcoZWxlbWVudCkpIHsgLy9Eb24ndCBhZGQgdGFncyB0byB0aGUgdGFnIHN0YWNrIHRoYXQgY2FuJ3QgaGF2ZSBjaGlsZHJlblxuXHRcdFx0XHRcdFx0dGhpcy5fdGFnU3RhY2sucHVzaChlbGVtZW50KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgLy9PdGhlcndpc2UganVzdCBhZGQgdG8gdGhlIHRvcCBsZXZlbCBsaXN0XG5cdFx0XHRcdHRoaXMuZG9tLnB1c2goZWxlbWVudCk7XG5cdFx0fVxuXHRcdGVsc2UgeyAvL1RoZXJlIGFyZSBwYXJlbnQgZWxlbWVudHNcblx0XHRcdC8vSWYgdGhlIGVsZW1lbnQgY2FuIGJlIGEgY29udGFpbmVyLCBhZGQgaXQgYXMgYSBjaGlsZCBvZiB0aGUgZWxlbWVudFxuXHRcdFx0Ly9vbiB0b3Agb2YgdGhlIHRhZyBzdGFjayBhbmQgdGhlbiBhZGQgaXQgdG8gdGhlIHRhZyBzdGFja1xuXHRcdFx0aWYgKGVsZW1lbnQudHlwZSAhPSBFbGVtZW50VHlwZS5UZXh0ICYmIGVsZW1lbnQudHlwZSAhPSBFbGVtZW50VHlwZS5Db21tZW50ICYmIGVsZW1lbnQudHlwZSAhPSBFbGVtZW50VHlwZS5EaXJlY3RpdmUpIHtcblx0XHRcdFx0aWYgKGVsZW1lbnQubmFtZS5jaGFyQXQoMCkgPT0gXCIvXCIpIHtcblx0XHRcdFx0XHQvL1RoaXMgaXMgYSBjbG9zaW5nIHRhZywgc2NhbiB0aGUgdGFnU3RhY2sgdG8gZmluZCB0aGUgbWF0Y2hpbmcgb3BlbmluZyB0YWdcblx0XHRcdFx0XHQvL2FuZCBwb3AgdGhlIHN0YWNrIHVwIHRvIHRoZSBvcGVuaW5nIHRhZydzIHBhcmVudFxuXHRcdFx0XHRcdHZhciBiYXNlTmFtZSA9IGVsZW1lbnQubmFtZS5zdWJzdHJpbmcoMSk7XG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRW1wdHlUYWcoZWxlbWVudCkpIHtcblx0XHRcdFx0XHRcdHZhciBwb3MgPSB0aGlzLl90YWdTdGFjay5sZW5ndGggLSAxO1xuXHRcdFx0XHRcdFx0d2hpbGUgKHBvcyA+IC0xICYmIHRoaXMuX3RhZ1N0YWNrW3Bvcy0tXS5uYW1lICE9IGJhc2VOYW1lKSB7IH1cblx0XHRcdFx0XHRcdGlmIChwb3MgPiAtMSB8fCB0aGlzLl90YWdTdGFja1swXS5uYW1lID09IGJhc2VOYW1lKVxuXHRcdFx0XHRcdFx0XHR3aGlsZSAocG9zIDwgdGhpcy5fdGFnU3RhY2subGVuZ3RoIC0gMSlcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5wb3AoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7IC8vVGhpcyBpcyBub3QgYSBjbG9zaW5nIHRhZ1xuXHRcdFx0XHRcdGlmICghdGhpcy5fdGFnU3RhY2subGFzdCgpLmNoaWxkcmVuKVxuXHRcdFx0XHRcdFx0dGhpcy5fdGFnU3RhY2subGFzdCgpLmNoaWxkcmVuID0gW107XG5cdFx0XHRcdFx0dGhpcy5fdGFnU3RhY2subGFzdCgpLmNoaWxkcmVuLnB1c2goZWxlbWVudCk7XG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzRW1wdHlUYWcoZWxlbWVudCkpIC8vRG9uJ3QgYWRkIHRhZ3MgdG8gdGhlIHRhZyBzdGFjayB0aGF0IGNhbid0IGhhdmUgY2hpbGRyZW5cblx0XHRcdFx0XHRcdHRoaXMuX3RhZ1N0YWNrLnB1c2goZWxlbWVudCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgeyAvL1RoaXMgaXMgbm90IGEgY29udGFpbmVyIGVsZW1lbnRcblx0XHRcdFx0aWYgKCF0aGlzLl90YWdTdGFjay5sYXN0KCkuY2hpbGRyZW4pXG5cdFx0XHRcdFx0dGhpcy5fdGFnU3RhY2subGFzdCgpLmNoaWxkcmVuID0gW107XG5cdFx0XHRcdHRoaXMuX3RhZ1N0YWNrLmxhc3QoKS5jaGlsZHJlbi5wdXNoKGVsZW1lbnQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHZhciBEb21VdGlscyA9IHtcblx0XHQgIHRlc3RFbGVtZW50OiBmdW5jdGlvbiBEb21VdGlscyR0ZXN0RWxlbWVudCAob3B0aW9ucywgZWxlbWVudCkge1xuXHRcdFx0aWYgKCFlbGVtZW50KSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykge1xuXHRcdFx0XHRpZiAoa2V5ID09IFwidGFnX25hbWVcIikge1xuXHRcdFx0XHRcdGlmIChlbGVtZW50LnR5cGUgIT0gXCJ0YWdcIiAmJiBlbGVtZW50LnR5cGUgIT0gXCJzY3JpcHRcIiAmJiBlbGVtZW50LnR5cGUgIT0gXCJzdHlsZVwiKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghb3B0aW9uc1tcInRhZ19uYW1lXCJdKGVsZW1lbnQubmFtZSkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoa2V5ID09IFwidGFnX3R5cGVcIikge1xuXHRcdFx0XHRcdGlmICghb3B0aW9uc1tcInRhZ190eXBlXCJdKGVsZW1lbnQudHlwZSkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoa2V5ID09IFwidGFnX2NvbnRhaW5zXCIpIHtcblx0XHRcdFx0XHRpZiAoZWxlbWVudC50eXBlICE9IFwidGV4dFwiICYmIGVsZW1lbnQudHlwZSAhPSBcImNvbW1lbnRcIiAmJiBlbGVtZW50LnR5cGUgIT0gXCJkaXJlY3RpdmVcIikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIW9wdGlvbnNbXCJ0YWdfY29udGFpbnNcIl0oZWxlbWVudC5kYXRhKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoIWVsZW1lbnQuYXR0cmlicyB8fCAhb3B0aW9uc1trZXldKGVsZW1lbnQuYXR0cmlic1trZXldKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcblx0XHQsIGdldEVsZW1lbnRzOiBmdW5jdGlvbiBEb21VdGlscyRnZXRFbGVtZW50cyAob3B0aW9ucywgY3VycmVudEVsZW1lbnQsIHJlY3Vyc2UsIGxpbWl0KSB7XG5cdFx0XHRyZWN1cnNlID0gKHJlY3Vyc2UgPT09IHVuZGVmaW5lZCB8fCByZWN1cnNlID09PSBudWxsKSB8fCAhIXJlY3Vyc2U7XG5cdFx0XHRsaW1pdCA9IGlzTmFOKHBhcnNlSW50KGxpbWl0KSkgPyAtMSA6IHBhcnNlSW50KGxpbWl0KTtcblxuXHRcdFx0aWYgKCFjdXJyZW50RWxlbWVudCkge1xuXHRcdFx0XHRyZXR1cm4oW10pO1xuXHRcdFx0fVxuXHRcblx0XHRcdHZhciBmb3VuZCA9IFtdO1xuXHRcdFx0dmFyIGVsZW1lbnRMaXN0O1xuXG5cdFx0XHRmdW5jdGlvbiBnZXRUZXN0IChjaGVja1ZhbCkge1xuXHRcdFx0XHRyZXR1cm4oZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybih2YWx1ZSA9PSBjaGVja1ZhbCk7IH0pO1xuXHRcdFx0fVxuXHRcdFx0Zm9yICh2YXIga2V5IGluIG9wdGlvbnMpIHtcblx0XHRcdFx0aWYgKCh0eXBlb2Ygb3B0aW9uc1trZXldKSAhPSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRvcHRpb25zW2tleV0gPSBnZXRUZXN0KG9wdGlvbnNba2V5XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XG5cdFx0XHRpZiAoRG9tVXRpbHMudGVzdEVsZW1lbnQob3B0aW9ucywgY3VycmVudEVsZW1lbnQpKSB7XG5cdFx0XHRcdGZvdW5kLnB1c2goY3VycmVudEVsZW1lbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAobGltaXQgPj0gMCAmJiBmb3VuZC5sZW5ndGggPj0gbGltaXQpIHtcblx0XHRcdFx0cmV0dXJuKGZvdW5kKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHJlY3Vyc2UgJiYgY3VycmVudEVsZW1lbnQuY2hpbGRyZW4pIHtcblx0XHRcdFx0ZWxlbWVudExpc3QgPSBjdXJyZW50RWxlbWVudC5jaGlsZHJlbjtcblx0XHRcdH0gZWxzZSBpZiAoY3VycmVudEVsZW1lbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdFx0XHRlbGVtZW50TGlzdCA9IGN1cnJlbnRFbGVtZW50O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuKGZvdW5kKTtcblx0XHRcdH1cblx0XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRMaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGZvdW5kID0gZm91bmQuY29uY2F0KERvbVV0aWxzLmdldEVsZW1lbnRzKG9wdGlvbnMsIGVsZW1lbnRMaXN0W2ldLCByZWN1cnNlLCBsaW1pdCkpO1xuXHRcdFx0XHRpZiAobGltaXQgPj0gMCAmJiBmb3VuZC5sZW5ndGggPj0gbGltaXQpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcblx0XHRcdHJldHVybihmb3VuZCk7XG5cdFx0fVxuXHRcdFxuXHRcdCwgZ2V0RWxlbWVudEJ5SWQ6IGZ1bmN0aW9uIERvbVV0aWxzJGdldEVsZW1lbnRCeUlkIChpZCwgY3VycmVudEVsZW1lbnQsIHJlY3Vyc2UpIHtcblx0XHRcdHZhciByZXN1bHQgPSBEb21VdGlscy5nZXRFbGVtZW50cyh7IGlkOiBpZCB9LCBjdXJyZW50RWxlbWVudCwgcmVjdXJzZSwgMSk7XG5cdFx0XHRyZXR1cm4ocmVzdWx0Lmxlbmd0aCA/IHJlc3VsdFswXSA6IG51bGwpO1xuXHRcdH1cblx0XHRcblx0XHQsIGdldEVsZW1lbnRzQnlUYWdOYW1lOiBmdW5jdGlvbiBEb21VdGlscyRnZXRFbGVtZW50c0J5VGFnTmFtZSAobmFtZSwgY3VycmVudEVsZW1lbnQsIHJlY3Vyc2UsIGxpbWl0KSB7XG5cdFx0XHRyZXR1cm4oRG9tVXRpbHMuZ2V0RWxlbWVudHMoeyB0YWdfbmFtZTogbmFtZSB9LCBjdXJyZW50RWxlbWVudCwgcmVjdXJzZSwgbGltaXQpKTtcblx0XHR9XG5cdFx0XG5cdFx0LCBnZXRFbGVtZW50c0J5VGFnVHlwZTogZnVuY3Rpb24gRG9tVXRpbHMkZ2V0RWxlbWVudHNCeVRhZ1R5cGUgKHR5cGUsIGN1cnJlbnRFbGVtZW50LCByZWN1cnNlLCBsaW1pdCkge1xuXHRcdFx0cmV0dXJuKERvbVV0aWxzLmdldEVsZW1lbnRzKHsgdGFnX3R5cGU6IHR5cGUgfSwgY3VycmVudEVsZW1lbnQsIHJlY3Vyc2UsIGxpbWl0KSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5oZXJpdHMgKGN0b3IsIHN1cGVyQ3Rvcikge1xuXHRcdHZhciB0ZW1wQ3RvciA9IGZ1bmN0aW9uKCl7fTtcblx0XHR0ZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlO1xuXHRcdGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yO1xuXHRcdGN0b3IucHJvdG90eXBlID0gbmV3IHRlbXBDdG9yKCk7XG5cdFx0Y3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yO1xuXHR9XG5cbmV4cG9ydHMuUGFyc2VyID0gUGFyc2VyO1xuXG5leHBvcnRzLkRlZmF1bHRIYW5kbGVyID0gRGVmYXVsdEhhbmRsZXI7XG5cbmV4cG9ydHMuUnNzSGFuZGxlciA9IFJzc0hhbmRsZXI7XG5cbmV4cG9ydHMuRWxlbWVudFR5cGUgPSBFbGVtZW50VHlwZTtcblxuZXhwb3J0cy5Eb21VdGlscyA9IERvbVV0aWxzO1xuXG59KSgpO1xuXG59KShcIi8uLi9ub2RlX21vZHVsZXMvaHRtbHBhcnNlci9saWIvaHRtbHBhcnNlci5qc1wiLFwiLy4uL25vZGVfbW9kdWxlcy9odG1scGFyc2VyL2xpYlwiKSJdfQ==
;