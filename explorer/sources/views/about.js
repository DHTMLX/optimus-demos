import { DHXView } from "dhx-optimus";
import about from "templates/about.html";

export class AboutView extends DHXView {
	render() {
		this.ui = this.root.attachHTMLString(about());
	}
}