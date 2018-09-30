<template>
  <div class="block">
   	<div class="div-border clearfix">
	    <el-row>
        <el-date-picker
          v-model="date1"
          type="daterange"
          align="right"
          unlink-panels
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
			  <el-button type="primary" style="margin-left: 20px;" @click="CustomsExportOrder()">海关备案订单导出</el-button>
			</el-row>
   	</div>
   	<div class="div-border clearfix">
	    <el-row>
        <el-date-picker
          v-model="date2"
          type="daterange"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
			  <el-button type="primary" style="margin-left: 20px;" @click="WarehouseExportOrder()">仓库打包订单导出</el-button>
			</el-row>
   	</div>
    <div class="import-exports clearfix">
      <div class="import-export">
        <p>商家订单导出/导入模块</p>
        <div class="operation">
          <div class="dgmoban">
            <el-row>
                <el-button type="primary" @click="handleDownloadBuyer()">买手订单导入模板</el-button>
            </el-row>
          </div>
          <div class="dgmoban clearfix">
            <div class="import">
              <el-upload
                class="upload-demo clearfix mgl"
                :on-preview="handlePreview"
                :before-upload="uploadFile"
                name="myfile"
                action=""
                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="3"
                :on-exceed="handleExceed"
                :file-list="fileListsone">
                <el-button type="primary">买手订单导入</el-button>
              </el-upload>
            </div>
            <div class="out">
              <el-input
                size="small"
                placeholder="请输入邀请码"
                v-model="invitezi"

                >
              </el-input>
            </div>
          </div>
          <div class="div-border clearfix">
            <div>
              <div class="import">
                 <el-button type="primary" @click="handleShoper (invite)" >买手订单导出</el-button>
              </div>
              <div class="out">
                 <el-input
                    size="small"
                    placeholder="请输入邀请码"
                    v-model="invite">
                  </el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="import-export">
        <p>仓库发货模块</p>
        <div class="operation">
          <div class="mkone">
            <el-upload
              class="upload-demo clearfix"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              name="myfile"
              action="https://www.jizhangyl.com/jizhangyl/express/import/"
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileListstwo">
              <el-button type="primary">物流单号库导入</el-button>
              <span class="ordernum">剩余物流单号:{{OrderNumber}}</span>
            </el-upload>
          </div>
          <div class="dgmoban">
            <el-row>
              <el-button type="primary" @click="handleDownloadDelivery()">仓库发货模板</el-button>
            </el-row>
          </div>
          <div class="div-border">
            <el-upload
              class="upload-demo clearfix"
              action="https://www.jizhangyl.com/jizhangyl/order/report/importFromRepository"
              :on-preview="handlePreview"
              name="orderExcel"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileListsthree">
              <el-button type="primary">已发货物流订单导入</el-button>
            </el-upload>
          </div>
        </div>
      </div>
    </div>
      <OUT v-if="outVisible" ref="out" ></OUT>
    </div>
