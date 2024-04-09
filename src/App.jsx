import { useEffect, useState } from "react";
import "./App.css";
import Send from "./img/send.svg";
import Cat from "./img/cat.png";

function App() {
  const [myMsg, setMyMsg] = useState([]);
  const [text, setText] = useState("");

  function sendMyText() {
    const newMessage = text;
    if (newMessage) {
      setMyMsg((prev) => [...prev, text]);
      setText("");
    } else {
      alert("메시지를 입력하세요...");
    }
  }

  function sendMyTextByEnter(e) {
    if (e.target.value.includes("\n")) {
      setMyMsg((prev) => [...prev, text]);
      setText("");
    }
  }

  return (
    <main className="flex flex-col items-center gap-[30px] ">
      <h2 className="text-[24px]">
        현재 <span className="font-semibold">12,903명</span>이 야옹이 입양중
      </h2>
      <section className="w-full">
        <div className="flex flex-row justify-between w-full">
          <input
            className="bg-[#f1f1f1] border-[#f2f2f2] border-[1px] p-3 rounded-[10px] w-[260px]"
            placeholder="Email"
          />
          <button className="bg-[#8242D4] rounded-[10px] text-[#ffffff] p-[14px] font-semibold">
            입양하기
          </button>
        </div>
      </section>
      <img src={Cat} width={209} height={218}></img>
      <section className="flex flex-col h-[370px] bg-[#f1f1f1] w-[360px] rounded-[20px]">
        <div className="h-[350px] w-full overflow-y-auto px-2.5 py-3 ">
          <div className="inline-block max-w-[300px] text-sm relative mx-0 my-[5px] bg-[#ffffff] float-left clear-both text-[#8f00fe] px-[15px] py-[7px] rounded-[14px_14px_14px_0]">
            안녕! 나는 삼냥이야
          </div>

          {myMsg.length > 0 &&
            myMsg.map((msgEl, idx) => (
              <div
                key={idx}
                className="inline-block max-w-[300px] text-sm relative mx-0 my-[5px] bg-[#8f00fe] float-right clear-both text-white px-[15px] py-[7px] rounded-[14px_14px_0_14px]"
              >
                {msgEl}
              </div>
            ))}
        </div>

        <div className="flex relative justify-between items-center w-full h-20 p-[12px]  ">
          <textarea
            className="w-full h-12 resize-none rounded-[30px] px-[20px] py-[10px]"
            placeholder="메시지를 입력하세요..."
            autoFocus
            value={text}
            text={text}
            onChange={(e) => {
              setText(e.target.value);
              sendMyTextByEnter(e);
            }}
          ></textarea>
          <button
            id="send"
            className="absolute right-5 bg-transparent cursor-pointer border-[none]"
            onClick={sendMyText}
          >
            <img src={Send} width="34" height="34" />
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
