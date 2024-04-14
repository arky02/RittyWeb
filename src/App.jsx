import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Send from "./assets/send.svg";
import Cat from "./assets/cat.png";
import Grad from "./assets/background.svg";
import Modal from "./components/Modal";
import axios from "axios";
import T from "./utils/switchLang";
import { useValidateSession } from "./hooks/useValidateSession";

function App() {
  const [msgList, setMsgList] = useState([]);
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [emailTxt, setEmailTxt] = useState("");
  const { saveUuidCookie, isSessionValid } = useValidateSession();

  const splitUrl = window.location.href.split("/");
  const isLangEng = Number(splitUrl[splitUrl.length - 1] === "?lang=en");

  // useEffect(() => {
  //   if (!isSessionValid()) setIsModalOpen(true);
  // }, []);

  function sendMyText() {
    const newMessage = {
      id: "user",
      action: "none",
      content: text,
    };
    if (text) {
      setMsgList((prev) => [...prev, newMessage]);
      sendMsgToServer([...msgList, newMessage]);
      setText("");
    } else {
      alert(T.EnterEmail[isLangEng]);
    }
  }

  function sendMyTextByEnter(e) {
    const newMessage = {
      id: "user",
      action: "none",
      content: text,
    };
    if (e.target.value.includes("\n")) {
      setMsgList((prev) => [...prev, newMessage]);
      sendMsgToServer([...msgList, newMessage]);
      setText("");
    }
  }

  async function sendMsgToServer(messageList) {
    const loadingMsg = {
      id: "ritty",
      action: "loading",
      content: "",
    };

    setMsgList((prev) => [...prev, loadingMsg]);

    const response = await axios.post(`https://sam-meows.com/api/meow`, {
      message: messageList.filter((el) => el.action !== "loading"),
    });

    console.log(response);
    setMsgList((prev) => [
      ...prev.filter((el) => el.action !== "loading"),
      response.data,
    ]);
    console.log(msgList);

    if (response.status === 200) setCount((prev) => (prev += 1));
    if (count >= 3) {
      setIsModalOpen(true);
      saveUuidCookie();
    }
  }

  async function sendEmailToServer() {
    if (emailTxt === "") return;
    if (!validateEmail(emailTxt)) {
      alert("이메일 형식에 맞지 않습니다. 다시 입력해 주세요.");
      setEmailTxt("");
      return;
    }
    try {
      const response = await axios.post(`https://sam-meows.com/api/log/email`, {
        email: emailTxt,
      });

      console.log(response);

      if (response.status === 200) setIsEmailSubmitted(true);

      setEmailTxt("");
      setIsEmailModalOpen(true);
    } catch {
      alert("이미 등록된 이메일이거나 이메일 등록에 문제가 발생하였습니다.");
      setEmailTxt("");
    }
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  return (
    <main
      className="sm:w-[24.6875rem] w-[100vw] h-[100vh] flex flex-col md:justify-center pt-[4.375rem] md:pt-0 md:-mt-7 px-[1.5rem] relative overflow-x-hidden pb-[30px]  bg-[url('./assets/background.svg')] bg-cover"
      style={{
        backgroundColor: isOpen ? "#FFFFFF" : "#FFFEFA",
        overflowY: isOpen ? "auto" : "hidden",
      }}
    >
      <div className="flex flex-col items-center gap-[.5625rem] w-full">
        <div
          className="text-[25px] font-light flex flex-col w-full"
          style={{
            textAlign: isOpen ? "left" : "center",
            marginBottom: isOpen ? ".4375rem" : "1.25rem",
            marginLeft: 5,
          }}
        >
          <span>
            {T.MyLittlePet[isLangEng][0]} <br />
            {T.MyLittlePet[isLangEng][1]}
            <span className="font-semibold">{T.Ritty[isLangEng]}</span>
          </span>
          <span className="text-[#8242D4] z-10 relative text-[1.125rem] mt-2">
            {T.AdoptedMsg[isLangEng][0]}
            <span className="font-semibold">{"12,300"}</span>
            {T.AdoptedMsg[isLangEng][1]}
          </span>
        </div>

        <section className="w-full">
          <div className="flex flex-col gap-[5px] w-full mb-1">
            <div className="flex flex-row  w-full z-10 relative gap-3">
              <input
                className="bg-[#ffffff] border-[#f2f2f2] shadow border-[.0625rem] p-3 rounded-[.625rem] w-full h-[3.125rem]"
                placeholder="Email"
                value={emailTxt}
                onChange={(e) => setEmailTxt(e.target.value)}
              />
              <motion.div whileTap={{ scale: 0.9 }}>
                <button
                  onClick={sendEmailToServer}
                  className="bg-[#8242D4] rounded-[.625rem] text-[#ffffff] px-[0.9rem] font-semibold h-[3.125rem] whitespace-nowrap"
                  disabled={isEmailSubmitted}
                  style={{
                    backgroundColor: isEmailSubmitted ? "#ccadf5" : "#8242D4",
                  }}
                >
                  {T.EnterEmail[isLangEng]}
                </button>
              </motion.div>
              <div />
            </div>
            <span className="text-[.8125rem] text-[#666666] ml-1 mb-1 ">
              {"*" + T.EnterEmailDesc[isLangEng]}
            </span>
          </div>
        </section>
        <motion.div whileTap={{ scale: isOpen ? 0.9 : 1 }}>
          <img
            src={Cat}
            width={isOpen ? 199 : 209}
            height={isOpen ? 208 : 218}
            className="relative z-10 "
          ></img>
          {/* {isOpen || (
            <img
              src={Grad}
              width={400}
              height={420}
              className="absolute md:top-[15.625rem] top-[7.5rem] left-0 flex sm:w-400 h-600 w-full sm:h-420 overflow-hidden"
            ></img>
          )} */}
        </motion.div>
        <motion.div layout style={{ height: isOpen ? "20.625rem" : "0rem" }}>
          <section className="flex flex-col h-full bg-[#f1f1f1] w-[21.5625rem] rounded-[1.25rem]">
            <div className="h-[20.625rem] w-full overflow-y-auto px-2.5 py-3 ">
              {isOpen && (
                <div className="inline-block max-w-[18.75rem] text-sm relative mx-0 my-[.3125rem] bg-[#ffffff] float-left clear-both text-[#8f00fe] px-[.9375rem] py-[.4375rem] rounded-[.875rem_.875rem_.875rem_0]">
                  {T.GreetingMsg[isLangEng]}
                </div>
              )}

              {msgList.length > 0 &&
                msgList.map((msgEl, idx) =>
                  msgEl?.id === "user" ? (
                    <div
                      key={idx}
                      className="inline-block max-w-[18.75rem] text-sm relative mx-0 my-[.3125rem] bg-[#8f00fe] float-right clear-both text-white px-[.9375rem] py-[.4375rem] rounded-[.875rem_.875rem_0_.875rem]"
                    >
                      {msgEl.content}
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className="inline-block max-w-[18.75rem] text-sm relative mx-0 my-[.3125rem] bg-[#ffffff] float-left clear-both text-[#8f00fe] px-[.9375rem] py-[.4375rem] rounded-[.875rem_.875rem_.875rem_0]"
                    >
                      {msgEl?.action === "loading" ? (
                        <div className="flex space-x-1 justify-center items-center bg-white p-[.3125rem] ">
                          <div className="h-[.3125rem] w-[.3125rem] bg-[#a8a8a8] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="h-[.3125rem] w-[.3125rem] bg-[#a8a8a8] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="h-[.3125rem] w-[.3125rem] bg-[#a8a8a8] rounded-full animate-bounce"></div>
                        </div>
                      ) : (
                        msgEl?.content
                      )}
                    </div>
                  )
                )}
            </div>

            <motion.div whileTap={{ scale: 0.97 }}>
              <div
                onClick={() => setIsOpen(true)}
                className="flex relative justify-between items-center w-full h-20 p-[.25rem]"
              >
                <textarea
                  className="w-full h-[3.125rem] resize-none rounded-[1.875rem] py-[.625rem] pl-[1.375rem] pr-[2rem] border-[#E8E8E8] border-[.0625rem]"
                  placeholder={
                    !isSessionValid()
                      ? T.BlockedInputPlaceholder[isLangEng]
                      : T.InputPlaceholder[isLangEng]
                  }
                  disabled={!isSessionValid()}
                  value={text}
                  text={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    sendMyTextByEnter(e);
                  }}
                ></textarea>
                <button
                  id="send"
                  className="absolute right-3 bg-transparent cursor-pointer border-[none]"
                  onClick={sendMyText}
                  disabled={!isSessionValid()}
                >
                  <img src={Send} width="34" height="34" />
                </button>
              </div>
            </motion.div>
          </section>
        </motion.div>
      </div>
      <Modal
        isOpen={isModalOpen}
        title={T.EndModalText.title[isLangEng]}
        description={T.EndModalText.desc[isLangEng]}
        onClose={() => setIsModalOpen(false)}
        buttonText={T.EndModalText.btnText[isLangEng]}
      ></Modal>
      <Modal
        isOpen={isEmailModalOpen}
        title={T.EmailSubmitModalText.title[isLangEng]}
        description={T.EmailSubmitModalText.desc[isLangEng]}
        onClose={() => setIsEmailModalOpen(false)}
        buttonText={T.EmailSubmitModalText.btnText[isLangEng]}
      ></Modal>
    </main>
  );
}

export default App;
