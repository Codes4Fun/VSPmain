
var DFT = function (maxSize)
{
	this.maxSize = maxSize;
	this.buf = [new Float32Array(maxSize), new Float32Array(maxSize*2)];
	this.size = 0;
	
	this.setSize = function (size)
	{
		if (size > maxSize)
		{
			console.trace();
			console.log('size ' + size + ' greater than maxSize ' + maxSize);
			size = maxSize;
		}
		if (size == this.size)
		{
			return;
		}
		this.size = size;
	};
	
	this.transform = function (data, stride, offset, foffset)
	{
		stride = stride || 1;
		offset = offset || 0;
		foffset = foffset || 0;

		for (var i = 0; i < this.size; i++)
		{
			var index = i*stride + offset;
			if (index >= 0 && index < data.length)
			{
				this.buf[0][i] = data[index];
			}
			else
			{
				this.buf[0][i] = 0;
			}
		}

		for (var i = 0; i < this.buf[1].length; i += 2)
		{
			var f = i / 4;
			var s = 0;
			var c = 0;
			for (var j = 0; j < this.size; j++)
			{
				s += Math.sin((foffset + j)/this.size*2*2*Math.PI*f) * this.buf[0][j];
				c += Math.cos((foffset + j)/this.size*2*2*Math.PI*f) * this.buf[0][j];
			}
			this.buf[1][i+0] = s;
			this.buf[1][i+1] = c;
		}
		return this.buf[1];
	}

	this.setSize(maxSize);
}

var FFT = function (maxSize)
{
	this.maxSize = maxSize;
	this.buf = [new Float32Array(maxSize*2), new Float32Array(maxSize*2)];
	this.map = new Uint32Array(maxSize);
	this.size = 0;
	
	this.setSize = function (size)
	{
		if (size > maxSize)
		{
			console.trace();
			console.log('size ' + size + ' greater than maxSize ' + maxSize);
			size = maxSize;
		}
		if (size == this.size)
		{
			return;
		}
		this.size = size;
		// create index map
		for (var i = 0; i < size; i++)
		{
			var pi = 0;
			for (var bit = 1, ibit = size>>1; bit < size; bit <<= 1, ibit >>= 1)
			{
				pi |= i & bit? ibit : 0;
			}
			this.map[i] = pi;
		}
	};
	
	this.transform = function (data, stride, offset)
	{
		stride = stride || 1;

		// remap incoming data
		var b = 0;
		for (var i = 0; i < this.size; i++)
		{
			var index = this.map[i]*stride + offset;
			if (index >= 0 && index < data.length)
			{
				this.buf[b][i*2] = data[index];
				this.buf[b][i*2+1] = 0;
			}
			else
			{
				this.buf[b][i*2] = 0;
				this.buf[b][i*2+1] = 0;
			}
		}

		for (var bit = 1; bit < this.size; bit <<= 1)
		{
			var bitmask = ~bit;
			var t = Math.PI / bit;
			b = 1 - b;
			for (var i = 0; i < this.size; i++)
			{
				var si = (i & bitmask)*2;
				this.buf[b][i*2+0] = this.buf[1-b][si+0];
				this.buf[b][i*2+1] = this.buf[1-b][si+1];
				si += bit*2;
				var X = this.buf[1-b][si+0];
				var Y = this.buf[1-b][si+1];
				var c = Math.cos(i * t);
				var s = Math.sin(i * t);
				this.buf[b][i*2+0] += X*c - Y*s;
				this.buf[b][i*2+1] += X*s + Y*c;
			}
		}

		return this.buf[b];
	}

	this.setSize(maxSize);
}
