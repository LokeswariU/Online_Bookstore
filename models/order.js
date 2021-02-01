var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let OrderSchema = new Schema({
    "user_id": {
      "type": mongoose.Schema.ObjectId
    },
    "cart_list": {
      "type": [
        mongoose.Schema.ObjectId
      ]
    },
    "title_list":{
      "type":[
      "String"
      ]
    },
    "genre_list":{
      "type":[
      "String"
      ]
    },
    "author_list":{
      "type":[
      "String"
      ]
    },
    "card":{
      "type": "String"
    },
    "total_price": {
        "type": "Number"
    },
    "currency": {
        "type": "String"
    }
  });

// Export the model
module.exports = mongoose.model('Order', OrderSchema);