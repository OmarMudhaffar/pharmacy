import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import * as $ from 'jquery'
import { DataviewService } from '../dataview.service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  items : Array<any> = [];

  constructor(public db : AngularFireDatabase,public auth : AngularFireAuth,
    public alert : AlertController,public toast : ToastController,
    public navCtrl : NavController,public dataView : DataviewService) {
    
      auth.authState.subscribe(user => {
        if(user != undefined){

      db.list("buy",ref=>ref.orderByChild("email").equalTo(user.email)).snapshotChanges().subscribe(data => {

        $(" .spinner").hide();
           if(data[0] == undefined){
             $(".notfound").show();
           }
           if(data[0] != undefined){
            $(".waiteload").hide();
            $(".mheader").fadeIn();
            $("footer").fadeIn();
          }
        this.items = data.slice().reverse();

        })
      }
      });

  }

  back(){
    this.navCtrl.navigateRoot("/home");
  }

  ngOnInit(){
    var winh = $(window).height();

    
     $(".waiteload").height(winh - (56 + 70))

  }

  async showToast(){
    var toast = await this.toast.create({
      duration:3000,
      message:"تم حذف قسيمة الشراء",
      cssClass:"alertdire"
    });
    return await toast.present();
   }
 
   async delete(key){
     var alert = await this.alert.create({
       subHeader:"هل تريد حذف قسيمة الشراء؟",
       buttons:[{text:"حذف",handler: ()=>{
       this.db.list("buy").remove(key).then( ()=> {
  
        this.showToast();
       });
       } },"الغاء"],
       cssClass:"alertdire"
     });
     await alert.present();
 }


 viewGps(lat,lng,name){

  this.dataView.changeData({
    lat:lat,
    lng:lng,
    name:name
  })


   this.navCtrl.navigateRoot("/gps")
 }

}
