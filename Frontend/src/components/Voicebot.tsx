import axios from "axios";
import { useState } from "react";
import { FaMicrophoneSlash, FaMicrophone } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Avatar from "./Avatar";

const VoiceBot = () => {
  const [response, setResponse] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [listen, setListen] = useState(false);
  const [loading,setLoading] = useState<boolean>(false);
  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesnot support speech recognition</span>;
  }

  // Toggle listening state
  const handleListening = () => {
    if (listen) {
      SpeechRecognition.stopListening();
      setListen(false);
    } else {
      SpeechRecognition.startListening({
        continuous: true,
      });
      setListen(true);
    }
    resetTranscript();
  };

  console.log(import.meta.env.VITE_PUBLIC_BACKEND_URL)
  const handleMessage = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/chat`, {
        message: transcript,
      });
      setResponse(res.data.response);
      setAudioUrl(res.data.audioStream);
      resetTranscript();
    }catch (error: any) {
      if (error.response && [400, 404, 429].includes(error.response.status)) {
        setResponse(error.response.data.responsemessage);
      } else {
        console.error("Error communicating with the backend", error);
      }
      setLoading(false);
      resetTranscript();
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white p-4 rounded shadow">
        <Avatar audioUrl={audioUrl} loading={loading} />
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Voicebot Simba</h1>
            <button
              onClick={handleListening}
              className={`p-2 rounded-full ${
                listening ? "bg-red-500" : "bg-green-500"
              } text-white`}
            >
              {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleMessage}
            >
              Send Message
            </button>
          </div>
          <p className="mt-4">Transcript: {transcript}</p>
          <p className="mt-2">Response: {response}</p>
        </div>
      </div>
    </>
  );
};

export default VoiceBot;
