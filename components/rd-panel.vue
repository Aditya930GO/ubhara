<template>
  <div class="rd-panel" ref="rdPanel">
    <div
      class="rd-panel-header"
      :class="headerActive ? 'rd-panel-header-active' : ''"
    >
      <rd-input-button-small
        class="rd-panel-button"
        :icon="'chevron-left'"
        @clicked="exit"
      />
      <h2 class="rd-panel-title rd-headline-2">{{ props.label }}</h2>
      <rd-input-button-small
        v-if="props.delete"
        class="rd-delete-button"
        :icon="'delete'"
        :delete="true"
        @clicked="deleteInmate"
      />
      <rd-input-button-small
        v-if="props.edit"
        class="rd-edit-button"
        :icon="'edit-outline'"
        @clicked="edit"
      />
    </div>
    <div class="rd-panel-body" @scroll="scrollHandler">
      <h2 class="rd-panel-title rd-headline-2">{{ props.label }}</h2>
      <div class="rd-panel-content">
        <slot></slot>
      </div>
    </div>
    <div
      class="rd-panel-overlay"
      :class="loading ? 'rd-panel-overlay-active' : ''"
    >
      <rd-progress-bar
        :state="loading ? 'show' : 'hide'"
        class="rd-panel-overlay-loading"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from "gsap";
import { ComputedRef } from "vue";

const props = defineProps<{
  label: string;
  state: "idle" | "hide";
  edit?: boolean;
  delete?: boolean;
  loading?: boolean;
}>();
const emits = defineEmits(["exit", "edit", "delete-inmate"]);

const rdPanel = ref<HTMLDivElement>(null);

const scrollValue = ref<number>(0);
const scrollThreshold = ref<number>(0);

const rem: ComputedRef<number> = computed((): number =>
  typeof getComputedStyle === "function"
    ? parseInt(getComputedStyle(document.body).fontSize)
    : 0
);
const headerActive: ComputedRef<boolean> = computed(
  (): boolean => scrollValue.value >= scrollThreshold.value
);

const animate = {
  init(rdPanel: HTMLElement): void {
    const tl: GSAPTimeline = gsap.timeline();

    tl.to(rdPanel, {
      opacity: 1,
      scale: 1,
      duration: 0.25,
      ease: "power2.inOut",
    });
  },
  exit(rdPanel: HTMLElement, cb?: () => void): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });

    tl.to(rdPanel, {
      opacity: 0,
      scale: 1.125,
      duration: 0.25,
      ease: "power2.inOut",
    });
  },
};

function scrollHandler({ target }: Event): void {
  if (target instanceof HTMLElement) {
    scrollValue.value = target.scrollTop;
  }
}

function exit(): void {
  animate.exit(rdPanel.value, () => {
    emits("exit");
  });
}
function edit(): void {
  animate.exit(rdPanel.value, () => {
    emits("exit");
    emits("edit");
  });
}
function deleteInmate(): void {
  animate.exit(rdPanel.value, () => {
    emits("exit");
    emits("delete-inmate");
  });
}

watch(
  () => props.state,
  (val) => {
    if (val === "hide") exit();
  }
);

onMounted(() => {
  scrollThreshold.value = 2 * rem.value;
  animate.init(rdPanel.value);
});
</script>

<style lang="scss" scoped>
.rd-panel {
  z-index: 4;
  position: fixed;
  right: 1rem;
  width: 20rem;
  height: 100vh;
  background: var(--background-depth-one-color);
  border-left: 1px solid var(--border-color);
  overflow-y: hidden;
  overflow-x: visible;
  opacity: 0;
  display: flex;
  flex-direction: column;
  transform: scale(0.875);
  .rd-panel-header {
    z-index: 2;
    position: relative;
    width: 100%;
    height: 4rem;
    background: var(--background-depth-one-color);
    padding: 1rem;
    box-sizing: border-box;
    box-shadow: 0 0.5rem 0.5rem 0.5rem var(--background-depth-one-color);
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    .rd-panel-button {
      position: absolute;
      top: 1rem;
      left: 1rem;
    }
    .rd-edit-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
      &.rd-edit-button-inactive {
        right: -10rem;
        display: none;
        visibility: hidden;
      }
    }
    .rd-delete-button {
      position: absolute;
      top: 1rem;
      right: 3.25rem;
      &.rd-edit-button-inactive {
        right: -10rem;
        display: none;
        visibility: hidden;
      }
    }
    .rd-panel-title {
      position: relative;
      opacity: 0;
      transform: scale(0.875);
      transition: 0.25s opacity, 0.25s transform;
    }
    &.rd-panel-header-active {
      box-shadow: none;
      .rd-panel-title {
        opacity: 1;
        transform: scale(1);
      }
      &::after {
        opacity: 0.05;
      }
    }
    &::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      height: 1px;
      background: var(--font-color);
      opacity: 0;
      transition: 0.25s opacity;
    }
  }
  .rd-panel-body {
    z-index: 1;
    position: relative;
    width: 100%;
    height: calc(100% - 4rem);
    padding: 1rem 0;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    h2.rd-panel-title {
      position: relative;
      width: 100%;
      height: 1rem;
      margin-bottom: 1rem;
      padding: 0 1rem;
      box-sizing: border-box;
      display: flex;
      flex-shrink: 0;
      align-items: center;
    }
    .rd-panel-content {
      position: relative;
      width: 100%;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
    }
  }
  .rd-panel-overlay {
    pointer-events: none;
    z-index: 999999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.25s opacity;
    .rd-panel-overlay-loading {
      z-index: 2;
    }
    &::before {
      z-index: 0;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(5px);
    }
    &::after {
      z-index: 1;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--font-color);
      opacity: 0.25;
    }
    &.rd-panel-overlay-active {
      pointer-events: all;
      opacity: 1;
    }
  }
  @media only screen and (max-width: 1024px) {
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    .rd-panel-header {
      height: 5rem;
      padding: 1.5rem;
      .rd-panel-button {
        top: 1.5rem;
        left: 1.5rem;
      }
    }
    .rd-panel-body {
      height: calc(100% - 5rem);
      h2.rd-panel-title {
        padding: 0 1.5rem;
      }
    }
  }
}
</style>
