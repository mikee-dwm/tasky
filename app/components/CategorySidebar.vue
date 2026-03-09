<template>
  <aside class="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col">
    <!-- Logo -->
    <div class="px-5 py-4 border-b border-gray-200">
      <h1 class="text-xl font-bold text-gray-900 tracking-tight">Tasky</h1>
    </div>

    <!-- Category list -->
    <nav class="flex-1 overflow-y-auto p-3 space-y-0.5">
      <button
        class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="modelValue === null ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'"
        @click="$emit('update:modelValue', null)"
      >
        <span>All Tasks</span>
        <span
          class="text-xs tabular-nums"
          :class="modelValue === null ? 'text-indigo-500' : 'text-gray-400'"
        >
          {{ totalCount }}
        </span>
      </button>

      <button
        v-for="cat in categories"
        :key="cat.id"
        class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="modelValue === cat.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'"
        @click="$emit('update:modelValue', cat.id)"
      >
        <span class="truncate">{{ cat.name }}</span>
        <span
          class="text-xs tabular-nums shrink-0 ml-2"
          :class="modelValue === cat.id ? 'text-indigo-500' : 'text-gray-400'"
        >
          {{ countForCategory(cat.id) }}
        </span>
      </button>
    </nav>

    <!-- Add category -->
    <div class="p-3 border-t border-gray-200">
      <Transition name="slide" mode="out-in">
        <form v-if="adding" class="flex gap-2" @submit.prevent="submit">
          <input
            ref="inputRef"
            v-model="name"
            placeholder="Category name"
            class="flex-1 text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            @keydown.escape="adding = false"
          >
          <button
            type="submit"
            class="text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add
          </button>
        </form>
        <button
          v-else
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          @click="startAdding"
        >
          <span class="text-lg leading-none">+</span>
          <span>New Category</span>
        </button>
      </Transition>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { Category, Todo } from '~/composables/useTodos'

const props = defineProps<{
  modelValue: string | null
  categories: readonly Category[]
  todos: readonly Todo[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  'add': [name: string]
}>()

const totalCount = computed(() => props.todos.length)
function countForCategory(id: string) {
  return props.todos.filter(t => t.categoryId === id).length
}

const adding = ref(false)
const name = ref('')
const inputRef = useTemplateRef('inputRef')

async function startAdding() {
  adding.value = true
  await nextTick()
  inputRef.value?.focus()
}

function submit() {
  if (!name.value.trim()) return
  emit('add', name.value)
  name.value = ''
  adding.value = false
}
</script>
