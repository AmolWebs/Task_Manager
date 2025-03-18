import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import TaskList from "@/pages/task-list";
import { TaskProvider } from "./context/task-context";

function Router() {
  return (
    <Switch>
      <Route path="/" component={TaskList} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TaskProvider>
      <Router />
      <Toaster />
    </TaskProvider>
  );
}

export default App;