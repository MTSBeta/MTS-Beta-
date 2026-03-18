import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PlayerProvider } from "@/context/PlayerContext";
import { StaffAuthProvider } from "@/context/StaffAuthContext";
import { InternalAuthProvider } from "@/context/InternalAuthContext";
import { SoundProvider } from "@/context/SoundContext";
import { AssistantProvider } from "@/context/AssistantContext";
import { ProtectedStaffRoute } from "@/components/ProtectedStaffRoute";
import { ProtectedInternalRoute } from "@/components/ProtectedInternalRoute";
import NotFound from "@/pages/not-found";
import MetyButton from "@/components/MetyButton";

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
import AdminSignup from "@/pages/staff/AdminSignup";
import StaffDashboard from "@/pages/staff/StaffDashboard";
import StaffPlayers from "@/pages/staff/StaffPlayers";
import StaffPlayerProfile from "@/pages/staff/StaffPlayerProfile";
import StaffTeam from "@/pages/staff/StaffTeam";
import StaffSettings from "@/pages/staff/StaffSettings";

import InternalLogin from "@/pages/internal/InternalLogin";
import StoriesDashboard from "@/pages/internal/StoriesDashboard";
import StoryProfile from "@/pages/internal/StoryProfile";
import BlueprintEditor from "@/pages/internal/BlueprintEditor";
import StoryBuilder from "@/pages/internal/StoryBuilder";
import IllustrationWorkspace from "@/pages/internal/IllustrationWorkspace";
import ProductionPanel from "@/pages/internal/ProductionPanel";
import EditorDashboard from "@/pages/internal/EditorDashboard";

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
      <Route path="/admin-signup" component={AdminSignup} />
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

      {/* MeTime Stories internal production workspace — separate auth */}
      <Route path="/internal/login" component={InternalLogin} />
      <Route path="/internal/editor">
        {() => (
          <ProtectedInternalRoute>
            <EditorDashboard />
          </ProtectedInternalRoute>
        )}
      </Route>
      <Route path="/internal/stories">
        {() => (
          <ProtectedInternalRoute>
            <StoriesDashboard />
          </ProtectedInternalRoute>
        )}
      </Route>
      <Route path="/internal/stories/:playerId/profile">
        {() => (
          <ProtectedInternalRoute>
            <StoryProfile />
          </ProtectedInternalRoute>
        )}
      </Route>
      <Route path="/internal/stories/:playerId/blueprint">
        {() => (
          <ProtectedInternalRoute>
            <BlueprintEditor />
          </ProtectedInternalRoute>
        )}
      </Route>
      <Route path="/internal/stories/:playerId/builder">
        {() => (
          <ProtectedInternalRoute>
            <StoryBuilder />
          </ProtectedInternalRoute>
        )}
      </Route>
      <Route path="/internal/stories/:playerId/illustrations">
        {() => (
          <ProtectedInternalRoute>
            <IllustrationWorkspace />
          </ProtectedInternalRoute>
        )}
      </Route>
      <Route path="/internal/stories/:playerId/notes">
        {() => (
          <ProtectedInternalRoute>
            <ProductionPanel />
          </ProtectedInternalRoute>
        )}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AssistantProvider>
      <PlayerProvider>
        <StaffAuthProvider>
          <InternalAuthProvider>
            <SoundProvider>
              <TooltipProvider>
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                  <Router />
                  <MetyButton />
                </WouterRouter>
                <Toaster />
              </TooltipProvider>
            </SoundProvider>
          </InternalAuthProvider>
        </StaffAuthProvider>
      </PlayerProvider>
      </AssistantProvider>
    </QueryClientProvider>
  );
}

export default App;
