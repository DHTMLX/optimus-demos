import {DHXView} from "dhx-optimus";

export class AddChannelWin extends DHXView{
	render(){
		let win = this.ui = this.root.dhxWins.createWindow({
			id:"addChannel",
			left:50,
			top:80,
			width:400,
			height:300,
			center:true,
			text:"Adding New Channel",
			modal:true
		});
		win.button("park").hide();
		win.button("minmax1").hide();

		let form = win.attachForm([
			{type: "hidden", name: "action", value: "channelAdd"},
			{type: "block", width: "auto", blockOffset: 30, list: [
				{type: "settings", position: "label-left", labelWidth: 120, inputWidth: 240},
				{type: "input", name: "name", value: "", label: "Channel Name"},
				{type: "input", name: "link", value: "", label: "Channel Link",required:true},
				{type: "input", name: "tags", value: "", label: "Channel Tags"},
				{type: "button", value: "Add", offsetTop: 20, offsetLeft: 160}
			]}
		]);
		form.setValidation("name", "ValidAplhaNumeric");
		form.enableLiveValidation(true);
		form.attachEvent("onButtonClick",()=>this.app.uploadChannel(form.getFormData()).then(()=>win.close()));

		win.show();
	}
}