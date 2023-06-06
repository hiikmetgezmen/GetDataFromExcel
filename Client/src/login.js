import axios from "axios";
import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import Weekly from "./Weekly";
import Daily from "./Daily";

function Login() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

  
    const refreshToken = async () => {
      try {
        const res = await axios.post("http://localhost:4000//api/refresh", { token: user.refreshToken });
        setUser({
          ...user,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          isAdmin:res.data.isAdmin
        });
        return res.data;
      } catch (err) {
        console.log(err);
      }
    };
  
    const axiosJWT = axios.create()
  
    axiosJWT.interceptors.request.use(
      async (config) => {
        let currentDate = new Date();
        const decodedToken = jwt_decode(user.accessToken);
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
          const data = await refreshToken();
          config.headers["authorization"] = "Bearer " + data.accessToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post("http://localhost:4000/api/login", { username, password })

        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    
    
    return (
      <div className="container">
        {user ? (
          <div className="home">
           {user.isAdmin === true && <Weekly></Weekly>}
            {user.isAdmin === false && <Daily></Daily>}
            {error && (
              <span className="error">
                You are not allowed to delete this user!
              </span>
            )}
            {success && (
              <span className="success">
                User has been deleted successfully...
              </span>
            )}
          </div>
        ) : (
          <div className="login">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="submitButton">
                Login
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }
export default Login