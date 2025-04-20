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