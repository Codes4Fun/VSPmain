
var strPhonemes = [
	"null",
	"aa",
	"ae",
	"ah",
	"bb",
	"cc",
	"ch",
	"dd",
	"ee",
	"eh",
	"ff",
	"gg",
	"hh",
	"ii",
	"jj",
	"ll",
	"mm",
	"nn",
	"oe",
	"oo",
	"pp",
	"rr",
	"sh",
	"ss",
	"tt",
	"uh",
	"uu",
	"vv",
	"ww",
	"yy",
	"zz"
];

var TestDoc = {};

TestDoc.mode=0;

TestDoc.format =
{
	nSamplesPerSec : 44100,
};
TestDoc.data = [];
/*for (var i = 0; i < 11025; i++)
{
	TestDoc.data.push(0);
}*/

TestDoc.selection = 0;

TestDoc.ftd = null;//AllocFTData(GetFFTClosestSize(TestDoc.format.nSamplesPerSec/30));
TestDoc.ftdo = null;//AllocFTData(GetFFTClosestSize(TestDoc.format.nSamplesPerSec/30));

TestDoc.curVertex=0;
TestDoc.frequency = [];
TestDoc.noise = [];
TestDoc.vertex = [];

for (var i = 0; i < strPhonemes.length; i++)
{
	TestDoc.frequency.push(149.8);
	TestDoc.noise.push(false);
	var vertex = [];
	for (var j = 0; j < 37; j++)
	{
		vertex.push({x: j * 5512.5 / 36, y: 0});
	}
	TestDoc.vertex.push(vertex);
}

TestDoc.curPKey = null;
TestDoc.phonKey = [];
TestDoc.renderSeconds = 1.5;


TestDoc.input = document.createElement('input');
TestDoc.input.type = 'file';
TestDoc.input.onchange = null;

TestDoc.a = document.createElement('a');
TestDoc.a.href = '';

function Uint8ToBase64(u8Arr)
{
	var CHUNK_SIZE = 0x8000; //arbitrary number
	var index = 0;
	var length = u8Arr.length;
	var result = '';
	var slice;
	while (index < length)
	{
		slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length)); 
		result += String.fromCharCode.apply(null, slice);
		index += CHUNK_SIZE;
	}
	return btoa(result);
}

TestDoc.stringDocName = 'untitled';
TestDoc.stringWaveName = 'untitled';
TestDoc.stringModelName = 'untitled';

TestDoc.OnNewDocument = function ()
{
	TestDoc.mode = 0;
	document.getElementsByName('mode')[0].checked = true;

	TestDoc.phonKey = [];
	TestDoc.curPKey = null;

	TestDoc.stringDocName = 'untitled';
	
	TestDoc.OnModelNew();
	TestDoc.OnWaveNew();
};

function readVsd(file) {
	let reader = new FileReader();
	reader.onload = function (e)
	{
		//fileData = reader.result;
		let dv = new DataView(reader.result);

		let offset = 0;
		for (let i = 0; i < strPhonemes.length; i++)
		{
			TestDoc.frequency[i] = dv.getFloat32(offset, true);
			offset += 4;
			TestDoc.noise[i] = dv.getUint32(offset, true) != 0? true : false;
			offset += 4;
			for (let j = 0; j < 37; j++)
			{
				TestDoc.vertex[i][j].x = dv.getFloat32(offset, true);
				offset += 4;
				TestDoc.vertex[i][j].y = dv.getFloat32(offset, true);
				offset += 4;
			}
		}
		TestDoc.phonKey = [];
		TestDoc.curPKey = null;
		
		let count = dv.getUint32(offset, true);
		offset += 4;

		for (let i = 0; i < count; i++)
		{
			let phonKey = { };
			phonKey.time = dv.getFloat32(offset, true);
			offset += 4;
			phonKey.phoneme = dv.getUint32(offset, true);
			offset += 4;
			phonKey.amplitude = dv.getFloat32(offset, true);
			offset += 4;
			phonKey.frequency = dv.getFloat32(offset, true);
			offset += 4;
			phonKey.noise = dv.getUint32(offset, true) != 0? true : false;
			offset += 4;
			TestDoc.phonKey.push(phonKey);
		}
	
		TestView.OnInitialUpdate();
		SAGraphView.OnInitialUpdate();
		ViewData.OnInitialUpdate();
	}
	reader.readAsArrayBuffer(file);
}

