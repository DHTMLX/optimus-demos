import {DHXView} from "dhx-optimus";

import {TopbarView} from "views/topbar.js";

import {ConfigView} from "views/configgrid.js";
import {HierarchyView} from "views/hierarchy.js";

import {TabbarView} from "views/gridstabbar.js";

export class TopView extends DHXView{
	render(){
		let top = this.ui = this.root.attachLayout("3W");

		top.cells("a").setWidth(250);
		top.cells("b").setWidth(250);

		this.show(TopbarView,top);
		this.show(TabbarView,top.cells("c"));

		let order = this.app.getSettings().panels;
		if(order){
			this.show(ConfigView, 			top.cells("b"));
			this.show(HierarchyView, 		top.cells("a"));
		}else{
			this.show(ConfigView, 			top.cells("a"));
			this.show(HierarchyView, 		top.cells("b"));
		}

		this.attachEvent("onNewSettings", () => {
			this.refresh();
			this.callEvent("onDataParse");
		});
	}
}