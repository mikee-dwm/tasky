import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoFilter from '../../app/components/TodoFilter.vue'

describe('TodoFilter', () => {
  it('renders all three filter buttons', () => {
    const wrapper = mount(TodoFilter, { props: { modelValue: 'all' } })
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(3)
    expect(buttons[0].text()).toBe('All')
    expect(buttons[1].text()).toBe('Active')
    expect(buttons[2].text()).toBe('Done')
  })

  it('highlights the active filter', () => {
    const wrapper = mount(TodoFilter, { props: { modelValue: 'active' } })
    const buttons = wrapper.findAll('button')
    expect(buttons[1].classes()).toContain('bg-white')
    expect(buttons[0].classes()).not.toContain('bg-white')
  })

  it('emits update:modelValue with correct value when a filter is clicked', async () => {
    const wrapper = mount(TodoFilter, { props: { modelValue: 'all' } })
    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['active'])
  })

  it('emits completed when Done is clicked', async () => {
    const wrapper = mount(TodoFilter, { props: { modelValue: 'all' } })
    await wrapper.findAll('button')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['completed'])
  })
})
