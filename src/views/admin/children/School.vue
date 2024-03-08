<template>
  <div class="content">
    <el-button @click="handleAddSchool" type="primary">添加学校</el-button>
    <el-button @click="handleAddDept" type="primary">添加分院</el-button>
    <el-button @click="handleAddClass" type="primary">添加专业</el-button>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学校名称"
                      v-if="dialogType === 'school' || dialogType === 'dept' || dialogType === 'class'">
          <el-select v-model="form.schoolId" filterable placeholder="请选择学校"
                     v-if="dialogType === 'dept' || dialogType === 'class'" @change="fetchDepts(form.schoolId)">
            <el-option v-for="school in schools" :key="school.id" :label="school.name" :value="school.id"></el-option>
          </el-select>
          <el-input v-model="form.name" placeholder="请输入学校名称" v-if="dialogType === 'school'"></el-input>
        </el-form-item>
        <el-form-item label="分院名称" v-if=" dialogType === 'dept' || dialogType === 'class'">
          <el-select v-model="form.deptId" filterable placeholder="请选择分院" v-if="dialogType === 'class'">
            <el-option v-for="dept in deptBySchool" :key="dept.id" :label="dept.name" :value="dept.id"></el-option>
          </el-select>
          <el-input v-model="form.name" placeholder="请输入分院名称" v-if="dialogType === 'dept'"></el-input>
        </el-form-item>
        <el-form-item label="专业名称" v-if="dialogType === 'class'">
          <el-input v-model="form.name" placeholder="请输入专业名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </span>
    </el-dialog>
    <el-table :data="dataList" style="width: 100%;margin-bottom: 20px;" row-key="uuid" border
              :default-expand-all='false' :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="name" label="学校" sortable width="230">
      </el-table-column>
      <el-table-column prop="deptname" label="分院" sortable width="180">
      </el-table-column>
      <el-table-column prop="classesname" label="专业">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" @click="handleUpdate(scope.$index, scope.row)">修改
          </el-button>
          <el-button icon="el-icon-delete" size="mini" type="danger"
                     @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "SchoolManagement",
  data() {
    return {
      schools: [],
      depts: [],
      deptBySchool: ["请选择学校"],
      dialogVisible: false,
      dialogTitle: '',
      dialogType: '', // 'school', 'dept', 'class'
      form: {
        schoolId: '',
        deptId: '',
        name: ''
      },
      rules: {
        name: [{required: true, message: '请输入名称', trigger: 'blur'}]
      },
      a: '',
    };
  },
  methods: {
    guid2() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }

      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    fetchSchools() {
      this.$get('/school').then(response => {
        this.schools = response.data.school;
      });
      this.a = '';
    },
    fetchDepts(id) {
      this.$get('/dept/school/' + id).then(response => {
        this.deptBySchool = response.data.dept;
      });
    },
    handleAddSchool() {
      this.dialogType = 'school';
      this.dialogTitle = '添加学校';
      this.form = {name: ''};
      this.dialogVisible = true;
      this.a = 'school';
    },
    handleAddDept() {
      this.dialogType = 'dept';
      this.dialogTitle = '添加分院';
      this.form = {schoolId: '', name: ''};
      this.dialogVisible = true;
      this.fetchSchools();
      this.a = 'dept';
    },
    handleAddClass() {
      this.dialogType = 'class';
      this.dialogTitle = '添加专业';
      this.form = {schoolId: '', deptId: '', name: ''};
      this.dialogVisible = true;
      this.a = 'class';
    },
    submitForm() {
      this.dialogVisible = false;
      if (this.a === "school") {
        this.$post('/school', this.form).then(
            res => {
              this.$notifyMsg("成功", res.data.msg, "success")
              this.fetchSchools();
            }
        );
      } else if (this.a === "dept") {
        this.$post('/dept', this.form).then(
            res => {
              this.$notifyMsg("成功", res.data.msg, "success")
              this.fetchSchools();
            }
        );
      } else if (this.a === "class") {
        this.$post('/class', this.form).then(
            res => {
              this.$notifyMsg("成功", res.data.msg, "success")
              this.fetchSchools();
            }
        );
      }

      console.log('Submitted:', this.dialogType, this.form);
      this.form = {schoolId: '', deptId: '', name: ''};
    },
    handleDelete(a, b) {
      console.log(b);
      if (b.schoolId != null) {
        this.$del("/school/" + b.schoolId)
            .then((res) => {
              this.$notifyMsg("成功", res.data.msg, "success")
              this.fetchSchools();
            })
      } else if (b.deptsId != null) {
        this.$del("/dept/" + b.deptsId)
            .then((res) => {
              this.$notifyMsg("成功", res.data.msg, "success")
              this.fetchSchools();
            })
      } else {
        this.$del("/class/" + b.classesId)
            .then((res) => {
              this.$notifyMsg("成功", res.data.msg, "success")
              this.fetchSchools();
            })
      }
    },
  },
  created() {
    this.fetchSchools();
  },
  computed: {
    dataList() {
      return this.schools.map(item => {
        let depts = [];
        for (let i = 0; i < item['depts'].length; i++) {
          // console.log(item['depts'][i]['classes'])
          depts.push({
            deptsId: item['depts'][i].id,
            deptname: item['depts'][i].name,
            uuid: this.guid2()
          })
          // console.log(depts)
          let children = [];
          for (let j = 0; j < item['depts'][i]['classes'].length; j++) {
            children.push({
              classesId: item['depts'][i]['classes'][j].id,
              classesname: item['depts'][i]['classes'][j].name,
              uuid: this.guid2()
            })
          }
          depts[i].children = children
        }
        return {
          schoolId: item.id,
          name: item.name,
          children: depts,
          uuid: this.guid2()
        }
      })
    }
  }
}
</script>

<style scoped>
.content {
  padding: 0 1%;
}

.dialog-footer {
  text-align: right;
}
</style>
