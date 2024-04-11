import { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";
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
  const [count, setCount] = useState(0);

  function sendMyText() {
    const newMessage = text;
    if (newMessage) {
      setMsgList((prev) => [...prev, "me:" + text]);
      sendMsgToServer(text);
      setText("");
    } else {
      alert("메시지를 입력하세요...");
    }
  }

  function sendMyTextByEnter(e) {
    if (e.target.value.includes("\n")) {
      setMsgList((prev) => [...prev, "me:" + text]);
      sendMsgToServer(text);
      setText("");
    }
  }

  async function sendMsgToServer(text) {
    setMsgList((prev) => [...prev, "cat: loading"]);
    const response = await axios.get(
      `https://sam-meows.com/api/meow?request=${text}`
    );
    // console.log(response.data.message);

    setMsgList((prev) => [
      ...prev.filter((el) => el !== "cat: loading"),
      response.data.message,
    ]);

    if (response.status === 200) setCount((prev) => (prev += 1));
    if (count >= 10) setIsModalOpen(true);
  }

  return (
    <main
      className="sm:w-[395px] w-[100vw] h-[100vh] flex flex-col md:justify-center  md:-mt-[20px] mt-[10px] p-[25px] relative overflow-x-hidden overflow-y-hidden"
      style={{
        backgroundColor: isOpen ? "#FFFFFF" : "#FFFEFA",
      }}
    >
      <div className="flex flex-col items-center gap-[9px]">
        <div
          className="text-[22px] flex flex-col"
          style={{
            textAlign: isOpen ? "left" : "center",
            marginBottom: isOpen ? "7px" : "20px",
            marginLeft: isOpen ? "-180px" : 0,
          }}
        >
          <span>
            내 손 안의 작은 <br />
            반려 고양이, <span className="font-semibold">리티</span>
          </span>
          <span className="text-[#8242D4] z-10 relative text-[18px] mt-3">
            12,300명이 리티 입양중
          </span>
        </div>

        <section className="w-full">
          <div className="flex flex-row justify-between w-full z-10 relative mb-[10px]">
            <div className="flex flex-col gap-1">
              <input
                className="bg-[#ffffff] border-[#f2f2f2] shadow border-[1px] p-3 rounded-[10px] w-[250px] h-[50px]"
                placeholder="Email"
              />
              <span className="text-[13px] text-[#666666] ml-1 mb-1">
                * 이메일을 입력하고 앱 출시 소식을 받아보세요!
              </span>
            </div>

            <motion.div whileTap={{ scale: 0.9 }}>
              <button className="bg-[#8242D4] rounded-[10px] text-[#ffffff] p-[13px] font-semibold ">
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
              className="absolute top-[120px] left-0 flex sm:w-400 h-600 w-full sm:h-420 overflow-hidden"
            ></img>
          )}
        </motion.div>
        <motion.div layout style={{ height: isOpen ? "330px" : "0px" }}>
          <section className="flex flex-col h-full bg-[#f1f1f1] w-[345px] rounded-[20px]">
            <div className="h-[330px] w-full overflow-y-auto px-2.5 py-3 ">
              {isOpen && (
                <div className="inline-block max-w-[300px] text-sm relative mx-0 my-[5px] bg-[#ffffff] float-left clear-both text-[#8f00fe] px-[15px] py-[7px] rounded-[14px_14px_14px_0]">
                  안녕! 나는 삼냥이야
                </div>
              )}

              {msgList.length > 0 &&
                msgList.map((msgEl, idx) =>
                  msgEl.split(":")[0] === "me" ? (
                    <div
                      key={idx}
                      className="inline-block max-w-[300px] text-sm relative mx-0 my-[5px] bg-[#8f00fe] float-right clear-both text-white px-[15px] py-[7px] rounded-[14px_14px_0_14px]"
                    >
                      {msgEl.split(":")[1]}
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className="inline-block max-w-[300px] text-sm relative mx-0 my-[5px] bg-[#ffffff] float-left clear-both text-[#8f00fe] px-[15px] py-[7px] rounded-[14px_14px_14px_0]"
                    >
                      {msgEl === "cat: loading" ? (
                        <div className="flex space-x-1 justify-center items-center bg-white p-[5px] ">
                          <div className="h-[5px] w-[5px] bg-[#a8a8a8] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="h-[5px] w-[5px] bg-[#a8a8a8] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="h-[5px] w-[5px] bg-[#a8a8a8] rounded-full animate-bounce"></div>
                        </div>
                      ) : (
                        msgEl.split(":")[1]
                      )}
                    </div>
                  )
                )}
            </div>

            <motion.div whileTap={{ scale: 0.97 }}>
              <div
                onClick={() => setIsOpen(true)}
                className="flex relative justify-between items-center w-full h-20 p-[4px]  "
              >
                <textarea
                  className="w-full h-[50px] resize-none rounded-[30px] py-[10px] pl-[22px] pr-[32px] border-[#E8E8E8] border-[1px]"
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
    </main>
  );
}

export default App;
