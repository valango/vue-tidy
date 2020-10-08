/**
 * Retrieve Vue component's name:
 * vm.name, vm.$options.name [, vm.$options._componentTag, m.$options.__file]
 *
 * @param {Object} vm
 * @param {boolean=} any -- to default to component tag or file name.
 * @returns {string | undefined}
 */
export default (vm, any = false) => {
  const o = vm._isVue && vm.$options
  let name = vm.name || (o && o.name)
  // console.log('vm.$options vm.name', Object.keys(vm.$options), vm._isVue, vm.name)

  if (name) return name

  name = any && o && (o._componentTag || (o.__file && '@' + o.__file))

  return name || (vm.$root === vm && '#root#') || undefined
}
