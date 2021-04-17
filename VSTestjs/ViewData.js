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
	TestDoc.frequency[TestDoc.curVertex] = ViewData.PhonFreq.value;
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
		TestDoc.curPKey.frequency = ViewData.KeyFreq.value;
		TestDoc.curPKey.noise = ViewData.KeyNoise.checked;
		TestDoc.curPKey.amplitude = ViewData.KeyAmp.value;
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


