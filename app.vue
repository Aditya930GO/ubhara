<template>
  <div class="rd-layout">
    <section class="rd-body">
      <header class="rd-body-header" v-if="user && route.path !== '/login'">
        <div class="rd-body-header-left">
          <div class="rd-body-header-logo-container">
            <img class="logo" :src="'./logo.png'" />
          </div>

          <div class="rd-body-header-details">
            <h3 class="rd-body-header-caption rd-headline-5">
              Sistem Informasi Universitas Bhayangkara Surabaya
            </h3>
            <h1 class="rd-body-header-title rd-headline-1">
              Universitas Bhayangkara Surabaya
            </h1>
          </div>
        </div>
        <div class="rd-profile-container">
          <div class="rd-profile-details">
            <span class="rd-profile-name rd-headline-5">{{ user.name.toUpperCase() }}</span>
            <div class="rd-profile-roles">
              <span class="rd-profile-role rd-headline-6">{{ user.role }}</span>
            </div>
          </div>
          <div class="rd-profile-actions">
            <button class="rd-profile-action" @focusout="dropDownCloser()" @click="
              dropDownState ? (dropDownState = false) : (dropDownState = true)
            " :style="dropDownOpened ? 'background: var(--primary-color)' : ''">
              <rd-svg :name="'chevron-down'" :color="dropDownOpened ? 'white' : 'primary'"
                :style="dropDownState ? 'transform: rotate(180deg)' : ''" />
            </button>
          </div>
          <div v-if="dropDownState" class="actions-container" @focusout="dropDownCloser()">
            <div ripple class="action"
              @click="dropDownState = false, panelHandler({ state: 'show', type: 'rd-user-form' })">
              <div class="rd-icon-container">
                <rd-svg class="icon" :name="'account'" :color="dropDownState ? 'primary' : 'primary'" />
              </div>
              <span class="name">Account</span>
            </div>
            <div ripple class="action" @click="dropDownState = false, exit()">
              <div class="rd-icon-container">
                <rd-svg class="icon" :name="'logout'" :color="dropDownState ? 'primary' : 'primary'"
                  :style="dropDownState ? 'transform: rotate(180deg)' : ''" />
              </div>
              <span class="name">Logout</span>
            </div>
          </div>
        </div>
      </header>

      <main class="rd-body-content">
        <nuxt-page @open-panel="panelHandler" @logout="exit" />
      </main>
      <rd-add-class-panel v-if="panelOpened === 'add-class-form'" :state="panelState" :data="panelData[0]"
        @exit="panelHandler({ state: 'hide' })" />
      <rd-user-form-panel v-if="panelOpened === 'rd-user-form'" :state="panelState" :data="panelData[0]"
        @exit="panelHandler({ state: 'hide' })" />
      <rd-analytics v-if="user && route.path !== '/login'" :state="panelState" :data="panelData[0]"
        @exit="panelHandler({ state: 'hide' })" />
      <!-- <rd-inmate-form-panel :state="panelState" :data="panelData[0]" @exit="panelHandler({ state: 'hide' })" /> -->
    </section>
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
interface NavigationLink {
  to: string;
  name: string;
  icon: string;
}
interface PanelHandlerOption {
  state: "show" | "hide";
  type?: PanelType;
  data?: any;
}

type PanelType =
  | "attendance"
  | "logs"
  | "rd-user-form"
  | "login-form"
  | "user-form"
  | "employee-role-form"
  | "add-class-form";

const emits = defineEmits(["logout", "open-panel", "open-panel-user"]);
const { user, refresh, logout } = useUser();
const { viewMode } = useMain();
const route = useRoute();

const rdLayout = ref<HTMLDivElement>(null);
const rdHeader = ref<HTMLElement>(null);
const rdNavigation = ref<HTMLElement>(null);
const rdOverview = ref<HTMLElement>(null);
const rdBody = ref<HTMLElement>(null);
const rdProfileOptions = ref<HTMLDivElement>(null);

const panelState = ref<"idle" | "hide">("idle");
const panelData = ref<any[]>([]);
const panelOpened = ref<PanelType>(null);
const panelSequence = ref<PanelType[]>([]);

const dropDownAnim = ref<GSAPAnimation>(null);
const dropDownState = ref<boolean>(false);
const dropDownOpened = ref<boolean>(false);
const navigationAnim = ref<GSAPTimeline>(null);
const navigationOpened = ref<boolean>(false);
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

