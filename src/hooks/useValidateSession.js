import { v4 as uuidv4 } from "uuid";
import { useCookies } from "react-cookie";

export const useValidateSession = () => {
  const [cookie, setCookie] = useCookies(["user_uuid"]);

  const saveUuidCookie = () => {
    const validateTime = 3600; //1시간
    const expiration = new Date(Date.now() + validateTime * 1000);
    setCookie("user_uuid", uuidv4(), {
      secure: false,
      sameSite: "lax",
      path: "/",
      expires: expiration,
    });
  };

  const isSessionValid = () => {
    if (cookie.user_uuid) return false;
    else return true;
  };
  return { saveUuidCookie, isSessionValid };
};
