<template>
  <div class="mod-demo-echarts">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchKeyword" placeholder="姓名或者身份证号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchPurchase()">查询</el-button>
        <el-button type="primary" @click="infoagain()">信息再次提醒</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="40"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        width="80"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="idNum"
        header-align="center"
        align="center"
        label="身份证号码">
      </el-table-column>
      <el-table-column
        prop="checkStatus"
        header-align="center"
        align="center"
        width="80"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.checkStatus === 1" size="small">已审核</el-tag>
          <el-tag v-if="scope.row.checkStatus === 0" size="small">待审核</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="openid"
        header-align="center"
        width="85"
        align="center"
        label="微信id">
      </el-table-column>
      <el-table-column
        prop="cardFront"
        header-align="center"
        align="center"
        label="身份证正面">
        <template slot-scope="scope">
          <!-- <img v-bind:src="scope.row.cardFront" style="height:100px;width:150px" /> -->
          <el-popover placement="top" width="400px" open-delay="500" transition="fade-in-linear" trigger="hover">
            <img v-bind:src="scope.row.cardFront" style="height:300px;width:450px"/>
            <img v-bind:src="scope.row.cardFront" slot="reference" style="height:100px;width:150px" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="cardRear"
        header-align="center"
        align="center"
        label="身份证背面">
        <template slot-scope="scope">
          <!-- <img v-bind:src="scope.row.cardRear" style="height:100px;width:150px" /> -->
          <el-popover placement="top" width="400px" open-delay="500" transition="fade-in-linear" trigger="hover">
            <img v-bind:src="scope.row.cardRear" style="height:300px;width:450px"/>
            <img v-bind:src="scope.row.cardRear" slot="reference" style="height:100px;width:150px" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="checkStatus"
        header-align="center"
        align="center"
        width="200"
        label="审核状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.checkStatus == 0 ? false : true" active-text="已审核" inactive-text="待审核" @change="handleSwitch(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="danger" round size="mini" @click="handleBohui(scope.row)">驳回</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './purchase-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          userName: ''
        },
        searchKeyword: '',
        totalNum: 0,
        value3: true,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/cert/checkCert'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'size': this.pageSize || 10
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.data.data
            this.totalPage = data.data.totalPage
            this.totalNum = data.data.totalPage * this.pageSize
          } else {
            this.dataList = []
            this.totalPage = 0
            this.totalNum = 0
          }
          this.dataListLoading = false
        })
      },
      //信息再次提醒
      infoagain () {
          this.$router.push({path: '/notify-List'})
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      handleSwitch (data) {
        console.log(data)
        if (data.checkStatus === 1) {
          return
        }
        this.$http({
          url: this.$http.adornUrl('/cert/confirm'),
          method: 'get',
          params: this.$http.adornParams({
            'id': data.id,
            'status': '1'
          })
        }).then(({data}) => {
          if (data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      handleBohui (data) {
        this.$http({
          url: this.$http.adornUrl('/cert/confirm'),
          method: 'get',
          params: this.$http.adornParams({
            'id': data.id,
            'status': '2'
          })
        }).then(({data}) => {
          if (data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
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
