<template>
  <div class="rd-layout">


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
        <div class="rd-page-form-input-wrapper" @clicked="signups"
          style="margin-top: 0.5rem; align-items: center; justify-content: center;">
          <div class="rd-signup-button" @click="signups" style="font-size: small;cursor: pointer; user-select: none;">
            pengguna baru? Sign-up
          </div>
        </div>
      </form>
    </div>
    <div ref="rdContainerTwo" class="rd-container two">
      <div class="rd-page-title-container">
        <h1 class="rd-page-title rd-headline-2">
          Selamat Datang<span class="rd-page-title-primary">!</span>
        </h1>
        <p class="rd-page-subtitle rd-subtitle-text">
          Silahkan Sign up terlebih dahulu
        </p>
      </div>
      <form class="rd-page-form" style="margin-top: 0.5rem;" @keypress.enter.prevent="submit">
        <div class="rd-page-form-input-wrapper">
          <rd-input-text class="rd-page-form-input" :input="unameInput" />
        </div>
        <div class="rd-page-form-input-wrapper">
          <rd-input-text class="rd-page-form-input" :input="nameInput" />
        </div>
        <div class="rd-page-form-input-wrapper">
          <rd-input-text class="rd-page-form-input" :input="emailInput" />
        </div>
        <div class="rd-page-form-input-wrapper">
          <rd-input-text class="rd-page-form-input" :input="nimInput" />
        </div>
        <div class="rd-page-form-input-wrapper">
          <rd-input-text class="rd-page-form-input" :input="passwordInput" />
        </div>
        <div class="rd-page-form-input-wrapper">
          <rd-input-text class="rd-page-form-input" :input="confirmPasswordInput" />
        </div>
        <div class="rd-page-form-input-wrapper" style="margin-top: 0.5rem">
          <rd-input-button class="rd-page-form-input" :label="'Sign Up'"
            :disabled="!email || !password || !uname || !name || !nim || password !== confirmPasswordInput.model"
            :loading="loginLoading" @clicked="submitSignup" />

        </div>
        <div class="rd-page-form-input-wrapper" @clicked="signups"
          style="margin-top: 0.5rem; align-items: center; justify-content: center;">
          <div class="rd-signup-button" @click="signupExit" style="font-size: small;cursor: pointer; user-select: none;">
            Sudah punya akun? Login
          </div>
        </div>
      </form>
    </div>
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
const { login, signup } = useUser();
const { viewMode } = useMain();
const router = useRouter();
const emits = defineEmits(["shake"]);

const rdContainer = ref<HTMLDivElement>();
const rdContainerTwo = ref<HTMLDivElement>();

const nameInput = ref<InputOption>({
  name: "Name",
  placeholder: "######",
  model: "",
  label: "Nama",
  icon: "account-multiple",
  type: "email",
  error: "",
});
const nimInput = ref<InputOption>({
  name: "nim",
  placeholder: "######",
  model: "",
  label: "Nim",
  icon: "file",
  type: "email",
  error: "",
});
const unameInput = ref<InputOption>({
  name: "uname",
  placeholder: "somebody",
  model: "",
  label: "Username",
  icon: "account",
  type: "email",
  error: "",
});
const emailInput = ref<InputOption>({
  name: "email",
  placeholder: "somebody@example.com",
  model: "",
  label: "E-mail",
  icon: "at",
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
const confirmPasswordInput = ref<InputOption>({
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
const nim: ComputedRef<string> = computed(
  (): string => nimInput.value.model
);
const uname: ComputedRef<string> = computed(
  (): string => unameInput.value.model
);
const name: ComputedRef<string> = computed(
  (): string => nameInput.value.model
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

    if (viewMode === "desktop" || null) {
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
      tl.to([rdContainer], {
        y: "150%",
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    }
  },
  signupInit(
    viewMode: "desktop" | "mobile",
    rdContainer: HTMLElement,
    rdContainerTwo: HTMLElement,
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
      }).to(rdContainerTwo, {
        // y: "200%",
        top: "50%",
        opacity: 1,
        duration: 0.5,
        ease: "power2.in",
      }, "<");
    } else {
      tl.to([rdContainer], {
        y: "150%",
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      }).to(rdContainerTwo, {
        y: "-50%",
        top: "50%",
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
      }, ">"
      );
    }
  },
  signupExit(
    viewMode: "desktop" | "mobile",
    rdContainer: HTMLElement,
    rdContainerTwo: HTMLElement,
    cb?: () => void
  ): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });

    if (viewMode === "desktop") {
      tl.to(rdContainerTwo, {
        // y: "250%",
        top: "-50%",
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
      }
      ).to(rdContainer, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      }, "<");
    } else {
      tl.to(rdContainerTwo, {
        y: "250%",
        top: "-50%",
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
      }
      ).to(rdContainer, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      }, "<");
    }
  },
};


