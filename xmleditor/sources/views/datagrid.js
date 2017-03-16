import { DHXView } from "dhx-optimus";

export class DataGridView extends DHXView {
	render() {

		this.ui = this.root.attachGrid({});

		this.attachEvent("onTabChange", () => this._load(this._id||this.app._top.id));
		this.attachEvent("onDataParse", () => this._load(this.app._top.id));
		this.attachEvent("onTreeClick", e  => {
			this._load(e);
			this._id = e;
		});

		this.ui.attachEvent("onEditCell", (stage,rId,cInd,nValue,oValue) => this._editCell(stage,rId,cInd,nValue,oValue) );
		this.ui.attachEvent("onRowSelect", rId =>{
			let id = this.ui.cells(rId,0).getValue();
			this.callEvent("onCellSelect",[{id:id}]);
		});
		
	}

	_load(id){
		this.ui.clearAll(true);
		this.ui.setHeader("Property,Value,");
		this.ui.setInitWidths("*,*,*");
		this.ui.setColTypes("ro,ed,ro");
		this.ui.init();

		let data=[];
		let attrs=this.app._ids[id].attrs;
		data.push(["Tag value",this.app._ids[id]["tag_value"]]);

		for (let a in attrs){
			data.push([a,attrs[a]]);
		}

		this.ui.parse(data,"jsarray");
	}

	_editCell(stage,rId,cInd,val,oldVal){
		if (stage===2){
			let prop = this.ui.cells(rId,0).getValue();

			if(rId===1){
				this.app._ids[this._id]["tag_value"] = val;
			}else{
				this.app._ids[this._id].attrs[prop] = val;
			}

			this.callEvent("onChangeCell",[{
				id:this._id,
				val,
				oldVal
			}]);
		}
		return true;
	}
}