import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Send from "./assets/send.svg";
import Modal from "./components/Modal";
import axios from "axios";
import T from "./utils/switchLang";
import { useValidateSession } from "./hooks/useValidateSession";
import { useInterval } from "usehooks-ts";
import useDetectSwipe from "./hooks/useDetectSwipe";
import usePostFirstVisit from "./hooks/usePostFirstVisit";
import useHandleInteraction from "./hooks/useHandleInteraction";
import { reqCurrUser, reqChatResponse } from "./api/capsuleRequests";
import ReactGA from "react-ga4";

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
  const [isChatValid, setIsChatValid] = useState(true);
  const [imgIdxState, setImgIdxState] = useState(1);
  const [currImgState, setCurrImgState] = useState({
    status: "bread",
    isStatusChanged: false,
  });
  const [currImgName, setCurrImgName] = useState("bread");
  const [isUserUnique, setIsUserUnique] = useState(false);
  const [userCount, setUserCount] = useState(null);

  const scrollRef = useRef();

  const { onTouchStart, onTouchMove, onTouchEnd, swiped } = useDetectSwipe();
  const { handleInteraction } = useHandleInteraction();
  const { checkUserUnique } = usePostFirstVisit();

  const splitUrl = window.location.href.split("/");
  const isLangEng = Number(splitUrl[splitUrl.length - 1] === "?lang=en");

  useEffect(() => {
    const handleFirstReq = async () => {
      const isUnique = await checkUserUnique();
      const currUserCount = await reqCurrUser();
      setUserCount(currUserCount);
      setIsUserUnique(isUnique);
    };
    handleFirstReq();
  }, [isEmailModalOpen]);

  useEffect(() => {
    if (!isSessionValid())
      setCurrImgState({ status: "sleepy", isStatusChanged: true });

    // ga initialize
    if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
      ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS);
    }
  }, []);

  // 구글 애널리틱스 운영서버만 적용
  useEffect(() => {}, []);

  useEffect(() => {
    if (isOpen) setCurrImgState({ status: "none", isStatusChanged: true });
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [msgList]);

  useEffect(() => {
    if (swiped) {
      const newInteractionMsg = {
        id: "user",
        action: "pet",
        content: "", // NULL
      };
      reqChatResponse([...msgList, newInteractionMsg]);
      handleInteraction({
        type: "pet",
        msgList: [...msgList, newInteractionMsg],
        isUnique: isUserUnique,
      });
      setMsgList((prev) => [...prev, newInteractionMsg]);
    }
  }, [swiped]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  function sendMyText() {
    const newMessage = {
      id: "user",
      action: "none",
      content: text,
    };
    if (text.length > 50) alert("50자 이내로 작성해주세요.");
    else if (text !== "") {
      setMsgList((prev) => [...prev, newMessage]);
      sendMsgToServer([...msgList, newMessage]);
      setText("");
    } else {
      alert(T.EnterMsg[isLangEng]);
      return;
    }
  }

  function sendMyTextByEnter(e) {
    const newMessage = {
      id: "user",
      action: "none",
      content: text,
    };
    if (e.target.value.includes("\n")) {
      if (text.length > 50) alert("50자 이내로 작성해주세요.");
      else if (text !== "") {
        setMsgList((prev) => [...prev, newMessage]);
        sendMsgToServer([...msgList, newMessage]);
        setText("");
      } else {
        alert(T.EnterMsg[isLangEng]);
        setText("");
        return;
      }
    }
  }

  async function sendMsgToServer(messageList) {
    const loadingMsg = {
      id: "ritty",
      action: "loading",
      content: "",
    };

    // set loading msg
    setMsgList((prev) => [...prev, loadingMsg]);

    setIsChatValid(false);

    // get chat response
    let response = await reqChatResponse(messageList);

    // set new msg
    setMsgList((prev) => [
      ...prev.filter((el) => el.action !== "loading"),
      response.data,
    ]);

    const newImgStatus = response.data?.action.toLowerCase();

    // change cat's img
    setCurrImgState((prev) => ({
      status: newImgStatus,
      isStatusChanged: prev.status === newImgStatus,
    }));

    if (!(newImgStatus === "none" || newImgStatus === "bread")) {
      setTimeout(() => {
        setCurrImgState({ status: "none", isStatusChanged: true });
      }, 4500);
    }

    setIsChatValid(true);

    if (response.status === 200) setCount((prev) => (prev += 1));
    if (count >= 6) {
      // 채팅 횟수 제한 7번으로
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

  const manageImgStatus = () => {
    let length = 2;
    let isIdleSecondaryStatus = false;
    // eslint-disable-next-line default-case
    switch (currImgState.status) {
      case "bread":
        length = 1;
        break;
      case "smile":
      case "angry":
        isIdleSecondaryStatus = true;
        break;
      case "wag":
        length = 3;
        break;
    }

    if (currImgState.isStatusChanged) {
      setImgIdxState(0);
      setCurrImgState((prev) => ({ ...prev, isStatusChanged: false }));
    } else {
      setImgIdxState((prev) => (prev + 1) % length);
    }

    setCurrImgName(
      isIdleSecondaryStatus
        ? imgIdxState
          ? currImgState.status
          : "none1"
        : length === 1
        ? currImgState.status
        : currImgState.status + String(imgIdxState + 1)
    );
  };

  useInterval(() => {
    manageImgStatus(currImgState.status);
  }, 1000);

  // useEffect(() => {
  //   const getUserCount = async () => {
  //     const response = await axios.get(`https://sam-meows.com/api/log/email`);
  //     console.log(response.data);
  //     setUserCount(response.data);
  //   };
  //   getUserCount();
  // }, []);

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
          <span className="text-[#FB8A59] z-10 relative text-[1.125rem] mt-2">
            {T.AdoptedMsg[isLangEng][0]}
            <span className="font-semibold">
              {userCount ? userCount * 3 + 25 : "-"}
            </span>
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
                  className="bg-[#FB8A59] rounded-[.625rem] text-[#ffffff] px-[0.9rem] font-semibold h-[3.125rem] whitespace-nowrap"
                  disabled={isEmailSubmitted}
                  style={{
                    backgroundColor: isEmailSubmitted ? "#f0b49b" : "#FB8A59",
                  }}
                >
                  {T.EnterEmail[isLangEng]}
                </button>
              </motion.div>
              <div />
            </div>
            <span className="text-[.8125rem] text-[#666666] ml-1 mb-1 font-light">
              {"*" + T.EnterEmailDesc[isLangEng]}
            </span>
          </div>
        </section>
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="relative"
        >
          <motion.div whileTap={{ scale: 0.85 }}>
            <img
              src={require(`./assets/${currImgName}.png`)}
              width={isOpen ? 199 : 209}
              height={isOpen ? 208 : 218}
              className="relative z-10 mr-[35px] mb-4"
              draggable={false}
              alt="cat ritty"
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
          <AnimatePresence>
            {swiped && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="absolute -top-[3px] right-[120px]">💓</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.div layout style={{ height: isOpen ? "20.625rem" : "0" }}>
          <section className="flex flex-col h-full bg-[#f1f1f1] w-[21.5625rem] rounded-[1.25rem]">
            <div
              className="h-[20.625rem] w-full overflow-y-auto px-2.5"
              style={{ paddingTop: isOpen ? 7 : 0 }}
              ref={scrollRef}
            >
              {isOpen && (
                <div className="inline-block max-w-[18.75rem] text-sm relative mx-0 my-[.3125rem] bg-[#ffffff] float-left clear-both text-[#000000] px-[.9375rem] py-[.4375rem] rounded-[.875rem_.875rem_.875rem_0]">
                  {T.GreetingMsg[isLangEng]}
                </div>
              )}

              {msgList.length > 0 &&
                msgList.map(
                  (msgEl, idx) =>
                    msgEl?.content !== "" &&
                    (msgEl?.id === "user" ? (
                      <div
                        key={idx}
                        className="inline-block max-w-[18.75rem] text-sm relative mx-0 my-[.3125rem] bg-[#FB8A59] float-right clear-both text-white px-[.9375rem] py-[.4375rem] rounded-[.875rem_.875rem_0_.875rem]"
                      >
                        {msgEl.content}
                      </div>
                    ) : (
                      <div
                        key={idx}
                        className="inline-block max-w-[18.75rem] text-sm relative mx-0 my-[.3125rem] bg-[#ffffff] float-left clear-both text-[#000000] px-[.9375rem] py-[.4375rem] rounded-[.875rem_.875rem_.875rem_0]"
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
                    ))
                )}
            </div>

            <motion.div whileTap={{ scale: 0.97 }}>
              <div
                onClick={() => setIsOpen(true)}
                className="flex relative justify-between items-center w-full p-[0.4rem]"
                style={{ padding: isOpen ? "0.4rem" : 0 }}
              >
                <textarea
                  className="w-full h-[3.125rem] resize-none rounded-[1.875rem] py-[.625rem] pl-[1.375rem] pr-[2rem] border-[#E8E8E8] border-[.0625rem]"
                  style={{ margin: isOpen ? "5px 0 5px 0" : 0 }}
                  placeholder={
                    !isSessionValid()
                      ? T.BlockedInputPlaceholder[isLangEng]
                      : T.InputPlaceholder[isLangEng]
                  }
                  disabled={!isSessionValid() || !isChatValid}
                  value={text}
                  text={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    sendMyTextByEnter(e);
                  }}
                ></textarea>
                <button
                  id="send"
                  className="absolute right-3.5 bg-transparent cursor-pointer border-[none]"
                  onClick={sendMyText}
                  disabled={!isSessionValid() || !isChatValid}
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
        onClose={() => {
          setIsModalOpen(false);
          window.location.reload();
        }}
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
