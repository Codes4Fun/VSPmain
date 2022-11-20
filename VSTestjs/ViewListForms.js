/*
@licstart The following is the entire license notice for the 
        JavaScript code in this page.
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
@licend The above is the entire license notice
        for the JavaScript code in this page.
*/

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



