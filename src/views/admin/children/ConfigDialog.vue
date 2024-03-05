<template>
  <el-dialog :visible.sync="dialogVisible" title="配置项" @close="resetForm">
    <el-form :model="form" ref="configForm">
      <el-form-item label="配置键（Key）" :label-width="formLabelWidth">
        <el-input v-model="form.key" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="配置值（Value）" :label-width="formLabelWidth">
        <el-input v-model="form.value" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ConfigDialog',
  data() {
    return {
      dialogVisible: false,
      form: {
        key: '',
        value: ''
      },
      formLabelWidth: '120px'
    };
  },
  methods: {
    open(config) {
      if (config) {
        this.form.key = config.key;
        this.form.value = config.value;
      } else {
        this.resetForm();
      }
      this.dialogVisible = true;
    },
    resetForm() {
      this.form.key = '';
      this.form.value = '';
    },
    submitForm() {
      this.$put("/config", {
		  "key": this.form.key,
		  "value": this.form.value
	  }).then(() => {
          this.$emit('refresh');
          this.$message.success('操作成功');
          this.dialogVisible = false;
        })
        .catch(error => {
          console.error('操作失败:', error);
          this.$message.error('操作失败');
        });
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
