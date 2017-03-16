import "less/rssApp.less";
import {DHXApp} from "dhx-optimus";
import {TopView} from "views/top.js";
import {channelObj} from "channel.js";

class RSSApp extends DHXApp{
	render(){
		this.$server = "server/dhxrss_ajax.php";
		this.show(TopView);

		this.attachEvent("onToolbarClick", e =>{
			switch(e.id){
				case "channel_trash":
					channelObj.trash(this.$server,this.$selectedChannel,this.facade);
					break;
				case "channel_remove":
					channelObj.remove(this.$server,this.$selectedChannel,this.facade);
					break;
				case "channel_restore":
					channelObj.restore(this.$server,this.$selectedChannel,this.facade);
					break;
				case "channel_trace":
					channelObj.trace(this.$server,this.$selectedChannel,this.facade);
					break;
				case "channel_trace_all":
					channelObj.trace(this.$server,this.$selectedChannel,this.facade,true);
					break;
			}
		});
		this.attachEvent("onTreeClicked", e =>this.$selectedChannel = e.id);
	}
	getChannel(){
		return this.$selectedChannel;
	}
	getChannelInfo(){
		return new Promise( resolve =>{
			dhx.ajax.get(`${this.$server}?action=channelStat&channelId=${this.$selectedChannel}`,  xml =>{
				let root = dhx.ajax.xmltop("data",xml.xmlDoc);
				let channel = root.getElementsByTagName("channel")[0];
				let data = {name: "", link: "", tags: "", date: "", feeds: ""};
				for (let a in data){
					try { 
						data[a] = channel.getElementsByTagName(a)[0].firstChild.nodeValue; 
					} 
					catch(e) { 
						data[a] = ""; 
					}
				} 
				data.channelId = this.$selectedChannel;
				resolve(data);
			});
		});
	}
	uploadChannel(data){
		return new Promise( resolve =>{
			let channelId = data.channelId===""?"":"&channelId="+data.channelId;
			if (data.link.trim() === "") {
				dhtmlx.message({
					type: "alert-error",
					text: "You need to specify a server name"
				});
			} else {
				dhx.ajax.get(`
				${this.$server}?
				action=${data.action}
				${channelId}
				&channelName=${encodeURIComponent(data.name)}
				&channelLink=${encodeURIComponent(data.link)}
				&channelTags=${encodeURIComponent(data.tags)}`, 
				xml =>{
					let root = dhx.ajax.xmltop("data",xml.xmlDoc);
					let channel = root.getElementsByTagName("channel")[0];
					let id = channel.getAttribute("id");
					if(id==="none"){
						dhtmlx.message({
							type: "alert-error",
							text: "Unknown format of channel data or channel is corrupted."
						});
					}else{
						let channel = root.getElementsByTagName("channel")[0];
						let cnl = {
							id:channel.getAttribute("id"),
							name:channel.firstChild.nodeValue
						};
						if(data.action==="channelUpdate"){
							this.callEvent("onEdit",[cnl]);
						}else{
							this.callEvent("onAdd",[cnl]);
						}
						channelObj.trace(this.$server,this.$selectedChannel,this.facade);
					}
					resolve(root);
				});
			}
		});
	}
}

window.RSSApp = RSSApp;