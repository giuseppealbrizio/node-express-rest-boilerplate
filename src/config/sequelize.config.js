/**
 * Example of using sequelize on existing database.
 */

// import { QueryTypes, Sequelize } from 'sequelize';

// export const sequelize = new Sequelize(
//   process.env.MYSQL_DB_STAGE,
//   process.env.MYSQL_USER_STAGE,
//   process.env.MYSQL_PASSWORD_STAGE,
//   {
//     host: process.env.MYSQL_HOST_STAGE,
//     dialect: 'mysql',
//   },
// );

/**
 * Test Sequelize Connection
 */

// export const testSequelize = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// };

/**
 * Example of query with sequelize
 */

// export const selectAllUsers = async () => {
//   try {
//     const users = await sequelize.query('SELECT * FROM `users`', {
//       type: QueryTypes.SELECT,
//     });
//     console.log(users);
//   } catch (e) {
//     throw new Error(e);
//   }
// };
