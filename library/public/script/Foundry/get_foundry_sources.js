"use strict";

function get_foundry_sources(git = true) {
	if (git) {
		let headers = { accept: ["application/json"] };
		let base_content_url = "http://api.github.com/repos/foundryvtt/pf2e/contents";
		let base_pack_url = "";
		let sources = {};

		let response = rest_call(base_content_url, headers);

		if (response.status != 200) {
			MapTool.chat.broadcast(JSON.stringify(response));
			return null;
		}

		for (var d in response.body) {
			let p = response.body[d];
			if (p.name === "packs") {
				base_pack_url = p.git_url;
			}
		}

		response = rest_call(base_pack_url + "?recursive=true", headers);

		if (response.status != 200) {
			MapTool.chat.broadcast(JSON.stringify(response));
			return null;
		}

		for (var dtwo in response.body.tree) {
			let p = response.body.tree[dtwo];
			if (p.type === "tree") {
				let new_source = { name: p.path, content: {}, type: "source", enabled: false };
				sources[p.path] = new_source;
			} else if (p.type === "blob") {
				let split_array = p.path.split("/");
				let parent = split_array[0];
				let name = split_array[split_array.length - 1];
				if (parent in sources) {
					//let new_data_file = {name: name, sha: p.sha, path:p.path};
					let new_data_file = { name: name, path: p.path };
					sources[parent]["content"][name] = (new_data_file);
				}
			}
		}

		for (var source in sources) {
			//MapTool.chat.broadcast(source);
			//MapTool.chat.broadcast(JSON.stringify(sources[source]));
			if (sources[source].content.length == 0) {
				delete sources[source]
			} else {
				store_object_data(sources[source]);
			}
			//MapTool.chat.broadcast(JSON.stringify(Object.keys(JSON.parse(read_data("pf2e_source")))));
		}

		//MapTool.chat.broadcast(JSON.stringify(Object.keys(sources)));

		return JSON.stringify(sources);
	} else {
		let packList = getLibraryContents("packs");
	}
}

MTScript.registerMacro("ca.pf2e.get_foundry_sources", get_foundry_sources);