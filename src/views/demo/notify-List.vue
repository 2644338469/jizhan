<template>
  <div class="mod-demo-echarts">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="expressNumber"
        header-align="center"
        align="center"
        label="物流单号">
      </el-table-column>
      <el-table-column
        prop="buyerName"
        header-align="center"
        align="center"
        width="100"
        label="买手人名">
      </el-table-column>
      <el-table-column
        prop="payTime"
        header-align="center"
        align="center"
        width="200"
        label="付款时间">
      </el-table-column>
      <el-table-column
        prop="buyerInviteCode"
        header-align="center"
        align="center"
        width="150"
        label="买手邀请码">
      </el-table-column>
      <el-table-column
        prop="buyerPhone"
        header-align="center"
        align="center"
        label="买手电话">
      </el-table-column>
      <el-table-column
        prop="lastNotifyTime"
        header-align="center"
        align="center"
        label="最近一提醒时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" :disabled="scope.row.status === false " size="small" @click="sendinfo(scope.row.orderId)">再次发送手机短信提醒</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>
<script>
  import AddOrUpdate from './shop-list-add-or-update'
  // import AddThumbanil from './thumbnail'
  export default {
    data () {
      return {
        dataForm: {
          userName: ''
        },
        Name: '',
        totalNum: 0,
        value3: true,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
        // addThumbanilVisible:false
      }
    },
    components: {
      AddOrUpdate
      // AddThumbanil
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          // url: 'http://jizhangyl.natapp1.cc/jizhangyl/shop/list',
          url: this.$http.adornUrl('/order/notifyList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'size': this.pageSize || 10
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.data
            // this.totalNum = data.data.totalpage * this.pageSize
          } else {
            this.dataList = []
            this.totalPage = 0
            this.totalNum = 0
          }
          this.dataListLoading = false
        })
      },
      sendinfo (orderId) {
          this.$http({
          // url: 'http://jizhangyl.natapp1.cc/jizhangyl/shop/list',
          url: this.$http.adornUrl('/order/orderNotify'),
          method: 'get',
          params: this.$http.adornParams({
            'orderId' : orderId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
             this.$message({
              type: 'info',
              message: '发送成功'
            })
            this.getDataList()
          } else {
             this.$message({
              type: 'danger',
              message: '发送出错'
            });
          }
        })
      }
     ,
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
    }
  }
</script>

<style lang="scss">
  .mod-demo-echarts {
    > .el-alert {
      margin-bottom: 10px;
    }
    > .el-row {
      margin-top: -10px;
      margin-bottom: -10px;
      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .chart-box {
      min-height: 400px;
    }
  }
</style>
<style>
  img{
    width:100%;
  }
</style>