function signups() {
  animate.signupInit(viewMode.value, rdContainer.value, rdContainerTwo.value, () => {
  })
  nameInput.value.model = "";
  passwordInput.value.model = "";
  unameInput.value.model = "";
  emailInput.value.model = "";
  nimInput.value.model = "";

}
function signupExit() {
  animate.signupExit(viewMode.value, rdContainer.value, rdContainerTwo.value, () => {
  })
  nameInput.value.model = "";
  passwordInput.value.model = "";
  unameInput.value.model = "";
  emailInput.value.model = "";
  nimInput.value.model = "";

}

async function submitSignup() {
  if (email.value && password.value && !loginLoading.value) {
    loginLoading.value = true;
    const user = await signup(email.value, password.value, nim.value, uname.value, name.value);
    setTimeout(() => {
      if (user === "USER_MUST_HAVE_VALID_NAME") {
        emits("shake");
        nameInput.value.error = "This field is required"
      } else if (user === "USER_MUST_HAVE_VALID_EMAIL") {
        emits("shake");
        emailInput.value.error = "This field is required"
      } else {
        signupExit();
      }
      loginLoading.value = false;
    }, 1000);
  }
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
  () => confirmPasswordInput.value.model,
  (val: string) => {
    if (val !== passwordInput.value.model) {
      passwordInput.value.error = "Kata sandi tidak sama";
      confirmPasswordInput.value.error = "Kata sandi tidak sama";
    }
    else {
      passwordInput.value.error = " ";
      confirmPasswordInput.value.error = " ";
    }
  }
);
watch(
  () => unameInput.value.model,
  (val: string) => {
    if (!val) unameInput.value.error = "This field is required";
    else unameInput.value.error = " ";
  }
);
watch(
  () => nameInput.value.model,
  (val: string) => {
    if (!val) nameInput.value.error = "This field is required";
    else nameInput.value.error = " ";
  }
);
watch(
  () => emailInput.value.model,
  (val: string) => {
    if (!val) emailInput.value.error = "This field is required";
    else emailInput.value.error = " ";
  }
);
watch(
  () => nimInput.value.model,
  (val: string) => {
    if (!val) nimInput.value.error = "This field is required";
    else nimInput.value.error = " ";
  }
);
watch(
  () => passwordInput.value.model,
  (val: string) => {
    if (!val) passwordInput.value.error = "Kolom Wajib diisi";
    else if (val.length < 8) passwordInput.value.error = "Password minimal 8 karakter";
    else passwordInput.value.error = " ";
    console.log(val.length < 8)
  }
);

onMounted(() => {
  console.log(viewMode.value)
  setTimeout(() => {
    animate.init(viewMode.value, rdContainer.value);
  }, 500);
});
</script>

<style lang="scss" scoped>
.rd-layout {
  overflow-y: hidden;
  // margin-top: 4rem;
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

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

    &.two {
      top: -100%;
    }

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
}
</style>
