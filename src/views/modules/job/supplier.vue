<template>
  <div class="mod-schedule">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
	<div v-for="item in this.ProductDataList" :key="item.Id" :value="item.productName" ></div>
        <el-autocomplete  popper-class="my-autocomplete" v-model="dataForm.paramKey"  :trigger-on-focus="false" :fetch-suggestions="querySearch" placeholder="商品jancode或名称搜索" @select="handleSelect">
                <template slot-scope="{ item }">
		 <div class="mouse">
                  <div class="addr">{{item.productJancode}}</div>
		  <span class="name">{{ item.productName }}</span>
                 </div>
                </template>
          </el-autocomplete>
      </el-form-item>
      <el-form-item>
        <!-- <el-button @click="getProductByJanOrName()">查询</el-button> -->
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            style="width: 100%;">
      <el-table-column
              type="selection"
              header-align="center"
              align="center"
              width="50">
      </el-table-column>
      <el-table-column
              prop="companyName"
              header-align="center"
              align="center"
              width="300"
              label="公司日文名称">
      </el-table-column>
      <el-table-column
              prop="companyAbbr"
              header-align="center"
              align="center"
              label="公司名简称">
      </el-table-column>
      <el-table-column
              prop="companyAddress"
              header-align="center"
              align="center"
              width="250"
              label="公司地址">
      </el-table-column>
      <el-table-column
              prop="purchaseContact"
              header-align="center"
              align="center"
              label="采购联系人">
      </el-table-column>
      <el-table-column
              prop="loanDate"
              header-align="center"
              align="center"
              label="货款账期">
      </el-table-column>
      <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="70"
              label="商品库">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goShop(scope.row.providerId)">进入</el-button>
        </template>
      </el-table-column>
      <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="100"
              label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.providerId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-size="pageSize"
      :total="totalNum"
      layout="total, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 供应商列表 -->
    <shop-supplier-list v-if="supplierShow" ref="shopSupplierList">
    </shop-supplier-list>
    <!-- 弹窗, 日志列表 -->
    <log v-if="logVisible" ref="log"></log>
  </div>
</template>

<script>
  import AddOrUpdate from './supplier-add-or-update'
  import Log from './schedule-log'
  import ShopSupplierList from '../sys/shop-supplier-list'
  export default {
    data () {
      return {
        dataForm: {
          paramKey: ''
        },
        supplierShow : false,
        ProductDataList: [],
      	dataList: [],
        pageIndex: 1,
        pageSize: 20,
        totalPage: 0,
        totalNum: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        logVisible: false,
	suggestions: []
      }
    },
    components: {
      AddOrUpdate,
      Log,
      ShopSupplierList
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/product/provider/list'),
          method: 'GET',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'size': this.pageSize
          })
        }).then(({data}) => {
          console.log(data)
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
      querySearch(queryString , cb){
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/product/provider/getProductByJanOrName'),
          method: 'get',
          params: this.$http.adornParams({
            'param': queryString
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.ProductDataList = data.data
            cb(this.ProductDataList)
          } else {
            this.ProductDataList = []            
          }
          this.dataListLoading = false
        })
      },
      handleSelect(item) {
        this.supplierShow = true
       this.$nextTick(() => {
            this.$refs.shopSupplierList.init(item.productId)
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        console.log(this.pageIndex)
        console.log(val)
        this.pageSize = val
        this.pageIndex = 1
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (data) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(data)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.jobId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(ids)
          this.$http({
            url: this.$http.adornUrl('/product/provider/delete'),
            method: 'GET',
            params: this.$http.adornParams({
              'providerId': ids[0]
            })
          }).then(({data}) => {
            console.log(data)
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
      // 进入商品库
      goShop (id) {
        console.log(id)
        // this.logVisible = true
        // this.$nextTick(() => {
        //   this.$refs.log.init()
        // })
        this.$router.push({path: '/sys-shop', query: {providerId: id}})
      }
    }
  }
</script>
<style>
  .el-button--small, .el-button--small.is-round {
     padding: 0 !important; 
}
.addr {
    font-size: 12px;
    color: #b4b4b4
  }
  .name {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .mouse:hover {color:coral}
  .el-scrollbar{
    width:480px
  }
</style>
