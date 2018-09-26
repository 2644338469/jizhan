<template>
  <div class="mod-demo-echarts">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="openId" placeholder="微信openID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <div class="block">
          <span class="demonstration">月</span>
          <el-date-picker
            @change="dateChange"	
            v-model="Time"
            type="month"
            placeholder="选择月份">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchPurchase()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="expenseCalendarId"
        header-align="center"
        align="center"
        width="60"
        label="主键">
      </el-table-column>
      <el-table-column
        prop="userGrade"
        header-align="center"
        align="center"
        width="60"
        label="用户权益等级">
      </el-table-column>
      <el-table-column
        prop="salesDistribution"
        header-align="center"
        align="center"
        label="分销返点">
      </el-table-column>
      <el-table-column
        prop="expressDiscount"
        header-align="center"
        align="center"
        width="80"
        label="物流折扣">
      </el-table-column>
      <el-table-column
        prop="productDiscount"
        header-align="center"
        width="85"
        align="center"
        label="商品折扣">
      </el-table-column>
      <el-table-column
        prop="expenseSum"
        header-align="center"
        align="center"
        label="每月的消费金额">
      </el-table-column>
      <el-table-column
        prop="salesDistributionSun"
        header-align="center"
        align="center"
        label="每月返点金额">
      </el-table-column>
      <el-table-column
        prop="monthTime"
        header-align="center"
        align="center"
        width="100"
        label="日期">
      </el-table-column>
      <el-table-column
        prop="inviteCode"
        fixed="right"
        header-align="center"
        align="center"
        width="70"
        label="用户邀请码">
      </el-table-column>
      <el-table-column
        prop="downstreamPeople"
        header-align="center"
        width="85"
        align="center"
        label="本月新增下游发展人数">
      </el-table-column>
      <el-table-column
        prop="downstreamAllPeople"
        header-align="center"
        width="85"
        align="center"
        label="到本月下游发展总人数">
      </el-table-column>
      <el-table-column
        prop="downstreamSum"
        header-align="center"
        width="85"
        align="center"
        label="本月下游的销售总金额">
      </el-table-column>  
      <el-table-column
        prop="openId"
        header-align="center"
        width="70"
        align="center"
        label="微信openID">
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
  </div>
</template>

<script>
  import AddOrUpdate from './purchase-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          userName: ''
        },
        openId: '',
        Time: '',
        totalNum: 0,
        value3: true,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      //日期格式转换
      dateChange(val) {
				 if(val !== null){
         console.log(this.Time)
         this.Time = this.Time.getFullYear()+ '-' + (this.Time.getMonth() + 1);  
         console.log(this.Time)			
      }
      else{
       this.Time=''
       console.log(this.Time)
      }
      },
      //查询列表信息
      searchPurchase () {
          this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: "http://jizhangyl.natapp1.cc/jizhangyl/expense/list",
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'size': this.pageSize || 10,
            'openId':this.openId,
            'monthTime':this.Time || ''

          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.data.list
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
      handleSwitch (data) {
        console.log(data)
        if (data.checkStatus === 1) {
          return
        }
        this.$http({
          url: this.$http.adornUrl('/cert/confirm'),
          method: 'get',
          params: this.$http.adornParams({
            'id': data.id,
            'status': '1'
          })
        }).then(({data}) => {
          if (data.code === 0) {
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
      },
      handleBohui (data) {
        this.$http({
          url: this.$http.adornUrl('/cert/confirm'),
          method: 'get',
          params: this.$http.adornParams({
            'id': data.id,
            'status': '2'
          })
        }).then(({data}) => {
          if (data.code === 0) {
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
</style>
<style>
  img{
    width:100%;
  }
</style>
