<template>
  <div class="rd-component" ref="rdComponent">
    <div class="rd-class-body">
      <div class="rd-class-name-container">
        <span class="rd-class-name rd-headline-3">{{ props.data.name }}</span>
      </div>
      <div class="rd-class-name-container">
        <span class="rd-class-name rd-headline-3">{{ props.data.name }}</span>
      </div>
      <div class="rd-class-details">
        <div class="rd-class-schedule">
          <div class="rd-class-schedule-left">
            <div class="rd-chart-header-icon-container">
              <rd-svg class="rd-chart-header-icon" :name="'calendar-clock-outline'" color="secondary" />
            </div>
          </div>
          <div class="rd-class-schedule-right">
            <span class="rd-product-placeholder rd-headline-4">Jadwal</span>
            <span class="rd-product-value rd-headline-5">{{ props.data.schedule }}</span>
          </div>
        </div>
        <div class="rd-class-participant">
          <div class="rd-class-participant-left">
            <div class="rd-chart-header-icon-container">
              <rd-svg class="rd-chart-header-icon" :name="'account-multiple'" color="secondary" />
            </div>
          </div>
          <div class="rd-class-participant-right">
            <span class="rd-product-placeholder rd-headline-4">Peserta</span>
            <span class="rd-product-value rd-headline-5">{{ userDatas.user }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from "gsap";
import { Product } from "~~/interfaces/product";

const dropDownState = ref<boolean>(false);
const dropDownOpened = ref<boolean>(false);

const { user, users, enrollClass, getUsers } = useUser();
const router = useRouter();

const emits = defineEmits(["logout", "open-panel"]);
const config = useRuntimeConfig();
const props = defineProps<{
  index: number;
  data;
}>();

const userDatas = ref<USERSTYPE>({
  tags: {},
  user: 0,
  class: 0
});
interface USERSTYPE {
  tags: any;
  user: number | any;
  class: number | any;
}

let usersData = [];

const rdComponent = ref<HTMLElement>(null);

const animate = {
  init(rdComponent: HTMLElement): void {
    const tl: GSAPTimeline = gsap.timeline();
    tl.to(rdComponent, {
      opacity: 1,
      scale: 1,
      duration: 0.25,
      ease: "power4.out",
    });
  },
};
async function submitEnrollClass() {
  console.log("submitEnrollClass")
  let addID: string = "";
  addID = await enrollClass(props.data._id)
  if (addID) {
    console.log(addID);
    location.reload();
  }
}

function dropDownCloser(): void {
  // console.log(props.data._id)
  setTimeout(() => {
    dropDownState.value = false;
  }, 150);
}
function test(): void {
  console.log("hai")
  emits('open-panel', { state: 'show', type: 'add-class-form' })
}
onMounted(() => {
  setTimeout(async () => {
    await getUsers()
    usersData = users.value
    for (const obj of usersData) {
      if (obj._id && obj.classId === props.data._id) userDatas.value.user++;
    }
  }, 250);
  userDatas.value.tags = props.data.tags.split(',')
  console.log("props.data._id")
  console.log(props.data)
  setTimeout(() => {
    animate.init(rdComponent.value);
  }, 50 * props.index);
});
</script>

<style lang="scss" scoped>
.rd-component {
  position: relative;
  width: 100%;
  height: 2.5rem;
  border-radius: 0.175rem;
  background: var(--background-depth-one-color);
  box-shadow: var(--box-shadow);
  opacity: 1;
  display: flex;
  flex-direction: row;
  // transform: scale(0.875);

  .rd-class-header {
    position: relative;
    width: 100%;
    height: 3rem;
    justify-content: space-between;
    box-sizing: border-box;
    display: flex;

    .rd-class-header-button-container {
      border: 1px solid var(--primary-color);
      position: relative;
      height: 1.75rem;
      width: 1.75rem;
      border-radius: 25%;
      overflow: hidden;
      background: var(--background-depth-two-color);
      display: flex;
      flex-shrink: 0;
      margin: 1rem;

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

      .rd-class-action {
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
      top: 100%;
      right: 1rem;
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
  }


  .rd-class-body {
    position: relative;
    width: 100%;
    // padding: 1rem;
    flex-direction: row;
    display: flex;

    // flex-wrap: wrap;
    // box-sizing: border-box;
    .rd-class-name-container {
      position: relative;
      width: 30%;
      height: 100%;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;

      span.rd-class-name {
        position: relative;
        display: flex;
        flex-wrap: wrap;
      }
    }


    .rd-class-details {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .rd-class-schedule,
      .rd-class-participant {
        flex-direction: row;
        position: relative;
        display: flex;
        width: 50%;
        flex-direction: row;

        .rd-class-schedule-left,
        .rd-class-participant-left {
          position: relative;
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          padding: 0 0.5rem;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 0.5rem;

          &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 0.5rem;
            background: var(--background-depth-two-color);
          }
        }

        .rd-class-schedule-right,
        .rd-class-participant-right {
          position: relative;
          // width: 50%;
          display: flex;
          flex-direction: column;
        }

        span.rd-class-placeholder {
          position: relative;
          opacity: 0.5;
          margin-bottom: 0.125rem;
        }
      }
    }
  }


}
</style>
