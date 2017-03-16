import { DHXView } from "dhx-optimus";

export class ConfigView extends DHXView {
	render() {
		this.root.setText("Config");
		this.ui = this.root.attachGrid({});
		this.ui.setHeader("XML tag,Use as value");
		this.ui.setInitWidths("100,*");
		this.ui.setColTypes("ro,coro");
		this.ui.init();

		this.attachEvent("onDataParse",() => this._load() );

		this.ui.attachEvent("onEditCell",(stage,id,ind,value) =>  this.changeTagVal(stage,id,ind,value) );
	}

	_load(){
		this.ui.clearAll();
		let data=[];

		for (let name in this.app._elements){
			data.push([name,"_tag_name_"]);
		}
		this.ui.parse(data,"jsarray");
	}
	changeTagVal(stage,id,ind,value){
		if (stage === 0){
			let c = this.ui.getCombo(1);
			c.clear();
			let attrs = this.app._elements[this.ui.cells(id,0).getValue()].attrs;
			c.put("_tag_name_","_tag_name_");
			c.put("_tag_value_","_tag_value_");
			for (let name in attrs){
				c.put(name,name);
			}
		}
		if (stage === 2){
			let el = this.app._elements[this.ui.cells(id,0).getValue()];
			this.callEvent("onChangeConfig",[{el:el,val:value}]);
			el._active = value;
		}
		return true;
	}
}