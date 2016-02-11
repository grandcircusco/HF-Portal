(function(){

  "use strict";

  module.exports = function(sequelize, DataTypes) {

      return sequelize.define("tags", {

          id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
          name: DataTypes.STRING

      },{

          timestamps: false, // add updated_at and created_at
          paranoid: false // add deleted_at

      });

  };

})();

