<template>
  <div id="nav">
    <router-link to="/">前台首頁</router-link> |
    <router-link to="/admin/products">後台產品列表</router-link> |
    <router-link to="/admin/orders">訂單列表</router-link> |
    <a href="#" @click.prevent="signout">登出</a>
  </div>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'DashBoard',
  data() {
    return {
      checkSuccess: false,
    };
  },
  methods: {
    checkLogin() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      if (token) {
        // Axios 預設值
        this.$http.defaults.headers.common.Authorization = `${token}`;

        const api = `${process.env.VUE_APP_API}/api/user/check`;
        this.$http
          .post(api, { api_token: this.token })
          .then(() => {
            this.checkSuccess = true;
          })
          .catch((err) => {
            // eslint-disable-next-line no-alert
            alert(err.data.message);
            this.$router.push('/login');
          });
      } else {
        // eslint-disable-next-line no-alert
        alert('您尚未登入。');
        this.$router.push('/login');
      }
    },
    signout() {
      document.cookie = 'hexToken=;expires=;';
      // eslint-disable-next-line no-alert
      alert('token 已清除');
      this.$router.push('/login');
    },
  },
  mounted() {
    this.checkLogin();
  },
};
</script>
