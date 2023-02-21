<template>
  <div class="rd-container" ref="rdContainer">
    <div class="rd-page-body">
      <div class="rd-main-wrapper">
        <h1>Udacity Attendance</h1>
        <table>
          <thead>
            <tr>
              <th class="name-col">Student Name</th>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
              <th>6</th>
              <th>7</th>
              <th>8</th>
              <th>9</th>
              <th>10</th>
              <th>11</th>
              <th>12</th>
              <th class="missed-col">Days Missed-col</th>
            </tr>
          </thead>
          <tbody>
            <tr class="student">
              <td class="name-col">Slappy the Frog</td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="missed-col">0</td>
            </tr>
            <tr class="student">
              <td class="name-col">Lilly the Lizard</td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="missed-col">0</td>
            </tr>
            <tr class="student">
              <td class="name-col">Paulrus the Walrus</td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="missed-col">0</td>
            </tr>
            <tr class="student">
              <td class="name-col">Gregory the Goat</td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="missed-col">0</td>
            </tr>
            <tr class="student">
              <td class="name-col">Adam the Anaconda</td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="attend-col"><input type="checkbox"></td>
              <td class="missed-col">0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from "gsap";
import { ComputedRef } from "vue";
import {
  InputGeneric,
  InputOption,
  InputSearchOption,
} from "~~/interfaces/general";
import { InmateQuery } from "~~/interfaces/inmates";
import {
  TransactionOverview,
  TransactionQuery,
} from "~~/interfaces/transaction";

interface AppliedFilter {
  key: "category" | "start_date" | "end_date" | "limit" | "skip";
  value: InmateQuery["category"] | number;
}

definePageMeta({
  middleware: ["auth"],
});


const { query, inmates, getInmates } = useInmate();
const route = useRoute();
const emits = defineEmits(["logout", "open-panel"]);
const { viewMode } = useMain();

const rdContainer = ref<HTMLDivElement>(null);
const rdPageHeader = ref<HTMLDivElement>(null);
const rdTransactionsOverviewContainer = ref<HTMLDivElement>(null);
const rdTransactionsFilterDropdown = ref<HTMLDivElement>(null);
const rdTransactionsFilterContainer = ref<HTMLDivElement>(null);
const rdTransactionsWrapper = ref<HTMLDivElement>(null);

const transactionsOverview = ref<TransactionOverview[]>(null);
const transactionsSearchTimeout = ref<NodeJS.Timeout>(null);
const transactionsInitLoading = ref<boolean>(true);
const transactionsInitAnimating = ref<boolean>(true);

const searchInput = ref<InputSearchOption>({
  name: "search",
  placeholder: "cari terdakwa...",
  model: "",
});
const categoryInput = ref<InputOption>({
  label: "Transaction type",
  name: "type",
  placeholder: "All",
  model: "All",
  value: "all",
  error: "",
  options: [
    {
      name: "Semua",
      value: "all",
    },
    {
      name: "Kategori I",
      value: "Kategori I",
    },
    {
      name: "Kategori II",
      value: "Kategori II",
    },
    {
      name: "Kategori III",
      value: "Kategori III",
    },
  ],
});
const startDateInput = ref<InputOption>({
  name: "start-date",
  placeholder: "29-09-2022",
  model: "",
  value: "",
  label: "From",
  error: "",
});
const endDateInput = ref<InputOption>({
  name: "end-date",
  placeholder: "29-09-2022",
  model: "",
  value: "",
  label: "To",
  error: "",
});

const filterDropdownOpened = ref<boolean>(false);

const search: ComputedRef<string> = computed(() => searchInput.value.model);
const category: ComputedRef<string> = computed(() => categoryInput.value.value);
const startDate: ComputedRef<InmateQuery["start_date"]> = computed(() =>
  new Date(startDateInput.value.value).setHours(0, 0, 0, 0)
);
const endDate: ComputedRef<InmateQuery["end_date"]> = computed(() =>
  new Date(endDateInput.value.value).setHours(23, 59, 59, 999)
);

