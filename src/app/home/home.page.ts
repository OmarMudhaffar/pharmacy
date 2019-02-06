import { Component } from '@angular/core';
import { NavController, AlertController, MenuController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import * as $ from 'jquery'
import { DataviewService } from '../dataview.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  items : Array<any> = [];
  admin = false;
  loading;
  myar = [];

  constructor(public db : AngularFireDatabase,
    public auth : AngularFireAuth,
    public navCtrl : NavController,public alert : AlertController,
    public menu : MenuController,public dataView : DataviewService,
    public toast : ToastController) {

      auth.authState.subscribe(user => {
        if(user != undefined){
          if(user.email == "admin@admin.com"){
            this.admin = true;
          }
        }
      })
      
      menu.enable(true);

      db.list("medication").snapshotChanges().subscribe(data => {

        $(" .spinner").hide();
           if(data[0] == undefined){
             $(".notfound").show();
           }
           if(data[0] != undefined){
            $(".waiteload").hide();
          }

        this.items = data.slice().reverse();
        this.myar = data.slice().reverse();
     
      });



    }



    ngOnInit(){
      var winh = $(window).height();

      
       $(".waiteload").height(winh - (56 + 70))
  
    }

    


    add(){
      this.navCtrl.navigateForward("/add")
    }

    
  initializeItems() {
    this.items = this.myar;
   }
 
   getItems(ev: any) {
     // Reset items back to all of the items
     this.initializeItems();
 
     // set val to the value of the searchbar
     const val = ev.target.value;
 
     // if the value is an empty string don't filter the items
     if (val && val.trim() != '') {
       this.items = this.items.filter((item) => {
         return (item.payload.val().name.toLowerCase().indexOf(val.toLowerCase()) > -1);
       })
     }
   }

   view(img,name,des,price,short){

    this.dataView.changeData({
      img:img,
      name:name,
      des:des,
      price:price,
      short:short
    })

     this.navCtrl.navigateForward("/view")

   }

   edit(key,img,name,des,price,short){

    this.dataView.changeData({
      img:img,
      name:name,
      des:des,
      price:price,
      short:short,
      key:key
    })

     this.navCtrl.navigateForward("/edit")

   }

   myCart(){
    this.navCtrl.navigateForward("/cart")
   }

   async showToast(){
    var toast = await this.toast.create({
      duration:3000,
      message:"تم حذف الدواء",
      cssClass:"alertdire"
    });
    return await toast.present();
   }
 
   async delete(key){
     var alert = await this.alert.create({
       subHeader:"هل تريد حذف الدواء ",
       buttons:[{text:"حذف",handler: ()=>{
       this.db.list("medication").remove(key).then( ()=> {
  
        this.showToast();
       });
       } },"الغاء"],
       cssClass:"alertdire"
     });
     await alert.present();
 }

 

}
