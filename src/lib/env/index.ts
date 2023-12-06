export default {
  DatabaseHost: process.env["DATABASE_HOST"] as string,
  DatabasePort: parseInt(process.env["DATABASE_PORT"] as string) ?? 3306,
  DatabaseUser: process.env["DATABASE_USER"] as string,
  DatabasePassword: process.env["DATABASE_PASSWORD"] as string,
  DatabaseName: process.env["DATABASE_NAME"] as string,
};
