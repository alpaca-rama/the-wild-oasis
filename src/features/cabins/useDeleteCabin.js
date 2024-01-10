import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {deleteCabin as deleteCabinApi} from "../../services/apiCabins.js";

export function useDeleteCabin() {
    const queryClient = useQueryClient()

    const { isLoading: isDeleting, mutate: deleteCabin } = useMutation({
        mutationFn: (id) => deleteCabinApi(id), // mutationFn: deleteCabin
        onSuccess: () => {
            toast.success(`Cabin ${name} successfully deleted`)
            queryClient.invalidateQueries(['cabins'])
        },
        onError: err => toast.error(err.message)
    })

    return { isDeleting, deleteCabin }
}