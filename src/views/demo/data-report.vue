<template>
	<div class="mod-demo-echarts">
		<div class="top">
			<div>
					<el-form :inline="true"  @keyup.enter.native="getDataList()">
							<el-form-item>
										<el-date-picker
										v-model="date1"
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
							<el-button type="primary" @click="search()">查询数据</el-button>
						</el-form-item>  
						<el-form-item>
						<el-button type="primary" @click="exportAllData()">全站数据导出</el-button>
						</el-form-item>  
						<el-form-item>
						<el-button type="primary" @click="exportShop()">商品模块导出</el-button>
						</el-form-item>   
						<el-form-item>
						<el-button type="primary" @click="exportBuyer()">买手模块导出</el-button>
						</el-form-item>       
						<el-form-item>
							<el-button type="danger" @click="refresh()"><i class="el-icon-refresh refresh" ></i></el-button>
						</el-form-item>                                                                                                                                                                                                                                                                                     
						</el-form>
			</div>
		</div>
	    <el-row :gutter="20">
	    	<el-col :span="24">
					<h3>全站数据</h3>
	    		<el-table
			      :data="allData"
			      border
			      style="width: 100%;">
			      <el-table-column
			        prop="cost"
			        header-align="center"
			        align="center"
			        label="总货值">
			      </el-table-column>
			      <el-table-column
			        prop="taxes"
			        header-align="center"
			        align="center"
			        label="总关税">
			      </el-table-column>
			      <el-table-column
			        prop="costAndTaxes"
			        header-align="center"
			        align="center"
			        label="货值+关税">
			      </el-table-column>
			      <el-table-column
			        prop="freight"
			        header-align="center"
			        align="center"
			        label="总运费">
			      </el-table-column>
			      <el-table-column
			        prop="orderNums"
			        header-align="center"
			        align="center"
			        label="总订单数">
			      </el-table-column>
			      <el-table-column
			        prop="customerPrice"
			        header-align="center"
			        align="center"
			        label="全站客单价">
			      </el-table-column>
			    </el-table>
	    	</el-col>
	    	<el-col :span="12">
	    		<h3>商品</h3>
					<el-col>
	    		<el-table
					  :data="shopSales"
			      border
			      style="width: 100%;">
								<el-table-column  header-align="center" label="商品销售额">
									<el-table-column
										prop="shopName"
										header-align="center"
										align="center"
										label="商品名称">
									</el-table-column>
									<el-table-column
										prop="shopSales"
										header-align="center"
										align="center"
										label="销售额">
									</el-table-column>
								</el-table-column>
	    		</el-table>
					</el-col>
					<el-col>
					<el-table 
					 	:data="salesNum"	
						border
			      style="width: 100%;">
			      <el-table-column header-align="center" label="商品销量">
			      	<el-table-column
				        prop="shopName"
				        header-align="center"
				        align="center"
				        label="商品名称">
				    </el-table-column>
				    <el-table-column
				        prop="shopSalesNum"
				        header-align="center"
				        align="center"
				        label="销量">
				    </el-table-column>
			      </el-table-column>
			    </el-table>
					</el-col>
	    	</el-col>
	    	<el-col :span="12">
	    		<h3>买手</h3>
	    		<el-table
			      :data="buyerSales"
			      border
			      style="width: 100%;">
			      <el-table-column header-align="center" label="买手销售额">
			      	<el-table-column
				        prop="buyerName"
				        header-align="center"
				        align="center"
				        label="买手名称">
				      </el-table-column>
				      <el-table-column
				        prop="buyerSales"
				        header-align="center"
				        align="center"
				        label="销售额">
				      </el-table-column>
			      </el-table-column>
					</el-table>
					<el-table 
					:data="buyerOrdersNum"
			      border
			      style="width: 100%;">
							<el-table-column header-align="center" label="买手订单数">
								<el-table-column
									prop="buyerName"
									header-align="center"
									align="center"
									label="买手名称">
							  </el-table-column>
							  <el-table-column
									prop="orderNums"
									header-align="center"
									align="center"
									label="订单数">
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
    		allData:[
    		  {
    		  	cost: '',
		      	taxes: '',           
		      	costAndTaxes: '',   
		      	freight: '',    
		      	orderNums: '',        
		      	customerPrice: '' 
    		  }
				],
				datenow :'',
				before	:'',
				date1: [],
				beginDate: '',
				endDate: '',
				shopSales: [],
    		dataForm:[],
    		dataAllData:[],
				salesNum:[],
				Merchandise:[],
				buyerSales:[],
				buyerOrdersNum:[],
    		dataListLoading:false
			}
		},
		creted() {
				
		},
    activated () {
				this.getDataList()
    },
    methods: {
			 dateChange(val) {
				 if(val !== null){
				 let dateForm1 = new Date(this.date1[0])
				 let dateForm2 = new Date(this.date1[1])
				 this.beginDate = dateForm1.getFullYear()+ '-' + (dateForm1.getMonth() + 1) + '-' +dateForm1.getDate() + ' ' + dateForm1.getHours() + ':' + dateForm1.getMinutes() + ':' + dateForm1.getSeconds();  
				 this.endDate = dateForm2.getFullYear()+ '-' + (dateForm2.getMonth() + 1) + '-' +dateForm2.getDate() + ' ' + dateForm2.getHours() + ':' + dateForm2.getMinutes() + ':' + dateForm2.getSeconds();  			
				 console.log(this.beginDate)
				 console.log(this.endDate)
			}
			else {
				this.beginDate = ''
				this.endDate = ''
			}
			},
		 //刷新数据列表
			refresh () {
				this.beginDate = ''
				this.endDate = ''
				this.getDataList()
			},
			//按日期搜索数据列表
			search () {
				this.getDataList();
			},
			exportAllData(){
					window.open("https://www.jizhangyl.com/jizhangyl/count/exportAllData?beginDate="+this.beginDate+"&endDate="+this.endDate)
			},
			exportShop(){
					window.open("https://www.jizhangyl.com/jizhangyl/count/exportShop?beginDate="+this.beginDate+"&endDate="+this.endDate)
			},
			exportBuyer(){
					window.open("https://www.jizhangyl.com/jizhangyl/count/exportBuyer?beginDate="+this.beginDate+"&endDate="+this.endDate)
			},
				// 获取数据列表
      getDataList () {
				this.dataListLoading = true
        this.$http({
          url: 'https://www.jizhangyl.com/jizhangyl/count/fullSiteData',
					method: 'get',
					params: {
							'beginDate': this.beginDate, 
							'endDate' :	this.endDate
            }
        }).then(({data}) => {
          if (data && data.code === 0) {
						this.allData = data.data.allData
						this.salesNum = data.data.shop.salesNum
						this.shopSales = data.data.shop.shopSales
						this.buyerSales = data.data.buyer.buyerSales
						this.buyerOrdersNum = data.data.buyer.buyerOrdersNum
          } else {
            this.dataList = [],
            this.dataShop = [],
            this.dataBuyer = []
          }
          this.dataListLoading = false
        })
      }
  	}
  } 
</script>
<style>
  .el-date-editor .el-range-separator {
    width: 10% !important;
}
	.refresh {
		font-size: 16px;
	}
	
</style>