function loadVsdJson(json) {
	TestDoc.frequency = json.frequency;
	TestDoc.noise = json.noise;
	TestDoc.vertex = json.vertex;

	TestDoc.phonKey = json.phonKey;
	TestDoc.curPKey = null;
	TestDoc.renderSeconds = json.renderSeconds;
	
	TestView.OnInitialUpdate();
	SAGraphView.OnInitialUpdate();
	ViewData.OnInitialUpdate();
}

function readVsdJson(file) {
	let reader = new FileReader();
	reader.onload = function (e)
	{
		result = this.result;
		let json = JSON.parse(this.result);
		loadVsdJson(json);
	}
	reader.readAsText(file);
}

TestDoc.OnDocumentChosen = function (e)
{
	if (e.target.files.length != 1)
	{
		return;
	}
	let fileNameLC = e.target.files[0].name.toLowerCase();
	if (fileNameLC.endsWith(".vsd")) {
		readVsd(e.target.files[0]);
	} else if (fileNameLC.endsWith(".vsd.json")) {
		readVsdJson(e.target.files[0]);
	}
	TestDoc.stringDocName = e.target.files[0].name;
	let ext = TestDoc.stringDocName.lastIndexOf('.vsd');
	if (ext != -1)
	{
		TestDoc.stringDocName = TestDoc.stringDocName.substr(0, ext);
	}
};

TestDoc.OnOpenDocument = function ()
{
	TestDoc.input.onchange = TestDoc.OnDocumentChosen;
	TestDoc.input.click();
};

TestDoc.OnOpenExample = function() {
	fetch('./examples/IngeborgHallstein.vsd.json')
	.then(response => response.json())
	.then(loadVsdJson);
}

TestDoc.OnSaveDocument = function ()
{
	let json = {
		frequency : TestDoc.frequency,
		noise : TestDoc.noise,
		vertex : TestDoc.vertex,
	
		phonKey : TestDoc.phonKey,
	
		renderSeconds : TestDoc.renderSeconds
	};

	let text = JSON.stringify(json, null, 2);

	TestDoc.a.download = TestDoc.stringDocName + '.vsd.json';
	TestDoc.a.href = 'data:application/json;charset=UTF-8,' + encodeURIComponent(text);
	TestDoc.a.click();
};

TestDoc.OnExportVsdDocument = function ()
{
	var dataSize = (37*8+8)*strPhonemes.length + 4 + TestDoc.phonKey.length*20;
	var ab = new ArrayBuffer(dataSize);
	var dv = new DataView(ab);
	var u8 = new Uint8Array(ab);

	var offset = 0;
	for (var i = 0; i < strPhonemes.length; i++)
	{
		dv.setFloat32(offset, TestDoc.frequency[i], true);
		offset += 4;
		dv.setUint32(offset, TestDoc.noise[i]? 1 : 0, true);
		offset += 4;
		for (var j = 0; j < 37; j++)
		{
			dv.setFloat32(offset, TestDoc.vertex[i][j].x, true);
			offset += 4;
			dv.setFloat32(offset, TestDoc.vertex[i][j].y, true);
			offset += 4;
		}
	}

	var count = TestDoc.phonKey.length;
	dv.setUint32(offset, count, true);
	offset += 4;

	for (var i = 0; i < count; i++)
	{
		var phonKey = TestDoc.phonKey[i];
		dv.setFloat32(offset, phonKey.time, true);
		offset += 4;
		dv.setUint32(offset, phonKey.phoneme, true);
		offset += 4;
		dv.setFloat32(offset, phonKey.amplitude, true);
		offset += 4;
		dv.setFloat32(offset, phonKey.frequency, true);
		offset += 4;
		dv.setUint32(offset, phonKey.noise? 1 : 0, true);
		offset += 4;
	}

	var b64 = Uint8ToBase64(u8);
	TestDoc.a.download = TestDoc.stringDocName + '.vsd';
	TestDoc.a.href = 'data:application/octect-stream;base64,' + b64;
	TestDoc.a.click();
};

