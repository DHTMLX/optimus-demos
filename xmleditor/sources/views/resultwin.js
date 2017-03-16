import {DHXView} from "dhx-optimus";

export class ResultDialog extends DHXView{
	render(){
		this.ui = this.root.dhxWins.createWindow({
			id: "creation",
			modal: true,
			center: true,
			resize: false,
			park: false,
			width: 900,
			height: 600,
			text: "Result"
		});
		this.ui.attachHTMLString(`<textarea class='xml_result'>${this.app.buildXml().join("")}</textarea>`);
		this.ui.show();
	}
}