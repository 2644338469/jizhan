<template>
  <div v-if="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
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
         flightId:''
        },
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
              url: this.$http.adornUrl('/flight/flightArrival'),
              method: 'POST',
              data: qs.stringify({
                'flightId':this.dataForm.flightId
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
