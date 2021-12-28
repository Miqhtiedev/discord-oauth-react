import { FunctionComponent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../main";

const Error: FunctionComponent = () => {
  const navigate = useNavigate();
  const [error, setError] = useGlobalState("error");

  useEffect(() => {
    return () => {
      setError(""); // clear error on unmount
    };
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1>{error || "Page Not Found"}</h1>
      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  );
};

export default Error;
