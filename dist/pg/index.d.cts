import * as drizzle_orm_pg_core from 'drizzle-orm/pg-core';
import * as drizzle_orm from 'drizzle-orm';
import { SQLWrapper, SQL, Table, View, Subquery, ColumnsSelection, AnyColumn, AnyTable, TableConfig, InferSelectModel } from 'drizzle-orm';
import { ValueOf, SetNonNullable } from 'type-fest';
import * as geojson from 'geojson';
import { GeoJsonGeometryTypes, Geometry } from 'geojson';
import { I as InferData } from '../utilities-BXdmImJV.cjs';
import { z } from 'zod';
import 'drizzle-orm/mysql-core';
import 'drizzle-orm/sqlite-core';

/**
 * Ci-text postgres column type.
 *
 * @see https://www.postgresql.org/docs/current/citext.html
 */
declare const citext: {
    (): drizzle_orm_pg_core.PgCustomColumnBuilder<{
        name: "";
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: string;
        driverParam: unknown;
        enumValues: undefined;
    }>;
    <TConfig extends Record<string, any>>(fieldConfig?: TConfig | undefined): drizzle_orm_pg_core.PgCustomColumnBuilder<{
        name: "";
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: string;
        driverParam: unknown;
        enumValues: undefined;
    }>;
    <TName extends string>(dbName: TName, fieldConfig?: unknown): drizzle_orm_pg_core.PgCustomColumnBuilder<{
        name: TName;
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: string;
        driverParam: unknown;
        enumValues: undefined;
    }>;
};

/**
 * Postgres cube column type with customizable amount of dimensions.
 *
 * @see https://www.postgresql.org/docs/current/cube.html
 */
declare const cube: {
    (): drizzle_orm_pg_core.PgCustomColumnBuilder<{
        name: "";
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: number[] | [number[], number[]];
        driverParam: number[] | [number[], number[]];
        enumValues: undefined;
    }>;
    <TConfig extends Record<string, any>>(fieldConfig?: TConfig | undefined): drizzle_orm_pg_core.PgCustomColumnBuilder<{
        name: "";
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: number[] | [number[], number[]];
        driverParam: number[] | [number[], number[]];
        enumValues: undefined;
    }>;
    <TName extends string>(dbName: TName, fieldConfig?: unknown): drizzle_orm_pg_core.PgCustomColumnBuilder<{
        name: TName;
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: number[] | [number[], number[]];
        driverParam: number[] | [number[], number[]];
        enumValues: undefined;
    }>;
};

/**
 * Makes a one dimensional cube with both coordinates the same.
 *
 * @example
 *
 * ```sql
 * -- cube ( float8 ) → cube
 * cube(1) → (1)
 * ```
 *
 * Makes a one dimensional cube.
 *
 * @example
 *
 * ```sql
 * -- cube ( float8, float8 ) → cube
 * cube(1, 2) → (1),(2)
 * ```
 *
 * Makes a zero-volume cube using the coordinates defined by the array.
 *
 * @example
 *
 * ```sql
 * -- cube ( float8[] ) → cube
 * cube(ARRAY[1,2,3]) → (1, 2, 3)
 * ```
 *
 * Makes a cube with upper right and lower left coordinates as defined by the two arrays, which must
 * be of the same length.
 *
 * @example
 *
 * ```sql
 * -- cube ( float8[], float8[] ) → cube
 * cube(ARRAY[1,2], ARRAY[3,4]) → (1, 2),(3, 4)
 * ```
 *
 * Makes a new cube by adding a dimension on to an existing cube, with the same values for both
 * endpoints of the new coordinate. This is useful for building cubes piece by piece from calculated
 * values.
 *
 * @example
 *
 * ```sql
 * -- cube ( cube, float8 ) → cube
 * cube('(1,2),(3,4)'::cube, 5) → (1, 2, 5),(3, 4, 5)
 * ```
 *
 * Makes a new cube by adding a dimension on to an existing cube. This is useful for building cubes
 * piece by piece from calculated values.
 *
 * @example
 *
 * ```sql
 * --cube ( cube, float8, float8 ) → cube
 * cube('(1,2),(3,4)'::cube, 5, 6) → (1, 2, 5),(3, 4, 6)
 * ```
 */
declare function makeCube<T extends [number] | [number, number] | number[] | [number[], number[]] | [SQLWrapper, number] | [SQLWrapper, number, number]>(...args: T): drizzle_orm.SQL<number[]>;
/**
 * Returns the number of dimensions of the cube.
 *
 * @example
 *
 * ```sql
 * --cube_dim ( cube ) → integer
 * cube_dim('(1,2),(3,4)') → 2
 * ```
 */
