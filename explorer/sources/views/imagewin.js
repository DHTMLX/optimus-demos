import {DHXView} from "dhx-optimus";

export class ImageWindow extends DHXView{
	render(){
		this.ui = this.root.dhxWins.createWindow({
			id:"imgPrev",
			left:50,
			top:80,
			width:200,
			height:300,
			center:true,
			modal:true,
			resize:false,
			text:"Preview"
		});
		this.ui.button("park").hide();
		this.ui.button("minmax").hide();
		this.ui.setMinDimension(150, 100);

		this.ui.attachURL(`./server/getFile.php?file=${this.app.$currFile}`);
		this.ui.attachEvent("onContentLoaded", () =>{
			let img = this.ui.getFrame().contentDocument.querySelector("img");
			img.setAttribute("style","position: absolute;  top: 0; bottom:0; left: 0; right:0; margin: auto;" );
			let border = 100;
			this.ui.setDimension(img.offsetWidth+border,img.offsetHeight+border);
		});
	}
}