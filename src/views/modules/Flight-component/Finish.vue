<template>
  <div v-if="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="清关凭证" prop="companyAbbr">
        <el-upload
          action="https://www.jizhangyl.com/jizhangyl/common/upload"
          list-type="picture-card"
          name='file'
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove">
         <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="清关计费重量" prop="companyAbbr">
        <el-input v-model="dataForm.customsWeight" size="mini" placeholder="请输入清关计费重量"></el-input>
      </el-form-item>
      <el-form-item label="清关计费票数" prop="companyAbbr">
        <el-input v-model="dataForm.customsPoll" placeholder="航次"></el-input>
      </el-form-item>
      <el-form-item label="清关地面服务费(人民币)" prop="companyAbbr">
        <el-input v-model="dataForm.customsGroundCost" placeholder="航次"></el-input>
      </el-form-item>
      <el-form-item label="清关费(人民币)" prop="companyAbbr">
        <el-input v-model="dataForm.customsCost" placeholder="航次"></el-input>
      </el-form-item>
      <el-form-item label="清关交易手续费(人民币)" prop="companyAbbr">
        <el-input v-model="dataForm.customsTransactionCost" placeholder="航次"></el-input>
      </el-form-item>
      <el-form-item label="清关跨境电商税（人民币" prop="companyAbbr">
        <el-input v-model="dataForm.customsBorderCost" placeholder="航次"></el-input>
      </el-form-item>
      <el-form-item label="清关EMS国内派送费（人民币）" prop="companyAbbr">
        <el-input v-model="dataForm.customsEmsCost" placeholder="航次"></el-input>
      </el-form-item>
      <el-form-item label="清关舱单处理费（人民币" prop="companyAbbr">
        <el-input v-model="dataForm.customsShippingCost" placeholder="航次"></el-input>
      </el-form-item>
      <el-form-item label="清关EMS国内派送费（人民币）" prop="companyAbbr">
        <el-input v-model="dataForm.customsEmsCost" placeholder="航次"></el-input>
      </el-form-item>
      <el-form-item label="清关其他费标题" prop="companyAbbr">
        <el-input v-model="dataForm.customsOther" placeholder="航次"></el-input>
      </el-form-item>
      <el-form-item label="清关其他费用" prop="companyAbbr">
        <el-input v-model="dataForm.customsOtherCost" placeholder="航次"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
</div>
  </el-dialog>
</template>

<script>
  import qs from 'qs'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          flightId: '',
          customsUrl: '',
          customsWeight:'',
          customsPoll: '',
          customsGroundCost: '',
          customsCost:'' ,
          customsTransactionCost:'',
          customsBorderCost:'',
          customsEmsCost:'',
          customsShippingCost:'',
          customsOther:'',

        },
        imgurl:''
      }
    },
    methods: {
      init (data) {
        this.visible = true
        this.dataForm.flightId=data.flightId
      },
      //图片上传成功
      handleAvatarSuccess(res, file) {
        this.imgurl = res.data
        this.dataForm.customsUrl.push(this.imgurl)

      },
      //删除图片
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      close() {
        this.visible = false
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/flight/customsclearance'),
              method: 'POST',
              data: qs.stringify({
                flightId: this.dataForm.flightId,
                customsUrl: this.dataForm.customsUrl,
                customsWeight:this.dataForm.customsWeight,
                customsPoll: this.dataForm.customsPoll,
                customsGroundCost: this.dataForm.customsGroundCost,
                customsCost:this.dataForm.customsCost ,
                customsTransactionCost:this.dataForm.customsTransactionCost,
                customsBorderCost:this.dataForm.customsBorderCost,
                customsEmsCost:this.dataForm.customsEmsCost,
                customsShippingCost:this.dataForm.customsShippingCost,
                customsOther:this.customsOther,
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshActive')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