declare function cubeDim(cube: SQLWrapper): drizzle_orm.SQL<number>;
/**
 * Returns the n-th coordinate value for the lower left corner of the cube.
 *
 * @example
 *
 * ```sql
 * -- cube_ll_coord ( cube, integer ) → float8
 * cube_ll_coord('(1,2),(3,4)', 2) → 2
 * ```
 */
declare function cubeLowerLeftCoord(): void;
/**
 * ```
 * Returns the n-th coordinate value for the upper right corner of the cube.
 * ```
 *
 * @example
 *
 * ```sql
 * -- cube_ur_coord ( cube, integer ) → float8
 * cube_ur_coord('(1,2),(3,4)', 2) → 4
 * ```
 */
declare function cubeUpperRightCoord(): void;
/**
 * Returns true if the cube is a point, that is, the two defining corners are the same.
 *
 * @example
 *
 * ```sql
 * -- cube_is_point ( cube ) → boolean
 * cube_is_point(cube(1,1)) → t
 * ```
 */
declare function cubeIsPoint(cube: SQLWrapper): drizzle_orm.SQL<boolean>;
/**
 * Returns the distance between two cubes. If both cubes are points, this is the normal distance
 * function.
 *
 * @example
 *
 * ```sql
 * -- cube_distance ( cube, cube ) → float8
 * cube_distance('(1,2)', '(3,4)') → 2.8284271247461903
 * ```
 */
declare function cubeDistance(...cubes: [SQLWrapper, SQLWrapper]): drizzle_orm.SQL<number>;
/**
 * Makes a new cube from an existing cube, using a list of dimension indexes from an array. Can be
 * used to extract the endpoints of a single dimension, or to drop dimensions, or to reorder them as
 * desired.
 *
 * @example
 *
 * ```sql
 * cube_subset ( cube, integer[] ) → cube
 * cube_subset(cube('(1,3,5),(6,7,8)'), ARRAY[2]) → (3),(7)
 * cube_subset(cube('(1,3,5),(6,7,8)'), ARRAY[3,2,1,1]) → (5, 3, 1, 1),(8, 7, 6, 6)
 * ```
 */
declare function cubeSubset(): void;
/**
 * Produces the union of two cubes.
 *
 * @example
 *
 * ```sql
 * -- cube_union ( cube, cube ) → cube
 * cube_union('(1,2)', '(3,4)') → (1, 2),(3, 4)
 * ```
 */
declare function cubeUnion(): void;
/**
 * Produces the intersection of two cubes.
 *
 * @example
 *
 * ```sql
 * -- cube_inter ( cube, cube ) → cube
 * cube_inter('(1,2)', '(3,4)') → (3, 4),(1, 2)
 * ```
 */
declare function cubeInter(): void;
/**
 * Increases the size of the cube by the specified radius r in at least n dimensions. If the radius
 * is negative the cube is shrunk instead. All defined dimensions are changed by the radius r.
 * Lower-left coordinates are decreased by r and upper-right coordinates are increased by r. If a
 * lower-left coordinate is increased to more than the corresponding upper-right coordinate (this
 * can only happen when r < 0) than both coordinates are set to their average. If n is greater than
 * the number of defined dimensions and the cube is being enlarged (r > 0), then extra dimensions
 * are added to make n altogether; 0 is used as the initial value for the extra coordinates. This
 * function is useful for creating bounding boxes around a point for searching for nearby points.
 *
 * @example
 *
 * ```sql
 * -- cube_enlarge ( c cube, r double, n integer ) → cube
 * cube_enlarge('(1,2),(3,4)', 0.5, 3) → (0.5, 1.5, -0.5),(3.5, 4.5, 0.5)
 * ```
 */
declare function cubeEnlarge(): void;

declare const DISTANCE_TYPES: {
    readonly EUCLIDIAN: "euclidian";
    readonly TAXICAB: "taxicab";
    readonly CHEBYSHEV: "chebyshev";
};
type DistanceType = ValueOf<typeof DISTANCE_TYPES>;

/**
 * Do the cubes overlap?
 *
 * @example
 *
 * ```sql
 * cube && cube → boolean
 * ```
 */
declare function overlaps(left: SQLWrapper, right: unknown): drizzle_orm.SQL<unknown>;
/**
 * Does the first cube contain the second?
 *
 * @example
 *
 * ```sql
 * cube @> cube → boolean
 * ```
 */
declare function contains(left: SQLWrapper, right: unknown): drizzle_orm.SQL<unknown>;
/**
 * Is the first cube contained in the second?
 *
 * @example
 *
 * ```sql
 * cube <@ cube → boolean
 * ```
 */
declare function contained(left: SQLWrapper, right: unknown): drizzle_orm.SQL<unknown>;
/**
 * Extracts the n-th coordinate of the cube (counting from 1).
 *
 * @example
 *
 * ```sql
 * cube -> integer → float8
 * ```
 *
 * Extracts the n-th coordinate of the cube, counting in the following way: n = 2 * k - 1 means
 * lower bound of k-th dimension, n = 2 * k means upper bound of k-th dimension. Negative n denotes
 * the inverse value of the corresponding positive coordinate. This operator is designed for
 * KNN-GiST support.
 *
 * @example
 *
 * ```sql
 * cube ~> integer → float8
 * ```
 */
