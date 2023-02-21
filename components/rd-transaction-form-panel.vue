<template>
  <rd-panel
    class="rd-panel"
    :label="'Tambah Berkas'"
    :state="panelState"
    :loading="dataLoading"
    @exit="exit"
  >
    <div class="rd-form-fieldset">
      <div
        class="rd-input-wrapper"
        style="margin-bottom: 1rem; width: calc(100% + 2rem); left: -1rem"
      >
        <rd-input-images :input="fileInput" />
      </div>
      <div class="rd-form-fieldset-input-wrapper">
        <rd-input-text class="rd-fieldset-input" :input="regInput" />
      </div>
      <div class="rd-form-fieldset-input-wrapper">
        <rd-input-text class="rd-fieldset-input" :input="nameInput" />
      </div>
      <div class="rd-form-fieldset-input-wrapper">
        <rd-input-text class="rd-fieldset-input" :input="aliasInput" />
      </div>
      <div class="rd-form-fieldset-input-wrapper">
        <rd-input-text class="rd-fieldset-input" :input="NIKInput" />
      </div>
      <div class="rd-form-fieldset-double-input-wrapper">
        <rd-input-text
          class="rd-fieldset-input"
          :input="pobInput"
          style="margin-right: 1rem"
        />
        <rd-input-text class="rd-fieldset-input" :input="dobInput" />
      </div>
      <div class="rd-form-fieldset-input-wrapper">
        <rd-input-select class="rd-fieldset-input" :input="sexInput" />
      </div>
      <div class="rd-form-fieldset-input-wrapper">
        <rd-input-text class="rd-fieldset-input" :input="addressInput" />
      </div>
      <div class="rd-form-fieldset-double-input-wrapper">
        <div class="rd-form-fieldset-input-wrapper">
          <rd-input-text
            class="rd-fieldset-input"
            :input="cityInput"
            style="margin-right: 0.5rem"
          />
        </div>
        <div class="rd-form-fieldset-input-wrapper">
          <rd-input-text
            class="rd-fieldset-input"
            :input="districtInput"
            style="margin-left: 0.5rem"
          />
        </div>
      </div>
      <div class="rd-form-fieldset-input-wrapper">
        <rd-input-select class="rd-fieldset-input" :input="catInput" />
      </div>
      <div class="rd-form-fieldset-input-wrapper">
        <rd-input-text class="rd-fieldset-input" :input="dateInput" />
      </div>
      <div class="rd-form-fieldset-input-wrapper">
        <rd-input-text class="rd-fieldset-input" :input="notesInput" />
      </div>
    </div>
    <!-- <div class="rd-input-button-container"> -->
    <rd-input-button
      class="rd-form-button"
      style="margin: 0 2rem"
      :loading="submitLoading"
      :label="'Submit'"
      @clicked="submit"
    />
    <!-- </div> -->
  </rd-panel>
</template>

<script lang="ts" setup>
import gsap from "gsap";
import { ComputedRef } from "vue";

import { InputOption, InputImageOption } from "~~/interfaces/general.js";
import { InmateRequest } from "~~/interfaces/inmates";

const { getInmates, addInmate } = useInmate();

const props = defineProps<{
  state: "idle" | "hide";
}>();
const emits = defineEmits(["exit", "update"]);

const rdFieldsetBody = ref<HTMLDivElement>(null);
const rdItemEmpty = ref<HTMLDivElement>(null);
const rdItemDecoy = ref<HTMLDivElement>(null);
const rdItem = ref<HTMLDivElement[]>(null);

const dataLoading = ref<boolean>(true);
const dataBranches = ref<{ name: string; value: string }[]>(null);
const dataCustomers = ref<{ name: string; value: string }[]>(null);
const dataSuppliers = ref<{ name: string; value: string }[]>(null);
const dataProducts = ref<{ name: string; value: string }[]>(null);

const submitLoading = ref<boolean>(false);
const panelState = ref<"idle" | "hide">("idle");
const file: ComputedRef<(File | string)[]> = computed(
  (): (File | string)[] => fileInput.value.file
);
const fileInput = ref<InputImageOption>({
  label: "Upload images",
  limit: 3,
  file: [],
});

