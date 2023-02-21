<template>
  <div ref="rdComponent" class="rd-component">
    <header class="rd-panel-header">
      <div class="rd-panel-header-details">
        <span class="rd-panel-title rd-headline-1">Analytics</span>
        <span class="rd-panel-subtitle rd-caption-text">{{
          "Analisis data arsip"
        }}</span>
      </div>
      <div class="rd-panel-header-icon-container">
        <rd-svg
          class="rd-panel-header-icon"
          :name="'analytic'"
          color="secondary"
        />
      </div>
    </header>
    <div class="rd-panel-divider" v-if="dataInmate"></div>
    <div class="rd-panel-body">
      <div class="rd-panel-content">
        <div class="rd-cases-breakdown">
          <div class="rd-header">
            <div
              class="rd-placeholder rd-headline-1"
              style="font-weight: 800; font-size: 0.75rem"
            >
              Total Berkas
            </div>
            <div class="rd-icon-container"></div>
          </div>

          <div class="rd-count">
            <span class="rd-value rd-headline-2">{{ inmates.length }}</span>
            <span class="rd-placeholder rd-caption-text">{{
              "       berkas"
            }}</span>
          </div>
          <div class="rd-body">
            <div class="rd-data">
              <div class="rd-name rd-body-text-1">Kategori I</div>
              <div class="rd-total-count rd-body-text-1">
                {{ inmatesData.categoryOne }}
              </div>
            </div>
            <div class="rd-panel-divider"></div>
            <div class="rd-data">
              <div class="rd-name rd-body-text-1">Kategori II</div>
              <div class="rd-total-count rd-body-text-1">
                {{ inmatesData.categoryTwo }}
              </div>
            </div>
            <div class="rd-panel-divider"></div>
            <div class="rd-data">
              <div class="rd-name rd-body-text-1">Kategori III</div>
              <div class="rd-total-count rd-body-text-1">
                {{ inmatesData.categoryThree }}
              </div>
            </div>
          </div>
          <div class="rd-body">
            <div class="rd-data">
              <div class="rd-name rd-body-text-1">Pria</div>
              <div class="rd-total-count rd-body-text-1">
                {{ inmatesData.male }}
              </div>
            </div>
            <div class="rd-panel-divider"></div>
            <div class="rd-data">
              <div class="rd-name rd-body-text-1">Wanita II</div>
              <div class="rd-total-count rd-body-text-1">
                {{ inmatesData.female }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TransactionBase } from "~~/interfaces/transaction";

const { getTransactionUnfinished } = useTransaction();

const { logs, inmates, getLogs, getInmatesOverview } = useInmate();
const rdComponent = ref<HTMLElement>(null);
const inmatesData = ref<INMATETYPE>({
  categoryOne: 0,
  categoryTwo: 0,
  categoryThree: 0,
  male: 0,
  female: 0,
  value: 0,
});
interface INMATETYPE {
  categoryOne: number | any;
  categoryTwo: number;
  categoryThree: number;
  male: number;
  female: number;
  value: number;
}
// ref<INTERFACE>(["anjing"]);
let dataLogs = [];
let dataInmate = [];
// let dataCount = ref<string>("");
// let sexMale = ref<number>(0);
// let sexFemale = ref<number>(0);
// let categories = [];
// let ages = [];

