import { knex } from "knex";
import knexConfig from "../../../knexfile";

export const knexCon = knex(knexConfig);