TestDoc.ac = new AudioContext();
TestDoc.buffer = null;
TestDoc.source = null;

TestDoc.play = function ()
{
	if (TestDoc.source)
	{
		return;
	}
	if (TestDoc.buffer)
	{
		TestDoc.source = TestDoc.ac.createBufferSource();
		TestDoc.source.buffer = TestDoc.buffer;
		TestDoc.source.loop = true;
		TestDoc.source.connect(TestDoc.ac.destination);
		TestDoc.source.start();
		TestDoc.data = TestDoc.buffer.getChannelData(0);
	}
};

TestDoc.stop = function ()
{
	if (!TestDoc.source)
	{
		return;
	}
	TestDoc.source.disconnect();
	TestDoc.source = null;
};

TestDoc.OnWaveNew = function ()
{
	TestDoc.selection = 0;
	
	TestDoc.stop();
	TestDoc.buffer = null;

	TestDoc.format.nSamplesPerSec = 11025;
	TestDoc.data = [];

	TestDoc.ftd = null;
	TestDoc.ftdo = null;
	
	TestDoc.stringWaveName = 'untitled';
	
	TestView.OnInitialUpdate();
	SAGraphView.OnInitialUpdate();
};

TestDoc.OnWaveFileChosen = function (e)
{
	if (e.target.files.length != 1)
	{
		return;
	}
	var reader = new FileReader();
	reader.onload = function (e)
	{
		fileData = reader.result;
		TestDoc.ac.decodeAudioData(reader.result,
			function (buffer)
			{
				TestDoc.selection = 0;

				TestDoc.stop();
				TestDoc.buffer = buffer;
				TestDoc.format.nSamplesPerSec = buffer.sampleRate;
				if (buffer.numberOfChannels > 0)
				{
					TestDoc.data = buffer.getChannelData(0);
				}
				var ftdSize = GetFFTClosestSize(TestDoc.format.nSamplesPerSec/30);
				TestDoc.ftd = AllocFTData(ftdSize);
				TestDoc.ftdo = AllocFTData(ftdSize);
				TestView.OnInitialUpdate();
				SAGraphView.OnInitialUpdate();
			},
			function (e)
			{
				alert('decode failed ' + e.err);
				console.log('decode failed ' + e.err);
			}
		);
		//input.values = '';
	}
	TestDoc.stringWaveName = e.target.files[0].name;
	var ext = TestDoc.stringWaveName.lastIndexOf('.');
	if (ext != -1)
	{
		TestDoc.stringWaveName = TestDoc.stringWaveName.substr(0, ext);
	}
	reader.readAsArrayBuffer(e.target.files[0]);
};

TestDoc.OnWaveOpen = function () 
{
	TestDoc.input.onchange = TestDoc.OnWaveFileChosen;
	TestDoc.input.click();
};

