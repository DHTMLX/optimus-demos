import {DHXView} from "dhx-optimus";

export class FeedGridView extends DHXView{
	render(){
		this._sortInd = 4;
		this._sortDir = "ASC";
		this.ui = this.root.attachGrid();

		this.ui.setHeader("*,From Topic,Size,Date");
		this.ui.setColTypes("ro,ro,ro,ro,ro");
		this.ui.setColSorting("str,str,str,str,date");
		this.ui.setInitWidths("30","220","*","70","130");     
		this.ui.setColAlign("center,left,left,left,left");  

		this.ui.init();

		this.ui.attachEvent("onRowSelect", e =>{
			this._markAsRead(e);
			this.app.callEvent("onFeedSelect",[{id:e}]);
		});
		this.attachEvent("onTreeClicked", e =>this._loadData(e.id));

		this.ui.attachEvent("onXLE",()=>this.app.callEvent("onStatusChange",["Feed loaded successfuly"]));
	}

	_loadData(id){
		this.app.callEvent("onStatusChange",["Loading feed..."]);
		this.ui.clearSelection();
		this.ui.clearAll();		
		dhx.ajax.get(`server/dhxrss_ajax.php?action=getFeeds&channelId=${id}&sortInd=${this._sortInd}&sortDir=${this._sortDir}`, res =>{
			if(res.xmlDoc.response){
				this.ui.parse(res.xmlDoc.response);
			}
		});
	}

	_markAsRead(feedId){
		if( this.ui.getUserData(feedId, "unread") === "yes" ){
			dhx.ajax.get(`${this.app.$server}?action=markAsRead&feedId=${feedId}&channelId=${this.app.$selectedChannel}`, xml =>{
				let root = dhx.ajax.xmltop("data",xml.xmlDoc);
				if(root.firstChild.getAttribute("done") === "yes"){
					this.ui.setUserData(feedId, "unread", "no");
					this.ui.setRowTextStyle(feedId, "font-weight:normal;");
					this.app.callEvent("onFeedRead",[{id:feedId}]);
				}
			});
		}
	}

}