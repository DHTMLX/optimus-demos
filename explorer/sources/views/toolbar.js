import { DHXView } from "dhx-optimus";

export class ToolbarView extends DHXView {
	render() {
		this.ui = this.root.attachToolbar({
			icons_size: 24,
			iconset: "awesome"
		});
		const struct = [
			{id:"back",type:"button",text:"Back",img:"fa fa-arrow-left"},
			{id:"forward",type:"button",text:"",img:"fa fa-arrow-right"},
			{id:"up",type:"button",text:"",img:"fa fa-level-up"},
			{id:"search",type:"button",text:"Search",img:"fa fa-search"},
			{id:"folders",type:"button",text:"Folders",img:"fa fa-sitemap"},

			{id:"view",type:"buttonSelect",text:"Back",img:"fa fa-desktop",openAll:true,options:[
				{id:"details",type:"button",text:"Details"},
				{id:"icons",type:"button",text:"Icons"},
				{id:"tiles",type:"button",text:"Tiles"}
			]}
		];
		this.ui.loadStruct(struct);
		this.ui.attachEvent("onClick", e =>this.app.callEvent("onToolbarClick",[{id:e}]));
	}
}