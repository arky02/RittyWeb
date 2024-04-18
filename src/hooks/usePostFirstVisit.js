import axios from "axios";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

const usePostFirstVisit = () => {
  const [cookie, setCookie] = useCookies(["visited"]);

  const checkUserUnique = () => {
    const isUnique = !cookie.visited;
    axios.post("https://sam-meows.com/api/log/new_visit", {
      is_unique: isUnique,
    });
    if (!cookie.visited) setCookie("visited", true);
    return isUnique;
  };

  useEffect(() => {}, []);
  return { checkUserUnique };
};

export default usePostFirstVisit;
