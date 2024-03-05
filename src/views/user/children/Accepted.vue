<template>
	<div class="content">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>接受任务</span>
			</div>

			<el-card class="box-card" style="margin-top: 20px" v-for="item in tasks">
				<div slot="header" class="clearfix"
					style="display: flex; align-items: center; justify-content: space-between">
					<span style="display: flex;align-items: center">
						<el-tag :type="item.state ==0 ? 'danger':item.state == 1 ? 'danger':(item.state == 2 ? 'warning':'success')"
							style="margin-right: 5px">{{item.state == 0 ? '审核中': item.state == 1 ? '待解决' :(item.state == 2 ? '服务中':'已完成')}}</el-tag>
						{{item.taskTitle}}
					</span>
					<!--                    <el-button style="float: right; padding: 3px 0" type="text">查看接受人信息</el-button>-->
					<template>
						<el-popconfirm title="确定取消任务吗" @confirm="del(item.id)">
							<el-button style="float: right; padding: 3px 0" type="text" slot="reference"
								v-show="item.state != 3">取消任务
							</el-button>
						</el-popconfirm>
					</template>
				</div>
				<div>
					{{item.taskContext}}
				</div>
				<el-collapse style="margin-top: 20px" v-model="activeNames">
					<el-collapse-item title="发布人信息" name="1">
						<el-card class="box-card">

							<div slot="header" class="clearfix">
								<span>{{item.publish.username}}</span>
								<el-button style="float: right; padding: 3px 0" type="text">投诉</el-button>
							</div>

							<div class="box_center">
								<table cellspacing="0">
									<tr>
										<th>电话</th>
										<th>学校</th>
										<th>所在系</th>
										<th>所在班级</th>
										<th>任务奖励</th>
										<th>接受任务时间</th>
									</tr>
									<tr align="center">
										<td>{{item.publish.phone}}</td>
										<td>{{item.publish.school.name}}</td>
										<td>{{item.publish.dept.name}}</td>
										<td>{{item.publish.aclass.name}}</td>
										<td>
											<p><i class="el-icon-money" style="color: red;">{{item.reward}}元</i></p>
											<p><i class="el-icon-money" style="color: red;">{{item.coin}}积分</i></p>
										</td>
										<td>{{item.orderTime | formatDate}}</td>
									</tr>
								</table>
							</div>
						</el-card>

					</el-collapse-item>
					<el-collapse-item title="查看报酬" name="2" v-if="item.state == 3">
						<el-card class="box-card">
							<div>
								<p>实收款：<i class="el-icon-money" style="color: red;">{{item.reward}}元</i></p>
								<p>积分：<i class="el-icon-money" style="color: red;">{{item.coin}}元</i></p>
								<p>到账时间：{{item.endTime | formatDate}}</p>
							</div>
						</el-card>
					</el-collapse-item>
				</el-collapse>
			</el-card>

			<div style="text-align: center">
				<span v-if="tasks.length == 0"><i class="el-icon-refresh-right"></i>暂无发布任务</span>
			</div>

		</el-card>
	</div>
</template>

<script>
	import {
		mapState
	} from "vuex";
	import {
		formatDate
	} from '@/util/date';
	import user from "@s/store/module/user";

	export default {
		name: "Accepted",
		data() {
			return {
				activeNames: ['1'],
				tasks: [],
				// drawer:false,
			};
		},
		computed: {
			...mapState('user', ['user'])
		},
		created() {
			this.newList()
		},
		methods: {
			del(id) {
				this.$put('/task/takerCancel/' + id)
					.then(res => {
						this.$notifyMsg('成功', '取消任务成功', 'success')
						this.newList()
					})
			},
			newList() {
				this.$get("/task/accepted", {
						id: this.user.id
					})
					.then(res => {
						this.tasks = res.data.task
						// console.log(this.tasks)
					})
			}
		},
		filters: {
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm');
			}
		}
	}
</script>

<style scoped lang="less">
	.content {
		background: #FFf;
		margin: 0 15px;
		padding: 15px;

		.box_center table {
			margin: 0 auto;
			width: 100%;
			border-top: 1px solid #ebeef5;
			border-left: 1px solid #ebeef5;
		}

		.box_center th,
		td {
			padding: 15px 20px;
			border-right: 1px solid #ebeef5;
			border-bottom: 1px solid #ebeef5;
		}
	}
</style>