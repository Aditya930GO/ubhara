<template>
  <rd-panel
    class="rd-panel"
    :label="data ? 'Edit Product' : 'Add Product'"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div class="rd-input-wrapper" style="margin-bottom: 1rem">
      <rd-input-images :input="fileInput" />
    </div>
    <div class="rd-input-wrapper">
      <rd-input-text class="rd-input" :input="nameInput" />
    </div>
    <div class="rd-input-wrapper">
      <rd-input-text class="rd-input" :input="skuInput" />
    </div>
    <div class="rd-input-wrapper">
      <rd-input-text class="rd-input" :input="priceInput" />
    </div>
    <div class="rd-input-wrapper" style="margin-bottom: 4rem">
      <rd-input-option class="rd-input" :input="categoryInput" />
    </div>
    <div class="rd-input-button-wrapper">
      <rd-input-button
        class="rd-input-button"
        :label="'Submit'"
        :loading="submitLoading"
        @clicked="submit"
        :disabled="!name || !sku || !price || !category"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
import { ComputedRef } from "vue";

import { Product, ProductRequest } from "~~/interfaces/product.js";
import { InputOption, InputImageOption } from "~~/interfaces/general.js";

const { loading, categories, addProduct, updateProduct, getProducts } =
  useProduct();
const props = defineProps<{
  state: "idle" | "hide";
  data?: Product;
}>();
const emits = defineEmits(["exit"]);

const submitLoading = ref<boolean>(false);
const panelState = ref<"idle" | "hide">("idle");

const file: ComputedRef<(File | string)[]> = computed(
  (): (File | string)[] => fileInput.value.file
);
const name: ComputedRef<string> = computed((): string => nameInput.value.model);
const sku: ComputedRef<string> = computed((): string => skuInput.value.model);
const category: ComputedRef<string> = computed(
  (): string => categoryInput.value.model
);
const price: ComputedRef<number> = computed((): number =>
  parseInt(priceInput.value.model.split(".").join(""))
);

const fileInput = ref<InputImageOption>({
  label: "Upload images",
  limit: 5,
  file: [],
});
const nameInput = ref<InputOption>({
  name: "name",
  placeholder: "Awesome Product #21",
  model: "",
  label: "Product name",
  error: "",
});
const skuInput = ref<InputOption>({
  name: "sku",
  placeholder: "AP-01-0001",
  model: "",
  label: "Product SKU",
  error: "",
});
const priceInput = ref<InputOption>({
  name: "price",
  placeholder: "1.000.000",
  model: "",
  label: "Price",
  error: "",
  type: "number",
});
const categoryInput = ref<InputOption>({
  name: "category",
  placeholder: "category",
  model: "",
  label: "Category",
  error: "",
  options: categories.value,
});

watch(
  () => nameInput.value.model,
  (val: string) => {
    if (!val) nameInput.value.error = "This field is required";
    else nameInput.value.error = "";
  }
);
watch(
  () => skuInput.value.model,
  (val: string) => {
    if (!val) skuInput.value.error = "This field is required";
    else skuInput.value.error = "";
  }
);
watch(
  () => priceInput.value.model,
  (val: string) => {
    if (!val) priceInput.value.error = "This field is required";
    else priceInput.value.error = "";
  }
);
watch(
  () => categoryInput.value.model,
  (val: string) => {
    if (!val) categoryInput.value.error = "This field is required";
    else categoryInput.value.error = "";
  }
);
watch(
  () => props.state,
  (val) => {
    if (val === "hide") panelState.value = "hide";
  }
);

async function submit(): Promise<void> {
  submitLoading.value = true;
  const fileNew: File[] = [];
  const fileKeep: string[] = [];
  const fileDelete: string[] = [];

  for (const data of file.value) {
    if (typeof data === "string" && data.includes("/products/")) {
      fileKeep.push(data);
    } else if (data instanceof File) {
      fileNew.push(data);
    }
  }
  if (props.data?.image_url) {
    for (const data of props.data.image_url) {
      if (!fileKeep.includes(data)) {
        fileDelete.push(data);
      }
    }
  }

  const payload: ProductRequest = {
    name: name.value,
    price: price.value,
    sku: sku.value,
    category: category.value,
    file: fileNew,
  };

  let productId: string = "";
  if (props.data) {
    let dataChanged: boolean = false;
    let imageChanged: boolean = false;

    if (
      name.value !== props.data.name ||
      sku.value !== props.data.sku ||
      price.value !== props.data.price ||
      category.value !== props.data.category
    ) {
      dataChanged = true;
    }
    if (fileNew.length || fileDelete.length) {
      imageChanged = true;
    }

    payload._id = props.data._id;
    payload.file_delete = fileDelete;
    productId = await updateProduct(payload, dataChanged, imageChanged);
  } else {
    productId = await addProduct(payload);
  }
  if (productId) {
    panelState.value = "hide";
    loading.value = true;
    getProducts(true);
  }
}

onMounted(() => {
  if (props.data) {
    fileInput.value.file = props.data.image_url;
    nameInput.value.model = props.data.name;
    skuInput.value.model = props.data.sku;
    priceInput.value.model = props.data.price.toLocaleString("de-DE");
    categoryInput.value.model = props.data.category;
  }
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
