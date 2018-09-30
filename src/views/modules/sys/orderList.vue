<template>
  <div class="mod-demo-echarts">
    <el-form :inline="true" :rules="dataRule">
      <el-form-item>
	<el-date-picker
        v-model="datetime"
        @change="dateChange"							
        type="daterange"
        align="right"
        unlink-panels
        vale-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
        </el-date-picker>							
      </el-form-item>
      <el-form-item>
        <el-input v-model="content" placeholder="请输入物流单号或航班提运单号或买手邀请码" clearable size="large" style="width:359px"></el-input>
      </el-form-item>
      <el-form-item>
        <template>
            <el-select v-model="orderStatus" filterable placeholder="请选择">
                <el-option
                    v-for="item in status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </template>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="danger" @click="refresh()">刷新</el-button>
        <el-button @click="exportOrder()">导出订单</el-button>							
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="订单时间">
      </el-table-column>
      <el-table-column
        prop="inviteCode"
        header-align="center"
        align="center"
        label="买手邀请码">
      </el-table-column>
      <el-table-column
        prop="buyerName"
        header-align="center"
        align="center"
        label="买手名称">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        width="70"
        label="订单状态">
      </el-table-column>
      <el-table-column
        prop="expressNum"
        header-align="center"
        align="center"
        label="物流单号">
      </el-table-column>
      <el-table-column
        prop="deliveryNum"
        header-align="center"
        align="center"
        label="航班提运单号">
      </el-table-column>
      <el-table-column
        prop="costAndTaxes"
        header-align="center"
        align="center"
        width="150"
        label="货值+关税">
      </el-table-column>
      <el-table-column
        prop="freight"
        header-align="center"
        align="center"
        width="70"
        label="运费">
      </el-table-column>
      <el-table-column
        prop="deliveryTime"
        header-align="center"
        align="center"
        width="70"
        label="打包时间">
      </el-table-column>
      <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="70"
              label="订单详情">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goDetail(scope.row.orderId)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-size="pageSize"
      :total="totalNum"
      layout="total, prev, pager, next, jumper">
    </el-pagination>
    <Order-List-Details v-if="this.detail" ref="addOrUpdate" @refreshDataList="getDataList"></Order-List-Details>
  </div>
</template>

<script>
import OrderListDetails from './order-list-detail'
  export default {
    data () {
      return {
       status: [
	{
           value: '6',
           label: '查询所有'
         },
         {
           value: '1',
           label: '已付款未传身份证'
       },
       {
           value: '2',
           label: '待发货已传身份证'
       },
       {
           value: '3',
           label: '已发货'
       },
       {
           value: '4',
           label: '已收货'
       },
       {
           value: '5',
           label: '已取消'
       },
      
      ],
       orderStatus: '',
       content: '',
       pageIndex: 1,
       pageSize : 50,
       dataList:[],
       datetime:[],
       startTimeStr:'',
       endTimeStr:'',
       totalNum:'',
       totalPage:'',
       detail: false,
       dataListLoading:'',
       expressStatus:'',
       dataRule: {
          content: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ],
          orderStatus: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ],
        },
      }
    },
    components: {
      OrderListDetails
    },
    activated () {
      // this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          // url: 'https://www.jizhangyl.com/jizhangyl/shop/list',
          url: this.$http.adornUrl('order/findByExpressDeliveryInviteCodeStatus'),
          method: 'get',
          params: {
						'content': this.content,
            'status' : this.orderStatus,
            'page': this.pageIndex,
            'size': this.pageSize ,
	    'startTimeStr': this.startTimeStr,
            'endTimeStr':this.endTimeStr
            }
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.data.orderList
            this.totalPage = data.data.totalpage
            this.totalNum = data.data.totalItems
	    this.expressStatus = data.data.orderList.expressStatus
          } else {
            this.dataList = []
            this.totalPage = 0
            this.totalNum = 0
          }
          this.dataListLoading = false
        })
      },
      dateChange(val) {
				 if(val !== null){
				 let dateForm1 = new Date(this.datetime[0])
				 let dateForm2 = new Date(this.datetime[1])
				 this.startTimeStr = dateForm1.getFullYear()+ '-' + (dateForm1.getMonth() + 1) + '-' +dateForm1.getDate() + ' ' + dateForm1.getHours() + ':' + dateForm1.getMinutes() + ':' + dateForm1.getSeconds();  
         this.endTimeStr = dateForm2.getFullYear()+ '-' + (dateForm2.getMonth() + 1) + '-' +dateForm2.getDate() + ' ' + dateForm2.getHours() + ':' + dateForm2.getMinutes() + ':' + dateForm2.getSeconds();  			
         console.log(this.startTimeStr)
         console.log(this.endTimeStr)
			}
			else {
				this.startTimeStr = ''
				this.endTimeStr = ''
			}
			},
      //刷新功能
      refresh () {
        this.pageIndex = 1;
        this.pageSize = 10 ;
        this.$http({
          url: this.$http.adornUrl('order/flushOrderList'),
          method: 'get',
          params: {
            'page': this.pageIndex,
            'size': this.pageSize 
            }
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.data.orderList
            this.totalPage = data.data.totalpage
            this.totalNum = data.data.totalItems
          } else {
            this.dataList = []
            this.totalPage = 0
            this.totalNum = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 导出execle
      exportOrder () {
        window.open("https://www.jizhangyl.com/jizhangyl/order/exportOrderDetail?startTimeStr="+this.startTimeStr+"&endTimeStr="+this.endTimeStr)
      },
      // 产品缩略图
      // addThumbanilHandle (id) {
      //   this.addThumbanilVisible = true
      //   this.$nextTick(() => {
      //     this.$refs.addThumbanil.init(id)
      //     console.log(this.$refs.addThumbanil+'123456789')
      //   })
      // },
      // 删除
    
      goDetail (orderId) {
         this.detail = true
         console.log(orderId)
         this.$nextTick(() => {
         this.$refs.addOrUpdate.init(orderId)
        })
      }
    }
  }
</script>

<style lang="scss">
  .mod-demo-echarts {
    > .el-alert {
      margin-bottom: 10px;
    }
    > .el-row {
      margin-top: -10px;
      margin-bottom: -10px;
      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .chart-box {
      min-height: 400px;
    }
  }
</style>
<style>
  img{
    width:100%;
  }
</style>
