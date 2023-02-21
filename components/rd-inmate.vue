<template>
  <div class="rd-component" ref="rdComponent">
    <div class="rd-transaction-main-data">
      <div
        class="rd-transaction-data rd-transaction-data-subject"
        style="width: 15%"
      >
        <span class="rd-transaction-data-placeholder rd-caption-text"
          >Terdakwa</span
        >
        <span class="rd-transaction-data-value rd-headline-5">
          {{ props.data.name }}
        </span>
      </div>
      <div
        class="rd-transaction-data rd-transaction-data-subject"
        style="width: 12.5%"
      >
        <span class="rd-transaction-data-placeholder rd-caption-text">NIK</span>
        <span class="rd-transaction-data-value rd-headline-5">{{
          props.data.NIK
        }}</span>
      </div>
      <div
        class="rd-transaction-data rd-transaction-data-subject"
        style="width: 2.5%"
      >
        <span class="rd-transaction-data-placeholder rd-caption-text"
          >Usia</span
        >
        <span class="rd-transaction-data-value rd-headline-5">{{
          ageHandler(new Date(props.data.date_of_birth))
        }}</span>
      </div>
      <div
        class="rd-transaction-data rd-transaction-data-subject"
        style="width: 10%"
      >
        <span class="rd-transaction-data-placeholder rd-caption-text"
          >Nomor Berkas
        </span>
        <span class="rd-transaction-data-value rd-headline-5">{{
          props.data.registration
        }}</span>
      </div>

      <div
        class="rd-transaction-data rd-transaction-data-date"
        style="width: 15%"
      >
        <span class="rd-transaction-data-placeholder rd-caption-text"
          >Tanggal Register</span
        >
        <span class="rd-transaction-data-value rd-headline-5">{{
          dateHandler(new Date(props.data.date_inside))
        }}</span>
      </div>
      <div
        class="rd-transaction-data rd-transaction-data-subject"
        style="width: 10%"
      >
        <span class="rd-transaction-data-placeholder rd-caption-text"
          >Waktu Register</span
        >
        <span class="rd-transaction-data-value rd-headline-5">{{
          timeHandler(new Date(props.data.create_date))
        }}</span>
      </div>
      <div
        class="rd-transaction-data rd-transaction-data-subject"
        style="width: 15%"
      >
        <span class="rd-transaction-data-placeholder rd-caption-text"
          >Klasifikasi Perkara</span
        >
        <span class="rd-transaction-data-value rd-headline-5">{{
          props.data.category
        }}</span>
      </div>
    </div>
    <div class="rd-transaction-main-data">
      <div
        class="rd-transaction-data rd-transaction-data-price"
        style="width: 15%"
      >
        <span class="rd-transaction-data-placeholder rd-caption-text"
          >Alias</span
        >
        <span class="rd-transaction-data-value rd-headline-5">{{
          props.data.alias
        }}</span>
      </div>
      <div
        class="rd-transaction-data rd-transaction-data-price"
        style="width: 70%"
      >
        <span class="rd-transaction-data-placeholder rd-caption-text"
          >Notes</span
        >
        <span class="rd-transaction-data-value rd-headline-5">{{
          props.data.notes
        }}</span>
      </div>
      <div class="rd-transaction-status">
        <span
          class="rd-transaction-data-value"
          style="
            height: 2.5rem;
            top: -1rem;
            background-color: white;
            z-index: 999999999999;
            cursor: pointer;
          "
          @click="emits('open-panel')"
          ><rd-svg
            :name="'eye-outline'"
            class="rd-inmate-details-icon"
            color="secondary"
        /></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from "gsap";

const props = defineProps<{
  data;
  index: number;
}>();
const rdComponent = ref<HTMLElement>(null);

const emits = defineEmits(["logout", "open-panel"]);

const months: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function dateHandler(x: Date): string {
  const year: number = x.getFullYear();
  const month: number = x.getMonth();
  const date: number = x.getDate();

  return `${date} ${months[month]} ${year} `;
}
function timeHandler(x: Date): string {
  const hours: number = x.getHours();
  const minutes: number = x.getMinutes();

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

function ageHandler(dob) {
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);

  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

function colonsol() {
  console.log("props.data");
  console.log(props.data);
}

onMounted(() => {
  // setTimeout(() => {
  //   animate.init(rdComponent.value);
  // }, 50 * props.index);
});
</script>

<style lang="scss" scoped>
.rd-component {
  border-left: 1px solid var(--border-color);
  position: relative;
  width: 100%;
  height: 6rem;
  background: var(--background-depth-one-color);
  // box-shadow: var(--box-shadow);
  border-radius: 1rem;
  padding: 1rem;
  opacity: 1;
  border: 1px solid var(--border-color);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  // transform: scale(0.875);
  .rd-transaction-main-data {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-shrink: 0;
    .rd-transaction-data {
      margin-left: 0.75rem;
    }
    .rd-transaction-icon-container {
      position: relative;
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      background: var(--background-depth-two-color);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .rd-transaction-data {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    span.rd-transaction-data-placeholder {
      position: relative;
      margin-bottom: 0.125rem;
      opacity: 0.5;
    }
    span.rd-transaction-data-value {
      position: relative;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      .rd-inmate-details-icon {
        height: 1rem;
      }
    }
    &.rd-transaction-data-subject {
      width: 25%;
    }
    &.rd-transaction-data-date {
      width: 22.5%;
    }
    &.rd-transaction-data-price {
      width: 12.5%;
    }
  }
  .rd-transaction-status {
    position: relative;
    width: 12.5%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    span.rd-transaction-data-value {
      position: relative;
      height: 100%;
      padding: 0 0.5rem;
      border-radius: 0.5rem;
      color: var(--primary-color);
      display: flex;
      justify-content: center;
      align-items: center;
      .rd-inmate-details-icon {
        // position: fixed;
        height: 1.5rem;
        width: 1.5rem;
      }
      &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
        background: var(--primary-color);
        opacity: 0.1;
      }
    }
  }
  @media only screen and (max-width: 1024px) {
    .rd-transaction-main-data {
      width: 65%;
      .rd-transaction-data {
        width: calc(100% - 2.75rem);
        margin-left: 0.75rem;
        span.rd-transaction-data-value {
          width: 100%;
        }
      }
    }
    .rd-transaction-data {
      &.rd-transaction-data-subject {
        display: none;
      }
      &.rd-transaction-data-date {
        display: none;
      }
      &.rd-transaction-data-price {
        width: 35%;
        align-items: flex-end;
      }
    }
    .rd-transaction-status {
      display: none;
    }
  }
}
</style>
