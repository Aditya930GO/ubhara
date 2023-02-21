<template>
  <div ref="rdComponent" class="rd-component">
    <header class="rd-panel-header">
      <div class="rd-panel-header-details">
        <span class="rd-panel-title rd-headline-1">Riwayat Aktifitas</span>
        <span class="rd-panel-subtitle rd-caption-text">{{
          "Riwayat aktifitas pengguna"
        }}</span>
      </div>
      <div class="rd-panel-header-icon-container">
        <rd-svg
          class="rd-panel-header-icon"
          :name="'history'"
          color="secondary"
        />
      </div>
    </header>
    <div class="rd-panel-divider"></div>
    <div class="rd-panel-body">
      <div class="rd-panel-content">
        <div
          v-for="log in logs?.slice().reverse()"
          :key="log._id"
          class="rd-panel-transaction"
        >
          <div class="rd-panel-transaction-main-data">
            <div class="rd-panel-transaction-icon-container">
              <div class="rd-icon"></div>
            </div>
            <div
              class="rd-panel-transaction-data rd-panel-transaction-data-type"
            >
              <span
                class="rd-panel-transaction-data-placeholder rd-caption-text"
                >{{ dateHandler(new Date(log.date)) }}</span
              >
              <span class="rd-panel-transaction-data-value rd-headline-5">{{
                log.type === "login"
                  ? "Anda masuk program"
                  : log.type === "delete"
                  ? "Anda menghapus 1 berkas"
                  : log.type === "add"
                  ? "Anda menambahkan 1 berkas"
                  : log.type === "password"
                  ? "Anda mengganti password"
                  : "Anda mengubah 1 berkas"
              }}</span>
              <span
                v-if="log.registration !== '-' && log.registration !== null"
                class="rd-panel-transaction-data-placeholder rd-caption-text"
                >{{ " - " + log.registration }}</span
              >
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

const { logs, getLogs } = useInmate();
const rdComponent = ref<HTMLElement>(null);

let dataLogs = [];
const dataTransaction = ref<TransactionBase[]>([]);

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

