<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.paramKey" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getProviderProductByJanOrName()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;" @cell-click="logHandle">
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
        prop="productName"
        header-align="center"
        align="center"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="productJancode"
        header-align="center"
        align="center"
        label="商品JAN CODE">
      </el-table-column>
      <el-table-column
        prop="boxQuantity"
        header-align="center"
        align="center"
        label="一箱数量">
      </el-table-column>
      <el-table-column
        prop="purchasePrice"
        header-align="center"
        align="center"
        label="采购价">
      </el-table-column>
      <el-table-column
        prop="productStock"
        header-align="center"
        align="center"
        label="库存">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        label="最后报价更新时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <shop-supplier-list v-if="supplierShow" ref="shopSupplierList">
    </shop-supplier-list>
  </div>
</template>

<script>
  import AddOrUpdate from './shop-add-or-update'
  import ShopSupplierList from './shop-supplier-list'
  export default {
    data () {
      return {
        dataForm: {
          paramKey: ''
        },
        supplierShow: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 20,
        totalPage: 0,
        providerId: '',
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      ShopSupplierList
    },
    activated () {
      this.providerId = this.$route.query.providerId || 0
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/product/provider/findByProviderId'),
          method: 'get',
          params: this.$http.adornParams({
            'providerId': this.providerId,
            'page': this.pageIndex,
            'size': this.pageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.data.data
            this.dataList.updateTime = new Date(data.data.data.updateTime)
            this.totalPage = data.data.totalPage
            this.totalNum = data.data.totalPage * this.pageSize
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      getProviderProductByJanOrName(){
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/product/provider/getProviderProductByJanOrName'),
          method: 'get',
          params: this.$http.adornParams({
	    'providerId': this.providerId,
            'param': this.dataForm.paramKey
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.data
            this.totalPage = 1
            this.totalNum = data.data.length
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
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/product/provider/repoDel'),
            method: 'get',
            params: this.$http.adornParams({
              'id': ids[0]
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
      logHandle (data,column,cell,event) {
        if(column.label !== "操作"){
          this.supplierShow = true
          this.$nextTick(() => {
            this.$refs.shopSupplierList.init(data.productId)
          })
        }
      }
    }
  }
</script>
