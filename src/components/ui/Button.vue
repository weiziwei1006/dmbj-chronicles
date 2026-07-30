<script setup lang="ts">
import { computed } from 'vue';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  type: 'button',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const classes = computed(() => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-theme)] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-[var(--color-theme)] text-[var(--color-bg)] hover:brightness-110 hover:shadow-lg hover:shadow-[var(--color-theme-glow)]',
    secondary:
      'bg-[var(--color-bg-elevated)] text-text-primary border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-card)]',
    ghost:
      'bg-transparent text-text-secondary hover:text-text-primary hover:bg-[var(--color-bg-elevated)]',
    danger:
      'bg-accent-blood text-text-primary hover:brightness-125',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  return [base, variants[props.variant], sizes[props.size]].join(' ');
});

function handleClick(event: MouseEvent): void {
  if (!props.disabled) {
    emit('click', event);
  }
}
</script>

<template>
  <a
    v-if="href"
    :href="disabled ? undefined : href"
    :class="classes"
    :aria-disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </a>
  <button
    v-else
    :type="type"
    :class="classes"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
