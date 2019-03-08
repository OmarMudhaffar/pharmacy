import { Component, OnInit } from '@angular/core';

import { DataviewService } from '../dataview.service';

import {

  GoogleMap,
  Marker
} from '@ionic-native/google-maps/ngx';
import { Platform, NavController } from '@ionic/angular';




@Component({
  selector: 'app-gps',
  templateUrl: './gps.page.html',
  styleUrls: ['./gps.page.scss'],
})
export class GpsPage implements OnInit {

 
  gpsmap : GoogleMap;

  constructor(public platform : Platform,
    public dataView : DataviewService,public navCtrl:NavController) {

      this.dataView.serviceData.subscribe(data => {
        console.log(data);
        this.loadmap(data['lat'],data['lng'],data['title']);

       })

      

     }

     ngOnInit(){

     }


   
  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }

  
  loadmap(lat,lng,title){

  
    var map = this.gpsmap = new GoogleMap("gpsmap",{
          camera: {
            target: {
              lat: lat,
              lng: lng
            },
            zoom: 14,
            tilt: 30
          },
          controls: {
           zoom:true,
           myLocationButton:true,
           myLocation:true,
          },
          gestures : {
            scroll:true,
            tilt:true,
            zoom:true,
            rotate:true
          }

        });


  
            map.addMarker({
          title: title,
          icon: "green",
          animation: 'DROP',
          position: {
            lat:lat,
            lng:lng
          }
          }).then((marker: Marker) => {
    
          }).catch(err => {
            alert(err.message);
          });
  
  
  



      
      

  }

  
  back(){
    this.navCtrl.navigateBack("/home");
  }

}
