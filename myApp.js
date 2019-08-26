const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})

const personSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number },
  favoriteFoods: { type: [String] }
})

const Person = mongoose.model("Person", personSchema);

/** # [C]RUD part I - CREATE # */
const createAndSavePerson = function(done) {
  const me = new Person({ name: "Vasyl", age: 28, favoriteFoods: ["Egg", "Piza", "Coffee"] });
  me.save(function(err, data) {
    if(err) {
      return done(err);
    } else {
      return done(null, data);
    } 
  });
};
const createManyPeople = function(arrayOfPeople, done) {
    Person.create(arrayOfPeople, function(err, people) {
      if(err) return done(err);
      return done(null, people);
    })      
};

/** # C[R]UD part II - READ #
/*  ========================= */
const findPeopleByName = function(personName, done) {
  Person.find({ name: personName }, function(err, person) {
    if(err) return done(err);
    return done(null, person)
  })
};

const findOneByFood = function(food, done) {
  Person.findOne({ favoriteFoods: food }, function(err, item) {
    if(err) return done(err);

    return done(null, item);
  })  
};

const findPersonById = function(personId, done) {
  Person.findById(personId, function(err, person) {
    if(err) return done(error);
    return done(null, person);
  })
};

/** # CR[U]D part III - UPDATE # 
/*  ============================ */

/** 8) Classic Update : Find, Edit then Save */

// In the good old days this was what you needed to do if you wanted to edit
// a document and be able to use it somehow e.g. sending it back in a server
// response. Mongoose has a dedicated updating method : `Model.update()`,
// which is directly binded to the low-level mongo driver.
// It can bulk edit many documents matching certain criteria, but it doesn't
// pass the edited document to its callback, only a 'status' message.
// Furthermore it makes validation difficult, because it just
// direcly calls the mongodb driver.

// Find a person by Id ( use any of the above methods ) with the parameter
// `personId` as search key. Add "hamburger" to the list of her `favoriteFoods`
// (you can use Array.push()). Then - **inside the find callback** - `.save()`
// the updated `Person`.

// [*] Hint: This may be tricky if in your `Schema` you declared
// `favoriteFoods` as an `Array` without specifying the type (i.e. `[String]`).
// In that case `favoriteFoods` defaults to `Mixed` type, and you have to
// manually mark it as edited using `document.markModified('edited-field')`
// (http://mongoosejs.com/docs/schematypes.html - #Mixed )

const findEditThenSave = function(personId, done) {
  Person.findById(personId, (err, person) => {
    if(err) return done(err);
   
    person.favoriteFoods.push("hamburger");

    person.save((err, updatedPerson) => {
      if(err) return done(err);

      return done(null, updatedPerson);
    })
  })
};

/** 9) New Update : Use `findOneAndUpdate()` */

// Recent versions of `mongoose` have methods to simplify documents updating.
// Some more advanced features (i.e. pre/post hooks, validation) beahve
// differently with this approach, so the 'Classic' method is still useful in
// many situations. `findByIdAndUpdate()` can be used when searching by Id.
//
// Find a person by `name` and set her age to `20`. Use the function parameter
// `personName` as search key.
//
// Hint: We want you to return the **updated** document. In order to do that
// you need to pass the options document `{ new: true }` as the 3rd argument
// to `findOneAndUpdate()`. By default the method
// passes the unmodified object to its callback.

const findAndUpdate = function(personName, done) {
  Person.findOneAndUpdate({ name: personName }, { age: 20 }, { new: true }, (err, person) => {
    if(err) return done(err);

    return done(null, person);
  })
};

/** # CRU[D] part IV - DELETE #
/*  =========================== */

/** 10) Delete one Person */

// Delete one person by her `_id`. You should use one of the methods
// `findByIdAndRemove()` or `findOneAndRemove()`. They are similar to the
// previous update methods. They pass the removed document to the cb.
// As usual, use the function argument `personId` as search key.

const removeById = function(personId, done) {
  Person.findByIdAndDelete(personId, (err, person) => {
    if(err) return done(err);

    return done(null, person);
  })
};

/** 11) Delete many People */

// `Model.remove()` is useful to delete all the documents matching given criteria.
// Delete all the people whose name is "Mary", using `Model.remove()`.
// Pass to it a query ducument with the "name" field set, and of course a callback.
//
// Note: `Model.remove()` doesn't return the removed document, but a document
// containing the outcome of the operation, and the number of items affected.
// Don't forget to pass it to the `done()` callback, since we use it in tests.

const removeManyPeople = function(done) {
  Person.remove({ name: "Mary" }, (err, people) => {
    if(err) return done(err);

    return done(null, people);
  })
};

/** # C[R]UD part V -  More about Queries # 
/*  ======================================= */

/** 12) Chain Query helpers */

// If you don't pass the `callback` as the last argument to `Model.find()`
// (or to the other similar search methods introduced before), the query is
// not executed, and can even be stored in a variable for later use.
// This kind of object enables you to build up a query using chaining syntax.
// The actual db search is executed when you finally chain
// the method `.exec()`, passing your callback to it.
// There are many query helpers, here we'll use the most 'famous' ones.

// Find people who like "burrito". Sort them alphabetically by name,
// Limit the results to two documents, and hide their age.
// Chain `.find()`, `.sort()`, `.limit()`, `.select()`, and then `.exec()`,
// passing the `done(err, data)` callback to it.

const queryChain = function(done) {

  Person
  .find({ favoriteFoods: "burrito" })
  .sort({ name: 1 })
  .limit(2)
  .select("-age")
  .exec((err, data) => {
    if(err) return done(err);

    return done(null, data);
  })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

/** # Further Readings... #
/*  ======================= */
// If you are eager to learn and want to go deeper, You may look at :
// * Indexes ( very important for query efficiency ),
// * Pre/Post hooks,
// * Validation,
// * Schema Virtuals and  Model, Static, and Instance methods,
// * and much more in the [mongoose docs](http://mongoosejs.com/docs/)


//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
