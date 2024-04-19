import { Authenticated, GitHubBanner, Refine, WelcomePage } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import {Home, Login, Register, ForgotPassword } from "./pages";

// import dataProvider, {
//   GraphQLClient,
//   liveProvider,
// } from "@refinedev/nestjs-query";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import { createClient } from "graphql-ws";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import Layout from "./components/layout";
import {dataProvider, liveProvider} from './providers'
import { authProvider } from "./providers";
import { resources } from "./config/resources";
import CompanyList from "./pages/company/list";
import Create from './pages/company/create'
import EditPage from "./pages/company/edit";
import TasksList from "./pages/tasks/list";

// const API_URL = "https://api.nestjs-query.refine.dev/graphql";
// const WS_URL = "wss://api.nestjs-query.refine.dev/graphql";

// const gqlClient = new GraphQLClient(API_URL);
// const wsClient = createClient({ url: WS_URL });

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                liveProvider={liveProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                resources={resources}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "UR5Cfb-180yJS-lcqXFT",
                  liveMode: "auto",
                }}
              >
                <Routes>

                  {/* <Route index element={<WelcomePage />} /> */}
                  
                  <Route index path="/register" element={<Register/>}/>
                  <Route index path="/login" element={<Login/>}/>
                  <Route index path="forgot-password" element={<ForgotPassword/>}/>

                  <Route
                    element={
                      <Authenticated
                        key="authenticated-layout"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <Layout>
                          <Outlet/>
                        </Layout>
                      </Authenticated> 
                    }
                  >
                    <Route index element={<Home />} />
                    <Route path="/companies" >
                      <Route index element={<CompanyList />} />
                      <Route path='new' element={<Create />} />
                      <Route path='edit/:id' element={<EditPage/>} />
                    </Route>
                    <Route path="/tasks">
                      <Route index element={<TasksList />} />
                    </Route>
                  </Route>

                  

                </Routes>
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
