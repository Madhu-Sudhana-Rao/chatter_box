import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  StreamTheme,
  CallControls,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { getStreamToken } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";

const CallPage = () => {
  const { id: callId } = useParams();
  const navigate = useNavigate();
  const user = useAuthUser();

  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    const initCall = async () => {
      try {
        if (!user || !callId) return;

        const token = await getStreamToken(user.id);
        const client = new StreamVideoClient({
          apiKey: import.meta.env.VITE_STREAM_API_KEY,
          user: {
            id: user.id,
            name: user.name,
            image: user.image,
          },
          token: token,
        });

        const streamCall = client.call("default", callId);
        await streamCall.join();
        setVideoClient(client);
        setCall(streamCall);

        streamCall.on("call.left", () => {
          navigate("/");
        });
      } catch (err) {
        navigate("/");
      }
    };

    initCall();

    return () => {
      if (call) call.leave();
      if (videoClient) videoClient.disconnectUser();
    };
  }, [user, callId]);

  if (!call || !videoClient) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-xl">
        Joining call...
      </div>
    );
  }

  return (
    <StreamVideo client={videoClient}>
      <StreamCall call={call}>
        <StreamTheme>
          <div className="h-screen w-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <SpeakerLayout />
            </div>
            <div className="border-t">
              <CallControls />
            </div>
          </div>
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
};

export default CallPage;
