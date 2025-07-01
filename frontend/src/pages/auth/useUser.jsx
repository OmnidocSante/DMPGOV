import useToken from "./useToken";
import { useState, useEffect } from "react";

export default function useUser() {
  const [token] = useToken();
  const decode = (token) => {
    const encodedPayload = token.split(".")[1];

    return JSON.parse(atob(encodedPayload));
  };
  const [user, setUser] = useState(() => {
    if (!token) {
      return null;
    } else {
      return decode(token);
    }
  });
  useEffect(() => {
    if (!token) {
      setUser(null);
    } else {
      setUser(decode(token));
    }
  }, [token]);

  return user;
}
