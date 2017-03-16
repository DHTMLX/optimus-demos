import {DHXView} from "dhx-optimus";

export class TopbarView extends DHXView{
	render(){
		this.ui = this.root.attachToolbar({
			iconset: "awesome",
			skin: "dhx_web"
		});
		this.ui.setIconSize(32);
		this._load();
	}

	_load(){
		let struct = [
			{id:"add",type:"button",text:"",img:"fa fa-plus-circle"}
		];
		if(this.app.$device==="desktop"){
			struct = [
				{id:"title",type:"text",text:"<span class='topbar_title'>Contacts</span>"},
				{type:"spacer"},
				{id:"add",type:"button",text:"",img:"fa fa-plus-circle"},
				{id:"save",type:"button",text:"",img:"fa fa-floppy-o"}
			];
			this.attachEvent("onMenuSelect", e =>{
				this.ui.setItemText("title", `<span class='topbar_title'>${e.text}</span>`);
			});
		}

		this.ui.loadStruct(struct);
	}	
}
