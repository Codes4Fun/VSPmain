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

var ViewData = {};

ViewData.PhonFreq = document.getElementById('PhonFreq');
ViewData.PhonNoise = document.getElementById('PhonNoise');
ViewData.KeyFreq = document.getElementById('KeyFreq');
ViewData.KeyNoise = document.getElementById('KeyNoise');
ViewData.KeyAmp = document.getElementById('KeyAmp');

ViewData.PhonFreq.value = 0.0;
ViewData.KeyFreq.value = 0.0;
ViewData.KeyAmp.value = 0.0;



ViewData.OnInitialUpdate = function ()
{
	ViewData.PhonFreq.value = TestDoc.frequency[TestDoc.curVertex];
	ViewData.PhonNoise.checked = TestDoc.noise[TestDoc.curVertex];
	if (TestDoc.curPKey)
	{
		ViewData.KeyFreq.value = TestDoc.curPKey.frequency;
		ViewData.KeyNoise.checked = TestDoc.curPKey.noise;
		ViewData.KeyAmp.value = TestDoc.curPKey.amplitude;
	}
};

ViewData.OnUpdate = function ()
{
	ViewData.PhonFreq.value = TestDoc.frequency[TestDoc.curVertex];
	ViewData.PhonNoise.checked = TestDoc.noise[TestDoc.curVertex];
	if (TestDoc.curPKey)
	{
		ViewData.KeyFreq.value = TestDoc.curPKey.frequency;
		ViewData.KeyNoise.checked = TestDoc.curPKey.noise;
		ViewData.KeyAmp.value = TestDoc.curPKey.amplitude;
	}
};

ViewData.OnButtonPhonApply = function()
{
	let frequency = parseFloat(ViewData.PhonFreq.value);
	if (isNaN(frequency)) {
		alert("frequency needs to be a number");
		return;
	}
	TestDoc.frequency[TestDoc.curVertex] = frequency;
	TestDoc.noise[TestDoc.curVertex] = ViewData.PhonNoise.checked;
	SAGraphView.OnUpdate();
};

ViewData.OnButtonPhonReset = function()
{
	ViewData.PhonFreq.value = TestDoc.frequency[TestDoc.curVertex];
	ViewData.PhonNoise.checked = TestDoc.noise[TestDoc.curVertex];
};

ViewData.OnRadioSelect = function()
{
	TestDoc.mode=0;
	TestView.OnUpdate();
};

ViewData.OnRadioKeySelect = function()
{
	TestDoc.mode=1;
	TestView.OnUpdate();
};

ViewData.OnRadioKeyAdd = function()
{
	TestDoc.mode=2;
	TestView.OnUpdate();
};

ViewData.OnButtonKeyApply = function()
{
	if (TestDoc.curPKey)
	{
		let frequency = parseFloat(ViewData.KeyFreq.value);
		let noise = ViewData.KeyNoise.checked;
		let amplitude = parseFloat(ViewData.KeyAmp.value);
		if (isNaN(frequency)) {
			alert("frequency needs to be a number");
			return;
		}
		if (isNaN(amplitude)) {
			alert("amplitude needs to be a number");
			return;
		}
		TestDoc.curPKey.frequency = frequency;
		TestDoc.curPKey.noise = noise;
		TestDoc.curPKey.amplitude = amplitude;
	}
};

ViewData.OnButtonKeyReset = function()
{
	if (TestDoc.curPKey)
	{
		ViewData.KeyFreq.value = TestDoc.curPKey.frequency;
		ViewData.KeyNoise.checked = TestDoc.curPKey.noise;
		ViewData.KeyAmp.value = TestDoc.curPKey.amplitude;
	}
};


