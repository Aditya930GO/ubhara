<template>
  <button class="rd-input-component"
    :class="!userDatas.opened ? 'rd-input-component-disabled' : userDatas.attendances ? 'present' : 'absent'"
    ref="rdInputComponent" :disabled="!userDatas.opened" @mousedown="mouseDownHandler">
    <div class="rd-input-icon-container">
      <rd-svg :name="Object.values(props.data.attend).indexOf(props.user_id) > -1 ? 'check' : 'minus'"
        :color="userDatas.attendances ? 'secondary' : 'error'" />
    </div>
    <div class="rd-input-overlay"></div>
  </button>
</template>

<script lang="ts" setup>
import gsap from "gsap";

const props = defineProps<{
  user_id: string;
  data;
  delete?: boolean;
  disabled?: boolean;
}>();
const emits = defineEmits(["clicked"]);

const rdInputComponent = ref<HTMLButtonElement>(null);

const buttonAnimating = ref<boolean>(false);
const buttonClicking = ref<boolean>(false);
const buttonPressed = ref<boolean>(false);
var present = (false);

const userDatas = ref<USERSTYPE>({
  attendances: false,
  opened: false,
});
interface USERSTYPE {
  attendances: boolean
  opened: boolean
}

const animate = {
  click(rdInputComponent: HTMLElement, cb?: () => void): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });

    const rdOverlay: HTMLElement =
      rdInputComponent.querySelector(".rd-input-overlay");

    tl.to(rdInputComponent, {
      scale: 0.95,
      duration: 0.25,
      ease: "power2.out",
    }).to(
      rdOverlay,
      {
        opacity: 1,
        duration: 0.25,
        ease: "power2.inOut",
      },
      "<0"
    );
  },
  release(rdInputComponent: HTMLElement, cb?: () => void): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });

    const rdOverlay: HTMLElement =
      rdInputComponent.querySelector(".rd-input-overlay");

    tl.to(rdInputComponent, {
      scale: 1,
      duration: 0.25,
      ease: "back.out(2)",
    }).to(
      rdOverlay,
      {
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
      },
      "<0"
    );
  },
};

function mouseDownHandler(): void {
  buttonAnimating.value = true;
  buttonClicking.value = true;
  buttonPressed.value = true;
  animate.click(rdInputComponent.value, () => {
    buttonClicking.value = false;
    if (!buttonPressed.value) {
      mouseUpHandler();
    }
  });
  window.addEventListener("mouseup", mouseUpHandler);
}
function mouseUpHandler(): void {
  window.removeEventListener("mouseup", mouseUpHandler);
  buttonPressed.value = false;
  if (!buttonClicking.value) {
    emits("clicked");
    animate.release(rdInputComponent.value, () => {
      buttonAnimating.value = false;
    });
  }
}
onMounted(() => {
  if (Object.values(props.data.attend).indexOf(props.user_id) > -1) userDatas.value.attendances = true
  if (props.data.opened === true) userDatas.value.opened = true
})
onBeforeUnmount(() => {
  window.removeEventListener("mouseup", mouseUpHandler);
});
</script>

<style lang="scss" scoped>
button.rd-input-component {
  cursor: pointer;
  position: relative;
  width: 2rem;
  height: 2rem;
  display: flex;
  border-radius: 0.5rem;
  margin: 0;
  padding: 0 0.5rem;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  align-items: center;
  // border: 1px solid var(--primary-color);
  // background: var(--background-depth-two-color);

  &.present {
    border: 1px solid green;
    background: rgba($color: #8fff89, $alpha: 0.5);
  }

  &.absent {
    border: 1px solid var(--error-color);
    background: rgba($color: #ff3e30b4, $alpha: 0.5);
  }

  &.loading {
    border: 1px solid rgba($color: #fbff00eb, $alpha: 0.5);
    background: rgba($color: #e9e25eb4, $alpha: 0.5);
  }

  * {
    pointer-events: none;
  }

  .rd-input-icon-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .rd-input-overlay {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 0.5rem;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    opacity: 0;
  }

  &.rd-input-component-disabled {
    pointer-events: none;
    filter: grayscale(0.75);
    opacity: 0.5;
  }
}
</style>
