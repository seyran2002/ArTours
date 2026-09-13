<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTag } from '~/composables/useTag'
import AdminLocationsList from '~/components/admin/locations/LocationsList.vue'
import AdminLocationsForm from '~/components/admin/locations/LocationForm.vue'
import AdminLocationsTagsManagement from '~/components/admin/locations/TagsManagement.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'locations | ArTours Admin',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const Location = useLocation();
const tag = useTag()
const tags = computed(() => tag.tags.value)
const locations = computed(() => Location.locations.value);

onMounted(async () => {
  if (tag.tags.value.length === 0) {
    await tag.fetchTags();
  }
  if (Location.locations.value.length === 0) {
    await Location.fetchLocations();
  }
})

// Tab state: 'list' | 'form' | 'tags'
const activeView = ref<'list' | 'form' | 'tags'>('list')
const editingLocationId = ref<string | number | undefined>(undefined)

// Success Notification toast state
const toast = ref<{ message: string; type: 'success' | 'error' } | null>(null)
let toastTimeout: any = null

function showToast(message: string, type: 'success' | 'error' = 'success') {
  if (toastTimeout) clearTimeout(toastTimeout)
  toast.value = { message, type }
  toastTimeout = setTimeout(() => {
    toast.value = null
  }, 4000)
}

const editingLocationTitle = computed(() => {
  if (!editingLocationId.value) return ''
  const loc = locations.value.find(t => String(t.id) === String(editingLocationId.value))
  return loc ? (loc.enTitle || loc.ruTitle || '') : ''
})

function onEdit(id: string | number) {
  editingLocationId.value = id
  activeView.value = 'form'
  showToast('Loaded Location for editing', 'success')
}

function onCreate() {
  editingLocationId.value = undefined
  activeView.value = 'form'
}

function onFormSave() {
  const isEdit = !!editingLocationId.value
  editingLocationId.value = undefined
  activeView.value = 'list'
  showToast(isEdit ? 'Location updated successfully!' : 'Location created successfully!', 'success')
}

function onFormCancel() {
  editingLocationId.value = undefined
  activeView.value = 'list'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header & Stats -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold font-serif text-zinc-900 tracking-tight">Ուղղություններ</h1>
        <p class="text-sm text-zinc-500 mt-1">Կառավարեք տեսարժան վայրերը, երթուղիները, գնագոյացումը և տեգերի զտումը:</p>
      </div>

      <!-- Quick Stats -->
      <div class="flex gap-3 sm:gap-4">
        <!-- locations Stat -->
        <div class="flex-1 md:flex-none bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-2xl px-4 sm:px-5 py-3 shadow-sm flex items-center gap-3">
          <div class="p-2 sm:p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
            <BaseIcon name="map-pin" size="sm" />
          </div>
          <div class="min-w-0">
            <span class="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider leading-tight">Ուղղությունների Քանակը</span>
            <span class="text-xl font-extrabold text-zinc-800">{{ locations.length }}</span>
          </div>
        </div>

        <!-- Tags Stat -->
        <div class="flex-1 md:flex-none bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-2xl px-4 sm:px-5 py-3 shadow-sm flex items-center gap-3">
          <div class="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
            <BaseIcon name="tag" size="sm" />
          </div>
          <div class="min-w-0">
            <span class="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider leading-tight">Տեգերի Քանակը</span>
            <span class="text-xl font-extrabold text-zinc-800">{{ tags.length }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex flex-col gap-3 border-b border-zinc-200/85 pb-5 w-fit">
      <div class="flex bg-zinc-200/50 p-1.5 rounded-2xl gap-1 border border-zinc-200/40 w-full sm:w-auto">
        <!-- View List Tab -->
        <button
          type="button"
          @click="activeView = 'list'"
          :class="[
            'px-3 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 flex-1 sm:flex-initial',
            activeView === 'list'
              ? 'bg-primary text-white shadow-md shadow-primary/15'
              : 'text-zinc-500 hover:text-zinc-800 hover:bg-white/50'
          ]"
        >
          <BaseIcon name="grid" size="xs" />
          <span class="hidden sm:inline">Ուղղությունների ցանկ</span>
          <span class="sm:hidden">Ցանկ</span>
        </button>

        <!-- Form Tab (Create / Edit) -->
        <button
          type="button"
          @click="activeView = 'form'"
          :class="[
            'px-3 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 flex-1 sm:flex-initial',
            activeView === 'form'
              ? 'bg-primary text-white shadow-md shadow-primary/15'
              : 'text-zinc-500 hover:text-zinc-800 hover:bg-white/50'
          ]"
        >
          <BaseIcon :name="editingLocationId ? 'edit' : 'plus'" size="xs" />
          <span class="hidden sm:inline">{{ editingLocationId ? 'Խմբագրել Ուղղություն' : 'Ստեղծել Ուղղություն' }}</span>
          <span class="sm:hidden">{{ editingLocationId ? 'Խմբագրել' : 'Ստեղծել' }}</span>
        </button>

        <!-- Tags Tab -->
        <button
          type="button"
          @click="activeView = 'tags'"
          :class="[
            'px-3 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 flex-1 sm:flex-initial',
            activeView === 'tags'
              ? 'bg-primary text-white shadow-md shadow-primary/15'
              : 'text-zinc-500 hover:text-zinc-800 hover:bg-white/50'
          ]"
        >
          <BaseIcon name="tag" size="xs" />
          <span class="hidden sm:inline">Տեգերի Կառավարում</span>
          <span class="sm:hidden">Տեգեր</span>
        </button>
      </div>

      <div v-if="activeView === 'form' && editingLocationId" class="text-xs font-bold text-zinc-400 bg-zinc-100/80 px-3 py-1.5 rounded-lg border border-zinc-200/50 self-start">
        Editing: <span class="text-zinc-700">{{ editingLocationTitle }}</span>
      </div>
    </div>

    <!-- View Rendering -->
    <div class="relative min-h-[300px]">
      <!-- 1. locations LIST -->
      <div v-if="activeView === 'list'" class="animate-fade-in">
        <AdminLocationsList
          :locations="locations"
          @edit="onEdit"
          @create="onCreate"
        />
      </div>

      <!-- 2. Location FORM -->
      <div v-else-if="activeView === 'form'" class="animate-fade-in">
        <AdminLocationsForm
          :key="editingLocationId ?? 'new'"
          :location-id="editingLocationId"
          @save="onFormSave"
          @cancel="onFormCancel"
        />
      </div>

      <!-- 3. TAGS MANAGEMENT -->
      <div v-else-if="activeView === 'tags'" class="animate-fade-in">
        <AdminLocationsTagsManagement />
      </div>
    </div>

    <!-- Toast Notifications -->
    <Transition name="toast">
      <div
        v-if="toast"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-slide-in-toast"
        :class="[
          toast.type === 'success'
            ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800 shadow-emerald-500/10'
            : 'bg-red-50/90 border-red-200 text-red-800 shadow-red-500/10'
        ]"
      >
        <BaseIcon :name="toast.type === 'success' ? 'check-circle' : 'alert-circle'" size="sm" />
        <span class="text-xs font-semibold">{{ toast.message }}</span>
        <button
          type="button"
          @click="toast = null"
          class="ml-3 text-zinc-400 hover:text-zinc-600"
        >
          <BaseIcon name="x" size="xs" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideInToast {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-slide-in-toast {
  animation: slideInToast 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Toast Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>
