<template>
  <div class="block">
   	<div class="div-border clearfix">
   		<el-date-picker
      v-model="value7"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions2">
	    </el-date-picker>
	    <el-row>
			  <el-button type="primary" @click="CustomsExportOrder()">海关备案导出订单</el-button>
			</el-row>
   	</div>
   	<div class="div-border clearfix">
   		<el-date-picker
      v-model="value7"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions2">
	    </el-date-picker>
	    <el-row>
			  <el-button type="primary" @click="WarehouseExportOrder()">仓库打包导出订单</el-button>
			</el-row>
   	</div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        value6: '',
        value7: ''
      }
    },
    methods:{
    	CustomsExportOrder () {
        window.open('https://www.jizhangyl.com/jizhangyl/shop/export')
     },
     WarehouseExportOrder () {
        window.open('https://www.jizhangyl.com/jizhangyl/shop/export')
     }
    }
  }
</script>
<style type="text/css">
	.div-border{
		margin-bottom: 2em;
	}
	.el-date-editor .el-range-separator {
    width: 8%;
}
  .el-range-editor--medium.el-input__inner {
    float: left;
	}
	.el-row{
		float: left;
    margin-left: 20px;
	}
	.div-border:nth-of-type(2) .el-button--primary {
    color: #fff;
    background-color: #17b354d4;
    border-color: #17b354;
	}
</style>
