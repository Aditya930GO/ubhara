<template>
  <div ref="rdContainer" class="rd-container">
    <div class="rd-page-logo-container">
      <img class="rd-image" :src="'/logo.png'" />
    </div>
    <div class="rd-page-title-container">
      <h1 class="rd-page-title rd-headline-2">
        Selamat Datang di SIM Bahasa Ubhara<span class="rd-page-title-primary">!</span>
      </h1>
      <p class="rd-page-subtitle rd-subtitle-text">
        Silahkan login terlebih dahulu
      </p>
    </div>
    <form class="rd-page-form" @keypress.enter.prevent="submit">
      <div class="rd-page-form-input-wrapper">
        <rd-input-text class="rd-page-form-input" :input="emailInput" />
      </div>
      <div class="rd-page-form-input-wrapper">
        <rd-input-text class="rd-page-form-input" :input="passwordInput" />
      </div>
      <div class="rd-page-form-input-wrapper" style="margin-top: 0.5rem">
        <rd-input-button class="rd-page-form-input" :label="'Login'" :disabled="!email || !password"
          :loading="loginLoading" @clicked="submit" />

      </div>
      <div class="rd-page-form-input-wrapper" @clicked="signup"
        style="margin-top: 0.5rem; align-items: center; justify-content: center;">
        <div class="rd-signup-button" @click="signup" style="font-size: small;cursor: pointer; user-select: none;">
          pengguna baru? Sign-up
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import gsap from "gsap";
import { ComputedRef } from "vue";

import { InputOption } from "~~/interfaces/general.js";
import { User } from "~~/interfaces/user.js";
const route = useRoute();
definePageMeta({
  middleware: ["no-auth"],
});
const { login } = useUser();
const { viewMode } = useMain();
const router = useRouter();
const emits = defineEmits(["shake"]);

const rdContainer = ref<HTMLDivElement>();

const emailInput = ref<InputOption>({
  name: "email",
  placeholder: "somebody@example.com",
  model: "",
  label: "Username",
  icon: "account",
  type: "email",
  error: "",
});
const passwordInput = ref<InputOption>({
  name: "password",
  placeholder: "hush...",
  model: "",
  label: "Password",
  icon: "key",
  type: "password",
  error: "",
});

const email: ComputedRef<string> = computed(
  (): string => emailInput.value.model
);
const password: ComputedRef<string> = computed(
  (): string => passwordInput.value.model
);

const loginLoading = ref<boolean>(false);

const animate = {
  init(
    viewMode: "desktop" | "mobile",
    rdContainer: HTMLElement,
    cb?: () => void
  ): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });

    if (viewMode === "desktop") {
      tl.to(rdContainer, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      tl.to(rdContainer, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  },
  exit(
    viewMode: "desktop" | "mobile",
    rdContainer: HTMLElement,
    cb?: () => void
  ): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });

    if (viewMode === "desktop") {
      tl.to(rdContainer, {
        scale: 1.125,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    } else {
      tl.to(rdContainer, {
        y: "150%",
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    }
  },
};


function signup() {
  navigateTo("/signup");
  console.log("halo")

}
async function submit() {
  if (email.value && password.value && !loginLoading.value) {
    loginLoading.value = true;
    const user: User = await login(email.value, password.value);
    setTimeout(() => {
      if (user) {
        exit("/");
      } else {
        emits("shake");
      }
      loginLoading.value = false;
    }, 1000);
  }
}

function exit(path: string = "/"): void {
  animate.exit(viewMode.value, rdContainer.value, () => {
    router.push(path);
  });
}

watch(
  () => emailInput.value.model,
  (val: string) => {
    if (!val) emailInput.value.error = "This field is required";
    else emailInput.value.error = "";
  }
);
watch(
  () => passwordInput.value.model,
  (val: string) => {
    if (!val) passwordInput.value.error = "This field is required";
    else passwordInput.value.error = "";
  }
);

onMounted(() => {
  setTimeout(() => {
    animate.init(viewMode.value, rdContainer.value);
  }, 500);
});
</script>

<style lang="scss" scoped>
.rd-container {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 16rem;
  background: var(--background-depth-four-color);
  border-radius: 1rem;
  padding: 1rem;
  box-sizing: border-box;
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);

  .rd-page-logo-container {
    // left: 35%;
    position: relative;
    align-items: center;
    justify-content: center;
    width: 8rem;
    margin: 1rem;
    display: flex;

    img.rd-image {
      position: relative;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-radius: 0.5rem;
      object-fit: cover;
    }
  }

  .rd-page-title-container {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;

    h1.rd-page-title {
      position: relative;
      color: var(--secondary-color);

      span.rd-page-title-primary {
        color: var(--primary-color);
      }
    }

    p.rd-page-subtitle {
      position: relative;
      // margin-top: 0.5rem;
      opacity: 0.5;
    }
  }

  form.rd-page-form {
    position: relative;
    width: 100%;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;

    .rd-page-form-input-wrapper {
      position: relative;
      width: 100%;
      display: flex;

      .rd-page-form-input {
        width: 100%;
      }
    }
  }

  @media only screen and (max-width: 1024px) {
    top: auto;
    bottom: 0;
    left: 0;
    width: 100vw;
    transform: translateY(150%);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    background: var(--background-depth-one-color);
  }
}
</style>