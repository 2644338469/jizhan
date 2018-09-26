<template>
    <el-dialog
        :visible.sync="dialogVisible"
        width="50%"
        >
        <el-table
            :data="outData"
            height="250"
            border
            style="width: 100%">
            <el-table-column
            prop="fileName"
            label="文件名"
            width="180">
            </el-table-column>
            <el-table-column
            prop="importDate"
            label="导入时间"
            width="180">
            </el-table-column>
            <el-table-column
            prop="address"
            label="下载">
            <template slot-scope="scope">
                <el-button type="primary" :disabled="scope.row.orderStatus === 4 " round size="mini" @click="download(scope.row.importDate)">下载</el-button>
           </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        invitezi: '',
        outData: [],
        dialogVisible: false,
        tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }],
        dataForm: {
            importDate: '',
            fileName: '',
        }
      }
    },
    methods: {
    download(time) {
        window.open("http://jizhangyl.natapp1.cc/jizhangyl/order/report/exportForBusiness?t=1536896108035&type=develop&date="+time+"&inviteCode="+this.invitezi)

    },
    init(val) {
        this.dialogVisible = true
        this.$emit('refreshOutDataList')
        this.$http({
          // url: 'http://jizhangyl.natapp1.cc/jizhangyl/shop/list',
          url: this.$http.adornUrl('order/report/findImportList'),
          method: 'get',
          params: this.$http.adornParams({
            'inviteCode': val
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            for(let i = 0 ; i < data.data.length ; i++){
              this.outData.push(data.data[i])
            }
            this.invitezi = val
            console.log(this.outData)
          } else {
            alert("邀请码出现错误或者服务器异常");
          }
          this.dataListLoading = false
        })
    //     this.$http({
    //         url: 'http://jizhangyl.natapp1.cc/jizhangyl/shop/detail',
    //         method: 'get',
    //         params: {
    //           'inviteCode': this.inviteCode
    //         }
    // }),
}
},
}
</script>