import { useState } from "react";

export default function useToken() {
  const [token, setInternalToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const setToken = (newToken) => {

    localStorage.setItem("token", newToken);
    setInternalToken(newToken);
  };
  return [token, setToken];
}
