import {DHXView} from "dhx-optimus";

export class ToolbarView extends DHXView{
	render(){
		this.ui = this.root.attachToolbar();
		this.ui.setIconSize(24);
		this.ui.setIconsPath("codebase/imgs/toolbar/icons/");
		const struct = [
			{id:"channel_add", type:"button", img:"bar_channel_add.gif", imgdis:"bar_channel_add_dis.gif", title:"Add Channel"},
			{id:"channel_edit", type:"button", img:"bar_channel_edit.gif", imgdis:"bar_channel_edit_dis.gif", enabled:false, title:"Edit Channel"},
			{id:"channel_trash", type:"button", img:"bar_channel_trash.gif", imgdis:"bar_channel_trash_dis.gif", enabled: false, title:"Move Channel to Trash"},
			{id:"channel_restore", type:"button", img:"bar_channel_restore.gif", imgdis:"bar_channel_restore_dis.gif", enabled: false, title:"Restore Channel from Trash"},
			{id:"channel_remove", type:"button", img:"bar_channel_remove.gif", imgdis:"bar_channel_remove_dis.gif", enabled: false, title:"Remove Channel Completely"},
			
			{id:"sep01", type:"separator"},
			
			{id:"channel_stat", type:"button", img:"bar_channel_stat.gif", imgdis:"bar_channel_stat_dis.gif", enabled: false, title:"View Channel Statistics"},
			{id:"channel_trace", type:"button", img:"bar_channel_trace.gif", imgdis:"bar_channel_trace_dis.gif", enabled: false, title:"Trace Channel"},
			{id:"channel_trace_all", type:"button", img:"bar_channel_trace_all.gif", imgdis:"bar_channel_trace_all_dis.gif", title:"Trace All Channels"},
			
			{id:"sep02", type:"separator"},
			
			{id:"channel_move_up", type:"button", img:"bar_channel_move_up.gif", imgdis:"bar_channel_move_up_dis.gif", enabled: false, title:"Move Channel Up"},
			{id:"channel_move_down", type:"button", img:"bar_channel_move_down.gif", imgdis:"bar_channel_move_down_dis.gif", enabled: false, title:"Move Channel Down"}
		];
		this.ui.loadStruct(struct);
	
		this.ui.attachEvent("onClick", id =>this.app.callEvent("onToolbarClick",[{id:id}]));

		this.attachEvent("onTreeClicked", e =>{
			if(e.parent==="trash_channels"){
				this.ui.enableItem("channel_restore");
				this.ui.disableItem("channel_trash");
				this.ui.enableItem("channel_remove");
			}else{
				if(!e.readOnly){
					this.ui.disableItem("channel_restore");
					this.ui.enableItem("channel_trash");
					this.ui.enableItem("channel_remove");
					this.ui.enableItem("channel_edit");
				}else{
					this.ui.disableItem("channel_edit");
					this.ui.disableItem("channel_remove");
					this.ui.disableItem("channel_trash");
				}
				this.ui.enableItem("channel_stat");
				this.ui.enableItem("channel_trace");
				this.ui.enableItem("channel_trace_all");
			}
		});

		this.attachEvent("onUpdateArrows", e =>{
			if (e.up) {this.ui.enableItem("channel_move_up"); } else { this.ui.disableItem("channel_move_up"); }
			if (e.down) { this.ui.enableItem("channel_move_down"); } else { this.ui.disableItem("channel_move_down"); }			
		});
	}
}