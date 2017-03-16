import {DHXView} from "dhx-optimus";

export class TreeView extends DHXView{
	render(){
		let tree = this.ui = this.root.attachTree();

		tree.setImagePath("codebase/imgs/tree/");
		tree.setIconSize("24px","24px");
		tree.enableTreeLines(false);
		tree.setXMLAutoLoadingBehaviour("function");

		tree.attachEvent("onSelect",  id =>{
			this._channel = id;
			let type = this.ui.getUserData(id, "nodeType");
			if(type === "channel"){
				this.app.callEvent("onTreeClicked",[{
					id:id,
					parent:tree.getParentId(id),
					readOnly:dhx.s2b(tree.getUserData(id, "ro")) 
				}]);
			}
			this._updateArrows(id);
		});

		this.attachEvent("onAdd", e =>this._addChannel(e));
		this.attachEvent("onEdit", e =>this._editChannel(e));
		this.attachEvent("onRemove",()=>this.ui.deleteItem(this._channel));

		this.attachEvent("onTrash",()=>	tree.moveItem(this._channel, "item_child", "trash_channels"));
		this.attachEvent("onRestore",()=>tree.moveItem(this._channel, "item_child", "channels"));

		this.attachEvent("onFeedRead", e =>this._markAsRead(e));

		this.attachEvent("onTrace", e =>this._traceChannels(e));

		this.attachEvent("onToolbarClick", e =>{
			switch(e.id){
				case "channel_move_down":
					this._moveChannel();
					break;
				case "channel_move_up":
					this._moveChannel(true);
					break;
			}
		});
		tree.load("server/dhxrss_ajax.php?action=loadTree");
	}
	_moveChannel(mode){
		let action = mode? "channelMoveUp":"channelMoveDown";	
		dhx.ajax.get(`${this.app.$server}?action=${action}&channelId=${this._channel}`, xml =>{
			let root = dhx.ajax.xmltop("data",xml.xmlDoc);
			let channel = root.getElementsByTagName("channel")[0];
			let order = channel.getAttribute("order");
			let mode = channel.getAttribute("mode");
			let id = channel.getAttribute("id");
			if(order>0){
				this.ui.moveItem(id,mode);
				this.ui.selectItem(id, false);
			}
			this._updateArrows(id);
		});
	}
	_updateArrows(id){
		let ind = this.ui.getIndexById(id);
		let subs = (this.ui.getSubItems("channels")).split(",");

		let up = ind > 0?true:false;
		let down = ind < subs.length-1?true:false;

		this.app.callEvent("onUpdateArrows",[{up:up,down:down}]);
	}
	_markAsRead(){
		let unreadNumber = this.ui.getUserData(this._channel,"unread");
		let text = this.ui.getUserData(this._channel,"nodeName");
		if(--unreadNumber === 0){
			this.ui.setItemText(this._channel, `${text}`);
			this.ui.setItemStyle(this._channel, "font-weight:normal;");
		}else{
			this.ui.setUserData(this._channel,"unread",unreadNumber);
			this.ui.setItemText(this._channel, `${text} (${unreadNumber})`);
		}
	}
	_editChannel(data){
		let {name,id} = data;
		let ud = this.ui.getUserData(id,"unread");
		this.ui.setItemText(id, name+(ud>0?" ("+ud+")":""));
		this.ui.setUserData(id, "nodeName", name);
		this.ui.setItemStyle(id, "font-weight:"+(ud>0?"bold":"normal")+";");
		this.app.callEvent("onStatusChange",["Channel was successfuly edited."]);
	}
	_addChannel(data){
		let {name,id} = data;
		this.ui.insertNewChild("channels", id, name, null, "tree_channel.png", "tree_channel.png", "tree_channel.png");
		this.ui.setUserData(id, "nodeType", "channel");
		this.ui.setUserData(id, "nodeName", name);
		this.ui.setUserData(id, "unread", 0);
		this.ui.selectItem(id);
		this.app.callEvent("onStatusChange",["Channel was successfuly added."]);
	}
	_traceChannels(data){
		let channels = data.getElementsByTagName("channel");
		for (let i=0; i<channels.length; i++) {
			let channel = channels[i];
			let id = channel.getAttribute("id");
			let newFeeds = parseInt ( channel.getAttribute("newFeeds") );
			let unreadNumber = newFeeds + parseInt ( this.ui.getUserData(id,"unread") );
			let text = this.ui.getUserData(id,"nodeName");
			if(newFeeds > 0){
				this.ui.setUserData(id,"unread",unreadNumber);
				this.ui.setItemText(id, `${text} (${unreadNumber})`);
				this.ui.setItemStyle(id, "font-weight:bold;");
			}
		}
		this.app.callEvent("onStatusChange",["Channels updated successfuly"]);	
	}
}