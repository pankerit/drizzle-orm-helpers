import * as drizzle_orm from 'drizzle-orm';

/**
 * MySQL random function.
 *
 * @example
 *
 * ```sql
 * rand();
 * ```
 *
 * @returns Random number between 0 and 1.
 */
declare function random(): drizzle_orm.SQL<number>;

export { random };
