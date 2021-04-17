

ViewListForms = {}

ViewListForms.selected = 0;

ViewListForms.select = function (index)
{
	var prevIndex = ViewListForms.selected;
	if (index == prevIndex)
	{
		return;
	}
	ViewListForms.selected = index;
	ViewListForms.ListElement.children[prevIndex].className = 'Item';
	ViewListForms.ListElement.children[index].className = 'Item-selected';
	ViewListForms.OnItemChanged();
}

function ViewListForms_onmousedown(index)
{
	return function (e)
	{
		//e.preventDefault();
		ViewListForms.select(index);
	}
}

ViewListForms.ListElement = document.getElementById("KeyList");




ViewListForms.OnInitialUpdate = function ()
{
	while( ViewListForms.ListElement.children.length)
	{
		var child = ViewListForms.ListElement.children[0];
		ViewListForms.ListElement.removeChild(child);
	}
	for (var i = 0; i < strPhonemes.length; i++)
	{
		var item = document.createElement('div');
		item.className = (i == ViewListForms.selected)? 'Item-selected' : 'Item';
		item.innerText = strPhonemes[i];
		item.onmousedown = ViewListForms_onmousedown(i);
		item.oncontextmenu = function (e) { e.preventDefault(); };
		ViewListForms.ListElement.appendChild(item);
	}
}

ViewListForms.OnItemChanged = function ()
{
	TestDoc.curVertex = ViewListForms.selected;
	SAGraphView.OnUpdate();
	ViewData.OnUpdate();
}

ViewListForms.OnUpdate = function ()
{
	ViewListForms.select(TestDoc.curVertex);
}



