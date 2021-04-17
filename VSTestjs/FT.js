
function AllocFTData (size)
{
	if (size < 1)
	{
		return;
	}
	var ftdata =
	{
		length: size,
		data: [],
		temp: []
	};
	for (var i = 0; i < size; i++)
	{
		ftdata.data.push({x:0, y:0});
		ftdata.temp.push({x:0, y:0});
	}
	return ftdata;
}

function DoDFT (output, input)
{
    if (input.length != output.length)
    {
		return;
	}
    var len = input.length;
    for (var j = 0; j < len; j++)
    {
        output.data[j].x = 0.0;
        output.data[j].y = 0.0;
        for(var i = 0; i < len; i++)
        {
            var rad = j * i * 2 * Math.PI / len;
            output.data[j].x += (input.data[i].x * Math.cos(rad)) + (input.data[i].y * Math.sin(rad));
            output.data[j].y += (input.data[i].x * Math.sin(rad)) - (input.data[i].y * Math.cos(rad));
        }
        output.data[j].x /= len;
        output.data[j].y /= len;
    }
}


function GetFFTClosestSize (length)
{
	if (length == 0)
	{
		return 0;
	}
	var mask = 0x40000000;
	while (!(mask&length))
	{
		mask >>= 1;
	}
	if ((mask>>1)&length)
	{
		return mask<<1;
	}
	return mask;
}

function DoFFT (output, input)
{
    if (input.length != output.length)
    {
		return;
	}
	var v = [input.temp, output.temp];
    var hlen = input.length / 2;
    var jm = hlen;
    var im = 2, him = 1;
    var b = 0;
    for (var j = 0; j < jm; j++)
    {
        for (var i = 0; i < im; i++)
        {
            var rad = 2 * Math.PI * i / im;
            var t1 = j * him + (i & (him - 1));
            var t2 = t1 + hlen;
            v[1-b][j*im+i].x = (input.data[t1].x + (input.data[t2].x * Math.cos(rad)) - (input.data[t2].y * Math.sin(rad))) / 2;
            v[1-b][j*im+i].y = (input.data[t1].y + (input.data[t2].x * Math.sin(rad)) + (input.data[t2].y * Math.cos(rad))) / 2;
        }
    }
    jm >>= 1;
    im <<= 1; him <<= 1;
    b = 1 - b;
    while (jm > 1)
    {
        for (var j = 0; j < jm; j++)
        {
            for (var i = 0;i < im; i++)
            {
                var rad = 2 * Math.PI * i / im;
                var t1 = j * him + (i & (him - 1));
                var t2 = t1 + hlen;
                v[1-b][j*im+i].x = (v[b][t1].x + (v[b][t2].x * Math.cos(rad)) - (v[b][t2].y * Math.sin(rad))) / 2;
                v[1-b][j*im+i].y = (v[b][t1].y + (v[b][t2].x * Math.sin(rad)) + (v[b][t2].y * Math.cos(rad))) / 2;
            }
        }
        jm >>= 1;
        im <<= 1; him <<= 1;
        b = 1 - b;
    }
    for(var i = 0; i < im; i++)
    {
        var rad = 2 * Math.PI * i / im;
        var t1 = (i & (him - 1));
        var t2 = t1 + hlen;
        output.data[i].x = (v[b][t1].x + (v[b][t2].x * Math.cos(rad)) - (v[b][t2].y * Math.sin(rad))) / 2;
        output.data[i].y = (v[b][t1].y + (v[b][t2].x * Math.sin(rad)) + (v[b][t2].y * Math.cos(rad))) / 2;
    }
}

function DoIFFT (output, input)
{
    if (input.length != output.length)
    {
		return;
	}
    var v = [input.temp, output.temp];
    var hlen = input.length / 2;
    var jm = hlen;
    var im = 2, him = 1;
    var b = 0;
    for (var j = 0;j < jm; j++)
    {
        for (var i = 0;i < im; i++)
        {
            var rad = 2 * Math.PI * i / im;
            var t1 = j * him + (i & (him - 1));
            var t2 = t1 + hlen;
            v[1-b][j*im+i].x = (input.data[t1].x + (input.data[t2].x * Math.cos(rad)) - (input.data[t2].y * Math.sin(rad)));// / 1.0f;
            v[1-b][j*im+i].y = (input.data[t1].y + (input.data[t2].x * Math.sin(rad)) + (input.data[t2].y * Math.cos(rad)));// / 1.0f;
        }
    }
    jm >>= 1;
    im <<= 1;him <<= 1;
    b = 1 - b;
    while (jm > 1)
    {
        for (var j = 0; j < jm; j++)
        {
            for (var i = 0; i < im; i++)
            {
                var rad = 2 * Math.PI * i / im;
                var t1 = j * him + (i & (him - 1));
                var t2 = t1 + hlen;
                v[1-b][j*im+i].x = (v[b][t1].x + (v[b][t2].x * Math.cos(rad)) - (v[b][t2].y * Math.sin(rad)));///1.0f;
                v[1-b][j*im+i].y = (v[b][t1].y + (v[b][t2].x * Math.sin(rad)) + (v[b][t2].y * Math.cos(rad)));///1.0f;
            }
        }
        jm >>= 1;
        im <<= 1;him <<= 1;
        b = 1 - b;
    }
    for(var i = 0; i < im; i++)
    {
        var rad=2 * Math.PI * i / im;
        var t1 = (i & (him - 1));
        var t2 = t1 + hlen;
        output.data[i].x = (v[b][t1].x + (v[b][t2].x * Math.cos(rad)) - (v[b][t2].y * Math.sin(rad)));///1.0f;
        output.data[i].y = (v[b][t1].y + (v[b][t2].x * Math.sin(rad)) + (v[b][t2].y * Math.cos(rad)));///1.0f;
    }
}
