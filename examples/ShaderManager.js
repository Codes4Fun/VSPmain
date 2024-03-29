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

var ShaderManager = function (debuggable)
{
	var shaders = {};
	var programs = {};
	
	if (debuggable)
	{
		this.shaders = shaders;
		this.programs = programs;
	}
	
	this.registerShader = function (name, type, uniforms, attributes)
	{
		if (shaders[name])
		{
			if (shaders[name].refCount > 0)
			{
				console.trace();
				alert('error: shader ' + name + ' is already being used!');
				return;
			}
			console.log('warning: shader ' + name + ' already exists');
			console.trace();
		}
		
		uniforms = uniforms || [];
		attributes = attributes || [];

		shaders[name] = 
		{
			t : type,
			u : uniforms,
			a : attributes
		};
	};

	this.registerProgram = function (name, vertexShader, fragmentShader)
	{
		if (programs[name])
		{
			if (programs[name].refCount > 0)
			{
				console.trace();
				alert('error: program ' + name + ' is already being used!');
				return;
			}
			console.log('warning: program ' + name + ' already exists');
			console.trace();
		}
		
		programs[name] =
		{
			vs : vertexShader,
			fs : fragmentShader,
			refCount : 0
		};
	};
	
	this.unregisterShader = function (name)
	{
		if (!shaders[name])
		{
			console.log('warning: trying to unregister a nonexistent shader ' + name);
			console.trace();
			return;
		}
		if (shaders[name].refCount > 0)
		{
			console.trace();
			alert('error: trying to unregistering a shader in use ' + name);
			return;
		}
		delete shaders[name];
	};

	this.unregisterProgram = function (name)
	{
		if (!programs[name])
		{
			console.log('warning: trying to unregister a nonexistent program ' + name);
			console.trace();
			return;
		}
		if (programs[name].refCount > 0)
		{
			console.trace();
			alert('error: trying to unregistering a program in use ' + name);
			return;
		}
		delete programs[name];
	};
	
	this.referenceShader = function (name)
	{
		if (!shaders[name])
		{
			console.trace();
			alert('error: ' + name + ' is not a registered shader.');
			return undefined;
		}

		if (shaders[name].refCount)
		{
			shaders[name].refCount++;
			return shaders[name];
		}

		// create and compile shader
		var s = gl.createShader(shaders[name].t);
		gl.shaderSource(s, document.getElementById(name).innerText);
		gl.compileShader(s)
		if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
		{
			console.trace();
			alert('shader failed to compile: ' + gl.getShaderInfoLog(s));
			gl.deleteShader(s);
			return undefined;
		}
		shaders[name].s = s;
		shaders[name].refCount++;
		return shaders[name];
	};
	
	this.releaseShader = function (name)
	{
		if (!shaders[name])
		{
			console.trace();
			alert('error: ' + name + ' is not a registered shader.');
			return;
		}
		
		if (shaders[name].refCount < 1)
		{
			console.trace();
			alert('error: trying to release an unreferenced shader ' + name);
			return;
		}

		shaders[name].refCount--;

		if (shaders[name].refCount > 0)
		{
			return;
		}
		
		gl.deleteShader(shaders[name].s);
		delete shaders[name].s;
	};

	this.referenceProgram = function (name)
	{
		if (!programs[name])
		{
			alert('error: ' + name + ' is not a registered program.');
		}

		if (programs[name].refCount)
		{
			programs[name].refCount++;
			return programs[name];
		}
		
		var vs = this.referenceShader(programs[name].vs);
		var fs = this.referenceShader(programs[name].fs);

		// create the shader program
		var sp = gl.createProgram();
		gl.attachShader(sp, vs.s);
		gl.attachShader(sp, fs.s);
		gl.linkProgram(sp);
		if (!gl.getProgramParameter(sp, gl.LINK_STATUS))
		{
			console.trace();
			alert('shader failed to compile: ' + gl.getProgramInfoLog(sp));
			gl.deleteProgram(sp);
			this.releaseShader(programs[name].fs);
			this.releaseShader(programs[name].vs);
			return undefined;
		}
		
		sp.u = {};
		sp.a = {};
		
		for (var i = 0; i < vs.u.length; i++)
		{
			var uname = vs.u[i];
			//sp.u[uname] = gl.getUniformLocation(sp, uname);
			sp[uname] = gl.getUniformLocation(sp, uname);
		}

		for (var i = 0; i < fs.u.length; i++)
		{
			var uname = fs.u[i];
			//sp.u[uname] = gl.getUniformLocation(sp, uname);
			sp[uname] = gl.getUniformLocation(sp, uname);
		}

		for (var i = 0; i < vs.a.length; i++)
		{
			var aname = vs.a[i];
			//sp.a[aname] = gl.getAttribLocation(sp, aname);
			sp[aname] = gl.getAttribLocation(sp, aname);
		}
		
		programs[name].sp = sp;
		
		return sp;
	};
	
	this.releaseProgram = function (name)
	{
		if (!programs[name])
		{
			console.trace();
			alert('error: ' + name + ' is not a registered program.');
			return;
		}
		
		if (programs[name].refCount < 1)
		{
			console.trace();
			alert('error: trying to release an unreferenced program ' + name);
			return;
		}

		programs[name].refCount--;

		if (programs[name].refCount > 0)
		{
			return;
		}
		
		gl.deleteProgram(programs[name].sp);
		this.unregisterShader(programs[name].fs);
		this.unregisterShader(programs[name].vs);
		delete programs[name].sp;
	}
};
