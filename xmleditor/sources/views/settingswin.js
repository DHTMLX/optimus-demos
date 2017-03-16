import {DHXView} from "dhx-optimus";

export class SettingsDialog extends DHXView{
	render(){
		
		let win = this.ui = this.root.dhxWins.createWindow({
			id: "creation",
			modal: true,
			center: true,
			resize: false,
			park: false,
			width: 470,
			height: 350,
			text: "Settings"
		});
		
		let form = win.attachForm([
			{type: "settings", position: "label-right"},
			{type: "block", width: "auto", blockOffset: 80, list: [
				{type: "label", label: "Panels configuration"},
				{type: "block", width: "auto", list: [
					{type: "radio", name: "panels", value: true, label: "tree - config"},
					{type: "newcolumn"},
					{type: "radio", name: "panels", value: false, label: "config - tree", offsetLeft: 20}
				]},
				{type: "label", label: "Remove new lines in result"},
				{type: "block", width: "auto", list: [
					{type: "radio", name: "whitespace", value: true, label: "yes (slower)"},
					{type: "newcolumn"},
					{type: "radio", name: "whitespace", value: false, label: "no", offsetLeft: 20}
				]},
				{type: "label", label: "Skip empty attributes"},
				{type: "block", width: "auto", list: [
					{type: "radio", name: "attrs", value: true, label: "yes"},
					{type: "newcolumn"},
					{type: "radio", name: "attrs", value: false, label: "no", offsetLeft: 20}
				]},
				{type: "button", value: "Save Settings", offsetLeft: 80, offsetTop: 20}
			]}
		]);

		const settings = this.app.getSettings();
		
		form.setFormData({
			panels: (settings.panels),
			whitespace: (settings.whitespace),
			attrs: (settings.attrs)
		});

		form.attachEvent("onButtonClick", () => {
			let formData = form.getFormData();
			this.app.setSettings(formData);

			this.destroy();
		});

		win.show();
	}
}