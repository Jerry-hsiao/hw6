<template>
  <div class="container">
    <div>
        <!-- 購物車 -->
    <div class="text-end">
      <button
        class="btn btn-outline-danger"
        type="button"
        @click="removeCartAll"
        :disabled="!cartData.carts || cartData.carts.length === 0"
      >
        清空購物車
      </button>
    </div>
    <table class="table align-middle">
      <thead>
        <tr>
          <th></th>
          <th>品名</th>
          <th style="width: 150px">數量/單位</th>
          <th>單價</th>
          <th>單筆總價</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="cartData.carts">
          <tr v-for="item in cartData.carts" :key="item.id">
            <td>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="removeCart(item.id)"
              >
                <i class="fas fa-spinner fa-pulse"></i>
                x
              </button>
            </td>
            <td>
              {{ item.product.title }}
              <!-- <div class="text-success">已套用優惠券</div> -->
            </td>
            <td>
              <div class="input-group input-group-sm">
                <div class="input-group mb-3">
                  <!-- <input
                    min="1"
                    type="number"
                    class="form-control"
                    v-model.number="item.qty"
                  /> -->
                  <select
                    class="form-select"
                    v-model="item.qty"
                    @change="updateCart(item)"
                    :disabled="loadingStatus.loadingItem === item.id"
                  >
                    <option
                      :value="num"
                      v-for="num in 50"
                      :key="num + 'item.id'"
                    >
                      {{ num }}
                    </option>
                  </select>
                  <span class="input-group-text" id="basic-addon2">{{
                    item.product.unit
                  }}</span>
                </div>
              </div>
            </td>
            <td class="text-end">
              {{ item.product.price }}
            </td>
            <td class="text-end">
              {{ item.total }}
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4" class="text-end">總計</td>
          <td class="text-end">{{ cartData.final_total }}</td>
        </tr>
        <!-- <tr>
          <td colspan="4" class="text-end text-success">折扣價</td>
          <td class="text-end text-success">{{}}</td>
        </tr> -->
      </tfoot>
    </table>
      <div class="my-5 row justify-content-center">
        <Form ref="form" class="col-md-6" v-slot="{ errors }" @submit="createOrder">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <Field
              id="email"
              name="email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': errors['email'] }"
              placeholder="請輸入 Email"
              rules="email|required"
              v-model="form.user.email"
            ></Field>
            <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="name" class="form-label">收件人姓名</label>
            <Field
              id="name"
              name="姓名"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors['姓名'] }"
              placeholder="請輸入姓名"
              rules="required"
              v-model="form.user.name"
            ></Field>
            <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="tel" class="form-label">收件人電話</label>
            <Field
              id="tel"
              name="電話"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors['電話'] }"
              placeholder="請輸入電話"
              rules="required"
              v-model="form.user.tel"
            ></Field>
            <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="address" class="form-label">收件人地址</label>
            <Field
              id="address"
              name="地址"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors['地址'] }"
              placeholder="請輸入地址"
              rules="required"
              v-model="form.user.address"
            ></Field>
            <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="message" class="form-label">留言</label>
            <textarea
              name=""
              id="message"
              class="form-control"
              cols="30"
              rows="10"
              v-model="form.message"
            ></textarea>
          </div>
          <div class="text-end">
            <button type="submit" class="btn btn-danger"
            :disabled="!cartData.carts || cartData.carts.length === 0"
            >送出訂單</button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartData: {
        carts: [],
      },
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      loadingStatus: {
        loadingItem: '',
      },
    };
  },
  methods: {
    getCarts() {
      this.$http
        .get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`)
        .then((res) => {
          this.cartData = res.data.data;
        })
        .catch((err) => {
          // eslint-disable-next-line no-alert
          alert(err.data.message);
        });
    },
    removeCart(id) {
      this.$http
        .delete(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${id}`)
        .then((res) => {
          // eslint-disable-next-line no-alert
          alert(res.data.message);
          this.getCarts();
        })
        .catch((err) => {
          // eslint-disable-next-line no-alert
          alert(err.data.message);
        });
    },
    removeCartAll() {
      this.$http
        .delete(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/carts`)
        .then((res) => {
          // eslint-disable-next-line no-alert
          alert(res.data.message);
          this.getCarts();
        })
        .catch((err) => {
          // eslint-disable-next-line no-alert
          alert(err.data.message);
        });
    },
    updateCart(item) {
      this.loadingStatus.loadingItem = item.id;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${item.id}`;
      const cart = {
        product_id: item.id,
        qty: item.qty,
      };
      this.$http
        .put(url, { data: cart })
        .then((response) => {
          // eslint-disable-next-line no-alert
          alert(response.data.message);
          this.getCarts();
          this.loadingStatus.loadingItem = '';
        })
        .catch((err) => {
          // eslint-disable-next-line no-alert
          alert(err.data.message);
        });
    },
    createOrder() {
      this.$validator.validate().then((result) => {
        if (result) {
          const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/order`;
          const order = this.form;
          this.$http
            .post(url, { data: order })
            .then((response) => {
              // eslint-disable-next-line no-alert
              alert(response.data.message);
              this.emptyForm();
              this.getCarts();
            })
            .catch((err) => {
              // eslint-disable-next-line no-console
              console.log(`錯誤訊息${err}`);
              // eslint-disable-next-line no-alert
              alert(err.data);
            });
        } else {
          // 驗證失敗產生的行為
          // eslint-disable-next-line no-console
          console.log('客戶戶資料填寫不完整');
        }
      });
    },
  },
  mounted() {
    this.getCarts();
  },
};
</script>
