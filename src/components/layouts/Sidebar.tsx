import { useState, useCallback, use } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Icons from '../common/Icons';
import { ChevronDown } from 'lucide-react';

interface DashboardSidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

interface SideCategoryProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  children?: SideCategoryProps[];
}

const SideCategory: React.FC<{ item: SideCategoryProps; activePath: string; child?: boolean }> = ({ item, activePath,child }) => {
  const hasChildren = item.children && item.children.length > 0;
  // Auto expand if current route is active or in one of children routes
  const isActive = activePath === item.to || activePath.startsWith(item.to + '/');
  // Control submenu open state (start open if active)
  const [isOpen, setIsOpen] = useState(isActive);

  const toggleOpen = useCallback(() => {
    setIsOpen((open) => !open);
  }, []);

  return (
    <>
      <div className="flex items-center p-4 gap-2.5 select-none">
        {!hasChildren?(<Link to={item.to} className={cn(`flex items-center gap-5 w-full h-[54px] `, isActive ? 'font-bold' : 'font-medium',child && '1xl:pl-8')}>
          {item.icon}
          <span className="font-['Akatab'] text-black h-[22px]">{item.label}</span>
        </Link>):(
          <>
          {item.icon}
          <button
            onClick={toggleOpen}
            aria-expanded={isOpen}
            aria-label={`${isOpen ? 'Collapse' : 'Expand'} submenu for ${item.label}`}
            className="p-1 focus:outline-none flex items-center gap-2.5"
          >
          <span className={`font-['Akatab'] text-black 1xl:h-[22px]`}>{item.label}</span>
          <ChevronDown className={cn('w-4 h-4 text-black transition-transform duration-600 p-[3px]', isOpen && 'rotate-180')} />
          </button>
          </>
        )}
        
      </div>
      {isOpen && hasChildren && (
        <>
        <hr className="bg-[#F1F1F1] transition-transform duration-600" />
        <div className="text-[#F1F1F1]">
          {item.children!.map((child) => (
            <SideCategory key={child.to} item={child} activePath={activePath} child={true} />
          ))}
        </div>
        </>
      )}
      {!isOpen &&<hr className="bg-[#F1F1F1]" />}
    </>
  );
};

const Sidebar: React.FC<DashboardSidebarProps> = ({ isMobile = false, isOpen = true, onClose }) => {
  const location = useLocation();

  const navigationItems: SideCategoryProps[] = [
    {
      to: '/dashboard',
      icon: <Icons path="/sidebarIcons/home.svg" alt="home icon" />,
      label: 'Dashboard',
    },
    {
      to: '/region_management',
      icon: <Icons path="/sidebarIcons/regional_admin.svg" alt="Regions" />,
      label: 'Region Management',
      children: [
        {
          to: '/region_management/regions',
          icon: <Icons path="/sidebarIcons/Pointer.svg" alt="pointer icon" />,
          label: 'Regions',
        },
        {
          to: '/region_management/admins',
          icon: <Icons path="/sidebarIcons/Pointer.svg" alt="pointer icon" />,
          label: 'Admins',
        },
      ],
    },
    {
      to: '/affiliate',
      icon: <Icons path="/sidebarIcons/Affiliate.svg" alt="affiliate icon" />,
      label: 'Affiliate',
    },
    {
      to: '/chauffeur',
      icon: <Icons path="/sidebarIcons/driver.svg" alt="chauffeur icon" />,
      label: 'Chauffeur',
    },
    {
      to: '/bookings',
      icon: <Icons path="/sidebarIcons/online-booking.svg" alt="Bookings icon" />,
      label: 'Bookings',
    },
    {
      to: '/users',
      icon: <Icons path="/sidebarIcons/user-group.svg" alt="Users icon" />,
      label: 'Users',
    },
    {
      to: '/fleets',
      icon: <Icons path="/sidebarIcons/car.svg" alt="Fleets icon" />,
      label: 'Fleets',
    },
    {
      to: '/trips',
      icon: <Icons path="/sidebarIcons/trip.svg" alt="Trips icon" />,
      label: 'Trips',
    },
    {
      to: '/notifications',
      icon: <Icons path="/sidebarIcons/bell.svg" alt="Notifications icon" />,
      label: 'Notifications',
    },
    {
      to: '/payments',
      icon: <Icons path="/sidebarIcons/payment.svg" alt="Payments icon" />,
      label: 'Payments',
      children: [
        {
          to: '/payments',
          icon: <Icons path="/sidebarIcons/Pointer.svg" alt="pointer icon" />,
          label: 'Payments',
        },
        {
          to: '/payments/refund',
          icon: <Icons path="/sidebarIcons/Pointer.svg" alt="pointer icon" />,
          label: 'Refund',
        },
        {
          to: '/payments/refund_request',
          icon: <Icons path="/sidebarIcons/Pointer.svg" alt="pointer icon" />,
          label: 'Refund Request',
        },
      ],
    },
    {
      to: '/reports',
      icon: <Icons path="/sidebarIcons/Vector.svg" alt="Reports icon" />,
      label: 'Reports',
    },
    {
      to: '/content_management',
      icon: <Icons path="/sidebarIcons/content.svg" alt="Content Management icon" />,
      label: 'Content Management',
      children: [
        {
          to: '/content_management/pages',
          icon: <Icons path="/sidebarIcons/Pointer.svg" alt="pointer icon" />,
          label: 'All Pages',
        },
      ],
    },
    {
      to: '/crew_members',
      icon: <Icons path="/sidebarIcons/group.svg" alt="Crew Members icon" />,
      label: 'Crew Members',
    },
    {
      to: '/staff_members',
      icon: <Icons path="/sidebarIcons/group-chat.svg" alt="Staff Members icon" />,
      label: 'Staff Members',
    },
    {
      to: '/contact_requests',
      icon: <Icons path="/sidebarIcons/question.svg" alt="Contact Requests icon" />,
      label: 'Contact Requests',
    },
    {
      to: '/testimonials',
      icon: <Icons path="/sidebarIcons/feedback.svg" alt="testimonials icon" />,
      label: 'Testimonials',
    },
    {
      to: '/news',
      icon: <Icons path="/sidebarIcons/newspaper-folded.svg" alt="News icon" />,
      label: 'News',
    },
    {
      to: '/faq',
      icon: <Icons path="/sidebarIcons/faq.svg" alt="Faq icon" />,
      label: 'Faq',
    },
    {
      to: '/ip_white_list',
      icon: <Icons path="/sidebarIcons/ip.svg" alt="IP_White_List icon" />,
      label: 'IP White List',
    },
    {
      to: '/our_partners',
      icon: <Icons path="/sidebarIcons/global-partners.svg" alt="our_partners icon" />,
      label: 'Our Partners',
    },
    {
      to: '/settings',
      icon: <Icons path="/sidebarIcons/cog.svg" alt="Settings icon" />,
      label: 'Settings',
    },
  ];

  if (isMobile && !isOpen) return null;

  return (
    <nav aria-label="Sidebar Navigation" className="h-screen overflow-y-auto">
      <div className="flex items-center justify-center w-full h-[88px] shadow-inner shadow-[#E7E7E7]">
        <div className="flex gap-1.5 1xl:w-[170px] 1xl:h-10">
          <img src="/LoginLogo.jpg" alt="logo" className="1xl:w-[42px] 1xl:h-[40px]" />
          <img src="/Frame.jpg" alt="logo" className="1xl:w-[120px] 1xl:h-[40px]" />
        </div>
      </div>
      <div >
        {navigationItems.map((item) => (
          <SideCategory key={item.to} item={item} activePath={location.pathname} />
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
