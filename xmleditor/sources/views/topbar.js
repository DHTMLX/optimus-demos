import {DHXView} from "dhx-optimus";
import {LoadXmlWindow} from "views/loadxmlwin.js";
import {SettingsDialog} from "views/settingswin.js";
import {ResultDialog} from "views/resultwin.js";

export class TopbarView extends DHXView{
	render(){
		this.ui = this.root.attachToolbar({
			icons_size: 24,
			iconset: "awesome",
		});

		//buttons
		const struct = [
			{id:"expand",type:"button",text:"Expand",img:"fa fa-expand"},
			{id:"load_xml",type:"button",text:"Load XML",img:"fa fa-upload"},
			{id:"sep1",type:"separator"},

			{id:"result_xml",type:"button",text:"Get result XML",img:"fa fa-download",enabled:false},
			{id:"sep2",type:"separator"},

			{id:"settings",type:"button",text:"Settings",img:"fa fa-cog"}
		];
		this.ui.loadStruct(struct);
		
		//toolbar handlers
		this.ui.attachEvent("onClick", id => {
			switch(id){
				case "expand":
					this.callEvent("onExpand");
					break;
				
				case "load_xml":
					this.show(LoadXmlWindow, this.root);
					break;
				
				case "result_xml":
					this.show(ResultDialog, this.root);
					break;
				
				case "settings":
					this.show(SettingsDialog, this.root);
					break;
			}
		});

		//enable button after date loading
		this.attachEvent("onDataParse",() => this.ui.enableItem("result_xml"));
	}
}
