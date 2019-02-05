import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as firebase from 'firebase/app';
import { DataviewService } from '../dataview.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  imageurl = "";


  mySelectedPhoto;
  loading;
  currentPhoto ;
  imgSource;
  data: any;
  constructor(public navCtrl : NavController,
    public db : AngularFireDatabase,
    public alert : AlertController,public load : LoadingController,
    public toast : ToastController,public dataView : DataviewService, private camera:Camera) { }

    ngOnInit() {
      this.dataView.serviceData.subscribe(data => {
       this.data = data;
      })
    }
  
  back(){
    this.navCtrl.navigateBack("/home");
  }

  async showToast(){
   var toast = await this.toast.create({
     duration:3000,
     message:"تم تعديل الدواء",
     cssClass:"alertdire"
   });
   return await toast.present();
  }

  async edit(key,name,price,short,des){
   var alert = await this.alert.create({
     subHeader:"هل تريد تعديل الدواء؟",
     buttons:[{text:"تعديل",handler: ()=>{
     this.db.list("medication").update(key,{
       name:name,
       price:price,
       des:des,
       short:short,
       img:this.data.img
     }).then( ()=> {
      this.navCtrl.navigateBack("/home");
      this.showToast();
     });
     } },"الغاء"],
     cssClass:"alertdire"
   });

   await alert.present();

  }

  async showLoad(message){
    var load = await this.load.create({
      message:message,
      cssClass:"loaddire"
      });
  
      return await load.present();
  }
  
  async hideLoad(){
    return await this.load.dismiss().then( ()=> console.log("dismsiees") );
  }

  
  takePhoto(){
    const options: CameraOptions = {
      targetHeight:720 ,
      targetWidth:720,
      quality:100, 
      destinationType : this.camera.DestinationType.DATA_URL,
      encodingType:this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY
    }

    
    this.camera.getPicture(options).then((imageData) =>{
      this.showLoad("جاري اضافة الصورة ")
  this.loading.present();
    this.mySelectedPhoto = this.dataURLtoBlob('data:image/jpeg;base64,'+imageData);
        this.upload();
            
            },(err)=>{
        alert(JSON.stringify(err));
            });
    
    
    }
    
        
        
    dataURLtoBlob(myURL){
        let binary = atob(myURL.split(',')[1]);
    let array = [];
    for (let i = 0 ; i < binary.length;i++){
        array.push(binary.charCodeAt(i));
    }
        return new Blob([new Uint8Array(array)],{type:'image/jpeg'});
    }    
        
        
    upload(){

      
    var char = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v"];
    var rand1 = Math.floor(Math.random() * char.length);
    var rand2 = Math.floor(Math.random() * char.length);
    var rand3 = Math.floor(Math.random() * char.length);
    var rand4 = Math.floor(Math.random() * char.length);
    var rand = char[rand1] + char[rand2] + char[rand3] + char[rand4];

    if(this.mySelectedPhoto){
        var uploadTask = firebase.storage().ref().child('images/'+rand+".jpg");
        var put = uploadTask.put(this.mySelectedPhoto);
        put.then( ()=> {
          this.hideLoad();

          uploadTask.getDownloadURL().then(url =>{
            
            this.data.img = url;
  
          });

        });

        put.catch(err =>{
          this.hideLoad()

          
        })
  

    }
    }    

}