const appliedFilter: ComputedRef<AppliedFilter[]> = computed(() =>
  Object.keys(query.value)
    .map((a: AppliedFilter["key"]) => ({ key: a, value: query.value[a] }))
    .filter((a: AppliedFilter) => {
      if (a.key === "limit" || a.key === "skip") return false;
      if (a.key === "start_date" && !a.value) return false;
      if (a.key === "end_date" && !a.value) return false;
      if (a.key === "category" && a.value === "all") return false;
      return true;
    })
);

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

function filterKeyHandler(data: AppliedFilter): string {
  console.log(inmates);
  let str: string = "";
  if (data.key === "category") str = data.value.toString();
  else if (data.key === "start_date" || data.key === "end_date") {
    const date: Date = new Date(data.value);
    str = `${data.key === "start_date" ? "from" : "to"} ${date
      .getDate()
      .toString()
      .padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;
  }

  return str;
}

function assignQuery(key?: AppliedFilter["key"]): void {
  if (!key) {
    const payload: InmateQuery = {
      category: category.value,
      start_date: startDate.value,
      end_date: endDate.value,
    };

    if (payload.category) query.value.category = payload.category;
    if (payload.start_date) query.value.start_date = payload.start_date;
    if (payload.end_date) query.value.end_date = payload.end_date;

    filterDropdownHandler("close");
  } else if (query.value[key]) {
    if (key === "category") query.value.category = "all";
    else if (key === "start_date") query.value.start_date = null;
    else if (key === "end_date") query.value.end_date = null;
  }
}

function filterDropdownHandler(state: "open" | "close"): void {
  if (state === "open") {
    filterDropdownOpened.value = true;
    setTimeout(() => {
      rdTransactionsFilterDropdown.value.focus();
      animate.dropDownOpen(rdTransactionsFilterDropdown.value);
    }, 100);
  } else {
    animate.dropDownClose(rdTransactionsFilterDropdown.value, () => {
      filterDropdownOpened.value = false;
    });
  }
}
function conscol() {
  console.log(route.path);
  if (route.path !== "/") {
    console.log(route.path);
    emits("logout");
    console.log(route.path);
  }
}

function loadInmates(text?: string): void {
  // transactionsLoading.value = true;
  setTimeout(async () => {
    console.log("text");
    console.log(text);
    await getInmates(text);
    // transactionsLoading.value = false;
  }, 250);
}
function loadTransactions(text?: string): void {
  // transactionsLoading.value = true;
  setTimeout(async () => {
    // await getTransactions(text);
    // transactionsLoading.value = false;
  }, 250);
}
watch(
  () => startDate.value,
  (val) => {
    if (val) {
      if (val >= endDate.value)
        startDateInput.value.error = "Start date must be less than end date";
      else startDateInput.value.error = "";
    } else startDateInput.value.error = "";
  }
);
watch(
  () => appliedFilter.value,
  () => {
    loadTransactions();
    loadInmates();
    console.log(inmates);
  }
);
watch(
  () => endDate.value,
  (val) => {
    if (val) {
      if (startDate.value >= val)
        startDateInput.value.error = "Start date must be less than end date";
      else startDateInput.value.error = "";
    } else startDateInput.value.error = "";
  }
);
watch(
  () => search.value,
  (val) => {
    clearTimeout(transactionsSearchTimeout.value);
    transactionsSearchTimeout.value = setTimeout(() => {
      loadTransactions(val || "");
      loadInmates(val || "");
    }, 500);
  }
);

onMounted(() => {
  setTimeout(async () => {
    // transactionsOverview.value = await getTransactionOverview();
    animate.init(
      rdPageHeader.value,
      rdTransactionsFilterContainer.value,
      rdTransactionsOverviewContainer.value
    );
    getInmates();
  }, 250);
});
</script>

<style lang="scss" scoped>
.rd-container {
  overflow-y: auto;
  margin-top: 4rem;
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

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
      display: flex;
      flex-direction: column;
      background: red;

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
}
</style>
