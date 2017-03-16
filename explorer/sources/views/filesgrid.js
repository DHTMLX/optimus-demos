import { DHXView } from "dhx-optimus";
import { sizeFormat } from "helpers/format";

export class FilesGridView extends DHXView {
	render() {
		this.ui = this.root.attachGrid();

		this.ui.setIconsPath("codebase/imgs/grid/");
		this.ui.setHeader("&nbsp;,Name,Size,Type,Modified");
		this.ui.setColTypes("img,ro,ro,ro,ro"); 
		this.ui.setInitWidths("40,250,90,150,*");
		this.ui.setColAlign("center,left,right,left");
	
		this.attachEvent("onPathChange", e =>this._loadFiles(e.id));

		this.ui.attachEvent("onRowDblClicked", id =>this.app.checkPath(id));

		this.ui.attachEvent("onRowCreated",  id => {
			let size = this.ui.cells(id, 2).getValue();
			if (!isNaN(size) && size != "") this.ui.cells(id, 2).setValue(sizeFormat(size));
		});

		this._loadFiles(this.app.$currDir);
		this.ui.init();
	}

	_loadFiles(path){
		this.ui.clearAll();
		this.ui.load(`server/directoryContent.php?dir=${path}`);
	}
}
