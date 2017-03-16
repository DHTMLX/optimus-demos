export const folder = {

	copy(server,events,data,move){
		const mode = move?"move":"copy";
		dhtmlx.confirm({
			title:"Confirm",
			text:` <span style="text-transform: capitalize;">${mode}</span> "${data.active.name}" to "${ data.noActive.path}"?`,
			callback:  result =>{
				if(result){
					let path = data.noActive.parent;
					let id = data.active.folder;
					let pane = data.active.id==="a"?0:1;
					let isMove = move?"yes":"no";
					let isFolder = data.active.type === "folder" ? "yes" : "no";

					window.dhx.ajax.get(`${server}?action=copyFile&id=${id}&path=${path}&pane=${pane}&isMove=${isMove}&isFolder=${isFolder}`, xml =>{
						let root = dhx.ajax.xmltop("response", xml.xmlDoc);
						let state = root.getAttribute("state");
						if(state === "good"){
							events.callEvent("onAfterCopy",[{
								mode:mode,
								root:data.active.id,
								id:id,
								path:path,
								target:data.noActive.grid
							}]);
						}else{
							dhtmlx.alert({
								title:"Error",
								text:`An error occured while ${move?"moving":"copying"} file.`
							});
						}
					});
				}
			}
		});	
	},

	remove(server,events,data){
		dhtmlx.confirm({
			title:"Confirm",
			text:`Are you sure you want to remove "${data.active.name}" ?`,
			callback:  result =>{
				if(result){
					let path = data.active.parent;
					let path2 = data.noActive.parent;
					let pane = data.active.id==="a"?0:1;
					let folder = data.active.folder;
					let isFolder = data.active.type === "folder" ? "yes" : "no";

					window.dhx.ajax.get(`${server}?action=removeFile&id=${folder}&path=${path}&path2=${path2}&pane=${pane}&isFolder=${isFolder}`, xml =>{
						let state = dhx.ajax.xmltop("response", xml.xmlDoc).getAttribute("state");
						if(state==="good"){
							events.callEvent("onItemDelete",[{
								root:data.active.id,
								id:folder
							}]);
						}
					});
				}
			}
		});
	},

	add(server,events,data,name){
		let pane = data.active.id === "a"?0:1;
		let path = data.active.parent;
		let path2 = data.noActive.parent;

		window.dhx.ajax.get(`${server}?action=createFolder&path=${path}&folderName=${encodeURIComponent(name)}&pane=${pane}` ,  xml  => {
			if(xml.xmlDoc.responseText){
				let state = dhx.ajax.xmltop("response",xml.xmlDoc).getAttribute("state");
				if(state==="good"){
					events.callEvent("onAddFolder",[{
						root:data.active.id,
						path:path===path2}]);
				}
			}
		});
	},
	getDetails(server,events,data){
		window.dhx.ajax.get(`${server}?action=folderDetails&path=${data.active.folder}`, xml =>{
			let root = dhx.ajax.xmltop("response", xml.xmlDoc);
			let files = root.getAttribute("files");
			let folders = root.getAttribute("folders");
			let size = root.getAttribute("size");
			dhtmlx.message({
				title:"Folder details",
				type:"alert",
				text:`Files:${files}, folders:${folders}, size:${size}`
			});
		});
	},
	download(server,events,data,zip){
		document.getElementById("downloadframe").src = `${server}?action=downloadFile&id=${data.active.folder}&bzip2=${zip?"yes":"no"}`;
	}
	
};