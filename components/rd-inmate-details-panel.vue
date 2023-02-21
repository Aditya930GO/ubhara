<template>
  <rd-panel
    class="rd-panel"
    :label="'Detail Data'"
    :state="panelState"
    :loading="dataLoading"
    :edit="true"
    :delete="true"
    @delete-inmate="deleteInmate"
    @edit="edit"
    @exit="emits('exit')"
  >
    <div v-if="dataInmate" class="rd-fieldset">
      <div class="rd-fieldset-body">
        <div class="rd-inmate-images-container">
          <div class="rd-inmate-image">
            <img
              v-if="dataInmate.image_url?.length"
              :src="`${config.public.apiBase}/files${dataInmate.image_url[imageIndex]}`"
              alt=""
              class="rd-image"
            />
          </div>
          <div
            v-if="dataInmate.image_url?.length"
            class="rd-inmate-image-selector-container"
          >
            <div
              v-for="(image, i) in dataInmate.image_url"
              :class="imageIndex === i ? 'rd-inmate-image-selector-active' : ''"
              class="rd-inmate-image-selector"
              @click="imageIndex = i"
            >
              <img
                :src="`${config.public.apiBase}/files${image}`"
                class="rd-image"
              />
            </div>
          </div>
        </div>
        <div class="rd-fieldset-details">
          <div
            class="rd-fieldset-detail rd-fieldset-detail-large"
            :style="'margin-top: 0'"
          >
            <span class="rd-fieldset-detail-placeholder rd-headline-6"
              >Nomor Registrasi</span
            >
            <span class="rd-fieldset-detail-value rd-body-text-1">{{
              dataInmate.registration
            }}</span>
          </div>
        </div>
        <div class="rd-fieldset-details">
          <div
            class="rd-fieldset-detail rd-fieldset-detail-large"
            :style="'margin-top: 0.25rem'"
          >
            <span class="rd-fieldset-detail-placeholder rd-headline-6"
              >NIK</span
            >
            <span class="rd-fieldset-detail-value rd-body-text-1">{{
              dataInmate.NIK
            }}</span>
          </div>
        </div>
        <div class="rd-fieldset-details">
          <div
            class="rd-fieldset-detail rd-fieldset-detail-large"
            :style="'margin-top: 0.25rem'"
          >
            <span class="rd-fieldset-detail-placeholder rd-headline-6"
              >Nama</span
            >
            <span class="rd-fieldset-detail-value rd-body-text-1">{{
              dataInmate.name
            }}</span>
          </div>
        </div>
        <div class="rd-fieldset-details">
          <div
            class="rd-fieldset-detail rd-fieldset-detail-large"
            :style="'margin-top: 0.25rem'"
          >
            <span class="rd-fieldset-detail-placeholder rd-headline-6"
              >Alias</span
            >
            <span class="rd-fieldset-detail-value rd-body-text-1">{{
              dataInmate.alias
            }}</span>
          </div>
        </div>
        <div class="rd-fieldset-details-double-wrapper">
          <div
            class="rd-fieldset-details"
            style="margin-left: 0.25rem; width: calc(50% - 1rem)"
          >
            <div
              class="rd-fieldset-detail rd-fieldset-detail-large"
              :style="'margin-top: 0.25rem'"
            >
              <span class="rd-fieldset-detail-placeholder rd-headline-6"
                >Tempat lahir</span
              >
              <span class="rd-fieldset-detail-value rd-body-text-1">{{
                dataInmate.place_of_birth
              }}</span>
            </div>
          </div>
          <div
            class="rd-fieldset-details"
            style="margin-left: 0.25rem; width: calc(50% - 1rem)"
          >
            <div
              class="rd-fieldset-detail rd-fieldset-detail-large"
              :style="'margin-top: 0.25rem'"
            >
              <span class="rd-fieldset-detail-placeholder rd-headline-6"
                >Tanggal Lahir</span
              >
              <span class="rd-fieldset-detail-value rd-body-text-1">{{
                dateOnlyHandler(new Date(dataInmate.date_of_birth))
              }}</span>
            </div>
          </div>
        </div>
        <div class="rd-fieldset-details-double-wrapper">
          <div
            class="rd-fieldset-details"
            style="margin-left: 0.25rem; width: calc(50% - 1rem)"
          >
            <div
              class="rd-fieldset-detail rd-fieldset-detail-large"
              :style="'margin-top: 0.25rem'"
            >
              <span class="rd-fieldset-detail-placeholder rd-headline-6"
                >Jenis Kelamin</span
              >
              <span class="rd-fieldset-detail-value rd-body-text-1">{{
                dataInmate.sex
              }}</span>
            </div>
          </div>
          <div
            class="rd-fieldset-details"
            style="margin-left: 0.25rem; width: calc(50% - 1rem)"
          >
            <div
              class="rd-fieldset-detail rd-fieldset-detail-large"
              :style="'margin-top: 0.25rem'"
            >
              <span class="rd-fieldset-detail-placeholder rd-headline-6"
                >Usia</span
              >
              <span class="rd-fieldset-detail-value rd-body-text-1">{{
                ageHandler(new Date(dataInmate.date_of_birth))
              }}</span>
            </div>
          </div>
        </div>
        <div class="rd-fieldset-details">
          <div
            class="rd-fieldset-detail rd-fieldset-detail-large"
            :style="'margin-top: 0.25rem'"
          >
            <span class="rd-fieldset-detail-placeholder rd-headline-6"
              >Alamat</span
            >
            <span class="rd-fieldset-detail-value rd-body-text-1">{{
              dataInmate.address
            }}</span>
          </div>
        </div>
        <div class="rd-fieldset-details-double-wrapper">
          <div
            class="rd-fieldset-details"
            style="margin-left: 0.25rem; width: calc(50% - 1rem)"
          >
            <div
              class="rd-fieldset-detail rd-fieldset-detail-large"
              :style="'margin-top: 0.25rem'"
            >
              <span class="rd-fieldset-detail-placeholder rd-headline-6"
                >Kelurahan</span
              >
              <span class="rd-fieldset-detail-value rd-body-text-1">{{
                dataInmate.district
              }}</span>
            </div>
          </div>
          <div
            class="rd-fieldset-details"
            style="margin-left: 0.25rem; width: calc(50% - 1rem)"
          >
            <div
              class="rd-fieldset-detail rd-fieldset-detail-large"
              :style="'margin-top: 0.25rem'"
            >
              <span class="rd-fieldset-detail-placeholder rd-headline-6"
                >Kota</span
              >
              <span class="rd-fieldset-detail-value rd-body-text-1">{{
                dataInmate.city
              }}</span>
            </div>
          </div>
        </div>
        <div class="rd-fieldset-details">
          <div
            class="rd-fieldset-detail rd-fieldset-detail-large"
            :style="'margin-top: 0.25rem'"
          >
            <span class="rd-fieldset-detail-placeholder rd-headline-6"
              >Klasifikasi Perkara</span
            >
            <span class="rd-fieldset-detail-value rd-body-text-1">{{
              dataInmate.category
            }}</span>
          </div>
        </div>
        <div class="rd-fieldset-details">
          <div
            class="rd-fieldset-detail rd-fieldset-detail-large"
            :style="'margin-top: 0.25rem'"
          >
            <span class="rd-fieldset-detail-placeholder rd-headline-6"
              >Tanggal Masuk</span
            >
            <span class="rd-fieldset-detail-value rd-body-text-1">{{
              dateOnlyHandler(new Date(dataInmate.date_inside))
            }}</span>
          </div>
        </div>
        <div class="rd-fieldset-details">
          <div
            class="rd-fieldset-detail rd-fieldset-detail-large"
            :style="'margin-top: 0.25rem'"
          >
            <span class="rd-fieldset-detail-placeholder rd-headline-6"
              >Keterangan</span
            >
            <span class="rd-fieldset-detail-value rd-body-text-1">{{
              dataInmate.notes
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
import { Inmate } from "~~/interfaces/inmates";

const props = defineProps<{
  state: "idle" | "hide";
  data: string;
}>();
const emits = defineEmits(["exit", "open-panel"]);
const { getInmateDetails, getLogs } = useInmate();

const config = useRuntimeConfig();
const dataLoading = ref<boolean>(true);
const dataInmate = ref<Inmate>(null);
const imageIndex = ref<number>(0);

const panelState = ref<"idle" | "hide">("idle");

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

function dateOnlyHandler(x: Date): string {
  const year: number = x.getFullYear();
  const month: number = x.getMonth();
  const date: number = x.getDate();

  return `${date} ${months[month]} ${year}`;
}

function dateHandler(x: Date): string {
  const year: number = x.getFullYear();
  const month: number = x.getMonth();
  const date: number = x.getDate();
  const hours: number = x.getHours();
  const minutes: number = x.getMinutes();

  // console.log(year);
  return `${date} ${months[month]} ${year} - ${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

function edit() {
  // console.log("edit");
  // console.log(props.data);
  emits("open-panel", {
    state: "show",
    type: "inmate-form",
    data: props.data,
  });
}
function deleteInmate() {
  emits("open-panel", {
    state: "show",
    type: "inmate-delete",
    data: props.data,
  });
}
function ageHandler(dob) {
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);

  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

watch(
  () => props.state,
  (val) => {
    if (val === "hide") panelState.value = "hide";
  }
);

onMounted(async () => {
  const data = await getInmateDetails(props.data);
  getLogs();
  if (data) {
    dataInmate.value = data;
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  }
});
</script>

<style lang="scss" scoped>
.rd-panel {
  .rd-fieldset {
    position: relative;
    width: calc(100% - 2rem);
    padding: 0.75rem;
    border-radius: 0.75rem;
    margin: 0 1rem 1rem 1rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .rd-fieldset-divider {
      position: relative;
      left: -0.75rem;
      width: calc(100% + 1.5rem);
      height: 1px;
      background: var(--font-color);
      opacity: 0.05;
      margin: 0.75rem 0;
    }
    .rd-fieldset-header {
      position: relative;
      width: 100%;
      height: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .rd-fieldset-body {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      .rd-inmate-images-container {
        position: relative;
        width: 100%;
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        .rd-inmate-image {
          position: relative;
          width: calc(100% - 2rem);
          height: 10rem;
          margin: 0 1rem;
          background: var(--background-depth-two-color);
          border-radius: 0.75rem;
          overflow: hidden;
          display: flex;
          img.rd-image {
            position: relative;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 0.75rem;
          }
        }
        .rd-inmate-image-selector-container {
          position: relative;
          width: 100%;
          height: 5rem;
          margin-top: 1rem;
          padding-left: 0.5rem;
          box-sizing: border-box;
          overflow-x: auto;
          display: flex;
          .rd-inmate-image-selector {
            overflow: hidden;
            position: relative;
            width: 4rem;
            height: 4rem;
            background: var(--background-depth-two-color);
            border-radius: 0.75rem;
            margin-right: 1rem;
            overflow: hidden;
            display: flex;
            flex-shrink: 0;
            filter: grayscale(1);
            transition: filter 0.25s;
            img.rd-image {
              position: relative;
              width: 100%;
              height: 100%;
              border-radius: 0.75rem;
              object-fit: cover;
              transform: scale(1.125);
              transition: transform 0.25s;
            }
            &:hover {
              filter: grayscale(0.5);
            }
            &.rd-inmate-image-selector-active {
              filter: grayscale(0);
              img.rd-image {
                transform: scale(1);
              }
            }
          }
        }
      }
      .rd-fieldset-file {
        position: relative;
        width: 100%;
        height: 3.5rem;
        margin-bottom: 0.25rem;
        padding: 0 0.75rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        .rd-fieldset-file-icon-container {
          position: relative;
          width: 2rem;
          height: 2rem;
          background: var(--background-depth-two-color);
          border-radius: 0.5rem;
          padding: 0 0.5rem;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .rd-fieldset-file-details {
          position: absolute;
          top: 0;
          left: 2.75rem;
          width: calc(100% - 2.75rem);
          height: 100%;
          padding-left: 0.5rem;
          box-sizing: border-box;
          border-radius: 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          span.rd-fieldset-file-value {
            position: relative;
            width: calc(100% - 0.5rem);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          span.rd-fieldset-file-placeholder {
            position: relative;
            opacity: 0.5;
            margin-bottom: 0.125rem;
          }
        }
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--font-color);
          box-sizing: border-box;
          opacity: 0.05;
        }
      }
      .rd-fieldset-details-double-wrapper {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .rd-fieldset-details {
        position: relative;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .rd-fieldset-detail {
          position: relative;
          width: 50%;
          margin-top: 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          span.rd-fieldset-detail-placeholder {
            position: relative;
            margin-bottom: 0.125rem;
            opacity: 1;
          }
          span.rd-fieldset-detail-value {
            border-radius: 0.5rem;
            padding: 0.5rem;
            background: var(--background-depth-two-color);
            position: relative;
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            // white-space: nowrap;
          }
          &.rd-fieldset-detail-large {
            width: 100%;
          }
        }
      }
      .rd-fieldset-status {
        position: relative;
        width: 100%;
        margin-bottom: 0.75rem;
        display: flex;
        .rd-fieldset-status-icon-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          .rd-fieldset-status-icon {
            position: relative;
            width: 2rem;
            height: 2rem;
            background: var(--primary-color);
            border-radius: 0.5rem;
          }
          .rd-fieldset-status-border {
            position: relative;
            width: 2px;
            height: calc(100% - 2.75rem);
            margin-top: 0.75rem;
            background: var(--font-color);
            opacity: 0.05;
            border-radius: 1px;
          }
        }
        .rd-fieldset-status-details-container {
          position: relative;
          width: calc(100% - 2rem);
          margin-left: 2rem;
          padding-left: 0.5rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          .rd-fieldset-status-details {
            position: relative;
            width: 100%;
            margin-bottom: 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            span.rd-fieldset-status-date {
              position: relative;
              margin-bottom: 0.125rem;
              opacity: 0.5;
            }
          }
          .rd-fieldset-status-user {
            position: relative;
            width: 100%;
            height: 1rem;
            display: flex;
            align-items: center;
            .rd-fieldset-status-user-image {
              position: relative;
              width: 1rem;
              height: 1rem;
              border-radius: 50%;
              background: var(--primary-color);
              display: flex;
            }
            span.rd-fieldset-status-user-name {
              position: relative;
              margin-left: 0.25rem;
            }
          }
          .rd-fieldset-status-message {
            position: relative;
            width: 100%;
            margin-top: 0.5rem;
            padding: 0.75rem;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            span.rd-fieldset-status-message-value {
              position: relative;
            }
            &::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border-radius: 0.5rem;
              border: 1px solid var(--font-color);
              box-sizing: border-box;
              opacity: 0.05;
            }
          }
          .rd-fieldset-status-file {
            position: relative;
            width: 100%;
            height: 3.5rem;
            margin-top: 0.5rem;
            padding: 0 0.75rem;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            .rd-fieldset-status-file-icon-container {
              position: relative;
              width: 2rem;
              height: 2rem;
              background: var(--background-depth-two-color);
              border-radius: 0.5rem;
              padding: 0 0.5rem;
              box-sizing: border-box;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .rd-fieldset-status-file-details {
              position: absolute;
              top: 0;
              left: 2.75rem;
              width: calc(100% - 2.75rem);
              height: 100%;
              padding-left: 0.5rem;
              box-sizing: border-box;
              border-radius: 0.5rem;
              display: flex;
              flex-direction: column;
              justify-content: center;
              span.rd-fieldset-status-file-value {
                position: relative;
                width: calc(100% - 0.5rem);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              span.rd-fieldset-status-file-placeholder {
                position: relative;
                opacity: 0.5;
                margin-bottom: 0.125rem;
              }
            }
            &::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border-radius: 0.5rem;
              border: 1px solid var(--font-color);
              box-sizing: border-box;
              opacity: 0.05;
            }
          }
          .rd-fieldset-status-actions {
            position: relative;
            width: 100%;
            margin-top: 0.5rem;
            display: flex;
            justify-content: space-between;
            .rd-fieldset-status-action {
              width: 100%;
            }
          }
        }
        &:last-child {
          margin-bottom: 0;
          .rd-fieldset-status-icon-container {
            .rd-fieldset-status-border {
              opacity: 0;
            }
          }
        }
      }
      .rd-fieldset-item {
        position: relative;
        width: 100%;
        margin-bottom: 0.75rem;
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .rd-fieldset-item-detail {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          span.rd-fieldset-item-placeholder {
            position: relative;
            opacity: 0.5;
            margin-top: 0.125rem;
          }
        }
        .rd-fieldset-item-divider {
          position: relative;
          left: -0.75rem;
          width: calc(100% + 1.5rem);
          height: 1px;
          background: var(--font-color);
          opacity: 0.05;
          margin: 0.75rem 0;
        }
        .rd-fieldset-item-header {
          position: relative;
          width: 100%;
          height: 2rem;
          display: flex;
          justify-content: space-between;
        }
        .rd-fieldset-item-body {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .rd-fieldset-item-detail {
            width: 50%;
            span.rd-fieldset-item-placeholder {
              margin-bottom: 0.125rem;
            }
            &:last-child {
              align-items: flex-end;
              span {
                text-align: right;
              }
            }
          }
        }
        .rd-fieldset-item-footer {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--font-color);
          box-sizing: border-box;
          opacity: 0.05;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
      .rd-fieldset-detail-inline {
        position: relative;
        width: 100%;
        height: 1rem;
        display: flex;
        justify-content: space-between;
        span.rd-fieldset-detail-placeholder {
          position: relative;
          opacity: 0.5;
        }
      }
      .rd-fieldset-input-wrapper {
        position: relative;
        width: 100%;
        display: flex;
        .rd-fieldset-input-button {
          width: 100%;
        }
        margin-bottom: 0.5rem;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .rd-fieldset-footer {
      position: relative;
      width: 100%;
      display: flex;
      .rd-fieldset-detail-inline {
        position: relative;
        width: 100%;
        height: 1rem;
        display: flex;
        justify-content: space-between;
        span.rd-fieldset-detail-placeholder {
          position: relative;
        }
      }
    }
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 0.75rem;
      // border: 1px solid var(--font-color);
      box-sizing: border-box;
      opacity: 0.05;
    }
  }
}
</style>
