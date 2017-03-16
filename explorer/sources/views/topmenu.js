import { DHXView } from "dhx-optimus";

export class TopMenuView extends DHXView {
	render() {
		this.ui = this.root.attachMenu({
			iconset: "awesome"
		});
		const struct = [
			{id:"fileTab",text:"File",items:[
				{id:"createTab",text:"Create",img:"fa fa-file-o",items:[
					{id:"folder", text:"Folder", enabled: false},
					{id:"text", text:"Text file", enabled: false},
					{id:"image", text:"Image", enabled: false}
				]},
				{id:"close", text:"Close"}
			]},
			{id:"editTab", text:"Edit",items:[
				{id:"undo", text:"Undo", enabled: false},
				{id:"undoSep",type:"separator"},
				{id:"copy", text:"Copy", enabled: false},
				{id:"cut", text:"Cut", enabled: false},
				{id:"paste", text:"Paste", enabled: false},
				{id:"pasteLink", text:"Paste as link", enabled: false},
				{id:"linkSep",type:"separator"},
				{id:"select", text:"Select all", enabled: false},
				{id:"invSelect", text:"Invert selection", enabled: false}
			]},
			{id:"viewTab", text:"View",items:[
				{id:"tool", text:"Toolbar", enabled: false},
				{type:"checkbox", id:"stat", text:"Statusbar", enabled: false},
				{id:"statSep",type:"separator"},
				{type:"radio",group:"a",id:"details", text:"Details",checked:true},
				{type:"radio",group:"a",id:"icons", text:"Icons"},
				{type:"radio",group:"a",id:"tiles", text:"Tiles"},
				{id:"tilesSep",type:"separator"},
				{id:"sortBy", text:"Sort by",items:[
					{id:"name", text:"Name", enabled: false},
					{id:"size", text:"Size", enabled: false},
					{id:"modDate", text:"Modified date", enabled: false}
				]},
				{ id:"refresh", text:"Refresh", enabled: false}
			]},
			{id:"helpTab", text:"Help",items:[
				{id:"support", text:"Support", enabled: false},
				{id:"license", text:"License terms", enabled: false},
				{id:"about", text:"About"}
			]}
		];
		this.ui.loadStruct(struct);
		this.ui.attachEvent("onClick", e => this.app.callEvent("onMenuClick",[{id:e}]) );
		this.attachEvent("onGridChange",()=>this.ui.setRadioChecked("a",this.app.$filesView));
	}
}