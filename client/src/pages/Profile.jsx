import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOUtStart,
  signOutFailure,
  signOutSuccess,
} from "../../redux/user/userSlice";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [file, setFile] = useState(undefined);
  const [parentageOfImageUpload, setPercentageOfImageUpload] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState(false);

  const dispatch = useDispatch();

  const handleFileUpload = (file) => {
    const storage = getStorage(app);

    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercentageOfImageUpload(Math.round(progress));
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        setFileUploadError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      console.log(data);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    dispatch(signOUtStart());

    const res = await fetch("/api/auth/signout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = res.json();
    if (data.success === false) {
      dispatch(signOutFailure(data.message));
      return;
    }

    dispatch(signOutSuccess(data));
    s;
    try {
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccessMessage(true);
      console.log(data);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex justify-center flex-col">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser?.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700 ">Error Image Uploading</span>
          ) : parentageOfImageUpload > 0 && parentageOfImageUpload < 100 ? (
            <span className="text-slate-700">{`Uploading ${parentageOfImageUpload}%`}</span>
          ) : parentageOfImageUpload === 100 ? (
            <span className="text-green-700">Image Successfully Uploaded</span>
          ) : null}
        </p>

        <input
          onChange={handleChange}
          type="text"
          id="username"
          defaultValue={currentUser?.username}
          placeholder="Name"
          className="border border-gray-300 rounded-md p-2 my-2"
        />
        <input
          onChange={handleChange}
          type="text"
          id="email"
          defaultValue={currentUser?.email}
          placeholder="Email"
          className="border border-gray-300 rounded-md p-2 my-2"
        />
        <input
          onChange={handleChange}
          type="password"
          id="password"
          placeholder="Password"
          className="border border-gray-300 rounded-md p-2 my-2"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading......." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-center text-white rounded-lg p-3 mt-2 uppercase hover:opacity-95 disabled:opacity-80"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-2">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700">{error ? error : null}</p>
      <p className="text-green-700">
        {updateSuccessMessage ? "User Updated Successfully..!" : null}
      </p>
    </div>
  );
}
