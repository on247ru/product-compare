<script setup lang="ts">
import type { Product } from '@/types/product'

const props = defineProps<{
  product: Product
  showReplaceButton: boolean
}>()

const emit = defineEmits(['replace'])

import openModalIcon from '@/assets/images/chevron_small.png'

function handleReplace() {
  emit('replace')
}

console.log('ProductCard updated:', props.product.id);
</script>

<template>
  <div class="product-card">
    <img 
      :src="product.image" 
      :alt="product.name"
      class="product-image"
    />
    <h3 class="product-title">{{ product.name }}</h3>
    
    <button
      v-if="showReplaceButton"
      @click="handleReplace"
      class="replace-button"
      title="Заменить товар"
    >
      <img 
        :src="openModalIcon" 
        :alt="Заменить"
        class="open-modal-icon"
      />
    </button>
  </div>
</template>
