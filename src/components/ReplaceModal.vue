<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Product } from '@/types/product'

const props = defineProps<{
  show: boolean
  searchQuery: string
  products: Product[]
}>()

const emit = defineEmits([
  'update:searchQuery',
  'replace',
  'close'
])

import swapIcon from '@/assets/images/swap.png'

// Локальное состояние для отслеживания был ли ввод
const hasUserInput = ref(false)

// Следим за изменениями searchQuery
watch(() => props.searchQuery, (newVal) => {
  if (newVal.trim() !== '') {
    hasUserInput.value = true
  }
})

// Определяем нужно ли показывать поле поиска
const showSearchField = computed(() => {
  // Показываем если:
  // 1. Изначально было больше 3 товаров ИЛИ
  // 2. Пользователь начал ввод
  return props.products.length > 3 || hasUserInput.value
})

function handleReplace(product: Product) {
  emit('replace', product)
  emit('close')
  resetSearch()
}

function closeModal() {
  emit('close')
  resetSearch()
}

function resetSearch() {
  emit('update:searchQuery', '')
  hasUserInput.value = false
}
</script>

<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <input
        v-if="showSearchField"
        :value="searchQuery"
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        placeholder="Поиск"
        class="modal-search"
      />

      <div class="modal-list">
        <div
          v-for="product in products"
          :key="product.id"
          class="modal-item"
          @click="handleReplace(product)"
        >
          <img 
            :src="swapIcon" 
            alt="Заменить"
            class="modal-swap-icon"
          />
          <img 
            :src="product.image" 
            :alt="product.name"
            class="modal-item-image"
          />
          <span class="modal-item-name">{{ product.name }}</span>
        </div>
        <div v-if="products.length === 0" class="no-results">
          Ничего не найдено
        </div>
      </div>

      <button 
        @click="closeModal"
        class="modal-close-button"
      >
        Закрыть
      </button>
    </div>
  </div>
</template>

<style scoped>
.no-results {
  padding: 12px;
  text-align: center;
  color: #999;
}
</style>