import {
  mount
} from '@vue/test-utils'
import Logo from '../../ui/components/logo.vue'
const test = require('ava')

test('is a Vue instance', (t) => {
  const wrapper = mount(Logo)
  t.is(wrapper.isVueInstance(), true)
})
