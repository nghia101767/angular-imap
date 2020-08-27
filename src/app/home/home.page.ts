import { Component } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
  map: any;

  infoWindows: any = [];
  markers: any = [
    {
      title: 'National Art Gallery',
      latitude: '-17.824991',
      longitude: '31.049295',
    },
    {
      title: 'West End Hospital',
      latitude: '-17.820987',
      longitude: '31.039682',
    },
  ];

  constructor() { }
  ionViewDidEnter() {
    this.showMap();
  }

  showMap() {
    const location = new google.maps.LatLng(-17.824858, 31.053028);
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true,
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.addMarkersToMap(this.markers);
  }

  addMarkersToMap(markers) {
    for (const marker of markers) {
      const pos = new google.maps.LatLng(marker.latitude, marker.longitude);
      const mapMarker = new google.maps.Marker({
        position: pos,
        title: marker.title,
        latitude: marker.latitude,
        longitude: marker.longitude
      });
      mapMarker.setMap(this.map);
      this.addInfoWindowToMarker(mapMarker);
    }
  }
  addInfoWindowToMarker(marker) {
    const infoWindowMContent = `
    <div id="content">
      <h2 id="firstHeading" class="firstHeading">${marker.title}</h2>
      <p>Latitube: ${marker.latitude}</p>
      <p>Longitude: ${marker.longitude}</p>
      <ion-button id="navigate">Navigate</ion-button>
    </div>`;
    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowMContent
    });
    marker.addListener('click', () => {
      this.closeAllInfoWindow();
      infoWindow.open(this.map, marker);
      google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
        document.getElementById('navigate').addEventListener('click', () => {
          console.log('navigation button clicked');
          window.open(`https://www.google.com/maps/dir/api=1&destination=${marker.latitude},${marker.longitude}`);
          
        });
      });
    });
    this.infoWindows.push(infoWindow);
  }
  closeAllInfoWindow() {
    for (const w of this.infoWindows) {
      w.close();
    }
  }
}
