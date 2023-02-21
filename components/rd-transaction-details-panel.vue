<template>
  <rd-panel
    class="rd-panel"
    :label="'Transaction details'"
    :state="panelState"
    :loading="dataLoading"
    @exit="emits('exit')"
  >
    <div v-if="dataTransaction" class="rd-fieldset">
      <div class="rd-fieldset-header">
        <span class="rd-fieldset-header-name rd-headline-4">
          Main information
        </span>
        <span class="rd-fieldset-header-placeholder rd-caption-text">
          {{ statusHandler(dataTransaction.status[0].type) }}
        </span>
      </div>
      <div class="rd-fieldset-divider"></div>
      <div class="rd-fieldset-body">
        <div
          v-if="dataTransaction.purchase_order.file_url"
          class="rd-fieldset-file"
        >
          <div class="rd-fieldset-file-icon-container">
            <rd-svg
              :name="iconHandler(dataTransaction.purchase_order.file_url)"
              :color="'secondary'"
            />
          </div>
          <div class="rd-fieldset-file-details">
            <span class="rd-fieldset-file-placeholder rd-caption-text"
              >Purchase order</span
            >
            <span class="rd-fieldset-file-value rd-headline-5">{{
              dataTransaction.purchase_order.number
            }}</span>
          </div>
        </div>
        <div class="rd-fieldset-details">
          <div
            class="rd-fieldset-detail rd-fieldset-detail-large"
            :style="
              !dataTransaction.purchase_order.file_url ? 'margin-top: 0' : ''
            "
          >
            <span class="rd-fieldset-detail-placeholder rd-caption-text"
              >Purchase Order Number</span
            >
            <span class="rd-fieldset-detail-value rd-headline-5">{{
              dataTransaction.purchase_order.number
            }}</span>
          </div>
          <div class="rd-fieldset-detail rd-fieldset-detail-large">
            <span class="rd-fieldset-detail-placeholder rd-caption-text">{{
              dataTransaction.type === "purchase" ? "Supplier" : "Customer"
            }}</span>
            <span class="rd-fieldset-detail-value rd-headline-5">{{
              dataTransaction.subject.name
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="dataTransaction" class="rd-fieldset">
      <div class="rd-fieldset-header">
        <span class="rd-fieldset-header-name rd-headline-4">
          Status timeline
        </span>
        <span class="rd-fieldset-header-placeholder rd-caption-text">
          History of the transaction
        </span>
      </div>
      <div class="rd-fieldset-divider"></div>
      <div class="rd-fieldset-body">
        <div
          v-for="(activity, i) in dataTransaction.activity"
          :key="i"
          class="rd-fieldset-status"
        >
          <div class="rd-fieldset-status-icon-container">
            <div class="rd-fieldset-status-icon"></div>
            <div class="rd-fieldset-status-border"></div>
          </div>
          <div class="rd-fieldset-status-details-container">
            <div class="rd-fieldset-status-details">
              <span class="rd-fieldset-status-date rd-caption-text">{{
                dateHandler(new Date(activity.date))
              }}</span>
              <span class="rd-fieldset-status-name rd-headline-5">{{
                activity.type === "status" &&
                activity.status_type === "processing" &&
                i === 0
                  ? "Created & Approved"
                  : typeHandler(
                      activity.type === "status"
                        ? activity.status_type
                        : activity.type
                    )
              }}</span>
            </div>
            <div v-if="activity.user" class="rd-fieldset-status-user">
              <div class="rd-fieldset-status-user-image"></div>
              <span class="rd-fieldset-status-user-name rd-headline-6">{{
                activity.user.name
              }}</span>
            </div>
            <div v-if="activity.message" class="rd-fieldset-status-message">
              <span class="rd-fieldset-status-message-value rd-caption-text">
                {{ activity.message }}
              </span>
            </div>
            <div
              v-for="document in activity.document || []"
              :key="document._id"
              class="rd-fieldset-status-file"
            >
              <div class="rd-fieldset-status-file-icon-container">
                <rd-svg
                  :name="
                    document.file_url ? iconHandler(document.file_url) : 'file'
                  "
                  :color="'secondary'"
                />
              </div>
              <div class="rd-fieldset-status-file-details">
                <span
                  class="rd-fieldset-status-file-placeholder rd-caption-text"
                  >{{ fileTypeHandler(document.type) }}</span
                >
                <span class="rd-fieldset-status-file-value rd-headline-5">{{
                  document.number
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="dataTransaction" class="rd-fieldset">
      <div class="rd-fieldset-header">
        <span class="rd-fieldset-header-name rd-headline-4">
          Transaction details
        </span>
        <span class="rd-fieldset-header-placeholder rd-caption-text">
          History of the transaction
        </span>
      </div>
      <div class="rd-fieldset-divider"></div>
      <div class="rd-fieldset-body">
        <div
          v-for="(item, i) in dataTransaction.item"
          :key="i"
          class="rd-fieldset-item"
        >
          <div class="rd-fieldset-item-header">
            <div class="rd-fieldset-item-detail">
              <span class="rd-fieldset-item-value rd-headline-5">{{
                item.name
              }}</span>
              <span class="rd-fieldset-item-placeholder rd-caption-text">{{
                `Rp ${item.price.toLocaleString("de-DE")}`
              }}</span>
            </div>
          </div>
          <div class="rd-fieldset-item-divider"></div>
          <div class="rd-fieldset-item-body">
            <div class="rd-fieldset-item-detail">
              <span class="rd-fieldset-item-placeholder rd-caption-text"
                >Quantity</span
              >
              <span class="rd-fieldset-item-value rd-headline-6">{{
                `${item.quantity} pcs`
              }}</span>
            </div>
            <div class="rd-fieldset-item-detail">
              <span class="rd-fieldset-item-placeholder rd-caption-text"
                >Discount</span
              >
              <span class="rd-fieldset-item-value rd-headline-6">{{
                `${item.discount * 100} %`
              }}</span>
            </div>
          </div>
          <div class="rd-fieldset-item-divider"></div>
          <div class="rd-fieldset-item-footer">
            <span class="rd-fieldset-item-placeholder rd-caption-text"
              >subtotal</span
            >
            <span class="rd-fieldset-item-value rd-headline-6">{{
              `Rp ${(
                item.price *
                item.quantity *
                (1 - item.discount)
              ).toLocaleString("de-DE")}`
            }}</span>
          </div>
        </div>
      </div>
      <div class="rd-fieldset-divider"></div>
      <div class="rd-fieldset-body">
        <div class="rd-fieldset-detail-inline">
          <span class="rd-fieldset-detail-placeholder rd-caption-text"
            >Subtotal</span
          >
          <span class="rd-fieldset-detail-value rd-headline-6">{{
            `Rp ${dataTransaction.sub_total.toLocaleString("de-DE")}`
          }}</span>
        </div>
        <div class="rd-fieldset-detail-inline">
          <span class="rd-fieldset-detail-placeholder rd-caption-text"
            >VAT (11%)</span
          >
          <span class="rd-fieldset-detail-value rd-headline-6">{{
            `Rp ${(
              dataTransaction.tax * dataTransaction.sub_total
            ).toLocaleString("de-DE")}`
          }}</span>
        </div>
      </div>
      <div class="rd-fieldset-divider"></div>
      <div class="rd-fieldset-footer">
        <div class="rd-fieldset-detail-inline">
          <span class="rd-fieldset-detail-placeholder rd-headline-6"
            >Total</span
          >
          <span class="rd-fieldset-detail-value rd-headline-6">{{
            `Rp ${dataTransaction.total.toLocaleString("de-DE")}`
          }}</span>
        </div>
      </div>
    </div>
    <div
      v-if="
        dataTransaction &&
        dataTransaction.status[0].type !== 'finished' &&
        dataTransaction.status[0].type !== 'rejected' &&
        dataTransaction.status[0].type !== 'cancelled'
      "
      class="rd-fieldset"
      style="margin-bottom: 0"
    >
      <div class="rd-fieldset-header">
        <span class="rd-fieldset-header-name rd-headline-4">Actions</span>
        <span class="rd-fieldset-header-placeholder rd-caption-text">
          Choose what happen to this transaction
        </span>
      </div>
      <div class="rd-fieldset-divider"></div>
      <div class="rd-fieldset-body">
        <div
          v-if="dataTransaction.status[0].type === 'waiting'"
          class="rd-fieldset-input-wrapper"
        >
          <rd-input-button class="rd-fieldset-input-button" label="Approve" />
        </div>
        <div
          v-if="dataTransaction.status[0].type === 'processing'"
          class="rd-fieldset-input-wrapper"
        >
          <rd-input-button
            class="rd-fieldset-input-button"
            :label="
              dataTransaction.type === 'purchase' ? 'Acceptances' : 'Deliveries'
            "
            type="secondary"
            @clicked="
              emits('open-panel', {
                state: 'show',
                type: 'transaction-deliver-form',
                data: dataTransaction,
              })
            "
          />
        </div>
        <div
          v-if="dataTransaction.status[0].type === 'processing'"
          class="rd-fieldset-input-wrapper"
        >
          <rd-input-button
            class="rd-fieldset-input-button"
            label="Payments"
            type="secondary"
            @clicked="
              emits('open-panel', {
                state: 'show',
                type: 'transaction-payment',
                data: dataTransaction,
              })
            "
          />
        </div>
      </div>
      <div class="rd-fieldset-divider"></div>
      <div class="rd-fieldset-body">
        <div class="rd-fieldset-input-wrapper">
          <rd-input-button
            class="rd-fieldset-input-button"
            type="error"
            :label="
              dataTransaction.status[0].type === 'waiting'
                ? 'Reject transaction'
                : 'Cancel transaction'
            "
            @clicked="
              emits('open-panel', {
                state: 'show',
                type: 'transaction-cancel',
                data: dataTransaction,
              })
            "
          />
        </div>
      </div>
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import {
    Transaction,
    TransactionDocument,
    TransactionStatus,
  } from "~~/interfaces/transaction";

  type ActivityType =
    | TransactionStatus["type"]
    | "delivery"
    | "payment"
    | "create-payment"
    | "fulfill-payment"
    | "warn-payment";

  const props = defineProps<{
    state: "idle" | "hide";
    data: string;
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { getTransactionDetails } = useTransaction();

  const dataLoading = ref<boolean>(true);
  const dataTransaction = ref<Transaction>(null);

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

  function iconHandler(name: string): string {
    const str: string = name.split(".").reverse()[0];
    if (!str) return "file";
    if (str === "svg") return "image";
    if (str === "png") return "image";
    if (str === "jpg") return "image";
    if (str === "jpeg") return "image";
    if (str === "word") return "word";
    if (str === "excel") return "excel";
    if (str === "pdf") return "pdf";
    return "file";
  }

  function statusHandler(type: TransactionStatus["type"]): string {
    let str: string = "";
    if (type === "waiting") str = "Waiting Approval";
    else if (type === "processing") str = "Processing";
    else if (type === "finished") str = "Finished";
    else if (type === "cancelled") str = "Cancelled";
    else if (type === "rejected") str = "Rejected";
    return str;
  }

  function typeHandler(type: ActivityType): string {
    let str: string = "";
    if (dataTransaction.value.type === "sale") {
      if (type === "waiting") str = "Created";
      else if (type === "processing") str = "Approved";
      else if (type === "finished") str = "Finished";
      else if (type === "cancelled") str = "Cancelled";
      else if (type === "rejected") str = "Rejected";
      else if (type === "delivery") str = "Delivered Item";
      else if (type === "fulfill-payment") str = "Payment Received";
      else if (type === "create-payment") str = "Payment Created";
      else if (type === "warn-payment") str = "Sent Warning";
    } else {
      if (type === "waiting") str = "Created";
      else if (type === "processing") str = "Approved";
      else if (type === "finished") str = "Finished";
      else if (type === "cancelled") str = "Cancelled";
      else if (type === "rejected") str = "Rejected";
      else if (type === "delivery") str = "Received Item";
      else if (type === "fulfill-payment") str = "Invoice Fulfillment";
      else if (type === "create-payment") str = "Invoice Received";
    }
    return str;
  }

  function fileTypeHandler(type: TransactionDocument["type"]): string {
    let str = "";
    if (type === "acceptance_document") str = "Acceptance Doc";
    else if (type === "delivery_document") str = "Delivery Document";
    else if (type === "invoice") str = "Invoice";
    else if (type === "purchase_order") str = "Purchase Order";
    else if (type === "tax_invoice") str = "Tax Invoice";
    else if (type === "warning_document") str = "Warning Document";
    return str;
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );

  onMounted(async () => {
    const data: Transaction = await getTransactionDetails(props.data);
    if (data) {
      dataTransaction.value = data;
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
              opacity: 0.5;
            }
            span.rd-fieldset-detail-value {
              position: relative;
              width: 100%;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
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
        border: 1px solid var(--font-color);
        box-sizing: border-box;
        opacity: 0.05;
      }
    }
  }
</style>
