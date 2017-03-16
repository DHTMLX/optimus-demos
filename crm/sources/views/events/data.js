import {DHXView} from "dhx-optimus";

export class EventsDataView extends DHXView{
	render(){
		this.ui = this.root.attachDataView({
			type: {
				template:`<div class='event_image'><img src='codebase/imgs/events/#image#' border='0' ondragstart='return false;'></div>
						<div class='event_title'>#title#</div>
						<div class='event_date'>#date#</div>
						<div class='event_place'>#place#</div>
						`,	
				margin: 10,
				padding: 20,
				height: this.app.$device === "desktop"?300:210
			},
			drag: false,
			select: true,
			edit: false,
			autowidth :this.app.$device === "desktop"?false:(this.app.$landscape?4:2)
		});
		
		this.ui.attachEvent("onAfterSelect",  id =>{
			let item = this.ui.item(id);
			this.app.callEvent("onEventSelect",[{lat:item.lat,lng:item.lng}]);
		});
		this._load();
	}
	_load(){
		this.ui.load("codebase/data/events.xml",()=>{
			if(this.app.$device==="desktop"){
				this.ui.select(this.ui.idByIndex(0));
			}
		});
	}	
}
