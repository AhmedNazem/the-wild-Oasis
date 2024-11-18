import { supabase } from "./supabase";

export async function getCabins() {
  let { data, error } = await supabase.from("Cabins").select("*");
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
  return data;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("Cabins").delete().eq("id", id);

  if (error) {
    console.error("Error deleting cabin:", error.message);
    throw new Error(`Unable to delete cabin: ${error.message}`);
  }

  return { success: true, message: "Cabin deleted successfully" };
}
