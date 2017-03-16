import {DHXView} from "dhx-optimus";
import {MobileSidebarView} from "views/phone/sidebar.js";

import {ProgectView} from "views/projects/form.js";
import {ProjectLayoutView} from "views/projects/layout.js";

import {EventsDataView} from "views/events/data.js";
import {EventsMapView} from "views/events/map.js";

import {SettingsDataView} from "views/settings/grid.js";
import {SettingsFormView} from "views/settings/form.js";

import {ContactsGridView} from "views/contacts/grid.js";
import {ContactView} from "views/contacts/form.js";

import {CarouselView} from "views/phone/carousel.js";
export class MobileTopView extends DHXView{
	render(){
		let view = this.show(MobileSidebarView,this.root);
		let cont = this.show(CarouselView, view.ui.cells());
		
		this.attachEvent("onMenuSelect", e =>{
			cont.ui.cells("a").setActive();
			this.addSlot("left",  cont.ui.cells("a"));
			this.addSlot("right", cont.ui.cells("b"));

			switch(e.id){
				case("contacts"):
					this.show(ContactsGridView, "left");
					this.show(ContactView, 		"right");
					break;

				case("projects"):
					this.show(ProjectLayoutView, "left");
					this.show(ProgectView, 		 "right");
					break;
				case("events"):
					this.show(EventsDataView, 	"left");
					this.show(EventsMapView, 	"right");

					break;
				case("settings"):
					this.show(SettingsDataView, "left");
					break;
			}
		});

		this.attachEvent("onSettingSelect",() => 
			this.show(SettingsFormView, "right"));
	}

}