/*************************************************************************
Users TABLE
*************************************************************************/

module.exports = function (sequelize, Sequelize) {
    var users = sequelize.define(
        "users",
        {
            userid: {
                type: Sequelize.INTEGER,
                field: "userid",
                primaryKey: true,
                autoIncrement: true,
            },
            cognitouserid: {
                type: Sequelize.STRING,
                field: "cognitouserid",
                comment: "id of user on cognito",
            },
            fullname: {
                type: Sequelize.STRING,
                field: "fullname",
            },
            email: {
                type: Sequelize.STRING,
                field: "email",
            },
            /* userType: {
                type: Sequelize.STRING,
                field: "userType",
            },
            pic: {
                type: Sequelize.TEXT,
                field: "pic",
                defaultValue: null,
            }, */
        },
        {
            freezeTableName: true,
        }
    )

    // users.associate = function (models) {
    //     models.users.hasMany(models.quizes, { onDelete: "cascade", targetKey: "userid", foreignKey: "userid" })
    //     models.users.hasMany(models.questions, { onDelete: "cascade", targetKey: "userid", foreignKey: "userid" })
    //     models.users.hasMany(models.questionFeedbacks, { onDelete: "cascade", targetKey: "userid", foreignKey: "userid" })
    // }

    return users
}
