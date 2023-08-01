<template>
  <rd-panel class="rd-panel" :label="'Hapus User'" :state="panelState" :loading="dataLoading" @exit="emits('exit')">
    <div class="rd-input-wrapper">
      <rd-input-text class="rd-input" :input="nameInput" :disabled="true" />
    </div>
    <div class="rd-input-wrapper">
      <rd-input-text class="rd-input" :input="emailInput" :disabled="true" />
    </div>
    <div class="rd-input-wrapper">
      <rd-input-text class="rd-input" :input="nimInput" :disabled="true" />
    </div>
    <div class="rd-input-wrapper">
      <rd-input-text class="rd-input" :input="emailAdminInput" />
    </div>
    <div class="rd-input-wrapper">
      <rd-input-text class="rd-input" :input="passwordInput" />
    </div>
    <div class="rd-input-button-wrapper">
      <rd-input-button class="rd-input-button" :label="props.data ? 'Update' : 'Submit'" :loading="submitLoading"
        :disabled="!email || !password" @clicked="submit" />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
import { ComputedRef } from "vue";
import {
  InputFileOption,
  InputGeneric,
  InputOption,
} from "~~/interfaces/general";
import { User } from "~~/interfaces/user";

const config = useRuntimeConfig();
const { refresh, deleteUser } = useUser();
const emits = defineEmits(["exit", "open-panel", "delete-success"]);
const props = defineProps<{
  state: "idle" | "hide";
  data?;
}>();

const panelState = ref<"idle" | "hide">("idle");
const dataLoading = ref<boolean>(true);

const submitLoading = ref<boolean>(false);
const selectedRoles = ref<string[]>([]);
const selectedBranches = ref<string[]>([]);

const statusInput = ref<InputGeneric<"active" | "inactive">>({
  name: "status",
  placeholder: "active",
  label: "Status",
  error: "",
  model: "Active",
  value: "active",
  options: [
    {
      name: "Active",
      value: "active",
    },
    {
      name: "Inactive",
      value: "inactive",
    },
  ],
});
const unameInput = ref<InputOption>({
  name: "name",
  disabled: true,
  placeholder: "John doe",
  model: "",
  label: "Username",
  error: "",
});
const nameInput = ref<InputOption>({
  name: "name",
  placeholder: "John doe",
  model: "",
  label: "Name",
  error: "",
});
const emailInput = ref<InputOption>({
  name: "email",
  placeholder: "john@doe.com",
  model: "",
  label: "Email",
  error: "",
});
const emailAdminInput = ref<InputOption>({
  name: "email",
  placeholder: "john@doe.com",
  model: "",
  label: "Email",
  error: "",
});
const nimInput = ref<InputOption>({
  name: "Nim",
  placeholder: "000",
  model: "",
  label: "NIM",
  error: "",
});
const passwordInput = ref<InputOption>({
  name: "password",
  placeholder: "Shusssh",
  model: "",
  type: "password",
  label: "Password baru",
  error: "",
});


// const file: ComputedRef<File> = computed(() => fileInput.value.file);
const status: ComputedRef<"active" | "inactive"> = computed(
  () => statusInput.value.value
);
const name: ComputedRef<string> = computed(() => nameInput.value.model);
const email: ComputedRef<string> = computed(() => emailInput.value.model);
const password: ComputedRef<string> = computed(() => passwordInput.value.model);

async function submit(): Promise<void> {
  submitLoading.value = true;
  console.log(props.data._id)
  const userId: string = await deleteUser({
    _id: props.data._id,
    email: email.value,
    password: password.value,
  });
  console.log("userId");
  console.log(userId);
  if (userId === "SUCCESS") {
    location.reload();
    panelState.value = "hide";
  } else if (userId !== "SUCCESS") {
    submitLoading.value = false;
  }
}

watch(
  () => props.state,
  (val) => {
    if (val === "hide") panelState.value = "hide";
  }
);

onMounted(async () => {
  if (props.data) {
    unameInput.value.model = props.data.username;
    nameInput.value.model = props.data.name;
    nimInput.value.model = props.data.nim;
    emailInput.value.model = props.data.email;
  } else {
    console.log("props.data._id")
  }

  setTimeout(() => {
    dataLoading.value = false;
  }, 500);
});
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

    .rd-file-input {
      position: relative;
    }
  }

  .rd-input-roles-container,
  .rd-input-branches-container {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;

    span.rd-input-roles-placeholder,
    span.rd-input-branches-placeholder {
      position: relative;
      width: 100%;
      height: 1rem;
      padding: 0 1rem;
      box-sizing: border-box;
      color: var(--font-color);
      opacity: 0.5;
      display: flex;
      align-items: center;
    }

    .rd-input-roles-wrapper,
    .rd-input-branches-wrapper {
      position: relative;
      width: 100%;
      padding: 0 1rem;
      margin-bottom: 1rem;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;

      .rd-input-role,
      .rd-input-branch {
        cursor: pointer;
        position: relative;
        height: 1.5rem;
        padding: 0 0.5rem;
        border-radius: 0.5rem;
        background: rgba(0, 0, 0, 0);
        line-height: 1;
        text-transform: capitalize;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.25s background-color;

        .rd-input-role-color {
          position: relative;
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          margin-right: 0.25rem;
        }

        span.rd-input-role-text,
        span.rd-input-branch-text {
          position: relative;
          transition: 0.25s color;
        }

        &::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid var(--font-color);
          border-radius: 0.5rem;
          box-sizing: border-box;
          opacity: 0.1;
          transition: 0.25s border-color;
        }

        &.rd-input-role-active,
        &.rd-input-branch-active {
          background: var(--primary-color);

          span.rd-input-role-text,
          span.rd-input-branch-text {
            color: #fff;
          }

          &::before {
            border-color: var(--primary-color);
          }
        }
      }
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
