import { useEffect, useState } from "react";
import axios from "axios";

interface AvatarProps {
  audioUrl: string;
  loading: boolean;
}

const Avatar = ({ audioUrl, loading }: AvatarProps) => {
  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string>("");

  const fetchLoadingAvatar = async () => {
    try {
      const response = await axios.get("https://api.heygen.com/v1/avatar.list", {
        headers: {
          accept: "application/json",
          "x-api-key": import.meta.env.VITE_AVATAR_SERVICE_API_KEY,
        },
      });
      const avatar = response.data.data.avatars.find(
        (a: any) => a.avatar_id === "1721683426"
      );
      if (avatar) {
        setAvatarVideoUrl(avatar.avatar_states[0].video_url.grey); // Set the loading avatar video URL
      }
    } catch (error) {
      console.error("Error fetching loading avatar:", error);
    }
  };

  useEffect(() => {
    if (!audioUrl && !loading) {
      fetchLoadingAvatar();
    } else if (audioUrl) {
      setAvatarVideoUrl(audioUrl);
    }
  }, [audioUrl, loading]);

  return (
    <div className="flex flex-col items-center">
      {loading ? (
        <div className="w-1/2 h-64 bg-gray-300 rounded-md flex items-center justify-center">
          <p>Loading Avatar...</p>
        </div>
      ) : avatarVideoUrl ? (
        <video
          src={avatarVideoUrl}
          playsInline
          autoPlay
          className="w-64 h-64 object-cover rounded"
        />
      ) : (
        <div className="w-1/2 h-64 bg-gray-300 rounded-md flex items-center justify-center">
          <p>Avatar Loading</p>
        </div>
      )}
    </div>
  );
};

export default Avatar;
