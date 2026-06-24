import './load-env'
import { uuidv7 } from 'uuidv7'
import { createSupabaseAdmin } from '../lib/supabase/admin'

export const mozambiqueProvinces = [
	{ name: 'Maputo Cidade', slug: 'maputo-cidade' },
	{ name: 'Maputo Província', slug: 'maputo-provincia' },
	{ name: 'Gaza', slug: 'gaza' },
	{ name: 'Inhambane', slug: 'inhambane' },
	{ name: 'Sofala', slug: 'sofala' },
	{ name: 'Manica', slug: 'manica' },
	{ name: 'Tete', slug: 'tete' },
	{ name: 'Zambézia', slug: 'zambezia' },
	{ name: 'Nampula', slug: 'nampula' },
	{ name: 'Cabo Delgado', slug: 'cabo-delgado' },
	{ name: 'Niassa', slug: 'niassa' },
]

async function provincesSeed() {
	try {
		console.log('🔗 Seeding provinces')

		const supabase = createSupabaseAdmin()
		const { error } = await supabase.from('provinces').insert(
			mozambiqueProvinces.map((province) => ({
				id: uuidv7(),
				...province,
			}))
		)

		if (error) throw error

		console.log('✔️ Province seeded successfully')
		process.exit(0)
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

provincesSeed()
