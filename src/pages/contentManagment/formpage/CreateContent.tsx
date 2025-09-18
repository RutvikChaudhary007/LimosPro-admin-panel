import ContentManagementForm from "@/components/contentManagement/ContentManagementForm";
import AdminRootLayout from "@/components/layouts/AdminRootLayout";
import Header from "@/components/layouts/Header";
import { Button } from "@/components/ui/button";
import { constant } from "@/lib/constant";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";


// ------------------- CreateContent -------------------
const CreateContent: React.FC = () => {
  
  return (
   <AdminRootLayout>
     <div className='px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll'>
            <Link to={constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES}>
      <Button variant="outline" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft/> Back</Button>
            </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Content Management</h2>
              <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">All Pages</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Add Page</span></h4>
            </div>
            {/* <Button className="text-white bg-[#5A5A5A]">Manage Field</Button> */}
          </div>
        </Header>
        <ContentManagementForm 
        onSubmit={()=>{}}
        type="Add Page"
        />
      </div>
   </AdminRootLayout>
  );
};

export default CreateContent;
