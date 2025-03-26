import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Navbar = () => {
  return (
    <nav className="w-full border border-gray-500 bg-white text-black relative flex items-center justify-center">
      {/* Centered Navbar Items */}
      <div className="flex w-full">
        <Tabs defaultValue="top-news" className="m-1 w-full">
          <TabsList className="flex w-full justify-between space-x-6 p-3 bg-white">
            <TabsTrigger value="top-news" className="text-black font-semibold">Top News</TabsTrigger>
            <TabsTrigger value="sports" className="text-black font-semibold">Sports</TabsTrigger>
            <TabsTrigger value="finance" className="text-black font-semibold">Finance</TabsTrigger>
            <TabsTrigger value="entertainment" className="text-black font-semibold">Entertainment</TabsTrigger>
            <TabsTrigger value="tech" className="text-black font-semibold">Tech</TabsTrigger>
            <TabsTrigger value="tech" className="text-black font-semibold">Ajay</TabsTrigger>
            <TabsTrigger value="tech" className="text-black font-semibold">Aparna</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </nav>
  );
};

export default Navbar;
