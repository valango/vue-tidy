import { dispose as dsp, initialize, ownOff, ownOn } from 'keep-tidy/helpers'
import guess from './guess'

const dispose = function () {
  if (!(typeof this.ownDispose === 'function' && this.ownDispose() === false)) dsp.call(this)
}

/**
 * This mix-in implements ITidyOwner functionality fir Vue instance.
 */
export default {
  beforeCreate () {
    //  Override beforeCreate() hook or modify things in later lifecycle hooks.
    initialize.call(this, guess(this, true))

  },

  beforeDestroy () {
    this.dispose()
  },

  methods: { dispose, ownOn, ownOff }
}
