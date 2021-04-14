const mongoose = require('mongoose')

const punksSchema = new mongoose.Schema({
  ranking: Number,
  punk_image: String,
  id: {
    type: Number,
    require: true
  },
  minscore: Number,
  '2nd': Number,
  category_score: Number,
  att_count_score: Number,
  attributes: Array,
  attribute_count: Number,
  skin: String,
  type: String,
  total_score: Number,
  price: Number,
  on_sale: {
    type: Boolean,
    default: false
  }
})

const Punk = mongoose.model('Punk', punksSchema);

module.exports = Punk
