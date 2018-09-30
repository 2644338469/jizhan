<template>
  <el-dialog
    title="付款"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="75%">
    <el-form  class="Submission" ref="this.dataForm2" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row style="width: 100%">
        <el-collapse>
          <el-collapse-item v-for="(list,index) in CurrentPay">
            <template slot="title">
              第{{index+1}}次已完成付款
            </template>
            <el-table v-if="list.purchasePayDetailList.length" :data="list.purchasePayDetailList" border style="width: 100%">
              <el-table-column fixed prop="productJancode" label="商品JAN CODE">
              </el-table-column>
              <el-table-column prop="productName" label="商品名称">
              </el-table-column>
              <el-table-column prop="productPrice" label="商品金额">
              </el-table-column>
              <el-table-column prop="productQuantity" label="实收数量" width="80">
              </el-table-column>
            </el-table>
            <el-row >
              <el-col :span="17">
                <div class="listImg" v-for="(listImg,index) in list.certList">
                  <a :href="listImg" target="view_window"><img :src="listImg" alt="当前为Excel文件,点击下载预览"></a>
                </div>
              </el-col>
              <el-col :span="7">
                <el-row :gutter="20">
                  <el-col :span="15"><div class="grid-content bg-purple"><span style="font-size:16px">实付金额:</span></div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><span style="font-size:18px;color:#F56C6C">{{list.payAmount}}</span></div></el-col>
                  <el-col style="padding-top: 5px;">
                    <el-input
                      type="textarea"
                      :rows="2"
                      :disabled="true"
                      placeholder="请输入内容"
                      v-model="list.comment">
                    </el-input>
                  </el-col>
                </el-row>             
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-row>
       <el-row style="width: 100%;margin-top: 20px;">
        <span style="font-size:20px;color:#303133">货款结算</span>
        <span style="float: right;">账期日:{{this.time}}</span>
        <el-collapse>
          <el-collapse-item v-for="(PaymentGood,index) in PaymentGoods">
            <template slot="title">
              付款
            </template>
             <el-row>
              <el-col :span="20">
                <el-table v-if="CurrentRecv.length" :data="CurrentRecv" border style="width: 100%">
                  <el-table-column fixed prop="productJancode" label="商品JAN CODE" height="67px">
                  </el-table-column>
                  <el-table-column prop="productName" label="商品名称"  height="67px">
                  </el-table-column>
                  <el-table-column prop="productQuantity" label="入库数量"  height="67px">
                  </el-table-column>
                  <el-table-column prop="productQuantity" label="实付数量" width="80" height="67px">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.actualNum" size="mini" placeholder="请输入采购数量"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="4" style="border-right: 1px solid #ebeef5;border-top: 1px solid #ebeef5;">
                  {{AmountOfMoney}}
                  <el-col >
                    <div class="shifont">实付金额</div>
                  </el-col>
                  <el-col v-for="num of nums">
                    <div class="sdfsf">{{isNaN(num) ? 0 : num}}</div>
                  </el-col>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="17">
                <div class="voucher clearfix">
                  <p class="title">添加凭证</p>
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
                  <p>请添加:到库图片,收货图片及收货人签字凭证</p>
                </div>
              </el-col>
              <el-col :span ="7" style="padding-left: 10px;padding-right: 10px;padding-top: 30px;">
                <el-row :gutter="20">
                  <el-col :span="12" style="padding-right: 0;"><div class="grid-content bg-purple"><span style="font-size:16px">总计金额:</span></div></el-col>
                  <el-col :span="12" style="padding: 0"><div class="grid-content bg-purple-light"><span style="font-size:18px;color:#F56C6C">{{isNaN(PaymentAmount) ? 0 : PaymentAmount}}</span></div></el-col>
                  <el-col :span="13"><div class="grid-content bg-purple"><span style="font-size:16px">手动调整:</span></div></el-col>
                  <el-col :span="11">
                    <div class="grid-content bg-purple-light">
                        <el-input size="mini" v-model="adjustment" placeholder="请输入调整金额"></el-input>  
                    </div>
                  </el-col>
                  <el-col style="padding-top: 5px;">
                    <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      v-model="textarea">
                    </el-input>
                  </el-col>
                  <el-col :span="12" style="padding-right: 0"><div class="grid-content bg-purple"><span style="font-size:16px">最终付款:</span></div></el-col>
                  <el-col :span="12" style="padding: 0"><div class="grid-content bg-purple-light"><span style="font-size:18px;color:#F56C6C">{{isNaN(FinalAmount) ? 0 : FinalAmount}}</span></div></el-col>
                </el-row>
                <el-row style="width: 100%">
                  <el-col :span="12" :offset="12" style="padding-top: 10px; text-align: right;"><el-button type="primary" @click="submitPayment()" >提交</el-button></el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-row>
          <i class="el-icon-circle-plus-outline" @click="AddPaymentGoods()"></i>
        </el-row>
      </el-row> 
      <el-row style="width:100%;text-align: center;">
        <el-button class="btn" @click="EndSubmit()">完结实收</el-button>
      </el-row> 
    </el-form>
  </el-dialog>
