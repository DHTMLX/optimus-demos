import {DHXView} from "dhx-optimus";

import {TopMenuView} from "views/topmenu.js";
import {ProjectsView} from "views/projects.js";
import {GridView} from "views/grid.js";

export class TopView extends DHXView{
	render(){
		this.header = document.createElement("div");
		this.header.innerHTML = "<img src='codebase/imgs/logo.png'/>";
		this.header.className = "pageHeader";

		let top = this.ui = this.root.attachLayout("2U");
		top.attachHeader(this.header, 65);

		this.show(TopMenuView,top);
		this.show(ProjectsView,top.cells("a"));
		this.show(GridView,top.cells("b"));
	
		top.cells("a").hideHeader();
		top.cells("a").setWidth(400);
		top.cells("a").fixSize(true);
		top.cells("b").hideHeader();
	}

	clean(){
		super.clean();

		//remove old header
		document.body.removeChild(this.header);
		this.header = null;
	}
}