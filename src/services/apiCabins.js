import supabase, {supabaseUrl} from "./supabase.js";

export async function getCabins() {
    const { data, error } = await supabase
        .from('cabins')
        .select('*')
        .order('id')

    if (error)
    {
        console.error(`💥${error}`)
        throw new Error('Cabins could not be loaded')
    }

    return data
}

export async function createEditCabin(newCabin, id) {
    const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl)
    // https://tggfizhfityveerhdtmu.supabase.co/storage/v1/object/public/cabin_images/cabin-001.jpg
    const imageName = `${Math.random()}-${newCabin.image.name}`
        .replaceAll("/", "");
    const imagePath = hasImagePath ?
        newCabin.image :
        `${supabaseUrl}/storage/v1/object/public/cabin_images/${imageName}`

    // 1. Create/Edit cabin
    let query = supabase.from('cabins')

    // A) Create
    if (!id)
        query = query
            .insert([{ ...newCabin, image: imagePath }])

    // B) Edit
    if (id)
        query = query
            .update({ ...newCabin, image: imagePath })
            .eq('id', id)
            .select()

    const { data, error } = await query.select().single()

    if (error)
    {
        console.error(`👉🏼${error}`)
        throw new Error('Cabin could not be created.')
    }

    // 2. Upload image
    if (hasImagePath) return data

    const { error: storageError } = await supabase.storage
        .from('cabin_images')
        .upload(imageName, newCabin.image)

    // 3. Delete the cabin if there was an error uploading the image.
    if (error) {
        await supabase.from('cabins')
            .delete()
            .eq('id', data.id)
        console.error(`⭐️${storageError}`)
        throw new Error('Cabin image could not be uploaded and the cabin was not created.')
    }
}

export async function deleteCabin(id) {
    const {data, error } = await supabase
        .from('cabins')
        .delete()
        .eq('id', id)

    if (error)
    {
        console.error(error)
        throw new Error('Cabin could not be deleted.')
    }

    return data
}