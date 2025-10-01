// @ts-nocheck
import CrewMemberForm from '@/components/crewMember/crewMemberForm'
import AdminRootLayout from '@/components/layouts/AdminRootLayout'
import Header from '@/components/layouts/Header'
import { Button } from '@/components/ui/button'
import { toastPromise } from '@/hooks/use-toast'
import { constant } from '@/lib/constant'
import queries from '@/lib/queries'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const dummyData = {
    firstName: "John",
    lastName: "Doe",
    designation: "admin",      
    email: "admin@email.com",
    phone: "123456789",
}

const EditCrewMemberPage = () => {
  const {id} = useParams();
 
  const navigate = useNavigate();
  const updateCrewMemberMutation = queries.useUpdateCrewMemberMutation();
    const handleEditCrewMember = (data: TCrewMemberForm)=>{
      try {
       toastPromise(updateCrewMemberMutation.mutate({data,id}),{
        loading:"Updating Crew Member...",
        success: (res)=>{
          if(res) navigate(constant.ROUTING_URLS.CREW_MEMBERS);
          return "Crew Member Updated Successfully!"
        },
        error: (e)=> (e instanceof Error) ? e.message : "Failed to Update Crew Member!"
       })  
      } catch (error) {
        if(error instanceof Error){
          toast.error(error.message);
        } else{
          toast.error("Failed to Update Crew Member!");
        }
          
      }
      
    }
  return (
     <AdminRootLayout>
      <div className='px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll'>
            <Link to={constant.ROUTING_URLS.CREW_MEMBERS}>
      <Button variant="outline" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft/> Back</Button>
            </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Crew Member</h2>
              <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">LIMOSPRO</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Edit Crew Member</span></h4>
            </div>
          </div>
        </Header>
        <CrewMemberForm 
        initialData={dummyData}
        onSubmit={handleEditCrewMember}
        type={"Edit Crew Member"} 
        />
      </div>
    </AdminRootLayout>
  )
}

export default EditCrewMemberPage