</template>
<script>
  export default {
    data () {
      return {
        visible: false,
        dialogVisible: false,
        orderDetail:[],
        CurrentPay:[],
        PaymentGoods:[],
        CurrentRecv: [],
        dataForm:[],
        time:0,
        providerId: '',
        orderId:'',
        nums:[],
        items:[],
        dialogImageUrl:'',
        textarea: '',
        adjustment: 0 ,
        payment:0
      }
    },
    computed:{
      AmountOfMoney () {
        let total = 0;
        let num =[];
        for (var i = 0; i < this.CurrentRecv.length; i++) {
          this.CurrentRecv[i].AOMoney =this.CurrentRecv[i].productPrice * this.CurrentRecv[i].actualNum;
          num.push(this.CurrentRecv[i].AOMoney)
        }
        console.log('这是对象');
        this.nums=num;
        console.log(this.nums)
        // return num
      },
      //付款总计金额
      PaymentAmount () {
        let total = 0
        console.log(this.CurrentRecv.length)
        for (var i = 0; i < this.CurrentRecv.length; i++) {
          total = total + (this.CurrentRecv[i].productPrice * this.CurrentRecv[i].actualNum)
          console.log(total)
        }
        return total
      },
      //计算最终付款金额
      FinalAmount () {
        console.log('最终付款')
        let total = 0
        console.log(this.nums)
        for (var i = 0; i < this.nums.length; i++) {
         total += this.nums[i];
        }
        this.payment=total-this.adjustment
        return total-this.adjustment
      }
    },
    methods: {
      init (data) {
        console.log("这是获取的id")
        console.log(data.providerId)
        this.orderId = data.orderId || 0
        this.providerId = data.providerId || 0
        this.visible = true
        this.getCurrentPay ()
        this.getCurrentRecv ()
        this.getTime ()
      },
      //获取历史付款记录
      getCurrentPay () {
        this.$http({
          url: this.$http.adornUrl('/purchase/order/getPayList'),
          method: 'get',
          params: this.$http.adornParams({
            'orderId': this.orderId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.CurrentPay = data.data
            console.log(this.CurrentPay+'这是历史数据')
            // this.time = data.data.payDate
          } else {
            this.$message.error(data.msg)
          }
       })
      }, 
      //获取付款时展示的仓库收货信息
      getCurrentRecv () {
        this.$http({
          url: this.$http.adornUrl('/purchase/order/getCurrentRecv'),
          method: 'get',
          params: this.$http.adornParams({
            'orderId': this.orderId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.CurrentRecv = data.data
          } else {
            this.$message.error(data.msg)
          }
       })
      },
      //获取时间戳
      getTime (){
        this.$http({
          url: this.$http.adornUrl('/purchase/order/getLoanDate'),
          method: 'get',
          params: this.$http.adornParams({
            'orderId': this.orderId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.time = data.data
          } else {
            this.$message.error(data.msg)
          }
       })
      },
      //提交付款
      submitPayment () {
        let submitdata=[];
        for (let i = 0; i < this.CurrentRecv.length; i++) {
          let shopInfo = new Object();
          console.log(this.CurrentRecv[i].productJancode);
          shopInfo.productId = this.CurrentRecv[i].productId;
          shopInfo.productQuantity = parseInt(this.CurrentRecv[i].actualNum);
          submitdata.push(shopInfo);
          this.items=submitdata
        };
        let Urls='';
        for(let i=0;i<this.dataForm.length;i++){
          Urls +=this.dataForm[i]+','
        };
        console.log(Urls)
        Urls=Urls.substring(0,Urls.length-1);
        this.$http({
          url: this.$http.adornUrl('/purchase/order/orderPay'),
          method: 'POST',
          data: this.$http.adornData({
            'orderId': this.orderId,
            'providerId': this.providerId,
            'items': JSON.stringify(this.items),
            'certUrls':JSON.stringify(Urls),
            'payAmount':this.payment,
            'comment':this.textarea
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
      //完结实收
      EndSubmit(){
        this.$http({
          url: this.$http.adornUrl('/purchase/order/finishPay'),
          method: 'get',
          params: this.$http.adornParams({
            'orderId': this.orderId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
          } else {
            this.$message.error(data.msg)
          }
       })
      },
      //添加实付列表
      AddPaymentGoods(){
        console.log('添加实付列表');
        console.log(this.PaymentGoods);
        let num = 1;
        let a=[];
        if(this.CurrentRecv != ''){
          this.PaymentGoods.push(num)
        }
      },
      handleAvatarSuccess(res, file) {
        this.dialogImageUrl = res.data;
        console.log(res.data);
        this.dataForm.push(this.dialogImageUrl);
        console.log(this.dataForm);
      },
      handleRemove(file, fileList) {
        console.log(file.response.data);
        this.dialogImageUrl = file.response.data;
        let index = this.dataForm.indexOf(this.dialogImageUrl);
        this.dataForm.splice(index,1);
        console.log(this.dataForm)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
  }
</script>
<style>
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
.el-icon-circle-plus-outline{
  font-size: 20px;
  margin-top: 15px;
  margin-bottom: 15px;
}
.voucher{
  margin-top: 15px;
}
.avatar-uploader{
  float: left;
  margin-right: 8px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 15px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
/*获取已完成实收*/
.listImg{
  float: left;
  width: 140px;
  height: 140px;
  padding: 5px;
  margin-top: 10px;
  border: 1px #ccc dashed;
  margin-right: 10px;
}
.listImg img{
  border-radius: 4px;
}
.el-collapse-item__header {
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    padding-left: 10px;
}
/*表格样式*/
.shifont{
    font-size: 14px;
    color: #909399;
    height: 67px;
    line-height: 67px;
    font-weight: 600;
    text-align: left;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom: 1px solid #ebeef5;
  }
  .sdfsf{
    height: 114px;
    position: relative;
    word-wrap: normal;
    text-overflow: ellipsis;
    vertical-align: middle;
    width: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    white-space: normal;
    word-break: break-all;
    line-height: 114px;
    padding-left: 10px;
    padding-right: 10px;
    overflow: hidden;
    user-select: none;
    text-align: left;
    color: #909399;
    font-weight: 500;
    border-bottom: 1px solid #ebeef5;
  }
  td {
  height: 114px;
  background: url('http://www.w3cschool.cn/style/download.png');
  }
  tr{
    height: 67px;
  }
  .avatar {
    width: 130px;
    height: 130px;
    display: block;
}
img{
  width: 130px;
  height: 130px;
}
.title{
    font-size: 20px;
    margin-top: 20px;
  }
  .textRight{
    text-align: right;
  }
  .btn{
    width: 90%;
    background-color: red;
    color: #fff;
  }
</style>