import AdminRootLayout from "@/components/layouts/AdminRootLayout";
import Header from "@/components/layouts/Header";
import TestimonialForm from "@/components/testimonail/TestimonialForm";
import { Button } from "@/components/ui/button";
import { constant } from "@/lib/constant";
import type { TTestimonialFormData } from "@/types/testimonial.type";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const mockData: TTestimonialFormData = {
    name: "John Doe",
    message: "lorem Lorem Orem rem",
    photo: null
}
const EditTestimonailPage = () => {
   const handleSubmit = (data:TTestimonialFormData):Promise<void> => new Promise(res=>setTimeout(()=>res(console.log("data:",data)),2000)); 
    
  return (
    <AdminRootLayout>
        <div className='px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll'>
            <Link to={constant.ROUTING_URLS.TESTIMONIALS}>
      <Button variant="secondary" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft/> Back</Button>
            </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Testimonail</h2>
              <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">Testimonail</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Create Testimonail</span></h4>
            </div>
          </div>
        </Header>
      <TestimonialForm initialData={mockData}  onSubmit={handleSubmit} type="Edit Testimonail"  />
      </div>
    </AdminRootLayout>
  )
}

export default EditTestimonailPage
