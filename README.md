# WebGlify [![Build Status](https://secure.travis-ci.org/DnMllr/webglify.png?branch=master)](http://travis-ci.org/DnMllr/webglify)

A simple markup language that creates documents in WebGl.

## Getting Started
Install by cloning down the repo and running

  npm install

in your console. After the installation is complete run grunt to create the build by typing

  grunt

WebGLify.js and WebGLify.min.js will be created in the directory dist/lib along with three.js and three.min.js which are dependencies.

To begin a project with WebGLify create an HTML document and include three.js as a script tag and then include a script block containing your WebGLify code like so:

```html
<script src="./path/to/WebGLify.min.js">
  Your WebGLify code will go here.
</script>
```

This assumes that there are no pre-existing HTML elements and will replace the body of the document with a WebGLify instance. If you would rather populate a div on an already existing webpage you can type this:

```html
<div id="target"></div>

<script src="WebGLify.js" target="#target">
  WebGLify code will go here.
</script>
```

The WebGLify instance will conform to the size of the container targetted.

```javascript
var webglify = require('webglify');
webglify.awesome(); // "awesome"
```

```coffee-script
webglify = require 'webglify'
webglify.awesome() // "awesome"
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Daniel Miller. Licensed under the MIT license.
