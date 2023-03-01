<template>
  <rd-panel class="rd-panel" :label="'Ubah Password'" :state="panelState" :loading="dataLoading" @exit="emits('exit')">
    <div class="rd-input-wrapper">
      <rd-input-text class="rd-input" :input="nameInput" />
    </div>
    <div class="rd-input-wrapper">
      <rd-input-text class="rd-input" :input="emailInput" />
    </div>
    <!-- <div class="rd-input-wrapper">
      <rd-input-text class="rd-input" :input="phoneInput" />
    </div> -->
    <div class="rd-input-wrapper">
      <rd-input-text class="rd-input" :input="oldPasswordInput" />
    </div>
    <div class="rd-input-wrapper">
      <rd-input-text class="rd-input" :input="passwordInput" />
    </div>
    <div class="rd-input-wrapper" style="margin-bottom: 3rem">
      <rd-input-text class="rd-input" :input="passwordCheckInput" />
    </div>
    <div class="rd-input-button-wrapper">
      <rd-input-button class="rd-input-button" :label="props.data ? 'Update' : 'Submit'" :loading="submitLoading"
        :disabled="
          !name ||
          !email ||
          !password ||
          check_password !== password ||
          old_password === password
        " @clicked="submit" />
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
const { refresh, updateUser } = useUser();
const emits = defineEmits(["exit", "open-panel"]);
const props = defineProps<{
  state: "idle" | "hide";
  data?;
}>();

const panelState = ref<"idle" | "hide">("idle");
const dataLoading = ref<boolean>(true);

const submitLoading = ref<boolean>(false);
const selectedRoles = ref<string[]>([]);
const selectedBranches = ref<string[]>([]);

const fileInput = ref<InputFileOption>({
  disabled: false,
  file: null,
  type: "image",
  label: "Picture",
});
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
const phoneInput = ref<InputOption>({
  name: "phone",
  placeholder: "+62812345678",
  model: "",
  label: "Phone",
  error: "",
});
const birthDateInput = ref<InputOption>({
  name: "birth-date",
  placeholder: "29-09-2022",
  model: "",
  value: "",
  label: "Birth date",
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
const oldPasswordInput = ref<InputOption>({
  name: "password",
  placeholder: "Shusssh",
  model: "",
  type: "password",
  label: "Password lama",
  error: "",
});
const passwordCheckInput = ref<InputOption>({
  name: "password",
  placeholder: "Shusssh",
  model: "",
  type: "password",
  label: "Ulangi Password Baru",
  error: "",
});

// const file: ComputedRef<File> = computed(() => fileInput.value.file);
const status: ComputedRef<"active" | "inactive"> = computed(
  () => statusInput.value.value
);
const name: ComputedRef<string> = computed(() => nameInput.value.model);
const email: ComputedRef<string> = computed(() => emailInput.value.model);
const phone: ComputedRef<string> = computed(() => phoneInput.value.model);
const birthDate: ComputedRef<number> = computed(() =>
  new Date(birthDateInput.value.value).setHours(0, 0, 0, 0)
);
const password: ComputedRef<string> = computed(() => passwordInput.value.model);
const old_password: ComputedRef<string> = computed(
  () => oldPasswordInput.value.model
);
const check_password: ComputedRef<string> = computed(
  () => passwordCheckInput.value.model
);

async function submit(): Promise<void> {
  submitLoading.value = true;
  console.log(props.data._id)
  const userId: string = await updateUser({
    _id: props.data._id,
    name: name.value,
    email: email.value,
    phone: phone.value,
    password: password.value,
    old_password: old_password.value,
    // role_id: selectedRoles.value,
    // birth_date: birthDate.value,
    // branch_id: selectedBranches.value,
  });
  console.log("userId");
  console.log(userId);
  if (userId === "SUCCESS") {
    await refresh();
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
    console.log(props.data);
    fileInput.value.image_url = props.data.image_url
      ? `${config.public.apiBase}/files${props.data.image_url}`
      : "";
    nameInput.value.model = props.data.name;
    emailInput.value.model = props.data.email;
    phoneInput.value.model = props.data.phone;
    birthDateInput.value.value = new Date(props.data.birth_date).toISOString();
    console.log(props.data._id)
    console.log(props.data._id)
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
