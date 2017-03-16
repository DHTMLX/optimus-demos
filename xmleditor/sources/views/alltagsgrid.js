import {DataGridView} from "views/datagrid.js";

export class AllTagsGridView extends DataGridView {
	_load(id){

		let tag=this.app._ids[id].tag_name;
		let attrs=this.app._elements[tag].attrs;

		let names=["ID"]; 
		let types=["ro"]; 
		let widths=["0"];

		for (let a in attrs){
			names.push(a);
			types.push("ed");
			widths.push("100");
		}
		names.push("Tag value"); types.push("ed"); widths.push("*");
		
		this.ui.clearAll(true);
		this.ui.setHeader(names.join(","));
		this.ui.setInitWidths(widths.join(","));
		this.ui.setColTypes(types.join(","));

		this.ui.init();
		this.ui._id=id;

		let data=[];
		let rows=this.app._elements[tag];
		let sid=0;

		for (let i=0; i < rows.length; i++) {
			let el=this.app._ids[rows[i]];
			let temp=[rows[i]];
			for (let a in attrs){
				temp.push(el.attrs[a]);
			}
			temp.push(el.tag_value);
			data.push(temp);
			if (rows[i]===id) sid=i+1;
		}

		this.ui.parse(data,"jsarray");
		this.ui.selectRowById(sid);
		
	}

	_editCell(stage,rId,cInd,nValue,oValue){
		if (stage===2){

			let id = this.ui.cells(rId,0).getValue();
			let name = this.ui.getColumnLabel(cInd);

			if(name==="Tag value"){
				this.app._ids[id]["tag_value"] = nValue;
			}else{
				this.app._ids[id].attrs[name] = nValue;
			}

			this.callEvent("onChangeCell",[{id:id,val:nValue,oldVal:oValue}]);
		}

		return true;
	}
}