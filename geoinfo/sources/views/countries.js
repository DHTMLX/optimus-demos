import { DHXView } from "dhx-optimus";

export class CountriesView extends DHXView {
	render() {
		let tpl = `
		<div id='data_template'>
			<div class='img_cont'>
				<img src='./codebase/imgs/flags/#img#' class='flag' />
			</div>
			<div class='country_info'>
				<div class='country_name'><span class='hint'>Name:</span><span class='hint2'>#name#</span></div>
				<div class='country_area'><span class='hint'>Area:</span><span class='hint2'>#area#</span></div>
				<div class='country_capital'><span class='hint'>Capital:</span><span class='hint2'>#capital#</span></div>
				<div class='country_language'><span class='hint'>Language:</span><span class='hint2'>#language#</span></div>
			</div>
		</div>
		`;

		this.ui = this.root.attachDataView({
			type: {
				template: tpl,
				height: 76,
				width: 442
			}
		});
		this.ui.attachEvent("onItemClick",  id =>this._countySelect(id));

		this.ui.load("codebase/xml/places.xml",()=>{
			const id = this.ui.first();
			this.ui.select(id);
			this._countySelect(id);
		});
	}

	_countySelect(id){
		const country = this.ui.get(id);
		this.app.callEvent("onCountrySelect",[{
			lat:country.lat,
			lng:country.lng,
			zoom:parseInt(country.zoom),
			dsc:country.dsc,
			cities:country.cities,
			graph:country.chart
		}]);
	}
}