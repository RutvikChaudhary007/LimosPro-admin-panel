import AdminRootLayout from '@/components/layouts/AdminRootLayout';
import Header from '@/components/layouts/Header';
import SettingForm, { type TSettingForm } from '@/components/settings/SettingForm'
import { Button } from '@/components/ui/button';
import { constant } from '@/lib/constant';
import { ArrowLeft } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

const SettingsPage = () => {
    const handleSubmit = (data:TSettingForm):Promise<void> => new Promise(res=>setTimeout(()=>res(console.log("data:",data)),2000)); 
    
  return (
    <AdminRootLayout>
        <div className='px-10 py-6 h-[calc(100vh-146px)] overflow-y-scroll'>
            <Link to={constant.ROUTING_URLS.OUR_PARTNERS}>
      <Button variant="secondary" className='py-3 px-1.5 rounded bg-[#D9D9D9] w-[80px] h-[31px] flex items-center justify-center cursor-pointer text-[#5A5A5A]'><ArrowLeft/> Back</Button>
            </Link>
      <Header className="p-4 h-[79px] bg-[#FDFDFD] shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-4 mb-5">
          <div className="w-full h-full flex items-center justify-between">
            <div>
              <h2 className="font-medium text-xl text-black">Settings</h2>
              <h4> <span className="text-[#959595] w-[116px] h-4 text-xs">Our Partners</span> <span className="text-xs text-[#3A3A3A] w-[50px] h-4">/ Settings</span></h4>
            </div>
          </div>
        </Header>
      <SettingForm onSubmit={handleSubmit}  />
      </div>
    </AdminRootLayout>
  )
  
}

export default SettingsPage
