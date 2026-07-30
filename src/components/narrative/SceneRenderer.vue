<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';

interface SceneVisuals {
  mainScene: string;
  visualCues: string;
  colorPalette: string[];
  atmosphere: string;
  bgm?: string;
  ambient?: string;
}

interface Props {
  visuals: SceneVisuals;
  characterId?: string;
}

const props = defineProps<Props>();

const containerRef = ref<HTMLElement | null>(null);
const isLoaded = ref(false);

const gradientStyle = computed(() => {
  const colors = props.visuals.colorPalette;
  if (colors.length < 2) return {};

  const darkest = colors[0];
  const mid = colors[Math.floor(colors.length / 2)] ?? colors[0];
  const lightest = colors[colors.length - 1] ?? mid;

  return {
    background: `
      radial-gradient(ellipse at 30% 20%, ${lightest}22 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, ${mid}33 0%, transparent 60%),
      linear-gradient(180deg, ${darkest} 0%, ${mid}88 50%, ${darkest} 100%)
    `,
  };
});

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const particles = ref<Particle[]>([]);

function generateParticles(): Particle[] {
  const count = 20;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.4 + 0.1,
  }));
}

const atmosphereTags = computed(() => {
  return props.visuals.atmosphere.split('、').filter(Boolean);
});

let observer: IntersectionObserver | null = null;

onMounted(() => {
  isLoaded.value = true;
  particles.value = generateParticles();

  if (containerRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scene-visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

watch(
  () => props.visuals,
  () => {
    if (containerRef.value) {
      containerRef.value.classList.remove('scene-visible');
      requestAnimationFrame(() => {
        containerRef.value?.classList.add('scene-visible');
      });
    }
  }
);
</script>

<template>
  <div
    ref="containerRef"
    class="scene-renderer"
    :style="gradientStyle"
  >
    <!-- 粒子层 -->
    <div class="particles-layer">
      <div
        v-for="p in particles"
        :key="p.id"
        class="particle"
        :style="{
          left: p.left + '%',
          top: p.top + '%',
          width: p.size + 'px',
          height: p.size + 'px',
          animationDuration: p.duration + 's',
          animationDelay: p.delay + 's',
          opacity: p.opacity,
        }"
      ></div>
    </div>

    <!-- 雾气层 -->
    <div class="fog-layer fog-layer-1"></div>
    <div class="fog-layer fog-layer-2"></div>

    <!-- 暗角效果 -->
    <div class="vignette"></div>

    <!-- 内容层 -->
    <div class="scene-content">
      <div class="scene-info">
        <div class="scene-label">场景</div>
        <h2 class="scene-title">{{ visuals.mainScene }}</h2>

        <div class="scene-atmosphere">
          <span
            v-for="tag in atmosphereTags"
            :key="tag"
            class="atmosphere-tag"
          >
            {{ tag }}
          </span>
        </div>

        <p class="scene-cues">{{ visuals.visualCues }}</p>

        <div class="color-palette">
          <span
            v-for="(color, i) in visuals.colorPalette"
            :key="i"
            class="color-swatch"
            :style="{ backgroundColor: color }"
            :title="color"
          ></span>
        </div>
      </div>
    </div>

    <!-- 底部渐变遮罩 -->
    <div class="bottom-fade"></div>
  </div>
</template>

<style scoped>
.scene-renderer {
  position: relative;
  width: 100%;
  min-height: 60vh;
  overflow: hidden;
  opacity: 0;
  transition: opacity 1.2s ease;
}

.scene-renderer.scene-visible {
  opacity: 1;
}

.particles-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: var(--color-text);
  animation-name: float-particle;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes float-particle {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-40px) translateX(-5px);
  }
  75% {
    transform: translateY(-20px) translateX(-10px);
  }
}

.fog-layer {
  position: absolute;
  inset: -20%;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    rgba(10, 6, 5, 0.15) 50%,
    rgba(10, 6, 5, 0.4) 100%
  );
}

.fog-layer-1 {
  animation: fog-drift-1 25s linear infinite;
}

.fog-layer-2 {
  animation: fog-drift-2 35s linear infinite;
  opacity: 0.6;
}

@keyframes fog-drift-1 {
  0% {
    transform: translateX(-5%) translateY(0);
  }
  50% {
    transform: translateX(5%) translateY(-3%);
  }
  100% {
    transform: translateX(-5%) translateY(0);
  }
}

@keyframes fog-drift-2 {
  0% {
    transform: translateX(5%) translateY(2%);
  }
  50% {
    transform: translateX(-5%) translateY(-2%);
  }
  100% {
    transform: translateX(5%) translateY(2%);
  }
}

.vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  background: radial-gradient(
    ellipse at center,
    transparent 30%,
    rgba(10, 6, 5, 0.5) 80%,
    rgba(10, 6, 5, 0.9) 100%
  );
}

.bottom-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to bottom, transparent, var(--color-bg));
  z-index: 4;
  pointer-events: none;
}

.scene-content {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 3rem 1.5rem;
}

.scene-info {
  max-width: 42rem;
  text-align: center;
}

.scene-label {
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 0.75rem;
}

.scene-title {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 700;
  color: var(--color-text);
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.8);
  margin-bottom: 1.5rem;
}

.scene-atmosphere {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.atmosphere-tag {
  font-size: 0.8125rem;
  padding: 0.25rem 0.875rem;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: rgba(20, 16, 14, 0.5);
  color: var(--color-theme);
  backdrop-filter: blur(4px);
}

.scene-cues {
  font-size: 0.9375rem;
  line-height: 1.8;
  color: var(--color-text-secondary);
  max-width: 36rem;
  margin: 0 auto 1.5rem;
}

.color-palette {
  display: flex;
  justify-content: center;
  gap: 0.375rem;
}

.color-swatch {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  transition: transform 0.2s ease;
}

.color-swatch:hover {
  transform: scale(1.2);
}
</style>
