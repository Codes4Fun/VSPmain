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
