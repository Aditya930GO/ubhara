<template>
  <div class="rd-container" ref="rdContainer">
    <div class="rd-subpage-container">
      <div class="rd-subpage">
        <div class="rd-subpage-header">
          <h1 class="rd-subpage-header-tittle rd-headline-2">Daftar Admin</h1>
        </div>
        <div class="rd-subpage-body">
          <div ref="rdClassWrapper" class="rd-class-wrapper">
            <rd-active-user v-for="(user, i) in admins" :key="i" class="rd-class" :index="i + 1" :data="user" @open-panel="emits('open-panel', {
              state: 'hide',
              type: 'user-form',
            }),
              emits('open-panel', { state: 'show', type: 'user-form', data: user })" />
          </div>
        </div>
      </div>
      <div class="rd-subpage">
        <div class="rd-subpage-header">
          <h1 class="rd-subpage-header-tittle rd-headline-2">Daftar Mahasiswa</h1>
        </div>
        <div class="rd-subpage-body">
          <div ref="rdClassWrapper" class="rd-class-wrapper">
            <rd-active-user class="rd-class" :index="'No.'" :data="header_data" @open-panel="emits('open-panel', {
              state: 'hide',
              type: 'user-form',
            }),
              emits('open-panel', { state: 'show', type: 'user-form', data: user })" />
            <rd-active-user v-for="(user, i) in users" :key="i" class="rd-class" :index="i + 1" :data="user" @open-panel="emits('open-panel', {
              state: 'hide',
              type: 'user-form',
            }),
              emits('open-panel', { state: 'show', type: 'user-form', data: user })" @open-panel-delete-student="emits('open-panel', {
    state: 'hide',
    type: 'delete-user-form',
  }),
    emits('open-panel', { state: 'show', type: 'delete-user-form', data: user })" @delete-success="refreshUser()" />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from "gsap";
import { ComputedRef } from "vue";

definePageMeta({
  middleware: ["auth"],
});

const { classes, getClasses } = useClass();
const { user, users, admins, getUsers } = useUser();
const route = useRoute();
const emits = defineEmits(["logout", "open-panel"]);
const { viewMode } = useMain();
const router = useRouter();
const rdContainer = ref<HTMLDivElement>(null);
const rdPageHeader = ref<HTMLDivElement>(null);
const rdTransactionsOverviewContainer = ref<HTMLDivElement>(null);
const rdTransactionsFilterDropdown = ref<HTMLDivElement>(null);
const rdTransactionsFilterContainer = ref<HTMLDivElement>(null);
const rdTransactionsWrapper = ref<HTMLDivElement>(null);


const header_data = {
  "name": "Nama",
  "nim": "NIM",
  "role": "Status",
}
const animate = {
  init(
    rdPageHeader: HTMLElement,
    rdTransactionsFilterContainer: HTMLElement,
    rdTransactionsOverviewContainer: HTMLElement
  ): void {
    const tl: GSAPTimeline = gsap.timeline();

    tl.to(
      [
        rdPageHeader,
        rdTransactionsFilterContainer,
        rdTransactionsOverviewContainer,
      ],
      {
        opacity: 1,
        duration: 0.25,
      }
    );
  },
  hideTransactions(rdTransactionsWrapper: HTMLElement, cb?: () => void): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });

    tl.to(rdTransactionsWrapper, {
      opacity: 1,
      duration: 0.25,
      ease: "power4.out",
    });
  },
  dropDownOpen(
    rdTransactionsFilterDropdown: HTMLElement,
    cb?: () => void
  ): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });

    tl.to(rdTransactionsFilterDropdown, {
      scale: 1,
      opacity: 1,
      duration: 0.25,
      ease: "power2.inOut",
    });
  },
  dropDownClose(
    rdTransactionsFilterDropdown: HTMLElement,
    cb?: () => void
  ): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });

    tl.to(rdTransactionsFilterDropdown, {
      scale: 1.125,
      opacity: 0,
      duration: 0.25,
      ease: "power2.inOut",
    });
  },
};

function loadTransactions(text?: string): void {
  // transactionsLoading.value = true;
  setTimeout(async () => {
    // await getTransactions(text);
    // transactionsLoading.value = false;
  }, 250);
}

