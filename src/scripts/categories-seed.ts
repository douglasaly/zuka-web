import './load-env'
import { uuidv7 } from 'uuidv7'
import { marketplaceCategories } from '../data/categories'
import { createSupabaseAdmin } from '../lib/supabase/admin'

const duplicateSlugs = [
	'beleza-e-cuidados-pessoais',
	'esportes-e-lazer',
	'livros-e-educacao',
	'automoveis-e-motos',
	'saude-e-bem-estar',
	'tecnologia-e-acessorios',
]

async function removeDuplicateCategories(supabase: ReturnType<typeof createSupabaseAdmin>) {
	for (const slug of duplicateSlugs) {
		const { data: category } = await supabase
			.from('categories')
			.select('id')
			.eq('slug', slug)
			.maybeSingle()

		if (!category) continue

		const { count } = await supabase
			.from('products')
			.select('*', { count: 'exact', head: true })
			.eq('category_id', category.id as string)

		if ((count ?? 0) === 0) {
			await supabase.from('categories').delete().eq('id', category.id as string)
			console.log(`🧹 Removed duplicate category: ${slug}`)
		}
	}
}

async function seed() {
	try {
		console.log('🔗 Seeding categories...')

		const supabase = createSupabaseAdmin()

		await removeDuplicateCategories(supabase)

		const { data: existing, error: selectError } = await supabase
			.from('categories')
			.select('slug')

		if (selectError) throw selectError

		const existingSlugs = new Set((existing ?? []).map((row) => String(row.slug)))
		const toInsert = marketplaceCategories
			.filter((category) => !existingSlugs.has(category.slug))
			.map((category) => ({
				id: uuidv7(),
				...category,
			}))

		if (toInsert.length === 0) {
			console.log(`✔️ All ${marketplaceCategories.length} categories already exist`)
			process.exit(0)
		}

		const { error } = await supabase.from('categories').insert(toInsert)
		if (error) throw error

		console.log(`✔️ Created ${toInsert.length} categories`)
		console.log(`✔️ Total: ${existingSlugs.size + toInsert.length} categories`)
		process.exit(0)
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

seed()
