import {DHXView} from "dhx-optimus";

export class ChartView extends DHXView{
	render(){
		this.ui = this.root.attachTabbar({
			arrows_mode: "auto",
			tabs: [
				{id: "stats", text: "Stats", selected: 1}
			]
		});
		this.attachEvent("onProjectSelect", e =>this._load(e.id));
	}

	_load(id){
		if (this._projectsChart) {
			this._projectsChart.clearAll();
		} else {
			this._projectsChart = this.ui.tabs("stats").attachChart({
				view:	  "bar",
				value:    "#sales#",
				gradient: "rising",
				radius:   0,
				legend: {
					width:	  75,
					align:	  "right",
					valign:	  "middle",
					template: "#month#"
				}
			});
		}
		this._projectsChart.load(`codebase/data/chart/${id}.json`,"json");
	}
	
}
