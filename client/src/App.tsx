import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import PageLayout from "./components/layout/page-layout.component";
import Chatbot from "./components/chatbot/chatbot.component";
import Pages from "./components/pages/pages.component";
import Login from "./components/login/login.component";
import ProtectedRoute from "./components/general/protected-route/protected-route.route";
import Register from "./components/register/register.component";
import Activation from "./components/register/activation/activation.component";
import AdminTable from "./components/admin-table/admin-table.component";
import Statistics from "./components/statistics/statistics.component";
import NotFound from "./components/not-found/not-found.component";
import InactivityLogout from "./components/general/inactivity-logout/inactivity-logout.component";
import AdminRoute from "./components/general/admin-route/admin-route.component";
import Documentation from "./components/documentation/documentation.component";
import { useAuthStore, useToolStore } from "./states/global.store";
import { getPagesForInsights } from "./services/pages.service";
import { getLabels } from "./services/label.service";
import { getTags } from "./services/tags.service";
import { PageDTO, TagDTO } from "./components/pages/types/pages.types";
import { LabelDTO } from "./types/chatbot/chatbot.types";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
  const queryClient = new QueryClient()
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { authenticated } = useAuthStore();
  const setToolState = useToolStore((state: any) => state.set);

  useEffect(() => {
    if (authenticated) {
      Promise.all([getPagesForInsights(), getLabels(), getTags()])
        .then(([pages, labels, tags]) => {
          setToolState({
            filterPageIds: pages.map((page: PageDTO) => page.id),
            filterLabelsIds: labels.map((label: LabelDTO) => label.id),
            filterTagsIds: tags.map((tag: TagDTO) => tag.id),
            filterDate: null,
            selectedPagesId: pages.map((page: PageDTO) => page.id),
            selectedLabelsId: labels.map((label: LabelDTO) => label.id),
            selectedTagsId: tags.map((tag: TagDTO) => tag.id),
            selectedPages: pages,
            selectedLabels: labels,
            selectedTags: tags,
          });
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [authenticated, setToolState]);

  return (
    <>
     <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/register/activate" element={<Activation />} />
            <Route path="/logout" element={<InactivityLogout />} />
            <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <PageLayout open={sidebarOpen} setOpen={setSidebarOpen} />
              }
            >
              <Route
                path="/"
                element={
                  <Chatbot open={sidebarOpen} setOpen={setSidebarOpen} />
                }
              />
              <Route
                path="/pages"
                element={<Pages open={sidebarOpen} setOpen={setSidebarOpen} />}
              />
              <Route
                path="/insights"
                element={
                  <Statistics open={sidebarOpen} setOpen={setSidebarOpen} />
                }
              />
              <Route element={<AdminRoute />}>
                <Route
                  path="/admin"
                  element={
                    <AdminTable open={sidebarOpen} setOpen={setSidebarOpen} />
                  }
                />
              </Route>

              <Route
                path="/documentation"
                element={<Documentation open={sidebarOpen} setOpen={setSidebarOpen} />}
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