TestDoc.OnWaveSave = function ()
{
	if (!TestDoc.buffer)
	{
		return;
	}

	var nChannels = 1;
	var nSamplesPerSec = TestDoc.format.nSamplesPerSec;
	var nAvgBytesPerSec = TestDoc.format.nSamplesPerSec;
	var nBlockAlign = 1;
	var wBitsPerSample = 8;
	var dataSize = TestDoc.data.length;
	var nSamples = TestDoc.data.length;

	var ab = new ArrayBuffer(44 + dataSize);
	var dv = new DataView(ab);
	var u8 = new Uint8Array(ab);

	dv.setUint32( 0, 0x46464952, true); // "RIFF"
	dv.setUint32( 4, 36 + dataSize, true);
	dv.setUint32( 8, 0x45564157, true); // "WAVE"
	dv.setUint32(12, 0x20746d66, true); // "fmt "
	dv.setUint32(16, 16, true);
	dv.setUint16(20, 1, true); // WAVE_FORMAT_PCM
	dv.setUint16(22, nChannels, true);
	dv.setUint32(24, nSamplesPerSec, true);
	dv.setUint32(28, nAvgBytesPerSec, true);
	dv.setUint16(32, nBlockAlign, true);
	dv.setUint16(34, wBitsPerSample, true);
	dv.setUint32(36, 0x61746164, true); // "data"
	dv.setUint32(40, dataSize, true);

	for (var i = 0; i < nSamples; i++)
	{
		u8[44+i] = Math.round(TestDoc.data[i] * 127.5 + 127.5);
	}

	var b64 = Uint8ToBase64(u8);
	TestDoc.a.download = TestDoc.stringWaveName + '.wav';
	TestDoc.a.href = 'data:audio/wav;base64,' + b64;
	//TestDoc.a.href = 'data:application/octect-stream;base64,' + b64;
	TestDoc.a.click();
};

TestDoc.OnWaveSaveAs = function ()
{
	TestDoc.OnWaveSave();
};



