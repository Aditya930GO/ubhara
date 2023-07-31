<template>
  <div class="rd-containers">
    <div v-if="props.index === 0" class="rd-component" ref="rdComponent" style="margin-bottom: 0.185rem;">
      <div class="rd-class-body">
        <div class="rd-class-number-container" style="width: 2rem;">
          <span class="rd-class-number rd-headline-3">No.</span>
        </div>
        <div class="rd-class-name-container" style="width: 10rem;   ">
          <span class=" rd-class-name rd-headline-3"
            style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; display:inline-block;">Nama</span>
        </div>
        <div v-for="(attendance, i) in userDatas.attendances" :key="i" class="rd-class-attendance-button-container"
          style="align-items: center; justify-content: center;">
          {{ (i + 1) }}
        </div>
      </div>
    </div>
    <div v-if="props.data.class_id === userDatas.class" class="rd-component" ref="rdComponent">
      <div class="rd-class-body">
        <div class="rd-class-number-container" style="width: 2rem;">
          <span class="rd-class-number rd-headline-3">{{ props.index + 1 }}</span>
        </div>
        <div class="rd-class-name-container" style="width: 10rem;   ">
          <span class=" rd-class-name rd-headline-3"
            style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; display:inline-block;">{{
              props.data.name
            }}</span>
        </div>
        <rd-attendance-button class="rd-class-attendance-button-container"
          v-for="(attendance, i) in userDatas.attendances" :key="i" :data="attendance" :user_id="props.data._id" />
        <!-- <div v-for="(attendance, i) in userDatas.attendances" :key="i" :data="attendance"
        class="rd-class-attendance-button-container">
        <button class="rd-class-action" @click="
                                                          "
          :style="dropDownOpened ? 'background: var(--primary-color)' : ''">
          <rd-attendance-button color="secondary" :data="attendance" />
        </button>
      </div> -->
        <!-- <rd-attendance-button
      /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from "gsap";

const dropDownState = ref<boolean>(false);
const dropDownOpened = ref<boolean>(false);

const { getAttendances } = useAttendance();
const { students, user, users, enrollClass, getUsers } = useUser();
const router = useRouter();

const emits = defineEmits(["logout", "open-panel"]);
const config = useRuntimeConfig();
const props = defineProps<{
  index: number;
  data;
}>();

const userDatas = ref<USERSTYPE>({
  attendances: [],
  tags: {},
  user: 0,
  class: ""
});
interface USERSTYPE {
  attendances: string[];
  tags: any;
  user: number | any;
  class: string;
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

onMounted(() => {
  userDatas.value.class = localStorage.getItem('class_id')
  setTimeout(async () => {
    if (localStorage.getItem('class_id')) {
      userDatas.value.attendances = await getAttendances(localStorage.getItem('class_id'))
      // console.log(userDatas.value.attendances)
    }
    await getUsers()
    usersData = students.value
    for (const obj of usersData) {
      if (obj._id && obj.classId === props.data._id) userDatas.value.user++;
    }
  }, 250);
  // userDatas.value.tags = props.data.tags.split(',')

  setTimeout(() => {
    animate.init(rdComponent.value);
  }, 50 * props.index);
});
</script>

<style lang="scss" scoped>
.rd-containers {
  position: relative;
  width: 100%;
  background: var(--background-depth-three-color);
  box-shadow: var(--box-shadow);

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
      height: 1rem;
      flex-direction: row;
      display: flex;

      .rd-class-number-container {
        position: relative;
        width: 5%;
        height: 100%;
        padding: 0.75rem 0 0.75rem 0.75rem;
        display: flex;
        flex-direction: column;

        span.rd-class-number {
          position: relative;
          display: flex;
          flex-wrap: wrap;
        }
      }

      .rd-class-name-container {
        position: relative;
        width: 30%;
        height: 100%;
        padding: 0.75rem 0 0.75rem 0;
        display: flex;
        flex-direction: column;

        span.rd-class-name {
          position: relative;
          display: flex;
          flex-wrap: wrap;
        }
      }

      .rd-class-attendance-button-container {
        // border: 1px solid var(--primary-color);
        // background: var(--background-depth-two-color);
        position: relative;
        height: 1.75rem;
        width: 1.75rem;
        border-radius: 25%;
        overflow: hidden;
        display: flex;
        flex-shrink: 0;
        margin: 0.35rem;

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
}
</style>
