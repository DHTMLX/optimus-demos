import {DHXView} from "dhx-optimus";

export class ConnectionDialog extends DHXView{
	render(){

		let win = this.ui = this.root.dhxWins.createWindow({
			id:"newCon",
			left:50,
			top:80,
			width:400,
			height:300,
			center:true,
			text:"Add new connection",
			modal:true
		});

		let form = win.attachForm([
			{type: "block", width: "auto", offsetLeft: 35, offsetTop: 30, list: [
				{type: "settings", labelWidth: 120},
				{type: "input", name: "server", label: "Server Name", value: "", required: true},
				{type: "input", name: "user", label: "User Name", value: ""},
				{type: "password", name: "pass", label: "Password", value: ""},
				{type: "button", name: "save", value: "Save", offsetLeft: 95, offsetTop: 30}
			]}
		]);

		form.attachEvent("onButtonClick", () => {
			var data = form.getFormData();
			if (data.server == "") {
				dhtmlx.message({
					type: "alert-error",
					text: "You need to specify a server name"
				});
			} else {
				dhx.ajax.get("server/connection.php?mode=add&server="+encodeURIComponent(data.server)+"&user="+encodeURIComponent(data.user)+"&pass="+encodeURIComponent(data.pass), (xml) => {
					if(xml.xmlDoc.responseText){
						this.app.callEvent("onAdd",[xml.xmlDoc.responseText,data.server]);
					}
					win.close();
				});
				
			}
		});

		win.show();
	}
}