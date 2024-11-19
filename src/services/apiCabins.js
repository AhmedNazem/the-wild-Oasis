import { supabase, supabaseUrl } from "./supabase";

/**
 * Fetches all cabins from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of cabin data.
 * @throws {Error} If the cabins cannot be loaded.
 */
export async function getCabins() {
  try {
    const { data, error } = await supabase.from("Cabins").select("*");

    if (error) {
      console.error("Error fetching cabins:", error.message);
      throw new Error("Cabins could not be loaded");
    }

    return data;
  } catch (error) {
    console.error("Unhandled error in getCabins:", error.message);
    throw error;
  }
}

/**
 * Deletes a cabin from the database by its ID.
 * @param {number|string} id - The ID of the cabin to delete.
 * @returns {Promise<Object>} A success message object if deletion is successful.
 * @throws {Error} If the deletion fails.
 */
export async function deleteCabin(id) {
  try {
    const { error } = await supabase.from("Cabins").delete().eq("id", id);

    if (error) {
      console.error("Error deleting cabin:", error.message);
      throw new Error(`Unable to delete cabin: ${error.message}`);
    }

    return { success: true, message: "Cabin deleted successfully" };
  } catch (error) {
    console.error("Unhandled error in deleteCabin:", error.message);
    throw error;
  }
}

/**
 * Creates or updates a cabin in the database.
 * @param {Object} newCabin - The cabin data to create or update.
 * @param {File} newCabin.image - The image file for the cabin.
 * @param {number|string} [id] - The ID of the cabin to update (if editing).
 * @returns {Promise<Object>} The created or updated cabin data.
 * @throws {Error} If the creation or update fails.
 */
export async function createEditCabin(newCabin, id) {
  // Check if image exists and starts with supabaseUrl, else handle it as undefined
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  let imagePath = newCabin.image; // Default to the provided image

  if (newCabin.image && !hasImagePath) {
    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
      "/",
      ""
    );
    imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

    try {
      // Step 1: Upload the image to Supabase storage if image is provided
      const { error: uploadError } = await supabase.storage
        .from("cabin-images")
        .upload(imageName, newCabin.image);

      if (uploadError) {
        console.error("Error uploading image:", uploadError.message);
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError.message);
      throw uploadError;
    }
  }

  try {
    // Step 2: Prepare cabin data
    const sanitizedCabin = {
      ...newCabin,
      image: imagePath,
      maxCapacity: newCabin.maxCapacity || null,
    };

    // Step 3: Insert or update the cabin in the database
    const query = id
      ? supabase.from("Cabins").update(sanitizedCabin).eq("id", id)
      : supabase.from("Cabins").insert([sanitizedCabin]);

    const { data, error: dbError } = await query.select().single();

    if (dbError) {
      console.error("Error inserting/updating cabin:", dbError.message);

      // Cleanup uploaded image if insertion/update fails
      if (newCabin.image && !hasImagePath) {
        await supabase.storage.from("cabin-images").remove([imagePath]);
      }

      throw new Error(`Cabin creation failed: ${dbError.message}`);
    }

    return data;
  } catch (error) {
    console.error("Unhandled error in createEditCabin:", error.message);
    throw error;
  }
}
