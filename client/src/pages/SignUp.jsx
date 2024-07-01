import { Link } from 'react-router-dom';

export default function SignUp() {
  return (
    <div className='p-5 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>SignUp</h1>
      <form className='flex flex-col gap-3 '>
        <input
          type='text'
          placeholder='Name'
          id='username'
          className='p-3 border border-slate-300 rounded-md outline-none'
        />
        <input
          type='email'
          placeholder='Email'
          id='email'
          className='p-3 border border-slate-300 rounded-md outline-none'
        />
        <input
          type='password'
          placeholder='Password'
          id='password'
          className='p-3 border border-slate-300 rounded-md outline-none'
        />
        <input
          type='password'
          placeholder='Confirm Password'
          className='p-3 border border-slate-300 rounded-md outline-none'
        />
        <button className='bg-slate-800 text-white p-3 rounded-md my-3 hover:opacity-95 disabled:opacity-80'>
          Sign Up
        </button>
      </form>
      <div className='flex gap-2 mt-2'>
        <p>
          Already have an account?{' '}
          <Link
            to='/sign-in'
            className='text-blue-500 cursor-pointer'>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
