import "less/filescmdapp.less";
import {DHXApp} from "dhx-optimus";
import {TopView} from "views/top.js";
import {folder} from "folder.js";

class FilesCommanderApp extends DHXApp{
	render(){
		this.$server = "server/dhxcmd_ajax.php";
		this.$activeWin = "a";
		this.$noActiveWin = "b";
		this.show(TopView);
		
		
		this.attachEvent("onMenuClick", e =>{
			
			switch(e.id){
				case "fileupload":
					break;
				case "filedownload":
					folder.download(this.$server,this.events,this.getStates(),false);
					break;
				case "filedownloadbzipped":
					folder.download(this.$server,this.events,this.getStates(),true);
					break;
				case "folderdetails":
					folder.getDetails(this.$server,this.events,this.getStates());
					break;

				case "foldercopy":
					folder.copy(this.$server,this.events,this.getStates(),false);
					break;
				case "filecopy":
					folder.copy(this.$server,this.events,this.getStates(),false);
					break;
				case "foldermove":
					folder.copy(this.$server,this.events,this.getStates(),true);
					break;
				case "filemove":
					folder.copy(this.$server,this.events,this.getStates(),true);
					break;

				case "fileremove":
					folder.remove(this.$server,this.events,this.getStates());
					break;
				case "folderremove":
					folder.remove(this.$server,this.events,this.getStates());
					break;						
			}
		});
		this.attachEvent("onGridKey", e =>{
			if(e.code===9){//tab
				this._toggleWin();
			}
		});
		this.attachEvent("onFolderSelect", e =>this.setActiveWin(e.root));
	}
	isTabActive(tabId){
		return tabId === this.$activeWin;
	}
	setActiveWin(winId){
		if(winId===this.$activeWin) return;
		this.$noActiveWin = this.$activeWin;
		this.$activeWin = winId;
	}
	getStates(){
		return{
			active:this.getService(this.$activeWin).getState(),
			noActive:this.getService(this.$noActiveWin).getState()
		};
	}
	_toggleWin(){
		this.setActiveWin(this.$noActiveWin);
		this.callEvent("onWinChange",[]);
	}
	addFolder(name){
		folder.add(this.$server,this.events,this.getStates(),name);
	}
}

window.FilesCommanderApp = FilesCommanderApp;