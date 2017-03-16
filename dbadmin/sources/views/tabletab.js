import {DHXView} from "dhx-optimus";
export class TableTabView extends DHXView{

	render(){
		let toolbar = this.root.attachToolbar();
		toolbar.setIconsPath("codebase/imgs/");
		toolbar.loadStruct("codebase/xml/toolbar_table.xml");


		this.root.setActive();

		let grid = this.root.attachGrid();
		let fullId = this.app.config.fullId;

		grid.load("server/datagrid.php?id="+fullId);

		let ui  = this.root;

		toolbar.attachEvent("onClick", function(id){
			if(id=="close")
				ui.close();
			
			if(id=="refresh_table")
				grid.load("server/datagrid.php?id="+fullId);
			
			if(id=="show_structure")
				grid.load("server/datagrid.php?id="+fullId+"&struct=true");
		});
	}
}