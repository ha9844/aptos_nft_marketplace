const DropDown = ({
  setType,
}: {
  setType: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="absolute top-6 dark:bg-[#1C1917] bg-white rounded-md w-[9.5rem] left-0 shadow-4xl flex flex-col text-start font-normal z-50 text-black dark:text-white">
      <div
        className="p-2 hover:bg-[#cfc8c7] dark:hover:bg-[#292524] rounded-t-md"
        onClick={() => setType("Sales")}
      >
        Sales
      </div>
      <div
        className="p-2 hover:bg-[#cfc8c7] dark:hover:bg-[#292524]"
        onClick={() => setType("Listing")}
      >
        Listings
      </div>
    </div>
  );
};

export default DropDown;
