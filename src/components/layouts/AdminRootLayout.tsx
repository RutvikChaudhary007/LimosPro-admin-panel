
import { useEffect, useState, type ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import useLoading from '@/stores/useLoading';
import Navbar from './Navbar';
import Footer from './Footer';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminRootLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === "/dashboard") return "Dashboard";
        if (path.startsWith("/campaigns")) return "Campaigns";

        return "Dashboard";
    };
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
            <div className="flex min-h-screen">
                {/* Sidebar for desktop */}
                <div className="1xl:min-w-[300px] hidden md:block bg-[#FAFAFA] flex-col gap-6">
                    <Sidebar />
                </div>

                {/* Mobile sidebar */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 md:hidden">
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
                <div className="flex flex-col flex-1 overflow-hidden">
                    <Navbar />
                    <hr className="w-full bg-[#E7E7E7]" />

                    {children}
                    
                    {/* Footer */}
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default AdminRootLayout;
