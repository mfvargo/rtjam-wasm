interface PitchMessageEvent extends MessageEvent {
  pitch?: number;
}
export default class JamEngineNode extends AudioWorkletNode {
  public onPitchDetectedCallback!: (pitch: number) => void;

  // initialize PitchProcessor: send wasm code
  // @param {ArrayBuffer} wasmBytes: wasm module code
  // @param {number} numAudioSamplesPerAnalysis: analysis window. must be power of 2.
  init(wasmBytes: ArrayBuffer, onPitchDetectedCallback: (pitch: number) => void) {
    this.onPitchDetectedCallback = onPitchDetectedCallback;

    // Listen to messages sent from the audioProcessor
    this.port.onmessage = (event) => this.onmessage(event.data);
    this.port.postMessage({
      type: 'send-wasm-module',
      wasmBytes,
    });
  }

  // Handle an uncaught exception thrown in the PitchProcessor
  onprocessorerror = (err: Event) => {
    console.log(`An error occurred in AudioWorkletProcessor.process(): ${err}`);
  };

  onmessage(event: PitchMessageEvent) {
    if (event.type === 'wasm-module-loaded') {
      // This message means wasm was loaded and compiled.
      // Now we send one back to configure the pitch detector.
      this.port.postMessage({
        type: 'init-jam-engine',
        sampleRate: this.context.sampleRate,
      });
    } else if (event.type === 'pitch' && event.pitch) {
      // A pitch was detected, so invoke our callback to update the UI.
      this.onPitchDetectedCallback(event.pitch);
    }
  }
}
