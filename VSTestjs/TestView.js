var TestView = {}

TestView.ViewElement = document.getElementById('TimeLine');
TestView.ViewElement.tabIndex = 0;

TestView.borderWidth = 2;

TestView.capture = false;

TestView.setCapture = function ()
{
	TestView.capture = true;
	window.addEventListener('mouseup', TestView.onmouseup, true);
	window.addEventListener('mousemove', TestView.onmousemove, true);
	TestView.ViewElement.onmouseup = null;
	TestView.ViewElement.omousemove = null;
}

TestView.releaseCapture = function ()
{
	if (TestView.capture)
	{
		TestView.capture = false;
		window.removeEventListener('mouseup', TestView.onmouseup, true);
		window.removeEventListener('mousemove', TestView.onmousemove, true);
		TestView.ViewElement.onmouseup = TestView.onmouseup;
		TestView.ViewElement.omousemove = TestView.onmousemove;
	}
}

TestView.onmousedown = function (e)
{
	e.preventDefault();
	TestView.ViewElement.focus();
	if (e.button == 0)
	{
		TestView.OnLButtonDown({
			x: e.pageX - TestView.ViewElement.offsetLeft - TestView.borderWidth,
			y: e.pageY - TestView.ViewElement.offsetTop - TestView.borderWidth});
	}
}

TestView.onmouseup = function (e)
{
	e.preventDefault();
	if (TestView.capture)
	{
		e.stopPropagation();
	}
	if (e.button == 0)
	{
		TestView.OnLButtonUp({
			x: e.pageX - TestView.ViewElement.offsetLeft - TestView.borderWidth,
			y: e.pageY - TestView.ViewElement.offsetTop - TestView.borderWidth});
	}
}

TestView.onmousemove = function (e)
{
	e.preventDefault();
	if (TestView.capture)
	{
		e.stopPropagation();
	}
	TestView.OnMouseMove({
		x: e.pageX - TestView.ViewElement.offsetLeft - TestView.borderWidth,
		y: e.pageY - TestView.ViewElement.offsetTop - TestView.borderWidth});
}

TestView.onkeydown = function (e)
{
	TestView.OnKeyDown(e.which);
}

TestView.ViewElement.onmousedown = TestView.onmousedown;
TestView.ViewElement.onmouseup = TestView.onmouseup;
TestView.ViewElement.omousemove = TestView.onmousemove;
TestView.ViewElement.onkeydown = TestView.onkeydown;




TestView.OnLButtonDown = function (point)
{
	var nPos = TestView.ViewElement.scrollLeft;
	if (TestDoc.mode == 1)
	{
		var time;
		TestDoc.curPKey = null;
		if (TestDoc.phonKey)
		{
			for (var i = 0; i < TestDoc.phonKey.length; i++)
			{
				pkey = TestDoc.phonKey[i];

				time = pkey.time * 640;
				if (((time - 4) < (point.x + nPos)) && ((time + 4) > (point.x + nPos)))
				{
					TestDoc.curPKey = pkey;
					TestDoc.curPKeyIndex = i;
					break;
				}
			}
		}
	}
	else if (TestDoc.mode == 2)
	{
		var pkey =
		{
			time : (point.x + nPos) / 640,
			phoneme : TestDoc.curVertex,
			amplitude : 1,
			frequency : TestDoc.frequency[TestDoc.curVertex],
			noise : TestDoc.noise[TestDoc.curVertex],
		};
		var i = 0;
		for (;i < TestDoc.phonKey.length; i++)
		{
			if (TestDoc.phonKey[i].time > pkey.time)
			{
				break;
			}
		}
		TestDoc.phonKey.splice(i,0,pkey);
		TestDoc.curPKey = pkey;
		TestDoc.curPKeyIndex = i;
		
		var time = pkey.time * 640;
		var g = newSVGGroup({transform: 'translate('+time+',0)'});
		if (i < TestView.phonKeyGroup.children.length)
		{
			TestView.phonKeyGroup.insertBefore(g, TestView.phonKeyGroup.children[i]);
		}
		else
		{
			TestView.phonKeyGroup.appendChild(g);
		}
		var line = newSVGLine({x1:0, y1:0, x2:0, y2:255, stroke:'rgb(128,128,128)'});
		g.appendChild(line);
		var rect = newSVGRect({x:-16, y:120, width:32, height:18, fill:'rgb(192,192,192)'});
		g.appendChild(rect);
		var text = newSVGText(strPhonemes[pkey.phoneme], {x:0, y:138, fill:'black', cursor:'default', 'text-anchor':'middle'});
		g.appendChild(text);
	}
	SAGraphView.OnUpdate();
	ViewData.OnUpdate();
	TestView.bSelectDrag = true;
	TestView.setCapture();
}

