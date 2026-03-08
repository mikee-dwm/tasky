import { describe, it, expect, beforeEach } from 'vitest'
import { useTodos, _resetTodosState } from '../../app/composables/useTodos'

describe('useTodos', () => {
  let todos: ReturnType<typeof useTodos>

  beforeEach(() => {
    _resetTodosState()
    todos = useTodos()
  })

  // --- Categories ---

  describe('addCategory', () => {
    it('adds a category with a unique id', () => {
      const cat = todos.addCategory('Work')
      expect(todos.categories.value).toHaveLength(1)
      expect(cat.name).toBe('Work')
      expect(cat.id).toBeTruthy()
    })

    it('trims whitespace from the name', () => {
      const cat = todos.addCategory('  Home  ')
      expect(cat.name).toBe('Home')
    })

    it('adds multiple categories with unique ids', () => {
      const a = todos.addCategory('Work')
      const b = todos.addCategory('Personal')
      expect(a.id).not.toBe(b.id)
      expect(todos.categories.value).toHaveLength(2)
    })
  })

  describe('deleteCategory', () => {
    it('removes the category', () => {
      const cat = todos.addCategory('Work')
      todos.deleteCategory(cat.id)
      expect(todos.categories.value).toHaveLength(0)
    })

    it('sets categoryId to null on todos that belonged to the deleted category', () => {
      const cat = todos.addCategory('Work')
      todos.addTodo('Task 1', cat.id)
      todos.deleteCategory(cat.id)
      expect(todos.todos.value[0].categoryId).toBeNull()
    })

    it('does not affect todos in other categories', () => {
      const work = todos.addCategory('Work')
      const home = todos.addCategory('Home')
      todos.addTodo('Work task', work.id)
      todos.addTodo('Home task', home.id)
      todos.deleteCategory(work.id)
      expect(todos.todos.value.find(t => t.text === 'Home task')?.categoryId).toBe(home.id)
    })
  })

  // --- Todos ---

  describe('addTodo', () => {
    it('adds a todo with correct defaults', () => {
      const todo = todos.addTodo('Buy milk')
      expect(todos.todos.value).toHaveLength(1)
      expect(todo.text).toBe('Buy milk')
      expect(todo.completed).toBe(false)
      expect(todo.categoryId).toBeNull()
    })

    it('trims whitespace from text', () => {
      const todo = todos.addTodo('  Buy milk  ')
      expect(todo.text).toBe('Buy milk')
    })

    it('assigns categoryId when provided', () => {
      const cat = todos.addCategory('Work')
      const todo = todos.addTodo('Meeting', cat.id)
      expect(todo.categoryId).toBe(cat.id)
    })

    it('assigns incrementing order values', () => {
      todos.addTodo('First')
      todos.addTodo('Second')
      todos.addTodo('Third')
      const orders = todos.todos.value.map(t => t.order)
      expect(orders).toEqual([0, 1, 2])
    })
  })

  describe('deleteTodo', () => {
    it('removes the todo by id', () => {
      const todo = todos.addTodo('Buy milk')
      todos.deleteTodo(todo.id)
      expect(todos.todos.value).toHaveLength(0)
    })

    it('does not affect other todos', () => {
      todos.addTodo('First')
      const second = todos.addTodo('Second')
      todos.deleteTodo(second.id)
      expect(todos.todos.value).toHaveLength(1)
      expect(todos.todos.value[0].text).toBe('First')
    })
  })

  describe('toggleTodo', () => {
    it('marks an active todo as completed', () => {
      const todo = todos.addTodo('Task')
      todos.toggleTodo(todo.id)
      expect(todos.todos.value[0].completed).toBe(true)
    })

    it('marks a completed todo as active', () => {
      const todo = todos.addTodo('Task')
      todos.toggleTodo(todo.id)
      todos.toggleTodo(todo.id)
      expect(todos.todos.value[0].completed).toBe(false)
    })
  })

  describe('editTodo', () => {
    it('updates the todo text', () => {
      const todo = todos.addTodo('Old text')
      todos.editTodo(todo.id, 'New text')
      expect(todos.todos.value[0].text).toBe('New text')
    })

    it('trims whitespace on edit', () => {
      const todo = todos.addTodo('Task')
      todos.editTodo(todo.id, '  Updated  ')
      expect(todos.todos.value[0].text).toBe('Updated')
    })
  })

  describe('reorderTodos', () => {
    it('moves a todo from one position to another', () => {
      todos.addTodo('First')
      todos.addTodo('Second')
      todos.addTodo('Third')
      todos.reorderTodos(0, 2)
      const texts = todos.todos.value.map(t => t.text)
      expect(texts).toEqual(['Second', 'Third', 'First'])
    })

    it('updates order values after reorder', () => {
      todos.addTodo('A')
      todos.addTodo('B')
      todos.addTodo('C')
      todos.reorderTodos(2, 0)
      const orders = todos.todos.value.map(t => t.order)
      expect(orders).toEqual([0, 1, 2])
    })
  })

  // --- Filtering ---

  describe('getFilteredTodos', () => {
    it('returns all todos when categoryId is null and status is all', () => {
      todos.addTodo('A')
      todos.addTodo('B')
      expect(todos.getFilteredTodos(null, 'all')).toHaveLength(2)
    })

    it('filters by category', () => {
      const work = todos.addCategory('Work')
      todos.addTodo('Work task', work.id)
      todos.addTodo('No category')
      expect(todos.getFilteredTodos(work.id, 'all')).toHaveLength(1)
    })

    it('filters active todos', () => {
      const t1 = todos.addTodo('Task 1')
      todos.addTodo('Task 2')
      todos.toggleTodo(t1.id)
      expect(todos.getFilteredTodos(null, 'active')).toHaveLength(1)
    })

    it('filters completed todos', () => {
      const t1 = todos.addTodo('Task 1')
      todos.addTodo('Task 2')
      todos.toggleTodo(t1.id)
      expect(todos.getFilteredTodos(null, 'completed')).toHaveLength(1)
      expect(todos.getFilteredTodos(null, 'completed')[0].text).toBe('Task 1')
    })

    it('returns todos sorted by order', () => {
      todos.addTodo('A')
      todos.addTodo('B')
      todos.addTodo('C')
      todos.reorderTodos(2, 0)
      const texts = todos.getFilteredTodos(null, 'all').map(t => t.text)
      expect(texts).toEqual(['C', 'A', 'B'])
    })
  })
})