const navigationLinks: NavigationLink[] = [
  {
    to: "/",
    name: "Home",
    icon: "dashboard",
  },
  {
    to: "/inventory",
    name: "Inventory",
    icon: "inventory",
  },
  {
    to: "/transaction",
    name: "Transactions",
    icon: "transaction",
  },
  {
    to: "/employee",
    name: "Employees",
    icon: "account-multiple",
  },
  {
    to: "/customer",
    name: "Customers",
    icon: "customer",
  },
  {
    to: "/supplier",
    name: "Suppliers",
    icon: "supplier",
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
  init(
    viewMode: "desktop" | "mobile",
    rdNavigation: HTMLElement,
    rdOverview: HTMLElement,
    rdHeader: HTMLElement,
    cb?: () => void
  ): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });
  },
  exit(
    viewMode: "desktop" | "mobile",
    rdNavigation: HTMLElement,
    rdOverview: HTMLElement,
    rdHeader: HTMLElement,
    cb?: () => void
  ): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });
  },
  exitPage(rdBody: HTMLElement, cb?: () => void): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
        setTimeout(() => {
          gsap.to(rdBody, {
            opacity: 1,
            duration: 0,
          });
        }, 250);
      },
    });

    tl.to(rdBody, {
      opacity: 0,
      duration: 0.25,
    });
  },
  navigationHandler(
    viewMode: "desktop" | "mobile",
    rdHeader: HTMLElement,
    rdNavigation: HTMLElement,
    rdBody: HTMLElement,
    cb?: () => void
  ): GSAPTimeline {
    const tl: GSAPTimeline = gsap.timeline({
      paused: true,
      onComplete() {
        if (cb) cb();
      },
    });

    const rdNavigationButton: HTMLElement =
      viewMode === "desktop"
        ? rdNavigation.querySelector("button.rd-navigation-button")
        : rdHeader.querySelector("button.rd-header-navigation-button");
    const rdNavigationButtonBarOne: HTMLElement =
      rdNavigationButton.querySelector(
        viewMode === "desktop"
          ? ".rd-navigation-button-bar:first-child"
          : ".rd-header-navigation-button-bar:first-child"
      );
    const rdNavigationButtonBarTwo: HTMLElement =
      rdNavigationButton.querySelector(
        viewMode === "desktop"
          ? ".rd-navigation-button-bar:last-child"
          : ".rd-header-navigation-button-bar:last-child"
      );
    const rdNavigationLinkBackground: HTMLElement[] = gsap.utils.toArray(
      rdNavigation.querySelectorAll(".rd-navigation-link-background")
    );
    const rdNavigationTextContainer: HTMLElement[] = gsap.utils.toArray(
      rdNavigation.querySelectorAll(".rd-text-container")
    );
    const rdNavigationText: HTMLElement[] = gsap.utils.toArray(
      rdNavigation.querySelectorAll(".rd-text")
    );

    if (viewMode === "desktop") {
      tl.to(rdNavigation, {
        width: "12.5rem",
        duration: 0.5,
        ease: "power4.inOut",
      })
        .to(
          rdNavigationLinkBackground,
          {
            width: "10.5rem",
            duration: 0.5,
            ease: "power4.inOut",
          },
          "<0"
        )
        .to(
          rdNavigationButton,
          {
            x: "6.5rem",
            duration: 0.5,
            ease: "power4.inOut",
          },
          "<0"
        )
        .to(
          rdNavigationTextContainer,
          {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power4.inOut",
          },
          "<0"
        )
        .to(
          rdNavigationText,
          {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power4.inOut",
          },
          "<0"
        )
        .to(
          rdBody,
          {
            scale: 0.875,
            opacity: 0.5,
            duration: 0.5,
            ease: "power4.inOut",
          },
          "<0"
        );
    } else {
      const rdNavigationBackground: HTMLElement = rdNavigation.querySelector(
        ".rd-navigation-background"
      );
      const rdNavigationLinks: HTMLElement[] = gsap.utils.toArray(
        rdNavigation.querySelectorAll("a.rd-navigation-link")
      );

      tl.to(
        rdBody,
        {
          scale: 0.75,
          opacity: 0.5,
          duration: 0.5,
          ease: "power4.inOut",
        },
        "<0"
      )
        .to(
          rdHeader,
          {
            x: "1rem",
            y: "1rem",
            width: "-=2rem",
            duration: 0.5,
            ease: "power4.inOut",
          },
          "<0"
        )
        .to(
          rdNavigationBackground,
          {
            width: "100%",
            height: "100%",
            borderRadius: "1rem",
            duration: 0.5,
            ease: "power4.inOut",
          },
          "<0"
        )
        .to(
          rdNavigationLinks,
          {
            opacity: 1,
            duration: 0.25,
          },
          "<0.25"
        );
    }

    tl.to(
      rdNavigationButtonBarOne,
      {
        x: "-0.375rem",
        width: 0,
        duration: 0.25,
      },
      "<0"
    )
      .to(
        rdNavigationButtonBarTwo,
        {
          x: "0.375rem",
          width: 0,
          duration: 0.25,
        },
        "<0"
      )
      .to(rdNavigationButtonBarOne, {
        y: "-0.375rem",
        rotateZ: 45,
        duration: 0,
      })
      .to(rdNavigationButtonBarTwo, {
        y: "-0.375rem",
        rotateZ: -45,
        duration: 0,
      })
      .to(rdNavigationButtonBarOne, {
        x: 0,
        y: 0,
        width: "0.75rem",
        duration: 0.25,
      })
      .to(
        rdNavigationButtonBarTwo,
        {
          x: 0,
          y: 0,
          width: "0.75rem",
          duration: 0.25,
        },
        "<0"
      );

    return tl;
  },
  overviewHandler(
    state: "show" | "hide",
    viewMode: "desktop" | "mobile",
    rdOverview: HTMLElement,
    cb?: () => void
  ): GSAPTimeline {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });

    return tl;
  },
};

