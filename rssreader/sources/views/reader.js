import {DHXView} from "dhx-optimus";

export class ReaderView extends DHXView{
	render(){
		this.attachEvent("onFeedSelect", e =>this._loadFeed(e.id));
		this.attachEvent("onTreeClicked",()=>this.root.attachHTMLString(""));
	}
	_loadFeed(feedId){
		dhx.ajax.get(`${this.app.$server}?action=loadSingleFeed&feedId=${feedId}`,  xml =>this._parseXml(xml));
	}
	_parseXml(r){
		let root = dhx.ajax.xmltop("data",r.xmlDoc);

		let channel = root.getElementsByTagName("channel")[0].firstChild.nodeValue;
		let title = root.getElementsByTagName("title")[0].firstChild.nodeValue;
		let date = root.getElementsByTagName("pub_date")[0].firstChild.nodeValue;
		let descr = root.getElementsByTagName("description")[0].firstChild.nodeValue;

		let tpl = `<div class="dhxRSS_reader_main_obj">
			<div class="rssBg">
					<div class="dhxRSS_Sender">${channel}</div>
					<div class="dhxRSS_Topic">${title}</div>
					<div class="dhxRSS_Date">${date}</div>&nbsp;
					<div class="dhxRSS_Content">${descr}</div>
				</div>
			</div>
			`;
			
		this.root.attachHTMLString(tpl);
	}

}