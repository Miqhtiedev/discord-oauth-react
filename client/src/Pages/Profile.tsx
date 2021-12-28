import axios from "axios";
import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENT_ID, SERVER_URL } from "../constants";
import { useGlobalState } from "../main";

interface IUser {
  tag: string;
  id: string;
  avatar: string;
  createdAt: number;
}

const Profile: FunctionComponent = () => {
  const [error, setError] = useGlobalState("error");
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      const redirect = encodeURIComponent(window.location.protocol + "//" + window.location.host + "/auth");
      const url = `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`;

      window.location.href = url;
      return;
    }

    axios
      .get(`${SERVER_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          setError("Error: No user in response");
          navigate("/error");
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        navigate("/error");
      });
  }, []);

  if (user) {
    return (
      <div className="flex flex-col h-screen justify-center items-center">
        <h1>Hello {user.tag.split("#")[0]}</h1>
        <img className="mt-8 rounded-lg" src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`} />
      </div>
    );
  } else return <h1 className="flex h-screen justify-center items-center">Loading...</h1>;
};

export default Profile;
