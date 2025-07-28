import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const navigate = useNavigate();

  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading: authLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let client;

    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        client = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = client.call("default", callId);
        await callInstance.join({ create: true });

        try {
          await callInstance.microphone.enable();
        } catch (err) {
          toast.error("Microphone access denied.");
        }

        setVideoClient(client);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    if (!videoClient && authUser && tokenData?.token && callId) {
      initCall();
    }

    return () => {
      if (client) client.disconnectUser?.();
    };
  }, [authUser, tokenData?.token, callId, videoClient]);

  if (authLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {videoClient && call ? (
        <StreamVideo client={videoClient}>
          <StreamCall call={call}>
            <CallContent />
          </StreamCall>
        </StreamVideo>
      ) : (
        <div className="text-center text-lg text-red-500">
          Failed to initialize the call. Please refresh.
        </div>
      )}
    </div>
  );
};

const CallContent = () => {
  const navigate = useNavigate();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (callingState === CallingState.JOINED) {
      setHasJoined(true);
    }

    if (hasJoined && callingState === CallingState.LEFT) {
      console.log("User left call. Redirecting to home...");
      navigate("/");
    }
  }, [callingState, hasJoined, navigate]);

  if (!callingState || callingState === CallingState.IDLE) {
    return (
      <div className="text-center text-gray-500 p-4">Connecting to the call...</div>
    );
  }

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls onLeave={() => navigate("/")} />
    </StreamTheme>
  );
};

export default CallPage;
