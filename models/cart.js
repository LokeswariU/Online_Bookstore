var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let CartSchema = new Schema({
    "user_id": {
      "type": mongoose.Schema.ObjectId
    },
    "item_id": {
      "type": mongoose.Schema.ObjectId
    },
    "title":{
      "type" : "String"
    },
    "bookgenre":{
      "type":"String"
    },
    "author":{
      "type":"String"
    },
    "is_deleted": {
      "type": "Boolean"
    },
    "quantity": {
      "type": "Number"
    }
  });

// Export the model
module.exports = mongoose.model('Cart', CartSchema);