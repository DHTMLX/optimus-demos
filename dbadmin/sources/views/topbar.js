import {DHXView} from "dhx-optimus";
import {ConnectionDialog} from "views/dialog.js";

export class TopbarView extends DHXView{
	render(){
		this.ui = this.root.attachToolbar();

		this.ui.loadStruct("codebase/xml/buttons.xml");
		this.ui.setIconsPath("codebase/imgs/");
		
		this.ui.attachEvent("onClick", (id) => {
			this.app.callEvent("onTopbarClick", [id]);
			if(id == "delete_connection"){
				this._delete();
			}
			if(id == "add_connection"){
				this.show(ConnectionDialog, this.root);
			}
		});
	}

	_delete(){
		let host  = this.app.config.host;
		let hostName = this.app.config.hostName;
		let app = this.app;
		if(!host){
			dhtmlx.alert({
				title:"Alert",
				type:"alert-error", 
				text:"Select any connection"
			});
			return;
		}
		
		dhtmlx.message({
			title:"Alert",
			type:"confirm-warning", 
			text:"Are you sure you want to delete connection:"+ hostName,
			callback: function(r) {
				if (r == true){
					dhx.ajax.get("server/connection.php?mode=delete&server="+encodeURIComponent(host), function(xml){
						if(xml.xmlDoc.responseText){
							app.callEvent("onDelete",[xml.xmlDoc.responseText]);
						}
					});
				}
			}
		});
	}
}
