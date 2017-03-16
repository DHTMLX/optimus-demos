import {DHXView} from "dhx-optimus";

export class MobileSidebarView extends DHXView{
	render(){
		this.ui = new dhtmlXSideBar({
			parent: document.body,
			icons_path: "codebase/imgs/sidebar/",
			width: 180,
			template: "tiles",
			autohide: true,
			single_cell: true,
			header: true,
			offsets: {top: 0, right: 0, bottom: 0, left: 0}
		});
		this._load();
		this.ui.attachEvent("onSelect", e =>{
			this.app.callEvent("onMenuSelect",[{text:this.ui.cells(e).getText().text,id:e}]);
		});
		this.attachEvent("onAppRender",()=>{
			this.app.callEvent("onMenuSelect",[{text:this.ui.cells("contacts").getText().text,id:"contacts"}]);
		});
	}

	_load(){
		const struct = {
			items:[
				{
					id:"contacts",
					text: "Contacts",
					icon: "contacts.png",
					selected:true
				},
				{
					id:"projects",
					text: "Projects",
					icon: "projects.png"
				},
				{
					id:"events",
					text: "Events",
					icon: "events.png"
				},
				{
					id:"settings",
					text: "Settings",
					icon: "settings.png"
				}
			]
		};
		this.ui.loadStruct(struct);
	}
	
}
