import "less/ticketApp.less";
import "helpers/calendarlangs.js";

import {DHXApp, DHXLocale} from "dhx-optimus";
import Polyglot from "node-polyglot";
import {langs} from "helpers/langs.js";
import {TopView} from "views/top.js";

class TicketApp extends DHXApp{
	render(){
		this.locale = new DHXLocale(Polyglot, langs);
		this.ui = this.show(TopView);

		this.attachEvent("onLangChange", lang =>{
			this.locale.setLang(lang);
			window.dhtmlXCalendarObject.prototype.lang = lang;

			this.ui.refresh();
		});
	}
}

window.TicketApp = TicketApp;