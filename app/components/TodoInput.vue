<template>
  <div class="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
    <form class="flex gap-3" @submit.prevent="submit">
      <input
        v-model="text"
        placeholder="Add a new task..."
        class="flex-1 text-sm px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
      >
      <button
        type="submit"
        class="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 active:scale-95 transition-all"
      >
        Add
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'add': [text: string]
}>()

const text = ref('')

function submit() {
  if (!text.value.trim()) return
  emit('add', text.value)
  text.value = ''
}
</script>