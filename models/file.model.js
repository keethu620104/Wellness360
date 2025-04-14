import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

const File = mongoose.model('File', fileSchema);

export default File;