declare function extract(left: SQLWrapper, right: unknown): drizzle_orm.SQL<unknown>;
/**
 * Computes the distance between two cubes.
 *
 * @example
 *
 * ```sql
 * -- Computes the Euclidean distance between the two cubes.
 * cube <-> cube → float8
 * ```
 *
 * @example
 *
 * ```sql
 * -- Computes the taxicab (L-1 metric) distance between the two cubes.
 * cube <#> cube → float8
 * ```
 *
 * @example
 *
 * ```sql
 * -- Computes the Chebyshev (L-inf metric) distance between the two cubes.
 * cube <=> cube → float8
 * ```
 */
declare function distance(left: SQLWrapper, right: unknown, { type }?: {
    type?: DistanceType;
}): drizzle_orm.SQL<unknown>;

/**
 * @see https://www.postgresql.org/docs/current/fuzzystrmatch.html#FUZZYSTRMATCH-SOUNDEX
 */
declare function soundex(text: string | SQLWrapper): drizzle_orm.SQL<string>;
/**
 * @see https://www.postgresql.org/docs/current/fuzzystrmatch.html#FUZZYSTRMATCH-DAITCH-MOKOTOFF
 */
declare function difference(...texts: [string | SQLWrapper, string | SQLWrapper]): drizzle_orm.SQL<number>;
/**
 * @see https://www.postgresql.org/docs/current/fuzzystrmatch.html#FUZZYSTRMATCH-DAITCH-MOKOTOFF
 */
declare function daitch_mokotoff(source: SQLWrapper | string): drizzle_orm.SQL<string[]>;

/**
 * Generate a nanoid using a postgres implementation of the nanoid function.
 *
 * @param config.optimized Should the postgres extension use optimization.
 * @param config.size The length of the nanoid generated. If explicit nullish is passed, will
 *   default to the Postgres function's default size.
 * @param config.alphabet The set of characters to pick randomly from. Defaults to
 *   '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'. If explicit nullish is
 *   passed, will default to the Postgres function's default alphabet.
 * @param config.additionalBytesFactor
 * @param config.mask
 * @param config.step
 * @see {@link https://github.com/iolyd/drizzle-orm-helpers/blob/main/sql/nanoid.sql Postgres implementation of the nanoid generator}
 * @see https://discord.com/channels/1043890932593987624/1093946807911989369/1100459226087825571
 * @todo Stay up to date when default values will accept 'sql' without having to pass param to
 *   sql.raw()
 */
declare function nanoid({ optimized, size, alphabet, additionalBytesFactor, mask, step, }?: {
    size?: number;
    alphabet?: string;
} & ({
    optimized?: false;
    additionalBytesFactor?: number;
    mask?: never;
    step?: never;
} | {
    optimized: true;
    additionalBytesFactor?: never;
    mask?: number;
    step?: number;
})): drizzle_orm.SQL<string>;

declare function similar(): void;

/**
 * Common coordinate projection systems and their Spatial Reference System ID (EPSG).
 *
 * @example
 *
 * ```sql
 * SELECT * FROM extensions.spatial_ref_sys;
 * ```
 *
 * @todo Add more aliased systems.
 */
declare const SRIDS: {
    /**
     * Lat/Lon globe-based coordinate system. Uses degrees to represent spheroid position.
     */
    readonly WGS84: 4326;
    /**
     * Lat/Lon flat-map coordinates in meters. Generally the default system used for web apps.
     */
    readonly WEB_MERCATOR: 3857;
};
type Srid = ValueOf<typeof SRIDS> | `${ValueOf<typeof SRIDS>}`;

/**
 * PostGIS column type for generic or specific geographies.
 *
 * **⚠️ Warning ⚠️**
 *
 * Uses a nasty trick to get the data back as properly formatted GeoJSON rather than WKT. Expect
 * things to break.
 *
 * @see Unstable until better support for custom type custom select is available (e.g. https://github.com/drizzle-team/drizzle-orm/pull/1423)
 */
