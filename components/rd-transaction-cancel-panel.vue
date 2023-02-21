<template>
  <rd-panel
    class="rd-panel"
    :label="
      data.status[0].type === 'waiting'
        ? 'Reject transaction'
        : 'Cancel transaction'
    "
    :state="panelState"
    :loading="dataLoading"
    @exit="emits('exit')"
  >
    <div class="rd-input-wrapper">
      <span class="rd-input-placeholder rd-caption-text"
        >Please provide a message as a reason why do you want to cancel this
        transaction.</span
      >
    </div>
    <div class="rd-input-wrapper">
      <rd-input-textarea class="rd-input" :input="messageInput" />
    </div>
    <div class="rd-input-button-wrapper">
      <rd-input-button
        class="rd-input-button"
        :label="'Submit'"
        :loading="submitLoading"
        @clicked="submit"
        :disabled="!message"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";

  import { InputOption } from "~~/interfaces/general";
  import { Transaction } from "~~/interfaces/transaction";

  const props = defineProps<{
    state: "idle" | "hide";
    data: Transaction;
  }>();
  const emits = defineEmits(["exit", "open-panel"]);
  const { cancelTransaction } = useTransaction();

  const dataLoading = ref<boolean>(false);
  const submitLoading = ref<boolean>(false);

  const panelState = ref<"idle" | "hide">("idle");

  const messageInput = ref<InputOption>({
    name: "message",
    placeholder: "Customer requested cancel",
    model: "",
    label: "Message",
    error: "",
  });

  const message: ComputedRef<string> = computed(
    (): string => messageInput.value.model
  );

  async function submit(): Promise<void> {
    submitLoading.value = true;

    const transactionId: string = await cancelTransaction(props.data._id, {
      message: message.value,
    });
    if (transactionId) panelState.value = "hide";
  }
</script>

<style lang="scss" scoped>
  .rd-panel {
    .rd-input-wrapper {
      position: relative;
      width: 100%;
      display: flex;
      .rd-input {
        width: 100%;
        padding: 0 1rem;
        box-sizing: border-box;
      }
      span.rd-input-placeholder {
        position: relative;
        padding: 0 1rem;
        margin-bottom: 1rem;
        box-sizing: border-box;
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
  }
</style>
