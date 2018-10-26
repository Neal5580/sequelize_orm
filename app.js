const Sequelize = require("sequelize");

const connection = new Sequelize("sequelize", "homestead", "secret", {
    host: "192.168.10.10",
    dialect: "mysql",
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

connection
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch(err => {
        console.error("Unable to connect to the database:", err);
    });

const Article = connection.define(
    "article",
    {
        slug: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            validate: {
                len: {
                    args: [10, 150],
                    msg:
                        "please enter a title with at least 10 chars and no more then 150"
                }
            }
        },
        body: {
            type: Sequelize.TEXT,
            defaultValue: "Comming soon...",
            validate: {
                startsWithUpper: bodyVal => {
                    var first = bodyVal.charAt(0);
                    var startsWithUpper = first === first.toUpperCase();
                    if (!startsWithUpper) {
                        throw new Error(
                            "First letter must be a uppercase letter"
                        );
                    }
                }
            }
        }
    },
    {
        hooks: {
            beforeValidate: () => {
                console.log("beforeValidate");
            },
            afterValidate: () => {
                console.log("afterValidate");
            },
            beforeCreate: () => {
                console.log("beforeCreate");
            },
            afterCreate: res => {
                console.log(
                    "afterCreate: created article with slug",
                    res.dataValues.slug
                );
            }
        }
    }
);

connection
    .sync({ force: true })
    .then(() => {
        /*Article.create({
        title: "demo title",
        body: "Neal"
    });*/
        /*Article.findById(1).then(article => {
        console.log(article.dataValues);
    });

    Article.findAll().then(articles => {
        console.log(articles.length);
    });*/
        Article.create(
            {
                title: "1111111111111",
                slug: "1",
                body: "Neal"
            },
            {
                //Only "title" and "body" attributes are allowed to be inserted by user
                fileds: ["title", "body"]
            }
        ).then(({ dataValues }) => {
            console.log(dataValues);
        });

        //Step1: For create entry, but do not insert
        var articleInstance = Article.build({
            title: "2222222222",
            slug: "2",
            body: "Neal"
        });
        //Step2: Then save entry
        articleInstance.save();

        //insert muitple rows
        Article.bulkCreate(
            [
                {
                    title: "3333333333",
                    slug: "3",
                    body: "Neal"
                },
                {
                    title: "44444444444",
                    slug: "4",
                    body: "Neal"
                },
                {
                    title: "5555555555",
                    slug: "5",
                    body: "Neal"
                }
            ],
            {
                validate: true
            }
        );
    })
    .catch(error => {
        console.log(error);
    });
