<template>
	<div class="coin-convert">
		<el-row :gutter="20">
			<el-col :span="24">
				<div class="user-coin">您当前的积分余额为: {{ user.coin }}</div>
				<el-row :gutter="20">
					<el-col :span="6" v-for="product in products" v-if="product.stock > 0" :key="product.id" class="content">
						<el-card>
							<div style="text-align: center;">
								<img :src="product.image" alt="商品图片" style="max-width: 100%; max-height: 200px;">
							</div>
							<div class="product-name">{{ product.name }}</div>
							<div class="product-cost">所需积分: {{ product.cost }}</div>
							<div class="product-cost">库存: {{ product.stock }}</div>
							<el-button type="primary" @click="openConvertDialog(product)">兑换</el-button>
						</el-card>
					</el-col>
				</el-row>
			</el-col>
		</el-row>

		<el-dialog title="兑换确认" :visible.sync="convertDialogVisible">
			<el-form :model="convertForm">
				<el-form-item label="收货地址">
					<el-input v-model="convertForm.address"></el-input>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input v-model="convertForm.name"></el-input>
				</el-form-item>
				<el-form-item label="电话">
					<el-input v-model="convertForm.phone"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="convertDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="confirmConvert">确认兑换</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex'
	import {
		formatDate
	} from '@/util/date';
	export default {
		name: "CoinConvert",
		data() {
			return {
				products: [], // 商品列表
				convertDialogVisible: false, // 兑换对话框是否显示
				selectedProduct: {}, // 选中的商品
				convertForm: { // 兑换表单数据
					address: '',
					name: '',
					phone: ''
				},
			};
		},
		computed: {
			...mapState('user', ['user'])
		},
		methods: {
			...mapMutations('user', ['setUser']),
			fetchProducts() {
				this.$get("/product").then(response => {
					this.products = response.data.product;
				});
			},
			openConvertDialog(product) {
				if (product.cost > this.user.coin) {
					this.$message.error('积分不足');
					return;
				}
				if (!product.stock > 0) {
					this.$message.error('库存不足');
					return;
				}
				this.selectedProduct = product;
				this.convertDialogVisible = true;
			},
			confirmConvert() {
				// 验证地址非空
				if (!this.convertForm.address.trim()) {
					this.$message.error('收货地址不能为空');
					return;
				}

				// 验证姓名非空
				if (!this.convertForm.name.trim()) {
					this.$message.error('收货人姓名不能为空');
					return;
				}

				// 验证手机号合法性（示例中使用的是中国大陆的手机号格式）
				const phoneRegex = /^1[3-9]\d{9}$/;
				if (!phoneRegex.test(this.convertForm.phone)) {
					this.$message.error('请输入合法的手机号');
					return;
				}

				// 全部验证通过，执行兑换逻辑
				this.$post("/exchange", {
						...this.convertForm,
						productId: this.selectedProduct.id,
						userId: this.user.id
					})
					.then(() => {
						this.$message.success('兑换成功');
						this.convertDialogVisible = false;
						this.fetchUserInfo();
						this.fetchProducts();
					})
					.catch(error => {
						console.error('兑换失败:', error);
						this.$message.error('兑换失败');
					});
			},
			fetchUserInfo() {
				this.$get("/user/" + this.user.id).then(response => {
					sessionStorage.setItem('user', JSON.stringify(response.data.user))
					this.setUser(JSON.parse(sessionStorage.getItem('user')))
				}).catch(error => {
					console.error('获取用户信息失败:', error);
				});
			},
		},
		created() {
			this.fetchProducts();
			this.fetchUserInfo();
		},
		filters: {
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm');
			}
		}
	}
</script>

<style scoped>
	.content {
		margin: 15px;
	}

	.coin-convert .el-row {
		margin-bottom: 20px;
	}

	.product-name {
		margin: 10px 0;
	}

	.product-cost {
		margin-bottom: 20px;
	}
</style>