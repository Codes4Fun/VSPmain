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

var svgNS = 'http://www.w3.org/2000/svg';

function newSVG(width, height)
{
	var svg = document.createElementNS(svgNS, 'svg');
	svg.style.width = width + 'px';
	svg.style.height = height + 'px';
	return svg;
}

// attr: {x1, y1, x2, y2, style, stroke}
function newSVGLine(attr)//x1, y1, x2, y2, style)
{
	var node = document.createElementNS(svgNS, 'line');
	if (attr)
	{
		for (var i in attr)
		{
			node.setAttribute(i, attr[i]);
		}
	}
	return node;
}

// attr: {x, y, width, height, style[fill:color], fill[color]}
function newSVGRect(attr)//x, y, width, height, style)
{
	var node = document.createElementNS(svgNS, 'rect');
	if (attr)
	{
		for (var i in attr)
		{
			node.setAttribute(i, attr[i]);
		}
	}
	return node;
}

// attr: {x, y, style[fill:color], fill=color, text-anchor[middle]}
function newSVGText(text, attr)
{
	var node = document.createElementNS(svgNS, 'text');
	if (attr)
	{
		for (var i in attr)
		{
			node.setAttribute(i, attr[i]);
		}
	}
	node.appendChild(document.createTextNode(text));
	return node;
}

// attr: {d[M x y L x y B cx cy x y C cx1 cy1 cx2 cy2 x y], stroke, style}
function newSVGPath(attr)
{
	var node = document.createElementNS(svgNS, 'path');
	if (attr)
	{
		for (var i in attr)
		{
			node.setAttribute(i, attr[i]);
		}
	}
	return node;
}

// attr: {x, y}
function newSVGGroup(attr)
{
	var node = document.createElementNS(svgNS, 'g');
	if (attr)
	{
		for (var i in attr)
		{
			node.setAttribute(i, attr[i]);
		}
	}
	return node;
}

