<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import type { NarrativeParagraph } from '../../types/data';

interface Props {
  narrative: NarrativeParagraph[];
  keyQuotes?: string[];
  emotion?: string;
  typingSpeed?: number;
}

const props = withDefaults(defineProps<Props>(), {
  keyQuotes: () => [],
  emotion: '',
  typingSpeed: 30,
});

const currentIndex = ref(0);
const displayedText = ref('');
const isTyping = ref(false);
const isComplete = ref(false);
const showInnerThought = ref(false);
let typingTimer: ReturnType<typeof setInterval> | null = null;

const currentParagraph = computed(() => {
  if (currentIndex.value >= props.narrative.length) return null;
  return props.narrative[currentIndex.value];
});

const progress = computed(() => {
  if (props.narrative.length === 0) return 0;
  return Math.round(((currentIndex.value + (isComplete.value ? 1 : 0)) / props.narrative.length) * 100);
});

const visibleParagraphs = computed(() => {
  const result: { paragraph: string; innerThought?: string; isCurrent: boolean }[] = [];
  for (let i = 0; i < currentIndex.value; i++) {
    result.push({
      ...props.narrative[i],
      isCurrent: false,
    });
  }
  return result;
});

function startTyping(): void {
  if (!currentParagraph.value) {
    isComplete.value = true;
    return;
  }

  isTyping.value = true;
  showInnerThought.value = false;
  displayedText.value = '';
  const fullText = currentParagraph.value.paragraph;
  let charIndex = 0;

  if (typingTimer) {
    clearInterval(typingTimer);
  }

  typingTimer = setInterval(() => {
    if (charIndex < fullText.length) {
      displayedText.value += fullText[charIndex];
      charIndex++;
    } else {
      finishTyping();
    }
  }, props.typingSpeed);
}

function finishTyping(): void {
  if (typingTimer) {
    clearInterval(typingTimer);
    typingTimer = null;
  }
  isTyping.value = false;
  showInnerThought.value = true;
}

function handleClick(): void {
  if (isComplete.value) return;

  if (isTyping.value) {
    // 跳过打字效果，直接显示完整文本
    finishTyping();
    if (currentParagraph.value) {
      displayedText.value = currentParagraph.value.paragraph;
    }
  } else {
    // 进入下一段
    currentIndex.value++;
    if (currentIndex.value >= props.narrative.length) {
      isComplete.value = true;
    } else {
      startTyping();
    }
  }
}

function skipAll(): void {
  if (typingTimer) {
    clearInterval(typingTimer);
    typingTimer = null;
  }
  isTyping.value = false;
  isComplete.value = true;
  currentIndex.value = props.narrative.length;
}

function reset(): void {
  if (typingTimer) {
    clearInterval(typingTimer);
    typingTimer = null;
  }
  currentIndex.value = 0;
  displayedText.value = '';
  isTyping.value = false;
  isComplete.value = false;
  showInnerThought.value = false;
  startTyping();
}

onMounted(() => {
  startTyping();
});

onUnmounted(() => {
  if (typingTimer) {
    clearInterval(typingTimer);
  }
});

watch(
  () => props.narrative,
  () => {
    reset();
  }
);
</script>

<template>
  <div class="narrative-text" @click="handleClick">
    <!-- 已完成的段落 -->
    <div
      v-for="(item, index) in visibleParagraphs"
      :key="index"
      class="paragraph-block animate-fade-in-up"
    >
      <p class="paragraph-text text-text-primary">
        {{ item.paragraph }}
      </p>
      <p v-if="item.innerThought" class="inner-thought">
        「{{ item.innerThought }}」
      </p>
    </div>

    <!-- 当前正在输入的段落 -->
    <div v-if="currentParagraph && !isComplete" class="paragraph-block current">
      <p class="paragraph-text text-text-primary">
        {{ displayedText
        }}<span v-if="isTyping" class="typing-cursor">|</span>
      </p>
      <transition name="thought-fade">
        <p v-if="showInnerThought && currentParagraph.innerThought" class="inner-thought">
          「{{ currentParagraph.innerThought }}」
        </p>
      </transition>
    </div>

    <!-- 点击提示 -->
    <div v-if="!isComplete" class="click-hint">
      <span v-if="isTyping" class="text-text-muted">点击跳过 ▸</span>
      <span v-else class="text-text-muted">
        点击继续
        <span class="ml-1 animate-pulse">▸</span>
      </span>
    </div>

    <!-- 完成后的关键台词和情感 -->
    <transition name="fade-in">
      <div v-if="isComplete" class="mt-8 space-y-6">
        <div v-if="keyQuotes.length > 0" class="key-quotes">
          <h4 class="mb-3 text-sm font-medium text-text-muted">关键台词</h4>
          <div class="space-y-2">
            <blockquote
              v-for="(quote, i) in keyQuotes"
              :key="i"
              class="border-l-2 border-[var(--color-theme)] py-2 pl-4 text-lg italic text-text-primary"
            >
              {{ quote }}
            </blockquote>
          </div>
        </div>

        <div v-if="emotion" class="emotion-tag">
          <span class="text-sm text-text-muted">情感：</span>
          <span class="text-sm text-[var(--color-theme)]">{{ emotion }}</span>
        </div>

        <button
          class="text-sm text-text-muted underline decoration-dotted underline-offset-4 transition-colors hover:text-text-primary"
          @click.stop="reset"
        >
          ↻ 重新阅读
        </button>
      </div>
    </transition>

    <!-- 进度指示器 -->
    <div v-if="!isComplete" class="progress-bar">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<style scoped>
.narrative-text {
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-bottom: 2rem;
}

.paragraph-block {
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s ease-out forwards;
}

.paragraph-block.current {
  animation: none;
}

.paragraph-text {
  font-size: 1.0625rem;
  line-height: 2;
  letter-spacing: 0.02em;
}

.inner-thought {
  margin-top: 0.5rem;
  padding-left: 1rem;
  font-size: 0.9375rem;
  line-height: 1.8;
  color: var(--color-theme);
  font-style: italic;
  opacity: 0.85;
}

.typing-cursor {
  display: inline-block;
  animation: blink 1s steps(2) infinite;
  color: var(--color-theme);
  font-weight: 100;
}

.click-hint {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  letter-spacing: 0.05em;
}

.progress-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-border);
  z-index: 50;
}

.progress-fill {
  height: 100%;
  background: var(--color-theme);
  transition: width 0.3s ease;
  box-shadow: 0 0 8px var(--color-theme-glow);
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.thought-fade-enter-active,
.thought-fade-leave-active {
  transition: opacity 0.5s ease;
}

.thought-fade-enter-from,
.thought-fade-leave-to {
  opacity: 0;
}

.fade-in-enter-active {
  transition: opacity 0.8s ease;
}

.fade-in-enter-from {
  opacity: 0;
}

.key-quotes {
  border-top: 1px solid var(--color-border);
  padding-top: 1.5rem;
}

.emotion-tag {
  padding-top: 0.5rem;
}
</style>
