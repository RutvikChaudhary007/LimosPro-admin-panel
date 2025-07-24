import AdminRootLayout from "@/components/layouts/AdminRootLayout"
import Header from "@/components/layouts/Header";
import Navbar from "@/components/layouts/Navbar";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, Badge, Dot, TrendingDown, TrendingUp } from "lucide-react";

function DashboardPage() {
  return (
    <AdminRootLayout >
      <div className="py-6 px-10 h-full">
        <Header className="p-4 h-[86px]">
          <div className="w-full h-[54px]">
            <div className="w-full h-full flex items-center justify-start gap-5">
              <img className="w-[54px] h-[54px]" src="/header/Group.svg" alt="Group.svg" />
              <div className="w-full h-full">
                <h5 className="font-['Akatab'] font-medium text-xl">Hello,Robert Hayes</h5>
                <h6 className="text-sm text-[#3A3A3A]">Welcome to LIMOSPRO Dashboard</h6>
              </div>
            </div>
          </div>
        </Header>
        <main className="flex-1 h-full overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col gap-2.5">
            <div className="h-4 flex items-center justify-start">
              <Dot />
              <p className="text-xs">In This Week</p>
            </div>
            <div className="h-[126px] w-full grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 w-[250px] h-full rounded-[6px] bg-linear-to-r from-[#FFFFFF] to-[#EBEBEB]">
                  <div className="w-full h-[94px]">
                    <div className="w-full h-6 relative">
                    <div className="absolute right-0 top-0 h-6 w-[57px] bg-[#5E5E5E] rounded-[20px] text-white">
                      <TrendingUp className="w-4 h-4"/>
                      <span className="">5.1%</span>
                    </div>
                    </div>
                    <div className="w-full h-[64px]">
                         
                    </div>
                  </div>
                    {/* <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $1,250.00
          </CardTitle>
          <CardAction >
            <div className="w-[45px] h-4 text-white flex items-center justify-center gap-0.5">
              <TrendingUp className="w-4 h-4"/> */}
              {/* <TrendingDown /> */}
              {/* <span className="text-xs font-semibold">+12.5%</span>
            </div>  
          </CardAction>
        </CardHeader> */}
                    
                </div>
              ))
              }
            </div>
          </div>
        </main>
      </div>
    </AdminRootLayout>

  )
}

export default DashboardPage;
