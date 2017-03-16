import { DHXView } from "dhx-optimus";

import { MapView } from "views/maptab.js";
import { CitiesView } from "views/citiestab.js";
import { EconomicView } from "views/economictab.js";

export class TabbarView extends DHXView {
	render() {
		this.ui = this.root.attachTabbar();
		this.ui.loadStruct({
			tabs: [
				{id: "a", text: "Map", width: 100, active: true},
				{id: "b", text: "Cities", width: 100},
				{id: "c", text: "Economic", width: 100}
			]
		});

		this.show(MapView,this.ui.cells("a"));
		this.show(CitiesView,this.ui.cells("b"));
		this.show(EconomicView,this.ui.cells("c"));
	}
}