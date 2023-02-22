import './TextEncoder.js';
import init, { JamEngineBlock } from './rtjam-rust/rtjam_rust_wasm.js';

class JamEngineProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    console.log('new audio processor constructing');
    // Listen to events from the PitchNode running on the main thread.
    this.port.onmessage = (event) => this.onmessage(event.data);
    this.engineBlock = null;
  }

  onmessage(event) {
    if (event.type === 'send-wasm-module') {
      // PitchNode has sent us a message containing the Wasm library to load into
      // our context as well as information about the audio device used for
      // recording.
      init(WebAssembly.compile(event.wasmBytes)).then(() => {
        this.port.postMessage({ type: 'wasm-module-loaded' });
      });
    } else if (event.type === 'init-jam-engine') {
      this.engineBlock = JamEngineBlock.new();
    }
  }

  process(inputs, outputs) {
    if (this.engineBlock !== null) {
      // inputSamples holds an array of new samples to process.
      this.engineBlock.process(inputs[0][0], inputs[0][1], outputs[0][0], outputs[0][1]);
    }
    // const inputSamples = inputs[0][0];
    // let outputChan = outputs[0];
    // let i = 0;
    // for (const sampValue of inputSamples) {
    //   outputChan[0][i] = sampValue;
    //   outputChan[1][i] = sampValue;
    //   i++;
    // }
    // Returning true tells the Audio system to keep going.
    return true;
  }
}

registerProcessor('JamEngineProcessor', JamEngineProcessor);
