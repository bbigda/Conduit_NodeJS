const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Article = sequelize.define('Article', {
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isMatureContent: {
        type: DataTypes.BOOLEAN
    }
})

module.exports = Article

/* {
    "article": {
        "slug": "new-article",
        "title": "New Article",
        "description": "article description",
        "body": "article content",
        "isMatureContent": false,
        "createdAt": "2022-03-04T12:46:22.579Z",
        "updatedAt": "2022-03-04T12:46:22.579Z",
        "UserEmail": "admin@admin.pl",
        "tagList": [],
        "author": {
            "username": "admin",
            "bio": null,
            "image": null
        }
    }
} */
