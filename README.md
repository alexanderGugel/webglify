# WebGlify [![Build Status](https://secure.travis-ci.org/DnMllr/webglify.png?branch=master)](http://travis-ci.org/DnMllr/webglify)

A simple markup language that creates documents in WebGl.

## Getting Started
Install by cloning down the repo and running

    npm install

in your console. After the installation is complete run grunt to create the build by typing

    grunt

WebGLify.js and WebGLify.min.js will be created in the directory "dist/lib" along with three.js and three.min.js which are dependencies.

To begin a project with WebGLify create an HTML document and include three.js as a script tag and then include a script block containing your WebGLify code like so:

```html
<script src="./path/to/WebGLify.min.js">
  Your WebGLify code will go here.
</script>
```

This assumes that there are no pre-existing HTML elements and will replace the body of the document with a WebGLify instance. If you would rather populate a div on an already existing webpage you can type this:

```html
<div id="target"></div>

<script src="./path/to/WebGLify.min.js" target="#target">
  WebGLify code will go here.
</script>
```

The WebGLify instance will conform to the size of the container targetted. Finally, this will also work:

```html
<script type="text/webglify">
  Your WebGLify code will go here.
</script>
```

as long as WebGLify is imported somewhere else in the HTML document.


## Documentation

### Intro
#### Tree Structure and childType.
Here is a simple example of WebGlify code:

```
WebGLify--
  block: childType: text
    Hello
```

This code will render the word "Hello" in the center of the container it is targetted to (assumed to be document.body if no target is specified). WebGlify code is interpreted as a tree where all child nodes by default divide their parent's space. The root of the tree, therefore, occupies the entire container. 

WebGLify code must begin with the tag "WebGlify--", which is used as a root for the element tree. The root can take options, but it is recommended that you do not apply options to the root unless you've read the source code and know how the dresser function (stored in src/compiler/dresser.coffee) will interpret them. 

Whitespace is significant in WebGlify, so children of the parent must be consistently indented from the parent. No element other than "Styles--" may be at the same indentation level as the root. In this simple example the sole child of the root is the element "block." The block has the option "childType" specified as "text." This tells the parser that the block's child is a text element.

"childType" has four possible values: text, image, horizontal, or vertical. As we've seen, text specifies that the blocks's child is a text element, image specifies that the elements child is an image URL, horizontal and vertical tell the parser that the block's children are blocks and specify which way their flow should be specified.

#### Default Flow
As stated earlier, all children evenly subdivide the space of their parent by default. For example

```
WebGLify--
  block: childType: horizontal
    block: backgroundColor: red
    block: backgroundColor: blue
```

Will be interpreted in this way: 

1. First "WebGLify--" will become the root and will be the entire size of it's target container.
2. Because "WebGLify--" only has one child, that child will be given the entirety of "WebGLify--"'s space. So the next block will also be the entire size of the container.
3. "childType: horizontal" specifies that my children will also be blocks, and will divide my space horizontally.
4. The two children blocks will form equally sized colored rectangles that are each half the size of their parent container. The red block will be on the left and the blue block will be on the right. If "vertical" was specified rather than "horizontal," red would be on the top and blue would be on the bottom.

Suppose you didn't want elements to divide their parents space evenly. Perhaps you wanted them to divide their parents space so that the red block would have 30% of the space and the blue block would have 70% of the space. You could alter their width parameters like so:

```
WebGLify--
  block: childType: horizontal
    block: backgroundColor: red, width: 30
    block: backgroundColor: blue, width: 70
```

 **But this is doesn't get us all the way there yet!** The options given to a WebGLify element only affect their parameter and all other parameters are assumed to be part of the default flow. So merely changing the width of the red and blue blocks will change their width, and their width alone, so they will no longer be in contact with each other. You also need to offset the block's x position to make up for the change in width. This would be the correct way to achieve:

```
WebGLify--
  block: childType: horizontal
    block: backgroundColor: red, width: 30, x: -70
    block: backgroundColor: blue, width: 70, x: 30
```

Once a parameter has been altered it forgets its position in the default flow and instead refer's to its parent's values. For example: these x values are offset from the element's parent's x value, not from what the x value would have been if the element had remained unaltered. This allows you to manage your floated parameters as a group in relationship to each other, without having to try to imagine what the parameter would have been by default.

#### Text and Images

```
WebGLify--
  block: childType: horizontal
    block: childType: text
      Hello there. Please look to my right for a picture!
    block: childType: image
      /url/that/leads/to/image.jpg
```

Images and text currently have a number of limitations, but both are fully featured aside from those limitations! Text automatically spawns in the center of its parent container and might be difficult to move reliably due to some wonky behavior of the renderer. It presently character wraps, as opposed to word wrap, and will simply stop rendering if it takes up more vertical space than its parent container. Also, there is only one font and one size that is currently available. More options for text are currently in the works though.

Images can take either a local URL to the file or a http:// call as long as your environment has the CORS permission to download the image and render it as a texture. It might be worth it to serve your document from a server even for local use due to this. This is a known issue in three.js as WebGL opened up a potential attack vector through shaders and so browsers are very suspicious of external resources being used as a texture. It isn't my fault (I swear).

These issues will be taken care of in future builds very soon. 


#### Styles

```
WebGLify--
  block: childType: horizontal
    block: a: style
    block: b: style

Styles--
  a
    backgroundColor: blue
    width: 70
    x: 30
  b
    backgroundColor: red
    width: 30
    x: -70
```

Hey look, you can do this too. You can define CSS-like selectors for your WebGLify code.

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Daniel Miller. Licensed under the MIT license.