declare function geography<TName extends string, TGeography extends GeoJsonGeometryTypes, TZ extends boolean, TM extends boolean, TSrid extends Srid>(name: TName, config?: {
    type?: TGeography;
    z?: TZ;
    m?: TM;
    srid?: TSrid;
}): drizzle_orm_pg_core.PgCustomColumnBuilder<{
    name: `st_asgeojson"("${TName}") as "${TName}`;
    dataType: "custom";
    columnType: "PgCustomColumn";
    data: Extract<geojson.Point, {
        type: TGeography;
    }> | Extract<geojson.MultiPoint, {
        type: TGeography;
    }> | Extract<geojson.LineString, {
        type: TGeography;
    }> | Extract<geojson.MultiLineString, {
        type: TGeography;
    }> | Extract<geojson.Polygon, {
        type: TGeography;
    }> | Extract<geojson.MultiPolygon, {
        type: TGeography;
    }> | Extract<geojson.GeometryCollection<Geometry>, {
        type: TGeography;
    }>;
    driverParam: string;
    enumValues: undefined;
}>;
/**
 * - PostGIS column type for generic or specific geometries.
 *
 * **⚠️ Warning ⚠️**
 *
 * Uses a nasty trick to get the data back as properly formatted GeoJSON rather than WKT. Expect
 * things to break.
 *
 * @see Unstable until better support for custom type custom select is available (e.g. https://github.com/drizzle-team/drizzle-orm/pull/1423)
 */
declare function geometry<TName extends string, TGeometry extends GeoJsonGeometryTypes, TZ extends boolean, TM extends boolean, TSrid extends Srid>(name: TName, config?: {
    type?: TGeometry;
    z?: TZ;
    m?: TM;
    srid?: TSrid;
}): drizzle_orm_pg_core.PgCustomColumnBuilder<{
    name: `st_asgeojson"("${TName}") as "${TName}`;
    dataType: "custom";
    columnType: "PgCustomColumn";
    data: Extract<geojson.Point, {
        type: TGeometry;
    }> | Extract<geojson.MultiPoint, {
        type: TGeometry;
    }> | Extract<geojson.LineString, {
        type: TGeometry;
    }> | Extract<geojson.MultiLineString, {
        type: TGeometry;
    }> | Extract<geojson.Polygon, {
        type: TGeometry;
    }> | Extract<geojson.MultiPolygon, {
        type: TGeometry;
    }> | Extract<geojson.GeometryCollection<Geometry>, {
        type: TGeometry;
    }>;
    driverParam: string;
    enumValues: undefined;
}>;

/**
 * Postgres regconfig cfgnames.
 *
 * @example
 *
 * ```sql
 * SELECT json_object_agg(upper(cfgname), cfgname)
 * FROM pg_catalog.pg_ts_config;
 * ```
 */
declare const REGCONFIGS: {
    readonly SIMPLE: "simple";
    readonly ARABIC: "arabic";
    readonly ARMENIAN: "armenian";
    readonly BASQUE: "basque";
    readonly CATALAN: "catalan";
    readonly DANISH: "danish";
    readonly DUTCH: "dutch";
    readonly ENGLISH: "english";
    readonly FINNISH: "finnish";
    readonly FRENCH: "french";
    readonly GERMAN: "german";
    readonly GREEK: "greek";
    readonly HINDI: "hindi";
    readonly HUNGARIAN: "hungarian";
    readonly INDONESIAN: "indonesian";
    readonly IRISH: "irish";
    readonly ITALIAN: "italian";
    readonly LITHUANIAN: "lithuanian";
    readonly NEPALI: "nepali";
    readonly NORWEGIAN: "norwegian";
    readonly PORTUGUESE: "portuguese";
    readonly ROMANIAN: "romanian";
    readonly RUSSIAN: "russian";
    readonly SERBIAN: "serbian";
    readonly SPANISH: "spanish";
    readonly SWEDISH: "swedish";
    readonly TAMIL: "tamil";
    readonly TURKISH: "turkish";
    readonly YIDDISH: "yiddish";
};
type Regconfig = ValueOf<typeof REGCONFIGS>;
type RegconfigString = Regconfig | (string & NonNullable<unknown>);
declare const RANGE_BOUND_TYPES: {
    readonly INCLUSIVE: "inclusive";
    readonly EXCLUSIVE: "exclusive";
};
type RangeBoundType = ValueOf<typeof RANGE_BOUND_TYPES>;
/**
 * Value for app-side representation of empty postgres ranges.
 */
declare const RANGE_EMPTY: {
    lower: null;
    upper: null;
};
declare const INTERVAL_UNITS: {
    readonly YEARS: "years";
    readonly MONTHS: "months";
    readonly WEEKS: "weeks";
    readonly DAYS: "days";
    readonly HOURS: "hours";
    readonly MINUTES: "minutes";
    readonly SECONDS: "seconds";
};
type IntervalUnit = ValueOf<typeof INTERVAL_UNITS>;
declare const INTERVAL_UNITS_ARR_ORDERED: readonly ["years", "months", "weeks", "days", "hours", "minutes", "seconds"];

/**
 * Text-based enum with runtime check and type inferrence. In other words, similar to drizzle's own
 * `text` column with `config.enum` but this time with runtime peace-of mind.
 *
 * If you simply want a union-typed text without runtime safety of values, use drizzle's own `text`
 * with the `config.enum` configuration.
 *
 * @see https://orm.drizzle.team/docs/column-types/pg#text
 */
