import {DHXView} from "dhx-optimus";

export class SecondTopbarView extends DHXView{
	render(){
		this.ui = this.root.attachToolbar({
			iconset: "awesome",
			skin: "dhx_web"
		});
		this.ui.setIconSize(32);
		this._load();

		this.ui.attachEvent("onCLick", id =>{
			if(id==="back"){
				this.app.callEvent("onBackAction",[]);
			}
		});
		this.attachEvent("onMenuSelect", e =>{
			if(e.id==="events"||e.id==="settings"){
				this.ui.hideItem("save");
				this.ui.hideItem("remove");
			}
		});
	}
	_load(){
		this.ui.loadStruct([
			{type:"button",id:"back",img:"fa fa-arrow-circle-o-left"},
			{type:"separator"},
			{type:"button",id:"save",img:"fa fa-floppy-o"},
			{type:"button",id:"remove",img:"fa fa-minus-circle"}
		]);
	}
	
}