TestDoc.OnWaveRender = function ()
{
	var i,j,k;
	var time,s1,s2,u,iu,amp,fdata,freq,y,rad=[
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
	],freq_s,amp_s,noi_s;
	var vert = [],sdvert = [];
	var phonKeyTime,phonKeyTimeO;
	var pkey;
	var pkeyIndex;

	for (i = 0; i < 37; i++)
	{
		vert.push({x:0, y:0});
		sdvert.push({x:0, y:0});
	}
	for (; i < 49; i++)
	{
		sdvert.push({x:0, y:0});
	}

	var length = TestDoc.phonKey.length;
	if(length > 0){
		var pkeyLastIndex = length - 1;
		pkeyIndex = 0;
		pkey=TestDoc.phonKey[pkeyIndex];
		pkeyPrev=null;
		phonKeyTime=Math.trunc(pkey.time*TestDoc.format.nSamplesPerSec);
		let minDataLength = TestDoc.format.nSamplesPerSec * TestDoc.renderSeconds;

		if (!TestDoc.buffer
		 || TestDoc.buffer.sampleRate != TestDoc.format.nSamplesPerSec
		 || TestDoc.buffer.length != minDataLength
		 || TestDoc.buffer.numberOfChannels != 1) {
			TestDoc.buffer = TestDoc.ac.createBuffer(1, minDataLength, TestDoc.format.nSamplesPerSec);
		}
		TestDoc.data = TestDoc.buffer.getChannelData(0);

		for(i=0;i<TestDoc.data.length;i++){
			if(pkeyPrev){
				if(i<=phonKeyTime){
					time=(i-phonKeyTimeO)/(phonKeyTime-phonKeyTimeO);
					s1=(Math.cos(time*Math.PI)+1)/2;
					s2=1-s1;
					for(j=0;j<37;j++){
						amp_s=pkeyPrev.amplitude*s1+pkey.amplitude*s2;
						vert[j].x=TestDoc.vertex[pkeyPrev.phoneme][j].x*s1+TestDoc.vertex[pkey.phoneme][j].x*s2;
						vert[j].y=TestDoc.vertex[pkeyPrev.phoneme][j].y*s1+TestDoc.vertex[pkey.phoneme][j].y*s2;
						freq_s=pkeyPrev.frequency*s1+pkey.frequency*s2;
						if(pkey.noise){
							if(pkeyPrev.noise){
								noi_s=120;
							}else{
								noi_s=120*s2;
							}
						}else{
							if(pkeyPrev.noise){
								noi_s=120*s1;
							}else{
								noi_s=0;
							}
						}
					}
				}
				if((i>=phonKeyTime)&&(pkeyIndex < pkeyLastIndex)){
					pkeyIndex++;
					pkeyPrev = pkey;
					pkey=TestDoc.phonKey[pkeyIndex];
					phonKeyTimeO=phonKeyTime;
					phonKeyTime=Math.trunc(pkey.time*TestDoc.format.nSamplesPerSec);
				}
			}else{
				for(j=0;j<37;j++){
					amp_s=pkey.amplitude;
					vert[j].x=TestDoc.vertex[pkey.phoneme][j].x;
					vert[j].y=TestDoc.vertex[pkey.phoneme][j].y;
					freq_s=pkey.frequency;
					if(pkey.noise){
						noi_s=120;
					}else{
						noi_s=0;
					}
				}
				if((i>=phonKeyTime)&&(pkeyIndex < pkeyLastIndex)){
					pkeyIndex++;
					pkeyPrev = pkey;
					pkey=TestDoc.phonKey[pkeyIndex];
					phonKeyTimeO=phonKeyTime;
					phonKeyTime=Math.trunc(pkey.time*TestDoc.format.nSamplesPerSec);
				}
			}
			// subdivide
			sdvert[0].x=vert[0].x;
			sdvert[0].y=vert[0].y;
			for(j=0;j<12;j++){
				for(k=1;k<4;k++){
					u=k/4;
					iu=(1-u);
					sdvert[j*4+k].x=((iu*iu*iu)*vert[j*3].x+
						(3*u*iu*iu)*vert[j*3+1].x+
						(3*u*u*iu)*vert[j*3+2].x+
						(u*u*u)*vert[j*3+3].x);
					sdvert[j*4+k].y=((iu*iu*iu)*vert[j*3].y+
						(3*u*iu*iu)*vert[j*3+1].y+
						(3*u*u*iu)*vert[j*3+2].y+
						(u*u*u)*vert[j*3+3].y);
				}
				sdvert[j*4+4].x=vert[j*3+3].x;
				sdvert[j*4+4].y=vert[j*3+3].y;
			}
			//
			fdata=0;
			for(j=1;j<31;j++){
				freq=(freq_s
					+0.4*Math.cos(i/length*2*Math.PI*200)
					)*j
					+noi_s
					*Math.cos(i*Math.PI*0.0131+j*Math.PI*0.2);
				amp = 0;
				for(k=1;k<49;k++){
					if(freq<sdvert[k].x){
						u=(freq-sdvert[k-1].x)/(sdvert[k].x-sdvert[k-1].x);
						iu=1-u;
						y=iu*sdvert[k-1].y+u*sdvert[k].y;
						amp=y;
						break;
					}
				}
				rad[j-1]+=freq*Math.PI*2/TestDoc.format.nSamplesPerSec;
				fdata+=(Math.cos(rad[j-1])*amp*amp_s);
			}
			//
			/*fdata=0.0f;
			for(j=1;j<31;j++){
				freq=(freq_s
					+0.4f*(float)cos((double)i/(double)length*PI2*200)
					)*(float)j
					+noi_s
					*(float)cos((double)i*PI*0.0131+(double)j*PI*0.2);
				for(k=1;k<12;k++){
					if(freq<vert[k*3].x){
						u=(freq-vert[k*3-3].x)/(vert[k*3].x-vert[k*3-3].x);
						iu=1.0f-u;
						y=(iu*iu*iu)*vert[k*3-3].y+
							(3.0f*u*iu*iu)*vert[k*3-2].y+
							(3.0f*u*u*iu)*vert[k*3-1].y+
							(u*u*u)*vert[k*3].y;
						amp=y;
						break;
					}
				}
				rad[j-1]+=freq*PI2/(float)format.nSamplesPerSec;
				fdata+=((float)cos(rad[j-1])*amp*amp_s);
			}*/
			if(fdata>127.5)fdata=127.5;
			else if(fdata<-127.5)fdata=-127.5;
			//((byte*)data)[i]=(byte)(fdata+127.5f);
			TestDoc.data[i] = fdata/127.5;
		}
	}else{
		for(i=0;i<TestDoc.data.length;i++) TestDoc.data[i]=0;
	}
	var ftdSize = GetFFTClosestSize(TestDoc.format.nSamplesPerSec/30);
	if (!TestDoc.ftd || TestDoc.ftd.length != ftdSize) {
		TestDoc.ftd = AllocFTData(ftdSize);
		TestDoc.ftdo = AllocFTData(ftdSize);
	}
	TestView.OnInitialUpdate();
};

