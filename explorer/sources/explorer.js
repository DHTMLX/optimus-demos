import "less/fileexpapp.less";
import {DHXApp} from "dhx-optimus";
import {TopView} from "views/top.js";

class FileExpApp extends DHXApp{
	render(){
		this.show(TopView);
		this.$prevDir = [];
		this.$currDir = "";


		this.attachEvent("onToolbarClick", e =>{
			if(e.id==="back"){
				if(this.$prevDir.ind===0){
					return;
				}
				this.$currDir = this.$prevDir[--this.$prevDir.ind];
				this.callEvent("onPathChange",[{id:this.$currDir}]);
			}
			if(e.id==="forward"){
				if(this.$prevDir.ind === this.$prevDir.length-1){
					return;
				}
				this.$currDir = this.$prevDir[++this.$prevDir.ind];
				this.callEvent("onPathChange",[{id:this.$currDir}]);
			}
			if(e.id==="up"){
				let parent = this.getService("tree").getParent(this.$currDir);
				if(parent){
					this.checkPath(parent);
				}
			}
			const gridTypes = {"details":true,"icons":true,"tiles":true};
			if(gridTypes[e.id]&&this.$filesView!==e.id){
				this.$filesView = e.id;
				this.callEvent("onGridChange");
			}
		});

		this.attachEvent("onMenuClick", e =>{
			const gridTypes = {"details":true,"icons":true,"tiles":true};
			if(gridTypes[e.id]&&this.$filesView!==e.id){
				this.$filesView = e.id;
				this.callEvent("onGridChange");
			}
		});
	}
	

	checkPath(path){
		let ext = path.match(/\.([a-z0-9]{1,5})$/);

		if(ext!==null){
			this.$currFile = path;
			const formats = {"gif":1,"jpg":1,"png":1,"html":1,"shtml":1,"css":1,"xml":1,"txt":1,"php":1};

			if(!formats[ext[1]]){
				dhtmlx.alert({
					title:"Alert",
					type:"alert-error", 
					text:"There is no action associated with this file type"
				});
				return false;
			}

			let imgFormats = {"jpg":1,"png":1,"bmp":1,"gif":1};
			let type = imgFormats[ ext[1] ]===1?"image":"file";

			this.callEvent("onFileOpen",[{type:type}]);
			return false;

		}else{
			this.$prevDir.push(path);
			this.$prevDir.ind = this.$prevDir.length-1;
			this.$currDir = path;
			this.callEvent("onPathChange",[{id:path}]);

			return path;
		}
	}
}

window.FileExpApp = FileExpApp;