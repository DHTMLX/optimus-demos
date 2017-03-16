import {DHXView} from "dhx-optimus";
export class SQLTabView extends DHXView{

	render(){
		let toolbar = this.root.attachToolbar();
		toolbar.setIconsPath("codebase/imgs/");
		toolbar.loadStruct("codebase/xml/toolbar_query.xml");

		let grid = this.root.attachGrid();

		grid.setHeader("<textarea style = 'width: 100%; height: 80px;'>Type SQL query here</textarea>");
		grid.enableSmartRendering(true);
		grid.init();

		let area = grid.hdr.rows[1].cells[0].firstChild.firstChild;
		
		grid.attachEvent("onXLE",function() {
			grid.hdr.rows[1].cells[0].firstChild.appendChild(area);
			grid.setSizes();
		});

		let table = this.app.config.fullId;
		toolbar.attachEvent("onClick", (id) => {
			if(id=="close")
				this.root.close();
			
			if(id=="run_query"){
				let sql = area.value;		
				grid.post("server/sql.php","id="+table+"&sql="+sql);	
			}
		});
	}
}