declare function textenum<TName extends string, const TEnum extends string[] | Readonly<string[]>, TConfig extends {
    enum: TEnum;
    fallback: TConfig['enum'][number] | Error | ((value: string) => TConfig['enum'][number]);
}>(name: TName, config: TConfig): drizzle_orm_pg_core.PgCustomColumnBuilder<{
    name: TName;
    dataType: "custom";
    columnType: "PgCustomColumn";
    data: TConfig["enum"][number];
    driverParam: string;
    enumValues: undefined;
}>;
/**
 * Implements Postgres regconfig. Useful for text search language config storage.
 *
 * @see https://www.postgresql.org/docs/current/textsearch-controls.html
 */
declare const regconfig: {
    (): drizzle_orm_pg_core.PgCustomColumnBuilder<{
        name: "";
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: Regconfig;
        driverParam: unknown;
        enumValues: undefined;
    }>;
    <TConfig extends Record<string, any>>(fieldConfig?: TConfig | undefined): drizzle_orm_pg_core.PgCustomColumnBuilder<{
        name: "";
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: Regconfig;
        driverParam: unknown;
        enumValues: undefined;
    }>;
    <TName extends string>(dbName: TName, fieldConfig?: unknown): drizzle_orm_pg_core.PgCustomColumnBuilder<{
        name: TName;
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: Regconfig;
        driverParam: unknown;
        enumValues: undefined;
    }>;
};
/**
 * Postgres text-search vector.
 */
declare const tsvector: {
    (): drizzle_orm_pg_core.PgCustomColumnBuilder<{
        name: "";
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: string;
        driverParam: unknown;
        enumValues: undefined;
    }>;
    <TConfig extends Record<string, any>>(fieldConfig?: TConfig | undefined): drizzle_orm_pg_core.PgCustomColumnBuilder<{
        name: "";
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: string;
        driverParam: unknown;
        enumValues: undefined;
    }>;
    <TName extends string>(dbName: TName, fieldConfig?: unknown): drizzle_orm_pg_core.PgCustomColumnBuilder<{
        name: TName;
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: string;
        driverParam: unknown;
        enumValues: undefined;
    }>;
};
/**
 * Implements Postgres timestamp range.
 *
 * @see https://www.postgresql.org/docs/current/rangetypes.html
 * @see https://github.com/bendrucker/postgres-date
 */
declare function tsrange<TName extends string, TConfig extends {
    withTimezone?: boolean;
    mode?: 'date' | 'string';
    lowerBound?: RangeBoundType;
    upperBound?: RangeBoundType;
}, TData = TConfig['mode'] extends 'string' ? RangeValue<string> : RangeValue<number | Date>>(name: TName, config?: TConfig): drizzle_orm_pg_core.PgCustomColumnBuilder<{
    name: TName;
    dataType: "custom";
    columnType: "PgCustomColumn";
    data: TData;
    driverParam: string;
    enumValues: undefined;
}>;
/**
 * Implements postgres date range.
 *
 * @see https://orm.drizzle.team/docs/custom-types Timestamp for reference.
 * @see https://www.postgresql.org/docs/current/rangetypes.html
 */
declare function daterange<TName extends string, TConfig extends {
    mode?: 'date' | 'string';
    lowerBound?: RangeBoundType;
    upperBound?: RangeBoundType;
}, TData = TConfig['mode'] extends 'string' ? RangeValue<string> : RangeValue<number | Date>>(name: TName, config?: TConfig): drizzle_orm_pg_core.PgCustomColumnBuilder<{
    name: TName;
    dataType: "custom";
    columnType: "PgCustomColumn";
    data: TData;
    driverParam: string;
    enumValues: undefined;
}>;
/**
 * Implements postgres int4range and int8range types.
 *
 * @param config.size Size of integers, where `4` corresponds to `int4range` and `8`corresponds to a
 *   bigint range (int8range).
 * @see https://www.postgresql.org/docs/current/rangetypes.html
 */
declare function intrange<TName extends string, TConfig extends {
    size?: 4 | 8;
    lowerBound?: RangeBoundType;
    upperBound?: RangeBoundType;
}>(name: TName, config?: TConfig): drizzle_orm_pg_core.PgCustomColumnBuilder<{
    name: TName;
    dataType: "custom";
    columnType: "PgCustomColumn";
    data: RangeValue<number>;
    driverParam: string;
    enumValues: undefined;
}>;
/**
 * Implements postgres numrange type.
 *
 * @see https://www.postgresql.org/docs/current/rangetypes.html
 */
declare function numrange<TName extends string, TConfig extends {
    lowerBound?: RangeBoundType;
    upperBound?: RangeBoundType;
}>(name: TName, config?: TConfig): drizzle_orm_pg_core.PgCustomColumnBuilder<{
    name: TName;
    dataType: "custom";
    columnType: "PgCustomColumn";
    data: RangeValue<number>;
    driverParam: string;
    enumValues: undefined;
}>;

