import './TextEncoder.js';
import init from './rtjam-rust/rtjam_rust_wasm.js';

class JamEngineProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    // Listen to events from the PitchNode running on the main thread.
    this.port.onmessage = (event) => this.onmessage(event.data);
  }

  onmessage(event) {
    if (event.type === 'send-wasm-module') {
      // PitchNode has sent us a message containing the Wasm library to load into
      // our context as well as information about the audio device used for
      // recording.
      init(WebAssembly.compile(event.wasmBytes)).then(() => {
        this.port.postMessage({ type: 'wasm-module-loaded' });
      });
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
