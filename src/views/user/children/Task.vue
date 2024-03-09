<template>
  <div class="content">
    <el-alert title="发布新任务" :closable="false" type="info">
    </el-alert>
    <el-card class="box-card card">
      <div slot="header" class="clearfix">
        <span>发布任务</span>
        <el-button style="float: right; padding: 3px 0;font-size: 16px" icon="el-icon-s-promotion" type="text"
                   @click="submitTask">发布
        </el-button>
      </div>
      <div class="input">
        <div class="append">任务标题</div>
        <el-input placeholder="请输入任务标题" v-model="taskTitle"></el-input>
      </div>
      <div class="input">
        <div class="append">奖励</div>
        <el-input placeholder="请输入奖励" v-model="reward" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        <div class="append" style="border-right: 1px solid #DCDFE6;border-left: none;">余额：{{ user.balance }}元
        </div>
      </div>
      <div class="input">
        <div class="append">任务类型</div>
        <el-select class="append-max" v-model="selectedTaskType" placeholder="请选择任务类型">
          <el-option v-for="item in taskTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="input">
        <div class="append">任务图片</div>
        <div class="append-min" v-if="this.image">
          <img :src="this.image" style="height: 100%;">
        </div>
        <el-upload class="avatar-uploader append-min" :action="uploadUrl" :before-upload="beforeImageUpload"
                   :on-success="handleSuccess" :http-request="uploadImage" :show-file-list="false">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>详细描述</span>
        </div>
        <el-input resize="none" type="textarea" :autosize="{ minRows: 6, maxRows: 10}" placeholder="请输入内容"
                  v-model="taskContext" style="padding: 0">
        </el-input>
      </el-card>
    </el-card>
    <el-drawer title="任务信息" :visible.sync="drawer" direction="rtl" :before-close="renew">
      <div class="content_drawer">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>发布内容</span>
          </div>
          <el-collapse v-model="activeNames">
            <el-collapse-item title="任务标题" name="1">
              <div>{{ taskTitle }}</div>
            </el-collapse-item>
            <el-collapse-item title="任务内容" name="2">
              <div>{{ taskContext }}</div>
            </el-collapse-item>
            <el-collapse-item title="任务奖励" name="3">
              <div><i class="el-icon-money" style="color: red;"> {{ reward }}元</i></div>
              <!-- <div><i class="el-icon-coin" style="color: red;"> {{coin}}积分</i></div> -->
            </el-collapse-item>
            <el-collapse-item title="发布时间" name="4">
              <div>{{ createTime | formatDate }}</div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import axios from "axios";
import {formatDate} from '@/util/date';

export default {
  name: "Task",
  data() {
    return {
      // 任务奖励
      reward: "",
      // 任务标题
      taskTitle: "",
      // 任务内容
      taskContext: "",
      // 选中的任务类型ID
      selectedTaskType: null,
      // 所有任务类型
      taskTypes: [],
      // 发布时间
      createTime: "",
      // 零钱
      balance: 0,
      // 是否弹出抽屉
      drawer: false,
      image: null,
      activeNames: ['1', '2', '3', '4'],
      uploadUrl: "http://localhost:8080/upload",
    }
  },

  computed: {
    ...mapState("user", ['user'])
  },

  methods: {
    ...mapMutations('user', ['setUser']),

    submitTask() {
      // console.log(this.image)
      if (this.taskTitle && this.reward > 0 && this.taskContext && this.selectedTaskType !== null) {
        this.$post("/task", {
          "publishId": this.user.id,
          "schoolId": this.user.school.id,
          "reward": this.reward,
          "taskTitle": this.taskTitle,
          "taskContext": this.taskContext,
          "taskTypeId": this.selectedTaskType,
          "image": this.image
        }).then(res => {
          if (res.data.status) {
            this.createTime = new Date().getTime()
            this.drawer = true;
            this.$msg(res.data.msg, "success")
          } else {
            this.$msg(res.data.msg, "error")
          }
        });
      } else {
        this.$message.error("请正确填写所有信息");
      }
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
    renew() {
      this.$get("/taskType").then(res => {
        this.taskTypes = res.data.taskType;
      });
      this.$get("/user/" + this.user.id)
          .then(response => {
            sessionStorage.setItem('user', JSON.stringify(response.data.user))
            this.setUser(JSON.parse(sessionStorage.getItem('user')))
          });
      this.image = null;
      this.reward = "";
      this.taskTitle = "";
      this.taskContext = "";
      this.selectedTaskType = null;
      this.drawer = false;
    },
  },

  created() {
    this.renew();
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

  .card {
    margin-top: 20px;

    .input {
      margin-top: 10px;

      width: 100%;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .append {
        border: 1px solid #DCDFE6;
        width: 20%;
        font-size: 14px;
        line-height: 40px;
        height: 100%;
        text-align: center;
      }

      .append-max {
        width: 80%;
        font-size: 14px;
        line-height: 40px;
        height: 100%;
        text-align: center;
      }

      .append-min {
        width: 40%;
        font-size: 14px;
        line-height: 40px;
        height: 100%;
        text-align: center;
      }


      .select {
        flex: 1;
      }

      /deep/ .el-input {
        flex: 1;
      }
    }

    .box-card {

      /deep/ .el-textarea__inner {
        font-family: '微软雅黑' !important;
      }

      margin-top: 10px;

      /deep/ .el-card__header {
        border-bottom: none;
      }

      /deep/ .el-card__body {
        padding: 0 !important;
      }
    }
  }

  .content_drawer {
    padding: 0 20px;

    p {
      margin: 10px 0;
    }

    span {
      font-size: 14px;
    }
  }

}

.avatar-uploader .el-upload {
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