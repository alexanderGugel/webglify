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

## Documentation
Here is a simple example of WebGlify code:

```
WebGLify--
  block: childType: text
    Hello
```

This code will render the word "Hello" in the center of the container it is targetted to (assumed to be document.body if no target is specified). WebGLify code must begin with the tag 'WebGlify--', which is used as a root for the syntax tree. The root can take options, but it is recommended that you do not apply options to the root unless you've read the source code and know how the dresser function (stored in src/compiler/dresser.coffee) will interpret them. 

Whitespace is significant in WebGlify, so children of the parent must be consistently indented from the parent. No element other than "Styles--" In this simple example the sole child of the root is the element "block." The block itself has the option 'childType' specified as 'text.'

This option is essential as the child 'Hello' needs to be interpreted as plain text.

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Daniel Miller. Licensed under the MIT license.
