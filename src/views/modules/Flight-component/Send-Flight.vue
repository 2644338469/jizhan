<template>
  <div v-if="visible">
    <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="上传送机费用凭证" prop="companyAbbr">
        <el-upload
          action="https://www.jizhangyl.com/jizhangyl/common/upload"
          list-type="picture-card"
          name='file'
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      </el-form-item>
      <el-form-item label="送机费用" prop="companyAbbr">
        <el-input v-model="dataForm.deliveryFlightCost" placeholder="送机费用"></el-input>
      </el-form-item>
      <el-form-item label="送机其他共计费用标题" prop="companyAbbr">
        <el-input v-model="dataForm.deliveryFlightOther" placeholder="送机其他共计费用标题"></el-input>
      </el-form-item>
      <el-form-item label="送机其他费用" prop="companyAbbr">
        <el-input v-model="dataForm.deliveryFlightOtherCost" placeholder="送机其他费用"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </div>
</template>

<script>
  import qs from 'qs'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          deliveryFlightUrl: [],
          deliveryFlightCost:'',
          deliveryFlightOther:'',
          deliveryFlightOtherCost:'',
          flightId:''
        },
        imgUrl: []
      }
    },
    methods: {
      init (data) {
        this.visible = true
        this.dataForm.flightId = data.flightId
      },
      close() {
        this.visible = false
      },
      //图片上传成功
      handleAvatarSuccess(res, file) {
        this.imgUrl = res.data
        this.dataForm.deliveryFlightUrl.push(this.imgUrl)
        console.log(this.dataForm.deliveryFlightUrl)
      },
      //删除图片
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/flight/packageToAirport'),
              method: 'POST',
              data: qs.stringify({
                'flightId' : this.dataForm.flightId,
                'deliveryFlightUrl': this.dataForm.deliveryFlightUrl,
                'deliveryFlightCost': this.dataForm.deliveryFlightCost,
                'deliveryFlightOther': this.dataForm.deliveryFlightOther,
                'deliveryFlightOtherCost': this.dataForm.deliveryFlightOtherCost,

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
