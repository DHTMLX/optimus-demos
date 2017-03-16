import { DHXView } from "dhx-optimus";

export class EconomicView extends DHXView {
	render() {
		this.ui = this.root.attachChart({
			view: "bar",
			value: "#sales#",
			label: "",
			width: "40px",
			visibility: "50%",
			radius: 0,
			color: "#33d6ff",
			alpha: 0.8,
			border: true,
			xAxis:{
				title:"GDP per year, millions of $US",
				template:"#year#",
				lines: false
			},
			yAxis:{
				title:""
			}
		});

		this.attachEvent("onCountrySelect", e =>this._setChart(e.graph));
	}

	_setChart(xml){
		this.ui.parse(xml);
	}
}