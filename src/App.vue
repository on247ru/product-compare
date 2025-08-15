<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockProducts } from '@/data/mockProducts'
import useControls from '@/composables/useControls'
import ControlsPanel from '@/components/ControlsPanel.vue'
import ProductCard from '@/components/ProductCard.vue'
import ReplaceModal from '@/components/ReplaceModal.vue'
import SpecsTable from '@/components/SpecsTable.vue'
import '@/assets/styles/fonts.css'
import '@/assets/styles/product-comparison.css'

const allProducts = ref(mockProducts)
const { 
  controlsModel, 
  minCount, 
  maxCount, 
  visibleProducts, 
  hiddenProducts 
} = useControls(allProducts)

import accountIcon from '@/assets/images/account.png'

// ===== Замена товара на скрытый в модальном окне =====
const replaceTargetIndex = ref<number | null>(null)
const searchQuery = ref('')

const filteredHiddenProducts = computed(() => {
  if (!searchQuery.value.trim()) return hiddenProducts.value
  return hiddenProducts.value.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function openReplacePopup(index: number) {
  replaceTargetIndex.value = index
}

function replaceProduct(newProduct: Product) {
  if (replaceTargetIndex.value === null) return;

  const targetProduct = visibleProducts.value[replaceTargetIndex.value];
  const targetIndex = allProducts.value.findIndex(p => p.id === targetProduct.id);
  const newProductIndex = allProducts.value.findIndex(p => p.id === newProduct.id);
  
  if (targetIndex === -1 || newProductIndex === -1) return;
  
  const updatedProducts = [...allProducts.value];
  [updatedProducts[targetIndex], updatedProducts[newProductIndex]] = 
    [updatedProducts[newProductIndex], updatedProducts[targetIndex]];
  
  allProducts.value = updatedProducts;
  
  replaceTargetIndex.value = null;
  searchQuery.value = '';
}

// ===== Фильтрация характеристик =====
function collectAllSpecs(products: Product[]) {
  const specNames = new Set<string>()
  products.forEach(p => Object.keys(p.specs).forEach(k => specNames.add(k)))
  return Array.from(specNames)
}

function filterDifferences(products: Product[]) {
  const allSpecs = collectAllSpecs(products)
  return allSpecs.filter(specName => {
    const values = products.map(p => p.specs[specName])
    const firstValue = values[0]
    return values.some(v => v !== firstValue)
  })
}

const comparedSpecs = computed(() => {
  return controlsModel.value.showDifferences
    ? filterDifferences(visibleProducts.value)
    : collectAllSpecs(visibleProducts.value)
})

const showReplaceModal = computed({
  get: () => replaceTargetIndex.value !== null,
  set: (value) => {
    if (!value) replaceTargetIndex.value = null
  }
})
</script>

<template>
  <div class="header-page">
    <a class="site-section-title" href="#">Каталог</a>
    <div class="site-page-title">Сравнение</div>
    <a class="account-link" href="#">
      <span class="account-title">Личный кабинет</span>
      <img 
        :src="accountIcon" 
        :alt="account"
        class="account-icon"
      />
    </a>
  </div>
  <div class="comparison-page">
  <h1 class="comparison-title">Смартфоны</h1>
    <!-- Фильтры -->
    <ControlsPanel
      v-model="controlsModel"
      :products-count="allProducts.length"
      :min-count="2"
      :max-count="6"
    />

    <!-- Карточки товаров -->
    <div class="products">
      <ProductCard
        v-for="(product, idx) in visibleProducts"
        :key="`${product.id}-${idx}`"
        :product="product"
        :show-replace-button="hiddenProducts.length > 0"
        @replace="openReplacePopup(idx)"
      />
    </div>

    <!-- Таблица характеристик -->
    <SpecsTable
      :specs="comparedSpecs"
      :products="visibleProducts"
    />

    <!-- Модалка замены -->
    <ReplaceModal
      :show="showReplaceModal"
      v-model:search-query="searchQuery"
      :products="filteredHiddenProducts"
      @replace="replaceProduct"
      @close="replaceTargetIndex = null"
    />
  </div>
</template>

