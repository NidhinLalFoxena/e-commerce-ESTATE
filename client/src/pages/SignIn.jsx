import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from '../../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      dispatch(signInStart());
      e.preventDefault();
      console.log(formData);
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className='p-5 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Log In</h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-3 '>
        <input
          type='email'
          placeholder='Email'
          id='email'
          onChange={handleChange}
          className='p-3 border border-slate-300 rounded-md outline-none'
        />
        <input
          type='password'
          placeholder='Password'
          id='password'
          onChange={handleChange}
          className='p-3 border border-slate-300 rounded-md outline-none'
        />

        <button
          disabled={loading}
          className='bg-slate-800 text-white p-3 rounded-md my-3 hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign In'}
        </button>

        <OAuth />
      </form>
      <div className='flex gap-2 mt-2'>
        <p>
          {` don't have an account?`}
          <Link
            to='/sign-up'
            className='text-blue-500 cursor-pointer'>
            Sign UP
          </Link>
        </p>
      </div>

      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
}
