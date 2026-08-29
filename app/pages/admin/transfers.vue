<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTag } from '~/composables/useTag'
import AdminTransfersTransfersList from '~/components/admin/transfers/TransfersList.vue'
import AdminTransfersTransferForm from '~/components/admin/transfers/TransferForm.vue'
import AdminTransfersTagsManagement from '~/components/admin/transfers/TagsManagement.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Transfers | ArTours Admin',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const transfer = useTransfer();
const tag = useTag()
const tags = computed(() => tag.tags.value)
const transfers = computed(() => transfer.transfers.value);

onMounted(async () => {
  if (tag.tags.value.length === 0) {
    await tag.fetchTags();
    await transfer.fetchTransfers();
  }
})

// Tab state: 'list' | 'form' | 'tags'
const activeView = ref<'list' | 'form' | 'tags'>('list')
const editingTransferId = ref<string | number | undefined>(undefined)

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

const editingTransferTitle = computed(() => {
  if (!editingTransferId.value) return ''
  const transfer = transfers.value.find(t => t.id === editingTransferId.value)
  return transfer ? transfer.title : ''
})

function onEdit(id: string | number) {
  editingTransferId.value = id
  activeView.value = 'form'
  showToast('Loaded transfer for editing', 'success')
}

function onCreate() {
  editingTransferId.value = undefined
  activeView.value = 'form'
}

function onFormSave() {
  const isEdit = !!editingTransferId.value
  editingTransferId.value = undefined
  activeView.value = 'list'
  showToast(isEdit ? 'Transfer updated successfully!' : 'Transfer created successfully!', 'success')
}

function onFormCancel() {
  editingTransferId.value = undefined
  activeView.value = 'list'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header & Stats -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold font-serif text-zinc-900 tracking-tight">Տրանսֆերներ</h1>
        <p class="text-sm text-zinc-500 mt-1"> Կառավարեք օդանավակայանների և քաղաքային տրանսֆերային ծառայությունները, երթուղիները, գնագոյացումը և տեգերի զտումը:</p>
      </div>

      <!-- Quick Stats -->
      <div class="flex flex-wrap gap-4">
        <!-- Transfers Stat -->
        <div class="bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-2xl px-5 py-3 shadow-sm flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-primary/10 text-primary">
            <BaseIcon name="transfer" size="sm" />
          </div>
          <div>
            <span class="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">Տրանսֆերների Քանակը</span>
            <span class="text-xl font-extrabold text-zinc-800">{{ transfers.length }}</span>
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
          <span>Տրանսֆերների ցանկ</span>
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
          <BaseIcon :name="editingTransferId ? 'edit' : 'plus'" size="xs" />
          <span>{{ editingTransferId ? 'Խմբագրել Տրանսֆեր' : 'Ստեղծել Տրանսֆեր' }}</span>
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
          <span>Տեգերի Կառավարում</span>
        </button>
      </div>

      <div v-if="activeView === 'form' && editingTransferId" class="text-xs font-bold text-zinc-400 bg-zinc-100/80 px-3 py-1.5 rounded-lg border border-zinc-200/50">
        Editing: <span class="text-zinc-700">{{ editingTransferTitle }}</span>
      </div>
    </div>

    <!-- View Rendering -->
    <div class="relative min-h-[300px]">
      <!-- 1. TRANSFERS LIST -->
      <div v-if="activeView === 'list'" class="animate-fade-in">
        <AdminTransfersTransfersList
          :transfers="transfers"
          @edit="onEdit"
          @create="onCreate"
        />
      </div>

      <!-- 2. TRANSFER FORM -->
      <div v-else-if="activeView === 'form'" class="animate-fade-in">
        <AdminTransfersTransferForm
          :key="editingTransferId ?? 'new'"
          :transfer-id="editingTransferId"
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