const regInput = ref<InputOption>({
  name: "registration",
  label: "Nomor Registrasi",
  placeholder: "II/12...",
  model: "",
  value: "",
  error: "",
});
const nameInput = ref<InputOption>({
  name: "name",
  label: "Nama",
  placeholder: "...",
  model: "",
  value: "",
  error: "",
});
const aliasInput = ref<InputOption>({
  name: "alias",
  label: "alias",
  placeholder: "...",
  model: "",
  value: "",
  error: "",
});
const NIKInput = ref<InputOption>({
  name: "NIK",
  label: "NIK",
  placeholder: "3570....",
  model: "",
  type: "num",
  value: "",
  error: "",
});
const pobInput = ref<InputOption>({
  name: "pob",
  label: "Tempat lahir",
  placeholder: "kota...",
  value: "",
  model: "",
  error: "",
});
const dobInput = ref<InputOption>({
  name: "dob",
  label: "Tanggal Lahir",
  placeholder: "dd/mm/yyyy",
  model: "",
  error: "",
  value: "",
  disabled: false,
});
const dateInput = ref<InputOption>({
  name: "date",
  label: "Tanggal Masuk",
  placeholder: "dd/mm/yyyy",
  model: "",
  value: "",
  error: "",
  disabled: false,
});
const addressInput = ref<InputOption>({
  name: "address",
  label: "Alamat",
  placeholder: "...",
  model: "",
  value: "",
  error: "",
});
const notesInput = ref<InputOption>({
  name: "notes",
  label: "Keterangan(opsional)",
  placeholder: "...",
  model: "",
  value: "",
  error: "",
});
const cityInput = ref<InputOption>({
  name: "city",
  label: "Kota",
  placeholder: "...",
  model: "",
  value: "",
  error: "",
});
const districtInput = ref<InputOption>({
  name: "district",
  label: "Kecamatan",
  placeholder: "...",
  model: "",
  value: "",
  error: "",
});

const sexInput = ref<InputOption>({
  name: "sex",
  label: "Jenis Kelamin",
  model: "",
  placeholder: "",
  value: "",
  error: "",
  options: ["pria", "wanita"],
});
const catInput = ref<InputOption>({
  name: "category",
  label: "Klasifikasi Perkara",
  model: "",
  placeholder: "",
  value: "",
  error: "",
  options: ["Kategori I", "Kategori II", "Kategori III"],
});

const name: ComputedRef<string> = computed((): string => nameInput.value.model);
const alias: ComputedRef<string> = computed(
  (): string => aliasInput.value.model
);
const NIK: ComputedRef<string> = computed((): string => NIKInput.value.model);
const cat: ComputedRef<string> = computed((): string => catInput.value.model);
const registration: ComputedRef<string> = computed(
  (): string => regInput.value.model
);
const placeOfBirth: ComputedRef<string> = computed(
  (): string => pobInput.value.model
);
const dateOfBirth: ComputedRef<string> = computed(
  (): string => dobInput.value.model
);
const date: ComputedRef<string> = computed((): string => dateInput.value.model);
const address: ComputedRef<string> = computed(
  (): string => addressInput.value.model
);
const notes: ComputedRef<string> = computed(
  (): string => notesInput.value.model
);
const city: ComputedRef<string> = computed((): string => cityInput.value.model);
const district: ComputedRef<string> = computed(
  (): string => districtInput.value.model
);
const sex: ComputedRef<string> = computed((): string => sexInput.value.model);

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

async function submit(): Promise<void> {
  submitLoading.value = true;
  const fileNew: File[] = [];

  for (const data of file.value) {
    if (data instanceof File) {
      fileNew.push(data);
    }
  }
  const payload: InmateRequest = {
    registration: registration.value,
    category: cat.value,
    NIK: NIK.value,
    name: name.value,
    alias: alias.value,
    place_of_birth: placeOfBirth.value,
    date_of_birth: new Date(1328288400000),
    date: new Date(1328288400000),
    address: address.value,
    notes: notes.value,
    city: city.value,
    district: district.value,
    sex: sex.value,
    file: fileNew,
  };
  getInmates();
  console.log(payload);
  const addID: string = await addInmate(payload);
  console.log(addID);
  if (addID) {
    panelState.value = "hide";
  }
}

onMounted(async () => {
  setTimeout(() => {
    dataLoading.value = false;
  }, 500);
});
</script>

<style lang="scss" scoped>
.rd-panel {
  width: 20rem;
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
