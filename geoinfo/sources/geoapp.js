import "less/Geoapp.less";
import {DHXApp} from "dhx-optimus";
import {TopView} from "views/top.js";
class GeoApp extends DHXApp{
	render(){
		this.show(TopView);
	}
}

window.GeoApp = GeoApp;