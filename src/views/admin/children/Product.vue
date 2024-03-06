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
					<el-upload class="avatar-uploader" :action="uploadUrl" :before-upload="beforeImageUpload"
						:on-success="handleSuccess" :http-request="uploadImage" :show-file-list="false">
						<el-button size="small" type="primary">点击上传</el-button>
						<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5MB</div>
					</el-upload>
					<div v-if="image" style="margin-top: 10px;">
						<img :src="image" style="height: 100px;">
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showAddDialog = false">取消</el-button>
				<el-button type="primary" @click="addProduct">确定</el-button>
			</span>
		</el-dialog>
		<el-dialog :visible.sync="showEditDialog" title="编辑商品" @close="resetEditing">
			<el-form ref="editProductForm" :model="editingProduct">
				<el-form-item label="商品名称">
					<el-input v-model="editingProduct.name" placeholder="请输入商品名称"></el-input>
				</el-form-item>
				<el-form-item label="所需积分">
					<el-input v-model="editingProduct.cost" placeholder="请输入所需积分"></el-input>
				</el-form-item>
				<el-form-item label="库存">
					<el-input v-model="editingProduct.stock" placeholder="请输入库存"></el-input>
				</el-form-item>
				<el-form-item label="商品图片">
					<el-upload class="avatar-uploader" :action="uploadUrl" :before-upload="beforeImageUpload"
						:on-success="handleSuccess" :http-request="uploadImage" :show-file-list="false">
						<el-button size="small" type="primary">点击上传</el-button>
						<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5MB</div>
					</el-upload>
					<div v-if="this.image" style="margin-top: 10px;">
						<img :src="this.image" style="height: 100px;">
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showEditDialog = false">取消</el-button>
				<el-button type="primary" @click="updateProduct">保存</el-button>
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
	import axios from "axios"
	export default {
		name: "ProductManagement",
		data() {
			return {
				uploadUrl: "http://localhost:8080/upload",
				products: [],
				showEditDialog: false,
				editingProduct: {
					name: '',
					cost: '',
					stock: ''
				},
				showAddDialog: false, 
				newProduct: {
					name: '',
					cost: '',
					stock: ''
				},
				image: null
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
					image: this.image,
				}).then((response) => {
					if (response.data.status) {
						this.$message.success('商品添加成功');
						this.showAddDialog = false;
						this.image = null;
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
				this.editingProduct = JSON.parse(JSON.stringify(product)); // 避免直接修改原始数据
				this.image = product.image;
				this.showEditDialog = true;
			},
			updateProduct() {
				if (!this.editingProduct.name.trim() || !this.editingProduct.cost) {
					this.$message.error('商品名称和所需积分不能为空');
					return;
				}

				// 调用更新商品的API
				this.$put(`/product`, {
					id: this.editingProduct.id,
					name: this.editingProduct.name,
					cost: this.editingProduct.cost,
					stock: this.editingProduct.stock,
					image: this.image
				}).then((response) => {
					if (response.data.status) {
						this.$message.success('商品更新成功');
						this.showEditDialog = false;
						this.image = null;
						this.resetEditing();
						this.fetchProducts(); 
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
					this.$del(`/product/${id}`).then((response) => {
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

			beforeImageUpload(file) {
				const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
				if (!isJPG) {
					this.$message.error('上传图片只能是 JPG/PNG 格式!');
					return false;
				}
				const isLtSize = file.size / 1024 / 1024 < 5;
				if (!isLtSize) {
					this.$message.error('上传图片大小不能超过 5MB!');
					return false;
				}
				return true;
			},
			handleSuccess(response, file, fileList) {
				console.log('上传成功: ', response);
				this.image = response.url;
				this.$message.success('图片上传成功');
			},
			uploadImage(uploadEvent) {
				const file = uploadEvent.file;
				let formData = new FormData();
				formData.append("file", file);
				console.log(file)
				axios.post('http://localhost:8080/upload', formData)
					.then(response => {
						console.log('上传成功: ', response.data);
						this.image = response.data.data;
						this.$message.success('图片上传成功');
					})
					.catch(error => {
						console.error('上传图片失败: ', error);
						this.$message.error('图片上传失败');
					});
			},
			resetEditing() {
				this.editingProduct = {
					name: '',
					cost: '',
					stock: '',
				};
				this.image = null
			},
			resetAdding() {
				this.newProduct = {
					name: '',
					cost: '',
					stock: '',
				};
				this.image = null
			},
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

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>