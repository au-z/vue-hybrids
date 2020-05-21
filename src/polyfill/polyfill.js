
/**
 * Fix for @webcomponents/webcomponentsjs polyfill in legacy browsers.
 * The polyfill creates an infinite loop if used with core-js' Symbol polyfill
 * @babel/preset-env users are affected as well. Here is a link to a minimal reproduction.
 * https://github.com/bschlenk/ie11-corejs-stack-overflow-repro
 *
 * A quick fix requires us to force core-js to include the Symbol polyfill strictly
 * before the @webcomponents/webcomponentsjs polyfill.
 */
const sym = Symbol('WEB_COMPONENTS_SUPPORT')

import '@webcomponents/webcomponentsjs'