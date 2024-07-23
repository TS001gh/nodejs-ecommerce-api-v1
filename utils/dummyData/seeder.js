import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import colors from 'colors';
import dotenv from 'dotenv';
import Product from '../../models/productModel.js';
import dbConnection from '../../config/database.js';

dotenv.config({ path: '../../config.env' });

dbConnection();

// Read data from the database and return it as a JSON object
const products = JSON.parse(fs.readFileSync('./products.json'));

// Insert data into the database by using the data inside product.json
const insertData = async () => {
  // Create an instance of the Product model
  try {
    await Product.insertMany(products);
    console.log(
      colors.green.inverse(`${products.length} items inserted successfully`)
    );
    process.exit();
  } catch (error) {
    console.log(colors.red(`Error inserting data to the database \r ${error}`));
  }
};

// Delete Data from the database
const deleteData = async () => {
  // Create an instance of the Product model
  try {
    await Product.deleteMany();
    console.log(
      colors.red.inverse(`${products.length} items deleted successfully`)
    );
    process.exit();
  } catch (error) {
    console.log(
      colors.red(`Error deleting data from the database \r ${error}`)
    );
  }
};

// to execute the delete operation and insert into the database the product will write
// node seeder.js  -i or -d

if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
