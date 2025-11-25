<script setup lang="ts">

</script>

<template>
  <header class="dbr-header-in-mobile">
    <a href="https://www.dynamsoft.com/" target="_blank" class="logo">
      <img src="../assets/image/logo-dynamsoft-blackBg-190x47.png" alt="logo" />
    </a>
  </header>
</template>

<style scoped lang="less">
.dbr-header-in-mobile {
  width: 100%;
  height: 7%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #222222;
  padding-right: 35px;

  .logo {
    margin-left: 15px;

    img {
      height: 3.7vh;
    }
  }

  svg {
    height: 3.5vh;
    margin-left: 12px;
  }

  @media (min-width: 980px) {
    display: none;
  }
}
</style>