function dropDownCloser(): void {
  setTimeout(() => {
    dropDownState.value = false;
  }, 250);
}
function test1(): void {
  console.log("test1");
}
function selectOption(action: EmitsName): void {
  dropDownHandler("close");
  emits(action);
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

function navigationHandler(state: "open" | "close"): void {
  if (user.value) {
    if (!navigationAnim.value)
      navigationAnim.value = animate.navigationHandler(
        viewMode.value,
        rdHeader.value,
        rdNavigation.value,
        rdBody.value,
        () => {
          navigationOpened.value = true;
        }
      );
    if (state === "open") {
      navigationAnim.value.play();
    } else {
      navigationOpened.value = false;
      navigationAnim.value.reverse();
    }
  }
}

function overviewHandler(state: "show" | "hide", cb?: () => void): void {
  animate.overviewHandler(state, viewMode.value, rdOverview.value, cb);
}

function panelHandler({ state, type, data }: PanelHandlerOption): void {
  if (state === "show") {
    panelSequence.value.unshift(type);
    if (panelSequence.value.length === 1) {
      panelState.value = "idle";
      overviewHandler("hide", () => {
        panelData.value.unshift(data);
        panelOpened.value = panelSequence.value[0];
      });
    } else {
      panelState.value = "hide";
      setTimeout(() => {
        panelData.value.unshift(data);
        panelOpened.value = panelSequence.value[0];
      }, 250);
    }
  } else {
    panelOpened.value = null;
    if (panelState.value === "hide") {
      panelState.value = "idle";
      if (panelSequence.value[0] === panelSequence.value[1]) {
        panelData.value.splice(1, 1);
        panelSequence.value.splice(1, 1);
      }
    } else {
      panelData.value.splice(0, 1);
      panelSequence.value.splice(0, 1);
      if (panelSequence.value[0]) {
        setTimeout(() => {
          panelOpened.value = panelSequence.value[0];
        }, 50);
      } else {
        overviewHandler("show");
      }
    }
  }
}

function resizeHandler(e: MediaQueryList | MediaQueryListEvent): void {
  if (e.matches) viewMode.value = "mobile";
  else viewMode.value = "desktop";
}

function exit(): void {
  animate.exit(
    viewMode.value,
    rdNavigation.value,
    rdOverview.value,
    rdHeader.value,
    () => {
      logout();
      navigate("/login");
      panelHandler({ state: "show", type: "login-form" });
    }
  );
}

function shake(): void {
  rdLayout.value.classList.add("rd-layout-shake");
  setTimeout(() => {
    rdLayout.value.classList.remove("rd-layout-shake");
  }, 500);
}

function navigate(to: string): void {
  navigationHandler("close");
  animate.exitPage(rdBody.value, () => {
    navigateTo(to);
  });
}

watch(
  () => viewMode.value,
  (val, oldVal) => {
    if (val && oldVal) location.reload();
  }
);

watch(
  () => route.path,
  (val: string, oldVal: string) => {
    if (oldVal === "/login" && val) {
      panelHandler({ state: "hide", type: "login-form" });
      setTimeout(() => {
        animate.init(
          viewMode.value,
          rdNavigation.value,
          rdOverview.value,
          rdHeader.value
        );
      }, 500);
      // } else if (oldVal === "/signup" && val) {
      //   panelHandler({ state: "hide", type: "signup-form" });
      //   setTimeout(() => {
      //     animate.init(
      //       viewMode.value,
      //       rdNavigation.value,
      //       rdOverview.value,
      //       rdHeader.value
      //     );
      //   }, 500);
    } else {
      // panelHandler({ state: "show", type: "login-form" });
    }
  }
);

onMounted(async () => {
  const mediaQuery: MediaQueryList = window.matchMedia("(max-width: 1024px)");
  mediaQuery.addEventListener("change", resizeHandler);
  resizeHandler(mediaQuery);
  await refresh();
  if (user.value) {
    // panelHandler({ state: "hide", type: "login-form" });
    animate.init(
      viewMode.value,
      rdNavigation.value,
      rdOverview.value,
      rdHeader.value
    );
    // console.log("c1");
  } else {
    // panelHandler({ state: "show", type: "login-form" });
    // console.log("c2");
  }
});
</script>

<style lang="scss" scoped>
.rd-layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  overflow: hidden;

  .rd-body {
    overflow-y: scroll;
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--background-depth-three-color);

    header.rd-body-header {
      z-index: 54;
      position: fixed;
      // width: 100%;
      width: calc(100%);
      height: 4rem;
      padding-right: 2rem;
      top: 0;
      display: flex;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      // background: var(--background-depth-three-color);

      .rd-body-header-left {
        padding-left: 2rem;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        background: var(--background-depth-three-color);
        // background: red;

        .rd-body-header-logo-container {
          position: relative;
          width: 3rem;
          height: 3rem;
          margin-right: 0.75rem;
          display: flex;
          justify-content: center;
          align-items: center;

          img.logo {
            height: 3rem;
            height: 3rem;
            position: relative;
          }
        }

        .rd-body-header-details {
          h3.rd-body-header-caption {
            color: var(--secondary-font-color);
            font-weight: 800;
            font-family: "Quicksand";
            margin-bottom: 0.175rem;
            transform: translateY(0.225rem);
          }

          h1.rd-body-header-title {
            font-weight: 1000;
            position: relative;
          }
        }
      }

      .rd-profile-container {
        justify-content: flex-end;
        width: 20%;
        left: 1rem;
        height: 2.5rem;
        z-index: 20000;
        align-items: center;
        // background: white;
        overflow: hidden;
        display: flex;
        flex-shrink: 0;
        margin: 0.5rem 0;

        .rd-profile-details {
          position: relative;
          width: calc(100% - 7rem);
          height: 100%;
          margin-right: 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;

          span.rd-profile-name {
            height: 1rem;
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            font-size: medium;
            color: var(--font-color);
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
          height: 1.75rem;
          width: 1.75rem;
          border-radius: 40%;
          overflow: hidden;
          background: var(--background-depth-two-color);
          display: flex;
          flex-shrink: 0;

          >* {
            cursor: pointer;
            position: relative;
            width: 1.75rem;
            height: 1.75rem;
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

        .actions-container {
          z-index: 1000000;
          position: absolute;
          top: 80%;
          right: 2rem;
          border-radius: 0.75rem;
          background: var(--background-depth-two-color);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;

          .action {
            cursor: pointer;
            position: relative;
            width: 10rem;
            height: 2rem;
            flex-shrink: 0;
            background: rgba(255, 255, 255, 0);
            transition: 0.25s background-color;
            padding: 0 0.5rem;
            box-sizing: border-box;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .rd-icon-container {
              font-size: 1rem;
              width: 1.25rem;
            }

            .name {
              // font-family: "Quicksand";
              font-size: 0.65rem;
              font-weight: 600;
              margin-left: 0.5rem;
            }

            &.error {
              color: var(--error-color);

              .icon {
                color: inherit;
              }

              h3.name {
                color: inherit;
              }
            }

            &:hover {
              background: rgba(230, 230, 230, 0.5);
            }

            &:first-child {
              border-top-left-radius: 18px;
              border-top-right-radius: 18px;
            }

            &:last-child {
              border-bottom-left-radius: 18px;
              border-bottom-right-radius: 18px;
            }
          }

          .divider {
            position: relative;
            width: calc(100% - 1rem);
            height: 1px;
            flex-shrink: 0;
            margin: 0 0.5rem;
            background: rgba(0, 0, 0, 0.05);
          }
        }

        .rd-profile-options {
          z-index: 20000;
          pointer-events: none;
          position: absolute;
          border: 1px solid var(--primary-color);
          top: 100%;
          left: 0;
          width: 10%;
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

    .rd-horizontal-menu {
      overflow-x: auto;
      z-index: 99;
      width: 100vw;
      background: blue;
      position: fixed;
      top: 4rem;
      height: 1rem;
      // padding: 0 2rem 0  2rem;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;
    }

    main.rd-body-content {
      position: relative;
      width: 100%;
      background: var(--background-depth-three-color);
      height: calc(100% - 4rem);
    }
  }
}
</style>
<style lang="scss">
// ::-webkit-scrollbar {
//   display: none;.
// }
:root {
  --error-color: #fe5e47;
  --success-color: #08aa7c;
  // --font-color: #fff;
  --font-color: #000;
  --primary-color: #cfcd4d;
  --border-color: #383533;
  --secondary-color: #49472f;
  // --background-depth-one-color: #301e0d;
  // --background-depth-two-color: #201409;
  // --background-depth-three-color: #100a04;
  // --background-depth-four-color: #503216;
  // --background-depth-five-color: #402812;
  --background-depth-one-color: #fff;
  --background-depth-two-color: #fcfce1;
  --background-depth-three-color: #fffbd2;
  --background-depth-four-color: #fdfcb5cb;
  --background-depth-five-color: #edd5bf;
  // --box-shadow: 0 0.5rem 1rem rgba(50, 50, 50, 0.125);
  --box-shadow: 0 0.5rem 1rem rgba(199, 199, 199, 0.125);
}

input,
textarea {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

html,
body {
  .element::-webkit-scrollbar {
    width: 0 !important;
  }

  font-family: "Quicksand",
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Roboto,
  "Helvetica Neue",
  Arial,
  sans-serif;
  font-size: 24px;
  color: var(--font-color);
  word-spacing: 1px;
  width: 100vw;
  height: 100vh;
  line-height: 1.5;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-x: hidden;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;

  @media only screen and (max-width: 1599px) {
    font-size: 21px;
  }

  @media only screen and (max-width: 1479px) {
    font-size: 20px;
  }

  @media only screen and (max-width: 1379px) {
    font-size: 19px;
  }

  @media only screen and (max-width: 1319px) {
    font-size: 18px;
  }

  @media only screen and (max-width: 1024px) {
    font-size: 24px;
  }

  @media only screen and (max-width: 360px) and (min-width: 321px) {
    font-size: 21px;
  }

  @media only screen and (max-width: 320px) {
    font-size: 19px;
  }
}

.rd-headline-1 {
  font-family: "Inconsolata";
  font-weight: 700;
  font-size: 1.15rem;
}

.rd-headline-2 {
  font-family: "Inconsolata";
  font-weight: 700;
  font-size: 1rem;
}

.rd-headline-3 {
  font-family: "Inconsolata";
  font-weight: 700;
  font-size: 0.85rem;
}

.rd-headline-4 {
  font-family: "Inconsolata";
  font-weight: 700;
  font-size: 0.75rem;
}

.rd-headline-5 {
  font-family: "Inconsolata";
  font-weight: 700;
  font-size: 0.65rem;
}

.rd-headline-6 {
  font-family: "Inconsolata";
  font-weight: 700;
  font-size: 0.55rem;
}

.rd-caption-text {
  font-family: "Inconsolata";
  font-size: 0.55rem;
  font-weight: 400;
  line-height: 1.15;
}

.rd-subtitle-text {
  font-size: 0.65rem;
  font-weight: 500;
  font-family: "Inconsolata";
}

.rd-body-text {
  font-size: 0.6rem;
  font-weight: 500;
  font-family: "Inconsolata";
}

.rd-body-text-1 {
  font-size: 0.8rem;
  font-weight: 500;
  font-family: "Inconsolata";
}

.rd-body-text-2 {
  font-size: 0.6rem;
  font-weight: 500;
  font-family: "Inconsolata";
}

.rd-caption-text {
  font-size: 0.55rem;
  font-family: "Inconsolata";
  font-weight: 500;
}

.rd-button-text {
  font-family: "Inconsolata";
  font-size: 0.55rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.125rem;
  transform: translateX(0.0625rem);
}

h1,
h2,
h3,
h4,
h5,
h6,
p {
  padding: 0;
  margin: 0;
}

@keyframes rd-animation-shake {
  0% {
    transform: translate(1px, 1px);
  }

  10% {
    transform: translate(-1px, -2px);
  }

  20% {
    transform: translate(-3px, 0px);
  }

  30% {
    transform: translate(3px, 2px);
  }

  40% {
    transform: translate(1px, -1px);
  }

  50% {
    transform: translate(-1px, 2px);
  }

  60% {
    transform: translate(-3px, 1px);
  }

  70% {
    transform: translate(3px, 1px);
  }

  80% {
    transform: translate(-1px, -1px);
  }

  90% {
    transform: translate(1px, 2px);
  }

  100% {
    transform: translate(1px, -2px);
  }
}
</style>
