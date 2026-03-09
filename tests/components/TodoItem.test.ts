import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoItem from '../../app/components/TodoItem.vue'

const baseTodo = {
  id: '1',
  text: 'Buy milk',
  completed: false,
  categoryId: null,
  order: 0,
}

describe('TodoItem', () => {
  describe('rendering', () => {
    it('renders the todo text', () => {
      const wrapper = mount(TodoItem, { props: { todo: baseTodo } })
      expect(wrapper.text()).toContain('Buy milk')
    })

    it('applies strikethrough when completed', () => {
      const wrapper = mount(TodoItem, { props: { todo: { ...baseTodo, completed: true } } })
      expect(wrapper.find('span.line-through').exists()).toBe(true)
    })

    it('does not apply strikethrough when not completed', () => {
      const wrapper = mount(TodoItem, { props: { todo: baseTodo } })
      expect(wrapper.find('span.line-through').exists()).toBe(false)
    })

    it('shows category badge when categoryName is provided', () => {
      const wrapper = mount(TodoItem, { props: { todo: baseTodo, categoryName: 'Work' } })
      expect(wrapper.text()).toContain('Work')
    })

    it('does not show category badge when categoryName is not provided', () => {
      const wrapper = mount(TodoItem, { props: { todo: baseTodo } })
      expect(wrapper.find('span.bg-indigo-50').exists()).toBe(false)
    })

    it('applies opacity when dragging', () => {
      const wrapper = mount(TodoItem, { props: { todo: baseTodo, dragging: true } })
      expect(wrapper.classes()).toContain('opacity-50')
    })
  })

  describe('interactions', () => {
    it('emits toggle when checkbox is clicked', async () => {
      const wrapper = mount(TodoItem, { props: { todo: baseTodo } })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('toggle')).toHaveLength(1)
    })

    it('emits delete when delete button is clicked', async () => {
      const wrapper = mount(TodoItem, { props: { todo: baseTodo } })
      const buttons = wrapper.findAll('button')
      await buttons[buttons.length - 1].trigger('click')
      expect(wrapper.emitted('delete')).toHaveLength(1)
    })

    it('shows edit input on double-click', async () => {
      const wrapper = mount(TodoItem, { props: { todo: baseTodo } })
      await wrapper.find('span.cursor-pointer').trigger('dblclick')
      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('emits edit with new text on enter', async () => {
      const wrapper = mount(TodoItem, { props: { todo: baseTodo } })
      await wrapper.find('span.cursor-pointer').trigger('dblclick')
      await wrapper.find('input').setValue('Updated text')
      await wrapper.find('input').trigger('keydown.enter')
      expect(wrapper.emitted('edit')?.[0]).toEqual(['Updated text'])
    })

    it('hides edit input on escape without emitting', async () => {
      const wrapper = mount(TodoItem, { props: { todo: baseTodo } })
      await wrapper.find('span.cursor-pointer').trigger('dblclick')
      await wrapper.find('input').trigger('keydown.escape')
      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.emitted('edit')).toBeUndefined()
    })
  })
})
