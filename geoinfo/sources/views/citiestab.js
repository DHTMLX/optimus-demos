import { DHXView } from "dhx-optimus";

export class CitiesView extends DHXView {
	render() {
		this.ui = this.root.attachGrid();
		this.ui.setHeader("Name, Population,C(n),R(n)", null, ["padding-left:20px;","text-align:center;","text-align:center","text-align:center"]);
		this.ui.setInitWidths("*,200,80,80");
		this.ui.setColAlign("left,right,center,center");
		this.ui.setColTypes("ro,ro,ro,ro");
		this.ui.setColAlign("left,center,center,center");
		this.ui.init();
		this.attachEvent("onCountrySelect", e =>this._setCities(e.cities));
	}

	_setCities(cities){
		this.ui.clearAll();
		this.ui.parse(cities);
	}
}