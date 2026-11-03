// Web Speech Recognition & SpeechSynthesis Helper for Siri

export function speakSiri(text: string, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.05;
  utterance.pitch = 1.08;

  const voices = window.speechSynthesis.getVoices();
  // Find best Indian English or Hindi voice
  const preferredVoice =
    voices.find((v) => v.lang === 'hi-IN') ||
    voices.find((v) => v.lang === 'en-IN') ||
    voices.find((v) => v.name.toLowerCase().includes('siri') || v.name.toLowerCase().includes('samantha')) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    voices[0];

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// Check speech recognition support
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export type SpeechCallback = (transcript: string, isFinal: boolean) => void;

export function createSpeechRecognizer(
  onTranscript: SpeechCallback,
  onStart: () => void,
  onEnd: () => void,
  onError: (err: string) => void
) {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-IN'; // Works well with Hinglish words and English commands

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    if (finalTranscript) {
      onTranscript(finalTranscript.trim(), true);
    } else if (interimTranscript) {
      onTranscript(interimTranscript.trim(), false);
    }
  };

  recognition.onstart = () => {
    onStart();
  };

  recognition.onend = () => {
    onEnd();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onerror = (event: any) => {
    onError(event.error || 'Speech recognition error');
  };

  return recognition;
}
