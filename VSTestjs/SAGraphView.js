var SAGraphView = {}

SAGraphView.ViewElement = document.getElementById('Graph');
SAGraphView.ViewElement.tabIndex = 0;

SAGraphView.borderWidth = 2;

SAGraphView.capture = false;

SAGraphView.setCapture = function ()
{
	SAGraphView.capture = true;
	window.addEventListener('mouseup', SAGraphView.onmouseup, true);
	window.addEventListener('mousemove', SAGraphView.onmousemove, true);
	SAGraphView.ViewElement.onmouseup = null;
	SAGraphView.ViewElement.omousemove = null;
}

SAGraphView.releaseCapture = function ()
{
	if (SAGraphView.capture)
	{
		SAGraphView.capture = false;
		window.removeEventListener('mouseup', SAGraphView.onmouseup, true);
		window.removeEventListener('mousemove', SAGraphView.onmousemove, true);
		SAGraphView.ViewElement.onmouseup = SAGraphView.onmouseup;
		SAGraphView.ViewElement.omousemove = SAGraphView.onmousemove;
	}
}

SAGraphView.onmousedown = function (e)
{
	e.preventDefault();
	SAGraphView.ViewElement.focus();
	if (e.button == 0)
	{
		SAGraphView.OnLButtonDown({
			x: e.pageX - SAGraphView.ViewElement.offsetLeft - SAGraphView.borderWidth,
			y: e.pageY - SAGraphView.ViewElement.offsetTop - SAGraphView.borderWidth});
	}
}

SAGraphView.onmouseup = function (e)
{
	e.preventDefault();
	if (SAGraphView.capture)
	{
		e.stopPropagation();
	}
	if (e.button == 0)
	{
		SAGraphView.OnLButtonUp({
			x: e.pageX - SAGraphView.ViewElement.offsetLeft - SAGraphView.borderWidth,
			y: e.pageY - SAGraphView.ViewElement.offsetTop - SAGraphView.borderWidth});
	}
}

SAGraphView.onmousemove = function (e)
{
	e.preventDefault();
	if (SAGraphView.capture)
	{
		e.stopPropagation();
	}
	SAGraphView.OnMouseMove({
		x: e.pageX - SAGraphView.ViewElement.offsetLeft - SAGraphView.borderWidth,
		y: e.pageY - SAGraphView.ViewElement.offsetTop - SAGraphView.borderWidth});
}

SAGraphView.onkeydown = function (e)
{
	SAGraphView.OnKeyDown(e.which);
}

SAGraphView.ViewElement.onmousedown = SAGraphView.onmousedown;
SAGraphView.ViewElement.onmouseup = SAGraphView.onmouseup;
SAGraphView.ViewElement.omousemove = SAGraphView.onmousemove;
SAGraphView.ViewElement.onkeydown = SAGraphView.onkeydown;



SAGraphView.dragVertex = -1;

SAGraphView.OnInitialUpdate = function ()
{
	if (!SAGraphView.svg)
	{
		SAGraphView.svg = newSVG(2 * 640 + 4, 255 * 16 + 10);
		SAGraphView.ViewElement.appendChild(SAGraphView.svg);

		var sgWave = newSVGGroup();
		SAGraphView.svg.appendChild(sgWave);
		SAGraphView.sgWave = sgWave;

		var sgGen = newSVGGroup();
		SAGraphView.svg.appendChild(sgGen);
		SAGraphView.sgGen = sgGen;

		var splines = newSVGGroup();
		SAGraphView.svg.appendChild(splines);
		SAGraphView.splines = splines;

		var points = newSVGGroup();
		SAGraphView.svg.appendChild(points);
		SAGraphView.points = points;

		for (var i = 0; i < 37; i++)
		{
			var color = ((i % 3) == 0)? 'rgb(194,32,32)' : 'rgb(64,64,128)';
			var rect = newSVGRect({x:0,y:0,width:4,height:4,fill:color});
			points.appendChild(rect);
		}

		for (var i = 0; i < 12; i++)
		{
			var spline = newSVGPath({stroke:'black', fill:'none'});
			splines.appendChild(spline);
		}
	}

	SAGraphView.ViewElement.scrollTop = 255 * 16 + 10;

	SAGraphView.OnUpdate();
};

