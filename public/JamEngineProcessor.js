// import './TextEncoder.js';
// import init, { WasmPitchDetector } from './wasm-audio/wasm_audio.js';

class JamEngineProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    // Initialized to an array holding a buffer of samples for analysis later -
    // once we know how many samples need to be stored. Meanwhile, an empty
    // array is used, so that early calls to process() with empty channels
    // do not break initialization.
    this.samples = [];
    this.totalSamples = 0;

    // Listen to events from the PitchNode running on the main thread.
    this.port.onmessage = (event) => this.onmessage(event.data);

    this.detector = null;
  }

  onmessage(event) {
    if (event.type === 'send-wasm-module') {
      // PitchNode has sent us a message containing the Wasm library to load into
      // our context as well as information about the audio device used for
      // recording.
      init(WebAssembly.compile(event.wasmBytes)).then(() => {
        this.port.postMessage({ type: 'wasm-module-loaded' });
      });
    } else if (event.type === 'init-detector') {
      const { sampleRate, numAudioSamplesPerAnalysis } = event;

      // Store this because we use it later to detect when we have enough recorded
      // audio samples for our first analysis.
      this.numAudioSamplesPerAnalysis = numAudioSamplesPerAnalysis;

      this.detector = WasmPitchDetector.new(sampleRate, numAudioSamplesPerAnalysis);

      // Holds a buffer of audio sample values that we'll send to the Wasm module
      // for analysis at regular intervals.
      this.samples = new Array(numAudioSamplesPerAnalysis).fill(0);
      this.totalSamples = 0;
    }
  }

  process(inputs, outputs) {
    // inputSamples holds an array of new samples to process.
    const inputSamples = inputs[0][0];
    let outputChan = outputs[0];
    let i = 0;
    for (const sampValue of inputSamples) {
      outputChan[0][i] = sampValue;
      outputChan[1][i] = sampValue;
      i++;
    }
    // Returning true tells the Audio system to keep going.
    return true;
  }
}

registerProcessor('JamEngineProcessor', JamEngineProcessor);
