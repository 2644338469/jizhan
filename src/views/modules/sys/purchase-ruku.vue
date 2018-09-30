<template>
  <el-dialog
    title="仓库确认收货"  
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="75%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row>
        <el-collapse>
          <el-collapse-item v-for="(list,index) in confirmDatList">
            <template slot="title">
              第{{index+1}}次已完成实收
            </template>
            <el-table v-if="list.purchaseConfirmDetailList.length" :data="list.purchaseConfirmDetailList" border style="width: 100%">
              <el-table-column
                prop="productImage"
                width="90"
                align="center"
                label="商品图片">
                <template slot-scope="scope">
                  <img v-bind:src="scope.row.productImage" style="height:50px;width:50px" />
                </template>
              </el-table-column>
              <el-table-column prop="productJancode" label="商品JAN CODE">
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
              <el-table-column
                prop="productImage"
                width="90"
                align="center"
                label="商品图片">
                <template slot-scope="scope">
                  <img v-bind:src="scope.row.productImage" style="height:50px;width:50px" />
                </template>
              </el-table-column>
              <el-table-column prop="productJancode" label="商品JAN CODE">
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
              <el-col :span ="7" style="padding-left: 10px;padding-right: 10px;padding-top: 80px;">
                <el-row :gutter="20">
                  <el-col :span="11" style="padding: 0;"><div class="grid-content bg-purple textRight"><span style="font-size:16px">总计金额:</span></div></el-col>
                  <el-col :span="13" style="padding: 0;"><div class="grid-content bg-purple-light"><span style="font-size:18px;color:#F56C6C">{{isNaN(ActualTotalAmount) ? 0 : ActualTotalAmount}}</span></div></el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col class="textRight"><el-button type="primary" @click="submitUpload()">提交</el-button></el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-row>
          <i class="el-icon-circle-plus-outline" @click="AddCollectShop()"></i>
        </el-row>
      </el-row>
      <el-row style="width:100%;text-align: center;">
        <el-button class="btn" @click="EndSubmit()">完结实收</el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
  // import qs from 'qs'
  export default {
    data () {
      return {
        dataForm: {},
        dataForm1:[],
        visible: false,
        dialogVisible: false,
        orderId: '',
        loanDate:'',
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
        dialogImageUrl:'',
        shopInfo: [],
        dataRule: {},
        activeNames: [],
        items:[],
      }
    },
    computed: {
      ActualTotalAmount () {
        let total = 0
        console.log(this.orderDetail.length)
        for (var i = 0; i < this.orderDetail.length; i++) {
          total = total + (this.orderDetail[i].productPrice * this.orderDetail[i].actualNum)
          console.log(total)
        }
        return total
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
        for(let i=0;i<this.dataForm1.length;i++){
          Urls +=this.dataForm1[i]+','
        };
        Urls=Urls.substring(0,Urls.length-1);
        this.$http({
          url: this.$http.adornUrl('/purchase/order/confirmOrder'),
          method: 'POST',
          data: this.$http.adornData({
            'orderId': this.dataForm.orderId,
            'loanDate':this.dataForm.loanDate,
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
      //添加实收列表
      AddCollectShop(){
        let num = 1;
        let a=[];
        this.lists.push(num);
        console.log(this.lists)
      },
      //完结实收
      EndSubmit(){
        this.$http({
          url: this.$http.adornUrl('/purchase/order/finishConfirm'),
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
      //添加实收凭证
      handleAvatarSuccess(res, file) {
        this.dialogImageUrl = res.data;
        console.log(res.data);
        this.dataForm1.push(this.dialogImageUrl);
        console.log(this.dataForm1);
      },
      handleRemove(file, fileList) {
        console.log(file.response.data);
        this.dialogImageUrl = file.response.data;
        let index = this.dataForm1.indexOf(this.dialogImageUrl);
        this.dataForm1.splice(index,1);
        console.log(this.dataForm1)
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