<template>
  <div class="rd-input-component">
    <div class="rd-input-icon-container">
      <rd-svg :name="'magnify'" :color="'secondary'" />
    </div>
    <input
      type="text"
      class="rd-input rd-body-text"
      :placeholder="props.input.placeholder"
      @input="updateModel"
    />
    <div class="rd-input-border"></div>
  </div>
</template>

<script lang="ts" setup>
import { InputSearchOption } from "~~/interfaces/general";

const props = defineProps<{
  input: InputSearchOption;
}>();

const inputModel = ref<string>("");

function updateModel({ target }: InputEvent): void {
  if (target instanceof HTMLInputElement) {
    inputModel.value = target.value;
    props.input.model = target.value;
  }
}
</script>

<style lang="scss" scoped>
.rd-input-component {
  position: relative;
  width: 14rem;
  height: 2rem;
  background: var(--background-depth-three-color);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  .rd-input-icon-container {
    position: relative;
    width: 2rem;
    height: 2rem;
    // background: rgba(0, 0, 0, 0.05);
    // border-right: 1px solid red;
    border-radius: 0.75rem;
    // border-top-left-radius: 0.75rem;
    // border-bottom-left-radius: 0.75rem;
    padding: 0 0.35rem 0 0.5rem;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    &:focus {
      outline: none;
      background: var(--background-depth-two-color);
    }
  }
  input.rd-input {
    position: relative;
    width: calc(100% - 2rem);
    height: 100%;
    padding: 0 0.5rem;
    border: none;
    border-radius: 0.75rem;
    // border-top-right-radius: 0.75rem;
    // border-bottom-right-radius: 0.75rem;
    box-sizing: border-box;
    font-family: "Inconsolata";
    color: var(--font-color);
    background: rgba(0, 0, 0, 0);
    display: flex;
    transition: background-color 0.25s;
    &::placeholder {
      color: var(--font-color);
      opacity: 0.5;
      transition: opacity 0.25s;
    }
    &:hover {
      outline: none;
      background: rgba(0, 0, 0, 0);
      &::placeholder {
        opacity: 1;
      }
    }
    &:focus {
      outline: none;
      background: var(--background-depth-two-color);
    }
    &:focus + .rd-input-border {
      border-color: var(--primary-color);
      &::before {
        opacity: 0.25;
      }
    }
  }
  .rd-input-border {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0.75rem;
    border: 1px solid rgba(0, 0, 0, 0.125);
    box-sizing: border-box;
    transition: 0.25s border-color, 0.25s border-width;
    // &::before {
    //   content: "";
    //   position: absolute;
    //   top: -3px;
    //   left: -3px;
    //   width: calc(100% + 6px);
    //   height: calc(100% + 6px);
    //   border-radius: 0.75rem;
    //   border: 1px solid var(--primary-color);
    //   box-sizing: border-box;
    //   opacity: 0;
    //   // transition: 0.25s opacity;
    // }
  }
}
</style>
