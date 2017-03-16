export const SettingsFormStruct = {
	contacts: [
		{type: "label", label: "Contacts settings", labelWidth: "auto"},
		{type: "fieldset", width: 250, offsetTop: 10, label: "View", list: [
			{type: "settings", position: "label-right", labelWidth: "auto", inputWidth: "auto"},
			{type: "radio", name: "view", label: "Detailed", checked: true},
			{type: "newcolumn"},
			{type: "radio", name: "view", label: "Compact", offsetLeft: 15}
		]},
		{type: "fieldset", width: 250, offsetTop: 10, label: "Show fields", list: [
			{type: "checkbox", label: "Name", checked: true, inputWidth: "auto"},
			{type: "checkbox", label: "Date of Birth", checked: true},
			{type: "checkbox", label: "Position", checked: true},
			{type: "checkbox", label: "Email Address", checked: true},
			{type: "checkbox", label: "Phone", checked: true},
			{type: "checkbox", label: "Company", checked: true},
			{type: "checkbox", label: "Additional", checked: true}
		]},
		{type: "block", width: "auto", blockOffset: 0, offsetTop: 10, list: [
			{type: "button", value: "Save"},
			{type: "newcolumn"},
			{type: "button", value: "Cancel", className: "gray_btn", offsetLeft: 5}
		]}
	],
	events: [
		{type: "label", label: "Events", labelWidth: "auto"},
		{type: "fieldset", width: 250, offsetTop: 10, label: "View", list: [
			{type: "settings", position: "label-right", labelWidth: "auto", inputWidth: "auto"},
			{type: "radio", name: "view", label: "Detailed", checked: true},
			{type: "newcolumn"},
			{type: "radio", name: "view", label: "Compact", offsetLeft: 15}
		]},
		{type: "fieldset", width: 250, offsetTop: 10, label: "Show fields", list: [
			{type: "settings", labelWidth: 170, inputWidth: "auto"},
			{type: "checkbox", label: "All events", checked: true},
			{type: "checkbox", label: "Upcoming events in 1 month", checked: true},
			{type: "checkbox", label: "Upcoming events in 2 month", checked: true},
			{type: "checkbox", label: "Upcoming events in 3 month", checked: true}
		]},
		{type: "block", width: "auto", blockOffset: 0, offsetTop: 10, list: [
			{type: "button", value: "Save"},
			{type: "newcolumn"},
			{type: "button", value: "Cancel", className: "gray_btn", offsetLeft: 5}
		]}
	],
	projects: [
		{type: "label", label: "Projects settings", labelWidth: "auto"},
		{type: "fieldset", width: 250, offsetTop: 10, label: "View", list: [
			{type: "settings", position: "label-right", labelWidth: "auto", inputWidth: "auto"},
			{type: "radio", name: "view", label: "Detailed", checked: true},
			{type: "newcolumn"},
			{type: "radio", name: "view", label: "Compact", offsetLeft: 15}
		]},
		{type: "fieldset", width: 250, offsetTop: 10, label: "Show fields", list: [
			{type: "checkbox", label: "Due date", checked: true, inputWidth: "auto"},
			{type: "checkbox", label: "Project", checked: true},
			{type: "checkbox", label: "Status", checked: true},
			{type: "checkbox", label: "Assigned to", checked: true},
			{type: "checkbox", label: "Additional", checked: true}
		]},
		{type: "block", width: "auto", blockOffset: 0, offsetTop: 10, list: [
			{type: "button", value: "Save"},
			{type: "newcolumn"},
			{type: "button", value: "Cancel", className: "gray_btn", offsetLeft: 5}
		]}
	],
	configuration: [
		{type: "label", label: "Configuration", labelWidth: "auto"},
		{type: "block", width: 250, offsetTop: 10, blockOffset: 0, list: [
			{type: "settings", labelWidth: 120, inputWidth: 120},
			{type: "input", label: "Full Name"},
			{type: "input", label: "Email Address"},
			{type: "input", label: "New Password"},
			{type: "input", label: "Repeat Password"}
		]},
		{type: "block", width: "auto", blockOffset: 0, offsetTop: 10, list: [
			{type: "button", value: "Save"},
			{type: "newcolumn"},
			{type: "button", value: "Cancel", className: "gray_btn", offsetLeft: 5}
		]}
	],
	exportprint: [
		{type: "label", label: "Export to PDF / Print", labelWidth: "auto"},
		{type: "block", width: "auto", offsetTop: 10, blockOffset: 0, list: [
			{type: "label", label: "<span style='font-weight:normal;color:black;'>Choose the page for export/print</span>", labelWidth: "auto"},
			{type: "combo", inputWidth: 220, options: [
				{text: "Contacts"}, {text: "Projects"}, {text: "Events"}
			]}
		]},
		{type: "block", width: "auto", blockOffset: 0, offsetTop: 10, list: [
			{type: "button", value: "Export"},
			{type: "newcolumn"},
			{type: "button", value: "Print", offsetLeft: 5},
			{type: "newcolumn"},
			{type: "button", value: "Cancel", className: "gray_btn", offsetLeft: 5}
		]}
	],
	notifications: [
		{type: "label", label: "Notifications", labelWidth: "auto"},
		{type: "fieldset", width: 250, offsetTop: 10, label: "Notify via emal when", list: [
			{type: "settings", labelWidth: 170, inputWidth: "auto"},
			{type: "checkbox", label: "Two weeks left before the due date of a project", checked: true},
			{type: "checkbox", label: "One week left before the due date of a project", checked: true},
			{type: "checkbox", label: "One day left before the due date of a project", checked: true},
			{type: "checkbox", label: "Two weeks left before an event", checked: true},
			{type: "checkbox", label: "One week left before an event", checked: true},
			{type: "checkbox", label: "One day left before an event", checked: true}
		]},
		{type: "block", width: "auto", blockOffset: 0, offsetTop: 10, list: [
			{type: "button", value: "Save"},
			{type: "newcolumn"},
			{type: "button", value: "Cancel", className: "gray_btn", offsetLeft: 5}
		]}
	],
	statistics: [
		{type: "label", label: "Export to PDF / Print", labelWidth: "auto"},
		{type: "block", width: "auto", offsetTop: 10, blockOffset: 0, list: [
			{type: "label", label: "<span style='font-weight:normal;color:black;'>Choose the data for displaying activity</span>", labelWidth: "auto"},
			{type: "combo", inputWidth: 220, options: [
				{text: "Contacts"}, {text: "Projects"}, {text: "Events"}
			]}
		]},
		{type: "block", width: "auto", blockOffset: 0, offsetTop: 10, list: [
			{type: "button", value: "Get statistic"}
		]}
	],
	removeworkspace: [
		{type: "label", label: "Remove your workspace", labelWidth: "auto"},
		{type: "block", width: "auto", offsetTop: 10, blockOffset: 0, list: [
			{type: "label", label: "<span style='font-weight:normal;color:black;'>You won't be able to restore the data.<br>  Are you sure?</span>", labelWidth: "auto"}
		]},
		{type: "block", width: "auto", blockOffset: 0, offsetTop: 10, list: [
			{type: "button", value: "Pretty Sure!"},
			{type: "newcolumn"},
			{type: "button", value: "Ooops", className: "gray_btn", offsetLeft: 5}
		]}
	]
};