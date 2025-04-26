<<<<<<< HEAD
import React from 'react';
import { Route, Routes } from 'react-router-dom';
//import { useDispatch, useSelector } from "react-redux"

import { Login, Register } from "./pages"; 
import Header from './components/Header/Header';
import { Post } from './components';
import ApplyingJobs from './pages/ApplyingJobs';
import PostManagement from './pages/PostManagement/PostManagement';
import InternshipManagement from './pages/InternshipManagement/InternshipManagement';
import { MainLayout } from "./components/Layout";
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path='' element={<MainLayout/>}>
        <Route path='' element={<Home/>}/>
        <Route path="/applyingjobs" element={<ApplyingJobs/>}/>
        <Route path="/post-manager" element={<PostManagement/>}/>
        <Route path="/intern-manager" element={<InternshipManagement/>}/>
      </Route>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/header" element={<Header/>}/>
      <Route path="/post" element={<Post/>}/>
    </Routes>
=======
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDataMain } from "./redux/userSlice";
import { Login, Register } from "./pages";
import Header from "./components/Header/Header";
import { Post } from "./components";
import ApplyingJobs from "./pages/ApplyingJobs";
import PostManagement from "./pages/PostManagement/PostManagement";
import InternshipManagement from "./pages/InternshipManagement/InternshipManagement";
import { MainLayout } from "./components/Layout";
import Home from "./pages/Home";
import InternJobManage from "./pages/InternJobManage";
import TaskList from "./pages/TaskList";
import {
  InformationPersonal,
  InformationPersonalUpdate,
} from "./pages/Profile";
import JobDetail from "./pages/JobDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { refresh } from "./api/userAPI";
import timeOut from "./helpers/timeOut";
import { setLoading } from "./redux/loadingSlice";
import {  useSelector } from "react-redux";
import Findjob from "./pages/Findjob";
function App() {
  const whitelist = ["/login", "/register"];
  const dispatch = useDispatch();
  const location = useLocation();
  // const user = useSelector((state) => state.user);
  // console.log(user);
  // const fetchAPI = async () => {
  //   try {
  //     const respone = await refresh();
  //     console.log("respone", respone);
  //     if (respone?.status === 200) {
  //       dispatch(
  //         setDataMain({
  //           email: respone.data.data.email,
  //           name: respone.data.data.name,
  //           roles: respone.data.data.roles,
  //           accessToken: respone.data.data.accessToken,
  //         })
  //       );
  //       await timeOut(2000);
  //       dispatch(setLoading(false));
  //     }
  //   } catch (error) {
  //     console.error("Error refreshing token:", error);
  //     dispatch(setLoading(false));
  //   }
  // };

  useEffect(() => {
    if (!whitelist.includes(location.pathname)) {
      dispatch(setLoading(false));
      //fetchAPI();
    }
  }, [location.pathname]);
  // useEffect(() => {
  //   // Force ẩn thanh cuộn
  //   document.body.style.overflow = "hidden";
  //   document.documentElement.style.overflow = "hidden";

  //   return () => {
  //     document.body.style.overflow = "";
  //     document.documentElement.style.overflow = "";
  //   };
  // }, []);
  return (
    <>
      <Routes>
        <Route path="" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/find-job" element={<Findjob />} />
          <Route path="/applyingjobs" element={<ApplyingJobs />} />
          <Route path="/post-manager" element={<PostManagement />} />
          <Route path="/intern-manager" element={<InternshipManagement />} />
          <Route
            path="/intern-job-manage/:internId"
            element={<InternJobManage />}
          />
          <Route path="/task-list" element={<TaskList />} />
          <Route path="/profile" element={<InformationPersonal />} />
          <Route
            path="/profile-update"
            element={<InformationPersonalUpdate />}
          />
          <Route path="/job-detail" element={<JobDetail />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/header" element={<Header />} />
        <Route path="/post" element={<Post />} />
      </Routes>

      <ToastContainer />
    </>
>>>>>>> 60b50e783261d2ad655d5f95bdc012bab142f4cd
  );
};
// export default function App() {
//   // const dispatch = useDispatch();
//   // dispatch(updateName("BaoBao"));
//   // const user = useSelector(state => state.user);
//   // console.log(user);
//   return (
//     // <div className="App">
//     //   <h1 className="text-blue-500 bg-amber-200">
//     //     {
//     //       `Hello ${user.name}`
//     //     }
//     //   </h1>
//     // </div>
//     <Routes>
//     <Route path="/register" element={<Register/>}/>
//     </Routes>
//   )
// }

export default App;