<template>
  <rd-panel class="rd-panel" :label="'hapus kelas'" :state="panelState" :loading="dataLoading" @exit="exit">
    <div class="rd-form-fieldset">
      <div class="rd-form-fieldset-input-wrapper">
        <rd-input-text class="rd-fieldset-input" :input="nameInput" :disabled="true" />
      </div>
      <div class="rd-form-fieldset-input-wrapper">
        <rd-input-text class="rd-fieldset-input" :input="scheduleInput" :disabled="true" />
      </div>
      <div class="rd-form-fieldset-input-wrapper">
        <rd-input-text class="rd-fieldset-input" :input="emailInput" />
      </div>
      <div class="rd-form-fieldset-input-wrapper">
        <rd-input-text class="rd-fieldset-input" :input="passInput" />
      </div>
    </div>
    <!-- <div class="rd-input-button-container"> -->
    <rd-input-button class="rd-form-button" style="margin: 0 2rem" :loading="submitLoading" :disabled="!passInput.model && !emailInput.model
      " :label="'Submit'" @mousedown="submit()" />
    <!-- </div> -->
  </rd-panel>
</template>

<script lang="ts" setup>
import gsap from "gsap";
import { ComputedRef } from "vue";

import {
  InputGeneric,
  InputMonth,
  InputOption,
  InputImageOption,
} from "~~/interfaces/general.js";
import { processSlotOutlet } from "@vue/compiler-core";

// const { getInmates, addInmate, updateInmate, getInmateDetails } = useInmate();
const { getClasses, deleteClass } = useClass();

const props = defineProps<{
  state: "idle" | "hide";
  data?;
}>();
const emits = defineEmits(["exit", "update"]);
const config = useRuntimeConfig();

const dataLoading = ref<boolean>(true);
const submitLoading = ref<boolean>(false);
var dateInmate = null;
var birthdateInmate = null;
var dataImageUrl = null;
const panelState = ref<"idle" | "hide">("idle");



const nameInput = ref<InputOption>({
  name: "name",
  label: "Nama Kelas",
  placeholder: "...",
  model: "",
  value: "",
  error: "",
});
const scheduleInput = ref<InputOption>({
  name: "schedule",
  label: "Jadwal",
  placeholder: "Senin",
  model: "",
  value: "",
  error: "",
});
const tagsInput = ref<InputOption>({
  name: "tags",
  label: "tag(dipisah dengan koma)",
  placeholder: "Umum, hukum, ...",
  model: "",
  value: "",
  error: "",
});
const notesInput = ref<InputOption>({
  name: "notes",
  label: "Catatan(opsional)",
  placeholder: "...",
  model: "",
  value: "",
  error: "",
});
const emailInput = ref<InputOption>({
  name: "email",
  label: "Email",
  placeholder: "abc@def.com",
  model: "",
  value: "",
  error: "",
});
const passInput = ref<InputOption>({
  name: "Password",
  label: "Password",
  placeholder: "...",
  type: "password",
  model: "",
  value: "",
  error: "",
});

const email: ComputedRef<string> = computed((): string => emailInput.value.model);
const password: ComputedRef<string> = computed((): string => passInput.value.model);


const animate = {
  initItem(
    rdFieldsetBody: HTMLElement,
    rdItemEmpty: HTMLElement,
    rdItemDecoy: HTMLElement,
    cb?: () => void
  ): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
        gsap.to([rdItemDecoy, rdItemEmpty], {
          opacity: 0,
          scale: 0.875,
          duration: 0,
        });
      },
    });

    tl.to(rdItemEmpty, {
      scale: 1.125,
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
    })
      .to(rdFieldsetBody, {
        height: "+=6.5rem",
        duration: 0.25,
        ease: "power2.out",
      })
      .to(rdItemDecoy, {
        scale: 1,
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
      });
  },
  addItem(
    rdFieldsetBody: HTMLElement,
    rdItemDecoy: HTMLElement,
    cb?: () => void
  ): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
        gsap.to(rdItemDecoy, {
          opacity: 0,
          scale: 0.875,
          duration: 0,
        });
      },
    });

    tl.to(rdFieldsetBody, {
      height: "+=10.25rem",
      duration: 0.25,
      ease: "power2.out",
    }).to(rdItemDecoy, {
      scale: 1,
      opacity: 1,
      duration: 0.25,
      ease: "power2.out",
    });
  },
  exitItem(
    rdFieldsetBody: HTMLElement,
    rdItemEmpty: HTMLElement,
    rdItem: HTMLElement,
    cb?: () => void
  ): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });

    tl.to(rdItem, {
      scale: 1.125,
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
    })
      .to(rdFieldsetBody, {
        height: "-=6.5rem",
        duration: 0.25,
        ease: "power2.out",
      })
      .to(
        rdItemEmpty,
        {
          scale: 1,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
        },
        "<0"
      );
  },
  removeItem(
    rdFieldsetBody: HTMLElement,
    rdItem: HTMLElement,
    id: string,
    cb?: () => void
  ): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
        gsap.to(rdItemSiblings, {
          y: 0,
          duration: 0,
        });
      },
    });

    const rdItemSiblings: HTMLElement[] = gsap.utils.toArray(
      rdItem.parentNode.querySelectorAll(
        `.rd-form-fieldset-item[data-id='${id}'] ~ *`
      )
    );

    tl.to(rdItem, {
      scale: 1.125,
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
    }).to(rdFieldsetBody, {
      height: "-=10.25rem",
      duration: 0.25,
      ease: "power2.out",
    });
    if (rdItemSiblings.length) {
      tl.to(
        rdItemSiblings,
        {
          y: "-=10.25rem",
          duration: 0.25,
          ease: "power2.out",
        },
        "<0"
      );
    }
  },
  removeAllItem(
    rdFieldsetBody: HTMLElement,
    rdItemEmpty: HTMLElement,
    rdItem: HTMLElement[],
    cb?: () => void
  ): void {
    const tl: GSAPTimeline = gsap.timeline({
      onComplete() {
        if (cb) cb();
      },
    });

    tl.to(rdItem, {
      scale: 1.125,
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
    })
      .to(rdFieldsetBody, {
        height: "3rem",
        duration: 0.25,
        ease: "power2.out",
      })
      .to(
        rdItemEmpty,
        {
          scale: 1,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
        },
        "<0"
      );
  },
};