TestDoc.OnModelNew = function ()
{
	for (var j = 0; j < strPhonemes.length; j++)
	{
		TestDoc.freqency[j] = 149.8;
		TestDoc.noise[j] = false;
		for (var i = 0; i < 37; i++)
		{
			TestDoc.vertex[j][i].x = i * 5512.5/36;
			TestDoc.vertex[j][i].y = 0;
		}
	}
	TestDoc.stringModelName = 'untitled';
	SAGraphView.OnUpdate();
};

TestDoc.OnModelFileChosen = function (e)
{
	if (e.target.files.length != 1)
	{
		return;
	}
	var reader = new FileReader();
	reader.onload = function (e)
	{
		fileData = reader.result;

		//ar = new Uint8Array(reader.result);
		dv = new DataView(reader.result);

		var offset = 0;
		for (var i = 0; i < strPhonemes.length; i++)
		{
			TestDoc.frequency[i] = dv.getFloat32(offset, true);
			offset += 4;
			TestDoc.noise[i] = dv.getUint32(offset, true) != 0? true : false;
			offset += 4;
			for (var j = 0; j < 37; j++)
			{
				TestDoc.vertex[i][j].x = dv.getFloat32(offset, true);
				offset += 4;
				TestDoc.vertex[i][j].y = dv.getFloat32(offset, true);
				offset += 4;
			}
		}

		SAGraphView.OnUpdate();
		//input.values = '';
	}
	TestDoc.stringModelName = e.target.files[0].name;
	var ext = TestDoc.stringModelName.lastIndexOf('.');
	if (ext != -1)
	{
		TestDoc.stringModelName = TestDoc.stringModelName.substr(0, ext);
	}
	reader.readAsArrayBuffer(e.target.files[0]);
};

TestDoc.OnModelOpen = function ()
{
	TestDoc.input.onchange = TestDoc.OnModelFileChosen;
	TestDoc.input.click();
};

TestDoc.OnModelSave = function ()
{
	var dataSize = (37*8+8)*strPhonemes.length;
	var ab = new ArrayBuffer(dataSize);
	var dv = new DataView(ab);
	var u8 = new Uint8Array(ab);

	var offset = 0;
	for (var i = 0; i < strPhonemes.length; i++)
	{
		dv.setFloat32(offset, TestDoc.frequency[i], true);
		offset += 4;
		dv.setUint32(offset, TestDoc.noise[i]? 1 : 0, true);
		offset += 4;
		for (var j = 0; j < 37; j++)
		{
			dv.setFloat32(offset, TestDoc.vertex[i][j].x, true);
			offset += 4;
			dv.setFloat32(offset, TestDoc.vertex[i][j].y, true);
			offset += 4;
		}
	}

	var b64 = Uint8ToBase64(u8);
	TestDoc.a.download = TestDoc.stringModelName + '.vsm';
	TestDoc.a.href = 'data:application/octect-stream;base64,' + b64;
	TestDoc.a.click();
}

TestDoc.OnModelSaveAs = function ()
{
	TestDoc.OnModelSave();
}




