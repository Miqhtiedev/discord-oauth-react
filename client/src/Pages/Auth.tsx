import axios from "axios";
import jwtDecode from "jwt-decode";
import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../constants";
import { useGlobalState } from "../main";

const Auth: FunctionComponent = () => {
  const [error, setError] = useGlobalState("error");
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      axios
        .post(`${SERVER_URL}/login/discord`, { code }, { headers: { "Content-Type": "application/json" } })
        .then((res) => {
          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            navigate("/profile");
          } else {
            setError("Error: Could not find access token in response");
            navigate("/error");
          }
        })
        .catch((err) => {
          console.error(err);
          setError("An error has occured whilst trying to authenticate with discord!");
          navigate("/error");
        });
    } else {
      setError("Error authenticating you. Please try again.");
      navigate("/error");
    }
  }, []);

  return (
    <div className="flex h-screen justify-center items-center">
      <h1>Loading...</h1>
    </div>
  );
};

export default Auth;
