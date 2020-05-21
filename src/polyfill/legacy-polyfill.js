/**
 * @webcomponents/webcomponentsjs does not provide an IE11 polyfill which supports
 * compatibility with core-js Symbol polyfill. This variant of the polyfill was generated
 * from a fork of @webcomponents/webcomponentsjs found here:
 * https://github.com/auzmartist/polyfills
 *
 * Relevant commit message from that fork:
 * The Symbol polyfill causes a stack overflow exception on IE11 when used in conjunction with core-js, a babel standard package which is widely used.
 * This is further documented [here](https://github.com/webcomponents/polyfills/issues/43)
 */
import '../../lib/webcomponentsjs/webcomponents-bundle.js'