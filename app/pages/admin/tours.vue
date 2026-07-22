<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminTour } from '~/composables/useAdminTour'
import { useTransfer } from '~/composables/useTransfer'
import { useTag } from '~/composables/useTag'
import AdminToursList from '~/components/admin/tours/AdminToursList.vue'
import AdminTourForm from '~/components/admin/tours/AdminTourForm.vue'
import AdminTransfersTagsManagement from '~/components/admin/transfers/TagsManagement.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Tours | ArTours Admin',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const adminTour = useAdminTour()
const transfer = useTransfer()
const tag = useTag()

const tours = computed(() => adminTour.tours.value)
const tags = computed(() => tag.tags.value)

onMounted(async () => {
  const loadPromises: Promise<any>[] = []

  if (tours.value.length === 0) {
    loadPromises.push(adminTour.fetchTours())
  }
  if (tag.tags.value.length === 0) {
    loadPromises.push(tag.fetchTags())
  }
  if (transfer.transfers.value.length === 0) {
    loadPromises.push(transfer.fetchTransfers())
  }

  await Promise.all(loadPromises)
})

// Tab state: 'list' | 'form' | 'tags'
const activeView = ref<'list' | 'form' | 'tags'>('list')
const editingTourId = ref<string | undefined>(undefined)

// Toast notification state
const toast = ref<{ message: string; type: 'success' | 'error' } | null>(null)
let toastTimeout: any = null

function showToast(message: string, type: 'success' | 'error' = 'success') {
  if (toastTimeout) clearTimeout(toastTimeout)
  toast.value = { message, type }
  toastTimeout = setTimeout(() => {
    toast.value = null
  }, 4000)
}

const editingTourTitle = computed(() => {
  if (!editingTourId.value) return ''
  const tour = tours.value.find((t) => t.id === editingTourId.value)
  return tour ? (tour.enTitle || tour.ruTitle || '') : ''
})

function onEdit(id: string) {
  editingTourId.value = id
  activeView.value = 'form'
  showToast('Loaded tour for editing', 'success')
}

function onCreate() {
  editingTourId.value = undefined
  activeView.value = 'form'
}

function onFormSave() {
  const isEdit = !!editingTourId.value
  editingTourId.value = undefined
  activeView.value = 'list'
  showToast(isEdit ? 'Tour updated successfully!' : 'Tour created successfully!', 'success')
}

function onFormCancel() {
  editingTourId.value = undefined
  activeView.value = 'list'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header & Stats -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold font-serif text-zinc-900 tracking-tight">Տուրեր</h1>
        <p class="text-sm text-zinc-500 mt-1">Կառավարեք պատմական, մշակութային և բնությանը նվիրված տուրերը, գնագոյացումը և տեգերի զտումը:</p>
      </div>

      <!-- Quick Stats -->
      <div class="flex flex-wrap gap-4">
        <!-- Tours Stat -->
        <div class="bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-2xl px-5 py-3 shadow-sm flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-primary/10 text-primary">
            <BaseIcon name="map" size="sm" />
          </div>
          <div>
            <span class="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">Տուրերի Քանակը</span>
            <span class="text-xl font-extrabold text-zinc-800">{{ tours.length }}</span>
          </div>
        </div>

        <!-- Tags Stat -->
        <div class="bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-2xl px-5 py-3 shadow-sm flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
            <BaseIcon name="tag" size="sm" />
          </div>
          <div>
            <span class="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">Տեգերի Քանակը</span>
            <span class="text-xl font-extrabold text-zinc-800">{{ tags.length }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/85 pb-5">
      <div class="flex bg-zinc-200/50 p-1.5 rounded-2xl gap-1 border border-zinc-200/40 w-full sm:w-auto">
        <!-- View List Tab -->
        <button
          type="button"
          @click="activeView = 'list'"
          :class="[
            'px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 active:scale-95 flex-1 sm:flex-initial',
            activeView === 'list'
              ? 'bg-primary text-white shadow-md shadow-primary/15'
              : 'text-zinc-500 hover:text-zinc-800 hover:bg-white/50'
          ]"
        >
          <BaseIcon name="grid" size="xs" />
          <span>Տուրերի ցանկ</span>
        </button>

        <!-- Form Tab (Create / Edit) -->
        <button
          type="button"
          @click="activeView = 'form'"
          :class="[
            'px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 active:scale-95 flex-1 sm:flex-initial',
            activeView === 'form'
              ? 'bg-primary text-white shadow-md shadow-primary/15'
              : 'text-zinc-500 hover:text-zinc-800 hover:bg-white/50'
          ]"
        >
          <BaseIcon :name="editingTourId ? 'edit' : 'plus'" size="xs" />
          <span>{{ editingTourId ? 'Խմբագրել Տուր' : 'Ստեղծել Տուր' }}</span>
        </button>

        <!-- Tags Tab -->
        <button
          type="button"
          @click="activeView = 'tags'"
          :class="[
            'px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 active:scale-95 flex-1 sm:flex-initial',
            activeView === 'tags'
              ? 'bg-primary text-white shadow-md shadow-primary/15'
              : 'text-zinc-500 hover:text-zinc-800 hover:bg-white/50'
          ]"
        >
          <BaseIcon name="tag" size="xs" />
          <span>Կառավարել Տեգերը</span>
        </button>
      </div>

      <div v-if="activeView === 'form' && editingTourId" class="text-xs font-bold text-zinc-400 bg-zinc-100/80 px-3 py-1.5 rounded-lg border border-zinc-200/50">
        Editing: <span class="text-zinc-700">{{ editingTourTitle }}</span>
      </div>
    </div>

    <!-- View Rendering -->
    <div class="relative min-h-[300px]">
      <!-- 1. TOURS LIST -->
      <div v-if="activeView === 'list'" class="animate-fade-in">
        <AdminToursList
          :tours="tours"
          @edit="onEdit"
          @create="onCreate"
        />
      </div>

      <!-- 2. TOUR FORM -->
      <div v-else-if="activeView === 'form'" class="animate-fade-in">
        <AdminTourForm
          :key="editingTourId ?? 'new'"
          :tour-id="editingTourId"
          @save="onFormSave"
          @cancel="onFormCancel"
        />
      </div>

      <!-- 3. TAGS MANAGEMENT -->
      <div v-else-if="activeView === 'tags'" class="animate-fade-in">
        <AdminTransfersTagsManagement />
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
