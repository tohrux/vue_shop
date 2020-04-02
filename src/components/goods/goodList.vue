<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card>
      <!-- 搜索行 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getGoodsList">
            <el-button type="primary" slot="append" icon="el-icon-search" @click="handleCurrentChange(1);getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- tab表单区域 -->
      <el-table
        :data="goodList"
        style="width: 100%"
        border
        stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column width="90px" label="商品价格(元)" prop="goods_price"></el-table-column>
        <el-table-column width="90px" label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column width="155px" label="创建时间" prop="add_time">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="operation" width="200px">

          <!-- 操作按钮 -->
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">edit</el-button>
            <el-button type="primary" size="mini" icon="el-icon-delete" @click="removeById(scope.row.goods_id)">delete</el-button>
          </template>

        </el-table-column>

      </el-table>
    </el-card>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 50]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      total: 0,
      goodList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    goAddpage () {
      this.$router.push('/goods/add')
    },
    async removeById (id) {
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        console.log(res)
        return this.$message.error('error')
      }
      this.$message.success('success')
      this.getGoodsList()
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodsList()
    },
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('error')
      }
      this.goodList = res.data.goods
      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped>
  .el-pagination{
    margin-top: 5px;
  }
</style>
