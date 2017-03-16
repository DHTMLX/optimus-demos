import { DHXView } from "dhx-optimus";

export class HierarchyView extends DHXView {
	render() {
		this.root.setText("Hierarchy");

		this.ui = this.root.attachTree();
	
		this.ui.setIconSize(18,18);
		this.ui.setImagePath(this.app.imagepath("tree"));
		this.ui.attachEvent("onClick", id => this.callEvent("onTreeClick",[id]) );

		this.attachEvent("onDataParse", ()=>this._load());
		this.attachEvent("onExpand", ()=>this._expand() );
		this.attachEvent("onChangeConfig", e => this._changeName(e));
		this.attachEvent("onChangeCell", e => {
			if(e.oldVal===this.ui.getItemText(e.id)){
				this.ui.setItemText(e.id,e.val);
			}
		});
		this.attachEvent("onCellSelect", e => this.ui.selectItem(e.id,true));
	}
		
	_load(){
		this.ui.deleteChildItems(0);
		if (this.app._top)
			this.ui.parse({ id:0, item:[this.app._top], text:""}, "json");
	}
	
	_expand(){
		this.ui.openAllItems(0);
	}
	
	_changeName(e){
		let el = e.el;
		let name = e.val;
		for (var i=0; i<el.length; i++){
			let obj;
			if(name==="_tag_value_"){
				obj = this.app._ids[el[i]]["tag_value"];
			}else if(name==="_tag_name_"){
				obj = this.app._ids[el[i]]["tag_name"];
			}else{
				obj = this.app._ids[el[i]].attrs[name] || "";
			}

			this.ui.setItemText(el[i],obj);
		}
	}
}