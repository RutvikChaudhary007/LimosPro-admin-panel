// @ts-nocheck

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Icons from '../common/Icons';
import { ChevronDown } from 'lucide-react';
import { constant } from '@/lib/constant';
import { hasAccess, hasDynamicAccess } from '@/utils/Helper';

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

  const toggleOpen = () => {
    setIsOpen((open) => !open);
  };

  return (
    <>
      <div className="flex items-center p-4 gap-2.5 select-none h-[46px]">
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
            className="p-1 focus:outline-none flex items-center gap-2.5 cursor-pointer"
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
      {isActive && <hr className="bg-[#F1F1F1]" />}
      {!isOpen && <hr className="bg-[#F1F1F1]" />}
    </>
  );
};

const Sidebar: React.FC<DashboardSidebarProps> = ({ isMobile = false, isOpen = true, onClose }) => {
  const location = useLocation();

  const navigationItems: SideCategoryProps[] = [
    {
      to: constant.ROUTING_URLS.DASHBOARD,
      icon: <Icons path="/sidebarIcons/home.svg" alt="home icon" />,
      label: 'Dashboard',
    },
    {
      to: '#',
      icon: <Icons path="/sidebarIcons/regional_admin.svg" alt="Regions" />,
      label: 'Region Management',
      children: [
        {
          to: constant.ROUTING_URLS.REGION,
          icon: <Icons path="/sidebarIcons/Pointer.svg" alt="pointer icon" />,
          label: 'Regions',
        },
        {
          to: constant.ROUTING_URLS.REGION_ADMIN,
          icon: <Icons path="/sidebarIcons/Pointer.svg" alt="pointer icon" />,
          label: 'Admins',
        },
      ],
    },
    {
      to: constant.ROUTING_URLS.AFFILIATE,
      icon: <Icons path="/sidebarIcons/Affiliate.svg" alt="affiliate icon" />,
      label: 'Affiliate',
    },
    {
      to: constant.ROUTING_URLS.CHAUFFEUR,
      icon: <Icons path="/sidebarIcons/driver.svg" alt="chauffeur icon" />,
      label: 'Chauffeur',
    },
    {
      to: constant.ROUTING_URLS.BOOKING,
      icon: <Icons path="/sidebarIcons/online-booking.svg" alt="Bookings icon" />,
      label: 'Bookings',
    },
    {
      to: constant.ROUTING_URLS.USERS,
      icon: <Icons path="/sidebarIcons/user-group.svg" alt="Users icon" />,
      label: 'Users',
    },
    {
      to: constant.ROUTING_URLS.FLEETS,
      icon: <Icons path="/sidebarIcons/car.svg" alt="Fleets icon" />,
      label: 'Fleets',
    },
    {
      to: constant.ROUTING_URLS.TRIPS,
      icon: <Icons path="/sidebarIcons/trip.svg" alt="Trips icon" />,
      label: 'Trips',
    },
    {
      to: constant.ROUTING_URLS.NOTIFICATION,
      icon: <Icons path="/sidebarIcons/bell.svg" alt="Notifications icon" />,
      label: 'Notifications',
    },
    {
      to: constant.ROUTING_URLS.PAYMENTS,
      icon: <Icons path="/sidebarIcons/payment.svg" alt="Payments icon" />,
      label: 'Payments',
      children: [
        {
          to: constant.ROUTING_URLS.PAYMENTS,
          icon: <Icons path="/sidebarIcons/Pointer.svg" alt="pointer icon" />,
          label: 'Payments',
        },
        {
          to: constant.ROUTING_URLS.REFUND,
          icon: <Icons path="/sidebarIcons/Pointer.svg" alt="pointer icon" />,
          label: 'Refund',
        },
        {
          to: constant.ROUTING_URLS.REFUND_REQUEST,
          icon: <Icons path="/sidebarIcons/Pointer.svg" alt="pointer icon" />,
          label: 'Refund Request',
        },
      ],
    },
    {
      to: constant.ROUTING_URLS.REPORTS,
      icon: <Icons path="/sidebarIcons/Vector.svg" alt="Reports icon" />,
      label: 'Reports',
    },
    {
      to: '',
      icon: <Icons path="/sidebarIcons/content.svg" alt="Content Management icon" />,
      label: 'Content Management',
      children: [
        {
          to: constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES,
          icon: <Icons path="/sidebarIcons/Pointer.svg" alt="pointer icon" />,
          label: 'All Pages',
        },
        {
          to: constant.ROUTING_URLS.SEO,
          icon: <Icons path="/sidebarIcons/Pointer.svg" alt="pointer icon" />,
          label: 'Seo',
        },
      ],
    },
    {
      to: constant.ROUTING_URLS.CREW_MEMBERS,
      icon: <Icons path="/sidebarIcons/group.svg" alt="Crew Members icon" />,
      label: 'Crew Members',
    },
    {
      to: constant.ROUTING_URLS.STAFF_MEMBERS,
      icon: <Icons path="/sidebarIcons/group-chat.svg" alt="Staff Members icon" />,
      label: 'Staff Members',
    },
    {
      to: constant.ROUTING_URLS.CONTACT_REQUESTS,
      icon: <Icons path="/sidebarIcons/question.svg" alt="Contact Requests icon" />,
      label: 'Contact Requests',
    },
    {
      to: constant.ROUTING_URLS.TESTIMONIALS,
      icon: <Icons path="/sidebarIcons/feedback.svg" alt="testimonials icon" />,
      label: 'Testimonials',
    },
    {
      to: constant.ROUTING_URLS.NEWS,
      icon: <Icons path="/sidebarIcons/newspaper-folded.svg" alt="News icon" />,
      label: 'News',
    },
    {
      to: constant.ROUTING_URLS.FAQ,
      icon: <Icons path="/sidebarIcons/faq.svg" alt="Faq icon" />,
      label: 'Faq',
    },
    {
      to: constant.ROUTING_URLS.IP_WHITE_LIST,
      icon: <Icons path="/sidebarIcons/ip.svg" alt="IP_White_List icon" />,
      label: 'IP White List',
    },
    {
      to: constant.ROUTING_URLS.OUR_PARTNERS,
      icon: <Icons path="/sidebarIcons/global-partners.svg" alt="our_partners icon" />,
      label: 'Our Partners',
    },
    {
      to: constant.ROUTING_URLS.SETTINGS,
      icon: <Icons path="/sidebarIcons/cog.svg" alt="Settings icon" />,
      label: 'Settings',
    },
  ];

  // Get user data from localStorage
  const storedRole = localStorage.getItem("role");
  const storedPermissions = localStorage.getItem("permissions");
  
  // Parse permissions from localStorage (they should be stored as JSON array)
  let userPermissions: string[] = [];
  try {
    userPermissions = storedPermissions ? JSON.parse(storedPermissions) : [];
  } catch (error) {
    console.warn("Failed to parse permissions from localStorage:", error);
    userPermissions = [];
  }

  const userRole = storedRole;

  // Filter nav items using dynamic access (permissions first, then role fallback)
  const filteredNavigation = navigationItems
    .map((item) => {
      // if item has children → filter children
      if (item.children) {
        const allowedChildren = item.children.filter((child) =>
          hasDynamicAccess(child.to, userRole, userPermissions)
        );
        // Only keep parent if parent has a route OR children are allowed
        if (hasDynamicAccess(item.to, userRole, userPermissions) || allowedChildren.length > 0) {
          return { ...item, children: allowedChildren };
        }
        return null;
      }

      // if no children → just check the parent
      return hasDynamicAccess(item.to, userRole, userPermissions) ? item : null;
    })
    .filter(Boolean); // remove nulls  
  if (isMobile && !isOpen) return null;

  return (
    <nav aria-label="Sidebar Navigation" className="h-screen overflow-y-auto ">
      <div className="flex items-center justify-center w-full h-[88px] shadow-inner shadow-[#E7E7E7]">
        <div className="flex gap-1.5 w-[170px] h-10">
          <img src="/LoginLogo.jpg" alt="logo" className="w-[42px] 1xl:h-[40px]" />
          <img src="/Frame.jpg" alt="logo" className="w-[120px] 1xl:h-[40px]" />
        </div>
      </div>
      <div >
        {/* {navigationItems.map((item) =>  (
          <SideCategory key={item.to} item={item} activePath={location.pathname} />
        ))} */}
        {filteredNavigation.map((item) => (
        <SideCategory
          key={item.to}
          item={item}
          activePath={location.pathname}
        />
      ))}
      </div>
    </nav>
  );
};

export default Sidebar;
