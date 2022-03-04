<template>
  <div>
    <div class="container" style="width: 30%">
      <Loading :active="isLoading" :z-index="1060"></Loading>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="InputEmail" class="form-label">Email address</label>
          <input
            type="email"
            class="form-control"
            id="InputEmail"
            aria-describedby="emailHelp"
            v-model="user.username"
          />
          <div id="emailHelp" class="form-text">Please enter email address</div>
        </div>
        <div class="mb-3">
          <label for="InputPassword" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="InputPassword"
            v-model="user.password"
            autocomplete
          />
          <div id="passwordHelp" class="form-text">Please enter your password</div>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      isLoading: false,
    };
  },
  methods: {
    login() {
      this.isLoading = true;
      this.$http
        .post(`${process.env.VUE_APP_API}/admin/signin`, this.user)
        .then((res) => {
          const { token, expired } = res.data;
          document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
          this.$router.push('/admin');
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          // eslint-disable-next-line no-alert
          alert(error.response.data.message);
        });
    },
  },
  mounted() {},
};
</script>
