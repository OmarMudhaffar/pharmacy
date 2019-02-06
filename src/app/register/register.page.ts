import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController, LoadingController, ToastController, AlertController, MenuController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  constructor(public db : AngularFireDatabase,
    public load : LoadingController,public auth : AngularFireAuth,
    public toast : ToastController,public alert : AlertController,
    public navCtrl : NavController,public menu : MenuController,
    public storeg : NativeStorage,private googlePlus: GooglePlus) 
    { 

      menu.enable(false);

  
      this.storeg.getItem('email')
      .then(
        data => {
          if(data != undefined){
            navCtrl.navigateRoot("/home")
          }
        },
        error => console.error(error)
      );
    }

  ngOnInit() {

    var winh = window.innerHeight;
    var he = document.getElementById("mheader");
    he.style.height = winh.toString() + "px";

  }

  viewLogin(){
    $(".signupView").slideUp(100,function(){
      $(".loginView").slideDown(100);
    });
  }

  viewSignup(){
    $(".loginView").slideUp(100,function(){
      $(".signupView").slideDown(100);
    });
  }

  
  shoEye(){
    $("#showpass").hide();
    $("#hidepass").show();
    $("#password").attr("type","text");
  }

  hideEye(){
    $("#hidepass").hide();
    $("#showpass").show();
    $("#password").attr("type","password");
  }

  shoEyeTwo(){
    $("#showpassTwo").hide();
    $("#hidepassTwo").show();
    $("#passwordTwo").attr("type","text");
  }

  hideEyeTwo(){
    $("#hidepassTwo").hide();
    $("#showpassTwo").show();
    $("#passwordTwo").attr("type","password");
  }

 async showalert(message){
    var alert = await this.alert.create({
      subHeader: message,
      buttons: ['حسنا'],
      cssClass:"alertdire",

    });
    await alert.present();
  }

async showToast(message){
  var toast = await this.toast.create({
    duration:3000,
    message:message,
    cssClass:"alertdire"
  });
 await  toast.present();
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

    // register
  
    register(email,name:any,pass){
  
      
    var char = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v"];
    var rand1 = Math.floor(Math.random() * char.length);
    var rand2 = Math.floor(Math.random() * char.length);
    var rand3 = Math.floor(Math.random() * char.length);
    var rand4 = Math.floor(Math.random() * char.length);
    var rand = char[rand1] + char[rand2] + char[rand3] + char[rand4];

  
      if(email.length > 0 && pass.length > 0 && name.length > 0) {
  
  
        
        this.showLoad("جاري انشاء الحساب");

          
        var db = this.db.list("users",ref => ref.orderByChild("name").equalTo(name.toLowerCase())).snapshotChanges();
        var sub = db.subscribe(userche => {
  
        if(userche[0] == undefined){
  
          this.auth.auth.createUserWithEmailAndPassword(email,pass).then( ()=> {
  
            $("input").val("");
  
            
            this.db.list("users").push({
              email:email,
              name:name,
              image:"https://firebasestorage.googleapis.com/v0/b/vote-b1894.appspot.com/o/11906329_960233084022564_1448528159_a.jpg?alt=media&token=dd943fc8-1538-4ad5-88dd-a4db29fa069d",
              verified:false,
              id:rand
            })
    
          this.hideLoad();

          this.storeg.setItem("email",email);
    
          this.navCtrl.navigateRoot("/home")
    
    }).catch( err=> {
      this.hideLoad();
      if(err.message == "The email address is badly formatted."){
        this.showalert("بريد الكتروني غير صالح")
      }

      if(err.message == "The email address is already in use by another account."){
       this.showalert("بريد الكتروني مستخدم")
      }

      if(err.message == "A network error (such as timeout, interrupted connection or unreachable host) has occurred."){
        this.showalert("يرجى التحقق من الاتصال بلشبكة")
      }

    if(err.message == "Password should be at least 6 characters"){
      this.showalert("كلمة مرور قصيرة");
    }
    })
  
    sub.unsubscribe();
  
        }
  
        if(userche[0] != undefined){
          this.hideLoad();
          this.showToast("اسم المستخدم محجوز")
        }
  
        sub.unsubscribe();
  
        });
  
  
  
  }
  
    }




      
  login(email,pass){

    if(email.length > 0 && pass.length > 0) {
  
      this.showLoad("جاري تسجيل الدخول")

    this.auth.auth.signInWithEmailAndPassword(email,pass).then( ()=> {
  
      this.hideLoad();

      
      this.storeg.setItem("email",email);
    
      this.navCtrl.navigateRoot("/home")
  
    }).catch( err=> {
      this.hideLoad();
      if(err.message == "The password is invalid or the user does not have a password."){
        this.showalert("كلمة مرور غير صحيحة")
      }

      if(err.message == "There is no user record corresponding to this identifier. The user may have been deleted."){
        this.showalert("بريد الكتروني غير موجود")
      }

      if(err.message == "A network error (such as timeout, interrupted connection or unreachable host) has occurred."){
        this.showalert("يرجى التحقق من الاتصال بلشبكة")
      }

  
    })
  
    }
  
    }


    // fblogin(){

  
  
    //  this.fb.login(['email']).then( (res)=> {
    //   var crend = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    //   firebase.auth().signInWithCredential(crend).then(info => {
  
    //   this.showLoad("جاري المعالجة");
  
    //   this.db.list("users",ref => ref.orderByChild("email").equalTo(info.email)).valueChanges().subscribe(data => {
        
    //     if(data[0] == undefined){
    //       this.db.list("users").push({
    //         email:info.email,
    //         name:info.displayName,
    //       }).then( ()=> {
    //         this.navCtrl.navigateRoot("/home");
    //       })
    //       this.hideLoad();
  
    //     }
  
    //     if(data[0] != undefined){
    //       this.hideLoad();
    //       this.navCtrl.navigateRoot("/home");

    //     }
  
       
        
  
    //   })
  
    //   })
  
    //  })
  
    // }
    
    singUpGoogle(){


  
      this.googlePlus.login({
        'webClientId':"998801611393-rkso8atlfdfel0tn2e94duk9q11cguoh.apps.googleusercontent.com",
        'offline':true
      }).then(res => {
  
        this.showLoad("جاري المعالجة")
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken)).then(suc => {
          
          this.hideLoad();
  
          this.navCtrl.navigateRoot("/home");
  
          this.db.list("users",ref=>ref.orderByChild("email").equalTo(res.email)).valueChanges().subscribe(usercheck => {
            
            if(usercheck[0] == undefined){

              this.storeg.setItem("email",res.email);
  
              this.db.list("users").push({
                email:res.email,
                name:res.displayName,
              })
            
          }
  
          })
  
        }).catch(err => {
          this.hideLoad();
          alert(err.message);
        })
      })
    }
  
  
  

}
