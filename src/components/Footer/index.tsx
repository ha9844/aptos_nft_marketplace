import Link from "next/link";
const Footer = () => {
  return (
    <footer className="dark:bg-[#121212] bg-white px-4 sm:px-8 py-8 text-gray-800 dark:text-gray-200 flex flex-col items-center gap-3">
      <div className="flex gap-4 text-sm">
        <div className="cursor-pointer">Terms of Service</div>
        <Link href="/privacy-policy" className="cursor-pointer">
          Privacy Policy
        </Link>
        <div className="cursor-pointer">Feedback</div>
      </div>
      <div className="text-sm">Copyright &copy; 2023 All rights reserved.</div>
    </footer>
  );
};

export default Footer;