function scrollHandler({ target }: Event): void {
  if (target instanceof HTMLElement) {
    scrollValue.value = target.scrollTop;
  }
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
  dataTransaction.value = await getTransactionUnfinished();
  dataLogs = logs.value;
  // console.log(dataTransaction.value);
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
      border-radius: 0.75rem;
      padding: 0 0.5rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
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
    margin-bottom: 2rem;
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
      .rd-panel-transaction {
        position: relative;
        width: 100%;
        height: 4rem;
        background: var(--background-depth-one-color);
        // box-shadow: var(--box-shadow);
        border-radius: 0.5rem;
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        border: 1px solid var(--border-color);
        .rd-panel-transaction-main-data {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-shrink: 0;
          .rd-panel-transaction-data {
            margin-left: 0.75rem;
          }
          .rd-panel-transaction-icon-container {
            position: relative;
            width: 2rem;
            height: 2rem;
            top: 0.2rem;
            border-radius: 0.5rem;
            background: var(--background-depth-two-color);
            display: flex;
            justify-content: center;
            align-items: center;
            .rd-icon {
              z-index: 9999;
              position: relative;
              width: 0.75rem;
              height: 0.75rem;
              border-radius: 50%;
              background: var(--primary-color);
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
        .rd-panel-transaction-data {
          padding-left: 0.5rem;
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transform: scale(1.125);
          span.rd-panel-transaction-data-placeholder {
            position: relative;
            // margin-bottom: 0.125rem;
            opacity: 0.75;
          }
          span.rd-panel-transaction-data-value {
            position: relative;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        &::before {
          pointer-events: none;
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
        &:last-child {
          margin-bottom: 0;
        }
      }
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
  // .rd-panel-header {
  //   z-index: 99999999;
  //   background: white;
  //   position: fixed;
  //   width: 20rem;
  //   height: 3rem;
  //   padding: 0 2rem 1rem 2rem;
  //   box-sizing: border-box;
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   flex-direction: row;
  //   .rd-panel-header-details {
  //     position: relative;
  //     height: 100%;
  //     display: flex;
  //     flex-direction: column;
  //     justify-content: space-between;
  //     span.rd-panel-title {
  //       position: relative;
  //     }
  //     span.rd-panel-subtitle {
  //       position: relative;
  //       opacity: 0.5;
  //     }
  //   }
  //   .rd-panel-header-icon-container {
  //     position: relative;
  //     width: 2rem;
  //     height: 2rem;
  //     border-radius: 0.75rem;
  //     padding: 0 0.5rem;
  //     box-sizing: border-box;
  //     display: flex;
  //     justify-content: center;
  //     align-items: center;
  //     &::before {
  //       content: "";
  //       position: absolute;
  //       top: 0;
  //       left: 0;
  //       width: 100%;
  //       height: 100%;
  //       border-radius: 0.75rem;
  //       background: var(--background-depth-two-color);
  //     }
  //   }
  // }
  // // .rd-panel-body-container {
  // // position: relative;
  // // width: 100%;
  // // display: flex;
  // // gap: 0.75rem;
  // // flex-direction: column;
  // .rd-panel-body {
  //   // position: relative;
  //   // width: 100%;
  //   // display: flex;
  //   // gap: 0.75rem;
  //   // flex-direction: column;

  //   // top: 2rem;
  //   // z-index: 1;
  //   // position: relative;
  //   // width: 100%;
  //   // height: calc(100% - 2rem);
  //   // padding: 1rem 0;
  //   // box-sizing: border-box;
  //   // overflow-y: auto;
  //   // overflow-x: hidden;
  //   // display: flex;
  //   // flex-shrink: 0;
  //   // flex-direction: column;

  //   margin-top: 2.5rem;
  //   overflow: hidden;
  //   position: relative;
  //   width: 100%;
  //   display: flex;
  //   flex-direction: column;

  //   .rd-panel-conten {
  //     margin: 1rem;
  //     z-index: 1;
  //     position: relative;
  //     width: 95%;
  //     display: flex;
  //     flex-direction: column;
  //     .rd-panel-transaction {
  //       position: relative;
  //       margin-bottom: 1rem;
  //     }
  //   }
  //   .rd-panel-transaction {
  //     position: relative;
  //     width: 100%;
  //     height: 4rem;
  //     background: var(--background-depth-one-color);
  //     // box-shadow: var(--box-shadow);
  //     border-radius: 0.5rem;
  //     padding: 0.75rem;
  //     box-sizing: border-box;
  //     display: flex;
  //     justify-content: space-between;
  //     align-items: center;
  //     .rd-panel-transaction-main-data {
  //       position: relative;
  //       width: 100%;
  //       height: 100%;
  //       display: flex;
  //       flex-shrink: 0;
  //       .rd-panel-transaction-data {
  //         margin-left: 0.75rem;
  //       }
  //       .rd-panel-transaction-icon-container {
  //         position: relative;
  //         width: 2rem;
  //         height: 2rem;
  //         // border-radius: 0.5rem;
  //         // background: var(--background-depth-two-color);
  //         display: flex;
  //         justify-content: center;
  //         align-items: center;
  //         .rd-icon {
  //           z-index: 9999;
  //           position: relative;
  //           width: 0.75rem;
  //           height: 0.75rem;
  //           border-radius: 50%;
  //           background: var(--primary-color);
  //           display: flex;
  //           justify-content: center;
  //           align-items: center;
  //         }
  //       }
  //     }
  //     .rd-panel-transaction-data {
  //       position: relative;
  //       height: 100%;
  //       display: flex;
  //       flex-direction: column;
  //       justify-content: center;
  //       span.rd-panel-transaction-data-placeholder {
  //         position: relative;
  //         margin-bottom: 0.125rem;
  //         opacity: 0.5;
  //       }
  //       span.rd-panel-transaction-data-value {
  //         position: relative;
  //         white-space: nowrap;
  //         text-overflow: ellipsis;
  //         overflow: hidden;
  //       }
  //     }
  //     &::before {
  //       pointer-events: none;
  //       content: "";
  //       position: absolute;
  //       top: 0;
  //       left: 0;
  //       width: 100%;
  //       height: 100%;
  //       border-radius: 0.75rem;
  //       border: 1px solid var(--font-color);
  //       box-sizing: border-box;
  //       opacity: 0.05;
  //     }
  //     &:last-child {
  //       margin-bottom: 0;
  //     }
  //   }
  //   // }
  //   .rd-panel-transaction-empty {
  //     position: relative;
  //     width: 100%;
  //     height: 3rem;
  //     padding: 0.75rem;
  //     box-sizing: border-box;
  //     display: flex;
  //     flex-shrink: 0;
  //     justify-content: center;
  //     align-items: center;
  //     span.rd-panel-transaction-placeholder {
  //       position: relative;
  //       opacity: 0.5;
  //     }
  //     &::before {
  //       content: "";
  //       position: absolute;
  //       top: 0;
  //       left: 0;
  //       width: 100%;
  //       height: 100%;
  //       border-radius: 0.5rem;
  //       border: 1px solid var(--font-color);
  //       box-sizing: border-box;
  //       opacity: 0.05;
  //     }
  //     // }
  //   }
  // }
  // &::before {
  //   content: "";
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  //   border-radius: 0.75rem;
  //   // border: 1px solid var(--font-color);
  //   box-sizing: border-box;
  //   opacity: 0.05;
  // }
}
</style>