const scrollValue = ref<number>(0);
const scrollThreshold = ref<number>(0);

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
// function totalCount() {
//   const inmate = inmates;
//   return inmate.length ? inmate.reduce((a, b) => a + b.count, 0) : 0;
// }
function colorHandler(val) {
  if (val.dataInmate && val.dataInmate.length)
    this.items = val.dataInmate.map((a) => ({
      ...a,
      color: randomizeColor(),
    }));
}
function randomizeColor() {
  return `rgba(${Math.round(Math.random() * 255)}, ${Math.round(
    Math.random() * 255
  )}, ${Math.round(Math.random() * 255)}, 1)`;
}
function dateHandler(x: Date): string {
  const year: number = x.getFullYear();
  const month: number = x.getMonth();
  const date: number = x.getDate();
  const hours: number = x.getHours();
  const minutes: number = x.getMinutes();

  return `${date} ${months[month]} ${year} - ${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

onMounted(async () => {
  getLogs();
  getInmatesOverview();
  dataInmate = await getInmatesOverview();
  for (const data of dataInmate) {
    if (data.sex && data.sex.includes("pria")) {
      inmatesData.value.male++;
    } else if (data.sex && data.sex.includes("wanita")) {
      inmatesData.value.female++;
    }
    if (data.category && data.category.includes("Kategori III")) {
      inmatesData.value.categoryThree++;
    } else if (data.category && data.category.includes("Kategori II")) {
      inmatesData.value.categoryTwo++;
    } else if (data.category && data.category.includes("Kategori I")) {
      inmatesData.value.categoryOne++;
    }
  }
  console.log("data");
  console.log(inmatesData.value.male);
  console.log(inmatesData.value.female);
  // console.log(sexMale);

  console.log(dataInmate.length);
});
</script>

<style lang="scss" scoped>
.rd-component {
  z-index: 4;
  position: fixed;
  right: 1rem;
  width: calc(20rem - 1px);
  height: 100vh;
  background: var(--background-depth-one-color);
  border-left: 1px solid var(--border-color);
  overflow-x: hidden;
  overflow-y: visible;
  opacity: 1;
  display: flex;
  flex-direction: column;
  // transform: scale(0.875);
  .rd-panel-divider {
    position: relative;
    left: -0.75rem;
    width: calc(100% + 1.5rem);
    height: 1px;
    margin: 0.75rem 0;
    // background: var(--font-color);
    opacity: 0.05;
  }
  header.rd-panel-header {
    z-index: 99999999;
    // background: white;
    top: 4rem;
    position: fixed;
    width: 20rem;
    height: 3rem;
    padding: 1rem 1rem 1rem 1rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    .rd-panel-header-details {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      span.rd-panel-title {
        position: relative;
      }
      span.rd-panel-subtitle {
        position: relative;
        opacity: 0.5;
      }
    }
    .rd-panel-header-icon-container {
      position: relative;
      width: 2rem;
      height: 2rem;
      margin-top: 1rem;
      border-radius: 0.75rem;
      padding: 0 0.5rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: scale(1.25);
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 0.75rem;
        background: var(--background-depth-two-color);
      }
    }
  }
  .rd-panel-body {
    margin-top: 6rem;
    overflow-x: hidden;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    .rd-panel-content {
      margin: 1rem;
      z-index: 1;
      position: relative;
      width: 90%;
      display: flex;
      flex-direction: column;
      .rd-cases-breakdown {
        position: relative;
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.75rem;
        margin-bottom: 0.5rem;
        border: 1px solid var(--border-color);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        > .rd-header {
          position: relative;
          padding: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .rd-placeholder {
            position: relative;
            font-size: 0.65rem;
            font-weight: 600;
            line-height: 1;
          }
          .rd-icon-container {
            position: relative;
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 0.5rem;
            background: var(--background-secondary-color);
            display: flex;
            justify-content: center;
            align-items: center;
            .rd-icon {
              font-size: 0.85rem;
            }
          }
        }
        .rd-body {
          position: relative;
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          width: 85%;
          padding: 1rem 1.3rem 1rem 1rem;
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          .rd-count {
            position: relative;
            display: flex;
            justify-content: flex-start;
            margin-bottom: 1rem;
            align-items: flex-end;
            span.rd-value {
              position: relative;
              font-size: 1.25rem;
              font-weight: 700;
              line-height: 1;
            }
            span.rd-placeholder {
              position: relative;
              margin-left: 0.25rem;
              opacity: 0.8;
              margin-bottom: 0.2rem;
              font-size: 0.55rem;
              font-weight: 600;
              line-height: 1;
              color: var(--subtext-color);
            }
          }
          .rd-panel-divider {
            position: relative;
            left: 0.01rem;
            width: 14rem;
            height: 1px;
            // border-bottom: 1px solid var(--font-color);
            // margin: 0.75rem 0;
            background: var(--font-color);
            opacity: 0.25;
          }
          .rd-data {
            position: relative;
            width: 100%;
            height: 0.4rem;
            // margin-bottom: 0.25rem;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .rd-name {
              position: relative;
              line-height: 1;
              color: var(--text-color);
            }
            .rd-total-count {
              position: relative;
              line-height: 1;
              color: var(--text-color);
            }
            &:last-child {
              margin: 0;
            }
          }
        }
        .rd-panel-divider {
          position: relative;
          // left: 0.1rem;
          width: 10rem;
          height: 1px;
          margin: 0.75rem 0;
          background: var(--font-color);
          opacity: 0.25;
        }
      }
    }
  }
}
</style>
