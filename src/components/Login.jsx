import React, { useEffect } from "react";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { gapi } from "gapi-script";
import logo from "../assets/othre_logo.png";
import illustration from "../assets/undraw_secure_login.png";

import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();
  const responseGoogle = (response) => {
    localStorage.setItem("user", JSON.stringify(response.profileObj));

    const { name, googleId, imageUrl } = response?.profileObj;

    const doc = {
      _id: googleId,
      _type: "user",
      userName: name,
      image: imageUrl,
    };

    client.createIfNotExists(doc)
    .then(()=>{
      navigate('/', { replace: true})
    })

  };

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_API_TOKEN,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  });

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0">
        <div className="border border-gray-300 rounded-3xl px-9 pb-9 shadow-2xl">
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-3 rounded-lg border border-gray-300"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-4" />
                  Sign in with Google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