</template>
<script>
import OUT from './out.vue'
import axios from 'axios'
  export default {
    data () {
      return {
        invitezi:'',
        invite: '',
        outData: [],
        date1: '',
        date2: '',
        date3: '',
        OrderNumber: 0,
        importDate: {},
        fileListsone:[],
        fileListstwo:[],
        fileListsthree: [],
        outVisible: false
      }
    },
    components: {
      OUT
    },
    activated () {
      this.getUnUsed()
    },
    methods: {
      getUnUsed(){
        this.$http({
          url: this.$http.adornUrl('/express/getUnUsed'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.OrderNumber = data.data
          } else {
            this.OrderNumber = 0
          }
        })
      },
      uploadFile(file){
                 var formData=new FormData();
                 formData.append('myfile',file);
                 formData.append("inviteCode",this.invitezi);
                 var file = formData;
                axios({
                  url:'https://www.jizhangyl.com/jizhangyl/order/report/importFromBusiness',
                  method: 'post',
                  data:file
              }).then((data)=>{
                     if(data.code === 0){
                         this.$message({
                             message:"上传成功",
                             type:'success'
                         })
                     }
                     else{
                             this.$message({
                                 message:data.data.msg,
                                 type:'error'
                             })
                         }
                 }).catch({})
                return false;
            },
      CustomsExportOrder () {
        window.open('https://www.jizhangyl.com/jizhangyl/order/report/exportForCustoms?startTime=' + this.date1[0] + '&endTime=' + this.date1[1])
      },
      WarehouseExportOrder () {
        window.open('https://www.jizhangyl.com/jizhangyl/order/report/exportForRepository?startTime=' + this.date2[0] + '&endTime=' + this.date2[1])
      },
      ShopfileUpload (data) {
        axios({
          url: 'https://www.jizhangyl.com/order/report/importFromBusiness',
          method: 'post',
          data: data.file
        }).then(({data}) => {
          if (data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      handleDownloadBuyer () {
        this.$http({
          url: this.$http.adornUrl('/template/downloadBuyer'),
          method: 'get'
        }).then(({data}) => {
          if (data.code === 0) {
            window.open(data.data)
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      handleDownloadDelivery () {
        this.$http({
          url: this.$http.adornUrl('/template/downloadDelivery'),
          method: 'get'
        }).then(({data}) => {
          if (data.code === 0) {
            window.open(data.data)
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      UserfileUpload (data) {
        this.$http({
          url: this.$http.adornUrl('/template/uploadBuyer'),
          method: 'POST',
          data: data.file
        }).then(({data}) => {
          if (data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      CangkufileUpload (data) {
        this.$http({
          url: this.$http.adornUrl('/template/uploadDelivery'),
          method: 'POST',
          data: this.$http.adorndata({
            'name': data.file
          })
        }).then(({data}) => {
          if (data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      handleShoper (val) {
        // window.open('https://www.jizhangyl.com/jizhangyl//order/report/exportForBusiness?date' + this.date3)
        this.outVisible = true,
        this.$nextTick(()=> {
        console.log(val)
        this.$refs.out.init(val),
        console.log(this.outVisible)
        })

      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      kuaidifileUpload (data) {
        this.$http({
          url: this.$http.adornUrl('/template/uploadBuyer'),
          method: 'POST',
          data: data.file
        }).then(({data}) => {
          if (data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }}
      }
</script>
<style type="text/css">
.import {
    float: left;
    width: 50%;
    margin-left: 8px;
    text-align: left;
}
.mgl{
  margin-left: -7px;
}
.out {
  float: right;
  margin-right: 8%;
}
.import {
  float: left;
  margin-left:8px;
}
.el-upload{
  float: left;
  margin-left: 7px;
}
.el-upload-list{
  float: left;
  margin-left: 20%;
}
.el-row{
  margin-left: 7px !important;
}
	.div-border{
		margin-bottom: 2em;
	}
	.el-date-editor .el-range-separator {
    width: 8%;
}
.mkone,.mktwo{
  margin-top: 20px;
  margin-bottom: 20px;
  padding-bottom: 1em;
  border-bottom: 1px #ccc solid;
}
.el-button--mini, .el-button--small {
    font-size: 14px !important;
}
.el-button--small{
    padding: 10px 15px !important;
}
  .el-range-editor--medium.el-input__inner {
    float: left;
	}
	.el-row{
		float: left;
    margin-left: 20px;
	}
	.div-border:nth-of-type(2) .el-button--primary {
    color: #fff;
    background-color: #17b354d4;
    border-color: #17b354;
	}
  .import-export{
    text-align: center;
    float: left;
    width: 50%;
    font-size: 20px;
  }
  .operation{
    width: 90%;
    margin: 0 auto;
    border-radius: 5px;
    border: 1px #000 dashed;
  }
  .dgmoban{
    margin-top: 20px;
    margin-bottom: 20px;
    padding-bottom: 1em;
    border-bottom: 1px #ccc solid;
  }
  .dgmoban .el-row{
    float: none;
    margin: 0 auto;
    text-align: left;
    margin-left: 7px;
  }
  .el-upload-dragger{
    width: 163px;
    height: 163px;
  }
  .ordernum{
    font-size: 15px;
    display: inline-block;
    margin-left: 80px;
  }
</style>
