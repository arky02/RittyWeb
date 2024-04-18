import { useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

const useHandleInteraction = () => {
  const [cookie, setCookie] = useCookies(["pet_count"]);
  // const [cookie, setCookie] = useCookies(["pet-count"]);
  // const [cookie, setCookie] = useCookies(["pet-count"]);

  const handleInteraction = async ({ type, msgList, isUnique }) => {
    increasePetCount();
    const response = await axios.post(`https://sam-meows.com/api/interaction`, {
      message: msgList,
      interaction: {
        interaction_type: type,
        interaction_param: {
          // is_full? : boolean,
          // hunt_count? : int,
          pet_count: cookie.pet_count ?? 1,
        },
      },
      is_unique: isUnique,
    });
  };

  const increasePetCount = () => {
    const currCount = cookie.pet_count;
    setCookie("pet_count", currCount + 1);
  };

  useEffect(() => {
    if (!cookie.pet_count) {
      setCookie("pet_count", 1);
    }
  }, []);

  return { handleInteraction };
};

export default useHandleInteraction;
