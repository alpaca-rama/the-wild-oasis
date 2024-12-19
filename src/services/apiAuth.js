import supabase, { supabaseUrl } from "./supabase.js";

export async function signup({ fullName, email, password }) {
    const { data, error } = await supabase.auth.signUp({
        email, password, options: {
            data: {
                fullName,
                avatar: ''
            }
        }
    })

    if (error) throw new Error(error.message)

    return data
}

export async function login({ email, password }) {
    const { data, error } = await supabase.auth
        .signInWithPassword({
            email,
            password
        })

    if (error) throw new Error((error.message))

    return data
}

export async function getCurrentUser() {
    const { data: session } = await supabase.auth.getSession()

    if (!session.session) return null

    const { data, error } = await supabase.auth.getUser()

    // console.log(data)

    if (error) throw new Error(`↓ ${error.message}`)

    return data?.user
}


export async function logout() {
    const { error } = await supabase.auth.signOut()

    if (error) throw new Error(error.message)
}

export async function updateCurrenUser({ fullName, password, avatar }) {
    // 1. Update password OR fullName
    let updateData
    if (password) updateData = { password }
    if (fullName) updateData = { data: { fullName } }

    const { data, error } = await supabase.auth.updateUser(updateData)

    if (error) throw new Error(`👍🏼 ${error.message}`)
    if (!avatar) return data

    // 2. Upload the avatar image
    const fileName = `avatar-${data.user.id}-${Math.random()}`

    const { error: storageError } = await supabase.storage
        .from('two_avatars')
        .upload(fileName, avatar)

    if (storageError) throw new Error(`👈🏼 ${storageError.message}`)

    // 3. Update avatar in the user
    const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
        data: {
            avatar: `${supabaseUrl}/storage/v1/object/public/two_avatars/${fileName}`
        }
    })

    if (error2) throw new Error(`👉🏼 ${error2.message}`)

    return updatedUser
}
