import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        'https://th.bing.com/th/id/R.d7800ae0e7bce71f7474026872829021?rik=J9LLGXJjZtfBBw&riu=http%3a%2f%2fwww.arts-wallpapers.com%2fmovie_wallpapers%2fAVATAR-MOVIE%2fimages%2favatar_movie_11.jpg&ehk=9JZC3ur5pdrG0zwiCPRAfAsP9cjGNihKKSuVIdLbPoQ%3d&risl=&pid=ImgRaw&r=0',
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
