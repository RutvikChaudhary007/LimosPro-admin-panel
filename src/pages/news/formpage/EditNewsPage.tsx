import AdminRootLayout from "@/components/layouts/AdminRootLayout";
import Header from "@/components/layouts/Header";
import NewsForm, { type TNewsForm } from "@/components/news/NewsForm";
import type { TNews } from "@/components/table/column";
import { Button } from "@/components/ui/button";
import { constant } from "@/lib/constant";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const mockData: TNews = {
    id: "1",
    news: "You can book online the hourly service for the Houston rodeo on our website. If you are looking for a point-point one-way or round trip for the Houston rodeo, please call us to book by phone because the regular online point-point rates are not valid for Houston rodeo one-way or round trip.",
} 
const EditNewsPage = () => {
   const handleSubmit = (data:TNewsForm):Promise<void> => new Promise(res=>setTimeout(()=>res(console.log("data:",data)),2000)); 
    
  return (
    <AdminRootLayout>
        <div className='px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll'>
            <Link to={constant.ROUTING_URLS.NEWS}>
      <Button variant="secondary" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft/> Back</Button>
            </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">News</h2>
              <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">News</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Edit News</span></h4>
            </div>
          </div>
        </Header>
      <NewsForm initialData={mockData} onSubmit={handleSubmit} type="Edit News"  />
      </div>
    </AdminRootLayout>
  )
}

export default EditNewsPage
