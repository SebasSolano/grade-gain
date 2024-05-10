<script setup></script>

<template>
    <router-view />
</template>

<style>
#app {
    display: grid;
    grid-template-areas:
      "aside main main";
    grid-template-columns: 450px 1fr;
    grid-template-rows: 1fr auto;
  }
  
  html {
    font-family: "CircularStd", system-ui, sans-serif;
    background: #E8E8E8;
    color: #333333;
  }
  
  @font-face {
    font-family: "CircularStd";
    src: url("/fonts/CircularStd-Medium.woff2") format("woff2");
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: "CircularStd";
    src: url("/fonts/CircularStd-Book.woff2") format("woff2");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: "CircularStd";
    src: url("/fonts/CircularStd-Light.woff2") format("woff2");
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: "CircularStd";
    src: url("/fonts/CircularStd-Bold.woff2") format("woff2");
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: "CircularStd";
    src: url("/fonts/CircularStd-Black.woff2") format("woff2");
    font-weight: 900;
    font-style: normal;
    font-display: swap;
  }
</style>
