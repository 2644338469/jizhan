<template>
  <el-dialog
    title="仓库确认收货"  
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="供应商" prop="prviderName">
        <el-input v-model="dataForm.prviderName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="货款帐期/天" prop="loanDate">
        <el-input v-model="dataForm.loanDate" :disabled="true" placeholder="货款帐期"></el-input>
      </el-form-item>
      <el-table v-if="orderDetail.length" :data="orderDetail" border style="width: 100%">
        <el-table-column fixed prop="productJancode" label="商品JAN CODE">
        </el-table-column>
        <el-table-column prop="productName" label="商品名称">
        </el-table-column>
        <el-table-column prop="productPrice" label="商品金额">
        </el-table-column>
        <el-table-column prop="productQuantity" label="采购数量" width="80">
        </el-table-column>
      </el-table>
      <el-row :gutter="20">
        <el-col :span="4" :push="17"><div class="grid-content bg-purple"><span style="font-size:16px">总计金额:</span></div></el-col>
        <el-col :span="4" :push="17"><div class="grid-content bg-purple-light"><span style="font-size:18px;color:#F56C6C">{{OrderTotalAmount}}</span></div></el-col>
      </el-row>
      <el-row>
        <el-collapse>
          <el-collapse-item v-for="(list,index) in confirmDatList">
            <template slot="title">
              第{{index+1}}次已完成实收
            </template>
            <el-table v-if="list.purchaseConfirmDetailList.length" :data="list.purchaseConfirmDetailList" border style="width: 100%">
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
              <div class="listImg" v-for="(listImg,index) in list.certList">
                <a :href="listImg" target="view_window"><img :src="listImg" alt="当前为Excel文件,点击下载预览"></a>
              </div>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row style="margin-top: 20px">
        <span style="font-size:20px;color:#303133;mar">实收商品</span>
        <el-collapse>
          <el-collapse-item v-for="(list,index) in lists">
            <template slot="title">
              实收
            </template>
            <el-table v-if="orderDetail.length" :data="orderDetail" border style="width: 100%">
              <el-table-column fixed prop="productJancode" label="商品JAN CODE">
              </el-table-column>
              <el-table-column prop="productName" label="商品名称">
              </el-table-column>
              <el-table-column prop="productPrice" label="商品金额">
              </el-table-column>
              <el-table-column prop="productQuantity" label="入库数量" width="80">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.actualNum" size="mini" placeholder="请输入采购数量"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <el-row :gutter="20">
              <el-col :span="17">
                <div class="voucher clearfix">
                  <el-upload
                    class="avatar-uploader"
                    action="http://jizhangyl.natapp1.cc/jizhangyl/common/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess0">
                    <img v-if="imageUrl0" :src="imageUrl0" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon">添加收货凭证</i>
                  </el-upload>
                  <el-upload
                    class="avatar-uploader"
                    action="http://jizhangyl.natapp1.cc/jizhangyl/common/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess1"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon">添加收货凭证</i>
                  </el-upload>
                  <el-upload
                    class="avatar-uploader"
                    action="http://jizhangyl.natapp1.cc/jizhangyl/common/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess2">
                    <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon">添加收货凭证</i>
                  </el-upload>
                </div>
              </el-col>
              <el-col :span ="7" style="padding-left: 10px;padding-right: 10px;padding-top: 80px;">
                <el-row :gutter="20">
                  <el-col :span="18"><div class="grid-content bg-purple"><span style="font-size:16px">总计金额:</span></div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><span style="font-size:18px;color:#F56C6C">{{isNaN(ActualTotalAmount) ? 0 : ActualTotalAmount}}</span></div></el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :offset="12"><el-button type="primary" @click="submitUpload()">提交</el-button></el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-row>
          <i class="el-icon-circle-plus-outline" @click="AddCollectShop()"></i>
        </el-row>
      </el-row>
      <el-row>
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
      <el-row>
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
                  <el-col>
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
                  <el-upload
                    class="avatar-uploader"
                    action="http://jizhangyl.natapp1.cc/jizhangyl/common/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess3">
                    <img v-if="imageUrl3" :src="imageUrl3" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon">添加收货凭证</i>
                  </el-upload>
                  <el-upload
                    class="avatar-uploader"
                    action="http://jizhangyl.natapp1.cc/jizhangyl/common/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess4">
                    <img v-if="imageUrl4" :src="imageUrl4" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon">添加收货凭证</i>
                  </el-upload>
                  <el-upload
                    class="avatar-uploader"
                    action="http://jizhangyl.natapp1.cc/jizhangyl/common/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess5">
                    <img v-if="imageUrl5" :src="imageUrl5" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon">添加收货凭证</i>
                  </el-upload>
                </div>
              </el-col>
              <el-col :span ="7" style="padding-left: 10px;padding-right: 10px;padding-top: 10px;">
                <el-row :gutter="20">
                  <el-col :span="15"><div class="grid-content bg-purple"><span style="font-size:16px">总计金额:</span></div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><span style="font-size:18px;color:#F56C6C">{{isNaN(PaymentAmount) ? 0 : PaymentAmount}}</span></div></el-col>
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
                  <el-col :span="15"><div class="grid-content bg-purple"><span style="font-size:16px">最终付款:</span></div></el-col>
                  <el-col :span="6"><div class="grid-content bg-purple-light"><span style="font-size:18px;color:#F56C6C">{{isNaN(FinalAmount) ? 0 : FinalAmount}}</span></div></el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :offset="12" style="padding-top: 10px;"><el-button type="primary" @click="submitPayment()">提交</el-button></el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-row>
          <i class="el-icon-circle-plus-outline" @click="AddPaymentGoods()"></i>
        </el-row>
      </el-row>
      
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="OrderEnd" style="width: 100%;background: red;border: red;">订单完结</el-button>
    </span>
  </el-dialog>
