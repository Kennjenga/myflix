# Updating Prisma Schema and Database Synchronization

To reflect changes in your MySQL schema using Prisma, follow these steps:

## 1. Update Your Prisma Schema (`schema.prisma`)

Ensure that your `schema.prisma` file accurately reflects the changes you made in your MySQL schema. This file defines your data model and is crucial for Prisma to understand your database structure.

## 2. Introspect Your Database (if needed)

If you made direct changes to your MySQL schema outside of Prisma migrations, you need to sync your `schema.prisma` with the actual database schema. Use the following command to introspect the current state of your MySQL database and update your `schema.prisma` accordingly:

```bash
npx prisma db pull
```

This command will fetch the current database schema and update your `schema.prisma` file to match it.

## 3. Generate the Prisma Client

After updating your `schema.prisma`, you need to regenerate the Prisma client. The Prisma client is an auto-generated and type-safe query builder for your database. Run the following command to regenerate it:

```bash
npx prisma generate
```

This command will generate the Prisma client based on the updated `schema.prisma` file.

## 4. Run Migrations (if needed)

If you have made changes in your `schema.prisma` and need to update your database schema accordingly, you should run migrations. Use the following command to apply the changes defined in your `schema.prisma` to your database:

```bash
npx prisma migrate dev
```

This command will create a new migration file based on the changes in your `schema.prisma` and apply it to your database.

By following these steps, you can ensure that your Prisma schema and MySQL database are in sync, allowing you to leverage Prisma's powerful features for database management and querying.

````
DELIMITER $$

CREATE TRIGGER set_end_date_before_insert
BEFORE INSERT ON `myflix`.`user_subscription`
FOR EACH ROW
BEGIN
    IF NEW.end_date IS NULL THEN
        SET NEW.end_date = DATE_ADD(NEW.start_date, INTERVAL 1 MONTH);
    END IF;
END$$

DELIMITER ;```
````
