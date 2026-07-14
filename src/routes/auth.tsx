import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  // Simplified redirect: only redirect if user is authenticated AND we aren't already at dashboard
  useEffect(() => {
    if (user) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    // Navigation is handled by the useEffect after auth state changes
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f7f5f2] p-4 md:p-6">
      <div className="flex w-full max-w-[1000px] items-center gap-12 rounded-[2rem] bg-white p-6 shadow-2xl shadow-orange-500/10 md:p-8 lg:p-12">
        
        {/* Left Side: Modern Enterprise Branding */}
        <div className="hidden flex-1 flex-col justify-between rounded-[1.5rem] bg-[#0c0a09] p-10 text-white lg:flex min-h-[500px]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white/5 p-1 border border-white/10">
                <img src={soraLogo} alt="Sora Cabs" className="h-full w-full object-contain rounded-xl" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Sora Cabs</h2>
            </div>
            <div className="mt-12 space-y-6">
              <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border-orange-500/20">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Enterprise ERP System
              </Badge>
              <h1 className="text-4xl font-extrabold leading-tight">
                Streamline Your Mobility Operations
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Manage rides, fleets, and rentals with our unified enterprise platform. Engineered for performance, built for scale.
              </p>
            </div>
          </div>
          <div className="text-zinc-500 text-xs">
            © {new Date().getFullYear()} Sora Cabs. All rights reserved.
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="flex-1 space-y-8 p-4 md:p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
            <p className="text-sm text-gray-500">Access your enterprise dashboard</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-gray-700">Work Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="pl-10 rounded-xl border-gray-200"
                  placeholder="admin@soracabs.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="pl-10 rounded-xl border-gray-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">System Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-lg shadow-orange-500/20"
            >
              Login securely <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Simple Badge component wrapper for simplicity
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border", className)}>{children}</span>
}
