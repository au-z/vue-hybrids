# vue-hybrids
> Hybrids web component wrappers for Vue components


[![npm version](https://badge.fury.io/js/vue-hybrids.svg)](https://badge.fury.io/js/vue-hybrids)


**vue-hybrids** is an interop layer for Vue components and built on [hybridsJS](https://hybrids.js.org/).
Using vue-hybrids, you can quickly transition from building Vue single file components into pure web components with minimal interruptions to your toolchain.

# Getting Started

Install npm package:

```bash
npm i --save-dev vue-hybrids
```

Then, import the vue-hybrids `define` function into your SFC:

```html
<script>
import {define} from 'vue-hybrids'

export default define({
  name: 'my-vue-component',
  props: {
    foo: {type: String},
    bar: {type: Number},
  },
  events: {
    'ondelete': true,
    'oncreate': true,
  },
  // ...
})
</script>
```

`define` will wrap your component in a Hybrids JS web component, register it, and proxy all your props and events.

![](https://imgur.com/7GjfBEO.png)

## API

### `define`
Define and register a new web component using an existing Vue component. Define returns the `defn` argument.

```typescript
define(defn: Object, ...shadowStyles?: string[]): Object
```

### debug-vue-hybrid
A boolean prop which is available for every vue-hybrid which renders the proxied props, their type, and their value.

## Design Considerations
- Avoid using the custom `model` property of Vue component definitions. When wrapped as a web component,
the parent Vue component will not know to which event and prop it should bind v-model.
Instead, design your component to use the traditional `value` prop and `input` event if possible.
Or, if this is not possible, you may spell out the prop and event binding manually:

```html
<my-component :value="myBoundValue" @change="(value) => myBoundValue = value" />
```

- When passing props to vue-hybrids components from a vue component, you will need to pass props by _property_ instead of by attribute. To do this, add the `.prop` modifier to your props in vue templates.
  - An issue with the `.prop` shorthand (`.`) is documented [here](https://github.com/vuejs/vue/issues/11375)

```html
<my-component :static-prop="staticValue" :dynamic-prop.prop="dynamicValue" />
```

#### defn
A Vue component definition. Some special considerations around various options:

- `name`: This will be the name of the web component
- `events`: This is not a part of the standard Vue single file component. However, vue-hybrids requires this to proxy any events you'd like to propagate from the shadow to light DOM

#### shadowStyles
An array of style sheet strings for the shadowDOM. vue-hybrids will ensure that these styles do not bleed into the light DOM.

**NOTE:** If you are using the typical vue-loader toolchain to bundle styles in conjunction with vue-hybrids, SFC `<style>` tags will still be mounted in the light DOM and CSS selection into the shadow DOM will be restricted. Please avoid this in order to keep your web components side-effect free.

----

## Vue Dev Tools
vue-hybrids is compatible with vue dev tools. You can still inspect your mounted vue elements. Each defined component will show as wrapped in a `<shadow-root>` tag to signify it's placement in the shadow DOM.

## Development
Contributions welcome!

## Active Issues
`vue-hybrids` is quite young and a number of small issues are present.

- hot reloading is broken for shadowStyles editing
