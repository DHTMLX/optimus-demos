import {DHXView} from "dhx-optimus";

export class ProjectsView extends DHXView{
	render(){	
		const _ = this.app.locale.helper();
		this.ui = this.root.attachDataView({
			type: {
				template: `<table width='400' align='center' cellpadding='4' cellspacing='0'>
								<tr>
									<td rowspan='3' width='60px'><img src='codebase/imgs/#icon#' border='0' width='50' height='50'></td>
									<td><b>${_("Name")}: </b>#name#</td>
								</tr>
									<tr><td><b>${_("User")}: </b>#user#</td></tr>
									<tr><td><b>${_("Description")}: </b>#descr#</td>
								</tr>
							</table>`,
				width: 400,
				height: 70
			}
		});

		this._update();
		this.ui.attachEvent("onSelectChange", e =>this.app.callEvent("onMenuSelect",[e]));
		this.ui.attachEvent("onXLE",()=>this.ui.select("1",true));
	}

	_update(){
		this.ui.load("server/projects.json","json");
	}
}