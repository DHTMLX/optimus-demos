import {DHXView} from "dhx-optimus";

export class CreateFolderWindow extends DHXView{
	render(){
		let win = this.root.dhxWins.createWindow({
			id:"newFolder",
			left:50,
			top:80,
			width:300,
			height:200,
			center:true,
			text:"Adding New Folder",
			modal:true
		});
		win.button("park").hide();
		win.button("minmax1").hide();

		let form = win.attachForm([
			{type: "input", name: "name", value: "", label: "Folder name",offsetLeft:30,offsetTop:30},
			{type: "button", name: "create", value: "Create", offsetLeft:100},
		]);

		form.attachEvent("onButtonClick", () => {
			var data = form.getFormData();
			let name = data.name.trim();
			if (name == "" || name.match(/^\.{1,}$/gi)) {
				dhtmlx.message({
					type: "alert-error",
					text: "You need to specify a folder name"
				});
			} else {
				this.app.addFolder(name);
			}
		});
		this.attachEvent("onAddFolder",() => win.close() );
		win.show();
	}
}