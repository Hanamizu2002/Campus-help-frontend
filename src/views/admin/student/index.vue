<template>
	<div class="app-container">
		<!-- 搜索栏🔍 -->
		<el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
			label-width="68px">
			<el-form-item label="姓名" prop="name">
				<el-input v-model="queryParams.name" placeholder="请输入姓名" clearable @keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="年龄" prop="age">
				<el-input v-model="queryParams.age" placeholder="请输入年龄" clearable @keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single"
					@click="handleUpdate">修改</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
					@click="handleDelete">删除</el-button>
			</el-col>

			<!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
		</el-row>

		<el-table v-loading="loading" :data="studs" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="学生编号" align="center" prop="id" />
			<el-table-column label="姓名" align="center" prop="name" />
			<el-table-column label="年龄" align="center" prop="age" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button size="mini" type="text" icon="el-icon-edit"
						@click="handleUpdate(scope.row)">修改</el-button>
					<el-button size="mini" type="text" icon="el-icon-delete"
						@click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->

		<!-- 添加或修改学生管理对话框 -->
		<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="form.name" placeholder="请输入姓名" />
				</el-form-item>
				<el-form-item label="年龄" prop="age">
					<el-input v-model="form.age" placeholder="请输入年龄" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		listStuage,
		getStuage,
		delStuage,
		addStuage,
		updateStuage
	} from "@s/api/student/stuage";

	export default {
		name: "Stuage",
		data() {
			return {
				// 遮罩层
				loading: true,

				// 选中数组
				ids: [],

				// 非单个禁用
				single: true,
				// 非多个禁用
				multiple: true,

				// 显示搜索条件
				showSearch: true,
				// 总条数
				total: 0,
				// 弹出层标题
				title: "",
				// 是否显示弹出层
				open: false,
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					name: null,
					age: null
				},

				// 表单参数
				form: {},

				// 表单校验
				rules: {},

				// 学生管理表格数据
				studs: []
			};
		},
		created() {
			this.getList();
		},
		methods: {

			getList() {
				this.loading = true;
				listStuage(this.queryParams).then(response => {
					this.studs = response.data.rows
					this.total = response.total;
					this.loading = false;
				});
			},

			/** 新增按钮操作 */
			handleAdd() {
				this.reset();
				this.open = true;
				this.title = "添加学生管理";
			},

			/** 修改按钮操作 */
			handleUpdate(row) {
				this.reset();
				const id = row.id || this.ids
				getStuage(id).then(response => {
					this.form = response.data.student;
					this.open = true;
					this.title = "修改学生管理";
				});
			},

			/** 提交按钮 */
			submitForm() {
				this.$refs["form"].validate(valid => {
					if (valid) {
						if (this.form.id != null) {
							updateStuage(this.form).then(response => {
								this.$message("修改成功");
								this.open = false;
								this.getList();
							});

						} else {
							// console.log(this.form);
							// this.$post("/student/stuage",this.form,).then(response => {
							//   this.$message("新增成功");
							//   this.open = false;
							//   this.newList();
							// });
							addStuage(this.form).then(response => {
								this.$message("新增成功");
								this.open = false;
								this.getList();
							});
						}
					}
				});
			},

			/** 删除按钮操作 */
			handleDelete(row) {
				const ids = row.id || this.ids;
				this.$confirm('是否确认删除此学生', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					delStuage(ids).then(response => {
						this.open = false;
						this.getList();
					});

					// this.$del("/student/stuage/"+ids).then(response => {
					//   this.open = false;
					//   this.newList();
					// });
					this.$message({
						type: 'success',
						message: '删除成功!'
					});

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},


			// 取消按钮
			cancel() {
				this.open = false;
				this.reset();
			},

			// 表单重置
			reset() {
				this.form = {
					id: null,
					name: null,
					age: null
				};
				// this.resetForm("form");
			},

			/** 搜索按钮操作 */
			handleQuery() {
				this.queryParams.pageNum = 1;
				this.getList();
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.resetForm("queryForm");
				this.handleQuery();
			},
			// 多选框选中数据
			handleSelectionChange(selection) {
				this.ids = selection.map(item => item.id)
				this.single = selection.length !== 1
				this.multiple = !selection.length
			}
		}
	};
</script>