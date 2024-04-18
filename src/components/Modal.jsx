import ReactDOM from "react-dom";

function Modal({
  isOpen = false,
  title,
  description,
  buttonText = "확인",
  onClose,
}) {
  if (typeof document === "undefined") return;
  const portalDiv = document.querySelector("#modal");

  if (!portalDiv) return null;

  return isOpen ? (
    ReactDOM.createPortal(
      <div>
        <div
          className="fixed left-0 top-0 z-10 size-full bg-[rgba(0,0,0,0.2)]"
          onClick={onClose}
        ></div>
        <div className="z-[100px]  fixed left-1/2 top-1/2 z-[100] flex h-[220px] w-[335px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-[15px] rounded-[15px] bg-white shadow-main">
          <span className="text-zinc-800 text-[22px] font-bold ">{title}</span>
          <p className="text-[#898989] w-[260px]">{description}</p>

          <button
            className={`w-[280px] h-[50px] bg-[#FB8A59] text-white rounded-[30px] font-bold mt-[10px]`}
            onClick={onClose}
          >
            {buttonText}
          </button>
        </div>
      </div>,
      portalDiv
    )
  ) : (
    <></>
  );
}

export default Modal;
