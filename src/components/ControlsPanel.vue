<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: {
    visibleCount: number
    showDifferences: boolean
  }
  minCount?: number
  maxCount?: number
  productsCount: number
}>()

const emit = defineEmits(['update:modelValue'])

const countOptions = computed(() => {
  const min = props.minCount ?? 2
  const max = Math.min(props.maxCount ?? 6, props.productsCount)
  return Array.from({ length: max - min + 1 }, (_, i) => i + min)
})

function updateCount(value: number) {
  emit('update:modelValue', {
    ...props.modelValue,
    visibleCount: value
  })
}

function toggleDifferences(e: Event) {
  emit('update:modelValue', {
    ...props.modelValue,
    showDifferences: (e.target as HTMLInputElement).checked
  })
}
</script>

<template>
    <div class="count-selector">
      <span class="label">Отобразить товары:</span>
      <div class="options">
        <button
          v-for="n in countOptions"
          :key="n"
          class="option"
          :class="{ active: modelValue.visibleCount === n }"
          @click="updateCount(n)"
          type="button"
        >
          {{ n }}
        </button>
      </div>
    </div>

    <label class="checkbox-label show-differences">
      <input
        type="checkbox"
        class="visually-hidden"
        :checked="modelValue.showDifferences"
        @change="toggleDifferences"
      />
      <span class="custom-checkbox"></span>
      Показать различия
    </label>
</template>
