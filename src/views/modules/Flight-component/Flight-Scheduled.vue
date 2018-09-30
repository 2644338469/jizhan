<template>
  <div v-if="visible">
      <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
        <el-form-item label="提运单号" prop="companyName">
          <el-input v-model="dataForm.deliveryNumber" type="small" placeholder="请输入提运单号"></el-input>
        </el-form-item>
        <el-form-item label="航次" prop="companyAbbr">
          <el-input v-model="dataForm.voyage" placeholder="航次"></el-input>
        </el-form-item>
        <el-form-item label="航班预计到达时间" prop="legalPerson" label-width="124px">
          <template>
            <div class="block">
              <el-date-picker
                v-model="value2"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </div>
          </template>
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
          deliveryNumber: '',
          voyage: '',
          flightId:''
        },
        value1: '',
        value2: '',
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
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/flight/flightReservation'),
              method: 'POST',
              data: qs.stringify({
                'flightId' :this.dataForm.flightId,
                'deliveryNumber': this.dataForm.deliveryNumber || undefined,
                'voyage': this.dataForm.voyage,
                'flightArriveTime': this.value2,
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
