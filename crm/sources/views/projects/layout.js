import {DHXView} from "dhx-optimus";

import {ProjectGridView} from "views/projects/grid.js";
import {ChartView} from "views/projects/chart.js";

export class ProjectLayoutView extends DHXView{
	render(){
		if(this.app.$device === "phone"){
			this.ui = this.root.attachLayout("1C");
			this.ui.cells("a").hideHeader();
			
			this.show(ProjectGridView, this.ui.cells("a"));
		}else{
			this.ui = this.root.attachLayout("2E");
			this.ui.cells("a").hideHeader();

			this.show(ProjectGridView, this.ui.cells("a"));
			this.show(ChartView, this.ui.cells("b"));
		}
	}
}