import {DHXView} from "dhx-optimus";

export class FilesView extends DHXView{

	render(){

		this._type = "folder";
		this._path = ["/"];
		this.$rootId = this.root.getId();

		this.statusBar = this.root.attachStatusBar();
		this.ui = this.root.attachGrid();
		this.ui.enableStableSorting(true);

		this.app.addService(this.$rootId,{
			getState: ()=>{
				return {
					id:this.$rootId,
					folder:this._folder,
					type:this._type,
					path:this._getTextPath(),
					parent:this._parent,
					grid:this.ui,
					name:this._name,
				};
			}
		});

		this.ui.setHeader(" ,Name,Ext,Size,Date,Attr");
		this.ui.setColTypes("img,ro,ro,ro,ro,ro");
		this.ui.setColSorting("str,str,str,str,date,str");
		this.ui.setInitWidths("30","*","70","70","100","40");     
		this.ui.setColAlign("center,left,left,left,left,left");  
		this.ui.init();

		this.ui.attachEvent("onRowDblClicked", e =>this._onRowSelect(e));
		this.ui.attachEvent("onKeyPress",(code,ctrl,shift,ev)=>this._getKeyAction(code,ctrl,shift,ev));
		this.ui.attachEvent("onSelectStateChanged", e =>this._setSelectedItem(e));

		this.attachEvent("onItemDelete", e =>{
			if( this.ui.getRowIndex(e.id) > 1 ){
				this.ui.deleteRow(e.id);
				this._updateStatus();
			}
		});

		this.attachEvent("onAddFolder", e =>{
			if(this.$rootId === e.root || e.path ){
				this._load(this._parent);
			}
		});

		this.attachEvent("onFolderSelect", e =>{
			if(this.$rootId !== e.root){
				this.ui.clearSelection();
			}
		});

		this.attachEvent("onAfterCopy", e =>{
			if(this.$rootId === e.root){
				this.ui.moveRowTo(e.id,e.path,e.mode,"sibling",this.ui,e.target);	
			}else{
				this.sort();
				this._updateStatus();
			}	
		});

		this.attachEvent("onWinChange",()=>{
			if(this.app.isTabActive(this.$rootId)){
				this.ui.selectRowById(this._folder);
			}
		});

		this._load(this._folder);
	}
	sort(){
		this.ui.sortRows(1,"str","asc");
		this.ui.sortRows(2,"str","asc");
	}
	_getTextPath(){
		return this._path.join("");
	}
	_load(folder){	
		if(this._type === "folder"){
			this.ui.clearAll();
			this.ui.load(`${this.app.$server}?action=readFolder&folder=${folder}`,()=>{
				this._updateStatus();
			
				if(this.app.isTabActive(this.$rootId)){
					if(this.ui.getRowIndex(this._parent) < 0){
						this.ui.selectRow(0);
					}else{
						this.ui.selectRowById(this._parent);
					}
				}else{
					this._folder = this.ui.getRowId(0);
				}
				this._parent = this.ui.getUserData("","parent");
				this.root.setText( this._getTextPath() );
				this.sort();
			
			});
		}
	}

	_onRowSelect(rowId){
		if(this._type === "folder"){
			if(this._backFolder){
				this._path.pop();
			}else{
				this._path.push(`${this._name}/`);
			}
			this._folder = rowId;
		}
		this._load(rowId);
	}
	_setSelectedItem(rowId){
		this._type = this.ui.getUserData(rowId,"type");
		this._backFolder = this.ui.getUserData(rowId,"target");
		this._name = this.ui.cells(rowId,1).getValue();
		this._folder = rowId;
		this.app.callEvent("onFolderSelect",[{id:rowId,type:this._type,back:this._backFolder,root:this.$rootId}]);
	}

	_updateStatus(){
		let files = 0;
		let folders = 0;
		this.ui.forEachRow( row =>{
			let type = this.ui.getUserData(row,"type");
			if(type === "folder" && !this.ui.getUserData(row,"target")){
				folders++;
			}else if(type === "file"){
				files++;
			}
		});
		this.statusBar.setText(`Folders:${folders} / Files:${files}`);
	}

	_getKeyAction(code,ctrl,shift,ev){
		this.app.callEvent("onGridKey",[{code:code}]);
		switch (code) {	
			case 13: // enter
				this._onRowSelect(this._folder);				
				break;			
			case 9: // tab	
				ev.returnValue = false;
				ev.cancelBubble = true;	
				break;
			case 36: // home
				if (this.ui.getRowId(0) !== null) {
					this.ui.selectRow(0);
				}
				break;
			case 35: // end
				if (this.ui.getRowsNum() > 0) {
					this.ui.selectRow(this.ui.getRowsNum()-1);
				}
				break;
		}
		return true;
	}
}