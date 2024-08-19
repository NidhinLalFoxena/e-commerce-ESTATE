import React, { useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export default function CreateListing() {
  const [files, setFile] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((fileUrls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(fileUrls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          console.log(error);
          setImageUploadError(
            "Image upload failed,(2 mb per image) please try again"
          );
          setUploading(false);
        });
    } else {
      setImageUploadError("you can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 ">
        {" "}
        Create Listing
      </h1>
      <form className="flex  flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={62}
            minLength={10}
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" required />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" required />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" required />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" required />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offers" className="w-5" required />
              <span>Offers</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                className="border p-3 rounded-lg"
                type="number"
                min={1}
                max={10}
                id="bedrooms"
                required
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="border p-3 rounded-lg"
                type="number"
                min={1}
                max={10}
                id="bathrooms"
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="border p-3 rounded-lg"
                type="number"
                min={1}
                max={10}
                id="regularPrice"
                required
              />
              <div className="flex flex-col  items-center">
                <p>Regular Price</p>
                <p className="text-sm">($ / Month)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="border p-3 rounded-lg"
                type="number"
                min={1}
                max={10}
                id="discountedPrice"
                required
              />
              <div className="flex flex-col  items-center">
                <p>Discounted Price</p>
                <p className="text-sm">($ / Month)</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1 ">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFile(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              disabled={uploading || formData.imageUrls.length > 6}
              type="button"
              onClick={handleImageSubmit}
              className={`${
                uploading ? "opacity-60" : ""
              } p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 disabled:cursor-not-allowed`}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-600 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt={`${url}listing`}
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  type="button"
                  className="p-3 bg-red-700 text-white rounded-lg uppercase hover:opacity-85"
                >
                  Remove
                </button>
              </div>
            ))}

          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-85 hover:shadow-xl  disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
