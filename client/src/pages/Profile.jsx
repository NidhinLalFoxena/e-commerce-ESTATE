import { useSelector } from 'react-redux';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-bold text-center my-7'>Profile</h1>
      <form className='flex justify-center flex-col'>
        <img
          src={currentUser?.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />

        <input
          type='text'
          id='username'
          value={currentUser?.username}
          placeholder='Name'
          className='border border-gray-300 rounded-md p-2 my-2'
        />
        <input
          type='text'
          id='email'
          value={currentUser?.email}
          placeholder='Email'
          className='border border-gray-300 rounded-md p-2 my-2'
        />
        <input
          type='text'
          id='password'
          placeholder='Password'
          className='border border-gray-300 rounded-md p-2 my-2'
        />
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          Update
        </button>

        <div className='flex justify-between mt-2'>
          <span className='text-red-700 cursor-pointer'>Delete Account</span>
          <span className='text-red-700 cursor-pointer'>Sign Out</span>
        </div>
      </form>
    </div>
  );
}
