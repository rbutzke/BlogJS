const Sequelize = require("sequelize");
const connection = require("../db/connection");

const Category = connection.define('categories',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Category;