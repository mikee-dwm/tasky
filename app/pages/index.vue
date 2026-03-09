<template>
  <div class="flex h-screen bg-gray-50 font-sans">
    <CategorySidebar
      v-model="selectedCategoryId"
      :categories="categories"
      :todos="todos"
      @add="addCategory"
    />

    <main class="flex-1 flex flex-col min-w-0">
      <!-- Top bar -->
      <div class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <h2 class="text-base font-semibold text-gray-900">
            {{ selectedCategoryId === null ? 'All Tasks' : categories.find(c => c.id === selectedCategoryId)?.name }}
          </h2>
          <button
            v-if="selectedCategoryId !== null"
            class="text-xs text-red-400 hover:text-red-600 transition-colors"
            @click="removeCategory(selectedCategoryId)"
          >
            Delete
          </button>
        </div>
        <TodoFilter v-model="statusFilter" />
      </div>

      <TodoInput @add="(text: string) => addTodo(text, selectedCategoryId)" />

      <!-- Todo list -->
      <div class="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        <div
          v-if="filteredTodos.length === 0"
          class="flex flex-col items-center justify-center h-48 text-gray-400"
        >
          <span class="text-4xl mb-3">{{ statusFilter === 'completed' ? '🎉' : '📋' }}</span>
          <p class="text-sm">{{ emptyMessage }}</p>
        </div>

        <TodoItem
          v-for="(todo, index) in filteredTodos"
          :key="todo.id"
          :todo="todo"
          :category-name="selectedCategoryId === null ? categories.find(c => c.id === todo.categoryId)?.name : undefined"
          :dragging="dragIndex === index"
          @toggle="toggleTodo(todo.id)"
          @delete="deleteTodo(todo.id)"
          @edit="(text: string) => editTodo(todo.id, text)"
          @dragstart="onDragStart(index)"
          @dragover="onDragOver(index)"
          @drop="onDrop"
          @dragend="onDragEnd"
        />
      </div>

      <!-- Footer -->
      <div class="px-6 py-3 border-t border-gray-100 bg-white shrink-0 flex items-center justify-between text-xs text-gray-400">
        <span>{{ activeCount }} task{{ activeCount === 1 ? '' : 's' }} remaining</span>
        <button
          v-if="completedCount > 0"
          class="hover:text-gray-600 transition-colors"
          @click="clearCompleted"
        >
          Clear completed
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { StatusFilter } from '~/composables/useTodos'

const { todos, categories, addTodo, deleteTodo, toggleTodo, editTodo, reorderTodos, addCategory, deleteCategory, getFilteredTodos } = useTodos()

const statusFilter = ref<StatusFilter>('all')
const selectedCategoryId = ref<string | null>(null)

const filteredTodos = computed(() => getFilteredTodos(selectedCategoryId.value, statusFilter.value))
const activeCount = computed(() => todos.value.filter(t => !t.completed).length)
const completedCount = computed(() => todos.value.filter(t => t.completed).length)
const emptyMessage = computed(() => {
  if (statusFilter.value === 'completed') return 'No completed tasks yet'
  if (statusFilter.value === 'active') return 'No active tasks'
  return 'Add a task to get started'
})

function removeCategory(id: string) {
  deleteCategory(id)
  selectedCategoryId.value = null
}

function clearCompleted() {
  todos.value.filter(t => t.completed).forEach(t => deleteTodo(t.id))
}

const dragIndex = ref<number | null>(null)
const dropIndex = ref<number | null>(null)

function onDragStart(index: number) { dragIndex.value = index }
function onDragOver(index: number) { dropIndex.value = index }
function onDrop() {
  if (dragIndex.value !== null && dropIndex.value !== null && dragIndex.value !== dropIndex.value) {
    reorderTodos(dragIndex.value, dropIndex.value)
  }
}
function onDragEnd() {
  dragIndex.value = null
  dropIndex.value = null
}
</script>
