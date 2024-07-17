import { useState, useEffect } from 'react';
import { useCommon } from '../contexts/CommonContext';
function Profile() {
  const { adminInfor } = useCommon();

  return (
    <>
      <div className='wrapper my-3'>
        <div className='relative max-w-screen-lg sm2:border-slate-300 sm2:rounded-3xl sm2:shadow sm2:shadow-gray-400 sm2:px-10 sm2:py-5 md:px-20 mx-3 md:mx-10 lg:mx-14 md:py-10 my-5'>
          <div className='personal-information relative flex items-center'>
            <div className='absolute top-0 left-0 h-[80px] flex flex-col justify-around'>
              <div className='username font-semibold'>
                {adminInfor && adminInfor.username}
              </div>
              <div className='social-url'>...</div>
            </div>
            <div className='avatar-infor absolute top-0 right-0'>
              <img
                src={adminInfor && adminInfor.avatar_path}
                alt='avatar-infor'
                className='w-[80px] h-[80px] rounded-full bg-cover bg-no-repeat bg-center'
              />
            </div>
          </div>
          <div className='mt-28 whitespace-pre-wrap overflow-hidden overflow-ellipsis'>
            Tiểu sử chưa được cập nhật...
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
