import {DHXView} from "dhx-optimus";

export class TreeView extends DHXView{
	render(){

		let tree = this.ui = this.root.attachTree();

		tree.setIconSize(18,18);
		tree.setImagePath("codebase/imgs/tree/");
		tree.setXMLAutoLoadingBehaviour("function");

		tree.setXMLAutoLoading( (id) => {
			this._setFullId(decodeURIComponent(id));
			tree.load("server/tree.php?id="+id+"&full_id="+this.app.config.fullId);
		});

		tree.attachEvent("onClick", (id) => {
			let splId = id.split("^");

			this.app.config[splId[0]] = splId[1];
			this.app.config.hostName = tree.getItemText("host^"+this.app.config.host);
			this._setFullId(id);
				
			if(splId[0]=="table"){
				this.app.callEvent("loadTab",[id]);
			}
			return true;
		});

		tree.load("server/tree.php");



		this.attachEvent("onDelete",(id) => tree.deleteItem(id));
		this.attachEvent("onAdd",(id,host) => {
			tree.insertNewItem(0,id,host,null,"server.gif","server.gif","server.gif",null,true);
		});

	}
	_setFullId(id){
		var chain = [id];
		while ((id = this.ui.getParentId(id))){
			chain.push(id);
		}

		return this.app.config.fullId = chain.reverse().join("|");
	}

}