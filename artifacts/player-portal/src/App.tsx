import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PlayerProvider } from "@/context/PlayerContext";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Welcome from "@/pages/Welcome";
import Journey from "@/pages/Journey";
import Invite from "@/pages/Invite";
import ParentForm from "@/pages/ParentForm";
import CoachForm from "@/pages/CoachForm";
import Complete from "@/pages/Complete";
import Admin from "@/pages/Admin";

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
      <Route path="/register" component={Register} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/journey" component={Journey} />
      <Route path="/invite" component={Invite} />
      <Route path="/parent/:code" component={ParentForm} />
      <Route path="/coach/:code" component={CoachForm} />
      <Route path="/complete" component={Complete} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </PlayerProvider>
    </QueryClientProvider>
  );
}

export default App;
