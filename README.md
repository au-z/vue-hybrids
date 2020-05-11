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
  // ...
})
</script>
```

Finally, import the vue component to register it as a web component and use it in your appplication:

```javascript
import './path/to/my-vue-component.vue'
```

```html
<my-vue-component :foo="fooProp" :bar="barProp" @ondelete="onDelete" @onCreate="onCreate" />
```

`define` will wrap your component in a Hybrids JS web component, register it, and proxy all your props and events.

![](https://imgur.com/7GjfBEO.png)

## API

### `define`
Define and register a new web component using an existing Vue component. Define returns the `defn` argument.

```typescript
define(defn: Object, ...shadowStyles?: string[]): void
```

#### defn
A Vue component definition. Some special considerations around various options:

- `name`: This will be the name of the web component

#### shadowStyles
An array of style sheet strings for the shadowDOM. vue-hybrids will ensure that these styles do not bleed into the light DOM.

If you are using the typical vue-loader toolchain to bundle styles in conjunction with vue-hybrids, SFC `<style>` tags will still be mounted in the light DOM and CSS selection into the shadow DOM will be restricted. Please avoid this in order to keep your web components side-effect free.


### `wrap`
Wrap a vue component as a Hybrids component. The component can be defined later with a different name using the hybrids `define` function.

```typescript
import {wrap} from 'vue-hybrids'
import {define} from 'hybrids'

const hybrid: Hybrids<CustomElement> = wrap(defn: Object, ...shadowStyles?: string[])

// ...

define('my-element-name', hybrid)
```

### debug-vue-hybrid
A boolean prop which is available for every vue-hybrid which renders the proxied props, their type, and their value.


```html
<my-component :prop="foo" debug-vue-hybrid/>
```

----

## Design Considerations

### Binding Prop Data
When passing props to vue-hybrids components from a vue component, you will need to pass props by _property_ instead of by attribute. To do this, add the `.prop` modifier to your props in vue templates.
  - An issue with the `.prop` shorthand (`.`) is documented [here](https://github.com/vuejs/vue/issues/11375)

```html
<my-component :static="staticValue" :dynamic.prop="dynamicValue" />
```

### Vue Functionality
Avoid using the custom `model` property of Vue component definitions. When wrapped as a web component,
the parent Vue component will not know to which event and prop it should bind v-model.
Instead, design your component to use the traditional `value` prop and `input` event if possible.
Or, if this is not possible, you may spell out the prop and event binding manually:

```html
<my-component :value="myBoundValue" @change="(value) => myBoundValue = value" />
```

### IE11
Though IE11 does not support the shadowDOM for style encapsulation, vue-hybrids should work with some polyfill support.
Normally, one would include the following before any of their app code:

```js
import '@webcomponents/webcomponentsjs`
```

However, if you are using @babel/preset-env or core-js with the `useBuiltIns: 'usage'` flag, you may have difficulty with
overlapping polyfills.

Here is a link to a [minimal reproduction](https://github.com/bschlenk/ie11-corejs-stack-overflow-repro)

`vue-hybrids` provides a fix if your build falls into this scenario. Replace your @webcomponents import statement with:

```js
import 'vue-hybrids/dist/polyfill.min.js' //464 KB
```

If your polyfill implementation is more complicated, a manual fix can be employed by assigning a nonsense `Symbol` before your @webcomponents import:

```js
// Forces core-js to include their Symbol polyfill strictly before @webcomponents
const nonce = Symbol('I_DO_NOTHING')
import '@webcomponents/webcomponentsjs'
```

**NOTE:** There are a number of caveats you may still encounter on your way to supporting legacy browsers. Please refer to the additional documentation [here](/src/polyfill/README.md)

----

## Vue Dev Tools
vue-hybrids is compatible with vue dev tools. You can still inspect your mounted vue elements. Each defined component will show as wrapped in a `<shadow-root>` tag to signify it's placement in the shadow DOM.

**NOTE:** If using vue-hybrids within another Vue app, Vue Dev Tools will tend to bind to your app Vue instance.

## Development
Contributions welcome!

## Active Issues
`vue-hybrids` is quite young and a number of small issues are present.

- hot reloading is broken for shadowStyles editing
