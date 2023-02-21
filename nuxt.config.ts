import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:8000",
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "id",
      },
      titleTemplate: "%s | UBHARA",
      title: "SIM UBHARA ",
    },
  },
  css: ["~/assets/fonts.scss"],
  build: {
    loaders: {
      scss: {
        implementation: require("sass"),
      },
    },
  },
});