/**
 * Postgres random function.
 *
 * @example
 *
 * ```sql
 * random();
 * ```
 *
 * @returns Random number between 0 and 1.
 */
declare function random(): SQL<number>;
/**
 * Get the current time (dynamically).
 *
 * @example
 *
 * ```sql
 * now();
 * ```
 */
declare function now(): SQL<Date>;
/**
 * True if all input values are true, otherwise false.
 */
declare function boolAnd(...expression: SQLWrapper[]): SQL<boolean>;
/**
 * True if at least one input value is true, otherwise false.
 */
declare function boolOr(...expression: SQLWrapper[]): SQL<boolean>;
/**
 * SQL json_strip_nulls.
 */
declare function jsonStripNulls<T>(json: T): SQL<SetNonNullable<T extends SQLWrapper ? InferData<T> : T, keyof (T extends SQLWrapper ? InferData<T> : T)>>;
/**
 * Aggregate sql values into an sql array.
 *
 * Input values, including nulls, concatenated into an array.
 *
 * Input arrays concatenated into array of one higher dimension (inputs must all have same
 * dimensionality, and cannot be empty or null)
 *
 * @see https://www.postgresql.org/docs/9.5/functions-aggregate.html
 *
 * @todo Implement collapsing for null array with notNull option.
 */
declare function arrayAgg<T extends SQLWrapper>(expression: T): SQL<InferData<T> | null>;
/**
 * @see https://www.postgresql.org/docs/9.5/functions-json.html#FUNCTIONS-JSON-CREATION-TABLE
 */
declare function toJson<T extends SQLWrapper>(anyelement: T): SQL<InferData<T>>;
declare function toJsonb<T extends SQLWrapper>(anyelement: T): SQL<InferData<T>>;
/**
 * Since it is a json method, it should return an unwrapped (raw) type instead of an SQL wrapped
 * type.
 */
declare function rowToJson<T extends Table | View | Subquery>(row: T): SQL<InferData<T>>;
/**
 * Build objects using `json_build_object(k1, v1, ...kn, vn). Since it is a json method, it should
 * return an object with unwrapped value types instead of SQL wrapped types.
 */
declare function jsonBuildObject<T extends ColumnsSelection>(shape: T): SQL<{ [K in keyof T]: T[K] extends SQLWrapper ? InferData<T[K]> : T[K]; }>;
/**
 * Build objects using `jsonb_build_object(k1, v1, ...kn, vn). Since it is a jsonb method, it should
 * return an object with unwrapped value types instead of SQL wrapped types.
 */
declare function jsonbBuildObject<T extends ColumnsSelection>(shape: T): SQL<{ [K in keyof T]: T[K] extends SQLWrapper ? InferData<T[K]> : T[K]; }>;
/**
 * Aggregate sql values into an array of json objects using a combination of `json_agg` and
 * `jsonb_build_object`. Jsonb object building is used in lieu of json to allow use of distinct.
 */
declare function jsonAggBuildObject<T extends ColumnsSelection>(shape: T, { distinct, }?: {
    distinct?: boolean;
}): SQL<{ [K in keyof T]: T[K] extends SQLWrapper ? InferData<T[K]> : T[K]; }[]>;
/**
 * Aggregates name/value pairs as a JSON object; values can be null, but not names.
 *
 * Build object using `json_object_agg`. Since it is a json method, it should return an unwrapped
 * type instead of an SQL wrapped type.
 *
 * @example
 *
 * ```sql
 * json_object_agg(...)
 * ```
 *
 * @see https://www.postgresql.org/docs/9.5/functions-aggregate.html
 */
declare function jsonObjectAgg<K extends AnyColumn, V extends SQL | SQL.Aliased | AnyTable<TableConfig>, TK extends string | number = null extends InferData<K> ? never : InferData<K> extends string | number ? InferData<K> : never, TV = V extends AnyTable<TableConfig> ? InferSelectModel<V> : V extends SQL ? InferData<V> : never>(name: K, value: V): SQL<Record<TK, TV>>;
/**
 * Aggregates name/value pairs as a JSON object; values can be null, but not names.
 *
 * @example
 *
 * ```sql
 * jsonb_object_agg(...)
 * ```
 *
 * @see https://www.postgresql.org/docs/9.5/functions-aggregate.html
 */
declare function jsonbObjectAgg<K extends AnyColumn, V extends SQL | SQL.Aliased | AnyTable<TableConfig>, TK extends string | number = null extends InferData<K> ? never : InferData<K> extends string | number ? InferData<K> : never, TV = V extends AnyTable<TableConfig> ? InferSelectModel<V> : V extends SQL ? InferData<V> : never>(name: K, value: V): SQL<Record<TK, TV>>;
/**
 * Aggregates values, including nulls, as a JSON array.
 *
 * @see https://www.postgresql.org/docs/9.5/functions-aggregate.html
 */
