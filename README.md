# mr-rating.js

It is a lightweight JavaScript library that transforms a `<select>` HTML Element into a dynamic rating indicator.

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Methods](#methods)
- [Build](#build)
- [Style customization](#style-customization)
- [Compatibility](#compatibility)
- [Copyright and license](#copyright-and-license)
- [Changelog](#changelog)

## Features

- It is written in pure JavaScript and CSS, and does not require any external libraries.
- Wide customization options (ability to set icons of any shape, size, color, etc.).
- Touch, mouse and keyboard accessibility.
- Screen reader friendly.
- Reset to the initial state on form reset.

## Installation

Install with npm:

```js
npm i mr-rating.js
```

Import it into your file:

```js
import Rating from 'mr-rating.js';
```

You can also download the [latest release on GitHub](https://github.com/marmot-webdev/mr-rating.js/releases/latest).

## Usage

```html
<link rel="stylesheet" href="css/mr-rating.min.css">

<select class="js-rating">
  <option value="">Select a rating</option>
  <option value="1">Bad</option>
  <option value="2">Poor</option>
  <option value="3">Fair</option>
  <option value="4">Good</option>
  <option value="5">Excellent</option>
</select>

<script src="js/mr-rating.min.js"></script>
```

Now, you need to create an instance by passing a string selector (`a`), HTML element (`b`), or list of HTML elements (`c`):

```html
<script>
  // a
  const rating = new Rating('.js-rating');

  // b
  const elem = document.querySelector('.js-rating');
  const rating = new Rating(elem);

  // c
  const elems = document.querySelectorAll('.js-rating');
  const rating = new Rating(elems);
</script>
```

## Options

Here are the default options:

```js
{
  classList: {
    containerClass: 'mr-rating',
    itemClass: '',
    activeClass: 'active',
    selectedClass: 'selected',
  },
  icon: '',
  items: null,
  label: 'Rating',
  orientation: 'horizontal',
  tooltip: false,
  onInit: null,
  onDestroy: null,
  onReset: null,
  onSelect: null,
}
```

### classList.containerClass

Type: `String`\
Default: `'mr-rating'`

The classname to use for the rating container.

### classList.itemClass

Type: `String`\
Default: `''`

The classname to use for the rating item.

### classList.activeClass

Type: `String`\
Default: `'active'`

The classname to use for the active state of a star.

### classList.selectedClass

Type: `String`\
Default: `'selected'`

The classname to use for the selected state of a star.

### icon

Type: `String`\
Default: `''`

An icon to use as ranking symbol, typically a star. If you need to display unique icons, use the option `items` instead.

```js
const star = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" class="mr-icon mr-icon-star">
    <path d="M923,415,707,611,766,897,512,753,258,897,317,611,101,415,392,382,512,116,632,382Z" stroke="currentColor" stroke-width="64"></path>
  </svg>
`;

const rating = new Rating('.js-rating', {
  icon: star
});
```

### items

Type: `Function`\
Default: `null`

This option can be used to transform rating items, for example, to change their content by adding unique icons.

```js
const emojis = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="icon-frowning-face">...</svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="icon-neutral-face">...</svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="icon-smiling-face">...</svg>'
];

const rating = new Rating('.js-rating', {
  items: (item, i) => {
    item.innerHTML = emojis[i];
  }
});
```

### label

Type: `String`\
Default: `'Rating'`

A value used for the `aria-label` attribute. Can also be set via the `aria-label` / `data-label` attribute on the `<select>` element.

### orientation

Type: `String`\
Default: `'horizontal'`

A value used for the `aria-orientation` attribute. Can also be set via the `data-orientation` attribute on the `<select>` element.

### tooltip:

Type: `Boolean`\
Default: `false`

Whether or not to show the tooltip next to the stars. Can also be set via the `data-tooltip` attribute on the `<select>` element.

### onInit(selectElement):

Type: `Function`\
Default: `null`

This event is fired when a rating is rendered for the first time.

### onDestroy(selectElement):

Type: `Function`\
Default: `null`

This event is fired when a rating is destroyed.

### onSelect(selectElement):

Type: `Function`\
Default: `null`

This event is fired when a rating is selected.

**Note.** You can also listen for the `change` event on the `<select>` element:

```js
const select = document.querySelector('.js-rating');

select.addEventListener('change', (e) => {
  // const select = e.target;
  // const { options, selectedIndex, value } = select;
  // const option = options[selectedIndex];
});
```

### onReset(selectElement):

Type: `Function`\
Default: `null`

This event is fired when a rating is reset to the initial state.

## Methods

| Method                    | Description                                        |
|---------------------------|----------------------------------------------------|
|`instance.destroy()`       | Destroys instance and removes all event listeners. |
|`instance.rebuild()`       | Rebuilds all rating controls.                      |
|`instance.reset()`         | Returns to the initial state.                      |

To set a new value:

```js
const select = document.querySelector('.js-rating');

select.value = '5';
```

To disable/enable interactive rating mode:

```js
const select = document.querySelector('.js-rating');

select.disabled = true; // or `false`
```

To disallow a user to clear a rating by clicking on an already selected star, just add the `disabled` attribute to the option with an empty value:

```html
<select class="js-rating">
  <option value="" disabled>Select a rating</option>
  <option value="1">Bad</option>
  <option value="2">Poor</option>
  <option value="3">Fair</option>
  <option value="4">Good</option>
  <option value="5">Excellent</option>
</select>
```

The *initial rating value* is determined by which select option has the `selected` attribute set:

```html
<select class="js-rating">
  <option value="">Select a rating</option>
  <option value="1">Bad</option>
  <option value="2">Poor</option>
  <option value="3">Fair</option>
  <option value="4" selected>Good</option>
  <option value="5">Excellent</option>
</select>
```

## Build

```sh
# Clone the repo
git clone https://github.com/marmot-webdev/mr-rating.js.git

# Go to the directory
cd mr-rating.js

# Install dependencies
npm i

# Run the build
npm run build
```

The compiled files will be saved in the `dist` folder.

## Style customization

This library uses Sass variables and custom properties for its styling. Here are the default values:

```scss
$rating-prefix: "mr-" !default;
$rating-selector: "mr-rating" !default;
$rating-tooltip: false !default;
$generate-visually-hidden-utility: true !default; // if `false`, you must provide your own class to hide a select box

:root {
  --#{$rating-prefix}icon-gap: .125rem;
  --#{$rating-prefix}icon-color: #fc0;
  --#{$rating-prefix}icon-size: 1.5rem;
  --#{$rating-prefix}icon-transition: fill .2s;

  @if $rating-tooltip {
    --#{$rating-prefix}tooltip-border-radius: .3em;
    --#{$rating-prefix}tooltip-bg: #000;
    --#{$rating-prefix}tooltip-color: #fff;
    --#{$rating-prefix}tooltip-font-size: .875rem;
    --#{$rating-prefix}tooltip-text-transform: uppercase;
  }
}
```

To override Sass variables, just set new values _before_ importing the SCSS file.

```scss
$rating-tooltip: true;

@import 'mr-rating.js/sass';
```

To override CSS variables, enter new values _after_ the import.

```scss
@import 'mr-rating.js/sass';

:root {
  --#{$rating-prefix}icon-gap: .5rem;
}
```

## Compatibility

It works in all modern browsers.

## Copyright and license

Copyright (c) 2023—present, Serhii Babakov.

The library is [licensed](/LICENSE) under [The MIT License](https://opensource.org/licenses/MIT).

## Changelog

`v1.1.0 - [2023-01-25]`

- Initial release