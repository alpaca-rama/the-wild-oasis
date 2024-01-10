import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {updateCurrenUser} from "../../services/apiAuth.js";

export function useUpdateUser() {
    const queryClient = useQueryClient()

    const { mutate: updateUser, isLoading: isUpdating } = useMutation({
        mutationFn: updateCurrenUser,
        onSuccess: (

        ) => {
            toast.success('User account successfully updated.')
            queryClient.invalidateQueries({queryKey: ['user']})
        },
        onError: (err) => toast.error(`❌ ${err.message}`)
    })

    return { isUpdating, updateUser }
}