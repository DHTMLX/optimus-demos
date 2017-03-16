import {DHXView} from "dhx-optimus";

export class FileWindow extends DHXView{
	render(){

		this.ui = this.root.dhxWins.createWindow({
			id:"newCon",
			left:50,
			top:80,
			width:800,
			height:600,
			center:true,
			text:"Preview",
			modal:true
		});
		
		this.ui.attachURL(`./server/getFile.php?file=${this.app.$currFile}`);
		this.ui.progressOn();
		this.ui.attachEvent("onContentLoaded", ()=> this.ui.progressOff());
		this.ui.show();
	}
}