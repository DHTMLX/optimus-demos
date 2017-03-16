import {DHXView} from "dhx-optimus";

export class TopMenuView extends DHXView{
	render(){
		this.ui = this.root.attachToolbar({
			icon_path: "codebase/imgs/toolbar/dhx/"
		});

		this._load();
		this.$rootId = this.root.getId();
		this.attachEvent("onFolderSelect", e =>{
			if(e.root===this.$rootId){
				this._changeState(e.id,e.type,e.back);
			}else{
				this._toggleState([false,false,false,false,false,false,false,false,false,false,false]);
			}
		});
		this.ui.attachEvent("onClick", e =>this.app.callEvent("onMenuClick",[{id:e}]));
	}

	_load(){
		const struct = [
			{type:"button",id:"foldercreate" ,img:"folder_create.gif" , imgdis:"folder_create_dis.gif" ,title:"Create Folder"},
			{type:"button",id:"folderremove" ,img:"folder_remove.gif" , imgdis:"folder_remove_dis.gif" ,title:"Remove Folder",enabled: false},
			{type:"button",id:"folderdetails" ,img:"folder_details.gif" , imgdis:"folder_details_dis.gif" ,title:"Folder Details",enabled: false},
			{type:"separator"},
			{type:"button",id:"foldercopy" ,img:"folder_copy.gif" , imgdis:"folder_copy_dis.gif" ,title:"Copy Folder",enabled: false},
			{type:"button",id:"foldermove" ,img:"folder_move.gif" , imgdis:"folder_move_dis.gif" ,title:"Move Folder",enabled: false},
			{type:"separator"},

			{type:"button", id:"fileupload", img:"file_upload.gif", imgdis:"file_upload_dis.gif", title:"Upload File",enabled: false},
			{type:"button", id:"filedownload", img:"file_download.gif", imgdis:"file_download_dis.gif", title:"Download File",enabled: false},
			{type:"button", id:"filedownloadbzipped", img:"file_download_bzipped.gif", imgdis:"file_download_bzipped_dis.gif", title:"Download BZipped File",enabled: false},
			{type:"button", id:"fileremove", img:"file_remove.gif", imgdis:"file_remove_dis.gif", title:"Remove File",enabled: false},
			{type:"separator"},
			{type:"button", id:"filecopy", img:"file_copy.gif", imgdis:"file_copy_dis.gif", title:"Copy File",enabled: false},
			{type:"button", id:"filemove", img:"file_move.gif", imgdis:"file_move_dis.gif", title:"Move File",enabled: false}
		];
		this.ui.clearAll();
		this.ui.loadStruct(struct);
	}
	_changeState(id,type,back){
		if(!back){
			if(type==="folder"){
				this._toggleState([true,true,true,true,true,false,false,false,false,false,false]);
			}else{
				this._toggleState([true,false,false,false,false,false,true,true,true,true,true]);
			}	
		}else{
			this._toggleState([true,false,false,false,false,false,false,false,false,false,false]);
		}
	}
	_toggleState(state){
		const ids = ["foldercreate","folderremove","folderdetails","foldercopy","foldermove","fileupload","filedownload","filedownloadbzipped","fileremove","filecopy","filemove"];
		for(let i = 0;i<state.length;i++){
			if(state[i]){
				this.ui.enableItem(ids[i]);
			}else{
				this.ui.disableItem(ids[i]);
			}

		}
	}
}
