<template>
  <rd-panel
    class="rd-panel"
    :label="'Deliver items'"
    :state="panelState"
    :loading="dataLoading"
    @exit="emits('exit')"
  >
    <div class="rd-fieldset">
      <div class="rd-fieldset-header">
        <span class="rd-fieldset-header-name rd-headline-4">
          Items to deliver
        </span>
        <span class="rd-fieldset-header-placeholder rd-caption-text">
          Select which item you want to deliver
        </span>
      </div>
      <div class="rd-fieldset-divider"></div>
      <div class="rd-fieldset-body">
        <div v-for="(item, i) in dataItems" :key="i" class="rd-fieldset-item">
          <div class="rd-fieldset-item-header">
            <div class="rd-fieldset-item-detail">
              <span class="rd-fieldset-item-value rd-headline-5">{{
                item.name
              }}</span>
              <span class="rd-fieldset-item-placeholder rd-caption-text">{{
                `${item.quantity} pcs`
              }}</span>
            </div>
          </div>
          <div class="rd-fieldset-item-divider"></div>
          <div class="rd-fieldset-item-body">
            <div class="rd-fieldset-item-detail">
              <span class="rd-fieldset-item-placeholder rd-caption-text"
                >Required to send</span
              >
              <span class="rd-fieldset-item-value rd-headline-6">{{
                `${item.demand} pcs`
              }}</span>
            </div>
            <div class="rd-fieldset-item-detail">
              <span class="rd-fieldset-item-placeholder rd-caption-text"
                >Available</span
              >
              <span class="rd-fieldset-item-value rd-headline-6">{{
                `${item.remaining} pcs`
              }}</span>
            </div>
          </div>
          <div class="rd-fieldset-item-divider"></div>
          <div class="rd-fieldset-item-footer">
            <span class="rd-fieldset-item-placeholder rd-caption-text"
              >Amount to send</span
            >
            <div class="rd-fieldset-item-quantity-wrapper">
              <div class="rd-fieldset-item-action-wrapper">
                <rd-input-button-small
                  icon="chevron-left-last"
                  :disabled="item.send <= 0"
                  @clicked="item.send = 0"
                  style="
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                    transform-origin: center right;
                  "
                />
                <rd-input-button-small
                  icon="chevron-left"
                  :disabled="item.send <= 0"
                  @clicked="item.send--"
                  style="
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                    transform-origin: center left;
                  "
                />
              </div>
              <span class="rd-fieldset-item-quantity rd-headline-6">{{
                item.send
              }}</span>
              <div class="rd-fieldset-item-action-wrapper">
                <rd-input-button-small
                  icon="chevron-right"
                  :disabled="
                    item.send >= item.demand || item.send >= item.remaining
                  "
                  @clicked="item.send++"
                  style="
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                    transform-origin: center right;
                  "
                />
                <rd-input-button-small
                  icon="chevron-right-last"
                  :disabled="
                    item.send >= item.demand || item.send >= item.remaining
                  "
                  @clicked="
                    item.send =
                      item.remaining >= item.demand
                        ? item.demand
                        : item.remaining
                  "
                  style="
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                    transform-origin: center left;
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        :loading="submitLoading"
        :label="'Submit'"
        :disabled="!items.length"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import { ProductStockMin } from "~~/interfaces/product";
  import { Transaction } from "~~/interfaces/transaction";

  interface ItemPayload {
    _id: string;
    quantity: number;
  }

  const {
    addTransactionDelivery,
    addTransactionAcceptance,
    getTransactionDeliveries,
  } = useTransaction();
  const props = defineProps<{
    state: "idle" | "hide";
    data: Transaction;
  }>();
  const emits = defineEmits(["exit"]);

  const dataLoading = ref<boolean>(true);
  const dataItems = ref<
    {
      _id: string;
      name: string;
      remaining: number;
      quantity: number;
      demand: number;
      send: number;
    }[]
  >([]);

  const submitLoading = ref<boolean>(false);
  const panelState = ref<"idle" | "hide">("idle");

  const items: ComputedRef<ItemPayload[]> = computed((): ItemPayload[] =>
    dataItems.value
      .map((a) => ({ _id: a._id, quantity: a.send }))
      .filter((a) => a.quantity)
  );

  async function submit(): Promise<void> {
    submitLoading.value = true;

    let transactionId: string = "";
    if (props.data.type === "sale") {
      transactionId = await addTransactionDelivery(props.data._id, items.value);
    } else if (props.data.type === "purchase") {
      transactionId = await addTransactionAcceptance(
        props.data._id,
        items.value
      );
    }
    if (transactionId) panelState.value = "hide";
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );

  onMounted(async () => {
    const result: ProductStockMin[] = await getTransactionDeliveries(
      props.data._id
    );
    dataItems.value = result.map((a) => {
      const index: number = props.data.item.findIndex((b) => b._id === a._id);
      if (index === -1) return null;
      return {
        _id: a._id,
        remaining: a.remaining,
        demand: a.demand,
        quantity: props.data.item[index].quantity,
        name: props.data.item[index].name,
        send: 0,
      };
    });
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
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
            flex-direction: column;
            span.rd-fieldset-item-placeholder {
              position: relative;
              margin-bottom: 0.5rem;
              opacity: 0.5;
            }
            .rd-fieldset-item-quantity-wrapper {
              position: relative;
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .rd-fieldset-item-action-wrapper {
                position: relative;
                height: 2rem;
                display: flex;
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
          &:last-child {
            margin-bottom: 0;
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
    .rd-panel-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4rem;
      background: var(--background-depth-one-color);
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
      padding: 1rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      .rd-panel-button {
        width: 100%;
      }
      &::after {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--font-color);
        opacity: 0.05;
      }
    }
  }
</style>
