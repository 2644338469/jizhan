<template>
  <el-dialog
    title="供应商选择列表"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="75%">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="任务ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      height="460"
      style="width: 100%;">
      <el-table-column
        prop="providerName"
        header-align="center"
        align="center"
        label="供应商名称">
      </el-table-column>
      <el-table-column
        prop="productName"
        header-align="center"
        align="center"
        label="商品名称">
      </el-table-column>
      <el-table-column
	      prop="productImage"
        header-align="center"
        align="center"
        label="商品图片">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.productImage" style="height:70px;width:70px" />
        </template>
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
        width="180"
        label="最后报价更新时间">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="modify(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      width="30%"
      title="修改"
      :visible.sync="innerVisible"
      append-to-body>
        <el-form>
          <el-form-item label="采购价">
            <el-input v-model="purchasePrice"></el-input>
          </el-form-item>
          <el-form-item label="库存">
            <el-input v-model="productStock"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
  </el-dialog>
</template>
<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: ''
        },
        dataList: [],
        purchasePrice:0,
        productStock:0,
        dataRule: {},
        productId: '',
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        innerVisible: false
      }
    },
    methods: {
      init (productId) {
        console.log(productId)
        this.productId = productId
        this.visible = true
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/product/provider/findProviderByProductId'),
          method: 'get',
          params: this.$http.adornParams({
            'productId': this.productId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.data;
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      //修改商品价格和库存
      modify(id){
        this.innerVisible = true;
        console.log("这是修改")
        console.log(id)
        this.dataForm = id
        this.purchasePrice = id.purchasePrice
        this.productStock = id.productStock
      },
      //修改确认按钮
      dataFormSubmit(){
        this.innerVisible = false
        this.$http({
          url: this.$http.adornUrl('/product/provider/repoUpdate'),
          method: 'post',
          data: this.$http.adornData({
            'id': this.dataForm.id,
            'providerId': this.dataForm.providerId,
            'productId': this.dataForm.productId,
            'purchasePrice': this.purchasePrice,
            'productStock': this.productStock
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
              this.$message.error(data.msg)
            }
        })
      },
      //修改取消按钮
      cancel () {
        this.innerVisible = false
        this.purchasePrice='',
        this.productStock=''
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
      }
    }
  }
</script>
