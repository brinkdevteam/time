import {
    createConnection,
  } from 'typeorm';
import migrations from './entities/migrations';
async function buildConnectionPromise() {
    const connection = await createConnection({
      entities: ["**/*.entity.ts"],
      logging: (() => {
        const logging = process.env.TYPEORM_LOGGING;
        if (logging !== undefined) {
          if (logging === 'all') {
            return 'all';
          }
          if (logging === 'true') {
            return true;
          }
          const pickedLoggings: Array<'query'|'schema'|'error'|'warn'|'info'|'log'|'migration'> = [];
          for (const oneLogging of logging.split(',')) {
            switch (oneLogging) {
              case 'query':
              case 'schema':
              case 'error':
              case 'warn':
              case 'info':
              case 'log':
              case 'migration':
                pickedLoggings.push(oneLogging);
                break;
              default:
                throw new Error(`unrecognized logging option: ${oneLogging}`);
            }
          }
          return pickedLoggings;
        }
      })(),
      migrations,
      type: 'postgres',
      url: "postgresql://time:time@localhost/time",

      // Because the migrations run after synchronization, we actually
      // don’t enable migrations or synchronization and instead manage
      // it manually.
      migrationsRun: false,
      synchronize: false,
    });
    // You must explicitly create migrations for all data changes other
    // than creating isolated new tables and optional columns.
    // Migrations run prior to synchronization (now that we’re forcing
    // it).
    //
    // Synchronization will create missing tables and columns and drop
    // extraneous ones. This eliminates the need to write migrations
    // that introduce new tables depending on the development
    // cycle. However, due to migrations’ dependency on database state,
    // omitting createTable() migrations and relying on this can result
    // in it being impossible to upgrade from some versions of the app
    // to others. For the most part, since we will only have one
    // deployment and will know what is out there versus not, this
    // complexity can be avoided with care. Though this is likely to be
    // a source of deployment failures. Ugh, how to avoid writing and
    // committing so much boilerplate (i.e., createTable migrations) and
    // still be safe? It will be safe as long as all of your migrations
    // are written to be conditional (because then we’re not relying on
    // “has run already?” detection)!
    await connection.runMigrations();
    await connection.synchronize();

    return connection;
  }
export default buildConnectionPromise();
