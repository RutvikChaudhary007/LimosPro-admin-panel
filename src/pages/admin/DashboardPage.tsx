import AdminRootLayout from "@/components/layouts/AdminRootLayout"
import Header from "@/components/layouts/Header";

function DashboardPage() {
  return (
      <AdminRootLayout >
        <Header>
          <h1>Dashboard</h1>
        </Header>
         <main className="flex-1 overflow-y-auto p-4 md:p-6">
        </main>
      </AdminRootLayout>
    
  )
}

export default DashboardPage;
