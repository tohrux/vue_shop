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
            {{scope.row.create_time | dateFormat}}
        </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="width">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.order_id)" >编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-setting" @click="showProgressDialog(scope.row.order_id)"></el-button>
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
    <el-dialog
      title="编辑"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed">
      <div>
        <el-form ref="editFormRef" :model="editForm" label-width="">
          <el-form-item label="省市区/县">
              <el-cascader
                :options="cityData"
                v-model="selectedList"
                @change="handleChange">
              </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="editForm.address" ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--  -->
    <el-dialog
      title="物流信息"
      :visible.sync="progressDialogVisible"
      width="width"
      >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <div slot="footer">
        <el-button @click="progressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data () {
    return {
      progressInfo: [],
      progressDialogVisible: false,
      selectedList: [],
      editDialogVisible: false,
      orderList: [],
      total: 0,
      input1: '222',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      editForm: {
        address: ''
      },
      cityData

    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
      this.selectedList = []
    },
    handleChange () {
      console.log(this.selectedList)
    },
    async showEditDialog (id) {
      this.editDialogVisible = true
    },
    async showProgressDialog (id) {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) {
        return this.$message.error('err')
      }
      this.progressInfo = res.data
      this.progressDialogVisible = true
      console.log(this.progressInfo)
    },
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
  .el-cascader{
    width: 100%;
  }
</style>