</template>

<script>
  // import qs from 'qs'
  export default {
    data () {
      return {
        dataForm: {},
        visible: false,
        orderId: '',
        orderDetail: [],
        confirmData: [],
        CurrentRecv: [],
        brand: {
          id: '',
          name: ''
        },
        lists:[],
        nums:[],
        confirmDatList:[],
        CurrentPay:[],
        PaymentGoods:[],
        imageUrl: '',
        imageUrl0: '',
        imageUrl1: '',
        imageUrl2: '',
        imageUrl3: '',
        imageUrl4: '',
        imageUrl5: '',
        shopInfo: [],
        dataRule: {},
        activeNames: [],
        items:[],
        certUrls1:[],
        certUrls2:[],
        adjustment: 0 ,
        textarea: '',
        payment:0,
        time:0
      }
    },
    computed: {
      OrderTotalAmount () {
        let total = 0
        for (var i = 0; i < this.orderDetail.length; i++) {
          total = total + (this.orderDetail[i].productQuantity * this.orderDetail[i].productPrice)
        }
        return total
      },
      ActualTotalAmount () {
        let total = 0
        console.log(this.orderDetail.length)
        for (var i = 0; i < this.orderDetail.length; i++) {
          total = total + (this.orderDetail[i].productPrice * this.orderDetail[i].actualNum)
          console.log(total)
        }
        return total
      },
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
        console.log(data)
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
        this.getConfirmList()
        this.getOrderDetail()
        this.getCurrentRecv ()
        this.getCurrentPay () 
        this.getTime ()
      },
      //提交1-n次实收数据
      submitUpload () {
        let submitdata=[];
        for (let i = 0; i < this.orderDetail.length; i++) {
          let shopInfo = new Object();
          console.log(this.orderDetail[i].productJancode);
          shopInfo.productId = this.orderDetail[i].productId;
          shopInfo.productQuantity = parseInt(this.orderDetail[i].actualNum);
          submitdata.push(shopInfo);
          this.items=submitdata
        };
        let Urls='';
        for(let i=0;i<this.certUrls1.length;i++){
          Urls +=this.certUrls1[i]+','
        };
        Urls=Urls.substring(0,Urls.length-1);
        console.log(Urls);
        this.$http({
          url: this.$http.adornUrl('/purchase/order/confirmOrder'),
          method: 'POST',
          data: this.$http.adornData({
            'orderId': this.dataForm.orderId,
            'providerId': this.dataForm.providerId,
            'items': JSON.stringify(this.items),
            'certUrls':JSON.stringify(Urls)
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
        location.reload(2000)
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
        for(let i=0;i<this.certUrls2.length;i++){
          Urls +=this.certUrls2[i]+','
        };
        console.log(this.certUrls2.length);
        Urls=Urls.substring(0,Urls.length-1);
        this.$http({
          url: this.$http.adornUrl('/purchase/order/orderPay'),
          method: 'POST',
          data: this.$http.adornData({
            'orderId': this.dataForm.orderId,
            'providerId': this.dataForm.providerId,
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
        location.reload(2000)
      },
      //获取已完成实收数据
      getConfirmList(){
         this.$http({
          url: this.$http.adornUrl('/purchase/order/getConfirmList'),
          method: 'get',
          params: this.$http.adornParams({
            'orderId': this.orderId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.confirmDatList = data.data
          } else {
            this.$message.error(data.msg)
          }
       })
      },
      //获取确认订单数据
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
      //订单完结
      OrderEnd () {
        this.$http({
          url: this.$http.adornUrl('/purchase/order/finish'),
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
      //添加实收列表
      AddCollectShop(){
        let num = 1;
        let a=[];
        this.lists.push(num);
        console.log(this.lists)
      },
      //添加实付列表
      AddPaymentGoods(){
        let num = 1;
        let a=[];
        this.PaymentGoods.push(num);
      },
      //添加实收凭证
      handleAvatarSuccess0(res, file) {
        this.imageUrl0 = res.data;
        this.certUrls1.push(this.imageUrl0);
        // console.log(this.imageUrl0)
      },
      handleAvatarSuccess1(res, file) {
        this.imageUrl1 = res.data;
        this.certUrls1.push(this.imageUrl1);
        // console.log(this.certUrls)
      },
      // beforeAvatarUpload(file) {
      //   const isJPG = file.type === 'image/jpeg';
      //   const isLt2M = file.size / 1024 / 1024 < 2;

      //   if (!isJPG) {
      //     this.$message.error('上传头像图片只能是 JPG 格式!');
      //   }
      //   if (!isLt2M) {
      //     this.$message.error('上传头像图片大小不能超过 2MB!');
      //   }
      //   return isJPG && isLt2M;
      // },
      handleAvatarSuccess2(res, file) {
        this.imageUrl2 = res.data;
        this.certUrls1.push(this.imageUrl2);
        // console.log(this.imageUrl2 = res.data)
      },
      handleAvatarSuccess3(res, file) {
        this.imageUrl3 = res.data;
        this.certUrls2.push(this.imageUrl3);
        // console.log(this.imageUrl0)
      },
      handleAvatarSuccess4(res, file) {
        this.imageUrl4 = res.data;
        this.certUrls2.push(this.imageUrl4);
        // console.log(this.certUrls)
      },
      handleAvatarSuccess5(res, file) {
        this.imageUrl5 = res.data;
        this.certUrls2.push(this.imageUrl5);
        // console.log(this.imageUrl2 = res.data)
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
</style>