import {DHXView} from "dhx-optimus";
import {DataGridView} from "views/datagrid.js";
import {AllTagsGridView} from "views/alltagsgrid.js";

export class TabbarView extends DHXView {
	render() {
		this.root.setText("Config");
		this.ui = this.root.attachTabbar({ 
			tabs: [
				{id: "a", text: "Current tag only", active: true,width:200},
				{id: "b", text: "All similar tags", width:200}
			]
		});

		this.show(DataGridView,this.ui.tabs("a"));
		this.show(AllTagsGridView,this.ui.tabs("b"));

		this.ui.attachEvent("onTabClick",()=>this.callEvent("onTabChange",[]));
	}
}