import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * 初始化 GSAP 并注册插件
 * 在客户端环境中调用
 */
export function initGsap(): void {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
}

/**
 * 创建场景切换动画
 * @param element 要动画的元素
 * @param direction 'in' | 'out'
 */
export function sceneTransition(
  element: HTMLElement,
  direction: 'in' | 'out'
): gsap.core.Tween {
  if (direction === 'in') {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 30, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }
    );
  } else {
    return gsap.to(element, {
      opacity: 0,
      y: -30,
      filter: 'blur(10px)',
      duration: 0.5,
      ease: 'power2.in',
    });
  }
}

/**
 * 创建滚动驱动的渐入动画
 */
export function scrollReveal(element: HTMLElement, options?: {
  y?: number;
  duration?: number;
  start?: string;
}): gsap.core.Tween {
  return gsap.fromTo(
    element,
    { opacity: 0, y: options?.y ?? 40 },
    {
      opacity: 1,
      y: 0,
      duration: options?.duration ?? 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: options?.start ?? 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );
}

export { gsap, ScrollTrigger };
