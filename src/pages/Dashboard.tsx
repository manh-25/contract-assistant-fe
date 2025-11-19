import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSearch, FolderOpen, PenTool, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Language } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/translations";

interface DashboardProps {
  language: Language;
}

export const Dashboard = ({ language }: DashboardProps) => {
  const t = useTranslation(language);

  const stats = [
    { label: t.totalContracts, value: "12", icon: FileText, color: "text-accent" },
    { label: t.reviewsCompleted, value: "8", icon: FileSearch, color: "text-success" },
    { label: t.contractsCreated, value: "4", icon: PenTool, color: "text-warning" },
  ];

  const recentContracts = [
    {
      name: language === "vi" ? "Hợp đồng thuê nhà" : "House Rental Agreement",
      date: "2024-03-15",
      status: "safe",
    },
    {
      name: language === "vi" ? "Hợp đồng lao động" : "Employment Contract",
      date: "2024-03-10",
      status: "caution",
    },
    {
      name: language === "vi" ? "Hợp đồng mua bán" : "Sales Agreement",
      date: "2024-03-05",
      status: "safe",
    },
  ];

  const quickActions = [
    { label: t.quickReview, icon: FileText, to: "/quick-review", color: "bg-accent" },
    { label: t.deepAnalysis, icon: FileSearch, to: "/deep-analysis", color: "bg-primary" },
    { label: t.createContract, icon: PenTool, to: "/create", color: "bg-success" },
    { label: t.templates, icon: FolderOpen, to: "/templates", color: "bg-warning" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {t.welcomeBack}
            </h1>
            <p className="text-muted-foreground text-lg">
              {language === "vi"
                ? "Quản lý và theo dõi hợp đồng của bạn"
                : "Manage and track your contracts"}
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="p-6 bg-card/80 backdrop-blur border-border/50 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                      <p className="text-4xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className={`p-4 rounded-full bg-primary/10`}>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">{t.quickActions}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.to} to={action.to}>
                    <Card className="p-6 bg-card/80 backdrop-blur border-border/50 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group">
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className={`p-4 rounded-full ${action.color} group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-semibold text-foreground">{action.label}</p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Contracts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">{t.recentContracts}</h2>
              <Button variant="outline" size="sm">
                {t.viewAll}
              </Button>
            </div>
            <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
              {recentContracts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t.noContracts}</p>
              ) : (
                <div className="space-y-4">
                  {recentContracts.map((contract, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{contract.name}</p>
                          <p className="text-sm text-muted-foreground">{contract.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            contract.status === "safe"
                              ? "bg-success/20 text-success"
                              : contract.status === "caution"
                              ? "bg-warning/20 text-warning"
                              : "bg-danger/20 text-danger"
                          }`}
                        >
                          {t[contract.status as keyof typeof t]}
                        </span>
                        <Button variant="ghost" size="sm">
                          {t.viewTemplate}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
