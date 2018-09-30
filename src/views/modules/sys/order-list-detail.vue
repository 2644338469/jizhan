<template>
  <el-dialog
    :title="详情信息"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-row :gutter="20">
	    <el-col :span="24">
		    <h3>商品信息</h3>
                <el-table
                :data="shopList"
                border
                v-loading="dataListLoading"
                style="width: 100%;">
                <el-table-column
                    prop="jancode"
                    header-align="center"
                    align="center"
                    label="Jan Code">
                </el-table-column>
                <el-table-column
		prop="img"
                    header-align="center"
                    align="center"
                    label="商品图片">
                    <template slot-scope="scope">
                        <img v-bind:src="scope.row.img" style="height:70px;width:70px" />
                    </template>
                </el-table-column>
                <el-table-column
                    prop="productName"
                    header-align="center"
                    align="center"
                    label="商品标题">
                </el-table-column>
                <el-table-column
                    prop="cost"
                    header-align="center"
                    align="center"
                    width="70"
                    label="售价">
                </el-table-column>
                <el-table-column
                    prop="taxes"
                    header-align="center"
                    align="center"
                    label="关税">
                </el-table-column>
                <el-table-column
                    prop="num"
                    header-align="center"
                    align="center"
                    label="数量">
                </el-table-column>
                </el-table>
        </el-col>
        <el-col :span="24">
           <h3>收件人信息</h3>
           <el-table
                :data="reveiverList"
                border
                v-loading="dataListLoading"
                style="width: 100%;">
                <el-table-column
                    prop="recipient"
                    header-align="center"
                    align="center"
                    label="收件人名">
                </el-table-column>
                <el-table-column
                    prop="recipientPhone"
                    header-align="center"
                    align="center"
                    label="电话">
                </el-table-column>
                <el-table-column
                    prop="recipientAddr"
                    header-align="center"
                    align="center"
                    label="详细地址">
                </el-table-column>
           </el-table>
        </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  import qs from 'qs'
  export default {
    data () {
      return {
        visible: false,
        shopList: [],
        reveiverList: [],
        orderId: ''
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.$http({
              url: this.$http.adornUrl('order/findOrderDetailByOrderId?orderId='+id),
              method: 'get',
            }).then(({data}) => {
              if (data && data.code === 0) {
                  this.shopList = data.data.shopList
                  this.reveiverList = data.data.reveiverList
                
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        
      },
    }
</script>
