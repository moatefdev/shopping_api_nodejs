// const Category = require("./../models/Category");

// exports.getCategories = (req, res) => {
//   Category.find()
//     .then((result) => {
//       // console.log(result.length);
//       res.status(200).json({
//         category: result,
//       });
//     })
//     .catch((error) => {
//       res.status(404).json({ message: error.message });
//     });
// };

// exports.addCategory = (req, res) => {
//   const newCategory = new Category({
//     categoryName: req.body.name,
//   });
//   Category.find()
//     .then((result) => {
//       if (result.length === 0) {
//         newCategory
//           .save()
//           .then((result) => {
//             res.status(200).json({
//               message: "Category Added",
//               category: result,
//             });
//           })
//           .catch((error) => {
//             res.status(404).json({ message: error.message });
//           });
//       } else {
//         const newName = result[0].categoryName;
//         newName.push(...newCategory.categoryName);
//         const results = new Category({
//           categoryName: newName,
//         });
//         // console.log(results);
//         results
//           .save()
//           .then((result) => {
//             res.status(200).json({
//               result: results,
//             });
//           })
//           .catch((error) => {
//             res.status(404).json({ message: error.message });
//           });
//       }
//     })
//     .catch((error) => {
//       res.status(404).json({ message: error.message });
//     });
// };
