import Footer from "@/components/Footer";
import Header from "@/components/header";
import { ContentList } from "@/components/contentList";
import userService from "@/lib/user";

const Page = async () => {
  let user = await userService();

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Header user={user} />

      <div className="flex flex-col w-9/10">
        <h1 className="text-3xl font-bold mb-4">Trending Shows</h1>
      </div>
      <ContentList />
      <Footer />
    </div>
  );
};

export default Page;
