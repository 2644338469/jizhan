<template>
  <div>
    <el-row class="operationimg">
    <draggable :list="this.dataForm"  @update="datadragEnd"  :options="{disable:'disable' ,chosenClose: 'chose',animation: 300,handle:'.dargDiv'}">
      <transition-group name="list-complete" >
        <div v-for="photo in dataForm" :key="photo" class="content">
              <span class="photo">
              <div class="dargDiv move">
                  <img v-if="photo" :src="photo"  class="avatar">
              </div>
              <div class="operation">
                <i class="el-icon-download" @click="downs(photo)"></i>
                <i class="el-icon-delete" @click="handleRemovecunzi(photo)"></i>
              </div>
              </span>
          </div>
      </transition-group>
    </draggable>
    </el-row>
    <el-row>
    <el-form  class="Submission" ref="this.dataForm2" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-upload
        action="http://jizhangyl.natapp1.cc/jizhangyl/common/upload"
        list-type="picture-card"
        name='file'
        :on-success="handleAvatarSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form>
    <el-button type="primary" @click="submitUpload()">确定</el-button>
    </el-row>
  </div>
</template>

<script >
import $ from 'jquery'
import draggable from 'vuedraggable'
import Sortable from 'sortablejs'
export default {
  components: {
            draggable,
        },
  data() {
      return {
        dataForm2: [],
        show: true,
        photoList: [],
        Imagelist: '',
        dialogImageUrl: '',
        dialogVisible: false,
        dataForm:[],
        providerId: '',
        imglist:[],
        oldList: [],
        newList: [],
        sortable: null,
        temp: [],
        dataFormCopy: [],
        imageorder:[],
      };
    }, 
    activated () {
      if(this.photoList == false){
          this.photo()
      }
      this.providerId = this.$route.query.providerId || 0
    },
    methods: {
        datadragEnd:function(evt){
        console.log('拖动前的索引：'+evt.oldIndex);
        console.log('拖动后的索引：'+evt.newIndex);
        const targetRow = this.dataForm.splice(evt.oldIndex, 1)
        this.dataForm.splice(evt.newIndex, 0, targetRow)
        this.dataForm.splice(evt.newIndex,0,this.dataForm.splice(evt.newIndex, 1))
        // for show the changes, you can delete in you code
        const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
        console.log("这里返回"+tempIndex)
        this.newList.splice(evt.newIndex, 0, tempIndex)
        this.temp = []
        for(let i=0;i<this.newList.length;i++){
         let indeximg = this.newList[i]
         let indexid = this.imageorder.indexOf(indeximg)
         this.temp.push(String(this.dataFormCopy[indexid]))
      }
      this.dataForm = this.temp
        },
     downs(imgsrc){
      window.open('http://jizhangyl.natapp1.cc/jizhangyl//common/download?imageUrl='+imgsrc)
    },
      photo() {
        this.$http({
          url: this.$http.adornUrl('shop/imageList?productId='+this.$route.query.providerId),
          methods: 'get'
        }).then((({data}) => {
          if (data && data.code === 0){
              this.photoList=data.data;
              for(let i = 0 ; i < this.photoList.length ; i++) {
                this.dataForm.push(this.photoList[i].imageUrl)
                this.dataFormCopy.push(this.photoList[i].imageUrl)
                this.imageorder.push(this.photoList[i].imageOrder)
              }
              this.oldList = this.photoList.map(v => v.imageOrder)
              this.newList = this.oldList.slice()
          }
        }))
      },
      handleAvatarSuccess(res, file) {
        this.dialogImageUrl = res.data;
        console.log(res.data);
        this.dataForm.push(this.dialogImageUrl);
        console.log(this.dataForm);
      },
      handleRemove(file, fileList) {
        console.log(file.response.data);
        this.dialogImageUrl = file.response.data;
        let index = this.dataForm.indexOf(this.dialogImageUrl);
        this.dataForm.splice(index,1);
        console.log(this.dataForm)
      },
      handleRemovecunzi(url) {
        let index = this.dataForm.indexOf(url);
        this.dataForm.splice(index,1);
        this.show = false
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      //图片提交
      submitUpload () {
        let photosub=[];
        console.log("提交图片");
        console.log(this);
        console.log(this.dialogImageUrl);
        console.log("这里的长度"+this.photoList.length)
        console.log("这里的长度"+this.dataForm.length)
        console.log(this.dataForm)
        for (let i = 0; i < this.dataForm.length; i++) {
          let objdata = new Object();
          console.log(this.dataForm[i]);
          objdata.imageUrl = this.dataForm[i];
          objdata.imageOrder = i + 1;
          photosub.push(objdata);
          console.log(this.imglist)
        };
        this.imglist = photosub;
        console.log(JSON.stringify(this.imglist));
        this.$http({
          url: this.$http.adornUrl('/shop/detailImageUpload'),
          method: 'POST',
          data: this.$http.adornData({
            'productId':this.providerId,
            'productImages':JSON.stringify(this.imglist)
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
    }
}

</script>
<style>
a{ 
text-decoration:none; 
color:#333; 
} 
.operation{
    position: absolute;
    color: #fff;
    font-size: 20px;
    bottom: 0;
    right: 3px;
}
.Submission{
  margin-bottom: 20px;
}
.operationimg{
  border:1px #ccc dashed;
  padding-top: 15px;
  padding-bottom: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}
.dargDiv{
  cursor:move;
}
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
 .photo {
   display: inline-flex;
   flex-direction: column  ;
   flex-wrap: wrap ;
   margin-left:12px;
   margin-bottom: 15px;
   position: relative;
 }
 .photo img {
   width:148px;
   height:148px;
   border-radius: 4px;
   border:1px #ccc dashed;
 }
 .operation i {
    border-radius: 2px;
    background: #2dd0bf;
}
 .content {
   display: inline
 }
 .sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
.icon-star{
  margin-right:2px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}
</style>
