import {DHXView} from "dhx-optimus";

import {TopMenuView} from "views/topmenu.js";
import {ToolbarView} from "views/toolbar.js";

import {SidebarView} from "views/folderstree.js";
import {FilesGridView} from "views/filesgrid.js";
import {DataGridView} from "views/datagrid.js";

import {FileWindow} from "views/filewin.js";
import {ImageWindow} from "views/imagewin.js";

import {AboutView} from "views/about.js";


export class TopView extends DHXView{
	render(){
		let top = this.root.attachLayout("2U");
		this.app.$filesView = "details";

		top.cells("a").setWidth(250);
		top.cells("a").setText("Folders");
		top.cells("b").hideHeader();

		this.addSlot("details", top.cells("b"));

		this.show(TopMenuView, 			top);
		this.show(ToolbarView, 			top);

		this.show(SidebarView, 			top.cells("a"));
		
		this._showAboutPage(top);

		this.attachEvent("onMenuClick", e =>{
			if(e.id==="about") this._showAboutPage(top);
		});

		this.attachEvent("onGridChange",() => this._setGridType(top));

		this.attachEvent("onPathChange",()=>{
			if(top.cells("b").getAttachedObject()===null){
				this._setGridType(top);
			}
		});

		this.attachEvent("onFileOpen", e =>{	
			if(e.type==="image"){
				this.show(ImageWindow, top);
			}else{
				this.show(FileWindow, top);
			}
		});
	}

	_setGridType(top){
		if(this.app.$filesView === "details"){
			this.show(FilesGridView, "details");
		}else{
			this.show(DataGridView,  "details");
		}
	}

	_showAboutPage(top){
		this.show(AboutView, top.cells("b"));
	}
}