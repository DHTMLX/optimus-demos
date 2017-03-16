import "less/xmleditor.less";
import {DHXApp} from "dhx-optimus";
import {TopView} from "views/top.js";
import {LoadXmlWindow} from "views/loadxmlwin.js";

class xmlEditor extends DHXApp{
	render(){
		this.attachEvent("onDataLoad", e =>{
			this._loadXml(e.path);
		});

		var top = this.show(TopView);
		top.show(LoadXmlWindow, top.ui);
	}

	getSettings(){
		return this.session.get("settings-xml-editor",{
			panels:true,whitespace:true,attrs:true
		});
	}
	setSettings(data){
		var old = this.getSettings();
		this.session.set("settings-xml-editor", data );
		if(data.panels !== old.panels)
			this.callEvent("onNewSettings",[data]);
	}

	buildXml(top = this._top,xml,start){
		let settings = this.getSettings();
		xml=xml||[];
		start=start||"\n";
		let tag = this._ids[top.id].tag_name;
		let tagVal = this._ids[top.id].tag_value;

		if (settings.whitespace){
			tagVal = (tagVal||"").replace(/[ \n\t]+/gi," ");
		}		

		let attrs ="";

		let names = this._elements[tag].attrs;
		let atrVals = this._ids[top.id].attrs;

		for(let name in names){
			if(!settings.attrs || atrVals[name]){
				let text = atrVals[name] || "";
				attrs += ` ${name}="${text}" `;
			}
		}
		
		xml.push(`${start}<${tag}${attrs}>${tagVal}`);
		
		if(top.item.length){
			for(let i=0;i<top.item.length;i++){
				xml.push( this.buildXml(top.item[i],xml,start+"\t") );
			}
		}
		xml.push(`${start}</${tag}>`);
		
		return xml;
	}

	_loadXml(path) {
		dhx.ajax.get(`./server/proxy.php?path=${encodeURIComponent(path)}`, xml => {
			this.max_id = 1;
			this._ids = [];
			this._elements = {};

			let xmlDOM = xml.xmlDoc.responseXML;

			this._top = this._xmlPop(xmlDOM.firstChild);
			this.callEvent("onDataParse");
		});
	}

	_xmlPop(node){	
		let text="";
		let child=[];
		let obj={ tag_name:node.tagName, item:child, id:this.max_id++, text:node.tagName};

		obj.attrs = {};
		let attrs=this._getUniqueTags(obj).attrs;
		
		for (let i=0; i < node.childNodes.length; i++){
			let n=node.childNodes[i];
			switch(n.nodeType){
				case 3:
					text+=n.data;
					break;
				case 1:
					child.push(this._xmlPop(n));
					break;
			}		
		}
	
		let a=node.attributes;
		
		for (let i=0; i < a.length; i++){
			attrs[a[i].name]=true;
			obj.attrs[a[i].name]=a[i].value;
		}

		this._ids[obj.id]={tag_name:node.tagName,tag_value:text,attrs:obj.attrs,id:obj.id};

		return obj;
	}

	_getUniqueTags(obj){
		if (!this._elements[obj.tag_name]){
			this._elements[obj.tag_name]=[];
			this._elements[obj.tag_name].attrs={};
		}
		let c=this._elements[obj.tag_name];
		c.push(obj.id);
		return c;
	}

}

window.XMLApp = xmlEditor;