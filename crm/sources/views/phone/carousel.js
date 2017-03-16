import {DHXView} from "dhx-optimus";
import {TopbarView} from "views/topbar.js";
import {SecondTopbarView} from "views/phone/secondtopbar.js";

export class CarouselView extends DHXView{
	render(){
		this.ui = this.root.attachCarousel({
			offset_item: 0,
			keys: false,
			touch_scroll: false
		});

		this.ui.hideControls();
		this.ui.addCell("a");
		this.ui.addCell("b");

		this.show(TopbarView,		this.ui.cells("a"));
		this.show(SecondTopbarView, this.ui.cells("b"));

		this.attachEvent("onBackAction",()=>this.ui.goPrev());
		this.attachEvent("onContactSelect",()=>this.ui.goNext());
		this.attachEvent("onProjectSelect",()=>this.ui.goNext());
		this.attachEvent("onEventSelect",()=>this.ui.goNext());
		this.attachEvent("onSettingSelect",()=>this.ui.goNext());
	}
}
