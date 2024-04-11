import { useState } from "react";
import { motion } from "framer-motion";
import Send from "./assets/send.svg";
import Cat from "./assets/cat.png";
import Grad from "./assets/background.svg";
import Modal from "./components/Modal";
import axios from "axios";

function App() {
  const [msgList, setMsgList] = useState([]);
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [count, setCount] = useState(0);

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
      alert("메시지를 입력하세요...");
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
      content: "loading",
    };

    setMsgList((prev) => [...prev, loadingMsg]);

    const response = await axios.post(`https://sam-meows.com/api/meow`, {
      message: messageList,
    });

    setMsgList((prev) => [
      ...prev.filter((el) => el.action !== "loading"),
      response.data.message,
    ]);

    if (response.status === 200) setCount((prev) => (prev += 1));
    if (count >= 10) setIsModalOpen(true);
  }

  return (
    <main
      className="sm:w-[24.6875rem] w-[100vw] h-[100vh] flex flex-col md:justify-center pt-[4.375rem] md:pt-0 md:-mt-7 px-[1.5625rem] relative overflow-x-hidden overflow-y-hidden"
      style={{
        backgroundColor: isOpen ? "#FFFFFF" : "#FFFEFA",
      }}
    >
      <div className="flex flex-col items-center gap-[.5625rem]">
        <div
          className="text-[1.375rem] flex flex-col"
          style={{
            textAlign: isOpen ? "left" : "center",
            marginBottom: isOpen ? ".4375rem" : "1.25rem",
            marginLeft: isOpen ? "-11.25rem" : 0,
          }}
        >
          <span>
            내 손 안의 작은 <br />
            반려 고양이, <span className="font-semibold">리티</span>
          </span>
          <span className="text-[#8242D4] z-10 relative text-[1.125rem] mt-3">
            12,300명이 리티 입양중
          </span>
        </div>

        <section className="w-full">
          <div className="flex flex-row justify-evenly w-full z-10 relative mb-[.625rem]">
            <div className="flex flex-col gap-1">
              <input
                className="bg-[#ffffff] border-[#f2f2f2] shadow border-[.0625rem] p-3 rounded-[.625rem] w-[14.375rem] h-[3.125rem]"
                placeholder="Email"
              />
              <span className="text-[.8125rem] text-[#666666] ml-1 mb-1">
                *이메일을 입력하고 앱 출시 소식을 받아보세요!
              </span>
            </div>

            <motion.div whileTap={{ scale: 0.9 }}>
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="bg-[#8242D4] rounded-[.625rem] text-[#ffffff] px-[.625rem] font-semibold h-[3.125rem] whitespace-nowrap"
              >
                입양하기
              </button>
            </motion.div>
          </div>
        </section>
        <motion.div whileTap={{ scale: isOpen ? 0.9 : 1 }}>
          <img
            src={Cat}
            width={isOpen ? 199 : 209}
            height={isOpen ? 208 : 218}
            className="relative z-10 "
          ></img>
          {isOpen || (
            <img
              src={Grad}
              width={400}
              height={420}
              className="absolute md:top-[15.625rem] top-[7.5rem] left-0 flex sm:w-400 h-600 w-full sm:h-420 overflow-hidden"
            ></img>
          )}
        </motion.div>
        <motion.div layout style={{ height: isOpen ? "20.625rem" : "0rem" }}>
          <section className="flex flex-col h-full bg-[#f1f1f1] w-[21.5625rem] rounded-[1.25rem]">
            <div className="h-[20.625rem] w-full overflow-y-auto px-2.5 py-3 ">
              {isOpen && (
                <div className="inline-block max-w-[18.75rem] text-sm relative mx-0 my-[.3125rem] bg-[#ffffff] float-left clear-both text-[#8f00fe] px-[.9375rem] py-[.4375rem] rounded-[.875rem_.875rem_.875rem_0]">
                  안녕하냥🐾 나는 리티다냥! 너는 이름이 뭐냥?🐱
                </div>
              )}

              {msgList.length > 0 &&
                msgList.map((msgEl, idx) =>
                  msgEl.id === "user" ? (
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
                      {msgEl.action === "loading" ? (
                        <div className="flex space-x-1 justify-center items-center bg-white p-[.3125rem] ">
                          <div className="h-[.3125rem] w-[.3125rem] bg-[#a8a8a8] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="h-[.3125rem] w-[.3125rem] bg-[#a8a8a8] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="h-[.3125rem] w-[.3125rem] bg-[#a8a8a8] rounded-full animate-bounce"></div>
                        </div>
                      ) : (
                        msgEl.content
                      )}
                    </div>
                  )
                )}
            </div>

            <motion.div whileTap={{ scale: 0.97 }}>
              <div
                onClick={() => setIsOpen(true)}
                className="flex relative justify-between items-center w-full h-20 p-[.25rem]  "
              >
                <textarea
                  className="w-full h-[3.125rem] resize-none rounded-[1.875rem] py-[.625rem] pl-[1.375rem] pr-[2rem] border-[#E8E8E8] border-[.0625rem]"
                  placeholder="심심한 고양이 리티에게 말을 걸어보세요!"
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
        title={"야옹이의 간택을 받으셨습니다!"}
        description={"너 좀 내 취향인데? 나의 집사가 돼라 냥~"}
        onClose={() => setIsModalOpen(false)}
        buttonText="입양하러 가기"
      ></Modal>
      <Modal
        isOpen={isEmailModalOpen}
        title={"감사합니다 🐾"}
        description={`해당 이메일 주소로 앱 출시 안내 메일을 보내드릴게요!`}
        onClose={() => setIsEmailModalOpen(false)}
        buttonText="닫기"
      ></Modal>
    </main>
  );
}

export default App;
