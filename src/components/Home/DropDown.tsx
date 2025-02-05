const DropDown = ({
  setPeriod,
}: {
  setPeriod: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className="absolute top-14 dark:bg-[#1C1917] bg-white rounded-md w-[9.5rem] right-0 shadow-4xl flex flex-col text-start font-normal z-50 text-black dark:text-white text-[20px]">
      <div
        className="p-2 hover:bg-[#cfc8c7] dark:hover:bg-[#292524] rounded-t-md"
        onClick={() => setPeriod(24)}
      >
        24 hours
      </div>
      {/* <div
        className="p-2 hover:bg-[#cfc8c7] dark:hover:bg-[#292524]"
        onClick={() => setPeriod(168)}
      >
        7 days
      </div>
      <div
        className="p-2 hover:bg-[#cfc8c7] dark:hover:bg-[#292524]"
        onClick={() => setPeriod(720)}
      >
        30 days
      </div>
      <div
        className="p-2 hover:bg-[#cfc8c7] dark:hover:bg-[#292524] rounded-b-md"
        onClick={() => setPeriod(470000)}
      >
        All time
      </div> */}
    </div>
  );
};

export default DropDown;
