import { Component } from '@angular/core';

import { Platform, AlertController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {


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
      url: '/about',
      icon: 'help'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,public auth : AngularFireAuth,
    public alrt : AlertController, public navCtrl : NavController,
    public storeg : NativeStorage,private qrScanner: BarcodeScanner
  ) {


    this.initializeApp();



  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit(){
    this.storeg.getItem('email')
    .then(
      data => {


        if(data == "admin@admin.com"){
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
    mytext.split("&&");

    var alert = await this.alrt.create({
      header:mytext[0],
      subHeader:mytext[1],
      message:mytext[2],
      cssClass:"alertdire"
    });
    await alert.present();
  }

  qrScan() {
   
    this.qrScanner.scan().then(data => {
     this.showAlert(data.text);
    })

}




}
