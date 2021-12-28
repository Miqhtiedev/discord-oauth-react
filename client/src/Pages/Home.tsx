import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

const Home: FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen justify-center items-center">
      <button onClick={() => navigate("/profile")} className="bg-black text-white rounded-md w-[50px] h-[30px]">
        Profile
      </button>
    </div>
  );
};

export default Home;
