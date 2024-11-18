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

export async function createCabin(newCabin) {
  // Ensure all SMALLINT fields have valid values or defaults
  const sanitizedCabin = {
    ...newCabin,
    maxCapacity: newCabin.maxCapacity || null, // Replace with a default or null if empty
  };

  const { data, error } = await supabase
    .from("Cabins")
    .insert([sanitizedCabin])
    .select();

  if (error) {
    console.error("Error creating cabin:", error.message);
    throw new Error(`Unable to create cabin: ${error.message}`);
  }

  return data;
}
