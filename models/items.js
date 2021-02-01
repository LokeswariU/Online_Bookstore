var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ItemSchema = new Schema({
  "price": {
    "value": {
      "type": "Number"
    },
    "currency": {
      "type": "String"
    }
  },
  "image": {
    "type": "String"
  },
  "title": {
    "type": "String"
  },
  "bookgenre": {
    "type": "String"
  },
  "description": {
    "type": "String"
  },
  "author": {
    "type": "String"
  },
  "is_deleted": {
    "type": "Boolean"
  },
	"booktype":{
		"type": "String"
	}
});
// Export the model
module.exports = mongoose.model('Items', ItemSchema);