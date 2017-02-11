const Sequelize = require('sequelize');
const model =  (sequelize, DataTypes) => {
  return sequelize.define("Users", {
    title:  {
      type     : DataTypes.STRING,
      allowNull: false
    },
    description:  {
      type     : DataTypes.STRING,
      allowNull: true
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    classMethods: {}
  });
};

module.exports = class Db {

  constructor(config) {
    this.initConnection(config.db)
      .then(() => console.log('sequelize sync finished OK'))
      .catch(err => console.error(err));
  }

  async initConnection({database, username, password, port, host, pool}) {
    const seq = new Sequelize(database, username, password, {
      host,
      dialect: 'postgres',
      port,
      pool
    });
    try {
      await seq.authenticate();

      console.log('db connection established successfully');
      this.Todo = model(seq, Sequelize);

      return seq.sync({ force: false });
    } catch (err) {
      return Promise.reject(err);
    }


  }
};


