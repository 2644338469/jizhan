<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="品牌名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  // import qs from 'qs'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          name: ''
        },
        dataRule: {
          name: [
            { required: true, message: '品牌名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (data) {
        this.visible = true
        this.dataForm.id = data || 0
        if (this.dataForm.id) {
          this.dataForm.id = data.id
          this.dataForm.name = data.name
        } else {
          this.dataForm.name = ''
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          let url = this.dataForm.id ? '/brand/update' : '/brand/save'
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(url),
              method: 'POST',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'name': this.dataForm.name,
                'level': 0
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
          }
        })
      }
    }
  }
</script>
