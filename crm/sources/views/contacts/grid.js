import {DHXView} from "dhx-optimus";

export class ContactsGridView extends DHXView{
	render(){
		this.ui = this.root.attachGrid();
		this._load();
			
		this.ui.attachEvent("onRowSelect", e =>{
			let data = {};
			this.ui.forEachCell(e, (cell,ind)=>data[this.ui.getColumnId(ind)] = cell.getValue());
			this.app.callEvent("onContactSelect",[{data:data}]);
		});
		this.ui.attachEvent("onRowInserted",(r, index)=>{
			this.ui.setCellTextStyle(this.ui.getRowId(index), this.ui.getColIndexById("name"), "font-weight:bold;border-left-width:0px;");
		});
	}
	
	_load(){
		this.ui.load("codebase/data/contacts.xml",()=>{
			if(this.app.$device==="desktop"){
				this.ui.selectRow(0,true);
			}
		});
	}
	
}
