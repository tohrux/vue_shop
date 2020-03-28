<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click='getUserList' @clear='getUserList'></el-button>
          </el-input>
        </el-col>
        <!-- 搜索和添加区域 -->
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
      stripe
      border
        :data="userlist"
        style="width: 100%">
        <el-table-column
        label="#"
          type="index" >
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="width">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="mobile number"
          width="width">
        </el-table-column>
        <el-table-column
          prop="email"
          label="email"
          width="width">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="role_name"
          width="width">
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="state"
          width="width">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change='userStateChanged(scope.row)'>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="operation"
          width="247">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" @click='showEditDialog(scope.row.id)'></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
            <!-- 设置按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1,2,3,4]"
          :page-size="queryInfo.pagesize"
          layout="total,sizes,prev, pager, next"
          :total="total"
          >
        </el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
         <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
         <el-form-item label="手机" prop="mobileNum">
          <el-input v-model="addForm.mobileNum"></el-input>
        </el-form-item>
      </el-form>
      <!-- 内容底部区 -->
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="addUsers" type="primary">确 定</el-button>
      </div>
    </el-dialog>
<!-- 修改用户信息的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
      >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="width"
      @close ="setRoleClosed"
      >
      <div>
        <p>当前的用户: {{userInfo.username}} </p>
        <p>当前的角色: {{userInfo.role_name}} </p>
        <p>分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>

        </p>
      </div>

      <div slot="footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) { return cb() }
      cb(new Error('请输入合法的邮箱地址'))
    }
    return {
      setRoleDialogVisible: false,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      userInfo: {},
      roleList: [],
      selectedRoleId: '',
      total: 0,
      dialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobileNum: ''
      },
      // 添加用户的验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur' }

        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码的长度在6~20个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobileNum: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]

      },
      // 修改表单的验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, message: '邮箱格式不合法', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示和隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {}

    }
  },

  created () {
    this.getUserList()
  },
  methods: {
    setRoleClosed () {
      this.selectedRoleId = ''
      this.userInfo = {}
      this.roleList = []
    },
    async saveRoleInfo () {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择值!')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) {
        console.log(res)
        return this.$message.error('发生错误')
      }
      this.$message.success('修改成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    async setRole (info) {
      this.userInfo = info
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
      this.setRoleDialogVisible = true
    },
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    addUsers () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('上传用户数据失败')
        }
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.$message.success('查询用户信息成功')

      this.editDialogVisible = true
    },
    // 修改用户信息预验证
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          this.$message.error('更新用户信息失败')
        }
        this.getUserList()
        this.editDialogVisible = false
        this.$message.success('更新用户信息成功')
      })
    },
    // 删除按钮上的方法
    async removeUserById (id) {
      const res = await this.$confirm('此操作将永久删除该用户,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') {
        return this.$message.info('已经取消')
      }
      const { data: Dres } = await this.$http.delete('users/' + id)
      if (Dres.meta.status !== 200) {
        return this.$message.error('删除用户失败!')
      }
      this.$message.success('删除成功')
      this.getUserList()
    }

  }
}

</script>
<style lang="less" scoped>
</style>
