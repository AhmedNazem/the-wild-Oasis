import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useEditCabin() {
  const queryClient = useQueryClient(); // Use the hook to get the query client instance
  const { mutate: editCabin, isLoading: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin successfully edited");
      // Invalidate the query to trigger a refetch of the cabins data
      queryClient.invalidateQueries(["cabins"]);
    },
    onError: (err) => toast.error(err.message),
  });
  return { isEditing, editCabin };
}
