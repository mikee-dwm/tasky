export interface Category {
  id: string
  name: string
}

export interface Todo {
  id: string
  text: string
  completed: boolean
  categoryId: string | null
  order: number
}

export type StatusFilter = 'all' | 'active' | 'completed'

const todos = ref<Todo[]>([])
const categories = ref<Category[]>([])

export function _resetTodosState() {
  todos.value = []
  categories.value = []
}

export function useTodos() {
  // --- Categories ---

  function addCategory(name: string): Category {
    const category: Category = { id: crypto.randomUUID(), name: name.trim() }
    categories.value.push(category)
    return category
  }

  function deleteCategory(id: string) {
    categories.value = categories.value.filter(c => c.id !== id)
    todos.value = todos.value.map(t =>
      t.categoryId === id ? { ...t, categoryId: null } : t,
    )
  }

  // --- Todos ---

  function addTodo(text: string, categoryId: string | null = null): Todo {
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      categoryId,
      order: todos.value.length,
    }
    todos.value.push(todo)
    return todo
  }

  function deleteTodo(id: string) {
    todos.value = todos.value.filter(t => t.id !== id)
  }

  function toggleTodo(id: string) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.completed = !todo.completed
  }

  function editTodo(id: string, text: string) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.text = text.trim()
  }

  function reorderTodos(fromIndex: number, toIndex: number) {
    const list = [...todos.value]
    const [moved] = list.splice(fromIndex, 1)
    list.splice(toIndex, 0, moved)
    todos.value = list.map((t, i) => ({ ...t, order: i }))
  }

  // --- Filtered view ---

  function getFilteredTodos(categoryId: string | null, status: StatusFilter): Todo[] {
    return todos.value
      .filter(t => categoryId === null || t.categoryId === categoryId)
      .filter(t => {
        if (status === 'active') return !t.completed
        if (status === 'completed') return t.completed
        return true
      })
      .sort((a, b) => a.order - b.order)
  }

  return {
    todos: readonly(todos),
    categories: readonly(categories),
    addCategory,
    deleteCategory,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    reorderTodos,
    getFilteredTodos,
  }
}
