<template>
  <rd-panel
    class="rd-panel"
    :label="'Create Invoice'"
    :state="panelState"
    :loading="dataLoading"
    @exit="emits('exit')"
  >
    <div class="rd-fieldset">
      <div class="rd-fieldset-header">
        <span class="rd-fieldset-header-name rd-headline-4"
          >Select delivery document</span
        >
        <span class="rd-fieldset-header-placeholder rd-caption-text">
          As invoice's charge amount
        </span>
      </div>
      <div class="rd-fieldset-divider"></div>
      <div class="rd-fieldset-body">
        <div
          v-if="!dataDeliveries?.length"
          class="rd-fieldset-delivery-unavailable"
        >
          <span
            class="rd-fieldset-delivery-unavailable-placeholder rd-caption-text"
            >No deliveries available</span
          >
        </div>
        <div
          v-for="delivery in dataDeliveries"
          :key="delivery.document._id"
          class="rd-fieldset-delivery"
          @click="selectedId = delivery.document._id"
          :class="
            selectedId === delivery.document._id
              ? 'rd-fieldset-delivery-active'
              : ''
          "
        >
          <div class="rd-fieldset-delivery-header">
            <span class="rd-fieldset-delivery-placeholder rd-caption-text">{{
              dateHandler(new Date(delivery.date))
            }}</span>
            <span class="rd-fieldset-delivery-value rd-headline-6">{{
              delivery.document.number
            }}</span>
          </div>
          <div class="rd-fieldset-delivery-divider"></div>
          <div class="rd-fieldset-delivery-body">
            <div class="rd-fieldset-delivery-detail">
              <span class="rd-fieldset-delivery-placeholder rd-caption-text"
                >Amount</span
              >
              <span class="rd-fieldset-delivery-value rd-headline-6">{{
                `Rp ${delivery.item
                  .reduce(
                    (a, b) =>
                      a + b.quantity * b.price * (1 - (b.discount || 0)),
                    0
                  )
                  .toLocaleString("de-DE")}`
              }}</span>
            </div>
            <div class="rd-fieldset-delivery-detail">
              <span class="rd-fieldset-delivery-placeholder rd-caption-text"
                >VAT (11%)</span
              >
              <span class="rd-fieldset-delivery-value rd-headline-6">{{
                `Rp ${(
                  delivery.item.reduce(
                    (a, b) =>
                      a + b.quantity * b.price * (1 - (b.discount || 0)),
                    0
                  ) * 0.11
                ).toLocaleString("de-DE")}`
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rd-fieldset" style="margin-bottom: 4rem">
      <div class="rd-fieldset-header">
        <span class="rd-fieldset-header-name rd-headline-4"
          >Additional Information</span
        >
        <span class="rd-fieldset-header-placeholder rd-caption-text">
          Further information for the invoice
        </span>
      </div>
      <div class="rd-fieldset-divider"></div>
      <div class="rd-fieldset-body">
        <div class="rd-fieldset-input-wrapper">
          <rd-input-date class="rd-input" :input="acknowledgeDateInput" />
          <rd-input-date class="rd-input" :input="dueDateInput" />
        </div>
        <div v-if="data.type === 'purchase'" class="rd-fieldset-input-wrapper">
          <rd-input-text
            class="rd-input"
            :input="invoiceNumberInput"
            style="width: 100%"
          />
        </div>
        <div class="rd-fieldset-file-input-wrapper" style="margin-bottom: 1rem">
          <span class="rd-fieldset-file-input-placeholder rd-headline-6"
            >Invoice file</span
          >
          <rd-input-file
            class="rd-fieldset-file-input"
            :input="invoiceFileInput"
          />
        </div>
        <div class="rd-fieldset-input-wrapper">
          <rd-input-text
            class="rd-input"
            :input="numberInput"
            style="width: 100%"
          />
        </div>
        <div class="rd-fieldset-file-input-wrapper">
          <span class="rd-fieldset-file-input-placeholder rd-headline-6"
            >Tax invoice file</span
          >
          <rd-input-file class="rd-fieldset-file-input" :input="fileInput" />
        </div>
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        :loading="submitLoading"
        :label="'Submit'"
        :disabled="
          !selectedId ||
          (data.type === 'purchase' && (!invoiceNumber || !invoiceFile))
        "
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import { InputFileOption, InputOption } from "~~/interfaces/general";
  import { Transaction, TransactionDelivery } from "~~/interfaces/transaction";

  const { addTransactionPayment, getTransactionDeliveriesAvailable } =
    useTransaction();
  const props = defineProps<{
    state: "idle" | "hide";
    data: Transaction;
  }>();
  const emits = defineEmits(["exit"]);

  const dataLoading = ref<boolean>(true);
  const dataDeliveries = ref<TransactionDelivery[]>([]);

  const selectedId = ref<string>(null);
  const submitLoading = ref<boolean>(false);
  const panelState = ref<"idle" | "hide">("idle");

  const acknowledgeDateInput = ref<InputOption>({
    name: "acknowledge-date",
    placeholder: "29-09-2022",
    model: "",
    value: "",
    label: "Acknowledge date",
    error: "",
  });
  const dueDateInput = ref<InputOption>({
    name: "due-date",
    placeholder: "29-09-2022",
    model: "",
    value: "",
    label: "Due date",
    error: "",
  });
  const numberInput = ref<InputOption>({
    name: "number",
    placeholder: "010.1000-12302",
    model: "",
    value: "",
    label: "Tax invoice number",
    error: "",
  });
  const invoiceNumberInput = ref<InputOption>({
    name: "invoice-number",
    placeholder: "INV/RGT/070/0293",
    model: "",
    value: "",
    label: "Invoice number",
    error: "",
  });
  const fileInput = ref<InputFileOption>({
    disabled: false,
    file: null,
  });
  const invoiceFileInput = ref<InputFileOption>({
    disabled: false,
    file: null,
  });

  const acknowledgeDate: ComputedRef<Date> = computed(
    () => new Date(acknowledgeDateInput.value.value)
  );
  const dueDate: ComputedRef<Date> = computed(
    () => new Date(dueDateInput.value.value)
  );
  const number: ComputedRef<string> = computed(() => numberInput.value.model);
  const invoiceNumber: ComputedRef<string> = computed(
    () => invoiceNumberInput.value.model
  );
  const file: ComputedRef<File> = computed(() => fileInput.value.file);
  const invoiceFile: ComputedRef<File> = computed(
    () => invoiceFileInput.value.file
  );

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

  async function submit(): Promise<void> {
    submitLoading.value = true;

    const transactionId: string = await addTransactionPayment(props.data._id, {
      type: props.data.type,
      document_id: selectedId.value,
      acknowledge_date: acknowledgeDate.value.getTime(),
      due_date: dueDate.value.getTime(),
      number: number.value,
      file: file.value,
      invoice_number: invoiceNumber.value,
      invoice_file: invoiceFile.value,
    });
    if (transactionId) panelState.value = "hide";
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );

  watch(
    () => acknowledgeDate.value,
    (val) => {
      if (new Date().getTime() > new Date(val).getTime())
        acknowledgeDateInput.value.error = "Date must be greater than now";
      else if (new Date(val).getTime() > new Date(dueDate.value).getTime())
        acknowledgeDateInput.value.error = "Invalid date";
      else acknowledgeDateInput.value.error = "";
    }
  );
  watch(
    () => dueDate.value,
    (val) => {
      if (new Date().getTime() > new Date(val).getTime())
        acknowledgeDateInput.value.error = "Date must be greater than now";
      else if (
        new Date(acknowledgeDate.value).getTime() > new Date(val).getTime()
      )
        acknowledgeDateInput.value.error = "Invalid date";
      else acknowledgeDateInput.value.error = "";
    }
  );

  onMounted(async () => {
    dataDeliveries.value = await getTransactionDeliveriesAvailable(
      props.data._id
    );
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
        .rd-fieldset-delivery-unavailable {
          position: relative;
          width: 100%;
          height: 3rem;
          padding: 0.5rem;
          border-radius: 0.5rem;
          box-sizing: border-box;
          display: flex;
          flex-shrink: 0;
          justify-content: center;
          align-items: center;
          span.rd-fieldset-delivery-unavailable-placeholder {
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
            opacity: 0.05;
          }
        }
        .rd-fieldset-delivery {
          cursor: pointer;
          position: relative;
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 0.75rem;
          box-sizing: border-box;
          overflow: hidden;
          border-radius: 0.75rem;
          background: rgba(0, 0, 0, 0);
          display: flex;
          flex-direction: column;
          transition: 0.125s background-color;
          span.rd-fieldset-delivery-placeholder,
          span.rd-fieldset-delivery-value {
            transition: 0.125s color;
          }
          .rd-fieldset-delivery-header {
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: column;
            span.rd-fieldset-delivery-placeholder {
              position: relative;
              margin-bottom: 0.125rem;
              opacity: 0.5;
            }
          }
          .rd-fieldset-delivery-divider {
            position: relative;
            left: -0.75rem;
            width: calc(100% + 1.5rem);
            height: 1px;
            background: var(--font-color);
            opacity: 0.05;
            margin: 0.75rem 0;
          }
          .rd-fieldset-delivery-body {
            position: relative;
            width: 100%;
            display: flex;
            .rd-fieldset-delivery-detail {
              position: relative;
              width: 50%;
              display: flex;
              flex-direction: column;
              span.rd-fieldset-delivery-placeholder {
                position: relative;
                margin-bottom: 0.125rem;
                opacity: 0.5;
              }
            }
          }
          &.rd-fieldset-delivery-active {
            background: var(--primary-color);
            span.rd-fieldset-delivery-placeholder,
            span.rd-fieldset-delivery-value {
              color: #fff;
            }
            &::before {
              border-color: var(--primary-color);
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
            transition: 0.125s border-color;
          }
          &:last-child {
            margin: 0;
          }
        }
        .rd-fieldset-input-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: space-between;
          .rd-input {
            width: calc(50% - 0.375rem);
          }
        }
        .rd-fieldset-file-input-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          span.rd-fieldset-file-input-placeholder {
            position: relative;
            height: 1rem;
            opacity: 0.5;
          }
          .rd-fieldset-file-input {
            position: relative;
            width: 100%;
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
