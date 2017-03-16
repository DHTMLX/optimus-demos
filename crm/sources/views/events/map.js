import {DHXView} from "dhx-optimus";

export class EventsMapView extends DHXView{
	render(){
		this.ui = this.root.attachMap();
		this.attachEvent("onEventSelect",  e =>this._load(e.lat,e.lng));
	}
	_load(lat,lng){
		this.ui.setCenter(new google.maps.LatLng(Number(lat), Number(lng)));
		this.ui.setZoom(11);
	}	
}
