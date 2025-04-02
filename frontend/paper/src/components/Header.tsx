import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex items-center justify-between py-4 pl-4 bg-white text-black border border-gray-500 relative">
      {/* Left: Logo with Font Awesome Newspaper Icon */}
      <div className="flex items-center space-x-4">
        <div className="m-5 w-14 h-14 border border-black rounded-full flex items-center justify-center text-xl">
          <FontAwesomeIcon icon={faNewspaper} />
        </div>
      </div>

      {/* Center: Title & Subtitle (Wrapper for Centering) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-7xl font-title ">Media Mosaic</h1>
        {/* <p className="text-lg text-gray-600 mt-1">always the truth • forever the truth</p> */}
      </div>

      {/* Right: Login/Signup */}
      <div className="flex flex-row px-4 py-2 space-x-4 border-l-2 border-gray-500/80">
        <Button variant="outline" className="border-black text-black">LOGIN</Button>
        <Button variant="outline" className="border-black text-black">SIGNUP</Button>
      </div>
    </header>
  );
};

export default Header;
