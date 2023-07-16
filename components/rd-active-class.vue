<template>
  <div class="rd-component" ref="rdComponent">
    <div class="rd-class-header">
      <div class="rd-class-header-top">
        <div class="rd-class-name-container" :class="user.role === 'student' ? 'student' : ''" @click="pindah()">
          <span class="rd-class-name rd-headline-3">{{ props.data.name }}</span>
          <!-- <div class="rd-class-tags-container">
          <div v-for="(classRoomTags, i) in userDatas.tags" :key="i" class="rd-class-tags-box">
            <span class="rd-class-tags rd-subtitle-text">{{ classRoomTags }}
            </span>
          </div>
        </div> -->
        </div>
        <div class="rd-class-header-buttons-container">
          <div v-if="(user.role === 'student' && !user.class_id) || user.role === 'admin'"
            class="rd-class-header-button-container">
            <button class="rd-class-action" @focusout="dropDownCloser()" @mousedown="openAttendance()
              " :style="dropDownOpened ? 'background: var(--primary-color)' : ''">
              <rd-svg name="check" color="secondary" />
            </button>
          </div>
          <div v-if="(user.role === 'student' && !user.class_id) || user.role === 'admin'"
            class="rd-class-header-button-container">
            <button class="rd-class-action" @focusout="dropDownCloser()" @mousedown="exportAsExcel()
              " :style="dropDownOpened ? 'background: var(--primary-color)' : ''">
              <rd-svg name="file-excel" color="secondary" />
            </button>
          </div>
          <div v-if="(user.role === 'student' && !user.class_id) || user.role === 'admin'"
            class="rd-class-header-button-container">
            <button class="rd-class-action" @focusout="dropDownCloser()" @click="dropDownState ? (dropDownState = false) : (dropDownState = true)
              " :style="dropDownOpened ? 'background: var(--primary-color)' : ''">
              <rd-svg name="dots-horizontal" color="secondary" />
            </button>
          </div>
        </div>
        <div v-if="dropDownState" class="actions-container" @focusout="dropDownCloser()">
          <div v-if="user.role === 'student' && !user.class_id" ripple class="action"
            @mousedown="dropDownState = false, submitEnrollClass()">
            <div class="rd-icon-container">
              <rd-svg class="icon" :name="'open-in-app'" :color="dropDownState ? 'primary' : 'primary'" />
            </div>
            <span class="name">Enroll class</span>
          </div>
          <div v-if="user.role !== 'student'" ripple class="action"
            @mousedown="emits('open-panel'), dropDownState = false">
            <div class="rd-icon-container">
              <rd-svg class="icon" :name="'edit-outline'" :color="dropDownState ? 'primary' : 'primary'" />
            </div>
            <span class="name">Ubah kelas</span>
          </div>
          <div v-if="user.role !== 'student'" ripple class="action"
            @mousedown="emits('open-panel'), dropDownState = false">
            <div class="rd-icon-container">
              <rd-svg class="icon" :name="'close'" :color="dropDownState ? 'primary' : 'primary'"
                :style="dropDownState ? 'transform: rotate(180deg)' : ''" />
            </div>
            <span class="name">Hapus kelas</span>
          </div>
        </div>
      </div>
      <div class="rd-class-tags-container">
        <div v-for="(classRoomTags, i) in userDatas.tags" :key="i" class="rd-class-tags-box">
          <span class="rd-class-tags rd-subtitle-text">{{ classRoomTags }}
          </span>
        </div>
      </div>
    </div>
    <!-- <div class="rd-product-divider"></div>
     -->
    <div class="rd-class-body">
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
            <span class="rd-product-value rd-headline-5">{{ userDatas.userCount }}</span>
          </div>
        </div>
      </div>
      <div v-if="user.role === 'admin'" class="rd-class-attendance-detail-container">
        <div class="rd-class-attendance-bar-container">
          <div v-for="(num, i) in userDatas.attendances" :key="i"
            :style="num <= userDatas.attended ? 'background-color: var(--success-color);' : 'background-color: var(--error-color);' && num === 1 ? 'border-radius: 25% 0 0 25%;' : ''"
            class="rd-class-attendance-bar"></div>
        </div>
      </div>
      <div v-if="user.role === 'student' && user.class_id" class="rd-class-attendance-button-container"
        style="justify-content: center; ">
        <rd-input-button v-if="user.role === 'student'" style="width: 100%;" class="rd-subpage-body-button"
          :label="userDatas.attend_status ? 'Sudah Absen' : 'Absen'" type="primary" :disabled="userDatas.attend_status"
          @clicked="submitAttend()" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from "gsap";
import { ref, onMounted } from "vue";



const dropDownState = ref<boolean>(false);
const dropDownOpened = ref<boolean>(false);


const { openClassAttendance, submitAttendance, getAttendanceDetails } = useAttendance();
const { user, users, enrollClass, getUsers } = useUser();
const router = useRouter();

const emits = defineEmits(["logout", "open-panel", "navigate"]);
const config = useRuntimeConfig();
const props = defineProps<{
  index: number;
  data;
}>();

