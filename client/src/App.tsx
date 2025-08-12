import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header";
import Home from "@/pages/home";
import About from "@/pages/about";
import AllLists from "@/pages/all-lists";
import List1 from "@/pages/list1";
import List2 from "@/pages/list2";
import List3 from "@/pages/list3";
import LoadingOverlay from "@/components/loading-overlay";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen font-sans bg-[#ecf1f5]">
      <Header />
      <main className="px-3 py-4">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/lists" component={AllLists} />
          <Route path="/list1" component={List1} />
          <Route path="/list2" component={List2} />
          <Route path="/list3" component={List3} />
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
