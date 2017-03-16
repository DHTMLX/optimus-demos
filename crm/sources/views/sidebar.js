import {DHXView} from "dhx-optimus";

export class MainMenuView extends DHXView{
	render(){
		this.ui = this.root.attachSidebar({
			template: "tiles",
			icons_path: "codebase/imgs/sidebar/"
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
