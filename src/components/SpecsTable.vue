<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types/product'

const props = defineProps<{
  specs: string[]
  products: Product[]
}>()

// предзагрузка иконок
import yesIcon from '@/assets/images/yes.png'
import noIcon from '@/assets/images/no.png'

const shouldDisplayIcon = (value: string | number): boolean => {
  return ['Y', 'N'].includes(String(value))
}
</script>

<template>
  <div class="specs-table">
    <div class="spec-row" v-for="spec in specs" :key="spec">
      <div class="spec-name">{{ spec }}</div>
      <div
        class="spec-value"
        v-for="p in products"
        :key="p.id"
      >
        <template v-if="shouldDisplayIcon(p.specs[spec])">
          <img 
            :src="p.specs[spec] === 'Y' ? yesIcon : noIcon" 
            :alt="p.specs[spec] === 'Y' ? 'Да' : 'Нет'"
            class="bool-icon"
            :title="p.specs[spec] === 'Y' ? 'Есть' : 'Нет'"
          />
        </template>
        <template v-else>
          {{ p.specs[spec] }}
        </template>
      </div>
    </div>
  </div>
</template>