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


