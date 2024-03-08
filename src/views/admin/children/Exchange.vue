<template>
	<div class="exchange-management">
		<el-table :data="exchangeRecords" style="width: 100%">
			<el-table-column prop="id" label="记录ID" width="120"></el-table-column>
			<el-table-column prop="product.name" label="商品名称" width="180"></el-table-column>
			<el-table-column prop="name" label="收货人姓名" width="180"></el-table-column>
			<el-table-column prop="address" label="收货地址"></el-table-column>
			<el-table-column prop="phone" label="联系电话" width="180"></el-table-column>
			<el-table-column prop="exchangeTime" label="兑换时间" width="180">
				<template v-slot:default="scope">
					{{ scope.row.exchangeTime | formatDate }}
				</template>
			</el-table-column>
			<el-table-column label="状态" width="120">
				<template v-slot:default="scope">
					<el-tag :type="scope.row.state === 0 ? 'warning' : 'success'">
						{{ scope.row.state === 0 ? '待发货' : '已发货' }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="120">
				<template v-slot:default="scope">
					<el-button @click="ship(scope.row)" type="primary" size="small"
						v-if="scope.row.state === 0">发货</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import {
		formatDate
	} from '@/util/date'; // 假设你有这个工具函数

	export default {
		name: "ExchangeManagement",
		data() {
			return {
				exchangeRecords: [],
			};
		},
		methods: {
			fetchExchangeRecords() {
				this.$get('/exchange').then(response => {
					this.exchangeRecords = response.data.exchangeRecord;
				}).catch(error => {
					console.error("获取交换记录失败:", error);
				});
			},
			ship(record) {
				this.$put(`/exchange/ship`, {
					id: record.id,
					state: 1
				}).then(response => {
					if (response.data.status) {
						this.$message.success('发货成功');
						this.fetchExchangeRecords(); // 刷新列表
					} else {
						this.$message.error('发货失败');
					}
				}).catch(error => {
					console.error("发货失败:", error);
					this.$message.error('发货失败');
				});
			}
		},
		created() {
			this.fetchExchangeRecords();
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
	.exchange-management {
		padding: 20px;
	}
</style>