TestView.OnLButtonUp = function (point)
{
	if (!TestView.bSelectDrag)
	{
		return;
	}
	var nPos = TestView.ViewElement.scrollLeft;
	TestDoc.selection = (point.x + nPos) * TestDoc.format.nSamplesPerSec / 640;
	TestView.svg.firstChild.setAttribute('x', TestDoc.selection*640/TestDoc.format.nSamplesPerSec);

	SAGraphView.OnUpdate();

	TestView.bSelectDrag = false;
	TestView.releaseCapture();
}

TestView.OnMouseMove = function (point)
{
	if (!TestView.bSelectDrag)
	{
		return;
	}

	var nPos = TestView.ViewElement.scrollLeft;
	TestDoc.selection = (point.x + nPos) * TestDoc.format.nSamplesPerSec / 640;
	TestView.svg.firstChild.setAttribute('x', TestDoc.selection*640/TestDoc.format.nSamplesPerSec);

	if ((TestDoc.mode == 1 || TestDoc.mode == 2) && TestDoc.curPKey)
	{
		var pkey = TestDoc.curPKey;
		pkey.time = (point.x + nPos) / 640;
		TestView.phonKeyGroup.children[TestDoc.curPKeyIndex].setAttribute('transform', 'translate('+(point.x + nPos)+',0)');

		var curIndex = TestDoc.curPKeyIndex;
		while (curIndex > 0 && pkey.time < TestDoc.phonKey[curIndex - 1].time)
		{
			curIndex--;
		}
		while (curIndex + 1 < TestDoc.phonKey.length && pkey.time > TestDoc.phonKey[curIndex + 1].time)
		{
			curIndex++;
		}
		if (curIndex != TestDoc.curPKeyIndex)
		{
			var prevIndex = TestDoc.curPKeyIndex;

			TestDoc.phonKey.splice(TestDoc.curPKeyIndex,1);
			TestDoc.phonKey.splice(curIndex,0,TestDoc.curPKey);
			TestDoc.curPKeyIndex = curIndex;

			var g = TestView.phonKeyGroup.children[prevIndex];
			TestView.phonKeyGroup.removeChild(g);
			if (curIndex < TestView.phonKeyGroup.children.length)
			{
				TestView.phonKeyGroup.insertBefore(g, TestView.phonKeyGroup.children[curIndex]);
			}
			else
			{
				TestView.phonKeyGroup.appendChild(g);
			}
		}
	}

	SAGraphView.OnUpdate();
}

TestView.OnUpdate = function ()
{
	if (TestView.svg)
	{
		while (TestView.svg.firstElementChild)
		{
			TestView.svg.removeChild(TestView.svg.firstElementChild);
		}

		var selection = newSVGRect({
			x: TestDoc.selection*640/TestDoc.format.nSamplesPerSec, y: 0,
			width:1, height:255, fill:'white'});
		TestView.svg.appendChild(selection);

		var phonKeyGroup = newSVGGroup();
		TestView.svg.appendChild(phonKeyGroup);
		TestView.phonKeyGroup = phonKeyGroup;
		
		for (var i = 0; i < TestDoc.phonKey.length; i++)
		{
			var pkey = TestDoc.phonKey[i];
			var time = pkey.time * 640;
			var g = newSVGGroup({transform: 'translate('+time+',0)'});
			phonKeyGroup.appendChild(g);
			var line = newSVGLine({x1:0, y1:0, x2:0, y2:255, stroke:'rgb(128,128,128)'});
			g.appendChild(line);
			var rect = newSVGRect({x:-16, y:120, width:32, height:18, fill:'rgb(192,192,192)'});
			g.appendChild(rect);
			var text = newSVGText(strPhonemes[pkey.phoneme], {x:0, y:138, fill:'black', cursor:'default', 'text-anchor':'middle'});
			g.appendChild(text);
		}
	}
}

TestView.OnKeyDown = function (nChar)
{
	if (nChar == 37) // left
	{
		TestDoc.selection--;
		if (TestDoc.selection < 0) TestDoc.selection = 0;
		TestView.svg.firstChild.setAttribute('x', TestDoc.selection*640/TestDoc.format.nSamplesPerSec);
		SAGraphView.OnUpdate();
	}
	else if (nChar == 39) // right
	{
		TestDoc.selection++;
		TestView.svg.firstChild.setAttribute('x', TestDoc.selection*640/TestDoc.format.nSamplesPerSec);
		SAGraphView.OnUpdate();
	}
	else if (nChar == 46) // delete
	{
		if (TestDoc.mode == 1 && TestDoc.curPKey)
		{
			TestDoc.phonKey.splice(TestDoc.curPKeyIndex,1);

			var g = TestView.phonKeyGroup.children[TestDoc.curPKeyIndex];
			TestView.phonKeyGroup.removeChild(g);

			TestDoc.curPKey = null;
			TestDoc.curPKeyIndex = undefined;
		}
	}
}

