import {DHXView} from "dhx-optimus";

import {TabbarView} from "views/tabbar.js";
import {CountriesView} from "views/countries.js";

export class TopView extends DHXView{
	render(){
		let top = this.root.attachLayout("3L");

		top.setOffsets({top: 14, left: 14, right: 14, bottom: 14});
		top.cells("a").setText("Countries");
		top.cells("a").setWidth(480);
		top.cells("c").setText("Description");

		this.show(CountriesView, 		top.cells("a"));
		this.show(TabbarView, 			top.cells("b"));

		this.attachEvent("onCountrySelect", e =>top.cells("c").attachHTMLString(`<div class="dsc">${e.dsc}</div>`));
	}

}