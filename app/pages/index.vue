<template>
  <div class="flex h-screen bg-gray-50 font-sans">
    <!-- Sidebar -->
    <aside
      class="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col"
    >
      <!-- Logo -->
      <div class="px-5 py-4 border-b border-gray-200">
        <h1 class="text-xl font-bold text-gray-900 tracking-tight">Tasky</h1>
      </div>

      <!-- Category list -->
      <nav class="flex-1 overflow-y-auto p-3 space-y-0.5">
        <button
          class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="
            selectedCategoryId === null
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-100'
          "
          @click="selectedCategoryId = null"
        >
          <span>All Tasks</span>
          <span
            class="text-xs tabular-nums"
            :class="
              selectedCategoryId === null ? 'text-indigo-500' : 'text-gray-400'
            "
          >
            {{ todos.length }}
          </span>
        </button>

        <button
          v-for="cat in categories"
          :key="cat.id"
          class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="
            selectedCategoryId === cat.id
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-100'
          "
          @click="selectedCategoryId = cat.id"
        >
          <span class="truncate">{{ cat.name }}</span>
          <span
            class="text-xs tabular-nums shrink-0 ml-2"
            :class="
              selectedCategoryId === cat.id
                ? 'text-indigo-500'
                : 'text-gray-400'
            "
          >
            {{ todos.filter((t) => t.categoryId === cat.id).length }}
          </span>
        </button>
      </nav>

      <!-- Add category -->
      <div class="p-3 border-t border-gray-200">
        <form
          v-if="addingCategory"
          class="flex gap-2"
          @submit.prevent="submitCategory"
        >
          <input
            ref="categoryInput"
            v-model="newCategoryName"
            placeholder="Category name"
            class="flex-1 text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            @keydown.escape="addingCategory = false"
          />
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
          @click="startAddingCategory"
        >
          <span class="text-lg leading-none">+</span>
          <span>New Category</span>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 flex flex-col min-w-0">
      <!-- Top bar -->
      <div
        class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0"
      >
        <div class="flex items-center gap-3">
          <h2 class="text-base font-semibold text-gray-900">
            {{
              selectedCategoryId === null
                ? "All Tasks"
                : categories.find((c) => c.id === selectedCategoryId)?.name
            }}
          </h2>
          <button
            v-if="selectedCategoryId !== null"
            class="text-xs text-red-400 hover:text-red-600 transition-colors"
            @click="removeCategory(selectedCategoryId)"
          >
            Delete
          </button>
        </div>

        <!-- Status filter tabs -->
        <div class="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            v-for="f in filters"
            :key="f.value"
            class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
            :class="
              statusFilter === f.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            "
            @click="statusFilter = f.value"
          >
            {{ f.label }}
          </button>
        </div>
      </div>

      <!-- Add todo input -->
      <div class="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <form class="flex gap-3" @submit.prevent="submitTodo">
          <input
            v-model="newTodoText"
            placeholder="Add a new task..."
            class="flex-1 text-sm px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
          />
          <button
            type="submit"
            class="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Add
          </button>
        </form>
      </div>

      <!-- Todo list -->
      <div class="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        <div
          v-if="filteredTodos.length === 0"
          class="flex flex-col items-center justify-center h-48 text-gray-400"
        >
          <span class="text-4xl mb-3">{{
            statusFilter === "completed" ? "🎉" : "📋"
          }}</span>
          <p class="text-sm">{{ emptyMessage }}</p>
        </div>

        <div
          v-for="(todo, index) in filteredTodos"
          :key="todo.id"
          class="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm group"
          draggable="true"
          :class="{ 'opacity-50': dragIndex === index }"
          @dragstart="onDragStart(index)"
          @dragover.prevent="onDragOver(index)"
          @drop="onDrop"
          @dragend="onDragEnd"
        >
          <!-- Drag handle -->
          <span
            class="text-gray-300 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity select-none"
          >
            ⠿
          </span>

          <!-- Checkbox -->
          <button
            class="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
            :class="
              todo.completed
                ? 'bg-indigo-500 border-indigo-500'
                : 'border-gray-300 hover:border-indigo-400'
            "
            @click="toggleTodo(todo.id)"
          >
            <svg
              v-if="todo.completed"
              class="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>

          <!-- Text (view / edit) -->
          <div class="flex-1 min-w-0">
            <span
              v-if="editingId !== todo.id"
              class="text-sm text-gray-800 cursor-pointer"
              :class="{ 'line-through text-gray-400': todo.completed }"
              @dblclick="startEdit(todo)"
            >
              {{ todo.text }}
            </span>
            <input
              v-else
              v-model="editText"
              class="w-full text-sm px-2 py-0.5 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              @keydown.enter="submitEdit(todo.id)"
              @keydown.escape="editingId = null"
              @blur="submitEdit(todo.id)"
            />
          </div>

          <!-- Category badge -->
          <span
            v-if="todo.categoryId && selectedCategoryId === null"
            class="shrink-0 text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full"
          >
            {{ categories.find((c) => c.id === todo.categoryId)?.name }}
          </span>

          <!-- Delete -->
          <button
            class="shrink-0 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            @click="deleteTodo(todo.id)"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="px-6 py-3 border-t border-gray-100 bg-white shrink-0 flex items-center justify-between text-xs text-gray-400"
      >
        <span
          >{{ activeCount }} task{{
            activeCount === 1 ? "" : "s"
          }}
          remaining</span
        >
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
const {
  todos,
  categories,
  addTodo,
  deleteTodo,
  toggleTodo,
  editTodo,
  reorderTodos,
  addCategory,
  deleteCategory,
  getFilteredTodos,
} = useTodos();

