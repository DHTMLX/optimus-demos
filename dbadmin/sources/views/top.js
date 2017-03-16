import {DHXView} from "dhx-optimus";
import {TreeView} from "views/tree.js";
import {TabbarView} from "views/tabbar.js";
import {TopbarView} from "views/topbar.js";

export class TopView extends DHXView{
	render(){
		let top = this.root.attachLayout("2U");

		top.cells("a").setWidth(300);
		top.cells("a").setText("Hierarchy");
		top.cells("b").fixSize(false, false);
		top.cells("b").hideHeader();

		this.show(TopbarView,  		top);
		this.show(TreeView, 		top.cells("a"));
		this.show(TabbarView, 		top.cells("b"));
	}
}