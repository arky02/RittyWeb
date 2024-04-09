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
  const [responses, setResponses] = useState([]);

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
  }

  return (
    <main
      className="w-[395px] h-[100vh] flex flex-col md:justify-center  md:-mt-[20px] mt-[10px] p-[25px] relative overflow-x-hidden"
      style={{
        backgroundColor: isOpen ? "#FFFFFF" : "#FFFEFA",
      }}
    >
      <div className="flex flex-col items-center gap-[15px]">
        <h2
          className="text-[22px] "
          style={{
            textAlign: isOpen ? "left" : "center",
            marginBottom: isOpen ? "0" : "70px",
            marginLeft: isOpen ? "-180px" : 0,
          }}
        >
          현재 <span className="font-semibold">12,903명</span>이 <p></p>
          <span>야옹이 입양중</span>
        </h2>
        <section className="w-full">
          <div className="flex flex-row justify-between w-full z-10 relative mb-[10px]">
            <input
              className="bg-[#ffffff] border-[#f2f2f2] shadow border-[1px] p-3 rounded-[10px] w-[250px]"
              placeholder="Email"
            />

            <motion.div whileTap={{ scale: 0.9 }}>
              <button className="bg-[#8242D4] rounded-[10px] text-[#ffffff] p-[14px] font-semibold">
                입양하기
              </button>
            </motion.div>
          </div>
        </section>
        <motion.div whileTap={{ scale: isOpen ? 0.9 : 1 }}>
          <img
            src={Cat}
            width={209}
            height={218}
            className="relative z-10"
          ></img>
          {isOpen || (
            <img
              src={Grad}
              width={400}
              height={420}
              className="absolute top-[170px] left-0 flex "
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
                    <div className="inline-block max-w-[300px] text-sm relative mx-0 my-[5px] bg-[#ffffff] float-left clear-both text-[#8f00fe] px-[15px] py-[7px] rounded-[14px_14px_14px_0]">
                      {msgEl === "cat: loading" ? (
                        <div class="flex space-x-1 justify-center items-center bg-white p-[5px] ">
                          <div class="h-[5px] w-[5px] bg-[#a8a8a8] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div class="h-[5px] w-[5px] bg-[#a8a8a8] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div class="h-[5px] w-[5px] bg-[#a8a8a8] rounded-full animate-bounce"></div>
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
                className="flex relative justify-between items-center w-full h-20 p-[6px]  "
              >
                <textarea
                  className="w-full h-[50px] resize-none rounded-[30px] py-[10px] pl-[22px] pr-[32px] border-[#E8E8E8] border-[1px]"
                  placeholder="메시지를 입력하세요..."
                  value={text}
                  text={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    sendMyTextByEnter(e);
                  }}
                ></textarea>
                <button
                  id="send"
                  className="absolute right-4 bg-transparent cursor-pointer border-[none]"
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
