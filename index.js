function createIndexHTML(data) {

	var out = 
		"<h5>My Favourite Things</h5>"+
		"<form method=\"POST\" action=\"/\">"+
		    "<input type=\"text\" name=\"item\" ></input>/"+
		    "<input type=\"submit\" ></input>"+
		"</form>"+
		"<ul id=\"favourite-things\">"
		out += data;
		out += "</ul>";

		return out;
}