// @ts-nocheck
import { useEffect, useState, } from 'react';
import Sidebar from './Sidebar';
import useLoading from '@/stores/useLoading';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from "react-router-dom";

// interface AdminLayoutProps {
//     children: ReactNode;
// }

const AdminRootLayout: React.FC<AdminLayoutProps> = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // const getPageTitle = () => {
    //     const path = location.pathname;
    //     if (path === "/dashboard") return "Dashboard";
    //     if (path.startsWith("/campaigns")) return "Campaigns";

    //     return "Dashboard";
    // };
    const { isLoading } = useLoading();
    useEffect(() => {
        if (isLoading) {
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = "15px";
        } else {
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "0px";
        }
    }, [isLoading]);
    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 z-[9999999] opacity-[0.8] h-screen  bg-[#36454F]  flex items-center justify-center ">
                    <span className="loader "></span>
                </div>
            )}
            <div className="flex min-w-screen min-h-screen">
                {/* Sidebar for desktop */}
                <div className="hidden md:w-[300px] md:block bg-[#FAFAFA] flex-col gap-6 fixed top-0 left-0 bottom-0">
                    <Sidebar />
                </div>

                {/* Mobile sidebar */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 ">
                        <div
                            className="fixed inset-0 bg-black/20"
                            aria-hidden="true"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <Sidebar
                            isMobile
                            isOpen={sidebarOpen}
                            onClose={() => setSidebarOpen(false)}
                        />
                    </div>
                )}

                {/* Main content */}
                <div className="flex flex-col overflow-hidden md:w-[calc(100vw-300px)] md:translate-x-[300px]">
                    <Navbar />
                    <hr className="w-full bg-[#E7E7E7]" />

                    <Outlet/>
                    {/* Footer */}
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default AdminRootLayout;
