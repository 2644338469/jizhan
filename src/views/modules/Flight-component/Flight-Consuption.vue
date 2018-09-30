<template>
  <div v-if="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="上传航空提货单" prop="companyName">
        <el-upload
          action="https://www.jizhangyl.com/jizhangyl/common/upload"
          list-type="picture-card"
          name='file'
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove">
         <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="航班实收体积" prop="companyAbbr">
        <el-input v-model="dataForm.flightVolume" placeholder="航次"></el-input>
      </el-form-item>
      <el-form-item label="航班实收重量" prop="companyAbbr">
        <el-input v-model="dataForm.flightWeight" placeholder="航次"></el-input>
      </el-form-item>
      <el-form-item label="航班实收费用(日元）" prop="companyAbbr">
        <el-input v-model="dataForm.flightCost" placeholder="航次"></el-input>
      </el-form-item>
      <el-form-item label="航班其他费用标题" prop="companyAbbr">
        <el-input v-model="dataForm.flightOthe" placeholder="航次"></el-input>
      </el-form-item>
      <el-form-item label="航班其他费用" prop="companyAbbr">
        <el-input v-model="dataForm.flightOtherCost" placeholder="航次"></el-input>
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
          flightUrl: [],
          flightVolume: '',
          flightWeight:'',
          flightCost: '',
          flightOthe: '',
          flightOtherCost:'' ,
          flightId:''
        },
        imgurl:''
      }
    },
    methods: {
      init (data) {
        this.visible = true
        this.dataForm.flightId = data.flightId
      },
      //图片上传成功
      handleAvatarSuccess(res, file) {
        this.imgurl = res.data
        this.dataForm.flightUrl.push(this.imgurl)

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
              url: this.$http.adornUrl('/flight/flightCharge'),
              method: 'POST',
              data: qs.stringify({
                'flightId': this.dataForm.flightId,
                'flightUrl': this.dataForm.flightUrl || undefined,
                'flightVolume': this.dataForm.flightVolume,
                'flightWeight': this.dataForm.flightWeight,
                'flightCost': this.dataForm.flightCost,
                'flightOthe': this.dataForm.flightOthe,
                'flightOtherCost': this.dataForm.flightOtherCost,
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
