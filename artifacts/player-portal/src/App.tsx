import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PlayerProvider } from "@/context/PlayerContext";
import { StaffAuthProvider } from "@/context/StaffAuthContext";
import { ProtectedStaffRoute } from "@/components/ProtectedStaffRoute";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Register from "@/pages/Register";
import Welcome from "@/pages/Welcome";
import WelcomeU9 from "@/pages/WelcomeU9";
import Journey from "@/pages/Journey";
import JourneyU9 from "@/pages/JourneyU9";
import Invite from "@/pages/Invite";
import Stakeholder from "@/pages/Stakeholder";
import Complete from "@/pages/Complete";
import Admin from "@/pages/Admin";
import ParentView from "@/pages/ParentView";

import StaffLogin from "@/pages/staff/StaffLogin";
import AdminLogin from "@/pages/AdminLogin";
import StaffDashboard from "@/pages/staff/StaffDashboard";
import StaffPlayers from "@/pages/staff/StaffPlayers";
import StaffPlayerProfile from "@/pages/staff/StaffPlayerProfile";
import StaffTeam from "@/pages/staff/StaffTeam";
import StaffSettings from "@/pages/staff/StaffSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/register" component={Register} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/welcome-u9" component={WelcomeU9} />
      <Route path="/journey" component={Journey} />
      <Route path="/journey-u9" component={JourneyU9} />
      <Route path="/invite" component={Invite} />
      <Route path="/stakeholder/:code" component={Stakeholder} />
      <Route path="/complete" component={Complete} />
      <Route path="/admin" component={Admin} />
      <Route path="/parent/:code" component={ParentView} />
      <Route path="/staff-login" component={StaffLogin} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/staff-dashboard">
        {() => (
          <ProtectedStaffRoute>
            <StaffDashboard />
          </ProtectedStaffRoute>
        )}
      </Route>
      <Route path="/staff/players/:id">
        {() => (
          <ProtectedStaffRoute>
            <StaffPlayerProfile />
          </ProtectedStaffRoute>
        )}
      </Route>
      <Route path="/staff/players">
        {() => (
          <ProtectedStaffRoute>
            <StaffPlayers />
          </ProtectedStaffRoute>
        )}
      </Route>
      <Route path="/staff/team">
        {() => (
          <ProtectedStaffRoute adminOnly>
            <StaffTeam />
          </ProtectedStaffRoute>
        )}
      </Route>
      <Route path="/staff/settings">
        {() => (
          <ProtectedStaffRoute>
            <StaffSettings />
          </ProtectedStaffRoute>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
        <StaffAuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </StaffAuthProvider>
      </PlayerProvider>
    </QueryClientProvider>
  );
}

export default App;
