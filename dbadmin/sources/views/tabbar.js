import {DHXView} from "dhx-optimus";
import {SQLTabView} from "views/sqltab";
import {TableTabView} from "views/tabletab";

export class TabbarView extends DHXView{
	render(){
		this.ui = this.root.attachTabbar({
			close_button: true
		});
		this.ui.addTab(
			"start",       
			"start",    
			null,
			null,
			true,
			false
		);

		this.ui.cells("start").attachHTMLString(`
			<br>
			<span class='info_message' style='padding-left:20px;font-family:tahoma,sans-serif'>
				Select any entity in tree to view details
			</span>`);

		this.attachEvent("onTopbarClick",function(e){
			if(e === "sql_query"){
				if(!this.app.config.db){
					dhtmlx.alert({
						title:"Alert",
						type:"alert-error", 
						text:"You need to select DB first"
					});
					return;
				}
				this._setSqlTab();
			}

		});

		this.attachEvent("loadTab",function(id){
			let tab = id;
			if(this.ui.tabs(tab)){
				this.ui.tabs(tab).setActive();
				return;
			}
			this._setTab(id);
		});

	}
	_setSqlTab(){
		let id = (new Date()).valueOf();

		this.ui.addTab(
			id,       					// id
			"SQL : "+this.app.config.db    // tab text
		);

		this.ui.tabs(id).setActive();

		this.show(SQLTabView, this.ui.tabs(id));
	}
	_setTab(id){
		if(this.ui.tabs(id)){
			this.ui.tabs(id).setActive();
			return;
		}

		let arr = id.split("^");

		this.ui.addTab(
			id,        // id
			arr[1]    // tab text
		);

		this.show(TableTabView, this.ui.tabs(id));
	}
}