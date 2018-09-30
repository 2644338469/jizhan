<template>
	<div class="mod-demo-echarts">
    <el-row :gutter="20">
      <el-col :span="20">
        <el-form :inline="true" :model="dataForm">
          <el-form-item>
            <el-input v-model="searchKeyword" placeholder="商品名称Jcode仓库打包识别码搜索" clearable></el-input>
          </el-form-item>
          <el-form-item>
	         <template>
              <el-select v-model="orderStatus" filterable placeholder="请选择">
                  <el-option
                      v-for="item in status"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item>
            <el-button @click="search()">查询</el-button>
            <el-button type="success" @click="getExport()">导出</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" style="text-align: right;">
        <el-button type="primary" icon="el-icon-refresh" @click="refresh()"></el-button>
      </el-col>
    </el-row>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
			<el-table-column
        prop="productImage"
        header-align="center"
				width="90"
        align="center"
        label="商品图片">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.productImage" style="height:50px;width:50px" />
        </template>
      </el-table-column>
      <el-table-column
        prop="packCode"
        header-align="center"
        align="center"
        width="100"
        label="打包识别码">
      </el-table-column>
      <el-table-column
        prop="productJancode"
        header-align="center"
				width="130"
        align="center"
        label="商品Jan Code">
      </el-table-column>
      <el-table-column
        prop="productName"
        header-align="center"
        align="center"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="productStock"
        header-align="center"
        align="center"
        width="85"
        label="当前库存">
      </el-table-column>
      <el-table-column
        prop="todoOutNum"
        header-align="center"
        align="center"
        width="95"
        label="即将出库数(已付款未打包)">
      </el-table-column>
      <el-table-column
        prop="wayStock"
        header-align="center"
        align="center"
        width="80"
        label="在途库存">
      </el-table-column>
      <el-table-column
        prop="yestOutNum"
        header-align="center"
        align="center"
				width="100"
        label="昨日出库数">
      </el-table-column>
      <el-table-column
        prop="weekOutNum"
        header-align="center"
        align="center"
        width="130"
        label="过去7天平均日出库数">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="100"
        label="出库记录">
        <template slot-scope="scope">
          <el-button type="primary" round size="mini"  @click="goto(scope.row.productId)">点击进入</el-button>
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
  </div>
</template>

<script>
  export default {
    data () {
      return {
	status: [
         {
           value: '0',
           label: '上架'
         },
         {
           value: '1',
           label: '下架'
       	}],
        orderStatus:'',
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
        rukuVisible: false
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/repository/product/list'),
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
	   //搜索
      search () {
        this.dataListLoading = true
          this.$http({
          url: this.$http.adornUrl('/repository/product/findByCriteria'),
          method: 'get',
          params: this.$http.adornParams({
            'param':this.searchKeyword,
            'status': this.orderStatus,
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.data
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
      //导出exl
      getExport(){
        window.open('https://www.jizhangyl.com/jizhangyl//repository/product/exportByCriteria?param=' + this.searchKeyword + '&status=' + this.orderStatus)
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
      rukuHandle (id) {
        this.rukuVisible = true
        this.$nextTick(() => {
          this.$refs.ruku.init(id)
        })
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
	goto(id) {
        console.log(id)
        this.$router.push({path: '/deliveryDetail', query: {providerId: id}})
      },
      refresh () {
        this.getDataList ()
      }
    }
  }
</script>

<style>
.el-row{
  width: 100%;
}
tr{
  height: 50px;
}
.el-table--medium td, .el-table--medium th {
     padding: 5px 0 !important; 
}
</style>
