import {DHXView} from "dhx-optimus";
export class SettingsDataView extends DHXView{
	render(){
		this.ui = this.root.attachDataView({
			type: {
				template:`<div style='position:relative;'>
							<div class='settings_image'><img src='codebase/imgs/settings/#image#' border='0' ondragstart='return false;'></div>
							<div class='settings_title'>#title#
								<div class='settings_descr'>#descr#</div>
							</div>
						</div>	
						`, 
				margin: 10,
				padding: 20,
				height: this.app.$device === "desktop"?120:80
			},
			drag: false,
			select: true,
			edit: false,
			autowidth :this.app.$device === "desktop"?2:true
		});
		
		this.ui.attachEvent("onAfterSelect",  id =>{
			this.app.$currSettingsId = id;
			this.app.callEvent("onSettingSelect",[{id:id}]);
		});
		this._load();
	}
	_load(){
		this.ui.load("codebase/data/settings.xml",()=>{
			if(this.app.$device==="desktop"){
				this.ui.select(this.ui.idByIndex(0));
			}
		});
	}
}
