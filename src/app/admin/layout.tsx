import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex bg-muted/20">
            <AdminSidebar />
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
        </div>
    )
}