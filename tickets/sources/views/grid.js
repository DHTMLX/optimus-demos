import {DHXView} from "dhx-optimus";

export class GridView extends DHXView{
	render(){
		const _ = this.app.locale.helper();

		this.root.attachToolbar({
			icon_path: "codebase/imgs/",
			json: [
				{type: "buttonSelect", id: "ticketmenu", text:_("Ticket menu"), renderSelect: false, openAll: true, options: [
				{id: "newPro", type: "obj", text: _("Ticket new"), img: "new.png"},
				{id: "editPro", type: "obj", text:_("Edit ticket"), img: "edit.png"},
				{id: "delPro", type: "obj", text: _("Delete ticket"), img: "delete.png"}
				]}
			]
		});	

		this.ui = this.root.attachGrid();
		this.ui.setImagesPath("codebase/imgs/");
		this.ui.setDateFormat("%d/%m/%Y");
		
		this.ui.setHeader([
			_("Flag"), _("ID"), _("Status"), _("Subject"), _("Manager"), _("Date"), _("Notes")
		]);

		this.ui.setInitWidths("70,90,120,*,150,100,*");
		this.ui.setColAlign("center,left,left,left,left,center,left");
		this.ui.setColTypes("img,ed,coro,ed,coro,dhxCalendar,ed");
		this.ui.setColSorting("int,int,str,str,str,date,str");


		let StatusCombo = this.ui.getCombo(2);
		StatusCombo.put("1",_("Open"));
		StatusCombo.put("2",_("Closed"));
		StatusCombo.put("3",_("On hold"));
		StatusCombo.put("4",_("Escalated"));

		let managerCombo = this.ui.getCombo(4);
		managerCombo.put("1","Coilean Daly");
		managerCombo.put("2","Donnchad Riordan");
		managerCombo.put("3","Kalle Johannes");
		
		this.ui.init();
		this.attachEvent("onMenuSelect", e => this._load(e));

		this.ui.attachEvent("onXLE",()=>{
			this.ui.sortRows(5, "date");
			this.ui.selectRow(0);
		});
	}

	_load(id){
		this.ui.clearAll();
		this.ui.load(`server/tickets_${id}.json`,"json");
	}
}