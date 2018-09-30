<template>
  <div class="mod-demo-echarts">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="Name" placeholder="商品名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchBrandName()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList1"
      border 
      @cell-click="logHandle"
      style="width: 100%;">
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建日期">
      </el-table-column>
      <el-table-column
        prop="flightGoTime"
        header-align="center"
        align="center"
        width="150"
        label="航班起飞日期">
      </el-table-column>
      <el-table-column
        prop="deliveryNumber"
        header-align="center"
        align="center"
        width="150"
        label="提运单号">
      </el-table-column>
      <el-table-column
        prop="voyage"
        header-align="center"
        align="center"
        label="班次">
      </el-table-column>
      <el-table-column
        prop="packageNumber"
        header-align="center"
        align="center"
        label="发出包裹数量">
      </el-table-column>
      <el-table-column
        prop="flightWeight"
        header-align="center"
        align="center"
        width="150"
        label="航空计费重量">
      </el-table-column>
      <el-table-column
        prop="packAllWeight"
        header-align="center"
        align="center"
        label="包裹实收重量">
      </el-table-column>
      <el-table-column
        prop="proportion"
        header-align="center"
        align="center"
        label="吃抛率">
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
    <Steps v-if="StepsShow" ref="Steps" @refreshData="getDataList"></Steps>
  </div>
</template>

<script>
  import Steps from '../Flight-component/Steps'
  export default {
    data () {
      return {
        active: '',
        dataList1: [],
        pageIndex: 1,
        pageSize: 20,
        totalPage: 0,
        dataListLoading: false,
        Name: '',
        StepsShow:false
      }
    },
    components: {
        Steps
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
        //  url: 'http://7ui88h.natappfree.cc/jizhangyl/flight/list',
		url: this.$http.adornUrl('flight/list'),
          method: 'get',
          params: { 
            'page': this.pageIndex,
            'size': this.pageSize || 20
          }
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList1 = data.data.list1
            this.totalPage = data.data.totalpage
            this.totalNum = data.data.totalpage
          } else {
            this.dataList1 = []
            this.totalPage = 0
            this.totalNum = 0
          }
          this.dataListLoading = false
        })
      },
      //查询功能
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
      refreshActives(val){
        this.active = val
      },
      logHandle (data,column,cell,event) {
        this.StepsShow = true
        console.log(Object.keys(data))
        this.$nextTick(() => {
          this.$refs.Steps.init(data)
        })
      },
      // 新增 / 修改
      addOrUpdateHandle () {
        this.StepsShow = true
        this.$nextTick(() => {
          this.$refs.Steps.add()
        })
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
  .steps {
      margin-top: 100px;
      margin-left: 79px
      
  }
  .true {
    color: red
  }
</style>
<style>
  img{
    width:100%;
  }
</style>
