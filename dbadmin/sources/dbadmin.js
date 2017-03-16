import "less/dbadmin.less";
import {DHXApp} from "dhx-optimus/index";
import {TopView} from "views/top.js";

class DBAdmin extends DHXApp{
	render(){
		this.show(TopView);
	}
}

window.DBAApp = DBAdmin;