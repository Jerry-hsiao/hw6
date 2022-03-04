<template>
  <div id="nav">
    <router-link to="/">首頁</router-link> |
    <router-link to="/products">前台產品列表</router-link> |
    <router-link to="/cart">前台購物車列表</router-link> |
    <router-link to="/admin">後台列表</router-link> |
    <router-link to="/login">登入</router-link>
  </div>
  <router-view></router-view>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Front',
  mounted() {},
};
</script>
