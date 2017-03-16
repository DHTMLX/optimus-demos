import {DHXView} from "dhx-optimus";

export class LoadXmlWindow extends DHXView{
	render(){
		this.ui = this.root.dhxWins.createWindow({
			id: "creation",
			modal: true,
			center: true,
			width: 450,
			height: 280,
			text: "Load XML"
		});

		this.ui.button("park").hide();
		this.ui.button("minmax").hide();

		let form = this.ui.attachForm();

		form.loadStruct([
			{type: "settings", position: "label-right"},
			{type: "label", label: "Enter XML file URL",offsetLeft:80},
			{type: "block", width: "auto", blockOffset: 80,offsetTop:10, list: [
				{type: "input", name: "path", label: "", value: "../xml/demo.xml"},
				{type:"newcolumn"},
				{type: "button", value: "Load XML", position:"absolute",offsetTop:3},			
			]},
			{type: "label", label: "or Upload File",offsetLeft:80},
			{
				type: "upload", 
				name: "xml_file", 
				titleText:"Drag-n-Drop file here or click to select file for upload",
				url:"./server/upload.php?name=xml_file",
				autoStart:true,
				offsetLeft:50,
				width:350
			}	
		]);

		form.attachEvent("onButtonClick", ()=>{
			let data = form.getFormData();
			let path = data.path.trim();
			if (!path) {
				dhtmlx.alert({
					text: "You need to enter value in one of proposed fields."
				});
			} else {
				this.callEvent("onDataLoad",[{path:path}]);
				this.destroy();
			}
		});

		form.attachEvent("onUploadFile",(realName,serverName)=>{
			form.getUploader("xml_file").clear();
			this.callEvent("onDataLoad",[{path:serverName}]);
			this.destroy();
		});
		this.ui.show();
	}
}