declare function jsonAgg<T extends SQLWrapper, N extends boolean = true>(selection: T, { notNull }?: {
    notNull?: N;
}): SQL<N extends true ? NonNullable<InferData<T>>[] : InferData<T>[] | [null]>;
/**
 * Get the database's currently set regconfig for text-search functionalities.
 *
 * ```sql
 * get_current_ts_config();
 * ```
 */
declare function getCurrentTsConfig(): SQL<RegconfigString>;
/**
 * @param regconfig Laguage configuration to use when converting source text to text search vector.
 * @param text Source text to convert into a text search vector.
 *
 *   ```sql
 *   to_tsvector();
 *   --or;
 *   plainto_tsvector();
 *   ```
 */
declare function toTsvector(text: unknown, { regconfig }?: {
    regconfig?: RegconfigString | SQLWrapper;
}): SQL<string>;
/**
 * @param regconfig Language config for the text search query.
 * @param text Source text to convert into a text search query.
 * @param config.plain Specifies if the source text should be compared as a plain (case insensitive)
 *   query.
 *
 *   ```sql
 *   to_tsvector();
 *   ```
 */
declare function toTsquery(text: unknown, { plain, regconfig, }?: {
    plain?: boolean;
    regconfig?: SQLWrapper | RegconfigString;
}): SQL<string>;
/**
 * The function setweight can be used to label the entries of a tsvector with a given weight, where
 * a weight is one of the letters A, B, C, or D. This is typically used to mark entries coming from
 * different parts of a document, such as title versus body. Later, this information can be used for
 * ranking of search results.
 *
 * Because to_tsvector(NULL) will return NULL, it is recommended to use coalesce whenever a field
 * might be null.
 */
declare function setweight(tsvector: SQLWrapper, weight: string | number): SQL<string>;
/**
 * Subtract arguments, producing a “symbolic” result that uses years and months, rather than just
 * days.
 *
 * @example
 *
 * ```sql
 * -- age ( timestamp, timestamp ) → interval
 * age(timestamp '2001-04-10', timestamp '1957-06-13') → 43 years 9 mons 27 days
 * ```
 */
declare function age<TOrigin extends SQLWrapper | Date, TTarget extends SQLWrapper | Date>(origin: TOrigin, target: TTarget): SQL<string>;
declare function isEmpty<T extends SQLWrapper | unknown>(range: T): SQL<boolean>;

/**
 * Test a text search query against a ts_vector value.
 */
declare function ts(vector: SQLWrapper, querytext: SQLWrapper): drizzle_orm.SQL<unknown>;

type RangeValue<T = void> = {
    upper: T | null;
    lower: T | null;
};
/**
 * Get excluded column values in conflict cases. Useful for onConflictDoUpdate's set.
 *
 * @param columns Record of columns to get from the conflict's `excluded` table.
 */
declare function toExcluded<T extends Record<string, AnyColumn>>(columns: T): { [K in keyof T]: SQL<InferData<T[K]>>; };
/**
 * Tsvector type for generated columns used notably for fuzzy string search.
 *
 * @param config.sources Array of source columns to generate the ts vector from.
 * @param config.langauge Regconfig column or sql value (conditional values, or other) to use for
 *   the vector, used for stemming. (regconfig cfgname).
 * @param config.weighted If true, concatenated sources will be weighted by their order.
 * @see https://github.com/drizzle-team/drizzle-orm/issues/247
 * @todo Implementation isn't clean. Figure out a better way to map the language name and column
 *   references, or stay up to date on support for `generatedAs()`.
 */
declare const generatedTsvector: {
    <TConfig extends Record<string, any> & {
        sources: string[];
        language: string | SQLWrapper;
        weighted?: boolean;
    }>(fieldConfig: TConfig): drizzle_orm_pg_core.PgCustomColumnBuilder<{
        name: "";
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: string;
        driverParam: unknown;
        enumValues: undefined;
    }>;
    <TName extends string>(dbName: TName, fieldConfig: {
        sources: string[];
        language: string | SQLWrapper;
        weighted?: boolean;
    }): drizzle_orm_pg_core.PgCustomColumnBuilder<{
        name: TName;
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: string;
        driverParam: unknown;
        enumValues: undefined;
    }>;
};
/**
 * Create an interval value by passing a value deconstructed into time units.
 */
declare function toInterval<T extends Partial<Record<IntervalUnit, number>>>(value: T): SQL<string>;
/**
 * Using canonical form of included lower bound and excluded upper bound. See
 * https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-DISCRETE.
 */
