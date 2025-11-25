# PaginationControls Component - Usage Guide

A production-ready, reusable pagination component for the Admiral Admin Panel.

## Features

✅ **Responsive Design** - Works on all screen sizes  
✅ **TypeScript Support** - Fully typed with interfaces  
✅ **Accessibility** - ARIA labels and keyboard support  
✅ **Smart Ellipsis** - Automatically shows "..." for large page ranges  
✅ **Customizable** - Multiple configuration options  
✅ **shadcn UI Integration** - Uses existing UI components  
✅ **Zero Dependencies** - Built with React + TailwindCSS  

## Installation

The component is already created at:
```
src/components/pagination/PaginationControls.tsx
```

## Basic Usage

```tsx
import { PaginationControls } from "@/components/pagination";

function MyPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <PaginationControls
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | Required | Current active page (1-indexed) |
| `totalPages` | `number` | Required | Total number of pages |
| `onPageChange` | `(page: number) => void` | Required | Callback when page changes |
| `siblingCount` | `number` | `1` | Pages to show on either side of current |
| `className` | `string` | `undefined` | Additional CSS classes |
| `showPrevNext` | `boolean` | `true` | Show previous/next buttons |
| `showFirstLast` | `boolean` | `true` | Show first/last page buttons |
| `disabled` | `boolean` | `false` | Disable all pagination controls |

## Examples

### Basic Pagination
```tsx
<PaginationControls
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

### With Custom Styling
```tsx
<PaginationControls
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  className="mt-8 mb-4"
/>
```

### Minimal Pagination (No First/Last)
```tsx
<PaginationControls
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  showFirstLast={false}
/>
```

### Only Next/Prev Buttons
```tsx
<PaginationControls
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  showFirstLast={false}
  siblingCount={0}
/>
```

### Disabled State
```tsx
<PaginationControls
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  disabled={isLoading}
/>
```

## Refactoring Existing Pages

### Before (Old Pattern)
```tsx
// In ChauffeurPage.tsx - 70+ lines of code
const generatePaginationItems = () => {
  const items = [];
  items.push(
    <PaginationItem key="first">
      <PaginationLink
        isActive={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        1
      </PaginationLink>
    </PaginationItem>,
  );
  // ... 50+ more lines ...
  return items;
};

// In JSX
<Pagination className="justify-end mt-5 cursor-pointer">
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        href="#"
        onClick={() => handlePageChange(currentPage - 1)}
        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
      />
    </PaginationItem>
    {generatePaginationItems()}
    <PaginationItem>
      <PaginationNext
        href="#"
        onClick={() => handlePageChange(currentPage + 1)}
        className={
          currentPage === calculatedTotalPages
            ? "pointer-events-none opacity-50"
            : ""
        }
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

### After (New Pattern)
```tsx
import { PaginationControls } from "@/components/pagination";

// In JSX - Just 1 line!
<PaginationControls
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
```

## Migration Checklist

For each page that uses pagination:

1. **Remove imports** of low-level pagination components:
   ```tsx
   // Remove these:
   import {
     Pagination,
     PaginationContent,
     PaginationEllipsis,
     PaginationItem,
     PaginationLink,
     PaginationNext,
     PaginationPrevious,
   } from "@/components/ui/pagination";
   ```

2. **Add new import**:
   ```tsx
   import { PaginationControls } from "@/components/pagination";
   ```

3. **Remove** the `generatePaginationItems()` function (70+ lines)

4. **Replace** the entire `<Pagination>` JSX block with:
   ```tsx
   <PaginationControls
     currentPage={currentPage}
     totalPages={totalPages}
     onPageChange={handlePageChange}
   />
   ```

5. **Remove** the conditional check if needed:
   ```tsx
   // Remove this:
   {totalPages > 0 && calculatedTotalPages > 1 && (
     // ... old pagination code ...
   )}
   
   // The new component handles this automatically
   ```

## Pages to Refactor

These pages currently use the old pagination pattern:

1. ✅ `src/pages/chauffeur/ChauffeurPage.tsx`
2. ✅ `src/pages/affiliate/AffiliatePage.tsx`
3. ✅ `src/pages/booking/BookingPage.tsx`
4. ✅ `src/pages/fleet/FleetPage.tsx`
5. ✅ `src/pages/crewMember/CrewMemberPage.tsx`
6. ✅ `src/pages/faqs/FaqsPage.tsx`
7. ✅ `src/pages/news/Newspage.tsx`
8. ✅ `src/pages/staffMember/StaffMemberPage.tsx`
9. ✅ `src/pages/testimonial/TestimonialPage.tsx`
10. ✅ `src/pages/users/UsersPage.tsx`
11. ✅ `src/pages/payments/PaymentsPage.tsx`
12. ✅ `src/pages/refund/RefundPage.tsx`
13. ✅ `src/pages/contactRequests/ContactRequestsPage.tsx`
14. ✅ `src/pages/region/RegionDashboardPage.tsx`
15. ✅ `src/pages/regionAdmin/RegionAdminPage.tsx`
16. ✅ `src/pages/trips/TripsPage.tsx`
17. ✅ `src/pages/notifications/NotificationPage.tsx`
18. ✅ `src/pages/contentManagement/BlogPostsPage.tsx`
19. ✅ `src/pages/contentManagement/ContentBlockPage.tsx`
20. ✅ `src/pages/contentManagment/ContentManagementPage.tsx`
21. ✅ `src/pages/contentManagment/SeoPage.tsx`
22. ✅ `src/pages/ipWhiteList/IpWhiteListPage.tsx`
23. ✅ `src/pages/ourPartner/OurPartnerPage.tsx`
24. ✅ `src/pages/refundRequest/RefundRequestPage.tsx`

## Benefits

- **70+ lines of code removed** from each page
- **Consistent UI** across all pages
- **Easier maintenance** - update pagination in one place
- **Better accessibility** - ARIA labels built-in
- **Responsive** - works on mobile, tablet, desktop
- **Type-safe** - full TypeScript support

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Accessibility

- ✅ ARIA labels on all buttons
- ✅ Keyboard navigation support
- ✅ Disabled state properly announced
- ✅ Semantic HTML structure

## Performance

- ✅ Minimal re-renders
- ✅ No unnecessary DOM nodes
- ✅ Smooth scroll to top on page change
- ✅ Optimized for large page counts

## Questions?

Refer to the component source code at:
```
src/components/pagination/PaginationControls.tsx
```

All props are documented with JSDoc comments.
