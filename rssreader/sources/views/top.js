import {DHXView} from "dhx-optimus";

import {ToolbarView} from "views/toolbar.js";
import {TreeView} from "views/tree.js";
import {FeedGridView} from "views/feedgrid.js";
import {ReaderView} from "views/reader.js";

import {AddChannelWin} from "views/addchannelwin.js";
import {Statistic} from "views/statistic.js";
import {EditWindow} from "views/editwin.js";

export class TopView extends DHXView{
	render(){
		let top = this.root.attachLayout("3L");

		top.cells("a").setWidth(500);

		top.cells("c").hideHeader();
		top.cells("a").setText("Channels Tree");
		top.cells("b").setText("RSS Feed Content");

		let statusbar = top.attachStatusBar();
		this.attachEvent("onStatusChange", text =>statusbar.setText(text));
		this.attachEvent("onToolbarClick", e =>{
			switch(e.id){
				case "channel_add":
					this.show(AddChannelWin, top);	
					break;
				case "channel_edit":
					this.show(EditWindow, top);	
					break;
				case "channel_stat":
					this.show(Statistic, top);
					break;
			}
		});

		this.show(ToolbarView, 		top.cells("a"));
		this.show(TreeView, 		top.cells("a"));
		this.show(FeedGridView, 	top.cells("b"));
		this.show(ReaderView, 	    top.cells("c"));
	}
}