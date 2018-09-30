<template>
  <el-dialog
    title="查看"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="75%">
      <el-row style="width: 100%">
        <el-form-item label="供应商" prop="prviderName">
        <el-input v-model="dataForm.prviderName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="货款帐期/天" prop="loanDate">
          <el-input v-model="dataForm.loanDate" :disabled="true" placeholder="货款帐期"></el-input>
        </el-form-item>
        <el-table v-if="orderDetail.length" :data="orderDetail" border style="width: 100%">
          <el-table-column
            prop="productImage"
            width="90"
            align="center"
            label="商品图片">
            <template slot-scope="scope">
              <img v-bind:src="scope.row.productImage" style="height:50px;width:50px" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="productJancode" label="商品JAN CODE">
          </el-table-column>
          <el-table-column align="center" prop="productName" label="商品名称">
          </el-table-column>
          <el-table-column align="center" prop="productPrice" label="商品金额">
          </el-table-column>
          <el-table-column align="center" prop="productQuantity" label="采购数量" width="80">
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="width: 100%;margin-top: 20px;">
        <el-col :span="4" :push="17"><div class="grid-content bg-purple" style="text-align: right;"><span style="font-size:16px">总计金额:</span></div></el-col>
        <el-col :span="3" :push="17"><div class="grid-content bg-purple-light" style="text-align: right;"><span style="font-size:18px;color:#F56C6C">{{OrderTotalAmount}}</span></div></el-col>
      </el-row>
      <el-row style="width: 100%">
        <div class="listImg" v-for="(voucherUrl,index) in voucherUrls">
          <a :href="voucherUrl" target="view_window"><img :src="voucherUrl" alt="当前为Excel文件,点击下载预览"></a>
        </div>
      </el-row>
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
        orderId:'',
        orderDetail:[],
        voucherUrls:[],
        productId: '',
        dataListLoading: false
      }
    },
    computed: {
      OrderTotalAmount () {
        let total = 0
        for (var i = 0; i < this.orderDetail.length; i++) {
          total = total + (this.orderDetail[i].productQuantity * this.orderDetail[i].productPrice)
        }
        return total
      }
    },
    methods: {
      init (data) {
        this.visible = true
        this.orderId = data.orderId || 0
        if (this.orderId) {
          this.dataForm.orderId = data.orderId
          this.dataForm.loanDate = data.loanDate
          this.dataForm.prviderName = data.providerName
          this.dataForm.providerId = data.providerId
          console.log("获取参数")
          console.log(data.providerId)
        }
        this.getOrderDetail ()
        this.getfindConfirmCert ()
      },
      // 获取数据列表
      getOrderDetail () {
        this.$http({
          url: this.$http.adornUrl('/purchase/order/detail'),
          method: 'get',
          params: this.$http.adornParams({
            'orderId': this.orderId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.orderDetail = data.data
            console.log('获取确认订单数据'+this.orderDetail)
            console.log('orderDetail=')
            console.log(this.orderDetail)
          } else {
            this.$message.error(data.msg)
          }
       })
      },
      getfindConfirmCert(){
         this.$http({
          url: this.$http.adornUrl('/purchase/order/findConfirmCert'),
          method: 'get',
          params: this.$http.adornParams({
            'orderId': this.orderId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.voucherUrls = data.data
          } else {
            this.$message.error(data.msg)
          }
       })
      }
    }
  }
</script>
<style>
  .listImg{
  float: left;
  width: 140px;
  height: 140px;
  margin-top: 10px;
  border: 1px #ccc dashed;
  margin-right: 10px;
}
.listImg a{
  display: inline-block;
}
.listImg img{
  border-radius: 4px;
  width: 140px;
  height: 140px;
}
</style>