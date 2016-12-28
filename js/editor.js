$.get({
		url: "songbooks/test2.yaml",
		success: (resp) => {
			window.editor.setValue(resp, 1);
		}
	})