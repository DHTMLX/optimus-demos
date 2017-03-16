import {DHXView} from "dhx-optimus";

export class SigninPopup extends DHXView{

	render(){

		let signInPopup = new dhtmlXPopup({ toolbar: this.root, id: "sign_in" });
		signInPopup.attachEvent("onShow", ()=>{
			const _ = this.app.locale.helper();
			let  signInForm = signInPopup.attachForm();
			let formStruct = [
				{type: "block", blockOffset: 0, width: 280, list: [
					{type: "settings", position: "label-left", labelWidth: 110, inputWidth: 130, offsetLeft: 20},
					{type: "input", label:_("Email"), name: "email"},
					{type: "password", label:_("Password"), name: "pwd"},
					{type: "checkbox", label:_("Remember me"), checked: 1},
					{type: "button", value:_("Proceed"), offsetLeft: 164, name: "proceed"}
				]}
			];
			signInForm.load(formStruct, ()=>signInPopup._repaint());
			signInForm.attachEvent("onButtonClick", name =>{
				if (name == "proceed") signInPopup.hide();
			});
		});
	}

}