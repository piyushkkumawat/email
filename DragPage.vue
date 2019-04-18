<style>
  .top-div{
    padding: 40px 0px 100px 0;
    background-color:rgb(240, 240, 240);
    margin: 0 300px;
    border-radius: 10px;
    text-align:ceter;
  }

  .file-form{
    display: block;
    height: 200px;
    width: 400px;
    background: #ccc;
    margin: auto;
    margin-top: 40px;
    text-align: center;
    line-height: 200px;
    border-radius: 4px;
    margin-bottom: 50px;
  }

  div.file-listing{
    width: 400px;
    margin: auto;

    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  div.file-listing img{
    height: 100px;
  }

  div.remove-container{
    text-align: center;
  }

  div.remove-container {
    color: blue;
    background-color:#B0C4DE;
    margin: 10px 130px;
    font-size:10pt;
    padding: 10px 20px;
    border-radius: 10px;
    border:0;
    cursor: pointer;
    font-weight:bold;
  }

  .submit-button{
    color: blue;  
    background-color:#B0C4DE;
    margin: 20px 100px;
    font-size:10pt;
    padding: 10px 50px;
    border-radius: 10px;
    border:0;
    cursor: pointer;
    font-weight:bold;
  }

  .email-button{
    color: blue;  
    background-color:#B0C4DE;
    margin: 20px 100px;
    font-size:10pt;
    padding: 10px 50px;
    border-radius: 10px;
    border:0;
    cursor: pointer;
    font-weight:bold;
  }

</style>

<template>
<div class = "top-div">

  <div id="file-drag-drop">
    <form class="file-form" ref="fileform">
      <span class="drop-files">Drop the files here!</span>
    </form>


    <div v-for="(file, key) in files" class="file-listing">
      <img class="preview" v-bind:ref="'preview'+parseInt( key )"/>
      {{ file.name }}
      <div class="remove-container">
        <a class="remove" v-on:click="removeFile( key )">Remove</a>
      </div>
    </div>
    
      <button class="submit-button" v-on:click="submitFiles()" v-show="files.length > 0">Submit</button>
      <button class="email-button" data-toggle="modal" data-target="#myModal" v-show="files.length > 0">Submit & Send Email</button>
    
  </div>

  <!-- Modal -->
  <div class="modal fade" id="myModal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Enter Details</h4>
        </div>
        <div class="modal-body">


            <form ref="email-form">
            <div class="form-group">
              <label for="to">To:</label>
              <input type="text" class="form-control" ref="to" id="to">
            </div>
        
            <div class="form-group">
              <label for="frm">From:</label>
              <input type="text" class="form-control" ref="frm" id="frm">
            </div>
          
            <div class="form-group">
              <label for="sub">Subject:</label>
              <input type="text" class="form-control" ref="sub" id="sub">
            </div>

            <div class="form-group">
              <label for="msg">Message:</label>
              <input type="text" class="form-control" ref="msg" id="msg">
            </div>
          
            <button v-on:click="sendEmail()"  class="btn btn-default ">Send</button>
          </form>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
      
    </div>
  </div>

</div>

</template>

<script>
import axios from 'axios';
  export default {
    name:"DragPage",
    data(){
      return {
        dragAndDropCapable: false,
        files: [],
      }
    },

    mounted(){
      
      this.dragAndDropCapable = this.determineDragAndDropCapable();

      if( this.dragAndDropCapable ){
      
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( function( evt ) {
         
          this.$refs.fileform.addEventListener(evt, function(e){
            e.preventDefault();
            e.stopPropagation();
          }.bind(this), false);
        }.bind(this));

       
        this.$refs.fileform.addEventListener('drop', function(e){
         
          for( let i = 0; i < e.dataTransfer.files.length; i++ ){
            this.files.push( e.dataTransfer.files[i] );
            this.getImagePreviews();
          }
        }.bind(this));
      }
    },

    methods: {
     
      determineDragAndDropCapable(){
        
        var div = document.createElement('div');

        return ( ( 'draggable' in div )
                || ( 'ondragstart' in div && 'ondrop' in div ) )
                && 'FormData' in window
                && 'FileReader' in window;
      },

     
      getImagePreviews(){
        
        for( let i = 0; i < this.files.length; i++ ){
          
          if ( /\.(jpe?g|png|gif)$/i.test( this.files[i].name ) ) {
          
            let reader = new FileReader();

                       reader.addEventListener("load", function(){
              this.$refs['preview'+parseInt( i )][0].src = reader.result;
             }.bind(this), false);


            reader.readAsDataURL( this.files[i] );
          }else{
     
            this.$nextTick(function(){
              this.$refs['preview'+parseInt( i )][0].src = '/file-icon.jpg';
              this.$refs['preview'+parseInt( i )][0].height = "30px";
              this.$refs['preview'+parseInt( i )][0].width = "30px";

            });
          }
        }
      },

      
      submitFiles(){

        let formData = new FormData();

        for( var i = 0; i < this.files.length; i++ ){
          let file = this.files[i];

          formData.append('files[' + i + ']', file);
        }

        axios.post( 'http://localhost:5005/fileSave',
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
         
          }
        ).then(function(){
          alert("Files Uploaded");
        })
        .catch(function(){
          alert("File Uploading Failed");
        });
      },

      removeFile( key ){
        this.files.splice( key, 1 );
      },

      sendEmail(){

        let formData = new FormData();

        for( var i = 0; i < this.files.length; i++ ){
          let file = this.files[i];

          formData.append('files[' + i + ']', file);
        }
        formData.set('to',this.$refs.to.value);
        formData.set('frm',this.$refs.frm.value);
        formData.set('sub',this.$refs.sub.value);
        formData.set('msg',this.$refs.msg.value);
        axios.post( 'http://localhost:5005/sendEmail',
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
         
          }
        ).then(function(){
          alert("Files Uploaded");
        })
        .catch(function(){
          alert("File Uploading Failed");
        });
      }
    }
  }
</script>