onMounted(() => {
  setTimeout(async () => {
    console.log(user.value.role)
    if (user.value.role !== "admin") router.push("/login");
    // transactionsOverview.value = await getTransactionOverview();
    getUsers();
    animate.init(
      rdPageHeader.value,
      rdTransactionsFilterContainer.value,
      rdTransactionsOverviewContainer.value
    );
  }, 250);
});
</script>

<style lang="scss" scoped>
.rd-container {
  // overflow-y: auto;
  margin-top: 4rem;
  position: relative;
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  // background-color: red;
  height: 100%;
  // padding-bottom: 5rem;

  // height: calc(100% - 4rem);
  // border: 1px red solid;
  .rd-page-header {
    z-index: 99;
    background: var(--background-depth-one-color);
    position: relative;
    width: calc(100% - 1rem);
    height: 2rem;
    padding: 0 2rem 1rem 2rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;

    .rd-transactions-filter-container {
      position: relative;
      z-index: 300;
      width: 100%;
      margin-bottom: 1rem;
      // opacity: 0;
      display: flex;
      justify-content: space-between;

      .rd-transactions-filter {
        position: relative;
        display: flex;
        justify-content: flex-end;

        .rd-transactions-filter-selected-container {
          position: relative;
          width: 15rem;
          height: 2rem;
          padding-right: 0.5rem;
          box-sizing: border-box;
          overflow-x: auto;
          display: flex;
          flex-direction: row-reverse;
          justify-content: flex-start;
          align-items: center;

          .rd-transactions-filter-selected {
            position: relative;
            height: 2rem;
            padding: 0 0.75rem 0 0;
            margin-left: 0.5rem;
            display: flex;
            flex-shrink: 0;
            justify-content: center;
            align-items: center;

            .rd-transactions-filter-selected-close {
              cursor: pointer;
              position: relative;
              width: 2rem;
              height: 2rem;
              padding: 0 0.625rem;
              box-sizing: border-box;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            span.rd-transactions-filter-selected-value {
              position: relative;
              color: var(--secondary-font-color);
            }

            &::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border-radius: 0.5rem;
              background: var(--primary-color);
              // opacity: 0.1;
            }
          }
        }
      }

      .rd-transactions-filter-dropdown {
        z-index: 9999;
        position: absolute;
        top: 100%;
        right: 0;
        width: 15rem;
        border-radius: 0.75rem;
        padding: 0.75rem;
        // opacity: 0;
        background: var(--background-depth-one-color);
        box-sizing: border-box;
        box-shadow: 0 0.5rem 0.5rem 0.5rem var(--background-depth-two-color);
        display: flex;
        flex-direction: column;
        transform: scale(1.125);

        .rd-transactions-filter-dropdown-header {
          position: relative;
          width: 100%;
          height: 2rem;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .rd-transactions-filter-dropdown-input-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: space-between;

          .rd-transactions-filter-dropdown-input {
            width: 100%;
          }
        }
      }
    }
  }


  .rd-subpage-container {
    padding: 0 2rem;
    position: relative;
    width: calc(100% - 21rem);
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 5rem;

    .rd-subpage {
      position: relative;
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: space-between;
      padding-bottom: 2rem;


      .rd-subpage-header {
        position: relative;
        width: 100%;
        height: 2rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1rem;
      }

      .rd-subpage-body {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;

        .rd-class-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          gap: 0.175rem;
          flex-wrap: wrap;

          .rd-class {
            position: inherit;
            z-index: 0;
            width: calc(100%);
          }
        }

        .rd-subpage-body-button {
          width: 100%;
        }
      }
    }
  }

  .rd-page-button {
    z-index: 9999999;
    bottom: 2rem;
    right: 22.5rem;
  }

  @media only screen and (max-width: 1024px) {
    .rd-page-body {
      .rd-transactions-overview-container {
        left: -1.5rem;
        width: 100vw;
        padding: 0 1.5rem;
        margin-bottom: 1rem;
        box-sizing: border-box;
        overflow-x: auto;

        .rd-transactions-overview {
          width: 75%;
          flex-shrink: 0;
        }
      }
    }

    .rd-button-container {
      z-index: 9999999;
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      height: 10rem;
      // height: 160vh;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
    }

    .rd-page-button {
      z-index: 2;
      bottom: 1.5rem;
      right: 1.5rem;
    }
  }
}
</style>

<style lang="scss"></style>
