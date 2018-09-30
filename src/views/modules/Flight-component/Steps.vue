<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div>
        <el-steps :space="200"  finish-status="success">
            <el-step title="航班预定" @click.native="scheduled()" :status="this.data !== 3  ? 'success':'wait'"></el-step>
            <el-step title="打包包裹" @click.native="packProude()" :status="this.data.packPackageStatus === 1 ? 'success':'wait'"></el-step>
            <el-step title="包裹送机" @click.native="sendFlight()" :status="this.data.packageToAirportStatus === 1 ? 'success':'wait'"></el-step>
            <el-step title="实收航空费" @click.native="FlightConsuption()" :status="this.data.flightChargeStatus === 1 ? 'success':'wait'"></el-step>
            <el-step title="航班到港" @click.native="FlightArrived()" :status="this.data.flightArrivalStatus === 1 ? 'success':'wait'"></el-step>
            <el-step title="清关完毕" @click.native="Finish()" :status="this.data.customsClearanceStatus === 1 ? 'success':'wait'"></el-step>
        </el-steps>
        <FlightScheduled ref="FlightScheduled"  @refreshActive="refreshActives"></FlightScheduled>
        <PackProude ref="PackProde" @refreshActive="refreshActives"></PackProude>
        <SendFlight ref="SendFlight" @refreshActive="refreshActives"></SendFlight>
        <FlightConsuption ref="FlightConsuption" @refreshActive="refreshActives"></FlightConsuption>
        <FlightArrived ref="FlightArrived" @refreshActive="refreshActives"></FlightArrived>
        <Finish ref="Finish" @refreshActive="refreshActives"></Finish>
    </div>
  </el-dialog>
</template>

<script>
  // import qs from 'qs'
  import Finish  from './Finish'
  import FlightScheduled from './Flight-Scheduled'
  import PackProude from './Pack-Proude'
  import SendFlight from './Send-Flight'
  import FlightConsuption from './Flight-Consuption'
  import FlightArrived from './Flight-Arrived'
  export default {
    data () {
      return {
        visible: false,
        data: []
      }
    },
    components: {
        FlightScheduled,
        PackProude,
        SendFlight,
        FlightConsuption,
        FlightArrived,
        Finish
    },
    methods: {
      init (data) {
        this.visible = true
        this.data = data
        },
      add(){
          this.visible = true
          this.data = 3
        },
        refreshActives () {
          this.$emit('refreshData')
        },
 //航班预定
      scheduled() {
        this.$nextTick(() => {
        this.$refs.FlightScheduled.init(this.data)
        this.$refs.PackProde.close()
        this.$refs.SendFlight.close()
        this.$refs.FlightConsuption.close()
        this.$refs.FlightArrived.close()
        this.$refs.Finish.close()
          })
          },
    //包裹打包
      packProude() {
          this.$nextTick(() => {
          this.$refs.FlightScheduled.close()
          this.$refs.PackProde.init(this.data)
          this.$refs.SendFlight.close()
          this.$refs.FlightConsuption.close()
          this.$refs.FlightArrived.close()
          this.$refs.Finish.close()
          })
      },
      //包裹送机
      sendFlight() {
          this.$nextTick(() => {
          this.$refs.FlightScheduled.close()
          this.$refs.PackProde.close()
          this.$refs.SendFlight.init(this.data)
          this.$refs.FlightConsuption.close()
          this.$refs.FlightArrived.close()
          this.$refs.Finish.close()
          })
      },
    //实收航空费
      FlightConsuption() {
          this.$nextTick(() => {
          this.$refs.FlightScheduled.close()
          this.$refs.PackProde.close()
          this.$refs.SendFlight.close()
          this.$refs.FlightConsuption.init(this.data)
          this.$refs.FlightArrived.close()
          this.$refs.Finish.close()
          })
      },
      // 航班到岗
      FlightArrived() {
          this.$nextTick(() => {
          this.$refs.FlightScheduled.close()
          this.$refs.PackProde.close()
          this.$refs.SendFlight.close()
          this.$refs.FlightConsuption.close()
          this.$refs.FlightArrived.init(this.data)
          this.$refs.Finish.close()
          })
      },
      //清单完毕
      Finish() {
          this.$nextTick(() => {
          this.$refs.FlightScheduled.close()
          this.$refs.PackProde.close()
          this.$refs.SendFlight.close()
          this.$refs.FlightConsuption.close()
          this.$refs.FlightArrived.close()
          this.$refs.Finish.init(this.data)
          })

      },
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
  .mouse:hover {color:coral}
</style>

