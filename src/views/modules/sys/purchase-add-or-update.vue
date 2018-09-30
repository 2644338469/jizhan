<template>
  <el-dialog
    :title="!orderId.id ? '新增' : '入库'"  
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="选择供应商" prop="shopName">
        <el-select v-model="supplier.providerId" @change="supplierChange" placeholder="请选择">
          <el-option
            v-for="item in supplierList"
            :key="item.providerId"
            :label="item.companyName"
            :value="item.providerId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="货款帐期" prop="loanDate">
        <el-input v-model="dataForm.loanDate" placeholder="货款帐期"></el-input>
      </el-form-item>
      <el-form-item label="选择商品">
        <el-autocomplete popper-class="my-autocomplete" v-model="shopName" @change="queryChange" :trigger-on-focus="false" :fetch-suggestions="querySearch" placeholder="请输入商品jancode或名称" @select="handleSelect">
          <template slot-scope="{ item }">
            <div class="mouse">
              <div class="addr">{{ item.productJancode }}</div>
              <span class="name">{{ item.productName }}</span>
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-table v-if="shopInfo.length" :data="shopInfo" border style="width: 100%">
        <el-table-column fixed prop="productJancode" label="商品JAN CODE">
        </el-table-column>
        <el-table-column prop="productName" label="商品名称">
        </el-table-column>
        <el-table-column prop="productQuantity" label="采购数量" width="80">
          <template slot-scope="scope">
            <el-input v-model="scope.row.productQuantity" size="mini" placeholder="请输入采购数量"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="deleteShop(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitUpload()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  // import qs from 'qs'
  export default {
    data () {
      return {
        restaurants: [],
        shopName: '',
        visible: false,
        dataForm: {
          shopName: '',
          loanDate: ''
        },
        query: '',
        orderId: '',
        supplier: {
          providerId: '',
          companyName: ''
        },
        suggestList: [],
        brand: {
          id: '',
          name: ''
        },
        fileLenght: 0,
        supplierList: [],
        shopInfo: [],
        dataRule: {
          shopName: [
            { required: true, message: '商品名不能为空', trigger: 'blur' }
          ],
          shopCount: [
            { required: true, message: '商品库存不能为空', trigger: 'blur' }
          ],
          shopJan: [
            { required: true, message: '商品JAN CODE不能为空', trigger: 'blur' }
          ],
          shopJweight: [
            { required: true, message: '商品净重量不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.orderId = id || 0
        this.getSupplierList()
      },
      submitUpload () {
        console.log(JSON.stringify(this.shopInfo))
        this.$http({
          url: this.$http.adornUrl('/purchase/order/create'),
          method: 'POST',
          data: this.$http.adornData({
            'providerId': this.supplier.providerId,
            'loanDate': this.dataForm.loanDate,
            'items': JSON.stringify(this.shopInfo)
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
      getSupplierList () {
        console.log('getCatelist')
        this.$http({
          url: this.$http.adornUrl('/product/provider/findAll'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.supplierList = data.data
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      queryChange (data) {
        console.log(data)
      },
      supplierChange (data) {
        console.log(data)
      },
      isNumber (val) {
        var regPos = /^\d+(\.\d+)?$/
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/
        if (regPos.test(val) || regNeg.test(val)) {
          return true
        } else {
          return false
        }
      },
      deleteShop (data) {
        console.log(this.shopInfo)
        for (var i = 0; i < this.shopInfo.length; i++) {
          if (this.shopInfo[i].productId === data.productId) {
            this.shopInfo.splice(i, 1)
          }
        }
        console.log(this.shopInfo)
      },
      querySearch (queryString, cb) {
        console.log('querySearch run ')
        if (!this.supplier.providerId) {
          this.$message.error('请先选择供应商')
          return
        }
        this.$http({
          url: this.$http.adornUrl('/purchase/order/findByNameOrJan'),
          method: 'get',
          params: this.$http.adornParams({
            'param': queryString,
            'providerId': this.supplier.providerId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.suggestList = data.data
            cb(data.data)
          }
        })
      },
      handleSelect (item) {
        console.log('进入select事件')
        this.shopName = item.productName
        let shop = {'productId': item.productId, 'productName': item.productName, 'productJancode': item.productJancode, 'productQuantity': ''}
        this.shopInfo.push(shop)
        console.log(this.shopInfo)
      }
    }
  }
</script>
<style>
.mouse:hover {color:coral}
  .el-scrollbar{
    width:477px
  }
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
</style>