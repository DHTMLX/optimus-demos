import {DHXView} from "dhx-optimus";
import {TopbarView} from "views/topbar.js";
import {MainMenuView} from "views/sidebar.js";

import {ProgectView} from "views/projects/form.js";
import {ProjectLayoutView} from "views/projects/layout.js";

import {EventsDataView} from "views/events/data.js";
import {EventsMapView} from "views/events/map.js";

import {SettingsDataView} from "views/settings/grid.js";
import {SettingsFormView} from "views/settings/form.js";

import {ContactsGridView} from "views/contacts/grid.js";
import {ContactView} from "views/contacts/form.js";


export class TopView extends DHXView{
	render(){
		let top = this.root.attachLayout("3W");

		this.show(TopbarView,top);
		this.show(MainMenuView, top.cells("a"));
		top.cells("a").setWidth(200);
		top.cells("c").setWidth(330);
		
		top.forEachItem( cell =>{
			cell.hideHeader();
			cell.fixSize(true);
		});

		this.addSlot("left", top.cells("b"));
		this.addSlot("right", top.cells("c"));

		this.attachEvent("onMenuSelect", e =>{
			
			switch(e.id){
				case("contacts"):
					this.show(ContactsGridView, "left");
					this.show(ContactView, "right");
					break;

				case("projects"):
					this.show(ProjectLayoutView, "left");
					this.show(ProgectView, "right");
					break;
				case("events"):
					this.show(EventsDataView, "left");
					this.show(EventsMapView, "right");
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