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
    var child, index, key, value, _base, _base1, _base10, _base11, _base12, _base13, _base14, _base15, _base16, _base17, _base18, _base19, _base2, _base20, _base21, _base22, _base23, _base3, _base4, _base5, _base6, _base7, _base8, _base9, _i, _len, _ref, _ref1;
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
    render: function() {
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
        render: function(block) {
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
    var WebGlifyObj, scene, value;
    value = data;
    scene = layout(dresser(parser(value), baseWidth, baseHeight));
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

  window.WebGlify = function(data) {
    var scene, value;
    value = data;
    scene = layout(dresser(parser(value)));
    renderer.init(scene.scene, scene.camera);
    document.body.appendChild(renderer.domElement);
    return renderer.render();
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvc3JjL0NvbnN0cnVjdG9yTW9kdWxlcy9jb250YWluZXJNb2R1bGUuY29mZmVlIiwiL1VzZXJzL2RhbmllbG1pbGxlci9Eb2N1bWVudHMvSGFjayBSZWFjdG9yIFByb2plY3RzL3dlYmdsaWZ5L3dlYmdsaWZ5L3NyYy9Db25zdHJ1Y3Rvck1vZHVsZXMvdGV4dE1vZHVsZS5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvc3JjL2NvbXBpbGVyL2RyZXNzZXIuY29mZmVlIiwiL1VzZXJzL2RhbmllbG1pbGxlci9Eb2N1bWVudHMvSGFjayBSZWFjdG9yIFByb2plY3RzL3dlYmdsaWZ5L3dlYmdsaWZ5L3NyYy9wYXJzZXJzL3dlYmdsaWZ5UEFSU0VSLmNvZmZlZSIsIi9Vc2Vycy9kYW5pZWxtaWxsZXIvRG9jdW1lbnRzL0hhY2sgUmVhY3RvciBQcm9qZWN0cy93ZWJnbGlmeS93ZWJnbGlmeS9zcmMvcmVuZGVyZXIvcmVuZGVyZXIuY29mZmVlIiwiL1VzZXJzL2RhbmllbG1pbGxlci9Eb2N1bWVudHMvSGFjayBSZWFjdG9yIFByb2plY3RzL3dlYmdsaWZ5L3dlYmdsaWZ5L3NyYy9Db25zdHJ1Y3Rvck1vZHVsZXMvaW1nTW9kdWxlLmNvZmZlZSIsIi9Vc2Vycy9kYW5pZWxtaWxsZXIvRG9jdW1lbnRzL0hhY2sgUmVhY3RvciBQcm9qZWN0cy93ZWJnbGlmeS93ZWJnbGlmeS9zcmMvTGF5b3V0TW9kdWxlcy9sYXlvdXRNb2R1bGUuY29mZmVlIiwiL1VzZXJzL2RhbmllbG1pbGxlci9Eb2N1bWVudHMvSGFjayBSZWFjdG9yIFByb2plY3RzL3dlYmdsaWZ5L3dlYmdsaWZ5L3NyYy9hcHAvbWFpbi5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvc3JjL2FwcC93ZWJnbGlmeS5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvc3JjL3BhcnNlcnMvSFRNTHBhcnNlci5jb2ZmZWUiLCIvVXNlcnMvZGFuaWVsbWlsbGVyL0RvY3VtZW50cy9IYWNrIFJlYWN0b3IgUHJvamVjdHMvd2ViZ2xpZnkvd2ViZ2xpZnkvbm9kZV9tb2R1bGVzL2h0bWxwYXJzZXIvbGliL2h0bWxwYXJzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0NBQUEsS0FBQSxRQUFBOztDQUFBLENBQUEsQ0FBaUIsQ0FBaUIsRUFBNUIsQ0FBTixDQUFrQyxDQUFDLEtBQWxCO0NBQ2YsT0FBQSwyQkFBQTtDQUFBLEVBQWdCLENBQWhCLENBQW9DLFFBQXBDLElBQStCO0NBQXdCLENBQVEsRUFBSSxDQUFYLENBQUEsQ0FBbUIsUUFBcEI7Q0FBQSxDQUE0QyxFQUFOLENBQVcsQ0FBWCxJQUF0QztDQUF2RCxLQUErQjtDQUEvQixDQUM0RCxDQUF4QyxDQUFwQixDQUF5QixDQUFMLENBQWdDLE1BQXBEO0NBREEsQ0FFc0MsQ0FBMUIsQ0FBWixDQUFBLFFBQVk7Q0FGWixFQUdtQixDQUFuQixDQUFLLEVBQTBCLENBQWpCO0NBSGQsRUFJbUIsQ0FBbkIsQ0FBSyxFQUEwQixDQUFqQjtDQUpkLEVBS21CLENBQW5CLENBQUssRUFBMEIsQ0FBakI7Q0FOa0IsVUFPaEM7Q0FQRixFQUFrQztDQUFsQzs7Ozs7QUNBQTtDQUFBLEtBQUEsbUNBQUE7O0NBQUEsQ0FBQSxDQUFXLEtBQVg7O0NBQUEsQ0FFQSxDQUFhLENBQUEsQ0FBQSxJQUFDLENBQWQ7Q0FDRSxPQUFBLCtEQUFBO0NBQUEsQ0FBQSxDQUFPLENBQVA7QUFDQSxDQUFBLFFBQUEsa0NBQUE7NEJBQUE7Q0FDRSxH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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gY29udGFpbmVyTWFrZXIgPSAobm9kZSwgbWF0ZXJpYWwpIC0+XG4gIHBsYW5lTWF0ZXJpYWwgPSBtYXRlcmlhbCA/IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCB7Y29sb3I6IG5vZGUub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IsIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGV9XG4gIHBsYW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSBub2RlLm9wdGlvbnMud2lkdGgsIG5vZGUub3B0aW9ucy5oZWlnaHQsIDEsIDFcbiAgcGxhbmUgPSBuZXcgVEhSRUUuTWVzaCBwbGFuZUdlb21ldHJ5LCBwbGFuZU1hdGVyaWFsXG4gIHBsYW5lLnBvc2l0aW9uLnkgPSBub2RlLm9wdGlvbnMueVxuICBwbGFuZS5wb3NpdGlvbi54ID0gbm9kZS5vcHRpb25zLnhcbiAgcGxhbmUucG9zaXRpb24ueiA9IG5vZGUub3B0aW9ucy56XG4gIHBsYW5lIiwiZm9udFNpemUgPSAxNlxuXG5tYWtlTG9va1VwID0gKHRleHQsIGNvbG9yKSAtPlxuICBoYXNoID0ge31cbiAgZm9yIGNoYXJhY3RlciBpbiB0ZXh0XG4gICAgaWYgbm90IGhhc2hbY2hhcmFjdGVyXT9cbiAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2NhbnZhcydcbiAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCAnMmQnXG4gICAgICBjb250ZXh0LmZvbnQgPSBmb250U2l6ZSoyICsgJ3B4IG1vbm9zcGFjZSdcbiAgICAgIGNhbnZhcy53aWR0aCA9IGNvbnRleHQubWVhc3VyZVRleHQoY2hhcmFjdGVyKS53aWR0aCArIDJcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBmb250U2l6ZSAqIDIrMTBcbiAgICAgIGNvbnRleHQudGV4dEFsaWduID0gJ2NlbnRlcidcbiAgICAgIGNvbnRleHQudGV4dEJhc2VsaW5lID0gJ21pZGRsZSdcbiAgICAgIGNvbnRleHQuZm9udCA9IGZvbnRTaXplKjIgKyAncHggbW9ub3NwYWNlJ1xuICAgICAgY29udGV4dC5jbGVhclJlY3QgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0XG4gICAgICBjb250ZXh0LmZpbGxDb2xvciA9IGNvbG9yXG4gICAgICBjb250ZXh0LmZpbGxUZXh0IGNoYXJhY3RlciwgY2FudmFzLndpZHRoLzItMiwgY2FudmFzLmhlaWdodC8yXG4gICAgICB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUgY2FudmFzXG4gICAgICBmYWNlID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsIHsgbWFwOiB0ZXh0dXJlLCBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLCB0cmFuc3BhcmVudDogdHJ1ZX1cbiAgICAgIHF1YWQgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSBjYW52YXMud2lkdGgvMi01LCBjYW52YXMuaGVpZ2h0LzJcbiAgICAgIGxldHRlciA9IG5ldyBUSFJFRS5NZXNoIHF1YWQsIGZhY2VcbiAgICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlXG4gICAgICBoYXNoW2NoYXJhY3Rlcl0gPSBsZXR0ZXJcbiAgcmV0dXJuIGhhc2hcblxubWFrZVRleHQgPSAodGV4dCwgaGFzaCwgbWF4V2lkdGgsIG1heEhlaWdodCkgLT5cbiAgZ3JvdXAgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKVxuICBsaW5lID0gbmV3IFRIUkVFLk9iamVjdDNEKClcbiAgeVBvcyA9IDBcbiAgZm9yIGNoYXJhY3RlciBpbiB0ZXh0IHdoZW4gTWF0aC5hYnMgeVBvcyA8IG1heEhlaWdodFxuICAgIHhQb3MgPSAwXG4gICAgbGV0dGVyID0gbmV3IFRIUkVFLk1lc2goaGFzaFtjaGFyYWN0ZXJdLmdlb21ldHJ5LCBoYXNoW2NoYXJhY3Rlcl0ubWF0ZXJpYWwpXG4gICAgZm9yIGVhY2hMZXR0ZXIgaW4gbGluZS5jaGlsZHJlblxuICAgICAgeFBvcyArPSBlYWNoTGV0dGVyLmdlb21ldHJ5LndpZHRoKzFcbiAgICBsZXR0ZXIucG9zaXRpb24ueCA9IHhQb3NcbiAgICBsaW5lLnBvc2l0aW9uLnggPSAteFBvcy8yXG4gICAgaWYgeFBvcytsZXR0ZXIuZ2VvbWV0cnkud2lkdGggPiBtYXhXaWR0aFxuICAgICAgbGluZS5hZGQgbGV0dGVyXG4gICAgICB4UG9zID0gMFxuICAgICAgeVBvcyAtPSBsZXR0ZXIuZ2VvbWV0cnkuaGVpZ2h0XG4gICAgICBsaW5lLnBvc2l0aW9uLnkgPSB5UG9zXG4gICAgICBncm91cC5hZGQgbGluZVxuICAgICAgbGluZSA9IG5ldyBUSFJFRS5PYmplY3QzRCgpXG4gICAgZWxzZVxuICAgICAgbGV0dGVyLnBvc2l0aW9uLnggPSB4UG9zXG4gICAgICBsaW5lLnBvc2l0aW9uLnggPSAteFBvcy8yXG4gICAgICBsaW5lLmFkZChsZXR0ZXIpXG4gIHlQb3MgLT0gbGV0dGVyLmdlb21ldHJ5LmhlaWdodFxuICBsaW5lLnBvc2l0aW9uLnkgPSB5UG9zXG4gIGdyb3VwLmFkZCBsaW5lXG4gIGdyb3VwLnBvc2l0aW9uLnkgPSBNYXRoLmFicyh5UG9zLzIpK2xldHRlci5nZW9tZXRyeS5oZWlnaHQvMlxuICByZXR1cm4gZ3JvdXBcblxubW9kdWxlLmV4cG9ydHMgPSB0ZXh0TWFrZXIgPSAobm9kZSkgLT5cbiAgdGFibGUgPSBtYWtlTG9va1VwIG5vZGUudGFnLCBub2RlLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yXG4gIHRleHRFbGVtID0gbWFrZVRleHQgbm9kZS50YWcsIHRhYmxlLCBub2RlLm9wdGlvbnMud2lkdGgsIG5vZGUub3B0aW9ucy5oZWlnaHRcbiAgdGV4dEVsZW0udHJhbnNsYXRlWiBub2RlLm9wdGlvbnMuelxuICB0ZXh0RWxlbS50cmFuc2xhdGVYIG5vZGUub3B0aW9ucy54XG4gIHRleHRFbGVtLnRyYW5zbGF0ZVkgbm9kZS5vcHRpb25zLnlcbiAgdGV4dEVsZW0iLCJtb2R1bGUuZXhwb3J0cyA9IGRyZXNzZXIgPSAobm9kZSwgYmFzZVdpZHRoLCBiYXNlSGVpZ2h0KSAtPlxuICBub2RlLm9wdGlvbnMueCA/PSAwXG4gIG5vZGUub3B0aW9ucy55ID89IDBcbiAgbm9kZS5vcHRpb25zLnogPSBub2RlLmRlcHRoKjJcbiAgbm9kZS5vcHRpb25zLmhlaWdodCA/PSBiYXNlSGVpZ2h0ID8gZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHRcbiAgbm9kZS5vcHRpb25zLndpZHRoID89IGJhc2VXaWR0aCA/IGRvY3VtZW50LmJvZHkuc2Nyb2xsV2lkdGhcbiAgbm9kZS5vcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSAnI0ZGRkZGRidcbiAgbm9kZS5vcHRpb25zLmNoaWxkVHlwZSA/PSAndmVydGljYWwnXG4gIGZvciBjaGlsZCwgaW5kZXggaW4gbm9kZS5jaGlsZHJlblxuICAgIGNoaWxkLm9wdGlvbnMudHlwZSA9ICdibG9jaycgaWYgbm9kZS5vcHRpb25zLmNoaWxkVHlwZSBpcyAnaG9yaXpvbnRhbCcgb3Igbm9kZS5vcHRpb25zLmNoaWxkVHlwZSBpcyAndmVydGljYWwnXG4gICAgY2hpbGQub3B0aW9ucy50eXBlID89IG5vZGUub3B0aW9ucy5jaGlsZFR5cGVcbiAgICBpZiBjaGlsZC5vcHRpb25zLng/IG9yIGNoaWxkLm9wdGlvbnMueT8gb3IgY2hpbGQub3B0aW9ucy5oZWlnaHQ/IG9yIGNoaWxkLm9wdGlvbnMud2lkdGg/XG4gICAgICBjaGlsZC5vcHRpb25zLnggPSAobm9kZS5vcHRpb25zLnggKyAoKGNoaWxkLm9wdGlvbnMueC8xMDApKihub2RlLm9wdGlvbnMud2lkdGgpKSkvMiBpZiBjaGlsZC5vcHRpb25zLng/XG4gICAgICBjaGlsZC5vcHRpb25zLnkgPSAobm9kZS5vcHRpb25zLnkgKyAoKGNoaWxkLm9wdGlvbnMueS8xMDApKihub2RlLm9wdGlvbnMuaGVpZ2h0KSkpLzIgaWYgY2hpbGQub3B0aW9ucy55P1xuICAgICAgY2hpbGQub3B0aW9ucy5oZWlnaHQgPSAoKGNoaWxkLm9wdGlvbnMuaGVpZ2h0LzEwMCkqbm9kZS5vcHRpb25zLmhlaWdodCkgaWYgY2hpbGQub3B0aW9ucy5oZWlnaHQ/XG4gICAgICBjaGlsZC5vcHRpb25zLndpZHRoID0gKChjaGlsZC5vcHRpb25zLndpZHRoLzEwMCkqbm9kZS5vcHRpb25zLndpZHRoKSBpZiBjaGlsZC5vcHRpb25zLndpZHRoP1xuICAgICAgY2hpbGQub3B0aW9ucy56ICs9IDFcbiAgICBzd2l0Y2ggbm9kZS5vcHRpb25zLmNoaWxkVHlwZVxuICAgICAgd2hlbiAnaG9yaXpvbnRhbCdcbiAgICAgICAgY2hpbGQub3B0aW9ucy54ID89IG5vZGUub3B0aW9ucy53aWR0aCooaW5kZXgvbm9kZS5jaGlsZHJlbi5sZW5ndGgpLSgobm9kZS5vcHRpb25zLndpZHRoLzIpLSgobm9kZS5vcHRpb25zLndpZHRoL25vZGUuY2hpbGRyZW4ubGVuZ3RoKS8yKSkrbm9kZS5vcHRpb25zLnhcbiAgICAgICAgY2hpbGQub3B0aW9ucy55ID89IG5vZGUub3B0aW9ucy55XG4gICAgICAgIGNoaWxkLm9wdGlvbnMud2lkdGggPz0gbm9kZS5vcHRpb25zLndpZHRoL25vZGUuY2hpbGRyZW4ubGVuZ3RoXG4gICAgICAgIGNoaWxkLm9wdGlvbnMuaGVpZ2h0ID89IG5vZGUub3B0aW9ucy5oZWlnaHRcbiAgICAgIHdoZW4gJ3ZlcnRpY2FsJ1xuICAgICAgICBjaGlsZC5vcHRpb25zLnkgPz0gKChub2RlLm9wdGlvbnMuaGVpZ2h0LzIpLSgobm9kZS5vcHRpb25zLmhlaWdodC9ub2RlLmNoaWxkcmVuLmxlbmd0aCkvMikpLShub2RlLm9wdGlvbnMuaGVpZ2h0KihpbmRleC9ub2RlLmNoaWxkcmVuLmxlbmd0aCkpK25vZGUub3B0aW9ucy55XG4gICAgICAgIGNoaWxkLm9wdGlvbnMueCA/PSBub2RlLm9wdGlvbnMueFxuICAgICAgICBjaGlsZC5vcHRpb25zLmhlaWdodCA/PSBub2RlLm9wdGlvbnMuaGVpZ2h0L25vZGUuY2hpbGRyZW4ubGVuZ3RoXG4gICAgICAgIGNoaWxkLm9wdGlvbnMud2lkdGggPz0gbm9kZS5vcHRpb25zLndpZHRoXG4gICAgICB3aGVuICd0ZXh0J1xuICAgICAgICBjaGlsZC5vcHRpb25zLnggPz0gbm9kZS5vcHRpb25zLnhcbiAgICAgICAgY2hpbGQub3B0aW9ucy55ID89IG5vZGUub3B0aW9ucy55XG4gICAgICAgIGNoaWxkLm9wdGlvbnMud2lkdGggPz0gbm9kZS5vcHRpb25zLndpZHRoXG4gICAgICAgIGNoaWxkLm9wdGlvbnMuaGVpZ2h0ID89IG5vZGUub3B0aW9ucy5oZWlnaHRcbiAgICAgICAgaWYgbm9kZS5vcHRpb25zLmJhY2tncm91bmRDb2xvciBpcyAnIzAwMDAwMCcgb3Igbm9kZS5vcHRpb25zLmJhY2tncm91bmRDb2xvciBpcyAnYmxhY2snXG4gICAgICAgICAgY2hpbGQub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gJ3doaXRlJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgY2hpbGQub3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgaXMgJ2JsYWNrJ1xuICAgICAgd2hlbiAnaW1hZ2UnXG4gICAgICAgIGNoaWxkLm9wdGlvbnMueCA/PSBub2RlLm9wdGlvbnMueFxuICAgICAgICBjaGlsZC5vcHRpb25zLnkgPz0gbm9kZS5vcHRpb25zLnlcbiAgICAgICAgY2hpbGQub3B0aW9ucy53aWR0aCA/PSBub2RlLm9wdGlvbnMud2lkdGhcbiAgICAgICAgY2hpbGQub3B0aW9ucy5oZWlnaHQgPz0gbm9kZS5vcHRpb25zLmhlaWdodFxuICAgICAgICBmb3Iga2V5LCB2YWx1ZSBvZiBjaGlsZC5vcHRpb25zXG4gICAgICAgICAgaWYga2V5WzBdIGlzICcvJyB0aGVuIGNoaWxkLnRhZyArPSAnOicgKyBrZXlcbiAgICBkcmVzc2VyIGNoaWxkXG4gIG5vZGUiLCJtb2R1bGUuZXhwb3J0cyA9IHBhcnNlciA9ICh0ZXh0KSAtPlxuICBsaW5lcyA9IHRleHQuc3BsaXQgJ1xcbidcbiAgbWFsZm9ybWVkID0gW11cbiAgZm9yIGxpbmUgaW4gbGluZXNcbiAgICBmaXJzdE5vbldoaXRlU3BhY2VJbmRleCA9IGxpbmUuaW5kZXhPZiAvXFxTLy5leGVjIGxpbmVcbiAgICB3aGl0ZXNwYWNlID0gbGluZS5zbGljZSgwLCBmaXJzdE5vbldoaXRlU3BhY2VJbmRleClcbiAgICBpZiBsaW5lLmluZGV4T2YoJzonKSBpc250IC0xXG4gICAgICB0YWdTcGFjZSA9IGxpbmUuc2xpY2UgZmlyc3ROb25XaGl0ZVNwYWNlSW5kZXgsIGxpbmUuaW5kZXhPZiAnOidcbiAgICAgIG9wdGlvbnMgPSBsaW5lLnNsaWNlKGxpbmUuaW5kZXhPZignOicpKzEpLnJlcGxhY2UgL1xccy9nLCAnJ1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMuc3BsaXQgJywnXG4gICAgICBvcHRpb25zID0gKG9wdGlvbi5zcGxpdCAnOicgZm9yIG9wdGlvbiBpbiBvcHRpb25zKVxuICAgICAgbWFsZm9ybWVkLnB1c2ggW3doaXRlc3BhY2UubGVuZ3RoLCB0YWdTcGFjZSwgb3B0aW9uc11cbiAgICBlbHNlXG4gICAgICBjb250ZW50ID0gbGluZS5zbGljZShmaXJzdE5vbldoaXRlU3BhY2VJbmRleClcbiAgICAgIG1hbGZvcm1lZC5wdXNoIFt3aGl0ZXNwYWNlLmxlbmd0aCwgY29udGVudCwgW11dXG4gIGZvciBpIGluIFsxLi5tYWxmb3JtZWQubGVuZ3RoLTFdXG4gICAgaWYgbWFsZm9ybWVkW2ldWzFdLmxlbmd0aCBpcyAwIGFuZCBtYWxmb3JtZWRbaS0xXVsyXS5sZW5ndGggaXMgMCBhbmQgbWFsZm9ybWVkW2ldWzBdIGlzIG1hbGZvcm1lZFtpLTFdWzBdXG4gICAgICBtYWxmb3JtZWRbaS0xXVsyXSA9IG1hbGZvcm1lZFtpLTFdWzJdLmNvbmNhdCBtYWxmb3JtZWRbaV1bMl1cbiAgcHJvcGVybHlGb3JtZWQgPSBbXVxuICBwcm9wZXJseUZvcm1lZC5wdXNoIG9iamVjdGlmaWVyIGl0ZW0gZm9yIGl0ZW0gaW4gbWFsZm9ybWVkIHdoZW4gaXRlbVsxXS5sZW5ndGggaXNudCAwXG4gIGluaGVyaXRlciBzZWdtZW50ZXIgcHJvcGVybHlGb3JtZWRcblxuXG5vYmplY3RpZmllciA9IChlbGVtZW50KSAtPlxuICBvYmplY3QgPVxuICAgIGRlcHRoOiBlbGVtZW50WzBdXG4gICAgdGFnOiBlbGVtZW50WzFdXG4gICAgb3B0aW9uczoge31cbiAgICBjaGlsZHJlbjogW11cbiAgb2JqZWN0Lm9wdGlvbnNbb3B0aW9uWzBdXSA9IG9wdGlvblsxXSBmb3Igb3B0aW9uIGluIGVsZW1lbnRbMl1cbiAgb2JqZWN0XG5cbnNlZ21lbnRlciA9IChhcnJheSkgLT5cbiAgcmVzdWx0cyA9IFtdXG4gIHJlY3Vyc2VyID0gKGFycmF5MiwgcG9zaXRpb24pIC0+XG4gICAgZm9yIGVsZW1lbnQsIGluZGV4IGluIGFycmF5MlxuICAgICAgZm9yIGkgaW4gW2FycmF5Mi5sZW5ndGgtMS4uaW5kZXgrMV0gYnkgLTFcbiAgICAgICAgaWYgZWxlbWVudC5kZXB0aCBpcyBhcnJheTJbaV0uZGVwdGhcbiAgICAgICAgICByZWN1cnNlciBhcnJheTIuc2xpY2UoaSksIHBvc2l0aW9uK2lcbiAgICAgICAgICByZWN1cnNlciBhcnJheTIuc2xpY2UoMCwgaSksIHBvc2l0aW9uXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmVzdWx0c1twb3NpdGlvbl0gPSBhcnJheTJcbiAgcmVtb3ZlciA9IChhcnJheTIpIC0+XG4gICAgcmVzdWx0czIgPSBbXVxuICAgIGZvciBlbGVtZW50IGluIGFycmF5MlxuICAgICAgaWYgZWxlbWVudD9cbiAgICAgICAgcmVzdWx0czIucHVzaCBlbGVtZW50XG4gICAgcmV0dXJuIHJlc3VsdHMyXG4gIHJlY3Vyc2VyIGFycmF5LCAwXG4gIHJlc3VsdHMgPSByZW1vdmVyIHJlc3VsdHNcbiAgcmVzdWx0c1xuXG5pbmhlcml0ZXIgPSAoYXJyYXkpIC0+XG4gIGZvciBzdWJBcnJheSBpbiBhcnJheVxuICAgIGZvciBqIGluIFtzdWJBcnJheS5sZW5ndGgtMS4uMV0gYnkgLTFcbiAgICAgIGNoaWxkID0gc3ViQXJyYXlbal1cbiAgICAgIHBhcmVudCA9IHN1YkFycmF5W2otMV1cbiAgICAgIHBhcmVudC5jaGlsZHJlbi5wdXNoIGNoaWxkXG4gIGZvciBpIGluIFthcnJheS5sZW5ndGgtMS4uMF0gYnkgLTFcbiAgICBzdWJBcnJheSA9IGFycmF5W2ldXG4gICAgbG9zdENoaWxkID0gc3ViQXJyYXlbMF1cbiAgICBmb3IgaiBpbiBbaS0xLi4wXSBieSAtMSB3aGVuIGkgaXNudCAwXG4gICAgICBwb3RlbnRpYWxIb21lID0gYXJyYXlbal1cbiAgICAgIHJvb3QgPSBwb3RlbnRpYWxIb21lWzBdXG4gICAgICBpZiByb290LmRlcHRoIDwgbG9zdENoaWxkLmRlcHRoXG4gICAgICAgIGZvciBwb3RlbnRpYWxTaWJsaW5nLCBpbmRleCBpbiBwb3RlbnRpYWxIb21lXG4gICAgICAgICAgaWYgcG90ZW50aWFsU2libGluZy5kZXB0aCBpcyBsb3N0Q2hpbGQuZGVwdGhcbiAgICAgICAgICAgIHBvdGVudGlhbEhvbWVbaW5kZXgtMV0uY2hpbGRyZW4uc3BsaWNlIDEsIDAsIGxvc3RDaGlsZFxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgYnJlYWtcbiAgYXJyYXlbMF1bMF0iLCJtb2R1bGUuZXhwb3J0cyA9XG4gIHJlbmRlcjogKCktPlxuICAgIEByZW5kZXJlci5yZW5kZXIoQHNjZW5lLCBAY2FtZXJhKVxuICBpbml0OiAoc2NlbmUsIGNhbWVyYSkgLT5cbiAgICByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyIHthbnRpYWxpYXM6IHRydWUsIHByZWNpc2lvbjogJ2hpZ2hwJ31cbiAgICByZW5kZXJlci5zZXRTaXplIGRvY3VtZW50LmJvZHkuc2Nyb2xsV2lkdGgsIGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0XG4gICAgc2NlbmUuYWRkIGNhbWVyYVxuICAgIEByZW5kZXJlciA9IHJlbmRlcmVyXG4gICAgQHNjZW5lID0gc2NlbmVcbiAgICBAY2FtZXJhID0gY2FtZXJhXG4gICAgQGRvbUVsZW1lbnQgPSByZW5kZXJlci5kb21FbGVtZW50IiwiY29udGFpbmVyTWFrZXIgPSByZXF1aXJlICcuL2NvbnRhaW5lck1vZHVsZS5jb2ZmZWUnXG5yZW5kZXJlciA9IHJlcXVpcmUgJy4uL3JlbmRlcmVyL3JlbmRlcmVyLmNvZmZlZSdcblxuY3JlYXRlSW1hZ2VNYXRlcmlhbCA9ICh1cmwpIC0+XG4gIHV0aWxzID0gIFRIUkVFLkltYWdlVXRpbHNcbiAgdXRpbHMuY3Jvc3NPcmlnaW4gPSAnYW5vbnltb3VzJ1xuICB0ZXh0dXJlID0gdXRpbHMubG9hZFRleHR1cmUgdXJsLCBuZXcgVEhSRUUuVVZNYXBwaW5nKCksIC0+XG4gICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWVcbiAgICByZW5kZXJlci5yZW5kZXIoKVxuICBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCB7bWFwOiB0ZXh0dXJlLCBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlfVxuICBtYXRlcmlhbC5tYXAubmVlZHNVcGRhdGUgPSB0cnVlXG4gIG1hdGVyaWFsXG5cbm1vZHVsZS5leHBvcnRzID0gaW1hZ2VNYWtlciA9IChub2RlKSAtPlxuICBtYXRlcmlhbCA9IGNyZWF0ZUltYWdlTWF0ZXJpYWwgbm9kZS50YWdcbiAgY29udGFpbmVyTWFrZXIgbm9kZSwgbWF0ZXJpYWwiLCJ0ZXh0ZXIgPSByZXF1aXJlICcuLi9Db25zdHJ1Y3Rvck1vZHVsZXMvdGV4dE1vZHVsZS5jb2ZmZWUnXG5pbWFnZXIgPSByZXF1aXJlICcuLi9Db25zdHJ1Y3Rvck1vZHVsZXMvaW1nTW9kdWxlLmNvZmZlZSdcbmNvbnRhaW5lciA9IHJlcXVpcmUgJy4uL0NvbnN0cnVjdG9yTW9kdWxlcy9jb250YWluZXJNb2R1bGUuY29mZmVlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxheW91dE1ha2VyID0gKHN5bnRheCkgLT5cbiAgd2lkdGggPSBzeW50YXgub3B0aW9ucy53aWR0aFxuICBoZWlnaHQgPSBzeW50YXgub3B0aW9ucy5oZWlnaHRcbiAgdmlld0FuZ2xlID0gNDVcbiAgYXNwZWN0ID0gd2lkdGgvaGVpZ2h0XG4gIG5lYXIgPSAwLjFcbiAgZmFyID0gMTAwMDBcbiAgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpXG4gIHJlbmRlcmVyLnNldFNpemUgd2lkdGgsIGhlaWdodFxuICBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEgdmlld0FuZ2xlLCBhc3BlY3QsIG5lYXIsIGZhclxuICBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpXG4gIGNhbWVyYS5wb3NpdGlvbi5zZXQgMCwgMCwgKHdpbmRvdy5pbm5lcldpZHRoKjIpLzNcbiAgcmVjdXJzaXZlU3RhZ2VyID0gKG5vZGUpIC0+XG4gICAgaWYgbm9kZS5vcHRpb25zLnR5cGUgaXMgJ3RleHQnXG4gICAgICBzY2VuZS5hZGQgdGV4dGVyIG5vZGVcbiAgICBlbHNlIGlmIG5vZGUub3B0aW9ucy50eXBlIGlzICdibG9jaydcbiAgICAgIHNjZW5lLmFkZCBjb250YWluZXIgbm9kZVxuICAgIGVsc2UgaWYgbm9kZS5vcHRpb25zLnR5cGUgaXMgJ2ltYWdlJ1xuICAgICAgc2NlbmUuYWRkIGltYWdlciBub2RlXG4gICAgcmVjdXJzaXZlU3RhZ2VyIGNoaWxkIGZvciBjaGlsZCBpbiBub2RlLmNoaWxkcmVuXG4gIHJlY3Vyc2l2ZVN0YWdlciBzeW50YXhcbiAgb2JqZWN0ID1cbiAgICBzY2VuZTogc2NlbmUsXG4gICAgY2FtZXJhOiBjYW1lcmFcbiAgb2JqZWN0IiwiV2ViR0xpZnkgPSByZXF1aXJlICcuL3dlYmdsaWZ5LmNvZmZlZSdcblxud2luZG93LndnbGlmeSA9XG4gIHJlbmRlckJsb2NrOiAoYmxvY2ssIG5vZGUpIC0+XG4gICAgd2ViZ2xpZnlPYmogPSBAV2ViR0xpZnkgYmxvY2ssIG5vZGUuc2Nyb2xsV2lkdGgsIG5vZGUuc2Nyb2xsSGVpZ2h0XG4gICAgbm9kZS5hcHBlbmRDaGlsZCB3ZWJnbGlmeU9iai5ub2RlXG4gICAgbm9kZS5nZXRHTGlmeUluc3RhbmNlID0gLT5cbiAgICAgIHJldHVybiBpbnN0YW5jZVxuICAgIGluc3RhbmNlID1cbiAgICAgIG5vZGU6IG5vZGVcbiAgICAgIGNhbnZhczogd2ViZ2xpZnlPYmoubm9kZVxuICAgICAgc2V0U2l6ZTogKHdpZHRoLCBoZWlnaHQpIC0+XG4gICAgICAgIEB3aWR0aCA9IEBub2RlLnNjcm9sbFdpZHRoXG4gICAgICAgIEBoZWlnaHQgPSBAbm9kZS5zY3JvbGxIZWlnaHRcbiAgICAgICAgaWYgQHdpZHRoIGlzbnQgQGNhbnZhcy53aWR0aCBvciBAaGVpZ2h0IGlzbnQgQGNhbnZhcy5oZWlnaHRcbiAgICAgICAgICBAcmVuZGVyXG4gICAgICByZW5kZXI6IChibG9jaykgLT5cbiAgICAgICAgd2ViZ2xpZnlPYmoucmVuZGVyKClcbiAgICBpbnN0YW5jZS5yZW5kZXIoKVxuICAgIGluc3RhbmNlXG4gIHBvcHVsYXRlQ29udGVudDogLT5cbiAgICBzY3JpcHRzID0gKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwgJ1t0eXBlPVwidGV4dC9XZWJHTGlmeVwiXScpLmNvbmNhdCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsICdbc3JjKj1cIldlYkdMaWZ5LmpzXCJdJ1xuICAgIGluc3RhbmNlcyA9IFtdXG4gICAgZm9yIHNjcmlwdCBpbiBzY3JpcHRzXG4gICAgICBjb250aW51ZSBpZiBub3Qgc2NyaXB0LmlubmVySFRNTD9cbiAgICAgIG5vZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCBzY3JpcHQuZ2V0QXR0cmlidXRlKCd0YXJnZXQnKSBvciAnYm9keSdcbiAgICAgIGlmIG5vZGVzLmxlbmd0aD9cbiAgICAgICAgaW5zdGFuY2VzLnB1c2ggd2dsaWZ5LnJlbmRlckJsb2NrIHNjcmlwdC5pbm5lckhUTUwsIG5vZGVzWzBdXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIChldnQpIC0+XG4gICAgICBmb3IgaW5zdGFuY2UgaW4gaW5zdGFuY2VzXG4gICAgICAgIGluc3RhbmNlLnNldFNpemVcbiAgV2ViR0xpZnk6IHJlcXVpcmUgJy4vd2ViZ2xpZnkuY29mZmVlJ1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyICdET01Db250ZW50TG9hZGVkJywgKGV2ZW50KSAtPlxuICB3Z2xpZnkucG9wdWxhdGVDb250ZW50KCkiLCIjIyNcbiAqIFdlYkdsaWZ5XG4gKiBodHRwczovL2dpdGh1Yi5jb20vRG5NbGxyL3dlYmdsaWZ5XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDEzIERhbmllbCBNaWxsZXJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiMjI1xuXG5kcmVzc2VyID0gcmVxdWlyZSAnLi4vY29tcGlsZXIvZHJlc3Nlci5jb2ZmZWUnXG5sYXlvdXQgPSByZXF1aXJlICcuLi9MYXlvdXRNb2R1bGVzL2xheW91dE1vZHVsZS5jb2ZmZWUnXG5wYXJzZXIgPSByZXF1aXJlICcuLi9wYXJzZXJzL3dlYmdsaWZ5UEFSU0VSLmNvZmZlZSdcbnJlbmRlcmVyID0gcmVxdWlyZSAnLi4vcmVuZGVyZXIvcmVuZGVyZXIuY29mZmVlJ1xuXG5cbm1vZHVsZS5leHBvcnRzID0gV2ViR2xpZnkgPSAoZGF0YSwgYmFzZVdpZHRoLCBiYXNlSGVpZ2h0KSAtPlxuICB2YWx1ZSA9IGRhdGFcbiAgc2NlbmUgPSBsYXlvdXQgZHJlc3NlciAocGFyc2VyIHZhbHVlKSwgYmFzZVdpZHRoLCBiYXNlSGVpZ2h0XG4gIHJlbmRlcmVyLmluaXQgc2NlbmUuc2NlbmUsIHNjZW5lLmNhbWVyYVxuICBXZWJHbGlmeU9iaiA9XG4gICAgcmVuZGVyZXI6IHJlbmRlcmVyXG4gICAgcmVuZGVyOiAtPlxuICAgICAgcmVuZGVyZXIucmVuZGVyKClcbiAgICBub2RlOiByZW5kZXJlci5kb21FbGVtZW50XG4gICAgc2NlbmU6IHNjZW5lXG5cblxuXG53aW5kb3cuV2ViR2xpZnkgPSAoZGF0YSkgLT5cbiAgdmFsdWUgPSBkYXRhXG4gIHNjZW5lID0gbGF5b3V0IGRyZXNzZXIgcGFyc2VyIHZhbHVlXG4gIHJlbmRlcmVyLmluaXQgc2NlbmUuc2NlbmUsIHNjZW5lLmNhbWVyYVxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkIHJlbmRlcmVyLmRvbUVsZW1lbnRcbiAgcmVuZGVyZXIucmVuZGVyKCkiLCJodG1scGFyc2UgPSByZXF1aXJlICdodG1scGFyc2VyJ1xuXG5maW5kRWxlbWVudHNCeVR5cGUgPSAodHlwZSwgZWxlbWVudCkgLT5cbiAgcmVzdWx0cyA9IFtdXG4gIHJlY3Vyc2VTZWFyY2ggPSAodHlwZSwgZWxlbWVudCkgLT5cbiAgICBmb3Igbm9kZSBpbiBlbGVtZW50XG4gICAgICBpZiBub2RlLnR5cGUgaXMgdHlwZVxuICAgICAgICByZXN1bHRzLnB1c2ggbm9kZS5kYXRhXG4gICAgICByZWN1cnNlU2VhcmNoIHR5cGUsIG5vZGUuY2hpbGRyZW4gaWYgbm9kZS5jaGlsZHJlblxuICByZWN1cnNlU2VhcmNoIHR5cGUsIGVsZW1lbnRcbiAgcmVzdWx0c1xuXG5jbGFzcyBIVE1McGFyc2VyXG4gIGNvbnN0cnVjdG9yOiAoQHR5cGUpIC0+XG4gIHBhcnNlOiAoaHRtbCkgLT5cbiAgICBoYW5kbGVyID0gbmV3IGh0bWxwYXJzZS5EZWZhdWx0SGFuZGxlciAoZXJyb3IsIGRvbSkgLT5cbiAgICAgIGlmIGVycm9yXG4gICAgICAgIGNvbnNvbGUubG9nICdlcnJvcidcbiAgICAgIGVsc2VcbiAgICAgICAgQGRpdnMgPSBmaW5kRWxlbWVudHNCeVR5cGUgJ2RpdicsIGRvbVxuICAgICAgICBAdGV4dCA9IGZpbmRFbGVtZW50c0J5VHlwZSAndGV4dCcsIGRvbVxuICAgIHBhcnNlciA9IG5ldyBodG1scGFyc2UuUGFyc2VyKGhhbmRsZXIpXG4gICAgcGFyc2VyLnBhcnNlQ29tcGxldGUgaHRtbFxuICAgIHtkaXY6IGhhbmRsZXIuZGl2cywgdGV4dDogaGFuZGxlci50ZXh0fVxuXG5cbm1vZHVsZS5leHBvcnRzID0gSFRNTHBhcnNlciIsIihmdW5jdGlvbihfX2ZpbGVuYW1lLF9fZGlybmFtZSl7LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5Db3B5cmlnaHQgMjAxMCwgMjAxMSwgQ2hyaXMgV2luYmVycnkgPGNocmlzQHdpbmJlcnJ5Lm5ldD4uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0b1xuZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGVcbnJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vclxuc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG5hbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HXG5GUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTXG5JTiBUSEUgU09GVFdBUkUuXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qIHYxLjcuNiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXG5mdW5jdGlvbiBydW5uaW5nSW5Ob2RlICgpIHtcblx0cmV0dXJuKFxuXHRcdCh0eXBlb2YgcmVxdWlyZSkgPT0gXCJmdW5jdGlvblwiXG5cdFx0JiZcblx0XHQodHlwZW9mIGV4cG9ydHMpID09IFwib2JqZWN0XCJcblx0XHQmJlxuXHRcdCh0eXBlb2YgbW9kdWxlKSA9PSBcIm9iamVjdFwiXG5cdFx0JiZcblx0XHQodHlwZW9mIF9fZmlsZW5hbWUpID09IFwic3RyaW5nXCJcblx0XHQmJlxuXHRcdCh0eXBlb2YgX19kaXJuYW1lKSA9PSBcInN0cmluZ1wiXG5cdFx0KTtcbn1cblxuaWYgKCFydW5uaW5nSW5Ob2RlKCkpIHtcblx0aWYgKCF0aGlzLlRhdXRvbG9naXN0aWNzKVxuXHRcdHRoaXMuVGF1dG9sb2dpc3RpY3MgPSB7fTtcblx0ZWxzZSBpZiAodGhpcy5UYXV0b2xvZ2lzdGljcy5Ob2RlSHRtbFBhcnNlcilcblx0XHRyZXR1cm47IC8vTm9kZUh0bWxQYXJzZXIgYWxyZWFkeSBkZWZpbmVkIVxuXHR0aGlzLlRhdXRvbG9naXN0aWNzLk5vZGVIdG1sUGFyc2VyID0ge307XG5cdGV4cG9ydHMgPSB0aGlzLlRhdXRvbG9naXN0aWNzLk5vZGVIdG1sUGFyc2VyO1xufVxuXG4vL1R5cGVzIG9mIGVsZW1lbnRzIGZvdW5kIGluIHRoZSBET01cbnZhciBFbGVtZW50VHlwZSA9IHtcblx0ICBUZXh0OiBcInRleHRcIiAvL1BsYWluIHRleHRcblx0LCBEaXJlY3RpdmU6IFwiZGlyZWN0aXZlXCIgLy9TcGVjaWFsIHRhZyA8IS4uLj5cblx0LCBDb21tZW50OiBcImNvbW1lbnRcIiAvL1NwZWNpYWwgdGFnIDwhLS0uLi4tLT5cblx0LCBTY3JpcHQ6IFwic2NyaXB0XCIgLy9TcGVjaWFsIHRhZyA8c2NyaXB0Pi4uLjwvc2NyaXB0PlxuXHQsIFN0eWxlOiBcInN0eWxlXCIgLy9TcGVjaWFsIHRhZyA8c3R5bGU+Li4uPC9zdHlsZT5cblx0LCBUYWc6IFwidGFnXCIgLy9BbnkgdGFnIHRoYXQgaXNuJ3Qgc3BlY2lhbFxufVxuXG5mdW5jdGlvbiBQYXJzZXIgKGhhbmRsZXIsIG9wdGlvbnMpIHtcblx0dGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgPyBvcHRpb25zIDogeyB9O1xuXHRpZiAodGhpcy5fb3B0aW9ucy5pbmNsdWRlTG9jYXRpb24gPT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhpcy5fb3B0aW9ucy5pbmNsdWRlTG9jYXRpb24gPSBmYWxzZTsgLy9EbyBub3QgdHJhY2sgZWxlbWVudCBwb3NpdGlvbiBpbiBkb2N1bWVudCBieSBkZWZhdWx0XG5cdH1cblxuXHR0aGlzLnZhbGlkYXRlSGFuZGxlcihoYW5kbGVyKTtcblx0dGhpcy5faGFuZGxlciA9IGhhbmRsZXI7XG5cdHRoaXMucmVzZXQoKTtcbn1cblxuXHQvLyoqXCJTdGF0aWNcIioqLy9cblx0Ly9SZWd1bGFyIGV4cHJlc3Npb25zIHVzZWQgZm9yIGNsZWFuaW5nIHVwIGFuZCBwYXJzaW5nIChzdGF0ZWxlc3MpXG5cdFBhcnNlci5fcmVUcmltID0gLyheXFxzK3xcXHMrJCkvZzsgLy9UcmltIGxlYWRpbmcvdHJhaWxpbmcgd2hpdGVzcGFjZVxuXHRQYXJzZXIuX3JlVHJpbUNvbW1lbnQgPSAvKF5cXCEtLXwtLSQpL2c7IC8vUmVtb3ZlIGNvbW1lbnQgdGFnIG1hcmt1cCBmcm9tIGNvbW1lbnQgY29udGVudHNcblx0UGFyc2VyLl9yZVdoaXRlc3BhY2UgPSAvXFxzL2c7IC8vVXNlZCB0byBmaW5kIGFueSB3aGl0ZXNwYWNlIHRvIHNwbGl0IG9uXG5cdFBhcnNlci5fcmVUYWdOYW1lID0gL15cXHMqKFxcLz8pXFxzKihbXlxcc1xcL10rKS87IC8vVXNlZCB0byBmaW5kIHRoZSB0YWcgbmFtZSBmb3IgYW4gZWxlbWVudFxuXG5cdC8vUmVndWxhciBleHByZXNzaW9ucyB1c2VkIGZvciBwYXJzaW5nIChzdGF0ZWZ1bClcblx0UGFyc2VyLl9yZUF0dHJpYiA9IC8vRmluZCBhdHRyaWJ1dGVzIGluIGEgdGFnXG5cdFx0LyhbXj08PlxcXCJcXCdcXHNdKylcXHMqPVxccypcIihbXlwiXSopXCJ8KFtePTw+XFxcIlxcJ1xcc10rKVxccyo9XFxzKicoW14nXSopJ3woW149PD5cXFwiXFwnXFxzXSspXFxzKj1cXHMqKFteJ1wiXFxzXSspfChbXj08PlxcXCJcXCdcXHNcXC9dKykvZztcblx0UGFyc2VyLl9yZVRhZ3MgPSAvW1xcPFxcPl0vZzsgLy9GaW5kIHRhZyBtYXJrZXJzXG5cblx0Ly8qKlB1YmxpYyoqLy9cblx0Ly9NZXRob2RzLy9cblx0Ly9QYXJzZXMgYSBjb21wbGV0ZSBIVE1MIGFuZCBwdXNoZXMgaXQgdG8gdGhlIGhhbmRsZXJcblx0UGFyc2VyLnByb3RvdHlwZS5wYXJzZUNvbXBsZXRlID0gZnVuY3Rpb24gUGFyc2VyJHBhcnNlQ29tcGxldGUgKGRhdGEpIHtcblx0XHR0aGlzLnJlc2V0KCk7XG5cdFx0dGhpcy5wYXJzZUNodW5rKGRhdGEpO1xuXHRcdHRoaXMuZG9uZSgpO1xuXHR9XG5cblx0Ly9QYXJzZXMgYSBwaWVjZSBvZiBhbiBIVE1MIGRvY3VtZW50XG5cdFBhcnNlci5wcm90b3R5cGUucGFyc2VDaHVuayA9IGZ1bmN0aW9uIFBhcnNlciRwYXJzZUNodW5rIChkYXRhKSB7XG5cdFx0aWYgKHRoaXMuX2RvbmUpXG5cdFx0XHR0aGlzLmhhbmRsZUVycm9yKG5ldyBFcnJvcihcIkF0dGVtcHRlZCB0byBwYXJzZSBjaHVuayBhZnRlciBwYXJzaW5nIGFscmVhZHkgZG9uZVwiKSk7XG5cdFx0dGhpcy5fYnVmZmVyICs9IGRhdGE7IC8vRklYTUU6IHRoaXMgY2FuIGJlIGEgYm90dGxlbmVja1xuXHRcdHRoaXMucGFyc2VUYWdzKCk7XG5cdH1cblxuXHQvL1RlbGxzIHRoZSBwYXJzZXIgdGhhdCB0aGUgSFRNTCBiZWluZyBwYXJzZWQgaXMgY29tcGxldGVcblx0UGFyc2VyLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24gUGFyc2VyJGRvbmUgKCkge1xuXHRcdGlmICh0aGlzLl9kb25lKVxuXHRcdFx0cmV0dXJuO1xuXHRcdHRoaXMuX2RvbmUgPSB0cnVlO1xuXHRcblx0XHQvL1B1c2ggYW55IHVucGFyc2VkIHRleHQgaW50byBhIGZpbmFsIGVsZW1lbnQgaW4gdGhlIGVsZW1lbnQgbGlzdFxuXHRcdGlmICh0aGlzLl9idWZmZXIubGVuZ3RoKSB7XG5cdFx0XHR2YXIgcmF3RGF0YSA9IHRoaXMuX2J1ZmZlcjtcblx0XHRcdHRoaXMuX2J1ZmZlciA9IFwiXCI7XG5cdFx0XHR2YXIgZWxlbWVudCA9IHtcblx0XHRcdFx0ICByYXc6IHJhd0RhdGFcblx0XHRcdFx0LCBkYXRhOiAodGhpcy5fcGFyc2VTdGF0ZSA9PSBFbGVtZW50VHlwZS5UZXh0KSA/IHJhd0RhdGEgOiByYXdEYXRhLnJlcGxhY2UoUGFyc2VyLl9yZVRyaW0sIFwiXCIpXG5cdFx0XHRcdCwgdHlwZTogdGhpcy5fcGFyc2VTdGF0ZVxuXHRcdFx0XHR9O1xuXHRcdFx0aWYgKHRoaXMuX3BhcnNlU3RhdGUgPT0gRWxlbWVudFR5cGUuVGFnIHx8IHRoaXMuX3BhcnNlU3RhdGUgPT0gRWxlbWVudFR5cGUuU2NyaXB0IHx8IHRoaXMuX3BhcnNlU3RhdGUgPT0gRWxlbWVudFR5cGUuU3R5bGUpXG5cdFx0XHRcdGVsZW1lbnQubmFtZSA9IHRoaXMucGFyc2VUYWdOYW1lKGVsZW1lbnQuZGF0YSk7XG5cdFx0XHR0aGlzLnBhcnNlQXR0cmlicyhlbGVtZW50KTtcblx0XHRcdHRoaXMuX2VsZW1lbnRzLnB1c2goZWxlbWVudCk7XG5cdFx0fVxuXHRcblx0XHR0aGlzLndyaXRlSGFuZGxlcigpO1xuXHRcdHRoaXMuX2hhbmRsZXIuZG9uZSgpO1xuXHR9XG5cblx0Ly9SZXNldHMgdGhlIHBhcnNlciB0byBhIGJsYW5rIHN0YXRlLCByZWFkeSB0byBwYXJzZSBhIG5ldyBIVE1MIGRvY3VtZW50XG5cdFBhcnNlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiBQYXJzZXIkcmVzZXQgKCkge1xuXHRcdHRoaXMuX2J1ZmZlciA9IFwiXCI7XG5cdFx0dGhpcy5fZG9uZSA9IGZhbHNlO1xuXHRcdHRoaXMuX2VsZW1lbnRzID0gW107XG5cdFx0dGhpcy5fZWxlbWVudHNDdXJyZW50ID0gMDtcblx0XHR0aGlzLl9jdXJyZW50ID0gMDtcblx0XHR0aGlzLl9uZXh0ID0gMDtcblx0XHR0aGlzLl9sb2NhdGlvbiA9IHtcblx0XHRcdCAgcm93OiAwXG5cdFx0XHQsIGNvbDogMFxuXHRcdFx0LCBjaGFyT2Zmc2V0OiAwXG5cdFx0XHQsIGluQnVmZmVyOiAwXG5cdFx0fTtcblx0XHR0aGlzLl9wYXJzZVN0YXRlID0gRWxlbWVudFR5cGUuVGV4dDtcblx0XHR0aGlzLl9wcmV2VGFnU2VwID0gJyc7XG5cdFx0dGhpcy5fdGFnU3RhY2sgPSBbXTtcblx0XHR0aGlzLl9oYW5kbGVyLnJlc2V0KCk7XG5cdH1cblx0XG5cdC8vKipQcml2YXRlKiovL1xuXHQvL1Byb3BlcnRpZXMvL1xuXHRQYXJzZXIucHJvdG90eXBlLl9vcHRpb25zID0gbnVsbDsgLy9QYXJzZXIgb3B0aW9ucyBmb3IgaG93IHRvIGJlaGF2ZVxuXHRQYXJzZXIucHJvdG90eXBlLl9oYW5kbGVyID0gbnVsbDsgLy9IYW5kbGVyIGZvciBwYXJzZWQgZWxlbWVudHNcblx0UGFyc2VyLnByb3RvdHlwZS5fYnVmZmVyID0gbnVsbDsgLy9CdWZmZXIgb2YgdW5wYXJzZWQgZGF0YVxuXHRQYXJzZXIucHJvdG90eXBlLl9kb25lID0gZmFsc2U7IC8vRmxhZyBpbmRpY2F0aW5nIHdoZXRoZXIgcGFyc2luZyBpcyBkb25lXG5cdFBhcnNlci5wcm90b3R5cGUuX2VsZW1lbnRzID0gIG51bGw7IC8vQXJyYXkgb2YgcGFyc2VkIGVsZW1lbnRzXG5cdFBhcnNlci5wcm90b3R5cGUuX2VsZW1lbnRzQ3VycmVudCA9IDA7IC8vUG9pbnRlciB0byBsYXN0IGVsZW1lbnQgaW4gX2VsZW1lbnRzIHRoYXQgaGFzIGJlZW4gcHJvY2Vzc2VkXG5cdFBhcnNlci5wcm90b3R5cGUuX2N1cnJlbnQgPSAwOyAvL1Bvc2l0aW9uIGluIGRhdGEgdGhhdCBoYXMgYWxyZWFkeSBiZWVuIHBhcnNlZFxuXHRQYXJzZXIucHJvdG90eXBlLl9uZXh0ID0gMDsgLy9Qb3NpdGlvbiBpbiBkYXRhIG9mIHRoZSBuZXh0IHRhZyBtYXJrZXIgKDw+KVxuXHRQYXJzZXIucHJvdG90eXBlLl9sb2NhdGlvbiA9IG51bGw7IC8vUG9zaXRpb24gdHJhY2tpbmcgZm9yIGVsZW1lbnRzIGluIGEgc3RyZWFtXG5cdFBhcnNlci5wcm90b3R5cGUuX3BhcnNlU3RhdGUgPSBFbGVtZW50VHlwZS5UZXh0OyAvL0N1cnJlbnQgdHlwZSBvZiBlbGVtZW50IGJlaW5nIHBhcnNlZFxuXHRQYXJzZXIucHJvdG90eXBlLl9wcmV2VGFnU2VwID0gJyc7IC8vUHJldmlvdXMgdGFnIG1hcmtlciBmb3VuZFxuXHQvL1N0YWNrIG9mIGVsZW1lbnQgdHlwZXMgcHJldmlvdXNseSBlbmNvdW50ZXJlZDsga2VlcHMgdHJhY2sgb2Ygd2hlblxuXHQvL3BhcnNpbmcgb2NjdXJzIGluc2lkZSBhIHNjcmlwdC9jb21tZW50L3N0eWxlIHRhZ1xuXHRQYXJzZXIucHJvdG90eXBlLl90YWdTdGFjayA9IG51bGw7XG5cblx0Ly9NZXRob2RzLy9cblx0Ly9UYWtlcyBhbiBhcnJheSBvZiBlbGVtZW50cyBhbmQgcGFyc2VzIGFueSBmb3VuZCBhdHRyaWJ1dGVzXG5cdFBhcnNlci5wcm90b3R5cGUucGFyc2VUYWdBdHRyaWJzID0gZnVuY3Rpb24gUGFyc2VyJHBhcnNlVGFnQXR0cmlicyAoZWxlbWVudHMpIHtcblx0XHR2YXIgaWR4RW5kID0gZWxlbWVudHMubGVuZ3RoO1xuXHRcdHZhciBpZHggPSAwO1xuXHRcblx0XHR3aGlsZSAoaWR4IDwgaWR4RW5kKSB7XG5cdFx0XHR2YXIgZWxlbWVudCA9IGVsZW1lbnRzW2lkeCsrXTtcblx0XHRcdGlmIChlbGVtZW50LnR5cGUgPT0gRWxlbWVudFR5cGUuVGFnIHx8IGVsZW1lbnQudHlwZSA9PSBFbGVtZW50VHlwZS5TY3JpcHQgfHwgZWxlbWVudC50eXBlID09IEVsZW1lbnRUeXBlLnN0eWxlKVxuXHRcdFx0XHR0aGlzLnBhcnNlQXR0cmlicyhlbGVtZW50KTtcblx0XHR9XG5cdFxuXHRcdHJldHVybihlbGVtZW50cyk7XG5cdH1cblxuXHQvL1Rha2VzIGFuIGVsZW1lbnQgYW5kIGFkZHMgYW4gXCJhdHRyaWJzXCIgcHJvcGVydHkgZm9yIGFueSBlbGVtZW50IGF0dHJpYnV0ZXMgZm91bmQgXG5cdFBhcnNlci5wcm90b3R5cGUucGFyc2VBdHRyaWJzID0gZnVuY3Rpb24gUGFyc2VyJHBhcnNlQXR0cmlicyAoZWxlbWVudCkge1xuXHRcdC8vT25seSBwYXJzZSBhdHRyaWJ1dGVzIGZvciB0YWdzXG5cdFx0aWYgKGVsZW1lbnQudHlwZSAhPSBFbGVtZW50VHlwZS5TY3JpcHQgJiYgZWxlbWVudC50eXBlICE9IEVsZW1lbnRUeXBlLlN0eWxlICYmIGVsZW1lbnQudHlwZSAhPSBFbGVtZW50VHlwZS5UYWcpXG5cdFx0XHRyZXR1cm47XG5cdFxuXHRcdHZhciB0YWdOYW1lID0gZWxlbWVudC5kYXRhLnNwbGl0KFBhcnNlci5fcmVXaGl0ZXNwYWNlLCAxKVswXTtcblx0XHR2YXIgYXR0cmliUmF3ID0gZWxlbWVudC5kYXRhLnN1YnN0cmluZyh0YWdOYW1lLmxlbmd0aCk7XG5cdFx0aWYgKGF0dHJpYlJhdy5sZW5ndGggPCAxKVxuXHRcdFx0cmV0dXJuO1xuXHRcblx0XHR2YXIgbWF0Y2g7XG5cdFx0UGFyc2VyLl9yZUF0dHJpYi5sYXN0SW5kZXggPSAwO1xuXHRcdHdoaWxlIChtYXRjaCA9IFBhcnNlci5fcmVBdHRyaWIuZXhlYyhhdHRyaWJSYXcpKSB7XG5cdFx0XHRpZiAoZWxlbWVudC5hdHRyaWJzID09IHVuZGVmaW5lZClcblx0XHRcdFx0ZWxlbWVudC5hdHRyaWJzID0ge307XG5cdFxuXHRcdFx0aWYgKHR5cGVvZiBtYXRjaFsxXSA9PSBcInN0cmluZ1wiICYmIG1hdGNoWzFdLmxlbmd0aCkge1xuXHRcdFx0XHRlbGVtZW50LmF0dHJpYnNbbWF0Y2hbMV1dID0gbWF0Y2hbMl07XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBtYXRjaFszXSA9PSBcInN0cmluZ1wiICYmIG1hdGNoWzNdLmxlbmd0aCkge1xuXHRcdFx0XHRlbGVtZW50LmF0dHJpYnNbbWF0Y2hbM10udG9TdHJpbmcoKV0gPSBtYXRjaFs0XS50b1N0cmluZygpO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgbWF0Y2hbNV0gPT0gXCJzdHJpbmdcIiAmJiBtYXRjaFs1XS5sZW5ndGgpIHtcblx0XHRcdFx0ZWxlbWVudC5hdHRyaWJzW21hdGNoWzVdXSA9IG1hdGNoWzZdO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgbWF0Y2hbN10gPT0gXCJzdHJpbmdcIiAmJiBtYXRjaFs3XS5sZW5ndGgpIHtcblx0XHRcdFx0ZWxlbWVudC5hdHRyaWJzW21hdGNoWzddXSA9IG1hdGNoWzddO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vRXh0cmFjdHMgdGhlIGJhc2UgdGFnIG5hbWUgZnJvbSB0aGUgZGF0YSB2YWx1ZSBvZiBhbiBlbGVtZW50XG5cdFBhcnNlci5wcm90b3R5cGUucGFyc2VUYWdOYW1lID0gZnVuY3Rpb24gUGFyc2VyJHBhcnNlVGFnTmFtZSAoZGF0YSkge1xuXHRcdGlmIChkYXRhID09IG51bGwgfHwgZGF0YSA9PSBcIlwiKVxuXHRcdFx0cmV0dXJuKFwiXCIpO1xuXHRcdHZhciBtYXRjaCA9IFBhcnNlci5fcmVUYWdOYW1lLmV4ZWMoZGF0YSk7XG5cdFx0aWYgKCFtYXRjaClcblx0XHRcdHJldHVybihcIlwiKTtcblx0XHRyZXR1cm4oKG1hdGNoWzFdID8gXCIvXCIgOiBcIlwiKSArIG1hdGNoWzJdKTtcblx0fVxuXG5cdC8vUGFyc2VzIHRocm91Z2ggSFRNTCB0ZXh0IGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIGZvdW5kIGVsZW1lbnRzXG5cdC8vSSBhZG1pdCwgdGhpcyBmdW5jdGlvbiBpcyByYXRoZXIgbGFyZ2UgYnV0IHNwbGl0dGluZyB1cCBoYWQgYW4gbm90aWNlYWJsZSBpbXBhY3Qgb24gc3BlZWRcblx0UGFyc2VyLnByb3RvdHlwZS5wYXJzZVRhZ3MgPSBmdW5jdGlvbiBQYXJzZXIkcGFyc2VUYWdzICgpIHtcblx0XHR2YXIgYnVmZmVyRW5kID0gdGhpcy5fYnVmZmVyLmxlbmd0aCAtIDE7XG5cdFx0d2hpbGUgKFBhcnNlci5fcmVUYWdzLnRlc3QodGhpcy5fYnVmZmVyKSkge1xuXHRcdFx0dGhpcy5fbmV4dCA9IFBhcnNlci5fcmVUYWdzLmxhc3RJbmRleCAtIDE7XG5cdFx0XHR2YXIgdGFnU2VwID0gdGhpcy5fYnVmZmVyLmNoYXJBdCh0aGlzLl9uZXh0KTsgLy9UaGUgY3VycmVudGx5IGZvdW5kIHRhZyBtYXJrZXJcblx0XHRcdHZhciByYXdEYXRhID0gdGhpcy5fYnVmZmVyLnN1YnN0cmluZyh0aGlzLl9jdXJyZW50LCB0aGlzLl9uZXh0KTsgLy9UaGUgbmV4dCBjaHVuayBvZiBkYXRhIHRvIHBhcnNlXG5cdFxuXHRcdFx0Ly9BIG5ldyBlbGVtZW50IHRvIGV2ZW50dWFsbHkgYmUgYXBwZW5kZWQgdG8gdGhlIGVsZW1lbnQgbGlzdFxuXHRcdFx0dmFyIGVsZW1lbnQgPSB7XG5cdFx0XHRcdCAgcmF3OiByYXdEYXRhXG5cdFx0XHRcdCwgZGF0YTogKHRoaXMuX3BhcnNlU3RhdGUgPT0gRWxlbWVudFR5cGUuVGV4dCkgPyByYXdEYXRhIDogcmF3RGF0YS5yZXBsYWNlKFBhcnNlci5fcmVUcmltLCBcIlwiKVxuXHRcdFx0XHQsIHR5cGU6IHRoaXMuX3BhcnNlU3RhdGVcblx0XHRcdH07XG5cdFxuXHRcdFx0dmFyIGVsZW1lbnROYW1lID0gdGhpcy5wYXJzZVRhZ05hbWUoZWxlbWVudC5kYXRhKTtcblx0XG5cdFx0XHQvL1RoaXMgc2VjdGlvbiBpbnNwZWN0cyB0aGUgY3VycmVudCB0YWcgc3RhY2sgYW5kIG1vZGlmaWVzIHRoZSBjdXJyZW50XG5cdFx0XHQvL2VsZW1lbnQgaWYgd2UncmUgYWN0dWFsbHkgcGFyc2luZyBhIHNwZWNpYWwgYXJlYSAoc2NyaXB0L2NvbW1lbnQvc3R5bGUgdGFnKVxuXHRcdFx0aWYgKHRoaXMuX3RhZ1N0YWNrLmxlbmd0aCkgeyAvL1dlJ3JlIHBhcnNpbmcgaW5zaWRlIGEgc2NyaXB0L2NvbW1lbnQvc3R5bGUgdGFnXG5cdFx0XHRcdGlmICh0aGlzLl90YWdTdGFja1t0aGlzLl90YWdTdGFjay5sZW5ndGggLSAxXSA9PSBFbGVtZW50VHlwZS5TY3JpcHQpIHsgLy9XZSdyZSBjdXJyZW50bHkgaW4gYSBzY3JpcHQgdGFnXG5cdFx0XHRcdFx0aWYgKGVsZW1lbnROYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCIvc2NyaXB0XCIpIC8vQWN0dWFsbHksIHdlJ3JlIG5vIGxvbmdlciBpbiBhIHNjcmlwdCB0YWcsIHNvIHBvcCBpdCBvZmYgdGhlIHN0YWNrXG5cdFx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5wb3AoKTtcblx0XHRcdFx0XHRlbHNlIHsgLy9Ob3QgYSBjbG9zaW5nIHNjcmlwdCB0YWdcblx0XHRcdFx0XHRcdGlmIChlbGVtZW50LnJhdy5pbmRleE9mKFwiIS0tXCIpICE9IDApIHsgLy9NYWtlIHN1cmUgd2UncmUgbm90IGluIGEgY29tbWVudFxuXHRcdFx0XHRcdFx0XHQvL0FsbCBkYXRhIGZyb20gaGVyZSB0byBzY3JpcHQgY2xvc2UgaXMgbm93IGEgdGV4dCBlbGVtZW50XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQudHlwZSA9IEVsZW1lbnRUeXBlLlRleHQ7XG5cdFx0XHRcdFx0XHRcdC8vSWYgdGhlIHByZXZpb3VzIGVsZW1lbnQgaXMgdGV4dCwgYXBwZW5kIHRoZSBjdXJyZW50IHRleHQgdG8gaXRcblx0XHRcdFx0XHRcdFx0aWYgKHRoaXMuX2VsZW1lbnRzLmxlbmd0aCAmJiB0aGlzLl9lbGVtZW50c1t0aGlzLl9lbGVtZW50cy5sZW5ndGggLSAxXS50eXBlID09IEVsZW1lbnRUeXBlLlRleHQpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgcHJldkVsZW1lbnQgPSB0aGlzLl9lbGVtZW50c1t0aGlzLl9lbGVtZW50cy5sZW5ndGggLSAxXTtcblx0XHRcdFx0XHRcdFx0XHRwcmV2RWxlbWVudC5yYXcgPSBwcmV2RWxlbWVudC5kYXRhID0gcHJldkVsZW1lbnQucmF3ICsgdGhpcy5fcHJldlRhZ1NlcCArIGVsZW1lbnQucmF3O1xuXHRcdFx0XHRcdFx0XHRcdGVsZW1lbnQucmF3ID0gZWxlbWVudC5kYXRhID0gXCJcIjsgLy9UaGlzIGNhdXNlcyB0aGUgY3VycmVudCBlbGVtZW50IHRvIG5vdCBiZSBhZGRlZCB0byB0aGUgZWxlbWVudCBsaXN0XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAodGhpcy5fdGFnU3RhY2tbdGhpcy5fdGFnU3RhY2subGVuZ3RoIC0gMV0gPT0gRWxlbWVudFR5cGUuU3R5bGUpIHsgLy9XZSdyZSBjdXJyZW50bHkgaW4gYSBzdHlsZSB0YWdcblx0XHRcdFx0XHRpZiAoZWxlbWVudE5hbWUudG9Mb3dlckNhc2UoKSA9PSBcIi9zdHlsZVwiKSAvL0FjdHVhbGx5LCB3ZSdyZSBubyBsb25nZXIgaW4gYSBzdHlsZSB0YWcsIHNvIHBvcCBpdCBvZmYgdGhlIHN0YWNrXG5cdFx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5wb3AoKTtcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGlmIChlbGVtZW50LnJhdy5pbmRleE9mKFwiIS0tXCIpICE9IDApIHsgLy9NYWtlIHN1cmUgd2UncmUgbm90IGluIGEgY29tbWVudFxuXHRcdFx0XHRcdFx0XHQvL0FsbCBkYXRhIGZyb20gaGVyZSB0byBzdHlsZSBjbG9zZSBpcyBub3cgYSB0ZXh0IGVsZW1lbnRcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC50eXBlID0gRWxlbWVudFR5cGUuVGV4dDtcblx0XHRcdFx0XHRcdFx0Ly9JZiB0aGUgcHJldmlvdXMgZWxlbWVudCBpcyB0ZXh0LCBhcHBlbmQgdGhlIGN1cnJlbnQgdGV4dCB0byBpdFxuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5fZWxlbWVudHMubGVuZ3RoICYmIHRoaXMuX2VsZW1lbnRzW3RoaXMuX2VsZW1lbnRzLmxlbmd0aCAtIDFdLnR5cGUgPT0gRWxlbWVudFR5cGUuVGV4dCkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBwcmV2RWxlbWVudCA9IHRoaXMuX2VsZW1lbnRzW3RoaXMuX2VsZW1lbnRzLmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChlbGVtZW50LnJhdyAhPSBcIlwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwcmV2RWxlbWVudC5yYXcgPSBwcmV2RWxlbWVudC5kYXRhID0gcHJldkVsZW1lbnQucmF3ICsgdGhpcy5fcHJldlRhZ1NlcCArIGVsZW1lbnQucmF3O1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbWVudC5yYXcgPSBlbGVtZW50LmRhdGEgPSBcIlwiOyAvL1RoaXMgY2F1c2VzIHRoZSBjdXJyZW50IGVsZW1lbnQgdG8gbm90IGJlIGFkZGVkIHRvIHRoZSBlbGVtZW50IGxpc3Rcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgeyAvL0VsZW1lbnQgaXMgZW1wdHksIHNvIGp1c3QgYXBwZW5kIHRoZSBsYXN0IHRhZyBtYXJrZXIgZm91bmRcblx0XHRcdFx0XHRcdFx0XHRcdHByZXZFbGVtZW50LnJhdyA9IHByZXZFbGVtZW50LmRhdGEgPSBwcmV2RWxlbWVudC5yYXcgKyB0aGlzLl9wcmV2VGFnU2VwO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSBlbHNlIHsgLy9UaGUgcHJldmlvdXMgZWxlbWVudCB3YXMgbm90IHRleHRcblx0XHRcdFx0XHRcdFx0XHRpZiAoZWxlbWVudC5yYXcgIT0gXCJcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbWVudC5yYXcgPSBlbGVtZW50LmRhdGEgPSBlbGVtZW50LnJhdztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAodGhpcy5fdGFnU3RhY2tbdGhpcy5fdGFnU3RhY2subGVuZ3RoIC0gMV0gPT0gRWxlbWVudFR5cGUuQ29tbWVudCkgeyAvL1dlJ3JlIGN1cnJlbnRseSBpbiBhIGNvbW1lbnQgdGFnXG5cdFx0XHRcdFx0dmFyIHJhd0xlbiA9IGVsZW1lbnQucmF3Lmxlbmd0aDtcblx0XHRcdFx0XHRpZiAoZWxlbWVudC5yYXcuY2hhckF0KHJhd0xlbiAtIDIpID09IFwiLVwiICYmIGVsZW1lbnQucmF3LmNoYXJBdChyYXdMZW4gLSAxKSA9PSBcIi1cIiAmJiB0YWdTZXAgPT0gXCI+XCIpIHtcblx0XHRcdFx0XHRcdC8vQWN0dWFsbHksIHdlJ3JlIG5vIGxvbmdlciBpbiBhIHN0eWxlIHRhZywgc28gcG9wIGl0IG9mZiB0aGUgc3RhY2tcblx0XHRcdFx0XHRcdHRoaXMuX3RhZ1N0YWNrLnBvcCgpO1xuXHRcdFx0XHRcdFx0Ly9JZiB0aGUgcHJldmlvdXMgZWxlbWVudCBpcyBhIGNvbW1lbnQsIGFwcGVuZCB0aGUgY3VycmVudCB0ZXh0IHRvIGl0XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5fZWxlbWVudHMubGVuZ3RoICYmIHRoaXMuX2VsZW1lbnRzW3RoaXMuX2VsZW1lbnRzLmxlbmd0aCAtIDFdLnR5cGUgPT0gRWxlbWVudFR5cGUuQ29tbWVudCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgcHJldkVsZW1lbnQgPSB0aGlzLl9lbGVtZW50c1t0aGlzLl9lbGVtZW50cy5sZW5ndGggLSAxXTtcblx0XHRcdFx0XHRcdFx0cHJldkVsZW1lbnQucmF3ID0gcHJldkVsZW1lbnQuZGF0YSA9IChwcmV2RWxlbWVudC5yYXcgKyBlbGVtZW50LnJhdykucmVwbGFjZShQYXJzZXIuX3JlVHJpbUNvbW1lbnQsIFwiXCIpO1xuXHRcdFx0XHRcdFx0XHRlbGVtZW50LnJhdyA9IGVsZW1lbnQuZGF0YSA9IFwiXCI7IC8vVGhpcyBjYXVzZXMgdGhlIGN1cnJlbnQgZWxlbWVudCB0byBub3QgYmUgYWRkZWQgdG8gdGhlIGVsZW1lbnQgbGlzdFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50LnR5cGUgPSBFbGVtZW50VHlwZS5UZXh0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSAvL1ByZXZpb3VzIGVsZW1lbnQgbm90IGEgY29tbWVudFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50LnR5cGUgPSBFbGVtZW50VHlwZS5Db21tZW50OyAvL0NoYW5nZSB0aGUgY3VycmVudCBlbGVtZW50J3MgdHlwZSB0byBhIGNvbW1lbnRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7IC8vU3RpbGwgaW4gYSBjb21tZW50IHRhZ1xuXHRcdFx0XHRcdFx0ZWxlbWVudC50eXBlID0gRWxlbWVudFR5cGUuQ29tbWVudDtcblx0XHRcdFx0XHRcdC8vSWYgdGhlIHByZXZpb3VzIGVsZW1lbnQgaXMgYSBjb21tZW50LCBhcHBlbmQgdGhlIGN1cnJlbnQgdGV4dCB0byBpdFxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX2VsZW1lbnRzLmxlbmd0aCAmJiB0aGlzLl9lbGVtZW50c1t0aGlzLl9lbGVtZW50cy5sZW5ndGggLSAxXS50eXBlID09IEVsZW1lbnRUeXBlLkNvbW1lbnQpIHtcblx0XHRcdFx0XHRcdFx0dmFyIHByZXZFbGVtZW50ID0gdGhpcy5fZWxlbWVudHNbdGhpcy5fZWxlbWVudHMubGVuZ3RoIC0gMV07XG5cdFx0XHRcdFx0XHRcdHByZXZFbGVtZW50LnJhdyA9IHByZXZFbGVtZW50LmRhdGEgPSBwcmV2RWxlbWVudC5yYXcgKyBlbGVtZW50LnJhdyArIHRhZ1NlcDtcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC5yYXcgPSBlbGVtZW50LmRhdGEgPSBcIlwiOyAvL1RoaXMgY2F1c2VzIHRoZSBjdXJyZW50IGVsZW1lbnQgdG8gbm90IGJlIGFkZGVkIHRvIHRoZSBlbGVtZW50IGxpc3Rcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC50eXBlID0gRWxlbWVudFR5cGUuVGV4dDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC5yYXcgPSBlbGVtZW50LmRhdGEgPSBlbGVtZW50LnJhdyArIHRhZ1NlcDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XG5cdFx0XHQvL1Byb2Nlc3Npbmcgb2Ygbm9uLXNwZWNpYWwgdGFnc1xuXHRcdFx0aWYgKGVsZW1lbnQudHlwZSA9PSBFbGVtZW50VHlwZS5UYWcpIHtcblx0XHRcdFx0ZWxlbWVudC5uYW1lID0gZWxlbWVudE5hbWU7XG5cdFx0XHRcdHZhciBlbGVtZW50TmFtZUNJID0gZWxlbWVudE5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChlbGVtZW50LnJhdy5pbmRleE9mKFwiIS0tXCIpID09IDApIHsgLy9UaGlzIHRhZyBpcyByZWFsbHkgY29tbWVudFxuXHRcdFx0XHRcdGVsZW1lbnQudHlwZSA9IEVsZW1lbnRUeXBlLkNvbW1lbnQ7XG5cdFx0XHRcdFx0ZGVsZXRlIGVsZW1lbnRbXCJuYW1lXCJdO1xuXHRcdFx0XHRcdHZhciByYXdMZW4gPSBlbGVtZW50LnJhdy5sZW5ndGg7XG5cdFx0XHRcdFx0Ly9DaGVjayBpZiB0aGUgY29tbWVudCBpcyB0ZXJtaW5hdGVkIGluIHRoZSBjdXJyZW50IGVsZW1lbnRcblx0XHRcdFx0XHRpZiAoZWxlbWVudC5yYXcuY2hhckF0KHJhd0xlbiAtIDEpID09IFwiLVwiICYmIGVsZW1lbnQucmF3LmNoYXJBdChyYXdMZW4gLSAyKSA9PSBcIi1cIiAmJiB0YWdTZXAgPT0gXCI+XCIpXG5cdFx0XHRcdFx0XHRlbGVtZW50LnJhdyA9IGVsZW1lbnQuZGF0YSA9IGVsZW1lbnQucmF3LnJlcGxhY2UoUGFyc2VyLl9yZVRyaW1Db21tZW50LCBcIlwiKTtcblx0XHRcdFx0XHRlbHNlIHsgLy9JdCdzIG5vdCBzbyBwdXNoIHRoZSBjb21tZW50IG9udG8gdGhlIHRhZyBzdGFja1xuXHRcdFx0XHRcdFx0ZWxlbWVudC5yYXcgKz0gdGFnU2VwO1xuXHRcdFx0XHRcdFx0dGhpcy5fdGFnU3RhY2sucHVzaChFbGVtZW50VHlwZS5Db21tZW50KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZWxlbWVudC5yYXcuaW5kZXhPZihcIiFcIikgPT0gMCB8fCBlbGVtZW50LnJhdy5pbmRleE9mKFwiP1wiKSA9PSAwKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC50eXBlID0gRWxlbWVudFR5cGUuRGlyZWN0aXZlO1xuXHRcdFx0XHRcdC8vVE9ETzogd2hhdCBhYm91dCBDREFUQT9cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChlbGVtZW50TmFtZUNJID09IFwic2NyaXB0XCIpIHtcblx0XHRcdFx0XHRlbGVtZW50LnR5cGUgPSBFbGVtZW50VHlwZS5TY3JpcHQ7XG5cdFx0XHRcdFx0Ly9TcGVjaWFsIHRhZywgcHVzaCBvbnRvIHRoZSB0YWcgc3RhY2sgaWYgbm90IHRlcm1pbmF0ZWRcblx0XHRcdFx0XHRpZiAoZWxlbWVudC5kYXRhLmNoYXJBdChlbGVtZW50LmRhdGEubGVuZ3RoIC0gMSkgIT0gXCIvXCIpXG5cdFx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5wdXNoKEVsZW1lbnRUeXBlLlNjcmlwdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZWxlbWVudE5hbWVDSSA9PSBcIi9zY3JpcHRcIilcblx0XHRcdFx0XHRlbGVtZW50LnR5cGUgPSBFbGVtZW50VHlwZS5TY3JpcHQ7XG5cdFx0XHRcdGVsc2UgaWYgKGVsZW1lbnROYW1lQ0kgPT0gXCJzdHlsZVwiKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC50eXBlID0gRWxlbWVudFR5cGUuU3R5bGU7XG5cdFx0XHRcdFx0Ly9TcGVjaWFsIHRhZywgcHVzaCBvbnRvIHRoZSB0YWcgc3RhY2sgaWYgbm90IHRlcm1pbmF0ZWRcblx0XHRcdFx0XHRpZiAoZWxlbWVudC5kYXRhLmNoYXJBdChlbGVtZW50LmRhdGEubGVuZ3RoIC0gMSkgIT0gXCIvXCIpXG5cdFx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5wdXNoKEVsZW1lbnRUeXBlLlN0eWxlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChlbGVtZW50TmFtZUNJID09IFwiL3N0eWxlXCIpXG5cdFx0XHRcdFx0ZWxlbWVudC50eXBlID0gRWxlbWVudFR5cGUuU3R5bGU7XG5cdFx0XHRcdGlmIChlbGVtZW50Lm5hbWUgJiYgZWxlbWVudC5uYW1lLmNoYXJBdCgwKSA9PSBcIi9cIilcblx0XHRcdFx0XHRlbGVtZW50LmRhdGEgPSBlbGVtZW50Lm5hbWU7XG5cdFx0XHR9XG5cdFxuXHRcdFx0Ly9BZGQgYWxsIHRhZ3MgYW5kIG5vbi1lbXB0eSB0ZXh0IGVsZW1lbnRzIHRvIHRoZSBlbGVtZW50IGxpc3Rcblx0XHRcdGlmIChlbGVtZW50LnJhdyAhPSBcIlwiIHx8IGVsZW1lbnQudHlwZSAhPSBFbGVtZW50VHlwZS5UZXh0KSB7XG5cdFx0XHRcdGlmICh0aGlzLl9vcHRpb25zLmluY2x1ZGVMb2NhdGlvbiAmJiAhZWxlbWVudC5sb2NhdGlvbikge1xuXHRcdFx0XHRcdGVsZW1lbnQubG9jYXRpb24gPSB0aGlzLmdldExvY2F0aW9uKGVsZW1lbnQudHlwZSA9PSBFbGVtZW50VHlwZS5UYWcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMucGFyc2VBdHRyaWJzKGVsZW1lbnQpO1xuXHRcdFx0XHR0aGlzLl9lbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuXHRcdFx0XHQvL0lmIHRhZyBzZWxmLXRlcm1pbmF0ZXMsIGFkZCBhbiBleHBsaWNpdCwgc2VwYXJhdGUgY2xvc2luZyB0YWdcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdGVsZW1lbnQudHlwZSAhPSBFbGVtZW50VHlwZS5UZXh0XG5cdFx0XHRcdFx0JiZcblx0XHRcdFx0XHRlbGVtZW50LnR5cGUgIT0gRWxlbWVudFR5cGUuQ29tbWVudFxuXHRcdFx0XHRcdCYmXG5cdFx0XHRcdFx0ZWxlbWVudC50eXBlICE9IEVsZW1lbnRUeXBlLkRpcmVjdGl2ZVxuXHRcdFx0XHRcdCYmXG5cdFx0XHRcdFx0ZWxlbWVudC5kYXRhLmNoYXJBdChlbGVtZW50LmRhdGEubGVuZ3RoIC0gMSkgPT0gXCIvXCJcblx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0dGhpcy5fZWxlbWVudHMucHVzaCh7XG5cdFx0XHRcdFx0XHQgIHJhdzogXCIvXCIgKyBlbGVtZW50Lm5hbWVcblx0XHRcdFx0XHRcdCwgZGF0YTogXCIvXCIgKyBlbGVtZW50Lm5hbWVcblx0XHRcdFx0XHRcdCwgbmFtZTogXCIvXCIgKyBlbGVtZW50Lm5hbWVcblx0XHRcdFx0XHRcdCwgdHlwZTogZWxlbWVudC50eXBlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9wYXJzZVN0YXRlID0gKHRhZ1NlcCA9PSBcIjxcIikgPyBFbGVtZW50VHlwZS5UYWcgOiBFbGVtZW50VHlwZS5UZXh0O1xuXHRcdFx0dGhpcy5fY3VycmVudCA9IHRoaXMuX25leHQgKyAxO1xuXHRcdFx0dGhpcy5fcHJldlRhZ1NlcCA9IHRhZ1NlcDtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fb3B0aW9ucy5pbmNsdWRlTG9jYXRpb24pIHtcblx0XHRcdHRoaXMuZ2V0TG9jYXRpb24oKTtcblx0XHRcdHRoaXMuX2xvY2F0aW9uLnJvdyArPSB0aGlzLl9sb2NhdGlvbi5pbkJ1ZmZlcjtcblx0XHRcdHRoaXMuX2xvY2F0aW9uLmluQnVmZmVyID0gMDtcblx0XHRcdHRoaXMuX2xvY2F0aW9uLmNoYXJPZmZzZXQgPSAwO1xuXHRcdH1cblx0XHR0aGlzLl9idWZmZXIgPSAodGhpcy5fY3VycmVudCA8PSBidWZmZXJFbmQpID8gdGhpcy5fYnVmZmVyLnN1YnN0cmluZyh0aGlzLl9jdXJyZW50KSA6IFwiXCI7XG5cdFx0dGhpcy5fY3VycmVudCA9IDA7XG5cdFxuXHRcdHRoaXMud3JpdGVIYW5kbGVyKCk7XG5cdH1cblxuXHRQYXJzZXIucHJvdG90eXBlLmdldExvY2F0aW9uID0gZnVuY3Rpb24gUGFyc2VyJGdldExvY2F0aW9uIChzdGFydFRhZykge1xuXHRcdHZhciBjLFxuXHRcdFx0bCA9IHRoaXMuX2xvY2F0aW9uLFxuXHRcdFx0ZW5kID0gdGhpcy5fY3VycmVudCAtIChzdGFydFRhZyA/IDEgOiAwKSxcblx0XHRcdGNodW5rID0gc3RhcnRUYWcgJiYgbC5jaGFyT2Zmc2V0ID09IDAgJiYgdGhpcy5fY3VycmVudCA9PSAwO1xuXHRcdFxuXHRcdGZvciAoOyBsLmNoYXJPZmZzZXQgPCBlbmQ7IGwuY2hhck9mZnNldCsrKSB7XG5cdFx0XHRjID0gdGhpcy5fYnVmZmVyLmNoYXJBdChsLmNoYXJPZmZzZXQpO1xuXHRcdFx0aWYgKGMgPT0gJ1xcbicpIHtcblx0XHRcdFx0bC5pbkJ1ZmZlcisrO1xuXHRcdFx0XHRsLmNvbCA9IDA7XG5cdFx0XHR9IGVsc2UgaWYgKGMgIT0gJ1xccicpIHtcblx0XHRcdFx0bC5jb2wrKztcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdCAgbGluZTogbC5yb3cgKyBsLmluQnVmZmVyICsgMVxuXHRcdFx0LCBjb2w6IGwuY29sICsgKGNodW5rID8gMDogMSlcblx0XHR9O1xuXHR9XG5cblx0Ly9DaGVja3MgdGhlIGhhbmRsZXIgdG8gbWFrZSBpdCBpcyBhbiBvYmplY3Qgd2l0aCB0aGUgcmlnaHQgXCJpbnRlcmZhY2VcIlxuXHRQYXJzZXIucHJvdG90eXBlLnZhbGlkYXRlSGFuZGxlciA9IGZ1bmN0aW9uIFBhcnNlciR2YWxpZGF0ZUhhbmRsZXIgKGhhbmRsZXIpIHtcblx0XHRpZiAoKHR5cGVvZiBoYW5kbGVyKSAhPSBcIm9iamVjdFwiKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSGFuZGxlciBpcyBub3QgYW4gb2JqZWN0XCIpO1xuXHRcdGlmICgodHlwZW9mIGhhbmRsZXIucmVzZXQpICE9IFwiZnVuY3Rpb25cIilcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkhhbmRsZXIgbWV0aG9kICdyZXNldCcgaXMgaW52YWxpZFwiKTtcblx0XHRpZiAoKHR5cGVvZiBoYW5kbGVyLmRvbmUpICE9IFwiZnVuY3Rpb25cIilcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkhhbmRsZXIgbWV0aG9kICdkb25lJyBpcyBpbnZhbGlkXCIpO1xuXHRcdGlmICgodHlwZW9mIGhhbmRsZXIud3JpdGVUYWcpICE9IFwiZnVuY3Rpb25cIilcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkhhbmRsZXIgbWV0aG9kICd3cml0ZVRhZycgaXMgaW52YWxpZFwiKTtcblx0XHRpZiAoKHR5cGVvZiBoYW5kbGVyLndyaXRlVGV4dCkgIT0gXCJmdW5jdGlvblwiKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSGFuZGxlciBtZXRob2QgJ3dyaXRlVGV4dCcgaXMgaW52YWxpZFwiKTtcblx0XHRpZiAoKHR5cGVvZiBoYW5kbGVyLndyaXRlQ29tbWVudCkgIT0gXCJmdW5jdGlvblwiKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSGFuZGxlciBtZXRob2QgJ3dyaXRlQ29tbWVudCcgaXMgaW52YWxpZFwiKTtcblx0XHRpZiAoKHR5cGVvZiBoYW5kbGVyLndyaXRlRGlyZWN0aXZlKSAhPSBcImZ1bmN0aW9uXCIpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJIYW5kbGVyIG1ldGhvZCAnd3JpdGVEaXJlY3RpdmUnIGlzIGludmFsaWRcIik7XG5cdH1cblxuXHQvL1dyaXRlcyBwYXJzZWQgZWxlbWVudHMgb3V0IHRvIHRoZSBoYW5kbGVyXG5cdFBhcnNlci5wcm90b3R5cGUud3JpdGVIYW5kbGVyID0gZnVuY3Rpb24gUGFyc2VyJHdyaXRlSGFuZGxlciAoZm9yY2VGbHVzaCkge1xuXHRcdGZvcmNlRmx1c2ggPSAhIWZvcmNlRmx1c2g7XG5cdFx0aWYgKHRoaXMuX3RhZ1N0YWNrLmxlbmd0aCAmJiAhZm9yY2VGbHVzaClcblx0XHRcdHJldHVybjtcblx0XHR3aGlsZSAodGhpcy5fZWxlbWVudHMubGVuZ3RoKSB7XG5cdFx0XHR2YXIgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRzLnNoaWZ0KCk7XG5cdFx0XHRzd2l0Y2ggKGVsZW1lbnQudHlwZSkge1xuXHRcdFx0XHRjYXNlIEVsZW1lbnRUeXBlLkNvbW1lbnQ6XG5cdFx0XHRcdFx0dGhpcy5faGFuZGxlci53cml0ZUNvbW1lbnQoZWxlbWVudCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgRWxlbWVudFR5cGUuRGlyZWN0aXZlOlxuXHRcdFx0XHRcdHRoaXMuX2hhbmRsZXIud3JpdGVEaXJlY3RpdmUoZWxlbWVudCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgRWxlbWVudFR5cGUuVGV4dDpcblx0XHRcdFx0XHR0aGlzLl9oYW5kbGVyLndyaXRlVGV4dChlbGVtZW50KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aGlzLl9oYW5kbGVyLndyaXRlVGFnKGVsZW1lbnQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdFBhcnNlci5wcm90b3R5cGUuaGFuZGxlRXJyb3IgPSBmdW5jdGlvbiBQYXJzZXIkaGFuZGxlRXJyb3IgKGVycm9yKSB7XG5cdFx0aWYgKCh0eXBlb2YgdGhpcy5faGFuZGxlci5lcnJvcikgPT0gXCJmdW5jdGlvblwiKVxuXHRcdFx0dGhpcy5faGFuZGxlci5lcnJvcihlcnJvcik7XG5cdFx0ZWxzZVxuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdH1cblxuLy9UT0RPOiBtYWtlIHRoaXMgYSB0cnVsbHkgc3RyZWFtYWJsZSBoYW5kbGVyXG5mdW5jdGlvbiBSc3NIYW5kbGVyIChjYWxsYmFjaykge1xuXHRSc3NIYW5kbGVyLnN1cGVyXy5jYWxsKHRoaXMsIGNhbGxiYWNrLCB7IGlnbm9yZVdoaXRlc3BhY2U6IHRydWUsIHZlcmJvc2U6IGZhbHNlLCBlbmZvcmNlRW1wdHlUYWdzOiBmYWxzZSB9KTtcbn1cbmluaGVyaXRzKFJzc0hhbmRsZXIsIERlZmF1bHRIYW5kbGVyKTtcblxuXHRSc3NIYW5kbGVyLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24gUnNzSGFuZGxlciRkb25lICgpIHtcblx0XHR2YXIgZmVlZCA9IHsgfTtcblx0XHR2YXIgZmVlZFJvb3Q7XG5cblx0XHR2YXIgZm91bmQgPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuKHZhbHVlID09IFwicnNzXCIgfHwgdmFsdWUgPT0gXCJmZWVkXCIpOyB9LCB0aGlzLmRvbSwgZmFsc2UpO1xuXHRcdGlmIChmb3VuZC5sZW5ndGgpIHtcblx0XHRcdGZlZWRSb290ID0gZm91bmRbMF07XG5cdFx0fVxuXHRcdGlmIChmZWVkUm9vdCkge1xuXHRcdFx0aWYgKGZlZWRSb290Lm5hbWUgPT0gXCJyc3NcIikge1xuXHRcdFx0XHRmZWVkLnR5cGUgPSBcInJzc1wiO1xuXHRcdFx0XHRmZWVkUm9vdCA9IGZlZWRSb290LmNoaWxkcmVuWzBdOyAvLzxjaGFubmVsLz5cblx0XHRcdFx0ZmVlZC5pZCA9IFwiXCI7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC50aXRsZSA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIiwgZmVlZFJvb3QuY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC5saW5rID0gRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaW5rXCIsIGZlZWRSb290LmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YTtcblx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZlZWQuZGVzY3JpcHRpb24gPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImRlc2NyaXB0aW9uXCIsIGZlZWRSb290LmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YTtcblx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGZlZWQudXBkYXRlZCA9IG5ldyBEYXRlKERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibGFzdEJ1aWxkRGF0ZVwiLCBmZWVkUm9vdC5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGEpO1xuXHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC5hdXRob3IgPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm1hbmFnaW5nRWRpdG9yXCIsIGZlZWRSb290LmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YTtcblx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHRmZWVkLml0ZW1zID0gW107XG5cdFx0XHRcdERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaXRlbVwiLCBmZWVkUm9vdC5jaGlsZHJlbikuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgsIGxpc3QpIHtcblx0XHRcdFx0XHR2YXIgZW50cnkgPSB7fTtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0ZW50cnkuaWQgPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImd1aWRcIiwgaXRlbS5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGE7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRlbnRyeS50aXRsZSA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIiwgaXRlbS5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGE7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRlbnRyeS5saW5rID0gRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaW5rXCIsIGl0ZW0uY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0ZW50cnkuZGVzY3JpcHRpb24gPSBEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImRlc2NyaXB0aW9uXCIsIGl0ZW0uY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0ZW50cnkucHViRGF0ZSA9IG5ldyBEYXRlKERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicHViRGF0ZVwiLCBpdGVtLmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YSk7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHRcdGZlZWQuaXRlbXMucHVzaChlbnRyeSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZmVlZC50eXBlID0gXCJhdG9tXCI7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC5pZCA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaWRcIiwgZmVlZFJvb3QuY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC50aXRsZSA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIiwgZmVlZFJvb3QuY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC5saW5rID0gRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaW5rXCIsIGZlZWRSb290LmNoaWxkcmVuLCBmYWxzZSlbMF0uYXR0cmlicy5ocmVmO1xuXHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC5kZXNjcmlwdGlvbiA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3VidGl0bGVcIiwgZmVlZFJvb3QuY2hpbGRyZW4sIGZhbHNlKVswXS5jaGlsZHJlblswXS5kYXRhO1xuXHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZmVlZC51cGRhdGVkID0gbmV3IERhdGUoRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ1cGRhdGVkXCIsIGZlZWRSb290LmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YSk7XG5cdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRmZWVkLmF1dGhvciA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZW1haWxcIiwgZmVlZFJvb3QuY2hpbGRyZW4sIHRydWUpWzBdLmNoaWxkcmVuWzBdLmRhdGE7XG5cdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0ZmVlZC5pdGVtcyA9IFtdO1xuXHRcdFx0XHREb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImVudHJ5XCIsIGZlZWRSb290LmNoaWxkcmVuKS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCwgbGlzdCkge1xuXHRcdFx0XHRcdHZhciBlbnRyeSA9IHt9O1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRlbnRyeS5pZCA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaWRcIiwgaXRlbS5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGE7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRlbnRyeS50aXRsZSA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGl0bGVcIiwgaXRlbS5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGE7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRlbnRyeS5saW5rID0gRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJsaW5rXCIsIGl0ZW0uY2hpbGRyZW4sIGZhbHNlKVswXS5hdHRyaWJzLmhyZWY7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZXgpIHsgfVxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRlbnRyeS5kZXNjcmlwdGlvbiA9IERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3VtbWFyeVwiLCBpdGVtLmNoaWxkcmVuLCBmYWxzZSlbMF0uY2hpbGRyZW5bMF0uZGF0YTtcblx0XHRcdFx0XHR9IGNhdGNoIChleCkgeyB9XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGVudHJ5LnB1YkRhdGUgPSBuZXcgRGF0ZShEb21VdGlscy5nZXRFbGVtZW50c0J5VGFnTmFtZShcInVwZGF0ZWRcIiwgaXRlbS5jaGlsZHJlbiwgZmFsc2UpWzBdLmNoaWxkcmVuWzBdLmRhdGEpO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGV4KSB7IH1cblx0XHRcdFx0XHRmZWVkLml0ZW1zLnB1c2goZW50cnkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kb20gPSBmZWVkO1xuXHRcdH1cblx0XHRSc3NIYW5kbGVyLnN1cGVyXy5wcm90b3R5cGUuZG9uZS5jYWxsKHRoaXMpO1xuXHR9XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5mdW5jdGlvbiBEZWZhdWx0SGFuZGxlciAoY2FsbGJhY2ssIG9wdGlvbnMpIHtcblx0dGhpcy5yZXNldCgpO1xuXHR0aGlzLl9vcHRpb25zID0gb3B0aW9ucyA/IG9wdGlvbnMgOiB7IH07XG5cdGlmICh0aGlzLl9vcHRpb25zLmlnbm9yZVdoaXRlc3BhY2UgPT0gdW5kZWZpbmVkKVxuXHRcdHRoaXMuX29wdGlvbnMuaWdub3JlV2hpdGVzcGFjZSA9IGZhbHNlOyAvL0tlZXAgd2hpdGVzcGFjZS1vbmx5IHRleHQgbm9kZXNcblx0aWYgKHRoaXMuX29wdGlvbnMudmVyYm9zZSA9PSB1bmRlZmluZWQpXG5cdFx0dGhpcy5fb3B0aW9ucy52ZXJib3NlID0gdHJ1ZTsgLy9LZWVwIGRhdGEgcHJvcGVydHkgZm9yIHRhZ3MgYW5kIHJhdyBwcm9wZXJ0eSBmb3IgYWxsXG5cdGlmICh0aGlzLl9vcHRpb25zLmVuZm9yY2VFbXB0eVRhZ3MgPT0gdW5kZWZpbmVkKVxuXHRcdHRoaXMuX29wdGlvbnMuZW5mb3JjZUVtcHR5VGFncyA9IHRydWU7IC8vRG9uJ3QgYWxsb3cgY2hpbGRyZW4gZm9yIEhUTUwgdGFncyBkZWZpbmVkIGFzIGVtcHR5IGluIHNwZWNcblx0aWYgKCh0eXBlb2YgY2FsbGJhY2spID09IFwiZnVuY3Rpb25cIilcblx0XHR0aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xufVxuXG5cdC8vKipcIlN0YXRpY1wiKiovL1xuXHQvL0hUTUwgVGFncyB0aGF0IHNob3VsZG4ndCBjb250YWluIGNoaWxkIG5vZGVzXG5cdERlZmF1bHRIYW5kbGVyLl9lbXB0eVRhZ3MgPSB7XG5cdFx0ICBhcmVhOiAxXG5cdFx0LCBiYXNlOiAxXG5cdFx0LCBiYXNlZm9udDogMVxuXHRcdCwgYnI6IDFcblx0XHQsIGNvbDogMVxuXHRcdCwgZnJhbWU6IDFcblx0XHQsIGhyOiAxXG5cdFx0LCBpbWc6IDFcblx0XHQsIGlucHV0OiAxXG5cdFx0LCBpc2luZGV4OiAxXG5cdFx0LCBsaW5rOiAxXG5cdFx0LCBtZXRhOiAxXG5cdFx0LCBwYXJhbTogMVxuXHRcdCwgZW1iZWQ6IDFcblx0fVxuXHQvL1JlZ2V4IHRvIGRldGVjdCB3aGl0ZXNwYWNlIG9ubHkgdGV4dCBub2Rlc1xuXHREZWZhdWx0SGFuZGxlci5yZVdoaXRlc3BhY2UgPSAvXlxccyokLztcblxuXHQvLyoqUHVibGljKiovL1xuXHQvL1Byb3BlcnRpZXMvL1xuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUuZG9tID0gbnVsbDsgLy9UaGUgaGllcmFyY2hpY2FsIG9iamVjdCBjb250YWluaW5nIHRoZSBwYXJzZWQgSFRNTFxuXHQvL01ldGhvZHMvL1xuXHQvL1Jlc2V0cyB0aGUgaGFuZGxlciBiYWNrIHRvIHN0YXJ0aW5nIHN0YXRlXG5cdERlZmF1bHRIYW5kbGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIERlZmF1bHRIYW5kbGVyJHJlc2V0KCkge1xuXHRcdHRoaXMuZG9tID0gW107XG5cdFx0dGhpcy5fZG9uZSA9IGZhbHNlO1xuXHRcdHRoaXMuX3RhZ1N0YWNrID0gW107XG5cdFx0dGhpcy5fdGFnU3RhY2subGFzdCA9IGZ1bmN0aW9uIERlZmF1bHRIYW5kbGVyJF90YWdTdGFjayRsYXN0ICgpIHtcblx0XHRcdHJldHVybih0aGlzLmxlbmd0aCA/IHRoaXNbdGhpcy5sZW5ndGggLSAxXSA6IG51bGwpO1xuXHRcdH1cblx0fVxuXHQvL1NpZ25hbHMgdGhlIGhhbmRsZXIgdGhhdCBwYXJzaW5nIGlzIGRvbmVcblx0RGVmYXVsdEhhbmRsZXIucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbiBEZWZhdWx0SGFuZGxlciRkb25lICgpIHtcblx0XHR0aGlzLl9kb25lID0gdHJ1ZTtcblx0XHR0aGlzLmhhbmRsZUNhbGxiYWNrKG51bGwpO1xuXHR9XG5cdERlZmF1bHRIYW5kbGVyLnByb3RvdHlwZS53cml0ZVRhZyA9IGZ1bmN0aW9uIERlZmF1bHRIYW5kbGVyJHdyaXRlVGFnIChlbGVtZW50KSB7XG5cdFx0dGhpcy5oYW5kbGVFbGVtZW50KGVsZW1lbnQpO1xuXHR9IFxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUud3JpdGVUZXh0ID0gZnVuY3Rpb24gRGVmYXVsdEhhbmRsZXIkd3JpdGVUZXh0IChlbGVtZW50KSB7XG5cdFx0aWYgKHRoaXMuX29wdGlvbnMuaWdub3JlV2hpdGVzcGFjZSlcblx0XHRcdGlmIChEZWZhdWx0SGFuZGxlci5yZVdoaXRlc3BhY2UudGVzdChlbGVtZW50LmRhdGEpKVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0dGhpcy5oYW5kbGVFbGVtZW50KGVsZW1lbnQpO1xuXHR9IFxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUud3JpdGVDb21tZW50ID0gZnVuY3Rpb24gRGVmYXVsdEhhbmRsZXIkd3JpdGVDb21tZW50IChlbGVtZW50KSB7XG5cdFx0dGhpcy5oYW5kbGVFbGVtZW50KGVsZW1lbnQpO1xuXHR9IFxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUud3JpdGVEaXJlY3RpdmUgPSBmdW5jdGlvbiBEZWZhdWx0SGFuZGxlciR3cml0ZURpcmVjdGl2ZSAoZWxlbWVudCkge1xuXHRcdHRoaXMuaGFuZGxlRWxlbWVudChlbGVtZW50KTtcblx0fVxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiBEZWZhdWx0SGFuZGxlciRlcnJvciAoZXJyb3IpIHtcblx0XHR0aGlzLmhhbmRsZUNhbGxiYWNrKGVycm9yKTtcblx0fVxuXG5cdC8vKipQcml2YXRlKiovL1xuXHQvL1Byb3BlcnRpZXMvL1xuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUuX29wdGlvbnMgPSBudWxsOyAvL0hhbmRsZXIgb3B0aW9ucyBmb3IgaG93IHRvIGJlaGF2ZVxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUuX2NhbGxiYWNrID0gbnVsbDsgLy9DYWxsYmFjayB0byByZXNwb25kIHRvIHdoZW4gcGFyc2luZyBkb25lXG5cdERlZmF1bHRIYW5kbGVyLnByb3RvdHlwZS5fZG9uZSA9IGZhbHNlOyAvL0ZsYWcgaW5kaWNhdGluZyB3aGV0aGVyIGhhbmRsZXIgaGFzIGJlZW4gbm90aWZpZWQgb2YgcGFyc2luZyBjb21wbGV0ZWRcblx0RGVmYXVsdEhhbmRsZXIucHJvdG90eXBlLl90YWdTdGFjayA9IG51bGw7IC8vTGlzdCBvZiBwYXJlbnRzIHRvIHRoZSBjdXJyZW50bHkgZWxlbWVudCBiZWluZyBwcm9jZXNzZWRcblx0Ly9NZXRob2RzLy9cblx0RGVmYXVsdEhhbmRsZXIucHJvdG90eXBlLmhhbmRsZUNhbGxiYWNrID0gZnVuY3Rpb24gRGVmYXVsdEhhbmRsZXIkaGFuZGxlQ2FsbGJhY2sgKGVycm9yKSB7XG5cdFx0XHRpZiAoKHR5cGVvZiB0aGlzLl9jYWxsYmFjaykgIT0gXCJmdW5jdGlvblwiKVxuXHRcdFx0XHRpZiAoZXJyb3IpXG5cdFx0XHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHR0aGlzLl9jYWxsYmFjayhlcnJvciwgdGhpcy5kb20pO1xuXHR9XG5cdFxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUuaXNFbXB0eVRhZyA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHR2YXIgbmFtZSA9IGVsZW1lbnQubmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdGlmIChuYW1lLmNoYXJBdCgwKSA9PSAnLycpIHtcblx0XHRcdG5hbWUgPSBuYW1lLnN1YnN0cmluZygxKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX29wdGlvbnMuZW5mb3JjZUVtcHR5VGFncyAmJiAhIURlZmF1bHRIYW5kbGVyLl9lbXB0eVRhZ3NbbmFtZV07XG5cdH07XG5cdFxuXHREZWZhdWx0SGFuZGxlci5wcm90b3R5cGUuaGFuZGxlRWxlbWVudCA9IGZ1bmN0aW9uIERlZmF1bHRIYW5kbGVyJGhhbmRsZUVsZW1lbnQgKGVsZW1lbnQpIHtcblx0XHRpZiAodGhpcy5fZG9uZSlcblx0XHRcdHRoaXMuaGFuZGxlQ2FsbGJhY2sobmV3IEVycm9yKFwiV3JpdGluZyB0byB0aGUgaGFuZGxlciBhZnRlciBkb25lKCkgY2FsbGVkIGlzIG5vdCBhbGxvd2VkIHdpdGhvdXQgYSByZXNldCgpXCIpKTtcblx0XHRpZiAoIXRoaXMuX29wdGlvbnMudmVyYm9zZSkge1xuLy9cdFx0XHRlbGVtZW50LnJhdyA9IG51bGw7IC8vRklYTUU6IE5vdCBjbGVhblxuXHRcdFx0Ly9GSVhNRTogU2VyaW91cyBwZXJmb3JtYW5jZSBwcm9ibGVtIHVzaW5nIGRlbGV0ZVxuXHRcdFx0ZGVsZXRlIGVsZW1lbnQucmF3O1xuXHRcdFx0aWYgKGVsZW1lbnQudHlwZSA9PSBcInRhZ1wiIHx8IGVsZW1lbnQudHlwZSA9PSBcInNjcmlwdFwiIHx8IGVsZW1lbnQudHlwZSA9PSBcInN0eWxlXCIpXG5cdFx0XHRcdGRlbGV0ZSBlbGVtZW50LmRhdGE7XG5cdFx0fVxuXHRcdGlmICghdGhpcy5fdGFnU3RhY2subGFzdCgpKSB7IC8vVGhlcmUgYXJlIG5vIHBhcmVudCBlbGVtZW50c1xuXHRcdFx0Ly9JZiB0aGUgZWxlbWVudCBjYW4gYmUgYSBjb250YWluZXIsIGFkZCBpdCB0byB0aGUgdGFnIHN0YWNrIGFuZCB0aGUgdG9wIGxldmVsIGxpc3Rcblx0XHRcdGlmIChlbGVtZW50LnR5cGUgIT0gRWxlbWVudFR5cGUuVGV4dCAmJiBlbGVtZW50LnR5cGUgIT0gRWxlbWVudFR5cGUuQ29tbWVudCAmJiBlbGVtZW50LnR5cGUgIT0gRWxlbWVudFR5cGUuRGlyZWN0aXZlKSB7XG5cdFx0XHRcdGlmIChlbGVtZW50Lm5hbWUuY2hhckF0KDApICE9IFwiL1wiKSB7IC8vSWdub3JlIGNsb3NpbmcgdGFncyB0aGF0IG9idmlvdXNseSBkb24ndCBoYXZlIGFuIG9wZW5pbmcgdGFnXG5cdFx0XHRcdFx0dGhpcy5kb20ucHVzaChlbGVtZW50KTtcblx0XHRcdFx0XHRpZiAoIXRoaXMuaXNFbXB0eVRhZyhlbGVtZW50KSkgeyAvL0Rvbid0IGFkZCB0YWdzIHRvIHRoZSB0YWcgc3RhY2sgdGhhdCBjYW4ndCBoYXZlIGNoaWxkcmVuXG5cdFx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5wdXNoKGVsZW1lbnQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSAvL090aGVyd2lzZSBqdXN0IGFkZCB0byB0aGUgdG9wIGxldmVsIGxpc3Rcblx0XHRcdFx0dGhpcy5kb20ucHVzaChlbGVtZW50KTtcblx0XHR9XG5cdFx0ZWxzZSB7IC8vVGhlcmUgYXJlIHBhcmVudCBlbGVtZW50c1xuXHRcdFx0Ly9JZiB0aGUgZWxlbWVudCBjYW4gYmUgYSBjb250YWluZXIsIGFkZCBpdCBhcyBhIGNoaWxkIG9mIHRoZSBlbGVtZW50XG5cdFx0XHQvL29uIHRvcCBvZiB0aGUgdGFnIHN0YWNrIGFuZCB0aGVuIGFkZCBpdCB0byB0aGUgdGFnIHN0YWNrXG5cdFx0XHRpZiAoZWxlbWVudC50eXBlICE9IEVsZW1lbnRUeXBlLlRleHQgJiYgZWxlbWVudC50eXBlICE9IEVsZW1lbnRUeXBlLkNvbW1lbnQgJiYgZWxlbWVudC50eXBlICE9IEVsZW1lbnRUeXBlLkRpcmVjdGl2ZSkge1xuXHRcdFx0XHRpZiAoZWxlbWVudC5uYW1lLmNoYXJBdCgwKSA9PSBcIi9cIikge1xuXHRcdFx0XHRcdC8vVGhpcyBpcyBhIGNsb3NpbmcgdGFnLCBzY2FuIHRoZSB0YWdTdGFjayB0byBmaW5kIHRoZSBtYXRjaGluZyBvcGVuaW5nIHRhZ1xuXHRcdFx0XHRcdC8vYW5kIHBvcCB0aGUgc3RhY2sgdXAgdG8gdGhlIG9wZW5pbmcgdGFnJ3MgcGFyZW50XG5cdFx0XHRcdFx0dmFyIGJhc2VOYW1lID0gZWxlbWVudC5uYW1lLnN1YnN0cmluZygxKTtcblx0XHRcdFx0XHRpZiAoIXRoaXMuaXNFbXB0eVRhZyhlbGVtZW50KSkge1xuXHRcdFx0XHRcdFx0dmFyIHBvcyA9IHRoaXMuX3RhZ1N0YWNrLmxlbmd0aCAtIDE7XG5cdFx0XHRcdFx0XHR3aGlsZSAocG9zID4gLTEgJiYgdGhpcy5fdGFnU3RhY2tbcG9zLS1dLm5hbWUgIT0gYmFzZU5hbWUpIHsgfVxuXHRcdFx0XHRcdFx0aWYgKHBvcyA+IC0xIHx8IHRoaXMuX3RhZ1N0YWNrWzBdLm5hbWUgPT0gYmFzZU5hbWUpXG5cdFx0XHRcdFx0XHRcdHdoaWxlIChwb3MgPCB0aGlzLl90YWdTdGFjay5sZW5ndGggLSAxKVxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3RhZ1N0YWNrLnBvcCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHsgLy9UaGlzIGlzIG5vdCBhIGNsb3NpbmcgdGFnXG5cdFx0XHRcdFx0aWYgKCF0aGlzLl90YWdTdGFjay5sYXN0KCkuY2hpbGRyZW4pXG5cdFx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5sYXN0KCkuY2hpbGRyZW4gPSBbXTtcblx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5sYXN0KCkuY2hpbGRyZW4ucHVzaChlbGVtZW50KTtcblx0XHRcdFx0XHRpZiAoIXRoaXMuaXNFbXB0eVRhZyhlbGVtZW50KSkgLy9Eb24ndCBhZGQgdGFncyB0byB0aGUgdGFnIHN0YWNrIHRoYXQgY2FuJ3QgaGF2ZSBjaGlsZHJlblxuXHRcdFx0XHRcdFx0dGhpcy5fdGFnU3RhY2sucHVzaChlbGVtZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7IC8vVGhpcyBpcyBub3QgYSBjb250YWluZXIgZWxlbWVudFxuXHRcdFx0XHRpZiAoIXRoaXMuX3RhZ1N0YWNrLmxhc3QoKS5jaGlsZHJlbilcblx0XHRcdFx0XHR0aGlzLl90YWdTdGFjay5sYXN0KCkuY2hpbGRyZW4gPSBbXTtcblx0XHRcdFx0dGhpcy5fdGFnU3RhY2subGFzdCgpLmNoaWxkcmVuLnB1c2goZWxlbWVudCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0dmFyIERvbVV0aWxzID0ge1xuXHRcdCAgdGVzdEVsZW1lbnQ6IGZ1bmN0aW9uIERvbVV0aWxzJHRlc3RFbGVtZW50IChvcHRpb25zLCBlbGVtZW50KSB7XG5cdFx0XHRpZiAoIWVsZW1lbnQpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcblx0XHRcdGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7XG5cdFx0XHRcdGlmIChrZXkgPT0gXCJ0YWdfbmFtZVwiKSB7XG5cdFx0XHRcdFx0aWYgKGVsZW1lbnQudHlwZSAhPSBcInRhZ1wiICYmIGVsZW1lbnQudHlwZSAhPSBcInNjcmlwdFwiICYmIGVsZW1lbnQudHlwZSAhPSBcInN0eWxlXCIpIHtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zW1widGFnX25hbWVcIl0oZWxlbWVudC5uYW1lKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChrZXkgPT0gXCJ0YWdfdHlwZVwiKSB7XG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zW1widGFnX3R5cGVcIl0oZWxlbWVudC50eXBlKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChrZXkgPT0gXCJ0YWdfY29udGFpbnNcIikge1xuXHRcdFx0XHRcdGlmIChlbGVtZW50LnR5cGUgIT0gXCJ0ZXh0XCIgJiYgZWxlbWVudC50eXBlICE9IFwiY29tbWVudFwiICYmIGVsZW1lbnQudHlwZSAhPSBcImRpcmVjdGl2ZVwiKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghb3B0aW9uc1tcInRhZ19jb250YWluc1wiXShlbGVtZW50LmRhdGEpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICghZWxlbWVudC5hdHRyaWJzIHx8ICFvcHRpb25zW2tleV0oZWxlbWVudC5hdHRyaWJzW2tleV0pKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFxuXHRcdCwgZ2V0RWxlbWVudHM6IGZ1bmN0aW9uIERvbVV0aWxzJGdldEVsZW1lbnRzIChvcHRpb25zLCBjdXJyZW50RWxlbWVudCwgcmVjdXJzZSwgbGltaXQpIHtcblx0XHRcdHJlY3Vyc2UgPSAocmVjdXJzZSA9PT0gdW5kZWZpbmVkIHx8IHJlY3Vyc2UgPT09IG51bGwpIHx8ICEhcmVjdXJzZTtcblx0XHRcdGxpbWl0ID0gaXNOYU4ocGFyc2VJbnQobGltaXQpKSA/IC0xIDogcGFyc2VJbnQobGltaXQpO1xuXG5cdFx0XHRpZiAoIWN1cnJlbnRFbGVtZW50KSB7XG5cdFx0XHRcdHJldHVybihbXSk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0dmFyIGZvdW5kID0gW107XG5cdFx0XHR2YXIgZWxlbWVudExpc3Q7XG5cblx0XHRcdGZ1bmN0aW9uIGdldFRlc3QgKGNoZWNrVmFsKSB7XG5cdFx0XHRcdHJldHVybihmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuKHZhbHVlID09IGNoZWNrVmFsKTsgfSk7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykge1xuXHRcdFx0XHRpZiAoKHR5cGVvZiBvcHRpb25zW2tleV0pICE9IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdG9wdGlvbnNba2V5XSA9IGdldFRlc3Qob3B0aW9uc1trZXldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcblx0XHRcdGlmIChEb21VdGlscy50ZXN0RWxlbWVudChvcHRpb25zLCBjdXJyZW50RWxlbWVudCkpIHtcblx0XHRcdFx0Zm91bmQucHVzaChjdXJyZW50RWxlbWVudCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChsaW1pdCA+PSAwICYmIGZvdW5kLmxlbmd0aCA+PSBsaW1pdCkge1xuXHRcdFx0XHRyZXR1cm4oZm91bmQpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAocmVjdXJzZSAmJiBjdXJyZW50RWxlbWVudC5jaGlsZHJlbikge1xuXHRcdFx0XHRlbGVtZW50TGlzdCA9IGN1cnJlbnRFbGVtZW50LmNoaWxkcmVuO1xuXHRcdFx0fSBlbHNlIGlmIChjdXJyZW50RWxlbWVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRcdGVsZW1lbnRMaXN0ID0gY3VycmVudEVsZW1lbnQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4oZm91bmQpO1xuXHRcdFx0fVxuXHRcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudExpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Zm91bmQgPSBmb3VuZC5jb25jYXQoRG9tVXRpbHMuZ2V0RWxlbWVudHMob3B0aW9ucywgZWxlbWVudExpc3RbaV0sIHJlY3Vyc2UsIGxpbWl0KSk7XG5cdFx0XHRcdGlmIChsaW1pdCA+PSAwICYmIGZvdW5kLmxlbmd0aCA+PSBsaW1pdCkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFxuXHRcdFx0cmV0dXJuKGZvdW5kKTtcblx0XHR9XG5cdFx0XG5cdFx0LCBnZXRFbGVtZW50QnlJZDogZnVuY3Rpb24gRG9tVXRpbHMkZ2V0RWxlbWVudEJ5SWQgKGlkLCBjdXJyZW50RWxlbWVudCwgcmVjdXJzZSkge1xuXHRcdFx0dmFyIHJlc3VsdCA9IERvbVV0aWxzLmdldEVsZW1lbnRzKHsgaWQ6IGlkIH0sIGN1cnJlbnRFbGVtZW50LCByZWN1cnNlLCAxKTtcblx0XHRcdHJldHVybihyZXN1bHQubGVuZ3RoID8gcmVzdWx0WzBdIDogbnVsbCk7XG5cdFx0fVxuXHRcdFxuXHRcdCwgZ2V0RWxlbWVudHNCeVRhZ05hbWU6IGZ1bmN0aW9uIERvbVV0aWxzJGdldEVsZW1lbnRzQnlUYWdOYW1lIChuYW1lLCBjdXJyZW50RWxlbWVudCwgcmVjdXJzZSwgbGltaXQpIHtcblx0XHRcdHJldHVybihEb21VdGlscy5nZXRFbGVtZW50cyh7IHRhZ19uYW1lOiBuYW1lIH0sIGN1cnJlbnRFbGVtZW50LCByZWN1cnNlLCBsaW1pdCkpO1xuXHRcdH1cblx0XHRcblx0XHQsIGdldEVsZW1lbnRzQnlUYWdUeXBlOiBmdW5jdGlvbiBEb21VdGlscyRnZXRFbGVtZW50c0J5VGFnVHlwZSAodHlwZSwgY3VycmVudEVsZW1lbnQsIHJlY3Vyc2UsIGxpbWl0KSB7XG5cdFx0XHRyZXR1cm4oRG9tVXRpbHMuZ2V0RWxlbWVudHMoeyB0YWdfdHlwZTogdHlwZSB9LCBjdXJyZW50RWxlbWVudCwgcmVjdXJzZSwgbGltaXQpKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBpbmhlcml0cyAoY3Rvciwgc3VwZXJDdG9yKSB7XG5cdFx0dmFyIHRlbXBDdG9yID0gZnVuY3Rpb24oKXt9O1xuXHRcdHRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGU7XG5cdFx0Y3Rvci5zdXBlcl8gPSBzdXBlckN0b3I7XG5cdFx0Y3Rvci5wcm90b3R5cGUgPSBuZXcgdGVtcEN0b3IoKTtcblx0XHRjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3I7XG5cdH1cblxuZXhwb3J0cy5QYXJzZXIgPSBQYXJzZXI7XG5cbmV4cG9ydHMuRGVmYXVsdEhhbmRsZXIgPSBEZWZhdWx0SGFuZGxlcjtcblxuZXhwb3J0cy5Sc3NIYW5kbGVyID0gUnNzSGFuZGxlcjtcblxuZXhwb3J0cy5FbGVtZW50VHlwZSA9IEVsZW1lbnRUeXBlO1xuXG5leHBvcnRzLkRvbVV0aWxzID0gRG9tVXRpbHM7XG5cbn0pKCk7XG5cbn0pKFwiLy4uL25vZGVfbW9kdWxlcy9odG1scGFyc2VyL2xpYi9odG1scGFyc2VyLmpzXCIsXCIvLi4vbm9kZV9tb2R1bGVzL2h0bWxwYXJzZXIvbGliXCIpIl19
;