SAGraphView.OnLButtonDown = function (point)
{
	var pnt =
	{
		x: point.x + SAGraphView.ViewElement.scrollLeft,
		y: (255 * 16 - 10) - (point.y + SAGraphView.ViewElement.scrollTop)
	};

	var mouse_vert = 
	{
		x: pnt.x*5512.5/640,
		y: pnt.y/16
	};

	for (var i = 0; i < 37; i++)
	{
		if ( pnt.x > (TestDoc.vertex[TestDoc.curVertex][i].x * 640 / 5512.5 - 3)
		  && pnt.x < (TestDoc.vertex[TestDoc.curVertex][i].x * 640 / 5512.5 + 3)
		  && pnt.y > (TestDoc.vertex[TestDoc.curVertex][i].y * 16 - 3)
		  && pnt.y < (TestDoc.vertex[TestDoc.curVertex][i].y * 16 + 3))
		{
			SAGraphView.setCapture();
			SAGraphView.dragVertex = i;
			break;
		}
	}
};

SAGraphView.OnMouseMove = function (point)
{
	if (SAGraphView.dragVertex == -1)
	{
		return;
	}

	var pnt =
	{
		x: point.x + SAGraphView.ViewElement.scrollLeft,
		y: (255 * 16 - 10) - (point.y + SAGraphView.ViewElement.scrollTop)
	};

	var mouse_vert = 
	{
		x: pnt.x*5512.5/640,
		y: pnt.y/16
	};

	var dragVertex = SAGraphView.dragVertex;
	var vertex = TestDoc.vertex[TestDoc.curVertex];

	/*vertex[dragVertex].y = mouse_vert.y;
	{
		if( mouse_vert.x < vertex[dragVertex-1].x + 6.0f )
			mouse_vert.x = vertex[dragVertex-1].x + 6.0f;
		if( mouse_vert.x > vertex[dragVertex+1].x - 6.0f )
			mouse_vert.x = vertex[dragVertex+1].x - 6.0f;
		vertex[dragVertex].x = mouse_vert.x;
	}*/

	if (dragVertex == 0)
	{
		vertex[dragVertex+1].y += (mouse_vert.y - vertex[dragVertex].y);
		vertex[dragVertex].y = mouse_vert.y;
	}
	else if (dragVertex == 1)
	{
		vertex[dragVertex].y = mouse_vert.y;
	}
	else if (dragVertex == 35)
	{
		vertex[dragVertex].y = mouse_vert.y;
	}
	else if (dragVertex == 36)
	{
		vertex[dragVertex-1].y += (mouse_vert.y - vertex[dragVertex].y);
		vertex[dragVertex].y = mouse_vert.y;
	}
	else
	{
		var temp;
		switch (dragVertex % 3)
		{
		case 0:
			if (mouse_vert.x > (vertex[dragVertex-3].x + 200)
			 && mouse_vert.x < (vertex[dragVertex+3].x - 200))
			{
				temp=(vertex[dragVertex-3].x-mouse_vert.x)*2/3+mouse_vert.x;
				vertex[dragVertex-2].y=
					(vertex[dragVertex-2].y-vertex[dragVertex-3].y)
					*(temp-vertex[dragVertex-3].x)
					/(vertex[dragVertex-2].x-vertex[dragVertex-3].x)
					+vertex[dragVertex-3].y;
				vertex[dragVertex-2].x=temp;
				//
				temp=(vertex[dragVertex-3].x-mouse_vert.x)/3+mouse_vert.x;
				vertex[dragVertex-1].y=
					(vertex[dragVertex-1].y-vertex[dragVertex].y)
					*(temp-mouse_vert.x)
					/(vertex[dragVertex-1].x-vertex[dragVertex].x)
					+vertex[dragVertex].y;
				vertex[dragVertex-1].x=temp;
				//
				temp=(vertex[dragVertex+3].x-mouse_vert.x)*2/3+mouse_vert.x;
				vertex[dragVertex+2].y=
					(vertex[dragVertex+2].y-vertex[dragVertex+3].y)
					*(temp-vertex[dragVertex+3].x)
					/(vertex[dragVertex+2].x-vertex[dragVertex+3].x)
					+vertex[dragVertex+3].y;
				vertex[dragVertex+2].x=temp;
				//
				temp=(vertex[dragVertex+3].x-mouse_vert.x)/3+mouse_vert.x;
				vertex[dragVertex+1].y=
					(vertex[dragVertex+1].y-vertex[dragVertex].y)
					*(temp-mouse_vert.x)
					/(vertex[dragVertex+1].x-vertex[dragVertex].x)
					+vertex[dragVertex].y;
				vertex[dragVertex+1].x=temp;
				//
				vertex[dragVertex].x=mouse_vert.x;
			}
			vertex[dragVertex-1].y+=(mouse_vert.y-vertex[dragVertex].y);
			vertex[dragVertex+1].y+=(mouse_vert.y-vertex[dragVertex].y);
			vertex[dragVertex].y=mouse_vert.y;
			break;
		case 1:
			//vertex[dragVertex].x=mouse_vert.x;
			vertex[dragVertex-2].y+=
				(mouse_vert.y-vertex[dragVertex].y)
				*(vertex[dragVertex-2].x-vertex[dragVertex-1].x)
				/(vertex[dragVertex].x-vertex[dragVertex-1].x);
			vertex[dragVertex].y=mouse_vert.y;
			break;
		case 2:
			//vertex[dragVertex].x=mouse_vert.x;
			vertex[dragVertex+2].y+=
				(mouse_vert.y-vertex[dragVertex].y)
				*(vertex[dragVertex+2].x-vertex[dragVertex+1].x)
				/(vertex[dragVertex].x-vertex[dragVertex+1].x);
			vertex[dragVertex].y=mouse_vert.y;
			break;
		}
	}

	if (dragVertex > 0 && (dragVertex % 3) == 0)
	{
		var i = dragVertex-1;
		var point = SAGraphView.points.children[i];
		point.setAttribute('x', vertex[i].x * 640 / 5512.5 - 2);
		point.setAttribute('y', (255 * 16 - 10) - vertex[i].y * 16 - 2);
		var i = dragVertex-2;
		var point = SAGraphView.points.children[i];
		point.setAttribute('x', vertex[i].x * 640 / 5512.5 - 2);
		point.setAttribute('y', (255 * 16 - 10) - vertex[i].y * 16 - 2);
	}
	if (dragVertex < 36 && (dragVertex % 3) == 0)
	{
		var i = dragVertex+1;
		var point = SAGraphView.points.children[i];
		point.setAttribute('x', vertex[i].x * 640 / 5512.5 - 2);
		point.setAttribute('y', (255 * 16 - 10) - vertex[i].y * 16 - 2);
		var i = dragVertex+2;
		var point = SAGraphView.points.children[i];
		point.setAttribute('x', vertex[i].x * 640 / 5512.5 - 2);
		point.setAttribute('y', (255 * 16 - 10) - vertex[i].y * 16 - 2);
	}
	if (dragVertex > 1 && (dragVertex % 3) == 1)
	{
		var i = dragVertex-2;
		var point = SAGraphView.points.children[i];
		point.setAttribute('x', vertex[i].x * 640 / 5512.5 - 2);
		point.setAttribute('y', (255 * 16 - 10) - vertex[i].y * 16 - 2);
	}
	if (dragVertex < 36-2 && (dragVertex % 3) == 2)
	{
		var i = dragVertex+2;
		var point = SAGraphView.points.children[i];
		point.setAttribute('x', vertex[i].x * 640 / 5512.5 - 2);
		point.setAttribute('y', (255 * 16 - 10) - vertex[i].y * 16 - 2);
	}
	var i = dragVertex;
	var point = SAGraphView.points.children[i];
	point.setAttribute('x', vertex[i].x * 640 / 5512.5 - 2);
	point.setAttribute('y', (255 * 16 - 10) - vertex[i].y * 16 - 2);

	var i = Math.trunc((dragVertex + 1) / 3);
	if (i < 12)
	{
		var vi = i*3;
		var x1 = vertex[vi+0].x * 640 / 5512.5;
		var y1 = (255 * 16 - 10) - vertex[vi+0].y * 16;
		var x2 = vertex[vi+1].x * 640 / 5512.5;
		var y2 = (255 * 16 - 10) - vertex[vi+1].y * 16;
		var x3 = vertex[vi+2].x * 640 / 5512.5;
		var y3 = (255 * 16 - 10) - vertex[vi+2].y * 16;
		var x4 = vertex[vi+3].x * 640 / 5512.5;
		var y4 = (255 * 16 - 10) - vertex[vi+3].y * 16;
		var path =	'M ' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' C'
					+ ' ' + x2.toFixed(2) + ' ' + y2.toFixed(2)
					+ ' ' + x3.toFixed(2) + ' ' + y3.toFixed(2)
					+ ' ' + x4.toFixed(2) + ' ' + y4.toFixed(2);
		
		var spline = SAGraphView.splines.children[i];
		spline.setAttribute('d', path);
	}
	if (i > 0)
	{
		i--;
		var vi = i*3;
		var x1 = vertex[vi+0].x * 640 / 5512.5;
		var y1 = (255 * 16 - 10) - vertex[vi+0].y * 16;
		var x2 = vertex[vi+1].x * 640 / 5512.5;
		var y2 = (255 * 16 - 10) - vertex[vi+1].y * 16;
		var x3 = vertex[vi+2].x * 640 / 5512.5;
		var y3 = (255 * 16 - 10) - vertex[vi+2].y * 16;
		var x4 = vertex[vi+3].x * 640 / 5512.5;
		var y4 = (255 * 16 - 10) - vertex[vi+3].y * 16;
		var path =	'M ' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' C'
					+ ' ' + x2.toFixed(2) + ' ' + y2.toFixed(2)
					+ ' ' + x3.toFixed(2) + ' ' + y3.toFixed(2)
					+ ' ' + x4.toFixed(2) + ' ' + y4.toFixed(2);
		
		var spline = SAGraphView.splines.children[i];
		spline.setAttribute('d', path);
	}

//////////////////////////
	if (!TestDoc.ftd)
	{
		return;
	}
	var i,j,k,t;
	var mag,u,x,y,temp;
	var vert = TestDoc.vertex[TestDoc.curVertex];
	var sdvert = [];
	for (var i = 0; i < 49; i++)
	{
		sdvert.push({x:0,y:0});
	}

	var ftd = TestDoc.ftd;
	var ftdo = TestDoc.ftdo;
	var lineCount = ftd.length/2;

	// FT from form
	var fdata,freq,iu,amp,rad=[
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
	],fm;
	fm=Math.PI*2/TestDoc.format.nSamplesPerSec;

	sdvert[0].x=vert[0].x;
	sdvert[0].y=vert[0].y;
	for(i=0;i<12;i++){
		for(j=1;j<4;j++){
			u=j/4;
			iu=(1-u);
			sdvert[i*4+j].x=((iu*iu*iu)*vert[i*3].x+
				(3*u*iu*iu)*vert[i*3+1].x+
				(3*u*u*iu)*vert[i*3+2].x+
				(u*u*u)*vert[i*3+3].x);
			sdvert[i*4+j].y=((iu*iu*iu)*vert[i*3].y+
				(3*u*iu*iu)*vert[i*3+1].y+
				(3*u*u*iu)*vert[i*3+2].y+
				(u*u*u)*vert[i*3+3].y);
		}
		sdvert[i*4+4].x=vert[i*3+3].x;
		sdvert[i*4+4].y=vert[i*3+3].y;
	}
	//
	for(i=0;i<ftd.length;i++){
		fdata=0;
		for(j=1;j<31;j++){
			freq=TestDoc.frequency[TestDoc.curVertex]*j;
			for(k=1;k<49;k++){
				if(freq<sdvert[k].x){
					u=(freq-sdvert[k-1].x)/(sdvert[k].x-sdvert[k-1].x);
					iu=1-u;
					y=iu*sdvert[k-1].y+u*sdvert[k].y;
					amp=y;
					break;
				}
			}
			rad[j-1]+=freq*fm;
			fdata+=Math.cos(rad[j-1])*amp;
		}
		if(fdata>127.5)fdata=127.5;
		else if(fdata<-127.5)fdata=-127.5;
		ftd.data[i].x=fdata;
		ftd.data[i].y=0;
	}
	DoFFT(ftdo,ftd);

	var prevX = 0, prevY = (255*16-10);
	var scale = 2*TestDoc.format.nSamplesPerSec/2/ftd.length*640/5512;
	for(i=0;i<lineCount;i++){
		mag=Math.sqrt(ftdo.data[i].x*ftdo.data[i].x
			+ftdo.data[i].y*ftdo.data[i].y);
		var line = SAGraphView.sgGen.children[i];
		line.setAttribute('x1', prevX);
		line.setAttribute('y1', prevY);
		prevX = i*scale;
		prevY = (255*16-10)-(mag*16);
		line.setAttribute('x2', prevX);
		line.setAttribute('y2', prevY);
	}
//////////////////////////
};

