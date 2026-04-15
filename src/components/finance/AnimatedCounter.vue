<template>
  <span class="animated-counter">{{ displayValue }}</span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  duration: { type: Number, default: 1000 }
})

const displayValue = ref(0)

const animateValue = (start, end, duration) => {
  const startTime = performance.now()
  const update = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    displayValue.value = Math.floor(start + (end - start) * eased)
    if (progress < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

onMounted(() => animateValue(0, props.value, props.duration))
watch(() => props.value, (newVal, oldVal) => {
  animateValue(oldVal, newVal, props.duration)
})
</script>

<style scoped>
.animated-counter {
  font-variant-numeric: tabular-nums;
}
</style>