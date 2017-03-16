import { DHXView } from "dhx-optimus";
import { sizeFormat } from "helpers/format";

export class DataGridView extends DHXView {
	render() {

		dhtmlx.DataDriver.xml.records="/*/row";
		const types = {
			"tiles":{
				css: "ftiles",
				template: dhtmlx.Template.fromHTML(`<div class='ftiles_item'>
				<img onmousedown='return false;' class='ftiles_icon' border='0' src='{common.image()}'>
				<div class='dhx_item_text'>{common.text()}</div>
				<div class='dhx_item_text dhx_item_text_gray'>{common.size()}</div>
				</div>`),
				template_loading: dhtmlx.Template.fromHTML(""),
				width: 220,
				height: 88,
				margin: 0,
				padding: 0,
				image:  obj =>{
					return "./codebase/imgs/icons/"+obj.cell[0];
				},
				text:  obj =>{
					return obj.cell[1];
				},
				size:  obj =>{
					if (obj.cell[0].match(/^folder/)) return "Folder";
					return sizeFormat(obj.cell[2]);
				}
			},
			"icons":{
				css: "ficons",
				template: dhtmlx.Template.fromHTML(`<div class='ficons_item'>
				<img onmousedown='return false;' class='ficons_icon' border='0' src='{common.image()}'>
				<div class='dhx_item_text'>{common.text()}</div>
				</div>`),
				template_loading: dhtmlx.Template.fromHTML(""),
				width: 132,
				height: 110,
				margin: 0,
				padding: 0,
				image: function(obj){
					return `./codebase/imgs/icons/${obj.cell[0]}`;
				},
				text: function(obj){
					return obj.cell[1];
				}
			}
		};
		
		this.ui = this.root.attachDataView({	
			type: types[this.app.$filesView]
		});

		this.ui.attachEvent("onItemDblclick", id =>this.app.checkPath(id)); 
		this.attachEvent("onPathChange", e =>this._loadFiles(e.id));

		this._loadFiles(this.app.$currDir);
	}
	
	_loadFiles(path){
		this.ui.clearAll();
		this.ui.load(`server/directoryContent.php?dir=${path}`);
	}
}