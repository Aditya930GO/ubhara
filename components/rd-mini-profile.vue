<template>
  <div class="rd-component">
    <button
      class="rd-dashboard-action"
      @click="dashboardHandler(dashboardOpened ? 'close' : 'open')"
      :style="
        dashboardOpened
          ? 'background: var(--primary-color)'
          : 'background: white'
      "
    >
      <rd-svg
        :name="'analytic'"
        :color="dashboardOpened ? 'white' : 'primary'"
      />
    </button>
    <div class="rd-profile-container">
      <div class="rd-profile-details">
        <span class="rd-profile-name rd-headline-5">Admin</span>
        <div class="rd-profile-roles">
          <span class="rd-profile-role rd-headline-6">BNNP KalSel</span>
        </div>
      </div>
      <div class="rd-profile-actions">
        <button
          class="rd-profile-action"
          @click="dropDownHandler(dropDownOpened ? 'close' : 'open')"
          :style="dropDownOpened ? 'background: var(--primary-color)' : ''"
        >
          <rd-svg
            :name="'chevron-down'"
            :color="dropDownOpened ? 'white' : 'primary'"
            :style="dropDownOpened ? 'transform: rotate(180deg)' : ''"
          />
        </button>
      </div>
      <div
        class="rd-profile-options"
        ref="rdProfileOptions"
        tabindex="-1"
        :class="dropDownOpened ? 'rd-profile-options-opened' : ''"
        @focusout="dropDownHandler('close')"
      >
        <div
          v-for="(action, i) in profileActions"
          :key="i"
          class="rd-profile-option"
          @click="selectOption(action.action)"
          :class="dropDownIndex === i ? 'rd-profile-option-selected' : ''"
        >
          <div class="rd-profile-option-icon-container">
            <rd-svg :name="action.icon" :color="'primary'" />
          </div>
          <span class="rd-profile-option-name rd-body-text">
            {{ action.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from "gsap";

type EmitsName = "logout" | "open-panel-user";

interface Action {
  name: string;
  icon: string;
  action: EmitsName;
}

const emits = defineEmits(["logout", "open-panel", "open-panel-user"]);
const config = useRuntimeConfig();
const { user } = useUser();

const rdProfileOptions = ref<HTMLDivElement>(null);

const dropDownAnim = ref<GSAPAnimation>(null);
const dropDownOpened = ref<boolean>(false);
const dashboardOpened = ref<boolean>(false);
const dropDownIndex = ref<number>(-1);

const profileActions: Action[] = [
  {
    name: "Ganti Password",
    icon: "account",
    action: "open-panel-user",
  },
  {
    name: "Logout",
    icon: "logout",
    action: "logout",
  },
  {
    name: "Export Excel",
    icon: "logout",
    action: "logout",
  },
];

const animate = {
  dropDownHandler(
    rdProfileOptions: HTMLElement,
    cb?: () => void
  ): GSAPTimeline {
    const tl: GSAPTimeline = gsap.timeline({
      paused: true,
      onComplete() {
        if (cb) cb();
      },
    });

    tl.to(rdProfileOptions, {
      scale: 1,
      opacity: 1,
      duration: 0.25,
      ease: "power2.inOut",
    });

    return tl;
  },
};

function dashboardHandler(state: "open" | "close"): void {
  if (state === "open") {
    console.log(dashboardOpened.value);
    dashboardOpened.value = true;
    emits("open-panel", {
      state: "show",
      type: "analytics",
    });
    console.log("dashboardOpened.value");
    console.log(dashboardOpened.value);
  } else {
    emits("open-panel", {
      state: "hide",
      type: "analytics",
    });
    dashboardOpened.value = false;
    setTimeout(() => {
      if (dashboardOpened.value) {
        dashboardOpened.value = false;
      }
    }, 10);
  }
}

function dropDownHandler(state: "open" | "close"): void {
  if (!dropDownAnim.value)
    dropDownAnim.value = animate.dropDownHandler(rdProfileOptions.value);
  if (state === "open") {
    rdProfileOptions.value.focus();
    dropDownOpened.value = true;
    dropDownIndex.value = -1;
    dropDownAnim.value.play();
  } else {
    setTimeout(() => {
      if (dropDownOpened.value) {
        dropDownOpened.value = false;
        dropDownIndex.value = -1;
        dropDownAnim.value.reverse();
      }
    }, 10);
  }
}

function selectOption(action: EmitsName): void {
  dropDownHandler("close");
  emits(action);
}
</script>

<style lang="scss" scoped>
.rd-component {
  position: relative;
  width: 100%;
  height: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .rd-dashboard-action {
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    z-index: 20000;
    // box-shadow: var(--box-shadow);
    background: white;
    overflow: hidden;
    border: 1px solid var(--primary-color);
    display: flex;
    flex-shrink: 0;
    padding: 0 0.3rem;
    background: white;
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
  .rd-profile-container {
    justify-content: flex-end;
    width: calc(100% - 2rem);
    height: 2.1rem;
    z-index: 20000;
    align-items: center;
    background: white;
    overflow: hidden;
    display: flex;
    flex-shrink: 0;
    background: white;
    margin: 0.5rem 0;
    .rd-profile-details {
      position: relative;
      width: calc(100% - 7rem);
      height: 100%;
      margin-right: 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;

      span.rd-profile-name {
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        color: var(--primary-color);
        text-overflow: ellipsis;
      }
      .rd-profile-roles {
        position: relative;
        width: 100%;
        height: 1rem;
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-start;
        align-items: center;
        .rd-profile-role {
          position: relative;
          height: 100%;
          border-radius: 0.5rem;
          // padding: 0 0.375rem;
          // background: red;
          margin-left: 0.25rem;
          color: var(--font-color);
          line-height: 1;
          text-transform: capitalize;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .rd-profile-actions {
      border: 1px solid var(--primary-color);
      position: relative;
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      background: var(--background-depth-two-color);
      overflow: hidden;
      display: flex;
      flex-shrink: 0;
      > * {
        cursor: pointer;
        position: relative;
        width: 2rem;
        height: 2rem;
        background: white;
        border: none;
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
      }
      .rd-profile-image-container {
        overflow: hidden;
        img.rd-profile-image {
          position: relative;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .rd-profile-action {
        padding: 0 0.2rem;
        box-sizing: border-box;
        transition: background-color 0.25s;
        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
      }
    }
    .rd-profile-options {
      z-index: 20000;
      pointer-events: none;
      position: absolute;
      border: 1px solid var(--primary-color);
      top: 100%;
      left: 0;
      width: 100%;
      background: var(--background-depth-one-color);
      box-shadow: var(--box-shadow);
      opacity: 0;
      padding: 0.5rem;
      border-radius: 0.5rem;
      box-sizing: border-box;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transform: scale(1.125);
      .rd-profile-option {
        cursor: pointer;
        position: relative;
        width: 100%;
        height: 2rem;
        background: rgba(0, 0, 0, 0);
        padding: 0 0.75rem 0 0;
        border-radius: 0.25rem;
        box-sizing: border-box;
        display: flex;
        flex-shrink: 0;
        align-items: center;
        transition: background-color 0.25s;
        .rd-profile-option-icon-container {
          position: relative;
          width: 2rem;
          height: 2rem;
          padding: 0 0.5rem;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        span.rd-profile-option-name {
          position: relative;
        }
        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
      }
      &.rd-profile-options-opened {
        pointer-events: all;
      }
    }
  }
}
</style>
