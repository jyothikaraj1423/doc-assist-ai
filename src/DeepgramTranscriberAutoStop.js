import React, { useRef, useState } from 'react';

export default function DeepgramTranscriberAutoStop() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [diarized, setDiarized] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Idle');
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const silenceTimer = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  // Start recording and monitor silence
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new window.MediaRecorder(stream);
    audioChunks.current = [];
    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
      setAudioURL(URL.createObjectURL(audioBlob));
      uploadAudio(audioBlob);
      stopAudioContext();
    };
    mediaRecorderRef.current.start();
    setRecording(true);
    setStatus('Recording...');
    // Start silence detection
    startAudioContext(stream);
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setStatus('Stopped');
      stopAudioContext();
    }
  };

  // Upload audio to backend
  const uploadAudio = async (audioBlob) => {
    setLoading(true);
    setDiarized([]);
    setStatus('Transcribing...');
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    const res = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    // Parse Deepgram diarization
    const words = data.results.channels[0].alternatives[0].words;
    // Group by speaker
    let diarizedText = [];
    let currentSpeaker = null;
    let currentLine = '';
    words.forEach((w, i) => {
      if (w.speaker !== currentSpeaker) {
        if (currentLine) diarizedText.push({ speaker: currentSpeaker, text: currentLine });
        currentSpeaker = w.speaker;
        currentLine = w.word;
      } else {
        currentLine += ' ' + w.word;
      }
      if (i === words.length - 1) {
        diarizedText.push({ speaker: currentSpeaker, text: currentLine });
      }
    });
    setDiarized(diarizedText);
    setLoading(false);
    setStatus('Idle');
  };

  // Silence detection logic
  const startAudioContext = (stream) => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    sourceRef.current.connect(analyserRef.current);
    detectSilence();
  };

  const stopAudioContext = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
  };

  // Continuously check for silence
  const detectSilence = () => {
    const bufferLength = analyserRef.current.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const check = () => {
      analyserRef.current.getByteTimeDomainData(dataArray);
      // Calculate average volume
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const val = (dataArray[i] - 128) / 128;
        sum += val * val;
      }
      const volume = Math.sqrt(sum / bufferLength);

      if (volume < 0.01) { // Silence threshold
        if (!silenceTimer.current) {
          silenceTimer.current = setTimeout(() => {
            setStatus('Silence detected, stopping...');
            stopRecording();
          }, 2000); // 2 seconds of silence
        }
      } else {
        if (silenceTimer.current) {
          clearTimeout(silenceTimer.current);
          silenceTimer.current = null;
        }
      }
      if (recording && audioContextRef.current) {
        requestAnimationFrame(check);
      }
    };
    check();
  };

  return (
    <div style={{maxWidth: 600, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001'}}>
      <h3>Deepgram Diarized Transcription (Auto-Stop on Silence)</h3>
      <button onClick={recording ? stopRecording : startRecording} style={{marginBottom: 16}}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <span style={{marginLeft: 16, color: '#888'}}>{status}</span>
      {audioURL && <audio src={audioURL} controls style={{display: 'block', margin: '1rem 0'}} />}
      {loading && <div>Transcribing...</div>}
      <div>
        <h4>Speaker Transcript:</h4>
        {diarized.length === 0 && !loading && <div style={{color: '#888'}}>No transcript yet.</div>}
        {diarized.map((seg, idx) => (
          <div key={idx} style={{marginBottom: 8}}><b>Speaker {seg.speaker}:</b> {seg.text}</div>
        ))}
      </div>
    </div>
  );
}
