const sequelize = require("../utils/database.js");
const Role = require("../models/roles.js"); // Adjust the path if necessary

const roles = [
  { role_name: "Admin" },
  { role_name: "Data Entry Operator" },
  { role_name: "Viewer" },
];

const seedRoles = async () => {
  await sequelize.sync();

  for (const role of roles) {
    const [roleInstance, created] = await Role.findOrCreate({
      where: { role_name: role.role_name },
      defaults: role,
    });

    if (created) {
      console.log(`Role '${role.role_name}' created!`);
    } else {
      console.log(`Role '${role.role_name}' already exists.`);
    }
  }
};

seedRoles().catch(console.error);
