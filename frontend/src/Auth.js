import { Auth } from "aws-amplify";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentSession();
  }, []);

  const getCurrentSession = async () => {
    try {
      const userSession = await Auth.currentSession();
      if (userSession) setUser(userSession);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const buildURL = (endpoint) => `${process.env.REACT_APP_API_URL}/${endpoint}`;

  const handleResponse = (response) => {
    if (response.status === 200) {
      return response.json();
    }
    if (response.status === 403) {
      throw Error("unauthenticated request");
    }
    throw Error("unhandled status code");
  };

  const get = async (endpoint) => {
    const response = await fetch(buildURL(endpoint), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    });
    return handleResponse(response);
  };

  const put = async (endpoint) => {
    const response = await fetch(buildURL(endpoint), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    });
    return response.json();
  };

  if (loading)
    return (
      <div className="loading">
        <span>Loading</span>
      </div>
    );

  return (
    <AuthContext.Provider value={{ user, get, put }}>
      {children}
    </AuthContext.Provider>
  );
}
