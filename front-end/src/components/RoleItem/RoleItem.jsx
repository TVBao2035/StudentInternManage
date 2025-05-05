import React, { useState } from 'react'

function RoleItem({role}) {
  var roleStyle = "9853d725-4467-4869-a6d6-c270512dc6f8"

  switch(role.id){
    case "3b66d950-c972-42b7-a62a-05bcca8b57cf":
      roleStyle ="from-yellow-400 to-yellow-400";
      break;
    case "d8088721-09e9-4596-8393-09677981b42c":
      roleStyle ="from-red-500 to-red-400";
      break;
    case "93fd5222-5d32-4d03-8e07-35a19b8945b2":
      roleStyle ="from-purple-500 to-purple-300";
      break;
    case "0160b93a-f1c0-482c-9c2f-9ef5964ce225":
      roleStyle ="from-green-500 to-green-400 ";
      break;
    case "9853d725-4467-4869-a6d6-c270512dc6f8":
      roleStyle ="from-blue-500 to-blue-400";
      break;
  }
  return (
    <div className={"RoleItem text-white bg-gradient-to-r "+roleStyle+" rounded-2xl  flex items-center justify-center box-border px-2 py-1"}>
        <p>{role.name}</p>
    </div>
  )
}

export default RoleItem