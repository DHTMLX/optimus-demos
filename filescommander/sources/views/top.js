import {DHXView} from "dhx-optimus";

import {TopMenuView} from "views/topmenu.js";
import {FilesView} from "views/filesgrid.js";

import {CreateFolderWindow} from "views/createfolder.js";

export class TopView extends DHXView{
	render(){
		let top = this.root.attachLayout("2U");

		this.show(TopMenuView,top.cells("a"));
		this.show(TopMenuView,top.cells("b"));

		this.show(FilesView,top.cells("a"));
		this.show(FilesView,top.cells("b"));

		top.cells("a").setText("/");
		top.cells("b").setText("/");

		this.attachEvent("onMenuClick", e =>{
			if(e.id==="foldercreate"){
				new CreateFolderWindow(this.app,top).render();
			}
		});
	}
}