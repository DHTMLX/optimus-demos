import {DHXView} from "dhx-optimus";
import {SettingsFormStruct} from "views/settings/settings_forms.js";

export class SettingsFormView extends DHXView{
	render(){
		this.ui = this.root.attachForm();
		this._load(this.app.$currSettingsId);
		this.ui.centerForm();
	}
	_load(id){
		this.ui.load(SettingsFormStruct[id]);
	}	
}
