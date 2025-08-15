import { ref, computed, type Ref } from 'vue'
import type { Product } from '@/types/product'

export default function useControls(products: Ref<Product[]>) {
  const controlsModel = ref({
    visibleCount: 3,
    showDifferences: false
  })

  const minCount = 2
  const maxCount = 6

  const visibleProducts = computed(() => 
    products.value.slice(0, controlsModel.value.visibleCount)
  )

  const hiddenProducts = computed(() =>
    products.value.slice(controlsModel.value.visibleCount)
  )

  return {
    controlsModel,
    minCount,
    maxCount,
    visibleProducts,
    hiddenProducts
  }
}