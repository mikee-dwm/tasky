<template>
  <div
    class="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm group"
    draggable="true"
    :class="{ 'opacity-50': dragging }"
    @dragstart="$emit('dragstart')"
    @dragover.prevent="$emit('dragover')"
    @drop="$emit('drop')"
    @dragend="$emit('dragend')"
  >
    <!-- Drag handle -->
    <span class="text-gray-300 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity select-none">
      ⠿
    </span>

    <!-- Checkbox -->
    <button
      class="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
      :class="todo.completed ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 hover:border-indigo-400'"
      @click="$emit('toggle')"
    >
      <svg v-if="todo.completed" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
    </button>

    <!-- Text (view / edit) -->
    <div class="flex-1 min-w-0">
      <span
        v-if="!editing"
        class="text-sm text-gray-800 cursor-pointer"
        :class="{ 'line-through text-gray-400': todo.completed }"
        @dblclick="startEdit"
      >
        {{ todo.text }}
      </span>
      <input
        v-else
        ref="editInput"
        v-model="editText"
        class="w-full text-sm px-2 py-0.5 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        @keydown.enter="submitEdit"
        @keydown.escape="editing = false"
        @blur="submitEdit"
      >
    </div>

    <!-- Category badge -->
    <span
      v-if="categoryName"
      class="shrink-0 text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full"
    >
      {{ categoryName }}
    </span>

    <!-- Delete -->
    <button
      class="shrink-0 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
      @click="$emit('delete')"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '~/composables/useTodos'

const props = defineProps<{
  todo: Todo
  categoryName?: string
  dragging?: boolean
}>()

const emit = defineEmits<{
  toggle: []
  delete: []
  edit: [text: string]
  dragstart: []
  dragover: []
  drop: []
  dragend: []
}>()

const editing = ref(false)
const editText = ref('')
const editInput = useTemplateRef('editInput')

async function startEdit() {
  editText.value = props.todo.text
  editing.value = true
  await nextTick()
  editInput.value?.focus()
}

function submitEdit() {
  if (editText.value.trim()) emit('edit', editText.value)
  editing.value = false
}
</script>