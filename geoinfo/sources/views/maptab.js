import { DHXView } from "dhx-optimus";

export class MapView extends DHXView {
	render() {
		this.ui = this.root.attachMap();
		this._setMapPosition(0.105, 131.074, 10);
		this.attachEvent("onCountrySelect", e =>this._setMapPosition(e.lat, e.lng, e.zoom));
	}

	_setMapPosition(lat, lng, zoom){
		let myLatlng = new google.maps.LatLng(lat, lng);
		let myOptions = {
			zoom: zoom,
			center: myLatlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		this.ui.setOptions(myOptions);
	}
}