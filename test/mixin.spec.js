'use strict'
import './mock-dispose'
import { mount } from '@vue/test-utils'
import Stub from './Stub.vue'
import mixin from '..'
import guess from '../guess'

let wrapper, vm, ownReturnValue, ownDisposed

const init = (options) => {
  //  test-utils will modify the argument object! ;)
  vm = (wrapper = mount({ ...options })).vm
  vm.disposed = ownDisposed = 0
  ownReturnValue = undefined
}

const template = '<div></div>'
const Comp = {
  mixins: [mixin],
  template,
  methods: { ownDispose: () => ++ownDisposed && ownReturnValue }
}

test('should have tag', () => {
  init(Comp)
  expect(wrapper.vm.ownTag).toBe('VueComponent#1')
})

test('should dispose', () => {
  expect(vm.disposed).toBe(0)
  wrapper.destroy()
  expect(ownDisposed).toBe(1)
  expect(vm.disposed).toBe(1)
})

test('should use explicit name', () => {
  init({ name: 'Given', ...Comp })
  expect(wrapper.vm.ownTag).toBe('Given#2')
})

test('should override dispose strategy', () => {
  init(Comp)
  ownReturnValue = false
  wrapper.destroy()
  expect(ownDisposed).toBe(1)
  expect(vm.disposed).toBe(0)
})

describe('component name guessing', () => {
  beforeEach(() => init(Stub))

  test('should do deep name guessing', () => {
    const fn = vm.$options.__file, ct = vm.$options._componentTag
    expect(guess(vm)).toBe(ct || fn)
    vm.$options._componentTag = 'assigned'
    expect(guess(vm, true)).toBe('assigned')
  })

  test('should recognize root instance', () => {
    expect(guess(vm.$root = vm, true)).toBe('#root#')
  })
})
