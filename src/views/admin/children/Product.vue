<template>
	<div class="product-management">
		<el-button type="primary" @click="showAddDialog = true">新增商品</el-button>
		<el-dialog :visible.sync="showAddDialog" title="新增商品" @close="resetAdding">
			<el-form ref="addProductForm" :model="newProduct">
				<el-form-item label="商品名称">
					<el-input v-model="newProduct.name" placeholder="请输入商品名称"></el-input>
				</el-form-item>
				<el-form-item label="所需积分">
					<el-input v-model="newProduct.cost" placeholder="请输入所需积分"></el-input>
				</el-form-item>
				<el-form-item label="库存">
					<el-input v-model="newProduct.stock" placeholder="请输入库存"></el-input>
				</el-form-item>
				<el-form-item label="商品图片">
					<el-upload class="upload-demo" action="/upload" 
						:on-success="handleUploadSuccess"
						:before-upload="beforeImageUpload">
						<el-button size="small" type="primary">点击上传图片</el-button>
					</el-upload>
					<div v-if="newProduct.image" style="margin-top: 10px;">
						<img :src="newProduct.image" style="height: 100px;">
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showAddDialog = false">取消</el-button>
				<el-button type="primary" @click="addProduct">确定</el-button>
			</span>
		</el-dialog>
		<el-table :data="products" style="width: 100%">
			<el-table-column prop="name" label="商品名称" min-width="180"></el-table-column>
			<el-table-column prop="cost" label="所需积分" min-width="180"></el-table-column>
			<el-table-column prop="stock" label="库存" min-width="180"></el-table-column>
			<el-table-column label="商品图片" min-width="180">
				<template slot-scope="scope">
					<img :src="scope.row.image" alt="商品图片" style="height: 50px;">
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180">
				<template slot-scope="scope">
					<el-button size="small" @click="editProduct(scope.row)">编辑</el-button>
					<el-button size="small" type="danger" @click="deleteProduct(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	export default {
		name: "ProductManagement",
		data() {
			return {
				products: [],
				showAddDialog: false,
				newProduct: {
					name: '',
					cost: '',
					image: '' ,// 存储上传的图片URL
					stock: ''
				}
			};
		},
		methods: {
			fetchProducts() {
				this.$get("/product").then(response => {
					this.products = response.data.product;
				});
			},
			addProduct() {
				if (!this.newProduct.name.trim() || !this.newProduct.cost) {
					this.$message.error('商品名称和所需积分不能为空');
					return;
				}

				// 调用添加商品的API
				this.$post("/product", {
					name: this.newProduct.name,
					cost: this.newProduct.cost,
					stock: this.newProduct.stock,
					image: this.newProduct.image,
				}).then((response) => {
					if (response.data.status) {
						this.$message.success('商品添加成功');
						this.showAddDialog = false;
						this.resetAdding();
						this.fetchProducts(); // 重新加载商品列表
					} else {
						this.$message.error(response.data.msg || '添加失败');
					}
				}).catch((error) => {
					console.error('添加商品失败:', error);
					this.$message.error('添加商品失败');
				});
			},

			editProduct(product) {
				// 克隆对象以避免直接修改data中的数据
				this.editingProduct = JSON.parse(JSON.stringify(product));
				this.showEditDialog = true;
			},
			updateProduct() {
				if (!this.editingProduct.name.trim() || !this.editingProduct.cost) {
					this.$message.error('商品名称和所需积分不能为空');
					return;
				}

				// 调用更新商品的API
				this.$put(`/product`, {
					name: this.editingProduct.name,
					cost: this.editingProduct.cost,
					stock: this.editingProduct.stock,
					image: this.editingProduct.image
				}).then((response) => {
					if (response.data.status) {
						this.$message.success('商品更新成功');
						this.showEditDialog = false;
						this.fetchProducts(); // 重新加载商品列表
					} else {
						this.$message.error(response.data.msg || '更新失败');
					}
				}).catch((error) => {
					console.error('更新商品失败:', error);
					this.$message.error('更新商品失败');
				});
			},

			deleteProduct(id) {
				this.$confirm('确定要删除这个商品吗?', '警告', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$delete(`/product/${id}`).then((response) => {
						if (response.data.status) {
							this.$message.success('商品删除成功');
							this.fetchProducts(); // 重新加载商品列表
						} else {
							this.$message.error(response.data.msg || '删除失败');
						}
					}).catch((error) => {
						console.error('删除商品失败:', error);
						this.$message.error('删除商品失败');
					});
				}).catch(() => {
					// 取消操作时的逻辑
				});
			},

			handleUploadSuccess(response, file) {
				// 假设上传成功后的响应中包含图片的URL
				this.newProduct.image = response.url;
			},
			beforeImageUpload(file) {
				// 可以在这里添加文件大小或类型的检查
				const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
				if (!isJPG) {
					this.$message.error('上传图片只能是 JPG/PNG 格式!');
					return false;
				}
				return true;
			},
			resetAdding() {
				this.newProduct = {
					name: '',
					cost: '',
					image: ''
				};
			}
		},
		created() {
			this.fetchProducts();
		}
	}
</script>

<style scoped>
	.product-management .el-upload {
		cursor: pointer;
	}

	.product-management img {
		max-width: 100%;
		height: auto;
	}
</style>