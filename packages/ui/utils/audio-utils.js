
class AudioLevelWatcher {
  constructor (stream, onUpdate, opt) {
    if (typeof window !== 'undefined') {
      try {
        const self = this
        const AC = window.AudioContext || window.webkitAudioContext
        const calcMethod = (opt && opt.calcMethod) || 'max'
        const valueType = (opt && opt.valueType) || 'byte'
        this.audioContext = new AC()
        this.analyser = this.audioContext.createAnalyser()
        this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream)
        this.processor = this.audioContext.createScriptProcessor(2048, 1, 1)
        this.analyser.smoothingTimeConstant = (opt && opt.smoothingTimeConstant) || 0.3
        this.analyser.fftSize = (opt && opt.fftSize) || 512
        this.mediaStreamSource.connect(this.analyser)
        this.analyser.connect(this.processor)
        this.processor.connect(this.audioContext.destination)
        const calcF = calcMethod === 'average' ? this.averageFreqData : this.maxFreqData
        const getFreqData = () => {
          if (valueType === 'byte') {
            const bin = new Uint8Array(self.analyser.frequencyBinCount)
            self.analyser.getByteFrequencyData(bin)
            return bin
          }
          const bin = new Float32Array(self.analyser.frequencyBinCount)
          self.analyser.getFloatFrequencyData(bin)
          return bin
        }
        this.handler = () => {
          const bin = getFreqData()
          const v = calcF(bin, self.audioContext.sampleRate, opt && opt.minHz, opt && opt.maxHz)
          onUpdate(v)
        }
        this.processor.onaudioprocess = this.handler
      } catch { }
    }
  }

  averageFreqData (bin, sampleRate, minHz, maxHz) {
    let sum = 0
    let n = 0
    const binCount = bin.length
    for (let i = 0; i < binCount; i++) {
      const hz = (i * sampleRate) / binCount
      if (minHz !== undefined && hz < minHz) {
        continue
      }
      if (maxHz !== undefined && hz > maxHz) {
        continue
      }
      sum += bin[i]
      n++
    }
    const average = sum / n
    return average
  }

  maxFreqData (bin, sampleRate, minHz, maxHz) {
    let maxVal = -Infinity
    const binCount = bin.length
    for (let i = 0; i < binCount; i++) {
      if (maxVal < bin[i]) {
        const hz = (i * sampleRate) / binCount
        if (minHz !== undefined && hz < minHz) {
          continue
        }
        if (maxHz !== undefined && hz > maxHz) {
          continue
        }
        maxVal = bin[i]
      }
    }
    return maxVal
  }

  close () {
    this.processor.removeEventListener('audioprocess', this.handler)
    try {
      this.analyser.disconnect(this.processor)
    } catch { }
    try {
      this.processor.disconnect(this.audioContext.destination)
    } catch { }
    try {
      this.mediaStreamSource.disconnect(this.analyser)
    } catch { }
    try {
      this.audioContext.close()
    } catch { }
  }
}

export default AudioLevelWatcher
