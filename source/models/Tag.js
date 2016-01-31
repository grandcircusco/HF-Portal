(function(){

  "use strict";

  module.exports = function(sequelize, DataTypes) {

      return sequelize.define("tags", {

          id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
          name: DataTypes.STRING

      },{

          timestamps: true, // add updated_at and created_at
          paranoid: true // add deleted_at

      });

  };

})();

