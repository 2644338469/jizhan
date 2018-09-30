<template>
  <div class="mod-demo-echarts">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchKeyword" placeholder="订单号或者供应商" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchPurchase()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;"
      @cell-click="logHandle">
      <el-table-column
        prop="createTime"
        header-align="center"
        width="95"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="orderId"
        header-align="center"
        width="160"
        align="center"
        label="采购单号">
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        header-align="center"
        width="100"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.orderStatus === 0" size="small">已下单</el-tag>
          <el-tag v-if="scope.row.orderStatus === 1" size="small">已入库</el-tag>
          <el-tag v-if="scope.row.orderStatus === 2" size="small">已打款(全额)</el-tag>
          <el-tag v-if="scope.row.orderStatus === 3" size="small">已打款(部分)</el-tag>
          <el-tag v-if="scope.row.orderStatus === 4" size="small">已取消</el-tag>
          <el-tag v-if="scope.row.orderStatus === 5" size="small">已入库(部分)</el-tag>
          <el-tag v-if="scope.row.orderStatus === 6" size="small">已确认</el-tag>
          <el-tag v-if="scope.row.orderStatus === 7" size="small">已完结</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderAmount"
        header-align="center"
        width="85"
        align="center"
        label="下单金额">
      </el-table-column>
      <el-table-column
        prop="realAmount"
        header-align="center"
        align="center"
        width="95"
        label="实收金额">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.realAmount" size="small">{{scope.row.realAmount}}</el-tag>
          <el-tag v-else size="small" type="danger">0.00</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="loanDate"
        header-align="center"
        align="center"
        width="80"
        label="贷款账期/天">
      </el-table-column>
      <el-table-column
        prop="payDate"
        header-align="center"
        align="center"
        label="付款日">
      </el-table-column>
      <el-table-column
        prop="providerName"
        header-align="center"
        align="center"
        width="100"
        label="供应商">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="340"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" id="sty" :disabled="(scope.row.orderStatus != 0 )&&(scope.row.orderStatus != 1)" round size="mini" @click="determineHandle(scope.row)">确认</el-button>
          <el-button type="primary" id="sty" :disabled="(scope.row.orderStatus === 1)||(scope.row.orderStatus === 4 )||(scope.row.orderStatus === 7 )" round size="mini" @click="rukuHandle(scope.row)">入库</el-button>
          <el-button type="primary" id="sty" :disabled="(scope.row.orderStatus === 3)||(scope.row.orderStatus === 4 )||(scope.row.orderStatus === 7 )" round size="mini" @click="paymentHandle(scope.row)">付款</el-button>
          <el-button type="primary" id="sty" :disabled="(scope.row.orderStatus === 4 )||(scope.row.orderStatus === 7 )" round size="mini" @click="OrderEnd(scope.row.orderId)">完结</el-button>
          <el-button type="info" :disabled="(scope.row.orderStatus === 0 )||(scope.row.orderStatus === 4)||(scope.row.orderStatus === 7 )" round size="mini" @click="deleteHandle(scope.row.orderId)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-size="pageSize"
      :total="totalNum"
      layout="total, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <ruku v-if="rukuVisible" ref="ruku" @refreshDataList="getDataList"></ruku>
    <payment v-if="paymentVisible" ref="payment"></payment>
    <determine v-if="determineVisble" ref="determine"></determine>
    <operation v-if="operationVisble" ref="operation"></operation>
  </div>
</template>

<script>
  import AddOrUpdate from './purchase-add-or-update'
  import Ruku from './purchase-ruku'
  import Payment from './purchase-payment'
  import Determine from './purchase-determine'
  import Operation from './purchase-operation'
  export default {
    data () {
      return {
        dataForm: {
          userName: ''
        },
        searchKeyword: '',
        query: {
          orderId: '',
          keyword: ''
        },
        totalNum: 0,
        value3: true,
        dataList: [],
        pageIndex: 1,
        pageSize: 20,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        rukuVisible: false,
        paymentVisible: false,
        determineVisble: false,
        operationVisble: false
      }
    },
    components: {
      AddOrUpdate,
      Ruku,
      Payment,
      Determine,
      Operation
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/purchase/order/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'size': this.pageSize || 20
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.data.data
            this.totalPage = data.data.totalPage
            this.totalNum = data.data.totalPage * this.pageSize
          } else {
            this.dataList = []
            this.totalPage = 0
            this.totalNum = 0
          }
          this.dataListLoading = false
        })
      },
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      //确认弹出
      determineHandle (id) {
        this.determineVisble = true
        this.$nextTick(() => {
          this.$refs.determine.init(id)
        })
      },
      //入库弹出
      rukuHandle (id) {
        this.rukuVisible = true
        this.$nextTick(() => {
          this.$refs.ruku.init(id)
        })
      },
      //付款弹出
      paymentHandle (id) {
        this.paymentVisible = true
        this.$nextTick(() => {
          this.$refs.payment.init(id)
        })
      },
      //完结订单
      OrderEnd (id) {
        console.log(id);
        this.$confirm('此操作将完结采购单号为:'+id+', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/purchase/order/finish'),
            method: 'get',
            params: this.$http.adornParams({
              'orderId': id
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
         })
        }).catch(() => {});
      },
      // 删除
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/purchase/order/cancel'),
            method: 'get',
            params: this.$http.adornParams({
              'orderId': userIds[0]
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      //查看凭证编辑
      logHandle (data,column,cell,event) {
        console.log("页面传值");
        console.log(data);
        if(column.label !== "操作"){
          this.operationVisble = true
          this.$nextTick(() => {
            this.$refs.operation.init(data)
          })
        }
      },
      isNumber (val) {
        var regPos = /^\d+(\.\d+)?$/
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/
        if (regPos.test(val) || regNeg.test(val)) {
          return true
        } else {
          return false
        }
      },
      searchPurchase () {
        this.dataListLoading = true
        if (this.searchKeyword.length > 0) {
          if (this.searchKeyword.length === 19 && this.isNumber(this.searchKeyword)) {
            this.query.orderId = this.searchKeyword
            this.query.keyword = ''
            this.pageIndex = 1
          } else {
            this.query.orderId = ''
            this.query.keyword = this.searchKeyword
            this.pageIndex = 1
          }
          this.$http({
            url: this.$http.adornUrl('/purchase/order/findByOrderIdOrProviderName'),
            method: 'get',
            params: this.$http.adornParams({
              'orderId': this.query.orderId,
              'providerName': this.query.keyword,
              'page': this.pageIndex,
              'size': this.pageSize || 10
            })
          }).then(({data}) => {
            console.log(data)
            this.dataList = []
            if (data && data.code === 0) {
              this.isNumber(this.searchKeyword) ? this.dataList.push(data.data.data) : this.dataList = data.data.data
              this.totalPage = data.data.totalPage
              this.totalNum = data.data.totalPage * this.pageSize
            } else {
              this.dataList = []
              this.totalPage = 0
              this.totalNum = 0
            }
            console.log(this.dataList)
            this.dataListLoading = false
          })
        } else {
          console.log('进入getData')
          this.getDataList()
        }
      }
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
  .el-button--mini, .el-button--mini.is-round {
    padding: 7px 10px;
  }
  img{
    width:100%;
  }
  #sty {
    color: #fff;
    background-color: #ff3030;
    border-color: #ff3030;
  }
  #sty.is-disabled, #sty.is-disabled:active, #sty.is-disabled:focus, #sty.is-disabled:hover {
    color: #fff;
    background-color: #17B3A3;
    border-color: #17B3A3;
  }
  .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: 3px;
  }
</style>