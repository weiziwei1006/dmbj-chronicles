<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  hoverable?: boolean;
  padded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hoverable: true,
  padded: true,
});

const classes = computed(() => {
  const base =
    'glass-panel relative overflow-hidden transition-all duration-300';

  const hover = props.hoverable
    ? 'hover:border-[var(--color-border-hover)] hover:shadow-lg hover:shadow-[var(--color-theme-glow)] hover:-translate-y-0.5'
    : '';

  const pad = props.padded ? 'p-6' : '';

  return [base, hover, pad].join(' ');
});
</script>

<template>
  <div :class="classes">
    <header v-if="$slots.header" class="mb-4">
      <slot name="header" />
    </header>
    <div class="card-body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="mt-4 pt-4 border-t border-[var(--color-border)]">
      <slot name="footer" />
    </footer>
  </div>
</template>
