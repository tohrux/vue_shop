/* eslint-disable no-useless-return */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
      class="treeTable"
      :data="cateList"
      :columns="columns"
      :selection-type='false'
      :expand-type='false'
      show-index
      index-text = "#"
      :show-row-hover='false'

      >
      <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
      <!-- 排序 -->
      <template slot="order" slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.cat_level===0" >一级</el-tag>
        <el-tag size="mini" v-else-if="scope.row.cat_level===1" type="warning">二级</el-tag>
        <el-tag size="mini" v-else type="success">三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot="operation" slot-scope="">
        <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
      </template>
      </tree-table>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close= "addCateClosed"
      >
    <!-- 添加分类的表单 -->
      <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules"  label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            :options="ParentCateList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChanged"
            expand-trigger="hover"
            change-on-select
            clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      ParentCateList: [],
      // 查寻条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        type: 'template',
        template: 'isok'
      }, {
        label: '排序',
        type: 'template',
        template: 'order'
      }, {
        label: '操作',
        type: 'template',
        template: 'operation'
      }]
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    addCateClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },

    addCateConfirm () {
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          console.log(res)
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.addCateDialogVisible = false
        this.getCateList()
      })
    },
    parentCateChanged () {
      if (this.selectedKeys.length > 0) {
        // 父级分类的值
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类列表失败')
      }
      this.ParentCateList = res.data
    },
    // 添加分类按钮;
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { param: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('分类商品列表获取失败')
      }
      this.cateList = res.data.slice(0, 5)

      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped>
  .treeTable{
    margin-top: 10px;
  }
</style>
