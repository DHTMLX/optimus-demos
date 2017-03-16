import { DHXView } from "dhx-optimus";

export class SidebarView extends DHXView {
	render() {
		let tree = this.ui = this.root.attachTreeView({
			root_id: "",
			iconset: "font_awesome",
			items: "server/directoryTree.php?id={id}"
		});

		this.ui.attachEvent("onSelect", e =>{
			if(this.ui.getSelectedId()){
				if(this.app.$currDir!==e){
					this.app.checkPath(e);
				}
			}
		});

		this.attachEvent("onPathChange", e =>{
			this.ui.openItem(e.id);
			this.ui.selectItem(e.id,true);
		});
		
		this.addService("tree",{
			getParent(dir){
				if(!dir) return;
				return tree.getParentId(dir);
			}
		});
	}
}