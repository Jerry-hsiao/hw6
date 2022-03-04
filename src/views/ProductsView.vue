<template>
  <div class="container">
    <Loading :active="isLoading"></Loading>
    <!-- 商品列表 -->
    <div class="mt-4">
      <ProductDetail :product="product" @add-to-cart="addToCart" ref="orderProductModal">
      </ProductDetail>
      <table class="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.id">
            <td style="width: 200px">
              <div
                style="height: 100px; background-size: cover; background-position: center"
                :style="{ backgroundImage: `url(${item.imageUrl})` }"
              ></div>
            </td>
            <td>
              {{ item.title }}
            </td>
            <td>
              <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
              <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
              <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="getProduct(item)"
                  :disabled="loadingStatus.loadingItem === item.id"
                >
                 <span
                    class="spinner-grow spinner-grow-sm"
                    v-show="loadingStatus.loadingItem === item.id"
                  ></span>
                  查看更多
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  @click="addToCart(item.id)"
                  :disabled="loadingStatus.loadingItem === item.id"
                >
                  <span
                    class="spinner-grow spinner-grow-sm"
                    v-show="loadingStatus.loadingItem === item.id"
                  ></span>
                  加到購物車
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ProductDetail from '@/components/ProductDetail.vue';

export default {
  data() {
    return {
      cartData: {
        carts: [],
      },
      products: [],
      product: {},
      productId: '',
      isLoading: false,
      loadingStatus: {
        loadingItem: '',
      },
    };
  },
  components: {
    ProductDetail,
  },
  methods: {
    getProducts() {
      this.isLoading = true;
      this.$http
        .get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products/all`)
        .then((res) => {
          this.products = Object.values(res.data.products).map((item) => item);
          this.isLoading = false;
        })
        .catch((error) => {
          // eslint-disable-next-line no-alert
          alert(error.response.data.message);
        });
    },
    getProduct(item) {
      this.isLoading = true;
      this.loadingStatus.loadingItem = item.id;
      this.product = item;
      this.$refs.orderProductModal.openModal();
      this.isLoading = false;
      this.loadingStatus.loadingItem = '';
    },
    addToCart(id, qty = 1) {
      this.isLoading = true;
      this.loadingStatus.loadingItem = id;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`;
      const cart = {
        product_id: id,
        qty,
      };
      this.$http
        .post(url, { data: cart })
        .then((response) => {
          // eslint-disable-next-line no-alert
          alert(response.data.message);
          this.getCarts();
          this.loadingStatus.loadingItem = '';
          this.isLoading = false;
          this.$refs.orderProductModal.hideModal();
          this.$refs.orderProductModal.emptyLoading();
        })
        .catch((err) => {
          // eslint-disable-next-line no-alert
          alert(err.data.message);
        });
    },
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
      this.isLoading = item.id;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${item.id}`;
      const cart = {
        product_id: item.id,
        qty: item.qty,
      };
      this.$refs.orderProductModal.hideModal();
      this.$http
        .put(url, { data: cart })
        .then((response) => {
          // eslint-disable-next-line no-alert
          alert(response.data.message);
          this.getCarts();
          this.isLoading = '';
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
    this.getProducts();
    // this.getCarts();
  },
};
</script>