declare function toRange<const T extends [number | undefined, number | undefined] | [Date | undefined, Date | undefined]>(tuple: T, { lowerBound, upperBound, }?: {
    lowerBound?: RangeBoundType;
    upperBound?: RangeBoundType;
}): SQL<T>;

declare function intrangeSchema({ min, max, }?: {
    min?: number;
    max?: number;
}): z.ZodObject<{
    lower: z.ZodNullable<z.ZodNumber>;
    upper: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
declare function numrangeSchema({ min, max, }?: {
    min?: number;
    max?: number;
}): z.ZodObject<{
    lower: z.ZodNullable<z.ZodNumber>;
    upper: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Because of typescript's peculiar handling of Infinity/-Infinity, ranges without limit need to
 * consider number members that indicate infinite bounds.
 */
declare function tsrangeSchema<TMode extends 'date' | 'string', TData = TMode extends 'string' ? string : Date | number>({ min, max, withTimezone, mode, }?: {
    min?: Date;
    max?: Date;
    withTimezone?: boolean;
    mode?: TMode;
}): z.ZodObject<{
    lower: z.ZodPipe<z.ZodNullable<z.ZodCoercedDate<unknown>>, z.ZodTransform<Awaited<TData>, Date | null>> | z.ZodPipe<z.ZodNullable<z.ZodUnion<[z.ZodCoercedDate<unknown>, z.ZodCoercedNumber<unknown>]>>, z.ZodTransform<Awaited<TData>, number | Date | null>>;
    upper: z.ZodPipe<z.ZodNullable<z.ZodCoercedDate<unknown>>, z.ZodTransform<Awaited<TData>, Date | null>> | z.ZodPipe<z.ZodNullable<z.ZodUnion<[z.ZodCoercedDate<unknown>, z.ZodCoercedNumber<unknown>]>>, z.ZodTransform<Awaited<TData>, number | Date | null>>;
}, z.core.$strip>;
declare function daterangeSchema<TMode extends 'string' | 'date', TData = TMode extends 'string' ? string : Date | number>({ min, max, mode, }?: {
    min?: Date;
    max?: Date;
    mode?: TMode;
}): z.ZodObject<{
    lower: z.ZodPipe<z.ZodNullable<z.ZodCoercedDate<unknown>>, z.ZodTransform<Awaited<TData>, Date | null>> | z.ZodPipe<z.ZodNullable<z.ZodUnion<[z.ZodCoercedDate<unknown>, z.ZodCoercedNumber<unknown>]>>, z.ZodTransform<Awaited<TData>, number | Date | null>>;
    upper: z.ZodPipe<z.ZodNullable<z.ZodCoercedDate<unknown>>, z.ZodTransform<Awaited<TData>, Date | null>> | z.ZodPipe<z.ZodNullable<z.ZodUnion<[z.ZodCoercedDate<unknown>, z.ZodCoercedNumber<unknown>]>>, z.ZodTransform<Awaited<TData>, number | Date | null>>;
}, z.core.$strip>;

/**
 * Empty record as SQL json.
 */
declare const $emptyJsonObject: drizzle_orm.SQL<object>;
/**
 * Empty array as SQL json.
 */
declare const $emptyJsonArray: drizzle_orm.SQL<[never]>;
/**
 * Empty SQL array (not json typed)
 */
declare const $emptyArray: drizzle_orm.SQL<[]>;
/**
 * An array with a single null member. Typically returned when aggregation result is empty.
 */
declare const $nullArray: drizzle_orm.SQL<[null]>;
/**
 * Postgres value returned for empty ranges.
 */
declare const $empty: drizzle_orm.SQL<[] | "'empty'">;

export { $empty, $emptyArray, $emptyJsonArray, $emptyJsonObject, $nullArray, INTERVAL_UNITS, INTERVAL_UNITS_ARR_ORDERED, type IntervalUnit, RANGE_BOUND_TYPES, RANGE_EMPTY, REGCONFIGS, type RangeBoundType, type RangeValue, type Regconfig, type RegconfigString, age, arrayAgg, boolAnd, boolOr, citext, contained, contains, cube, cubeDim, cubeDistance, cubeEnlarge, cubeInter, cubeIsPoint, cubeLowerLeftCoord, cubeSubset, cubeUnion, cubeUpperRightCoord, daitch_mokotoff, daterange, daterangeSchema, difference, distance, extract, generatedTsvector, geography, geometry, getCurrentTsConfig, intrange, intrangeSchema, isEmpty, jsonAgg, jsonAggBuildObject, jsonBuildObject, jsonObjectAgg, jsonStripNulls, jsonbBuildObject, jsonbObjectAgg, makeCube, nanoid, now, numrange, numrangeSchema, overlaps, random, regconfig, rowToJson, setweight, similar, soundex, textenum, toExcluded, toInterval, toJson, toJsonb, toRange, toTsquery, toTsvector, ts, tsrange, tsrangeSchema, tsvector };
