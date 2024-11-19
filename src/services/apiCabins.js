import { supabase, supabaseUrl } from "./supabase";

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
  // Generate unique image name and path
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );
  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  try {
    // Step 1: Upload the image to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, newCabin.image);

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    // Step 2: Insert the sanitized cabin data
    const sanitizedCabin = {
      ...newCabin,
      image: imagePath,
      maxCapacity: newCabin.maxCapacity || null, // Ensure valid values
    };

    const { data, error: insertError } = await supabase
      .from("Cabins")
      .insert([sanitizedCabin])
      .select();

    if (insertError) {
      // Cleanup uploaded image if data insertion fails
      await supabase.storage.from("cabin-images").remove([imageName]);
      throw new Error(`Cabin creation failed: ${insertError.message}`);
    }

    // Step 3: Return the created data
    return data;
  } catch (error) {
    console.error("Error during cabin creation:", error.message);
    throw error; // Propagate error to handle it upstream
  }
}
