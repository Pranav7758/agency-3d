import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import OurWork from "@/pages/OurWork";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import TubesCursor from "@/components/TubesCursor";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <TubesCursor />
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/our-work" component={OurWork} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
      </SmoothScroll>
    </QueryClientProvider>
  );
}

export default App;
