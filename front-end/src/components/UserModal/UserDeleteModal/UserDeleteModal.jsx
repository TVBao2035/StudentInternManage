import React from 'react'

import { IoMdClose } from "react-icons/io";
import { deleteUser } from '../../../api/userApi';
function UserDeleteModal( {setOpen, data}) {
    const handleClose = () => {
        setOpen(e => ({ ...e, modalDelete: { isOpen: false }, data: null }))
    }
    
    const handleDelete = async () => {
        try {
            let res = await deleteUser(data.id);
            if(res.data?.isSuccess){
                setOpen(e => ({ ...e, modalDelete: { isOpen: false }, isChange: e.isChange + 1, data: null }))
            }
        } catch (error) {
            alert(error);
        }
    }
  return (
    <div className='UserDeleteModal absolute top-0 right-0 bg-opacity-50 bg-black w-full h-full flex justify-center items-center'
          onClick={(e) => {
              if (e.currentTarget == e.target) {
                  handleClose();
              }
          }}
    >
        <div className='w-6/12 text-black bg-white  box-border px-10 py-10 rounded-2xl'>
            <div className='flex justify-between '>
                <p className='font-bold text-xl text-red-500'>Xóa tài khoản</p>
                <IoMdClose className='text-red-600 text-xl' onClick={handleClose}/>
            </div>
            <ul className='mt-3'>
                <li className='flex gap-1'>
                    <p className='font-medium'>Tên:</p>
                    <p>{data?.name}</p>
                </li>
                <li  className='flex gap-1'>
                    <p className='font-medium'>Email:</p>
                    <p>{data?.email}</p>
                </li>
                <li  className='flex gap-1'>
                    <p className='font-medium'>Số điện thoại: </p>
                    <p>{data?.phoneNumber}</p>
                </li>
            </ul>
            <div className='flex justify-end'>
                <button 
                    className='bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 rounded-md font-medium text-white'
                    onClick={handleDelete}
                >Xóa</button>
            </div>
        </div>
    </div>
  )
}

export default UserDeleteModal