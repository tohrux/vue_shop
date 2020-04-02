<template>
  <div>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false">
      </el-alert>

      <!-- STEP -->

    <el-steps :active="activeIndex - 0" finish-status="success" :space="150" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <!-- TAB -->

  <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules" label-position="top">

  <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
    <el-tab-pane label="基本信息" name="0">基本信息
      <el-form-item label="商品名称" prop="goods_name">
        <el-input v-model="addForm.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="goods_price">
        <el-input v-model="addForm.goods_price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="goods_weight">
        <el-input v-model="addForm.goods_weight" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_number">
        <el-input v-model="addForm.goods_number" type="number"></el-input>
      </el-form-item>

  <!-- cascader -->
      <el-form-item label="商品分类" prop="good_cat">
        <el-cascader
          expand-trigger="hover"
          :props="cateProps"
          :options="cateList"
          v-model="addForm.goods_cat"
          @change="handleChange">
        </el-cascader>
      </el-form-item>
    </el-tab-pane>
<!-- 1 -->
    <el-tab-pane label="商品参数" name="1">
      <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
        <el-checkbox-group v-model="item.attr_vals">
          <el-checkbox :label="cb" :key="i" v-for="(cb,i) in item.attr_vals" border></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-tab-pane>
<!-- 2 -->
    <el-tab-pane label="商品属性" name="2">
      <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
        <el-input v-model="item.attr_vals"></el-input>
      </el-form-item>
    </el-tab-pane>
<!-- 3 -->
    <el-tab-pane label="商品图片" name="3">
      <el-upload
        action="http://127.0.0.1:8888/api/private/v1/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        list-type="picture"
        :headers="headerObj"
        :on-success="handleSuccess"
        >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-tab-pane>
<!-- 4 -->
    <el-tab-pane label="商品内容" name="4">
      <quill-editor v-model="addForm.goods_introduce"></quill-editor>
      <el-button type="primary" @click="add">添加商品</el-button>
    </el-tab-pane>
  </el-tabs>

  </el-form>
    </el-card>
    <el-dialog
      title="图片预览"
      :visible.sync="PreviewDialogVisible"
      width="width">
      <img :src="previewPath" alt="" class="preview">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      PreviewDialogVisible: false,
      previewPath: '',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      onlyTableData: [],
      manyTableData: [],

      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      cateList: [],
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []

      },
      addFormRules: {
        goods_cat: [
          { required: true, message: '请输入一些文字!', trigger: 'blur' }
        ],
        goods_name: [
          { required: true, message: '请输入一些文字!', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入一些文字!', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入一些文字!', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入一些文字!', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    add () {
      this.$refs.addFormRef.validate(
        async valid => {
          if (!valid) {
            return this.$message.error('请填写完整的信息')
          }
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(',')
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
          })
          this.onlyTableData.forEach(item => {
            const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
            this.addForm.attrs.push(newInfo)
          })
          form.attrs = this.addForm.attrs
          console.log(form)

          const { data: res } = await this.$http.post('goods', form)
          if (res.meta.status !== 201) {
            return this.$message.error('error')
          }
          this.$message.success('添加商品成功')
          this.$router.push('/goods')
        }
      )
    },
    handleSuccess (response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm.pics)
    },
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.PreviewDialogVisible = true
    },
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm.pics)
    },
    async tabClicked () {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) {
          console.log(res)
          return this.$message.error('error')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
        console.log(this.manyTableData)
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('error')
        }
        // res.data.forEach(item => {
        //   item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        // })
        this.onlyTableData = res.data
      }
    },
    beforeTabLeave (activeName, OldActiveName) {
      if (OldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请填写分类~pls')
        return false
      }
      // if (OldActiveName === '0' && this.$refs.addFormRef.validate(valid => valid)) {
      //   this.$message.error('请完善表单内容~pls')
      //   return false
      // }
    },
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('error')
      }
      this.cateList = res.data
      // console.log(this.cateList)
    },
    handleChange () {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }

}
</script>

<style lang="less" scoped>
.ql-editor{
  min-height: 300px;
}
.preview{
  width: 100%;
}
.el-steps{
  margin: 15px 0;
  display: flex;
  justify-content: center;
}
.el-steps_title{
  font-size: 13px;
}
.el-checkbox{
  margin: 0 5px 0 0 !important;
}

</style>