SAGraphView.OnLButtonUp = function (point)
{
	if (SAGraphView.dragVertex == -1)
	{
		return;
	}

	var pnt =
	{
		x: point.x + SAGraphView.ViewElement.scrollLeft,
		y: (255 * 16 - 10) - (point.y + SAGraphView.ViewElement.scrollTop)
	};

	var mouse_vert = 
	{
		x: pnt.x*5512.5/640,
		y: pnt.y/16
	};

	SAGraphView.dragVertex = -1;
	SAGraphView.releaseCapture();
}

SAGraphView.OnUpdate = function ()
{
	var vert = TestDoc.vertex[TestDoc.curVertex];

	for (var i = 0; i < 37; i++)
	{
		var point = SAGraphView.points.children[i];
		point.setAttribute('x', vert[i].x * 640 / 5512.5 - 2);
		point.setAttribute('y', (255 * 16 - 10) - vert[i].y * 16 - 2);
	}

	for (var i = 0; i < 12; i++)
	{
		var vi = i*3;
		var x1 = vert[vi+0].x * 640 / 5512.5;
		var y1 = (255 * 16 - 10) - vert[vi+0].y * 16;
		var x2 = vert[vi+1].x * 640 / 5512.5;
		var y2 = (255 * 16 - 10) - vert[vi+1].y * 16;
		var x3 = vert[vi+2].x * 640 / 5512.5;
		var y3 = (255 * 16 - 10) - vert[vi+2].y * 16;
		var x4 = vert[vi+3].x * 640 / 5512.5;
		var y4 = (255 * 16 - 10) - vert[vi+3].y * 16;
		var path =	'M ' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' C'
					+ ' ' + x2.toFixed(2) + ' ' + y2.toFixed(2)
					+ ' ' + x3.toFixed(2) + ' ' + y3.toFixed(2)
					+ ' ' + x4.toFixed(2) + ' ' + y4.toFixed(2);
		
		var spline = SAGraphView.splines.children[i];
		spline.setAttribute('d', path);
	}

	if (!TestDoc.ftd)
	{
		while (SAGraphView.sgWave.children.length > 0)
		{
			SAGraphView.sgWave.removeChild(SAGraphView.sgWave.lastChildElement);
		}
		while (SAGraphView.sgGen.children.length > 0)
		{
			SAGraphView.sgGen.removeChild(SAGraphView.sgGen.lastChildElement);
		}
		return;
	}
	
	var lineCount = TestDoc.ftd.length/2;

	while (lineCount < SAGraphView.sgWave.children.length)
	{
		SAGraphView.sgWave.removeChild(SAGraphView.sgWave.lastChildElement);
	}

	while (lineCount > SAGraphView.sgWave.children.length)
	{
		SAGraphView.sgWave.appendChild(newSVGLine({stroke:'black', fill:'none'}));
	}

	while (lineCount < SAGraphView.sgGen.children.length)
	{
		SAGraphView.sgGen.removeChild(SAGraphView.sgGen.lastChildElement);
	}

	while (lineCount > SAGraphView.sgGen.children.length)
	{
		SAGraphView.sgGen.appendChild(newSVGLine({stroke:'rgb(64,64,255)', fill:'none'}));
	}

	var i,j,k,t;
	var mag,u,x,y,temp;
	var vert = TestDoc.vertex[TestDoc.curVertex];
	var sdvert = [];
	for (var i = 0; i < 49; i++)
	{
		sdvert.push({x:0,y:0});
	}

	var ftd = TestDoc.ftd;
	var ftdo = TestDoc.ftdo;

	// FT from form
	var fdata,freq,iu,amp,rad=[
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
	],fm;
	fm=Math.PI*2/TestDoc.format.nSamplesPerSec;

	sdvert[0].x=vert[0].x;
	sdvert[0].y=vert[0].y;
	for(i=0;i<12;i++){
		for(j=1;j<4;j++){
			u=j/4;
			iu=(1-u);
			sdvert[i*4+j].x=((iu*iu*iu)*vert[i*3].x+
				(3*u*iu*iu)*vert[i*3+1].x+
				(3*u*u*iu)*vert[i*3+2].x+
				(u*u*u)*vert[i*3+3].x);
			sdvert[i*4+j].y=((iu*iu*iu)*vert[i*3].y+
				(3*u*iu*iu)*vert[i*3+1].y+
				(3*u*u*iu)*vert[i*3+2].y+
				(u*u*u)*vert[i*3+3].y);
		}
		sdvert[i*4+4].x=vert[i*3+3].x;
		sdvert[i*4+4].y=vert[i*3+3].y;
	}
	//
	for(i=0;i<ftd.length;i++){
		fdata=0;
		for(j=1;j<31;j++){
			freq=TestDoc.frequency[TestDoc.curVertex]*j;
			for(k=1;k<49;k++){
				if(freq<sdvert[k].x){
					u=(freq-sdvert[k-1].x)/(sdvert[k].x-sdvert[k-1].x);
					iu=1-u;
					y=iu*sdvert[k-1].y+u*sdvert[k].y;
					amp=y;
					break;
				}
			}
			rad[j-1]+=freq*fm;
			fdata+=Math.cos(rad[j-1])*amp;
		}
		if(fdata>127.5)fdata=127.5;
		else if(fdata<-127.5)fdata=-127.5;
		ftd.data[i].x=fdata;
		ftd.data[i].y=0;
	}
	DoFFT(ftdo,ftd);

	var prevX = 0, prevY = (255*16-10);
	var scale = 2*TestDoc.format.nSamplesPerSec/2/ftd.length*640/5512;
	for(i=0;i<lineCount;i++){
		mag=Math.sqrt(ftdo.data[i].x*ftdo.data[i].x
			+ftdo.data[i].y*ftdo.data[i].y);
		var line = SAGraphView.sgGen.children[i];
		line.setAttribute('x1', prevX);
		line.setAttribute('y1', prevY);
		prevX = i*scale;
		prevY = (255*16-10)-(mag*16);
		line.setAttribute('x2', prevX);
		line.setAttribute('y2', prevY);
	}

	// FT from Wave
	for(i=0;i<ftd.length;i++){
		t=Math.trunc((i+TestDoc.selection)-(ftd.length/2));
		if((t<0)||(t>=TestDoc.data.length)){
			ftd.data[i].x=0;
			ftd.data[i].y=0;
		}else{
			ftd.data[i].x=TestDoc.data[t]*127.5;
			ftd.data[i].y=0;
		}
	}
	DoFFT(ftdo,ftd);

	var prevX = 0, prevY = (255*16-10);
	var iTemp,iTemp2;
	iTemp=2*(TestDoc.format.nSamplesPerSec/2)*640;
	iTemp2=ftd.length*5512;
	for(i=0;i<lineCount;i++){
		mag=Math.sqrt(ftdo.data[i].x*ftdo.data[i].x
			+ftdo.data[i].y*ftdo.data[i].y);
		var line = SAGraphView.sgWave.children[i];
		line.setAttribute('x1', prevX);
		line.setAttribute('y1', prevY);
		prevX = i*iTemp/iTemp2;
		prevY = (255*16-10)-(mag*16);
		line.setAttribute('x2', prevX);
		line.setAttribute('y2', prevY);
	}
};
