# Voice Synthesis Project main repository

 An archive of unfinished voice synthesis programs and code fragments.

## VSTest

This is an html/javascript port of a program I original wrote in 1999 using C++ and MFC.

https://codes4fun.github.io/VSPmain/VSTestjs/

It is intended to synthesize voices by hand modeling phonemes from reference audio.

The phonemes can then be placed as notes, rendered and then saved as a wave file.

## Examples

### AudioContext Player

Example that uses AudioContext to load and playback an audio file

https://codes4fun.github.io/VSPmain/examples/AudioContextPlayer.html

### AudioContext Noise

Example that uses AudioContext to generate noise

https://codes4fun.github.io/VSPmain/examples/AudioContextNoise.html

Uses an algorithm I developed, which in this example can be tuned

### Real-time WebGL spectrogram

Example uses WebGL to convert waveform to a spectrogram in real-time

https://codes4fun.github.io/VSPmain/examples/Visual.html

It lacks precision being limited to texture formats in WebGL.

Uses DFT instead of FFT to keep memory local and hopefully make use texture cache tiles.

## TODO

General
* Improve documentation, create tutorials

VSTest
* Set wave length, for rendering (currently requires loading audio file before rendering)
* Add quick loadable examples
* Add ability to playback loaded and rendered audio
* Tutorial on how it works
* Improve/Integrate newer noise generation algorithm

AudioContext Noise
* Fix newer version which uses splines instead of fixed values

Real-time WebGL spectrogram
* Add adjustable window to zoom into details
