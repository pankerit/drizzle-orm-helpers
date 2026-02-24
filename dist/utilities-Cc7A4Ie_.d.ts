import { ColumnBuilderBase, AnyColumn, Table, View, Subquery, WithSubquery, SQLWrapper, InferSelectModel, Column, SQL, Placeholder, ColumnsSelection } from 'drizzle-orm';
import { AnyMySqlSelect, MySqlSchema, MySqlSelect, SubqueryWithSelection as SubqueryWithSelection$1, WithSubqueryWithSelection as WithSubqueryWithSelection$3 } from 'drizzle-orm/mysql-core';
import { AnyPgSelect, PgSchema, PgSelect, SubqueryWithSelection as SubqueryWithSelection$2, WithSubqueryWithSelection as WithSubqueryWithSelection$1 } from 'drizzle-orm/pg-core';
import { AnySQLiteSelect, SQLiteSelect, SubqueryWithSelection as SubqueryWithSelection$3, WithSubqueryWithSelection as WithSubqueryWithSelection$2 } from 'drizzle-orm/sqlite-core';
import { SetOptional } from 'type-fest';

/**
 * Dialect agnostic select.
 *
 * @see PgSelect.
 * @see MySqlSelect
 * @see SQLiteSelect
 */
type Select = SetOptional<PgSelect | MySqlSelect | SQLiteSelect, 'where'>;
/**
 * Dialect-agnostic schema. Excludes SQLite.
 */
type Schema = PgSchema | MySqlSchema;
/**
 * Dialect-agnostic subquery with selection.
 */
type SubqueryWithSelection<TSelection extends ColumnsSelection, TName extends string> = SubqueryWithSelection$1<TSelection, TName> | SubqueryWithSelection$2<TSelection, TName> | SubqueryWithSelection$3<TSelection, TName>;
/**
 * Dialect-agnostic with subquery with selection.
 */
type WithSubqueryWithSelection<TSelection extends ColumnsSelection, TAlias extends string> = WithSubqueryWithSelection$1<TSelection, TAlias> | WithSubqueryWithSelection$2<TSelection, TAlias> | WithSubqueryWithSelection$3<TSelection, TAlias>;
/**
 * Dialect agnostic AnySelect.
 *
 * @see AnyPgSelect
 * @see AnyMySqlSelect
 * @see AnySQLiteSelect
 */
type AnySelect = SetOptional<AnyPgSelect | AnyMySqlSelect | AnySQLiteSelect, 'where'>;
/**
 * Infer type of table column.
 */
type InferColumnType<T extends (...config: never[]) => ColumnBuilderBase> = AnyColumn<Pick<ReturnType<T>['_'], 'data' | 'dataType'>>;
/**
 * Infer any SQL wrapper's expected return data type.
 */
type InferData<T extends SQLWrapper> = T extends Table ? InferSelectModel<T> : T extends Column ? T['_']['notNull'] extends true ? T['_']['data'] : T['_']['data'] | null : T extends View | Subquery ? T['_']['selectedFields'] : T extends SQL<infer U> ? U : T extends SQL.Aliased<infer U> ? U : unknown;
/**
 * Infer table columns or (sub)query fields.
 */
type InferColumns<T extends Table | View | Subquery | WithSubquery | AnySelect> = T extends Table ? T['_']['columns'] : T extends View | Subquery | WithSubquery | AnySelect ? T['_']['selectedFields'] : never;
/**
 * Infer a table's name or a (sub)query's alias.
 */
type InferNameOrAlias<T extends SQLWrapper> = T extends Table | View | Column ? T['_']['name'] : T extends Subquery | WithSubquery ? T['_']['alias'] : T extends AnySelect ? T['_']['tableName'] : T extends SQL.Aliased ? T['fieldAlias'] : T extends Placeholder ? T['name'] : undefined;
/**
 * Should replace `getTableColumns` to allow for more input versatility.
 *
 * @see https://github.com/drizzle-team/drizzle-orm/pull/1789
 */
declare function getColumns<T extends Table | View | Subquery<string, ColumnsSelection> | WithSubquery<string, ColumnsSelection> | AnySelect>(table: T): InferColumns<T>;
/**
 * Get a table's name or a (sub)query's alias.
 */
declare function getNameOrAlias<T extends SQLWrapper>(query: T): InferNameOrAlias<T>;
/**
 * Paginate a query.
 */
declare function paginate<T extends Select>(qb: T, { page, size }: {
    page: number;
    size?: number;
}): PgSelect | MySqlSelect | SQLiteSelect;

export { type AnySelect as A, type InferData as I, type Schema as S, type WithSubqueryWithSelection as W, type InferColumnType as a, type InferColumns as b, type InferNameOrAlias as c, type Select as d, type SubqueryWithSelection as e, getNameOrAlias as f, getColumns as g, paginate as p };
