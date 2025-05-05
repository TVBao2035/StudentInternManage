import React, { useEffect, useState } from 'react'
import { FaUserPlus } from "react-icons/fa6";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import RoleItem from '../../components/RoleItem/RoleItem';
import { getAllUser } from '../../api/userApi';
import { UserDeleteModal, UserDetailModal } from '../../components';
function AccountManagement() {
    const [userList, setUsetList] = useState([]);
    const [controlerModal, setControlerModal] = useState({
        modalCreate: {
            isOpen: false
        },
        modalEdit: {
            isOpen: false,
            data: null
        },
        modalDelete:{
            isOpen: false
        },
        isChange: 0
    });

    const fetchGetAllUser = async () => {
        try {
            let res = await getAllUser();
            if(res?.data?.isSuccess){
                setUsetList(res.data.data);
            }
        } catch (error) {
            alert(error);
        }
    }
    useEffect(() => {
        fetchGetAllUser();
    }, [controlerModal.isChange]);
  return (
    <div className='AccountManagement mt-6'>
        <div className='Controller'>
            <button 
                className='rounded-lg flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 font-medium text-white shadow-sm px-3 py-2'
                onClick={() => 
                    setControlerModal(e => (
                        {
                            ...e, 
                            modalCreate: {
                                isOpen: true
                            }
                        }
                    )
                )}
            >
                <FaUserPlus/>
                <p>Add New</p>
            </button>
        </div>
        <table className='mt-3 rounded-t shadow-2xl'>
              <thead className='bg-gradient-to-r from-blue-600 to-blue-500 text-white  rounded-t'>
                  <tr className=' rounded-t'>
                    <th className='px-20 py-4 font-medium'>Name</th>
                    <th className='px-24 py-4 font-medium'>Email</th>
                    <th className='px-16 py-4 font-medium'>Phone</th>
                    <th className='px-8 py-4 font-medium'>BirthDate</th>
                    <th className='px-8 py-4 font-medium'>Gender</th>
                    <th className='px-28 py-4 font-medium'>Roles</th>
                    <th className='px-8 py-4 font-medium'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    userList?.map(user => 
                        <tr className='text-center h-14'>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.birthDate ? user.birthDate : "None"}</td>
                            <td>{user.gender ? "Boy": "Girl"}</td>
                            <td>
                                <div className='flex gap-2'>
                                    {
                                        user?.roles?.map(role => <RoleItem key={role.id} role={role} />)
                                    }
                                </div>
                            </td>
                            <td>
                                <div className='flex justify-around items-center'>
                                    <div className='Icon-edit text-yellow-400' onClick={() => setControlerModal((e) => ({...e, modalEdit: {isOpen: true, data: user}}))} >
                                        <FaEdit className='size-5' />
                                    </div>
                                    <div className='Icon-delete text-red-500' onClick={() => setControlerModal((e) => ({ ...e, modalDelete: { isOpen: true, data: user } }))}>
                                        <FaTrashAlt />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )
                }
               
            </tbody>
        </table>
        {
            controlerModal.modalCreate.isOpen &&
            <UserDetailModal  setOpen={setControlerModal} />
        }
        {
            controlerModal.modalEdit.isOpen && 
            <UserDetailModal  setOpen={setControlerModal} data={controlerModal.modalEdit.data}/>
        }
        {
              controlerModal.modalDelete.isOpen &&
              <UserDeleteModal setOpen={setControlerModal} data={controlerModal.modalDelete.data} />
        }
    </div>
  )
}

export default AccountManagement