import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminRoute from "../../components/admin/AdminRoute";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
      <section className="flex">
        <AdminRoute>
        <aside className="w-30 bg-surface p-2">
          <AdminSidebar />
        </aside>
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
        </AdminRoute>
    </section>
  )
};

export default AdminLayout;