import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Sparkles, Zap, Clock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { ROLES, ROLE_LABELS, type Role } from "@/constants/roles";
import soraLogo from "@/Assets/Sora.png";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@soracabs.com");
  const [password, setPassword] = useState("demo1234");
  const [role, setRole] = useState<Role>("super_admin");

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="grid min-h-screen w-full bg-[#f7f5f2] lg:grid-cols-2 overflow-hidden">
      {/* Left panel - Sora Brand Showcase */}
      <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between bg-[#0c0a09] p-12 text-white">
        
        {/* Animated glowing auras */}
        <div className="absolute top-[-15%] left-[-15%] h-[60%] w-[60%] rounded-full bg-orange-600/10 blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-15%] right-[-15%] h-[60%] w-[60%] rounded-full bg-amber-600/10 blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: '10s' }} />
        
        {/* Dynamic mesh lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] opacity-25 pointer-events-none" />

        {/* Brand Header */}
        <div className="relative flex items-center gap-3.5 z-10">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-0.5 backdrop-blur-xl shadow-2xl shadow-orange-500/10">
            <img src={soraLogo} alt="Sora Cabs" className="h-full w-full object-cover rounded-xl" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white leading-none">Sora Cabs</span>
            <span className="text-[10px] uppercase tracking-widest text-orange-500 font-bold mt-1">Enterprise Platform</span>
          </div>
        </div>

        {/* Content Showcase */}
        <div className="relative max-w-lg space-y-6 z-10 my-auto">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 border border-orange-500/15">
              <Sparkles className="h-3 w-3" />
              <span>Sora Brand Identity Upgrade v2.5</span>
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400">
              Run your entire mobility business from one platform.
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              Rides, dispatch, drivers, vehicle fleets, rentals, payments, HR, and advanced intelligence — a signature premium ERP engineered for modern high-performance mobility operators.
            </p>
          </div>

          <div className="grid gap-3.5 pt-4">
            {[
              { 
                icon: ShieldCheck, 
                title: "Granular Role Security", 
                desc: "15 enterprise-grade pre-configured roles ensuring safe, isolated, and audited workflows." 
              },
              { 
                icon: Clock, 
                title: "Real-time Operations", 
                desc: "Live route optimization, instant driver telemetry, and automated vehicle dispatch logs." 
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group flex gap-4 rounded-2xl border border-white/[0.05] bg-white/[0.01] p-4 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/20 hover:bg-white/[0.03]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-orange-400 transition-colors group-hover:text-amber-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-wide">{title}</h4>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed font-light">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative flex items-center justify-between text-xs text-zinc-500 z-10 border-t border-white/[0.06] pt-6">
          <span>© {new Date().getFullYear()} Sora Cabs. All rights reserved.</span>
          <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
            <ShieldAlert className="h-3.5 w-3.5" />
            Operator Portal
          </span>
        </div>
      </div>

      {/* Right panel - Dynamic Modern Form */}
      <div className="flex items-center justify-center p-6 md:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8 bg-white p-8 md:p-10 rounded-3xl border border-[#eedcc8]/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
          {/* Logo header for mobile screens */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
              <img src={soraLogo} alt="Sora Cabs" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-gray-900 leading-none">Sora Cabs</span>
              <span className="text-[9px] uppercase tracking-widest text-orange-600 font-bold mt-1">Enterprise Platform</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Please choose a role below to automatically fill the demo environment credentials and enter the dashboard.
            </p>
          </div>

          {/* Quick-select Roles Matrix */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Demo Quick Access</Label>
              <span className="text-[10px] text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">1-Click Setup</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Super Admin", role: "super_admin", email: "admin@soracabs.com", badge: "HQ" },
                { label: "Fleet Owner", role: "fleet_owner", email: "fleet.owner@soracabs.com", badge: "Owner" },
                { label: "Operations Manager", role: "operations_manager", email: "ops.manager@soracabs.com", badge: "Ops" },
                { label: "Driver Partner", role: "driver", email: "driver.partner@soracabs.com", badge: "Active" },
              ].map((item) => {
                const active = role === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => {
                      setRole(item.role as Role);
                      setEmail(item.email);
                    }}
                    className={cn(
                      "group flex flex-col justify-between p-3 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden",
                      active
                        ? "bg-orange-50/70 border-orange-200 shadow-sm shadow-orange-500/5 ring-1 ring-orange-200"
                        : "bg-white border-gray-150 hover:bg-gray-50/80 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={cn(
                        "text-xs font-semibold truncate transition-colors",
                        active ? "text-orange-950" : "text-gray-800 group-hover:text-gray-900"
                      )}>
                        {item.label}
                      </span>
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded-md font-semibold",
                        active ? "bg-orange-200/50 text-orange-900" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                      )}>
                        {item.badge}
                      </span>
                    </div>
                    <span className={cn(
                      "text-[10px] mt-1.5 truncate font-light transition-colors",
                      active ? "text-orange-700/80" : "text-gray-400"
                    )}>
                      {item.email}
                    </span>
                    {active && (
                      <div className="absolute right-0 bottom-0 w-8 h-8 bg-orange-100/40 rounded-tl-full flex items-end justify-end p-0.5 pointer-events-none">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mr-1.5 mb-1.5 animate-pulse" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            
            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-150"></div>
              <span className="flex-shrink mx-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or Custom Sign In</span>
              <div className="flex-grow border-t border-gray-150"></div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-gray-700">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="bg-gray-50/50 border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500 rounded-xl"
                placeholder="operator@soracabs.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-gray-700">Password</Label>
                <span className="text-[10px] text-orange-600 font-medium hover:underline cursor-pointer">Security Sandbox</span>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="bg-gray-50/50 border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Enterprise Role Assigned</Label>
              <Select value={role} onValueChange={(v) => {
                const r = v as Role;
                setRole(r);
                // Make email friendly
                const baseEmail = r.toLowerCase().replace(/_/g, ".");
                setEmail(`${baseEmail}@soracabs.com`);
              }}>
                <SelectTrigger className="bg-gray-50/50 border-gray-200 focus:ring-orange-500 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60 rounded-xl">
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r} className="rounded-lg my-0.5">
                      {ROLE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-[0_6px_20px_rgba(255,106,0,0.25)] hover:shadow-[0_8px_25px_rgba(255,106,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign in with Operator Portal
            </Button>
          </form>

          <p className="text-center text-[10px] text-gray-400 font-light max-w-xs mx-auto">
            This is a mock sandbox environment. Selecting any role and clicking Sign In loads pre-populated mock dataset for that specified role.
          </p>
        </div>
      </div>
    </div>
  );
}
