<template>
  <el-dialog
    title="订单详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="75%">
    <el-form  class="Submission" ref="this.dataForm2" @keyup.enter.native="dataFormSubmit()" label-width="100px">
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
      <el-row style="width: 100%">
        <p class="title">确认凭证</p>
        <el-upload
        action="https://www.jizhangyl.com/jizhangyl/common/upload"
        list-type="picture-card"
        name='file'
        :on-success="handleAvatarSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <p>请上传请求书,邮件截图或其他凭证</p>
      </el-row>
    </el-form>
    <el-row style="width: 100%">
      <el-col :span="4" :offset="20" style="text-align: right;">
        <el-button type="primary" @click="Submission()">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
  export default {
    data () {
      return {
        visible: false,
        productId: '',
        dataForm:[],
        orderDetail:[],
        dialogImageUrl: '',
        dialogVisible: false
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
        }
        this.getOrderDetail ()
      },
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
      Submission(){
        let Urls='';
        for(let i=0;i<this.dataForm.length;i++){
          Urls +=this.dataForm[i]+','
        };
        Urls=Urls.substring(0,Urls.length-1);
      	this.$http({
            url: this.$http.adornUrl('/purchase/order/confirm'),
            method: 'get',
            params: this.$http.adornParams({
              'orderId': this.orderId,
              'certUrls':JSON.stringify(Urls),
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
        setTimeout("location.reload();",1000)
      },
      handleAvatarSuccess(res, file) {
      	console.log("这是提交图片");
        this.dialogImageUrl = res.data;
        console.log(res.data);
        this.dataForm.push(this.dialogImageUrl);
        console.log(this.dataForm);
      },
       handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleRemove(file, fileList) {
        console.log(file.response.data);
        this.dialogImageUrl = file.response.data;
        let index = this.dataForm.indexOf(this.dialogImageUrl);
        this.dataForm.splice(index,1);
        console.log(this.dataForm)
      },
    }
  }
</script>
<style>
  .title{
    font-size: 20px;
    margin-top: 20px;
  }
  .textRight{
    text-align: right;
  }
</style>