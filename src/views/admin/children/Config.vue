<template>
  <div class="config-management">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input v-model="searchKey" placeholder="请输入配置键名进行搜索"
                  @keyup.enter.native="fetchConfigs"></el-input>
      </el-col>
      <el-col :span="10">
        <el-button type="primary" icon="el-icon-search" @click="fetchConfigs">搜索</el-button>
      </el-col>
    </el-row>
    <el-table :data="configs" style="width: 100%" v-loading="loading">
      <el-table-column prop="key" label="配置键（Key）"></el-table-column>
      <el-table-column prop="value" label="配置值（Value）"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑对话框组件 -->
    <config-dialog ref="configDialog" @refresh="fetchConfigs"></config-dialog>
  </div>
</template>
<script>
import ConfigDialog from './ConfigDialog';

export default {
  name: "Config",
  components: {
    ConfigDialog
  },
  data() {
    return {
      searchKey: '',
      configs: [],
      loading: false
    };
  },
  methods: {
    fetchConfigs() {
      this.loading = true;
      // Include the searchKey in the request as a query parameter
      this.$get(`/config`)
          .then(res => {
            this.configs = res.data.configs;
            this.loading = false;
          })
          .catch(error => {
            console.error('配置信息加载失败:', error);
            this.$message.error('配置信息加载失败');
            this.loading = false;
          });
    },
    showEditDialog(config = null) {
      this.$refs.configDialog.open(config); // Pass the config item to the dialog, null for a new item
    },
  },
  created() {
    this.fetchConfigs();
  }
}
</script>

<style scoped>
.config-management {
  margin: 20px;
}
</style>
