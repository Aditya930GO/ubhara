<template>
  <div class="rd-container" ref="rdContainer">
    <div class="rd-page-header" ref="rdPageHeader">
      <h1 class="rd-page-header-title rd-headline-1">Dashboard</h1>
    </div>
    <div v-if="!dataLoading" class="rd-page-body"></div>
    <div v-else class="rd-page-loading">
      <rd-progress-bar :state="dataLoading ? 'show' : 'hide'" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from "gsap";

import { Branch } from "~~/interfaces/branch";
import { Product } from "~~/interfaces/product";
import { ChartCashflow } from "~~/interfaces/general";

definePageMeta({
  middleware: ["auth"],
});
const { getOverview } = useMain();

const rdPageHeader = ref<HTMLDivElement>(null);

const dataLoading = ref<boolean>(true);
const dataProducts = ref<Product[]>([]);
const dataBranches = ref<Branch[]>([]);
const dataCashflow = ref<ChartCashflow[]>(null);
const dataProcessingCount = ref<number>(0);
const dataSaleCount = ref<number>(0);
const dataAverageSales = ref<number>(0);
const dataTotalSales = ref<number>(0);

const animate = {
  init(rdPageHeader: HTMLElement): void {
    const tl: GSAPTimeline = gsap.timeline();

    tl.to([rdPageHeader], {
      opacity: 1,
      duration: 0.25,
    });
  },
};

onMounted(() => {
  setTimeout(async () => {
    animate.init(rdPageHeader.value);

    const result: {
      products: Product[];
      branches: Branch[];
      cashflow: ChartCashflow[];
      processingCount: number;
      saleCount: number;
      averageSales: number;
      totalSales: number;
    } = await getOverview();
    if (result?.products) dataProducts.value = result.products;
    if (result?.branches) dataBranches.value = result.branches;
    if (result?.cashflow) dataCashflow.value = result.cashflow;
    if (result?.processingCount)
      dataProcessingCount.value = result.processingCount;
    if (result?.saleCount) dataSaleCount.value = result.saleCount;
    if (result?.averageSales) dataAverageSales.value = result.averageSales;
    if (result?.totalSales) dataTotalSales.value = result.totalSales;

    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  }, 250);
});
</script>

<style lang="scss" scoped>
.rd-container {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  .rd-page-header {
    position: relative;
    width: 100%;
    height: 4rem;
    opacity: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1.rd-page-header-title {
      position: relative;
      color: var(--font-color);
    }
  }
  .rd-page-body {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    .rd-page-body-row {
      position: relative;
      width: 100%;
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
      .rd-page-body-col-l {
        position: relative;
        width: calc(50% - 0.5rem);
        display: flex;
        flex-direction: column;
      }
      .rd-page-body-col-m {
        position: relative;
        width: calc(25% - 0.75rem);
        display: flex;
        flex-direction: column;
      }
      .rd-page-body-col-xl {
        position: relative;
        width: calc(75% - 0.25rem);
        display: flex;
        flex-direction: column;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .rd-page-loading {
    position: relative;
    width: 100%;
    height: calc(100vh - 6rem);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media only screen and (max-width: 1024px) {
    .rd-page-body {
      .rd-page-body-row {
        flex-direction: column;
        justify-content: flex-start;
        .rd-page-body-col-l,
        .rd-page-body-col-m,
        .rd-page-body-col-xl {
          width: 100%;
          margin-bottom: 1rem;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
