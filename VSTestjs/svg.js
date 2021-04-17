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

