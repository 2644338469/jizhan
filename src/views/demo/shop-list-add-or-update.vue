<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="商品名称" prop="shopName">
        <el-input v-model="dataForm.shopName" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品JAN CODE" prop="shopJan">
        <el-input v-model="dataForm.shopJan" placeholder="商品JAN CODE"></el-input>
      </el-form-item>
      <el-form-item label="商品图片" prop="shopImage">
<!--<el-upload
          class="upload-demo"
          ref="upload"
          :action="url"
          name="shopImage"
          list-type="picture"
          :limit="1"
          :on-change="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-upload="handleBeforeUpload"
          :data="dataForm"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload> -->
          <el-upload
            class="avatar-uploader"
            action="http://jizhangyl.natapp1.cc/jizhangyl/common/upload"
            name="file"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="shopImage" :src="shopImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
      </el-form-item>
      <el-form-item label="商品库存" prop="shopCount">
        <el-input v-model="dataForm.shopCount" placeholder="商品库存"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="cateId">
        <el-select v-model="cate.id" placeholder="请选择">
          <el-option
            v-for="item in cateList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌分类" prop="brandId">
        <el-select v-model="brand.id" placeholder="请选择">
          <el-option
            v-for="item in brandList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="每箱入数" prop="shopXcount">
        <el-input v-model="dataForm.shopXcount" placeholder="每箱入数"></el-input>
      </el-form-item>
      <el-form-item label="商品规格" prop="shopFormat">
        <el-input v-model="dataForm.shopFormat" placeholder="商品规格"></el-input>
      </el-form-item>
      <el-form-item label="是否抛货" prop="isPaogoods">
        <el-switch
          v-model="dataForm.isPaogoods"
          active-text="是"
          inactive-text="否">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品净重量" prop="shopJweight">
        <el-col :span="4">
          <el-input v-model="dataForm.shopJweight" placeholder="商品净重量"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="商品打包重量" prop="shopDweight">
        <el-col :span="4">
          <el-input v-model="dataForm.shopDweight" placeholder="商品打包重量"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="商品颜色" prop="shopColor">
        <el-col :span="4">
          <el-input v-model="dataForm.shopColor" placeholder="商品颜色"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="商品长宽高(厘米cm)" prop="shopWhg">
        <template slot-scope="scope">
          <el-row :gutter="10">
            <el-col :span="4">
              <el-input
                size="small"
                width="80"
                placeholder="长(cm)"
                v-model="height">
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-input
                size="small"
                width="80"
                placeholder="宽(cm)"
                v-model="width">
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-input
                size="small"
                width="80"
                placeholder="高(cm)"
                v-model="gao">
              </el-input>
            </el-col>
          </el-row>
        </template>
      </el-form-item>
      <el-form-item label="商品供货价" prop="shopGprice">
        <el-input v-model="dataForm.shopGprice" placeholder="商品供货价"></el-input>
      </el-form-item>
      <el-form-item label="商品零售价" prop="shopLprice">
        <el-input v-model="dataForm.shopLprice" placeholder="商品零售价"></el-input>
      </el-form-item>
      <el-form-item label="报关金额" prop="bcPrice">
        <el-input v-model="dataForm.bcPrice" placeholder="报关金额"></el-input>
      </el-form-item>
      <el-form-item label="报关税率" prop="bcCess">
        <el-input v-model="dataForm.bcCess" placeholder="报关税率"></el-input>
      </el-form-item>
      <el-form-item label="海关商品分类编号" prop="customsCateType">
        <el-input v-model="dataForm.customsCateType" placeholder="海关商品分类编号"></el-input>
      </el-form-item>
      <el-form-item label="海关税则号列" prop="customsTariffLine">
        <el-input v-model="dataForm.customsTariffLine" placeholder="海关税则号列"></el-input>
      </el-form-item>
      <el-form-item label="海关商品唯一码" prop="customsProductId">
        <el-input v-model="dataForm.customsProductId" placeholder="海关商品唯一码"></el-input>
      </el-form-item>
      <el-form-item label="仓库打包识别码" prop="packCode">
        <el-input v-model="dataForm.packCode" placeholder="仓库打包识别码"></el-input>
      </el-form-item>
      <el-form-item label="朋友圈文案" prop="wenan">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="dataForm.wenan">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <!-- <el-button type="primary" @click="submitUpload()">确定</el-button> -->
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
        dataList: '',
        dataForm: {
          shopName: '',
          shopCount: '',
          shopJan: '',
          shopXcount: '',
          shopFormat: '',
          isPaogoods: 0,
          shopJweight: '',
          shopDweight: '',
          shopColor: '',
          shopGprice: '',
          shopLprice: '',
          bcPrice: '',
          bcCess: '',
          cateId: '',
          brandId: '',
          wenan: '',
          shopVolume: '',
          customsCateType: '',
          customsTariffLine: '',
          customsProductId: '',
          packCode: '',
          shopWhg: ''
        },
        productId: '',
        shopImage: '',
        cate: {
          id: '',
          name: ''
        },
        brand: {
          id: '',
          name: ''
        },
        width: '',
        height: '',
        gao: '',
        fileLenght: 0,
        cateList: [],
        brandList: [],
        url: 'http://jizhangyl.natapp1.cc/jizhangyl/shop/save',
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
          ],
          shopDweight: [
            { required: true, message: '商品打包重量不能为空', trigger: 'blur' }
          ],
          shopColor: [
            { required: true, message: '商品颜色不能为空', trigger: 'blur' }
          ],
          shopGprice: [
            { required: true, message: '商品供货价不能为空', trigger: 'blur' }
          ],
          shopLprice: [
            { required: true, message: '商品零售价不能为空', trigger: 'blur' }
          ],
          bcPrice: [
            { required: true, message: '报关金额不能为空', trigger: 'blur' }
          ],
          bcCess: [
            { required: true, message: '报关税率不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id,value) {
        console.log('jinru init'+'112')
        this.visible = true
        this.productId = id || 0
        this.getCateList()
        this.getBrandList()
        if (this.productId) {
          this.$http({
            url: 'http://jizhangyl.natapp1.cc/jizhangyl/shop/detail',
            method: 'get',
            params: {
              'id': this.productId
            }
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.id = this.productId
              this.dataForm.shopName = data.data.shop_name
              this.dataForm.shopJan = data.data.shop_jan
              this.dataForm.shopFormat = data.data.shop_format
              this.shopImage = data.data.shop_image
              this.dataForm.shopCount = data.data.shop_count
              this.dataForm.shopXcount = data.data.shop_xcount
              this.dataForm.isPaogoods = data.data.is_paogoods
              this.dataForm.shopGprice = data.data.shop_gprice
              this.dataForm.shopLprice = data.data.shop_lprice
              this.dataForm.shopColor = data.data.shop_color
              this.dataForm.shopDweight = data.data.shop_dweight
              this.dataForm.shopJweight = data.data.shop_jweight
              this.dataForm.bcCess = data.data.bc_cess
              this.dataForm.bcPrice = data.data.bc_price
              this.dataForm.customsCateType = data.data.customs_cate_type
              this.dataForm.customsTariffLine = data.data.customs_tariff_line
              this.dataForm.packCode = data.data.pack_code
              this.dataForm.customsProductId = data.data.customs_product_id
              this.dataForm.wenan = (data.data.wenan === undefined ? ''
                : data.data.wenan)
              this.shopWhg = data.data.shop_whg
              // let shopwhg = this.shopWhg.split('x')
              let shopwhg = []
              let whg =this.shopWhg
              if(whg.indexOf('x') !=-1){
                shopwhg = this.shopWhg.split('x')
              } else if(whg.indexOf('*') !=-1){
                shopwhg = this.shopWhg.split('*')
              }
              if (shopwhg.length > 0) {
                this.width = shopwhg[0]
                this.height = shopwhg[1]
                this.gao = shopwhg[2]
              }
              for (let i = 0; i < this.cateList.length; i++) {
                if (this.cateList[i].name === data.data.cate_name) {
                  this.cate.id = this.cateList[i].id
                }
              }
              for (let i = 0; i < this.brandList.length; i++) {
                if (this.brandList[i].name === data.data.brand_name) {
                  this.brand.id = this.brandList[i].id
                }
              }
              this.url = 'http://jizhangyl.natapp1.cc/jizhangyl/shop/update'
            } else {
              this.dataForm = []
            }
            this.dataListLoading = false
          })
        } else {
          this.url = 'http://jizhangyl.natapp1.cc/jizhangyl/shop/save'
          this.dataForm = []
          this.dataList = value
        }
      },
      dataFormSubmit () {
        if(this.productId){
          console.log('这是修改')
          console.log(this.cate.id)
          console.log(this.brand.id)
          this.$refs['dataForm'].validate((valid) => {
          this.dataForm.cateId = this.cate.id
          this.dataForm.brandId = this.brand.id
          this.dataForm.shopWhg = this.width + 'x' + this.height + 'x' + this.gao
          this.dataForm.isPaogoods = this.isPaogoods ? 1 : 0
          this.dataForm.shopVolume = this.width * this.height * this.gao
          console.log(!this.dataForm.id)
          console.log(this.dataForm.isPaogoods+'这是是否抛货')
          this.$http({
            url: this.$http.adornUrl('/shop/update'),
            method: 'POST',
            data: this.$http.adornData({
              'id': this.dataForm.id,
              'cateId': this.cate.id,
              'brandId': this.brand.id,
              'shopName': this.dataForm.shopName,
              'shopCount': this.dataForm.shopCount,
              'shopJan': this.dataForm.shopJan,
              'shopImage':this.shopImage,
              'shopXcount': this.dataForm.shopXcount,
              'shopFormat': this.dataForm.shopFormat,
              'isPaogoods': this.dataForm.isPaogoods,
              'shopJweight': this.dataForm.shopJweight,
              'shopDweight': this.dataForm.shopDweight,
              'shopColor': this.dataForm.shopColor,
              'shopGprice': this.dataForm.shopGprice,
              'shopLprice': this.dataForm.shopLprice,
              'bcPrice': this.dataForm.bcPrice,
              'bcCess': this.dataForm.bcCess,
              'wenan': this.dataForm.wenan,
              'shopWhg': this.dataForm.shopWhg,
              'shopVolume': this.dataForm.shopVolume,
              'customsCateType': this.dataForm.customsCateType,
              'customsTariffLine': this.dataForm.customsTariffLine,
              'customsProductId': this.dataForm.customsProductId,
              'packCode': this.dataForm.packCode
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
          })
        }else if(!this.productId){
          console.log('这是新增')
          this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let shopWhg = this.width + 'x' + this.height + 'x' + this.gao
            let shopVolume = this.width * this.height * this.gao
            this.dataForm.isPaogoods = this.isPaogoods ? 1 : 0
            this.$http({
              url: this.$http.adornUrl('/shop/save'),
              method: 'POST',
              data: this.$http.adornData({
                'cateId': this.cate.id,
                'brandId': this.brand.id,
                'shopName': this.dataForm.shopName,
                'shopCount': this.dataForm.shopCount,
                'shopJan': this.dataForm.shopJan,
                'shopImage': this.shopImage,
                'shopXcount': this.dataForm.shopXcount,
                'shopFormat': this.dataForm.shopFormat,
                'isPaogoods': this.dataForm.isPaogoods,
                'shopJweight': this.dataForm.shopJweight,
                'shopDweight': this.dataForm.shopDweight,
                'shopColor': this.dataForm.shopColor,
                'shopGprice': this.dataForm.shopGprice,
                'shopLprice': this.dataForm.shopLprice,
                'bcPrice': this.dataForm.bcPrice,
                'bcCess': this.dataForm.bcPrice,
                'wenan': this.dataForm.wenan,
                'shopWhg': shopWhg,
                'shopVolume': shopVolume,
                'customsCateType': this.dataForm.customsCateType,
                'customsTariffLine': this.dataForm.customsTariffLine,
                'customsProductId': this.dataForm.customsProductId,
                'packCode': this.dataForm.packCode
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
        
        // }
      },
      // 表单提交
      // dataFormSubmit () {
        
      // },
      cancel() {
        this.visible = false
        
      },
      getCateList () {
        this.$http({
          url: this.$http.adornUrl('/cate/list'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.cateList = data.data
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      getBrandList () {
        this.$http({
          url: this.$http.adornUrl('/brand/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': 1,
            'size': 200
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.brandList = data.data.data
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      handleRemove (file) {
        console.log(file)
      },
      handleBeforeUpload (file) {
        console.log(file)
      },
      handleSuccess (response, file) {
        console.log(response)
        console.log(file)
        console.log('success run')
        if (response.code === 0) {
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
          this.$message.error(response.msg)
        }
      },
      handlePreview (shopImage) {
        console.log('11111111')
        this.fileLenght++
        console.log(this.fileLenght)
      },
      handleAvatarSuccess(res, file) {
        this.shopImage = res.data;
        console.log(res.data)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>
<el-upload
  class="avatar-uploader"
  action="https://jsonplaceholder.typicode.com/posts/"
  :show-file-list="false"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload">
  <img v-if="shopImage" :src="shopImage" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
