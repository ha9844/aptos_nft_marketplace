import { Dispatch, SetStateAction } from "react";
import { IoClose } from "react-icons/io5";
const ModalBox = ({
  handleClose,
  show,
  children,
}: {
  children: JSX.Element | JSX.Element[];
  show: boolean;
  handleClose: Dispatch<SetStateAction<boolean>>;
}) => {
  const showHideClassName = show ? "block" : "hidden";
  return (
    <div
      className={`bg-black bg-opacity-70 w-full h-full flex justify-center items-center fixed top-0 left-0 z-20 ${showHideClassName}`}
    >
      <section className="dark:bg-[#1C1917] bg-white z-50 rounded-xl px-6  pt-6 pb-8 relative flex flex-col">
        {children}
        <IoClose
          className="absolute top-4 right-4 hover:text-red-75 hover:text-gray-500"
          onClick={() => handleClose(false)}
        />
      </section>
    </div>
  );
};
export default ModalBox;
