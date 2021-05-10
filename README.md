# webpack-image-placeholder-loader

[![npm](https://img.shields.io/npm/v/webpack-image-placeholder-loader?style=flat)](https://www.npmjs.com/package/webpack-image-placeholder-loader) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](https://opensource.org/licenses/MIT)

This loader generates a color or solid color image or blur from a given image for use as a placeholder.

Under the hood this package uses [fast-average-color](https://github.com/fast-average-color/fast-average-color). See [fast-average-color](https://github.com/fast-average-color/fast-average-color) for [examples](https://github.com/fast-average-color/fast-average-color) of colors derived from images.

Supports JPEG, PNG, WebP, TIFF, GIF and SVG images.

## Examples

[React](https://github.com/Calvin-LL/webpack-image-placeholder-loader/tree/main/examples/react)

[Vue](https://github.com/Calvin-LL/webpack-image-placeholder-loader/tree/main/examples/vue)

[React example with other related loaders](https://github.com/Calvin-LL/react-responsive-images-example)

[Vue example with other related loaders](https://github.com/Calvin-LL/vue-responsive-images-example)

## Install

Install with npm:

```bash
npm install --save-dev webpack-image-placeholder-loader
```

Install with yarn:

```bash
yarn add --dev webpack-image-placeholder-loader
```

## Usage

#### Step 1

###### webpack.config.js

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.(png|jpe?g|svg|gif|webp|tiff?)$/i,
        oneOf: [
          {
            // if the import url looks like "some.png?placeholder..."
            resourceQuery: /placeholder/,
            use: {
              loader: "webpack-image-placeholder-loader",
              options: {
                format: "hex",
              },
            },
          },
          {
            // if no previous resourceQuery match
            use: "file-loader",
          },
        ],
      },
    ],
  },
};
```

#### Step 2

##### Use in code

```javascript
import placeholderUrl from "./some_pic.png?placeholder";
```

To override options for one import, you can use queries

```javascript
import placeholderUrl from "./some_pic.png?placeholder&size=original";
```

### Other usage

With default options:

```javascript
import placeholderUrl from "!!webpack-image-placeholder-loader!./some_pic.png";
```

With specified options:

```javascript
import placeholderUrl from "!!webpack-image-placeholder-loader!./some_pic.png?format=base64&size=1&color=sqrt&backgroundColor=white";
```

## Options

|                   Name                    |                        Type                         |  Default   |                                                                                                                        Description                                                                                                                        |
| :---------------------------------------: | :-------------------------------------------------: | :--------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|          **[`format`](#format)**          | `"base64", "blurred-svg", "hex", "rgb", or "array"` | `"base64"` |                                                                                                                 The format of the output.                                                                                                                 |
|            **[`size`](#size)**            |               `number or "original"`                |    `1`     |                                                                             The size of the output image if `format` is `"base64"`, no effect if the format is anything else.                                                                             |
|     **[`blurQuality`](#blurQuality)**     |                      `number`                       |    `1`     |                                           The quality of blur image if `format` is `"blurred-svg"`, no effect if the format is anything else. Possible values from 0 (not including 0) to 100 (including 100).                                            |
|           **[`color`](#color)**           |                  `string\|object`                   |  `"sqrt"`  | An [algorithm](https://github.com/fast-average-color/fast-average-color/blob/master/docs/algorithms.md) ("simple", "sqrt" or "dominant") to generate a color from a given image, or a color string or color object to use in generating the output image. |
| **[`backgroundColor`](#backgroundcolor)** |                  `string\|object`                   |  `"#FFF"`  |                                                                                             The background color to use if the given image has transparency.                                                                                              |
|        **[`esModule`](#esmodule)**        |                      `boolean`                      |   `true`   |                                                                                          Whether the export is in ES modules syntax or CommonJS modules syntax.                                                                                           |

### `format`

With

```javascript
import placeholderUrl from "./some_pic.png?placeholder";
```

- `format: "base64"`: `placeholderUrl === "data:image/png;base64,iVBORw0KG..."`
- `format: "blurred-svg"`: `placeholderUrl === "data:image/svg+xml;charset=utf-8,%3Csvg xmlns=..."`
- `format: "hex"`: `placeholderUrl === "#6b7548"`
- `format: "rgb"`: `placeholderUrl === "rgb(107, 117, 72)"`
- `format: "array"`: `placeholderUrl === [107, 117, 72]"`

### `size`

`size` will only take effect if `format: "base64"`. When `size` is a number, the output image will be a square of the given number of pixels. When `size: "original"`, the output image will be the size of the original image.

### `color`

`color` can be an [algorithm](https://github.com/fast-average-color/fast-average-color/blob/master/docs/algorithms.md) ("simple", "sqrt" or "dominant") to generate a color from a given image (see examples in [algorithm](https://github.com/fast-average-color/fast-average-color/blob/master/docs/algorithms.md)), or a color string or color object to use in generating the output image.

A color string or color object is any valid colors accepted by [TinyColor](https://github.com/bgrins/TinyColor).

For example:

```javascript
{
  color: "white",
  format: "base64"
}
```

will output a white pixel.

```javascript
{
  color: "white",
  format: "hex"
}
```

will output `#FFFFFF`

### `backgroundColor`

If an image has transparency, `backgroundColor` will be used as the background color. By default `backgroundColor` is white.

### `blurQuality`

When used with `"blurred-svg"`, the image is first shunk by this percentage, stretched, then blurred.

`1` is 1/100 of the original quality. `100` is the original quality (DO NOT recommand using 100). Can be decimal numbers too, `0.1` would be 1/1000 of the original quality. The lower the value, the more blurry the image will be, and the smaller the size.

### `esModule`

Whether the export is in ES modules syntax or CommonJS modules syntax. If you don't know what it is or whether or not you need it, leave is as default.
