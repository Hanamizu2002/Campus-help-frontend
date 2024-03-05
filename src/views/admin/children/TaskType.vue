<template>
	<div class="content">
		<el-button type="primary" @click="showAddDialog = true">新增任务类型</el-button>
		<el-dialog :visible.sync="showAddDialog" title="新增任务类型">
			<el-input v-model="newTaskTypeName" placeholder="请输入任务类型名称"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showAddDialog = false">取消</el-button>
				<el-button type="primary" @click="addTaskType">确定</el-button>
			</span>
		</el-dialog>
		<el-dialog :visible.sync="showEditDialog" title="编辑任务类型" @close="resetEditing">
			<el-input v-if="editingTaskType" v-model="editingTaskType.name" placeholder="请输入任务类型名称"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showEditDialog = false">取消</el-button>
				<el-button type="primary" @click="updateTaskType">保存</el-button>
			</span>
		</el-dialog>
		<el-table :data="taskTypes" style="width: 100%">
			<el-table-column prop="name" label="任务类型名称" min-width="180"></el-table-column>
			<el-table-column label="操作" width="180">
				<template slot-scope="scope">
					<el-button size="small" @click="editTaskType(scope.row)">编辑</el-button>
					<el-button size="small" type="danger" @click="deleteTaskType(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	export default {
		name: "TaskType",
		data() {
			return {
				taskTypes: [], // 用于存储任务类型列表
				showAddDialog: false, // 控制新增对话框的显示
				newTaskTypeName: "", // 新增任务类型的名称
				showEditDialog: false, // 控制编辑对话框的显示
				editingTaskType: {}
			}
		},
		methods: {
			fetchTaskTypes() {
				this.$get("/taskType").then(res => {
					this.taskTypes = res.data.taskType;
				});
			},
			addTaskType() {
				if (this.newTaskTypeName) {
					this.$post("/taskType", {
						"name": this.newTaskTypeName,
					}).then((res) => {
						if (res.data.status) {
							this.$message.success("添加成功");
							this.showAddDialog = false;
							this.newTaskTypeName = "";
							this.fetchTaskTypes();
						} else {
							this.$msg(res.data.msg, "error")
						}
					});
				} else {
					this.$message.error("任务类型名称不能为空");
					return;
				}
			},
			deleteTaskType(id) {
				this.$confirm('此操作将永久删除该任务类型, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$del(`/taskType/${id}`).then(() => {
						this.$message.success("删除成功");
						this.fetchTaskTypes();
					});
				}).catch(() => {});
			},
			editTaskType(taskType) {
				this.editingTaskType = Object.assign({}, taskType);
				this.showEditDialog = true;
			},
			updateTaskType() {
				if (!this.editingTaskType) {
					this.$message.error("任务类型名称不能为空");
					return;
				}
				this.$put(`/taskType`, {
					"id": this.editingTaskType.id,
					"name": this.editingTaskType.name
				}).then(() => {
					this.$message.success("更新成功");
					this.showEditDialog = false;
					this.fetchTaskTypes();
				}).catch(error => {
					console.error("更新失败", error);
					this.$message.error("更新失败");
				});
			},

			resetEditing() {
				this.editingTaskType = null; // 重置编辑中的任务类型对象
			},
		},
		created() {
			this.fetchTaskTypes(); // 组件创建时加载任务类型
		}
	}
</script>

<style scoped>
	.content {
		padding: 20px;
	}
</style>