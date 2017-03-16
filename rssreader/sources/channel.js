export const channelObj = {
	trace(server,channel,events,traceAll){
		events.callEvent("onStatusChange",["Checking updates..."]);
		let all = traceAll ? "": `&channelId=${channel}`;
		dhx.ajax.get(`${server}?action=bindChannels${all}`, xml =>{
			let root = dhx.ajax.xmltop("data",xml.xmlDoc);
			events.callEvent("onTrace",[root]);
		});
	},
	trash(server,channel,events){
		dhtmlx.confirm({
			type: "cancelButton",
			title: "Delete confirmation",
			text: "Are you sure you want to move this channel and all its feeds to trash?",
			callback: result =>{
				if (result) {
					events.callEvent("onStatusChange",["Moving channel to trash..."]);
					dhx.ajax.get(`${server}?action=trashChannel&channelId=${channel}`, xml =>{
						let root = dhx.ajax.xmltop("data",xml.xmlDoc);
						let channel = root.getElementsByTagName("channel")[0];
						let isMoved = channel.getAttribute("isMoved");
						if(isMoved === "yes"){
							events.callEvent("onTrash",[xml.xmlDoc]);
							events.callEvent("onStatusChange",["Channel was successfuly moved to trash."]);
						}else{
							events.callEvent("onStatusChange",["An error occured while moving channel to trash."]);
						}	
					});
				}
			}
		});
	},
	remove(server,channel,events){
		dhtmlx.confirm({
			type: "cancelButton",
			title: "Delete confirmation",
			text: "Are you sure you want to remove this channel and all its feeds?",
			callback: result =>{
				if (result) {
					events.callEvent("onStatusChange",["Removing channel..."]);
					dhx.ajax.get(`${server}?action=removeChannel&channelId=${channel}`, xml =>{
						let root = dhx.ajax.xmltop("data",xml.xmlDoc);
						let feeds = root.firstChild.getAttribute("removedFeeds");
						if(root.firstChild.getAttribute("isRemoved") === "yes"){
							events.callEvent("onRemove",[root]);
							events.callEvent("onStatusChange",[`Channel was successfuly removed ( ${feeds} feeds were removed)`]);
						}else{
							events.callEvent("onStatusChange",["An error occured while removing channel"]);
						}
					});
				}
			}
		});
	},
	restore(server,channel,events){
		dhx.ajax.get(`${server}?action=restoreChannel&channelId=${channel}`, xml =>{
			let root = dhx.ajax.xmltop("data",xml.xmlDoc);
			let channel = root.getElementsByTagName("channel")[0];
			let isMoved = channel.getAttribute("isMoved");
			if(isMoved === "yes"){
				events.callEvent("onRestore",[xml.xmlDoc]);
				events.callEvent("onStatusChange",["Channel was successfuly restored."]);
			}else{
				events.callEvent("onStatusChange",["An error occured while restoring channel."]);
			}
		});
	}
};