<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Migrations

To work with typeorm database migrations you first you need create migrations


To create new migrations you need run that command
```
    MIGRATION_NAME=name-you-migrations npm run migration:create
```

After that if all column been writed inside migrations, must need run migrations

```
    yarn migration:run
    
    and must return message
    
    Migration MigrationName has been executed successfully.
```

But when have situation with some error or you must revert migration you must run command

```
     yarn migration:revert
```

