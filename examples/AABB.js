
var AABB = function (minx, miny, maxx, maxy)
{
	this.minx = 0;
	this.miny = 0;
	this.maxx = 0;
	this.maxy = 0;

	this.set2 = function(x, y)
	{
		this.minx = x;
		this.miny = y;
		this.maxx = x;
		this.maxy = y;
	};
	
	this.grow2 = function (x, y)
	{
		this.minx = Math.min(this.minx, x);
		this.miny = Math.min(this.miny, y);
		this.maxx = Math.max(this.maxx, x);
		this.maxy = Math.max(this.maxy, y);
	}
	
	this.set4 = function(minx, miny, maxx, maxy)
	{
		this.minx = minx;
		this.miny = miny;
		this.maxx = maxx;
		this.maxy = maxy;
	};
	
	this.set = function(minx, miny, maxx, maxy)
	{
		if (minx.constructor === AABB)
		{
			this.set4(minx.minx, minx.miny, minx.maxx, minx.maxy);
			return;
		}
		if (minx.constructor === Number)
		{
			if (maxx !== undefined && maxx !== null && maxx.constructor == Number)
			{
				this.set4(minx, miny, maxx, maxy);
			}
			else
			{
				this.set2(minx, miny);
			}
			return;
		}
		if (minx.constructor === Float32Array)
		{
			var stride = miny && miny.constructor == Number? miny : 2;
			this.set2(minx[0], minx[1]);
			for (var i = 2; i < minx.length; i += stride)
			{
				this.grow2(minx[i], minx[i+1]);
			}
			return;
		}
	}
	
	this.grow = function (minx, miny, maxx, maxy)
	{
		if (minx.constructor === AABB)
		{
			this.grow2(minx.minx, minx.miny);
			this.grow2(minx.maxx, minx.maxy);
			return;
		}
		if (minx.constructor === Number)
		{
			this.grow2(minx, miny);
			if (maxx !== undefined && maxx !== null && maxx.constructor == Number)
			{
				this.grow2(maxx, maxy);
			}
			return;
		}
		if (minx.constructor === Float32Array)
		{
			for (var i = 0; i < minx.length; i += 2)
			{
				this.grow2(minx[i], minx[i+1]);
			}
			return;
		}
	}

	this.intersects = function (aabb)
	{
		if (this.maxx <= aabb.minx) return false;
		if (this.maxy <= aabb.miny) return false;
		if (this.minx >= aabb.maxx) return false;
		if (this.miny >= aabb.maxy) return false;
		return true;
	}

	if (minx !== undefined && minx !== null)
	{
		this.set(minx, miny, maxx, maxy);
		return;
	}

	this.minx = this.miny = this.maxx = this.maxy = 0;
}
