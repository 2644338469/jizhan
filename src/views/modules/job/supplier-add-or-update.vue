<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="公司日文名称" prop="companyName">
        <el-input v-model="dataForm.companyName" placeholder="请输入公司日文名称"></el-input>
      </el-form-item>
      <el-form-item label="公司简称" prop="companyAbbr">
        <el-input v-model="dataForm.companyAbbr" placeholder="公司简称"></el-input>
      </el-form-item>
      <el-form-item label="公司地址" prop="companyAddress">
        <el-input v-model="dataForm.companyAddress" placeholder="公司地址"></el-input>
      </el-form-item>
      <el-form-item label="公司法人" prop="legalPerson">
        <el-input v-model="dataForm.legalPerson" placeholder="公司法人"></el-input>
      </el-form-item>
      <el-form-item label="公司注册资本" prop="registeredFund">
        <el-input v-model="dataForm.registeredFund" placeholder="公司注册资本"></el-input>
      </el-form-item>
      <el-form-item label="公司开户银行" prop="depositBank">
        <el-input v-model="dataForm.depositBank" placeholder="公司开户银行"></el-input>
      </el-form-item>
      <el-form-item label="银行账户" prop="bankAccount">
        <el-input v-model="dataForm.bankAccount" placeholder="银行账户"></el-input>
      </el-form-item>
      <el-form-item label="采购联系人" prop="purchaseContact">
        <el-input v-model="dataForm.purchaseContact" placeholder="采购联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactPhone">
        <el-input v-model="dataForm.contactPhone" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item label="贷款到期" prop="loanDate">
        <el-input v-model="dataForm.loanDate" placeholder="贷款到期"></el-input>
      </el-form-item>
      <el-form-item label="公司编号" prop="providerNo">
        <el-input v-model="dataForm.providerNo" placeholder="如:88762385352 (11位)"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import qs from 'qs'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          providerId: '',
          companyName: '',
          companyAbbr: '',
          companyAddress: '',
          legalPerson: '',
          registeredFund: '',
          depositBank: '',
          bankAccount: '',
          purchaseContact: '',
          contactPhone: '',
          loanDate: '',
          providerNo: ''
        },
        dataRule: {
          companyName: [
            { required: true, message: '公司名不能为空', trigger: 'blur' }
          ],
          companyAbbr: [
            { required: true, message: '公司简称不能为空', trigger: 'blur' }
          ],
          companyAddress: [
            { required: true, message: '公司地址不能为空', trigger: 'blur' }
          ],
          legalPerson: [
            { required: true, message: '公司法人不能为空', trigger: 'blur' }
          ],
          registeredFund: [
            { required: true, message: '公司注册资本不能为空', trigger: 'blur' }
          ],
          depositBank: [
            { required: true, message: '开户银行不能为空', trigger: 'blur' }
          ],
          bankAccount: [
            { required: true, message: '银行号不能为空', trigger: 'blur' }
          ],
          providerNo: [
            { required: true, message: '公司编号不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (data) {
        this.visible = true
        this.dataForm.providerId = data.providerId || 0
        if (this.dataForm.providerId) {
          this.dataForm.providerId = data.providerId
          this.dataForm.companyName = data.companyName
          this.dataForm.companyAbbr = data.companyAbbr
          this.dataForm.legalPerson = data.legalPerson
          this.dataForm.companyAddress = data.companyAddress
          this.dataForm.registeredFund = data.registeredFund
          this.dataForm.depositBank = data.depositBank
          this.dataForm.bankAccount = data.bankAccount
          this.dataForm.purchaseContact = data.purchaseContact
          this.dataForm.contactPhone = data.contactPhone
          this.dataForm.loanDate = data.loanDate
          this.dataForm.providerNo = data.providerNo
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: 'https://www.jizhangyl.com/jizhangyl/product/provider/save',
              method: 'POST',
              data: qs.stringify({
                'providerId': this.dataForm.providerId || undefined,
                'companyName': this.dataForm.companyName,
                'legalPerson': this.dataForm.legalPerson,
                'companyAbbr': this.dataForm.companyAbbr,
                'companyAddress': this.dataForm.companyAddress,
                'registeredFund': this.dataForm.registeredFund,
                'depositBank': this.dataForm.depositBank,
                'bankAccount': this.dataForm.bankAccount,
                'purchaseContact': this.dataForm.purchaseContact,
                'contactPhone': this.dataForm.contactPhone,
                'loanDate': this.dataForm.loanDate,
                'providerNo': this.dataForm.providerNo
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
