import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from '@ionic/angular';
import { DataviewService } from '../dataview.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {


  data: any;
  username;
  email;

  constructor(public navCtrl : NavController,
    public dataView : DataviewService,
    public alert : AlertController,public db : AngularFireDatabase,
    public toast : ToastController,public auth : AngularFireAuth) {

      auth.authState.subscribe(user => {
        if(user != undefined){
          this.email = user.email;
        }
      
    db.list("users",ref => ref.orderByChild("email").equalTo(user.email)).valueChanges().subscribe(data => {
      this.username = data[0]["name"];
    })
  })

  }

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
     message:"تم اضافة الدواء الى سلتك",
     cssClass:"alertdire"
   });
   return await toast.present();
  }

  async addToCart(img,name,short,des,price){
    var alert = await this.alert.create({
      subHeader:"هل تريد اضافة الدواء للسلة؟",
      buttons:[{text:"اضافة",handler: ()=>{
      this.db.list("cart").push({
        name:name,
        price:price,
        des:des,
        short:short,
        img:img,
        username:this.username,
        email:this.auth.auth.currentUser.email
      }).then( ()=> {
       this.navCtrl.navigateBack("/home");
       this.showToast();
      });
      } },"الغاء"],
      cssClass:"alertdire"
    });
    await alert.present();
}

}
