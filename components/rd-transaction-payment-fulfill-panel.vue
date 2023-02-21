<template>
  <rd-panel
    class="rd-panel"
    :label="'Invoices'"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div class="rd-invoice">
      <div class="rd-invoice-header">
        <span class="rd-invoice-header-name rd-headline-4">{{
          data.document.number
        }}</span>
        <span class="rd-invoice-header-placeholder rd-caption-text">
          {{ dateHandler(new Date(data.date)) }}
        </span>
      </div>
      <div class="rd-invoice-divider"></div>
      <div class="rd-invoice-body">
        <div class="rd-invoice-unpaid">
          <span class="rd-invoice-detail-placeholder rd-caption-text"
            >Amount unpaid</span
          >
          <span class="rd-invoice-detail-value rd-headline-2">{{
            `Rp ${(data.amount * 1.11 - data.paid).toLocaleString("de-DE")}`
          }}</span>
        </div>
      </div>
      <div class="rd-invoice-divider"></div>
      <div class="rd-invoice-footer">
        <div class="rd-invoice-detail">
          <span class="rd-invoice-detail-placeholder rd-caption-text"
            >Amount</span
          >
          <span class="rd-invoice-detail-value rd-headline-6">{{
            `Rp ${data.amount.toLocaleString("de-DE")}`
          }}</span>
        </div>
        <div class="rd-invoice-detail">
          <span class="rd-invoice-detail-placeholder rd-caption-text"
            >VAT (11%)</span
          >
          <span class="rd-invoice-detail-value rd-headline-6">{{
            `Rp ${(data.amount * 0.11).toLocaleString("de-DE")}`
          }}</span>
        </div>
      </div>
    </div>
    <div class="rd-input-wrapper">
      <rd-input-text class="rd-input" :input="amountInput" />
    </div>
    <div class="rd-input-wrapper">
      <span class="rd-input-placeholder rd-headline-6">Payment evidence</span>
      <rd-input-file class="rd-file-input" :input="fileInput" />
    </div>
    <div class="rd-input-button-wrapper">
      <rd-input-button
        class="rd-input-button"
        :disabled="!amount || !!amountInput.error"
        :label="'Submit'"
        :loading="submitLoading"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";

  import { InputFileOption, InputOption } from "~~/interfaces/general";
  import { TransactionPayment } from "~~/interfaces/transaction";

  const { addTransactionPaymentFulfillment } = useTransaction();
  const props = defineProps<{
    state: "idle" | "hide";
    data: TransactionPayment;
  }>();
  const emits = defineEmits(["exit", "open-panel"]);

  const submitLoading = ref<boolean>(false);
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

  const fileInput = ref<InputFileOption>({
    disabled: false,
    file: null,
  });
  const amountInput = ref<InputOption>({
    name: "amount",
    placeholder: "1.000.000",
    model: "",
    label: "Amount paid",
    error: "",
    type: "number",
  });

  const documentId: ComputedRef<string> = computed(
    () => props.data.document._id
  );
  const amount: ComputedRef<number> = computed(() =>
    parseInt(amountInput.value.model.split(".").join(""))
  );
  const file: ComputedRef<File> = computed(() => fileInput.value.file);

  async function submit(): Promise<void> {
    submitLoading.value = true;

    const transactionId: string = await addTransactionPaymentFulfillment(
      props.data.transaction_id,
      {
        amount: amount.value,
        document_id: documentId.value,
        file: file.value,
      }
    );
    if (transactionId) panelState.value = "hide";
  }

  watch(
    () => amount.value,
    (val) => {
      if (val > props.data.amount * 1.11 - props.data.paid)
        amountInput.value.error = "Value cannot exceed unpaid amount";
      else if (val <= 0)
        amountInput.value.error = "Value cannot be less than equal zero";
      else amountInput.value.error = "";
    }
  );
</script>

<style lang="scss" scoped>
  .rd-panel {
    .rd-invoice {
      position: relative;
      width: calc(100% - 2rem);
      padding: 0.75rem;
      border-radius: 0.75rem;
      margin: 0 1rem 1rem 1rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .rd-invoice-divider {
        position: relative;
        left: -0.75rem;
        width: calc(100% + 1.5rem);
        height: 1px;
        background: var(--font-color);
        opacity: 0.05;
        margin: 0.75rem 0;
      }
      .rd-invoice-header {
        position: relative;
        width: 100%;
        height: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .rd-invoice-body {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        .rd-invoice-file {
          position: relative;
          width: 100%;
          height: 3.5rem;
          margin-bottom: 0.25rem;
          padding: 0 0.75rem;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          .rd-invoice-file-icon-container {
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
          .rd-invoice-file-details {
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
            span.rd-invoice-file-value {
              position: relative;
              width: calc(100% - 0.5rem);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            span.rd-invoice-file-placeholder {
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
        .rd-invoice-unpaid {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          span.rd-invoice-detail-placeholder {
            position: relative;
            margin-bottom: 0.125rem;
            opacity: 0.5;
          }
        }
      }
      .rd-invoice-footer {
        position: relative;
        width: 100%;
        display: flex;
        gap: 0.75rem;
        .rd-invoice-input-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          flex-shrink: 1;
          .rd-invoice-input-button {
            width: 100%;
          }
        }
        .rd-invoice-detail {
          position: relative;
          width: 50%;
          display: flex;
          flex-direction: column;
          span.rd-invoice-detail-placeholder {
            position: relative;
            margin-bottom: 0.125rem;
            opacity: 0.5;
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
    .rd-input-wrapper {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      span.rd-input-placeholder {
        position: relative;
        height: 1rem;
        margin: 0 1rem;
        opacity: 0.5;
      }
      .rd-input {
        width: 100%;
        padding: 0 1rem;
        box-sizing: border-box;
      }
      .rd-file-input {
        position: relative;
        width: calc(100% - 2rem);
        margin: 0 1rem;
      }
    }
    .rd-input-button-wrapper {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4rem;
      background: var(--background-depth-one-color);
      padding: 1rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      .rd-input-button {
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
    @media only screen and (max-width: 1024px) {
      .rd-input-wrapper {
        .rd-input {
          padding: 0 1.5rem;
        }
      }
      .rd-input-button-wrapper {
        height: 5rem;
        padding: 1.5rem;
      }
    }
  }
</style>
