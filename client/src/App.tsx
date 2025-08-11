import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header";
import Home from "@/pages/home";
import List1 from "@/pages/list1";
import List2 from "@/pages/list2";
import LoadingOverlay from "@/components/loading-overlay";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="px-3 py-4">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/list1" component={List1} />
          <Route path="/list2" component={List2} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <LoadingOverlay />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
