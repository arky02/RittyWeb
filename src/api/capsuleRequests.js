import axios from "axios";

export const reqCurrUser = async () => {
  let response = "";
  try {
    response = await axios.get(`https://sam-meows.com/api/log/email`);
  } catch {
    alert("서버 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.");
    return 0;
  }

  return response?.data?.email_count;
};

export const reqChatResponse = async (messageList) => {
  let response = "";
  try {
    response = await axios.post(`https://sam-meows.com/api/meow`, {
      message: messageList.filter((el) => el.action !== "loading"),
    });
  } catch {
    alert("서버 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.");
    return;
  }
  return response;
};
