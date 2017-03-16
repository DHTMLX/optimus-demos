import {DHXView} from "dhx-optimus";

export class ProjectGridView extends DHXView{
	render(){
		this.ui = this.root.attachGrid();
		this.ui.attachEvent("onRowSelect", e =>{
			let data = {};
			this.ui.forEachCell(e,(cell,ind)=>data[this.ui.getColumnId(ind)] = cell.getValue());
			this.app.callEvent("onProjectSelect",[{data:data,id:e}]);
		});
		this.ui.attachEvent("onRowInserted",(r, index)=>{
			this.ui.setCellTextStyle(this.ui.getRowId(index), this.ui.getColIndexById("project"), "font-weight:bold;border-left-width:0px;");
		});
		this._load();
	}

	_load(){
		this.ui.load("codebase/data/projects.xml",()=>{
			if(this.app.$device==="desktop"){
				this.ui.selectRow(0,true);
			}
		});
	}
	
}
