import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});


const Report = mongoose.model('Report', fileSchema, 'reports');
export default Report;