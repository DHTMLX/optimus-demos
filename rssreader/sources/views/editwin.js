import {DHXView} from "dhx-optimus";

export class EditWindow extends DHXView{
	render(){
		let win = this.ui = this.root.dhxWins.createWindow({
			id:"editChannel",
			left:50,
			top:80,
			width:400,
			height:300,
			center:true,
			text:"Edit Channel",
			modal:true
		});
		win.button("park").hide();
		win.button("minmax1").hide();

		let form = win.attachForm([
			{type: "hidden", name: "action", value: "channelUpdate"},
			{type: "hidden", name: "channelId", value: ""},
			{type: "block", width: "auto", blockOffset: 30, list: [
				{type: "settings", position: "label-left", labelWidth: 120, inputWidth: 240},
				{type: "input", name: "name", value: "", label: "Channel Name"},
				{type: "input", name: "link", value: "", label: "Channel Link"},
				{type: "input", name: "tags", value: "", label: "Channel Tags"},
				{type: "input", name: "date", value: "", label: "Adding Date", readonly: true},
				{type: "input", name: "feeds", value: "", label: "Feeds Count", readonly: true},
				{type: "button", value: "Update", offsetTop: 20, offsetLeft: 145}
			]}
		]);

		win.progressOn();
		this.app.getChannelInfo().then( data =>{
			form.setFormData(data);
			win.progressOff();
		});
		form.attachEvent("onButtonClick",()=>this.app.uploadChannel(form.getFormData()).then(()=>win.close()));

		win.show();
	}
}