<template>
  <div>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input v-model="queryInfo.query" placeholder="请输入内容">
            <el-button type="primary" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12"></el-col>
      </el-row>
      <el-table
        :data="orderList"
        style="width: 100%">
        <!-- <el-table-column type="index" label="#"></el-table-column> -->
        <el-table-column
          prop="order_id"
          label="订单id"
          width="100">
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单号"
          width="width">
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格($)"
          width="width">
        </el-table-column>
        <el-table-column
          label="是否付款"
          width="width">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status===1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="width">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="下单时间"
          width="width">
        <template slot-scope="scope">
            {{scope.row.create_time | timeFormat}}
        </template>
        </el-table-column>
      </el-table>
    </el-card>
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
      orderList: [],
      total: 0,
      input1: '222',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      }
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrderList()
    },
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrderList()
    },

    async getOrderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('error')
      }
      console.log(res)
      this.total = res.data.total
      this.orderList = res.data.goods
    }
  }
}
</script>

<style lang="less" scoped>

</style>
