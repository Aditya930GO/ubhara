<template>
  <div ref="rdComponent" class="rd-component">
    <div class="rd-panel-header">
      <div class="rd-panel-header-details">
        <span class="rd-panel-title rd-headline-4">Active Transactions</span>
        <span class="rd-panel-subtitle rd-caption-text">{{
          "All unfinished business"
        }}</span>
      </div>
      <div class="rd-panel-header-icon-container">
        <rd-svg
          class="rd-panel-header-icon"
          :name="'dashboard'"
          color="secondary"
        />
      </div>
    </div>
    <div class="rd-panel-divider"></div>
    <div class="rd-panel-body">
      <div
        v-for="transaction in dataTransaction"
        :key="transaction._id"
        class="rd-panel-transaction"
      >
        <div class="rd-panel-transaction-main-data">
          <div class="rd-panel-transaction-icon-container"></div>
          <div class="rd-panel-transaction-data rd-panel-transaction-data-type">
            <span
              class="rd-panel-transaction-data-placeholder rd-caption-text"
              >{{ transaction.type === "sale" ? "Sale" : "Purchase" }}</span
            >
            <span class="rd-panel-transaction-data-value rd-headline-5">{{
              transaction.purchase_order.number
            }}</span>
          </div>
        </div>
      </div>
      <div v-if="!dataTransaction?.length" class="rd-panel-transaction-empty">
        <span class="rd-panel-transaction-placeholder rd-caption-text"
          >There is no active transaction</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TransactionBase } from "~~/interfaces/transaction";

const { getTransactionUnfinished } = useTransaction();

const rdComponent = ref<HTMLElement>(null);

const dataTransaction = ref<TransactionBase[]>([]);

onMounted(async () => {
  dataTransaction.value = await getTransactionUnfinished();
});
</script>

<style lang="scss" scoped>
.rd-component {
  position: relative;
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: var(--background-depth-one-color);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .rd-panel-divider {
    position: relative;
    left: -0.75rem;
    width: calc(100% + 1.5rem);
    height: 1px;
    margin: 0.75rem 0;
    background: var(--font-color);
    opacity: 0.05;
  }
  .rd-panel-header {
    position: relative;
    width: 100%;
    height: 2rem;
    display: flex;
    justify-content: space-between;
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
    position: relative;
    width: 100%;
    display: flex;
    gap: 0.75rem;
    flex-direction: column;
    .rd-panel-transaction {
      position: relative;
      width: 100%;
      height: 3.5rem;
      background: var(--background-depth-one-color);
      box-shadow: var(--box-shadow);
      border-radius: 0.75rem;
      padding: 0.75rem;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
          border-radius: 0.5rem;
          background: var(--background-depth-two-color);
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .rd-panel-transaction-data {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        span.rd-panel-transaction-data-placeholder {
          position: relative;
          margin-bottom: 0.125rem;
          opacity: 0.5;
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
        border: 1px solid var(--font-color);
        box-sizing: border-box;
        opacity: 0.05;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    .rd-panel-transaction-empty {
      position: relative;
      width: 100%;
      height: 3rem;
      padding: 0.75rem;
      box-sizing: border-box;
      display: flex;
      flex-shrink: 0;
      justify-content: center;
      align-items: center;
      span.rd-panel-transaction-placeholder {
        position: relative;
        opacity: 0.5;
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
}
</style>
