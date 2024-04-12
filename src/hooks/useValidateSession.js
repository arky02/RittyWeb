import { v4 as uuidv4 } from "uuid";
import { useCookies } from "react-cookie";

export const useValidateSession = () => {
  const [cookie, setCookie] = useCookies(["userUuid"]);

  const saveUuidCookie = () => {
    const validateTime = 3600; //1시간
    const expiration = new Date(Date.now() + validateTime * 1000);
    setCookie("userUuid", uuidv4(), {
      secure: false,
      sameSite: "lax",
      path: "/",
      expires: expiration,
    });
  };

  const isSessionValid = () => {
    if (cookie.userUuid) return false;
    else return true;
  };
  return { saveUuidCookie, isSessionValid };
};
