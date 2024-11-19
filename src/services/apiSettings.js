// import { supabase } from "./supabase";

// // Fetch settings from the table
// export async function getSettings() {
//   try {
//     const { data, error } = await supabase.from("Settings").select("*");

//     if (error) {
//       console.error("Error fetching settings:", error);
//       throw new Error("Settings could not be loaded");
//     }

//     if (!data || data.length === 0) {
//       throw new Error("No settings found");
//     }

//     // Return all settings
//     return data;
//   } catch (err) {
//     console.error(err.message);
//     throw err;
//   }
// }

// // Update a specific setting
// // Expecting newSetting to be like: { key: "someKey", value: "someValue" }
// export async function updateSetting(newSetting) {
//   const { data, error } = await supabase
//     .from("Settings")
//     .update(newSetting)
//     .eq("id", 1) // Assuming only one row exists with id=1
//     .single();

//   if (error) {
//     console.error("Error updating settings:", error);
//     throw new Error(error.message || "Settings could not be updated");
//   }

//   return data;
// }
import { supabase } from "./supabase";

export async function getSettings() {
  const { data, error } = await supabase.from("Settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }
  return data;
}

// We expect a newSetting object that looks like {setting: newValue}
export async function updateSetting(newSetting) {
  const { data, error } = await supabase
    .from("Settings")
    .update(newSetting)
    // There is only ONE row of settings, and it has the ID=1, and so this is the updated one
    .eq("id", 1)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }
  return data;
}
