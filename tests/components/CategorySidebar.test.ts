import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CategorySidebar from '../../app/components/CategorySidebar.vue'

const categories = [
  { id: 'c1', name: 'Work' },
  { id: 'c2', name: 'Personal' },
]

const todos = [
  { id: '1', text: 'Task A', completed: false, categoryId: 'c1', order: 0 },
  { id: '2', text: 'Task B', completed: false, categoryId: 'c1', order: 1 },
  { id: '3', text: 'Task C', completed: false, categoryId: 'c2', order: 2 },
]

describe('CategorySidebar', () => {
  describe('rendering', () => {
    it('renders the app title', () => {
      const wrapper = mount(CategorySidebar, { props: { modelValue: null, categories: [], todos: [] } })
      expect(wrapper.text()).toContain('Tasky')
    })

    it('renders All Tasks button', () => {
      const wrapper = mount(CategorySidebar, { props: { modelValue: null, categories: [], todos: [] } })
      expect(wrapper.text()).toContain('All Tasks')
    })

    it('renders a button for each category', () => {
      const wrapper = mount(CategorySidebar, { props: { modelValue: null, categories, todos: [] } })
      expect(wrapper.text()).toContain('Work')
      expect(wrapper.text()).toContain('Personal')
    })

    it('shows total todo count on All Tasks', () => {
      const wrapper = mount(CategorySidebar, { props: { modelValue: null, categories, todos } })
      const allBtn = wrapper.find('nav button')
      expect(allBtn.text()).toContain('3')
    })

    it('shows per-category todo counts', () => {
      const wrapper = mount(CategorySidebar, { props: { modelValue: null, categories, todos } })
      const catButtons = wrapper.findAll('nav button')
      expect(catButtons[1].text()).toContain('2') // Work has 2
      expect(catButtons[2].text()).toContain('1') // Personal has 1
    })

    it('highlights All Tasks when modelValue is null', () => {
      const wrapper = mount(CategorySidebar, { props: { modelValue: null, categories, todos } })
      expect(wrapper.find('nav button').classes()).toContain('bg-indigo-50')
    })

    it('highlights the selected category', () => {
      const wrapper = mount(CategorySidebar, { props: { modelValue: 'c1', categories, todos } })
      const catButtons = wrapper.findAll('nav button')
      expect(catButtons[1].classes()).toContain('bg-indigo-50')
      expect(catButtons[0].classes()).not.toContain('bg-indigo-50')
    })
  })

  describe('interactions', () => {
    it('emits update:modelValue with null when All Tasks is clicked', async () => {
      const wrapper = mount(CategorySidebar, { props: { modelValue: 'c1', categories, todos } })
      await wrapper.find('nav button').trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    })

    it('emits update:modelValue with category id when a category is clicked', async () => {
      const wrapper = mount(CategorySidebar, { props: { modelValue: null, categories, todos } })
      await wrapper.findAll('nav button')[1].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['c1'])
    })

    it('shows the add category form when New Category is clicked', async () => {
      const wrapper = mount(CategorySidebar, { props: { modelValue: null, categories: [], todos: [] } })
      await wrapper.find('button[class*="text-gray-500"]').trigger('click')
      expect(wrapper.find('form').exists()).toBe(true)
    })

    it('emits add with the category name on form submit', async () => {
      const wrapper = mount(CategorySidebar, { props: { modelValue: null, categories: [], todos: [] } })
      await wrapper.find('button[class*="text-gray-500"]').trigger('click')
      await wrapper.find('input').setValue('New Cat')
      await wrapper.find('form').trigger('submit')
      expect(wrapper.emitted('add')?.[0]).toEqual(['New Cat'])
    })

    it('hides the form and clears input after submit', async () => {
      const wrapper = mount(CategorySidebar, { props: { modelValue: null, categories: [], todos: [] } })
      await wrapper.find('button[class*="text-gray-500"]').trigger('click')
      await wrapper.find('input').setValue('New Cat')
      await wrapper.find('form').trigger('submit')
      expect(wrapper.find('form').exists()).toBe(false)
    })

    it('does not emit add when name is empty', async () => {
      const wrapper = mount(CategorySidebar, { props: { modelValue: null, categories: [], todos: [] } })
      await wrapper.find('button[class*="text-gray-500"]').trigger('click')
      await wrapper.find('form').trigger('submit')
      expect(wrapper.emitted('add')).toBeUndefined()
    })
  })
})