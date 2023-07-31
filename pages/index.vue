<template>
  <div class="rd-container" ref="rdContainer">
    <div class="rd-subpage-container" :style="viewMode === 'mobile' ? 'width: 100%; padding: 0.5rem;' : ''">
      <div class="rd-subpage">
        <div class="rd-subpage-header">
          <h1 class="rd-subpage-header-tittle rd-headline-2">{{ user.role === 'student' ? 'Kelas Anda' : 'Kelas Aktif'
          }}</h1>
          <div class="rd-subpage-header-button">
            <rd-input-button v-if="viewMode === 'desktop'" class="rd-subpage-body-button" label="Tambah" icon="plus"
              type="primary" @clicked="emits('open-panel', { state: 'show', type: 'add-class-form' })" />
          </div>
        </div>
        <div class="rd-subpage-body" :style="viewMode === 'mobile' ? 'width: 100%; padding: 0.5rem;' : ''">
          <!-- <div v-if="(user.role === 'student' && !user.class_id) || user.role === 'admin'" ref="rdClassWrapper" -->
          <div ref="rdClassWrapper" class="rd-class-wrapper"
            :style="viewMode === 'mobile' ? 'width: 100%; padding: 0.5rem;' : ''">
            <rd-active-class v-for="(classRoom, i) in classes" :key="i" class="rd-class" :index="i" :data="classRoom"
              @open-panel="emits('open-panel', { state: 'show', type: 'add-class-form', data: classRoom })"
              @delete-panel="emits('open-panel', { state: 'show', type: 'delete-class-form', data: classRoom })"
              :style="viewMode === 'mobile' ? 'width: 80%; padding: 0.15rem;' : ''" />
          </div>
          <!-- <div v-else ref="rdClassWrapper" class="rd-class-wrapper"
            :style="viewMode === 'mobile' ? 'width: 100%; padding: 0.5rem;' : ''">
            <rd-active-class class="rd-class" :index="15" :data="userDatas.class"
              @open-panel="emits('open-panel', { state: 'show', type: 'add-class-form', data: classRoom })"
              :style="viewMode === 'mobile' ? 'width: 80%; padding: 0.15rem;' : ''" />
          </div> -->
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

const { user } = useUser();
const { classes, getClasses } = useClass();
const route = useRoute();
const emits = defineEmits(["logout", "open-panel", "navigate"]);
const { viewMode } = useMain();
const router = useRouter();
const rdContainer = ref<HTMLDivElement>(null);
const userDatas = ref<USERSTYPE>({
  class: [],
  // classes: [],

});
interface USERSTYPE {
  class: any;
  // classes: any;
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



onMounted(async () => {
  await getClasses;
  // await console.log(classes.value)
  setTimeout(() => {

    if (user.value.role !== "admin") {
      userDatas.value.class = classes.value.find((users_class) => {
        return users_class._id === user.value.class_id;
      });
    }
    console.log(userDatas.value.class)
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

  .rd-page-body {
    margin-top: 7rem;
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: red;

    .rd-main-wrapper {
      height: inherit;
    }

    .rd-transactions-overview-container {
      position: relative;
      width: 100%;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      gap: 1rem;

      .rd-transactions-overview {
        position: relative;
        width: calc((100% - 2rem) / 3);
        background: var(--background-depth-one-color);
        box-shadow: var(--box-shadow);
        border-radius: 1rem;
        padding: 1rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .rd-transactions-overview-header {
          position: relative;
          width: 100%;
          height: 2rem;
          display: flex;
          align-items: center;

          .rd-transactions-overview-icon-container {
            position: relative;
            width: 2rem;
            height: 2rem;
            display: flex;
          }

          .rd-transactions-overview-title-container {
            position: relative;
            width: calc(100% - 2rem);
            height: 2rem;
            padding-left: 1rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;

            span.rd-transactions-overview-subtitle {
              position: relative;
              margin-top: 0.125rem;
              opacity: 0.5;
            }
          }
        }
      }
    }

    .rd-transactions-filter-container {
      position: relative;
      width: 100%;
      margin-bottom: 1rem;
      opacity: 0;
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
              color: var(--primary-color);
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
              opacity: 0.1;
            }
          }
        }

        &::before {
          pointer-events: none;
          z-index: 20;
          content: "";
          position: absolute;
          top: 0;
          left: -1rem;
          width: 1rem;
          height: 100%;
          box-shadow: 0 0.5rem 0.5rem 0.5rem var(--background-depth-two-color);
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
        opacity: 0;
        background: var(--background-depth-one-color);
        box-sizing: border-box;
        box-shadow: var(--box-shadow);
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

    .rd-transactions-wrapper {
      margin: 1rem;
      z-index: 1;
      position: relative;
      width: 95%;
      display: flex;
      flex-direction: column;

      .rd-transaction {
        position: relative;
        margin-bottom: 1rem;
      }
    }

    .rd-end-list {
      display: flex;
      justify-content: center;
    }

    .rd-transactions-loading {
      position: relative;
      width: 100%;
      height: calc(100vh - 12rem);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .rd-subpage-container {
    padding: 0 2rem;
    position: relative;
    width: calc(100% - 21rem);
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    padding-bottom: 5rem;

    .rd-subpage {
      position: relative;
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: space-between;


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
          gap: 1rem;
          flex-wrap: wrap;

          .rd-class {
            width: calc((100% - 2rem) / 3);
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