// --- Filters ---
const filters = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Done", value: "completed" },
] as const;
const statusFilter = ref<"all" | "active" | "completed">("all");
const selectedCategoryId = ref<string | null>(null);

const filteredTodos = computed(() =>
  getFilteredTodos(selectedCategoryId.value, statusFilter.value),
);
const activeCount = computed(
  () => todos.value.filter((t) => !t.completed).length,
);
const completedCount = computed(
  () => todos.value.filter((t) => t.completed).length,
);
const emptyMessage = computed(() => {
  if (statusFilter.value === "completed") return "No completed tasks yet";
  if (statusFilter.value === "active") return "No active tasks";
  return "Add a task to get started";
});

// --- Add todo ---
const newTodoText = ref("");
function submitTodo() {
  if (!newTodoText.value.trim()) return;
  addTodo(newTodoText.value, selectedCategoryId.value);
  newTodoText.value = "";
}

// --- Edit todo ---
const editingId = ref<string | null>(null);
const editText = ref("");
function startEdit(todo: { id: string; text: string }) {
  editingId.value = todo.id;
  editText.value = todo.text;
}
function submitEdit(id: string) {
  if (editText.value.trim()) editTodo(id, editText.value);
  editingId.value = null;
}

// --- Clear completed ---
function clearCompleted() {
  todos.value.filter((t) => t.completed).forEach((t) => deleteTodo(t.id));
}

// --- Add category ---
const addingCategory = ref(false);
const newCategoryName = ref("");
const categoryInput = useTemplateRef("categoryInput");

async function startAddingCategory() {
  addingCategory.value = true;
  await nextTick();
  categoryInput.value?.focus();
}
function submitCategory() {
  if (!newCategoryName.value.trim()) return;
  addCategory(newCategoryName.value);
  newCategoryName.value = "";
  addingCategory.value = false;
}

// --- Delete category ---
function removeCategory(id: string) {
  deleteCategory(id);
  selectedCategoryId.value = null;
}

// --- Drag to reorder ---
const dragIndex = ref<number | null>(null);
const dropIndex = ref<number | null>(null);

function onDragStart(index: number) {
  dragIndex.value = index;
}
function onDragOver(index: number) {
  dropIndex.value = index;
}
function onDrop() {
  if (
    dragIndex.value !== null &&
    dropIndex.value !== null &&
    dragIndex.value !== dropIndex.value
  ) {
    reorderTodos(dragIndex.value, dropIndex.value);
  }
}
function onDragEnd() {
  dragIndex.value = null;
  dropIndex.value = null;
}
</script>
