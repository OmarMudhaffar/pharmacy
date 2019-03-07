import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import * as $ from 'jquery'
import { AngularFireAuth } from '@angular/fire/auth';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {


  items : Array<any> = [];
  loading;
  myar = [];
  email;
  username : String;
   names = [];

  
  constructor(public navCtrl : NavController,
    public db : AngularFireDatabase,
    public auth : AngularFireAuth,public alert : AlertController,
    public toast : ToastController,
    private qrScanner: BarcodeScanner) { 

      auth.authState.subscribe(user => {
        if(user != undefined){
          this.email = user.email;

    db.list("cart",ref=>ref.orderByChild("email").equalTo(user.email)).snapshotChanges().subscribe(data => {

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
      this.myar = data.slice().reverse();

      data.forEach(data => {
        this.names.push(data.payload.val()["name"])
      });

    });

    db.list("users",ref => ref.orderByChild("email").equalTo(user.email)).valueChanges().subscribe(data => {
      this.username = data[0]["name"];
    })

  }


  })

  }


  ngOnInit(){
    var winh = $(window).height();

    
     $(".waiteload,.mheader").height(winh - (56 + 81))

  }



  back(){
    this.navCtrl.navigateBack("/home");
  }

  
  async showToast(){
    var toast = await this.toast.create({
      duration:3000,
      message:"تم حذف الدواء من سلتك",
      cssClass:"alertdire"
    });
    return await toast.present();
   }
 
   async delete(key){
     var alert = await this.alert.create({
       subHeader:"هل تريد حذف الدواء من السلة؟",
       buttons:[{text:"حذف",handler: ()=>{
       this.db.list("cart").remove(key).then( ()=> {
  
        this.showToast();
       });
       } },"الغاء"],
       cssClass:"alertdire"
     });
     await alert.present();
 }

 async buy(){

  var d = new Date();

  const monthNames = ["يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];
  
  var locations = [ 
    {title:"صيدلية جبل الزيتون",lat:"33.2696418",lng:"44.3756372"},
    {title:"صيدلية بيت الدواء",lat:"33.241252",lng:"44.3756372"},
    {title:"صيدلية ينبوع الشفاء",lat:"33.241252",lng:"44.3756372"},
    {title:"صيدلية زنوبيا",lat:"33.241252",lng:"44.3756372"},
   ];

   var random = locations[Math.floor(Math.random()*locations.length)];


  var alert = await this.alert.create({
    subHeader:"هل تريد شراء الادوية؟",
    buttons:[{text:"شراء",handler: ()=>{
      var text = "الادوية:" + this.names.toString().replace(",","20%|20%").replace(" ","20%|20%");
        this.db.list("buy").push({
          names:this.names,
          username:this.username,
          email:this.email,
          title:random.title,
          lat:random.lat,
          lng:random.lng,
          date: monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear(),
          qr:"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="+text
        }).then( ()=> {
          this.navCtrl.navigateRoot("/list");
          this.db.list("cart",ref=>ref.orderByChild("email").equalTo(this.email)).snapshotChanges().subscribe(data => {

            data.forEach(datas => {
              this.db.list("cart").remove(datas.key);
            })

          });
        }).catch(err => {
          prompt(err.meesage)
        });


    
    } },"الغاء"],
    cssClass:"alertdire"
  });
  await alert.present();

 }

}