function exit(): void {
  emits("exit");
}

async function submit() {
  submitLoading.value = true;
  const payload = {
    _id: props.data._id,
    email: email.value,
    password: password.value
  };
  console.log(payload)
  const result = await deleteClass(payload)
  console.log(result)
  if (result === "SUCCESS") {
    panelState.value = "hide";
    location.reload();
  } else {
    passInput.value.error = 'Harap masukkan password dan email dengan benar'
    setTimeout(() => {
      submitLoading.value = false;
    }, 500);
  }
  // getClasses();
}


onMounted(async () => {
  if (props.data) {
    // const data = await getClassDetails(props.data);
    console.log(props.data);
    nameInput.value.model = props.data.name
    tagsInput.value.model = props.data.tags
    scheduleInput.value.model = props.data.schedule
    notesInput.value.model = props.data.notes
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  } else {
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  }
});
</script>

<style lang="scss" scoped>
.rd-panel {

  // width: 20rem;
  .rd-product-switch {
    width: calc(100% - 2rem);
    margin: 0 1rem 1rem 1rem;
  }

  .rd-form-fieldset {
    position: relative;
    width: calc(100% - 2rem);
    padding: 0.75rem;
    border-radius: 0.75rem;
    margin: 0 1rem 1rem 1rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .rd-input-wrapper {
      width: 100%;
      position: relative;
    }

    .rd-form-fieldset-header {
      position: relative;
      width: 100%;
      margin-bottom: 1rem;
      display: flex;
    }

    .rd-form-fieldset-double-input-wrapper {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: row;
    }

    .rd-form-fieldset-input-wrapper {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: space-between;

      .rd-fieldset-input {
        width: 100%;
      }
    }

    .rd-form-fieldset-body {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;

      .rd-form-fieldset-item-empty {
        position: relative;
        width: 100%;
        height: 3rem;
        padding: 0.75rem;
        box-sizing: border-box;
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;

        span.rd-form-fieldset-item-placeholder {
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

      .rd-form-fieldset-item {
        position: relative;
        width: 100%;
        height: 9.5rem;
        padding: 0.75rem;
        margin: 0 0 0.75rem 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;

        .rd-form-fieldset-item-header {
          position: relative;
          width: 100%;
          height: 2rem;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .rd-form-fieldset-item-header-details {
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;

            span.rd-form-fieldset-item-placeholder {
              position: relative;
              margin-top: 0.125rem;
              opacity: 0.5;
            }
          }
        }

        .rd-form-fieldset-item-body {
          position: relative;
          width: 100%;
          height: 4rem;
          display: flex;
          justify-content: space-between;
        }

        .rd-form-fieldset-item-footer {
          position: relative;
          width: 100%;
          height: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;

          span.rd-form-fieldset-item-placeholder {
            position: relative;
            opacity: 0.5;
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

        &:last-child {
          margin: 0;
        }

        &.rd-form-fieldset-item-decoy {
          pointer-events: none;
          position: absolute;
          bottom: 0;
          margin: 0;
          opacity: 0;
          transform: scale(0.875);
        }
      }

      .rd-form-fieldset-detail {
        position: relative;
        width: 100%;
        height: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        span.rd-form-fieldset-placeholder {
          position: relative;
          opacity: 0.5;
        }
      }
    }

    .rd-input-button-container {
      display: flex;
      position: relative;
      width: 18rem;
    }

    .rd-form-fieldset-divider {
      position: relative;
      left: -0.75rem;
      width: calc(100% + 1.5rem);
      height: 1px;
      background: var(--font-color);
      opacity: 0.05;
      margin: 1rem 0;
    }

    .rd-form-fieldset-footer {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;

      .rd-form-fieldset-detail {
        position: relative;
        width: 100%;
        height: 1rem;
        display: flex;
        justify-content: space-between;

        span.rd-form-fieldset-placeholder {
          position: relative;
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
      // border: 1px solid var(--font-color);
      box-sizing: border-box;
      opacity: 0.05;
    }
  }

  .rd-form-footer {
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

    .rd-form-button {
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
    .rd-product-switch {
      width: calc(100% - 3rem);
      margin: 0 1.5rem 1rem 1.5rem;
    }
  }
}
</style>
