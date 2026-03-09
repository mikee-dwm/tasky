<template>
  <div class="flex gap-1 bg-gray-100 p-1 rounded-lg">
    <button
      v-for="f in filters"
      :key="f.value"
      class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
      :class="modelValue === f.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
      @click="$emit('update:modelValue', f.value)"
    >
      {{ f.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { StatusFilter } from '~/composables/useTodos'

defineProps<{
  modelValue: StatusFilter
}>()

defineEmits<{
  'update:modelValue': [value: StatusFilter]
}>()

const filters: { label: string, value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Done', value: 'completed' },
]
</script>