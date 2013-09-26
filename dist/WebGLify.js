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
  var dresser;

  module.exports = dresser = function(node, baseWidth, baseHeight) {
    var child, index, key, value, _base, _base1, _base10, _base11, _base12, _base13, _base14, _base15, _base16, _base17, _base18, _base19, _base2, _base20, _base21, _base22, _base3, _base4, _base5, _base6, _base7, _base8, _base9, _i, _len, _ref, _ref1;
    if ((_base = node.options).x == null) {
      _base.x = 0;
    }
    if ((_base1 = node.options).y == null) {
      _base1.y = 0;
    }
    node.options.z = node.depth * 2;
    if ((_base2 = node.options).height == null) {
      _base2.height = baseHeight != null ? baseHeight : document.body.scrollHeight;
    }
    if ((_base3 = node.options).width == null) {
      _base3.width = baseWidth != null ? baseWidth : document.body.scrollWidth;
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
      child.options.type = node.options.childType === 'horizontal' || node.options.childType === 'vertical' ? 'block' : node.options.childType;
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
          if ((_base6 = child.options).x == null) {
            _base6.x = node.options.width * (index / node.children.length) - ((node.options.width / 2) - ((node.options.width / node.children.length) / 2)) + node.options.x;
          }
          if ((_base7 = child.options).y == null) {
            _base7.y = node.options.y;
          }
          if ((_base8 = child.options).width == null) {
            _base8.width = node.options.width / node.children.length;
          }
          if ((_base9 = child.options).height == null) {
            _base9.height = node.options.height;
          }
          break;
        case 'vertical':
          if ((_base10 = child.options).y == null) {
            _base10.y = ((node.options.height / 2) - ((node.options.height / node.children.length) / 2)) - (node.options.height * (index / node.children.length)) + node.options.y;
          }
          if ((_base11 = child.options).x == null) {
            _base11.x = node.options.x;
          }
          if ((_base12 = child.options).height == null) {
            _base12.height = node.options.height / node.children.length;
          }
          if ((_base13 = child.options).width == null) {
            _base13.width = node.options.width;
          }
          break;
        case 'text':
          if ((_base14 = child.options).x == null) {
            _base14.x = node.options.x;
          }
          if ((_base15 = child.options).y == null) {
            _base15.y = node.options.y;
          }
          if ((_base16 = child.options).width == null) {
            _base16.width = node.options.width;
          }
          if ((_base17 = child.options).height == null) {
            _base17.height = node.options.height;
          }
          if (node.options.backgroundColor === '#000000' || node.options.backgroundColor === 'black') {
            if ((_base18 = child.options).backgroundColor == null) {
              _base18.backgroundColor = 'white';
            }
          } else {
            child.options.backgroundColor === 'black';
          }
          break;
        case 'image':
          if ((_base19 = child.options).x == null) {
            _base19.x = node.options.x;
          }
          if ((_base20 = child.options).y == null) {
            _base20.y = node.options.y;
          }
          if ((_base21 = child.options).width == null) {
            _base21.width = node.options.width;
          }
          if ((_base22 = child.options).height == null) {
            _base22.height = node.options.height;
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


},{}],4:[function(require,module,exports){
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


},{}],5:[function(require,module,exports){
(function() {
  module.exports = {
    render: function(width, height) {
      this.renderer.setSize(width != null ? width : document.body.scrollWidth, height != null ? height : document.body.scrollHeight);
      return this.renderer.render(this.scene, this.camera);
    },
    init: function(scene, camera) {
      var renderer;
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        precision: 'highp'
      });
      renderer.setSize(document.body.scrollWidth, document.body.scrollHeight);
      scene.add(camera);
      this.renderer = renderer;
      this.scene = scene;
      this.camera = camera;
      return this.domElement = renderer.domElement;
    }
  };

}).call(this);


},{}],6:[function(require,module,exports){
(function() {
  var containerMaker, createImageMaterial, imageMaker, renderer;

  containerMaker = require('./containerModule.coffee');

  renderer = require('../renderer/renderer.coffee');

  createImageMaterial = function(url) {
    var material, texture, utils;
    utils = THREE.ImageUtils;
    utils.crossOrigin = 'anonymous';
    texture = utils.loadTexture(url, new THREE.UVMapping(), function() {
      texture.needsUpdate = true;
      return renderer.render();
    });
    material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    });
    material.map.needsUpdate = true;
    return material;
  };

  module.exports = imageMaker = function(node) {
    var material;
    material = createImageMaterial(node.tag);
    return containerMaker(node, material);
  };

}).call(this);


},{"./containerModule.coffee":1,"../renderer/renderer.coffee":5}],7:[function(require,module,exports){
(function() {
  var container, imager, layoutMaker, texter;

  texter = require('../ConstructorModules/textModule.coffee');

  imager = require('../ConstructorModules/imgModule.coffee');

  container = require('../ConstructorModules/containerModule.coffee');

  module.exports = layoutMaker = function(syntax) {
    var aspect, camera, far, height, near, options, recursiveStager, scene, viewAngle, width;
    width = syntax.options.width;
    height = syntax.options.height;
    viewAngle = 45;
    aspect = width / height;
    near = 0.1;
    far = 10000;
    camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
    scene = new THREE.Scene();
    camera.position.set(0, 0, 800);
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
    return options = {
      scene: scene,
      camera: camera
    };
  };

}).call(this);


},{"../ConstructorModules/textModule.coffee":2,"../ConstructorModules/imgModule.coffee":6,"../ConstructorModules/containerModule.coffee":1}],8:[function(require,module,exports){
(function() {
  var WebGLify;

  WebGLify = require('./webglify.coffee');

  window.wglify = {
    renderBlock: function(block, node) {
      var instance, webglifyObj;
      webglifyObj = this.WebGLify(block, node.scrollWidth, node.scrollHeight);
      node.appendChild(webglifyObj.node);
      node.getGLifyInstance = function() {
        return instance;
      };
      instance = {
        node: node,
        canvas: webglifyObj.node,
        setSize: function(width, height) {
          this.width = this.node.scrollWidth;
          this.height = this.node.scrollHeight;
          if (this.width !== this.canvas.width || this.height !== this.canvas.height) {
            return this.render;
          }
        },
        render: function() {
          return webglifyObj.render();
        }
      };
      instance.render();
      return instance;
    },
    populateContent: function() {
      var instances, nodes, script, scripts, _i, _len;
      scripts = (Array.prototype.slice.call(document.querySelectorAll('[type="text/WebGLify"]'))).concat(Array.prototype.slice.call(document.querySelectorAll('[src*="WebGLify.js"]')));
      instances = [];
      this.getInstances = function() {
        return instances;
      };
      for (_i = 0, _len = scripts.length; _i < _len; _i++) {
        script = scripts[_i];
        if (script.innerHTML == null) {
          continue;
        }
        nodes = document.querySelectorAll(script.getAttribute('target') || 'body');
        if (nodes.length != null) {
          instances.push(wglify.renderBlock(script.innerHTML, nodes[0]));
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
    },
    WebGLify: require('./webglify.coffee')
  };

  document.addEventListener('DOMContentLoaded', function(event) {
    return wglify.populateContent();
  });

}).call(this);


},{"./webglify.coffee":9}],9:[function(require,module,exports){
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

  module.exports = WebGlify = function(data, baseWidth, baseHeight) {
    var WebGlifyObj, block, scene;
    block = data;
    scene = layout(dresser(parser(block), baseWidth, baseHeight));
    renderer.init(scene.scene, scene.camera);
    return WebGlifyObj = {
      renderer: renderer,
      render: function() {
        return renderer.render();
      },
      node: renderer.domElement,
      scene: scene
    };
  };

}).call(this);


},{"../compiler/dresser.coffee":3,"../LayoutModules/layoutModule.coffee":7,"../parsers/webglifyPARSER.coffee":4,"../renderer/renderer.coffee":5}],10:[function(require,module,exports){
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
},{}]},{},[1,6,2,7,8,9,3,10,4,5])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvc3JjL0NvbnN0cnVjdG9yTW9kdWxlcy9jb250YWluZXJNb2R1bGUuY29mZmVlIiwiL1VzZXJzL2RhbmllbG1pbGxlci9Eb2N1bWVudHMvSGFjayBSZWFjdG9yIFByb2plY3RzL3dlYmdsaWZ5L3dlYmdsaWZ5L3NyYy9Db25zdHJ1Y3Rvck1vZHVsZXMvdGV4dE1vZHVsZS5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvc3JjL2NvbXBpbGVyL2RyZXNzZXIuY29mZmVlIiwiL1VzZXJzL2RhbmllbG1pbGxlci9Eb2N1bWVudHMvSGFjayBSZWFjdG9yIFByb2plY3RzL3dlYmdsaWZ5L3dlYmdsaWZ5L3NyYy9wYXJzZXJzL3dlYmdsaWZ5UEFSU0VSLmNvZmZlZSIsIi9Vc2Vycy9kYW5pZWxtaWxsZXIvRG9jdW1lbnRzL0hhY2sgUmVhY3RvciBQcm9qZWN0cy93ZWJnbGlmeS93ZWJnbGlmeS9zcmMvcmVuZGVyZXIvcmVuZGVyZXIuY29mZmVlIiwiL1VzZXJzL2RhbmllbG1pbGxlci9Eb2N1bWVudHMvSGFjayBSZWFjdG9yIFByb2plY3RzL3dlYmdsaWZ5L3dlYmdsaWZ5L3NyYy9Db25zdHJ1Y3Rvck1vZHVsZXMvaW1nTW9kdWxlLmNvZmZlZSIsIi9Vc2Vycy9kYW5pZWxtaWxsZXIvRG9jdW1lbnRzL0hhY2sgUmVhY3RvciBQcm9qZWN0cy93ZWJnbGlmeS93ZWJnbGlmeS9zcmMvTGF5b3V0TW9kdWxlcy9sYXlvdXRNb2R1bGUuY29mZmVlIiwiL1VzZXJzL2RhbmllbG1pbGxlci9Eb2N1bWVudHMvSGFjayBSZWFjdG9yIFByb2plY3RzL3dlYmdsaWZ5L3dlYmdsaWZ5L3NyYy9hcHAvbWFpbi5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvc3JjL2FwcC93ZWJnbGlmeS5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvc3JjL3BhcnNlcnMvSFRNTHBhcnNlci5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvbm9kZV9tb2R1bGVzL2h0bWxwYXJzZXIvbGliL2h0bWxwYXJzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0NBQUEsS0FBQSxRQUFBOztDQUFBLENBQUEsQ0FBaUIsQ0FBaUIsRUFBNUIsQ0FBTixDQUFrQyxDQUFDLEtBQWxCO0NBQ2YsT0FBQSwyQkFBQTtDQUFBLEVBQWdCLENBQWhCLENBQW9DLFFBQXBDLElBQStCO0NBQXdCLENBQVEsRUFBSSxDQUFYLENBQUEsQ0FBbUIsUUFBcEI7Q0FBQSxDQUE0QyxFQUFOLENBQVcsQ0FBWCxJQUF0QztDQUF2RCxLQUErQjtDQUEvQixDQUM0RCxDQUF4QyxDQUFwQixDQUF5QixDQUFMLENBQWdDLE1BQXBEO0NBREEsQ0FFc0MsQ0FBMUIsQ0FBWixDQUFBLFFBQVk7Q0FGWixFQUdtQixDQUFuQixDQUFLLEVBQTBCLENBQWpCO0NBSGQsRUFJbUIsQ0FBbkIsQ0FBSyxFQUEwQixDQUFqQjtDQUpkLEVBS21CLENBQW5CLENBQUssRUFBMEIsQ0FBakI7Q0FOa0IsVUFPaEM7Q0FQRixFQUFrQztDQUFsQzs7Ozs7QUNBQTtDQUFBLEtBQUEsbUNBQUE7O0NBQUEsQ0FBQSxDQUFXLEtBQVg7O0NBQUEsQ0FFQSxDQUFhLENBQUEsQ0FBQSxJQUFDLENBQWQ7Q0FDRSxPQUFBLCtEQUFBO0NBQUEsQ0FBQSxDQUFPLENBQVA7QUFDQSxDQUFBLFFBQUEsa0NBQUE7NEJBQUE7Q0FDRSxH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RUFNYSxDQUFBLEVBQWIsQ0FBYSxFQUFTO0NBTnRCLEdBT0EsRUFBQSxPQUFBO2FBQ0E7Q0FBQSxDQUFNLENBQUwsQ0FBRCxHQUFhLENBQVo7Q0FBRCxDQUEwQixFQUFOLEdBQWEsQ0FBYjtDQVRmO0NBRFAsSUFDTzs7Q0FEUDs7Q0FiRjs7Q0FBQSxDQTBCQSxDQUFpQixHQUFYLENBQU4sR0ExQkE7Q0FBQTs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGNvbnRhaW5lck1ha2VyID0gKG5vZGUsIG1hdGVyaWFsKSAtPlxuICBwbGFuZU1hdGVyaWFsID0gbWF0ZXJpYWwgPyBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwge2NvbG9yOiBub2RlLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yLCBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlfVxuICBwbGFuZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkgbm9kZS5vcHRpb25zLndpZHRoLCBub2RlLm9wdGlvbnMuaGVpZ2h0LCAxLCAxXG4gIHBsYW5lID0gbmV3IFRIUkVFLk1lc2ggcGxhbmVHZW9tZXRyeSwgcGxhbmVNYXRlcmlhbFxuICBwbGFuZS5wb3NpdGlvbi55ID0gbm9kZS5vcHRpb25zLnlcbiAgcGxhbmUucG9zaXRpb24ueCA9IG5vZGUub3B0aW9ucy54XG4gIHBsYW5lLnBvc2l0aW9uLnogPSBub2RlLm9wdGlvbnMuelxuICBwbGFuZSIsImZvbnRTaXplID0gMTZcblxubWFrZUxvb2tVcCA9ICh0ZXh0LCBjb2xvcikgLT5cbiAgaGFzaCA9IHt9XG4gIGZvciBjaGFyYWN0ZXIgaW4gdGV4dFxuICAgIGlmIG5vdCBoYXNoW2NoYXJhY3Rlcl0/XG4gICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdjYW52YXMnXG4gICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQgJzJkJ1xuICAgICAgY29udGV4dC5mb250ID0gZm9udFNpemUqMiArICdweCBtb25vc3BhY2UnXG4gICAgICBjYW52YXMud2lkdGggPSBjb250ZXh0Lm1lYXN1cmVUZXh0KGNoYXJhY3Rlcikud2lkdGggKyAyXG4gICAgICBjYW52YXMuaGVpZ2h0ID0gZm9udFNpemUgKiAyKzEwXG4gICAgICBjb250ZXh0LnRleHRBbGlnbiA9ICdjZW50ZXInXG4gICAgICBjb250ZXh0LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnXG4gICAgICBjb250ZXh0LmZvbnQgPSBmb250U2l6ZSoyICsgJ3B4IG1vbm9zcGFjZSdcbiAgICAgIGNvbnRleHQuY2xlYXJSZWN0IDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodFxuICAgICAgY29udGV4dC5maWxsQ29sb3IgPSBjb2xvclxuICAgICAgY29udGV4dC5maWxsVGV4dCBjaGFyYWN0ZXIsIGNhbnZhcy53aWR0aC8yLTIsIGNhbnZhcy5oZWlnaHQvMlxuICAgICAgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlIGNhbnZhc1xuICAgICAgZmFjZSA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCB7IG1hcDogdGV4dHVyZSwgc2lkZTogVEhSRUUuRG91YmxlU2lkZSwgdHJhbnNwYXJlbnQ6IHRydWV9XG4gICAgICBxdWFkID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkgY2FudmFzLndpZHRoLzItNSwgY2FudmFzLmhlaWdodC8yXG4gICAgICBsZXR0ZXIgPSBuZXcgVEhSRUUuTWVzaCBxdWFkLCBmYWNlXG4gICAgICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZVxuICAgICAgaGFzaFtjaGFyYWN0ZXJdID0gbGV0dGVyXG4gIHJldHVybiBoYXNoXG5cbm1ha2VUZXh0ID0gKHRleHQsIGhhc2gsIG1heFdpZHRoLCBtYXhIZWlnaHQpIC0+XG4gIGdyb3VwID0gbmV3IFRIUkVFLk9iamVjdDNEKClcbiAgbGluZSA9IG5ldyBUSFJFRS5PYmplY3QzRCgpXG4gIHlQb3MgPSAwXG4gIGZvciBjaGFyYWN0ZXIgaW4gdGV4dCB3aGVuIE1hdGguYWJzIHlQb3MgPCBtYXhIZWlnaHRcbiAgICB4UG9zID0gMFxuICAgIGxldHRlciA9IG5ldyBUSFJFRS5NZXNoKGhhc2hbY2hhcmFjdGVyXS5nZW9tZXRyeSwgaGFzaFtjaGFyYWN0ZXJdLm1hdGVyaWFsKVxuICAgIGZvciBlYWNoTGV0dGVyIGluIGxpbmUuY2hpbGRyZW5cbiAgICAgIHhQb3MgKz0gZWFjaExldHRlci5nZW9tZXRyeS53aWR0aCsxXG4gICAgbGV0dGVyLnBvc2l0aW9uLnggPSB4UG9zXG4gICAgbGluZS5wb3NpdGlvbi54ID0gLXhQb3MvMlxuICAgIGlmIHhQb3MrbGV0dGVyLmdlb21ldHJ5LndpZHRoID4gbWF4V2lkdGhcbiAgICAgIGxpbmUuYWRkIGxldHRlclxuICAgICAgeFBvcyA9IDBcbiAgICAgIHlQb3MgLT0gbGV0dGVyLmdlb21ldHJ5LmhlaWdodFxuICAgICAgbGluZS5wb3NpdGlvbi55ID0geVBvc1xuICAgICAgZ3JvdXAuYWRkIGxpbmVcbiAgICAgIGxpbmUgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKVxuICAgIGVsc2VcbiAgICAgIGxldHRlci5wb3NpdGlvbi54ID0geFBvc1xuICAgICAgbGluZS5wb3NpdGlvbi54ID0gLXhQb3MvMlxuICAgICAgbGluZS5hZGQobGV0dGVyKVxuICB5UG9zIC09IGxldHRlci5nZW9tZXRyeS5oZWlnaHRcbiAgbGluZS5wb3NpdGlvbi55ID0geVBvc1xuICBncm91cC5hZGQgbGluZVxuICBncm91cC5wb3NpdGlvbi55ID0gTWF0aC5hYnMoeVBvcy8yKStsZXR0ZXIuZ2VvbWV0cnkuaGVpZ2h0LzJcbiAgcmV0dXJuIGdyb3VwXG5cbm1vZHVsZS5leHBvcnRzID0gdGV4dE1ha2VyID0gKG5vZGUpIC0+XG4gIHRhYmxlID0gbWFrZUxvb2tVcCBub2RlLnRhZywgbm9kZS5vcHRpb25zLmJhY2tncm91bmRDb2xvclxuICB0ZXh0RWxlbSA9IG1ha2VUZXh0IG5vZGUudGFnLCB0YWJsZSwgbm9kZS5vcHRpb25zLndpZHRoLCBub2RlLm9wdGlvbnMuaGVpZ2h0XG4gIHRleHRFbGVtLnRyYW5zbGF0ZVogbm9kZS5vcHRpb25zLnpcbiAgdGV4dEVsZW0udHJhbnNsYXRlWCBub2RlLm9wdGlvbnMueFxuICB0ZXh0RWxlbS50cmFuc2xhdGVZIG5vZGUub3B0aW9ucy55XG4gIHRleHRFbGVtIiwiXG4jIFRoZSBEcmVzc2VyIHRyYXZlcnNlcyB0aHJvdWdoIHRoZSBzeXRhbnggdHJlZSBhbmQgaW5zdXJlcyB0aGF0IGFsbCBub2RlcyBhbG9uZyB0aGUgdHJlZSBoYXZlIHRoZSBtaW5pbXVtIHJlcXVpcmVkIGluZm9ybWF0aW9uIHRvIGJlIHJlbmRlcmVyZCBwcm9wZXJseS5cbm1vZHVsZS5leHBvcnRzID0gZHJlc3NlciA9IChub2RlLCBiYXNlV2lkdGgsIGJhc2VIZWlnaHQpIC0+XG4gICMgQmFzZSBjYXNlOiBub2RlIGlzIHRoZSByb290IG9mIHRoZSBzeW50YXggYW5kIHNvIGlzIHRoZSBsYXJnZXN0IHBhcmVudC4gQWxsIGNoaWxkcmVuIHdpbGwgYmUgcGxhY2VkIGFuZCBzaXplZCByZWxhdGl2ZSB0byBpdC5cbiAgbm9kZS5vcHRpb25zLnggPz0gMFxuICBub2RlLm9wdGlvbnMueSA/PSAwXG4gICMgbXVsdGlwbHkgdGhlIG5vZGUgZGVwdGggYnkgMiBzbyB0aGF0ICBlbGVtZW50cyBpbiB0aGUgbm9ybWFsIGZsb3cgYXJlIHBsYWNlZCBvbiBldmVuIHotdmFsdWVzIGFuZCBmbG9hdGVkIGVsZW1lbnRzIGFyZSBwbGFjZWQgb24gb2RkLlxuICBub2RlLm9wdGlvbnMueiA9IG5vZGUuZGVwdGgqMlxuICAjIElmIGEgaGVpZ2h0IGFuZCB3aWR0aCBhcmVuJ3Qgc3BlY2lmaWVkLCBhc3N1bWUgdGhlIGZ1bGwgd2luZG93IHNpemUuXG4gIG5vZGUub3B0aW9ucy5oZWlnaHQgPz0gYmFzZUhlaWdodCA/IGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0XG4gIG5vZGUub3B0aW9ucy53aWR0aCA/PSBiYXNlV2lkdGggPyBkb2N1bWVudC5ib2R5LnNjcm9sbFdpZHRoXG4gICMgaG91c2UgY2xlYW5pbmcuXG4gIG5vZGUub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gJyNGRkZGRkYnXG4gIG5vZGUub3B0aW9ucy5jaGlsZFR5cGUgPz0gJ3ZlcnRpY2FsJ1xuXG4gICMgUGxhY2UgY2hpbGRyZW4gcmVsYXRpdmUgdG8gcGFyZW50LiBQb3NpdGlvbiBmbG9hdHMgaW4gcmVsYXRpb24gdG8gdGhlaXIgbm9ybWFsIHBvc2l0aW9uLlxuICBmb3IgY2hpbGQsIGluZGV4IGluIG5vZGUuY2hpbGRyZW5cblxuICAgICMgc2V0IFR5cGUgZm9yIGVhc3kgY2xhc3NpZmljYXRpb24gb2Ygbm9kZXMgaW4gdGhlIGZ1dHVyZS5cbiAgICBjaGlsZC5vcHRpb25zLnR5cGUgPSBpZiBub2RlLm9wdGlvbnMuY2hpbGRUeXBlIGlzICdob3Jpem9udGFsJyBvciBub2RlLm9wdGlvbnMuY2hpbGRUeXBlIGlzICd2ZXJ0aWNhbCcgdGhlbiAnYmxvY2snIGVsc2Ugbm9kZS5vcHRpb25zLmNoaWxkVHlwZVxuXG4gICAgIyBoYW5kbGUgZmxvYXRlZCB2YWx1ZXMgc28gdGhhdCB0aGUgZWxlbWVudCBpcyByZWxhdGl2ZSB0byB0aGVpciBwYXJlbnQgYW5kIHNvIHRoYXQgdGhleSBhcmUgbGl0ZXJhbGx5IGZsb2F0ZWQgZm9yd2FyZCBieSBvbmUgWiB2YWx1ZS5cbiAgICBpZiBjaGlsZC5vcHRpb25zLng/IG9yIGNoaWxkLm9wdGlvbnMueT8gb3IgY2hpbGQub3B0aW9ucy5oZWlnaHQ/IG9yIGNoaWxkLm9wdGlvbnMud2lkdGg/XG4gICAgICBjaGlsZC5vcHRpb25zLnggPSAobm9kZS5vcHRpb25zLnggKyAoKGNoaWxkLm9wdGlvbnMueC8xMDApKihub2RlLm9wdGlvbnMud2lkdGgpKSkvMiBpZiBjaGlsZC5vcHRpb25zLng/XG4gICAgICBjaGlsZC5vcHRpb25zLnkgPSAobm9kZS5vcHRpb25zLnkgKyAoKGNoaWxkLm9wdGlvbnMueS8xMDApKihub2RlLm9wdGlvbnMuaGVpZ2h0KSkpLzIgaWYgY2hpbGQub3B0aW9ucy55P1xuICAgICAgY2hpbGQub3B0aW9ucy5oZWlnaHQgPSAoKGNoaWxkLm9wdGlvbnMuaGVpZ2h0LzEwMCkqbm9kZS5vcHRpb25zLmhlaWdodCkgaWYgY2hpbGQub3B0aW9ucy5oZWlnaHQ/XG4gICAgICBjaGlsZC5vcHRpb25zLndpZHRoID0gKChjaGlsZC5vcHRpb25zLndpZHRoLzEwMCkqbm9kZS5vcHRpb25zLndpZHRoKSBpZiBjaGlsZC5vcHRpb25zLndpZHRoP1xuICAgICAgIyBsaXRlcmFsbHkgZmxvYXQgdGhlbVxuICAgICAgY2hpbGQub3B0aW9ucy56ICs9IDFcblxuICAgICMgYWRqdXN0IGVsZW1lbnRzIGludG8gdGhlIG5vcm1hbCBmbG93IGJ5IHR5cGUuXG4gICAgc3dpdGNoIG5vZGUub3B0aW9ucy5jaGlsZFR5cGVcblxuICAgICAgd2hlbiAnaG9yaXpvbnRhbCdcbiAgICAgICAgY2hpbGQub3B0aW9ucy54ID89IG5vZGUub3B0aW9ucy53aWR0aCooaW5kZXgvbm9kZS5jaGlsZHJlbi5sZW5ndGgpLSgobm9kZS5vcHRpb25zLndpZHRoLzIpLSgobm9kZS5vcHRpb25zLndpZHRoL25vZGUuY2hpbGRyZW4ubGVuZ3RoKS8yKSkrbm9kZS5vcHRpb25zLnhcbiAgICAgICAgY2hpbGQub3B0aW9ucy55ID89IG5vZGUub3B0aW9ucy55XG4gICAgICAgIGNoaWxkLm9wdGlvbnMud2lkdGggPz0gbm9kZS5vcHRpb25zLndpZHRoL25vZGUuY2hpbGRyZW4ubGVuZ3RoXG4gICAgICAgIGNoaWxkLm9wdGlvbnMuaGVpZ2h0ID89IG5vZGUub3B0aW9ucy5oZWlnaHRcblxuICAgICAgd2hlbiAndmVydGljYWwnXG4gICAgICAgIGNoaWxkLm9wdGlvbnMueSA/PSAoKG5vZGUub3B0aW9ucy5oZWlnaHQvMiktKChub2RlLm9wdGlvbnMuaGVpZ2h0L25vZGUuY2hpbGRyZW4ubGVuZ3RoKS8yKSktKG5vZGUub3B0aW9ucy5oZWlnaHQqKGluZGV4L25vZGUuY2hpbGRyZW4ubGVuZ3RoKSkrbm9kZS5vcHRpb25zLnlcbiAgICAgICAgY2hpbGQub3B0aW9ucy54ID89IG5vZGUub3B0aW9ucy54XG4gICAgICAgIGNoaWxkLm9wdGlvbnMuaGVpZ2h0ID89IG5vZGUub3B0aW9ucy5oZWlnaHQvbm9kZS5jaGlsZHJlbi5sZW5ndGhcbiAgICAgICAgY2hpbGQub3B0aW9ucy53aWR0aCA/PSBub2RlLm9wdGlvbnMud2lkdGhcblxuICAgICAgd2hlbiAndGV4dCdcbiAgICAgICAgIyB0ZXh0IGVsZW1lbnRzIGRpcmVjdGx5IGluaGVyaXQgdGhlaXIgcGFyZW50J3MgcG9zaXRpb24uIFRPRE86IGltcGxpbWVudCBvcHRpb25zIHRvIHJpZ2h0L2xlZnQvdG9wL2JvdHRvbSBqdXN0aWZ5LlxuICAgICAgICBjaGlsZC5vcHRpb25zLnggPz0gbm9kZS5vcHRpb25zLnhcbiAgICAgICAgY2hpbGQub3B0aW9ucy55ID89IG5vZGUub3B0aW9ucy55XG4gICAgICAgIGNoaWxkLm9wdGlvbnMud2lkdGggPz0gbm9kZS5vcHRpb25zLndpZHRoXG4gICAgICAgIGNoaWxkLm9wdGlvbnMuaGVpZ2h0ID89IG5vZGUub3B0aW9ucy5oZWlnaHRcbiAgICAgICAgIyBmYWlsZWQgYXR0ZW1wdCB0byBjaGFuZ2UgdGV4dCBjb2xvciB0byB3aGl0ZSBpZiB0aGUgYmFja2dyb3VuZCBpcyBibGFjay4gVE9ETzogbWFrZSB0aGlzIHdvcmsuXG4gICAgICAgIGlmIG5vZGUub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgaXMgJyMwMDAwMDAnIG9yIG5vZGUub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgaXMgJ2JsYWNrJ1xuICAgICAgICAgIGNoaWxkLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89ICd3aGl0ZSdcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNoaWxkLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yIGlzICdibGFjaydcblxuICAgICAgd2hlbiAnaW1hZ2UnXG4gICAgICAgICMgaW1hZ2VzIHJpZ2h0bHkgYWxzbyBpbmhlcml0IHBhcmVudHMgcG9zaXRpb24uXG4gICAgICAgIGNoaWxkLm9wdGlvbnMueCA/PSBub2RlLm9wdGlvbnMueFxuICAgICAgICBjaGlsZC5vcHRpb25zLnkgPz0gbm9kZS5vcHRpb25zLnlcbiAgICAgICAgY2hpbGQub3B0aW9ucy53aWR0aCA/PSBub2RlLm9wdGlvbnMud2lkdGhcbiAgICAgICAgY2hpbGQub3B0aW9ucy5oZWlnaHQgPz0gbm9kZS5vcHRpb25zLmhlaWdodFxuICAgICAgICAjIGZpeCB0aGUgZGFtYWdlIGRvbmUgYnkgdGhlIHBhcmVzZXIgdG8gYSBVUkwuIFRoaXMgaXMgbm90IHRoZSBtb3N0IGNsZWFuIHdheSB0byBkbyB0aGlzLiBUT0RPOiBpbXBsaW1lbnQgYmV0dGVyIHNvbHV0aW9uLlxuICAgICAgICBmb3Iga2V5LCB2YWx1ZSBvZiBjaGlsZC5vcHRpb25zXG4gICAgICAgICAgaWYga2V5WzBdIGlzICcvJyB0aGVuIGNoaWxkLnRhZyArPSAnOicgKyBrZXlcblxuICAgICMgcmVjdXJzaXZlbHkgY2FsbCB0aGUgZnVuY3Rpb24gb24gZWFjaCBjaGlsZCBzbyB0aGF0IGFsbCBlbGVtZW50cyBpbiB0aGUgdHJlZSBhcmUgcHJvcGVybHkgZHJlc3NlZCBmb3IgcmVuZGVyaW5nLlxuICAgIGRyZXNzZXIgY2hpbGRcblxuICAjIHJldHVybiB0aGUgbm9kZS5cbiAgbm9kZSIsIm1vZHVsZS5leHBvcnRzID0gcGFyc2VyID0gKHRleHQpIC0+XG4gIGxpbmVzID0gdGV4dC5zcGxpdCAnXFxuJ1xuICBtYWxmb3JtZWQgPSBbXVxuICBmb3IgbGluZSBpbiBsaW5lc1xuICAgIGZpcnN0Tm9uV2hpdGVTcGFjZUluZGV4ID0gbGluZS5pbmRleE9mIC9cXFMvLmV4ZWMgbGluZVxuICAgIHdoaXRlc3BhY2UgPSBsaW5lLnNsaWNlKDAsIGZpcnN0Tm9uV2hpdGVTcGFjZUluZGV4KVxuICAgIGlmIGxpbmUuaW5kZXhPZignOicpIGlzbnQgLTFcbiAgICAgIHRhZ1NwYWNlID0gbGluZS5zbGljZSBmaXJzdE5vbldoaXRlU3BhY2VJbmRleCwgbGluZS5pbmRleE9mICc6J1xuICAgICAgb3B0aW9ucyA9IGxpbmUuc2xpY2UobGluZS5pbmRleE9mKCc6JykrMSkucmVwbGFjZSAvXFxzL2csICcnXG4gICAgICBvcHRpb25zID0gb3B0aW9ucy5zcGxpdCAnLCdcbiAgICAgIG9wdGlvbnMgPSAob3B0aW9uLnNwbGl0ICc6JyBmb3Igb3B0aW9uIGluIG9wdGlvbnMpXG4gICAgICBtYWxmb3JtZWQucHVzaCBbd2hpdGVzcGFjZS5sZW5ndGgsIHRhZ1NwYWNlLCBvcHRpb25zXVxuICAgIGVsc2VcbiAgICAgIGNvbnRlbnQgPSBsaW5lLnNsaWNlKGZpcnN0Tm9uV2hpdGVTcGFjZUluZGV4KVxuICAgICAgbWFsZm9ybWVkLnB1c2ggW3doaXRlc3BhY2UubGVuZ3RoLCBjb250ZW50LCBbXV1cbiAgZm9yIGkgaW4gWzEuLm1hbGZvcm1lZC5sZW5ndGgtMV1cbiAgICBpZiBtYWxmb3JtZWRbaV1bMV0ubGVuZ3RoIGlzIDAgYW5kIG1hbGZvcm1lZFtpLTFdWzJdLmxlbmd0aCBpcyAwIGFuZCBtYWxmb3JtZWRbaV1bMF0gaXMgbWFsZm9ybWVkW2ktMV1bMF1cbiAgICAgIG1hbGZvcm1lZFtpLTFdWzJdID0gbWFsZm9ybWVkW2ktMV1bMl0uY29uY2F0IG1hbGZvcm1lZFtpXVsyXVxuICBwcm9wZXJseUZvcm1lZCA9IFtdXG4gIHByb3Blcmx5Rm9ybWVkLnB1c2ggb2JqZWN0aWZpZXIgaXRlbSBmb3IgaXRlbSBpbiBtYWxmb3JtZWQgd2hlbiBpdGVtWzFdLmxlbmd0aCBpc250IDBcbiAgaW5oZXJpdGVyIHNlZ21lbnRlciBwcm9wZXJseUZvcm1lZFxuXG5cbm9iamVjdGlmaWVyID0gKGVsZW1lbnQpIC0+XG4gIG9iamVjdCA9XG4gICAgZGVwdGg6IGVsZW1lbnRbMF1cbiAgICB0YWc6IGVsZW1lbnRbMV1cbiAgICBvcHRpb25zOiB7fVxuICAgIGNoaWxkcmVuOiBbXVxuICBvYmplY3Qub3B0aW9uc1tvcHRpb25bMF1dID0gb3B0aW9uWzFdIGZvciBvcHRpb24gaW4gZWxlbWVudFsyXVxuICBvYmplY3Rcblxuc2VnbWVudGVyID0gKGFycmF5KSAtPlxuICByZXN1bHRzID0gW11cbiAgcmVjdXJzZXIgPSAoYXJyYXkyLCBwb3NpdGlvbikgLT5cbiAgICBmb3IgZWxlbWVudCwgaW5kZXggaW4gYXJyYXkyXG4gICAgICBmb3IgaSBpbiBbYXJyYXkyLmxlbmd0aC0xLi5pbmRleCsxXSBieSAtMVxuICAgICAgICBpZiBlbGVtZW50LmRlcHRoIGlzIGFycmF5MltpXS5kZXB0aFxuICAgICAgICAgIHJlY3Vyc2VyIGFycmF5Mi5zbGljZShpKSwgcG9zaXRpb24raVxuICAgICAgICAgIHJlY3Vyc2VyIGFycmF5Mi5zbGljZSgwLCBpKSwgcG9zaXRpb25cbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICByZXN1bHRzW3Bvc2l0aW9uXSA9IGFycmF5MlxuICByZW1vdmVyID0gKGFycmF5MikgLT5cbiAgICByZXN1bHRzMiA9IFtdXG4gICAgZm9yIGVsZW1lbnQgaW4gYXJyYXkyXG4gICAgICBpZiBlbGVtZW50P1xuICAgICAgICByZXN1bHRzMi5wdXNoIGVsZW1lbnRcbiAgICByZXR1cm4gcmVzdWx0czJcbiAgcmVjdXJzZXIgYXJyYXksIDBcbiAgcmVzdWx0cyA9IHJlbW92ZXIgcmVzdWx0c1xuICByZXN1bHRzXG5cbmluaGVyaXRlciA9IChhcnJheSkgLT5cbiAgZm9yIHN1YkFycmF5IGluIGFycmF5XG4gICAgZm9yIGogaW4gW3N1YkFycmF5Lmxlbmd0aC0xLi4xXSBieSAtMVxuICAgICAgY2hpbGQgPSBzdWJBcnJheVtqXVxuICAgICAgcGFyZW50ID0gc3ViQXJyYXlbai0xXVxuICAgICAgcGFyZW50LmNoaWxkcmVuLnB1c2ggY2hpbGRcbiAgZm9yIGkgaW4gW2FycmF5Lmxlbmd0aC0xLi4wXSBieSAtMVxuICAgIHN1YkFycmF5ID0gYXJyYXlbaV1cbiAgICBsb3N0Q2hpbGQgPSBzdWJBcnJheVswXVxuICAgIGZvciBqIGluIFtpLTEuLjBdIGJ5IC0xIHdoZW4gaSBpc250IDBcbiAgICAgIHBvdGVudGlhbEhvbWUgPSBhcnJheVtqXVxuICAgICAgcm9vdCA9IHBvdGVudGlhbEhvbWVbMF1cbiAgICAgIGlmIHJvb3QuZGVwdGggPCBsb3N0Q2hpbGQuZGVwdGhcbiAgICAgICAgZm9yIHBvdGVudGlhbFNpYmxpbmcsIGluZGV4IGluIHBvdGVudGlhbEhvbWVcbiAgICAgICAgICBpZiBwb3RlbnRpYWxTaWJsaW5nLmRlcHRoIGlzIGxvc3RDaGlsZC5kZXB0aFxuICAgICAgICAgICAgcG90ZW50aWFsSG9tZVtpbmRleC0xXS5jaGlsZHJlbi5zcGxpY2UgMSwgMCwgbG9zdENoaWxkXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBicmVha1xuICBhcnJheVswXVswXSIsIm1vZHVsZS5leHBvcnRzID1cbiAgcmVuZGVyOiAod2lkdGgsIGhlaWdodCktPlxuICAgIEByZW5kZXJlci5zZXRTaXplIHdpZHRoID8gZG9jdW1lbnQuYm9keS5zY3JvbGxXaWR0aCwgaGVpZ2h0ID8gZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHRcbiAgICBAcmVuZGVyZXIucmVuZGVyKEBzY2VuZSwgQGNhbWVyYSlcbiAgaW5pdDogKHNjZW5lLCBjYW1lcmEpIC0+XG4gICAgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlciB7YW50aWFsaWFzOiB0cnVlLCBwcmVjaXNpb246ICdoaWdocCd9XG4gICAgcmVuZGVyZXIuc2V0U2l6ZSBkb2N1bWVudC5ib2R5LnNjcm9sbFdpZHRoLCBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodFxuICAgIHNjZW5lLmFkZCBjYW1lcmFcbiAgICBAcmVuZGVyZXIgPSByZW5kZXJlclxuICAgIEBzY2VuZSA9IHNjZW5lXG4gICAgQGNhbWVyYSA9IGNhbWVyYVxuICAgIEBkb21FbGVtZW50ID0gcmVuZGVyZXIuZG9tRWxlbWVudCIsImNvbnRhaW5lck1ha2VyID0gcmVxdWlyZSAnLi9jb250YWluZXJNb2R1bGUuY29mZmVlJ1xucmVuZGVyZXIgPSByZXF1aXJlICcuLi9yZW5kZXJlci9yZW5kZXJlci5jb2ZmZWUnXG5cbmNyZWF0ZUltYWdlTWF0ZXJpYWwgPSAodXJsKSAtPlxuICB1dGlscyA9ICBUSFJFRS5JbWFnZVV0aWxzXG4gIHV0aWxzLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cydcbiAgdGV4dHVyZSA9IHV0aWxzLmxvYWRUZXh0dXJlIHVybCwgbmV3IFRIUkVFLlVWTWFwcGluZygpLCAtPlxuICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlXG4gICAgcmVuZGVyZXIucmVuZGVyKClcbiAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwge21hcDogdGV4dHVyZSwgc2lkZTogVEhSRUUuRG91YmxlU2lkZX1cbiAgbWF0ZXJpYWwubWFwLm5lZWRzVXBkYXRlID0gdHJ1ZVxuICBtYXRlcmlhbFxuXG5tb2R1bGUuZXhwb3J0cyA9IGltYWdlTWFrZXIgPSAobm9kZSkgLT5cbiAgbWF0ZXJpYWwgPSBjcmVhdGVJbWFnZU1hdGVyaWFsIG5vZGUudGFnXG4gIGNvbnRhaW5lck1ha2VyIG5vZGUsIG1hdGVyaWFsIiwidGV4dGVyID0gcmVxdWlyZSAnLi4vQ29uc3RydWN0b3JNb2R1bGVzL3RleHRNb2R1bGUuY29mZmVlJ1xuaW1hZ2VyID0gcmVxdWlyZSAnLi4vQ29uc3RydWN0b3JNb2R1bGVzL2ltZ01vZHVsZS5jb2ZmZWUnXG5jb250YWluZXIgPSByZXF1aXJlICcuLi9Db25zdHJ1Y3Rvck1vZHVsZXMvY29udGFpbmVyTW9kdWxlLmNvZmZlZSdcblxuIyB0aGUgbGF5b3V0IG1ha2VyIGZpbmFsbHkgZ29lcyB0aHJvdWdoIGFuZCByZW5kZXJzIGVhY2ggZHJlc3NlZCBub2RlIGluIHRoZSBzeW50YXggdHJlZS4gQWxzbyBjcmVhdGVzIHRoZSBjYW1lcmEuXG5tb2R1bGUuZXhwb3J0cyA9IGxheW91dE1ha2VyID0gKHN5bnRheCkgLT5cblxuICAjIHNldCB0aGUgd2lkdGggYW5kIGhlaWdodCBmb3IgdGhlIGNhbWVyYSBhc3BlY3QgcmF0aW8gdG8gdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIHJvb3Qgbm9kZSBvZiB0aGUgc3ludGF4LiBUaGUgcmVuZGVyZXIgd2lsbCB1c2UgdGhlIHNhbWUgdmFsdWVzLlxuICB3aWR0aCA9IHN5bnRheC5vcHRpb25zLndpZHRoXG4gIGhlaWdodCA9IHN5bnRheC5vcHRpb25zLmhlaWdodFxuXG4gICMgZGVmYXVsdCBwcm9wZXJ0aWVzIGZvciB0aGUgY2FtZXJhLlxuICB2aWV3QW5nbGUgPSA0NVxuICBhc3BlY3QgPSB3aWR0aC9oZWlnaHRcbiAgbmVhciA9IDAuMVxuICBmYXIgPSAxMDAwMFxuXG4gICMgY3JlYXRlIHRoZSBjYW1lcmEuXG4gIGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSB2aWV3QW5nbGUsIGFzcGVjdCwgbmVhciwgZmFyXG4gICMgY3JlYXRlIHRoZSBzY2VuZS5cbiAgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKVxuICAjIHNldCB0aGUgY2FtZXJhIHBvc2l0aW9uLiA4MDAgaXMgYW4gYXJiaXRyYXJ5IHZhbHVlLiBUT0RPOiBmaWd1cmUgb3V0IGFuIGFwcHJvcHJpYXRlIFogdmFsdWUgZm9yIHRoZSBjYW1lcmEgYmFzZWQgb24gdGhlIHNpemUgb2YgdGhlIHJlbmRlcmVyLlxuICBjYW1lcmEucG9zaXRpb24uc2V0IDAsIDAsIDgwMFxuXG4gICMgcmVjdXJzaXZlbHkgdHJhdmVyc2UgdGhlIHN5bnRheCB0cmVlIGFuZCBhZGQgZXZlcnkgcmVuZGVyZWQgbm9kZSB0byB0aGUgc2NlbmUuIFNldCB0aGUgc3RhZ2UhXG4gIHJlY3Vyc2l2ZVN0YWdlciA9IChub2RlKSAtPlxuICAgICMgaGFuZGxlIGVhY2ggY2FzZS5cbiAgICBpZiBub2RlLm9wdGlvbnMudHlwZSBpcyAndGV4dCdcbiAgICAgIHNjZW5lLmFkZCB0ZXh0ZXIgbm9kZVxuICAgIGVsc2UgaWYgbm9kZS5vcHRpb25zLnR5cGUgaXMgJ2Jsb2NrJ1xuICAgICAgc2NlbmUuYWRkIGNvbnRhaW5lciBub2RlXG4gICAgZWxzZSBpZiBub2RlLm9wdGlvbnMudHlwZSBpcyAnaW1hZ2UnXG4gICAgICBzY2VuZS5hZGQgaW1hZ2VyIG5vZGVcbiAgICAjIHJlY3Vyc2UgdGhyb3VnaCB0aGUgdHJlZS5cbiAgICByZWN1cnNpdmVTdGFnZXIgY2hpbGQgZm9yIGNoaWxkIGluIG5vZGUuY2hpbGRyZW5cblxuICAjIHN0YXJ0IHRoZSBzdGFnZXIuXG4gIHJlY3Vyc2l2ZVN0YWdlciBzeW50YXhcblxuICAjIHJldHVybiB0aGUgc2NlbmUgYW5kIHRoZSBjYW1lcmFcbiAgb3B0aW9ucyA9XG4gICAgc2NlbmU6IHNjZW5lLFxuICAgIGNhbWVyYTogY2FtZXJhIiwiV2ViR0xpZnkgPSByZXF1aXJlICcuL3dlYmdsaWZ5LmNvZmZlZSdcblxud2luZG93LndnbGlmeSA9XG5cbiAgI2Fzc29jaWF0ZSBhIHJlbmRlcmVkIHdlYmdsIHNjZW5lIHdpdGggYSBkb20gbm9kZS4gVGhlIGJsb2NrIGlzIHRoZSBXZWJHbGlmeSBjb2RlIGFuZCB0aGUgbm9kZSBpcyB0aGUgZG9tIGVsZW1lbnQuXG4gIHJlbmRlckJsb2NrOiAoYmxvY2ssIG5vZGUpIC0+XG4gICAgIyBjcmVhdGUgdGhlIHdlYmdsaWZ5IG9iamVjdCBmcm9tIHRoZSBibG9jayBvZiBjb2RlXG4gICAgd2ViZ2xpZnlPYmogPSBAV2ViR0xpZnkgYmxvY2ssIG5vZGUuc2Nyb2xsV2lkdGgsIG5vZGUuc2Nyb2xsSGVpZ2h0XG5cbiAgICAjIGFwcGx5IGl0IHRvIHRoZSB0YXJnZXQgbm9kZVxuICAgIG5vZGUuYXBwZW5kQ2hpbGQgd2ViZ2xpZnlPYmoubm9kZVxuXG4gICAgIyBkZWZpbmUgYSBmdW5jdGlvbiB0aGF0IGFsbG93cyB0aGUgY29udGFpbmVyIG5vZGUgdG8gcmVwb3J0IGl0J3MgaW5zdGFuY2Ugb2Ygd2ViZ2xpZnlcbiAgICBub2RlLmdldEdMaWZ5SW5zdGFuY2UgPSAtPlxuICAgICAgaW5zdGFuY2VcblxuICAgICMgZGVmaW5lIHRoZSBpbnN0YW5jZSBvZiB3ZWJnbGlmeVxuICAgIGluc3RhbmNlID1cbiAgICAgICMgY29udGFpbmVyIG5vZGVcbiAgICAgIG5vZGU6IG5vZGVcbiAgICAgICMgY2FudmFzIGVsZW1lbnQgaW4gd2hpY2ggdGhlIHNjZW5lIGlzIHJlbmRlcmVkXG4gICAgICBjYW52YXM6IHdlYmdsaWZ5T2JqLm5vZGVcbiAgICAgICNmdW5jdGlvbiB0byByZXJlbmRlciB3aGVuZXZlciB0aGUgc2l6ZSBjaGFuZ2VzXG4gICAgICBzZXRTaXplOiAod2lkdGgsIGhlaWdodCkgLT5cbiAgICAgICAgQHdpZHRoID0gQG5vZGUuc2Nyb2xsV2lkdGhcbiAgICAgICAgQGhlaWdodCA9IEBub2RlLnNjcm9sbEhlaWdodFxuICAgICAgICBpZiBAd2lkdGggaXNudCBAY2FudmFzLndpZHRoIG9yIEBoZWlnaHQgaXNudCBAY2FudmFzLmhlaWdodFxuICAgICAgICAgICNUT0RPOiBjb21wbGV0ZSBzZXRTaXplIGZ1bmN0aW9uLiBvbmx5IHJlcmVuZGVycyBjdXJyZW50bHksIHNob3VsZCBjaGFuZ2Ugc2l6ZTogY29uc2lkZXIgdXNpbmcgVEhSRUV4LldpbmRvd1Jlc2l6ZVxuICAgICAgICAgIEByZW5kZXJcbiAgICAgICNmdW5jdGlvbiB0byBhbGxvdyByZXJlbmRlcmluZyBkaXJlY3RseSBvbiB0aGUgaW5zdGFuY2VcbiAgICAgIHJlbmRlcjogLT5cbiAgICAgICAgd2ViZ2xpZnlPYmoucmVuZGVyKClcblxuICAgICNyZW5kZXIgdGhlIGluc3RhbmNlIG9uIGluaXRpYWxpemF0aW9uXG4gICAgaW5zdGFuY2UucmVuZGVyKClcbiAgICAjcmV0dXJuIHRoZSBpbnN0YW5jZVxuICAgIGluc3RhbmNlXG5cbiAgI2NvbGxlY3QgdGhlIHRhcmdldCBET00gZWxlbWVudHMgYW5kIGNyZWF0ZSBhbiBpbnN0YW5jZSBmb3IgdGhlbS5cbiAgcG9wdWxhdGVDb250ZW50OiAtPlxuXG4gICAgI2NvbGxlY3QgYWxsIHJlbGV2ZW50IHNjcmlwdCB0YWdzLlxuICAgIHNjcmlwdHMgPSAoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCAnW3R5cGU9XCJ0ZXh0L1dlYkdMaWZ5XCJdJykuY29uY2F0IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwgJ1tzcmMqPVwiV2ViR0xpZnkuanNcIl0nXG5cbiAgICAjc3RvcmUgdGhlIGluc3RhbmNlc1xuICAgIGluc3RhbmNlcyA9IFtdXG5cbiAgICAjY3JlYXRlIGEgZnVuY3Rpb24gdG8gcmV0dXJuIGFsbCB3ZWJnbGlmeSBpbnN0YW5jZXNcbiAgICBAZ2V0SW5zdGFuY2VzID0gLT5cbiAgICAgIGluc3RhbmNlc1xuXG4gICAgI2ZvciBlYWNoIHNjcmlwdFxuICAgIGZvciBzY3JpcHQgaW4gc2NyaXB0c1xuICAgICAgI2NoZWNrIGlmIHRoZSBzY3JpcHQgaXMgZW1wdHlcbiAgICAgIGNvbnRpbnVlIGlmIG5vdCBzY3JpcHQuaW5uZXJIVE1MP1xuICAgICAgI2dldCBhbGwgdGFyZ2V0cyBvciBkZWZhdWx0IHRvIHRoZSBib2R5IGlmIG5vbmUgYXJlIGdpdmVuXG4gICAgICBub2RlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwgc2NyaXB0LmdldEF0dHJpYnV0ZSgndGFyZ2V0Jykgb3IgJ2JvZHknXG4gICAgICAjIGlmIHRoZXJlIGFyZSB0YXJnZXRlZCBub2Rlc1xuICAgICAgaWYgbm9kZXMubGVuZ3RoP1xuICAgICAgICAjIHRoZW4gY3JlYXRlIGFuIGluc3RhbmNlIGFuZCBwdXNoIGl0IGludG8gdGhlIGNvbGxlY3Rpb24gb2YgaW5zdGFuY2VzXG4gICAgICAgIGluc3RhbmNlcy5wdXNoIHdnbGlmeS5yZW5kZXJCbG9jayBzY3JpcHQuaW5uZXJIVE1MLCBub2Rlc1swXVxuXG4gICAgIyBhZGQgYSByZXNpemUgZXZlbnQgbGlzdGVuZXIuIFRPRE86IG1ha2UgdGhpcyB3b3JrLlxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCAoZXZ0KSAtPlxuICAgICAgZm9yIGluc3RhbmNlIGluIGluc3RhbmNlc1xuICAgICAgICBpbnN0YW5jZS5zZXRTaXplXG4gICNnaXZlIG91ciB3Z2xpZnkgb2JqZWN0IGFjY2VzcyB0byB0aGUgV2ViR0xpZnkgZnVuY3Rpb25cbiAgV2ViR0xpZnk6IHJlcXVpcmUgJy4vd2ViZ2xpZnkuY29mZmVlJ1xuXG4jcnVuIG9uIERPTSByZWFkeVxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnRE9NQ29udGVudExvYWRlZCcsIChldmVudCkgLT5cbiAgd2dsaWZ5LnBvcHVsYXRlQ29udGVudCgpIiwiIyMjXG4gKiBXZWJHbGlmeVxuICogaHR0cHM6Ly9naXRodWIuY29tL0RuTWxsci93ZWJnbGlmeVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMyBEYW5pZWwgTWlsbGVyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4jIyNcblxuZHJlc3NlciA9IHJlcXVpcmUgJy4uL2NvbXBpbGVyL2RyZXNzZXIuY29mZmVlJ1xubGF5b3V0ID0gcmVxdWlyZSAnLi4vTGF5b3V0TW9kdWxlcy9sYXlvdXRNb2R1bGUuY29mZmVlJ1xucGFyc2VyID0gcmVxdWlyZSAnLi4vcGFyc2Vycy93ZWJnbGlmeVBBUlNFUi5jb2ZmZWUnXG5yZW5kZXJlciA9IHJlcXVpcmUgJy4uL3JlbmRlcmVyL3JlbmRlcmVyLmNvZmZlZSdcblxuIyBjcmVhdGUgb3VyIFdlYkdsaWZ5IEZ1bmN0aW9uXG5tb2R1bGUuZXhwb3J0cyA9IFdlYkdsaWZ5ID0gKGRhdGEsIGJhc2VXaWR0aCwgYmFzZUhlaWdodCkgLT5cblxuICAjIGJsb2NrIGlzIG91ciBXZWJHTGlmeSBjb2RlXG4gIGJsb2NrID0gZGF0YVxuXG4gICMgIHNjZW5lIGlzIHRoZSBUSFJFRS5KUyBzY2VuZSB0aGF0IGlzIGNyZWF0ZWQgYnkgb3VyIG1vZHVsZXNcbiAgc2NlbmUgPSBsYXlvdXQgZHJlc3NlciAocGFyc2VyIGJsb2NrKSwgYmFzZVdpZHRoLCBiYXNlSGVpZ2h0XG5cbiAgIyAgSW5pdGlhbGl6aW5nIG91ciByZW5kZXJlclxuICByZW5kZXJlci5pbml0IHNjZW5lLnNjZW5lLCBzY2VuZS5jYW1lcmFcblxuICAjIHJldHVybiB0aGUgV2ViR0xpZnkgT2JqZWN0XG4gIFdlYkdsaWZ5T2JqID1cbiAgICByZW5kZXJlcjogcmVuZGVyZXJcbiAgICByZW5kZXI6IC0+XG4gICAgICByZW5kZXJlci5yZW5kZXIoKVxuICAgIG5vZGU6IHJlbmRlcmVyLmRvbUVsZW1lbnRcbiAgICBzY2VuZTogc2NlbmVcblxuXG5cbiMgIERpcmVjdCBhY2Nlc3MgdG8gdGhlIFdlYkdMaWZ5IGZ1bmN0aW9uIG5vdyBkZXByaWNhdGVkLCBtYXkgcmVpbXBsaW1lbnQgbGF0ZXIuXG4jIHdpbmRvdy5XZWJHbGlmeURpcmVjdCA9IChkYXRhKSAtPlxuIyAgIHZhbHVlID0gZGF0YVxuIyAgIHNjZW5lID0gbGF5b3V0IGRyZXNzZXIgcGFyc2VyIHZhbHVlXG4jICAgcmVuZGVyZXIuaW5pdCBzY2VuZS5zY2VuZSwgc2NlbmUuY2FtZXJhXG4jICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCByZW5kZXJlci5kb21FbGVtZW50XG4jICAgcmVuZGVyZXIucmVuZGVyKCkiLCJodG1scGFyc2UgPSByZXF1aXJlICdodG1scGFyc2VyJ1xuXG5maW5kRWxlbWVudHNCeVR5cGUgPSAodHlwZSwgZWxlbWVudCkgLT5cbiAgcmVzdWx0cyA9IFtdXG4gIHJlY3Vyc2VTZWFyY2ggPSAodHlwZSwgZWxlbWVudCkgLT5cbiAgICBmb3Igbm9kZSBpbiBlbGVtZW50XG4gICAgICBpZiBub2RlLnR5cGUgaXMgdHlwZVxuICAgICAgICByZXN1bHRzLnB1c2ggbm9kZS5kYXRhXG4gICAgICByZWN1cnNlU2VhcmNoIHR5cGUsIG5vZGUuY2hpbGRyZW4gaWYgbm9kZS5jaGlsZHJlblxuICByZWN1cnNlU2VhcmNoIHR5cGUsIGVsZW1lbnRcbiAgcmVzdWx0c1xuXG5jbGFzcyBIVE1McGFyc2VyXG4gIGNvbnN0cnVjdG9yOiAoQHR5cGUpIC0+XG4gIHBhcnNlOiAoaHRtbCkgLT5cbiAgICBoYW5kbGVyID0gbmV3IGh0bWxwYXJzZS5EZWZhdWx0SGFuZGxlciAoZXJyb3IsIGRvbSkgLT5cbiAgICAgIGlmIGVycm9yXG4gICAgICAgIGNvbnNvbGUubG9nICdlcnJvcidcbiAgICAgIGVsc2VcbiAgICAgICAgQGRpdnMgPSBmaW5kRWxlbWVudHNCeVR5cGUgJ2RpdicsIGRvbVxuICAgICAgICBAdGV4dCA9IGZpbmRFbGVtZW50c0J5VHlwZSAndGV4dCcsIGRvbVxuICAgIHBhcnNlciA9IG5ldyBodG1scGFyc2UuUGFyc2VyKGhhbmRsZXIpXG4gICAgcGFyc2VyLnBhcnNlQ29tcGxldGUgaHRtbFxuICAgIHtkaXY6IGhhbmRsZXIuZGl2cywgdGV4dDogaGFuZGxlci50ZXh0fVxuXG5cbm1vZHVsZS5leHBvcnRzID0gSFRNTHBhcnNlciIsIihmdW5jdGlvbihfX2ZpbGVuYW1lLF9fZGlybmFtZSl7LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5Db3B5cmlnaHQgMjAxMCwgMjAxMSwgQ2hyaXMgV2luYmVycnkgPGNocmlzQHdpbmJlcnJ5Lm5ldD4uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0b1xuZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGVcbnJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vclxuc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG5hbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HXG5GUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTXG5JTiBUSEUgU09GVFdBUkUuXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qIHYxLjcuNiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXG5mdW5jdGlvbiBydW5uaW5nSW5Ob2RlICgpIHtcblx0cmV0dXJuKFxuXHRcdCh0eXBlb2YgcmVxdWlyZSkgPT0gXCJmdW5jdGlvblwiXG5cdFx0JiZcblx0XHQodHlwZW9mIGV4cG9ydHMpID09IFwib2JqZWN0XCJcblx0XHQmJlxuXHRcdCh0eXBlb2YgbW9kdWxlKSA9PSBcIm9iamVjdFwiXG5cdFx0JiZcblx0XHQodHlwZW9mIF9fZmlsZW5hbWUpID09IFwic3RyaW5nXCJcblx0XHQmJlxuXHRcdCh0eXBlb2YgX19kaXJuYW1lKSA9PSBcInN0cmluZ1wiXG5cdFx0KTtcbn1cblxuaWYgKCFydW5uaW5nSW5Ob2RlKCkpIHtcblx0aWYgKCF0aGlzLlRhdXRvbG9naXN0aWNzKVxuXHRcdHRoaXMuVGF1dG9sb2dpc3RpY3MgPSB7fTtcblx0ZWxzZSBpZiAodGhpcy5UYXV0b2xvZ2lzdGljcy5Ob2RlSHRtbFBhcnNlcilcblx0XHRyZXR1cm47IC8vTm9kZUh0bWxQYXJzZXIgYWxyZWFkeSBkZWZpbmVkIVxuXHR0aGlzLlRhdXRvbG9naXN0aWNzLk5vZGVIdG1sUGFyc2VyID0ge307XG5cdGV4cG9ydHMgPSB0aGlzLlRhdXRvbG9naXN0aWNzLk5vZGVIdG1sUGFyc2VyO1xufVxuXG4vL1R5cGVzIG9mIGVsZW1lbnRzIGZvdW5kIGluIHRoZSBET01cbnZhciBFbGVtZW50VHlwZSA9IHtcblx0ICBUZXh0OiBcInRleHRcIiAvL1BsYWluIHRleHRcblx0LCBEaXJlY3RpdmU6IFwiZGlyZWN0aXZlXCIgLy9TcGVjaWFsIHRhZyA8IS4uLj5cblx0LCBDb21tZW50OiBcImNvbW1lbnRcIiAvL1NwZWNpYWwgdGFnIDwhLS0uLi4tLT5cblx0LCBTY3JpcHQ6IFwic2NyaXB0XCIgLy9TcGVjaWFsIHRhZyA8c2NyaXB0Pi4uLjwvc2NyaXB0PlxuXHQsIFN0eWxlOiBcInN0eWxlXCIgLy9TcGVjaWFsIHRhZyA8c3R5bGU+Li4uPC9zdHlsZT5cblx0LCBUYWc6IFwidGFnXCIgLy9BbnkgdGFnIHRoYXQgaXNuJ3Qgc3BlY2lhbFxufVxuXG5mdW5jdGlvbiBQYXJzZXIgKGhhbmRsZXIsIG9wdGlvbnMpIHtcblx0dGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgPyBvcHRpb25zIDogeyB9O1xuXHRpZiAodGhpcy5fb3B0aW9ucy5pbmNsdWRlTG9jYXRpb24gPT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhpcy5fb3B0aW9ucy5pbmNsdWRlTG9jYXRpb24gPSBmYWxzZTsgLy9EbyBub3QgdHJhY2sgZWxlbWVudCBwb3NpdGlvbiBpbiBkb2N1bWVudCBieSBkZWZhdWx0XG5cdH1cblxuXHR0aGlzLnZhbGlkYXRlSGFuZGxlcihoYW5kbGVyKTtcblx0dGhpcy5faGFuZGxlciA9IGhhbmRsZXI7XG5cdHRoaXMucmVzZXQoKTtcbn1cblxuXHQvLyoqXCJTdGF0aWNcIioqLy9cblx0Ly9SZWd1bGFyIGV4cHJlc3Npb25zIHVzZWQgZm9yIGNsZWFuaW5nIHVwIGFuZCBwYXJzaW5nIChzdGF0ZWxlc3MpXG5cdFBhcnNlci5fcmVUcmltID0gLyheXFxzK3xcXHMrJCkvZzsgLy9UcmltIGxlYWRpbmcvdHJhaWxpbmcgd2hpdGVzcGFjZVxuXHRQYXJzZXIuX3JlVHJpbUNvbW1lbnQgPSAvKF5cXCEtLXwtLSQpL2c7IC8vUmVtb3ZlIGNvbW1lbnQgdGFnIG1hcmt1cCBmcm9tIGNvbW1lbnQgY29udGVudHNcblx0UGFyc2VyLl9yZVdoaXRlc3BhY2UgPSAvXFxzL2c7IC8vVXNlZCB0byBmaW5kIGFueSB3aGl0ZXNwYWNlIHRvIHNwbGl0IG9uXG5cdFBhcnNlci5fcmVUYWdOYW1lID0gL15cXHMqKFxcLz8pXFxzKihbXlxcc1xcL10rKS87IC8vVXNlZCB0byBmaW5kIHRoZSB0YWcgbmFtZSBmb3IgYW4gZWxlbWVudFxuXG5cdC8vUmVndWxhciBleHByZXNzaW9ucyB1c2VkIGZvciBwYXJzaW5nIChzdGF0ZWZ1bClcblx0UGFyc2VyLl9yZUF0dHJpYiA9IC8vRmluZCBhdHRyaWJ1dGVzIGluIGEgdGFnXG5cdFx0LyhbXj08PlxcXCJcXCdcXHNdKylcXHMqPVxccypcIihbXlwiXSopXCJ8KFtePTw+XFxcIlxcJ1xcc10rKVxccyo9XFxzKicoW14nXSopJ3woW149PD5cXFwiXFwnXFxzXSspXFxzKj1cXHMqKFteJ1wiXFxzXSspfChbXj08PlxcXCJcXCdcXHNcXC9dKykvZztcblx0UGFyc2VyLl9yZVRhZ3MgPSAvW1xcPFxcPl0vZzsgLy9GaW5kIHRhZyBtYXJrZXJzXG5cblx0Ly8qKlB1YmxpYyoqLy9cblx0Ly9NZXRob2RzLy9cblx0Ly9QYXJzZXMgYSBjb21wbGV0ZSBIVE1MIGFuZCBwdXNoZXMgaXQgdG8gdGhlIGhhbmRsZXJcblx0UGFyc2VyLnByb3RvdHlwZS5wYXJzZUNvbXBsZXRlID0gZnVuY3Rpb24gUGFyc2VyJHBhcnNlQ29tcGxldGUgKGRhdGEpIHtcblx0XHR0aGlzLnJlc2V0KCk7XG5cdFx0dGhpcy5wYXJzZUNodW5rKGRhdGEpO1xuXHRcdHRoaXMuZG9uZSgpO1xuXHR9XG5cblx0Ly9QYXJzZXMgYSBwaWVjZSBvZiBhbiBIVE1MIGRvY3VtZW50XG5cdFBhcnNlci5wcm90b3R5cGUucGFyc2VDaHVuayA9IGZ1bmN0aW9uIFBhcnNlciRwYXJzZUNodW5rIChkYXRhKSB7XG5cdFx0aWYgKHRoaXMuX2RvbmUpXG5cdFx0XHR0aGlzLmhhbmRsZUVycm9yKG5ldyBFcnJvcihcIkF0dGVtcHRlZCB0byBwYXJzZSBjaHVuayBhZnRlciBwYXJzaW5nIGFscmVhZHkgZG9uZVwiKSk7XG5cdFx0dGhpcy5fYnVmZmVyICs9IGRhdGE7IC8vRklYTUU6IHRoaXMgY2FuIGJlIGEgYm90dGxlbmVja1xuXHRcdHRoaXMucGFyc2VUYWdzKCk7XG5cdH1cblxuXHQvL1RlbGxzIHRoZSBwYXJzZXIgdGhhdCB0aGUgSFRNTCBiZWluZyBwYXJzZWQgaXMgY29tcGxldGVcblx0UGFyc2VyLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24gUGFyc2VyJGRvbmUgKCkge1xuXHRcdGlmICh0aGlzLl9kb25lKVxuXHRcdFx0cmV0dXJuO1xuXHRcdHRoaXMuX2RvbmUgPSB0cnVlO1xuXHRcblx0XHQvL1B1c2ggYW55IHVucGFyc2VkIHRleHQgaW50byBhIGZpbmFsIGVsZW1lbnQgaW4gdGhlIGVsZW1lbnQgbGlzdFxuXHRcdGlmICh0aGlzLl9idWZmZXIubGVuZ3RoKSB7XG5cdFx0XHR2YXIgcmF3RGF0YSA9IHRoaXMuX2J1ZmZlcjtcblx0XHRcdHRoaXMuX2J1ZmZlciA9IFwiXCI7XG5cdFx0XHR2YXIgZWxlbWVudCA9IHtcblx0XHRcdFx0ICByYXc6IHJhd0RhdGFcblx0XHRcdFx0LCBkYXRhOiAodGhpcy5fcGFyc2VTdGF0ZSA9PSBFbGVtZW50VHlwZS5UZXh0KSA/IHJhd0RhdGEgOiByYXdEYXRhLnJlcGxhY2UoUGFyc2VyLl9yZVRyaW0sIFwiXCIpXG5cdFx0XHRcdCwgdHlwZTogdGhpcy5fcGFyc2VTdGF0ZVxuXHRcdFx0XHR9O1xuXHRcdFx0aWYgKHRoaXMuX3BhcnNlU3RhdGUgPT0gRWxlbWVudFR5cGUuVGFnIHx8IHRoaXMuX3BhcnNlU3RhdGUgPT0gRWxlbWVudFR5cGUuU2NyaXB0IHx8IHRoaXMuX3BhcnNlU3RhdGUgPT0gRWxlbWVudFR5cGUuU3R5bGUpXG5cdFx0XHRcdGVsZW1lbnQubmFtZSA9IHRoaXMucGFyc2VUYWdOYW1lKGVsZW1lbnQuZGF0YSk7XG5cdFx0XHR0aGlzLnBhcnNlQXR0cmlicyhlbGVtZW50KTtcblx0XHRcdHRoaXMuX2VsZW1lbnRzLnB1c2goZWxlbWVudCk7XG5cdFx0fVxuXHRcblx0XHR0aGlzLndyaXRlSGFuZGxlcigpO1xuXHRcdHRoaXMuX2hhbmRsZXIuZG9uZSgpO1xuXHR9XG5cblx0Ly9SZXNldHMgdGhlIHBhcnNlciB0byBhIGJsYW5rIHN0YXRlLCByZWFkeSB0byBwYXJzZSBhIG5ldyBIVE1MIGRvY3VtZW50XG5cdFBhcnNlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiBQYXJzZXIkcmVzZXQgKCkge1xuXHRcdHRoaXMuX2J1ZmZlciA9IFwiXCI7XG5cdFx0dGhpcy5fZG9uZSA9IGZhbHNlO1xuXHRcdHRoaXMuX2VsZW1lbnRzID0gW107XG5cdFx0dGhpcy5fZWxlbWVudHNDdXJyZW50ID0gMDtcblx0XHR0aGlzLl9jdXJyZW50ID0gMDtcblx0XHR0aGlzLl9uZXh0ID0gMDtcblx0XHR0aGlzLl9sb2NhdGlvbiA9IHtcblx0XHRcdCAgcm93OiAwXG5cdFx0XHQsIGNvbDogMFxuXHRcdFx0LCBjaGFyT2Zmc2V0OiAwXG5cdFx0XHQsIGluQnVmZmVyOiAwXG5cdFx0fTtcblx0XHR0aGlzLl9wYXJzZVN0YXRlID0gRWxlbWVudFR5cGUuVGV4dDtcblx0XHR0aGlzLl9wcmV2VGFnU2VwID0gJyc7XG5cdFx0dGhpcy5fdGFnU3RhY2sgPSBbXTtcblx0XHR0aGlzLl9oYW5kbGVyLnJlc2V0KCk7XG5cdH1cblx0XG5cdC8vKipQcml2YXRlKiovL1xuXHQvL1Byb3BlcnRpZXMvL1xuXHRQYXJzZXIucHJvdG90eXBlLl9vcHRpb25zID0gbnVsbDsgLy9QYXJzZXIgb3B0aW9ucyBmb3IgaG93IHRvIGJlaGF2ZVxuXHRQYXJzZXIucHJvdG90eXBlLl9oYW5kbGVyID0gbnVsbDsgLy9IYW5kbGVyIGZvciBwYXJzZWQgZWxlbWVudHNcblx0UGFyc2VyLnByb3RvdHlwZS5fYnVmZmVyID0gbnVsbDsgLy9CdWZmZXIgb2YgdW5wYXJzZWQgZGF0YVxuXHRQYXJzZXIucHJvdG90eXBlLl9kb25lID0gZmFsc2U7IC8vRmxhZyBpbmRpY2F0aW5nIHdoZXRoZXIgcGFyc2luZyBpcyBkb25lXG5cdFBhcnNlci5wcm90b3R5cGUuX2VsZW1lbnRzID0gIG51bGw7IC8vQXJyYXkgb2YgcGFyc2VkIGVsZW1lbnRzXG5cdFBhcnNlci5wcm90b3R5cGUuX2VsZW1lbnRzQ3VycmVudCA9IDA7IC8vUG9pbnRlciB0byBsYXN0IGVsZW1lbnQgaW4gX2VsZW1lbnRzIHRoYXQgaGFzIGJlZW4gcHJvY2Vzc2VkXG5cdFBhcnNlci5wcm90b3R5cGUuX2N1cnJlbnQgPSAwOyAvL1Bvc2l0aW9uIGluIGRhdGEgdGhhdCBoYXMgYWxyZWFkeSBiZWVuIHBhcnNlZFxuXHRQYXJzZXIucHJvdG90eXBlLl9uZXh0ID0gMDsgLy9Qb3NpdGlvbiBpbiBkYXRhIG9mIHRoZSBuZXh0IHRhZyBtYXJrZXIgKDw+KVxuXHRQYXJzZXIucHJvdG90eXBlLl9sb2NhdGlvbiA9IG51bGw7IC8vUG9zaXRpb24gdHJhY2tpbmcgZm9yIGVsZW1lbnRzIGluIGEgc3RyZWFtXG5cdFBhcnNlci5wcm90b3R5cGUuX3BhcnNlU3RhdGUgPSBFbGVtZW50VHlwZS5UZXh0OyAvL0N1cnJlbnQgdHlwZSBvZiBlbGVtZW50IGJlaW5nIHBhcnNlZFxuXHRQYXJzZXIucHJvdG90eXBlLl9wcmV2VGFnU2VwID0gJyc7IC8vUHJldmlvdXMgdGFnIG1hcmtlciBmb3VuZFxuXHQvL1N0YWNrIG9mIGVsZW1lbnQgdHlwZXMgcHJldmlvdXNseSBlbmNvdW50ZXJlZDsga2VlcHMgdHJhY2sgb2Ygd2hlblxuXHQvL3BhcnNpbmcgb2NjdXJzIGluc2lkZSBhIHNjcmlwdC9jb21tZW50L3N0eWxlIHRhZ1xuXHRQYXJzZXIucHJvdG90eXBlLl90YWdTdGFjayA9IG51bGw7XG5cblx0Ly9NZXRob2RzLy9cblx0Ly9UYWtlcyBhbiBhcnJheSBvZiBlbGVtZW50cyBhbmQgcGFyc2VzIGFueSBmb3VuZCBhdHRyaWJ1dGVzXG5cdFBhcnNlci5wcm90b3R5cGUucGFyc2VUYWdBdHRyaWJzID0gZnVuY3Rpb24gUGFyc2VyJHBhcnNlVGFnQXR0cmlicyAoZWxlbWVudHMpIHtcblx0XHR2YXIgaWR4RW5kID0gZWxlbWVudHMubGVuZ3RoO1xuXHRcdHZhciBpZHggPSAwO1xuXHRcblx0XHR3aGlsZSAoaWR4IDwgaWR4RW5kKSB7XG5cdFx0XHR2YXIgZWxlbWVudCA9IGVsZW1lbnRzW2lkeCsrXTtcblx0XHRcdGlmIChlbGVtZW50LnR5cGUgPT0gRWxlbWVudFR5cGUuVGFnIHx8IGVsZW1lbnQudHlwZSA9PSBFbGVtZW50VHlwZS5TY3JpcHQgfHwgZWxlbWVudC50eXBlID09IEVsZW1lbnRUeXBlLnN0eWxlKVxuXHRcdFx0XHR0aGlzLnBhcnNlQXR0cmlicyhlbGVtZW50KTtcblx0XHR9XG5cdFxuXHRcdHJldHVybihlbGVtZW50cyk7XG5cdH1cblxuXHQvL1Rha2VzIGFuIGVsZW1lbnQgYW5kIGFkZHMgYW4gXCJhdHRyaWJzXCIgcHJvcGVydHkgZm9yIGFueSBlbGVtZW50IGF0dHJpYnV0ZXMgZm91bmQgXG5cdFBhcnNlci5wcm90b3R5cGUucGFyc2VBdHRyaWJzID0gZnVuY3Rpb24gUGFyc2VyJHBhcnNlQXR0cmlicyAoZWxlbWVudCkge1xuXHRcdC8vT25seSBwYXJzZSBhdHRyaWJ1dGVzIGZvciB0YWdzXG5cdFx0aWYgKGVsZW1lbnQudHlwZSAhPSBFbGVtZW50VHlwZS5TY3JpcHQgJiYgZWxlbWVudC50eXBlICE9IEVsZW1lbnRUeXBlLlN0eWxlICYmIGVsZW1lbnQudHlwZSAhPSBFbGVtZW50VHlwZS5UYWcpXG5cdFx0XHRyZXR1cm47XG5cdFxuXHRcdHZhciB0YWdOYW1lID0gZWxlbWVudC5kYXRhLnNwbGl0KFBhcnNlci5fcmVXaGl0ZXNwYWNlLCAxKVswXTtcblx0XHR2YXIgYXR0cmliUmF3ID0gZWxlbWVudC5kYXRhLnN1YnN0cmluZyh0YWdOYW1lLmxlbmd0aCk7XG5cdFx0aWYgKGF0dHJpYlJhdy5sZW5ndGggPCAxKVxuXHRcdFx0cmV0dXJuO1xuXHRcblx0XHR2YXIgbWF0Y2g7XG5cdFx0UGFyc2VyLl9yZUF0dHJpYi5sYXN0SW5kZXggPSAwO1xuXHRcdHdoaWxlIChtYXRjaCA9IFBhcnNlci5fcmVBdHRyaWIuZXhlYyhhdHRyaWJSYXcpKSB7XG5cdFx0XHRpZiAoZWxlbWVudC5hdHRyaWJzID09IHVuZGVmaW5lZClcblx0XHRcdFx0ZWxlbWVudC5hdHRyaWJzID0ge307XG5cdFxuXHRcdFx0aWYgKHR5cGVvZiBtYXRjaFsxXSA9PSBcInN0cmluZ1wiICYmIG1hdGNoWzFdLmxlbmd0aCkge1xuXHRcdFx0XHRlbGVtZW50LmF0dHJpYnNbbWF0Y2hbMV1dID0gbWF0Y2hbMl07XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBtYXRjaFszXSA9PSBcInN0cmluZ1wiICYmIG1hdGNoWzNdLmxlbmd0aCkge1xuXHRcdFx0XHRlbGVtZW50LmF0dHJpYnNbbWF0Y2hbM10udG9TdHJpbmcoKV0gPSBtYXRjaFs0XS50b1N0cmluZygpO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgbWF0Y2hbNV0gPT0gXCJzdHJpbmdcIiAmJiBtYXRjaFs1XS5sZW5ndGgpIHtcblx0XHRcdFx0ZWxlbWVudC5hdHRyaWJzW21hdGNoWzVdXSA9IG1hdGNoWzZdO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgbWF0Y2hbN10gPT0gXCJzdHJpbmdcIiAmJiBtYXRjaFs3XS5sZW5ndGgpIHtcblx0XHRcdFx0ZWxlbWVudC5hdHRyaWJzW21hdGNoWzddXSA9IG1hdGNoWzddO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vRXh0cmFjdHMgdGhlIGJhc2UgdGFnIG5hbWUgZnJvbSB0aGUgZGF0YSB2YWx1ZSBvZiBhbiBlbGVtZW50XG5cdFBhcnNlci5wcm90b3R5cGUucGFyc2VUYWdOYW1lID0gZnVuY3Rpb24gUGFyc2VyJHBhcnNlVGFnTmFtZSAoZGF0YSkge1xuXHRcdGlmIChkYXRhID09IG51bGwgfHwgZGF0YSA9PSBcIlwiKVxuXHRcdFx0cmV0dXJuKFwiXCIpO1xuXHRcdHZhciBtYXRjaCA9IFBhcnNlci5fcmVUYWdOYW1lLmV4ZWMoZGF0YSk7XG5cdFx0aWYgKCFtYXRjaClcblx0XHRcdHJldHVybihcIlwiKTtcblx0XHRyZXR1cm4oKG1hdGNoWzFdID8gXCIvXCIgOiBcIlwiKSArIG1hdGNoWzJdKTtcblx0fVxuXG5cdC8vUGFyc2VzIHRocm91Z2ggSFRNTCB0ZXh0IGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIGZvdW5kIGVsZW1lbnRzXG5cdC8vSSBhZG1pdCwgdGhpcyBmdW5jdGlvbiBpcyByYXRoZXIgbGFyZ2UgYnV0IHNwbGl0dGluZyB1cCBoYWQgYW4gbm90aWNlYWJsZSBpbXBhY3Qgb24gc3BlZWRcblx0UGFyc2VyLnByb3RvdHlwZS5wYXJzZVRhZ3MgPSBmdW5jdGlvbiBQYXJzZXIkcGFyc2VUYWdzICgpIHtcblx0XHR2YXIgYnVmZmVyRW5kID0gdGhpcy5fYnVmZmVyLmxlbmd0aCAtIDE7XG5cdFx0d2hpbGUgKFBhcnNlci5fcmVUYWdzLnRlc3QodGhpcy5fYnVmZmVyKSkge1xuXHRcdFx0dGhpcy5fbmV4dCA9IFBhcnNlci5fcmVUYWdzLmxhc3RJbmRleCAtIDE7XG5cdFx0XHR2YXIgdGFnU2VwID0gdGhpcy5fYnVmZmVyLmNoYXJBdCh0aGlzLl9uZXh0KTsgLy9UaGUgY3VycmVudGx5IGZvdW5kIHRhZyBtYXJrZXJcblx0XHRcdHZhciByYXdEYXRhID0gdGhpcy5fYnVmZmVyLnN1YnN0cmluZyh0aGlzLl9jdXJyZW50LCB0aGlzLl9uZXh0KTsgLy9UaGUgbmV4dCBjaHVuayBvZiBkYXRhIHRvIHBhcnNlXG5cdFxuXHRcdFx0Ly9BIG5ldyBlbGVtZW50IHRvIGV2ZW50dWFsbHkgYmUgYXBwZW5kZWQgdG8gdGhlIGVsZW1lbnQgbGlzdFxuXHRcdFx0dmFyIGVsZW1lbnQgPSB7XG5cdFx0XHRcdCAgcmF3OiByYXdEYXRhXG5cdFx0XHRcdCwgZGF0YTogKHRoaXMuX3BhcnNlU3RhdGUgPT0gRWxlbWVudFR5cGUuVGV4dCkgPyByYXdEYXRhIDogcmF3RGF0YS5yZXBsYWNlKFBhcnNlci5fcmVUcmltLCBcIlwiKVxuXHRcdFx0XHQsIHR5cGU6IHRoaXMuX3BhcnNlU3RhdGVcblx0XHRcdH07XG5cdFxuXHRcdFx0dmFyIGVsZW1lbnROYW1lID0gdGhpcy5wYXJzZVRhZ05hbWUoZWxlbWVudC5kYXRhKTtcblx0XG5cdFx0XHQvL1RoaXMgc2VjdGlvbiBpbnNwZWN0cyB0aGUgY3VycmVudCB0YWcgc3RhY2sgYW5kIG1vZGlmaWVzIHRoZSBjdXJyZW50XG5cdFx0XHQvL2VsZW1lbnQgaWYgd2UncmUgYWN0dWFsbHkgcGFyc2luZyBhIHNwZWNpYWwgYXJlYSAoc2NyaXB0L2NvbW1lbnQvc3R5bGUgdGFnKVxuXHRcdFx0aWYgKHRoaXMuX3RhZ1N0YWNrLmxlbmd0aCkgeyAvL1dlJ3JlIHBhcnNpbmcgaW5zaWRlIGEgc2NyaXB0L2NvbW1lbnQvc3R5bGUgdGFnXG5cdFx0XHRcdGlmICh0aGlzLl90YWdTdGFja1t0aGlzLl90YWdTdGFjay5sZW5ndGggLSAxXSA9PSBFbGVtZW50VHlwZS5TY3JpcHQpIHsgLy9XZSdyZSBjdXJyZW50bHkgaW4gYSBzY3JpcHQgdGFnXG5cdFx0XHRcdFx0aWYgKGVsZW1lbnROYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCIvc2NyaXB0XCIpIC8vQWN0dWFsbHksIHdlJ3JlIG5vIGxvbmdlciBpbiBhIHNjcmlwdCB0YWcsIHNvIHBvcCBpdCBvZmYgdGhlIHN0YWNrXG5cdFx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5wb3AoKTtcblx0XHRcdFx0XHRlbHNlIHsgLy9Ob3QgYSBjbG9zaW5nIHNjcmlwdCB0YWdcblx0XHRcdFx0XHRcdGlmIChlbGVtZW50LnJhdy5pbmRleE9mKFwiIS0tXCIpICE9IDApIHsgLy9NYWtlIHN1cmUgd2UncmUgbm90IGluIGEgY29tbWVudFxuXHRcdFx0XHRcdFx0XHQvL0FsbCBkYXRhIGZyb20gaGVyZSB0byBzY3JpcHQgY2xvc2UgaXMgbm93IGEgdGV4dCBlbGVtZW50XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQudHlwZSA9IEVsZW1lbnRUeXBlLlRleHQ7XG5cdFx0XHRcdFx0XHRcdC8vSWYgdGhlIHByZXZpb3VzIGVsZW1lbnQgaXMgdGV4dCwgYXBwZW5kIHRoZSBjdXJyZW50IHRleHQgdG8gaXRcblx0XHRcdFx0XHRcdFx0aWYgKHRoaXMuX2VsZW1lbnRzLmxlbmd0aCAmJiB0aGlzLl9lbGVtZW50c1t0aGlzLl9lbGVtZW50cy5sZW5ndGggLSAxXS50eXBlID09IEVsZW1lbnRUeXBlLlRleHQpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgcHJldkVsZW1lbnQgPSB0aGlzLl9lbGVtZW50c1t0aGlzLl9lbGVtZW50cy5sZW5ndGggLSAxXTtcblx0XHRcdFx0XHRcdFx0XHRwcmV2RWxlbWVudC5yYXcgPSBwcmV2RWxlbWVudC5kYXRhID0gcHJldkVsZW1lbnQucmF3ICsgdGhpcy5fcHJldlRhZ1NlcCArIGVsZW1lbnQucmF3O1xuXHRcdFx0XHRcdFx0XHRcdGVsZW1lbnQucmF3ID0gZWxlbWVudC5kYXRhID0gXCJcIjsgLy9UaGlzIGNhdXNlcyB0aGUgY3VycmVudCBlbGVtZW50IHRvIG5vdCBiZSBhZGRlZCB0byB0aGUgZWxlbWVudCBsaXN0XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAodGhpcy5fdGFnU3RhY2tbdGhpcy5fdGFnU3RhY2subGVuZ3RoIC0gMV0gPT0gRWxlbWVudFR5cGUuU3R5bGUpIHsgLy9XZSdyZSBjdXJyZW50bHkgaW4gYSBzdHlsZSB0YWdcblx0XHRcdFx0XHRpZiAoZWxlbWVudE5hbWUudG9Mb3dlckNhc2UoKSA9PSBcIi9zdHlsZVwiKSAvL0FjdHVhbGx5LCB3ZSdyZSBubyBsb25nZXIgaW4gYSBzdHlsZSB0YWcsIHNvIHBvcCBpdCBvZmYgdGhlIHN0YWNrXG5cdFx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5wb3AoKTtcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGlmIChlbGVtZW50LnJhdy5pbmRleE9mKFwiIS0tXCIpICE9IDApIHsgLy9NYWtlIHN1cmUgd2UncmUgbm90IGluIGEgY29tbWVudFxuXHRcdFx0XHRcdFx0XHQvL0FsbCBkYXRhIGZyb20gaGVyZSB0byBzdHlsZSBjbG9zZSBpcyBub3cgYSB0ZXh0IGVsZW1lbnRcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC50eXBlID0gRWxlbWVudFR5cGUuVGV4dDtcblx0XHRcdFx0XHRcdFx0Ly9JZiB0aGUgcHJldmlvdXMgZWxlbWVudCBpcyB0ZXh0LCBhcHBlbmQgdGhlIGN1cnJlbnQgdGV4dCB0byBpdFxuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5fZWxlbWVudHMubGVuZ3RoICYmIHRoaXMuX2VsZW1lbnRzW3RoaXMuX2VsZW1lbnRzLmxlbmd0aCAtIDFdLnR5cGUgPT0gRWxlbWVudFR5cGUuVGV4dCkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBwcmV2RWxlbWVudCA9IHRoaXMuX2VsZW1lbnRzW3RoaXMuX2VsZW1lbnRzLmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChlbGVtZW50LnJhdyAhPSBcIlwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwcmV2RWxlbWVudC5yYXcgPSBwcmV2RWxlbWVudC5kYXRhID0gcHJldkVsZW1lbnQucmF3ICsgdGhpcy5fcHJldlRhZ1NlcCArIGVsZW1lbnQucmF3O1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbWVudC5yYXcgPSBlbGVtZW50LmRhdGEgPSBcIlwiOyAvL1RoaXMgY2F1c2VzIHRoZSBjdXJyZW50IGVsZW1lbnQgdG8gbm90IGJlIGFkZGVkIHRvIHRoZSBlbGVtZW50IGxpc3Rcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgeyAvL0VsZW1lbnQgaXMgZW1wdHksIHNvIGp1c3QgYXBwZW5kIHRoZSBsYXN0IHRhZyBtYXJrZXIgZm91bmRcblx0XHRcdFx0XHRcdFx0XHRcdHByZXZFbGVtZW50LnJhdyA9IHByZXZFbGVtZW50LmRhdGEgPSBwcmV2RWxlbWVudC5yYXcgKyB0aGlzLl9wcmV2VGFnU2VwO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSBlbHNlIHsgLy9UaGUgcHJldmlvdXMgZWxlbWVudCB3YXMgbm90IHRleHRcblx0XHRcdFx0XHRcdFx0XHRpZiAoZWxlbWVudC5yYXcgIT0gXCJcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbWVudC5yYXcgPSBlbGVtZW50LmRhdGEgPSBlbGVtZW50LnJhdztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAodGhpcy5fdGFnU3RhY2tbdGhpcy5fdGFnU3RhY2subGVuZ3RoIC0gMV0gPT0gRWxlbWVudFR5cGUuQ29tbWVudCkgeyAvL1dlJ3JlIGN1cnJlbnRseSBpbiBhIGNvbW1lbnQgdGFnXG5cdFx0XHRcdFx0dmFyIHJhd0xlbiA9IGVsZW1lbnQucmF3Lmxlbmd0aDtcblx0XHRcdFx0XHRpZiAoZWxlbWVudC5yYXcuY2hhckF0KHJhd0xlbiAtIDIpID09IFwiLVwiICYmIGVsZW1lbnQucmF3LmNoYXJBdChyYXdMZW4gLSAxKSA9PSBcIi1cIiAmJiB0YWdTZXAgPT0gXCI+XCIpIHtcblx0XHRcdFx0XHRcdC8vQWN0dWFsbHksIHdlJ3JlIG5vIGxvbmdlciBpbiBhIHN0eWxlIHRhZywgc28gcG9wIGl0IG9mZiB0aGUgc3RhY2tcblx0XHRcdFx0XHRcdHRoaXMuX3RhZ1N0YWNrLnBvcCgpO1xuXHRcdFx0XHRcdFx0Ly9JZiB0aGUgcHJldmlvdXMgZWxlbWVudCBpcyBhIGNvbW1lbnQsIGFwcGVuZCB0aGUgY3VycmVudCB0ZXh0IHRvIGl0XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5fZWxlbWVudHMubGVuZ3RoICYmIHRoaXMuX2VsZW1lbnRzW3RoaXMuX2VsZW1lbnRzLmxlbmd0aCAtIDFdLnR5cGUgPT0gRWxlbWVudFR5cGUuQ29tbWVudCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgcHJldkVsZW1lbnQgPSB0aGlzLl9lbGVtZW50c1t0aGlzLl9lbGVtZW50cy5sZW5ndGggLSAxXTtcblx0XHRcdFx0XHRcdFx0cHJldkVsZW1lbnQucmF3ID0gcHJldkVsZW1lbnQuZGF0YSA9IChwcmV2RWxlbWVudC5yYXcgKyBlbGVtZW50LnJhdykucmVwbGFjZShQYXJzZXIuX3JlVHJpbUNvbW1lbnQsIFwiXCIpO1xuXHRcdFx0XHRcdFx0XHRlbGVtZW50LnJhdyA9IGVsZW1lbnQuZGF0YSA9IFwiXCI7IC8vVGhpcyBjYXVzZXMgdGhlIGN1cnJlbnQgZWxlbWVudCB0byBub3QgYmUgYWRkZWQgdG8gdGhlIGVsZW1lbnQgbGlzdFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50LnR5cGUgPSBFbGVtZW50VHlwZS5UZXh0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSAvL1ByZXZpb3VzIGVsZW1lbnQgbm90IGEgY29tbWVudFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50LnR5cGUgPSBFbGVtZW50VHlwZS5Db21tZW50OyAvL0NoYW5nZSB0aGUgY3VycmVudCBlbGVtZW50J3MgdHlwZSB0byBhIGNvbW1lbnRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7IC8vU3RpbGwgaW4gYSBjb21tZW50IHRhZ1xuXHRcdFx0XHRcdFx0ZWxlbWVudC50eXBlID0gRWxlbWVudFR5cGUuQ29tbWVudDtcblx0XHRcdFx0XHRcdC8vSWYgdGhlIHByZXZpb3VzIGVsZW1lbnQgaXMgYSBjb21tZW50LCBhcHBlbmQgdGhlIGN1cnJlbnQgdGV4dCB0byBpdFxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX2VsZW1lbnRzLmxlbmd0aCAmJiB0aGlzLl9lbGVtZW50c1t0aGlzLl9lbGVtZW50cy5sZW5ndGggLSAxXS50eXBlID09IEVsZW1lbnRUeXBlLkNvbW1lbnQpIHtcblx0XHRcdFx0XHRcdFx0dmFyIHByZXZFbGVtZW50ID0gdGhpcy5fZWxlbWVudHNbdGhpcy5fZWxlbWVudHMubGVuZ3RoIC0gMV07XG5cdFx0XHRcdFx0XHRcdHByZXZFbGVtZW50LnJhdyA9IHByZXZFbGVtZW50LmRhdGEgPSBwcmV2RWxlbWVudC5yYXcgKyBlbGVtZW50LnJhdyArIHRhZ1NlcDtcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC5yYXcgPSBlbGVtZW50LmRhdGEgPSBcIlwiOyAvL1RoaXMgY2F1c2VzIHRoZSBjdXJyZW50IGVsZW1lbnQgdG8gbm90IGJlIGFkZGVkIHRvIHRoZSBlbGVtZW50IGxpc3Rcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC50eXBlID0gRWxlbWVudFR5cGUuVGV4dDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC5yYXcgPSBlbGVtZW50LmRhdGEgPSBlbGVtZW50LnJhdyArIHRhZ1NlcDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XG5cdFx0XHQvL1Byb2Nlc3Npbmcgb2Ygbm9uLXNwZWNpYWwgdGFnc1xuXHRcdFx0aWYgKGVsZW1lbnQudHlwZSA9PSBFbGVtZW50VHlwZS5UYWcpIHtcblx0XHRcdFx0ZWxlbWVudC5uYW1lID0gZWxlbWVudE5hbWU7XG5cdFx0XHRcdHZhciBlbGVtZW50TmFtZUNJID0gZWxlbWVudE5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChlbGVtZW50LnJhdy5pbmRleE9mKFwiIS0tXCIpID09IDApIHsgLy9UaGlzIHRhZyBpcyByZWFsbHkgY29tbWVudFxuXHRcdFx0XHRcdGVsZW1lbnQudHlwZSA9IEVsZW1lbnRUeXBlLkNvbW1lbnQ7XG5cdFx0XHRcdFx0ZGVsZXRlIGVsZW1lbnRbXCJuYW1lXCJdO1xuXHRcdFx0XHRcdHZhciByYXdMZW4gPSBlbGVtZW50LnJhdy5sZW5ndGg7XG5cdFx0XHRcdFx0Ly9DaGVjayBpZiB0aGUgY29tbWVudCBpcyB0ZXJtaW5hdGVkIGluIHRoZSBjdXJyZW50IGVsZW1lbnRcblx0XHRcdFx0XHRpZiAoZWxlbWVudC5yYXcuY2hhckF0KHJhd0xlbiAtIDEpID09IFwiLVwiICYmIGVsZW1lbnQucmF3LmNoYXJBdChyYXdMZW4gLSAyKSA9PSBcIi1cIiAmJiB0YWdTZXAgPT0gXCI+XCIpXG5cdFx0XHRcdFx0XHRlbGVtZW50LnJhdyA9IGVsZW1lbnQuZGF0YSA9IGVsZW1lbnQucmF3LnJlcGxhY2UoUGFyc2VyLl9yZVRyaW1Db21tZW50LCBcIlwiKTtcblx0XHRcdFx0XHRlbHNlIHsgLy9JdCdzIG5vdCBzbyBwdXNoIHRoZSBjb21tZW50IG9udG8gdGhlIHRhZyBzdGFja1xuXHRcdFx0XHRcdFx0ZWxlbWVudC5yYXcgKz0gdGFnU2VwO1xuXHRcdFx0XHRcdFx0dGhpcy5fdGFnU3RhY2sucHVzaChFbGVtZW50VHlwZS5Db21tZW50KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZWxlbWVudC5yYXcuaW5kZXhPZihcIiFcIikgPT0gMCB8fCBlbGVtZW50LnJhdy5pbmRleE9mKFwiP1wiKSA9PSAwKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC50eXBlID0gRWxlbWVudFR5cGUuRGlyZWN0aXZlO1xuXHRcdFx0XHRcdC8vVE9ETzogd2hhdCBhYm91dCBDREFUQT9cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChlbGVtZW50TmFtZUNJID09IFwic2NyaXB0XCIpIHtcblx0XHRcdFx0XHRlbGVtZW50LnR5cGUgPSBFbGVtZW50VHlwZS5TY3JpcHQ7XG5cdFx0XHRcdFx0Ly9TcGVjaWFsIHRhZywgcHVzaCBvbnRvIHRoZSB0YWcgc3RhY2sgaWYgbm90IHRlcm1pbmF0ZWRcblx0XHRcdFx0XHRpZiAoZWxlbWVudC5kYXRhLmNoYXJBdChlbGVtZW50LmRhdGEubGVuZ3RoIC0gMSkgIT0gXCIvXCIpXG5cdFx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5wdXNoKEVsZW1lbnRUeXBlLlNjcmlwdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZWxlbWVudE5hbWVDSSA9PSBcIi9zY3JpcHRcIilcblx0XHRcdFx0XHRlbGVtZW50LnR5cGUgPSBFbGVtZW50VHlwZS5TY3JpcHQ7XG5cdFx0XHRcdGVsc2UgaWYgKGVsZW1lbnROYW1lQ0kgPT0gXCJzdHlsZVwiKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC50eXBlID0gRWxlbWVudFR5cGUuU3R5bGU7XG5cdFx0XHRcdFx0Ly9TcGVjaWFsIHRhZywgcHVzaCBvbnRvIHRoZSB0YWcgc3RhY2sgaWYgbm90IHRlcm1pbmF0ZWRcblx0XHRcdFx0XHRpZiAoZWxlbWVudC5kYXRhLmNoYXJBdChlbGVtZW50LmRhdGEubGVuZ3RoIC0gMSkgIT0gXCIvXCIpXG5cdFx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5wdXNoKEVsZW1lbnRUeXBlLlN0eWxlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChlbGVtZW50TmFtZUNJID09IFwiL3N0eWxlXCIpXG5cdFx0XHRcdFx0ZWxlbWVudC50eXBlID0gRWxlbWVudFR5cGUuU3R5bGU7XG5cdFx0XHRcdGlmIChlbGVtZW50Lm5hbWUgJiYgZWxlbWVudC5uYW1lLmNoYXJBdCgwKSA9PSBcIi9cIilcblx0XHRcdFx0XHRlbGVtZW50LmRhdGEgPSBlbGVtZW50Lm5hbWU7XG5cdFx0XHR9XG5cdFxuXHRcdFx0Ly9BZGQgYWxsIHRhZ3MgYW5kIG5vbi1lbXB0eSB0ZXh0IGVsZW1lbnRzIHRvIHRoZSBlbGVtZW50IGxpc3Rcblx0XHRcdGlmIChlbGVtZW50LnJhdyAhPSBcIlwiIHx8IGVsZW1lbnQudHlwZSAhPSBFbGVtZW50VHlwZS5UZXh0KSB7XG5cdFx0XHRcdGlmICh0aGlzLl9vcHRpb25zLmluY2x1ZGVMb2NhdGlvbiAmJiAhZWxlbWVudC5sb2NhdGlvbikge1xuXHRcdFx0XHRcdGVsZW1lbnQubG9jYXRpb24gPSB0aGlzLmdldExvY2F0aW9uKGVsZW1lbnQudHlwZSA9PSBFbGVtZW50VHlwZS5UYWcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMucGFyc2VBdHRyaWJzKGVsZW1lbnQpO1xuXHRcdFx0XHR0aGlzLl9lbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuXHRcdFx0XHQvL0lmIHRhZyBzZWxmLXRlcm1pbmF0ZXMsIGFkZCBhbiBleHBsaWNpdCwgc2VwYXJhdGUgY2xvc2luZyB0YWdcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdGVsZW1lbnQudHlwZSAhPSBFbGVtZW50VHlwZS5UZXh0XG5cdFx0XHRcdFx0JiZcblx0XHRcdFx0XHRlbGVtZW50LnR5cGUgIT0gRWxlbWVudFR5cGUuQ29tbWVudFxuXHRcdFx0XHRcdCYmXG5cdFx0XHRcdFx0ZWxlbWVudC50eXBlICE9IEVsZW1lbnRUeXBlLkRpcmVjdGl2ZVxuXHRcdFx0XHRcdCYmXG5cdFx0XHRcdFx0ZWxlbWVudC5kYXRhLmNoYXJBdChlbGVtZW50LmRhdGEubGVuZ3RoIC0gMSkgPT0gXCIvXCJcblx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0dGhpcy5fZWxlbWVudHMucHVzaCh7XG5cdFx0XHRcdFx0XHQgIHJhdzogXCIvXCIgKyBlbGVtZW50Lm5hbWVcblx0XHRcdFx0XHRcdCwgZGF0YTogXCIvXCIgKyBlbGVtZW50Lm5hbWVcblx0XHRcdFx0XHRcdCwgbmFtZTogXCIvXCIgKyBlbGVtZW50Lm5hbWVcblx0XHRcdFx0XHRcdCwgdHlwZTogZWxlbWVudC50eXBlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9wYXJzZVN0YXRlID0gKHRhZ1NlcCA9PSBcIjxcIikgPyBFbGVtZW50VHlwZS5UYWcgOiBFbGVtZW50VHlwZS5UZXh0O1xuXHRcdFx0dGhpcy5fY3VycmVudCA9IHRoaXMuX25leHQgKyAxO1xuXHRcdFx0dGhpcy5fcHJldlRhZ1NlcCA9IHRhZ1NlcDtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fb3B0aW9ucy5pbmNsdWRlTG9jYXRpb24pIHtcblx0XHRcdHRoaXMuZ2V0TG9jYXRpb24oKTtcblx0XHRcdHRoaXMuX2xvY2F0aW9uLnJvdyArPSB0aGlzLl9sb2NhdGlvbi5pbkJ1ZmZlcjtcblx0XHRcdHRoaXMuX2xvY2F0aW9uLmluQnVmZmVyID0gMDtcblx0XHRcdHRoaXMuX2xvY2F0aW9uLmNoYXJPZmZzZXQgPSAwO1xuXHRcdH1cblx0XHR0aGlzLl9idWZmZXIgPSAodGhpcy5fY3VycmVudCA8PSBidWZmZXJFbmQpID8gdGhpcy5fYnVmZmVyLnN1YnN0cmluZyh0aGlzLl9jdXJyZW50KSA6IFwiXCI7XG5cdFx0dGhpcy5fY3VycmVudCA9IDA7XG5cdFxuXHRcdHRoaXMud3JpdGVIYW5kbGVyKCk7XG5cdH1cblxuXHRQYXJzZXIucHJvdG90eXBlLmdldExvY2F0aW9uID0gZnVuY3Rpb24gUGFyc2VyJGdldExvY2F0aW9uIChzdGFydFRhZykge1xuXHRcdHZhciBjLFxuXHRcdFx0bCA9IHRoaXMuX2xvY2F0aW9uLFxuXHRcdFx0ZW5kID0gdGhpcy5fY3VycmVudCAtIChzdGFydFRhZyA/IDEgOiAwKSxcblx0XHRcdGNodW5rID0gc3RhcnRUYWcgJiYgbC5jaGFyT2Zmc2V0ID09IDAgJiYgdGhpcy5fY3VycmVudCA9PSAwO1xuXHRcdFxuXHRcdGZvciAoOyBsLmNoYXJPZmZzZXQgPCBlbmQ7IGwuY2hhck9mZnNldCsrKSB7XG5cdFx0XHRjID0gdGhpcy5fYnVmZmVyLmNoYXJBdChsLmNoYXJPZmZzZXQpO1xuXHRcdFx0aWYgKGMgPT0gJ1xcbicpIHtcblx0XHRcdFx0bC5pbkJ1ZmZlcisrO1xuXHRcdFx0XHRsLmNvbCA9IDA7XG5cdFx0XHR9IGVsc2UgaWYgKGMgIT0gJ1xccicpIHtcblx0XHRcdFx0bC5jb2wrKztcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdCAgbGluZTogbC5yb3cgKyBsLmluQnVmZmVyICsgMVxuXHRcdFx0LCBjb2w6IGwuY29sICsgKGNodW5rID8gMDogMSlcblx0XHR9O1xuXHR9XG5cblx0Ly9DaGVja3MgdGhlIGhhbmRsZXIgdG8gbWFrZSBpdCBpcyBhbiBvYmplY3Qgd2l0aCB0aGUgcmlnaHQgXCJpbnRlcmZhY2VcIlxuXHRQYXJzZXIucHJvdG90eXBlLnZhbGlkYXRlSGFuZGxlciA9IGZ1bmN0aW9uIFBhcnNlciR2YWxpZGF0ZUhhbmRsZXIgKGhhbmRsZXIpIHtcblx0XHRpZiAoKHR5cGVvZiBoYW5kbGVyKSAhPSBcIm9iamVjdFwiKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSGFuZGxlciBpcyBub3QgYW4gb2JqZWN0XCIpO1xuXHRcdGlmICgodHlwZW9mIGhhbmRsZXIucmVzZXQpICE9IFwiZnVuY3Rpb25cIilcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkhhbmRsZXIgbWV0aG9kICdyZXNldCcgaXMgaW52YWxpZFwiKTtcblx0XHRpZiAoKHR5cGVvZiBoYW5kbGVyLmRvbmUpICE9IFwiZnVuY3Rpb25cIilcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkhhbmRsZXIgbWV0aG9kICdkb25lJyBpcyBpbnZhbGlkXCIpO1xuXHRcdGlmICgodHlwZW9mIGhhbmRsZXIud3JpdGVUYWcpICE9IFwiZnVuY3Rpb25cIilcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkhhbmRsZXIgbWV0aG9kICd3cml0ZVRhZycgaXMgaW52YWxpZFwiKTtcblx0XHRpZiAoKHR5cGVvZiBoYW5kbGVyLndyaXRlVGV4dCkgIT0gXCJmdW5jdGlvblwiKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSGFuZGxlciBtZXRob2QgJ3dyaXRlVGV4dCcgaXMgaW52YWxpZFwiKTtcblx0XHRpZiAoKHR5cGVvZiBoYW5kbGVyLndyaXRlQ29tbWVudCkgIT0gXCJmdW5jdGlvblwiKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSGFuZGxlciBtZXRob2QgJ3dyaXRlQ29tbWVudCcgaXMgaW52YWxpZFwiKTtcblx0XHRpZiAoKHR5cGVvZiBoYW5kbGVyLndyaXRlRGlyZWN0aXZlKSAhPSBcImZ1bmN0aW9uXCIpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJIYW5kbGVyIG1ldGhvZCAnd3JpdGVEaXJlY3RpdmUnIGlzIGludmFsaWRcIik7XG5cdH1cblxuXHQvL1dyaXRlcyBwYXJzZWQgZWxlbWVudHMgb3V0IHRvIHRoZSBoYW5kbGVyXG5cdFBhcnNlci5wcm90b3R5cGUud3JpdGVIYW5kbGVyID0gZnVuY3Rpb24gUGFyc2VyJHdyaXRlSGFuZGxlciAoZm9yY2VGbHVzaCkge1xuXHRcdGZvcmNlRmx1c2ggPSAhIWZvcmNlRmx1c2g7XG5cdFx0aWYgKHRoaXMuX3RhZ1N0YWNrLmxlbmd0aCAmJiAhZm9yY2VGbHVzaClcblx0XHRcdHJldHVybjtcblx0XHR3aGlsZSAodGhpcy5fZWxlbWVudHMubGVuZ3RoKSB7XG5cdFx0XHR2YXIgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRzLnNoaWZ0KCk7XG5cdFx0XHRzd2l0Y2ggKGVsZW1lbnQudHlwZSkge1xuXHRcdFx0XHRjYXNlIEVsZW1lbnRUeXBlLkNvbW1lbnQ6XG5cdFx0XHRcdFx0dGhpcy5faGFuZGxlci53cml0ZUNvbW1lbnQoZWxlbWVudCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgRWxlbWVudFR5cGUuRGlyZWN0aXZlOlxuXHRcdFx0XHRcdHRoaXMuX2hhbmRsZXIud3JpdGVEaXJlY3RpdmUoZWxlbWVudCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgRWxlbWVudFR5cGUuVGV4dDpcblx0XHRcdFx0XHR0aGlzLl9oYW5kbGVyLndyaXRlVGV4dChlbGVtZW50KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aGlzLl9oYW5kbGVyLndyaXRlVGFnKGVsZW1lbnQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdFBhcnNlci5wcm90b3R5cGUuaGFuZGxlRXJyb3IgPSBmdW5jdGlvbiBQYXJzZXIkaGFuZGxlRXJyb3IgKGVycm9yKSB7XG5cdFx0aWYgKCh0eXBlb2YgdGhpcy5faGFuZGxlci5lcnJvcikgPT0gXCJmdW5jdGlvblwiKVxuXHRcdFx0dGhpcy5faGFuZGxlci5lcnJvcihlcnJvcik7XG5cdFx0ZWxzZVxuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdH1cblxuLy9UT0RPOiBtYWtlIHRoaXMgYSB0cnVsbHkgc3RyZWFtYWJsZSBoYW5kbGVyXG5mdW5jdGlvbiBSc3NIYW5kbGVyIChjYWxsYmFjaykge1xuXHRSc3NIYW5kbGVyLnN1cGVyXy5jYWxsKHRoaXMsIGNhbGxiYWNrLCB7IGlnbm9yZVdoaXRlc3BhY2U6IHRydWUsIHZlcmJvc2U6IGZhbHNlLCBlbmZvcmNlRW1wdHlUYWdzOiBmYWxzZSB9KTtcbn1cbmluaGVyaXRzKFJzc0hhbmRsZXIsIERlZmF1bHRIYW5kbGVyKTtcblxuXHRSc3NIYW5kbGVyLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24gUnNzSGFuZGxlciRkb25lICgpIHtcblx0XHR2YXIgZmVlZCA9IHsgfTtcblx0XHR2YXIgZmVlZFJvb3Q7XG5cblx0XHR2YXIgZm91bmQgPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuKHZhbHVlID09IFwicnNzXCIgfHwgdmFsdWUgPT0gXCJmZWVkXCIpOyB9LCB0aGlzLmRvbSwgZmFsc2UpO1xuXHRcdGlmIChmb3VuZC5sZW5ndGgpIHtcblx0XHRcdGZlZWRSb290ID0gZm91bmRbMF07XG5cdFx0fVxuXHRcdGlmIChmZWVkUm9vdCkge1xuXHRcdFx0aWYgKGZlZWRSb290Lm5hbWUgPT0gXCJyc3NcIikge1xuXHRcdFx0XHRmZWVkLnR5cGUgPSBcInJzc1wiO1xuXHRcdFx0XHRmZWVkUm9vdCA9IGZlZWRSb290LmNoaWxkcmVuWzBdOyAvLzxjaGFubmVsLz5cblx0XHRcdFx0ZmVlZC5pZCA9IFwiXCI7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC50aXRsZSA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIiwgZmVlZFJvb3QuY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC5saW5rID0gRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaW5rXCIsIGZlZWRSb290LmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YTtcblx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZlZWQuZGVzY3JpcHRpb24gPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImRlc2NyaXB0aW9uXCIsIGZlZWRSb290LmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YTtcblx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZlZWQudXBkYXRlZCA9IG5ldyBEYXRlKERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibGFzdEJ1aWxkRGF0ZVwiLCBmZWVkUm9vdC5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGEpO1xuXHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC5hdXRob3IgPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm1hbmFnaW5nRWRpdG9yXCIsIGZlZWRSb290LmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YTtcblx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHRmZWVkLml0ZW1zID0gW107XG5cdFx0XHRcdERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaXRlbVwiLCBmZWVkUm9vdC5jaGlsZHJlbikuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgsIGxpc3QpIHtcblx0XHRcdFx0XHR2YXIgZW50cnkgPSB7fTtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0ZW50cnkuaWQgPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImd1aWRcIiwgaXRlbS5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGE7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRlbnRyeS50aXRsZSA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIiwgaXRlbS5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGE7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRlbnRyeS5saW5rID0gRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaW5rXCIsIGl0ZW0uY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0ZW50cnkuZGVzY3JpcHRpb24gPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImRlc2NyaXB0aW9uXCIsIGl0ZW0uY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0ZW50cnkucHViRGF0ZSA9IG5ldyBEYXRlKERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicHViRGF0ZVwiLCBpdGVtLmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YSk7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHRcdGZlZWQuaXRlbXMucHVzaChlbnRyeSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZmVlZC50eXBlID0gXCJhdG9tXCI7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC5pZCA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaWRcIiwgZmVlZFJvb3QuY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC50aXRsZSA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIiwgZmVlZFJvb3QuY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC5saW5rID0gRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaW5rXCIsIGZlZWRSb290LmNoaWxkcmVuLCBmYWxzZSlbMF0uYXR0cmlicy5ocmVmO1xuXHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC5kZXNjcmlwdGlvbiA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3VidGl0bGVcIiwgZmVlZFJvb3QuY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC51cGRhdGVkID0gbmV3IERhdGUoRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ1cGRhdGVkXCIsIGZlZWRSb290LmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YSk7XG5cdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRmZWVkLmF1dGhvciA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZW1haWxcIiwgZmVlZFJvb3QuY2hpbGRyZW4sIHRydWUpWzBdLmNoaWxkcmVuWzBdLmRhdGE7XG5cdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0ZmVlZC5pdGVtcyA9IFtdO1xuXHRcdFx0XHREb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImVudHJ5XCIsIGZlZWRSb290LmNoaWxkcmVuKS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCwgbGlzdCkge1xuXHRcdFx0XHRcdHZhciBlbnRyeSA9IHt9O1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRlbnRyeS5pZCA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaWRcIiwgaXRlbS5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGE7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRlbnRyeS50aXRsZSA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIiwgaXRlbS5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGE7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRlbnRyeS5saW5rID0gRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaW5rXCIsIGl0ZW0uY2hpbGRyZW4sIGZhbHNlKVswXS5hdHRyaWJzLmhyZWY7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRlbnRyeS5kZXNjcmlwdGlvbiA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3VtbWFyeVwiLCBpdGVtLmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YTtcblx0XHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGVudHJ5LnB1YkRhdGUgPSBuZXcgRGF0ZShEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcInVwZGF0ZWRcIiwgaXRlbS5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGEpO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0XHRmZWVkLml0ZW1zLnB1c2goZW50cnkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kb20gPSBmZWVkO1xuXHRcdH1cblx0XHRSc3NIYW5kbGVyLnN1cGVyXy5wcm90b3R5cGUuZG9uZS5jYWxsKHRoaXMpO1xuXHR9XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5mdW5jdGlvbiBEZWZhdWx0SGFuZGxlciAoY2FsbGJhY2ssIG9wdGlvbnMpIHtcblx0dGhpcy5yZXNldCgpO1xuXHR0aGlzLl9vcHRpb25zID0gb3B0aW9ucyA/IG9wdGlvbnMgOiB7IH07XG5cdGlmICh0aGlzLl9vcHRpb25zLmlnbm9yZVdoaXRlc3BhY2UgPT0gdW5kZWZpbmVkKVxuXHRcdHRoaXMuX29wdGlvbnMuaWdub3JlV2hpdGVzcGFjZSA9IGZhbHNlOyAvL0tlZXAgd2hpdGVzcGFjZS1vbmx5IHRleHQgbm9kZXNcblx0aWYgKHRoaXMuX29wdGlvbnMudmVyYm9zZSA9PSB1bmRlZmluZWQpXG5cdFx0dGhpcy5fb3B0aW9ucy52ZXJib3NlID0gdHJ1ZTsgLy9LZWVwIGRhdGEgcHJvcGVydHkgZm9yIHRhZ3MgYW5kIHJhdyBwcm9wZXJ0eSBmb3IgYWxsXG5cdGlmICh0aGlzLl9vcHRpb25zLmVuZm9yY2VFbXB0eVRhZ3MgPT0gdW5kZWZpbmVkKVxuXHRcdHRoaXMuX29wdGlvbnMuZW5mb3JjZUVtcHR5VGFncyA9IHRydWU7IC8vRG9uJ3QgYWxsb3cgY2hpbGRyZW4gZm9yIEhUTUwgdGFncyBkZWZpbmVkIGFzIGVtcHR5IGluIHNwZWNcblx0aWYgKCh0eXBlb2YgY2FsbGJhY2spID09IFwiZnVuY3Rpb25cIilcblx0XHR0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xufVxuXG5cdC8vKipcIlN0YXRpY1wiKiovL1xuXHQvL0hUTUwgVGFncyB0aGF0IHNob3VsZG4ndCBjb250YWluIGNoaWxkIG5vZGVzXG5cdERlZmF1bHRIYW5kbGVyLl9lbXB0eVRhZ3MgPSB7XG5cdFx0ICBhcmVhOiAxXG5cdFx0LCBiYXNlOiAxXG5cdFx0LCBiYXNlZm9udDogMVxuXHRcdCwgYnI6IDFcblx0XHQsIGNvbDogMVxuXHRcdCwgZnJhbWU6IDFcblx0XHQsIGhyOiAxXG5cdFx0LCBpbWc6IDFcblx0XHQsIGlucHV0OiAxXG5cdFx0LCBpc2luZGV4OiAxXG5cdFx0LCBsaW5rOiAxXG5cdFx0LCBtZXRhOiAxXG5cdFx0LCBwYXJhbTogMVxuXHRcdCwgZW1iZWQ6IDFcblx0fVxuXHQvL1JlZ2V4IHRvIGRldGVjdCB3aGl0ZXNwYWNlIG9ubHkgdGV4dCBub2Rlc1xuXHREZWZhdWx0SGFuZGxlci5yZVdoaXRlc3BhY2UgPSAvXlxccyokLztcblxuXHQvLyoqUHVibGljKiovL1xuXHQvL1Byb3BlcnRpZXMvL1xuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUuZG9tID0gbnVsbDsgLy9UaGUgaGllcmFyY2hpY2FsIG9iamVjdCBjb250YWluaW5nIHRoZSBwYXJzZWQgSFRNTFxuXHQvL01ldGhvZHMvL1xuXHQvL1Jlc2V0cyB0aGUgaGFuZGxlciBiYWNrIHRvIHN0YXJ0aW5nIHN0YXRlXG5cdERlZmF1bHRIYW5kbGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIERlZmF1bHRIYW5kbGVyJHJlc2V0KCkge1xuXHRcdHRoaXMuZG9tID0gW107XG5cdFx0dGhpcy5fZG9uZSA9IGZhbHNlO1xuXHRcdHRoaXMuX3RhZ1N0YWNrID0gW107XG5cdFx0dGhpcy5fdGFnU3RhY2subGFzdCA9IGZ1bmN0aW9uIERlZmF1bHRIYW5kbGVyJF90YWdTdGFjayRsYXN0ICgpIHtcblx0XHRcdHJldHVybih0aGlzLmxlbmd0aCA/IHRoaXNbdGhpcy5sZW5ndGggLSAxXSA6IG51bGwpO1xuXHRcdH1cblx0fVxuXHQvL1NpZ25hbHMgdGhlIGhhbmRsZXIgdGhhdCBwYXJzaW5nIGlzIGRvbmVcblx0RGVmYXVsdEhhbmRsZXIucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbiBEZWZhdWx0SGFuZGxlciRkb25lICgpIHtcblx0XHR0aGlzLl9kb25lID0gdHJ1ZTtcblx0XHR0aGlzLmhhbmRsZUNhbGxiYWNrKG51bGwpO1xuXHR9XG5cdERlZmF1bHRIYW5kbGVyLnByb3RvdHlwZS53cml0ZVRhZyA9IGZ1bmN0aW9uIERlZmF1bHRIYW5kbGVyJHdyaXRlVGFnIChlbGVtZW50KSB7XG5cdFx0dGhpcy5oYW5kbGVFbGVtZW50KGVsZW1lbnQpO1xuXHR9IFxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUud3JpdGVUZXh0ID0gZnVuY3Rpb24gRGVmYXVsdEhhbmRsZXIkd3JpdGVUZXh0IChlbGVtZW50KSB7XG5cdFx0aWYgKHRoaXMuX29wdGlvbnMuaWdub3JlV2hpdGVzcGFjZSlcblx0XHRcdGlmIChEZWZhdWx0SGFuZGxlci5yZVdoaXRlc3BhY2UudGVzdChlbGVtZW50LmRhdGEpKVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0dGhpcy5oYW5kbGVFbGVtZW50KGVsZW1lbnQpO1xuXHR9IFxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUud3JpdGVDb21tZW50ID0gZnVuY3Rpb24gRGVmYXVsdEhhbmRsZXIkd3JpdGVDb21tZW50IChlbGVtZW50KSB7XG5cdFx0dGhpcy5oYW5kbGVFbGVtZW50KGVsZW1lbnQpO1xuXHR9IFxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUud3JpdGVEaXJlY3RpdmUgPSBmdW5jdGlvbiBEZWZhdWx0SGFuZGxlciR3cml0ZURpcmVjdGl2ZSAoZWxlbWVudCkge1xuXHRcdHRoaXMuaGFuZGxlRWxlbWVudChlbGVtZW50KTtcblx0fVxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiBEZWZhdWx0SGFuZGxlciRlcnJvciAoZXJyb3IpIHtcblx0XHR0aGlzLmhhbmRsZUNhbGxiYWNrKGVycm9yKTtcblx0fVxuXG5cdC8vKipQcml2YXRlKiovL1xuXHQvL1Byb3BlcnRpZXMvL1xuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUuX29wdGlvbnMgPSBudWxsOyAvL0hhbmRsZXIgb3B0aW9ucyBmb3IgaG93IHRvIGJlaGF2ZVxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUuX2NhbGxiYWNrID0gbnVsbDsgLy9DYWxsYmFjayB0byByZXNwb25kIHRvIHdoZW4gcGFyc2luZyBkb25lXG5cdERlZmF1bHRIYW5kbGVyLnByb3RvdHlwZS5fZG9uZSA9IGZhbHNlOyAvL0ZsYWcgaW5kaWNhdGluZyB3aGV0aGVyIGhhbmRsZXIgaGFzIGJlZW4gbm90aWZpZWQgb2YgcGFyc2luZyBjb21wbGV0ZWRcblx0RGVmYXVsdEhhbmRsZXIucHJvdG90eXBlLl90YWdTdGFjayA9IG51bGw7IC8vTGlzdCBvZiBwYXJlbnRzIHRvIHRoZSBjdXJyZW50bHkgZWxlbWVudCBiZWluZyBwcm9jZXNzZWRcblx0Ly9NZXRob2RzLy9cblx0RGVmYXVsdEhhbmRsZXIucHJvdG90eXBlLmhhbmRsZUNhbGxiYWNrID0gZnVuY3Rpb24gRGVmYXVsdEhhbmRsZXIkaGFuZGxlQ2FsbGJhY2sgKGVycm9yKSB7XG5cdFx0XHRpZiAoKHR5cGVvZiB0aGlzLl9jYWxsYmFjaykgIT0gXCJmdW5jdGlvblwiKVxuXHRcdFx0XHRpZiAoZXJyb3IpXG5cdFx0XHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHR0aGlzLl9jYWxsYmFjayhlcnJvciwgdGhpcy5kb20pO1xuXHR9XG5cdFxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUuaXNFbXB0eVRhZyA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHR2YXIgbmFtZSA9IGVsZW1lbnQubmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdGlmIChuYW1lLmNoYXJBdCgwKSA9PSAnLycpIHtcblx0XHRcdG5hbWUgPSBuYW1lLnN1YnN0cmluZygxKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX29wdGlvbnMuZW5mb3JjZUVtcHR5VGFncyAmJiAhIURlZmF1bHRIYW5kbGVyLl9lbXB0eVRhZ3NbbmFtZV07XG5cdH07XG5cdFxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUuaGFuZGxlRWxlbWVudCA9IGZ1bmN0aW9uIERlZmF1bHRIYW5kbGVyJGhhbmRsZUVsZW1lbnQgKGVsZW1lbnQpIHtcblx0XHRpZiAodGhpcy5fZG9uZSlcblx0XHRcdHRoaXMuaGFuZGxlQ2FsbGJhY2sobmV3IEVycm9yKFwiV3JpdGluZyB0byB0aGUgaGFuZGxlciBhZnRlciBkb25lKCkgY2FsbGVkIGlzIG5vdCBhbGxvd2VkIHdpdGhvdXQgYSByZXNldCgpXCIpKTtcblx0XHRpZiAoIXRoaXMuX29wdGlvbnMudmVyYm9zZSkge1xuLy9cdFx0XHRlbGVtZW50LnJhdyA9IG51bGw7IC8vRklYTUU6IE5vdCBjbGVhblxuXHRcdFx0Ly9GSVhNRTogU2VyaW91cyBwZXJmb3JtYW5jZSBwcm9ibGVtIHVzaW5nIGRlbGV0ZVxuXHRcdFx0ZGVsZXRlIGVsZW1lbnQucmF3O1xuXHRcdFx0aWYgKGVsZW1lbnQudHlwZSA9PSBcInRhZ1wiIHx8IGVsZW1lbnQudHlwZSA9PSBcInNjcmlwdFwiIHx8IGVsZW1lbnQudHlwZSA9PSBcInN0eWxlXCIpXG5cdFx0XHRcdGRlbGV0ZSBlbGVtZW50LmRhdGE7XG5cdFx0fVxuXHRcdGlmICghdGhpcy5fdGFnU3RhY2subGFzdCgpKSB7IC8vVGhlcmUgYXJlIG5vIHBhcmVudCBlbGVtZW50c1xuXHRcdFx0Ly9JZiB0aGUgZWxlbWVudCBjYW4gYmUgYSBjb250YWluZXIsIGFkZCBpdCB0byB0aGUgdGFnIHN0YWNrIGFuZCB0aGUgdG9wIGxldmVsIGxpc3Rcblx0XHRcdGlmIChlbGVtZW50LnR5cGUgIT0gRWxlbWVudFR5cGUuVGV4dCAmJiBlbGVtZW50LnR5cGUgIT0gRWxlbWVudFR5cGUuQ29tbWVudCAmJiBlbGVtZW50LnR5cGUgIT0gRWxlbWVudFR5cGUuRGlyZWN0aXZlKSB7XG5cdFx0XHRcdGlmIChlbGVtZW50Lm5hbWUuY2hhckF0KDApICE9IFwiL1wiKSB7IC8vSWdub3JlIGNsb3NpbmcgdGFncyB0aGF0IG9idmlvdXNseSBkb24ndCBoYXZlIGFuIG9wZW5pbmcgdGFnXG5cdFx0XHRcdFx0dGhpcy5kb20ucHVzaChlbGVtZW50KTtcblx0XHRcdFx0XHRpZiAoIXRoaXMuaXNFbXB0eVRhZyhlbGVtZW50KSkgeyAvL0Rvbid0IGFkZCB0YWdzIHRvIHRoZSB0YWcgc3RhY2sgdGhhdCBjYW4ndCBoYXZlIGNoaWxkcmVuXG5cdFx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5wdXNoKGVsZW1lbnQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSAvL090aGVyd2lzZSBqdXN0IGFkZCB0byB0aGUgdG9wIGxldmVsIGxpc3Rcblx0XHRcdFx0dGhpcy5kb20ucHVzaChlbGVtZW50KTtcblx0XHR9XG5cdFx0ZWxzZSB7IC8vVGhlcmUgYXJlIHBhcmVudCBlbGVtZW50c1xuXHRcdFx0Ly9JZiB0aGUgZWxlbWVudCBjYW4gYmUgYSBjb250YWluZXIsIGFkZCBpdCBhcyBhIGNoaWxkIG9mIHRoZSBlbGVtZW50XG5cdFx0XHQvL29uIHRvcCBvZiB0aGUgdGFnIHN0YWNrIGFuZCB0aGVuIGFkZCBpdCB0byB0aGUgdGFnIHN0YWNrXG5cdFx0XHRpZiAoZWxlbWVudC50eXBlICE9IEVsZW1lbnRUeXBlLlRleHQgJiYgZWxlbWVudC50eXBlICE9IEVsZW1lbnRUeXBlLkNvbW1lbnQgJiYgZWxlbWVudC50eXBlICE9IEVsZW1lbnRUeXBlLkRpcmVjdGl2ZSkge1xuXHRcdFx0XHRpZiAoZWxlbWVudC5uYW1lLmNoYXJBdCgwKSA9PSBcIi9cIikge1xuXHRcdFx0XHRcdC8vVGhpcyBpcyBhIGNsb3NpbmcgdGFnLCBzY2FuIHRoZSB0YWdTdGFjayB0byBmaW5kIHRoZSBtYXRjaGluZyBvcGVuaW5nIHRhZ1xuXHRcdFx0XHRcdC8vYW5kIHBvcCB0aGUgc3RhY2sgdXAgdG8gdGhlIG9wZW5pbmcgdGFnJ3MgcGFyZW50XG5cdFx0XHRcdFx0dmFyIGJhc2VOYW1lID0gZWxlbWVudC5uYW1lLnN1YnN0cmluZygxKTtcblx0XHRcdFx0XHRpZiAoIXRoaXMuaXNFbXB0eVRhZyhlbGVtZW50KSkge1xuXHRcdFx0XHRcdFx0dmFyIHBvcyA9IHRoaXMuX3RhZ1N0YWNrLmxlbmd0aCAtIDE7XG5cdFx0XHRcdFx0XHR3aGlsZSAocG9zID4gLTEgJiYgdGhpcy5fdGFnU3RhY2tbcG9zLS1dLm5hbWUgIT0gYmFzZU5hbWUpIHsgfVxuXHRcdFx0XHRcdFx0aWYgKHBvcyA+IC0xIHx8IHRoaXMuX3RhZ1N0YWNrWzBdLm5hbWUgPT0gYmFzZU5hbWUpXG5cdFx0XHRcdFx0XHRcdHdoaWxlIChwb3MgPCB0aGlzLl90YWdTdGFjay5sZW5ndGggLSAxKVxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3RhZ1N0YWNrLnBvcCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHsgLy9UaGlzIGlzIG5vdCBhIGNsb3NpbmcgdGFnXG5cdFx0XHRcdFx0aWYgKCF0aGlzLl90YWdTdGFjay5sYXN0KCkuY2hpbGRyZW4pXG5cdFx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5sYXN0KCkuY2hpbGRyZW4gPSBbXTtcblx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5sYXN0KCkuY2hpbGRyZW4ucHVzaChlbGVtZW50KTtcblx0XHRcdFx0XHRpZiAoIXRoaXMuaXNFbXB0eVRhZyhlbGVtZW50KSkgLy9Eb24ndCBhZGQgdGFncyB0byB0aGUgdGFnIHN0YWNrIHRoYXQgY2FuJ3QgaGF2ZSBjaGlsZHJlblxuXHRcdFx0XHRcdFx0dGhpcy5fdGFnU3RhY2sucHVzaChlbGVtZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7IC8vVGhpcyBpcyBub3QgYSBjb250YWluZXIgZWxlbWVudFxuXHRcdFx0XHRpZiAoIXRoaXMuX3RhZ1N0YWNrLmxhc3QoKS5jaGlsZHJlbilcblx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5sYXN0KCkuY2hpbGRyZW4gPSBbXTtcblx0XHRcdFx0dGhpcy5fdGFnU3RhY2subGFzdCgpLmNoaWxkcmVuLnB1c2goZWxlbWVudCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0dmFyIERvbVV0aWxzID0ge1xuXHRcdCAgdGVzdEVsZW1lbnQ6IGZ1bmN0aW9uIERvbVV0aWxzJHRlc3RFbGVtZW50IChvcHRpb25zLCBlbGVtZW50KSB7XG5cdFx0XHRpZiAoIWVsZW1lbnQpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcblx0XHRcdGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7XG5cdFx0XHRcdGlmIChrZXkgPT0gXCJ0YWdfbmFtZVwiKSB7XG5cdFx0XHRcdFx0aWYgKGVsZW1lbnQudHlwZSAhPSBcInRhZ1wiICYmIGVsZW1lbnQudHlwZSAhPSBcInNjcmlwdFwiICYmIGVsZW1lbnQudHlwZSAhPSBcInN0eWxlXCIpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zW1widGFnX25hbWVcIl0oZWxlbWVudC5uYW1lKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChrZXkgPT0gXCJ0YWdfdHlwZVwiKSB7XG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zW1widGFnX3R5cGVcIl0oZWxlbWVudC50eXBlKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChrZXkgPT0gXCJ0YWdfY29udGFpbnNcIikge1xuXHRcdFx0XHRcdGlmIChlbGVtZW50LnR5cGUgIT0gXCJ0ZXh0XCIgJiYgZWxlbWVudC50eXBlICE9IFwiY29tbWVudFwiICYmIGVsZW1lbnQudHlwZSAhPSBcImRpcmVjdGl2ZVwiKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghb3B0aW9uc1tcInRhZ19jb250YWluc1wiXShlbGVtZW50LmRhdGEpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICghZWxlbWVudC5hdHRyaWJzIHx8ICFvcHRpb25zW2tleV0oZWxlbWVudC5hdHRyaWJzW2tleV0pKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFxuXHRcdCwgZ2V0RWxlbWVudHM6IGZ1bmN0aW9uIERvbVV0aWxzJGdldEVsZW1lbnRzIChvcHRpb25zLCBjdXJyZW50RWxlbWVudCwgcmVjdXJzZSwgbGltaXQpIHtcblx0XHRcdHJlY3Vyc2UgPSAocmVjdXJzZSA9PT0gdW5kZWZpbmVkIHx8IHJlY3Vyc2UgPT09IG51bGwpIHx8ICEhcmVjdXJzZTtcblx0XHRcdGxpbWl0ID0gaXNOYU4ocGFyc2VJbnQobGltaXQpKSA/IC0xIDogcGFyc2VJbnQobGltaXQpO1xuXG5cdFx0XHRpZiAoIWN1cnJlbnRFbGVtZW50KSB7XG5cdFx0XHRcdHJldHVybihbXSk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0dmFyIGZvdW5kID0gW107XG5cdFx0XHR2YXIgZWxlbWVudExpc3Q7XG5cblx0XHRcdGZ1bmN0aW9uIGdldFRlc3QgKGNoZWNrVmFsKSB7XG5cdFx0XHRcdHJldHVybihmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuKHZhbHVlID09IGNoZWNrVmFsKTsgfSk7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykge1xuXHRcdFx0XHRpZiAoKHR5cGVvZiBvcHRpb25zW2tleV0pICE9IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdG9wdGlvbnNba2V5XSA9IGdldFRlc3Qob3B0aW9uc1trZXldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcblx0XHRcdGlmIChEb21VdGlscy50ZXN0RWxlbWVudChvcHRpb25zLCBjdXJyZW50RWxlbWVudCkpIHtcblx0XHRcdFx0Zm91bmQucHVzaChjdXJyZW50RWxlbWVudCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChsaW1pdCA+PSAwICYmIGZvdW5kLmxlbmd0aCA+PSBsaW1pdCkge1xuXHRcdFx0XHRyZXR1cm4oZm91bmQpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAocmVjdXJzZSAmJiBjdXJyZW50RWxlbWVudC5jaGlsZHJlbikge1xuXHRcdFx0XHRlbGVtZW50TGlzdCA9IGN1cnJlbnRFbGVtZW50LmNoaWxkcmVuO1xuXHRcdFx0fSBlbHNlIGlmIChjdXJyZW50RWxlbWVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRcdGVsZW1lbnRMaXN0ID0gY3VycmVudEVsZW1lbnQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4oZm91bmQpO1xuXHRcdFx0fVxuXHRcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudExpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Zm91bmQgPSBmb3VuZC5jb25jYXQoRG9tVXRpbHMuZ2V0RWxlbWVudHMob3B0aW9ucywgZWxlbWVudExpc3RbaV0sIHJlY3Vyc2UsIGxpbWl0KSk7XG5cdFx0XHRcdGlmIChsaW1pdCA+PSAwICYmIGZvdW5kLmxlbmd0aCA+PSBsaW1pdCkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFxuXHRcdFx0cmV0dXJuKGZvdW5kKTtcblx0XHR9XG5cdFx0XG5cdFx0LCBnZXRFbGVtZW50QnlJZDogZnVuY3Rpb24gRG9tVXRpbHMkZ2V0RWxlbWVudEJ5SWQgKGlkLCBjdXJyZW50RWxlbWVudCwgcmVjdXJzZSkge1xuXHRcdFx0dmFyIHJlc3VsdCA9IERvbVV0aWxzLmdldEVsZW1lbnRzKHsgaWQ6IGlkIH0sIGN1cnJlbnRFbGVtZW50LCByZWN1cnNlLCAxKTtcblx0XHRcdHJldHVybihyZXN1bHQubGVuZ3RoID8gcmVzdWx0WzBdIDogbnVsbCk7XG5cdFx0fVxuXHRcdFxuXHRcdCwgZ2V0RWxlbWVudHNCeVRhZ05hbWU6IGZ1bmN0aW9uIERvbVV0aWxzJGdldEVsZW1lbnRzQnlUYWdOYW1lIChuYW1lLCBjdXJyZW50RWxlbWVudCwgcmVjdXJzZSwgbGltaXQpIHtcblx0XHRcdHJldHVybihEb21VdGlscy5nZXRFbGVtZW50cyh7IHRhZ19uYW1lOiBuYW1lIH0sIGN1cnJlbnRFbGVtZW50LCByZWN1cnNlLCBsaW1pdCkpO1xuXHRcdH1cblx0XHRcblx0XHQsIGdldEVsZW1lbnRzQnlUYWdUeXBlOiBmdW5jdGlvbiBEb21VdGlscyRnZXRFbGVtZW50c0J5VGFnVHlwZSAodHlwZSwgY3VycmVudEVsZW1lbnQsIHJlY3Vyc2UsIGxpbWl0KSB7XG5cdFx0XHRyZXR1cm4oRG9tVXRpbHMuZ2V0RWxlbWVudHMoeyB0YWdfdHlwZTogdHlwZSB9LCBjdXJyZW50RWxlbWVudCwgcmVjdXJzZSwgbGltaXQpKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBpbmhlcml0cyAoY3Rvciwgc3VwZXJDdG9yKSB7XG5cdFx0dmFyIHRlbXBDdG9yID0gZnVuY3Rpb24oKXt9O1xuXHRcdHRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGU7XG5cdFx0Y3Rvci5zdXBlcl8gPSBzdXBlckN0b3I7XG5cdFx0Y3Rvci5wcm90b3R5cGUgPSBuZXcgdGVtcEN0b3IoKTtcblx0XHRjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3I7XG5cdH1cblxuZXhwb3J0cy5QYXJzZXIgPSBQYXJzZXI7XG5cbmV4cG9ydHMuRGVmYXVsdEhhbmRsZXIgPSBEZWZhdWx0SGFuZGxlcjtcblxuZXhwb3J0cy5Sc3NIYW5kbGVyID0gUnNzSGFuZGxlcjtcblxuZXhwb3J0cy5FbGVtZW50VHlwZSA9IEVsZW1lbnRUeXBlO1xuXG5leHBvcnRzLkRvbVV0aWxzID0gRG9tVXRpbHM7XG5cbn0pKCk7XG5cbn0pKFwiLy4uL25vZGVfbW9kdWxlcy9odG1scGFyc2VyL2xpYi9odG1scGFyc2VyLmpzXCIsXCIvLi4vbm9kZV9tb2R1bGVzL2h0bWxwYXJzZXIvbGliXCIpIl19
;