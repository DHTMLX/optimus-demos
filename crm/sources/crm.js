import "less/crmApp.less";
import "helpers/centerform.js";
import {device} from "helpers/device";
import {DHXApp} from "dhx-optimus";
import {TopView} from "views/top.js";

import {TabletTopView} from "views/tablet/top.js";
import {MobileTopView} from "views/phone/top.js";

class CRMApp extends DHXApp{

	render(){
		this.$device = device.getType();
		this.$landscape = device.getOrientation();

		if(this.$device==="phone") {
			this.show(MobileTopView);
		} else if(this.$device==="tablet") {
			this.show(TabletTopView);	
		} else {
			this.show(TopView);
		}
	}
}

window.CRMApp = CRMApp;