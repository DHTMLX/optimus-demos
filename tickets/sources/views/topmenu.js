import {DHXView} from "dhx-optimus";
import {SigninPopup} from "views/popup.js";

export class TopMenuView extends DHXView{
	render(){
		this.ui = this.root.attachToolbar({
			icon_path: "codebase/imgs/"
		});
		this.ui.loadStruct(this._getStruct(),()=>{
			this.ui.addSpacer("sign_in");
			this.ui.setItemState(this.app.locale.getLang(), true);
		});

		this.ui.attachEvent("onBeforeStateChange", id =>{
			let lang = id;
			if(lang !== this.app.locale.getLang()){
				this.app.callEvent("onLangChange",[lang]);
			}
			return false;
		});

		this.show(SigninPopup, this.ui);
	}

	_getStruct(){
		const _ = this.app.locale.helper();
		return [
			{type: "buttonSelect", id: "projectmenu", width:130,  text:_("Project menu"), renderSelect: false, openAll: true, options: [
				{id: "newPro", type: "obj", text:_("New project"), img: "new.png"},
				{id: "editPro", type: "obj", text:_("Edit project"), img: "edit.png"},
				{id: "delPro", type: "obj", text:_("Delete project"), img: "delete.png"}
			]},
			{type: "button", id: "sign_in", width:130, text:_("Sign In"), img: "join.png"},
			{type: "buttonTwoState", id: "en", text:_("English"), img: "flags/us.png"},
			{type: "buttonTwoState", id: "it", text:_("Espanol"), img: "flags/italy.png"},
			{type: "buttonTwoState", id: "de", text:_("Deutsch"), img: "flags/germany.png"},
			{type: "buttonTwoState", id: "fr", text:_("Francais"), img: "flags/france.png"},
			{type: "buttonTwoState", id: "es", text:_("Italiano"), img: "flags/spain.png"},
			{type: "buttonTwoState", id: "ru", text:_("Русский"), img: "flags/russia.png"}
		];
	}
}