TestView.OnInitialUpdate = function ()
{
	TestView.OnViewWaveform();
	//TestView.OnViewSpectrogram();

	var width = TestDoc.data.length*640/TestDoc.format.nSamplesPerSec;
	if (width < 640)
	{
		width = 640;
	}
	if (width > 0)
	{
		if (TestView.svg)
		{
			TestView.ViewElement.removeChild(TestView.svg);
		}
		TestView.svg = newSVG();
		TestView.svg.style.width = width + 'px';
		TestView.svg.style.height = '255px';
		TestView.svg.style.position = 'absolute';
		TestView.svg.style.zIndex = '1';
		TestView.ViewElement.appendChild(TestView.svg);
	}
	
	TestView.OnUpdate();
}

TestView.OnViewSpectrogram = function ()
{
	if (TestView.bitmap)
	{
		TestView.ViewElement.removeChild(TestView.bitmap);
		TestView.bitmap = null;
	}
	var width = TestDoc.data.length*640/TestDoc.format.nSamplesPerSec;
	if (width > 0)
	{
		TestView.bitmap = document.createElement('canvas');
		TestView.bitmap.style.position = 'absolute';
		TestView.ViewElement.appendChild(TestView.bitmap);
		TestView.bitmap.width = width;
		TestView.bitmap.height = 255;
		var ctx = TestView.bitmap.getContext('2d');

		var ftd = TestDoc.ftd;
		var ftdo = TestDoc.ftdo;
		
		//var step = TestDoc.format.nSamplesPerSec / 11025;
		var step = 1;

		var height = 512 / ftd.length;
		//if (height < 1) height = 1;
		for (var i = 0; i < width; i++)
		{
			for (var j = 0; j < ftd.length; j++)
			{
				var t = Math.trunc((j*step + (i * TestDoc.format.nSamplesPerSec/640)) - (ftd.length/2));
				if ((t < 0) || (t >= TestDoc.length))
				{
					ftd.data[j].x = 0;
					ftd.data[j].y = 0;
				}
				else
				{
					ftd.data[j].x = TestDoc.data[t] * 127.5;
					ftd.data[j].y = 0;
				}
			}
			DoFFT(ftdo, ftd);
			var nextY = height;
			for (var j = 0; j < ftd.length/2; j++)
			{
				if (nextY >= 1)
				{
					var height = Math.trunc(nextY);
					nextY = nextY - height;
					var mag = Math.sqrt(ftdo.data[j].x * ftdo.data[j].x
						+ ftdo.data[j].y * ftdo.data[j].y);
					var color = Math.trunc(Math.log(mag) * 20) + 180;
					if (color < 0) color = 0;
					if (color > 255) color = 255;
					ctx.fillStyle = 'rgb(' + color + ',0,0)';
					ctx.fillRect(i, 255 - (j * 512 / ftd.length), 1, height);
				}
				nextY += height;
			}
		}
	}
}

TestView.OnViewWaveform = function ()
{
	if (TestView.bitmap)
	{
		TestView.ViewElement.removeChild(TestView.bitmap);
		TestView.bitmap = null;
	}
	var width = TestDoc.data.length*640/TestDoc.format.nSamplesPerSec;
	if (width > 0)
	{
		TestView.bitmap = document.createElement('canvas');
		TestView.bitmap.style.position = 'absolute';
		TestView.ViewElement.appendChild(TestView.bitmap);
		TestView.bitmap.width = width;
		TestView.bitmap.height = 255;
		var ctx = TestView.bitmap.getContext('2d');

		ctx.fillStyle = 'rgb(32,32,64)';
		ctx.fillRect(0,0,width,255);
		ctx.strokeStyle = 'rgb(128,128,255)';
		ctx.moveTo(0,127);
		ctx.lineTo(width, 127);

		ctx.moveTo(0,160);

		for (var i = 0; i < TestDoc.data.length; i++)
		{
			ctx.lineTo(i*640/TestDoc.format.nSamplesPerSec,127.5-TestDoc.data[i]*127.5);
		}

		ctx.stroke();
	}
}

