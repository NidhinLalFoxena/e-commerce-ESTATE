import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      console.log(formData);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate('/sign-in');
      setError(null);
      console.log(data);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className='p-5 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>SignUp</h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-3 '>
        <input
          type='text'
          placeholder='Name'
          id='username'
          onChange={handleChange}
          className='p-3 border border-slate-300 rounded-md outline-none'
        />
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
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
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

      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
}
