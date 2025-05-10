import React, { useEffect, useState } from 'react'
import { getAllRoles } from '../../../api/roleAPI';
import { IoMdClose } from "react-icons/io";
import { createUser, updateUser } from '../../../api/userApi';
function UserDetailModal({setOpen, data=null}) {
    
    var initialUserData = {
        name: "",
        email: "",
        birthDate: "",
        phoneNumber: "",
        gender: true,
        roles: []
    };  
    if(data != null){
        initialUserData= {
            id: data?.id,
            name: data?.name,
            email: data?.email,
            birthDate: data?.birthDate,
            gender: data?.gender,
            phoneNumber: data?.phoneNumber,
            roles: data?.roles
        }
    }
    const [roles, setRoles] = useState([]);
    const [userInfo, setUserInfo] = useState(initialUserData);
    const fetchRoles = async () => {
        try {
            var res = await getAllRoles();
            if(res?.data?.isSuccess){
                setRoles(res.data.data);
            }
        } catch (error) {
            alert(error);
        }
    }

    const handleClose = () => {
        if(data === null){
            setOpen(e => ({ ...e, modalCreate: {isOpen: false}}))
        } else {
            setOpen(e => ({ ...e, modalEdit: { isOpen: false }, isChange: e.isChange + 1, data: null }))
        }
    }

    const handleSelect = (e, role) => {
        if(e.target.checked){
            userInfo.roles.push(role);
            let temp = userInfo.roles;
            setUserInfo({...userInfo, roles: temp})
        }else{
            let index = userInfo.roles.indexOf(role);
            userInfo.roles.splice(index, 1)
            let temp = userInfo.roles;
            setUserInfo({ ...userInfo, roles: temp})
        }
    }
    const handleChange = ( e) => {
        setUserInfo({...userInfo, [e.target.name]: e.target.value});
    }
   const handleSubmit = async () => {
    try {
        if(data === null){
            let res = await createUser(userInfo);
            if(res?.data?.isSuccess){
                setOpen(e => ({ ...e, modalCreate: { isOpen: false }, isChange: e.isChange + 1 }));
            }
        }else{
            let res = await updateUser(userInfo);
            if (res?.data?.isSuccess) {
                setOpen(e => ({ ...e, modalEdit: { isOpen: false }, isChange: e.isChange + 1, data: null }));
            }
        }
    } catch (error) {
        alert(error)
    }
   }
    useEffect(() => {
        fetchRoles();
    }, []);
  return (
    <div className='UserDetailModal absolute top-0 right-0 bg-opacity-50 bg-black w-full h-full flex justify-center items-center'
        onClick={(e) => {
            if(e.currentTarget == e.target){
                handleClose();
            }
        }}
    >
        <div className='w-6/12 text-black bg-white  box-border px-10 py-10 rounded-2xl'>
            <div className='flex justify-between '>
                <p className='font-bold text-xl text-blue-500'>
                    {
                        data === null ? "Tạo mới tài khoản" : "Cập nhật tài khoản"
                    }
                </p>
                <IoMdClose className='text-red-600 text-xl' onClick={handleClose}/>
            </div>

            <div className='flex flex-col my-3'>
                <label htmlFor="">Tên:</label>
                <input 
                    onChange={(e) => handleChange(e)}
                    value={userInfo.name}
                    type="text"
                    name='name' 
                    className='rounded-md shadow-2xl focus: outline-none focus: ring-blue-500 text-gray-700 border-2 px-2 py-1 ' />
            </div>
            <div className='flex flex-col my-3'>
                <label htmlFor="">Email:</label>
                <input 
                    onChange={(e) => handleChange(e)}
                    value={userInfo.email}
                    type="text"
                    name='email' 
                    className='rounded-md shadow-2xl focus: outline-none focus: ring-blue-500 text-gray-700 border-2 px-2 py-1 ' />
            </div>
            <div className='flex flex-col my-3'>
                <label htmlFor="">Điện thoại:</label>
                <input 
                    onChange={(e) => handleChange(e)}
                    value={userInfo.phoneNumber}
                    type="text"
                    name='phoneNumber' 
                    className='rounded-md shadow-2xl focus: outline-none focus: ring-blue-500 text-gray-700 border-2 px-2 py-1 ' />
            </div> 
        
            <div className='flex flex-col my-3'>
                <label htmlFor="">Ngày Sinh:</label>
                <input 
                    onChange={e => handleChange(e)}
                    type="date" 
                    name='birthDate'
                    value={userInfo.birthDate}
                    min="1997-01-01" max="2030-12-31"
                    className='rounded-md shadow-2xl focus: outline-none focus: ring-blue-500 text-gray-700 border-2 px-2 py-1 ' />
            </div>
            <div className='flex gap-2 my-3'>
                <label htmlFor="gender">Giới tính:</label>
                <input id='gender' type="checkbox" 
                    onClick={e=> setUserInfo({...userInfo, gender: e.target.checked })} 
                    className='rounded-md shadow-2xl focus: outline-none focus: ring-blue-500 text-gray-700 border-2 px-2 py-1 '
                    checked={userInfo.gender} />
                <p>Nam</p> 
            </div>
            <div className='flex gap-2 my-3'>
                <label htmlFor="">Quyền:</label>
                <div className='flex gap-3 items-center'>
                    {
                        roles.map(role => 
                        {
                            console.log(role);
                            let isChecked = false;
                            if(data !== null){
                                userInfo.roles.forEach(r => {
                                    console.log(r);
                                    if(r.id == role.id) {
                                        isChecked = true;
                                        
                                    }
                                })
                            }
                            return(
                                <div className='flex items-center gap-2'>
                                    {
                                        data=== null ?
                                        <input type="checkbox" id={role.id} onClick={(e)=>handleSelect(e, {id: role.id, name: role.name})}/>
                                        :
                                        <input type="checkbox" id={role.id} onClick={(e) => handleSelect(e, { id: role.id, name: role.name })} checked={isChecked} />
                                    }
                                    <label htmlFor={role.id}>{role.name}</label>
                                </div>

                            )

                        }
                        )
                    }
                </div>
               
            </div>
            <div className='flex justify-center'>
                  <button className='rounded-lg flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 font-medium text-white shadow-sm px-3 py-2'
                    onClick={handleSubmit}
                  >
                      {
                          data === null ? "Tạo mới" : "Cập nhật"
                      }
                </button>
            </div>
        </div>
    </div>
  )
}

export default UserDetailModal