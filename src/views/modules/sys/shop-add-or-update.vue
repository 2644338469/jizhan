<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="商品名称" prop="paramKey" v-if="dataForm.id">
        <el-input v-model="dataForm.productName" disabled="" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品JAN CODE" prop="paramValue" v-if="dataForm.id">
        <el-input v-model="dataForm.productJancode" disabled="" placeholder="商品JAN CODE"></el-input>
      </el-form-item>
      <el-form-item label="一箱数量" prop="remark" v-if="dataForm.id">
        <el-input v-model="dataForm.boxQuantity" disabled="" placeholder="一箱数量"></el-input>
      </el-form-item>
      <el-form v-if="!dataForm.id" >
        <el-form-item label="商品分类" >
          <el-autocomplete  popper-class="my-autocomplete" v-model="this.dataForm.productName" @change="queryChange" :trigger-on-focus="false" :fetch-suggestions="querySearch" placeholder="请输入商品jancode或名称" @select="handleSelect">
              <div v-for="item in suggestList" :key="item.productId" :value="item.productName" >
                <template>
                  <div class="addr">{{ item.productJancode }}</div>
                  <span class="name">{{ item.productName }}</span>
                </template>
              </div>
          </el-autocomplete>
      </el-form-item>
      </el-form>
      <el-form-item label="采购价" prop="cronExpression">
        <el-input v-model="dataForm.purchasePrice"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="cronExpression">
        <el-input v-model="dataForm.productStock"></el-input>
      </el-form-item>
      <el-form-item label="报价最后更新时间" prop="remark" v-if="dataForm.id">
        <el-input v-model="dataForm.updateTime" disabled=""></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
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
        suggestList:[],
        shopName:'',
        dataForm: {
          id: '',
          productName: '',
          productId: '',
          providerId: '',
          productStock: '',
          productJancode: '',
          boxQuantity: '',
          purchasePrice: '',
          updateTime: ''
        },
        cate: {
          id: '',
          name: ''
        },
        shop: {
          id: '',
          name: ''
        },
        cateList: [],
        shopList: [],
        dataRule: {
//          paramKey: [
//            { required: true, message: '参数名不能为空', trigger: 'blur' }
//          ],
//          paramValue: [
//            { required: true, message: '参数值不能为空', trigger: 'blur' }
//          ]
        }
      }
    },
    methods: {
      init (data) {
        this.dataForm.id = data || 0
        this.visible = true
        if (this.dataForm.id) {
          this.dataForm.id = data.id
          this.dataForm.productName = data.productName
          this.dataForm.productId = data.productId
          this.dataForm.providerId = data.providerId
          this.dataForm.productStock = data.productStock
          this.dataForm.productJancode = data.productJancode
          this.dataForm.boxQuantity = data.boxQuantity
          this.dataForm.purchasePrice = data.purchasePrice
          this.dataForm.updateTime = data.updateTime
        } else {
          this.dataForm.providerId = this.$route.query.providerId
          this.$http({
            url: this.$http.adornUrl('/cate/list'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.cateList = data.data
              console.log()
            } else {
              this.$message.error(data.msg)
            }
          })
        }
        

//        this.$nextTick(() => {
//          if (this.dataForm.id) {
//            this.$http({
//              url: this.$http.adornUrl(`/sys/config/info/${this.dataForm.id}`),
//              method: 'get',
//              params: this.$http.adornParams()
//            }).then(({data}) => {
//              if (data && data.code === 0) {
//                this.dataForm.paramKey = data.config.paramKey
//                this.dataForm.paramValue = data.config.paramValue
//                this.dataForm.remark = data.config.remark
//              }
//            })
//          }
//        })
      },
      //模糊查询
      querySearch (queryString, cb) {
        console.log('querySearch run ')
        this.$http({
          url: this.$http.adornUrl('/purchase/order/findByNameOrJan'),
          method: 'get',
          params: this.$http.adornParams({
            'param': queryString,
            'providerId': this.dataForm.providerId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.suggestList = data.data
            console.log(this.suggestList.length)
            cb(data.data)
          }
        })
      },
      handleSelect (item) {
        console.log('进入select事件')
        this.dataForm.productId = item.productId
        this.dataForm.productName = item.productName
        // let shop = {'productId': item.productId, 'productName': item.productName, 'productJancode': item.productJancode, 'productQuantity': ''}
        // this.shopInfo.push(shop)
        console.log(this.shopInfo)
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl('/product/provider/repoUpdate'),
                method: 'post',
                data: this.$http.adornData({
                  'id': this.dataForm.id,
                  'providerId': this.dataForm.providerId,
                  'productId': this.dataForm.productId,
                  'purchasePrice': this.dataForm.purchasePrice,
                  'productStock': this.dataForm.productStock
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
            } else {
              this.$http({
                url: this.$http.adornUrl('product/provider/repoAdd'),
                method: 'post',
                data: this.$http.adornData({
                  'providerId': this.dataForm.providerId,
                  'productId': this.dataForm.productId,
                  'purchasePrice': this.dataForm.purchasePrice,
                  'productStock': this.dataForm.productStock
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
          }
        })
      },
      cancel () {
        this.visible = false
        this.dataForm.productName='',
        this.dataForm.purchasePrice='',
        this.dataForm.productStock=''

      },
      getShopByCateId (id) {
        console.log(this.cate.id)
        if (id) {
          this.$http({
            url: this.$http.adornUrl('/shop/findByCateId'),
            method: 'get',
            params: this.$http.adornParams({
              'id': id,
              'page': 1,
              'size': 500
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.shopList = data.data.shopList
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      }
    }
  }
</script>
<style>
  .productName {

  }
  .addr {
    font-size: 12px;
    color: #b4b4b4
  }
  .name {
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>

