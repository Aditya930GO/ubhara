<template>
  <div ref="rdComponent" class="rd-component">
    <div class="rd-progress-bar-outer">
      <div class="rd-progress-bar-inner"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from "gsap";

const props = defineProps<{
  state: "show" | "hide";
}>();

const rdComponent = ref<HTMLDivElement>(null);

const animate = {
  init(rdComponent: HTMLElement): GSAPTimeline {
    const tl: GSAPTimeline = gsap.timeline();

    tl.to(rdComponent, {
      opacity: 1,
      scale: 1,
      duration: 0.25,
      ease: "power4.out",
    });

    return tl;
  },
  exit(rdComponent: HTMLElement): void {
    const tl: GSAPTimeline = gsap.timeline();

    tl.to(rdComponent, {
      opacity: 0,
      scale: 1.125,
      duration: 0.25,
      ease: "power4.out",
    });
  },
};

watch(
  () => props.state,
  (val) => {
    if (val === "hide") animate.exit(rdComponent.value);
  }
);

onMounted(() => {
  setTimeout(() => {
    animate.init(rdComponent.value);
  }, 250);
});
</script>

<style lang="scss" scoped>
.rd-component {
  position: relative;
  width: 10rem;
  height: 2rem;
  padding: 0.75rem;
  border-radius: 1rem;
  box-sizing: border-box;
  background: var(--background-depth-one-color);
  box-shadow: var(--box-shadow);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: scale(0.875);
  .rd-progress-bar-outer {
    position: relative;
    width: 100%;
    height: 0.25rem;
    border-radius: 0.125rem;
    background: var(--background-depth-three-color);
    overflow: hidden;
    display: flex;
    .rd-progress-bar-inner {
      position: absolute;
      top: 0;
      left: 0;
      right: 100%;
      height: 100%;
      background: var(--primary-color);
      border-radius: 0.125rem;
      animation: rd-loading 2s ease infinite;
    }
  }
}
</style>
