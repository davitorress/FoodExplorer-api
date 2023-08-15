import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
	const hasRecipes = await knex("recipes").select("name");
	if (hasRecipes.length <= 0) {
		await knex("recipes").insert([
			{
				name: "Salada Ravanello",
				category_id: 2,
				price: 25.0,
				description:
					"Rabanetes, folhas verdes e molho agridoce salpicados com gergelim. O pão naan dá um toque especial.",
				image: "ef043d115115fc65537f9cab9bfd0099-Mask group.png",
			},
			{
				name: "Suco de maracujá",
				category_id: 3,
				price: 13.97,
				description: "Suco de maracujá gelado, cremoso, docinho.",
				image: "28a140a6643f637f7e9069421174edd7-Mask group-8.png",
			},
			{
				name: "Café expresso",
				category_id: 3,
				price: 15.97,
				description: "Café cremoso feito na temperatura e pressões perfeitas.",
				image: "e2ba5b863c63111090995a3f5aa93825-Mask group-9.png",
			},
			{
				name: "Tè d'autunno",
				category_id: 3,
				price: 19.97,
				description: "Chá de anis, canela e limão. Sinta o outono italiano.",
				image: "8240f733fb99d18022527cc77a57d05c-Mask group-10.png",
			},
			{
				name: "Peachy pastrie",
				category_id: 2,
				price: 32.97,
				description: "Delicioso folheado de pêssego com folhas de hortelã.",
				image: "2e0df7bb5732bd119ca2d599dd734c14-Mask group-5.png",
			},
			{
				name: "Macarons",
				category_id: 2,
				price: 79.97,
				description: "Farinha de amêndoas, manteiga, claras e açúcar.",
				image: "9fe22b8f0257d8571da0219b86bafe1f-Mask group-6.png",
			},
			{
				name: "Prugna Pie",
				category_id: 1,
				price: 79.97,
				description: "Torta de ameixa com massa amanteigada, polvilho em açúcar.",
				image: "5caed852a8372db53baa7217b8bb9afb-Mask group-4.png",
			},
			{
				name: "Spaguetti Gambe",
				category_id: 1,
				price: 79.97,
				description: "Massa fresca com camarões e pesto.",
				image: "aeff1e917dda917ca6f1c9201eb72abe-Mask group-2.png",
			},
			{
				name: "Torradas de Parma",
				category_id: 1,
				price: 25.97,
				description: "Presunto de parma e rúcula em um pão com fermentação natural.",
				image: "f21c4c8edfdce5c9e2b63b7d13d01af8-Mask group-1.png",
			},
		]);
	}

	const hasIngredients = await knex("ingredients").select("name");
	if (hasIngredients.length <= 0) {
		await knex("ingredients").insert([
			{ name: "alface", recipe_id: 1 },
			{ name: "cebola", recipe_id: 1 },
			{ name: "pão naan", recipe_id: 1 },
			{ name: "pepino", recipe_id: 1 },
			{ name: "rabanete", recipe_id: 1 },
			{ name: "tomate", recipe_id: 1 },

			{ name: "maracujá", recipe_id: 2 },
			{ name: "leite", recipe_id: 2 },
			{ name: "açúcar", recipe_id: 2 },

			{ name: "café", recipe_id: 3 },
			{ name: "água", recipe_id: 3 },
			{ name: "canela", recipe_id: 3 },

			{ name: "anis", recipe_id: 4 },
			{ name: "canela", recipe_id: 4 },
			{ name: "limão", recipe_id: 4 },

			{ name: "pêssego", recipe_id: 5 },
			{ name: "hortelã", recipe_id: 5 },
			{ name: "massa folheada", recipe_id: 5 },

			{ name: "farinha de amêndoas", recipe_id: 6 },
			{ name: "manteiga", recipe_id: 6 },
			{ name: "clara", recipe_id: 6 },
			{ name: "açúcar", recipe_id: 6 },

			{ name: "ameixa", recipe_id: 7 },
			{ name: "manteiga", recipe_id: 7 },
			{ name: "açúcar", recipe_id: 7 },
			{ name: "polvilho", recipe_id: 7 },
			{ name: "farinha", recipe_id: 7 },

			{ name: "macarrão", recipe_id: 8 },
			{ name: "camarão", recipe_id: 8 },
			{ name: "pesto", recipe_id: 8 },

			{ name: "presunto", recipe_id: 9 },
			{ name: "rúcula", recipe_id: 9 },
			{ name: "pão", recipe_id: 9 },
			{ name: "parma", recipe_id: 9 },
		]);
	}
}
