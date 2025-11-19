import * as drizzle_orm from 'drizzle-orm';
import { SQLWrapper, SQL } from 'drizzle-orm';
import { TupleToUnion } from 'type-fest';
import { I as InferData } from './utilities-BXdmImJV.cjs';
export { A as AnySelect, c as InferColumnType, d as InferColumns, e as InferNameOrAlias, a as Schema, S as Select, b as SubqueryWithSelection, W as WithSubqueryWithSelection, g as getColumns, f as getNameOrAlias, p as paginate } from './utilities-BXdmImJV.cjs';
import 'drizzle-orm/mysql-core';
import 'drizzle-orm/pg-core';
import 'drizzle-orm/sqlite-core';

type NonUndefinable<T> = T extends undefined ? never : T;

/**
 * Distinct keyword.
 */
declare function distinct<T extends SQLWrapper>(statement: T): SQL<InferData<T>>;
/**
 * Case condition chain.
 *
 * @example
 *
 * ```ts
 * cases([[eq(thing, other), 2]], 3);
 * ```
 *
 * @example
 *
 * ```sql
 * CASE
 *  WHEN thing = other THEN 2
 *  ELSE 3
 * END;
 * ```
 *
 * @todo Implement smarter typing to identify confirmable early returns with truthy conditions.
 */
declare function cases<const C extends ([SQLWrapper, unknown] | undefined)[], const F, T = NonUndefinable<TupleToUnion<C>>, R = (T extends [infer T0, infer T1] ? T0 extends SQL<false | null | 0 | 'f' | 'F' | '0'> ? never : T1 extends SQLWrapper ? InferData<T1> : T1 : never) | (F extends void ? never : F extends SQLWrapper ? InferData<F> : F)>(conditionals: C, fallback?: F): SQL<R>;

type RemoveNull<T> = T extends null ? never : T;
type CoalesceSQL<T extends unknown[], N extends boolean = true, R = never> = T extends [
    infer H,
    ...infer T
] ? CoalesceSQL<T, H extends SQL | SQL.Aliased ? (null extends InferData<H> ? true : false) : never, R | RemoveNull<H extends SQL | SQL.Aliased ? InferData<H> : never>> : N extends true ? R | null : R;
/**
 * @see https://www.postgresql.org/docs/current/functions-conditional.html#FUNCTIONS-COALESCE-NVL-IFNULL
 */
declare function coalesce<T extends unknown[]>(...values: [...T]): SQL<CoalesceSQL<T, true, never>>;
/**
 * Return null if value meets condition. Useful to coalesce to something else.
 *
 * @see https://www.postgresql.org/docs/current/functions-conditional.html#FUNCTIONS-NULLIF
 */
declare function nullIf<V extends SQLWrapper, C>(value: V, condition: C): SQL<V | null>;
/**
 * @see https://www.postgresql.org/docs/current/functions-conditional.html#FUNCTIONS-GREATEST-LEAST
 */
declare function greatest<T extends unknown[]>(...values: [...T]): SQL<{ [I in keyof T]: T[I] extends SQLWrapper ? InferData<T[I]> : T[I]; }[number]>;
/**
 * @see https://www.postgresql.org/docs/current/functions-conditional.html#FUNCTIONS-GREATEST-LEAST
 */
declare function least<T extends unknown[]>(...values: [...T]): SQL<{ [I in keyof T]: T[I] extends SQLWrapper ? InferData<T[I]> : T[I]; }[number]>;

/**
 * Add values.
 */
declare function add<T extends (SQLWrapper | number)[]>(...values: T): SQL<T[number] extends SQLWrapper ? InferData<T[number]> : T[number]>;
/**
 * Subtract values.
 */
declare function subtract<T extends (SQLWrapper | number)[]>(...values: T): SQL<T[number] extends SQLWrapper ? InferData<T[number]> : T[number]>;
/**
 * Divide values.
 */
declare function divide<T extends (SQLWrapper | number)[]>(...values: T): SQL<T[number] extends SQLWrapper ? InferData<T[number]> : T[number]>;
/**
 * Multiply values.
 */
declare function multiply<T extends (SQLWrapper | number)[]>(...values: T): SQL<T[number] extends SQLWrapper ? InferData<T[number]> : T[number]>;

/**
 * SQL template true value.
 */
declare const $true: drizzle_orm.SQL<true>;
/**
 * SQL template false value.
 */
declare const $false: drizzle_orm.SQL<false>;
/**
 * SQL template boolean value.
 */
declare function $boolean<T extends boolean>(value: T): drizzle_orm.SQL<T>;
/**
 * SQL template null value.
 */
declare const $null: drizzle_orm.SQL<null>;
/**
 * @example
 *
 * ```sql
 * current_timestamp();
 * ```
 */
declare const $currentTimestamp: drizzle_orm.SQL<Date>;

export { $boolean, $currentTimestamp, $false, $null, $true, InferData, add, cases, coalesce, distinct, divide, greatest, least, multiply, nullIf, subtract };
