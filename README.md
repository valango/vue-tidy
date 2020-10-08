# vue-tidy
[![Build Status](https://travis-ci.org/valango/vue-tidy.svg?branch=master)](https://travis-ci.org/valango/vue-tidy)
[![Code coverage](https://img.shields.io/codecov/c/gh/valango/vue-tidy?label=codecov&logo=codecov)](https://codecov.io/gh/valango/vue-tidy)

A tiny Vue.js mix-in for event handler management and memory leaks prevention.
It also provides a simple API for easier debugging and diagnostics.

Processing DOM events or similar in OO code implies correct set-up and releasing of event handlers.
Also, cross-referenced class instances and other objects need special care to prevent
the dreaded memory leaks.

## Installation
`  npm install -S vue-tidy`<br />or<br />`  yarn add vue-tidy`

## Usage
```vue
<template>
  <div :id="unique"></div>
</template>
<script>
import tidyOwner from 'vue-tidy'

export default {
  data: () => ({ 
    unique: undefined   //  Can be used as element ID if we have many instances.
  }),

  name: 'Funny',

  mixins: [tidyOwner],

  created() {
    this.debugOn(true)  //  In DEV environment, this enables following .debug() calls.
    this.unique = this.ownTag
    //  Everything we do next, will be auto-undone before we vanish.
    this.own.fiend1 = reference_to_some_other_thing
    this.ownOn('resize', 'onResize', window)
    this.debugOn(true)  //  If we need this...
  },

  methods: {
    onResize() { 
      this.debug('onResize')      //  --> 'Funny#1 onResize +0ms' on developer console.
      /* do something smarter */ 
    }
  }
}
</script>
```

## API
The mix-in is the default export. 

The mix-in adds the following features to a vue instance:

### Lifecycle hooks
   * _`created`_ - sets up the machinery;
   * _`beforeDestroy`_ - calls _dispose()_ method (see below).

### Instance methods
   * **`debug`**`(...)`<br />outputs coloured and timestamped console messages, when enabled;.
   * **`debugOn`**`([*]): *`<br />enables or disables `debug` method and returns _`this`_
   for chaining, if argument supplied; otherwise returns _boolean_ showing if debugging is enabled.
   * **`dispose`**`()`<br />frees up all bound resources, called automatically by _`beforeDestroy`_ hook.
   It cleans the _**`own`**_ container, firing _`dispose`_ method of every
   object instance having it. Then it _un-registers all handlers_ set by _`ownOn`_ method.
   * **`ownOff`**`(event= : string, emitter= : Object) : this`<br />
   un-registers handlers registered for matching (event, emitter) pairs.
   It is called by dispose(), so in most cases you don't need to call it explicitly.
   * **`ownOn`**`(event : string, handler, emitter, api=) : this`<br />
   registers _`event`_ _`handler`_ with _`emitter`_ object.
   If emitter API differs from `addEventListener/removeEventListener` or `$on/$off` or `on/off`,
   then you need explicitly define the API, like `['listenTo', 'ignore']`.
   The _`handler`_ parameter can be instance method name or a function.
   
### Instance properties
   * **`own`**`: Object`<br />a keyed container for private data, that should be gracefully cleaned up.
   * **`ownClass`**`: string`<br />class name (read-only).
   * **`ownId`**`: number`<br />globally unique class instance number(read-only).
   * **`ownTag`**`: string`<br />is set to _`ownClass`_`+ '#' +`_`ownId`_ (read-only).
   
Assigning a value to any instance property will throw `TypeError`.

### Overriding dispose() method
To do something special during beforeDestroy hook, you may define _**`ownDispose()`**_ method.
If defined, this method will run first and if it returns _boolean `false`_,
the default _`dispose()`_ will not be called.

### Name guess helper
There is a helper function used internally for initializing the _`ownClass`_ property.

`guess(vm, [tryHarder : boolean]) : {string | undefined}`

This function can work without the mix-in as well. It must be imported separately:<br />
`  import guess from 'vue-tidy/guess'`
