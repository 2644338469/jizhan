<template>
	<div class="mod-demo-echarts">
	    <el-row :gutter="20">
	    	<el-col :span="12">
	    		<h3>入库</h3>
					<el-col>
						<el-table
							:data="inputData"
							border
							style="width: 100%;">
							<el-table-column  header-align="center" label="入库信息">
								<el-table-column
									prop="orderId"
									header-align="center"
									align="center"
									label="订单号">
								</el-table-column>
								<el-table-column
									prop="productQuantity"
									header-align="center"
									align="center"
									label="数量">
								</el-table-column>
								<el-table-column
									prop="createTime"
									header-align="center"
									align="center"
									label="时间">
								</el-table-column>
							</el-table-column>
						</el-table>
					</el-col>
	    	</el-col>
	    	<el-col :span="12">
	    		<h3>出库</h3>
	    		<el-table
			      :data="outputData"
			      border
			    >
			      <el-table-column header-align="center" label="出库信息">
			      	<el-table-column
				        prop="expressNum"
				        header-align="center"
				        align="center"
				        label="物流订单号">
				      </el-table-column>
				      <el-table-column
				        prop="productQuantity"
				        header-align="center"
				        align="center"
				        label="数量">
				      </el-table-column>
					  <el-table-column
				        prop="createTime"
				        header-align="center"
				        align="center"
				        label="时间">
				      </el-table-column>
			      </el-table-column>
				</el-table>
	    	</el-col>
	    </el-row>
	</div>
</template>
<script>
  export default {
    data () {
    	return {
			productId: '',
			inputData: [],
			outputData: []
			}
		},
		creted() {
				
		},
    activated () {
				this.getDataList()
    },
    methods: {
				// 获取数据列表
      getDataList () {
		this.productId = this.$route.query.providerId || 0
		this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/repository/product/deliveryDetail'),
					method: 'get',
					params: {
							'productId' : this.productId
            }
        }).then(({data}) => {
          if (data && data.code === 0) {
				this.inputData = data.data.inputData
				this.outputData = data.data.outputData
          } else {
				this.inputData = []
				this.outputData = []
          }
          this.dataListLoading = false
        })
      }
  	}
  } 
</script>