const userDatas = ref<USERSTYPE>({
  attendances: 0,
  attended: 0,
  attend_status: false,
  tags: {},
  userCount: 0,
  class: ""
});
interface USERSTYPE {
  attend_status: boolean;
  tags: any;
  attended: number | any,
  attendances: number | any;
  userCount: number | any;
  class: string;
}


// let usersData = [];

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

function pindah(): void {
  window.location.href = '/attendance';
  localStorage.setItem('class_id', props.data._id)
  localStorage.setItem('class_name', props.data.name)
}
async function openAttendance() {
  console.log(props.data._id)
  openClassAttendance(props.data._id.toLocaleString())
}
async function submitAttend() {
  console.log(props.data._id)
  const result = await submitAttendance(props.data._id.toLocaleString())
  if (result) userDatas.value.attend_status = true
}
function dropDownCloser(): void {
  // console.log(props.data._id)
  setTimeout(() => {
    dropDownState.value = false;
  }, 150);
}


async function exportAsExcel() {
  const { $fetch } = useNuxtApp()
  const urlString: string = `${config.public.apiBase}/attendances/excel/${props.data._id}`
  const response = await $fetch(urlString, 'get')
  console.log(response.value)
  window.location.href = `${config.public.apiBase}/attendances/excel/${props.data._id}`
}
onMounted(async () => {

  const usersData = users.value
  setTimeout(() => {
    for (const obj of users.value) {
      if (obj._id && obj.class_id === props.data._id) userDatas.value.userCount++;
    }
  }, 250);

  userDatas.value.tags = props.data.tags?.split(',')
  for (const obj of await getAttendanceDetails(props.data._id)) {
    userDatas.value.attendances++;
    if (obj.opened === true) userDatas.value.attended++;
  }
  console.log(userDatas.value.attendances)
  console.log(userDatas.value.attended)
  setTimeout(() => {
    animate.init(rdComponent.value);
  }, 50 * props.index);
  // console.log(await getAttendanceDetails(props.data._id))
  // console.log("attendances")
  // console.log(userDatas.value.attendances)
});
</script>

<style lang="scss" scoped>
.rd-component {
  position: relative;
  width: 100%;
  border-radius: 1rem;
  background: var(--background-depth-one-color);
  box-shadow: var(--box-shadow);
  opacity: 0;
  display: flex;
  flex-direction: column;
  transform: scale(0.875);

  .rd-class-header {
    position: relative;
    width: 100%;
    height: 3.5rem;
    // margin: 1rem;
    justify-content: space-between;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .rd-class-header-top {
      position: relative;
      width: 100%;
      height: 2rem;
      justify-content: flex-end;
      box-sizing: border-box;
      display: flex;

      .rd-class-name-container {

        position: relative;
        width: calc(100% - 6rem);
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        cursor: pointer;

        &.student {
          cursor: none;
          pointer-events: none;
        }

        span.rd-class-name {
          padding: 1rem;
          position: relative;
          display: flex;
          flex-wrap: wrap;
        }
      }

      .rd-class-header-buttons-container {
        position: relative;
        width: 100%;
        height: 1.75rem;
        justify-content: flex-end;
        box-sizing: border-box;
        display: flex;
        margin-top: 0.75rem;

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
          margin-right: 0.5rem;

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
      }

      .actions-container {
        z-index: 9999999999;
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

    .rd-class-tags-container {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      width: 100%;
      height: 1rem;
      margin: 0.75rem;

      .rd-class-tags-box {
        display: inline;
        display: flex;
        position: relative;
        // flex-direction: row;
        justify-content: center;
        align-items: center;
        // width: a;
        background-color: #4847462e;
        align-items: center;
        border-radius: 1.5rem;
        margin-right: 0.25rem;
        // padding-left: 0.35rem;

        span.rd-class-tags {
          justify-content: center;
          align-items: center;
          position: relative;
          padding: 0 0.35rem;
        }
      }
    }
  }

}

.rd-product-divider {
  position: relative;
  width: 100%;
  height: 1px;
  background: var(--font-color);
  opacity: 0.05;
}

.rd-class-body {
  position: relative;
  width: 100%;
  padding: 0.75rem;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;

  .rd-class-attendance-detail-container {
    margin-top: 0.5rem;
    flex-direction: row;
    position: relative;
    display: flex;
    width: 100%;
    flex-direction: row;

    .rd-class-attendance-bar-container {
      position: relative;
      display: flex;
      height: 1rem;
      width: 100%;
      flex-direction: row;

      .rd-class-attendance-bar {
        width: calc(100% / 16);
        height: 1rem;
        position: relative;
        display: flex;
        background-color: var(--error-color);
      }
    }
  }

  .rd-class-attendance-button-container {
    margin-top: 0.5rem;
    flex-direction: row;
    position: relative;
    display: flex;
    width: 100%;
    flex-direction: row;
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

  .rd-product-price {
    position: relative;
    width: 100%;
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;

    span.rd-product-placeholder {
      position: relative;
      opacity: 0.5;
      margin-bottom: 0.125rem;
    }

    span.rd-product-value {
      position: relative;
      color: var(--primary-color);
    }
  }
}
</style>
