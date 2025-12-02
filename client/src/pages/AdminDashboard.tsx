import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Database, FileText, Activity } from "lucide-react";

export default function AdminDashboard() {
  // Mock data for statistics
  const stats = [
    { title: "Total Users", value: "1,248", icon: <Users className="h-6 w-6" />, change: "+12%" },
    { title: "Content Items", value: "342", icon: <FileText className="h-6 w-6" />, change: "+5%" },
    { title: "Data Storage", value: "2.4 GB", icon: <Database className="h-6 w-6" />, change: "+3%" },
    { title: "Active Sessions", value: "142", icon: <Activity className="h-6 w-6" />, change: "+8%" },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 font-medium">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New content added", time: "2 minutes ago", user: "Admin" },
                { action: "User registered", time: "1 hour ago", user: "Farmer123" },
                { action: "Data backup completed", time: "3 hours ago", user: "System" },
                { action: "Content updated", time: "5 hours ago", user: "Editor" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <div className="mt-1 w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { service: "Database", status: "Operational", uptime: "99.9%" },
                { service: "API Server", status: "Operational", uptime: "99.8%" },
                { service: "File Storage", status: "Degraded", uptime: "95.2%" },
                { service: "Authentication", status: "Operational", uptime: "100%" },
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{service.service}</p>
                    <p className="text-xs text-muted-foreground">{service.uptime} uptime</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    service.status === "Operational" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}