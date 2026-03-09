import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoInput from '../../app/components/TodoInput.vue'

describe('TodoInput', () => {
  it('renders an input and submit button', () => {
    const wrapper = mount(TodoInput)
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('emits add with the entered text on submit', async () => {
    const wrapper = mount(TodoInput)
    await wrapper.find('input').setValue('Buy milk')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('add')?.[0]).toEqual(['Buy milk'])
  })

  it('clears the input after submission', async () => {
    const wrapper = mount(TodoInput)
    await wrapper.find('input').setValue('Buy milk')
    await wrapper.find('form').trigger('submit')
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
  })

  it('does not emit add when input is empty', async () => {
    const wrapper = mount(TodoInput)
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('add')).toBeUndefined()
  })

  it('does not emit add when input is only whitespace', async () => {
    const wrapper = mount(TodoInput)
    await wrapper.find('input').setValue('   ')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('add')).toBeUndefined()
  })
})
