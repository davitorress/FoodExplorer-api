import { knex } from "knex";
import knexConfig from "../../../knexfile";

export const connection = knex(knexConfig.development);
