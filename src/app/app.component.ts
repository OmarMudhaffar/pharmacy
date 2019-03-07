import { Component, ViewChild } from '@angular/core';

import { Platform, AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;


  admin = false;
  
  public appPages = [
    {
      title: 'الرئيسية',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'السلة',
      url: '/cart',
      icon: 'cart'
    },
    {
      title: 'المشتريات',
      url: '/list',
      icon: 'wallet'
    },

    {
      title: 'تسجيل خروج',
      icon: 'log-out'
    },
    {
      title: 'عن التطبيق',
      url: '/info',
      icon: 'help'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,public auth : AngularFireAuth,
    public alrt : AlertController, public navCtrl : NavController,
    public storeg : NativeStorage,private qrScanner: BarcodeScanner,
    public router : Router,
    public db : AngularFireDatabase
  ) {

    platform.backButton.subscribe( ()=> {
     if(this.routerOutlet && this.routerOutlet.canGoBack()){
       this.routerOutlet.pop();
     }else if(this.router.url == "/") {
      navigator['app'].exitApp();
     }else if(this.router.url == "/home") {
       navigator['app'].exitApp();
     }
    })

    this.auth.authState.subscribe(user => {
      if(user != null){
        this.navCtrl.navigateRoot("/home")
      }
      if(user == null){
        this.navCtrl.navigateRoot("/")
      }
    })

    statusBar.backgroundColorByHexString("#fff");

    this.initializeApp();

    auth.authState.subscribe(user => {

      if(user == undefined){
        navCtrl.navigateRoot("/");
      }

      if(user != undefined){
        if(user.email == "admin@admin.com"){
            this.admin = true;
            var addmidc = {
                title: 'اضافة دواء',
                url: '/add',
                icon: 'leaf'
            };
            var qr = {
              title: 'قارئ QR',
              url: '/qrcode',
              icon: 'qr-scanner'
            }
            this.appPages.unshift(qr);
            this.appPages.unshift(addmidc);
        }
      }
    })


  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      var lastTimeBackPress = 0; 
      var timePeriodToExit = 2000;
      
      

    });
  }

  ngOnInit(){
    this.storeg.getItem('email')
    .then(
      data => {


        if(data != undefined){
          this.navCtrl.navigateRoot("/home")
        }

      },
      error => console.error(error)
    );
  }


  async logout(){
    var alert = await this.alrt.create({
      subHeader:"هل تريد الخروج من الحساب؟",
      buttons:[
        {text:"خروج",handler : ()=>{
          this.auth.auth.signOut();
          this.navCtrl.navigateRoot("/")
          this.storeg.remove("email");
        }}
      ,"الغاء"],
      cssClass:"alertdire"
    });
    await alert.present();
  }

  async showAlert(text){

    var mytext : String = text;
    mytext.replace("20%"," ")

    var alert = await this.alrt.create({
      subHeader:text,
      cssClass:"alertdire",
      buttons:["حسنا"]
    });
    await alert.present();
  }

  qrScan() {
   
    this.qrScanner.scan().then(data => {
     this.showAlert(data.text.replace("20%"," ").replace(":"," : "));

     var url = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + data.text;
     this.db.list("buy",ref=> ref.orderByChild("qr").equalTo(url)).snapshotChanges().subscribe(all => {
       this.db.list("buy").remove(all[0].key);
     })
    })

}




}
